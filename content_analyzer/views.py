import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseForbidden
from django.utils.decorators import available_attrs
from django.utils.six import wraps
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated

from content_analyzer.gwt_request_builder import build_request
from content_analyzer.intext_counter import fill_keywords_count, InTextCounterService, count_words
from content_analyzer.models import SavedPage, ContentUnit, TargetKeyword, IgnoredKeyword
from content_analyzer.phrase_counter import PhraseCounterService, form_same_count_keywords
from content_analyzer.web_content_parser import WebPageParser
from content_analyzer.webmaster_api import WebmasterService


def backend_login_required(function=None):
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated:
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponseForbidden()

        return wraps(view_func, assigned=available_attrs(view_func))(_wrapped_view)
    if function is None:
        return decorator
    else:
        return decorator(function)


@backend_login_required
@require_http_methods(["GET"])
def retrieve_content(request):
    try:
        parser = WebPageParser(request.GET.get('parse'))
        data = parser.parse_web_page_text()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse([text.__dict__ for text in data], safe=False)


@backend_login_required
@require_http_methods(["POST"])
def retrieve_gwt(request):
    body = json.loads(request.body.decode(request.POST.encoding))
    root_url, gwt_request = build_request(body)
    related_page_id = body['relatedPageId']
    webmaster_api = WebmasterService()
    try:
        res = webmaster_api.execute_request(root_url, gwt_request)
        keywords = map_keywords(res.get('rows', []))
        fill_keywords_count(keywords, body['content'])
        if related_page_id:
            mark_keywords(keywords, related_page_id)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse(keywords, safe=False)


def mark_keywords(keywords, page_id):
    page = SavedPage.objects.get(pk=page_id)
    ignored_keywords = set()
    target_keywords = set()
    for ignored_keyword in IgnoredKeyword.objects.filter(related_page=page):
        ignored_keywords.add(ignored_keyword.keyword)
    for target_keyword in TargetKeyword.objects.filter(related_page=page):
        target_keywords.add(target_keyword.keyword)

    for keyword in keywords:
        if keyword.get('keyword') in target_keywords:
            keyword['isTarget'] = True
        elif keyword.get('keyword') in ignored_keywords:
            keyword['isIgnored'] = True


@backend_login_required
@require_http_methods(["POST"])
def retrieve_phrases_analysis(request):
    result = {
        'wordsCount': 0,
        'analyzedResult': []
    }
    try:
        body = json.loads(request.body.decode(request.POST.encoding))
        content = body['content']
        divide_count = body['divideCount']
        keywords = body['keywords']

        words_count = count_words(content)

        in_text_counter_service = InTextCounterService()
        in_text_counter_service.add_documents(content)
        in_text_counter_service.open_searcher()

        phrase_counter_service = PhraseCounterService()
        phrase_counter_service.add_documents(keywords)
        phrase_counter_service.open_searcher()

        for divider in range(0, divide_count):
            internal_result = []
            divided_keywords = form_same_count_keywords(keywords, divider + 1)
            for keyword in divided_keywords:
                in_text_count = in_text_counter_service.process_keyword(keyword)[1]
                in_target_count = phrase_counter_service.keyword_count(keyword)
                internal_result.append({
                    'keyword': keyword,
                    'inTextCount': in_text_count,
                    'inTargetCount': in_target_count,
                    'percent': (in_text_count / words_count) * 100
                })

            result['analyzedResult'].append(internal_result)

        result['wordsCount'] = words_count
        in_text_counter_service.close_searcher()
        phrase_counter_service.close_searcher()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse(result, safe=False)


def map_keywords(rows):
    result = []
    for keyword in rows:
        result.append({
            'keyword': keyword['keys'][0],
            'position': keyword['position'],
            'impressions': keyword['impressions'],
            'clicks': keyword['clicks'],
            'inText': 0,
            'where': '',
            'isTarget': False,
            'isIgnored': False
        })
    return result


@backend_login_required
@require_http_methods(["POST"])
def save_url(request):
    body = json.loads(request.body.decode(request.POST.encoding))
    url = body['url']
    content = body.get('content')
    target_keywords = body.get('target')
    ignored_keywords = body.get('ignored')
    overwrite_page_id = body.get('pageIdToOverwrite')
    try:
        if overwrite_page_id:
            SavedPage.objects.get(pk=overwrite_page_id).delete()

        page = SavedPage(url=url)
        page.save()
        if content:
            for content_unit in content:
                content_to_save = ContentUnit(tag=content_unit['tag'], text=content_unit['text'], related_page=page)
                content_to_save.save()
        if ignored_keywords:
            for ignored_unit in ignored_keywords:
                ignored_to_save = IgnoredKeyword(keyword=ignored_unit['keyword'], related_page=page)
                ignored_to_save.save()
        if target_keywords:
            for target_unit in target_keywords:
                target_to_save = TargetKeyword(keyword=target_unit['keyword'], related_page=page)
                target_to_save.save()
    except Exception as e:
        return JsonResponse({'message': '%s: %s' % ('Could not save page', str(e))}, status=500)
    return HttpResponse('')


@backend_login_required
@require_http_methods(["GET"])
def retrieve_saved_urls(request):
    saved_urls = []
    try:
        for saved_url in SavedPage.objects.values():
            saved_urls.append({
                'id': saved_url.get('id'),
                'url': saved_url.get('url')
            })
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse(saved_urls, safe=False)


@backend_login_required
@require_http_methods(["GET"])
def retrieve_content_by_page(request):
    page_id = request.GET.get('id')
    result = []
    try:
        page = SavedPage.objects.get(pk=page_id)
        for content_unit in ContentUnit.objects.filter(related_page=page):
            result.append({
                'tag': content_unit.tag,
                'text': content_unit.text
            })

    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse(result, safe=False)


@backend_login_required
@require_http_methods(["GET"])
def retrieve_keywords_by_page(request):
    page_id = request.GET.get('id')
    result = {}
    try:
        page = SavedPage.objects.get(pk=page_id)
        ignored_keywords = []
        for ignored_keyword in IgnoredKeyword.objects.filter(related_page=page):
            ignored_keywords.append(ignored_keyword.keyword)
        target_keywords = []
        for target_keyword in TargetKeyword.objects.filter(related_page=page):
            target_keywords.append(target_keyword.keyword)
        result['ignored'] = ignored_keywords
        result['target'] = target_keywords
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse(result, safe=False)


@backend_login_required
@require_http_methods(["DELETE"])
def delete_saved_page(request):
    page_id = request.GET.get('id')
    try:
        SavedPage.objects.get(pk=page_id).delete()
    except Exception as e:
        return JsonResponse({'message': '%s: %s' % ('Could not delete saved page', str(e))}, status=500)
    return HttpResponse('')

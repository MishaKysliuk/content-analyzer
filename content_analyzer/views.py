import json

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from content_analyzer.gwt_request_builder import build_request
from content_analyzer.intext_counter import fill_keywords_count, InTextCounterService, count_words
from content_analyzer.models import SavedPage, ContentUnit, TargetKeyword, IgnoredKeyword
from content_analyzer.phrase_counter import PhraseCounterService, form_same_count_keywords
from content_analyzer.web_content_parser import WebPageParser
from content_analyzer.webmaster_api import WebmasterService


def index(request):
    return render(request, 'index.html')


def retrieve_content(request):
    try:
        parser = WebPageParser(request.GET.get('parse'))
        data = parser.parse_web_page_text()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse([text.__dict__ for text in data], safe=False)


def retrieve_gwt(request):
    body = json.loads(request.body.decode(request.POST.encoding))
    root_url, gwt_request = build_request(body)
    webmaster_api = WebmasterService()
    try:
        res = webmaster_api.execute_request(root_url, gwt_request)
        keywords = map_keywords(res.get('rows', []))
        fill_keywords_count(keywords, body['content'])
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse(keywords, safe=False)

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

def save_url(request):
    body = json.loads(request.body.decode(request.POST.encoding))
    url = body['url']
    content = body.get('content')
    target_keywords = body.get('target')
    ignored_keywords = body.get('ignored')
    try:
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
        return JsonResponse({'message': str(e)}, status=500)
    return HttpResponse('')


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
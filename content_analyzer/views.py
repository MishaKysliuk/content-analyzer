import json

from django.shortcuts import render
from django.http import JsonResponse

from content_analyzer.gwt_request_builder import build_request
from content_analyzer.intext_counter import fill_keywords_count
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
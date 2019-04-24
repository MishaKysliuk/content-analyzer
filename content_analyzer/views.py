import json

from django.shortcuts import render
from django.http import JsonResponse

from content_analyzer.web_content_parser import WebPageParser
from content_analyzer.webmaster_api import WebmasterService


def index(request):
    return render(request, 'index.html')


def retrieve_content(request):
    # parser = WebPageParser('https://www.barkymate.com/')
    try:
        parser = WebPageParser(request.GET.get('parse'))
        data = parser.parse_web_page_text()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse([text.__dict__ for text in data], safe=False)


def retrieve_gwt(request):
    body = json.loads(request.body.decode('utf-8'))
    gwtRequest = dict()
    gwtRequest['startDate'] = body['dateFrom']
    gwtRequest['endDate'] = body['dateTo']
    gwtRequest['dimensions'] = ['query']
    gwtRequest['dimensionFilterGroups'] = []
    gwtRequest['dimensionFilterGroups'].append({
        "groupType": "and",
        "filters": [
            {
                "dimension": 'page',
                "operator": 'equals',
                "expression": body['url']
            }
        ]
    })
    if body.get('country'):
        gwtRequest['dimensionFilterGroups'][0]['filters'].append({
            {
                "dimension": 'country',
                "operator": 'equals',
                "expression": body['country']
            }
        })
    if body.get('device'):
        gwtRequest['dimensionFilterGroups'][0]['filters'].push({
            {
                "dimension": 'device',
                "operator": 'equals',
                "expression": body['device']
            }
        })
    webmasterApi = WebmasterService()
    try:
        res = webmasterApi.execute_request(body['url'], gwtRequest)
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse([text.__dict__ for text in data], safe=False)


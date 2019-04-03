import json
from django.shortcuts import render
from django.http import JsonResponse

from content_analyzer.web_content_parser import WebPageParser


def index(request):
    return render(request, 'index.html')


def retrieve_content(request):
    # parser = WebPageParser('https://www.barkymate.com/')
    parser = WebPageParser(request.GET.get('parse'))
    data = parser.parse_web_page_text()
    return JsonResponse([text.__dict__ for text in data], safe=False)

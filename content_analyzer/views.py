from django.shortcuts import render
from desktop.lib.django_util import JsonResponse

from content_analyzer.web_content_parser import WebPageParser


def index(request):
    return render(request, 'index.html')

def retrieve_content(request):
    parser = WebPageParser('https://www.barkymate.com/')
    return JsonResponse(parser.parse_web_page_text())
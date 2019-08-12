import requests
import re
from bs4 import BeautifulSoup, Tag, NavigableString, Comment


class TextData:
    def __init__(self, text, tag):
        self.text = text
        self.tag = tag

    def __str__(self):
        return '<{0}>{1}</{0}>'.format(self.tag, self.text)


class WebPageParser:

    #Sites do not allow to retrieve html content without this header
    user_agent_header = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'}

    skipped_tags = ['script', 'style', 'noscript', 'iframe', 'ym-measure', 'nav', 'footer', 'img', 'table', 'button']
    skipped_classes = ['top-casino-cards', 'top-sites-wrap']

    def __init__(self, url):
        self.url = url
        self.result = []

    def parse_web_page_text(self):
        title, body = self.retrieve_title_and_body()
        self.result.append(TextData(title.get_text().strip(), title.name))
        for element in body.contents:
            self.parse_element_content(element)
        return self.result

    def parse_element_content(self, element):
        if isinstance(element, Tag) and element.name not in WebPageParser.skipped_tags and not self.contains_skipped_class(element):
            if self.tag_contains_text(element):
                self.result.append(TextData(element.get_text().strip(), element.name))
            else:
                for child_element in element.contents:
                    self.parse_element_content(child_element)

    def contains_skipped_class(self, element):
        if element.attrs.get('class'):
            for class_name in element.attrs.get('class'):
                if class_name in WebPageParser.skipped_classes:
                    return True
        return False

    def tag_contains_text(self, tag):
        for element in tag.contents:
            if type(element) is NavigableString and not re.match(r'^\s+$', element):
                return True
        return False

    def retrieve_title_and_body(self):
        soup = BeautifulSoup(self.retrieve_page_html(), 'html.parser')
        return soup.find('title'), soup.find('body')

    def retrieve_page_html(self):
        response = requests.get(self.url, headers = WebPageParser.user_agent_header)
        if response.status_code != 200:
            raise Exception('Could not retrieve "%s" page html. Status code is %s' % (self.url, response.status_code))
        return response.text

import os.path
import re

from whoosh.analysis import StandardAnalyzer
from whoosh.index import create_in, open_dir
from whoosh.fields import Schema, STORED, TEXT
from whoosh.qparser import QueryParser


class PhraseCounterService:

    def __init__(self):
        self.analyzer = StandardAnalyzer(expression=r'\w+', minsize=1, stoplist=[])
        self.schema = Schema(phrase=TEXT(analyzer=self.analyzer))
        self.index = self.create_index()
        self.parser = QueryParser('phrase', self.index.schema)
        self.searcher = None

    def open_searcher(self):
        self.searcher = self.index.searcher()

    def close_searcher(self):
        self.searcher.close()

    def create_index(self):
        if not os.path.exists("index"):
            os.mkdir("index")
        create_in("index", self.schema)
        return open_dir("index")

    def add_documents(self, documents):
        writer = self.index.writer()
        for document in documents:
            writer.add_document(phrase=document['keyword'])
        writer.commit()

    def keyword_count(self, keyword):
        query = self.parser.parse('"%s"' % keyword)
        results = self.searcher.search(query)
        return len(results)


def form_same_count_keywords(keywords, words_count):
  result = set()
  for keyword in keywords:
    result.update(divide_phrase(keyword.get('keyword', ''), words_count))
  return result

def divide_phrase(phrase, divide_count):
  result_list = []
  words_list = re.compile('\s+').split(phrase.strip())
  for index in range(0, len(words_list)):
    if (divide_count <= len(words_list) - index):
      included_phrase = words_list[index:index+divide_count]
      result_list.append(' '.join(included_phrase))
    else:
      return result_list

  return result_list

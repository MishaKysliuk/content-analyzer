import os.path

from whoosh.analysis import StandardAnalyzer
from whoosh.index import create_in, open_dir
from whoosh.fields import Schema, STORED, TEXT
from whoosh.qparser import QueryParser


# print([(t.text, t.stopped) for t in myanalyzer(u"casino game! Online ttt'www-ss..!. paypal \ casino's game", removestops=True)])


class InTextCounterService:

    def __init__(self):
        self.analyzer = StandardAnalyzer(expression=r'([.,!?;:]+|\w+((\-|\'|\.)?\w+)*)', minsize=1, stoplist=[])
        self.schema = Schema(tag=STORED, content=TEXT(analyzer=self.analyzer))
        self.index = self.create_index()
        self.parser = QueryParser('content', self.index.schema)
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
            writer.add_document(tag=document['tag'], content=document['text'])
        writer.commit()

    def process_keyword(self, keyword):
        query = self.parser.parse('"%s"' % keyword)
        results = self.searcher.search(query)

        inside_tags = []
        in_text_count = len(results)
        for result in results:
            inside_tags.append(result.get('tag'))

        return ', '.join(inside_tags), in_text_count


def fill_keywords_count(keywords, content):
    service = InTextCounterService()
    service.add_documents(content)
    service.open_searcher()

    for keyword in keywords:
        result = service.process_keyword(keyword['keyword'])
        keyword['where'] = result[0]
        keyword['inText'] = result[1]

    service.close_searcher()

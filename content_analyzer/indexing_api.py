import json

import httplib2
from googleapiclient.errors import HttpError
from googleapiclient.http import BatchHttpRequest, HttpRequest
from oauth2client.service_account import ServiceAccountCredentials


class IndexingService:

    SCOPES = ['https://www.googleapis.com/auth/indexing']
    KEY_FILE_LOCATION = 'api_key.json'
    ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
    ENDPOINT_BATCH = "https://indexing.googleapis.com/batch"

    def __init__(self):
        credentials = ServiceAccountCredentials.from_json_keyfile_name(IndexingService.KEY_FILE_LOCATION,
                                                                       scopes=IndexingService.SCOPES)
        self.http = credentials.authorize(httplib2.Http())

    def execute_request(self, links):
        responses = []

        def batch_callback(request_id, response, exception):
            if response:
                responses.append(response)
            elif exception:
                responses.append({
                    'url': links[int(request_id) - 1],
                    'status': exception.resp['status'],
                    'message': str(exception)
                })

        def generate_response(resp, content):
            try:
                response_content = json.loads(content.decode('utf-8'))
                result = {
                    'url': response_content['urlNotificationMetadata']['url'],
                    'status': resp['status'],
                    'message': 'OK'
                }
            except Exception as e:
                resp.reason = "Something went wrong while processing successful response. Original response %s."\
                              "Exception: %s " % (resp.reason, str(e))
                raise HttpError(resp.reason, content)
            return result

        batch = BatchHttpRequest(batch_uri=IndexingService.ENDPOINT_BATCH)
        for link in links:
            link_object = {
                'url': link,
                'type': 'URL_UPDATED'
            }
            batch.add(request=HttpRequest(self.http, generate_response, IndexingService.ENDPOINT, method='POST',
                                          body=json.dumps(link_object)), callback=batch_callback)

        batch.execute(http=self.http)
        return responses

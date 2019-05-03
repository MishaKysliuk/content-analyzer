from apiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials


class WebmasterService:

    scopes = ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/webmasters']
    key_file_location = 'api_key.json'

    def __init__(self):
        credentials = ServiceAccountCredentials.from_json_keyfile_name(WebmasterService.key_file_location, scopes=WebmasterService.scopes)
        self.webmasters_service = build('webmasters', 'v3', credentials=credentials)

    def execute_request(self, url, request):
        return self.webmasters_service.searchanalytics().query(siteUrl=url, body=request).execute()

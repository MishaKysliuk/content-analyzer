from apiclient.discovery import build
from oauth2client.service_account import ServiceAccountCredentials


class WebmasterService:

    SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/webmasters']
    KEY_FILE_LOCATION = 'api_key.json'

    def __init__(self):
        credentials = ServiceAccountCredentials.from_json_keyfile_name(WebmasterService.KEY_FILE_LOCATION, scopes=WebmasterService.SCOPES)
        self.webmasters_service = build('webmasters', 'v3', credentials=credentials)

    def execute_request(self, url, request):
        return self.webmasters_service.searchanalytics().query(siteUrl=url, body=request).execute()

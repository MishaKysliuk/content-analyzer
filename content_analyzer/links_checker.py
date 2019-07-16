import requests
from bs4 import BeautifulSoup
from google.oauth2.credentials import Credentials
from googleapiclient import discovery


class LinksChecker:

    USER_AGENT_HEADER = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'}

    def __init__(self, credentials_dict, sheet_id):
        credentials = Credentials(**credentials_dict)
        self.sheets_service = discovery.build('sheets', 'v4', credentials=credentials).spreadsheets()
        self.sheet_id = sheet_id

    def check_links(self):
        values = self.get_sheet_values()
        for i in range(len(values)):
            if len(values[i]) > 1 and values[i][0] and values[i][1]:
                try:
                    response = 'FOUND' if self.check_link_for_presence(values[i][0], values[i][1]) else 'NOT FOUND'
                except Exception as e:
                    response = 'ERROR: %s' % str(e)
                range_to_update = 'C%d' % (i + 1)
                body = {'values': [[response]]}
                self.sheets_service.values().update(
                    spreadsheetId=self.sheet_id, range=range_to_update,
                    valueInputOption='RAW', body=body).execute()

    def get_sheet_values(self):
        result = self.sheets_service.values().get(spreadsheetId=self.sheet_id,
                                                  range=self.get_first_sheet_title()).execute()
        return result.get('values', [])

    def get_first_sheet_title(self):
        sheet_metadata = self.sheets_service.get(spreadsheetId=self.sheet_id).execute()
        return sheet_metadata.get('sheets')[0].get('properties').get('title')

    def check_link_for_presence(self, source, link):
        response = requests.get(source, headers=LinksChecker.USER_AGENT_HEADER)
        if response.status_code != 200:
            raise Exception(
                'Could not retrieve "%s" page html. Status code is %s' % (source, response.status_code))
        soup = BeautifulSoup(response.text, 'html.parser')
        for a_tag in soup.find_all('a', href=True):
            if self.add_trailing_slash(a_tag['href']) == self.add_trailing_slash(link):
                return True
        return False

    def add_trailing_slash(self, link):
        if link and link[len(link) - 1] != '/':
            return link + '/'
        else:
            return link

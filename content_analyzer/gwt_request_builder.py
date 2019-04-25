from urllib.parse import urlparse


def build_request(body):
    url = body.get('url')
    gwt_request = {
        'startDate': body.get('dateFrom'),
        'endDate': body.get('dateTo'),
        'dimensions': ['query'],
        "dimensionFilterGroups": [
            {
                "groupType": "and",
                "filters": [
                    {
                        "dimension": 'page',
                        "operator": 'equals',
                        "expression": url
                    }
                ]
            }
        ]
    }
    if body.get('country'):
        gwt_request['dimensionFilterGroups'][0]['filters'].append(
            {
                "dimension": 'country',
                "operator": 'equals',
                "expression": body.get('country')
            }
        )
    if body.get('device'):
        gwt_request['dimensionFilterGroups'][0]['filters'].append(
            {
                "dimension": 'device',
                "operator": 'equals',
                "expression": body.get('device')
            }
        )

    return retrieve_root_url(url), gwt_request


def retrieve_root_url(url):
    parsed_url = urlparse(url)
    return '%s://%s/' % (parsed_url.scheme, parsed_url.hostname)
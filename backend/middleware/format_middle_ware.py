from django.utils.deprecation import MiddlewareMixin
import json

from utils import format_conversion


white_urls = [
    '/cbep/delivery/upload-excel-file/',
    '/wx/unifiedorde_pay_listen/'
]


class FormatMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path in white_urls:
            return None
        if request.method == "GET":
            try:
                request_data = format_conversion.underline_dict(json.loads(request.body.decode()))
                request.GET = request_data
            except:
                return None

        elif request.method == "POST" or request.method == "DELETE":
            if request.path!="/photo/":
                if request.body:
                    req_body = json.loads(request.body.decode('utf-8'))
                    request_data = format_conversion.underline_dict(req_body)
                    request._body = json.dumps(request_data).encode('utf-8')
            return None

    def process_response(self, request, response):
        if response.status_code == 200:
            try:
                target = response.data.get('data').get('results') if isinstance(response.  data.get('data'), dict) else response.data.get('data')
                response_data = format_conversion.camel_dict(target)
                if isinstance(response.data.get('data'), dict):
                    response.data['data']['results'] = response_data
                else:
                    response.data['data'] = response_data
                response._is_rendered = False
                response.render()
            except Exception as e:
                print(e)
        return response
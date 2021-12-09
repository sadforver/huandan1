from django.http import HttpRequest, HttpResponse
from django.conf import settings

from jwttoken import JwtToken


class TokenVerifyMiddleWare():
    """ this is token verification middleware

    1. if you want to exempt token verification, you could set the path in the settings.EXEMPT_TOKEN_VERIFY_PATH
    """
    _exempt_token_verify_path = settings.EXEMPT_TOKEN_VERIFY_PATH

    _request_params_map_items = [
        dict(request_method="GET", content_types=["text/plain", ''], request_params_key="GET", mutable_key="GET"),
        dict(request_method="POST",
             content_types=["text/plain", 'application/x-www-form-urlencoded', "multipart/form-data"],
             request_params_key="POST", mutable_key="POST"),
        dict(request_method="POST", content_types=["application/json"], request_params_key="body", mutable_key="_body")]

    def __init__(self, get_response: callable) -> None:
        self.get_response = get_response

    def _is_exempt_verify_path(self, request: HttpRequest) -> bool:
        "判断路径是否需要 token 验证"
        path_verify_result = False
        request_path = request.path
        if request_path in self._exempt_token_verify_path or request_path.startswith(self._exempt_file_download_path):
            path_verify_result = True
        return path_verify_result

    def __call__(self, request: HttpRequest) -> HttpResponse:
        token_verify_status = True
        if not self._is_exempt_verify_path(request):
            token_verify_status, payload_data = self._token_verify(request)
            self._attach_token_payload(request, payload_data)
        response = self.get_response(request) if token_verify_status else HttpResponse(
            MyTools.to_pretty_dict_str(payload_data))
        return response

    def _token_verify(self, request: HttpRequest) -> None:
        "进行 token 验证"
        token = request.META.get('HTTP_HWTOKEN')
        verify_status, payload_data = JwtToken.parse_token(token)
        return verify_status, payload_data

    def _attach_token_payload(self, request: HttpRequest, payload_data: dict) -> None:
        "将 token 解析出来的数据，添加进 request"
        request_key_info = self._get_request_params_map_infos(request)
        request_params_key = request_key_info["request_params_key"]
        mutable_key = request_key_info["mutable_key"]

        raw_request_params = getattr(request, request_params_key)
        is_bytes_format = isinstance(raw_request_params, bytes)

        request_params = raw_request_params.copy() if not is_bytes_format else json.loads(raw_request_params.decode())
        request_params["personInfo"] = payload_data
        uniform_request_params = request_params if not is_bytes_format else json.dumps(request_params,
                                                                                       ensure_ascii=False).encode()

        setattr(request, mutable_key, uniform_request_params)

    def _get_request_params_map_infos(self, request: HttpRequest) -> dict:
        "根据 request 映射到对应的 params item"
        request_method = request.method
        content_type = request.content_type
        ret = dict(request_params_key=request_method, mutable_key=request_method)

        for request_params_item in self._request_params_map_items:
            support_request_method = request_params_item["request_method"]
            support_content_types = request_params_item["content_types"]
            if support_request_method == request_method and content_type in support_content_types:
                ret = request_params_item
                break
        return ret
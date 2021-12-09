from django import conf
from django.db.models import signals
from django.core.exceptions import FieldDoesNotExist
from django.utils.deprecation import MiddlewareMixin
from jwt import decode
from rest_framework.views import APIView

from app.serializers import  MyTokenVerifySerializer
from backend import settings
from utils.functional import curry
from django.contrib.auth.models import User
class WhoDidMiddleware(MiddlewareMixin,APIView):
    def process_request(self, request):
        if request.method not in ('GET', 'HEAD', 'OPTIONS', 'TRACE'):

            try:
                token = request.environ['HTTP_AUTHORIZATION'][4:]
                info=decode(token, settings.SECRET_KEY, algorithms=["HS256"])

                user_id=info['user_id']
                user = User.objects.filter(id=user_id).first()

                request.user=user
                print(request.user)
            except:
                user = None
                print('usernone')

            mark_whodid = curry(self.mark_whodid, user)
            signals.pre_save.connect(mark_whodid, dispatch_uid=(self.__class__, request,), weak=False)

    def process_response(self, request, response):
        if request.method not in ('GET', 'HEAD', 'OPTIONS', 'TRACE'):
            signals.pre_save.disconnect(dispatch_uid=(self.__class__, request,))
        return response

    def mark_whodid(self, user, sender, instance, **kwargs):
        create_by_field, update_by_field = conf.settings.CREATE_BY_FIELD, conf.settings.UPDATE_BY_FIELD

        try:
            instance._meta.get_field(create_by_field)
        except FieldDoesNotExist:
            pass
        else:
            if not getattr(instance, create_by_field):
                setattr(instance, create_by_field, user)

        try:
            instance._meta.get_field(update_by_field)
        except FieldDoesNotExist:
            pass
        else:
            setattr(instance, update_by_field, user)

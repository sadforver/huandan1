from rest_framework import serializers
from jwt import decode
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CharField
from rest_framework.serializers import ModelSerializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenVerifySerializer

from app.models import Plan, User
import re

from backend import settings


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields='__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    '''
    token验证
    '''
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['username'] = self.user.username #这个是你的自定义返回的
        data['user_id'] = self.user.id #这个是你的自定义返回的

        return data




class MyTokenVerifySerializer(TokenVerifySerializer):
    """
    token验证
    """

    def validate(self, attrs):
        """
        attrs['token']: 是请求的token
        settings.SECRET_KEY: setting.py默认的key 除非在配置文件中修改了
        algorithms: 加密的方法
        """
        decoded_data = decode(attrs['token'], settings.SECRET_KEY, algorithms=["HS256"])
        return decoded_data
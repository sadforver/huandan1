from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.views import APIView
from requests import *
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView, TokenViewBase
import requests
from requests.auth import HTTPBasicAuth
from app import models, serializers
from app.models import Plan, Container, CarGroup
from app.serializers import PlanSerializer, MyTokenObtainPairSerializer, MyTokenVerifySerializer
from rest_framework.response import Response
from django.contrib import auth
from django.contrib.auth import authenticate, login

from utils.response import CommonResponseMixin, ReturnCode


class MyObtainTokenPairView(TokenObtainPairView):

    serializer_class = MyTokenObtainPairSerializer

class AuthView(MyObtainTokenPairView, CommonResponseMixin):
    # throttle_classes = [UserRateThrottle]

    def post(self, request, *args, **kwargs):
        print(request.user)
        user_info = request.data
        serializer_valid = self.get_serializer(data=user_info)
        try:
            serializer_valid.is_valid(raise_exception=True)
            serializer_valid.validated_data['username'] = user_info['username']
            response = self.wrap_json_response(data=serializer_valid.validated_data)

        except Exception as e:
            print(e)
            response = self.wrap_json_response(code=ReturnCode.FAILED, message='真的失败')
        return Response(response)



class RefreshTokenView(TokenRefreshView, CommonResponseMixin):
    """
    更新token
    """

    def post(self, request, *args, **kwargs):
        serializer_valid = self.get_serializer(data=request.data)
        try:
            serializer_valid.is_valid(raise_exception=True)
            response = self.wrap_json_response(data=serializer_valid.validated_data)
            print(response)
        except Exception as e:
            print(e)
            response = self.wrap_json_response(code=ReturnCode.UNAUTHORIZED, message="您提供的refresh-token已经失效")
        return Response(response)


class TestView(APIView, CommonResponseMixin):

    def post(self, request, *args, **kwargs):
        try:
            response = self.wrap_json_response(data={'test': 1})
        except Exception as e:
            print(e)
            response = self.wrap_json_response(code=ReturnCode.FAILED, message='test失败')
        return Response(response)




class MyTokenVerifyView(TokenViewBase):
    """
    验证token得到用户信息 token: 验证的token
    """
    serializer_class = MyTokenVerifySerializer


class takeContainerPlan2CView(APIView):
    def get(self,request):
        try:
            data=request.data
            print(data)
            userId=str(request.GET.get('userId'))
            print(userId)
            pageSize = request.GET.get('results')
            pageIndex = request.GET.get('page')
            plan=Plan.objects.filter(user_id=userId).order_by('expiryDate').all()
            planList=PlanSerializer(plan,many=True)
            total= len(planList.data)
            paginator=Paginator(planList.data,pageSize)
            page=paginator.get_page(pageIndex).object_list
            print(page)
            things=list(page)
            print(things)
            rtn={'code':1000,'message':'获取成功','data':things,'count':total}
            print(rtn)
        except Exception as e:
            rtn = {'code': 1001, 'message': '获取失败'+str(e), 'data': {}}
        return Response(rtn)
    def post(self,request):
        try:
            data=request.data
            print(data)
            ctns=data['containerContent']
            list=dict()
            serialInfo=[]

            list.update(depot=data['depot'],plan_time=data['plan_time'], vesselName=data['vesselName'], voyage=data['voyage'],
                        blNo=data['blNo'],expiryDate=data['expiryDate'],operCode=data['operCode'])
            print(data['carGroupCode'])
            Plan.objects.create(**list,carGroupCode=CarGroup.objects.filter(carGroupCode=data['carGroupCode']).first(),plan_id=Plan.objects.count()+1)
            print('good')
            for ctn in ctns:
                ctn.update(contSize=data['contSize'],contType=data['contType'])
                print(ctn)
                serialInfo.append({'serialNo':ctn['serialNo']})
                print(serialInfo)
                Container.objects.create(**ctn)
            print(serialInfo)
            jsondata=dict()
            jsondata.update(depot=data['depot'],blNo=data['blNo'],vesselName=data['vesselName'],
                            voyage=data['voyage'],operCode=data['operCode'],contSize=data['contSize'],
                            contType=data['contType'],serialInfo=serialInfo)
            # url = 'http://60.29.215.181:8028/api/ktil/getoperbooking'

            # resp = requests.post(url, auth=HTTPBasicAuth('econApi', 'Pa$$w0rd'))
            # models.Plan.objects.create(**data['data'])
            rtn = {'code': 1000, 'message': '提交成功', 'data': jsondata}
        except Exception as e:
            rtn = {'code': 1001, 'message': '获取失败' + str(e), 'data': {}}
            print(e)
        return Response(rtn)


# Create your views here.

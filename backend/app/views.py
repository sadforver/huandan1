from django.contrib.auth.models import User
from django.core.files.storage import default_storage
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
import json

from utils.response import CommonResponseMixin, ReturnCode


class MyObtainTokenPairView(TokenObtainPairView):

    serializer_class = MyTokenObtainPairSerializer

class AuthView(MyObtainTokenPairView, CommonResponseMixin):
    # throttle_classes = [UserRateThrottle]

    def post(self, request, *args, **kwargs):
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
            userId=request.GET.get('operCode')
            pageSize = request.GET.get('results')
            pageIndex = request.GET.get('page')
            filter=request.GET.get('planStatus')
            if filter:
                plan = Plan.objects.filter(oper_code=userId,plan_status=filter).order_by('expiry_date').all()
            else:
                plan=Plan.objects.filter(oper_code=userId).order_by('expiry_date').all()
            planList=PlanSerializer(plan,many=True)
            total= len(planList.data)
            paginator=Paginator(planList.data,pageSize)
            page=paginator.get_page(pageIndex).object_list
            print(page)
            things=list(page)
            print(things)
            rtn={'code':ReturnCode.SUCCESS,'message':'获取成功','data':things,'count':total}
            print(rtn)
        except Exception as e:
            rtn = {'code': 1001, 'message': '获取失败'+str(e), 'data': {}}
        return Response(rtn)
    def post(self,request):
        try:
            data=request.data
            ctns=data['container_content']
            list=dict()
            serialInfo=[]
            list.update(depot=data['depot'],plan_time=data['plan_time'], vessel_name=data['vessel_name'], voyage=data['voyage'],
                        bl_no=data['bl_no'],expiry_date=data['expiry_date'],oper_code=data['oper_code'])
            for ctn in ctns:
                ctn.update(cont_size=data['cont_size'],cont_type=data['cont_type'])
                serialInfo.append({'serial_no':ctn['serial_no']})
                Container.objects.create(**ctn)
            jsondata=dict()
            jsondata.update(depot=data['depot'],bl_no=data['bl_no'],vessel_name=data['vessel_name'],
                            voyage=data['voyage'],oper_code=data['oper_code'],cont_size=data['cont_size'],
                            cont_type=data['cont_type'],serial_info=serialInfo)
            url = 'http://60.29.215.181:8028/api/ktil/getoperbooking'
            resp = requests.post(url, auth=HTTPBasicAuth('econApi', 'Pa$$w0rd'),json=jsondata)
            result = resp.json()
            if result['Success']==True:
                list.update(plan_status='S')
                rtn = {'code': ReturnCode.SUCCESS, 'message': '提交成功', 'data': jsondata}
            else:
                list.update(plan_status='F')
                rtn={'code':1001,'message':result['Message'],'data':{}}
            Plan.objects.create(**list,
                                car_group_code=CarGroup.objects.filter(car_group_code=data['car_group_code']).first(),
                                plan_id=Plan.objects.count() + 1)
        except Exception as e:
            rtn = {'code': 1001, 'message': '获取失败' + str(e), 'data': {}}
        return Response(rtn)
class takeContainerPlan2BView(APIView):
    def get(self,request):
        try:
            userId=request.GET.get('operCode')
            pageSize = request.GET.get('results')
            pageIndex = request.GET.get('page')
            print('yessssssssss')
            if User.objects.filter(username=userId,is_staff=True).count()==1:
                print('yessss')
                plan = Plan.objects.filter(plan_status='S',document_path__startswith='h').order_by('expiry_date').all()
            planList=PlanSerializer(plan,many=True)
            total= len(planList.data)
            paginator=Paginator(planList.data,pageSize)
            page=paginator.get_page(pageIndex).object_list
            print(page)
            things=list(page)
            print(things)
            rtn={'code':ReturnCode.SUCCESS,'message':'获取成功','data':things,'count':total}
            print(rtn)
        except Exception as e:
            rtn = {'code': 1001, 'message': '获取失败'+str(e), 'data': {}}
        return Response(rtn)

class photo(APIView):
    def post(self,request):
        try:
            id=request.data['operCode']
            blNo=request.data['blNo']
            file=request.FILES['bill']
            file_name=default_storage.save(file.name,file)
            bill='http://127.0.0.1:8000/media/'+file_name
            Plan.objects.filter(bl_no=blNo,oper_code=id).update(document_path=bill)
            rtn = {'code': ReturnCode.SUCCESS, 'message': '上传成功', 'data': bill}
        except Exception as errorDetail:
            rtn = {'code': 1001, 'message': '上传失败，失败的原因：' + str(errorDetail)}
        return Response(rtn)

# Create your views here.

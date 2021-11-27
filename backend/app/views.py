from django.core.paginator import Paginator
from django.shortcuts import render
from rest_framework.views import APIView
from requests import *
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from app import models
from app.models import Plan, Container, CarGroup
from app.serializers import PlanSerializer
from rest_framework.response import Response

from utils.response import CommonResponseMixin, ReturnCode


class AuthView(TokenObtainPairView, CommonResponseMixin):
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
            serialInfo=dict()

            list.update(plan_time=data['plan_time'], vesselName=data['vesselName'], voyage=data['voyage'],
                        blNo=data['blNo'],expiryDate=data['expiryDate'],operCode=data['operCode'])
            print(data['carGroupCode'])
            Plan.objects.create(**list,carGroupCode=CarGroup.objects.filter(carGroupCode=data['carGroupCode']).first())
            print('good')
            for ctn in ctns:
                ctn.update(contSize=data['contSize'],contType=data['contType'])
                serialInfo.update(serialNo=ctn['serialNo'])
                Container.objects.create(**ctn)
            print(serialInfo)
            # models.Plan.objects.create(**data['data'])
            rtn = {'code': 1000, 'message': '提交成功', 'data': data}
        except Exception as e:
            rtn = {'code': 1001, 'message': '获取失败' + str(e), 'data': {}}
            print(e)
        return Response(rtn)


# Create your views here.

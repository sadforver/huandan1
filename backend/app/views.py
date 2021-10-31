from django.core.paginator import Paginator
from django.shortcuts import render
from rest_framework.views import APIView

from app import models
from app.models import Plan
from app.serializers import PlanSerializer
from rest_framework.response import Response

class takeContainerPlan2CView(APIView):
    def get(self,request):
        try:
            data=request.data
            print(data)
            userId=str(request.GET.get('userId'))
            print(userId)
            pageSize = request.GET.get('results')
            pageIndex = request.GET.get('page')
            plan=Plan.objects.filter(user_id=userId).order_by('exp_time').all()
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
            ctn=data['containerContent']
            print(type(ctn),ctn)
            for cell in ctn:
                cell.update(ctnSize=data['ctnSize'],ctnType=data['ctnType'],planId=data['planId'])
            print(ctn)
            # models.Plan.objects.create(**data['data'])
            rtn = {'code': 1000, 'message': '提交成功', 'data': data}
        except Exception as e:
            rtn = {'code': 1001, 'message': '获取失败' + str(e), 'data': {}}
        return Response(rtn)


# Create your views here.

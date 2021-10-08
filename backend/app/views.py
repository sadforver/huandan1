from django.core.paginator import Paginator
from django.shortcuts import render
from rest_framework.views import APIView

from app.models import Plan
from app.serialize import PlanSerializer
from rest_framework.response import Response

class takeContainerPlan2CView(APIView):
    def get(self,request):
        try:
            userId=request.GET.get('userId')
            pageSize = int(request.GET.get('results'))
            pageIndex = int(request.GET.get('page'))
            plan=Plan.objects.filter(userId=userId).order_by('expTime').all()
            planList=PlanSerializer(plan).data
            total= len(planList)
            paginator=Paginator(planList,pageSize)
            page=paginator.get_page(pageIndex).object_list
            print(page)
            things=list(page)
            print(things)
            rtn={'code':1000,'message':'获取成功','data':things,'count':total}
        except Exception as e:
            rtn = {'code': 1001, 'message': '获取失败'+str(e), 'data': {}}
        return Response(rtn)
# Create your views here.

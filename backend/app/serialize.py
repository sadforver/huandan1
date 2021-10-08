from rest_framework import serializers
from app.models import Plan

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
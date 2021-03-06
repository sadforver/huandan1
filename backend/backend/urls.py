"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from app import views
from app.views import TestView, AuthView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('takecontainerplan/', views.takeContainerPlan2CView.as_view()),
    path('takecontainerplan2verify/', views.takeContainerPlan2BView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    url(r'^test/$', TestView.as_view()),
    url(r'^login/$', AuthView.as_view()),
    path('photo/', views.photo.as_view()),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

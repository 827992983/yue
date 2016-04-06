"""yue URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
# from django.contrib import admin
from api import views as api_views
from admin import views as admin_views
from guest import views as guest_views
from login import views as login_views

urlpatterns = [
    url(r'^login', login_views.login, name='login'),
    url(r'^admin', admin_views.index),
    url(r'^guest', guest_views.index),
    url(r'^api', api_views.index),
    url(r'^', login_views.index, name='index'),
]

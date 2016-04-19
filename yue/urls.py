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
from django.contrib.staticfiles.urls import static
from django.conf import settings
# from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from api import views as api_views
from admin import views as admin_views
from guest import views as guest_views
from login import views as login_views

urlpatterns = [
    url(r'^login', login_views.login, name='login'),
    url(r'^logout', login_views.logout, name='logout'),
    url(r'^admin', admin_views.index, name='admin'),
    url(r'^changepwd', admin_views.changepwd, name='changepwd'),
    url(r'^configure', admin_views.configure, name='configure'),
    url(r'^checkenv', admin_views.checkenv, name='checkenv'),
    url(r'^storage', admin_views.storage, name='storage'),
    url(r'^network', admin_views.network, name='network'),
    url(r'^users', login_views.users, name='users'),
    url(r'^user/create', login_views.create_user, name='create_user'),
    url(r'^user/delete', login_views.delete_user, name='delete_user'),
    url(r'^user/edit', login_views.edit_user, name='edit_user'),
    url(r'^guest', guest_views.index, name='guest'),
    url(r'^api', api_views.index),
    url(r'^index', login_views.index, name='index'),
    url(r'^', login_views.index, name='index'),
]

urlpatterns += staticfiles_urlpatterns()

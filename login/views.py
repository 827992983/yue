#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
# Copyright: free
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from .forms import UserForm
from .models import User

# Create your views here.

def index(request):
    try:
        if request.method == 'POST':
            form = UserForm(request.POST)

            if form.is_valid():
                username = form.cleaned_data['username']
                password = form.cleaned_data['password']
                identify = form.cleaned_data['identify']
                userinfo = User.objects.filter(name=username)
                if userinfo == None or len(userinfo) != 1:
                    return render(request, 'index.html')

                if userinfo[0].identify == 'admin':
                    if username == userinfo[0].name and password == userinfo[0].password and identify == userinfo[
                        0].identify:
                        return HttpResponseRedirect("admin?username=%s" % (username,))
            else:
                username = form.cleaned_data['username']
                password = form.cleaned_data['password']
                userinfo = User.objects.filter(name=username)
                if userinfo == None or len(userinfo) != 1:
                    return render(request, 'index.html')

                if username == userinfo[0].name and password == userinfo[0].password:
                    return HttpResponseRedirect("guest?username=%s" % (username,))

    except:
        pass

    return render(request, 'index.html')
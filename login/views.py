#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
# Copyright: free
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from .models import User
import json

# Create your views here.

def index(request):
    return render(request, 'index.html')

def login(request):
    try:
        if request.method == 'POST':
            form = json.loads(request.body)
            if form is not None:
                username = form['username']
                password = form['password']
                identify = form['identify']
                userinfo = User.objects.filter(name=username)
                if userinfo == None or len(userinfo) != 1:
                    return render(request, 'index.html')

                if userinfo[0].identify == 'admin':
                    if username == userinfo[0].name and password == userinfo[0].password and identify == userinfo[0].identify:
                        ret = {'status': 0, 'msg': 'admin login', 'data':{'to':'admin'}}
                    else:
                        ret = {'status': 1001, 'msg': 'admin login', 'data':{}}
                    return HttpResponse(json.dumps(ret))
                else:
                    if username == userinfo[0].name and password == userinfo[0].password and identify == userinfo[0].identify:
                        ret = {'status': 0, 'msg': 'user login', 'data':{'to':'guest'}}
                    else:
                        ret = {'status': 1001, 'msg': 'user login', 'data':{}}
                    return HttpResponse(json.dumps(ret))
    except:
        pass
    ret = {'status': 1002, 'msg': 'login exception', 'data':{}}
    return HttpResponse(json.dumps(ret))

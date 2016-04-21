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
                else:
                    if username == userinfo[0].name and password == userinfo[0].password and identify == userinfo[0].identify:
                        ret = {'status': 0, 'msg': 'user login', 'data':{'to':'guest'}}
                    else:
                        ret = {'status': 1001, 'msg': 'user login', 'data':{}}

                response = HttpResponse(json.dumps(ret))
                if ret['status'] == 0:
                    response.set_cookie('username', username, 1800)
                return response
    except:
        pass
    ret = {'status': 1002, 'msg': 'login exception', 'data':{}}
    return HttpResponse(json.dumps(ret))

def logout(request):
    try:
        ret = {'status': 0, 'msg': 'logout', 'data':{}}
        response = HttpResponse(json.dumps(ret))
        response.delete_cookie('username')
    except:
        pass
    return response

def users(request):
    try:
        data = []
        elem = {}
        all = User.objects.all()
        for user in all:
            elem['name'] = user.name
            elem['identify'] = user.identify
            elem['email'] = user.email
            elem['phone'] = user.phone
            elem['department'] = user.department
            data.append(elem)
            elem = {} #must be clear elem

        ret = {'status':0, 'msg':'get all user succeed', 'data': data}
        return HttpResponse(json.dumps(ret))
    except:
        pass
    ret = {'status':1003, 'msg':'get all user failed', 'data': {}}
    return HttpResponse(json.dumps(ret))

def create_user(request):
    try:
        ret = {'status':0, 'msg':'create user success', 'data': {}}
        if request.method == 'POST':
            form = json.loads(request.body)
            userinfo = User.objects.filter(name=form['name'])
            if userinfo != None and len(userinfo) > 0:
                ret = {'status':1004, 'msg':'user have exist', 'data': {}}
                return HttpResponse(json.dumps(ret))

            if(form['name'] == None or len(form['name'])<1):
                ret = {'status':1005, 'msg':'username can not be Null', 'data': {}}

            if(form['password'] == None or len(form['password'])<6):
                ret = {'status':1006, 'msg':'password length > 6', 'data': {}}

            if(form['confirm'] == None or form['password'] != form['confirm']):
                ret = {'status':1007, 'msg':' password is not same', 'data': {}}

            if ret['status'] > 0:
                return HttpResponse(json.dumps(ret))

            user = User(name=form['name'], password=form['password'], identify=form['identify'], email=form['email'], phone=form['phone'], department=form['department'])
            user.save()
            return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status':1008, 'msg':'create user error', 'data': {}}
    return HttpResponse(json.dumps(ret))

def delete_user(request):
    try:
        ret = {'status':0, 'msg':'delete user success', 'data': {}}
        if request.method == 'POST':
            form = json.loads(request.body)
            for username in form:
                userinfo = User.objects.filter(name=username)
                if userinfo == None or len(userinfo) == 0:
                    ret = {'status':1009, 'msg':'user is not exist', 'data': {}}
                    return HttpResponse(json.dumps(ret))
                User.objects.filter(name=username).delete()

            return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status':1010, 'msg':'delete user error', 'data': {}}
    return HttpResponse(json.dumps(ret))

def edit_user(request):
    try:
        ret = {'status':0, 'msg':'edit user success', 'data': {}}
        if request.method == 'POST':
            form = json.loads(request.body)
            userinfo = User.objects.filter(name=form['name'])[0]
            if userinfo == None and len(userinfo) == 0:
                ret = {'status':1011, 'msg':'user is not exist', 'data': {}}
                return HttpResponse(json.dumps(ret))

            userinfo.email = form['email']
            userinfo.department = form['department']
            userinfo.phone = form['phone']
            userinfo.save()
            return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status':1012, 'msg':'create user error', 'data': {}}
    return HttpResponse(json.dumps(ret))
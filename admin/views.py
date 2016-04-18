from django.shortcuts import render
from django.http import HttpResponse
import json
from login.models import User
from .models import Configure
from config import sysconfig
import time
# Create your views here.

def index(request):
    return render(request, 'admin.html')

def checkenv(request):
    ret = {'status':0, 'msg':'check environment success', 'data': {}}
    data = {}
    try:
        data['kernel'] = sysconfig.getKernelVersion()
        data['os'] = sysconfig.getOsVersion()
        data['vtx'] = sysconfig.isVirtEnhance()
        engine = Configure.objects.get(key='engine').value
        data['kvm'] = sysconfig.getKvmVersion(engine)
        data['spice'] = sysconfig.getSpiceVersion()
        data['cpu'] = sysconfig.getCpu()
        data['memory'] = sysconfig.getMemory()
        ret['data'] = data
    except:
        pass
    return HttpResponse(json.dumps(ret))

def configure(request):
    try:
        ret = {'status':0, 'msg':'configure success', 'data': {}}
        if request.method == "GET":
            engine = Configure.objects.get(key='engine')
            display = Configure.objects.get(key='display')
            data = {}
            data['engine'] = engine.value
            data['display'] = display.value
            ret['data'] = data
            return HttpResponse(json.dumps(ret))
        elif request.method == "POST":
            form = json.loads(request.body)
            Configure.objects.filter(key='engine').update(value=form['engine'])
            Configure.objects.filter(key='display').update(value=form['display'])
            return HttpResponse(json.dumps(ret))
        else:
            pass
    except:
        pass

    ret = {'status': 2001, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def changepwd(request):
    try:
        if request.method == "POST":
            form = json.loads(request.body)
            username = request.COOKIES['username']
            userinfo = User.objects.filter(name=username)

            if userinfo == None or len(userinfo) != 1:
                ret = {'status': 1011, 'msg': 'invalid username', 'data': {}}
                return HttpResponse(json.dumps(ret))

            if userinfo[0].password == form['old'].strip() and form['new'].strip() == form['confirm'].strip():
                ret = {'status': 0, 'msg': 'succeed', 'data': {}}
                userinfo[0].password = form['new'].strip()
                userinfo[0].save()
                return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status': 1012, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def sleep(request):
    ret = {'status':0}
    time.sleep(request.GET['seconds'])
    return HttpResponse(json.dumps(ret))

def storage(request):
    ret = {'status':0, 'msg':'storage success', 'data': {}}
    try:
        if request.method == "GET":
            pass
        else:
            pass
        return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status': 3003, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))
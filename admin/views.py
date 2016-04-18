from django.shortcuts import render
from django.http import HttpResponse
import json
from login.models import User
from .models import Configure
from .models import Storage
from config import sysconfig
from storage import localfs
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

def storage(request):
    ret = {'status':0, 'msg':'storage operation success', 'data': {}}
    data = {}
    try:
        if request.method == "GET":
            path = request.GET['path']
            st = Storage.objects.get(path=path)
            if st is None or len(st) != 1:
                ret = {'status':3001, 'msg':'get storage info from db with error', 'data': {}}
                return HttpResponse(json.dumps(ret))
            data['path'] = st.path
            data['type'] = st.type
            data['disk'] = st.disk
            data['mount'] = st.mount
            if st.type == 'local':
                local = localfs.LocalFsStorage(st.path)
                data['space'] = localfs.getAllSpace()
                data['free'] = localfs.getFreeSpace()
                ret['data'] = data
        else:
            form = json.loads(request.body)
            st = Storage.objects.get(path=form['path'])
            if len(st) > 0:
                ret = {'status':3002, 'msg':'storage has exist', 'data': {}}
                return HttpResponse(ret)
            st = localfs.LocalFsStorage(form['path'])
            Storage.objects.create(path=form['path'], type='local', disk=st.getDevice(), mount=st.getMount())

        return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status': 3003, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))
from django.shortcuts import render
from django.http import HttpResponse
import json
from login.models import User
from .models import Configure
from .models import Storage
from config import sysconfig
from storage import localfs
from net import net
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
    data = []
    try:
        if request.method == "GET":
            st = Storage.objects.all()
            if st is None or len(st) < 1:
                ret = {'status':3001, 'msg':'get storage info from db with error', 'data': {}}
                return HttpResponse(json.dumps(ret))
            for elem in st:
                s={}
                s['path'] = elem.path
                s['type'] = elem.type
                if elem.type=='local' or elem.type=='iso':
                    local = localfs.LocalFsStorage(elem.path)
                    s['space'] = local.getAllSpace()
                    s['free'] = local.getFreeSpace()
                    s['disk'] = local.getDevice()
                    s['mount'] = local.getMount()
                data.append(s)
            ret['data'] = data
            return HttpResponse(json.dumps(ret))
        elif request.method == 'POST':
            form = json.loads(request.body)
            st = Storage.objects.filter(path=form['path'])
            if  st is not None and len(st) > 0:
                ret = {'status':3002, 'msg':'storage has exist', 'data': {}}
                return HttpResponse(json.dumps(ret))
            st = localfs.LocalFsStorage(form['path'], True)
            Storage.objects.create(path=form['path'], type=form['type'])
            return HttpResponse(json.dumps(ret))
        elif request.method=="DELETE":
            form = json.loads(request.body)
            for elem in form:
                local = localfs.LocalFsStorage(elem)
                local.delete()
                Storage.objects.filter(path=elem).delete()
            return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status': 3003, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def network(request):
    print 'network request'
    ret = {'status':0, 'msg':'storage operation success', 'data': {}}
    try:
        if request.method == 'GET':
            all = []
            devices = net.devices()
            print devices
            for dev in devices['data']:
                data = {}
                data['dev'] = dev
                db = Configure.objects.filter(key='network')
                if db is not None and len(db)==1:
                    data = net.load('vmbridge')['data']
                    data['dev'] = dev
                all.append(data)
            ret['data'] = all
            return HttpResponse(json.dumps(ret))
        elif request.method == 'POST':
            form = json.loads(request.body)
            print form
            db = Configure.objects.filter(key='network')
            print 0
            if db is None or len(db) == 0:
                print 1
                result = net.update(network='vmbridge', device=form['dev'], ip=form['ip'], netmask=form['netmask'], gateway=form['gateway'], dns=form['dns'])
                Configure.objects.create(key='network',value='vmbridge')
                print 2
            if db is not None and len(db) == 1:
                print 3
                net.disable(Configure.objects.filter(key='network')[0].value)
                result = net.update('vmbridge', form['dev'], form['ip'], form['netmask'], form['gateway'], form['dns'])
            return HttpResponse(json.dumps(ret))
        else:
            pass
    except:
        pass
    ret = {'status': 3003, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))
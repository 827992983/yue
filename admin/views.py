from django.shortcuts import render
from django.http import HttpResponse
import json
from login.models import User
from .models import Configure
from .models import Storage
from .models import Vm
from config import sysconfig
from storage import localfs
from net import net
from yuelibs import utils
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
            print type(st)
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
    except Exception,e:
        print e

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

def vm(request):
    ret = {'status':0, 'msg':'vm operation success', 'data': {}}
    data = []
    print 'vm request'
    try:
        if request.method == "GET":
            print request.GET
            if request.GET['vmid'] == 'all':
                vms = Vm.objects.all()
                if vms is None or len(vms)<1:
                    pass
                else:
                    for elem in vms:
                        vminfo = {}
                        vminfo['vmid'] = elem.id
                        vminfo['name'] = elem.name
                        vminfo['system'] = elem.system
                        vminfo['cpu'] = elem.cpu
                        vminfo['memory'] = elem.memory
                        vminfo['user'] = elem.user
                        vminfo['istemplate'] = elem.istemplate
                        vminfo['templatename'] = elem.templatename
                        vminfo['templatepath'] = elem.templatepath
                        vminfo['nic1'] = elem.nic1
                        vminfo['nic2'] = elem.nic1
                        vminfo['disk1'] = elem.disk1
                        vminfo['disk2'] = elem.disk2
                        vminfo['snapshotname'] = elem.snapshotname
                        vminfo['snapshotpath'] = elem.snapshotpath
                        vminfo['yourself'] = elem.yourself
                        data.append(vminfo)
            else:
                id = request.GET['vmid']
                elem = Vm.objects.filter(vmid=id)[0]
                vminfo = {}
                vminfo['vmid'] = elem.id
                vminfo['name'] = elem.name
                vminfo['system'] = elem.system
                vminfo['cpu'] = elem.cpu
                vminfo['memory'] = elem.memory
                vminfo['user'] = elem.user
                vminfo['istemplate'] = elem.istemplate
                vminfo['templatename'] = elem.templatename
                vminfo['templatepath'] = elem.templatepath
                vminfo['nic1'] = elem.nic1
                vminfo['nic2'] = elem.nic1
                vminfo['disk1'] = elem.disk1
                vminfo['disk2'] = elem.disk2
                vminfo['snapshotname'] = elem.snapshotname
                vminfo['snapshotpath'] = elem.snapshotpath
                vminfo['yourself'] = elem.yourself
                data.append(vminfo)
            ret['data'] = data
        elif request.method == "POST":
            form = json.loads(request.body)
            id = utils.uuid()
            Vm.objects.create(vmid=id,name=form['name'],cpu=form['cpu'],memory=form['memory'],
                              user=form['user'],istemplate=form['istemplate'],system=form['system'],
                              templatename=form['templatename'],templatepath=form['templatepath'],
                              nic1=form['nic1'],nic2=form['nic2'],disk1=form['disk1'],disk2=['disk2'],
                              snapshotname=form['snapshotname'],snapshotpath=form['snapshotpath'],
                              yourself=form['yourself'])
        elif request.method == "PUT":
            form = json.loads(request.body)
            id = form['vmid']
            Vm.objects.filter(vmid=id).update(vmid=id,name=form['name'],cpu=form['cpu'],memory=form['memory'],
                              user=form['user'],istemplate=form['istemplate'],system=form['system'],
                              templatename=form['templatename'],templatepath=form['templatepath'],
                              nic1=form['nic1'],nic2=form['nic2'],disk1=form['disk1'],disk2=['disk2'],
                              snapshotname=form['snapshotname'],snapshotpath=form['snapshotpath'],
                              yourself=form['yourself'])
        elif request.method == "DELETE":
            form = json.loads(request.body)
            for id in form:
                Vm.objects.filter(vmid=id).delete()
        else:
            pass
        return HttpResponse(json.dumps(ret))
    except Exception,e:
        print e

    ret = {'status': 4002, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def template(request):
    ret = {'status':0, 'msg':'vm operation success', 'data': {}}
    data = []
    print 'template request'
    try:
        if request.method == "GET":
            vms = Vm.objects.filter(istemplate='yes')
            if vms is None or len(vms)<1:
                pass
            else:
                for elem in vms:
                    vminfo = {}
                    vminfo['vmid'] = elem.id
                    vminfo['name'] = elem.name
                    vminfo['system'] = elem.system
                    vminfo['cpu'] = elem.cpu
                    vminfo['memory'] = elem.memory
                    vminfo['user'] = elem.user
                    vminfo['istemplate'] = elem.istemplate
                    vminfo['templatename'] = elem.templatename
                    vminfo['templatepath'] = elem.templatepath
                    vminfo['nic1'] = elem.nic1
                    vminfo['nic2'] = elem.nic1
                    vminfo['disk1'] = elem.disk1
                    vminfo['disk2'] = elem.disk2
                    vminfo['snapshotname'] = elem.snapshotname
                    vminfo['snapshotpath'] = elem.snapshotpath
                    vminfo['yourself'] = elem.yourself
                    data.append(vminfo)
        elif request.method == "POST":
            form = json.loads(request.body)
            id = utils.uuid()
            Vm.objects.create(vmid=id,name=form['name'],cpu=form['cpu'],memory=form['memory'],
                              user=form['user'],istemplate=form['istemplate'],system=form['system'],
                              templatename=form['templatename'],templatepath=form['templatepath'],
                              nic1=form['nic1'],nic2=form['nic2'],disk1=form['disk1'],disk2=['disk2'],
                              snapshotname=form['snapshotname'],snapshotpath=form['snapshotpath'],
                              yourself=form['yourself'])
        elif request.method == "PUT":
            form = json.loads(request.body)
            id = form['vmid']
            Vm.objects.filter(vmid=id).update(vmid=id,name=form['name'],cpu=form['cpu'],memory=form['memory'],
                              user=form['user'],istemplate=form['istemplate'],system=form['system'],
                              templatename=form['templatename'],templatepath=form['templatepath'],
                              nic1=form['nic1'],nic2=form['nic2'],disk1=form['disk1'],disk2=['disk2'],
                              snapshotname=form['snapshotname'],snapshotpath=form['snapshotpath'],
                              yourself=form['yourself'])
        elif request.method == "DELETE":
            form = json.loads(request.body)
            for id in form:
                Vm.objects.filter(vmid=id).delete()
        else:
            pass
        return HttpResponse(json.dumps(ret))
    except Exception,e:
        print e

    ret = {'status': 4002, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))
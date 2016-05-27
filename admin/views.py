from django.shortcuts import render
from django.http import HttpResponse
import json
from login.models import User
from .models import Configure
from .models import Storage
from .models import Vm
from .models import VmPort
from .models import VmIso
from config import sysconfig
from storage import localfs
from net import net
from yuelibs import utils
import vm.vm as vmop
import os
import shutil
import vm.qemuimg as qemuimg
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
            st = Storage.objects.filter(type='local')
            if  st is not None and len(st) and form['type']=='local'> 0:
                ret = {'status':3003, 'msg':'one of storage type only have one', 'data': {}}
                return HttpResponse(json.dumps(ret))
            st = Storage.objects.filter(type='iso')
            if st is not None and len(st) and form['type']=='iso'> 0:
                ret = {'status': 3003, 'msg': 'one of storage type only have one', 'data': {}}
                return HttpResponse(json.dumps(ret))
            st = localfs.LocalFsStorage(form['path'], True)
            if form['type'] == "iso":
                os.rmdir(os.path.join(form['path'], "image"))
                os.rmdir(os.path.join(form['path'], "template"))
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

    ret = {'status': 3004, 'msg': 'unknown except', 'data': {}}
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
            if db is None or len(db) == 0:
                result = net.update(network='vmbridge', device=form['dev'], ip=form['ip'], netmask=form['netmask'], gateway=form['gateway'], dns=form['dns'])
                Configure.objects.create(key='network',value='vmbridge')
            if db is not None and len(db) == 1:
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
            if request.GET['vmname'] == 'all':
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
                        vminfo['nic2'] = elem.nic2
                        vminfo['disk1'] = elem.disk1
                        vminfo['disk2'] = elem.disk2
                        vminfo['snapshotname'] = elem.snapshotname
                        vminfo['snapshotpath'] = elem.snapshotpath
                        vminfo['yourself'] = elem.yourself
                        data.append(vminfo)
            else:
                vmname = request.GET['vmname']
                elem = Vm.objects.filter(name=vmname)[0]
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
                vminfo['nic2'] = elem.nic2
                vminfo['disk1'] = elem.disk1
                vminfo['disk2'] = elem.disk2
                vminfo['snapshotname'] = elem.snapshotname
                vminfo['snapshotpath'] = elem.snapshotpath
                vminfo['yourself'] = elem.yourself
                data.append(vminfo)
            ret['data'] = data
        elif request.method == "POST":
            form = json.loads(request.body)
            vmid = utils.uuid()
            template_path = ""
            disk1_path = ""
            disk2_path = ""
            nic1_name = ""
            nic2_name = ""
            rs = Vm.objects.filter(name=form['name'])
            if rs != None and len(rs) > 0:
                ret = {'status':4003, 'msg':'vm have exist', 'data': {}}
                return HttpResponse(json.dumps(ret))
            storage_path = Storage.objects.filter(type='local')[0].path
            image_path = os.path.join(storage_path, 'image')
            disk_path = os.path.join(image_path, vmid)
            print 'disk_path=%s' % disk_path
            os.mkdir(disk_path)
            disk1_path = os.path.join(disk_path, 'disk1.qcow2')
            print "disk1_path=%s" % (disk1_path)
            qemuimg.create(disk1_path, form['disk1'], 'qcow2')
            if form['disk2'] != None and form['disk2'] > 0:
                disk2_path = os.path.join(disk_path, 'disk2.qcow2')
                print disk2_path
                qemuimg.create(disk1_path, 'qcow2')
            if form['nic1'] == 'yes':
                nic1_name = "tap1%s" % form['name']
            if form['nic2'] == 'yes':
                nic2_name = "tap2%s" % form['name']
            Vm.objects.create(id=vmid,name=form['name'],cpu=form['cpu'],memory=form['memory'],
                              user=form['user'],system=form['system'],
                              templatename=form['templatename'],templatepath=template_path,
                              nic1=nic1_name,nic2=nic2_name,disk1=form['disk1'],disk1path=disk1_path,
                              disk2=form['disk2'],disk2path=disk2_path)
            port = 11000
            mapport = 21000
            for i in range(11000,12000):
                vmports = VmPort.objects.filter(port=i)
                if len(vmports) == 0:
                    port = i
                    mapport = i+10000
            print "port=%d,mapport=%d" % (port,mapport)
            VmPort.objects.create(vmname=form['name'], port=port, mapport=mapport)
        else:
            pass
        return HttpResponse(json.dumps(ret))
    except Exception,e:
        print 'vm operation error',e

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

def snapshot(request):
    ret = {'status':0, 'msg':'vm snapshot success', 'data': {}}
    data = []
    print 'template request'
    try:
        if request.method == "GET":
            pass
        elif request.method == "POST":
            pass
        else:
            pass
    except:
        pass

    return HttpResponse(json.dumps(ret))


def vm_status(request):
    ret = {'status':0, 'msg':'vm operation success', 'data': {}}
    data = []
    print 'vm status request'
    print request.GET['vmname']
    try:
        if request.method == "GET":
            if request.GET['vmname'] == 'all':
                ret['data'] = vmop.getAllVmStatus()
            else:
                ret['data'] = vmop.getVmStatus(request.GET['vmname'])
            print ret
            return HttpResponse(json.dumps(ret))
    except:
        pass
    ret = {'status': 4102, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def vm_delete(request):
    ret = {'status':0, 'msg':'vm delete success', 'data': {}}
    data = []
    print 'vm delete request'
    try:
        if request.method == "POST":
            form = json.loads(request.body)
            print form
            for elem in form:
                vminfo =  Vm.objects.filter(name=elem)[0]
                vmstat = vmop.getVmStatusById(vminfo.id)
                print "vmstat=" % vmstat
                if vmstat['status'] == 'running':
                    ret = {'status': 4201, 'msg': 'vm is running, can not delete', 'data': {}}
                    return HttpResponse(json.dumps(ret))
                path = vminfo.disk1path
                path = path[:-11]
                print "path=",path
                shutil.rmtree(path)
                Vm.objects.filter(name=elem).delete()
                VmPort.objects.filter(vmname=elem).delete()
            return HttpResponse(json.dumps(ret))
    except:
        pass
    ret = {'status': 4202, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def vm_edit(request):
    ret = {'status':0, 'msg':'vm edit success', 'data': {}}
    try:
        if request.method == "POST":
            form = json.loads(request.body)
            if form['nic1'] == 'yes':
                nic1_name = "tap1%s" % form['name']
            if form['nic2'] == 'yes':
                nic2_name = "tap2%s" % form['name']
            Vm.objects.filter(name=form['name']).update(name=form['name'],cpu=form['cpu'],memory=form['memory'],
                              user=form['user'],nic1=nic1_name,nic2=nic2_name,
                              disk1=form['disk1'],disk2=form['disk2'])
            return HttpResponse(json.dumps(ret))
    except Exception,e:
        print e
    ret = {'status': 4302, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def vm_start(request):
    ret = {'status':0, 'msg':'vm start success', 'data': {}}
    data = []
    print 'vm start request'
    try:
        if request.method == "POST":
            form = json.loads(request.body)
            print form
            for elem in form:
                vminfo = Vm.objects.filter(name=elem)[0]
                engine = Configure.objects.get(key='engine').value
                isoinfo = VmIso.objects.filter(vmname=elem)
                isopath = ""
                if isoinfo != None and len(isoinfo) == 1:
                    isopath = isoinfo[0].path
                vmports = VmPort.objects.filter(vmname=elem)[0]
                nic1 = {}
                nic2 = {}
                if len(vminfo.nic1) > 3:
                    nic1['name'] = vminfo.nic1
                    nic1['mac'] = utils.randomMAC()
                if len(vminfo.nic2) > 3:
                    nic2['name'] = vminfo.nic2
                    nic2['mac'] = utils.randomMAC()
                vmop.vmStart(engine=engine, name=vminfo.name, vmid=vminfo.id, cpu=vminfo.cpu, memory=vminfo.memory,
                             port=vmports.port, disk1=vminfo.disk1path, disk2=vminfo.disk2path, nic1=nic1,
                             nic2=nic2, iso=isopath)
                vmop.vmStartProxy(vmports.mapport, vmports.port)
                VmIso.objects.filter(vmname=elem).delete()
        return HttpResponse(json.dumps(ret))
    except Exception,e:
        print e
    ret = {'status': 4402, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def vm_stop(request):
    ret = {'status':0, 'msg':'vm stop success', 'data': {}}
    data = []
    print 'vm stop request'
    try:
        if request.method == "POST":
            form = json.loads(request.body)
            for elem in form:
                vminfo = Vm.objects.filter(name=elem)[0]
                vmop.shutdown(vminfo.id)
                mapport = VmPort.objects.filter(vmname=elem)[0].mapport
                vmop.clearWebsock(mapport)
                print "OK"
        return HttpResponse(json.dumps(ret))
    except:
        pass
    ret = {'status': 4402, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def iso(request):
    ret = {'status':0, 'msg':'vm iso success', 'data': {}}
    data = []
    print 'iso request'
    try:
        if request.method == "GET":
            isopath = Storage.objects.filter(type="iso")[0].path
            data = localfs.getIso(isopath)
            ret['data'] = data
            return HttpResponse(json.dumps(ret))
        elif request.method == "POST":
            form = json.loads(request.body)
            VmIso.objects.filter(vmname=form['vmname']).delete()
            isopath = Storage.objects.filter(type="iso")[0].path
            VmIso.objects.create(vmname=form['vmname'], iso=form['iso'], path=os.path.join(isopath, form['iso']))
            return HttpResponse(json.dumps(ret))
        else:
            pass
    except:
        pass
    ret = {'status': 45002, 'msg': 'vm iso success', 'data': {}}
    return HttpResponse(json.dumps(ret))

def connect_info(request):
    ret = {'status': 0, 'msg': 'vm connection success', 'data': {}}
    data = {}
    print 'connection request'
    try:
        if request.method == "GET":
            name = request.GET['vmname']
            vminfo = VmPort.objects.filter(vmname=name)[0]
            data['mapport'] = vminfo.mapport
            data['port'] = vminfo.port
            ret['data'] = data
            return HttpResponse(json.dumps(ret))
        else:
            pass
    except:
        pass
    ret = {'status': 46002, 'msg': 'vm connection error', 'data': {}}
    return HttpResponse(json.dumps(ret))
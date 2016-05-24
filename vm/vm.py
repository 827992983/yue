#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import  os
import yuelibs.utils as utils

#/usr/libexec/qemu-kvm -name CTVM -cpu Westmere,+vmx -enable-kvm -m 2048 -smp 2 -spice port=5930,disable-ticketing -vga qxl
# -net nic,vlan=0,macaddr=2c:07:00:00:00:02,model=rtl8139 -net tap,vlan=0,ifname=tap102
# -drive file=/share/david/ctvm.qcow2,index=0,media=disk
def vmStart(engine, name, vmid, cpu, memory, disk1, port, disk2="", template="", nic1="", nic2="", iso=""):
    diskIndex = 0

    print "vmStart"
    print "engine=%s, name=%s, vmid=%s, cpu=%s, memory=%s, disk1=%s, port=%s, disk2=%s, template=%s, nic1=%s, nic2=%s, iso=%s" % (engine, name, vmid, cpu, memory, disk1, port, disk2, template, nic1, nic2, iso)

    cmd = ""
    if engine=='qemu-kvm':
        cmd = os.path.join("/usr/libexec/",engine)
    else:
        cmd = engine

    cmd = cmd + " -name %s -enable-kvm -smp %s -m %s " % (name, cpu, memory)

    if iso is not None and len(iso) > 0:
        iso = "-drive file=%s,index=%s,media=cdrom " % (iso, str(diskIndex))
        diskIndex += 1
    if disk1:
        disk1 = " -drive file=%s,index=%s,media=disk " % (disk1, str(diskIndex))
        cmd = cmd + disk1
        diskIndex += 1
    if disk2:
        disk2 = " -drive file=%s,index=%s,media=disk " % (disk2, str(diskIndex))
        cmd = cmd + disk2
        diskIndex += 1

    if nic1:
        nic1 = "-net nic,macaddr=%s,model=rtl8139 -net tap,ifname=%s " % (nic1['mac'], nic1['name'])
    if nic2:
        nic1 = "-net nic,macaddr=%s,model=rtl8139 -net tap,ifname=%s " % (nic2['mac'], nic2['name'])

    if port >= 3000:
        cmd = cmd + " -spice port=%s,disable-ticketing " % (str(port))

    cmd = cmd + " -vga qxl &"

    print cmd
    utils.createThread(utils.execShellCommand, cmd)
    return 0

def vmStartProxy(port, mapport):
    curr_path = os.getcwd()
    print curr_path
    websock_path = curr_path[:-3]
    websock_path = os.path.join(websock_path, 'websockify.py')
    print websock_path
    cmd = "%s %s 0.0.0.0:%s" % (websock_path, str(port), str(mapport))
    utils.createThread(utils.execShellCommand, cmd)
    return 0

def getAllVmStatus():
    ret = []
    cmd = "ps -aux|grep enable-kvm"
    out,err,errcode = utils.execShellCommand(cmd)
    if errcode == 0:
        out = utils.mergeMultiSpace(out)
        li1 = out.split("\n")
        for i in li1:
            data = {}
            li2 = i.split(' ')
            for j in range(0, len(li2)-1):
                if li2[j] == '-name':
                    print li2
                    data['pid'] = li2[1]
                    data['cpu'] = li2[2]
                    data['memory'] = li2[3]
                    data['name'] = li2[j+1]
                    ret.append(data)
    print ret
    return ret

def getVmStatus(vmname):
    data = {}
    cmd = "ps -aux|grep enable-kvm|grep %s" % (vmname,)
    out,err,errcode = utils.execShellCommand(cmd)
    print out
    if errcode == 0:
        out = utils.mergeMultiSpace(out)
        li1 = out.split("\n")
        for i in li1:
            li2 = i.split(' ')
            for j in range(0, len(li2)-1):
                if li2[j] == '-name':
                    data['pid'] = li2[1]
                    data['cpu'] = li2[2]
                    data['memory'] = li2[3]
                    data['name'] = li2[j+1]
                    data['status'] = "running"
                    return data

    data['pid'] = "0"
    data['cpu'] = "0"
    data['memory'] = "0"
    data['name'] = vmname
    data['status'] = 'stop'
    return data
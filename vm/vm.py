#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import os
import sys
import yuelibs.utils as utils

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
                    data['pid'] = li2[1]
                    data['cpu'] = li2[2]
                    data['memory'] = li2[3]
                    data['name'] = li2[j+1]
                    ret.append(data)

    return ret

def getVmStatus(vmname):
    data = {}
    cmd = "ps -ef|grep enable-kvm|grep %s" % (vmname,)
    out,err,errcode = utils.execShellCommand(cmd)
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
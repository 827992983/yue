#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
# Copyright: free

from yuelibs import *


def getOsVersion():
    ret = "unknown"
    try:
        fd = open("/etc/redhat-release")
        ret = fd.readline()
        fd.close()
    except:
        pass

    return ret


def getKernelVersion():
    ret = "unknown"
    try:
        out, err, code = utils.execShellCommand("uname -a")
        sub = out.split(' ')
        ret = "%s-%s" % (sub[0], sub[2])
    except:
        pass
    return ret


def isVirtEnhance():
    ret = "no"
    try:
        out, err, code = utils.execShellCommand("egrep '(vmx|svm)' /proc/cpuinfo |wc -l ")
        if(int(out) > 0):
            ret = 'yes'
    except:
        pass
    return ret

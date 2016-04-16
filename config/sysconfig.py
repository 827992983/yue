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
        if (int(out) > 0):
            ret = 'yes'
    except:
        pass
    return ret


def getKvmVersion(engine):
    ret = "unknown"
    try:
        if engine == "qemu-kvm":
            out, err, code = utils.execShellCommand("rpm -qa|grep qemu-kvm")
        elif engine == "qemu-system-x86_64":
            out, err, code = utils.execShellCommand("qemu-system-x86_64 --version")
        else:
            pass
    except:
        pass
    return ret


def getSpiceVersion():
    ret = "unknown"
    try:
        ret, err, code = utils.execShellCommand("rpm -qa|grep qemu-kvm")
    except:
        pass
    return ret

def getUsbredirVersion():
    ret = "unknown"
    try:
        ret, err, code = utils.execShellCommand("rpm -qa|grep usbredir")
    except:
        pass
    return ret
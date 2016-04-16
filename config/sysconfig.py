#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
# Copyright: free

from yuelibs import *
import psutil


def getCpu():
    return int(psutil.cpu_percent())

def getMemory():
    mem = psutil.virtual_memory()
    percent = (mem.total-mem.free-0.1) / mem.total
    percent = percent*100
    return int(percent)

def getOsVersion():
    ret = "unknown"
    try:
        fd = open("/etc/redhat-release")
        ret = fd.readline()
        if ret.endswith("\n"):
            ret = ret[:-1]
        fd.close()
    except:
        pass

    return ret


def getKernelVersion():
    ret = "unknown"
    try:
        out, err, code = utils.execShellCommand("uname -a")
        if out.endswith("\n"):
            out = out[:-2]
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
    print engine
    try:
        if engine == "qemu-kvm":
            out, err, code = utils.execShellCommand("/usr/libexec/qemu-kvm --version")
            if out.endswith("\n"):
                out = out[:-2]
            print out
            pos = out.index("(")
            print pos
            pos1 = out.index(")")
            print pos1
            ret = out[pos+1:pos1]
            print ret
        elif engine == "qemu-system-x86_64":
            out, err, code = utils.execShellCommand("qemu-system-x86_64 --version")
            if out.endswith("\n"):
                out = out[:-2]
            ret = out
        else:
            pass
    except:
        pass
    return ret


def getSpiceVersion():
    ret = "unknown"
    try:
        out, err, code = utils.execShellCommand("rpm -qa|grep spice-server")
        if out.endswith("\n"):
            out = out[:-1]
        if len(out) > 0:
            ret = out
    except:
        pass
    return ret
#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
# Copyright: free

import os
import re
from yuelibs import errno
from yuelibs import constants
from yuelibs import utils

NETWORK = """
DEVICE=networkdevice
TYPE=Bridge
DELAY=0
STP=off
ONBOOT=yes
IPADDR=true_ip
NETMASK=true_netmask
GATEWAY=true_gateway
BOOTPROTO=none
MTU=1500
DEFROUTE=yes
NM_CONTROLLED=no
HOTPLUG=no
"""

ETHX = """
DEVICE=devicename
BRIDGE=bridgename
ONBOOT=yes
MTU=1500
NM_CONTROLLED=no
"""

DNS = 'nameserver dnsip'

def update(network='', ip='', netmask='', gateway='', dns=''):
    try:
        fd = open('/etc/sysconfig/network-scripts/ifcfg-%s' % (network), 'w')
        cfg = NETWORK.replace('networkdevice', network)
        cfg = cfg.replace('true_ip', ip)
        cfg = cfg.replace('true_netmask', netmask)
        cfg = cfg.replace('true_gateway', gateway)
        fd.write(cfg)
    except:
        return errno.ERR_CREAT_NETWORK
    finally:
        fd.close()

    try:
        fd1 = open('/etc/sysconfig/network-scripts/ifcfg-%s' % (device), 'w')
        cfg = ETHX.replace('devicename', device)
        cfg = cfg.replace('bridgename', network)
        fd1.write(cfg)
    except:
        return errno.ERR_CREAT_NETWORK
    finally:
        fd1.close()

    try:
        fd2 = open('/etc/resolv.conf', 'w')
        cf2 = DNS.replace('dnsip', dns)
        fd2.write(cfg)
    except:
        return errno.ERR_CREAT_NETWORK
    finally:
        fd2.close()
        utils.execShellCommand('service network restart')
    return errno.Success


def load(network):
    data = {}
    try:
        fd = open('/etc/sysconfig/network-scripts/ifcfg-%s' % (network), 'r')
        for line in fd:
            if line.startswith("IPADDR"):
                ip = line.split('=')
                data['ip'] = ip[1].strip()
            if line.startswith("NETMASK"):
                netmask = line.split('=')
                data['netmask'] = netmask[1].strip()
            if line.startswith("GATEWAY"):
                gateway = line.split('=')
                data['gateway'] = gateway[1].strip()
        fd.close()
        errno.Success['data'] = data
    except:
        fd.close()

    try:
        fd2 = open('/etc/resolv.conf', 'r')
        for line in fd2:
            line = line.strip()
            if line.startswith("nameserver"):
                dns = line.split(' ')
                data['dns'] = ip[-1].strip()
        fd2.write(cfg)
    except:
        return errno.ERR_CREAT_NETWORK
    finally:
        fd2.close()

    return errno.Success


def devices():
    data = []
    try:
        out, err, errcode = utils.execShellCommand("ifconfig|grep 'flag'|grep 'eth\|eno\|em'|awk '{print $1}'")
        print out
        li = out.split('\n')
        print li
        for s in li:
            if len(s) > 0:
                if s.endswith(':'):
                    s=s[:-1]
                data.append(s)
        errno.Success['data'] = data
    except:
        return errno.ERR_GET_NETWORK_DEVICE
    return errno.Success

def disable(dev):
    try:
        out, err, errcode = utils.execShellCommand("echo > /etc/sysconfig/network-scripts/ifcfg-%s" % dev)
    except:
        return errno.ERR_GET_NETWORK_DEVICE
    return errno.Success
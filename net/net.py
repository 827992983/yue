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

def update(network='', ip='', netmask='', gateway=''):
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
        fd2 = open('/etc/sysconfig/network' % (device), 'w')
        cf2 = DNS.replace('dnsip', device)
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
        errno.Success['data'] = data
    except:
        pass

    return errno.Success


def devices():
    data = []
    try:
        out, err, errcode = utils.execShellCommand("ifcfg|grep 'Ethernet'|grep 'eth\|eno\|em'|awk'{print $1}'")
        li = out.split('\n')
        for s in li:
            if len(s) > 0:
                data.append(s)
        errno.Success['data'] = data
    except:
        return errno.ERR_GET_NETWORK_DEVICE
    return errno.Success

#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import os
import re
from yuelibs import errno
from yuelibs import constants
from yuelibs import utils

class Network(object):
    def __init__(self, device, ip, netmask, gateway, dns):
        self.device = device
        self.network = "network-" + self.device
        self.ip = ip
        self.netmask = netmask
        self.gateway = gateway
        self.dns = dns

    def create(self):
        try:
            pass
        except:
            pass

        return errno.Success

    def delete(self):
        try:
            pass
        except:
            pass

        return errno.Success

    def get(self):
        try:
            pass
        except:
            pass

        return errno.Success

    def update(self):
        try:
            pass
        except:
            pass

        return errno.Success

    def CreateNic(self, name):
        try:
            pass
        except:
            pass

        return errno.Success

    def deleteNic(self, name):
        try:
            pass
        except:
            pass
        return errno.Success

    def getAllNic(self):
        try:
            pass
        except:
            pass

        return errno.Success

    def setDNS(self):
        try:
            pass
        except:
            pass

        return errno.Success

    def getDNS(self):
        try:
            pass
        except:
            pass

        return errno.Success

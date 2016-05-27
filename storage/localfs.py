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

class LocalFsStorage(object):
    def __init__(self, path='', flag=False):
        self.path = path
        self.meta = os.path.join(path, 'meta')
        self.image = os.path.join(path, 'image')
        self.template = os.path.join(path, 'template')
        if flag:
            self.delete()
            self._create()
        self.mount = self._getMount()
        self.disk = self._getDevice()
        self.all,self.free = self._getStatus()

    def _create(self):
        if len(self.path)>0 and os.path.exists(self.path):
            pass
        else:
            os.makedirs(self.path)
        if not os.path.exists(self.image):
            os.mkdir(self.image)
        if not os.path.exists(self.template):
            os.mkdir(self.template)

    def delete(self):
        try:
            if os.path.exists(self.path):
                utils.execShellCommand('rm -rf %s' % self.path)
        except:
            return errno.ERR_DELETE_STORAGE
        return errno.Success

    def getAllSpace(self):
        return self.all

    def getFreeSpace(self):
        return self.free

    def getDevice(self):
        return self.disk

    def getMount(self):
        return self.mount

    def _getStatus(self):
        cmd = 'df -h'
        out,err,errcode = utils.execShellCommand(cmd)
        out = out.split('\n')
        for line in out:
            list1 = line.split(' ')
            length = len(list1)
            for i in range(1,length):
                for elem in list1:
                    if elem==' ' or len(elem)==0:
                        list1.remove(elem)
            for elem in list1:
                if list1[-1] == self.mount:
                    return (list1[1],list1[3])
        return (0,0)

    def _getDevice(self):
        cmd = 'lsblk -l'
        out,err,errcode = utils.execShellCommand(cmd)
        out = out.split('\n')
        disk = ''
        for line in out:
            list1 = line.split(' ')
            for elem in list1:
                if elem == ' ':
                    list1.remove(elem)

            if list1[-2] == 'disk':
                disk = list1[0]
                continue

            if list1[-1] == self.mount:
                return disk


    def _isMount(self, path):
        return utils.ismount(path)

    def _getMount(self):
        path = self.path
        if path.endswith('/'):
            path = self.path[:-1]
        length = len(path)
        for i in range(1, length):
            if path.endswith("/"):
                if len(path) > 1:
                    path = path[:-1]
                    if len(path) == 1:
                        return path
                    continue
            if self._isMount(path):
                return path
        return '/'

def getIso(isopath):
    iso = []
    ret = []

    for parent, dirnames, filenames in os.walk(isopath):
        iso += filenames

    for file in iso:
        if file.endswith(".iso") or file.endswith(".ISO"):
            ret.append(file)
    return ret
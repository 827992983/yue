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
    def __init__(self, path=''):
        self.path = path
        self.delete()
        self._create()
        self.meta = os.path.join(path, 'meta')
        self.image = os.path.join(path, 'image')
        self.template = os.path.join(path, 'template')
        self.mount = self._getMount
        self.disk = self._getDevice()
        self.all,self.free = self._getStatus()

    def _create(self):
        if self.path != None and os.path.exists(self.path):
            pass
        else:
            os.mkdir(self.path, mode=0644)

        if not os.path.exists(self.image):
            os.mkdir(self.image, mode=0644)
        if not os.path.exists(self.template):
            os.mkdir(self.template, mode=0644)

    def delete(self):
        try:
            if os.path.exists(self.path):
                os.remove(self.path)
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
        for line in out:
            list1 = line.split()
            for elem in list1:
                if elem == ' ':
                    list1.remove(elem)

            print list1

            if list1[-1] == self.mount:
                return list1[1],list1[3]

    def _getDevice(self):
        cmd = 'lsblk -l'
        out,err,errcode = utils.execShellCommand(cmd)
        for line in out:
            list1 = line.split()
            for elem in list1:
                if elem == ' ':
                    list1.remove(elem)

            print list1

            if list1[-1] == self.mount:
                return list1[0]


    def _isMount(self, path):
        return utils.ismount(path)

    def _getMount(self):
        path = self.path
        for i in range(1, len(self.path)):
            while not path.endswith("/"):
                if len(path) > 1:
                    path = path[:-1]
                    continue
                else:
                    break
            if self.isMount(path):
                return path

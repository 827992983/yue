#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import os
import sys
import re
from yuelibs import errno
from yuelibs import constants
from yuelibs import utils

class LocalFsStorage(object):
    def __init__(self, path='', disk='', mount=''):
        self.path = path
        self.delete()
        self.meta = os.path.join(path, 'meta')
        self.image = os.path.join(path, 'image')
        self.template = os.path.join(path, 'template')
        self.disk = disk
        self.mount = mount

    def create(self):
        try:
            if self.path != None and os.path.exists(self.path):
                pass
            else:
                os.mkdir(self.path, mode=0644)

            if not os.path.exists(self.image):
                os.mkdir(self.image, mode=0644)
            if not os.path.exists(self.template):
                os.mkdir(self.template, mode=0644)
        except:
            return errno.ERR_CREAT_STORAGE
        return errno.Success

    def delete(self):
        try:
            if os.path.exists(self.path):
                os.remove(self.path)
        except:
            return errno.ERR_DELETE_STORAGE
        return errno.Success

    def getAllSpace(self):
        pass

    def getFreeSpace(self):
        pass

    def getDevice(self):
        pass

    def getMount(self):
        pass

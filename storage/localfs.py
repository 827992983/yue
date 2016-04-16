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
    def __init__(self, path='storage'):
        self.path = os.path.join('/opt/',path)

    def create(self):
        try:
            if self.path != None and os.path.exists(self.path):
                pass
            else:
                os.mkdir(self.path, mode=0644)

            image_path = os.path.join(self.path, 'image')
            template_path = os.path.join(self.path, 'template')
            disk_path = os.path.join(self.path, 'disk')
            os.mkdir(image_path)
            os.mkdir(template_path)
        except:
            return errno.ERR_CREATURE_STORAGE
        return self.path

    def delete(self):
        try:
            virt_engine = utils.getConfigField(
            os.system("killall -9 %s" % ())

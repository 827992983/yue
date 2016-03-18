#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import os
import sys

class Vm(object):
    """
    Vm description

    Convert to qemu command-line
    """
    def __init__(self, uuid, cpu, memory, image, spicePort, usbredir=4):
        self.__uuid = uuid
        self.__cpu = cpu
        self.__memory = memory
        self.__image = image
        self.__spicePort
        self.__usbredir = usbredir

    def __str__(self):
        pass

    def toDict(self):
        pass

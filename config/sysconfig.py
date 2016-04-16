#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
#Copyright: free

def getOsVersion():
    ret = ""
    try:
        fd = open("/etc/redhat-release")
        ret = fd.readline()
        fd.close()
    except:
        pass

    return ret

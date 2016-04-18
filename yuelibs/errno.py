#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
#date: 2016
#Copyright: free

import os
import logging

# Base errno definitions
#
Success = {'code': 0, 'msg': 'Succeed', 'data': {}}
Failed = {'code': 1, 'msg': 'Failed', 'data': {}}

# Storage errno definitions
#
ERR_CREAT_STORAGE = {'code':3001, 'msg':'create storage with error', 'data':[]}
ERR_DELETE_STORAGE = {'code':3002, 'msg':'delete storage with error', 'data':[]}

# Network errno definitions
#

# VM errno definitions
#


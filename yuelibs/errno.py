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
ERR_CREAT_STORAGE = {'code':3001, 'msg':'create storage with error', 'data':{}}
ERR_DELETE_STORAGE = {'code':3002, 'msg':'delete storage with error', 'data':{}}

# Network errno definitions
#
ERR_CREAT_NETWORK = {'code':4001, 'msg':'create network with error', 'data':{}}
ERR_DELETE_NETWORK = {'code':4002, 'msg':'create network with error', 'data':{}}
ERR_GET_NETWORK_DEVICE = {'code':4003, 'msg':'create network with error', 'data':{}}


# VM errno definitions
#
ERR_CREAT_VM = {'code':5001, 'msg':'create vm with error', 'data':{}}


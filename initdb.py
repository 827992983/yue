#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

from yue.wsgi import *
from login.models import User
from admin.models import Configure

User.objects.get_or_create(name='admin',password='123456',identify='admin')
User.objects.get_or_create(name='user',password='123456',identify='user')
Configure.objects.get_or_create(key='engine',value='qemu-kvm')
Configure.objects.get_or_create(key='display',value='spice')

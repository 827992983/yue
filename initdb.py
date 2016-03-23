#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

from yue.wsgi import *
from login.models import User

User.objects.get_or_create(name='admin',password='talk2her',identify='admin')
User.objects.get_or_create(name='user',password='talk2her',identify='user')

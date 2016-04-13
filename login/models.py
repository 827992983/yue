#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
#Copyright: free
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=20, primary_key=True)
    password = models.CharField(max_length=20)
    identify = models.CharField(max_length=20)
    email = models.CharField(max_length=20, default='')
    phone = models.CharField(max_length=20, default='')
    department = models.CharField(max_length=20,default='')

    def __unicode__(self):
        return self.name

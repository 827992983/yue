#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
# Copyright: free

from urllib import quote
from django.http import HttpResponseRedirect
from django.contrib.auth import SESSION_KEY
from django.shortcuts import render


class QtsAuthenticationMiddleware(object):
    def process_request(self, request):
        if request.path != '/login':
            if 'username' in request.COOKIES:
                print 'have login'
                pass
            else:
                print 'no login'
                return render(request, 'index.html')

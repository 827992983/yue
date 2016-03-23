#!/usr/bin/env python
# -*- coding:utf-8 -*-
# author:lijian
# date: 2016
#Copyright: free

from django import forms


class UserForm(forms.Form):
    username = forms.CharField(max_length=20)
    password = forms.CharField(max_length=20)
    identify = forms.CharField(max_length=20, initial="user")
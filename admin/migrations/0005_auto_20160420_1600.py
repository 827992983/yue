# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-04-20 16:00
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admin', '0004_auto_20160418_1533'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='storage',
            name='disk',
        ),
        migrations.RemoveField(
            model_name='storage',
            name='mount',
        ),
    ]

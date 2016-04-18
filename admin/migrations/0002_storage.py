# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-04-18 00:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Storage',
            fields=[
                ('path', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('type', models.CharField(default='', max_length=20)),
                ('disk', models.CharField(default='', max_length=20)),
                ('mount', models.CharField(default='', max_length=20)),
                ('space', models.IntegerField(default=0)),
            ],
        ),
    ]

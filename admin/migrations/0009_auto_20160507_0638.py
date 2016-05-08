# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-05-07 06:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin', '0008_vm_system'),
    ]

    operations = [
        migrations.AddField(
            model_name='vm',
            name='disk1path',
            field=models.CharField(default='', max_length=256),
        ),
        migrations.AddField(
            model_name='vm',
            name='disk2path',
            field=models.CharField(default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='vm',
            name='disk1',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='vm',
            name='disk2',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='vm',
            name='snapshotpath',
            field=models.CharField(default='', max_length=256),
        ),
        migrations.AlterField(
            model_name='vm',
            name='system',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='vm',
            name='templatepath',
            field=models.CharField(default='', max_length=256),
        ),
    ]
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Configure(models.Model):
    key = models.CharField(max_length=20, primary_key=True)
    value = models.CharField(max_length=20,default='')

    def __unicode__(self):
        return self.key

class Storage(models.Model):
    path = models.CharField(max_length=64, primary_key=True)
    type = models.CharField(max_length=20,default='')

    def __unicode__(self):
        return self.path

class Vm(models.Model):
    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=32)
    cpu = models.IntegerField()
    memory = models.IntegerFiled()
    istemplate = models.CharField(max_length=10, default='No')
    templatename = models.CharField(max_length=32, default='')
    templatepath = models.CharField(max_length=128, default='')
    nic1 = models.CharField(max_length=32, default='')
    nic2 = models.CharField(max_length=32, default='')
    disk1 = models.CharField(max_length=128, default='')
    disk2 = models.CharField(max_length=128, default='')
    snapshotname = models.CharField(max_length=32, default='')
    snapshotpath = models.CharField(max_length=128, default='')

    def __unicode__(self):
        return self.id

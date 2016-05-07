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
    user = models.CharField(max_length=32, default='admin')
    name = models.CharField(max_length=32)
    system = models.IntegerField()
    cpu = models.IntegerField()
    memory = models.IntegerField()
    istemplate = models.CharField(max_length=10, default='no')
    templatename = models.CharField(max_length=32, default='')
    templatepath = models.CharField(max_length=256, default='')
    nic1 = models.CharField(max_length=32, default='')
    nic2 = models.CharField(max_length=32, default='')
    disk1 = models.IntegerField()
    disk1path = models.CharField(max_length=256, default='')
    disk2 = models.IntegerField()
    disk2path = models.CharField(max_length=256, default='')
    snapshotname = models.CharField(max_length=32, default='')
    snapshotpath = models.CharField(max_length=256, default='')
    yourself = models.CharField(max_length=256, default='')

    def __unicode__(self):
        return self.id

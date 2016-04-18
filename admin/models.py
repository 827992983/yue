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
    disk = models.CharField(max_length=20,default='')
    mount = models.CharField(max_length=64,default='')

    def __unicode__(self):
        return self.path
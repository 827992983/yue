from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def home(request):
    return HttpResponse('this is api')

def vm(request):
    pass

def vm_status(request):
    pass

def all_vms_status(request):
    pass

def disk(request):
    pass

def all_disks(request):
    pass

def network(request):
    pass

def vm_nic(request):
    pass

def storage(request):
    pass

def storage_status(request):
    pass

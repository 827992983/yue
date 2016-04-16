from django.shortcuts import render
from django.http import HttpResponse
import json
from login.models import User
from .models import Configure
# Create your views here.

def index(request):
    return render(request, 'admin.html')

def configure(request):
    try:
        ret = {'status':0, 'msg':'configure success', 'data': {}}
        if request.method == "GET":
            print 1
            engine = Configure.objects.get(key='engine')
            display = Configure.objects.get(key='display')
            print 2
            data = {}
            data['engine'] = engine.value
            data['display'] = display.value
            print 3
            ret['data'] = data
            return HttpResponse(json.dumps(ret))
        elif request.method == "POST":
            form = json.loads(request.body)
            Configure.objects.filter(key='engine').update(value=form['engine'])
            Configure.objects.filter(key='display').update(value=form['display'])
            return HttpResponse(json.dumps(ret))
        else:
            pass
    except:
        pass

    ret = {'status': 2001, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

def changepwd(request):
    try:
        if request.method == "POST":
            print request.body
            form = json.loads(request.body)
            username = request.COOKIES['username']
            print username
            userinfo = User.objects.filter(name=username)

            if userinfo == None or len(userinfo) != 1:
                ret = {'status': 1011, 'msg': 'invalid username', 'data': {}}
                print 2
                return HttpResponse(json.dumps(ret))

            print userinfo[0].password
            if userinfo[0].password == form['old'].strip() and form['new'].strip() == form['confirm'].strip():
                ret = {'status': 0, 'msg': 'succeed', 'data': {}}
                userinfo[0].password = form['new'].strip()
                userinfo[0].save()
                return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status': 1012, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

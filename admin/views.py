from django.shortcuts import render
from django.http import HttpResponse
import json
from login.models import User
# Create your views here.

def index(request):
    return render(request, 'admin.html')


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
                print 3
                return HttpResponse(json.dumps(ret))
    except:
        pass

    ret = {'status': 1012, 'msg': 'unknown except', 'data': {}}
    return HttpResponse(json.dumps(ret))

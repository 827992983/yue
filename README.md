# yue

This is a qemu/kvm virtual management platform with python-django and spice-html5.

This software is free, but forbidding for business.

environment:

    centos7 operation system.
    chrome webbrowser.

install:

    1. install python-django(version: 1.9+), do it yourself

    2. yum -y install qemu-kvm spice-server

    3. git clone https://github.com/827992983/yue.git
    
    4. cd yue
    
    5. ./install.sh  

run:

    python manage.py runserver 0.0.0.0:8000

    default user/password:  admin/123456    user/123456

    configure in nginx or apache, you can do it.
  
contact:

   author: Abel Lee
   QQ: 827992983
   Email: 827992983@qq.com

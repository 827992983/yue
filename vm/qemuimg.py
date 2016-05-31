#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import os
import yuelibs.utils as utils

def info(image, format=None):
    cmd = "qemu-img info "

    if format:
        cmd = cmd + "-f qcow2 "

    cmd = cmd + image
    out, err, rc = utils.execShellCommand(cmd)

    if rc != 0:
        return -1

    return 0


def create(image, size=None, format=None, backing=None):
    cmd = "qemu-img create "
    cwdPath = None

    if format:
        if format == "qcow2":
            cmd = cmd + "-f qcow2 "

    if backing:
        if not os.path.exists(backing):
            return -1
        cmd = cmd + "-o backing_file=%s " % (backing,)
        cmd = cmd + " %s " % (image)
    else:
        cmd = cmd + " %s %sG" % (image, str(size))

    print cmd

    out, err, rc = utils.execShellCommand(cmd)

    if rc != 0:
        return -2

    return 0

def merge(srcimg, destimg):
    cmd = "qemu convert -O qcow2 %s %s " % (srcimg, destimg)
    print cmd
    out, err, rc = utils.execShellCommand(cmd)

    if rc != 0:
        return -1

    return 0

def check(image, format=None):
    cmd = "qemu-img check "

    if format:
        cmd = cmd + "-f %s " % format

    cmd = cmd + image
    out, err, rc = utils.execShellCommand(cmd)

    if rc != 0:
        return -2

    return 0

def convert(srcImage, dstImage, stop, srcFormat=None, dstFormat=None):
    cmd = "qemu-img convert "

    if srcFormat:
        cmd = cmd + "-f %s " % srcFormat

    cmd = cmd + " %s " % srcImage

    if dstFormat:
        cmd = cmd + "-O %s " % dstFormat

    cmd = cmd + " %s " % dstImage

    out, err, rc = utils.execShellCommand(cmd)

    if rc == 0:
        return 0
    else:
        return -1

def resize(image, newSize, format=None):
    cmd = "qemu-img resize "

    if format:
        cmd = cmd + "-f %s " % format

    cmd = cmd + " %s %s " % (image, str(newSize))
    out, err, rc = utils.execShellCommand(cmd)

    if rc != 0:
        return -1
    else:
        return 0

def rebase(image, backing, format=None, backingFormat=None, unsafe=False,
           stop=None):
    cmd = "qemu-img rebase "

    if unsafe:
        cmd = cmd + "-u "

    if format:
        cmd = cmd + "-f %s" % format

    if backingFormat:
        cmd = cmd + "-F %s" % backingFormat

    cmd = cmd + "-b %s %s " % (backing, image)

    rc, out, err = utils.execShellCommand(cmd)

    if rc != 0:
        return -1
    else:
        return 0

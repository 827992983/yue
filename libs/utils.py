#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import os
import commands
import ConfigParser
import time
import threading
import subprocess
import sys
import socket
import logging

def execShellCommand(cmd, wait=0, fast=False, verbose=False):
    """
    execute a linux shell command
    param cmd: a string, shell command
    param wait: timeout for shell execute
    """
    p = subprocess.Popen(cmd, shell=True,
                         stdout=None if verbose else subprocess.PIPE,
                         stderr=None if verbose else subprocess.PIPE)
    out, err = p.communicate()
    time.sleep(wait)
    if p.returncode != 0:
        if fast:
            sys.exit(1)
    
    return out, err, p.returncode


def checkPort(ip, port):
    """
    check the host ip port is started or not
    """
    try:
        s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        s.connect((ip,int(port)))
        s.close()
        return True
    except:
        return False

def setConfigField(filePath, field, key, value):
    """
    set cfg file field, like this:

    [field]
    key = value

    param filePath: cfg file path
    """
    try:
        fd = None
        if filePath is None or not os.path.exists(filePath):
            return False
        config = ConfigParser.ConfigParser()
        fd = open(filePath, 'r')
        config.readfp(fd)
        fd.close()
        config.set(field, key, value)
        fd = open(filePath, 'w')
        config.write(fd)
        fd.close()
    except:
        return False

    return True

def getConfigField(filePath, field, key):
    """
    get cfg file field-key's value, like this:

    [field]
    key = value

    param filePath: cfg file path
    """

    value = '' 
    try:
        fd = None
        if filePath is None or not os.path.exists(filePath):
            return value
        config = ConfigParser.ConfigParser()
        fd = open(filePath)
        config.readfp(fd)
        value = config.get(field, key)
        fd.close()
    except:
        pass
        
    return value

def timestamp():
    """
    get timestamp
    """
    return int(time.time())

def isMoounted(dev):
    """
    check this dev is mounted
    """
    cmd = "mount | grep %s| wc -l" %(dev)
    status,out = commands.getstatusoutput(cmd)
    if(int(out) > 0):
        return True
    else:
        return False

def mountdev(dev, mount_dir):
    """
    mount dev to a directory
    """
    cmd = "mount -t ext4 %s %s" %(dev, mount_dir)
    commands.getstatusoutput(cmd)

def umountdev(dev):
    """
    umount device
    """
    cmd = "umount -lf %s" %(dev)
    commands.getstatusoutput(cmd)

def getHostname():
    """
    get hostname
    """
    status,out = commands.getstatusoutput('hostname')
    return out

def touchFile(filePath):
    """
    If a file at filePath already exists, its accessed and modified times are
    updated to the current time. Otherwise, the file is created.
    :param filePath: The file to touch
    """
    with open(filePath, 'a'):
        os.utime(filePath, None)


def rmFile(fileToRemove):
    """
    Try to remove a file.
    If the file doesn't exist it's assumed that it was already removed.
    """
    try:
        os.unlink(fileToRemove)
    except OSError as e:
        if e.errno == errno.ENOENT:
            logging.warning("File: %s already removed", fileToRemove)
        else:
            logging.error("Removing file: %s failed", fileToRemove,
                          exc_info=True)
            raise


def rmTree(directoryToRemove):
    """
    Try to remove a directory and all it's contents.
    If the directory doesn't exist it's assumed that it was already removed.
    """
    try:
        shutil.rmtree(directoryToRemove)
    except OSError as e:
        if e.errno == errno.ENOENT:
            logging.warning("Directory: %s already removed", directoryToRemove)
        else:
            raise

def _parseMemInfo(lines):
    """
    Parse the content of ``/proc/meminfo`` as list of strings
    and return its content as a dictionary.
    """
    meminfo = {}
    for line in lines:
        var, val = line.split()[0:2]
        meminfo[var[:-1]] = int(val)
    return meminfo


def readMemInfo():
    """
    Parse ``/proc/meminfo`` and return its content as a dictionary.

    For a reason unknown to me, ``/proc/meminfo`` is sometimes
    empty when opened. If that happens, the function retries to open it
    3 times.

    :returns: a dictionary representation of ``/proc/meminfo``
    """
    # FIXME the root cause for these retries should be found and fixed
    tries = 3
    while True:
        tries -= 1
        try:
            with open('/proc/meminfo') as f:
                lines = f.readlines()
                return _parseMemInfo(lines)
        except:
            logging.warning(lines, exc_info=True)
            if tries <= 0:
                raise
            time.sleep(0.1)

def pidStat(pid):
    """
    get a process stat by pid
    """
    res = []
    with open("/proc/%d/stat" % pid, "r") as f:
        statline = f.readline()
        procNameStart = statline.find("(")
        procNameEnd = statline.rfind(")")
        res.append(int(statline[:procNameStart]))
        res.append(statline[procNameStart + 1:procNameEnd])
        args = statline[procNameEnd + 2:].split()
        res.append(args[0])
        res.extend([int(item) for item in args[1:]])
        # Only 44 feilds are documented in man page while /proc/pid/stat has 52
        # The rest of the fields contain the process memory layout and
        # exit_code, which are not relevant for our use.
        return STAT._make(res[:len(STAT._fields)])


def execCmd(command, sudo=False, cwd=None, data=None, raw=False,
            printable=None, env=None, sync=True, nice=None, ioclass=None,
            ioclassdata=None, setsid=False, execCmdLogger=logging.root,
            deathSignal=0, childUmask=None, resetCpuAffinity=True):
    """
    Executes an external command, optionally via sudo.

    IMPORTANT NOTE: the new process would receive `deathSignal` when the
    controlling thread dies, which may not be what you intended: if you create
    a temporary thread, spawn a sync=False sub-process, and have the thread
    finish, the new subprocess would die immediately.
    """

    command = list(command)

    if ioclass is not None:
        cmd = command
        command = [constants.EXT_IONICE, '-c', str(ioclass)]
        if ioclassdata is not None:
            command.extend(("-n", str(ioclassdata)))

        command = command + cmd

    if nice is not None:
        command = [constants.EXT_NICE, '-n', str(nice)] + command

    if setsid:
        command = [constants.EXT_SETSID] + command

    if sudo:
        if os.geteuid() != 0:
            command = [constants.EXT_SUDO, SUDO_NON_INTERACTIVE_FLAG] + command

    # warning: the order of commands matters. If we add taskset
    # after sudo, we'll need to configure sudoers to allow both
    # 'sudo <command>' and 'sudo taskset <command>', which is
    # impractical. On the other hand, using 'taskset sudo <command>'
    # is much simpler and delivers the same end result.

    if resetCpuAffinity and _USING_CPU_AFFINITY:
        command = cmdutils.taskset(command, _ANY_CPU)

    if not printable:
        printable = command

    execCmdLogger.debug("%s (cwd %s)", _list2cmdline(printable), cwd)

    p = CPopen(command, close_fds=True, cwd=cwd, env=env,
               deathSignal=deathSignal, childUmask=childUmask)
    if not sync:
        p = AsyncProc(p)
        if data is not None:
            p.stdin.write(data)
            p.stdin.flush()

        return p

    (out, err) = p.communicate(data)

    if out is None:
        # Prevent splitlines() from barfing later on
        out = ""

    execCmdLogger.debug("%s: <err> = %r; <rc> = %d",
                        "SUCCESS" if p.returncode == 0 else "FAILED",
                        err, p.returncode)

    if not raw:
        out = out.splitlines(False)
        err = err.splitlines(False)

    return (p.returncode, out, err)

def traceback(on="", msg="Unhandled exception"):
    """
    Log a traceback for unhandled execptions.

    :param on: Use specific logger name instead of root logger
    :type on: str
    :param msg: Use specified message for the exception
    :type msg: str
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapper(*a, **kw):
            try:
                return f(*a, **kw)
            except Exception:
                log = logging.getLogger(on)
                log.exception(msg)
                raise  # Do not swallow
        return wrapper
    return decorator

def tobool(s):
    """
    a value to bool
    """
    try:
        if s is None:
            return False
        if type(s) == bool:
            return s
        if s.lower() == 'true':
            return True
        return bool(int(s))
    except:
        return False



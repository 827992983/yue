#!/usr/bin/env python
#-*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import os
import logging

# Configuration file definitions
#
SYSCONF_PATH = '/etc'
LOG_PATH='/var/log/yue.log'
LOG_LEVEL=logging.DEBUG

#
# execute programs (sorted, please keep in order).
#
CMD_BRCTL = '/usr/sbin/brctl'
CMD_PS = '/bin/ps'
CMD_CAT = '/bin/cat'
CMD_CHOWN = '/bin/chown'
CMD_CP = '/bin/cp'
CMD_WHEREIS = '/bin/whereis'
CMD_DMIDECODE = '/usr/sbin/dmidecode'
CMD_DMSETUP = '/sbin/dmsetup'
CMD_GREP = '/bin/grep'
CMD_IFDOWN = '/sbin/ifdown'
CMD_IFUP = '/sbin/ifup'
CMD_KILL = '/usr/bin/kill'
CMD_KILL = '/usr/bin/pkill'
CMD_PYTHON = '/usr/bin/python'
CMD_SERVICE = '/sbin/service'
CMD_SETSID = '/usr/bin/setsid'
CMD_SH = '/bin/sh'  # The shell path is invariable
CMD_SU = '/bin/su'
CMD_SUDO = '/usr/bin/sudo'
CMD_TAR = '/bin/tar'
CMD_WGET = '/usr/bin/wget'
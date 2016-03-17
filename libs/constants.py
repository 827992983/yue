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
# External programs (sorted, please keep in order).
#
EXT_BRCTL = '/usr/sbin/brctl'
EXT_PS = '/bin/ps'

EXT_CAT = '/bin/cat'
EXT_CHOWN = '/bin/chown'
EXT_CP = '/bin/cp'

EXT_DD = '/bin/dd'
EXT_DMIDECODE = '/usr/sbin/dmidecode'
EXT_DMSETUP = '/sbin/dmsetup'

EXT_FSCK = '/sbin/fsck'
EXT_FUSER = '/sbin/fuser'

EXT_GREP = '/bin/grep'

EXT_IFDOWN = '/sbin/ifdown'
EXT_IFUP = '/sbin/ifup'
EXT_IONICE = '/usr/bin/ionice'
EXT_ISCSIADM = '/sbin/iscsiadm'
EXT_TC = '/sbin/tc'

EXT_KILL = '/usr/bin/kill'

EXT_LSBLK = '/bin/lsblk'
EXT_LVM = '/sbin/lvm'

EXT_MKFS = '/sbin/mkfs'
EXT_MKFS_MSDOS = '/sbin/mkfs.msdos'
EXT_MKISOFS = '/usr/bin/mkisofs'
EXT_MOUNT = '/bin/mount'
EXT_MULTIPATH = '/sbin/multipath'

EXT_NICE = '/bin/nice'

EXT_PERSIST = '/usr/sbin/persist'
EXT_PGREP = '/usr/bin/pgrep'
EXT_PYTHON = '/usr/bin/python'

EXT_QEMUIMG = '/usr/bin/qemu-img'

EXT_RSYNC = '/usr/bin/rsync'

EXT_SASLPASSWD2 = '/usr/sbin/saslpasswd2'

EXT_SERVICE = '/sbin/service'
EXT_SETSID = '/usr/bin/setsid'
EXT_SH = '/bin/sh'  # The shell path is invariable
EXT_SU = '/bin/su'
EXT_SUDO = '/usr/bin/sudo'

EXT_TAR = '/bin/tar'
EXT_TEE = '/usr/bin/tee'
EXT_TUNE2FS = '/sbin/tune2fs'

EXT_UDEVADM = '/sbin/udevadm'

EXT_UMOUNT = '/bin/umount'
EXT_UNPERSIST = '/usr/sbin/unpersist'

EXT_WGET = '/usr/bin/wget'


EXT_HDPARM = '/sbin/hdparm'
EXT_SYSTEMD_RUN = '/usr/bin/systemd-run'

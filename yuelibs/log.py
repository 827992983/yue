#!/usr/bin/env python
# -*- coding:utf-8 -*-
#author:lijian
#date: 2016
#Copyright: free

import logging
from constants import LOG_PATH
from constants import LOG_LEVEL

logging.basicConfig(level=LOG_LEVEL,
                    format='%(asctime)s %(filename)s %(funcName)s [line:%(lineno)d] %(levelname)s %(message)s',
                    datefmt='%a, %d %b %Y %H:%M:%S',
                    filename=LOG_PATH,
                    filemode='a')
#!/usr/bin/env python
# * coding=utf-8
# Copyright 2009 Facebook
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import os
import time

from tornado import gen
from tornado.options import define, options

define("port", default=8888, help="run on the given port", type=int)


def get_order(max_num=5):
    n, a, b = 0, 0, 1
    order = {}
    while n < max_num:
        order = {b: b}
        gen.sleep(10)
        # yield order
        print b
        a, b = b, a + b
        n = n + 1
    return order


class MainHandler(tornado.web.RequestHandler):

    @gen.coroutine
    def get(self):
        order = yield get_order()
        order = {"order": "test"}
        # time.sleep(10)
        print order
        self.write(order)
        self.finish()
        # raise gen.Return()


class BillHandler(tornado.web.RequestHandler):

    def get(self):
        base = {'baseUrl': "http://127.0.0.1:8888/"}
        self.render("bussiness/index.html")


def main():
    tornado.options.parse_command_line()
    settings = {
        'template_path': 'templates',  # 配置文件路径,设置完可以把HTML文件放置template
        'static_path'  : 'static',  # 静态文件的配置
        #     'static_url_prefix':'/sss/'   # 静态文件的前缀，在静态文件夹前面加上这个前缀
        'cookie_secret': "cookie_secret",  # cookie生成秘钥时候需提前生成随机字符串，需要在这里进行渲染
        'xsrf_cokkies' : True,  # 允许CSRF使用
    }

    application = tornado.web.Application([
        (r"/", MainHandler),
        (r"/bill", BillHandler),
    ],
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static")
    )
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()

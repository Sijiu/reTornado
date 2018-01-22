#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
@author: plainM
@file: enter.py
@time: 2018/1/22 18:15
"""

import tornado.httpserver
import tornado.web
import tornado.ioloop


class IndexHandler(tornado.web.RedirectHandler):
    def get(self):
        greeting = self.get_argument("greeting", "你好~")
        self.write(greeting + "Friendly Visitor!")


if __name__ == '__main__':
    # tornado.options.parse_command_line()
    app = tornado.web.Application([(r"/", IndexHandler)])
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8000)
    # tornado.ioloop.IOLoop.current().start()
    tornado.ioloop.IOLoop.instance().start()


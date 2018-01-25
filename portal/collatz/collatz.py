#!/usr/bin/env python
# *coding=utf-8
from time import time


class Collatz(object):

    def __init__(self):
        self.start = time()
        self.num_max = 0
        self.num = 1
        self.n_max = 0

    def find(self, m, n=1):
        if m == 1:
            return n
        if m % 2 == 0:
            return self.find(m / 2, n + 1)
        else:
            return self.find(m * 3 + 1, n + 1)

    def max_collatz(self, start_num, end_num):
        l = 1
        while self.num <= end_num:
            l = self.find(self.num, start_num)
            if l > self.n_max:
                self.num_max = self.num
                self.n_max = l
            self.num += 1
        print u'在区间 {0}- {1} 内最大数为:{2}, 最大链长为: {3}'.format(start_num, end_num, self.num_max, self.n_max)
        # print(time() - self.start)


if __name__ == '__main__':
    collatz = Collatz()
    # collatz = Collatz()
    collatz.max_collatz(13, 13)
    collatz.max_collatz(95, 97)


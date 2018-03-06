def test_yield():
    print "test yield"
    says = (yield)
    print "===", says


def fab(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        # print b
        a, b = b, a + b
        n = n + 1


if __name__ == "__main__":
    # client = test_yield()
    # client.next()
    # client.send("hello world")
    for i in fab(5):
        print i
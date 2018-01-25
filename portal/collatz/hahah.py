def func(n):
    if n%2==0:
        return n/2
    if n%2==1:
        return 3*n+1

def func_time(n):
    i = 1
    while n!=1:
        n = func(n)
        i += 1
    return i

m = 1
for num in range(12,13):
    if func_time(num)>m:
        m = func_time(num)
        m_num = num

print(m_num)
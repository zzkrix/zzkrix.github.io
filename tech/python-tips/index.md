# Python 语法糖


## 前言

作为一门优秀的脚本语言，Python 在语法层面提供了很多好玩又实用的语法，俗称`语法糖`，正确的使用这些技巧能让代码看起来更优雅，更 Pythonic，这里列举几个。

## 简化 if ... else

```python
#!/usr/bin/env python3

def main():
    animals = ['cat','dog','bird','pig']
    if "dog" in animals:
        print("dog 在列表里")
    else:
        print("dog 不在列表里")

if __name__ == '__main__':
    main()
```

以上代码明显代码行数比较多，可以简化为如下写法

```python
#!/usr/bin/env python3

def main():
    animals = ['cat','dog','bird','pig']
    print("dog 在列表里") if "dog" in animals else print("dog 不在列表里")

if __name__ == '__main__':
    main()
```

## for ... else

先看一段代码：

```python
#!/usr/bin/env python3

def main():
    flag = False

    animals = ['cat','dog','bird','pig']

    for o in animals:
        if o == "dog":
            flag = True
            break

    if flag == True:
        print("dog 在列表里")

if __name__ == '__main__':
    main()
```

代码很简单，需要使用 for 循环执行一段逻辑，如果命中某个条件，则使用一个变量 flag 做下标记，并且终止 for 循环，循环结束之后，判断 flag 是否等于 True 来执行另一段逻辑。这种场景，借助了一个额外的变量，比较啰嗦，在 Python 里有个更优雅的写法。

```python
#!/usr/bin/env python3

def main():
    animals = ['cat','dog','bird','pig']

    for o in animals:
        if o == "dog":
            break
    else:
        print("dog 不在列表里")

if __name__ == '__main__':
    main()
```

这段代码的意思就是，for 循环执行过程中，如果遇到了 break 语句，则退出 for 循环之后，就不再执行 else 部分的代码。

## with 语句

打开文件，遍历文件，然后再关闭文件句柄，我们一般会这么写

```python
#!/usr/bin/env python3

def main():
    f = open("a.txt")
    try:
        for line in f:
            print(line)
    finally:
        f.close()

if __name__ '__main__':
    main()
```

上述写法需要自己去调用 close 方法，保证句柄被正常释放。
使用 python 中的 with 方法，就不用显示的去调用 close 了，并且即使中间出现异常，也可以。

```python
#!/usr/bin/env python3

def main():
    with open("a.txt") as f:
        for line in f:
            print(line)

if __name__ '__main__':
    main()
```

> 实际上 with 方法并不是帮你调用了 close 方法，而是调用了 with 返回对象的`__exit__()`方法。

## contextlib.closing()

如果一个类实现了 close() 方法，就可以借助 with 和 contextlib.closing() 帮你自动调用 close 函数。

```python
#!/usr/bin/env python3
import contextlib

class Request(object):
    def __init__(self):
        pass

    def do(self):
        print("do something")

    def close(self):
        print("close")

def main():
    with contextlib.closing(Request()) as r:
        r.do()

if __name__ == '__main__':
    main()
```


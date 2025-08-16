# Go 内存逃逸


## 概念

所谓内存逃逸，指的是原来应该分配在栈上的变量，被分配到了堆上。

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230515165225898.png)

## 为什么需要关注内存逃逸

1. 栈上的内存不需要 GC，堆上的内存需要 GC。
2. 堆上分配的内存的效率低于栈。
3. 安全问题······？

所以内存逃逸分析有助于减少 GC 压力。

## 举例

1. 函数中申请大切片，所需内存超过了栈的限制，会被分配到堆上

```go
var slice = make([]string, 999999999999)
```

2. 函数返回了对象的指针

```go
type User struct {
    name string
}

func T() *User {
    user := new(User)
    return user
}
```

3. 函数中创建的变量，赋值给了全局变量

```go
var s []int

func T(){
    s = make([]int, 10)
    return
}
```


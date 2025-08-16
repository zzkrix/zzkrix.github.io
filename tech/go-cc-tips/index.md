# Go 编译 tips


## `go build -ldflags`

有如下示例代码：

```Go
package main

import (
    "fmt"
)

var Version = "undefined"

func main() {
    fmt.Println("Version:", Version)
}
```

第一种用法：

```shell
$ go run main.go
Version: undefined

$ go run -ldflags '-X main.Version=1.0' main.go
Version: 1.0
```

第二种用法：

```shell
"-X main.Version=`{shell cmd}`"
```

```shell
$ git rev-parse HEAD
90cb4c8a3376b967960a2185b3acc669734f5e33

$ go run -ldflags "-X main.Version=`git rev-parse HEAD`" main.go
Version: 90cb4c8a3376b967960a2185b3acc669734f5e33
```

## `go build -trimpath`

参数`-trimpath`可以去除 GOPATH，在打印日志和 panic 信息时有用。

有如下示例代码

```golang
package main

func main() {
    panic("err")
}
```

直接`go build`：

```shell
$ go build && ./demo
panic: err

goroutine 1 [running]:
main.main()
    /Users/admin/demo/main.go:4 +0x25
```

加参数`-trimpath`后：

```shell
$ go build -trimpath && ./demo
panic: err

goroutine 1 [running]:
main.main()
    demo/main.go:4 +0x25
```

## `CGO_ENABLED=0 go build`

默认情况下，通过`go env`看到`CGO_ENABLED=1`的设置，表示不将程序依赖的 libc 一起编译到可执行文件，一般情况下没有问题，但是在使用 docker 的时候经常会遇到程序运行不起来，并且一般报的错误是`not found`, 编译时设置`CGO_ENABLED=0`环境变量即可解决。

例如：

```shell
CGO_ENABLED=0 go build main.go
```

## `go vet ./...`

用来检测一些基础或常见错误，比如 fmt.Printf("%d", "hello")，字符串当数字 print

## `go build -race`

用来进行静态竞争检测


# Go 竞态检测


## 方法

[https://www.pengrl.com/p/41755/](https://www.pengrl.com/p/41755/)

```go
# 编译出带检测的程序
$go build -race

# 跑 test 时带检测功能
$go test -race

# 直接允许也可以添加
$go run -race main.go
```

该方法是运行时检测，而非静态代码检测。跑 test 和跑程序时都可以添加该参数来检测。

## 运行时额外消耗

一般来说，内存会增加 5 到 10 倍，执行时间增加 2 到 20 倍。

个人建议在开发环境对性能要求不高时可默认打开 race，在项目达到一定阶段，也可以打开 race 跑一些压测做检查。


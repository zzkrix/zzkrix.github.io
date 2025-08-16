# Go 时区问题


## UTC

UTC（Coordinated Universal Time），即协调世界时，对应的是格林尼治标准时间。
国内位于东八区，和 UTC 相差 8 小时，所以时间转换时需要考虑时区问题。

字符串格式的时间 （比如 "2023-09-01 11:22:33"），转换成 golang 的 `time.Time`时默认得到的是 UTC 时间。

## 标准库

默认的 `time.Parse`在标准库中的实现如下：
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230917141853665.png)

如果要指定时区，需要用到函数 `time.LoadLocation`，它在标准库中的实现如下：
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230917141814051.png)

其中入参 name 的取值可以用命令 `timedatectl list-timezones`来查看：
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230917141908371.png)

除了上述可选的入参外，还有一个特殊参数“Local”，表示让程序根据所在机器的默认时区进行转换。传入“Local”可以使代码更加标准，兼容性更强，但是有些老六不改系统时区，就比较坑了。所以要么你直接写死“Asia/Shanghai”，要么记得使用“timedatectl set-timezone Asia/Shanghai”修改系统时区（注意这里为什么不是 Asia/Beijing？我也不知道······它就是没有这个参数）。

## 测试

以下测试代码，可以看出来加上时区后的效果：

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // 待转换的日期字符串
    timeStr := "2023-09-01 11:22:33"

    fmt.Println("======parseTime:")
    {
        t, err := parseTime(timeStr)
        if err != nil {
            panic(err)
        }

        fmt.Println(t.Location())
        fmt.Println(t.String())
        fmt.Println(t.Unix())
    }

    fmt.Println("======parseTimeWithLocation:")
    {
        t, err := parseTimeWithLocation(timeStr)
        if err != nil {
            panic(err)
        }

        fmt.Println(t.Location())
        fmt.Println(t.String())
        fmt.Println(t.Unix())
    }
}

// 带时区的转换
func parseTimeWithLocation(timeStr string) (time.Time, error) {
    // l, err := time.LoadLocation("Asia/Shanghai")
    l, err := time.LoadLocation("Local")
    if err != nil {
        return time.Time{}, err
    }

    return time.ParseInLocation("2006-01-02 15:04:05", timeStr, l)
}

// 默认时间转换
func parseTime(timeStr string) (time.Time, error) {
    return time.Parse("2006-01-02 15:04:05", timeStr)
}
```

如果不知道自己的时区，可以使用命令 `timedatectl status`看下对应的时区：
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230917141705536.png)


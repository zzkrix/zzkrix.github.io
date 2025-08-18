# Linux 命令备忘录


## awk

awk 指定多个分隔符 `awk -F '[;:]'`（使用`;`或`:`进行分割）

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231212230106796.png)

```bash
获取最后一列
awk '{print $NF}'
```

## find

`find . -type f -name "*.png" -exec ls -l {} \;`

> `{}` 是一个替换符，表示前面找到的内容
> `\;` 是`exec`的默认结尾标识符

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231213090218543.png)

`find /sys/devices/virtual/net -name iflink -exec grep -H -w 11 {} \;`

> grep 增加`-H`选项后，可以显示文件名

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231214091431297.png)

如果目录下有软连接的外部文件夹，默认 find 不会显示软连接里的内容，如果需要可以加上`-L`，但是注意，如果软连接有循环，则会不停的输出，慎用，比如：
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231214092531133.png)

## xargs

```
# xargs -t # 在执行前先打印处要执行的命令
# xargs -I {} # 设置一个符号{}表示管道前面的某一行输出内容，以便后续复杂命令进行替换
# xargs -P `nproc` # 并发数，默认为 1，如果置 0 表示让 xargs 使用尽可能多的并发数，这里`nproc`是 cpu 核数

docker ps -q | xargs -t -I {} docker exec {} sh -c "find /sys -name iflink | xargs grep -w 14"

等价于

# 最后的 grep -H 表示查找到内容后显示对应的文件名
docker ps -q | xargs -t -I {} docker exec {} sh -c "find /sys -name iflink | xargs -I {} grep -w 14 {} -H"
```

## grep

或运算：

`-E` 参数加上`|`

`lsof -i | grep -E 'epc-ims:|IPv6'`

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231213161825123.png)

与运算：

实际上就是正则`.+`表示任意 N 个字符

`lsof -i | grep -E "8323.+38911"`

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231213161727296.png)

## lsof

> lsof = list open file

```bash
-i  # 查看网络
-c  # 某进程打开的文件
-p  # 某进程号打开的文件
-r  # 重复执行时间间隔，单位秒
-n  # 将出现的主机名转换成 IP 显示
```

`lsof -i tcp`

`lsof -i udp`

`lsof -n -i tcp`

`lsof -c 进程名`

`lsof -p pid`

`lsof -r 1` 每秒执行一次

## curl

自动重定向：

```bash
curl qq.com -L
```

只显示请求头：

```bash
curl qq.com -I
```

添加请求头：

```bash
# 请求头的名字最好都按规范首字母大写
curl 192.168.190.1 -H "Host: a.b.c" -H "User-Agent: Chrome"
```


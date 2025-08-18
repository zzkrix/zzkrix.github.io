# rsync 文件同步


rsync(remote sync)，即远程同步，不过也可用于本地文件同步，通常在增量更新的场景下比 scp 更快更方便。

rsync 常用参数：

```shell
-a     包含了-rtplgoD
-r     同步目录时要加上，类似 cp 时的-r 选项
-v     同步时显示一些信息，让我们知道同步的过程
-l     保留软连接
-L     加上该选项后，同步软连接的源文件（若另外一台机器里没有源文件，则同步软件连接过去也是无效的）
-p     保持文件的权限属性
-o     保持稳健的属主
-g     保持稳健的属组
-D     保持设备文件信息
-t     保持文件的时间属性
-P     显示同步过程，比如速率，比-v 更详细
-u     如果目标中的文件比源文件还有新，则不同步，以目标文件中新的为主
-z     传输时压缩（加快传输速度，节省带宽）
--delete      删除目标目录中源目录里没有的文件
--exclude     过滤指定文件，如--exclude "logs"会把文件名包含 Logs 的文件或者目录过滤掉不同步
```

最常用的几种方式：

普通同步：

```shell
rsync -avr mylocaldir root@192.168.1.100:/path/to/dst/
```

同步并删除远端多余的文件：

```shell
rsync -avr --delete mylocaldir root@192.168.1.100:/path/to/dst/
```

如果远端文件日期比较新，则不覆盖：

```shell
rsync -avr -u mylocaldir root@192.168.1.100:/path/to/dst/
```

忽略某些本地文件：

```shell
rsync -avr -u mylocaldir --exclude aaa* --exclude bbb* root@192.168.1.100:/path/to/dst/
```


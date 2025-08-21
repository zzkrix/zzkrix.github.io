# Oracle 服务器使用块存储


## 背景

之前用[Oracle 永久免费套餐](https://www.oracle.com/cn/cloud/free/)申请到一台服务器，默认只有 40G 的磁盘存储空间。

注意到免费套餐里有块存储，研究了一下怎么挂载到服务器里，记录如下。

## 创建块存储

控制台 -> 存储 -> 块存储卷：

![2025-02-19-21-19-dZ0WB9](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-19-21-19-dZ0WB9.png)

点击创建存储卷，随便起一个名字，其他默认就行。

备份策略有需要的话可以选择，也是免费的。

![2025-02-19-21-22-PHY7pH](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-19-21-22-PHY7pH.png)

## 挂载块存储

创建好块存储后，在创建好的快存储详情页面，选择“附加的实例” -> “附加到实例”。

选择要挂载到的实例，“设备路径”选一个与你目标机器不冲突的目录即可。

![2025-02-19-21-29-khYk0z](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-19-21-29-khYk0z.png)

然后跳转到目标实例，查看“附加的块存储卷”，在对应的块存储卷上选择“iSCSI 命令和信息”

![2025-02-19-21-39-D2438w](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-19-21-39-D2438w.png)

复制“连接”里面的命令，到目标实例去执行。

![2025-02-19-21-42-MayNcn](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-19-21-42-MayNcn.png)

![2025-02-19-21-44-Z6bFQD](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-19-21-44-Z6bFQD.png)

执行 `fdisk -l` 可以看到多出来一块`/dev/sdb`（记住这个名字，后面用） 的新磁盘。

```bash
$ fdisk -l
...

Disk /dev/sdb: 50 GiB, 53687091200 bytes, 104857600 sectors
Disk model: BlockVolume
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 1048576 bytes
```

对新磁盘`/dev/sdb`格式化。

```bash
$ fdisk /dev/sdb

输入 n # 开始格式化

输入 p # 设置为主分区

按三次回车，默认即可

输入 w 保存
```

![2025-02-19-21-55-6ZVS2E](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-19-21-55-6ZVS2E.png)

再次执行`fdisk -l`看到已经分区为`/dev/sdb1`。

```bash
$ fdisk -l
...
Device     Boot Start       End   Sectors Size Id Type
/dev/sdb1        2048 104857599 104855552  50G 83 Linux
```

```bash
# 进行格式化
$ mkfs.ext4 /dev/sdb1

# 创建一个挂载目录并进行挂载
$ mkdir /mnt/blockVolume01

$ mount /dev/sdb1 /mnt/blockVolume01
```

执行`df -h`看到已经挂载成功。

![2025-02-19-22-08-nufJeQ](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-19-22-08-nufJeQ.png)

## 设置开机自动挂载

编辑`/ets/fstab`，在最后一行加上如下内容，设置为开机自动挂载，OK，搞定了。

```bash
/dev/sdb1 /mnt/blockVolume01 ext4 defaults,_netdev,nofail  0 0
```

注意事项：

> `_netdev,nofail` 在“iSCSI 命令和信息”里面 Oracle 已经提示了这两个选项要加上。
>
> `_netdev` 表示这是一个依赖网络的挂载，挂载操作需要在网络服务启动后再进行（oracle 的这个块存储默认是用网络访问的）。
>
> `nofail` 表示即使挂载失败，也不会影响系统启动。


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/oracle-block-volume/  


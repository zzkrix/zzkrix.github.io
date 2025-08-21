# 查看机器上的网卡


使用`ip a`或者`ifconfig`区分不出来网卡和网桥。

使用`ls -l /sys/class/net`可以判断
包含`virtual`的应该都是虚拟网桥。
包含`pci`的都是物理网卡。

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231211140333396.png)

如何区分网桥和虚拟设备对 `brctl show`：

> 第一列是网桥
> 最后一列是虚拟设备对
> ![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231214103530867.png)

更多关于虚拟设备对参考：[查找虚拟设备对对端位置](查找虚拟设备对对端位置.md)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/linux-net-show/  


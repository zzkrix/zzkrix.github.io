# 查找虚拟设备对对端位置


主要依赖两个文件，这两个文件在宿主机和容器内都有

```bash
# 某虚拟设备对在`当前`机器 / 容器的 ID 编号
/sys/devices/virtual/net/***/ifindex

# 某虚拟设备对在`对方`机器 / 容器的 ID 编号
/sys/devices/virtual/net/***/iflink
```

以虚拟设备`vethdedb37c`为例：
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231214110714291.png)

`ip link show vethdedb37c`显示内容`14: vethdedb37c@if13:...`，`14`表示当前机器的设备 ID，`@if13`中的`13`是对端的 ID。

`docker ps -q | xargs -t -I {} docker exec {} sh -c "find /sys -name iflink | xargs grep -w 14"`

查找所有容器，看谁的`iflink`值为`14`

定位到虚拟设备另一端在容器`0a469babdbc9`。

也可以用`ethtool -S vethdedb37c`看到对端的 ID 是`13`
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231214110211657.png)

命令解释：[xargs](../命令/xargs.md)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/linux-veth-locate/  


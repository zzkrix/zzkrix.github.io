# Oracle 服务器使用 netboot 重装系统


## 简介

oracle 免费服务器不支持在界面上更换操作系统，这里借助第三方工具[boot.netboot.xyz](https://boot.netboot.xyz)重装。

对于不能 ssh 登录的机器参考这个：[https://ooly.cc/archives/linux/361/](https://ooly.cc/archives/linux/361/)

忘记密码参考：[https://iweec.com/731.html](https://iweec.com/731.html)

## 下载 netboot

amd：

```bash
cd /boot/efi/EFI
wget https://boot.netboot.xyz/ipxe/netboot.xyz.efi
```

arm

```bash
cd /boot/efi/EFI
wget https://boot.netboot.xyz/ipxe/netboot.xyz-arm64.efi
```

## 启动 cloud shell 连接

在实例详情里选择 `控制台连接` -- `启动 Cloud Shell 连接`
等待显示`For more information about troubleshooting ...`即可。
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231207140247071.png)

## 重新引导实例

选择`重新引导` -- `强制重新引导实例`

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231207140418750.png)

在下方的 Cloud Shell 里按几下`ESC`，进入`BIOS`后选择 `Boot Maintenance Manager` -- `Boot From File` -- `<EFI>`，再找到对应的 netboot 文件，回车。
选择`Linux Network Installs`，后续安装操作系统即可。
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231207142703010.png)

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231207141414693.png)

## 忘记密码

在 bios 设置之后，直接启动，然后在启动虚拟机出现启动菜单的时候就按“e”键进入编辑选项，选择第一项！

按方向下键一直到倒数第二行，修改两处，首先将 ro 改为 rw，即只读改为可读写权限，然后在尾部加入 init=/bin/sh 这个文件修改时候小心一点！

然后按 Ctrl+x。

执行 passwd 命令，修改 root 密码，密码要输入两次要求两次密码要一致。

执行命令 exec /sbin/init 来正常启动，或者用命令 exec /sbin/reboot 重启就 OK 了。


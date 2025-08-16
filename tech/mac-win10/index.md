# Mac 安装 Windows 双系统


使用 Mac 的”启动转换助理“安装 windows 双系统时，走到最后一步了，出现如下错误：

Windows 无法更新计算机的启动配置，安装无法继续。

![2024-08-04-12-40-pyYSEB](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-04-12-40-pyYSEB.png)

搜索了一圈，有说需要重置 SMC 的，有说打电话问 Apple 客服的，这两个方案都试了，无效。

一开始的镜像是从 <https://msdn.itellyou.cn/> 上随便找了个 win10 下载的，猜测是选的镜像版本太老，有些驱动不支持导致的，所以直接去微软官方下载了最新的 win10 版本，问题解决。
![2024-08-04-12-57-bkHJ7q](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-08-04-12-57-bkHJ7q.png)

微软官方 win10 下载地址：<https://www.microsoft.com/zh-cn/software-download/windows10ISO>


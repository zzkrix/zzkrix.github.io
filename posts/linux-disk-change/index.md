# Linux 修改磁盘大小


根目录下可用磁盘大小为 22G，实际物理磁盘有 46.58G，vgs 可看到还有 21.76（50%）的空间没被使用。

扩展逻辑卷，并将`VFree`的空间全部分配逻辑卷`/dev/mapper/ubuntu--vg-ubuntu--lv`

> 这个命令将逻辑卷扩展到卷组中的所有可用空间。如果你只想分配部分可用空间，可以使用 `-L` 选项并指定具体的大小，例如 `-L +10G` 表示增加 10GB。
> ext4 文件系统使用`resize2fs`
> xfs 文件系统使用 `xfs_growfs`

```bash
lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv

resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231207153606709.png)

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231207153720420.png)

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231207153836612.png)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/linux-disk-change/  


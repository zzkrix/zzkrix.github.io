# 文件权限


![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231212164637559.png)

文件类型 -- 属主 -- 属组 -- 其他用户

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231212165251576.png)

可读（4）
可写（2）
可执行（1）

755 表示只有属主有读写执行权限，其他人只能读 (4) 和执行 (1)

除了数字另一种表示方法：
可读（r）
可写（w）
可执行（x）

用户：user（u）
组：group（g）
其他人：other（o）

`chmod a-x file` 表示把所有人对该文件的执行权限收回

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231212221016093.png)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/linux-file-perm/  


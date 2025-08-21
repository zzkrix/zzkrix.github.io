# docker 仓库


## 配置自定义仓库地址

Linux 下创建并修改 `/etc/docker/daemon.json`

```bash
{
  "registry-mirrors": [
    "https://a.b.c",
  ],
  "insecure-registries": [
    "192.168.199.100:5000"
  ]
}
```


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/docker-repo/  


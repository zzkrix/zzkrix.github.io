# k3s 镜像重写


## 背景

在 k3s 中部署应用时，因为网络等原因，常遇到有些镜像拉不下来。

如果有私有仓库的话，可以手动把镜像放入私有仓库，让 k3s 去私有仓库拉取。

## 方案

k3s 有一个镜像重写的配置，可以在不改变应用部署文件的情况下，自动修改镜像拉取地址。

通过修改文件 `/etc/rancher/k3s/registries.yaml`如下：

```yaml
mirrors:
  "*":
    endpoint:
      - "https://your-private-repo.com"
      - "https://hub.docker.com"
configs:
  "your-private-repo.com":
    auth:
      username: admin
      password: 123456
    tls:
      cert_file: /etc/harbor/cert/your-private-repo.com.crt
      key_file: /etc/harbor/cert/your-private-repo.com.key
      ca_file: /etc/harbor/cert/ca.crt
```

mirrors 里的"\*" 表示匹配所有镜像请求，即所有容器镜像的拉取请求都会首先尝试从 <https://your-private-repo.com> 下载，如果不可用则退回到 <https://hub.docker.com>。

其中 mirrors 可以配置多项：

```yaml
mirrors:
  "docker.io":
    endpoint:
      - "https://your-private-repo.com"
  "k8s.gcr.io":
    endpoint:
      - "https://your-private-repo.com"
  "quay.io":
    endpoint:
      - "https://your-private-repo.com"
      - "https://hub.docker.com"
```

## 参考资料

<https://docs.k3s.io/installation/private-registry>


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/k3s-registries-image/  


# 释放 docker 占用空间


## 前言

使用下面的命令可以释放 docker 产生的无用的空间。

## 清理未使用的构建缓存

`docker builder prune -a`

```bash
$ docker help builder prune

Usage:  docker builder prune

Remove build cache

Options:
  -a, --all                  Remove all unused build cache, not just dangling ones
      --filter filter        Provide filter values (e.g. "until=24h")
  -f, --force                Do not prompt for confirmation
      --keep-storage bytes   Amount of disk space to keep for cache
```

## 清理未使用的镜像

`docker image prune -a`

```bash
$ docker help image prune

Usage:  docker image prune [OPTIONS]

Remove unused images

Options:
  -a, --all             Remove all unused images, not just dangling ones
      --filter filter   Provide filter values (e.g. "until=<timestamp>")
  -f, --force           Do not prompt for confirmation
```

## 清理未使用的挂载

`docker volume prune -a`

```bash
$ docker help volume prune

Usage:  docker volume prune [OPTIONS]

Remove unused local volumes

Options:
  -a, --all             Remove all unused volumes, not just anonymous ones
      --filter filter   Provide filter values (e.g. "label=<label>")
  -f, --force           Do not prompt for confirmation
```

## 其他

`docker network prune` - 清理未使用的网络（注意：包含 stop 状态容器相关的网络，慎用）


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/docker-prune/  


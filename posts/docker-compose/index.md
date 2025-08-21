# docker compose


> docker 命令里已经集成了 compose，所以尽量使用 docker compose 而不是 docker-compose

出于数据安全考虑，`docker compose` 和 `docker`一样，默认不会删除存储卷，如果想删除，可以使用以下命令
删除镜像和存储卷

```bash
# 删除存储卷
$ docker compose down -v

# 删除存储卷以及镜像
$ docker compose down --rmi all -v
```

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20231211153920580.png)

注意：

- 使用`docker compose up -d`启动后，如果`docker-compose.yaml`所在的目录名或路径发生变化，`docker compose down`时会失败。
- 如果想让`docker compose down`执行的快一些，可以使用`-t`参数来控制等待的秒数。


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/docker-compose/  


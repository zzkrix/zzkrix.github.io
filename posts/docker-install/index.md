# docker 安装


## 在线安装 docker

```bash
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun
```

## 离线安装 docker

下载：

```bash
# 从这里下载离线安装包
https://download.docker.com/linux/static/stable/

# 比如
wget https://download.docker.com/linux/static/stable/x86_64/docker-28.1.1.tgz
```

解压：

```
tar -zxvf docker-28.1.1.tgz
sudo cp docker/* /usr/bin/
```

将 docker 注册成系统服务：

```bash
vim /etc/systemd/system/docker.service

[Unit]
Description=Docker Application Container Engine
Documentation=https://docs.docker.com
After=network-online.target firewalld.service
Wants=network-online.target
[Service]
Type=notify
ExecStart=/usr/bin/dockerd
ExecReload=/bin/kill -s HUP $MAINPID
LimitNOFILE=infinity
LimitNPROC=infinity
TimeoutStartSec=0
Delegate=yes
KillMode=process
Restart=on-failure
StartLimitBurst=3
StartLimitInterval=60s
[Install]
WantedBy=multi-user.target

```

设置开机自启动：

```bash
systemctl daemon-reload
systemctl enable docker.service
systemctl start docker
```

## 其他

建立 `docker` 组：

```bash
sudo groupadd docker
```

将当前用户加入 `docker` 组：

```bash
sudo usermod -aG docker $USER
```


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/docker-install/  


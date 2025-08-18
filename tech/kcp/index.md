# 使用 kcptun 拯救我的 Oracle


## 背景

有一个首尔的甲骨文云服务器，ssh 访问超级慢，甚至连不上。

搭了一个 kcptun 服务，用 scp 传文件测试，速度提升了 3 倍，记录一下。

![kcptun](https://github.com/xtaci/kcptun/raw/master/assets/kcptun.png)

## kcptun 服务端

安装 kcptun：

```bash
curl -L  https://raw.githubusercontent.com/xtaci/kcptun/master/download.sh | sh
```

配置 kcptun-server 开机自启动：

```bash
$ cat /lib/systemd/system/kcptun-server.service
[Unit]
Description=kcptun Service
After=network-online.target

[Service]
ExecStart=/home/opc/workspace/kcp-server/kcp-server.sh
Restart=always
RestartSec=3

[Install]
WantedBy=default.target

$ cat /home/opc/workspace/kcp-server/kcp-server.sh
#!/bin/bash

kcptun-server \
  --listen :<SERVER-PORT> \ # 修改成想要监听的端口
  --target 127.0.0.1:22 \
  --key <YOUR-PRIVATE-KEY> \ # 自定义一个认证密码
  --crypt salsa20 \
  --mode fast2 \
  --nocomp

$ systemctl enable kcptun-server
$ systemctl daemon-reload
$ systemctl start kcptun-server
```

## kcptun 客户端

安装 kcptun：

```bash
brew install kcptun
```

配置 kcptun-client 开机自启动：

```bash
$ cat ~/Library/LaunchAgents/com.user.kcptun-client.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.user.kcptun-client</string>

    <key>ProgramArguments</key>
    <array>
      <string>/bin/bash</string>
      <string>/Users/YourName/.local/autorun/kcptun-client.sh</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>StandardOutPath</key>
    <string>/tmp/kcptun.out.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/kcptun.err.log</string>

  </dict>
</plist>

$ cat ~/.local/autorun/kcptun-client.sh
#!/bin/env zsh

/opt/homebrew/bin/kcptun_client \
  --localaddr :<SERVER-PORT>\
  --remoteaddr <SERVER-IP>:<SERVER-PORT>\
  --key <YOUR-PRIVATE-KEY> \
  --crypt salsa20 \
  --mode fast2 \
  --nocomp

$ launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.user.kcptun-client.plist

# ⚠️ 如果之前有同名脚本的话，需要先 bootout 一下
$ launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.user.kcptun-client.plist
```

## 参考资料

<https://github.com/xtaci/kcptun>

<https://www.zhihu.com/tardis/zm/art/112442341?source_id=1003>


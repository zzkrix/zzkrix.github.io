# 本地部署大模型


## 部署 ollama

ollama 是一个运行大模型的框架，这里选择使用 docker 的方式启动 ollama:

```bash
docker run -d -v ./ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

启动成功后，选择想要的模型，这里以阿里通义千问最小的模型 (352M) 为例：

```bash
docker exec -it ollama ollama run qwen2:0.5b
```

![2024-07-25-16-58-kdplRx](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-07-25-16-58-kdplRx.png)

运行起来后，可以在命令行进行交互，输入`/bye` 或 `ctrl + c` 退出。

> 更多模型可在这里找： [https://ollama.com/library](https://ollama.com/library)

## 部署 Open WebUI

有很多开源的 UI 库允许你从浏览器访问模型，这里以 [Open WebUI](https://openwebui.com/) 为例，更多工具请参考：<https://github.com/ollama/ollama/tree/main?tab=readme-ov-file#web--desktop>

```bash
# OLLAMA_BASE_URL 替换成你机器的 IP 地址，例如： OLLAMA_BASE_URL=http://192.168.1.110:11434
docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v ./open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

然后浏览器访问 3000 端口即可，用户名密码随便注册一个即可。

默认是无限制注册的，可以登录后在设置里禁用掉。

点击右上角头像 --- 管理员面板 --- 设置

![2024-07-25-16-59-LzEDUu](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-07-25-16-59-LzEDUu.png)

## 其他

测试环境为一台无显卡的 oracle 服务器 ( 4 核 24G )。
跑大小为 8G 的模型 (llama3.1)，平均每秒输出 4 个字符，勉强能用，再大的就跑不了了。

如果选择不使用 docker 部署 ollama, 想修改 ollama 的模型存储路径以及监听地址的话，需要修改文件 `/etc/systemd/system/ollama.service`

```bash
[Unit]
Description=Ollama Service
After=network-online.target

[Service]
# 修改模型存储路径， 默认为 /usr/share/ollama/.ollama
Environment="OLLAMA_MODELS=/data/ollama"

# ollama 监听地址，默认为 127.0.0.1
Environment="OLLAMA_HOST=0.0.0.0"

ExecStart=/usr/bin/ollama serve
User=ollama
Group=ollama
Restart=always
RestartSec=3

[Install]
WantedBy=default.target
```

修改完以后记得执行：

```bash
systemctl daemon-reload
systemctl enable ollama
```

参考资料：

<https://hub.docker.com/r/ollama/ollama>

<https://github.com/ollama/ollama>


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/ollama-llama/  


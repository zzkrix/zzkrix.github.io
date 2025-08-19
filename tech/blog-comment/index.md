# 为博客添加评论系统


## 介绍

一般的博客主题都支持添加评论系统，常见方案如下：

- gitalk：依托 github issue，评论者需要登陆 github 账号。
- disqus： php 的，不喜欢。
- valine：不开源，主要是需要实名认证，垃圾。
- waline：支持私有化部署 & 开源👍。

这里选择使用自部署的[waline](https://waline.js.org/)作为博客评论系统。

## 安装

```dockerfile
# docker-compose.yml
version: "3"

services:
  waline:
    image: lizheming/waline:latest
    restart: always
    ports:
      - "127.0.0.1:8360:8360"
    volumes:
      - ${PWD}/data:/app/data
    environment:
      TZ: "Asia/Shanghai"
      SITE_NAME: "避风港"
      SITE_URL: "https://zzkrix.com"
      SECURE_DOMAINS: "zzkrix.com,www.zzkrix.com" # 仅来自这些网站的评论
      AUTHOR_EMAIL: "zzkrix56@gmail.com"
      LEVELS: "0,10,20,50,100,200" # 按评论数划分用户等级
      IPQPS: 5 # 基于 IP 的评论发布频率限制，单位为秒。设置为 0 不限制
      PG_HOST: postgres
      PG_PORT: 5432
      PG_DB: waline
      PG_USER: postgres
      PG_PASSWORD: 123456
      TG_BOT_TOKEN: "" # telegram 消息通知机器人 token
      TG_CHAT_ID: "" # telegram 消息通知 channel/group 等的 ID
    depends_on:
      - postgres

  postgres:
    image: postgres:9.6
    restart: unless-stopped
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
      - ./data/postgres:/var/lib/postgresql/data
      - /etc/timezone:/etc/timezone
      - /etc/localtime:/etc/localtime
    environment:
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: waline
      POSTGRES_USER: postgres
    expose:
      - "5432:5432"
```

修改 docker-compose.yaml 中的配置，重点是下面几项：

```bash
SITE_URL: "https://zzkrix.com"
SECURE_DOMAINS: "zzkrix.com,www.zzkrix.com"
AUTHOR_EMAIL: "zzkrix56@gmail.com"
```

waline 评论数据持久化支持很多数据库：[官方文档](https://waline.js.org/guide/database.html)。

我的是 arm 的服务器，用 mysql 有点问题：

> mysql8 报错：不支持的认证类型。
>
> mysql5.6 没有 arm 版本 docker 镜像。

所以这里选择 pg。将[waline.pgsql](https://github.com/walinejs/waline/blob/main/assets/waline.pgsql)下载到本地，命名为 `init.sql`

启动：

```bash
docker compose up -d
```

## 使用

> 需要暴露评论系统到公网，这里使用的是[cloudflre 的内网穿透](https://www.zzkrix.com/tech/cloudflare-zero-trust/)。

在自己的博客配置文件中找到 waline 配置项，一般只需要填写评论系统的地址即可。

我用的是[DoIt](https://github.com/HEIGE-PCloud/DoIt)，关键配置如下：

```toml
[params.page.comment]
enable = true

[params.page.comment.waline]
enable = true
serverURL = "https://comment.zzkrix.com"
pageview = true
comment = true
```

访问`https://<SERVER>/ui/register`可以进行评论系统用户注册，默认第一个注册的是管理员。

访问`https://<SERVER>/ui` 可以登陆到管理后台，管理评论（删除、审核、置顶等操作）。

自己编译镜像[参考文档](https://github.com/walinejs/waline/blob/main/docs/src/guide/deploy/vps.md)。

更多配置参考[官方文档](https://waline.js.org/)。

## 评论通知

当有新增评论时，waline 支持邮件、微信、telegram 等通知。

这里以 tg 为例，创建和使用 tg 机器人：[waline 官方文档](https://waline.js.org/guide/features/notification.html#telegram-%E9%80%9A%E7%9F%A5)。

访问 [BotFather](https://t.me/BotFather)，依次按提示输入`/newbot` -- `bot 名称（随意可修改）`-- `bot 标识（全网唯一，不可修改，以 Bot 或_bot 结尾）`。

然后就能拿到新建的机器人 api token（valine 配置中的 `TG_BOT_TOKEN`），类似如下形式： `12345678:asdhASDH_aahjJUSKLJHGH`

创建 channel，将刚创建的机器人添加为该 channel 管理员。

然后在 channel 里随便发一条消息。

访问 `https://api.telegram.org/bot<token>/getUpdates`（将`token`替换为机器人 token）。

相应内容中的 chat.id 就是 valine 配置文件里的 `TG_CHAT_ID`。

然后在 docker-compose 中填写上两个环境变量 `TG_BOT_TOKEN`和`TG_CHAT_ID`即可。

```json
{
  "ok": true,
  "result": [
    {
      "update_id": 41000699,
      "channel_post": {
        "message_id": 2,
        "sender_chat": {
          "id": -1001212121212,
          "title": "评论通知",
          "type": "channel"
        },
        "chat": {
          "id": -1001212121212,
          "title": "评论通知",
          "type": "channel"
        },
        "date": 1755573595,
        "text": "88888888"
      }
    }
  ]
}
```


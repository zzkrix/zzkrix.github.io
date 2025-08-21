# Mac 下使用 iterm2 配置 ssh


## 前言

连接远程服务器的工具有很多，使用人数最多的两款非 xshell 和 SecureCRT 莫属，但是这两款一个不支持 Mac，一个收费，破解版又不敢装。

比较简单的替代方案是使用[iterm2](https://iterm2.com/)。

目前网上介绍最多的是以下两种方式实现的自动登录：

- `shell 脚本 + expect + iterm2 触发器`
- `shell 脚本 + sshpass`

这两种方式都显得很蹩脚，还得用 shell 脚本。
而且密码还明文暴露在 shell 脚本里。
对密码和 shell 不敏感的小伙伴自己去搜下怎么实现的吧，此处不推荐。

这里介绍的方式是`纯使用 iterm2`实现，可以做到不暴露明文密码，配置非常简单，像使用 xshell 一样丝滑。

## 演示

1. `cmd + o` 打开服务器列表，方向键选择要登录的机器，回车，提示输入密码；
2. `option + cmd + f`打开密码管理器，方向键选择密码，回车，即可登录；（这一步通过配置触发器其实可以省略，后面有介绍）
3. 此时若重复步骤 1，借助 ssh 会话复制已不需要输入密码。

![2024-01-21-22-36-cHyImd](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-01-21-22-36-cHyImd.gif)

## 配置

### 添加服务器

点击`iterm2`-`Preferences`-`Profiles`，按图示配置一个新的 profile。

![2024-01-21-22-33-gpHsMn](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-01-21-22-33-gpHsMn.jpg)

### 配置密码管理器

点击 `iterm2`-`Window`-`Password Manager`，按图示配置一个密码，配置完后可按`ESC`键关闭该窗口。
![2024-01-21-22-34-W8Zk3V](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-01-21-22-34-W8Zk3V.jpg)

### 配置触发器

找到对应`Profiles`里面的`Advanced`选项，找到`Triggers`，点击`Edit`

![2024-01-21-22-34-sQ8NZx](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-01-21-22-34-sQ8NZx.jpg)

配置成如下图所示，这样当执行`cmd + o`时，就只需要选择机器，回车后，就能自动弹出密码了，不再需要`option + cmd + f`这个操作：

> 第一列表示当终端出现哪些字符的时候触发这个配置
>
> 第二列是触发动作，这里选择打开密码管理器
>
> 第三列是定位到密码管理器里面的哪个密码配置
>
> 后面两列不知道什么意思······都选上了

![2024-01-21-22-53-Trm8Tx](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-01-21-22-53-Trm8Tx.jpg)

### 配置 SSH 会话复制、会话保持

使用过 SecureCRT 和 Xshell 的同学都知道有个 session copy 的功能，其实 ssh 本身就支持这个，只需在`~/.ssh/config`文件里添加几行配置即可。

```bash
# 会话复制相关配置
Host *
    ControlMaster auto
    ControlPath ~/.ssh/%r@%h:%p.socket

    ControlPersist yes
    ServerAliveInterval 10 # 每隔 10s 发一次心跳
    ServerAliveCountMax 3  # 三次心跳没响应则关闭连接
```

## 其他

![2024-01-21-22-35-ZBg3vl](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-01-21-22-35-ZBg3vl.jpg)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/mac-iterm2-ssh/  


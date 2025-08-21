# reset-ssh-key


如果服务器端 ssh 看起来一切正常，22 端口也正常，但是客户端 ssh 连接不上，通常报错类似下面这样：

```bash
$ ssh fast@10.1.8.16
Connection closed by 10.1.8.16 port 22
```

这种情况可通过重置服务端 ssh 证书解决，命令如下：

```bash
# Delete old ssh host keys
$ rm /etc/ssh/ssh*host*\*

# Reconfigure OpenSSH Server
$ dpkg-reconfigure openssh-server

# Update all ssh client(s) ~/.ssh/known_hosts files
```

参考资料：h<https://serverfault.com/questions/471327/how-to-change-a-ssh-host-key>


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/reset-ssh-key/  


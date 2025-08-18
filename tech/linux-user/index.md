# 用户和用户组


## 参考

[https://www.runoob.com/linux/linux-user-manage.html](https://www.runoob.com/linux/linux-user-manage.html)
[https://www.cnblogs.com/carriezhangyan/p/10552496.html](https://www.cnblogs.com/carriezhangyan/p/10552496.html)

useradd 是一个 linux 命令，但是它提供了很多参数在用户使用的时候根据自己的需要进行设置；
adduser 是一个 perl 脚本，在使用的时候会出现类似人机交互的界面，提供选项让用户填写和选择，这个命令比起 useradd 来说比较简单，也比较傻瓜。

## adduser

```bash
# adduser git
Adding user `git' ...
Adding new group `git' (1004) ...
Adding new user `git' (1004) with group `git' ...
Creating home directory `/home/git' ...
Copying files from `/etc/skel' ...
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
Changing the user information for git
Enter the new value, or press ENTER for the default
        Full Name []:
        Room Number []:
        Work Phone []:
        Home Phone []:
        Other []:
Is the information correct? [Y/n] y# ls /homegit # grep git /etc/passwdgit:x:1004:1004:,,,:/home/git:/bin/bash
```

## useradd（不建议使用）

```bash
useradd 有大量的参数供我们进行个性化设置。useradd 的参数如下：
-c 备注 加上备注。并会将此备注文字加在/etc/passwd 中的第 5 项字段中
-d 用户主文件夹。指定用户登录所进入的目录，并赋予用户对该目录的的完全控制权
-e 有效期限。指定帐号的有效期限。格式为 YYYY-MM-DD，将存储在/etc/shadow
-f 缓冲天数。限定密码过期后多少天，将该用户帐号停用
-g 主要组。设置用户所属的主要组
-G 次要组。设置用户所属的次要组，可设置多组
-M 强制不创建用户主文件夹
-m 强制建立用户主文件夹，并将/etc/skel/当中的文件复制到用户的根目录下
-p 密码。输入该帐号的密码
-s shell。用户登录所使用的 shell
-u uid。指定帐号的标志符 user id，简称 uid
useradd 这个命令创建的是普通账号，并不能用来登录系统。
```


# Mac 下为 Python 安装 mysqlclinet


如果直接执行`pip install mysqlclient`，会报错，需要先安装依赖：

```bash
brew install mysql-client

# 必须加这个环境变量，否则后面 pip 安装还是会报错，可以将这个加到 ~/.bash_profile 或者 ～/.zshrc 中
export PKG_CONFIG_PATH="$(brew --prefix)/opt/mysql-client/lib/pkgconfig"
```

然后再执行：

```bash
pip install mysqlclient
```


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/mac-python-mysqlclinet/  


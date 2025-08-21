# 命令行启动 wireshark 抓包


只启动 wireshark

> Mac 下启动多个 wireshark 实例时使用，但可能不稳定

```bash
/Applications/Wireshark.app/Contents/MacOS/Wireshark

或者

open -n /Applications/Wireshark.app
```

启动 wireshark 并且直接开始抓包：

> 目标机器需要安装 apt install dumpcap

```bash
cd /Applications/Wireshark.app/Contents/MacOS && ssh root@10.1.8.1 'dumpcap -w - -f "not port 22"' -i vmbr1 | ./Wireshark -k -i -
```


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/wireshark-cmdline/  


# 临时修改网卡地址


```bash
# enp22s0f3 是网卡名

# 添加
ip addr add 192.168.0.1/16 dev enp22s0f3

#删除
ip addr del 192.168.0.1/16 dev enp22s0f3
```


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/linux-ip-addr/  


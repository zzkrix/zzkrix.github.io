# 保持局域网 dns 在 clash tun 模式中有效


![img](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-08-13-19-28-07-f2okbr.jpg)

打开 clash 设置界面，在"订阅"-"全局扩展脚本"中右键，编辑该文件，填入下面的代码。

> ⚠️ 注意
>
> 1. 将 `+.private.com` 替换成你自己局域网的域名后缀，多个域名后缀可以在数组中追加。
> 2. 将 `YOUR-PRIVATE-DNS` 替换成你自己局域网的 dns server 地址。

```js
// Define main function (script entry)

function main(config, profileName) {
  config.dns ??= {};
  config.dns["nameserver-policy"] ??= {};

  ["+.private1.com", "+.private2.com"].forEach(
    (d) => (config.dns["nameserver-policy"][d] = "YOUR-PRIVATE-DNS"),
  );

  return config;
}
```


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/clash-tun-lan-dns/  


# 借助 Cloudflare 实现高速内网穿透


## 背景

之前做内网穿透都是用 [frp](https://github.com/fatedier/frp)，架构如下：

![2025-04-07-15-10-nQi19R](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-04-07-15-10-nQi19R.png)

但前提是你需要有一个具备公网 IP 的服务器用来部署服务端。

并且想高速上传下载的的话，还得花不少钱买云厂商的带宽。

今天介绍一个不使用服务器就可以实现的方案。

只需要一个 cloudflare 账号和一个域名即可，也基本没有带宽限制。

## 配置

### 准备域名

注册 cloudflare 账号，登录<https://dash.cloudflare.com/>。

在首页`域注册`里面，选择`注册域`：

![2025-04-07-15-15-v7Makw](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-04-07-15-15-v7Makw.png)

搜索自己喜欢的域名，选择好后，购买即可（这里支持使用 visa 卡或者普通借记卡，或者 paypal 等），cloudflare 的域名比较便宜，一般一年不到 10 美元。

### 配置 Zero Trust

在 cloudflare 主页找到`Zero trust`。

接下来选择一个免费套餐，点击支付进入下一步。

在`网络` ---> `Tunnels`里选择 `添加隧道`。

![2025-04-07-15-24-AEKFfA](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-04-07-15-24-AEKFfA.png)

之后选择`Cloudflared`，随便起个名字，点击`保存隧道`。

然后根据你内网的环境类型，获取客户端安装命令，去你需要被代理的机器上执行。

![2025-04-07-15-29-9pFGPf](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-04-07-15-29-9pFGPf.png)

然后点击上面的`公共主机名`，去配置公网域名，填写刚才购买的域名和你内网要代理的地址，这里我用的测试地址是 <http://192.168.1.165:8000>

![2025-04-07-15-56-xNTvYz](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-04-07-15-56-xNTvYz.png)

之后就可以在浏览器通过配置的域名访问到你的内网服务了，Okk～。

![2025-04-07-15-40-IEK2d4](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-04-07-15-40-IEK2d4.png)


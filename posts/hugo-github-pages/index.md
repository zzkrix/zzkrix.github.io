# 使用 hugo+github 部署静态博客


## 前言

介绍如何创建一个自动构建的静态网站，并且将博客源文件 （markdown、主题配置等） 与 public 静态目标文件分开存放。

## Hugo

> hugo 有两个版本，标准版和扩展版，建议直接使用扩展版，以便更好的兼容大多数主题。

```bash
CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest
```

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20240120230411304.png)

基本使用：

```bash
# 初始化一个 hugo 项目
$ hugo new site myblog && cd myblog

# 下载主题
$ git init && git submodule add --depth 1 https://github.com/reuixiy/hugo-theme-meme.git themes/meme

# ... 参照 https://github.com/reuixiy/hugo-theme-meme 进行配置

# 生成静态网站文件（public 文件夹）
$ hugo

或者

# 启动一个本地的 web 服务，可用浏览器访问 http://localhost:1313 查看效果
$ hugo server
```

## Github

为了能使用 [github pages](https://pages.github.com/)，需要创建一个`公开仓库`，用来存放编译好的静态文件，仓库名必须为`<username>.github.io` ，`username`是你的`github 账户名`，后面会通过`github actions`自动将私有仓库生成的网站内容推送到该仓库，但在自动化之前，需要先有一个对该仓库有读写权限的 token。

访问 [https://github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) 将创建后得到的 token 保存备用，具体配置见下图：

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20240120232234674.png)

再创建一个仓库来存放博客源文件，仓库名随意，本文中用`myblog`代替，推荐配置成私有仓库。

进入刚创建的`myblog`，依次选择`settings` - `Secrets and variables` - `Actions`，点击`New repository secret`，将刚才创建的 token 配置给变量`PERSONAL_TOKEN`。

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20240120233618490.png)

在`myblog`里新建文件`.github/workflows/hugo.yml`

> 示例中的配置只需要改两行（33、37 行）
>
> 33 行需要改成你自己的仓库
>
> 如果你有自己的域名的话，在配置好域名的 cname 后，可以配置第 37 行，否则删掉第 37 行。

`hugo.yml`内容如下：

```yaml
name: deploy

on:
  push:
  workflow_dispatch:
  # schedule:
  # Runs everyday at 8:00 AM
  # - cron: "0 0 * * *"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: "latest"
          extended: true

      - name: Build Web
        run: hugo

      - name: Deploy Web
        uses: peaceiris/actions-gh-pages@v3
        with:
          PERSONAL_TOKEN: ${{ secrets.PERSONAL_TOKEN }}
          EXTERNAL_REPOSITORY: <username>/<username>.github.io
          PUBLISH_BRANCH: main
          PUBLISH_DIR: ./public
          commit_message: ${{ github.event.head_commit.message }}
          cname: www.YOUR_DOMAIN.com
```

在`myblog`里新建文件`.gitignore`内容如下：

```bash
public/*
resources/*
```

在`myblog`里配置好 hugo，`git push`后就可以自动触发上面的 workflow，等到 `<username>.github.io`中出现 hugo 生成的静态文件，等待一会，就可以通过`<username>.github.io`或者你自己的域名访问你的网站了。

## 更多

关于怎么配置 cname，参考 [这里](https://www.pseudoyu.com/zh/2022/05/29/deploy_your_blog_using_hugo_and_github_action/)。


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/hugo-github-pages/  


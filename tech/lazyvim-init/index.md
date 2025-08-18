# lazyvim 简介


## 预览

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-08-03-18-55-05-Azmm13.jpg)

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-08-03-18-52-57-FJ05Cf.jpg)

## 安装

lazyvim 是一个集成了实用插件的 neovim 配置集。

稍微配置一下就是一个好用的 IDE。

前置条件 & 安装步骤：

> <https://www.lazyvim.org/#%EF%B8%8F-requirements>
>
> <https://www.lazyvim.org/installation>

## 常用快捷键

> default `<leader>` is `<space>`

### 基本操作

| 快捷键               | 描述                                |
| -------------------- | ----------------------------------- |
| `<leader><leader>`   | 快速搜索文件                        |
| `<leader>ff`         | 同上                                |
| `<leader>fb`         | 搜索`buffer`                        |
| `<leader>ft`         | 打开`terminal`                      |
| `ctrl /`             | `打开` / `隐藏` `terminal`          |
| `ctrl ww`            | 焦点在各窗口之间切换                |
| `ctrl w` + `h/j/k/l` | 焦点移动到 ⬅️/⬇️/⬆️/➡️ 侧窗口       |
| `shift h`            | 移动到 ⬅️ 侧 buffer 标签            |
| `shift l`            | 移动到 ➡️ 侧 buffer 标签            |
| `shift k`            | 浮窗显示函数文档                    |
| `<leader>qq`         | 退出 nvim (quit all)                |
| `s` + 任意字符串     | 快速搜索定位，类似 vimium 的搜索    |
| `<leader>cd`         | 在 lsp 警告提示上执行可以看完整信息 |
| `<leader>xx`         | 可以在窗口中查看所有 lint 提示信息  |
| `<leader>cs`         | 显示函数/类大纲                     |
| `<leader>n`          | 查看 notify （通知消息） 历史       |
| `<leader>l`          | 打开 `lazy.vim` 窗口                |
| `<leader>cm`         | 打开 `mason` 窗口                   |
| `<leader>gg`         | 打开 `lazygit` 窗口                 |

### 文件管理器

| 快捷键               | 描述                            |
| -------------------- | ------------------------------- |
| `<leader>e`          | 打开或关闭文件管理器            |
| `Esc`                | 隐藏文件管理器                  |
| `shift h`            | 控制隐藏文件显示                |
| `a`                  | `add`新建文件或文件夹 （/结尾） |
| `c`                  | `copy` 文件                     |
| `m`                  | `move` 文件 / 重命名            |
| `r`                  | `rename`重命名文件              |
| `d`                  | `delete` 删除文件 / 目录        |
| `shift v` 选中后 `y` | 多选文件 / 目录                 |
| `shift h`            | 显示隐藏文件                    |

### jetbrains 对照

| 快捷键              | 描述                         | jetbrains 快捷键  |
| ------------------- | ---------------------------- | ----------------- |
| `gd`                | 跳转到定义处                 | `cmd b`           |
| `gr`                | 显示引用                     | `cmd b`           |
| `ctrl o / ctrl + i` | 跳转回原处                   | `cmd opt <- / ->` |
| `<leader>/`<br>     | 全局关键字搜索               | `cmd shift f`     |
| `<leader>sg`        | 全局关键字搜索               | cmd shift f       |
| `<leader>cr`        | 变量名重构                   | `shift f6`        |
| `zM`                | 折叠所有函数体               | `cmd shift -`     |
| `zR`                | 展开所有函数体               | `cmd shift +`     |
| `za`                | 折叠/打开当前函数体          | `cmd -`           |
| `zo`                | 展开当前函数体               | `cmd +`           |
| `zc`                | 折叠当前函数体               | -                 |
| `gc`                | `多行` 注释/取消注释         | `cmd /`           |
| `gcc`               | `单行` 注释/取消注释         | `cmd /`           |
| `:%s/old/new/g`     | 当前文件替换                 | `cmd r`           |
| `<leader>sr`        | 批量查找替换                 | `shift cmd r`     |
| `<leader>sr \c`     | 退出替换窗口                 | -                 |
| `<leader>sr \r`     | 执行 `replace`               | -                 |
| `<leader>sr \s`     | 执行 `sync`，效果同`replace` | -                 |

### 其他

自用配置： <https://github.com/zzkrix/dotfiles/tree/main/nvim>

vim 快捷键： <https://www.zzkrix.com/tech/vim-shortkeys/>


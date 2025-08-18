# 命令行内容输出到剪贴板


Mac:

```bash
// 将输出复制至剪贴板
$ echo "hello" | pbcopy

// 将文件中的内容全部复制至剪贴板
$ pbcopy < remade.md

// 将剪切板中的内容粘贴至文件
$ pbpaste > remade.md
```

Linux:

```bash
# 需要带界面的才能用，apt install xclip
$ echo "hello" | xclip
```


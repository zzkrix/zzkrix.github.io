# 解决 vscode 终端乱码


我的终端使用的是 zsh，在 vscode 里打开时显示有乱码。

解决办法是在 `settings.json` 中加入：

```json
"terminal.integrated.fontFamily": "MesloLGS NF",
```


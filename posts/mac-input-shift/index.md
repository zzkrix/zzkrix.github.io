# Mac 原生输入法配置


## 背景

出于信任问题，手机上切换成 iPhone 自带输入法好多年了，无奈因为使用习惯问题 Mac 上一直用的搜狗输入法（实际上只是自带输入法无法实现 shift 切换中英文的小问题）。今天终于研究了下，完美解决。

Mac 原生的中英文切换是 Caps Lock 键。

但 Caps Lock 除了使用不习惯外，更重要的是，即使习惯了也不能解决下面这个情况：

我期望在按完 shift 后，能把 golang 这个字符出现在搜索框里，一般的输入法都是这个逻辑，但 Mac 不行。
![2024-03-22-15-52-HcAOE0](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-03-22-15-52-HcAOE0.png)

## 解决方案

使用知名改键神器：[Karabiner-Elements](https://karabiner-elements.pqrs.org/)

找到下图位置，添加自定义规则：
![2024-03-22-15-21-sqktgV](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-03-22-15-21-sqktgV.png)

输入以下内容：

```json
{
  "description": "Use left_shift to switch input sources",
  "manipulators": [
    {
      "conditions": [
        {
          "bundle_identifiers": [
            "^com\\.teamviewer\\.TeamViewer$",
            "^com\\.vmware\\.horizon$",
            "^com\\.vmware\\.fusion$",
            "^com\\.vmware\\.view$",
            "^com\\.parallels\\.desktop$",
            "^com\\.parallels\\.vm$",
            "^com\\.parallels\\.desktop\\.console$",
            "^org\\.virtualbox\\.app\\.VirtualBoxVM$",
            "^com\\.citrix\\.XenAppViewer$",
            "^com\\.vmware\\.proxyApp\\.",
            "^com\\.parallels\\.winapp\\."
          ],
          "type": "frontmost_application_unless"
        }
      ],
      "from": {
        "key_code": "left_shift",
        "modifiers": {
          "optional": ["caps_lock"]
        }
      },
      "parameters": {
        "basic.to_if_alone_timeout_milliseconds": 200,
        "basic.to_if_held_down_threshold_milliseconds": 200
      },
      "to": [
        {
          "key_code": "left_shift",
          "lazy": true
        }
      ],
      "to_if_alone": [
        {
          "key_code": "spacebar",
          "modifiers": "control"
        }
      ],
      "to_if_held_down": [
        {
          "key_code": "left_shift"
        }
      ],
      "type": "basic"
    }
  ]
}
```

然后在下图设置处，使其对自带键盘生效：
![2024-03-22-15-22-DLzJf4](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-03-22-15-22-DLzJf4.png)

嗯······舒服了～

![2024-03-22-16-35-EOfzwf](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2024-03-22-16-35-EOfzwf.gif)

## 参考资料

[https://idawnlight.com/2022/use-left-shift-to-switch-input-sources-on-macos/](https://idawnlight.com/2022/use-left-shift-to-switch-input-sources-on-macos/)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/mac-input-shift/  


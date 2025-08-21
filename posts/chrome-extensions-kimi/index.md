# 浏览器插件 - kimi 历史会话清理助手


## 背景

[kimi](https://kimi.ai/) 是一个国内的 AI 工具，平时用的比较多。

但是，历史会话只能一个一个删除，没有批量删除的功能。

通过抓包分析感觉不复杂，顺便用 [trae](https://www.trae.ai/) 试试能不能写一个 chrome 插件。

需求如下：

- [x] 插件仅在 kimi 官方页面有效
- [x] 能一键清除所有历史记录
- [x] 能清除自定义时间范围内的会话记录

## 实现

项目目录结构如下：

```bash
├── 128.png
├── background.js
├── content.js       // 核心的处理逻辑
├── icons            // 项目使用到的 icon
│   ├── 128.png
│   ├── 16.png
│   ├── 32.png
│   └── 48.png
├── manifest.json   // 项目配置
├── popup.html      // 使用插件时弹出的配置页面代码
└── popup.js        // 配置页面对应的 js 代码
```

其中的`manifest.json`是必需的，是整个项目的配置文件，其他文件名随意，配置文件如下：

```js
{
    "manifest_version": 3,
    "name": "kimi 历史会话清理助手",
    "version": "1.0.0",
    "description": "一键清理 Kimi AI 的历史会话记录。",
    "icons": {
        "16": "icons/16.png",
        "32": "icons/32.png",
        "48": "icons/48.png",
        "128": "icons/128.png"
    },
    "permissions": ["activeTab", "tabs", "cookies"],
    "host_permissions": ["https://kimi.ai/*", "https://kimi.moonshot.cn/*"],
    "action": {
        "default_popup": "popup.html"
    },
    "content_scripts": [
        {
            "matches": ["https://kimi.ai/*", "https://kimi.moonshot.cn/*"],
            "js": ["content.js"]
        }
    ]
}
```

配置文件解释参考： [https://developer.chrome.com/docs/webstore/prepare?hl=zh-cn](https://developer.chrome.com/docs/webstore/prepare?hl=zh-cn)

本插件入口文件为`popup.html`，对应的是点击插件时弹出的配置界面。

![2025-03-30-22-03-i9JCAL](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-03-30-22-03-i9JCAL.png)

其中用户点击`清理历史会话`按钮后执行的核心代码如下：

```js
// 检查是否在对应的页面
if (!isValidKimiTab(tab)) {
  showStatus("请在 Kimi 的历史会话页面使用此插件", "error");
  return;
}

// 获取用户配置的参数
const { startTime, endTime } = getTimeRange();
const domain = new URL(tab.url).hostname;
const cookies = await chrome.cookies.getAll({ domain });

// 通过 chrome.tabs.sendMessage 把对应的参数传给 content.js
const response = await chrome.tabs.sendMessage(tab.id, {
  action: "clearAllHistory",
  domain,
  cookies,
  timeRange: { startTime, endTime },
});

// 等待处理结果
if (response && !response.success) {
  throw new Error(response.error || "未知错误");
}
```

`content_scripts`配置项中的含义是：

只有在 `https://kimi.ai` 或者 `https://kimi.moonshot.cn`开头的 url 页面中，才执行核心代码，这里对应的是`content.js`。

其中的核心代码如下：

```js
// 通过 chrome.runtime.onMessage.addListener 监听来自 popup 的消息
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "clearAllHistory") {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      // 如果有 cookies，添加认证信息
      if (message.cookies && message.cookies.length > 0) {
        const authToken = message.cookies.find((c) => c.name === "kimi-auth");
        if (!authToken) {
          throw new Error("未找到认证信息，请确保已登录");
        }
        headers["Authorization"] = `Bearer ${authToken.value}`;
        headers["Cookie"] = message.cookies
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
      }

      // 循环获取所有历史记录
      let allItems = [];
      let offset = 0;
      const pageSize = 50;

      while (true) {
        const response = await fetch(
          `https://${message.domain}/api/chat/list`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              kimiplus_id: "",
              offset: offset,
              q: "",
              size: pageSize,
            }),
          },
        );

        const data = await response.json();

        if (
          !data.items ||
          !Array.isArray(data.items) ||
          data.items.length === 0
        ) {
          break;
        }

        allItems = allItems.concat(data.items);
        offset += pageSize;

        // 添加适当的延迟，避免请求过于频繁
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 执行删除操作
      await deleteHistoryItems(
        message.domain,
        headers,
        allItems,
        message.timeRange,
      );
      sendResponse({ success: true });
    } catch (error) {
      console.error("发生错误：", error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});
```

## 测试

在 chrome 浏览器地址栏中输入 `chrome://extensions/` 进入插件管理界面。

界面右上角`打开开发者模式`。

然后选择`加载已解压的扩展程序`，选择插件项目的文件夹即可加载插件。

登录 kimi 官网就可以调试自己的插件了。

## 上架

调试好后，觉得没问题，就可以尝试上架 chrome 应用商店。

如果是首次开发 chrome 插件，需要在「[这里](https://developer.chrome.com/docs/webstore/register?hl=zh-cn)」先注册开发者账号。

注册时需要填写支付信息，并且需要一次性支付 5 美元。

然后将自己插件的文件夹压缩成`.zip`文件。

在「[这里](https://developer.chrome.com/docs/webstore/publish?hl=zh-cn)」填写插件信息进行上架，等待审核即可。

## 其他

插件市场：

- [x] [Chrome](https://chromewebstore.google.com/detail/kimi-%E5%8E%86%E5%8F%B2%E4%BC%9A%E8%AF%9D%E6%B8%85%E7%90%86%E5%99%A8/pjjimhcohddafofeloikfbpbbejkoiff?hl=zh-CN&utm_source=ext_sidebar)
- [x] [Edge](https://microsoftedge.microsoft.com/addons/detail/kimi-%E5%8E%86%E5%8F%B2%E4%BC%9A%E8%AF%9D%E6%B8%85%E7%90%86%E5%99%A8/pgnnclhebjklcndnhejgknnmclpaoghn)

项目源码： <https://github.com/zzkrix/kimi-history-cleaner>

生成 icon：<https://www.bitbug.net/>

图片像素调整： <https://www.iloveimg.com/zh-cn/crop-image>


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/chrome-extensions-kimi/  


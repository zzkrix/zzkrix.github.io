# 浏览器跨域请求机制


![2025-02-11-17-16-XR4S9O](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-11-17-16-XR4S9O.png)

## 浏览器同源策略

同源策略是浏览器的一个安全功能。简单来说，它是一种限制不同“源”之间相互访问资源的规则。“源”主要包括协议（比如 http、https）、域名（如 example.com、another - site.com）和端口号（像 80、443 等）。如果这三个要素都相同，就被认为是同源的。

举个例子，假设你有两个网站，一个是 `http://www.example.com`，另一个是`http://shop.example.com`。虽然它们的域名主体部分相似，但由于子域名不同（一个是“www”，一个是“shop”），它们就被认为是不同源的。再比如，`http://www.example.com:80` 和 `http://www.example.com:3000`，因为端口号不同，也是不同源的。

## 为什么要使用同源策略

安全是主要原因。想象一下，如果没有同源策略，一个恶意网站就可以随意访问其他网站的用户数据。例如，一个不怀好意的网页可能会获取你在银行网站上的账户信息。
`http://www.bank.com`，它保存了用户的账户余额等重要信息。同时还有一个购物网站隐私和财产安全就会受到严重威胁。

比如，有一个银行网站 `http://www.bank.com`，它保存了用户的账户余额等重要信息。同时还有一个购物网站 `http://www.shop.com`。如果没有同源策略限制，购物网站的脚本就可以去获取银行网站的数据，这样用户的隐私和财产安全就会受到严重威胁。

## 跨域解决方案

由于业务需求，有时候需要跨域访问资源。比如，一个前端应用需要从后端的另一个域名下的 API 获取数据。为了解决这个问题，有一些方法。

CORS（跨域资源共享） ：这是一种由浏览器实施的安全机制允许的跨域访问方式。服务器可以在响应头中添加一些特定的头部信息，告诉浏览器允许哪些源进行跨域访问。例如，服务器可以在响应头中设置 `Access-Control-Allow-Origin`，这个头部信息可以指定允许访问的源，如 `Access-Control-Allow-Origin: http://www.client-allowed.com`。

JSONP（已逐渐被淘汰） ：这是一种早期的跨域解决方案。它利用了 `<script>` 标签可以跨域加载的特性，通过动态创建 `<script>` 标签来请求数据。不过它有一些安全和局限性问题，所以现在一般推荐使用 CORS。

## 测试代码

后端 server1.go:

> go run server1.go

```golang
package main

import (
    "fmt"
    "log"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

// 自定义中间件，记录请求头和响应头
func LogHeaders() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 记录请求头
        requestHeaders := c.Request.Header
        log.Println("Request Headers:")
        for k, v := range requestHeaders {
            fmt.Printf("\t%s: %v\n", k, v)
        }
        fmt.Printf("\n\n")

        // 继续处理请求
        c.Next()

        // 记录响应头
        responseHeaders := c.Writer.Header()
        log.Println("Response Headers:")
        for k, v := range responseHeaders {
            fmt.Printf("\t%s: %v\n", k, v)
        }
        fmt.Printf("\n\n")

    }
}

func main() {
    r := gin.Default()

    // 打印请求/响应头
    r.Use(LogHeaders())

    // 配置 CORS 中间件
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:9999", "http://localhost:8000"} // 允许的前端源
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
    r.Use(cors.New(config))

    // 定义一个简单的 GET 路由
    r.GET("/data", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "This is Server 1",
            "data":    "Some data from Server 1",
        })
    })

    // 启动服务端 1
    log.Println("Server 1 is running on :8081")
    r.Run(":8081")
}
```

后端 server2.go:

> go run server2.go

```golang
package main

import (
    "fmt"
    "log"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

// 自定义中间件，记录请求头和响应头
func LogHeaders() gin.HandlerFunc {
    return func(c *gin.Context) {
        // 记录请求头
        requestHeaders := c.Request.Header
        log.Println("Request Headers:")
        for k, v := range requestHeaders {
            fmt.Printf("\t%s: %v\n", k, v)
        }
        fmt.Printf("\n\n")

        // 继续处理请求
        c.Next()

        // 记录响应头
        responseHeaders := c.Writer.Header()
        log.Println("Response Headers:")
        for k, v := range responseHeaders {
            fmt.Printf("\t%s: %v\n", k, v)
        }
        fmt.Printf("\n\n")

    }
}

func main() {
    r := gin.Default()

    // 打印请求/响应头
    r.Use(LogHeaders())

    // 配置 CORS 中间件
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:9999"} // 允许的前端源
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
    r.Use(cors.New(config))

    // 定义一个简单的 GET 路由
    r.GET("/data", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "message": "This is Server 2",
            "data":    "Some data from Server 2",
        })
    })

    // 启动服务端 1
    log.Println("Server 2 is running on :8082")
    r.Run(":8082")
}
```

前端 index.html：

> python3 -m http.server

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CORS Example</title>
  </head>
  <body>
    <h1>CORS Example</h1>
    <button id="fetchData">Fetch Data</button>
    <div id="result"></div>

    <script>
      document
        .getElementById("fetchData")
        .addEventListener("click", async () => {
          try {
            // 请求服务端 1 简单请求
            const response1 = await fetch("http://localhost:8081/data", {
              method: "GET",
              headers: {},
            });
            const data1 = await response1.json();
            console.log("Response from Server 1:", data1);

            // 请求服务端 2 非简单请求
            const response2 = await fetch("http://localhost:8082/data", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data2 = await response2.json();
            console.log("Response from Server 2:", data2);

            // 显示结果
            document.getElementById("result").innerHTML = `
                    <p>Server 1: ${data1.message}</p>
                    <p>Server 2: ${data2.message}</p>
                `;
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        });
    </script>
  </body>
</html>
```

测试结果：

![2025-02-11-16-22-JDGTlL](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-11-16-22-JDGTlL.png)

当在浏览器中点击`Fetch Data`的时候，server1 收到了一个 GET 请求，server2 收到的是 OPTIONS 请求，并且返回了 403。

这是因为：

- 请求 server1 的是`简单请求`，浏览器直接放行了。请求到达 server1 时，中间件通过读取请求头中的`Origin`，得知请求来自`http://localhost:8000`，且`http://localhost:8000`被允许跨域访问，所以正常响应了该请求，返回了 200。

- 请求 server2 时，浏览器判断这个请求是`非简单请求`，需要先发送一个`预检请求 OPTIONS`，所以浏览器自动发送了一个`OPTIONS`请求给 server2。server2 判断`http://localhost:8000`不允许跨域访问，所以返回了 403。

## 简单请求（Simple Requests）

对于简单请求，浏览器会直接发送实际请求，而不会发送 OPTIONS 预检请求。简单请求需要满足以下条件：

- 请求方法：GET、HEAD 或 POST。
- 请求头：只包含以下字段之一：
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type（值仅限于 application/x-www-form-urlencoded、multipart/form-data 或 text/plain）。
- 请求体：如果是 POST 请求，请求体必须符合上述 Content-Type 的限制。

在这种情况下，浏览器会直接发送请求到服务器，并在请求头中添加 Origin 字段，表示请求的来源。服务器需要在响应头中设置 Access-Control-Allow-Origin 字段，以允许跨域访问

## 预检请求（Preflight Request）

对于非简单请求（复杂请求），浏览器会先发送一个 OPTIONS 预检请求，以确定服务器是否允许跨域访问。非简单请求包括以下情况：

- 请求方法：PUT、DELETE、PATCH 等非简单方法。
- 请求头：包含自定义头（如 X-Custom-Header）或非标准头。
- 请求体：包含复杂的请求体（如 JSON 数据）。

在这种情况下，浏览器会先发送一个 OPTIONS 请求，询问服务器是否允许跨域访问。服务器需要在响应头中设置以下字段：

- Access-Control-Allow-Origin：允许访问的源。
- Access-Control-Allow-Methods：允许的请求方法。
- Access-Control-Allow-Headers：允许的请求头。
- Access-Control-Allow-Credentials：是否允许携带凭据（如 Cookies）。
- Access-Control-Max-Age：预检请求的结果可以被缓存的时间。

如果服务器允许跨域访问，浏览器会继续发送实际请求；否则，浏览器会阻止请求并抛出 CORS 错误。

需要注意的是，浏览器会缓存 OPTIONS 请求结果，所以抓包时可以看到，非简单请求不会每次都发送 OPTIONS。

浏览器缓存 OPTIONS 请求结果的时间主要由服务器返回的 Access-Control-Max-Age 字段决定。Access-Control-Max-Age 字段用于指定预检请求（OPTIONS 请求）的结果可以缓存的时间，单位是秒。

例如，如果服务器返回 Access-Control-Max-Age: 1800，那么浏览器会在接下来的 1800 秒（30 分钟）内缓存该 OPTIONS 请求的结果。在此期间，相同的跨域请求（URL 和 header 字段都相同）不会再触发预检请求。

浏览器可能会有自己的默认最大缓存时间限制，实际缓存时间会取 Access-Control-Max-Age 和浏览器默认限制的较小值。


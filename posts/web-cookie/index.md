# HTTP Cookie 笔记


## 简介

每个会话可以使用多个 Cookie（实测 Chrome 保存 1000 多个也可以，但正常人没这么干的）。

一般业务就能用到 10 个以内的 Cookie，大型网站可能会用到 20 到 30 个。

![2025-02-13-10-39-C62V7N](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-13-10-39-C62V7N.png)

Cookie 由服务端生成，并通过响应的 Header（Set-Cookie 字段）返回给客户端。

客户端在后续请求时通过请求头（Cookie 字段）将所有需要的 Cookie 传给服务端。

![2025-02-13-10-59-j5Es9D](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-13-10-59-j5Es9D.jpg)

![2025-02-13-10-59-ulrTdj](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/2025-02-13-10-59-ulrTdj.jpg)

## 属性解释

单个 Cookie 在 Golang 中的定义如下（在"net/http"下）：

```golang
// A Cookie represents an HTTP cookie as sent in the Set-Cookie header of an
// HTTP response or the Cookie header of an HTTP request.
//
// See https://tools.ietf.org/html/rfc6265 for details.
type Cookie struct {
    Name  string
    Value string

    Path       string    // optional
    Domain     string    // optional
    Expires    time.Time // optional
    RawExpires string    // for reading cookies only

    // MaxAge=0 means no 'Max-Age' attribute specified.
    // MaxAge<0 means delete cookie now, equivalently 'Max-Age: 0'
    // MaxAge>0 means Max-Age attribute present and given in seconds
    MaxAge   int
    Secure   bool
    HttpOnly bool
    SameSite SameSite
    Raw      string
    Unparsed []string // Raw text of unparsed attribute-value pairs
}

// SameSite allows a server to define a cookie attribute making it impossible for
// the browser to send this cookie along with cross-site requests. The main
// goal is to mitigate the risk of cross-origin information leakage, and provide
// some protection against cross-site request forgery attacks.
//
// See https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00 for details.
type SameSite int

const (
    SameSiteDefaultMode SameSite = iota + 1
    SameSiteLaxMode
    SameSiteStrictMode
    SameSiteNoneMode
)
```

使用示例以及字段解释：

```golang
cookie := &http.Cookie{
    Name:  "session_token",
    Value: "abc123",
    Path:  "/",
    Domain: ".example.com",
    Expires: time.Now().Add(1 * time.Hour),
    MaxAge: 3600,
    Secure: true,
    HttpOnly: true,
    SameSite: http.SameSiteStrictMode,
}
```

- Name：session_token，标识这个 Cookie 是用于会话管理的。区分大小写。
- Value：abc123，存储了会话的唯一标识符。
- Path：/，表示这个 Cookie 在域名的所有路径下都有效。
- Domain：.example.com，表示这个 Cookie 在 example.com 及其子域名下有效，`Domain 参数必须以点 (“.”) 开始`。
- Expires：time.Now().Add(1 \* time.Hour)，表示这个 Cookie 在 1 小时后过期。
- MaxAge：3600，单位：秒，表示这个 Cookie 的最大生存时间为 1 小时。
- Secure：true，表示未使用 HTTPS 发起请求的话，浏览器不会在请求中携带 Cookie，localhost/127.0.0.1 除外。
- HttpOnly：true，表示这个 Cookie 无法被客户端 js 脚本访问，只能被浏览器访问。
- SameSite：Strict，表示这个 Cookie 只在同站请求下有效，有效防止 CSRF 攻击。

## 使用示例

```golang
package main

import (
    "fmt"
    "net/http"
    "time"
)

func main() {
    http.HandleFunc("/", handleRoot)
    http.HandleFunc("/set-cookie", handleSetCookie)
    http.HandleFunc("/get-cookie", handleGetCookie)
    http.HandleFunc("/delete-cookie", handleDeleteCookie)

    port := ":8080"
    fmt.Println("Server running on port", port)
    http.ListenAndServe(port, nil)
}

// 处理根路由
func handleRoot(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Welcome to the Cookie Management System!")
}

// 设置 Cookie
func handleSetCookie(w http.ResponseWriter, r *http.Request) {
    // 设置 Cookie
    http.SetCookie(w, &http.Cookie{
        Name:  "session_token",
        Value: "abc123",
        Path:  "/",
        //Secure:   true,
        SameSite: http.SameSiteStrictMode,
        //HttpOnly: true,
        Expires: time.Now().Add(1 * time.Hour),
    })

    // 设置另一个名称 Cookie
    http.SetCookie(w, &http.Cookie{
        Name:  "session_token_2",
        Value: "xyz",
        Path:  "/",
        SameSite: http.SameSiteStrictMode,
        Expires: time.Now().Add(1 * time.Hour),
    })

    fmt.Fprintf(w, "Cookie 'session_token' with value 'abc123' has been set.")
}

// 获取 Cookie
func handleGetCookie(w http.ResponseWriter, r *http.Request) {
    // 获取名为 "session_token" 的 Cookie
    cookie, err := r.Cookie("session_token")
    if err != nil {
        if err == http.ErrNoCookie {
            fmt.Fprintf(w, "Cookie 'session_token' not found.")
        } else {
            fmt.Fprintf(w, "Error retrieving cookie: %v", err)
        }
        return
    }

    // 返回 Cookie 的值
    fmt.Fprintf(w, "Cookie 'session_token' value is: %s", cookie.Value)
}

// 删除 Cookie
func handleDeleteCookie(w http.ResponseWriter, r *http.Request) {
    // 创建一个过期的 Cookie
    cookie := &http.Cookie{
        Name:   "session_token",
        Value:  "",
        Path:   "/",
        MaxAge: -1, // 删除 Cookie
    }

    // 将过期的 Cookie 添加到响应中
    http.SetCookie(w, cookie)
    fmt.Fprintf(w, "Cookie 'session_token' has been deleted.")
}
```

## 参考资料

- [Mozilla - HTTP Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
- [阮一峰 - SameSite 属性](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/web-cookie/  


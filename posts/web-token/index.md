# token 无感刷新与安全防范


## 背景

用户登录后，一般会有一个登录失效时间。

该时间如果太短，会使用户频繁登录，影响体验。

如果太长，则 token 被盗后又存在安全隐患。

所以可以采用长短有效期的双 token 方案。

## 后端处理

accessToken 放在 body 里返回给前端，前端保存在 localstorage。

refreshToken 放在 cookie 里，且设置 cookie 的 httpOnly 和 path。

```Go
// httpOnly=true：浏览器自动阻止前端 js 代码获取 refreshToken，防止 XSS 攻击。
// path=/refresh：只有访问 /refresh 时浏览器才会自动在请求里加上该 cookie，减少 refreshToken 传递次数，减少被抓包风险。
c.SetCookie("refresh_token", refreshToken, 7*24*3600, "/refresh", "localhost", false, true)
```

accessToken 过期时间短一些，可以是几小时，refreshToken 可以是 30 天。

accessToken 过期时间短是为了 accessToken 被盗后尽快失效。

refreshToken 过期长是为了不让用户频繁登录，当 refreshToken 也过期后，需要强制用户登录，防止 refreshToken 被盗后无限期可用。

关于 refreshToken 的被盗防范，还有以下几种方案：

- 适当缩短 refreshToken 有效期。
- 增加刷新频次，当前端请求刷新 accessToken 时，同时刷新 refreshToken。
- refreshToken 增加设备绑定，如客户端的 IP、UA 等信息。
- 使用次数限制，只允许使用一次或一定时间内仅允许使用 N 次。

## 前端处理

用户登录，后端返回登录成功，保存 accessToken 到 localStorage。

前端使用 header 的`Authorization: Bearer <accessToken>`进行请求。

当服务端检测到 accessToken 过期时，返回 401。

前端访问`/refresh`刷新 accessToken，刷新失败的话会收到 401，前端强制用户登录。

## 示例代码

```Go
package main

import (
 "net/http"
 "time"

 "github.com/gin-gonic/gin"
 "github.com/golang-jwt/jwt/v5"
)

var (
 jwtSecret     = []byte("secret_key")     // 用于签名
 refreshSecret = []byte("refresh_secret") // refresh token 签名
)

// 生成 access token
func generateAccessToken(userID string) (string, error) {
 claims := jwt.MapClaims{
  "user_id": userID,
  "exp":     time.Now().Add(time.Minute * 1).Unix(), // 1 分钟过期
 }
 token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
 return token.SignedString(jwtSecret)
}

// 生成 refresh token
func generateRefreshToken(userID string) (string, error) {
 claims := jwt.MapClaims{
  "user_id": userID,
  "exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 天过期
 }
 token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
 return token.SignedString(refreshSecret)
}

// 登录接口
func loginHandler(c *gin.Context) {
 type LoginRequest struct {
  Username string `json:"username"`
  Password string `json:"password"`
 }
 var req LoginRequest
 if err := c.ShouldBindJSON(&req); err != nil {
  c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
  return
 }

 // 简单演示：任何用户名密码都登录成功
 userID := req.Username

 accessToken, _ := generateAccessToken(userID)
 refreshToken, _ := generateRefreshToken(userID)

 // 把 refresh token 放入 HttpOnly Cookie
 c.SetCookie("refresh_token", refreshToken, 7*24*3600, "/refresh", "localhost", false, true)

 // 把 access token 返回给前端
 c.JSON(http.StatusOK, gin.H{
  "access_token": accessToken,
 })
}

// 受保护接口
func protectedHandler(c *gin.Context) {
 tokenString := c.GetHeader("Authorization")
 if tokenString == "" {
  c.JSON(http.StatusUnauthorized, gin.H{"error": "missing access token"})
  return
 }

 // Bearer token
 if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
  tokenString = tokenString[7:]
 } else {
  c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token format"})
  return
 }

 token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
  return jwtSecret, nil
 })
 if err != nil || !token.Valid {
  c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
  return
 }

 claims := token.Claims.(jwt.MapClaims)
 c.JSON(http.StatusOK, gin.H{
  "message": "protected content",
  "user_id": claims["user_id"],
 })
}

// 刷新 token 接口
func refreshHandler(c *gin.Context) {
 refreshToken, err := c.Cookie("refresh_token")
 if err != nil {
  c.JSON(http.StatusUnauthorized, gin.H{"error": "missing refresh token"})
  return
 }

 token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
  return refreshSecret, nil
 })
 if err != nil || !token.Valid {
  c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
  return
 }

 claims := token.Claims.(jwt.MapClaims)
 userID := claims["user_id"].(string)

 newAccessToken, _ := generateAccessToken(userID)
 c.JSON(http.StatusOK, gin.H{
  "access_token": newAccessToken,
 })
}

func main() {
 r := gin.Default()
 r.Use(func(c *gin.Context) {
  c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
  c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
  c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if c.Request.Method == "OPTIONS" {
   c.AbortWithStatus(204)
   return
  }
  c.Next()
 })

 r.POST("/login", loginHandler)
 r.GET("/protected", protectedHandler)
 r.POST("/refresh", refreshHandler)

 r.Run(":8080")
}
```

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Token 测试</title>
  </head>
  <body>
    <h1>Token 测试</h1>

    <button id="loginBtn">登录</button>
    <button id="protectedBtn">访问受保护接口</button>
    <button id="refreshBtn">刷新 Access Token</button>

    <pre id="output"></pre>

    <script>
      let accessToken = null; // access token 存在内存

      const output = document.getElementById("output");

      function log(msg) {
        output.textContent += msg + "\n";
      }

      document
        .getElementById("loginBtn")
        .addEventListener("click", async () => {
          const res = await fetch("http://localhost:8080/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "user1", password: "123456" }),
            credentials: "include", // 允许浏览器接收 HttpOnly Cookie
          });
          const data = await res.json();
          accessToken = data.access_token;
          log("登录成功，access token: " + accessToken);
        });

      document
        .getElementById("protectedBtn")
        .addEventListener("click", async () => {
          if (!accessToken) {
            log("请先登录获取 access token");
            return;
          }
          const res = await fetch("http://localhost:8080/protected", {
            method: "GET",
            headers: { Authorization: "Bearer " + accessToken },
            credentials: "include",
          });
          const data = await res.json();
          log("受保护接口返回：" + JSON.stringify(data));
        });

      document
        .getElementById("refreshBtn")
        .addEventListener("click", async () => {
          const res = await fetch("http://localhost:8080/refresh", {
            method: "POST",
            credentials: "include", // 浏览器会自动带上 HttpOnly Cookie
          });
          const data = await res.json();
          accessToken = data.access_token;
          log("刷新成功，新 access token: " + accessToken);
        });
    </script>
  </body>
</html>
```

使用示例，将上面文件放在同一目录下：

```bash
go run main.go

python -m http.server
```

浏览器访问 localhost:8000，即可通过 F12 抓包看请求详情。


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/web-token/  


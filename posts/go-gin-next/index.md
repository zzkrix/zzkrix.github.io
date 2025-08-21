# Gin 框架中的 c.Next 的作用


```go
package main

import (
   "fmt"
   "net/http"

   "github.com/gin-gonic/gin"
)

func main() {
   r := gin.New()

   r.Use(func(c *gin.Context) {
      fmt.Println("in mid1")

      // 执行下一个中间件，并返回到当前函数
      c.Next()

      // 该行代码会在 next 之后继续执行
      fmt.Println("haha")
   })

   r.Use(func(c *gin.Context) {
      fmt.Println("in mid2")
   })

   r.GET("/hello", func(c *gin.Context) {
      c.JSON(http.StatusOK, gin.H{
         "message": "ok",
      })
   })

   r.Run(":8080")
}
```

访问 `curl localhost:8080/hello` 控制台输出为：

```bash
in mid1
in mid2
haha
```

c.Next 的实现：

```go
// Next should be used only inside middleware.// It executes the pending handlers in the chain inside the calling handler.
// See example in GitHub.
func (c *Context) Next() {
   c.index++
   for c.index < int8(len(c.handlers)) {
      c.handlers[c.index](c)
      c.index++
   }
}
```

c.Next 的作用是可以在当前中间件中调用下一个中间件，待下一个中间件执行完成之后，再返回当前中间件，继续执行后续代码。


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/go-gin-next/  


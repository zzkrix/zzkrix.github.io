# 分布式锁提前过期


如果请求 A 抢到了锁，但是业务处理时间过长，导致分布式锁被 Redis 释放，此时请求 B 过来的时候，会造成并发问题，导致业务出错，怎么解决。

只需要在请求 A 获得锁的同时，创建一个监控程序，当任务未处理完，而锁快过期的时候，延长锁的过期时间即可。

```go
package main

import (
    "fmt"
    "sync"
    "time"

    "github.com/gomodule/redigo/redis"
)

type DistributedLock struct {
    key        string
    value      string
    expiration time.Duration
    pool       *redis.Pool
    mu         sync.Mutex
    stopChan   chan struct{}
    once       sync.Once
}

func NewDistributedLock(pool *redis.Pool, key string, expiration time.Duration) *DistributedLock {
    return &DistributedLock{
        key:        key,
        value:      fmt.Sprintf("%d", time.Now().UnixNano()),
        expiration: expiration,
        pool:       pool,
        stopChan:   make(chan struct{}),
    }
}

func (l *DistributedLock) Acquire() error {
    l.mu.Lock()
    defer l.mu.Unlock()

    conn := l.pool.Get()
    defer conn.Close()

    // https://redis.io/docs/latest/commands/set/
    // SET key value [NX | XX] [GET] [EX seconds | PX milliseconds |
    // EX seconds：将键的过期时间设置为 seconds 秒。执行 SET key value EX seconds 的效果等同于执行 SETEX key seconds value。
    // PX milliseconds：将键的过期时间设置为 milliseconds 毫秒。执行 SET key value PX milliseconds 的效果等同于执行 PSETEX key milliseconds value。
    // NX：只在键不存在时，才对键进行设置操作。执行 SET key value NX 的效果等同于执行 SETNX key value。
    // XX：只在键已经存在时，才对键进行设置操作。
    reply, err := redis.String(conn.Do("SET", l.key, l.value, "NX", "PX", int(l.expiration.Milliseconds())))
    if err != nil {
        return err
    }
    if reply != "OK" {
        return fmt.Errorf("failed to acquire lock")
    }

    go l.renewalLoop()
    return nil
}

func (l *DistributedLock) renewalLoop() {
    ticker := time.NewTicker(l.expiration / 2)
    defer ticker.Stop()

    for {
        select {
        case <-ticker.C:
            select { // 防止退出和定时器并发时，定时器先被 select 执行导致的本该失效的锁被再次延长。
            case <-l.stopChan:
                return
            default:
                if err := l.renewal(); err != nil {
                    fmt.Println("Error renewing lock:", err)
                }
            }
        case <-l.stopChan:
            return
        }
    }
}

func (l *DistributedLock) renewal() error {
    l.mu.Lock()
    defer l.mu.Unlock()

    conn := l.pool.Get()
    defer conn.Close()

    storedValue, err := redis.String(conn.Do("GET", l.key))
    if err != nil {
        return err
    }

    if storedValue == l.value {
        _, err = conn.Do("SET", l.key, l.value, "XX", "PX", int(l.expiration.Milliseconds()))
        if err != nil {
            return err
        }
    }

    return nil
}

func (l *DistributedLock) Release() (err error) {
    l.mu.Lock()
    defer l.mu.Unlock()

    l.once.Do(func() {
        close(l.stopChan)

        conn := l.pool.Get()
        defer conn.Close()

        script := redis.NewScript(1, `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("DEL", KEYS[1])
        else
            return 0
        end`)
        _, err = script.Do(conn, l.key, l.value)
    })

    return
}

func main() {
    pool := &redis.Pool{
        Dial: func() (redis.Conn, error) {
            return redis.Dial("tcp", "localhost:6379")
        },
        MaxIdle:     10,
        MaxActive:   100,
        IdleTimeout: 300 * time.Second,
    }
    defer pool.Close()

    lock := NewDistributedLock(pool, "my_lock", 10*time.Second)

    if err := lock.Acquire(); err != nil {
        fmt.Println("Failed to acquire lock!", err)
        return
    }
    defer func() {
        if err := lock.Release(); err != nil {
            fmt.Println("Failed to release lock!", err)
            return
        }
        fmt.Println("Lock released!")
    }()

    fmt.Println("Lock acquired!")
    time.Sleep(15 * time.Second) // 模拟长时间操作
}
```

参考资料：
[https://www.51cto.com/article/742568.html](https://www.51cto.com/article/742568.html)


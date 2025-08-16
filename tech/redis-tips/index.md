# redis 备忘录


## 哨兵

> 参考：[https://www.cnblogs.com/kevingrace/p/9004460.html](https://www.cnblogs.com/kevingrace/p/9004460.html)

sentinel 系统可以监视一个或者多个 redis master 服务，以及这些 master 服务的所有从服务；当某个 master 服务下线时，自动将该 master 下的某个从服务升级为 master 服务替代已下线的 master 服务继续处理请求。
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230310095645257.png)

## 集群模式下的请求

> 参考： [https://zhuanlan.zhihu.com/p/511199672](https://zhuanlan.zhihu.com/p/511199672)

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230310102213209.png)

集群模式是去中心化的，随便请求到哪个 master 后，判断 key 属于哪个 hash 槽以及在哪个机器上，进行请求路由。

## redis 热点 key

单机 QPS 瓶颈后，可以用集群分片，来分担请求压力，但是如果一个 key 就是在某一个分片上形成了热点 key 怎么办。

对 key 的值在业务上拆分，使其分散到更多的分片上。

或者如果 key 对应的数据允许有一定的误差，可以将该值存在进程内存里，做二级缓存，定时同步 redis 即可。

## 查看大 key

`redis-cli -h 127.0.0.1 -p 6379 --bigkeys`

> 使用 scan 扫描，对性能影响较小

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230310212039340.png)

## 查看状态

`redis-cli -h 127.0.0.1 -p 6379 --stat -i 3`

> -i 3 每隔 3 秒输出一次

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230310213230350.png)

## 监控 redis

`redis-cli monitor`

> 会输出 redis 命令的执行细节

## re-hash 过程

数据结构里存放了两个 hash 结构，一个是当前的，一个是 rehash 时候使用的。

数据从旧结构往新结构迁移，为了不影响查询和插入，是渐进式的，新数据写新结构。

## 问题

Q：怎么保证高性能、高可用和数据不丢失

使用集群分片保证请求的离散来突破单机 QOS 瓶颈。

使用主从模式保证数据的不丢失。

使用哨兵模式监控 master 可用性，及时提升从服务为主服务，来保证高可用。


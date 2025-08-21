# LRU


参考：

[https://halfrost.com/lru_lfu_interview/](https://halfrost.com/lru_lfu_interview/)

[https://developer.aliyun.com/article/928903](https://developer.aliyun.com/article/928903)

使用 map + 双向链表的方式实现 LRU：

双向链表存储数据

map 存储链表的指针

更新时，map 判断在不在链表里，在的话将该节点放到头部，使用双向指针找到前后的节点并连接起来。

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230517213556168.png)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/lru/  


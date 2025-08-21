# 本地消息表


参考：

[https://www.tizi365.com/question/4832.html](https://www.tizi365.com/question/4832.html)

[https://www.cnblogs.com/FlyAway2013/p/10124283.html](https://www.cnblogs.com/FlyAway2013/p/10124283.html)

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230514090939232.png)

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230514093611903.png)

简单的讲，就是生产方需要多维护一个已发送消息的数据表（与业务表在一个库，方便执行业务事务），发送完 MQ 消息后等待消费方回调后再更新本地消息表。

如果消费方没有回调，则本地定时任务进行重新投递确认，确保最终一致性。

如果使用支持事务消息的 RocketMQ，可以简化这个步骤，不需要维护本地消息表。


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/rocketmq-message-cache/  


# rocketmq 事务消息


参考：[https://rocketmq.apache.org/zh/docs/featureBehavior/04transactionmessage/](https://rocketmq.apache.org/zh/docs/featureBehavior/04transactionmessage/)

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230514113814225.png)

简单讲，业务上的事务包含（数据库事务 + 消息事务），原先生产者只能控制数据库事务的提交或回滚，RocketMQ 使用消息确认的机制将这两者进行了关联，大致代码执行逻辑为：

1. 生产者设置消息回查接口（供 mq 查询事务是否完成）
2. 生产者先发送半消息
3. 执行数据库事务
4. 本地事务提交
5. 提交消息事务
6. 处理 mq 回查消息，返回本地事务结果


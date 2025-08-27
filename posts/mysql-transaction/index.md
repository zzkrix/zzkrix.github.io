# MySQL 事务


## 参考

讲的比较清晰的：[https://www.51cto.com/article/679914.html](https://www.51cto.com/article/679914.html)

## 理论

MySQL 中事务的隔离级别一共分为四种，分别如下：

- 序列化 (SERIALIZABLE)
- 可重复读 (REPEATABLE READ)
- 提交读 (READ COMMITTED)
- 未提交读 (READ UNCOMMITTED)

四种不同的隔离级别含义分别如下：

**1）.SERIALIZABLE**

如果隔离级别为序列化，则用户之间通过一个接一个顺序地执行当前的事务，这种隔离级别提供了事务之间最大限度的隔离。

**2）.REPEATABLE READ（默认级别）**

在可重复读在这一隔离级别上，事务不会被看成是一个序列。不过，当前正在执行事务的变化仍然不能被外部看到，也就是说，如果用户在另外一个事务中执行同条 SELECT 语句数次，结果总是相同的。（因为正在执行的事务所产生的数据变化不能被外部看到）。

**3）.READ COMMITTED**

READ COMMITTED 隔离级别的安全性比 REPEATABLE READ 隔离级别的安全性要差。处于 READ COMMITTED 级别的事务可以看到其他事务对数据的修改。也就是说，在事务处理期间，如果其他事务修改了相应的表，那么同一个事务的多个 SELECT 语句可能返回不同的结果。

**4）.READ UNCOMMITTED**

READ UNCOMMITTED 提供了事务之间最小限度的隔离。除了容易产生虚幻的读操作和不能重复的读操作外，处于这个隔离级的事务可以读到其他事务还没有提交的数据，如果这个事务使用其他事务不提交的变化作为计算的基础，然后那些未提交的变化被它们的父事务撤销，这就导致了大量的数据变化。

在 MySQL 数据库中，默认的事务隔离级别是 REPEATABLE READ
![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230319212216111.png)

## Q&A

> Q: 在读未提交隔离级别下，快照是什么时候生成的？
>
> A: 没有快照，因为不需要，怎么读都读到最新的。不管是否提交

> Q: 在读已提交隔离级别下，快照是什么时候生成的？
>
> A: SQL 语句开始执行的时候。

> Q: 在可重复读隔离级别下，快照是什么时候生成的？
>
> A: 事务开始的时候。

## 其他

查询当前数据库运行中的事务：

```sql
SELECT * FROM information_schema.innodb_trx
```

从数据库视角看所有 sql 的执行记录：

> bin log 只能看到所有的变更记录，看不到select
> 
> 开启这个可以看到所有的请求
>
> ⚠️ 性能损耗大，谨慎使用

```sql
# 查看log记录是否开启
SHOW VARIABLES LIKE 'general_log%';

# 开启log历史，输出到指定文件
SET GLOBAL general_log = 1;
SET GLOBAL log_output = 'FILE';
SET GLOBAL general_log_file = '/var/lib/mysql/query.log';
```


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/mysql-transaction/  


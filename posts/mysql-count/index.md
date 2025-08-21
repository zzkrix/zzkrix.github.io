# MySQL count(*)、count(1)、count（列） 的区别


在 SQL 中，我们可以用 COUNT 函数来计算某个表中某个列的行数。但是，有些人可能不知道 COUNT() 函数有三种不同的用法：count(\*)，count(1)，和 count（列）。这三种用法的区别如下：

## count(\*)

count(\*) 会统计表中所有行的数量，<font color="#ff0000">包括 NULL 值</font>。例如，如果有一个表有 10 行，其中有 2 行的列值是 NULL，那么 count(\*) 将返回 10。

## count(1)

count(1) 也会统计表中所有行的数量，<font color="#ff0000">包括 NULL 值</font>。但是，它不会实际检索任何数据，而是使用数字 1 来代替每一行的值。例如，如果有一个表有 10 行，其中有 2 行的列值是 NULL，那么 count(1) 将返回 10。

## count（列）

count（列） 只会统计列中<font color="#ff0000">非 NULL </font>值的数量。例如，如果有一个表有 10 行，其中有 2 行的列值是 NULL，而其他 8 行的列值是非 NULL 值，那么 count（列） 将返回 8。

综上所述，count(\*) 和 count(1) 会统计表中所有行的数量，包括 NULL 值，而 count（列） 只会统计列中非 NULL 值的数量。在使用 COUNT() 函数时，需要根据实际需求选择不同的用法。

建表语句：

```mysql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
```

![](https://raw.githubusercontent.com/zzkrix/blog-images/main/assets/image-20230325101713869.png)


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/mysql-count/  


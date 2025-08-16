# MySQL8 创建用户和授权


## 查看用户

```mysql
SELECT* FROM mysql.user;`
```

## 创建用户

```mysql
CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'testuser'@'192.168.10.100' IDENTIFIED BY 'password';
CREATE USER 'testuser'@'%' IDENTIFIED BY 'password';
```

## 授权

```mysql
GRANT ALL PRIVILEGES ON testdb.* TO 'testuser'@'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'testuser'@'localhost';
GRANT SELECT, INSERT, DELETE ON testdb1.* TO testuser@'localhost';
```

## 持久化权限配置

> 一般不需要执行

[grant 之后要跟着 flush privileges 吗？-极客时间](https://time.geekbang.org/column/article/82231?utm_term=pc_interstitial_1340)

```mysql
flush privileges;
```

## 查看权限

```mysql
SHOW GRANTS FOR 'testuser'@'localhost';
```


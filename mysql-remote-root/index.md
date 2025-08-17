# MySQL 允许 root 远程访问


```bash
$ mysql -u root -p

> use mysql;

> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;

> FLUSH PRIVILEGES;
```


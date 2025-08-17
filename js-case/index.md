# JS 学习 - 细碎知识点


## 参考资料

阮一峰 JavaScript 教程：<https://wangdoc.com/javascript/>

## 标识符

和其他语言类似，js 标识符中允许出现数字、字母、下划线，且不能以数字开头。

额外的，js 还允许标识符中出现$符号，逆天🤮。

以下都是合法的标识符：

```text
abc
abc123
abc_
_abc
$
$abc
a$bc
abc$
```

所以也可以使用$当作函数名...

```js
// $ 作为变量名
{
  var $ = "我是变量";

  console.log($);
}

// $作为函数名
{
  function $() {
    console.log("离谱~");
  }

  $();
}
```

> 更逆天的，$ 还是 jQuery 等库的主函数名。

## switch-case

每一个 case 都需要加 break，否则执行完一个 case，程序会继续执行下一个 case。

```js
// 🙅错误写法
let a = 1;

switch (a) {
    case 1:
        console.log('a is 1');
    case 2:
        console.log('a is 2');
    default:
        console.log('a is something else');
}

输出：
a is 1
a is 2
a is something else


// 🙆正确写法
let a = 1;

switch (a) {
    case 1:
        console.log('a is 1');
        break;
    case 2:
        console.log('a is 2');
        break;
    default:
        console.log('a is something else');
}

输出：
a is 1
```

## 标签

> 用于在嵌套循环或复杂代码结构中更灵活地控制程序的执行流程。

语法结构如下：

```js
标签名：{
  // 代码块
}
```

示例：

```js
top: {
    for (var i = 1; i < 10; i++) {
        if (i == 5) {
            break top;
        }

        console.log(i);
    }
}

输出：
1
2
3
4
```

## with

> 操作同一个对象的多个属性时，提供一些书写的方便。
>
> 但是因为存在一些坑，所以不建议使用。

语法结构：

```js
with （对象） {
  语句；
}
```

示例：

```js
obj = {
    k1: 'v1',
    k2: 'v2',
};

普通写法：
with (obj) {
    k1 = 'v11';
    k2 = 'v22';
}

等同于：
obj.k1 = 'v11';
obj.k2 = 'v22';
```

当 with 里面操作对象中不存在的属性时，会默认创建全局变量：

```js
var obj = {};

with (obj) {
  p1 = 123;
}

console.log(obj.p1); // undefined
console.log(p1); // 123
```

含义不明确：

```js
with (o) {
　foo = bar;
}

上面的写法可能产生以下结果：

o.foo = bar;
o.foo = o.bar;
foo = bar;
foo = o.bar;
```


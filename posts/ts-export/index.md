# TypeScript - export 用法


在 TypeScript 中，`import` 语句用于从其他模块引入功能。根据所导入内容的不同，`import` 语句的语法也有所区别，具体体现在是否使用花括号 `{}`。

## 默认导出（Default Export）

当一个模块使用 `export default` 导出时，导入该模块时不需要使用花括号 `{}`。默认导出允许每个模块有一个主要导出。

_示例：_

_导出模块（`module.js`）：_

```javascript
// 使用 export default 导出
export default function greet() {
  console.log("Hello, world!");
}
```

_导入模块：_

```javascript
// 不使用花括号导入默认导出，导入的对象可以任意重命名
import greetx from "./module.js";

greetx(); // 输出：Hello, world!
```

## 命名导出（Named Export）

当一个模块使用命名导出（即不使用 `default` 关键字）时，导入该模块时需要使用花括号 `{}`，并且导入的名称必须与导出的名称一致。

_示例：_

_导出模块（`module.js`）：_

```javascript
// 使用命名导出
export function greet() {
  console.log("Hello, world!");
}

export const name = "Alice";
```

_导入模块：_

```javascript
// 使用花括号导入命名导出
import { greetx, name } from "./module.js";

greetx(); // 输出：Hello, world!
console.log(name); // 输出：Alice
```

## 同时存在默认导出和命名导出

一个模块可以同时包含默认导出和命名导出。在这种情况下，导入时可以结合使用上述两种语法。

_示例：_

_导出模块（`module.js`）：_

```javascript
// 默认导出
export default function greet() {
  console.log("Hello, world!");
}

// 命名导出
export const name = "Alice";
```

_导入模块：_

```javascript
// 同时导入默认导出和命名导出
import greetx, { name } from "./module.js";

greetx(); // 输出：Hello, world!
console.log(name); // 输出：Alice
```

## 总结

- 使用默认导出时，不需要加大括号`{}`
- 使用命名导出时，必须加大括号`{}`
- 使用默认导出时，可以在导入时使用任意名称
- 使用命名导出时，可以使用 `as` 重命名


---

> 作者: [zzkrix](https://zzkrix.com)  
> URL: https://zzkrix.com/posts/ts-export/  


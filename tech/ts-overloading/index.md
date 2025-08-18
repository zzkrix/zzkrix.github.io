# TypeScript - 函数重载


## 函数重载（Function Overloading）

**函数重载** 是 TypeScript 提供的一种 **在同一个函数名下定义多个函数签名** 的能力。它允许一个函数根据不同的参数类型或数量，执行不同的逻辑，从而提高代码的灵活性和可读性。

## 为什么需要函数重载？

在 TypeScript 中，函数参数可以是 **不同类型**，但 TypeScript 需要知道返回值的类型。如果直接用 `union` 类型（联合类型）定义参数，返回值类型就可能不够精准。函数重载可以解决这个问题。

## 函数重载的基本语法

```typescript
// 1. 定义多个函数签名
function func(param: number): number;
function func(param: string): string;

// 2. 实现函数逻辑（必须兼容所有签名）
function func(param: number | string): number | string {
  if (typeof param === "number") {
    return param + 1;
  } else {
    return param + "1";
  }
}

// 3. 调用函数
console.log(func(1)); // 输出 2
console.log(func("hello")); // 输出 "hello1"
```

**关键点：**

1. **多个函数签名**（Overload Signatures）：定义不同参数类型的 **函数签名**。
2. **单个函数实现**（Implementation Signature）：该函数必须兼容所有定义的签名。
3. **确保类型安全**：调用时 TypeScript **会根据传入参数推导出正确的返回类型**。

## 函数重载 vs 联合类型

很多情况下，你可以用 **联合类型** (`|`) 代替重载：

```typescript
function func(param: number | string): number | string {
  if (typeof param === "number") {
    return param + 1;
  } else {
    return param + "1";
  }
}
```

但 **函数重载的优势**：

- **返回值类型更加精确**，不需要使用 `as` 进行类型断言。
- **更好的可读性**，用户可以清楚地看到不同参数的返回类型。

## 更复杂的函数重载示例

### 示例 1：处理不同参数数量

```typescript
function sum(a: number, b: number): number;
function sum(a: number, b: number, c: number): number;

function sum(a: number, b: number, c?: number): number {
  return a + b + (c ?? 0);
}

console.log(sum(1, 2)); // 3
console.log(sum(1, 2, 3)); // 6
```

**解释：**

- **两个参数时**，计算 `a + b`。
- **三个参数时**，计算 `a + b + c`。
- `c?` 表示 `c` **可选**，如果 `c` 未传递，则默认为 `0`。

### 示例 2：不同参数类型，返回不同类型

```typescript
function getValue(param: number): number;
function getValue(param: string): string;

function getValue(param: number | string): number | string {
  return typeof param === "number" ? param * 2 : param.toUpperCase();
}

console.log(getValue(10)); // 20
console.log(getValue("hello")); // "HELLO"
```

**解释：**

- `param` 是 `number` 时，返回 `param * 2`。
- `param` 是 `string` 时，返回 `param.toUpperCase()`。
- 这样 **调用者可以明确知道 `getValue(10)` 返回 `number`，`getValue("hello")` 返回 `string`**，不会混淆。

## 函数重载的应用场景

1. **不同参数类型**：例如 `string` 和 `number` 的处理方式不同。
2. **不同参数数量**：例如 `Math.max()` 可以接受多个参数。
3. **不同返回类型**：如 `JSON.parse()` 可能返回 `object` 或 `array`。

## 总结

| **特点**           | **说明**                                 |
| ------------------ | ---------------------------------------- |
| **定义多个签名**   | 先定义多个函数签名，最后实现一个通用函数 |
| **参数不同**       | 允许相同函数名有不同参数类型或数量       |
| **返回值更精确**   | 根据参数类型，返回不同的类型             |
| **提升代码可读性** | 让 API 更清晰，调用时不会混淆返回值      |

在 TypeScript 中，**如果一个函数的参数类型或数量可能会变化，函数重载是一个很好的选择**。


# vue性能优化

## 冻结大数据

vue会对data对象中的数据添加getter setter监听。

冻结数据，防止vue做getter和setter转换。

- 可以让性能大幅提供
- 冻结数据只会禁止修改数据本身，仍然可以将变量的引用替换掉
- 前提：确信数据不会修改

冻结方法：`Object.freeze(obj)`，返回和传入的参数相同的对象(===)

1. 不能添加新属性
2. 不能删除新属性
3. 不能修改已有属性的值
4. 不能修改已有属性的描述符（可枚举型、可配置性、可写性、值）
5. 不能修改该对象的原型

```js
new Vue({
  data: {
    list: Object.freeze([
      { value: 1 },
      { value: 2 }
    ])
  },
  mounted() {
    // 修改数据，页面不会响应
    this.list[0].value = 100

    // 修改list的引用，界面会响应。比如下面的两个方式
    this.list = [
      { value: 100},
      { value: 200}
    ]
    this.list = Object.freeze({
      { value: 100},
      { value: 200}
    })
  }
})
```

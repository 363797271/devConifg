# vue性能优化

## 非双向绑定的数据

不需要双向绑定的数据，不用定义在data中，单独存储在变量中，防止vue劫持操作可以提高性能

```js
var arr = [1,2,3]

export default {
  method: {
    useArr() {
      // use arr
    }
  }
}
```

## 冻结大数据

vue会对data对象中的数据添加getter setter监听。

冻结数据，防止vue做getter和setter转换。

- 可以让性能大幅提供
- 冻结数据只会禁止修改数据本身，仍然可以将变量的引用替换掉
- 前提：确信数据不会修改

冻结方法：`Object.freeze(obj)`

1. 冻结一个对象（会修改传入的参数）
2. 返回和传入的参数相同的对象
3. 不能添加新属性
4. 不能删除新属性
5. 不能修改已有属性的值
6. 不能修改已有属性的描述符（可枚举型、可配置性、可写性、值）
7. 不能修改该对象的原型

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

### 应用场景

1. table的列表数据
2. select下拉列表固定的数据

## Select远程查询防抖

远程查询时增加防抖机制，防止频繁请求。

可使用lodash的debounce

## Option防止多余空包

下拉框遍历时，option标签保持一行，若存在换行，会导致选中时的值存在多余的空白

```js
// bad
<Select>
  <Option v-for="item in list" :vallue="item.value" :key="item.id">
    {{item.label}}
  </Option>
</Select>
```

```js
//good
<Select>
  <Option v-for="item in list" :vallue="item.value" :key="item.id">{{item.label}}</Option>
</Select>
```

## data数据层级

data数据层级一般保持2-3层最好。嵌套过深可能会导致：

1. vue数据劫持时递归层级过深导致爆栈
2. 数据操作和处理不变

## 样式穿透

开发中需要修改第三方组件的样式时，由于scoped属性的样式隔离，可能需要去除scoped或另起一个style。

这样会带来副作用（组件样式污染，不够优雅）。

使用样式穿透（保留scoped）：

```css
/* css */
/* .content[data-v-1j2j4h] .button { height:60px } */
.content >>> .button{
  height: 60px
}
```

```less
/* less */
/* .content[data-v-1j2j4h] .button { height:60px } */
.content /deep/ .button{
  height: 60px
}
```

# vue 使用方式

## @hook 监听声明周期

vue组件都有生命周期，父组件若想监听子组件中的生命周期，一般是在子组件的生命周期钩子函数中触发父组件传入的事件。

```js
// 子组件
export default {
  created() {
    this.$emit('created')
  },
  mounted() {
    this.$emit('mounted')
  }
}
```

但是在vue中，触发生命周期钩子函数的时候，也会向父组件`$emit`一个事件，称之为`HookEvent`。

这个事件名叫`hook`，已冒号的形式给它提供参数，参数就是各个钩子函数的名称，例如：

```html
<my-component @hook:mounted="dosomthing"></my-component>
```

- @hook 这个事件, 在vue的官方文档里没有说明，可以看源码。
- @hook 是vue组件事件，不是HTML元素事件。

## 程序化的事件侦听器

html标签绑定事件可以通过在标签上定义事件属性`onclick onchange`，也可以用API动态绑定注销`addEventListener removeEventListener`。

vue实例可以通过`v-on:click v-on:change`绑定，动态绑定注销可以用`$on $once $off` 实例方法，以程序化的方式侦听、停止事件。

程序化的方式可以避免在data中存储额外数据，例如：

从组件加载后就执行、销毁时停止的计时器

```js
// 一般做法
export default {
  data() {
    return {
      // 在data中定义一个属性用于存储计时器
      timeout: null
    }
  },
  mounted () {
    this.timeout = setInterval(() => {
      console.log(new Date());
    }, 1000)
  },
  beforeDestroy () {
      clearInterval(this.timeout)
  }
}
```

```js
// 程序化做法
export default {
  mounted () {
    this.createTimeout()
    // 还可以创建多个
    // this.createTimeout()
    // this.createTimeout()
  },
  methods: {
    createTimeout() {
      const timeout = setInterval(() => {
        console.log(new Date());
      }, 1000)
      this.$once('hook:beforeDestroy', () => {
        clearInterval(timeout)
      })
    }
  }
}
```

同样的实例方法还包括：

- 数据：`vm.$watch vm.$set vm.$delete`
- 事件：`vm.$on vm.$once vm.$off vm.$emit`
- 生命周期：`vm.$mount vm.$forceUpdate vm.$nextTick vm.$destory`

## 监听Watch的使用

### 绑定多个方法

使用数组可以让监听触发执行多个方法。

注意：TypeScript声明中不包括`Array`的方式，可能需要手动声明下。

```js
export detault {
  methods: {
    show (newVal, oldVal) {
      console.log(`changed from '${oldVal}' to '${newVal}'`)
    }
  },
  watch: {
    'person.money': [
      // 字符串方式
      'show',

      // 函数方式
      newVal => {
        console.log(newVal)
      },

      // 对象方式
      {
        handler: () => console.log('immediate'),
        immediate: true
      }
    ]
  }
}
```

### 监听多个变量

watch本身无法监听多个变量，但可以通过监听计算属性来实现。

计算属性`return`一个包含被监听的变量的对象。

```js
export detault {
  computed: {
    msg () {
      return {
        msg1: this.msg1,
        msg2: this.msg2
      }
    }
  },
  watch: {
    msg: (newVal) => {
      console.log(`msg1: ${newVal.msg1}, msg2: ${newVal.msg2}`)
    }
  }
}
```

### 自定义组件双向绑定

input使用v-model实现双向绑定，自定义组件可以通过定义`model`实现或修改双向绑定方式。

例如实现一个输入即大写化的文本框

```html
// UpperInput.vue
<template>
  <div>
    <h3>使用$emit触发事件通知父组件变更</h3>
    <input :value="content" @input="$emit('eventname', $event.target.value.toUpperCase())" />
  </div>
</template>

<script>
export default {
  model: {
    prop: 'content', // 指定从props中哪个参数获取v-model的数据
    event: 'eventname' // 约定向上通知的事件名称，随意取名
  },
  props: ['content'] // 随意取名用于绑定组件v-model传入的数据
}
</script>

```

```html
<template>
  <div>
    <UpperInput v-model="foo"></UpperInput>
  </div>
</template>

<script>
import UpperInput from '../components/UpperInput'
export default {
  components: { UpperInput },
  data () {
    return {
      foo: ''
    }
  }
}
<script>
```

## 轻量组件：函数式组件

如果一个组件，只依赖外部数据的变化而变化，不需要生命周期和任何方法，那就应该使用函数式组件。

- 函数式组件是无状态的
- 没有任何生命周期和方法
- 通过在`<template>`添加`functional`声明
- 轻量，渲染速度快

### 使用

- 组件只定义`template`模板
- 添加`functional`声明
- 组件使用`props`接收所有参数

```html
<!-- 父组件 -->
<template>
  <div>
    <UserInfo :user="userList[userIndex]" :next="showNext"></UserInfo>
  </div>
</template>
<script>
import UserInfo from '../components/UserInfo'
export default {
  components: { UserInfo },
  data () {
    return {
      userList: [
        { name: 'Jack', age: '28' },
        { name: 'Tom', age: '27' }
      ],
      userIndex: 0
    }
  },
  methods: {
    showNext () {
      this.userIndex++
      this.userIndex = this.userIndex >= this.userList.length ? 0 : this.userIndex
    }
  }
}
</script>
```

```html
<!-- userInfo.vue -->
<template functional>
  <dl>
    <dt>name:{{props.user.name}}</dt>
    <dd>age:{{props.user.age}}</dd>
    <dd><button @click="props.next">下一位</button></dd>
  </dl>
</template>
```

## 路由参数解耦

在路由组件中使用路由参数`params`，一般会用`$route`获取

```js
// 路由配置 router.js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: 'src/views/user.vue'
    }
  ]
})

// 路由组件 user.vue
export default {
  data () {
    return {
      id: this.$route.params.id
    }
  }
}
```

这样使路由组件与$route形成高度耦合，只能在特定的URL上使用，可通过设置`props`解耦：

```js
// 路由配置 router.js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: 'src/views/user.vue',
      props: true // 设置为true
    }
  ]
})

// 路由组件 user.vue
export default {
  props: [ 'id' ], // 从props获取路由中的params参数
  data () {
    return {
      // id: this.$route.params.id
    }
  }
}
```

这样`user.vue`既可以作为路由组件使用，也可以作为页面中的组件手动接受`id`参数。

注：`query`不会通过`props:true`传入，需要手动获取。

# 洋葱圈模型

从koa和egg中间件文档中看到。

大致是每个函数代码执行两次，按顺序执行：fn1>fn2>fn3>fn3>fn2>fn1。就像洋葱圈一样，从一侧进去，从另一侧出来，每个函数就是一层洋葱圈，都会在进/出时执行一次。

koa-compose使用async/await和compose函数实现洋葱圈模型。

![alt 图片来源egg官网](https://camo.githubusercontent.com/d80cf3b511ef4898bcde9a464de491fa15a50d06/68747470733a2f2f7261772e6769746875622e636f6d2f66656e676d6b322f6b6f612d67756964652f6d61737465722f6f6e696f6e2e706e67)

模拟实现：

```js
function compose (middleware) {
  return function (context, next) {
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      // 校验是否多次调用了next()
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) {
        fn = next
      }

      // if (i > middleware.length) {
      //   return Promise.resolve()
      // }
      if (!fn) {
        return Promise.resolve()
      }

      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

const fn1 = async (ctx, next) => {
  console.log(1);
  await next();
  console.log(6);
}

const fn2 = async (ctx, next) => {
  console.log(2);
  await next();
  console.log(5);
}

const fn3 = async (ctx, next) => {
  console.log(3);
  await next();
  console.log(4);
}

compose([fn1,fn2,fn3])() // 1 2 3 4 5 6

```

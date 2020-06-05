# HTTP请求方法

HTTP定义了一组请求方法(Methods)。

这些请求有时被称为**HTTP动词**，表示对指定资源要执行的期望动作。

|Method|请求是否有主体/正文|成功的响应是否有主体/正文|safe(安全)|idempotent(幂等)|cacheable(可缓存)|HTML表单是否支持|
|-|-|-|-|-|-|-|
|GET|false|true|true|true|true|true|
|HEAD|false|false|true|true|true|false|
|POST|true|true|false|false|配置后可缓存|true|
|PUT|true|true|false|true|false|false|
|DELETE|可以有|可以有|false|true|false|false|
|OPTIONS|false|true|true|true|false|false|
|CONNECT|false|true|false|false|false|false|
|TRACE|false|false|false|true|false|false|
|PATCH|true|false|false|false|false|false|

## 特征

每个请求方法都实现了不同的语义，也表示了不同的特征。

这些特征和语义一样，只是规范使用的一个期望标准，并不是限制。

例如拥有只读语音的GET方法，仍然可以修改服务器数据。

- safe 安全
  - 该HTTP方法是安全的，不会修改服务器数据
  - 指该方法具有只读的语义
  - 安全的方法如：GET HEAD OPTIONS
  - 不安全的方法如：POST PUT DELETE
- idempotent 幂等
  - 指同样的请求被执行一次或多次，效果是一样的。
  - 也就是重复请求，会覆盖前面的请求。
    - 例如一个PUT新增资源的请求未完成时，再次进行同样的请求，服务器会用后面的主体覆盖前面的，最终创建一条数据。
    - 而换成POST，则会创建两条数据。
  - 正确实现的条件下，safe的HTTP方法都是idempotent，因为它们不会修改服务器状态。
  - 其他的方法：PUT DELETE
- cacheable 可缓存
  - 指HTTP响应(response)可以被缓存
  - 可被缓存的response满足下列条件：
    - 请求中使用的方法本身(method)是可以被缓存的
      - 可缓存的请求例如GET HEAD
      - 不可缓存的请求例如PUT DELETE
    - 应用程序会缓存已知的响应状态码(status)，例如200 301 404 501等
    - 响应中没有指定头部阻止缓存，如`Cache-Control`
  - 一些不缓存的方法(method)或响应(response)，请求到指定的URI可能会导致相同URI上的缓存失效
  - 同样，如果请求的方法(method)和响应的状态(status)都可以被缓存，那请求的响应(response)也都将可以被缓存

## 使用

Method表明要对指定资源执行的操作，例如：获取、修改、创建、删除等。

虽然服务器不限制它们的一些使用方式，例如：增删改查可以全部用POST或GET方式请求。

但一些规范和API设计风格（例如REST）建议使用符合动作语义的请求方式。

例如：

- GET：**应该**只用于获取数据
- DELETE：**应该**只用于删除数据
- POST：**应该**只用于创建数据，有的风格也允许用于修改数据
- PUT：**应该**只用于修改数据

## 介绍

### GET

GET方法请求指定的资源，应该只用于获取数据。

### HEAD

HEAD方法请求资源的头部信息，与GET类似，但只返回头部信息(headers)。

这允许客户端在未获取资源的情况下，对资源的头部进行检查，应用场景：

- 下载一个大文件前，可以先获取其大小再决定是否要下载，以此节约带宽资源。
- 获取资源类型
- 通过响应状态码，确认资源是否存在

### POST

POST方法发送数据给服务器，通常导致服务器上的状态变化或副作用。

可以通过`Content-Type`指定请求主体的类型。

POST与PUT的区别是它的语义不是idempotent(幂等)的，所以应该用POST来新增资源，用PUT修改资源。

语义只是约定，大部分项目还是使用的POST进行增删改查操作。

### PUT

PUT方法同POST一样，区别只是它是idempotent的。

### DELETE

DELETE方法用于删除指定的资源。

### OPTIONS

OPTIONS用于获取目标资源所支持的请求方法。若请求成功，则会在响应头中包含一个名为'Allow'的字段，值是所支持的方法，例如'GET,POST'

在CORS中，OPTIONS称为**预检**请求，一般用于在进行跨域请求前，以检测实际请求是否可以被服务器接收。若请求成功，则进行具体的请求`GET POST等`。

请求报文中使用：

- `Access-Control-Request-Method` 告知服务器实际请求所使用的 HTTP 方法
- `Access-Control-Request-Headers` 告知服务器实际请求所携带的自定义头部字段

服务器返回：

- `Access-Control-Allow-Methods` 将所有允许的请求方法告知客户端。该首部字段与 Allow 类似，但只能用于涉及到 CORS 的场景中。

Axios库就是使用的OPTIONS。

### CONNECT（不懂）

CONNECT方法建立一个到由目标资源标识的服务器的隧道。

### TRACE（不懂）

TRACE方法 实现沿通向目标资源的路径的消息环回（loop-back）测试 ，提供了一种实用的 debug 机制。

### PATCH（不懂）

PATCH用于对资源进行部分修改。

## 参考

- [HTTP请求方法](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)

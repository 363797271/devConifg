# RESTful架构

**RESTful架构**：如果一个架构符合**REST**原则（注意不是标准），就称它为**RESTful架构**。

**RESTful架构**是目前最流行的一种互联网软件架构。

**REST**是一种设计风格，**不是标准**。

个人理解：**REST**是建立API时可以遵守的一种规则/设计风格。

## REST

**REST** 是 Representational State Transfer 的缩写。

阮一峰翻译为：表现层状态转化。

### 单词解释

#### 资源（Resource）

REST的名称中省略了主语。“表现层”指的是“资源（Resource）”的“表现层”。

资源：文本、图片、超媒体、数据等。

URI标识资源的实体，规范用法就是资源的位置。

#### 表现层（Representational）

“资源”是一种信息实体，它可以有多种外在表现形式。

我们把“资源”具体呈现出来的形式，叫做它的“表现层”。如：

- 文本可以用txt、html、xml、json格式表现。
- 图片用jpg、png格式表现等。

规范上来说，表现形式应该在HTTP请求的头信息中用Accept和Content-Type字段指定。

#### 状态转化（State Transfer）

访问一个网站，代表客户端和服务端的互动过程。

这个过程，势必涉及到数据和状态的变化。

所有的状态都保存在服务器端，客户端**只能通过HTTP协议**，让服务器端发生“状态转化”。

这种转化建立在表现层之上，所以就是“表现层状态转化”。

HTTP协议中转化服务器端状态的4个基本操作：

- GET 用于获取资源，例如获取产品列表或详情
- POST 用于新建/更新资源，例如创建/修改产品
- PUT 用于更新资源，例如修改产品
- DELETE 用于删除资源，例如删除

以上也就是常说的CRUD(Create、Read、Update、Delete)

### 总结

- 资源通过URI进行标识
- 通过HTML、XML、JPG等形式进行表现
- 通过协议资源交互。

REST描述的是在网络中客户端和服务器端的一种交互形式。

就是选择通过使用http协议和uri，利用client/server model对资源进行CRUD (Create/Read/Update/Delete)增删改查操作。

RESTful API就是REST风格设计的网络接口。

## REST风格

1. URL（用名词）定位资源，表示要获取什么。
2. 用HTTP动词（GET,POST,DELETE,DETC）描述操作，表示要做什么。
3. 用HTTP Status Code传递Server的状态信息（200成功，500内部错误等），表示结果如何。

### 示例

|Example|RESR|Description|
|-|-|-|
|POST /getUser|GET /user|获取用户信息|
|GET /user/add|POST /user|创建用户|
|POST /editUser/:userid|PUT /user/:userid|修改用户|
|POST /editUser<br>postData:{id:userid,type:'delete'}|DELETE /user<br>postData:{id:userid}|删除用户|

### RESTful要求

- URI使用名词而不是动词，且推荐用复数
  - bad: /getProduct
  - good: /products
- 使用HTTP METHOD表示操作
- API版本可以放在URL或HTTP的header中
  - URL： /api/v1/xxx
- 保证HEAD和GET方法不会对改变资源状态
- 资源的地址推荐用嵌套结构
  - GET /user/:userid/company 用户[userid]的所属单位信息
- 使用正确的HTTP Status Code表示访问结果
- ...

## 案例

比如一个供其他平台使用的服务，只需要一套提供服务的接口，通过URL和HTTP method就很容易明白接口的定义，就可以使用REST风格。

## 参考

- [怎样用通俗的语言解释REST，以及RESTful？(简单易懂)](https://www.zhihu.com/question/28557115)
- [理解RESTful架构](http://www.ruanyifeng.com/blog/2011/09/restful.html)
- [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

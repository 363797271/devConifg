# 介绍

本库存放私人资料管理

## gitbook使用

### 安装gitbook

```bash
npm install -g gitbook-cli
```

### 创建

```bash
gitbook init
```

### 目录

* README.md 项目介绍
* SUMMARY.md 目录结构
* book.json 配置文件（自行添加）

### 运行与打包

浏览器运行

```bash
gitbook serve
```

生成html（gitbook serve已生成）

```bash
gitbook build
```

### 安装插件

在book.json中配置插件，使用`gitbook install`安装

## gitbook插件

### 导航折叠

```json
{
  "plugins":[
    "expandable-chapters"
  ]
}
```

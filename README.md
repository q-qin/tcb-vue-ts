# Vue + ts 全栈应用

这个目录是基于云开发的一个 [Vue](https://cn.vuejs.org/) 全栈应用示例，包含 Vue + 云函数 + 静态网站部署，可以基于 **[CloudBase Framework](https://github.com/TencentCloudBase/cloudbase-framework)** 框架将项目一键部署到云开发环境

## [线上地址](http://47.103.136.187/tcb-vue-ts/)

在命令行执行

```bash
tcb new vue-app vue
```


进入到项目目录，在命令行执行

```bash
tcb framework deploy
```

## 开发命令及配置

### 本地开发

```
yarn dev
```

### 上线部署

```
yarn deploy:client
yarn deploy:server
yarn deploy
```

### Lint

```
npm run lint
```
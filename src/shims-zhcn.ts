interface zhCN {
  [key: string]: any
}
declare module 'ant-design-vue/lib/locale-provider/zh_CN' {
  import zh from 'ant-design-vue/lib/locale-provider/zh_CN'
  const zh_CN: zhCN

  export default zh_CN
}
<template>
  <div id="app">
    <a-config-provider :locale="zh_CN">
      <router-view/>
    </a-config-provider>
  </div>
</template>

<script lang="ts">
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
  zh_CN = zh_CN
}
</script>

<style lang="less">
  .g2{
    width: 100%;
    margin: auto;
  }
</style>

<template>
  <a-result status="404" title="404" sub-title="抱歉，您访问的页面不存在！">
    <template #extra>
      <router-link to="/">
        <a-button type="primary">
          返回首页
        </a-button>
      </router-link>
    </template>
  </a-result>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class notFound extends Vue {

}
</script>

<style lang="less" scoped>

</style>

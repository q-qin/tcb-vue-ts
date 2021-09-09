<template>
  <div class="about">
    <a-descriptions bordered title="关于本系统">
      <a-descriptions-item label="开发环境">
        windows
      </a-descriptions-item>
      <a-descriptions-item label="开发工具">
        vscode
      </a-descriptions-item>
      <a-descriptions-item label="UI框架">
        ant.design
      </a-descriptions-item>
      <a-descriptions-item label="使用帮助" span="3">
        <p>1. 登录 admin / admin </p>
        <p>2. 工作台 —— 查看报表等</p>
        <p>3. 修车登记 —— 登记客户车型，损坏程度等</p>
        <p>4. 修车工单 —— 分配修理工，开始接活</p>
        <p>5. 申领配件 —— 修理工根据车辆损坏情况，申领配件</p>
        <p>6. 开具发票 —— 修车完成后，客户付钱，修车公司开具发票</p>
        <p>7. 员工管理 —— 审核新注册员工和认证修理工等级，账号停/启用等</p>
        <p>8. 车型维护 —— 维护车型基本信息</p>
        <p>9. 配件维护 —— 维护配件基本信息</p>
      </a-descriptions-item>
      <a-descriptions-item label="参考资料">
        <p>1. 《Javascript从入门到放弃》</p>
        <p>2. ...</p>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {

}
</script>
<style lang="less" scoped>

</style>

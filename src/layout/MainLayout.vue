<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model="collapsed" collapsible>
      <a-icon slot="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"/>
      <div class="logo" />
      <a-menu theme="dark" mode="inline" :selected-keys="selectedKeys" >
        <template v-for="route in routes">
          <a-menu-item  :key="route.path" v-if="!route.hidden">
            <router-link :to="route.path" >
                <a-icon :type="route.meta.icon" />
                <span>{{route.meta.title}}</span>
            </router-link>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background:#fff" >
        <a-dropdown  placement="bottomRight">
          <span class="account-avatar">
            <a-avatar size="small" class="margin-right-10" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"/>
            <span>admin</span>
          </span>
          <template v-slot:overlay>
            <a-menu class="ant-pro-drop-down" >
              <a-menu-item key="center" >
                <a-icon type="user" />
                个人中心
              </a-menu-item>
              <a-menu-item key="settings" >
                <a-icon type="setting" />
                个人设置
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item key="logout" @click="logout" >
                <a-icon type="logout" />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-layout-header>
      <a-layout-content class="margin-lr-10">
        <a-breadcrumb class="margin-tb-10">
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>工作台</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '300px', minWidth:'800px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        develop by q-qin <a href="https://www.github.com/q-qin/tcb-vue" target="_blank"><a-icon type="link" />Github</a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import  {routes} from '@/router';
import {clearToken} from '@/utils/jscookie'
@Component({
  components: {},
  mixins: []
})
export default class Layout extends Vue {
  selectedKeys:Array<string> = []
  collapsed = false;
  routes = routes[0].children;

  @Watch('$route',{immediate: true,})
  routeChange({path}:any){
    this.selectedKeys = [path]
  }

  logout(){
    this.$confirm({
      title: '确定退出账号吗？',
      onOk:()=> {
        clearToken();
        this.$router.replace('/user/login')
      },
    })
  }
}
</script>
<style lang="less">
   .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
  .account-avatar {
    float: right;
    height: 100%;
    margin-left: auto;
    overflow: hidden;
  }
  .ant-dropdown-menu-item {
    min-width: 160px;
  }
</style>
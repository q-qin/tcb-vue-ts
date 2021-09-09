import Vue, { ComponentOptions, AsyncComponent } from 'vue'
import VueRouter, { RouteConfig,RedirectOption } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue';

Vue.use(VueRouter)
type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent

interface IRouteProps{
  path: string
  name?: string
  component?: Component
  redirect?: RedirectOption
  meta?: any,
  children?: RouteConfig[]
  hidden?:boolean
}

export const routes: Array<IRouteProps> = [
  {
    path: '/',
    name: 'Home',
    redirect:'/index',
    component: MainLayout,
    children:[{
      path:'/index',
      name:'index',
      meta:{title:'工作台',icon:'line-chart'},
      component: () => import(/* webpackChunkName: "home" */ '../views/Home/Home.vue'),
    },{
      path:'/main/dengji',
      name:'main-dengji',
      meta:{title:'修车登记',icon:'form'},
      component: () => import(/* webpackChunkName: "Main" */ '../views/Main/Dengji.vue'),
    },{
      path:'/main/gongdan',
      name:'main-gongdan',
      meta:{title:'工单派活',icon:'bars'},
      component: () => import(/* webpackChunkName: "Main" */ '../views/Main/Gongdan.vue'),
    },{
      path:'/main/spare',
      name:'main-spare',
      meta:{title:'申领配件',icon:'tool'},
      component: () => import(/* webpackChunkName: "Main" */ '../views/Main/Spare.vue'),
    },{
      path:'/main/bill',
      name:'main-bill',
      meta:{title:'开具发票',icon:'account-book'},
      component: () => import(/* webpackChunkName: "Main" */ '../views/Main/Bill.vue'),
    },{
      path:'/manage/worker',
      name:'manage-worker',
      meta:{title:'员工管理',icon:'user'},
      component: () => import(/* webpackChunkName: "Manage" */ '../views/Manage/User.vue'),
    },{
      path:'/manage/car',
      name:'manage-car',
      meta:{title:'车型维护',icon:'car'},
      component: () => import(/* webpackChunkName: "Manage" */ '../views/Manage/Car.vue'),
    },{
      path:'/manage/spare',
      name:'manage-spare',
      meta:{title:'配件维护',icon:'select'},
      component: () => import(/* webpackChunkName: "Manage" */ '../views/Manage/Spare.vue'),
    },{
      path:'/about',
      name:'about',
      meta:{title:'使用手册',icon:'question-circle'},
      component: () => import(/* webpackChunkName: "home" */ '../views/Home/About.vue'),
    }]
  },
  {
    path:'/user/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/Login.vue'),
    meta:{
      title:'登录'
    },
    hidden:true
  },
  {
    path:'/user/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "user" */ '../views/User/Register.vue'),
    meta:{
      title:'注册'
    },
    hidden:true
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/notFound.vue'),
    hidden:true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const router = new VueRouter({
  routes
})

export default router

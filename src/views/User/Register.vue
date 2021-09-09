<template>
  <div class="main">
    <div class="user-layout-login">
      <div class="title">欢迎注册</div>
      <a-steps class="margin-tb-20 padding-lr-10" :current="step">
        <a-step title="填写账号">
        </a-step>
        <a-step title="企业审核" />
        <a-step title="修理工认证" />
      </a-steps>
      <a-form-model ref="formPass" :model="formPass" :rules="rulesPass" v-show="step== 0">
        <a-form-model-item prop="username">
          <a-input placeholder="用户名" v-model="formPass.username">
            <a-icon
              slot="prefix"
              type="user"
              :style="{ color: 'rgba(0,0,0,.25)' }"
            />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password">
          <a-input-password
            placeholder="密码"
            v-model="formPass.password"
          >
            <a-icon
              slot="prefix"
              type="lock"
              :style="{ color: 'rgba(0,0,0,.25)' }"
            />
          </a-input-password>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            type="primary"
            :loading="registerBtn"
            :disabled="registerBtn"
            class="register-button"
            @click="registerPass"
            >注册</a-button
          >
        </a-form-model-item>
        <a-form-model-item class="text-right">
          <router-link to="/user/login">
            <a-icon type="link" /> 去登录
          </router-link>
        </a-form-model-item>
      </a-form-model>
      <a-result
        status="success"
        title="注册成功!"
        sub-title="管理员会在1~3个工作日为你审核"
        v-show="step == 1"
      >
        <template #extra>
          <router-link to="/">
            <a-button type="primary">
              返回首页
            </a-button>
          </router-link>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {HelloWorld },
})
export default class Register extends Vue {
  formPass = {
    username:'',
    password:''
  }
  step= 0
  rulesPass = {
    username:[{required: true, message: '请输入用户名', trigger: 'blur' }],
    password:[{required: true, message: '请输入密码', trigger: 'blur' }]
  }

  registerBtn = false

  get getformPass():Vue & { validate: () => boolean } {
    return this.$refs.formPass as Vue & { validate: () => boolean }
  }

  async registerPass(){
    const valid = await this.getformPass.validate()
    if (valid) {
      this.registerBtn = true;
      setTimeout(()=>{
        this.registerBtn = false;
        if(this.formPass.username == 'admin'){
          this.$message.error('账号已存在！');
          return false;
        }
        if(this.formPass.password.length <6){
          this.$message.error('密码不能少于6位！');
          return false;
        }
        this.$message.success('注册成功~');
        this.step = 1;
      },1e3)
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
  height: 100%;
  overflow: hidden;
  .user-layout-login {
    position: fixed;
    top: 32%;
    width: 600px;
    left: 0;
    right: 0;
    background: #fff;
    margin: auto;
    padding: 20px;
    border-radius: 4px;
    .title {
      font-size: 28px;
      font-weight: bold;
      text-align: center;
      padding: 10px 0;
      letter-spacing: 4px;
    }
    button.register-button {
      width: 100%;
    }
  }
}
</style>
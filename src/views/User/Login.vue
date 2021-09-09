<template>
  <div class="main">
    <div class="user-layout-login">
      <div class="title">修车管理系统V1.0</div>
      <a-tabs :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-form-model ref="formPass" :model="formPass" :rules="rulesPass">
            <a-form-model-item prop="username">
              <a-input placeholder="账户: admin" v-model="formPass.username">
                <a-icon
                  slot="prefix"
                  type="user"
                  :style="{ color: 'rgba(0,0,0,.25)' }"
                />
              </a-input>
            </a-form-model-item>

            <a-form-model-item prop="password">
              <a-input-password
                placeholder="密码: admin"
                v-model="formPass.password"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  :style="{ color: 'rgba(0,0,0,.25)' }"
                />
              </a-input-password>
            </a-form-model-item>
            <a-form-model-item class="user-login-other">
              <span>其他登录方式</span>
              <a>
                <a-icon class="item-icon" type="alipay-circle"></a-icon>
              </a>
              <a>
                <a-icon class="item-icon" type="taobao-circle"></a-icon>
              </a>
              <a>
                <a-icon class="item-icon" type="weibo-circle"></a-icon>
              </a>
              <router-link class="register" to="/user/register"
                ><a-icon type="link" /> 注册账户</router-link
              >
            </a-form-model-item>
            <a-form-model-item>
              <a-button
                type="primary"
                :loading="loginBtn"
                :disabled="loginBtn"
                class="login-button"
                @click="loginPass"
                >登录</a-button
              >
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="tab2" tab="手机号登录">
          <a-form-model>
            <a-form-model-item>
            <a-input
              type="text"
              placeholder="手机号"
              v-model="formSms.mobile"
            >
              <a-icon
                slot="prefix"
                type="mobile"
                :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-model-item>
          <a-form-model-item>
              <a-input
                type="text"
                placeholder="验证码"
                v-model="formSms.captcha"
              >
                <a-icon
                  slot="prefix"
                  type="mail"
                  :style="{ color: 'rgba(0,0,0,.25)' }"
                />
                <span
                class="text-cursor"
                slot="addonAfter"
                @click="sendSms"
                :disabled="state.smsSendBtn"
                v-text="
                  (!state.smsSendBtn && '获取验证码') || state.time + ' s'
                "
              ></span>
              </a-input>
            </a-form-model-item>
            <a-form-model-item class="user-login-other">
              <span>其他登录方式</span>
              <a>
                <a-icon class="item-icon" type="alipay-circle"></a-icon>
              </a>
              <a>
                <a-icon class="item-icon" type="taobao-circle"></a-icon>
              </a>
              <a>
                <a-icon class="item-icon" type="weibo-circle"></a-icon>
              </a>
              <router-link class="register" to="/user/register"
                ><a-icon type="link" /> 注册账户</router-link
              >
            </a-form-model-item>
            <a-form-model-item>
              <a-button
                type="primary"
                :loading="loginBtn"
                :disabled="loginBtn"
                class="login-button"
                @click="loginSms"
                >登录</a-button
              >
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { login } from '@/api/user';
import { setToken } from '@/utils/jscookie';

@Component({
  components: { },
})
export default class Login extends Vue {
  // data
  formPass = {
    username:'',
    password:''
  }
  formSms = {
    mobile:'',
    captcha:'',
  }
  rulesPass = {
    username:[{required: true, message: '请输入用户名', trigger: 'blur' }],
    password:[{required: true, message: '请输入密码', trigger: 'blur' }]
  }
  loginBtn = false

  state = {
    time: 60,
    smsSendBtn: false,
  };

  get getformPass():Vue & { validate: () => boolean } {
    return this.$refs.formPass as Vue & { validate: () => boolean }
  }

  // 密码登录
  async loginPass() {
     const valid = await this.getformPass.validate()
      if (valid) {
        this.loginBtn = true;
        login({
            ...this.formPass,type:'1'
        }).then((result)=>{
          const {code,data,msg} = (result as any ).result;
          this.loginBtn = false;
          if(code == 200){
            setToken(data);
            this.$router.replace('/');
          }else{
            this.$message.error(msg);
          }
        }).catch(e=>{
          this.loginBtn = false;
        })
      }
  }
  time = 0;
  sendSms (){
    if (this.state.smsSendBtn) {
        // 判断是否开始倒计时，避免重复点击
        return false;
      }
      this.$notification.success({message:'已发送',description:'验证码：123456'})
      this.state.smsSendBtn = true;
      this.time = 60;
      const countDown = setInterval(() => {
        this.time --;
        if (this.time <= 0) {
          this.state.smsSendBtn = false;
          clearInterval(countDown);
        }
      }, 1000);
  }
  loginSms(){
    setToken('xc-13800138001')
    this.$router.replace('/');
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

    .forge-password {
      font-size: 14px;
    }

    .login-button {
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
}
</style>

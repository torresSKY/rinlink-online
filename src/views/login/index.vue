<template>
  <div class="login-container" :style="backgroundDiv">
    <h3 class="title" style="letter-spacing:3px">{{$t('navbar.title')}}</h3>
    <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <!-- <div class="login-img">
        <img src='../../assets/img/login-logo.png'>
      </div>  -->
      <h4 class="sub-title">{{$t('view.userLogin')}}</h4>

      <el-form-item prop="username" :rules="[{required: true, min: 3,  message: $t('message.loginuser')}]">
       <span class="pl10 c iconfont icon-denglu"></span>
        <el-input name="username" type="text" ref="username" v-model="loginForm.username" autoComplete="on" :placeholder="$t('table.username')" />
      </el-form-item>

      <el-form-item prop="password" :rules="[{required: true, min: 3,  message: $t('message.pawuser')}]">
       <span class="pl10 c iconfont icon-mima"></span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          :placeholder="$t('view.paw')" />
         
        <span :class="`show-pwd iconfont ${pwdType?'icon-yanbi':'icon-yankai'}`" @click="showPwd"></span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;background: linear-gradient(-90deg, #006DF3 0%, #00E5FC 100%);
border-radius: 3px;font-size: 18px;font-family: Microsoft YaHei;
font-weight: 400;"  @click.native.prevent="handleLogin">{{$t('button.login')}}</el-button>

      <!--div class="tips">账号:admin 密码随便填</div>
      <div class="tips">账号:editor  密码随便填</div>

      <el-button class="thirdparty-button" type="primary" @click="showDialog=true">打开第三方登录</el-button-->
    </el-form>

    <el-dialog title="第三方验证" :visible.sync="showDialog">
      本地不能模拟，请结合自己业务进行模拟！！！<br/><br/><br/>
      邮箱登录成功,请选择第三方验证<br/>
      <social-sign />
    </el-dialog>
    <!-- <el-select v-model="lang" class="lang" placeholder="请选择" @change="changeLangEvent()">
    <el-option  class="lang"  v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select> -->
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import api from '@/api/login/index'
import socialSign from './socialsignin'
import {routerlist} from '@/router/index'
import {mapActions,mapGetters} from 'vuex'
import { Message } from 'element-ui'
// import * as pub from '@/api/public'
// import * as log from '@/api/login'
export default {
  components: { socialSign },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error(this.$t('message.loginuser')))
      }else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(this.$t('message.pawuser')))
      }else {
        callback()
      }
    }
    return {
      backgroundDiv: {
        backgroundImage:'url(' + require('@/assets/img/beijing2.png') + ')',
        backgroundRepeat:'no-repeat',
        backgroundSize:'100% 100%'
      },
      loginForm: {
        username: localStorage.getItem('username') || '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, min: 3, message: this.$t('message.loginuser') }],
        password: [{ required: true, min: 3, message: this.$t('message.pawuser') }]
      },
      pwdType: 'password',
      // loading: false,
      showDialog: false,
      options:[{
               lable:'中文',
               value:'中文'
             },{
               lable:'English',
               value:'English'
             }],
      lang: null,
    }
  },
  mounted() {
    this.lang = this.$i18n.locale == 'zh' ? '中文' : 'English'
    this.$refs.username.focus();
  },
  methods: {
    ...mapActions(['setRouterList','setViewTagList','setIsLogin','setRoles','setToken','setUser','setUserName','setUsercode']),
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          api.login({username:this.loginForm.username,password:this.loginForm.password,}).then(res=>{
            //if(res.id){
              if(1){
              // this.setRoles(res.detail.role)
              this.setRouterList(routerlist.routes)
              this.setToken(res.token)
              this.setUser(res.holder)
              this.setUserName(this.loginForm.username)
              this.setIsLogin(1)
              this.setUsercode(res.holder)
              this.$router.push('index')
            }
          }).catch(err=>{
            Message.error(this.$t('message.usererror'))
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeLangEvent() {
      this.$refs.loginForm.clearValidate()
      this.loginForm.username = ''
      this.loginForm.password = ''
      if ( this.lang === '中文' ) {
        this.$i18n.locale = 'zh';//关键语句
        Cookies.set('language', 'zh');
      }else {
        this.$i18n.locale = 'en';//关键语句
        Cookies.set('language', 'en');
      }
             
       },
  },
  computed: {
    ...mapGetters(['loading'])
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" >
.login-img{
  width:100%;
  text-align: center;
  padding-bottom: 20px;
}
.c{
  color: #889aa4;
}
  @import "../../assets/scss/mixin.scss";
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    @include relative;
    height: 100vh;
    // background-color: $bg;
    // input:-webkit-autofill {
    //   -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
    //   -webkit-text-fill-color: #fff !important;
    // }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 34px;
      font-weight: 400;
      font-family: CTCuHeiSJ;
      background: linear-gradient(to top,#006EF4 0%,#00E5FC 15%);
      background-clip: text;
      -webkit-background-clip: text;
      // text-fill-color: transparent;
      -webkit-text-fill-color: transparent;
      margin: 0 0 0 35% ;
      padding-top:20vh;
      text-align: center;
      font-weight: bold;
    }
    .login-form {
      border-radius: 5px;
      background: #FFFFFF;
      position: absolute;
      left: 0;
      right: 0;
      width: 380px;
      padding: 50px 35px 15px 35px;
      margin: 40px 0 0 55.6%;
    }
    .el-form-item {
      border: 1px solid #0097F6;
      background: #FFFFFF;
      border-radius: 5px;
      color: #333333;
    }
    // /deep/ .login-container input{
    //   color: #333333;
    // }
    .sub-title{
      width: 103px;
font-size: 24px;
font-family: Microsoft YaHei;
font-weight: 400;
color: #333333;
      margin-bottom: 30px;
    }
    .show-pwd {
      
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select:none;
    }
    .thirdparty-button{
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
    .lang{
      position: absolute;
      top:40px;
      right: 5%;
      width: 100px;
    }
    .lang .el-input__inner{
      color: #fff!important;
    }
  }
</style>

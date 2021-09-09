<template>
  <div class="login-container" :style="backgroundDiv">
    <!-- <h3 class="title" style="letter-spacing:3px">{{$t('navbar.title')}}</h3> -->
    <div class="dlbg" :style="dlbg">
      <img src='@/assets/img/0.png' class="logo">
      <!-- <div class="logo-title"><span>云途在线管理平台</span></div> -->
    </div>
    <el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <!-- <div class="login-img">
        <img src='../../assets/img/login-logo.png'>
      </div>  -->
      <!-- <h4 class="sub-title">{{$t('view.userLogin')}}</h4> -->
      
      <el-form-item prop="username" :rules="[{required: true, min: 3,  message: $t('message.loginuser')}]" style="margin:20px 30px 0 30px">
       <span class="pl10 c iconfont icon-denglu"></span>
        <el-input name="username" type="text" ref="username" v-model="loginForm.username" autoComplete="on" :placeholder="$t('table.username')" />
      </el-form-item>

      <el-form-item prop="password" :rules="[{required: true, min: 3,  message: $t('message.pawuser')}]" style="margin:10px 30px 0 30px">
       <span class="pl10 c iconfont icon-mima"></span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          :placeholder="$t('view.paw')" />
         
        <span :class="`show-pwd iconfont ${pwdType?'icon-yanbi':'icon-yankai'}`" @click="showPwd"></span>
      </el-form-item>
      <div style="text-align:center;font-size: 18px;font-family: Microsoft YaHei;font-weight: 400;margin-top:7%">
      <el-button type="primary" style="width:14vw;background: #3F91FF;
border-radius: 22px;height:4vh;line-height:1vh"  @click.native.prevent="handleLogin">{{$t('button.login')}}</el-button>
      </div>
      <div style="margin:1.5% 30px 0 30px">
        <div style="height:20px;line-height:20px;float:left;cursor:pointer" @click="xcx">
          <img src="../../assets/img/xcxicon.png" alt="" style="vertical-align:middle;">
          <span style="color: #3F91FF;font-family: Microsoft YaHei;font-size:14px">小程序</span>
        </div>
        <div style="height:20px;line-height:20px;float:right;cursor:pointer" @click="app">
          <img src="../../assets/img/APPicon.png" alt="" style="vertical-align:middle;">
          <span style="color: #3F91FF;font-family: Microsoft YaHei;font-size:14px">下载APP</span>
        </div>
      </div>
      <!--div class="tips">账号:admin 密码随便填</div>
      <div class="tips">账号:editor  密码随便填</div>

      <el-button class="thirdparty-button" type="primary" @click="showDialog=true">打开第三方登录</el-button-->
    </el-form>
    <div class="xiazai" v-show="flagzuo">
      <div class="sanjiao_down"></div>
      <div class="xiazai-zuo">
        <div style="display:inline-block;width:40%">
          <img src="../../assets/img/zyxcx.jpg" alt="" style="width:80%;margin-top:10px">
          <div class="xiazai-wenzi">
            <div>扫码进入小程序</div>
            <div>（专业版）</div>
          </div>
        </div>
        <div style="display:inline-block;width:40%;margin-left:10px">
          <img src="../../assets/img/qcxcx.png" alt="" style="width:80%;margin-top:10px">
          <div class="xiazai-wenzi">
            <div>扫码进入小程序</div>
            <div>（青春版）</div>
          </div>
        </div>
      </div>
    </div>
    <div class="xiazai-you" v-show="flagyou">
      <div class="sanjiao_down"></div>
      <div class="xiazai-zuo">
        <div style="display:inline-block;">
          <img src="../../assets/img/zhuanye.png" alt="" style="width:90%;margin-top:10px">
          <div class="xiazai-wenzi">
            <div>扫码下载APP</div>
            <div>（专业版）</div>
          </div>
        </div>
        <div style="display:inline-block;margin-left:20px">
          <img src="../../assets/img/az.png" alt="" style="width:90%;margin-top:10px">
          <div class="xiazai-wenzi">
            <div>扫码下载APP</div>
            <div>（青春版）</div>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <span>Copyright© 2017 rinlink.com 版权所有 ICP证：沪ICP备17021082号</span>
    </div>
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
        backgroundImage:'url(' + require('@/assets/img/bg.png') + ')',
        backgroundRepeat:'no-repeat',
        backgroundSize:'100% 100%'
      },
      dlbg:{
        backgroundImage:'url(' + require('@/assets/img/dlbg.png') + ')',
        backgroundRepeat:'no-repeat',
        backgroundSize:'100% 100%'
      },
      loginForm: {
        username: localStorage.getItem('username') || '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, min: 3, message: this.$t('message.loginuser'), trigger: 'blur'}],
        password: [{ required: true, min: 3, message: this.$t('message.pawuser') , trigger: 'blur'}]
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
      flagzuo:false,
      flagyou:false
    }
  },
  mounted() {
    this.lang = this.$i18n.locale == 'zh' ? '中文' : 'English'
    this.$refs.username.focus();
  },
  methods: {
    ...mapActions(['setRouterList','setViewTagList','setIsLogin','setRoles','setToken','setUser','setUserName','setUsercode']),
    xcx(){
      this.flagzuo = !this.flagzuo
      this.flagyou = false
    },
    app(){
      this.flagyou = !this.flagyou
      this.flagzuo = false
    },
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
          // effectiveSecond:86400
          api.login({loginAccount:this.loginForm.username,password:this.loginForm.password}).then(res=>{
            //if(res.id){
              // if(1){
              // this.setRoles(res.detail.role)
              this.setToken('Bearer '+ res.data.token)
              // console.log(routerlist.routes)
              // this.setRouterList(routerlist.routes)
              
              // this.setUser(res.holder)
              this.setUserName(this.loginForm.username)
              this.setIsLogin(1)
              
              // this.setUsercode(res.holder)
              this.$nextTick(() => {
                this.getInfo()  
                // this.$router.push('index')
              })
            // }
          }).catch(err=>{
            Message.error(this.$t('message.usererror'))
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getInfo(){
      api.getInfo().then(res => {
        this.setUser(JSON.stringify(res.data))
        this.setRoles([res.data.userType])
        const list = routerlist.routes
        for(let i = 0;i <list.length;i++){
          if(list[i].roles&&(!list[i].roles.includes(res.data.userType))){
            list.splice(i,1)
            i--
          }
        }
        console.log(list)
        this.$nextTick(() => {
          this.setRouterList(list)
          this.$router.push('index')
        })
        // console.log(res)
      }).catch(err => {
        this.$message.error(err.errMsg)
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
   input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
      -webkit-text-fill-color: #333 !important;
      -webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
      background-color:transparent;
      background-image: none;
      transition: background-color 500000s ease-in-out 0s;
    }
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      // color: $light_gray;
      // height: 47px;
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
      border-radius:0 0 5px 5px;
      background: #FFFFFF;
      position: absolute;
      top: 48.4vh;
      left: 76%;
      transform: translate(-50%, -50%);
      width: 22.1vw;
      height: 27vh;
      // padding: 1% 2.5%;
      // margin: 40px 0 0 55.6%;
    }
    .dlbg{
      width: 23vw;
      height: 20vh;
      position: absolute;
      top: 26vh;
      left: 76%;
      transform: translate(-50%, -50%);
    }
    .logo{
      width: 149px;
      // height: 119px;
      position: absolute;
      top: 10vh;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .logo-title{
      font-size: 30px;
font-family: Microsoft YaHei;
// font-weight: bold;
color: #FFFFFF;
text-shadow: 0px 2px 4px rgba(19, 149, 255, 0.35);
position: absolute;
      top: 16vh;
      left: 50%;
      transform: translate(-50%, -50%);
      letter-spacing:2px
    }
    .copyright{
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #237AC0;
      text-align: center;
      position: absolute;
      bottom: 5%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .el-form-item {
      border-bottom: 1px solid #EBF3FA;
      background: #FFFFFF;
      border-radius: 5px;
      color: #333333;
    }
    .el-form-item__content{
      height:5vh;
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
    .xiazai{
       position: absolute;
      top: 71%;
      left: 68%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    .xiazai-you{
       position: absolute;
      top: 70%;
      left: 84%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    .xiazai-zuo{
      width: 240px;
      // height: 22%;
      // line-height: 16vh;
      background: #FFFFFF;
      // opacity: 0.7;
      border-radius: 12px;
      
      // padding:5% 0;
    }
    .xiazai-wenzi{
      text-align: center;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      height: 3vh;
      margin-bottom: 20px;
    }
    .sanjiao_down{
        margin: -1px auto;
        width:0;
        height:0;
        overflow:hidden;
        font-size: 0;     /*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
        line-height: 0;  /* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
        border-width:20px;
        border-style:dashed dashed solid  dashed;/*IE6下, 设置余下三条边的border-style为dashed,即可达到透明的效果*/
        border-color:transparent transparent #fff  transparent;
        // opacity: 0.7;
    }
  }
</style>
<style type="stylesheet/scss" lang="scss" scoped>
// /deep/ .el-form-item {
//   margin-bottom: 1.2vh!important;
// }
/deep/ .el-input {
  // height: 40px!important;
  width: 70%!important;
}
</style>
<!-- by your name -->
<template>
  <div class="main">
    <div class="content" >
      <div class="topBar" >
        <el-row >
          <el-col  :lg="7" :xl="5" >
            <div class="title_top" >
              <img src='@/assets/img/toubu.png' style="display: inline-block; vertical-align: middle">
            </div>  
          </el-col>
          <el-col  :lg="14" :xl="10"   style="text-align:left;margin-top:16px;overflow: hidden;">
            <el-menu style="overflow: hidden;" :default-active="$route.path"  mode="horizontal" text-color="#fff" active-text-color="#446AEA"  background-color="#446AEA" >
              <template v-for="(item,index) in routerList">
                <router-link v-if="item.children && item.radius && item.children.length===1  && !item.children[0].children " :to="item.path+'/'+item.children[0].path" :key="item.name">
                  <el-row style="display:inline-block;">
                    <el-menu-item :index="item.path+'/'+item.children[0].path" style="width:110px;overflow: hidden;text-align:center;">
                      <i :class="'icon iconfont icon-'+item.icon"></i>
                      <span slot="title">{{$t(item.children[0].name)}}</span>
                    </el-menu-item>
                  </el-row>
                </router-link>
              </template>
            </el-menu> 
          </el-col>
          <!-- <el-col :span='2' style="line-height:40px">
            <div class="lang" >
              <el-radio-group v-model="lang" size="small" text-color="#fff" fill="#2688FF" @change="changeLangEvent()"> -->
                <!-- <el-radio-button class="lang_btn" :label="1">{{$t('button.ch')}}</el-radio-button> -->
                <!-- <el-radio-button class="lang_btn" :label="2">{{$t('button.en')}}</el-radio-button>
                <el-radio-button class="lang_btn" :label="3">{{$t('button.jpn')}}</el-radio-button> -->
              <!-- </el-radio-group>
            </div>
          </el-col> -->
          <!-- <el-col :span='1' >
            
          </el-col>  -->
          <el-col  :lg="3" :xl="9" >
            
            <el-dropdown class="fr" @command="handleCommand">
              <el-button class="fr btn-loading" size="medium">
                <!-- <i class="el-icon-user-solid" style="color:#ccc;font-size:30px;margin-right:5px;"></i> -->
                {{logname}}
                <i class="el-icon-caret-bottom" style="color:#ccc;font-size:18px;margin-right:5px;"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a"><b>{{$t('button.personal')}}</b></el-dropdown-item>
                <el-dropdown-item command="c"><b>公司简介</b></el-dropdown-item>
                <el-dropdown-item command="d" ><b>订单管理</b></el-dropdown-item>
                <el-dropdown-item command="b"><b>{{$t('button.logout')}}</b></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <i class="el-icon-message-solid fr" style="font-size:30px;color:#fff;margin-top:15px;cursor: pointer;" @click="jump('/notice')"></i>  -->
            <el-badge :is-dot='flag' style="color:#fff;margin:21px 5px 0 0;font-size:20px;cursor: pointer;" class="fr" v-if='userType!=1'>
              <i class="el-icon-message-solid"  @click="jump('/notice')" ></i>
            </el-badge>
          </el-col>
        </el-row>
      </div>
      <el-dialog
          class="editpass"
          :visible.sync="editpassstate"
          width="30%"
          center>
              <div style="height:100%">
                  <el-scrollbar style="height:100%;" ref="scrollbar">
                      <div element-loading-text="拼命加载中">
                          <el-form :model="passform" label-width="180px" label-position="right" ref="passform" :rules='passformrules'>
                              <el-row :gutter="20" style="margin-left:0;margin-right:0;">
                                  <el-col :span="24">
                                      <el-form-item :label="$t('view.oldpaw')" prop="old_password"
                                      :rules="[{ required: true, min: 6,  message: $t('message.pawlong') }]">
                                          <el-input type="password" v-model="passform.old_password" :placeholder="$t('view.oldpaw')"></el-input>
                                      </el-form-item>
                                  </el-col>
                                  <el-col :span="24">
                                      <el-form-item :label="$t('view.newpaw')" prop="password"
                                      :rules="[{ required: true, min: 6,  message: $t('message.pawlong') }]">
                                          <el-input type="password" v-model="passform.password" :placeholder="$t('view.newpaw')"></el-input>
                                      </el-form-item>
                                  </el-col>
                                  <el-col :span="24">
                                      <el-form-item :label="$t('view.again')" prop="confirm"
                                      :rules="[{ required: true, min: 6,  message: $t('message.pawlong') }]">
                                          <el-input type="password" v-model="passform.confirm" :placeholder="$t('view.again')"></el-input>
                                      </el-form-item>
                                  </el-col>
                              </el-row>
                          </el-form>
                      </div>
                  </el-scrollbar>
              </div>
          <span slot="footer" class="dialog-footer">
              <el-button size="medium" @click="editpassword" type="primary" >{{$t('button.determine')}}</el-button>
              <el-button size="medium" @click="closetab">{{$t('button.cancel')}}</el-button>
          </span>
      </el-dialog>
      
     <div class="routerView" :style="{height:height + 'px'}">
       <transition name="el-fade-in-linear">
        <keep-alive :include="viewTagKeep">
          <router-view  v-show="show"></router-view>
        </keep-alive>
      </transition>
     </div>
    
    </div>
    <el-dialog
      title="公司简介"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <div>云途星晨，为提高企业或个人对资产的有效管理，通过设备与平台、客户端相结合，融入云计算、大数据等先进技术，随时随地掌握资产的实时位置以及实时动态。</div>
      <div>上海零零智能自主研发的SaaS服务平台，基于千万级云服务系统，技术水平行业领先，具有高可用、高稳定、高安全性、分布式、可部署任何服务器等特点，实现云端智能、设备联网、数据挖掘采集、平台对接、远程监控等多样化功能，还同步开发APP、小程序移动端轻量应用，充分方便企业使用，为企业赋能。</div>
      <div>零零智能旗下现有SaaS服务平台以大数据和安全为基础，既有标准化服务云平台，也可根据客户个性化定制服务云平台。按应用领域可细分为车联网SaaS平台、NB-IoT资产管理SaaS平台、4G资产管理SaaS平台、AR/VR三维展示平台、冷链物流云SaaS平台、综合传感器SaaS平台、云途星晨SaaS平台，能够满足客户ODM个性化定制、云部署和自有业务平台的垂直需求。</div>
      <div>自2017年成立以来，零零智能旗下温湿度后台管理系统、IOT平台系统、健康设备管理软件、定位查询软件、扫码支付等超过20余个软件平台已经过国家版权局认证并颁发软件著作权登记证书。</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import api from '@/api/login/index';
import api2 from "@/api/wechart/index"
import BMap from "BMap";
import axios from 'axios'
export default {
  name: "index",
  data() {
    return {
      show: true,
      isCollapse: false,
      sidebarWidth: "250px",
      editpassstate: false,
      passform: {
        old_password: "",
        password: "",
        confirm: ""
      },
      passformrules: {
        old_password: [{ required: true, message: this.$t('message.oldin') },{ required: true, min: 5,  message: this.$t('message.long') }],
        password: [{ required: true, message: this.$t('message.newin') },{ required: true, min: 5,  message: this.$t('message.long') }],
        confirm: [{ required: true, message: this.$t('message.newagin') },{ required: true, min: 5,  message: this.$t('message.long') }]
      },
       options:[{
               lable:'zh',
               value:'中文'
             },{
               lable:'en',
               value:'English'
             }],
      lang: 1,
      height: 0,
      logname: this.$store.getters.userName,
      note: {
        backgroundImage: 'url(' + require('@/assets/img/beijing_lg.png') + ')',
        'background-repeat':'no-repeat',
        backgroundSize:"100% 100%",
        overflow: "hidden",
      },
      userType:null,
      dialogVisible:false,
      isAlarms:false,
      flag:false,
    };
  },
  mounted() {
    // console.log(this.$i18n.locale)
    this.lang = this.$i18n.locale == 'zh' ? 1 : 2
    this.height=document.body.offsetHeight-72
    this.userType = JSON.parse(sessionStorage['user']).userType
    if(!this.viewTagList.length){
      this.pushRouter({ name: this.$t('route.Home'), path: '/index/index',meta:{keep:'homepage' }})
    }
    var that = this
    
	  // that.isAlarm = sessionStorage.getItem("isAlarm")
	 
    
    if(this.userType!=1){
      this.getAlarmsDetail()
    }
  },
  methods: {
    ...mapActions(["setViewTagList","setToken","setLang","setIsAlarm"]),
    //导航栏跳转
    pushRouter(val) {
      if (this.viewTagList.filter(t => t.path == val.path).length == 0) {
        this.viewTagList.push({ name: val.name, path: val.path,keep:val.meta.keep });
        this.setViewTagList(this.viewTagList);
      }
    },
    jump(path) {
      if (path !== this.$route.path) {
        this.$router.push(path);
      }
    },
    getAlarmsDetail(){
      let data = {
        pageSize: 20,
        page: 0,
        handleStatus:0,
        containsChildren:true
      }
      api2.getAlarmsDetail(data,this.userType).then(res => {
        if(res.success){
          if(res.data.content.length>0){
            this.isAlarms = true
          }else{
            this.isAlarms = false
          }
          // sessionStorage.setItem("isAlarm", this.isAlarm)
          this.setIsAlarm(this.isAlarms)
        }else{

        }
      }).catch(err => {
        console.log(errorTestAVue)
      })
    },
    //tag 关闭
    handleClose(index, path) {
      this.viewTagList.splice(index, 1);
      this.setViewTagList(this.viewTagList);
      if (this.viewTagList.length !== 0) {
        if (this.$route.path == path) {
          this.$router.push(this.viewTagList[this.viewTagList.length - 1].path)
        }
      } else {
        if(this.$route.path=='/index/index'){ 
          this.setViewTagList([])
          this.pushRouter({ name: this.$t('route.Home'), path: '/index/index',meta:{keep:'homepage' }})
        }else{
          this.$router.push("/index/index");
        }
      }
    },
    signOut() {
      console.log(this.$store.getters)
      this.$confirm(this.$t('message.outlog'), this.$t('message.newtitle'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.cancel'),
        type: "warning"
      }).then(_ => {
          let data = {
            bearerToken:this.$store.getters.token
          }
          api.outuser().then(res => {
            sessionStorage.clear()
            window.location.reload()
          }).catch(err =>{
              this.$message({
              message: err.msg,
              type: "warning"
            })
            })
      }).catch(_ => {});
    },
    editpassword() {
      this.$refs["passform"].validate(async valid => {
        if (valid) {
          let reg = /^[\w]{6,15}$/
          if(!reg.test(this.passform.password)){
            this.$message.error(this.$t('message.geshi2'))
            return
          }
          if (this.passform.password !== this.passform.confirm) {
            this.$message({
              message: this.$t('message.newpawempty'),
              type: "warning"
            });
            return
          }
          let res=await api.login({username:this.$store.getters.userName,password:this.passform.old_password}).catch(err=>{
            if(err.statusCode==400){
              this.$message.error(this.$t('message.erroepaw'))
            }else{
              this.$message.error(this.$t('message.erroryan'))
            }
          })
          if(res&&res.token){
            this.setToken(res.token)
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage['token']
            api.userEdit({ 
               newPassword: this.passform.password,
               oldPassword: this.passform.old_password,
               username: this.$store.getters.userName
            }).then(_=>{
                if(_){
                    this.$message({
                        type: 'success',
                        message: this.$t('message.changesuc')
                    });
                    this.editpassstate=false
                    sessionStorage.clear();
                    window.location.reload();
                }else{
                    return Promise.reject()
                }
            }).catch(_=>{
                this.$message({
                    type: 'error',
                    message: _.message
                });
            })
          }
        } else {
          return false;
        }
      });
    },
    handleCommand(command) {
      if (command == "a") {
        this.$router.push('/personalCenter/setting')
        // this.passform = {
        //   old_password: "",
        //   password: "",
        //   confirm: ""
        // };
        // this.editpassstate = true;
        // this.$nextTick(() =>{
        //   this.$refs["passform"].clearValidate()
        // })
      } else if (command == "b") {
        this.signOut()
      } else if(command == "c"){
        this.dialogVisible = true
      }else if (command == "d") {
        this.$router.push('/orderManage/order')
      } 
    },
    closetab(){
      this.editpassstate = false
    },
    changeLangEvent() {
      if (this.lang === 1) {
        localStorage.setItem('locale', 'zh')
        this.$i18n.locale = 'zh'
        this.setLang(this.$i18n.locale);
        this.$message({
          message: '已切换中文！',
          type: 'success'
        })
        // this.$i18n.locale = 'zh' //关键语句
      } else if(this.lang === 2){
        localStorage.setItem('locale', 'en')
        this.$i18n.locale = 'en'
        this.setLang(this.$i18n.locale);
        this.$message({
          message: 'Switch to English!',
          type: 'success'
        })
      }else{
        localStorage.setItem('locale', 'jpn')
        this.$i18n.locale = localStorage.getItem('locale')
        this.setLang(this.$i18n.locale);
        // this.$message({
        //   message: 'Switch to English!',
        //   type: 'success'
        // })
      }
    },
  },
  watch: {
    isCollapse(v) {
      this.sidebarWidth = v ? "60px" : "200px" + " !important";
    },
    $route(val) {
      this.pushRouter(val);
    },
    getisAlarm:{//深度监听，可监听到对象、数组的变化
        handler(val, oldVal){
        console.log(val, oldVal)
        if(val){
          this.flag = true
        }else{
          this.flag = false
        }
      },
      deep:true //true 深度监听
    }
  },
  computed: {
    ...mapState(["loading", "routerList", "viewTagList","roles","isAlarm"]),
    // ...mapGetters(["loading", "routerList", "viewTagList"]),
    viewTagKeep(){
      let arr=[]
      for(let i in this.viewTagList){
        arr.push(this.viewTagList[i].keep)
      }
      return arr.join(',') || 'baidu'
    },
    getisAlarm(){
      console.log(this.$store.getters)
      return this.$store.getters.isAlarm
    }
  }
};
</script>
<style lang='scss' scoped>
.main {
  // position: relative;
  height: 100%;
  width: 100%;
  background: #eee;
  .icon {
    font-size: 21px;
    margin-right: 5px;
    width: 24px;
    vertical-align: middle;
  }
  a {
    text-decoration: none;
  }
}

  .title_top {
    // width: 179px;
    // height: 32px;
// height: 60px;
width: 100%;
// margin-top:6px;
// display:table-cell;
padding-left: 15px;
text-align:left;
// vertical-align:middle;
// background-image: 'url(' + require('@/assets/img/beijing_lg.png') + ')';
// border-radius: 0px 64px 0px 0px;
      line-height: 72px;
      // font-size: 20px;
      // font-weight: 700;
      // color: #fff;
      // float: left;
      // text-align: center;
      // padding: 0px 20px;
    }

.content {
  // min-height: 100%;
  // -webkit-transition: margin-left 0.28s;
  // transition: margin-left 0.28s;
  // margin-left: 200px;
  background: #fff;
}

.topBar {
  // line-height: 50px;
  height: 72px;
  background: #446AEA;
}


.topBar-title {
  color: #97a8be;
  font-size: 14px;
  padding-left: 20px;
  line-height: 50px;
}

.btn-loading {
  margin-top: 8px;
  // margin-right: 10px;
  font-size: 20px;
  padding: 5px 0 5px 10px !important;
  background: none !important;
  border: none;
  height: 50px;
  color: #fff;
}
.routerView {
  box-sizing: border-box;
  overflow:hidden;
  width: 100%;
}
.viewTag {
  background: #fff;
  min-height: 30px;
  padding: 1px 0 5px 10px;
  border-bottom: 1px solid #d8dce5;
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.el-tag {
  cursor: pointer;
  margin-left: 15px;
  display: inline-block;
  position: relative;
  height: 25px;
  line-height: 25px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 5px;
}
.el-tag.active {
  background-color: #42b983;
  color: #fff;
  border-color: #42b983;
}
.lang {
  float:right;
  margin-right: 10px;
  margin-top: 8px;
}
/deep/.el-radio-button .el-radio-button__inner {
  color: #2688ff;
  font-size: 14px;
  background-color: #446AEA;
  border: none;
  border-radius: 5px 5px 5px 5px;
}
/deep/.el-menu-item, .el-submenu__title{
  width: 100px;
  height: 40px;
  line-height: 40px;
  border-radius: 8px;
}
/deep/ .el-menu-item{
  padding:0 5px;
}
/deep/ .el-menu{
  // width:90%;
}
/deep/ .el-menu-item.is-active {
    background-color: #fff !important;
    border-bottom: 0!important;
}
/deep/ .el-menu.el-menu--horizontal{
    border-bottom: 0!important;
 
}
/deep/ .el-menu-item i{
  color: #fff!important;
}
/deep/ .el-menu-item.is-active i{
  color: #446AEA!important;
}
</style>
<style >
/* .main .no-redirect .el-breadcrumb__inner {
  color: #606266;
  font-weight: 500;
  cursor: text;
} */
.editpass .el-dialog.is-fullscreen.el-dialog--center {
  height: 400px;
  top: 25%;
}


</style>

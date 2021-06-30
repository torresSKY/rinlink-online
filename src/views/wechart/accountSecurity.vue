<template>
    <div >
        <el-row class="cust-title">
            <span>{{$t('view.accountSecurity')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-row style="line-height:40px">
                <el-col :span='2'>
                    <span>{{$t('view.admin')}}：</span>
                </el-col>
                <el-col :span='5' >
                    <el-input v-model="info.username" :placeholder="$t('view.admin')" disabled></el-input>
                </el-col>    
            </el-row>
            <el-row style="line-height:40px;margin:10px 0">
                <el-col :span='2'>
                    <span>{{$t('view.paw')}}：</span>
                </el-col>
                <el-col :span='5'>
                    <el-input v-model="info.username" show-password disabled></el-input>
                </el-col>    
                <el-col :span='3' :offset='1'>
                    <el-button type="text" @click="editPwd">{{$t('button.changepassword')}}</el-button>
                </el-col>
            </el-row>
        </el-card> 
        <!-- 修改密码 -->
        <el-dialog
          :title="$t('button.changepassword')"
          :visible.sync="dialogPwd"
          width="30%">
          <el-form :model="pwdForm" ref="pwdForm" :rules="pwdRules" label-width="100px">
                <el-form-item :label="$t('view.paw')" prop="password" >
                  <el-input  name="password"  v-model="pwdForm.password"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.confirmPaw')" prop="confirmPaw" >
                  <el-input  name="password"  v-model="pwdForm.confirmPaw"></el-input>
                </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogPwd = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confrimPwd">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    export default{
        name:'accountSecurity',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                height:1000,
                info:{
                    nickname:'',
                    username:'',
                },
                userId:null,
                dialogPwd:false,
                pwdForm:{
                  userId:'',
                  password:'',
                  confirmPaw:''
                },
                pwdRules: {
                  password: [{ required: true, min: 6,  message: this.$t('message.pawlong') }],
                  confirmPaw: [{ required: true, min: 6,  message: this.$t('message.pawlong') }],
                },
                type:null
            }
        },
        mounted(){
           this.type = JSON.parse(sessionStorage['user']).userType
           if(this.type==1||this.type==3){
               this.userId = JSON.parse(sessionStorage['user']).userId
           }
           this.height = document.body.offsetHeight-152
           this.getlist()
        },
        methods:{
            getlist(){ // 获取客户信息
                this.loading = true
                let data = {
                    userId: this.userId
                }
                if(this.type==3){
                    api.queryBusinessUserInfo(data,this.type).then(res => {
                      this.loading = false
                      if(res.success){
                        this.info = res.data
                      }else{
                        this.$message.error(res.msg)
                      }
                    }).catch(err => {
                      this.loading = false
                      this.$message.error(err.msg)
                    })
                }else{
                    api.getBusinessUserinfo(data,this.type).then(res => {
                      this.loading = false
                      if(res.success){
                        this.info = res.data
                      }else{
                        this.$message.error(res.msg)
                      }
                    }).catch(err => {
                      this.loading = false
                      this.$message.error(err.msg)
                    })
                }
            },
            editPwd(){ // 修改密码dialog
                this.pwdForm = {
                    password:'',
                    confirmPaw:'',
                    userId:this.info.userId
                }
                this.dialogPwd = true
                if(this.$refs['pwdForm']){
                    this.$refs['pwdForm'].resetFields()
                }
            },
            confrimPwd(){ // 修改密码
              if (this.pwdForm.password !== this.pwdForm.confirmPaw) {
                this.$message({
                  message: this.$t('message.newpawempty'),
                  type: "warning"
                })
                return
              }
              this.$refs['pwdForm'].validate((valid) => {
                if (valid) {
                  if(this.type == 1){
                    let data1 = {
                      userId:this.userId,
                      password:this.pwdForm.password
                    }
                    api.upsetPwd(data1,this.type).then(res => {
                      // debugger
                      if(res.success){
                        this.$message.success(this.$t('message.changesuc'))
                        this.$refs['pwdForm'].resetFields()
                        this.dialogPwd = false
                        this.getlist()
                      }else {
                        this.$message.error(res.msg)
                      }
                    }).catch(err => {
                      this.$message.error(err.msg)
                    })
                  }else if(this.type==3){
                    let data3 = {
                      userId:this.userId,
                      password:this.pwdForm.password
                    }
                    api.resetConsumer(data3,this.type).then(res => {
                      // debugger
                      if(res.success){
                        this.$message.success(this.$t('message.changesuc'))
                        this.$refs['pwdForm'].resetFields()
                        this.dialogPwd = false
                        this.getlist()
                      }else {
                        this.$message.error(res.msg)
                      }
                    }).catch(err => {
                      this.$message.error(err.msg)
                    })
                  }else{
                    let data = {
                      userId:this.pwdForm.userId,
                      password:this.pwdForm.password
                    }
                    api.updateCurrentPwd(data,this.type).then(res => {
                      // debugger
                      if(res.success){
                        this.$message.success(this.$t('message.changesuc'))
                        this.$refs['pwdForm'].resetFields()
                        this.dialogPwd = false
                        this.getlist()
                      }else {
                        this.$message.error(res.msg)
                      }
                    }).catch(err => {
                      this.$message.error(err.msg)
                    })
                  }
                  
                } else {
                  this.$message.warning(this.$t('message.checkmsg'))
                  return false
                }
              })              
            }
            
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>
.cust-title{
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #333333;
  line-height: 40px;
  border: 1px solid #dbe6fa;
  background: #EDF3FF;
  padding-left: 20px;
}
</style>
<template>
    <div >
        <el-row class="cust-title">
            <span>{{$t('view.basicInfo')}}</span>
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
                    <span>{{$t('table.customerName')}}：</span>
                </el-col>
                <el-col :span='5' >
                    <el-input v-model="info.nickname" :placeholder="$t('table.customerName')" ></el-input>
                </el-col>    
            </el-row>
            <el-row style="line-height:40px;">
                <el-col :span='2'>
                    <span>{{$t('table.contacts')}}：</span>
                </el-col>
                <el-col :span='5' >
                    <el-input v-model="info.personToContact" :placeholder="$t('table.contacts')" ></el-input>
                </el-col>    
            </el-row>
            <el-row style="line-height:40px;margin:10px 0">
                <el-col :span='2'>
                    <span>{{$t('table.phone')}}：</span>
                </el-col>
                <el-col :span='5' >
                    <el-input v-model="info.phoneNumber" :placeholder="$t('table.phone')" ></el-input>
                </el-col>    
            </el-row>
            <el-row>
                <el-col :span='3' :offset='2'>
                    <el-button type="primary" @click="confrimInfo">{{$t('button.save')}}</el-button>
                </el-col>
            </el-row>
        </el-card> 
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    export default{
        name:'basicInfo',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                height:1000,
                info:{
                    nickname:'',
                    username:'',
                    phoneNumber:'',
                    personToContact:'',
                    userId:''
                },
                userId:''
            }
        },
        mounted(){
           this.height = document.body.offsetHeight-152
           this.getlist()
        },
        methods:{
            getlist(){ // 获取客户信息
                this.loading = true
                let data = {
                    userId: this.userId
                }
                api.getBusinessUserinfo(data).then(res => {
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
            },
            confrimInfo(){ // 确认更新客户信息
                let data = {
                    userId: this.info.userId,
                    nickname: this.info.nickname,
                    personToContact: this.info.personToContact,
                    phoneNumber: this.info.phoneNumber
                }
                api.editBusinessUserinfo(data).then(res => {
                  if(res.success){
                    this.$message.success(this.$t('message.savesuc'))
                    this.getlist()
                  }else {
                    this.$message.error(res.msg)
                  }
                }).catch(err => {
                  this.$message.error(err.msg)
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
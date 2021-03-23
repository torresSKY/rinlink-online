<template>
    <div  >
        <el-row class="cust-title">
            <span>{{$t('view.siteSettings')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-row style="line-height:40px;margin-bottom:10px">
                <el-col :span='2'>
                    <span>{{$t('view.companyName')}}</span>
                </el-col>
                <el-col :span='5'>
                    <el-input v-model="value" :placeholder="$t('view.companyName')" clearable></el-input>
                </el-col>
            </el-row>
            <el-row style="line-height:40px;margin-bottom:10px">
                <el-col :span='2'>
                    <span>{{$t('view.siteName')}}</span>
                </el-col>
                <el-col :span='5'>
                    <el-input v-model="value" :placeholder="$t('view.siteName')" clearable></el-input>
                </el-col>
            </el-row>
            <el-row style="line-height:40px;margin-bottom:10px">
                <el-col :span='2'>
                    <span>{{$t('view.siteLogo')}}</span>
                </el-col>
                <el-col :span='5'>
                    <el-upload
                      class="avatar-uploader"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :show-file-list="false" :on-success="handleAvatarSuccess"
                      >
                      <img v-if="imageUrl" :src="imageUrl" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row style="line-height:40px;margin-bottom:10px">
                <el-col :span='2'>
                    <span>{{$t('view.siteicon')}}</span>
                </el-col>
                <el-col :span='5'>
                    <el-upload
                      class="upload-demo"
                      action="https://jsonplaceholder.typicode.com/posts/"
                      :limit="1"
                      :file-list="fileList">
                      <el-button size="small" type="primary">{{$t('button.clickip')}}</el-button>
                      <div slot="tip" class="el-upload__tip">注意：icon文件格式为ico</div>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row style="line-height:40px;margin-bottom:10px">
                <el-col :span='2'>
                    <span>{{$t('view.domain')}}</span>
                </el-col>
                <el-col :span='3'>
                    <el-input v-model="value"  clearable></el-input>
                </el-col>
                <el-col :span='4'>
                    <span>.chelianwang.rinlink.com</span>
                </el-col>
                <el-col :span='3'>
                    <el-button class="butresh" >{{$t('button.clickCopy')}}</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='3' :offset='2'>
                    <el-button class="butresh" >{{$t('button.save')}}</el-button>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
import api from '@/api/wechart/index'
import mixin from '@/mixins/index'
import axios from 'axios'
import {mapState} from 'vuex'
import {alatype,order} from '@/plugins/filter.js'
import { formatDate } from '@/plugins/date.js'
import BaseTable from '@/components/table'

export default{
    name:'siteSettings',
    components:{ BaseTable, },
    mixins:[mixin],
    computed:{
        ...mapState({user:'user',adminRoles:'roles'})
    },
    data(){
      const validateimei = (rule, value, callback) => {
        //   debugger
         var reg = /^\d{11,15}$/
        if (!reg.test(value)) {
        callback(new Error(this.$t('message.guid15')))
        }else {
        callback()
        }
      }
     return {
         pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now()
            }
        },
        height:1000,
        value:null,
        loading:false,
        imageUrl:'',
        fileList:[]
      }
    },
    mounted(){
        this.height=document.body.offsetHeight-152
        
    },
    methods:{
       handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      }
   },
  // 过滤器格式化时间戳
  filters: {
    //  时间格式自定义 只需把字符串里面的改成自己所需的格式
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },

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
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #b1abab;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

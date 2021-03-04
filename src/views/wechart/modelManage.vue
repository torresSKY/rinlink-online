<template>
    <div  >
        <el-row class="cust-title">
            <span>{{$t('table.model')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-col :span='24'>
                <el-row class="list-search" :gutter="22">
                  <el-col :span='3'>
                    <el-input v-model="deviceModelName" :placeholder="$t('table.model')" clearable></el-input>
                  </el-col>
                  <el-col :span='5'>
                    <el-button class="butresh" @click="getlist()">{{$t('button.search')}}</el-button>
                    <el-button class="butadd" @click="addModel">{{$t('button.add')}}</el-button>
                  </el-col>
                </el-row>
                
                <el-row :gutter="22" class="list-search" >
                    <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh;padding:0 10px" ></BaseTable>
                </el-row>
                <el-pagination
                    @current-change='changeindex'
                    layout="prev, pager, next"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    :total="page.total"
                    background
                    style="text-align:center">
                </el-pagination>
            </el-col>
        </el-card>
        <!-- 添加/编辑设备型号 -->
        <el-dialog
            :title="isEdit? $t('button.editor'): $t('button.add')"
            :visible.sync="dialogModel"
            width="30%">
            <el-form :model="modelForm" :rules="rules" ref="modelForm" label-width="120px" class="demo-ruleForm">
              <el-form-item :label="$t('table.model')" prop="name" >
                  <el-input v-model="modelForm.name" :placeholder="$t('table.model')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('table.communication')" prop="iotServiceId">
                 <el-select v-model="modelForm.iotServiceId" :placeholder="$t('table.communication')">
                    <el-option
                      v-for="item in options"
                      :key="item.iotServiceId"
                      :label="item.iotServiceName"
                      :value="item.iotServiceId">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.note')" prop="description" >
                  <el-input v-model="modelForm.description" :placeholder="$t('table.note')" type="textarea" :rows="2"></el-input>
              </el-form-item>
            </el-form>  
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogModel = false">{{$t('button.cancel')}}</el-button>
                <el-button type="primary" @click="confrimModel">{{$t('button.determine')}}</el-button>
            </span>
        </el-dialog>
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
    name:'modelManage',
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
                return time.getTime() > Date.now();
                }
            },
        height:1000,
        deviceModelName:null,
        value:null,
        loading:false,
        dataList:[],
        tableLabel: [
          {label: this.$t('table.model'), prop: 'name'},
          {label: this.$t('table.communication'), prop: 'iotServiceName'},
          {label: this.$t('table.orderMsg'), type:'clickEvent',
          tableClick: (val) => {
            this.showDialog('a', val)
          }},
          {label: this.$t('table.addtime'), prop: 'createTime'},
          {label: this.$t('table.operation'),
            type: 'clickSelect',
            selectOperation: (index, row) => {
              this.showDialog(index, row)
            },
            selectText: [
              // {command: '1', text: this.$t('button.editor'), index: 1},
              {command: '2', text: this.$t('button.dele'), index: 2} ]
          }
        ],
        isEdit:false,
        dialogModel:false,
        modelForm:{
          name:'',
          iotServiceId:'',
          description:''
        },
        rules:{
          name: [
            { required: true, message: this.$t('message.enterModel'), trigger: 'blur' },
          ],
          iotServiceId: [
            { required: true, message: this.$t('message.selCommun'), trigger: 'blur' },
          ],
        },
        options:[]
      }
    },
    mounted(){
        this.height=document.body.offsetHeight-152
        this.getlist()
    },
    methods:{
        getlist(){ // 获取设备型号列表
            this.loading = true
            api.getModelList({params: {
              pageSize: this.page.size,
              page: this.page.index - 1,
              deviceModelName: this.deviceModelName,
            }}).then(res => {
              this.loading = false
              this.dataList = res.data.content
              this.page.total = res.data.pageTotal
            }).catch(err => {
              this.loading = false
              this.dataList = []
              this.$message.error(err.errMsg)
            })
        },
        getServices(){ // 获取通信协议
            api.getServices().then(res => {
              this.options = res.data
            }).catch(err => {
              this.options = []
              this.$message.error(err.errMsg)
            })
        },
        addModel(){ // 添加设备型号
          if(this.$refs['modelForm']){
            this.$refs['modelForm'].resetFields()
          }
          this.modelForm={
            name:'',
            iotServiceId:'',
            description:''
          }
          this.dialogModel = true
          this.getServices()
        },
        confrimModel(){ // 确认添加设备型号
          this.$refs['modelForm'].validate((valid) => {
            if (valid) {
              let data = {
                name:this.modelForm.name,
                iotServiceId:this.modelForm.iotServiceId,
                description:this.modelForm.description
              }
              api.addModel(data).then(res => {
                // debugger
                if(res.msg=='OK'){
                  this.$message.success(this.$t('message.addsuc'))
                  this.$refs['modelForm'].resetFields()
                  this.dialogModel = false
                  this.getlist()
                }else {
                  this.$message.error(res.msg)
                }
              }).catch(err => {
                this.$message.error(err.errMsg)
              })
            } else {
              this.$message.warning(this.$t('message.checkmsg'))
              return false
            }
          })
        },
        showDialog(index, data){ // 操作
          console.log(index, data)
          switch (index) {
            case '2': // 删除设备型号
              this.$confirm(this.$t('message.equdele'), this.$t('message.newtitle'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.cancel'),
                type: 'warning'
              }).then(() => {
                let id = {
                  deviceModelId:data.id
                }
                api.deleModel(id).then(res => {
                  if(res.msg=='OK'){
                    this.$message.success(this.$t('message.delesuc'))
                    this.getlist()
                  }else{
                    this.$message.error(res.msg)
                  }
                  
                }).catch(err => {
                  this.$message.error(err.errMsg)
                })
              }).catch(err => {
                console.log(err)
              })
              break
            case 'a' : // 跳转指令信息
              // this.$router.push({ name: 'orderMsg' })
              break
          }
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
.cust-subtitle{
    margin-top: 10px;
    border: 1px solid #EDF3FF;
}
.list-search{
  padding: 10px 0 0 15px;
}
</style>

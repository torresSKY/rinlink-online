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
                
                <el-row :gutter="22" class="list-search" :style="{height:tableHeight - 220 + 'px',overflow:'auto', }">
                    <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  ></BaseTable>
                </el-row>
                <el-pagination
                    @current-change='changeindex'
                    layout="total,prev, pager, next"
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
            :title="isEdit? '编辑设备型号': '添加设备型号'"
            :visible.sync="dialogModel"
            width="36%">
            <el-form :model="modelForm" :rules="rules" ref="modelForm" label-width="120px" class="demo-ruleForm">
              <el-form-item :label="$t('table.model')" prop="name" >
                  <el-input v-model="modelForm.name" :placeholder="$t('table.model')"></el-input>
              </el-form-item>
              <!-- <el-form-item :label="$t('table.communication')" prop="iotServiceId">
                 <el-select v-model="modelForm.iotServiceId" :placeholder="$t('table.communication')">
                    <el-option
                      v-for="item in options"
                      :key="item.iotServiceId"
                      :label="item.iotServiceName"
                      :value="item.iotServiceId">
                    </el-option>
                  </el-select>
              </el-form-item> -->
              <el-form-item :label="$t('table.note')" prop="description" >
                  <el-input v-model="modelForm.description" :placeholder="$t('table.note')" type="textarea" :rows="2"></el-input>
              </el-form-item>
              <el-form-item style="color:red" v-if="isEdit">
                <div>注：修改设备型号后，可能不会立即生效。</div>
                <div>根据该型号出货数量多少，需要等待几分钟或几个小时才能全部生效。</div>
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
        height:800,
        deviceModelName:null,
        value:null,
        loading:false,
        dataList:[],
        tableLabel: [
          {label: this.$t('table.model'), prop: 'name'},
          // {label: this.$t('table.communication'), prop: 'iotServiceName'},
          {label: this.$t('table.orderMsg'), type:'clickEvent',
          name:'指令信息',
          tableClick: (val) => {
            this.showDialog('a', val)
          }},
          {label: this.$t('table.addtime'), prop: 'createTime', type: 'Timestamp'},
          {label: this.$t('table.operation'),
            type: 'clickSelect',
            selectOperation: (index, row) => {
              this.showDialog(index, row)
            },
            selectText: [
              {command: '1', text: this.$t('button.editor'), index: 1},
              {command: '2', text: this.$t('button.dele'), index: 2} ]
          }
        ],
        isEdit:false,
        dialogModel:false,
        modelForm:{
          deviceModelId:'',
          name:'',
          iotServiceId:'',
          description:''
        },
        rules:{
          name: [
            { required: true, message: this.$t('message.enterModel'), trigger: 'blur' },
          ],
          // iotServiceId: [
          //   { required: true, message: this.$t('message.selCommun'), trigger: 'blur' },
          // ],
        },
        options:[],
        type:null,
        tableHeight:document.body.offsetHeight - 102
      }
    },
    mounted(){
      var that =this
      window.onresize = () => {
        return (() => {
          that.tableHeight = document.body.offsetHeight - 102
        })()
      }
      this.type = JSON.parse(sessionStorage['user']).userType
      this.height=document.body.offsetHeight-152
      this.getlist()
    },
    methods:{
        getlist(){ // 获取设备型号列表
            this.loading = true
            let data = {
              pageSize: this.page.size,
              page: this.page.index - 1,
              deviceModelName: this.deviceModelName,
            }
            api.getModelList(data,this.type).then(res => {
              this.loading = false
              this.dataList = res.data.content
              this.page.total = res.data.totalElements
            }).catch(err => {
              this.loading = false
              this.dataList = []
              this.$message.error(err.msg)
            })
        },
        getServices(){ // 获取通信协议
            api.getServices(this.type).then(res => {
              this.options = res.data
            }).catch(err => {
              this.options = []
              this.$message.error(err.msg)
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
        confrimModel(){ // 确认添加/编辑设备型号
          this.$refs['modelForm'].validate((valid) => {
            if (valid) {
              if(!this.isEdit){
                let data = {
                  name:this.modelForm.name,
                  // iotServiceId:this.modelForm.iotServiceId,
                  iotServiceId:'tcp',
                  description:this.modelForm.description
                }
                api.addModel(data,this.type).then(res => {
                  // debugger
                  if(res.success){
                    this.$message.success(this.$t('message.addsuc'))
                    this.$refs['modelForm'].resetFields()
                    this.dialogModel = false
                    this.getlist()
                  }else {
                    this.$message.error(res.msg)
                  }
                }).catch(err => {
                  this.$message.error(err.msg)
                })
              }else{
                let data2 = {
                  deviceModelId:this.modelForm.deviceModelId,
                  name:this.modelForm.name,
                  description:this.modelForm.description
                }
                api.updateModel(data2,this.type).then(res => {
                  // debugger
                  if(res.success){
                    this.$message({message:res.msg,type:'warning',offset:'200',duration:'3000'})
                    this.$refs['modelForm'].resetFields()
                    this.dialogModel = false
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
        },
        showDialog(index, data){ // 操作
          // console.log(index, data)
          switch (index) {
            case '1': // 编辑设备型号
              if(this.$refs['modelForm']){
                this.$refs['modelForm'].resetFields()
              }
              this.modelForm={
                deviceModelId:data.id,
                name:data.name,
                iotServiceId:data.iotServiceId,
                description:data.description
              }
              this.isEdit = true
              this.dialogModel = true
              break
            case '2': // 删除设备型号
              const confirmText = ['删除该设备型号后，对应的"指令信息"等数据都讲失效，请再次确认是否要删除该型号？','  ','注：如果该型号下有设备，请先删除所有设备后再来删除该型号。'] 
              const newDatas = []
              const h = this.$createElement
              for (const i in confirmText) {
                // debugger
                if(i==2){
                  newDatas.push(h('div', { style: 'color: red;margin-top:10px' }, confirmText[i]))
                }else{
                  newDatas.push(h('div', null, confirmText[i]))
                }
                
              }
              this.$confirm(h('div', null, newDatas), '警告', {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.cancel'),
                type: 'warning'
              }).then(() => {
                let id = {
                  deviceModelId:data.id
                }
                api.deleModel(id,this.type).then(res => {
                  if(res.success){
                    this.page.index = 1
                    this.$message.success(this.$t('message.delesuc'))
                    this.getlist()
                  }else{
                    this.$message.error(res.msg)
                  }
                  
                }).catch(err => {
                  this.$message.error(err.msg)
                })
              }).catch(err => {
                console.log(err)
              })
              break
            case 'a' : // 跳转指令信息
              this.$router.push({ path: '/orderMsg/setting' ,query:{deviceModelId:data.id} })
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

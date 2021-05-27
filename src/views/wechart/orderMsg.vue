<template>
    <div  >
        <el-row class="cust-title">
            <el-page-header @back="goBack" >
            </el-page-header>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-col :span='24'>
                <el-row class="list-search" :gutter="22">
                  <el-col :span='3'>
                    <el-input v-model="deviceModelName" :placeholder="$t('message.orderName')" clearable></el-input>
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
        <!-- 添加/编辑指令 -->
        <el-dialog
            :title="isEdit? $t('button.editor'): $t('button.add')"
            :visible.sync="dialogModel"
            width="38%">
            <el-form :model="modelForm" :rules="rules" ref="modelForm" label-width="140px" class="demo-ruleForm">
              <el-form-item :label="$t('table.orderName')" prop="templateName" >
                  <el-input v-model="modelForm.templateName" :placeholder="$t('table.orderName')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('table.orderData')" prop="templateContent" >
                  <el-input v-model="modelForm.templateContent" :placeholder="$t('table.orderData')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('table.instructions')" prop="templateRemark" >
                  <el-input v-model="modelForm.templateRemark" :placeholder="$t('table.instructions')" type="textarea" :rows="2"></el-input>
              </el-form-item>
              <el-form-item :label="$t('table.orderDataMode')" prop="commandDataProcessType">
                 <el-select v-model="modelForm.commandDataProcessType" :placeholder="$t('table.orderDataMode')" >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="groovyScript" prop="groovyScript" >
                  <el-input v-model="modelForm.groovyScript" placeholder="groovyScript" type="textarea" :rows="3"></el-input>
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
    name:'orderMsg',
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
          {label: this.$t('table.orderName'), prop: 'templateName'},
          {label: this.$t('table.instructions'), prop: 'templateRemark'},
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
          templateName:'',
          templateContent:'',
          templateRemark:'',
          commandDataProcessType:'groovy',
          groovyScript:''
        },
        rules:{
          templateName: [
            { required: true, message: this.$t('message.enterOrderName'), trigger: 'blur' },
          ],
          templateContent: [
            { required: true, message: this.$t('message.enterOrderData'), trigger: 'blur' },
          ],
          groovyScript: [
            { required: true, message: this.$t('message.groovyScript'), trigger: 'blur' },
          ],
        },
        options:[{id: 'groovy', name: 'groovy'}],
        deviceModelId:null,
        type:null
      }
    },
    mounted(){
      this.type = JSON.parse(sessionStorage['user']).userType
        this.height=document.body.offsetHeight-152
        this.deviceModelId = this.$route.query.deviceModelId
        this.getlist()
    },
    methods:{
        goBack(){
          this.$router.push({ path: '/setting/modelManage' })
        },
        getlist(){ // 获取指令模板列表
            this.loading = true
            let data = {
              deviceModelId:this.deviceModelId
            }
            api.getCmdTemplates(data).then(res => {
              this.loading = false
              this.dataList = res.data
              this.page.total = res.data.totalElements != null ? res.data.totalElements :0
            }).catch(err => {
              this.loading = false
              this.dataList = []
              this.$message.error(err.errMsg)
            })
        },
        addModel(){ // 添加指令模板
          if(this.$refs['modelForm']){
            this.$refs['modelForm'].resetFields()
          }
          this.modelForm = {
            templateName:'',
            templateContent:'',
            templateRemark:'',
            commandDataProcessType:'groovy',
            groovyScript:''
          }
          this.isEdit = false
          this.dialogModel = true
        },
        confrimModel(){ // 确认添加指令模板
          this.$refs['modelForm'].validate((valid) => {
            if (valid) {
              if(!this.isEdit){
                let data = {
                  deviceModelId:this.deviceModelId,
                  templateName:this.modelForm.templateName,
                  templateContent:this.modelForm.templateContent,
                  templateRemark:this.modelForm.templateRemark,
                  commandDataProcessType:this.modelForm.commandDataProcessType,
                  groovyScript:this.modelForm.groovyScript
                }
                api.createCmdTemplates(data,this.type).then(res => {
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
              }else {
                let data = {
                  id:this.modelForm.id,
                  deviceModelId:this.deviceModelId,
                  templateName:this.modelForm.templateName,
                  templateContent:this.modelForm.templateContent,
                  templateRemark:this.modelForm.templateRemark,
                  commandDataProcessType:this.modelForm.commandDataProcessType,
                  groovyScript:this.modelForm.groovyScript
                }
                api.updateCmdTemplates(data,this.type).then(res => {
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
              }
              
            } else {
              this.$message.warning(this.$t('message.checkmsg'))
              return false
            }
          })
        },
        showDialog(index, data){ // 操作
          console.log(index, data)
          if(index == 2){
            this.$confirm(this.$t('message.equdele'), this.$t('message.newtitle'), {
              confirmButtonText: this.$t('button.determine'),
              cancelButtonText: this.$t('button.cancel'),
              type: 'warning'
            }).then(() => {
              let id = {
                deviceCmdTemplateId:data.deviceCmdTemplateId
              }
              api.deleteCmdTemplates(id,this.type).then(res => {
                if(res.success){
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
          }else if (index == 1){

            this.getDeviceCmdTemplates(data.deviceCmdTemplateId)
          }
        },
        getDeviceCmdTemplates(id){ // 获取指令模板
          let data = {
            deviceCmdTemplateId:id
          }
          api.getDeviceCmdTemplates(data,this.type).then(res => {
            this.modelForm = {
              templateName:res.data.templateName,
              templateContent:res.data.templateContent,
              templateRemark:res.data.templateRemark,
              commandDataProcessType:'groovy',
              groovyScript:res.data.groovyScript
            }
            this.modelForm['id'] = id
            this.isEdit = true
            this.dialogModel = true
          }).catch(err => {
            console.log(err)
          })
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
  padding:5px 0 5px 20px;
}
.cust-subtitle{
    margin-top: 10px;
    border: 1px solid #EDF3FF;
}
.list-search{
  padding: 10px 0 0 15px;
}
</style>

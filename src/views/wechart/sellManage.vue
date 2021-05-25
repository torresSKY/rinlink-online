<template>
    <div  >
        <el-row class="cust-title">
            <span>{{$t('route.List')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-col :span='24'>
                <el-row class="list-search" :gutter="22">
                  <el-col :span='3'>
                    <el-input v-model="deviceNumber" :placeholder="$t('table.searchimeiiccid')" clearable></el-input>
                  </el-col>
                  <el-col :span='3'>
                    <el-select v-model="deviceModelId" clearable :placeholder="$t('table.model')">
                      <el-option
                        v-for="item in modelList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='3'>
                    <el-select v-model="businessUserId" clearable :placeholder="$t('table.agent')">
                      <el-option
                        v-for="item in businessoptions"
                        :key="item.userId"
                        :label="item.username"
                        :value="item.userId">
                      </el-option>
                    </el-select>
                  </el-col>
                  
                  <el-col :span='3'>
                    <el-select v-model="isWithCard" clearable :placeholder="$t('table.isCard')">
                      <el-option
                        v-for="item in isCardoptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='3'>
                     <el-input v-model="batchNumber" :placeholder="$t('table.batch')"></el-input>
                  </el-col>
                  <el-col :span='6'>
                    <el-button class="butresh" @click="getlist">{{$t('button.search')}}</el-button>
                    <el-button class="butdele" @click="sell('one')">{{$t('button.sell')}}</el-button>
                    <el-button class="butdele" @click="sell('more')">{{$t('button.sellMore')}}</el-button>
                    <!-- <el-button class="butadd" >{{$t('button.download')}}</el-button> -->
                  </el-col>
                </el-row>
                <el-row class="list-search" :gutter="22">
                    <el-col :span='3'>
                      <el-select v-model="timeType" clearable :placeholder="$t('table.timeType')">
                        <el-option
                          v-for="item in timeTypeoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span='5' >
                        <el-date-picker
                          clearable
                          style="width:98%"
                          v-model="timevalue"
                          type="datetimerange"
                          value-format="timestamp"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-col>
                    <el-col :span='3'>
                      <el-input v-model="iccid" :placeholder="$t('table.searchiccid')" clearable></el-input>
                    </el-col>
                    <!-- <el-col :span='3'>
                      <el-select v-model="useStatus" clearable :placeholder="$t('view.inputstate2')">
                        <el-option
                          v-for="item in useStatusoptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>   -->
                </el-row>
                <el-row :gutter="22" class="list-search" style="margin-bottom:10px">
                  <el-scrollbar style="height:64vh;" ref="scrollbar">
                    <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  ></BaseTable>
                  </el-scrollbar>
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
        <!-- 出货/批量出货 -->
        <el-dialog
          :title="isMore? $t('button.sellMore'): $t('button.sell')"
          :visible.sync="dialogShipment"
          width="30%">
          <el-form :model="shipmentForm" :rules="rules" ref="shipmentForm" label-width="100px" class="demo-ruleForm">
              <el-form-item :label="$t('table.model')" prop="deviceModelId">
                 <el-select v-model="shipmentForm.deviceModelId" :placeholder="$t('table.model')">
                    <el-option
                      v-for="item in modelList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.agent')" prop="businessUserId">
                 <el-select v-model="shipmentForm.businessUserId" :placeholder="$t('table.agent')">
                    <el-option
                      v-for="item in businessoptions"
                      :key="item.userId"
                      :label="item.username"
                      :value="item.userId">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.imei')" prop="deviceNumber" v-if="!isMore">
                  <el-input v-model="shipmentForm.deviceNumber" :placeholder="$t('table.imei')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('view.upfile')"  v-if="isMore">
                  <el-upload class="upload-demo" ref="upload" :limit="1" accept=".xls, .xlsx" action="string" :file-list="fileList" :show-file-list="true" :auto-upload="false"  :on-remove="handleRemove" :on-change="handleChange" >
                    <el-button slot="trigger" size="medium" type="primary">{{$t('button.clickip')}}</el-button>
                  </el-upload>
              </el-form-item>
              <el-form-item :label="$t('table.isCard')" prop="isWithCard">
                 <el-select v-model="shipmentForm.isWithCard" :placeholder="$t('table.isCard')">
                    <el-option
                      v-for="item in isCardoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.serviceLife')" prop="usageYears">
                 <el-select v-model="shipmentForm.usageYears" :placeholder="$t('table.serviceLife')">
                    <el-option
                      v-for="item in usageYearsoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.activationType')" prop="activationType">
                 <el-select v-model="shipmentForm.activationType" :placeholder="$t('table.activationType')"
                  @change="changeActivationType">
                    <el-option
                      v-for="item in activationoptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.activationTime')" prop="activationTime" v-if="shipmentForm.activationType==2">
                 <el-date-picker
                    v-model="shipmentForm.activationTime"
                    type="date"
                    value-format="timestamp"
                    :placeholder="$t('table.activationTime')">
                  </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('table.batch')" >
                  <el-input v-model="shipmentForm.batchNumber" :placeholder="$t('table.batch')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('table.date')" >
                  <el-date-picker
                    v-model="shipmentForm.productionDate"
                    type="date"
                    value-format="timestamp"
                    :placeholder="$t('table.date')">
                  </el-date-picker>
              </el-form-item>
          </el-form>      
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogShipment = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confrimShipment">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/api/wechart/index.js'
import mixin from '@/mixins/index'
import axios from 'axios'
import {mapState} from 'vuex'
import { formatDate } from '@/plugins/date.js'
import BaseTable from '@/components/table'
import sendOrder from './sendOrder.vue'
export default{
    name:'sellManage',
    components:{ BaseTable,sendOrder },
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
        deviceNumber:null,
        deviceModelId:null,
        iccid:null,
        modelList:[],
        isWithCard:null,
        isCardoptions:[
          {value: true,label: '是'},{value: false,label: '否'},
        ],
        batchNumber:null,
        businessUserId:null,
        businessoptions:[],
        useStatus:null,
        useStatusoptions:[
          {value: 0,label: '未激活'},{value: 1,label: '激活'},{value: 2,label: '到期'}
        ],
        timeType:'',
        timeTypeoptions: [
          {value: 0,label: '激活时间'},{value: 1,label: '生产时间'},{value: 2,label: '出货时间'}
        ],
        timevalue:null,
        usageYearsoptions:[
          {value: 1,label: '1年'},{value: 2,label: '2年'},{value: 3,label: '3年'},
          {value: 5,label: '5年'},{value: -1,label: '无限制'}
        ],
        activationoptions:[
          {value: 0,label: '开机激活'},{value: 1,label: '注册激活'},{value: 2,label: '固定时间激活'}
        ],
        loading:false,
        dataList:[],
        tableLabel: [
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.Device'), prop: 'deviceName'},
          {label: this.$t('table.model'), prop: 'model',type: 'render',
            formatter: (params) => {
              // console.log(params)
              params['model'] = params.deviceModel.name
              return params
            }
          },
          {label: this.$t('table.imei'), prop: 'deviceNumber'},
          {label: this.$t('table.agent'), prop: 'username',
            type: 'render',
            formatter: (params) => {
              // console.log(params)
              params['username'] = params.owner.username
              return params
            }
          },
          {label: this.$t('table.activationType'), prop: 'activationType',
            type: 'render',
            formatter: (params) => {
              params.activationType = params.activationType == 0 ? '开机激活' : params.activationType == 1 ? '注册激活' : params.activationType == 2 ? '固定时间激活' : params.activationType
              return params
            }
          },
          {label: this.$t('table.activationTime'), prop: 'activationTime', type: 'Timestamp'},
          {label: this.$t('table.date'), prop: 'productionDate', type: 'TimestampDate'},
          {label: this.$t('table.isCard'), prop: 'withCard',
            type: 'render',
              formatter: (params) => {
                params.withCard = params.withCard == true ? '是'  : params.withCard == false ? '否' : params.withCard
                return params
              }
            },
          {label: this.$t('table.iccid'), prop: 'iccid'},
          {label: this.$t('table.batch'), prop: 'batchNumber'},
          // {label: this.$t('table.serviceLife'), prop: 'usageYears'},
          {label: this.$t('table.deliveryTime'), prop: 'createTime', type: 'Timestamp'},
          {label: this.$t('table.expire2'), prop: 'serviceExpireTime', type: 'Timestamp'},
          // {label: this.$t('table.usestatus'), prop: 'status'},
        ],
        dialogShipment:false,
        isMore:false,
        shipmentForm:{
            deviceModelId:'',
            businessUserId:'',
            deviceNumber:'',
            isWithCard:'',
            usageYears:'',
            activationType:'',
            activationTime:'',
            batchNumber:'',
            productionDate:''
        },
        rules:{
          deviceModelId: [
            { required: true, message: this.$t('table.model'), trigger: 'change' }
          ],
          businessUserId: [
            { required: true, message: this.$t('table.agent'), trigger: 'change' }
          ],
          deviceNumber: [
            { required: true, message: this.$t('table.imei'), trigger: 'blur' }
          ],
          isWithCard: [
            { required: true, message: this.$t('table.isCard'), trigger: 'change' }
          ],
          usageYears: [
            { required: true, message: this.$t('table.serviceLife'), trigger: 'change' }
          ],
          activationType: [
            { required: true, message: this.$t('table.activationType'), trigger: 'change' }
          ],
          activationTime:[
            { type: 'date', required: true, message: this.$t('table.activationTime'), trigger: 'change' }
          ]
        },
        fileList:[],
        uploadDeviceNumber:'',
        flag:false
      }
    },
    mounted(){
        console.log(this.$store.getters.user)
        var that = this
        this.getlist()
        this.getModel()
        this.getBusiness()
        window.onresize = () => {
             return (() => {
                 that.height = document.body.offsetHeight-142
             })()
           }
    },
    methods:{
        getlist(){ // 获取出货列表
            this.loading = true
            let start = null
            let end = null
            if(this.timevalue!=null&&this.timevalue!=''){
              start = this.timevalue[0]
              end = this.timevalue[1]
            }else{
              start = null
              end = null
            }
            if(this.deviceNumber==''){
              this.deviceNumber = null
            }
            if(this.deviceModelId==''){
              this.deviceModelId=null
            }
            if(this.iccid==''){
              this.iccid = null
            }
            let data = {
              pageSize: this.page.size,
              page: this.page.index - 1,
              iccid:this.iccid,
              deviceNumberKeyword:this.deviceNumber,
              deviceModelId:this.deviceModelId,
              ownerId:this.businessUserId,
              withCard:this.isWithCard,
              batchNumber:this.batchNumber,
              usageStatus:this.usageStatus,
              timeType:this.timeType,
              startTime:start,
              endTime:end
            }
            console.log(api)
            api.getShipmentList(data).then(res => {
              this.loading = false
              this.dataList = res.data.content
              this.page.total = res.data.pageTotal
            }).catch(err => {
              this.loading = false
              this.dataList = []
              this.$message.error(err.msg)
            })
        },
        getModel(){ // 获取设备型号
          api.getModelList({params: {
              pageSize: 100,
              page: this.page.index - 1
            }}).then(res => {
              this.modelList = res.data.content
            }).catch(err => {
              this.modelList = []
              this.$message.error(err.msg)
            })
        },
        getBusiness(){ // 获取代理商
          let data = {
            parentId:null
          }
          api.getBusiness(data).then(res => {
              this.businessoptions = res.data
            }).catch(err => {
              this.businessoptions = []
              this.$message.error(err.msg)
            })
        },
        sell(data){  // 出货/批量出货
            if(data=='one'){
                this.isMore = false
                this.shipmentForm = {
                    deviceModelId:'',
                    businessUserId:'',
                    deviceNumber:'',
                    isWithCard:'',
                    usageYears:'',
                    activationType:'',
                    activationTime:'',
                    batchNumber:'',
                    productionDate:''
                }
            }else{
                this.isMore = true
                this.fileList = []
            }
            if(this.$refs['shipmentForm']){
              this.$refs['shipmentForm'].resetFields()
            }
            this.dialogShipment = true
        },
        confrimShipment(){ // 确认出货
          this.$refs['shipmentForm'].validate((valid) => {
            if (valid) {
              var data = null
              let time = null
              if(this.shipmentForm.usageYears==-1){
                time = -1
              }else{
                time = new Date().getTime() + Number(this.shipmentForm.usageYears)*365*24*60*60*1000
              }
              if(!this.isMore){
                data = {
                  deviceModelId:this.shipmentForm.deviceModelId,
                  ownerId:this.shipmentForm.businessUserId,
                  deviceNumber:this.shipmentForm.deviceNumber,
                  withCard:this.shipmentForm.isWithCard,
                  expiredTime:time,
                  activationType:this.shipmentForm.activationType,
                  activationTime:this.shipmentForm.activationTime,
                  batchNumber:this.shipmentForm.batchNumber,
                  productionDate:this.shipmentForm.productionDate
                }
                api.shipment(data).then(res => {
                  // debugger
                  if(res.success){
                    this.$message.success(this.$t('message.success'))
                    this.$refs['shipmentForm'].resetFields()
                    this.dialogShipment = false
                    this.getlist()
                  }else {
                    this.$message.error(res.msg)
                  }
                }).catch(err => {
                  this.$message.error(err.msg)
                })
              }else {
                if(!this.uploadDeviceNumber){
                  return this.$message.warning(this.$t('message.upload'))
                }
                data = {
                  deviceModelId:this.shipmentForm.deviceModelId,
                  ownerId:this.shipmentForm.businessUserId,
                  uploadDeviceNumber:this.uploadDeviceNumber,
                  withCard:this.shipmentForm.isWithCard,
                  expiredTime:time,
                  activationType:this.shipmentForm.activationType,
                  activationTime:this.shipmentForm.activationTime,
                  batchNumber:this.shipmentForm.batchNumber,
                  productionDate:this.shipmentForm.productionDate
                }
                api.batchShipment(data).then(res => {
                  // debugger
                  if(res.success){
                    this.$message.success(this.$t('message.success'))
                    this.$refs['shipmentForm'].resetFields()
                    this.dialogShipment = false
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
        changeActivationType(data){ // 选择激活类型
          console.log(data)
          if(data!=2){
            this.shipmentForm.activationTime = ''
          }
        },
        handleRemove(){ // 移除上传的文件
          this.fileList = []
          this.uploadDeviceNumber = ''
        },
        handleChange (file, fileList) { // 上传文件
          // const isLt2M = file.size / 1024 / 1024 < 2
          // if (!isLt2M) {
          //   this.$message.warning('mp3 不能大于 2 MB')
          //   this.fileList = []
          //   return
          // }
          const _file = file.raw
          let formData = new FormData()
          formData.append('file', _file)
          let config = {
            headers: { 'Content-Type': 'multipart/form-data' } // 这里是重点，需要和后台沟通好请求头，Content-Type不一定是这个值
          }
          api
          .uploadDeviceNumber(formData, config)
          .then(res => {
            if (res.success) {
              this.$message.success(this.$t('message.success'))
              this.uploadDeviceNumber = res.data.id
            } else {
              this.uploadDeviceNumber = ''
              this.$message.error(res.msg)
            }
          })
          .catch(err => {
            this.uploadDeviceNumber = ''
            this.$message.error(err.msg)
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

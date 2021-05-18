<template>
    <div :style="{height:height + 'px',overflow:'hidden'}">
        <el-row  >
            <el-col :span='4'>
                <el-row class="cust-title">
                    <span>{{$t('view.customerList')}}</span>
                </el-row>
                <el-row class="cust-subtitle" :style="{height:(height-40) + 'px'}">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane name="first"><span slot="label">&nbsp;{{$t('view.allCust')}}</span></el-tab-pane>
                        <!-- <el-tab-pane name="second"><span slot="label">&nbsp;{{$t('view.expire')}}</span></el-tab-pane> -->
                    </el-tabs>
                    <el-row style="padding:0 10px">
                        <el-input :placeholder="$t('view.searchUser')" v-model="search" class="input-with-select" clearable>
                            <el-button slot="append" icon="el-icon-search" @click="searchCustomer"></el-button>
                        </el-input>
                        <el-tree :data="data" :props="defaultProps" :highlight-current='true' @node-click="handleNodeClick" style="margin-top:10px"></el-tree>
                    </el-row>
                </el-row>
            </el-col>
            <el-col :span='20'>
                <el-row class="cust-title">
                    <span>{{$t('route.List')}}</span>
                </el-row>
                <el-row class="list-search" :gutter="22">
                  <el-col :span='4'>
                    <el-input v-model="deviceIdList" :placeholder="$t('view.inputimei')" clearable></el-input>
                  </el-col>
                  <el-col :span='4'>
                    <el-select v-model="deviceModelId" :placeholder="$t('table.model')" clearable>
                      <el-option
                        v-for="item in deviceModeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='4'>
                    <el-select v-model="networkStatus" :placeholder="$t('view.inputstate')" clearable>
                      <el-option
                        v-for="item in networkStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='4'>
                    <el-select v-model="useStatus" :placeholder="$t('view.inputstate2')" clearable>
                      <el-option
                        v-for="item in usestatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='2' style="line-height:40px">
                    <el-checkbox v-model="containsChildren">{{$t('view.subordinate')}}</el-checkbox>
                  </el-col>
                  <el-col :span='4'>
                    <el-button class="butresh" @click="getlist(1)">{{$t('button.search')}}</el-button>
                    <el-button class="butdele" @click="moreSearch">{{$t('button.more')}}</el-button>
                  </el-col>
                </el-row>
                <el-row class="list-search"  v-show="moreFlag" :gutter="22">
                  <el-col :span='3'>
                    <el-select v-model="timeType" :placeholder="$t('table.timeType')">
                      <el-option
                        v-for="item in timeTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='6' >
                    <el-date-picker
                      v-model="time"
                      style="width:99%"
                      type="datetimerange"
                      range-separator="-"
                      value-format="timestamp"
                      :start-placeholder="$t('table.startdata')"
                      :end-placeholder="$t('table.enddata')">
                    </el-date-picker>
                  </el-col>
                  <el-col :span='8' >
                    <el-row style="line-height:40px">
                      <el-col :span='4'>
                        <span>{{$t('table.useLimit')}}：</span>
                      </el-col>
                      <el-col :span='12' v-for="item in range" :key="item[1].name">
                        <img :src="item[1].iconUrl" alt="">
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row class="list-search" >
                    <el-col :span='8'>
                      <el-button size="mini" @click="sale">{{$t('button.sale')}}</el-button>
                      <el-button size="mini" @click="download">{{$t('button.download')}}</el-button>
                      <el-button size="mini" @click="send">{{$t('button.send')}}</el-button>
                      <!-- <el-button size="mini" @click="moveLable">{{$t('button.moveLable')}}</el-button> -->
                    </el-col>  
                </el-row>
                <el-row  class="list-search" >
                    <BaseTable v-loading="loading" v-on:childByValue="childByValue" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh;padding:0 10px" ></BaseTable>
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
        </el-row>
        <!-- 销售 -->
        <el-dialog
          :title="$t('button.sale')"
          :visible.sync="dialogSale"
          width="50%">
          <el-row :gutter="22">
            <el-col :span='14'>
              <el-row>
                <span>{{$t('view.selEqu')}}：</span>
                <span>{{equNum}}</span>
              </el-row>
              <el-row style="margin:10px 0">
                <el-input :placeholder="$t('view.inputimei')" v-model="searchImei" class="input-with-select" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="searchEqu"></el-button>
                </el-input>
              </el-row>
              <el-row>
                <BaseTable  :dataList="saleList" :tableLabel="tableSale"   ></BaseTable>
              </el-row>
            </el-col>
            <el-col :span='10'>
              <el-row>
                <span>{{$t('view.sellTo')}}：</span>
                <span>{{custinfo.username}}</span>
              </el-row>
              <el-row style="margin:10px 0">
                <el-input :placeholder="$t('view.searchUser')" v-model="searchName" class="input-with-select" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="searchCust"></el-button>
                </el-input>
                <el-tree :data="insiadeData" :props="defaultProps" :highlight-current='true' 
                @node-click="handleCust" style="margin-top:10px"></el-tree>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="22" style="margin:10px 0;line-height:40px">
            <el-col :span='3'>
              <span>{{$t('table.expire2')}}：</span>
            </el-col>
            <el-col :span='4'>
              <el-select v-model="expiredTimeType" :placeholder="$t('view.select2')" 
              clearable :disabled="checked" @change='changeTimeType'>
                <el-option
                  v-for="item in timeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span='3'>
              <el-button class="butresh" @click="restInfo">{{$t('button.refresh')}}</el-button>
            </el-col>
            <el-col :span='4'>
              <el-checkbox v-model="checked">{{$t('view.changeSalesdate')}}</el-checkbox>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSale = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confrimgSale">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog> 
        <!-- 移动到其他标签 -->
        <el-dialog
          :title="$t('button.moveLable')"
          :visible.sync="dialogLable"
          width="30%">
          <el-select v-model="value" multiple >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <el-checkbox-group v-model="checkList">
                <el-checkbox :label="item.label"></el-checkbox>
              </el-checkbox-group>
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogLable = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="dialogLable = false">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>  
        <!-- 设备详情 -->
        <el-dialog
          :title="$t('table.equinfo')"
          :visible.sync="dialogEquinfo"
          width="40%">
          <el-form :model="equinfoForm" ref="equinfoForm"  label-width="140px">
            <el-col :span='12'>
              <el-form-item :label="$t('table.Device')"  >
                <el-input  v-model="equinfoForm.deviceName" :placeholder="$t('table.Device')" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.imei')"  >
                <span>{{equinfoForm.deviceNumber}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.model')"  >
                <span>{{equinfoForm.deviceModel.name}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.status')"  >
                <span>{{equinfoForm.networkStatus}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.activationTime')"  >
                <span>{{equinfoForm.activationTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.salesTime')"  >
                <span>{{equinfoForm.sellTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.expire')"  >
                <span>{{equinfoForm.serviceExpireTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.importtime')"  >
                <span>{{equinfoForm.createTime}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.useLimit')"  >
                <span>{{equinfoForm.useRangeCode}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.iccid')"  >
                <span>{{equinfoForm.iccid}}</span>
                <!-- <el-input  v-model="equinfoForm.value" :placeholder="$t('table.iccid')" ></el-input> -->
              </el-form-item>
            </el-col>
            <el-form-item :label="$t('table.note')"  >
              <el-input type='textarea' :rows="2" v-model="equinfoForm.remark" :placeholder="$t('table.note')" ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogEquinfo = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confrimEquinfo">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>
        <!-- 下发指令 -->
        <el-dialog
            :title="$t('button.send')"
            :visible.sync="dialogSend"
            width="50%">
            <send-order ref="sendOrder" :list = "multipleSelection" @confrimSend='confrimSend'/>
        </el-dialog>
        <!-- 历史指令 -->
        <el-dialog
            :title="$t('button.historysend')"
            :visible.sync="dialogHistorysend"
            width="50%">
            <el-row :gutter='22'>
              <el-col :span='4'>
                <el-select v-model="commandName" :placeholder="$t('table.zhitype')">
                  <el-option
                    v-for="item in cmdOptions"
                    :key="item.deviceCmdTemplateId"
                    :label="item.templateName"
                    :value="item.templateName">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span='12'>
                <el-date-picker
                  style="height:98%"
                  v-model="hisTime"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-col>
              <el-col :span='5'>
                <el-button class="butresh" >{{$t('button.search')}}</el-button>
                <el-button  >{{$t('button.refresh')}}</el-button>
              </el-col>
            </el-row>
            <el-row :gutter='22' style="margin-top:10px">
              <BaseTable v-loading="loading" :dataList="historysendList" :tableLabel="tableHistorysend"  ></BaseTable>
            </el-row>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogHistorysend = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="dialogHistorysend = false">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>
        <!-- 通信日志 -->
        <el-dialog
            :title="$t('button.commLog')"
            :visible.sync="dialogCommLog"
            width="50%">
            <el-row :gutter='22'>
              <el-col :span='12'>
                <el-date-picker
                  style="height:98%"
                  v-model="value1"
                  type="datetimerange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-col>
              <el-col :span='5'>
                <el-button class="butresh" >{{$t('button.search')}}</el-button>
                <el-button  >{{$t('button.refresh')}}</el-button>
              </el-col>
            </el-row>
            <el-row :gutter='22' style="margin-top:10px">
              <BaseTable v-loading="loading" :dataList="commLogList" :tableLabel="tableCommLog"  ></BaseTable>
            </el-row>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogCommLog = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="dialogCommLog = false">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>
        <!-- SIM卡信息 -->
        <el-dialog
            :title="$t('button.SIM')"
            :visible.sync="dialogSIM"
            width="40%">
            <el-form :model="SIMForm" ref="SIMForm"  label-width="120px" style="height:200px">
              <el-col :span='12'>
                <el-form-item :label="$t('table.SIMcardnum')"  >
                  <span>{{SIMForm.value}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.SIMcardtype')"  >
                  <span>{{SIMForm.value}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.activationTime')"  >
                  <span>{{SIMForm.value}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.expire2')"  >
                  <span>{{SIMForm.value}}</span>
                </el-form-item>
              </el-col>
            </el-form> 
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
import sendOrder from './sendOrder.vue'
export default{
    name:'equManage',
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
        height:900,
        activeName: 'first',
        search:null,
        moreFlag:false,
        data: [],
        insiadeData:[],
        equNum:0,
        custData:[],
        range:[],
        custinfo:{
          userId:'',
          username:''
        },
        defaultProps: {
          children: 'children',
          label: 'username'
        },
        hisTime:null,
        commandName:null,
        cmdOptions:[],
        deviceId:null,
        value1:null,
        value:null,
        options: [],
        checked:false,
        searchImei:'',
        searchName:'',
        deviceIdList:'',
        deviceModelId:null,
        deviceModeOptions:[],
        networkStatus:'',
        networkStatusOptions:[
          { value: '1', label: this.$t('view.homeon2')},{ value: '2', label: this.$t('view.homeoff2')}
        ],
        useStatus:'',
        usestatusOptions:[
          { value: '1', label: '未激活'},{ value: '2', label: '已激活'},{ value: '3', label: '已过期'}
        ],
        containsChildren:true,
        timeType:'',
        timeTypeOptions:[
          { value: '1', label: this.$t('table.activationTime')},{ value: '2', label: this.$t('table.salesTime')},
          { value: '3', label: this.$t('table.expire')}
        ],
        time:[],
        loading:false,
        dataList:[],
        tableLabel: [
          {label: '', type: 'selection'},
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.Device'), prop: 'deviceName'},
          {label: this.$t('table.imei'), prop: 'deviceNumber'},
          {label: this.$t('table.model'), prop: 'model',type: 'render',
          formatter: (params) => {
            // console.log(params)
            params['model'] = params.deviceModel.name
            return params
          }},
          {label: this.$t('table.status'), prop: 'status',
            type: 'render',
              formatter: (params) => {
                params['status'] = params.networkStatus == 1 ? '在线'  : params.networkStatus == 2 ? '离线'
                : params.networkStatus == '在线' ? '在线': params.networkStatus == '离线' ? '离线' : ''
                // console.log(params,123)
                return params
              }
          },
          {label: this.$t('table.usestatus'), prop: 'useStatus'},
          {label: this.$t('table.iccid'), prop: 'iccid'},
          {label: this.$t('table.customers'), prop: 'username',type: 'render',
          formatter: (params) => {
            // console.log(params)
            params['username'] = params.owner.username
            return params
          }},
          {label: this.$t('table.activeTime'), prop: 'activationTime'},
          {label: this.$t('table.expire'), prop: 'serviceExpireTime'},
          {label: this.$t('table.salesTime'), prop: 'sellTime'},
          {label: this.$t('table.mileage'), prop: 'odb'},
          {label: this.$t('table.deliveryTime'), prop: 'createTime', type: 'Timestamp'},
          {label: this.$t('table.operation'),
            type: 'clickSelect',
            selectOperation: (index, row) => {
              this.showDialog(index, row)
            },
            selectText: [{command: '1', text: this.$t('table.equinfo'), index: 1},
            {command: '2', text: this.$t('button.playback'), index: 2},
            {command: '3', text: this.$t('button.shewei'), index: 3},
            {command: '4', text: this.$t('button.send'), index: 4},
            {command: '5', text: this.$t('button.historysend'), index: 5},
            {command: '6', text: this.$t('button.viewAlarm'), index: 6},
            {command: '7', text: this.$t('button.commLog'), index: 7},
            {command: '8', text: this.$t('button.SIM'), index: 8} ]
        }],
        dialogEquinfo:false,
        dialogSend:false,
        dialogHistorysend:false,
        equinfoForm:{
          deviceId:'',
          deviceName:'',
          deviceNumber:'',
          deviceModel:'',
          networkStatus:'',
          activationTime:'',
          sellTime:'',
          serviceExpireTime:'',
          createTime:'',
          useRangeCode:'',
          iccid:'',
          remark:''
        },
        expiredTimeType:'',
        timeOptions:[
          { value: '-1', label: '无限制'},{ value: '31', label: '一个月'},
          { value: '62', label: '二个月'},{ value: '93', label: '三个月'},
          { value: '186', label: '半年'},{ value: '365', label: '一年'},
          { value: '730', label: '二年'},{ value: '1095', label: '三年'},
        ],
        multipleSelection:[],
        historysendList:[],
        tableHistorysend:[
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.zhitype'), prop: 'commandName'},
          {label: this.$t('table.zhidata'), prop: 'commandData'},
          {label: this.$t('table.creattime'), prop: 'createTime', type: 'Timestamp'},
          {label: this.$t('table.jie'), prop: 'commandStatus'}
        ],
        dialogCommLog:false,
        commLogList:[],
        tableCommLog:[
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.packet'), prop: 'serial_number'},
          {label: this.$t('table.datatype'), prop: 'category'},
          {label: this.$t('table.creattime'), prop: 'category'},
        ],
        dialogSIM:false,
        SIMForm:{
          value:''
        },
        dialogLable:false,
        checkList:[],
        dialogSale:false,
        saleList:[],
        tableSale:[
          {label: this.$t('table.imei'), prop: 'deviceNumber'},
          {label: this.$t('table.Device'), prop: 'deviceName'},
          {label: this.$t('table.model'), prop: 'model'},
          {label: this.$t('table.customers'), prop: 'username'},
          {label: this.$t('button.dele'),
            type:'clickEvent',
            tableClick: (val) => {
            this.showDialog('a', val)
          }
         }
        ],
      }
    },
    mounted(){
        this.height=document.body.offsetHeight-80
        this.getlist()
        this.getModelList()
        this.getBusiness()
        this.getRange()
    },
    methods:{
        getlist(type){ // 获取设备型号列表
          this.loading = true
          var startTime = null 
          var endTime = null
          if(this.time.length>0){
            startTime = this.time[0]
            endTime = this.time[1]
          }
          let data = {
            pageSize: this.page.size,
            page: this.page.index - 1,
            // deviceIdList:[this.deviceIdList],
            deviceModelId:this.deviceModelId,
            networkStatus:this.networkStatus,
            useStatus:this.useStatus,
            containsChildren:this.containsChildren,
            startTime:startTime,
            endTime:endTime
          }
          if(type==1){
            this.page.index = 1
            data.page = 0
          }
          api.getDevicesList(data).then(res => {
            this.loading = false
            // debugger
            if(res.success){
              this.dataList = res.data.content
              this.page.total = res.data.pageTotal
              // console.log(this.dataList)
            }else{
              this.dataList = []
              this.$message.error(res.msg)
            }
            
          }).catch(err => {
            this.loading = false
            this.dataList = []
            this.$message.error(err.msg)
          })
        },
        moreSearch(){ // 更多搜索条件
          this.moreFlag = !this.moreFlag
        },
        searchCustomer(){ // 搜索客户或账号
          let data = {
            searchType : 'username',
            searchContent:this.searchType
          }
          api.searchBusiness(data).then(res => {
            if(res.success){
              this.data = this.setTreeData(res.data)
            }else{
              this.data = []
              this.$message.error(res.msg)
            }
            
          }).catch(err => {
            this.data = []
            this.$message.error(err.msg)
          })
        },
        getModelList(){ // 获取设备型号
            api.getModelList({params: {
              pageSize: 100,
              page: this.page.index - 1,
            }}).then(res => {
              this.deviceModeOptions = res.data.content
            }).catch(err => {
              this.deviceModeOptions = []
              this.$message.error(err.msg)
            })
        },
        getRange(){ // 获取使用范围
          api.getRangeinfo().then(res => {
            let data = res.data
            this.range = Object.entries(data)
            console.log(this.range)
          }).catch(err => {
            this.range = []
            this.$message.error(err.msg)
          })
        },
        getBusiness(){ // 获取代理商
          let data = {
            parentId:null
          }
          api.getBusiness(data).then(res => {
              let data = res.data
              this.insiadeData = this.data = this.setTreeData(data)
              this.custData = this.setTreeData(data)
            }).catch(err => {
              this.custData = []
              this.insiadeData = []
              this.data = []
              this.$message.error(err.msg)
            })
        },
        setTreeData(arr){ // 遍历
            // 删除所有的children,以防止多次调用
            arr.forEach(function(item) {
                delete item.children;
            });
            // debugger
            let map = {}; //构建map
            arr.forEach(i => {
                map[i.userId] = i; //构建以id为键 当前数据为值
            });
            let treeData = [];
            arr.forEach(child => {
                const mapItem = map[child.parentId]; //判断当前数据的parentId是否存在map中
                if (mapItem) {
                    //存在则表示当前数据不是最顶层的数据
                    //注意： 这里的map中的数据是引用了arr的它的指向还是arr,当mapItem改变时arr也会改变，踩坑点
                    (mapItem.children || (mapItem.children = [])).push(child); //这里判断mapItem中是否存在child
                } else {
                    //不存在则是顶层数据
                    treeData.push(child);
                }
            });
            return treeData;
        },
        handleClick(tab, event) { // 全部客户，到期客户
          console.log(tab, event);
        },
        handleNodeClick(data) { // 选择用户节点
          console.log(data)
            let item = {
              ownerId : data.userId
            }
          api.queryDevices(item).then(res => {
            if(res.success){
              this.dataList = res.data
              this.page.total = res.data.pageTotal  
            }else {
              this.dataList = []
              this.page.total = 0
              this.$message.error(res.msg)
            }
          }).catch(err => {
            this.dataList = []
            this.page.total = 0
            this.$message.error(err.msg)
          })
        }, 
        showDialog(index, data){ // 操作
          switch (index) {
            case '1': // 设备详情
              this.equinfoForm = Object.assign({},data)
              this.dialogEquinfo = true
              break
            case 'a': //销售-删除设备
              // debugger
              for(let i = 0;i<this.saleList.length;i++){
                if(this.saleList[i].deviceId==data.deviceId){
                  this.saleList.splice(i,1)
                }
              }
              break
            case '5' : // 历史指令
              this.hisTime = null
              this.commandName = null
              this.deviceId = data.id
              this.getCmdTemplates(data.deviceModel.id)
              this.dialogHistorysend = true
              this.queryDeviceCmds()
              break
          }
        },
        confrimEquinfo(){ //确认更新设备
          let data = {
            deviceId:this.equinfoForm.deviceId,
            deviceName:this.equinfoForm.deviceName,
            remark:this.equinfoForm.remark,
            useRangeCode:this.equinfoForm.useRangeCode
          }
          api.editDevices(data).then(res => {
            if(res.success){
              this.$message.success(this.$t('message.changesuc'))
              this.dialogEquinfo = false
              this.getlist()
            }else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            this.$message.error(err.msg)
          })
        },
        childByValue(val){ //选择处理数据
          console.log(val)
          this.multipleSelection = val
        },
        sale(){ // 销售
          // if(this.multipleSelection<=0){
          //   return this.$message.warning(this.$t('message.selOne'))
          // }
          this.custinfo = {
            userId:'',
            username:''
          }
          this.searchImei = ''
          this.searchName = ''
          this.expiredTimeType = ''
          this.checked = false
          this.insiadeData = this.custData 
          this.saleList = this.multipleSelection
          this.equNum = this.saleList.length
          this.dialogSale = true
        },
        restInfo(){ // 重置
          this.custinfo = {
            userId:'',
            username:''
          }
          this.checked = false
          this.expiredTimeType = ''
          this.searchImei = ''
          this.searchName = ''
          this.insiadeData = this.custData 
          this.saleList = this.multipleSelection
          this.equNum = this.saleList.length
        },
        searchEqu(){ //销售-搜索设备
          if(!this.searchImei){
            return this.$message.warning(this.$t('table.searchimei'))
          }
          let data = {
            deviceNumberKeyword : this.searchImei
          }
          api.getDevicesList(data).then(res => {
            if(res.success){
              let item = res.data[0]
              if(item.deviceModel){
                item['model'] = item.deviceModel.name
              }else{
                item['model'] = ''
              }
              if(item.ownerName){
                item['username'] = item.ownerName
              }else{
                item['username'] = ''
              }
              var num = 0
              for(let i = 0;i < this.saleList.length;i++){
                if(this.saleList[i].deviceId == item.deviceId){
                  num = 0
                }else {
                  num++
                }
              }
              if(num == this.saleList.length){
                this.saleList.push(item)
              }
              this.equNum = this.saleList.length
              // console.log(this.saleList)
            }else{
              this.insiadeData = []
              this.$message.error(res.msg)
            }
            
          }).catch(err => {
            this.insiadeData = []
            this.$message.error(err.msg)
          })
        },
        searchCust(){ //销售-搜索客户或账号
          let data = {
            searchType : 'username',
            searchContent:this.searchName
          }
          api.searchBusiness(data).then(res => {
            if(res.success){
              this.insiadeData = this.setTreeData(res.data)
            }else{
              this.insiadeData = []
              this.$message.error(res.msg)
            }
            
          }).catch(err => {
            this.insiadeData = []
            this.$message.error(err.msg)
          })
        },
        changeTimeType(val){ // 销售-选择到期时间
          console.log(val)
          this.expiredTimeType = val
        }, 
        handleCust(data){ // 选择当前客户节点
          console.log(data)
          this.custinfo = Object.assign({},data)
        },
        confrimgSale(){ // 确认销售
          var arr = []
          if(this.saleList.length<=0){
            return this.$message.warning(this.$t('view.sel'))
          }
          if(!this.custinfo.username){
            return this.$message.warning(this.$t('message.selCust'))
          }
          var time = null
          if(Number(this.expiredTimeType)>0){
            time = new Date().getTime() + Number(this.expiredTimeType)*24*60*60*1000
          }else{
            time = Number(this.expiredTimeType)
          }
          if(this.checked){
            time = null
          }
          // debugger
          this.saleList.forEach(function(item) {
            arr.push(item.id)
          })
          let data = {
            deviceIdList : arr,
            expiredTime : time ,
            ownerId :this.custinfo.userId
          }
          api.sellDevices(data).then(res => {
            if(res.success){
              this.$message.success(this.$t('message.success'))
              this.multipleSelection = []
              this.dialogSale = false
              this.getlist()
            }else {
              time = null
              this.$message.error(res.msg)
            }
          }).catch(err => {
            time = null
            this.$message.error(err.msg)
          })
        },
        moveLable(){ // 移动到其他标签
          this.dialogLable = true
        },
        download(){ // 导出
          this.dialogSIM = true
        },
        send(){ // 下发指令
          if(this.multipleSelection.length<=0){
            return this.$message.warning(this.$t('message.selOne'))
          }
          for(let i = 0;i<this.multipleSelection.length;i++){
            if(this.multipleSelection[0].model!==this.multipleSelection[i].model){
              return this.$message.warning(this.$t('message.defeModel'))
            }
          }
          
          this.dialogSend = true
          this.$nextTick(() => {
            this.$refs.sendOrder.formData = {}
            this.$refs.sendOrder.schema = null
            this.$refs.sendOrder.deviceCmdTemplateId = null
            this.$refs.sendOrder.getlist()
          })
        },
        confrimSend(data){ // 关闭下发指令框
          this.dialogSend = data
        },
        getCmdTemplates(id){ // 获取指令模板列表
            let data = {
              deviceModelId:id
            }
            api.getCmdTemplates(data).then(res => {
              this.cmdOptions = res.data
            }).catch(err => {
              this.cmdOptions = []
              this.$message.error(err.errMsg)
            })
        },
        queryDeviceCmds(){ // 历史指令分页查询
            let data = {
              commandName:this.commandName,
              deviceId:this.deviceId,
              startTime:this.hisTime != null ? this.hisTime[0] : null,
              endTime:this.hisTime != null ? this.hisTime[1] : null
            }
            api.queryDeviceCmds(data).then(res => {
              this.historysendList = res.data.content
            }).catch(err => {
              this.historysendList = []
              this.$message.error(err.errMsg)
            })
        },
    
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

<template>
    <div  >
        <el-card  :style="{height:height + 'px'}" >
            <el-col :span='4'>
                <el-row class="cust-title">
                    <span>{{$t('view.customerList')}}</span>
                </el-row>
                <el-row class="cust-subtitle" :style="{height:(height-40) + 'px'}">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane name="first"><span slot="label">&nbsp;{{$t('view.allCust')}}</span></el-tab-pane>
                        <el-tab-pane name="second"><span slot="label">&nbsp;{{$t('view.expire')}}</span></el-tab-pane>
                    </el-tabs>
                    <el-row style="padding:0 10px">
                        <el-input :placeholder="$t('view.searchUser')" v-model="search" class="input-with-select">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </el-row>
                </el-row>
            </el-col>
            <el-col :span='20'>
                <el-row class="cust-title">
                    <span>{{$t('route.List')}}</span>
                </el-row>
                <el-row class="list-search" :gutter="22">
                  <el-col :span='3'>
                    <el-input v-model="deviceIdList" :placeholder="$t('view.inputimei')" clearable></el-input>
                  </el-col>
                  <el-col :span='3'>
                    <el-select v-model="deviceModelId" :placeholder="$t('table.model')" clearable>
                      <el-option
                        v-for="item in deviceModeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='3'>
                    <el-select v-model="networkStatus" :placeholder="$t('view.inputstate')" clearable>
                      <el-option
                        v-for="item in networkStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='3'>
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
                    <el-button class="butresh" >{{$t('button.search')}}</el-button>
                    <el-button class="butdele" >{{$t('button.more')}}</el-button>
                  </el-col>
                </el-row>
                <el-row class="list-search" :gutter="22">
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
                </el-row>
                <el-row class="list-search" :gutter="22">
                    <el-col :span='8'>
                      <el-button size="mini" @click="sale">{{$t('button.sale')}}</el-button>
                      <el-button size="mini" @click="download">{{$t('button.download')}}</el-button>
                      <el-button size="mini" @click="send">{{$t('button.send')}}</el-button>
                      <!-- <el-button size="mini" @click="moveLable">{{$t('button.moveLable')}}</el-button> -->
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
        <!-- 销售 -->
        <el-dialog
          :title="$t('button.sale')"
          :visible.sync="dialogSale"
          width="50%">
          <el-row :gutter="22">
            <el-col :span='14'>
              <el-row>
                <span>{{$t('view.selEqu')}}：</span>
              </el-row>
              <el-row style="margin:10px 0">
                <el-input v-model="search" :placeholder="$t('view.inputimei')"></el-input>
              </el-row>
              <el-row>
                <BaseTable v-loading="loading" :dataList="saleList" :tableLabel="tableSale"   ></BaseTable>
              </el-row>
            </el-col>
            <el-col :span='10'>
              <el-row>
                <span>{{$t('view.sellTo')}}：</span>
              </el-row>
              <el-row style="margin:10px 0">
                <el-input :placeholder="$t('view.searchUser')" v-model="search" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="22" style="margin:10px 0;line-height:40px">
            <el-col :span='3'>
              <span>{{$t('table.expire2')}}：</span>
            </el-col>
            <el-col :span='4'>
              <el-select v-model="value" :placeholder="$t('view.select2')">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span='3'>
              <el-button class="butresh" >{{$t('button.refresh')}}</el-button>
            </el-col>
            <el-col :span='4'>
              <el-checkbox v-model="checked">{{$t('view.changeSalesdate')}}</el-checkbox>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSale = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="dialogSale = false">{{$t('button.determine')}}</el-button>
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
                <el-input  v-model="equinfoForm.value" :placeholder="$t('table.Device')" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.imei')"  >
                <span>{{equinfoForm.value}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.model')"  >
                <span>{{equinfoForm.value}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.status')"  >
                <span>{{equinfoForm.value}}</span>
              </el-form-item>
            </el-col>
            <el-form-item :label="$t('table.label')"  >
              <span>{{equinfoForm.value}}</span>
            </el-form-item>
            <el-col :span='12'>
              <el-form-item :label="$t('table.activationTime')"  >
                <span>{{equinfoForm.value}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.salesTime')"  >
                <span>{{equinfoForm.value}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.expire')"  >
                <span>{{equinfoForm.value}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.importtime')"  >
                <span>{{equinfoForm.value}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.useLimit')"  >
                <span>{{equinfoForm.value}}</span>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item :label="$t('table.iccid')"  >
                <el-input  v-model="equinfoForm.value" :placeholder="$t('table.iccid')" ></el-input>
              </el-form-item>
            </el-col>
            <el-form-item :label="$t('table.note')"  >
              <el-input type='textarea' :rows="2" v-model="equinfoForm.value" :placeholder="$t('table.note')" ></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogEquinfo = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="dialogEquinfo = false">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>
        <!-- 下发指令 -->
        <el-dialog
            :title="$t('button.send')"
            :visible.sync="dialogSend"
            width="40%">
            <send-order ref="sendOrder" @confrimSend='confrimSend'/>
        </el-dialog>
        <!-- 历史指令 -->
        <el-dialog
            :title="$t('button.historysend')"
            :visible.sync="dialogHistorysend"
            width="50%">
            <el-row :gutter='22'>
              <el-col :span='4'>
                <el-select v-model="value" :placeholder="$t('table.zhitype')">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
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
        height:1000,
        activeName: 'first',
        search:null,
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        value1:null,
        value:null,
        options: [],
        checked:true,
        deviceIdList:'',
        deviceModelId:'',
        deviceModeOptions:[],
        networkStatus:'',
        networkStatusOptions:[
          { value: '1', label: this.$t('view.homeon2')},{ value: '2', label: this.$t('view.homeoff2')}
        ],
        useStatus:'',
        usestatusOptions:[
          { value: '1', label: '未使用'},{ value: '2', label: '已使用'},{ value: '3', label: '已到期'}
        ],
        containsChildren:true,
        timeType:'',
        timeTypeOptions:[
          { value: '1', label: this.$t('table.activationTime')},{ value: '2', label: this.$t('table.salesTime')},
          { value: '3', label: this.$t('table.expire')}
        ],
        loading:false,
        dataList:[],
        tableLabel: [
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.Device'), prop: 'deviceName'},
          {label: this.$t('table.imei'), prop: 'deviceNumber'},
          {label: this.$t('table.model'), prop: 'category'},
          {label: this.$t('table.status'), prop: 'networkStatus'},
          {label: this.$t('table.usestatus'), prop: 'category'},
          {label: this.$t('table.iccid'), prop: 'iccid'},
          {label: this.$t('table.customers'), prop: 'ownerBusinessUsername'},
          {label: this.$t('table.activeTime'), prop: 'activationTime'},
          {label: this.$t('table.expire'), prop: 'partner_contacts'},
          {label: this.$t('table.salesTime'), prop: 'sellTime'},
          {label: this.$t('table.mileage'), prop: 'odo'},
          {label: this.$t('table.deliveryTime'), prop: 'shipmentTime'},
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
          value:''
        },
        historysendList:[],
        tableHistorysend:[
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.orderCode'), prop: 'serial_number'},
          {label: this.$t('table.zhitype'), prop: 'category'},
          {label: this.$t('table.zhidata'), prop: 'category'},
          {label: this.$t('table.creattime'), prop: 'category'},
          {label: this.$t('table.jie'), prop: 'category'}
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
          {label: this.$t('table.imei'), type: 'serial_number'},
          {label: this.$t('table.Device'), prop: 'serial_number'},
          {label: this.$t('table.model'), prop: 'category'},
          {label: this.$t('table.customers'), prop: 'category'},
          {label: this.$t('table.operation'),
            type: 'clickSelect',
            selectOperation: (index, row) => {
              this.showDialog(index, row)
            },
            selectText: [{command: '1', text: this.$t('button.dele'), index: 1}, ]
         }
        ],
      }
    },
    mounted(){
        this.height=document.body.offsetHeight-62
        this.getlist()
        this.getModelList()
    },
    methods:{
        getlist(){ // 获取设备型号列表
          this.loading = true
          api.getDevicesList({params: {
              pageSize: this.page.size,
              page: this.page.index - 1,
              deviceIdList:[this.deviceIdList],
              deviceModelId:this.deviceModelId,
              networkStatus:this.networkStatus,
              useStatus:this.useStatus,
              containsChildren:this.containsChildren,
          }}).then(res => {
            this.loading = false
            if(res.msg=='OK'){
              this.dataList = res.data.content
              this.page.total = res.data.pageTotal
            }else{
              this.dataList = []
              this.$message.error(res.errMsg)
            }
            
          }).catch(err => {
            this.loading = false
            this.dataList = []
            this.$message.error(err.errMsg)
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
              this.$message.error(err.errMsg)
            })
        },
        handleClick(tab, event) { // 全部客户，到期客户
          console.log(tab, event);
        },
        handleNodeClick(data) { // 选择用户节点
          console.log(data)
        }, 
        sale(){ // 销售
          this.dialogSale = true
        },
        moveLable(){ // 移动到其他标签
          this.dialogLable = true
        },
        download(){ // 导出
          this.dialogSIM = true
        },
        send(){ // 下发指令
          this.dialogSend = true
        },
        confrimSend(data){ // 关闭下发指令框
          this.dialogSend = data
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

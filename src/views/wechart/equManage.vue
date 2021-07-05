<template>
    <div class="app" :style="{height:height +'px',overflow:'hidden' }">
        <el-row  >
            <el-col :md="6" :lg="5" :xl="4" >
                <el-row class="cust-title">
                    <span>{{$t('view.customerList')}}</span>
                </el-row>
                <el-row class="cust-subtitle" :style="{height:(height-40) + 'px'}">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane name="first" v-if="type!=3"><span slot="label">{{$t('view.allCust')}}</span></el-tab-pane>
                        <el-tab-pane name="second"><span slot="label">{{$t('view.expire')}}</span></el-tab-pane>
                    </el-tabs>
                    <el-row style="margin:0 0 10px 0" :gutter="22" v-if="activeName=='second'">
                      <el-col :span='12'>
                        <el-select v-model="timeType2" placeholder="请选择" @change="changetimeType2">
                          <el-option
                            v-for="item in expOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span='12'>
                        <el-select v-model="timeRange" placeholder="请选择" @change="getlist(1)" :disabled="timeRange=='全部'">
                          <el-option
                            v-for="item in rangeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                    <el-row style="padding:0 10px" v-else>
                        <el-input :placeholder="$t('view.inputtext')" v-model="search" class="input-with-select" clearable>
                            <el-select v-model="selectType" slot="prepend" >
                              <el-option label="账号" value="username"></el-option>
                              <el-option label="客户" value="nickname"></el-option>
                            </el-select>
                            <el-button slot="append" icon="el-icon-search" @click="searchCustomer"></el-button>
                        </el-input>
                        <el-scrollbar :style="{height:70 + 'vh'}" ref="scrollbar">
                          <el-tree :data="data" :props="defaultProps"   node-key="userId" :default-expanded-keys="[outUserId]"
                          :highlight-current='true' @node-click="handleNodeClick" 
                          lazy :load="evt_loadTree" :render-content="renderContent" style="margin-top:10px" ></el-tree>
                        </el-scrollbar>
                    </el-row>
                </el-row>
            </el-col>
            <el-col :md="18" :lg="19" :xl="20">
                <el-row class="cust-title">
                    <span>{{$t('route.List')}}</span>
                </el-row>
                <el-row class="list-search" :gutter="22" >
                  <el-col :span='4'>
                    <el-input v-model="deviceIdList" placeholder="请输入IMEI或设备名称" clearable></el-input>
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
                  <el-col :span='6'>
                    <el-button class="butresh" @click="getlist(1)">{{$t('button.search')}}</el-button>
                    <el-button class="butdele" @click="moreSearch">{{$t('button.more')}}</el-button>
                    <el-button class="butresh" @click="refresh">{{$t('button.refresh')}}</el-button>
                  </el-col>
                </el-row>
                <el-row class="list-search"  v-show="moreFlag" :gutter="22" ref="header">
                  <el-col :span='3'>
                    <el-select v-model="timeType" :placeholder="$t('table.timeType')" clearable>
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
                      clearable
                      v-model="time"
                      style="width:99%"
                      type="datetimerange"
                      range-separator="-"
                      value-format="timestamp"
                      :start-placeholder="$t('table.startdata')"
                      :end-placeholder="$t('table.enddata')"
                      :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                  </el-col>
                  <el-col :span='15' >
                    <el-row style="line-height:40px">
                      <el-col :span='3'>
                        <span>{{$t('table.useLimit')}}：</span>
                      </el-col>
                      <el-col :span='21' >
                        <!-- <img :src="item[1].iconUrl" alt=""> -->
                        <span v-for="(item,index) in range" :key="item[0]" class='fangwei'
                        @click="addClass(index,item)" ><img :src="index==current?item[1].iconUrlActive:item[1].iconUrlInactive" alt="" >&nbsp;&nbsp;</span>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row class="list-search" >
                    <el-col :span='8'>
                      <el-button size="mini" @click="sale" v-if="type==2">{{$t('button.sale')}}</el-button>
                      <!-- <el-button size="mini" @click="download">{{$t('button.download')}}</el-button> -->
                      <el-button size="mini" @click="send" >{{$t('button.send')}}</el-button>
                      <el-button size="mini"  @click="recharge">平台充值</el-button>
                      <!-- <el-button size="mini" @click="moveLable">{{$t('button.moveLable')}}</el-button> -->
                    </el-col>  
                </el-row>
                <el-row  style="margin-top:10px" >
                  <!-- :style="{height:tableHeight}" -->
                  <el-scrollbar :style="{height:tableHeight}" ref="scrollbar" >
                    <BaseTable  ref="tableBase" v-loading="loading" v-on:childByValue="childByValue" :dataList="dataList" :tableLabel="tableLabel"  style="padding:0 10px" ></BaseTable>
                  </el-scrollbar>
                </el-row>
                <el-pagination
                    @current-change='changeindex'
                    layout="total,prev, pager, next"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    :total="page.total"
                    background
                    style="text-align:center;margin-top:10px">
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
              <el-row style="margin:10px 0;border:1px solid #CCCCCC">
                <!-- <el-input :placeholder="$t('view.inputimei')" v-model="searchImei" class="input-with-select" clearable>
                    <el-button slot="append" icon="el-icon-circle-plus-outline" @click="searchEqu"></el-button>
                </el-input> -->
                <el-row style="margin:10px 10px 0 10px">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4}"
                    placeholder="请输入设备IMEI号（多个回车换行）"
                    v-model="searchImei" @keyup.native="inputChange" @input="changeIMEI" >
                  </el-input>
                </el-row>
                <el-row style="line-height:40px">
                  <el-col :offset='1' :span='18'>
                    <span>IMEI计数：{{tempNum}}</span>
                  </el-col>
                  <el-col :span='4'>
                    <el-button class="butadd" size="mini" @click="searchEqu">{{$t('button.add')}}</el-button>
                  </el-col>
                </el-row>
              </el-row>
              <el-row>
                <el-scrollbar style="height:60vh;" ref="scrollbar">
                  <BaseTable  :dataList="saleList" :tableLabel="tableSale"   ></BaseTable>
                </el-scrollbar>
              </el-row>
            </el-col>
            <el-col :span='10'>
              <el-row>
                <span>{{$t('view.sellTo')}}：</span>
                <span>{{custinfo.username}}</span>
              </el-row>
              <el-row style="margin:10px 0">
                <el-input :placeholder="$t('view.inputtext')" v-model="searchName" class="input-with-select" clearable>
                    <el-select v-model="selectType1" slot="prepend" >
                      <el-option label="账号" value="username"></el-option>
                      <el-option label="客户" value="nickname"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="searchCust"></el-button>
                </el-input>
                <el-scrollbar style="margin-top:10px" ref="scrollbar" :style="{height:50 + 'vh'}">
                  <el-tree :data="insiadeData" ref="insidetree" :props="defaultProps" :highlight-current='true' 
                  node-key="userId"  :default-expanded-keys="[inUserId]" lazy :load="evt_loadTreeTwo" :render-content="renderContent" @node-click="handleCust" ></el-tree>
                </el-scrollbar>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="22" style="margin:10px 0;line-height:40px">
            <!-- <el-col :span='3'>
              <span>{{$t('table.expire2')}}：</span>
            </el-col> -->
            <!-- <el-col :span='4'>
              <el-select v-model="expiredTimeType" :placeholder="$t('view.select2')" 
              clearable :disabled="checked" @change='changeTimeType'>
                <el-option
                  v-for="item in timeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col> -->
            <!-- <el-col :span='3'>
              <el-button class="butresh" @click="restInfo">{{$t('button.refresh')}}</el-button>
            </el-col>
            <el-col :span='4'>
              <el-checkbox v-model="checked">{{$t('view.changeSalesdate')}}</el-checkbox>
            </el-col> -->
            <el-col :span='8' v-if="saleTotal>0">
              <span>共计销售：{{saleTotal}}台，成功{{saleSuc}}台，失败<el-button type="text" style="color:red" @click="viewSaleInfo">{{saleFal}}</el-button>台</span>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSale = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confrimgSale">{{$t('button.sale')}}</el-button>
          </span>
        </el-dialog> 
        <!-- 销售情况 -->
        <el-dialog
          title="提示"
          :visible.sync="dialogSaleInfo"
          width="40%"
          top='30vh'
          :close-on-click-modal='false'
          >
          <span>成功{{saleSuc}}台，失败{{saleFal}}台</span>
          <el-row style="margin-top:10px">
            <BaseTable  :dataList="saleInfoList" :tableLabel="tableSaleInfo"   ></BaseTable>
          </el-row>
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
            <el-row>
              <el-col :span='12'>
                <el-form-item :label="$t('table.Device')+'：'"  >
                  <el-input  v-model="equinfoForm.deviceName" :placeholder="$t('table.Device')" maxlength="15"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.imei')+'：'"  >
                  <span>{{equinfoForm.deviceNumber}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item :label="$t('table.model')+'：'"  >
                  <span>{{equinfoForm.deviceModel.name}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.status')+'：'"  >
                  <span>{{equinfoForm.networkStatus == 1 ? '在线'  : '离线'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item :label="$t('table.activationTime')+'：'"  >
                  <span>{{equinfoForm.activationTime | formatDate}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.salesTime')+'：'"  >
                  <span>{{equinfoForm.sellTime | formatDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
            <el-col :span='12'>
              <el-form-item :label="$t('table.expire')+'：'"  >
                <span>{{equinfoForm.serviceExpireTime | formatDate}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.importtime')+'：'"  >
                  <span>{{equinfoForm.createTime | formatDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='12'>
                <el-form-item :label="$t('table.useLimit')+'：'"  >
                  <!-- <span>{{equinfoForm.useRangeCode}}</span> -->
                  <span v-for="(item,index) in range" :key="item[0]" class='fangwei'
                  @click="addClass1(index,item)" ><img :src="index==current1?item[1].iconUrlActive:item[1].iconUrlInactive" alt="" >&nbsp;&nbsp;</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.iccid')+'：'"  >
                  <span>{{equinfoForm.iccid}}</span>
                  <!-- <el-input  v-model="equinfoForm.value" :placeholder="$t('table.iccid')" ></el-input> -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span='22'>
                <el-form-item :label="$t('table.note')+'：'"  >
                  <el-input type='textarea' :rows="2" v-model="equinfoForm.remark" :placeholder="$t('table.note')" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer" style="margin-top:10px">
            <el-button @click="dialogEquinfo = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confrimEquinfo">{{$t('button.determine')}}</el-button>
          </div>
        </el-dialog>
        <!-- 下发指令 -->
        <el-dialog
            :title="$t('button.send')"
            :visible.sync="dialogSend"
            width="50%"
            >
            <send-order ref="sendOrder" :list="tempList" @confrimSend='confrimSend'/>
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
                  value-format="timestamp"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
              </el-col>
              <el-col :span='5'>
                <el-button class="butresh" @click="queryDeviceCmds(1)">{{$t('button.search')}}</el-button>
                <el-button  @click="refreshHistory">{{$t('button.refresh')}}</el-button>
              </el-col>
            </el-row>
            <el-row :gutter='22' style="margin-top:10px">
              <BaseTable v-loading="loading" :dataList="historysendList" :tableLabel="tableHistorysend"  ></BaseTable>
            </el-row>
            <el-pagination
                    @current-change='changeindex1'
                    layout="total,prev, pager, next"
                    :current-page.sync="page1.index"
                    :page-size="page1.size"
                    :total="page1.total"
                    background
                    style="text-align:center">
                </el-pagination>
            <!-- <span slot="footer" class="dialog-footer"> -->
            <!-- <el-button @click="dialogHistorysend = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="dialogHistorysend = false">{{$t('button.determine')}}</el-button> -->
          <!-- </span> -->
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
                <el-form-item :label="$t('table.SIMcardnum')+'：'"  >
                  <span>{{SIMForm.iccid}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.SIMcardtype')+'：'"  >
                  <span>{{SIMForm.useStatus}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.activationTime')+'：'"  >
                  <span>{{SIMForm.activationTime | formatDate}}</span>
                </el-form-item>
              </el-col>
              <el-col :span='12'>
                <el-form-item :label="$t('table.expire2')+'：'"  >
                  <span>{{SIMForm.serviceExpireTime | formatDate2}}</span>
                </el-form-item>
              </el-col>
            </el-form> 
        </el-dialog>
        <dialog-recharge ref="dialogRecharge" :list="rechargeList"/>
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
import dialogRecharge from './dialogRecharge.vue'
export default{
    name:'equManage',
    components:{ BaseTable,sendOrder,dialogRecharge },
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
        tableHeight:document.body.offsetHeight-272 +"px",
        activeName: 'first',
        search:null,
        moreFlag:false,
        selectType:'username',
        selectType1:'username',
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
          label: 'nickname',
          isLeaf:'leaf'
        },
        renderContent:function (h,{node,data,store}) {
            let addElement = arguments[0];
            return addElement('span',[
                addElement('i',{class:"el-icon-s-custom row_item_bottom_left_userIcon"}),
                addElement('span',"    "),
                addElement('span',arguments[1].node.label)
            ]);
        },
        hisTime:null,
        commandName:null,
        cmdOptions:[],
        deviceId:null,
        ownerId:null,
        value1:null,
        value:null,
        options: [],
        checked:false,
        searchImei:null,
        tempNum:0,
        searchName:'',
        deviceIdList:null,
        deviceModelId:null,
        useRangeCode:null,
        deviceModeOptions:[],
        networkStatus:'',
        networkStatusOptions:[
          { value: '1', label: this.$t('view.homeon2')},{ value: '2', label: this.$t('view.homeoff2')}
        ],
        useStatus:'',
        usestatusOptions:[
          { value: '1', label: '未激活'},{ value: '2', label: '已激活'},
          // { value: '3', label: '已过期'},
          { value: '4', label: '已激活未上线'}
        ],
        containsChildren:true,
        timeType:null,
        timeTypeOptions:[
          { value: '2', label: this.$t('table.activationTime')},{ value: '1', label: this.$t('table.salesTime')},
          { value: '3', label: this.$t('table.expire')}
        ],
        timeType2:4,
        expOptions:[
          { value: 4, label: '即将到期'},{ value: 5, label: '已到期'},
        ],
        timeRange:1,
        rangeOptions:[
          { value: 1, label: '7天内'},{ value: 2, label: '30天内'},{ value: 3, label: '60天内'}
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
          {label: this.$t('table.usestatus'), prop: 'useStatus',
            type: 'render',
              formatter: (params) => {
                params['useStatus'] = (params.activationTime == null || (params.activationTime - new Date().getTime()>0)) ? '未激活'  
                : ((params.serviceExpireTime -new Date().getTime())<0 && params.serviceExpireTime != -1)? '已过期'
                : (params.activationTime && params.lastReportDataTime == null) ? '已激活未上线' 
                : '已激活'
                return params
              }
          },
          {label: this.$t('table.iccid'), prop: 'iccid',type: 'render',
          formatter: (params) => {
            if(params['iccid']==null){
              params['iccid'] = '--'
            }
            return params
          }},
          {label: this.$t('table.customers'), prop: 'username',type: 'render',
          formatter: (params) => {
            // console.log(params)
            params['username'] = params.owner.username
            return params
          }},
          {label: '绑定客户', prop: 'bindname',type: 'render',
          formatter: (params) => {
            // console.log(params)
            if(params.binders){
              params['bindname'] = params.binders.username 
            }else{
              params['bindname'] = '--'
            }
            return params
          }},
          {label: this.$t('table.activeTime'), prop: 'activationTime', type: 'Timestamp'},
          {label: this.$t('table.expire'), prop: 'serviceExpireTime', type: 'Timestamp'},
          {label: this.$t('table.salesTime'), prop: 'sellTime', type: 'Timestamp'},
          {label: this.$t('table.mileage'), prop: 'odb'},
          {label: this.$t('table.deliveryTime'), prop: 'createTime', type: 'Timestamp'},
          {label: this.$t('table.operation'),
            type: 'clickSelect',
            selectOperation: (index, row) => {
              this.showDialog(index, row)
            },
            selectText: [{command: '1', text: this.$t('table.equinfo'), index: 1},
            {command: '2', text: this.$t('button.playback'), index: 2,status : 1},
            {command: '3', text: this.$t('button.shewei'), index: 3,status : 1},
            {command: '4', text: this.$t('button.send'), index: 4,status : 1},
            {command: '5', text: this.$t('button.historysend'), index: 5,status : 1},
            {command: '6', text: this.$t('button.viewAlarm'), index: 6,status : 1},
            {command: '7', text: this.$t('button.commLog'), index: 7,status : 1},
            {command: '8', text: this.$t('button.SIM'), index: 8} 
            ]
        }],
        dialogEquinfo:false,
        dialogSend:false,
        dialogHistorysend:false,
        equinfoForm:{
          id:'',
          deviceName:'',
          deviceNumber:'',
          deviceModel:'',
          networkStatus:'',
          activationTime:'',
          sellTime:'',
          serviceExpireTime:'',
          createTime:'',
          useRangeCode:null,
          iccid:'',
          remark:''
        },
        expiredTimeType:null,
        timeOptions:[
          { value: '-1', label: '无限制'},{ value: '31', label: '一个月'},
          { value: '62', label: '二个月'},{ value: '93', label: '三个月'},
          { value: '186', label: '半年'},{ value: '365', label: '一年'},
          { value: '730', label: '二年'},{ value: '1095', label: '三年'},
        ],
        multipleSelection:[],
        tempList:[],
        historysendList:[],
        tableHistorysend:[
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.zhitype'), prop: 'commandName'},
          {label: this.$t('table.zhidata'), prop: 'commandData'},
          {label: this.$t('table.creattime'), prop: 'createTime', type: 'Timestamp'},
          {label: this.$t('table.jie'), prop: 'status',type: 'render',
          formatter: (params) => {
            // console.log(params)
            params['status'] = params.commandStatus == 0 ? '已受理'  : params.commandStatus == 1 ? '待发送'
            : params.commandStatus == 2 ? '已发送': params.commandStatus == 3 ? '已送达' 
            : params.commandStatus == 4 ? '失败': params.commandStatus == 5 ? '过期' :''
            return params
          }}
        ],
        page1:{
            index:1,   //当前页   
            size:20,   //一页的数量
            total:0    //总数量
        },
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
          iccid:'',
          useStatus:'',
          activationTime:'',
          serviceExpireTime:''
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
          {label: this.$t('table.operation'),
            type:'clickEvent',
            name:'删除',
            tableClick: (val) => {
            this.showDialog('a', val)
          }
         }
        ],
        type:null,
        saleTotal:0,
        saleSuc:0,
        saleFal:0,
        dialogSaleInfo:false,
        saleInfoList:[],
        tableSaleInfo:[
          {label: this.$t('table.imei'), prop: 'deviceNumber'},
          {label: '状态', prop: 'status',
            type: 'render',
              formatter: (params) => {
                params['status'] = params.sellSuccess == true ? '成功'  : params.sellSuccess == false ? '失败' : ''
                return params
              }
          },
          {label: '原因', prop: 'falRemark'},
        ],
        current:-1,
        current1:-1,
        timer:null,
        outUserId:'',
        inUserId:'',
        rechargeList:[]
        // tempNum:0
      }
    },
    watch: {
      // tempNum(val, oldVal){//普通的watch监听
      //    console.log(val, oldVal);
      //    if(val){
      //      setTimeout(() => {
      //         this.$set(this.temp,'num',val.length)
      //       },100)
      //    }
      // },
      tableHeight (val) {
        // console.log(val)
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if (!this.timer) {
          
          var str = val.substring(0,val.length-2)
          // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
          this.tableHeight = (str - 80) + 'px'
          this.timer = true
          let that = this
          // that.height = document.body.clientHeight-242
          setTimeout(function () {
            // 打印screenWidth变化的值
            that.timer = false
          }, 400)
        }
      }
    },
    mounted(){
      // this.tableHeight = document.body.offsetHeight-262 +"px"
      this.type = JSON.parse(sessionStorage['user']).userType
        var that =this
        window.onresize = () => {
          return (() => {
              that.height = document.body.offsetHeight-142
              that.tableHeight = document.body.offsetHeight-272 +"px"
          })()
        }
        if(this.type!=3){
          this.evt_getBusinessUserinfo()
          this.evt_getBusinessUserinfoTwo()
        }else if(this.type==3){
          this.activeName = 'second'
        }
        this.getlist()
        this.getModelList()
        // this.getBusiness(null)
        this.getRange()
    },
    methods:{
        addClass(index,item){
          // console.log(item)
          this.current=index
          this.useRangeCode = item[0]
        },
        addClass1(index,item){
          this.current1=index
          this.equinfoForm.useRangeCode = item[0]
        },
        refresh(){ // 刷新
          this.time = null 
          this.deviceIdList=null
          this.deviceModelId=null
          this.networkStatus=null
          this.useStatus =null
          this.useRangeCode = null
          this.containsChildren = true
          // this.ownerId = null 
          this.timeType = null
          this.current = -1
          this.getlist()
        },
        changetimeType2(val){
          if(val==5){
            this.timeRange = '全部'
          }else{
            this.timeRange = 1
          }
          this.getlist(1)
        },
        getlist(type){ // 获取设备型号列表
          this.loading = true
          var startTime = null 
          var endTime = null
          var temp = null
          if(this.time&&this.activeName=='first'){
            startTime = this.time[0]
            endTime = this.time[1]
          }else if(this.activeName=='second'){
            if(this.timeRange==1&&this.timeType2==4){
              startTime = new Date().getTime() 
              endTime = new Date().getTime() + 7*60*60*24*1000
              this.useStatus = null
              this.timeType = '3'
            }else if(this.timeRange==2&&this.timeType2==4){
              startTime = new Date().getTime() 
              endTime = new Date().getTime() + 30*60*60*24*1000
              this.useStatus = null
              this.timeType = '3'
            }else if(this.timeRange==3&&this.timeType2==4){
              startTime = new Date().getTime() 
              endTime = new Date().getTime() + 60*60*60*24*1000
              this.useStatus = null
              this.timeType = '3'
            }else if(this.timeRange = '全部'){
              temp = '3'
              this.timeType = null
            }
            // else if(this.timeRange==1&&this.timeType2==5){
            //   startTime = new Date().getTime() - 7*60*60*24*1000 
            //   endTime = new Date().getTime() 
            // }else if(this.timeRange==2&&this.timeType2==5){
            //   startTime = new Date().getTime() - 30*60*60*24*1000 
            //   endTime = new Date().getTime() 
            // }else if(this.timeRange==3&&this.timeType2==5){
            //   startTime = new Date().getTime() - 60*60*60*24*1000 
            //   endTime = new Date().getTime() 
            // }
            
            
          }else{
            startTime = null
            endTime = null
          }
          if(this.deviceIdList==''){
            this.deviceIdList=null
          }
          if(this.deviceModelId==''){
            this.deviceModelId=null
          }
          let data = {
            pageSize: this.page.size,
            page: this.page.index - 1,
            // deviceIdList:[this.deviceIdList],
            deviceModelId:this.deviceModelId,
            networkStatus:this.networkStatus,
            useStatus:this.useStatus,
            useRangeCode:this.useRangeCode,
            containsChildren:this.containsChildren,
            startTime:startTime,
            endTime:endTime,
            ownerId:this.ownerId,
            timeType:this.timeType,
            deviceNumberKeyword:this.deviceIdList
          }
          if(type==1){
            this.page.index = 1
            data.page = 0
          }
          if(temp){
            data.useStatus = 3
          }
          api.getDevicesList(data,this.type).then(res => {
            this.loading = false
            // debugger
            if(res.success){
              this.dataList = res.data.content
              this.page.total = res.data.totalElements
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
          if(this.moreFlag){
            this.tableHeight = document.body.offsetHeight-272 - 50 +"px"
          }else{
            this.tableHeight = document.body.offsetHeight-272 +"px"
          }
        },
        searchCustomer(){ // 搜索客户或账号
          let data = {
            searchType : this.selectType,
            searchContent:this.search
          }
          if(this.search.trim() == '') {
            this.evt_getBusinessUserinfo()
            return
          }
          api.searchBusiness(data,this.type).then(res => {
            if(res.success){
              if(res.data){
                this.data = this.setTreeData(res.data)
              }else{
                this.data = []
              }
            }else{
              // this.data = []
              this.$message.error(res.msg)
            }
            
          }).catch(err => {
            this.data = []
            this.$message.error(err.msg)
          })
        },
        getModelList(){ // 获取设备型号
            let data = {
              pageSize: 100,
              page:0
            }
            api.getModelList(data).then(res => {
              this.deviceModeOptions = res.data.content
            }).catch(err => {
              this.deviceModeOptions = []
              this.$message.error(err.msg)
            })
        },
        getRange(){ // 获取使用范围
          api.getRangeinfo(this.type).then(res => {
            let data = res.data
            this.range = Object.entries(data)
            console.log(this.range)
          }).catch(err => {
            this.range = []
            this.$message.error(err.msg)
          })
        },
        // 获取当前登录用户的信息 b端用户
        evt_getBusinessUserinfo(){
            var _this = this;
            this.data = []
            // this.insiadeData = []
            // this.custData = []
            api.getBusinessUserinfo({},_this.type).then((res) =>{
                // console.log(res);
                if(res.success && res.data && Object.keys(res.data).length > 0){
                    this.outUserId = res.data.userId
                    if(res.data.children == 0){
                      res.data['leaf'] = true
                    }
                    res.data['nickname'] = res.data.nickname + '(库存:' + res.data.devices + '/总数:' + (res.data.devices + res.data.sellDevices) + ')'
                    _this.data.push(res.data)
                    // _this.insiadeData.push(res.data)
                    // _this.custData.push(res.data)
                }
            }).catch((err) => {
                _this.$message({message: err.msg, type:'error',offset:'200',duration:'1500'})
            })
        },
        evt_getBusinessUserinfoTwo(){
          var _this = this;
  
            this.insiadeData = []
            this.custData = []
            api.getBusinessUserinfo({},_this.type).then((res) =>{
                // console.log(res);
                if(res.success && res.data && Object.keys(res.data).length > 0){
                    _this.inUserId = res.data.userId
                    if(res.data.children == 0){
                      res.data['leaf'] = true
                    }
                    res.data['nickname'] = res.data.nickname + '(库存:' + res.data.devices + '/总数:' + (res.data.devices + res.data.sellDevices) + ')'
 
                    _this.insiadeData.push(res.data)
                    _this.custData.push(res.data)
                }
            }).catch((err) => {
                _this.$message({message: err.msg, type:'error',offset:'200',duration:'1500'})
            })
        },
        getBusiness(userId){ // 获取代理商
          let data = {
            parentId:userId
          }
          
          api.getBusiness(data,this.type).then(res => {
              let data = res.data
              this.insiadeData = this.setTreeData(data)
              this.custData = this.setTreeData(data)
            }).catch(err => {
              this.custData = []
              this.insiadeData = []
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
        evt_loadTree(node, resolve){ //查询客户下级
          // console.log(node)
          var _this = this
            if(node.level === 0){
                return resolve(_this.data);
            }
            if(node.level != 0){
                var request_data = {}
                request_data['parentId'] = node.data.userId
                api.getBusiness(request_data,_this.type).then((res) => {
                    if(res.success){
                        if(res.data.length == 0){
                            resolve([])
                            return
                        }
                        var children_data = res.data
                        for(let i = 0;i<children_data.length;i++){
                          children_data[i]['nickname'] = children_data[i].nickname + '(' + children_data[i].devices +'/'+ (children_data[i].devices + children_data[i].sellDevices) +')'
                          if(children_data[i].children == 0){
                            children_data[i]['leaf'] = true
                          }
                        }
                        node.data['children'] = children_data
                        resolve(children_data)
                    }else{
                        _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
                        resolve([]);
                    }
                }).catch((err) => {
                    _this.$message({message: err.msg,type:'error',offset:'200',duration:'1000'});
                    resolve([]);
                })
            }  
        },
        evt_loadTreeTwo(node, resolve){ //查询客户下级
          // console.log(node)
          var _this = this
            if(node.level === 0){
                return resolve(_this.insiadeData);
            }
            if(node.level != 0){
                var request_data = {}
                request_data['parentId'] = node.data.userId
                api.getBusiness(request_data,_this.type).then((res) => {
                    if(res.success){
                        if(res.data.length == 0){
                            resolve([])
                            return
                        }
                        var children_data = res.data
                        for(let i = 0;i<children_data.length;i++){
                          children_data[i]['nickname'] = children_data[i].nickname + '(' + children_data[i].devices +'/'+ (children_data[i].devices + children_data[i].sellDevices) +')'
                          if(children_data[i].children == 0){
                            children_data[i]['leaf'] = true
                          }
                        }
                        node.data['children'] = children_data
                        resolve(children_data)
                    }else{
                        _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
                        resolve([]);
                    }
                }).catch((err) => {
                    _this.$message({message: err.msg,type:'error',offset:'200',duration:'1000'});
                    resolve([]);
                })
            }  
        },
        handleClick(tab, event) { // 全部客户，到期客户
          console.log(tab, event)
          if(tab.name == '到期'){
            this.ownerId = null
            this.getlist(1)
          }else{
            this.refresh()
          }
        },
        handleNodeClick(data) { // 选择用户节点
          console.log(data)
          this.ownerId = data.userId
          // let item = {
          //   ownerId : data.userId,
          //   containsChildren:true
          // }
          if(JSON.parse(sessionStorage['user']).userId==this.ownerId){
            this.ownerId = null
            this.getlist()
            return
          }
          this.getlist()
          // api.queryDevices(item,this.type).then(res => {
          //   if(res.success){
          //     this.dataList = res.data
          //     this.page.total = res.data.length  
          //   }else {
          //     this.dataList = []
          //     this.page.total = 0
          //     this.$message.error(res.msg)
          //   }
          // }).catch(err => {
          //   this.dataList = []
          //   this.page.total = 0
          //   this.$message.error(err.msg)
          // })
        }, 
        showDialog(index, data){ // 操作
          switch (index) {
            case '1': // 设备详情
              this.current1 = this.range.length-1
              this.equinfoForm = Object.assign({},data)
              if(this.equinfoForm.useRangeCode==null){
                this.equinfoForm.useRangeCode = 'Other'
              }
              for(let i=0;i<this.range.length;i++){
                if(this.range[i][0]==this.equinfoForm.useRangeCode){
                  this.current1 = i
                }
              }
              this.dialogEquinfo = true
              break
            case 'a': //销售-删除设备
              // debugger
              for(let i = 0;i<this.saleList.length;i++){
                // debugger
                if(this.saleList[i].id==data.id){
                  this.saleList.splice(i,1)
                  i--
                }
              }
              this.equNum = this.saleList.length
              break
            case '2': //轨迹回放 
              this.$router.push({path:'/control/control',query:{deviceId:data.id}})
              break  
            case '3': //电子围栏 
              this.$router.push({path:'/electric/electric',query:{deviceName:data.deviceName,deviceId:data.id}})
              break
            case '4' : // 下发指令
              this.tempList = []
              this.tempList.push(data)
              this.dialogSend = true
              this.$nextTick(() => {
                this.$refs.sendOrder.formData = {}
                this.$refs.sendOrder.schema = null
                this.$refs.sendOrder.deviceCmdTemplateId = null
                this.$refs.sendOrder.searchImei = null
                this.$refs.sendOrder.tempNum = 0
                this.$refs.sendOrder.getlist()
              })
              break  
            case '5' : // 历史指令
              this.hisTime = null
              this.commandName = null
              this.deviceId = data.id
              this.getCmdTemplates(data.deviceModel.id)
              this.dialogHistorysend = true
              this.queryDeviceCmds()
              break
            case '6' : // 查看报警  
              this.$router.push({name:"route.statistics",params:{data:data}})
              break
            case '7' : // 通讯日志
              let url = 'http://rinlink-log-viewer.beijing-cn-k8s-test.rinlink.com/?projectName=k8s-log-ca07b6d6a7f6b46aabdd1a128384d3fff&logName=ack-test&queryString=content:%20jt808-gateway%20and%20(response_device_success%20or%20response_device_failed%20or%20device_request_message) and ' + data.deviceNumber
              window.open(url)
              break  
            case '8' : // SIM卡信息
              this.SIMForm = data
              this.dialogSIM = true
              break
          }
        },
        confrimEquinfo(){ //确认更新设备
          let data = {
            deviceId:this.equinfoForm.id,
            deviceName:this.equinfoForm.deviceName,
            remark:this.equinfoForm.remark,
            useRangeCode:this.equinfoForm.useRangeCode
          }
          api.editDevices(data,this.type).then(res => {
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
          // console.log(val)
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
          let list =[]
          this.searchImei = null
          this.searchName = ''
          this.expiredTimeType = null
          this.checked = false
          this.insiadeData = this.custData 
          this.saleList = JSON.parse(JSON.stringify(this.multipleSelection))
          this.equNum = this.multipleSelection.length
          this.saleTotal = 0
          this.saleSuc = 0
          this.saleFal = 0
          this.tempNum = 0
          this.dialogSale = true
        },
        restInfo(){ // 重置
          this.custinfo = {
            userId:'',
            username:''
          }
          let list =[]
          this.checked = false
          this.expiredTimeType = null
          this.searchImei = ''
          this.searchName = ''
          this.insiadeData = this.custData 
          this.saleList = list.concat(this.multipleSelection) 
          this.equNum = this.multipleSelection.length
        },
        inputChange(){
          this.searchImei=this.searchImei.replace(/[^\d|^\n\r]/g,'')
        },
        changeIMEI(val){
          // console.log(val,typeof val)
          if(val.trim()){
            let temp = null
            temp= val.split("\n")
            temp = temp.filter(str => !!str)
            setTimeout(() => {
              this.tempNum = temp.length
            },100)
          }else{
            // this.$set(this.temp,'num',0)
            this.tempNum = 0
          }
        },
        searchEqu(){ //销售-搜索设备
          if(!this.searchImei){
            return this.$message.warning(this.$t('table.searchimei'))
          }
          let temp = null
          temp= this.searchImei.split("\n")
          temp = temp.filter(str => !!str)
          let data = null
          if(temp.length == 0){
            return this.$message.warning(this.$t('table.searchimei'))
          }else if(temp.length == 1){
            data = {
              containsChildren: true,
              deviceNumberKeyword : this.searchImei.replace("\n", "")
            }
          }else{
            data = {
              containsChildren: true,
              deviceNumberList : temp,
              pageSize : temp.length
            }
          }
          // console.log(temp)
           
          api.getDevicesList(data,this.type).then(res => {
            if(res.success){
              if(res.data.content.length<=0){
                return this.$message.warning(this.$t('table.temporarily'))
              }
              let item = res.data.content
              for(let i = 0;i<item.length;i++){
                if(item[i].deviceModel){
                  item[i]['model'] = item[i].deviceModel.name
                }else{
                  item[i]['model'] = ''
                }
                if(item[i].owner){
                  item[i]['username'] = item[i].owner.username
                }else{
                  item[i]['username'] = ''
                }
              }
              for(let a=0;a<this.saleList.length;a++){
                for(let b = 0;b<item.length;b++){
                  if(this.saleList[a].id == item[b].id){
                    item.splice(b, 1)
                    b--
                  }
                }
              }
              if(item.length>0){
                this.saleList = this.saleList.concat(item)
              }
              // let item = res.data.content[0]
              // if(item.deviceModel){
              //   item['model'] = item.deviceModel.name
              // }else{
              //   item['model'] = ''
              // }
              // if(item.owner){
              //   item['username'] = item.owner.username
              // }else{
              //   item['username'] = ''
              // }
              // var num = 0
              
              // for(let i = 0;i < this.saleList.length;i++){
              //   if(this.saleList[i].id == item.id){
              //     num = 0
              //   }else {
              //     num++
              //   }
              // }
              // if(num == this.saleList.length){
              //   this.saleList.push(item)
              // }
              this.equNum = this.saleList.length
              // console.log(this.saleList)
            }else{
              // this.insiadeData = []
              this.$message.error(res.msg)
            }
            
          }).catch(err => {
            // this.insiadeData = []
            this.$message.error(err.msg)
          })
        },
        searchCust(){ //销售-搜索客户或账号
          let data = {
            searchType : this.selectType1,
            searchContent:this.searchName
          }
          if(this.searchName.trim() == '') {
            this.evt_getBusinessUserinfoTwo()
            return
          }
          api.searchBusiness(data,this.type).then(res => {
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
          if(val){
            this.expiredTimeType = val
          }else{
            this.expiredTimeType = null
          }
          
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
          if(this.custinfo.username==JSON.parse(sessionStorage['user']).username){
            return this.$message.warning('设备不可销售给自己')
          }
          var time = null
          if(Number(this.expiredTimeType)>0){
            time = new Date().getTime() + Number(this.expiredTimeType)*24*60*60*1000
          }else if(this.expiredTimeType==null){
            time = this.expiredTimeType
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
          this.saleTotal = 0
          this.saleSuc = 0
          this.saleFal = 0
          api.sellDevices(data,this.type).then(res => {
            if(res.success){
              this.$message.success(this.$t('message.success'))
              // this.multipleSelection = []
              // this.dialogSale = false
              this.getlist()
              let suc = 0
              let fal = 0
              this.saleTotal = res.data.length
              for(let i = 0;i<res.data.length;i++){
                if(res.data[i].sellSuccess){
                  suc++
                }else{
                  fal++
                }
              }
              this.saleSuc = suc
              this.saleFal = fal
              this.saleInfoList = res.data
              for(let a = 0;a<this.saleList.length;a++){
                for(let b = 0;b<this.saleInfoList.length;b++){
                  if(this.saleList[a].id==this.saleInfoList[b].deviceId){
                    this.saleInfoList[b]['deviceNumber'] = this.saleList[a].deviceNumber
                  }
                }
              }
            }else {
              time = null
              this.$message.error(res.msg)
            }
          }).catch(err => {
            time = null
            this.$message.error(err.msg)
          })
        },
        viewSaleInfo(){
          this.dialogSaleInfo = true
        },
        moveLable(){ // 移动到其他标签
          this.dialogLable = true
        },
        download(){ // 导出
          
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
          this.tempList = JSON.parse(JSON.stringify(this.multipleSelection))
          this.dialogSend = true
          this.$nextTick(() => {
            this.$refs.sendOrder.formData = {}
            this.$refs.sendOrder.schema = null
            this.$refs.sendOrder.deviceCmdTemplateId = null
            this.$refs.sendOrder.searchImei = null
            this.$refs.sendOrder.tempNum = 0
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
        queryDeviceCmds(type){ // 历史指令分页查询
            let data = {
              commandName:this.commandName,
              deviceId:this.deviceId,
              startTime:this.hisTime != null ? this.hisTime[0] : null,
              endTime:this.hisTime != null ? this.hisTime[1] : null,
              page:this.page1.index-1,
              pageSize:this.page1.size
            }
            if(type==1){
              this.page1.index = 1
              data.page = 0
            }
            api.queryDeviceCmds(data,this.type).then(res => {
              this.historysendList = res.data.content
              this.page1.total = res.data.totalElements
            }).catch(err => {
              this.historysendList = []
              this.page1.total = 0
              this.$message.error(err.errMsg)
            })
        },
        changeindex1(val){ // 历史指令查询
          this.page1.index=val
          try{
              this.queryDeviceCmds()
          }catch(res){
              
          }
        },
        refreshHistory(){ // 刷新历史指令
          this.hisTime = null
          this.commandName = null
          this.queryDeviceCmds()
        },
        recharge(){ // 平台充值
          // debugger
          this.rechargeList = JSON.parse(JSON.stringify(this.multipleSelection))
          this.$refs.dialogRecharge.dialogVisible = true
          this.$nextTick(() => {
            this.$refs.dialogRecharge.searchImei = null
            this.$refs.dialogRecharge.tempNum = 0
            this.$refs.dialogRecharge.flag = 1
          })
        }
   },
  // 过滤器格式化时间戳
  filters: {
    //  时间格式自定义 只需把字符串里面的改成自己所需的格式
    formatDate(time) {
      if(time == null){
        return '--'
      }
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatDate2 (time) {
      // debugger
      if (!time||time == -1) {
        return '--'
      }
      if (time != '--') {
        let date = new Date(Number(time))
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      } else {
        return time
      }
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
    border: 1px solid #CCCCCC;
}
.list-search{
  padding: 10px 10px 0 10px;
}
.fangwei{
  cursor: pointer;
}
.ischeck  {
  color: rgb(52, 105, 219);
}

/deep/ .el-scrollbar__wrap {
overflow-x: hidden;
}
/deep/ .el-input-group__prepend .el-select{
  margin: -10px 0px;
}
/deep/ .input-with-select .el-input-group__prepend {
  width: 80px;
  padding: 0 0 0 10px;
  background-color: #fff;
}
/deep/ .el-input-group__append{
  padding: 0 10px;
} 
/deep/ .el-table::before{
  border-bottom: 1px solid #CCCCCC;
}
</style>

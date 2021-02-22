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
                    <el-input v-model="search" :placeholder="$t('view.inputimei')"></el-input>
                  </el-col>
                  <el-col :span='3'>
                    <el-select v-model="value" :placeholder="$t('table.model')">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='3'>
                    <el-select v-model="value" :placeholder="$t('view.inputstate')">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='3'>
                    <el-select v-model="value" :placeholder="$t('view.inputlabel')">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='3'>
                    <el-select v-model="value" :placeholder="$t('view.inputstate2')">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='2' style="line-height:40px">
                    <el-checkbox v-model="checked">{{$t('view.subordinate')}}</el-checkbox>
                  </el-col>
                  <el-col :span='4'>
                    <el-button class="butresh" >{{$t('button.search')}}</el-button>
                    <el-button class="butdele" >{{$t('button.more')}}</el-button>
                  </el-col>
                </el-row>
                <el-row class="list-search" :gutter="22">
                    <el-col :span='4'>
                      <el-button size="mini" >{{$t('button.download')}}</el-button>
                      <el-button size="mini" @click="send">{{$t('button.send')}}</el-button>
                    </el-col>  
                </el-row>
                <el-row :gutter="22" class="list-search" >
                    <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh;padding:0 10px" ></BaseTable>
                </el-row>
            </el-col>
        </el-card>
        <!-- 下发指令 -->
        <el-dialog
            :title="$t('button.send')"
            :visible.sync="dialogSend"
            width="40%">
            <send-order ref="sendOrder" @confrimSend='confrimSend'/>
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
    name:'jihuo',
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
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        value:null,
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        checked:true,
        loading:false,
        dataList:[],
        tableLabel: [
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.Device'), prop: 'serial_number'},
          {label: this.$t('table.imei'), prop: 'category'},
          {label: this.$t('table.label'), prop: 'category'},
          {label: this.$t('table.model'), prop: 'category'},
          {label: this.$t('table.status'), prop: 'category'},
          {label: this.$t('table.usestatus'), prop: 'category'},
          {label: this.$t('table.iccid'), prop: 'partner_contacts'},
          {label: this.$t('table.customers'), prop: 'partner_contacts'},
          {label: this.$t('table.activeTime'), prop: 'partner_contacts'},
          {label: this.$t('table.expire'), prop: 'partner_contacts'},
          {label: this.$t('table.salesTime'), prop: 'partner_contacts'},
          {label: this.$t('table.mileage'), prop: 'partner_contacts'},
          {label: this.$t('table.importtime'), prop: 'partner_contacts'},
          {label: this.$t('table.operation'),
            type: 'clickSelect',
            selectOperation: (index, row) => {
              this.showDialog(index, row)
            },
            selectText: [{command: '1', text: this.$t('button.editor'), index: 1},
            {command: '2', text: this.$t('button.dele'), index: 2},
            {command: '3', text: this.$t('button.equinfo'), index: 3},
            {command: '4', text: this.$t('button.playback'), index: 4},
            {command: '5', text: this.$t('button.shewei'), index: 5},
            {command: '6', text: this.$t('button.send'), index: 6} ]
        }],
        dialogSend:false
      }
    },
    mounted(){
        this.height=document.body.offsetHeight-62
  
    },
    methods:{
        handleClick(tab, event) { // 全部客户，到期客户
          console.log(tab, event);
        },
        handleNodeClick(data) { // 选择用户节点
          console.log(data)
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

<template>
    <div  >
        <el-row class="cust-title">
            <span>{{$t('route.List')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            
            <el-col :span='24'>
                
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
                  <el-col :span='5'>
                    <el-button class="butresh" >{{$t('button.search')}}</el-button>
                    <el-button class="butdele" @click="sell('one')">{{$t('button.sell')}}</el-button>
                    <el-button class="butdele" @click="sell('more')">{{$t('button.sellMore')}}</el-button>
                    <el-button class="butadd" >{{$t('button.download')}}</el-button>
                  </el-col>
                </el-row>
                <el-row class="list-search" :gutter="22">
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
                    <el-col :span='5' >
                        <el-date-picker
                          style="width:98%"
                          v-model="value1"
                          type="datetimerange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
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
                </el-row>
                <el-row :gutter="22" class="list-search" >
                    <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh;padding:0 10px" ></BaseTable>
                </el-row>
            </el-col>
        </el-card>
        <!-- 出货/批量出货 -->
        <el-dialog
          :title="isMore? $t('button.sellMore'): $t('button.sell')"
          :visible.sync="dialogShipment"
          width="30%">
          <el-form :model="shipmentForm" :rules="rules" ref="shipmentForm" label-width="100px" class="demo-ruleForm">
              <el-form-item :label="$t('table.model')" prop="name">
                 <el-select v-model="shipmentForm.value" :placeholder="$t('table.model')">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.agent')" prop="name">
                 <el-select v-model="shipmentForm.value" :placeholder="$t('table.agent')">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.imei')" prop="name" v-if="!isMore">
                  <el-input v-model="shipmentForm.name" :placeholder="$t('table.imei')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('view.upfile')" prop="name" v-if="isMore">
                  <el-input v-model="shipmentForm.name" :placeholder="$t('view.upfile')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('table.isCard')" prop="name">
                 <el-select v-model="shipmentForm.value" :placeholder="$t('table.isCard')">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.serviceLife')" prop="name">
                 <el-select v-model="shipmentForm.value" :placeholder="$t('table.serviceLife')">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.activationType')" prop="name">
                 <el-select v-model="shipmentForm.value" :placeholder="$t('table.activationType')">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.batch')" prop="name">
                  <el-input v-model="shipmentForm.name" :placeholder="$t('table.batch')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('table.date')" prop="name">
                  <el-date-picker
                    v-model="shipmentForm.name"
                    type="date"
                    :placeholder="$t('table.date')">
                  </el-date-picker>
              </el-form-item>
          </el-form>      
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogShipment = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="dialogShipment = false">{{$t('button.determine')}}</el-button>
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
        height:1000,
        search:null,
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
        value1:'',
        loading:false,
        dataList:[],
        tableLabel: [
          {label: this.$t('table.index'), type: 'index'},
          {label: this.$t('table.type'), prop: 'serial_number'},
          {label: this.$t('table.model'), prop: 'category'},
          {label: this.$t('table.imei'), prop: 'category'},
          {label: this.$t('table.agent'), prop: 'category'},
          {label: this.$t('table.activationType'), prop: 'category'},
          {label: this.$t('table.activationTime'), prop: 'category'},
          {label: this.$t('table.date'), prop: 'partner_contacts'},
          {label: this.$t('table.isCard'), prop: 'partner_contacts'},
          {label: this.$t('table.iccid'), prop: 'partner_contacts'},
          {label: this.$t('table.batch'), prop: 'partner_contacts'},
          {label: this.$t('table.serviceLife'), prop: 'partner_contacts'},
          {label: this.$t('table.deliveryTime'), prop: 'partner_contacts'},
          {label: this.$t('table.usestatus'), prop: 'partner_contacts'},
        ],
        dialogShipment:false,
        isMore:false,
        shipmentForm:{
            value:''
        },
        rules:[]
      }
    },
    mounted(){
        this.height=document.body.offsetHeight-152
  
    },
    methods:{
        sell(data){
            if(data=='one'){
                this.isMore = false
            }else{
                this.isMore = true
            }
            this.dialogShipment = true
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

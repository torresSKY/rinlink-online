<template>
    <div  >
        <el-row class="cust-title">
            <span>{{$t('table.operLog')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-col :span='24'>
                <el-row class="list-search" :gutter="22">
                  <el-col :span='4'>
                    <el-input v-model="deviceModelName" :placeholder="$t('view.searchUser')" clearable></el-input>
                  </el-col>
                  <el-col :span='4'>
                    <el-select v-model="value" :placeholder="$t('table.operType')" clearable>
                      <el-option
                        v-for="item in operTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span='7'>
                    <el-date-picker
                      v-model="time"
                      type="datetimerange"
                      range-separator="-"
                      value-format="timestamp"
                      :start-placeholder="$t('table.startdata')"
                      :end-placeholder="$t('table.enddata')">
                    </el-date-picker>
                  </el-col>
                  <el-col :span='3'>
                    <el-button class="butresh" @click="getlist()">{{$t('button.search')}}</el-button>
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
    name:'operLog',
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
          {label: this.$t('table.operTime'), prop: 'name'},
          {label: this.$t('view.username'), prop: 'iotServiceName'},
          {label: this.$t('view.admin'), prop: 'createTime'},
          {label: this.$t('view.user'), prop: 'createTime'},
          {label: this.$t('table.operType'), prop: 'createTime'},
          {label: this.$t('table.logContent'), prop: 'logContent'},
        ],
        operTypeOptions:[
          { value: '1', label: this.$t('button.add')},{ value: '2', label: this.$t('button.editor')},
          { value: '3', label: this.$t('button.dele')},{ value: '4', label: this.$t('button.search')},
          { value: '5', label: this.$t('view.region1')}
        ],
        time:[]
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
              paging:{
                pageSize: this.page.size,
                page: this.page.index - 1,
              },
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

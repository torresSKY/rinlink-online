<template>
    <div id="alarmOverview" >
        <el-row :gutter="22">
            <el-col :span='24'>
                <el-row :gutter="22" style="margin-top:10px">
                    <!-- <el-col :span='2' style="line-height:40px">
                        <el-select v-model="value" >
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col> -->
                    <el-col :span='5' >
                        <el-date-picker
                          style="width:98%"
                          v-model="time"
                          type="datetimerange"
                          range-separator="-"
                          :start-placeholder="$t('table.startdata')"
                          :end-placeholder="$t('table.enddata')">
                        </el-date-picker>
                    </el-col>
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="value" >
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='3'>
                        <el-input v-model="input3" :placeholder="$t('view.inputimei')"></el-input>
                    </el-col>
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="alarmTypeId" :placeholder="$t('view.inputele')">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="handleStatus" :placeholder="$t('table.proStatus')">
                          <el-option
                            v-for="item in handleStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <!-- <el-col :span='2' style="line-height:40px">
                      <el-checkbox v-model="checked">{{$t('view.subordinate')}}</el-checkbox>
                    </el-col> -->
                    <el-col :span='3'>
                      <el-button class="butresh" >{{$t('button.search')}}</el-button>
                      <el-button class="butadd" >{{$t('button.download')}}</el-button>
                    </el-col>
                </el-row>
                <el-row style="margin-top:10px">
                    <el-col :span='4'>
                      <el-button size="mini" @click="allHandle">{{$t('button.allHandle')}}</el-button>
                      <el-button size="mini" @click="singleHandle">{{$t('table.chuli')}}</el-button>
                    </el-col> 
                </el-row>    
                <el-row style="margin-top:10px">
                    <BaseTable v-loading="loading" v-on:childByValue="childByValue" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh" ></BaseTable>
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
        <!-- 处理 -->
        <el-dialog
          :title="$t('button.prompt')"
          :visible.sync="dialogHandle"
          width="30%">
          <el-row >
            <el-col :span='4'>
              <span>{{$t('table.proStatus')}}：</span>
            </el-col>
            <el-col :span='18'>
              <el-radio v-model="radio" label="1" disabled>{{$t('table.chuli')}}</el-radio>
            </el-col>
          </el-row>
          <el-row style="margin:10px 0">
            <el-col :span='4'>
              <span>{{$t('table.process')}}：</span>
            </el-col>  
            <el-col :span='18'>
              <el-input type="textarea" :rows="2" :placeholder="$t('table.process')" v-model="remark" />
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogHandle = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confrimHandle">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import api from "@/api/wechart/index"
import mixin from "@/mixins/index"
import { mapState } from "vuex"
import BaseTable from '@/components/table'
export default {
  name: "alarmDetail",
  components:{ BaseTable },
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      input3:'',
      value:'',
      options:[],
      checked:true,
      loading:false,
      dataList: [],
      tableLabel: [
        {label: '', type: 'selection'},
        {label: this.$t('table.Device'), prop: 'deviceName'},
        {label: this.$t('table.imei'), prop: 'deviceNumber'},
        {label: this.$t('table.model'), prop: 'partner_contacts'},
        {label: this.$t('table.alatype'), prop: 'alarmTypeCode'},
        {label: this.$t('table.alartime'), prop: 'alarmTime'},
        {label: this.$t('table.alarmAddress'), prop: 'alarmAddress'},
        {label: this.$t('table.handler'), prop: 'handleName'},
        {label: this.$t('table.proStatus'), prop: 'handleStatus'},
        {label: this.$t('table.proTime'), prop: 'handleTime'},
        {label: this.$t('table.process'), prop: 'handleRemark'},     
      ],
      time:[],
      alarmTypeId:'',
      handleStatus:'',
      handleStatusOptions:[
        { value: 1, label: '未处理'}, 
        { value: 2, label: '已处理'}
      ],
      dialogHandle:false,
      multipleSelection:[],
      radio:'1',
      remark:''
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    getlist(){ // 获取系统管理员列表
      this.loading = true
      api.getAlarmsDetail({params: {
        pageSize: this.page.size,
        page: this.page.index - 1,
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
    childByValue(val){ //选择处理数据
      console.log(val)
      this.multipleSelection = val
    },
    singleHandle(){ // 单个处理
      if(this.multipleSelection.length !==1){
        return this.$message.warning(this.$t('message.selOne'))
      }
      if(this.multipleSelection[0].handleStatus!==1){
        return this.$message.warning(this.$t('message.selUnprocessed'))
      }
      this.remark = ''
      this.dialogHandle = true
    },
    confrimHandle(){ // 确认单个处理
      let data = {
        deviceAlarmId:this.multipleSelection[0].deviceId,
        remark:this.remark
      }
      api.handleDeviceAlarm(data).then(res => {
        if(res.msg=='OK'){
          this.$message.success(this.$t('message.alaedit'))
          this.dialogHandle = false
          this.getlist()
        }else {
          this.$message.error(res.errMsg)
        }
      }).catch(err => {
        this.$message.error(err.errMsg)
      })
    },
    allHandle(){ // 全部处理
      this.$confirm(this.$t('message.handleAll'), this.$t('message.newtitle'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      }).then(() => {
        let id = {
          // userId:data.userId
        }
        api.handleDeviceAlarms().then(res => {
          if(res.msg=='OK'){
            this.$message.success(this.$t('message.alaedit'))
            this.getlist()
          }else{
            this.$message.error(res.errMsg)
          }
          
        }).catch(err => {
          this.$message.error(err.errMsg)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style type="stylesheet/scss" lang="scss" scoped>
</style>

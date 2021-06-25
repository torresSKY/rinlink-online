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
                          value-format="timestamp"
                          range-separator="-"
                          :start-placeholder="$t('table.startdata')"
                          :end-placeholder="$t('table.enddata')"
                          :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-col>
                    <el-col :span='3' style="line-height:38px" v-if="type!=3">
                        <!-- <el-select v-model="value" :placeholder="$t('view.customerList')" clearable>
                          <el-option
                            v-for="item in businessoptions"
                            :key="item.userId"
                            :label="item.username"
                            :value="item.userId">
                          </el-option>
                        </el-select> -->
                        <treeselect v-model="value"  :options="businessoptions" :placeholder="$t('view.customerList')" 
                        :load-options="loadOptions"/>
                    </el-col>
                    <el-col :span='5'>
                      <el-col :span='10'>
                        <el-select v-model="selStatus" >
                          <el-option
                            v-for="item in selOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span='14' >
                        <el-autocomplete v-model="input3" placeholder="请选择"  
                        :fetch-suggestions="querySearchAsync" @select="handleSelect" clearable></el-autocomplete>
                      </el-col>
                    </el-col>
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="alarmTypeId" :placeholder="$t('view.inputele')" clearable>
                          <el-option
                            v-for="item in alarmTypeList"
                            :key="item[0]"
                            :label="item[1].name"
                            :value="item[0]">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="handleStatus" :placeholder="$t('table.proStatus')" clearable>
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
                    <el-col :span='4'>
                      <el-button class="butresh" @click="getlist(1)">{{$t('button.search')}}</el-button>
                      <!-- <el-button class="butadd" >{{$t('button.download')}}</el-button> -->
                      <el-button class="butresh" @click="refresh">{{$t('button.refresh')}}</el-button>
                    </el-col>
                </el-row>
                <el-row style="margin-top:10px">
                    <el-col :span='4'>
                      <el-button size="mini" @click="allHandle">{{$t('button.allHandle')}}</el-button>
                      <el-button size="mini" @click="singleHandle">{{$t('table.chuli')}}</el-button>
                    </el-col> 
                </el-row>    
                <el-row style="margin-top:10px">
                  <el-scrollbar style="height:66vh;" ref="scrollbar">
                    <BaseTable v-loading="loading" v-on:childByValue="childByValue" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh" ></BaseTable>
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
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "alarmDetail",
  components:{ BaseTable,Treeselect },
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  props: {
    itemData: { type: Object },
  },
  data() {
    return {
      input3:null,
      value:null,
      businessoptions:[],
      checked:true,
      loading:false,
      dataList: [],
      tableLabel: [
        {label: '', type: 'selection'},
        {label: this.$t('table.Device'), prop: 'deviceName'},
        {label: this.$t('table.imei'), prop: 'deviceNumber'},
        {label: this.$t('table.model'), prop: 'deviceModelName'},
        {label: this.$t('table.alatype'), prop: 'alarmTypeStatus',type: 'render',
          formatter: (params) => {
            // console.log(params)
            for(let i = 0;i<this.alarmTypeList.length;i++){
              if(params['alarmTypeCode']==this.alarmTypeList[i][0]){
                params['alarmTypeStatus'] = this.alarmTypeList[i][1].name
              }
            }
            return params
          }},
        {label: this.$t('table.alartime'), prop: 'alarmTime', type: 'Timestamp'},
        {label: this.$t('table.alarmAddress'), prop: 'alarmAddress'},
        {label: this.$t('table.handler'), prop: 'handleName'},
        {label: this.$t('table.proStatus'), prop: 'handleStatus',
         type: 'render',
            formatter: (params) => {
              params.handleStatus = params.handleStatus === 0 ? '未处理' : params.handleStatus == 1 ? '已处理' : params.handleStatus
              return params
            }
        },
        {label: this.$t('table.proTime'), prop: 'handleTime', type: 'Timestamp'},
        {label: this.$t('table.process'), prop: 'handleRemark'},     
      ],
      time:[],
      alarmTypeId:null,
      handleStatus:'',
      handleStatusOptions:[
        { value: 0, label: '未处理'}, 
        { value: 1, label: '已处理'}
      ],
      dialogHandle:false,
      multipleSelection:[],
      radio:'1',
      remark:'',
      alarmTypeList:[],
      deviceId:null,
      type:null,
      deviceIdList:[],
      timeout: null,
      selStatus:1,
      selOptions:[
        { value: 1, label: '设备IMEI'}, 
        { value: 2, label: '设备名称'}
      ]
    }
  },
  mounted() {
    // debugger
    this.type = JSON.parse(sessionStorage['user']).userType
    if(this.$route.params.data){
        this.deviceId = this.$route.params.data.id
    }else{
        this.deviceId = null
    }
    this.getlist()
    if(this.type!=3){
      this.getBusiness()
    }
    
    this.getAlarmType()
  },
  watch: {
    itemData: {
      immediate: true, //绑定值就开始执行监听，而不是等值改变。
      handler(newValue, oldValue) {
        console.log(newValue, oldValue)
        if(newValue){
          this.input3 = newValue.deviceNumber
          // debugger
          this.alarmTypeId = null
          for(let i = 0;i<this.alarmTypeList.length;i++){
            if(newValue.name == this.alarmTypeList[i][1].name){
              this.alarmTypeId = this.alarmTypeList[i][0]
            }
          }
          // this.alarmTypeId = newValue.statistic[0].alarmTypeCode
          this.getdeviceId(this.input3)
          // this.$setTimeout(() => {
          //   this.getlist(1)
          // })
          setTimeout(() => {
            this.getlist(1)
          },500)
        }
        
      },
    },
  },
  methods: {
    getlist(type){ // 获取报警详情列表
      // if(this.input3){
      //   this.getdeviceId(this.input3)
      // }
      let data = {
        pageSize: this.page.size,
        page: this.page.index - 1,
        startTime:this.time[0] || null,
        endTime:this.time[1] || null,
        deviceOwnerId:this.value,
        deviceIdList:this.deviceId==''?[]:this.deviceId!=null?[this.deviceId]:[],
        alarmTypeCodeList:this.alarmTypeId==''?[]:this.alarmTypeId!=null?[this.alarmTypeId]:[],
        handleStatus:this.handleStatus
      }
      // if(this.alarmTypeId){
      //   data.alarmTypeCodeList = [this.alarmTypeId]
      // }else {
      //   data.alarmTypeCodeList = []
      // }
      if(type==1){
        this.page.index = 1
        data.page = 0
      }
      this.loading = true
      api.getAlarmsDetail(data,this.type).then(res => {
        this.loading = false
        this.dataList = res.data.content
        this.page.total = res.data.totalElements
      }).catch(err => {
        this.loading = false
        this.dataList = []
        this.$message.error(err.msg)
      })
    },
    refresh(){
      this.time = []
      this.value = null
      this.input3 = null
      this.alarmTypeId = null
      this.handleStatus = null 
      this.selStatus = 1
      this.getlist(1)
    },
    querySearchAsync(queryString, cb) {
      console.log(queryString, cb)
      this.deviceId = null
      let data = null
      if(this.selStatus==1){
        data = {
          deviceNumberKeyword: queryString,
          containsChildren:true
        }
      }else{
        data = {
          deviceNameKeyword: queryString,
          containsChildren:true
        }
      }
      
      var that = this
      this.deviceIdList = []
      api.getDevicesList(data,this.type).then(res => {
        // debugger
        if(res.success){
          // console.log(res)
          if(res.data.content.length>0){
            that.deviceIdList = res.data.content
            for(let i = 0;i<that.deviceIdList.length;i++){
              if(this.selStatus==1){
                that.deviceIdList[i]['value'] = that.deviceIdList[i].deviceNumber
              }else{
                that.deviceIdList[i]['value'] = that.deviceIdList[i].deviceName
              }
            }
            var results = queryString ? that.deviceIdList.filter(that.createStateFilter(queryString)) : that.deviceIdList
            // console.log(results,'results')
            clearTimeout(that.timeout);
            that.timeout = setTimeout(() => {
              cb(results)
            }, 1000 )
          }else{
            clearTimeout(that.timeout);
            that.timeout = setTimeout(() => {
              cb([])
            }, 1000 )
          }
        }else{
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
        
    },
    createStateFilter(queryString) {
      return (state) => {
        // console.log(state)
        if(this.selStatus==1){
          return (state.deviceNumber.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        }else{
          return (state.deviceName.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        }
        
      };
    },
    handleSelect(item){
      // console.log(item)
      this.deviceId = item.id
    },
    getdeviceId(deviceNumber){ // 获取设备id
      let data = {
        deviceNumberKeyword: deviceNumber,
        containsChildren:true
      }
      api.getDevicesList(data,this.type).then(res => {
        // debugger
        if(res.success){
          console.log(res)
          if(res.data.content.length>0){
            this.deviceId = res.data.content[0].id
          }
        }else{
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    getBusiness(){ // 获取代理商
      let data = {
        parentId:null
      }
      api.getBusiness(data,this.type).then(res => {
          this.businessoptions = res.data
          for(let i =0;i<this.businessoptions.length;i++){
            this.businessoptions[i]['id'] = this.businessoptions[i].userId
            this.businessoptions[i]['label'] = this.businessoptions[i].nickname
            if(this.businessoptions[i].children==1){
              this.businessoptions[i].children = null
            }
          }
        }).catch(err => {
          this.businessoptions = []
          this.$message.error(err.msg)
        })
    },
    loadOptions({ action, parentNode, callback }) {
      console.log(action, parentNode)
      var _this = this
      if (action == 'LOAD_CHILDREN_OPTIONS') {
        var request_data = {}
        request_data['parentId'] = parentNode.userId
        api.getBusiness(request_data,_this.type).then((res) => {
            if(res.success){
                if(res.data.length == 0){
                    parentNode.children = []
                    callback()
                    return
                }
                var children_data = res.data
                for(let i = 0;i<children_data.length;i++){
                  children_data[i]['id'] = children_data[i].userId
                  children_data[i]['label'] = children_data[i].nickname
                  if(children_data[i].children == 1){
                    children_data[i].children = null
                  }
                }
                // debugger
                parentNode.children = children_data
                callback()
            }else{
                parentNode.children = []
                _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
                callback()
            }
        }).catch((err) => {
            parentNode.children = []
            _this.$message({message: err.msg,type:'error',offset:'200',duration:'1000'});
            callback();
        })
      }

    },
    getAlarmType(){ // 查询报警类型
        api.getAlarmType({headers: { 'Content-Type': 'application/json,charset=utf-8' }}).then(res => {
          if(res.success){
            this.alarmTypeList = Object.entries(res.data)
            console.log(this.alarmTypeList)
          }else{
            this.alarmTypeList = []
            this.$message.error(res.msg)
          }
          
        }).catch(err => {
          this.alarmTypeList = []
          this.$message.error(err.msg)
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
      if(this.multipleSelection[0].handleStatus!=='未处理'){
        return this.$message.warning(this.$t('message.selUnprocessed'))
      }
      this.remark = ''
      this.dialogHandle = true
    },
    confrimHandle(){ // 确认单个处理
      let data = {
        deviceAlarmId:this.multipleSelection[0].id,
        remark:this.remark
      }
      api.handleDeviceAlarm(data,this.type).then(res => {
        if(res.success){
          this.$message.success(this.$t('message.alaedit'))
          this.dialogHandle = false
          this.getlist()
        }else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
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
          startTime:this.time[0] || null,
          endTime:this.time[1] || null,
          deviceOwnerId:this.value,
          deviceIdList:this.deviceId==''?[]:this.deviceId!=null?[this.deviceId]:[],
          alarmTypeId:this.alarmTypeId
        }
        api.handleDeviceAlarms(this.type,id).then(res => {
          if(res.success){
            this.$message.success(this.$t('message.alaedit'))
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
    }
  }
}
</script>
<style type="stylesheet/scss" lang="scss" scoped>
/deep/ .el-scrollbar__wrap {
overflow-x: hidden;
}
/deep/ .vue-treeselect__placeholder{
  line-height: 38px;
}
</style>

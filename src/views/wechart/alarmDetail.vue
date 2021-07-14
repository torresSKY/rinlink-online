<template>
    <div id="alarmOverview" >
        <el-row :gutter="22">
            <el-col :span='24'>
                <el-row :gutter="22" style="margin:10px 0">
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="dateValue" @change="changeDate">
                          <el-option
                            v-for="item in dateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='5' >
                        <el-date-picker
                          style="width:98%"
                          v-model="time"
                          type="datetimerange"
                          value-format="timestamp"
                          range-separator="-"
                          :start-placeholder="$t('table.startdata')"
                          :end-placeholder="$t('table.enddata')"
                          :default-time="['00:00:00', '23:59:59']"
                          @change="selDate">
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
                        :load-options="loadOptions" :noOptionsText='noOptionsText' noResultsText='暂无数据'/>
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
                    <el-col :span='4'>
                      <!-- <el-col :span='10'>
                        <el-select v-model="selStatus" >
                          <el-option
                            v-for="item in selOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-col> -->
                      <!-- <el-col :span='14' > -->
                        <el-autocomplete v-model="input3" placeholder="请搜索并选择SN或设备名称"  
                        :fetch-suggestions="querySearchAsync" @select="handleSelect" clearable @clear="setBlur()" style="width:100%"></el-autocomplete>
                      <!-- </el-col> -->
                    </el-col>
                    
                    <!-- <el-col :span='2' style="line-height:40px">
                      <el-checkbox v-model="checked">{{$t('view.subordinate')}}</el-checkbox>
                    </el-col> -->
                    <el-col :span='6'>
                      <el-button class="butresh" @click="getlist(1)">{{$t('button.search')}}</el-button>
                      <el-button class="butadd" @click="download">{{$t('button.download')}}</el-button>
                      <el-button class="butresh" @click="refresh">{{$t('button.refresh')}}</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="22" style="margin:10px 0">
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
                    <el-col :span='4' style="line-height:40px">
                      <el-button size="mini" @click="allHandle">{{$t('button.allHandle')}}</el-button>
                      <el-button size="mini" @click="singleHandle">{{$t('table.chuli')}}</el-button>
                    </el-col> 
                </el-row>    
                <el-row :style="{height:tableHeight - 220 + 'px',overflow:'auto', }">
                  <!-- <el-scrollbar style="height:66vh;" ref="scrollbar"> -->
                    <BaseTable v-loading="loading" v-on:childByValue="childByValue" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh" ></BaseTable>
                  <!-- </el-scrollbar> -->
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
import { mapState, mapGetters, mapActions } from "vuex"
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
      dateValue:'1',
      dateOptions:[
        { value: '1', label: '今天'},{ value: '2', label: '昨天'},
        { value: '3', label: '本周'},{ value: '4', label: '上周'},
        { value: '5', label: '本月'},{ value: '6', label: '上月'},
        { value: '7', label: '自定义'}
      ],
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
      time:[new Date(new Date().toLocaleDateString()).getTime(),new Date().getTime()],
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
        { value: 1, label: '设备SN'}, 
        { value: 2, label: '设备名称'}
      ],
      tableHeight:document.body.offsetHeight - 102,
      noOptionsText:null
    }
  },
  mounted() {
    var that =this
    window.onresize = () => {
      return (() => {
        that.tableHeight = document.body.offsetHeight - 102
      })()
    }
    // debugger
    this.type = JSON.parse(sessionStorage['user']).userType
    if(this.$route.params.data){
        this.deviceId = this.$route.params.data.id
        this.getlist()
    }else{
        this.deviceId = null
    }

    
    if(this.type!=3){
      this.getBusiness()
    }
    
    this.getAlarmType()
  },
  watch: {
    itemData: {
      immediate: true, //绑定值就开始执行监听，而不是等值改变。
      handler(newValue, oldValue) {
        // console.log(newValue, oldValue)
        if(newValue){
          this.input3 = newValue.deviceNumber
          // debugger
          this.deviceId = newValue.deviceId
          this.time = newValue.time
          this.dateValue = '7'
          this.alarmTypeId = null
          for(let i = 0;i<this.alarmTypeList.length;i++){
            if(newValue.name == this.alarmTypeList[i][1].name){
              this.alarmTypeId = this.alarmTypeList[i][0]
            }
          }
          // this.alarmTypeId = newValue.statistic[0].alarmTypeCode
          // this.getdeviceId(this.input3)
          // this.$setTimeout(() => {
          //   this.getlist(1)
          // })
          setTimeout(() => {
            this.getlist(1)
          },100)
        }
        
      },
    },
  },
  methods: {
    ...mapActions(["setIsAlarm"]),
    changeDate(val){ //切换时间范围
      this.time = []
      var currentDate = new Date()
      var dateZero = new Date(new Date().toLocaleDateString()).getTime()
      const week = currentDate.getDay()
      const millisecond = 1000 * 60 * 60 * 24
      const minusDay = week != 0 ? week - 1 : 6
      const thisweekStart = new Date(dateZero - minusDay * millisecond).getTime()
      const nowMonth = currentDate.getMonth()
      const nowYear = currentDate.getFullYear()
      const monthStartDate = new Date(nowYear, nowMonth, 1)
      if(val == 1){
        this.time = [dateZero,currentDate.getTime()]
      }else if(val == 2){
        let yesterdayStart =  new Date(new Date().toLocaleDateString()).getTime()-1000 * 60 * 60 * 24
        let yesterdayEnd = new Date(new Date().toLocaleDateString()).getTime()-1000
        this.time = [yesterdayStart,yesterdayEnd]
      }else if (val == 3){
        this.time = [thisweekStart,currentDate.getTime()]
      }else if (val == 4){
        let priorWeekLastDay = new Date(thisweekStart - millisecond)
        let priorWeekFirstDay = new Date(priorWeekLastDay.getTime() - (millisecond * 6))
        this.time = [priorWeekFirstDay.getTime(),priorWeekLastDay.getTime()+millisecond-1000]
      }else if (val == 5){
        this.time = [monthStartDate.getTime(),currentDate.getTime()]
      }else if (val == 6){
        let lastMonth = nowMonth
        let lastYear = nowYear
        if (nowMonth == 0) {
          lastMonth = 11 //月份为上年的最后月份
          lastYear-- //年份减1
        }else {
          lastMonth--
        }
        this.time = [new Date(lastYear, lastMonth, 1).getTime(),monthStartDate.getTime()-1000] 
      }else if (val == 7){
        this.time = []
      }
    },
    selDate(){
      this.dateValue = '7'
    },
    getlist(type){ // 获取报警详情列表
      // if(this.input3){
      //   this.getdeviceId(this.input3)
      // }
      let startTime = null
      let end = null
      if(this.time){
        startTime = this.time[0]
        end = this.time[1]
      }
      let data = {
        pageSize: this.page.size,
        page: this.page.index - 1,
        startTime:startTime ,
        endTime:end ,
        deviceOwnerId:this.value,
        deviceIdList:this.deviceId==''?[]:this.deviceId!=null?[this.deviceId]:[],
        alarmTypeCodeList:this.alarmTypeId==''?[]:this.alarmTypeId!=null?[this.alarmTypeId]:[],
        handleStatus:this.handleStatus,
        containsChildren:true
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
    setBlur(){
      document.activeElement.blur()
    },
    querySearchAsync(queryString, cb) {
      console.log(queryString, cb)
      this.deviceId = null
      let data = null
      // if(this.selStatus==1){
      //   data = {
      //     deviceNumberKeyword: queryString,
      //     containsChildren:true
      //   }
      // }else{
      //   data = {
      //     deviceNameKeyword: queryString,
      //     containsChildren:true
      //   }
      // }
      data = {
        deviceNumberKeyword:this.input3,
        containsChildren:true
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
              if(!isNaN(this.input3)){
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
            }, 200 )
          }else{
            clearTimeout(that.timeout);
            that.timeout = setTimeout(() => {
              cb([])
            }, 200 )
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
        if(!isNaN(this.input3)){
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
      this.noOptionsText = '加载中'
      let data = {
        parentId:null
      }
      api.getBusiness(data,this.type).then(res => {
          if(res.data.length == 0){
           return this.noOptionsText = '暂无数据'
          }
          this.businessoptions = res.data
          for(let i =0;i<this.businessoptions.length;i++){
            this.businessoptions[i]['id'] = this.businessoptions[i].userId
            this.businessoptions[i]['label'] = this.businessoptions[i].nickname
            if(this.businessoptions[i].children>=1){
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
                  if(children_data[i].children >= 1){
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
        return this.$message.warning('请选择一条未处理数据')
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
      // if(this.multipleSelection.length <=0){
      //   return this.$message.warning('请选择一条未处理数据')
      // }
      // for(let i = 0;i<this.multipleSelection.length;i++){
      //   if(this.multipleSelection[i].handleStatus!=='未处理'){
      //     return this.$message.warning(this.$t('message.selUnprocessed'))
      //   }
      // }
      
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
            this.setIsAlarm(false)
            // this.$router.go(0)
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
    },
    download(){ // 导出
      if(this.time ==null){
        return this.$message.warning('请选择导出时间')
      }
      let data = {
        containsChildren:this.checked,
        deviceOwnerId:this.value,
        startTime:this.time[0],
        endTime:this.time[1],
        deviceIdList:this.deviceId==''?[]:this.deviceId!=null?[this.deviceId]:[],
        alarmTypeCodeList:this.alarmTypeId==''?[]:this.alarmTypeId!=null?[this.alarmTypeId]:[],
        handleStatus:this.handleStatus,
      }
      api
        .download_device_alarms(data,this.type)
        .then(res => {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' }) // res就是接口返回的文件流了
          let objectUrl = URL.createObjectURL(blob)
          var a = document.createElement('a')
          a.href = objectUrl
          let time = new Date()
          let y = time.getFullYear()
          let m = time.getMonth() + 1
          let d = time.getDate()
          let h = time.getHours() + 1 //获取当前小时数(0-23)
          let mm = time.getMinutes() + 1 //获取当前分钟数(0-59)
          let hh = time.getSeconds() + 1 //获取当前秒数(0-59)
          let name = '报警详情_'  + y + '' + m + '' + d + '' + h + '' + mm + '' + hh + '.xlsx'
          a.download = name
          a.click()
          window.URL.revokeObjectURL(objectUrl)
        })
        .catch(err => {
          this.$message.error(err.msg)
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

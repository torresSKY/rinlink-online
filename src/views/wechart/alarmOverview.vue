<template>
    <div id="alarmOverview" >
        <el-row :gutter="22">
            <el-col :span='24'>
                <el-row :gutter="22" style="margin-top:10px">
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
                          range-separator="-"
                          value-format="timestamp"
                          :start-placeholder="$t('table.startdata')"
                          :end-placeholder="$t('table.enddata')"
                          :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </el-col>
                    <el-col :span='3' style="line-height:38px">
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
                    <!-- <el-col :span='3'>
                        <el-input v-model="deviceIdList" :placeholder="$t('view.inputimei')" clearable></el-input>
                    </el-col> -->
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
                      <el-col :span='14'>
                        <el-autocomplete v-model="deviceIdInput" placeholder="请选择"  
                        :fetch-suggestions="querySearchAsync" @select="handleSelect"></el-autocomplete>
                      </el-col>
                    </el-col>
                    <el-col :span='2' style="line-height:40px">
                      <el-checkbox v-model="checked">{{$t('view.subordinate')}}</el-checkbox>
                    </el-col>
                    <el-col :span='4'>
                      <el-button class="butresh" @click="getlist(1)">{{$t('button.search')}}</el-button>
                      <!-- <el-button class="butadd" >{{$t('button.download')}}</el-button> -->
                    </el-col>
                </el-row>
                <el-row style="margin:10px 0">
                  <el-scrollbar style="height:66vh;" ref="scrollbar">
                    <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"   ></BaseTable>
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
        </el-row>
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
  name: "alarmOverview",
  components:{ BaseTable,Treeselect },
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      dateValue:'1',
      dateOptions:[
        { value: '1', label: '今天'},{ value: '2', label: '昨天'},
        { value: '3', label: '本周'},{ value: '4', label: '上周'},
        { value: '5', label: '本月'},{ value: '6', label: '上月'},
      ],
      time:[new Date(new Date().toLocaleDateString()).getTime(),new Date().getTime()],
      deviceIdList:null,
      deviceIdInput:null,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'nickname'
      },
      value:null,
      businessoptions:[],
      checked:false,
      loading:false,
      dataList: [],
      tableLabel: [
        {label: this.$t('table.Device'), prop: 'deviceName'},
        {label: this.$t('table.imei'), prop: 'deviceNumber'},
        {label: this.$t('table.model'), prop: 'deviceModelName'},
        // {label: this.$t('table.jinjiala'), prop: 'partner_contacts'},
        // {label: this.$t('table.chaosuala'), prop: 'partner_contacts'},
        // {label: this.$t('table.power1ala'), prop: 'partner_contacts'},
        // {label: this.$t('table.power2ala'), prop: 'partner_contacts'},
        // {label: this.$t('table.weiyiala'), prop: 'partner_contacts'},
        // {label: this.$t('table.alarm7'), prop: 'partner_contacts'}
      ],
      type:null,
      selStatus:1,
      selOptions:[
        { value: 1, label: '设备IMEI'}, 
        { value: 2, label: '设备名称'}
      ]
    }
  },
  mounted() {
    this.type = JSON.parse(sessionStorage['user']).userType
    
    this.getlist()
    this.getAlarmType()
    this.getBusiness()
    
  },
  methods: {
    getlist(type){ // 分页查询设备报警统计
      if(this.deviceIdList==null||this.deviceIdList==''){
        this.deviceIdList=null
      }
      let data = {
        pageSize: this.page.size,
        page: this.page.index - 1,
        deviceIdList:this.deviceIdList!==null?[this.deviceIdList]:[],
        childUserId:this.value,
        containsChildren:this.checked,
        startTime:null,
        endTime:null
      }
      if(type==1){
        this.page.index = 1
        data.page = 0
      }
      if(this.time&&(this.time[1]-this.time[0]>60*60*24*31*1000)){
        
        return this.$message.warning('只允许查询31天的数据')
      }
      if(this.time.length>0){
        data.startTime = this.time[0]
        data.endTime = this.time[1]
      }
      this.loading = true
      api.alarmStatistic(data,this.type).then(res => {
        this.loading = false
        this.dataList = res.data.content
        for(let i = 0;i<this.dataList.length;i++){
          if(this.dataList[i].statistic.length>0){
            for(let a = 0;a<this.dataList[i].statistic.length;a++){
              // debugger
              this.dataList[i][this.dataList[i].statistic[a].alarmTypeCode] = this.dataList[i].statistic[a].count
            }
          }
        }
        // console.log(this.dataList)
        this.page.total = res.data.totalElements
      }).catch(err => {
        this.loading = false
        this.dataList = []
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
        let data = []
        api.getAlarmType({headers: { 'Content-Type': 'application/json,charset=utf-8' }}).then(res => {
          if(res.success){
            // debugger
            data = Object.entries(res.data)
            for(let i =0;i<data.length;i++){
              this.tableLabel.push({label:data[i][1].name,prop:data[i][0],type:'clickPush',
                tableClick: (val,name) => {
                  this.showDialog('a', val,name)
                }})
                
            }
            console.log(this.tableLabel)
          }else{
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.$message.error(err.msg)
        })
    },
    querySearchAsync(queryString, cb) {
      console.log(queryString, cb)
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
      var deviceIdList = []
      api.getDevicesList(data,this.type).then(res => {
        // debugger
        if(res.success){
          // console.log(res)
          if(res.data.content.length>0){
            deviceIdList = res.data.content
            for(let i = 0;i<deviceIdList.length;i++){
              if(this.selStatus==1){
                deviceIdList[i]['value'] = deviceIdList[i].deviceNumber
              }else{
                deviceIdList[i]['value'] = deviceIdList[i].deviceName
              }
            }
            var results = queryString ? deviceIdList.filter(that.createStateFilter(queryString)) : deviceIdList
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
      this.deviceIdList = item.id
    },
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
      }
    },
    handleNodeClick(data) { // 选择用户节点
        console.log(data)
    },
    showDialog(index, data,name){ // 操作
      console.log(index, data,name)
      switch (index) {
        case 'a' : // 跳转指令信息
          data['name'] = name
          this.$emit('itemclick',data)
          break
      }
    }
  }
}
</script>
<style type="stylesheet/scss" lang="scss" scoped>
/deep/ .el-scrollbar__wrap {
overflow-x: hidden;
}
/deep/ .el-table::before{
  border-bottom: 1px solid #CCCCCC;
}
/deep/ .vue-treeselect__placeholder{
  line-height: 38px;
}
</style>

<template>
    <div >
        <el-row class="cust-title">
            <span>{{$t('route.Alarm')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-row>
                <el-col :span='3'>
                    <el-button class="butresh" @click="allHandle">{{$t('button.allHandle')}}</el-button>
                </el-col>
                <el-col :span='2' style="line-height:40px">
                    <el-checkbox v-model="containsChildren" @change="getlist(1)">{{$t('view.subordinate')}}</el-checkbox>
                </el-col>    
                <el-col :span='3'>
                    <el-button type="text" @click="selAlarmType">{{$t('button.sel')}}</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="22" style="margin:10px 0" >
              <el-scrollbar style="height:70vh;" ref="scrollbar">
                <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"   ></BaseTable>
              </el-scrollbar>
            </el-row>
            <el-pagination
                @current-change='changeindex'
                layout="total,prev, pager, next"
                :current-page.sync="page.index"
                :page-size="page.size"
                :total="page.total"
                background
                style="text-align:center">
            </el-pagination>
        </el-card> 
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
            <el-button v-if="!flag" @click="dialogHandle = false">{{$t('button.cancel')}}</el-button>
            <el-button v-if="!flag" type="primary" @click="confrimHandle">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>  
        <!-- 筛选报警类型 -->
        <el-dialog
          :title="$t('button.sel')"
          :visible.sync="dialogSel"
          width="30%" :before-close="handleClose">
          <el-row>
              <el-checkbox-group v-model="alarmTypeCodeList" >
                <el-checkbox v-for="item in alarmTypeList" :label="item[0]" :key="item[0]">{{item[1].name}}</el-checkbox>
              </el-checkbox-group>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="confrimSel">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>  
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import { mapState, mapGetters, mapActions } from "vuex"
    import BaseTable from '@/components/table'
    export default{
        name:'alarmNotice',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                height:800,
                dataList:[],
                tableLabel: [
                  // {label: this.$t('table.noticeContent'), prop: 'detail',
                  //   type: 'render',
                  //   formatter: (params) => {
                  //    for(let i = 0;i<this.alarmTypeList.length;i++){
                  //      if(params['alarmTypeCode']==this.alarmTypeList[i][0]){
                  //        params['alarmTypeStatus'] = this.alarmTypeList[i][1].name
                  //      }
                  //    }
                  //     params['detail'] = '设备 ' + params['deviceNumber'] + '(' + params['deviceName'] + ') 发生 '+ params['alarmTypeStatus'] +
                  //     '，定位地点为：' + params['alarmAddress']
                  //     return params
                  //   }
                  // },
                  {label: this.$t('table.Device'), prop: 'deviceName'},
                  {label: this.$t('table.imei'), prop: 'deviceNumber'},
                  {label: this.$t('table.alatype'), prop: 'alarmTypeStatus',type: 'render',
                    formatter: (params) => {
                      // console.log(params)
                      for(let i = 0;i<this.alarmTypeList.length;i++){
                        if(params['alarmTypeCode']==this.alarmTypeList[i][0]){
                          params['alarmTypeStatus'] = this.alarmTypeList[i][1].name
                        }
                      }
                      return params
                    }
                  },
                  {label: this.$t('table.alartime'), prop: 'alarmTime', type: 'Timestamp'},
                  {label: this.$t('table.alarmAddress'), prop: 'alarmAddress'},
                  {label: this.$t('table.count'), prop: 'handleName'},
                  // {label: this.$t('table.noticeTime'), prop: 'alarmTime', type: 'Timestamp'},
                  {label: this.$t('table.operation'),
                    type: 'clickChuli',
                    selectOperation: (index, row) => {
                      console.log(index, row)
                      this.showDialog(index, row)
                    },
                    // selectText: [
                    //   {command: '1', text: this.$t('table.chuli'), index: 1 ,status : 3},
                    //   {command: '2', text: this.$t('table.checkchuli'), index: 2 ,status : 3}
                    // ]  
                  }
                ],
                containsChildren:true,
                dialogHandle:false,
                radio:'1',
                remark:'',
                messageId:'',
                flag:false,
                alarmTypeCodeList:[],
                dialogSel:false,
                alarmTypeList:[],
                type:null
            }
        },
        mounted(){
          var that =this
          this.type = JSON.parse(sessionStorage['user']).userType
          this.getAlarmType()
          this.getlist()
          window.onresize = () => {
             return (() => {
                 that.height = document.body.offsetHeight-142
             })()
           }
           
        },
        methods:{
            ...mapActions(["setIsAlarm"]),
            getlist(item){ // 获取列表
                this.loading = true
                if(item==1){
                  this.page.index = 1
                }
                let data = {
                  pageSize: this.page.size,
                  page: this.page.index - 1,
                  alarmTypeCodeList:this.alarmTypeCodeList,
                  containsChildren: this.containsChildren,
                }
                api.getAlarmsDetail(data,this.type).then(res => {
                  this.loading = false
                  if(res.success){
                    this.dataList = res.data.content
                    this.page.total = res.data.totalElements
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
            getAlarmType(){ // 查询报警类型
                api.getAlarmType().then(res => {
                  if(res.success){
                    this.alarmTypeList = Object.entries(res.data)
                    // console.log(this.alarmTypeList)
                  }else{
                    this.alarmTypeList = []
                    this.$message.error(res.msg)
                  }
                  
                }).catch(err => {
                  this.alarmTypeList = []
                  this.$message.error(err.msg)
                })
            },
            handleClose(done) {
              this.alarmTypeCodeList = []
              done()
            },
            selAlarmType(){ // 筛选报警类型
                if(this.alarmTypeList.length<=0){
                   this.getAlarmType()
                }
                // this.alarmTypeCodeList = []
                this.dialogSel = true
            },
            confrimSel(){ // 确认筛选报警类型
                this.dialogSel = false
                this.getlist(1)
            },
            showDialog(index, data){ // 操作
                switch (index) {
                    case 1: // 处理
                      this.remark = ''
                      this.messageId = data.id
                      this.flag = false
                      this.dialogHandle = true
                      break
                    case 2: // 查看处理 
                      this.remark = data.handleRemark
                      this.flag = true
                      this.dialogHandle = true
                      break
                }
            },
            confrimHandle(){ // 确认单个处理
                let data = {
                  deviceAlarmId:this.messageId,
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
                  }
                  api.handleDeviceAlarms(this.type,id).then(res => {
                    if(res.success){
                      this.setIsAlarm(false)
                      // this.$router.go(0)
                      this.getlist()
                      this.$message.success(this.$t('message.alaedit'))
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
</style>
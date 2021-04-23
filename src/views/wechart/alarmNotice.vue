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
                <el-col :span='3' style="line-height:40px">
                    <el-checkbox v-model="containsChildren">{{$t('view.subordinate')}}</el-checkbox>
                </el-col>    
                <el-col :span='3'>
                    <el-button type="text" @click="selAlarmType">{{$t('button.sel')}}</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="22" style="margin-top:10px" >
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
          width="30%">
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
    import axios from 'axios'
    import BaseTable from '@/components/table'
    export default{
        name:'alarmNotice',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                height:1000,
                dataList:[],
                tableLabel: [
                  {label: this.$t('table.noticeContent'), prop: 'deviceNumber'},
                  {label: this.$t('table.count'), prop: 'handleName'},
                  {label: this.$t('table.noticeTime'), prop: 'alarmTime'},
                  {label: this.$t('table.operation'),
                    type: 'clickSelect',
                    selectOperation: (index, row) => {
                      this.showDialog(index, row)
                    },
                    selectText: [
                      {command: '1', text: this.$t('table.chuli'), index: 1},
                      {command: '2', text: this.$t('table.checkchuli'), index: 2}
                    ]  
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
                alarmTypeList:[]
            }
        },
        mounted(){
           this.height = document.body.offsetHeight-152
           this.getlist()
        },
        methods:{
            getlist(){ // 获取列表
                this.loading = true
                let data = {
                  pageSize: this.page.size,
                  page: this.page.index - 1,
                  alarmTypeCodeList:this.alarmTypeCodeList,
                  containsChildren: this.containsChildren,
                }
                api.getAlarmsDetail(data).then(res => {
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
            getAlarmType(){ // 查询报警类型
                api.getAlarmType().then(res => {
                  if(res.msg=='OK'){
                    this.alarmTypeList = Object.entries(res.data)
                    console.log(this.alarmTypeList)
                  }else{
                    this.alarmTypeList = []
                    this.$message.error(res.errMsg)
                  }
                  
                }).catch(err => {
                  this.alarmTypeList = []
                  this.$message.error(err.errMsg)
                })
            },
            selAlarmType(){ // 筛选报警类型
                if(this.alarmTypeList.length<=0){
                   this.getAlarmType()
                }
                this.dialogSel = true
            },
            confrimSel(){ // 确认筛选报警类型
                this.dialogSel = false
                this.getlist()
            },
            showDialog(index, data){ // 操作
                switch (index) {
                    case '1': // 处理
                      this.remark = ''
                      this.messageId = data.deviceId
                      this.flag = false
                      this.dialogHandle = true
                      break
                    case '2': // 查看处理 
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
<template>
    <div>
        <el-row>
            <el-card :style="{height: height + 'px',overflow:'auto',background:'#ccc'}">
                <div slot="header" class="clearfix">
                  <span>{{$t('route.tongji')}}</span>
                </div>
                <el-card>
                <el-row :gutter="20">
                    <el-col :span="4">
                        <el-input clearable v-model="imei" :placeholder="$t('view.inputimei')"></el-input>
                    </el-col>
                    <el-col :span="3" >
                        <el-select v-model="timetype">
                            <el-option value="date" :label="$t('table.day')"></el-option>
                            <el-option value="month" :label="$t('table.mounth')"></el-option>
                            <el-option value="year" :label="$t('table.year')"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker v-model="date1" :type="timetype" value-format="timestamp" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <!-- <el-date-picker v-model="starttime" type="daterange" range-separator="至" :start-placeholder="$t('table.startdata')" :end-placeholder="$t('table.enddata')" value-format="timestamp">
                        </el-date-picker> -->
                        <el-date-picker v-model="date2" :type="timetype" value-format="timestamp" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button class="butsearch" @click="getdata()">{{$t('button.search')}}</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button class="butdown" @click="dwonData">{{$t('button.download')}}</el-button>
                    </el-col>
                </el-row>
                
                <el-row class="type">
                    <el-col :span="2">
                        <label>{{$t('table.alatype')}}：</label>
                    </el-col>
                    <el-col :span="20">
                        <el-radio-group v-model="alarmType" @change="changealarmType">
                            <el-radio v-for='item in alatypelist' :value='item.value' :label="item.value" :key='item.value'>{{item.name}}</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <div id="chart" style="height:300px"></div>
            </el-card>
            <el-card style="margin-top:20px">
                <div class="table">
                    <div class="list-title">
                        <h3>{{$t('view.dataxi')}}</h3>
                    </div>
                    <el-table class="particular-table" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}" :row-class-name="tableRowClassName" v-loading="loading" :data="list" border style="width:100%" max-height="500">
                        <el-table-column align='center' prop="imei" :label="$t('table.imei')"> </el-table-column>
                            <el-table-column align='center' prop="deviceName" :label="$t('table.Device')"> </el-table-column>
                            <el-table-column align='center'  prop="lastWAt" :label="$t('table.Update')"> </el-table-column>
                            <el-table-column align='center' prop="alarmType" :label="$t('table.alarmrecord')">
                                <template slot-scope="scope">
                                {{scope.row.alarmType == 1 ? $t('table.powerala'):scope.row.alarmType == 5?$t('table.lightala'):scope.row.alarmType == 3?$t('table.sosala'):scope.row.alarmType == 4?$t('table.dropala'):scope.row.alarmType == 2?$t('table.moveala')
                                :scope.row.alarmType == 6?$t('table.vibala'):scope.row.alarmType == 7?$t('table.disala'):scope.row.alarmType == 8?$t('table.smokeala'):scope.row.alarmType == 9?$t('table.gasala'):
                                scope.row.alarmType == 10?$t('table.temalarm'):scope.row.alarmType == 11?$t('table.humalarm'):scope.row.alarmType == 12?$t('table.out'):scope.row.alarmType == 13?$t('table.in'):''}}
                                </template>
                            </el-table-column>
                             <el-table-column align='center' prop="" :label="$t('table.operation')" style="width:50px;">
                                <template slot-scope="scope">
                                    <el-button style="width:100px;" type="primary" @click='editstate(scope.row)' :disabled='scope.row.isProcess == 0? false : true'>{{scope.row.isProcess == 0?$t('table.chuli') : $t('table.pastcl')}}</el-button>
                                </template>
                        </el-table-column>
                    </el-table>
                 <el-pagination
                    @current-change="changeindex"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    layout="total, prev, pager, next ,jumper"
                    :total="page.total"
                    background
                    style="text-align:center">
                </el-pagination>
                </div>
            </el-card>

                <el-dialog :title="$t('table.alatitle')" :visible.sync="showCl" width="20%">
                    <el-radio v-model="radio" label="1">{{$t('table.chuli')}}</el-radio>
                    <el-radio v-model="radio" label="2">{{$t('table.errorcl')}}</el-radio>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showCl = false">{{$t('button.cancel')}}</el-button>
                    <el-button type="primary" @click="editstate()">{{$t('button.determine')}}</el-button>
                </div>
                </el-dialog>
            </el-card>
        </el-row>
    </div>
</template>
<script>
import api from '@/api/wechart'
import mixins from '@/mixins'
import { formatDate } from '@/plugins/date.js' 
export default {
    name: 'Alastatistics',
    mixins:[mixins],
    data() {
        return {
            loading: true,
            pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now();
                }
            },
             checkAll: false,
             alarmType: 1,
             alarmTypelist:  [
                 {lable:this.$t('table.powerala'),value:1,},
                 {lable:this.$t('table.moveala'),value:2,},
                 {lable:this.$t('table.sosala'),value:3,},
                 {lable:this.$t('table.dropala'),value:4,},
                 {lable:this.$t('table.lightala'),value:5,},
                 {lable:this.$t('table.vibala'),value:6,},
                 {lable:this.$t('table.disala'),value:7,},
                 {lable:this.$t('table.smokeala'),value:8,},
                 {lable:this.$t('table.gasala'),value:9,},
                 {lable:this.$t('table.temalarm'),value:10,},
                 {lable:this.$t('table.humalarm'),value:11}],
             isIndeterminate: true,
             statisticsTyep: [{lable:'日',value:3,},{lable:'月',value:1,},{lable:'年',value:0,}],
             radio: 3,
             imei: '',
             height: 1000,
             list:[],
             showCl: false,
             timetype: 'date',
             stattype: 3,
             date1: new Date().getTime() - 30*24*60*60*1000,
             date2:new Date().getTime(),
             value1: '',
             geshi: 'timestamp',
             namemess: this.$t('table.alertmess'),
             yname:this.$t('view.ci'),
             xname:this.$t('table.alertmess'),
             lanage: this.$i18n.locale
        }
    },
    watch: {
      lanage: {
        handler(newName,oldName) {
           this.getchart()
        }
    }
   },
    mounted () {
        this.height = document.body.offsetHeight - 62;
        this.getdata()
    },
    methods: {
        getdatageshi (val) {
            if(this.timetype == 'date'){
                this.stattype = 2
            }else if(this.timetype == 'month'){
                this.stattype = 1
                let a = (24*60*60-1)*1000
                let b =this.date2 - 1000*60*60*24
                this.date2 = a+b
            }else{
                this.stattype = 0
                let a = (24*60*60-1)*1000
                let b = new Date(new Date(this.date2).getFullYear(),12,0).getTime()
                this.date2 = a+b
            }
        },
        getdata() {
            if(this.date1 > this.date2){
                this.$message.warning(this.$t('table.timeerror'))
                return
            }
            this.getdatageshi()
            api.getMessageCount({
                params:{
                statisticsTyep: this.stattype,
                alarmType: this.alarmType,
                bginTime: this.date1,
                endTime: this.date2,
                imei: this.imei
                }
            }).then(res => {
                this.loading = false
                this.list = res
                this.getList()
                this.getchart()
            }).catch(err => {
                this.$message.error(err.message)
            })
            
        },
    getList(){
        let data = {}
        if(this.imei){
            data = {
                imei: this.imei,
                type: this.alarmType,
                bginTime: this.date1,
                endTime: this.date2,
                pageSize:this.page.size,
                pageNo:this.page.index-1,
            }
        }else{
            data = {
                type: this.alarmType,
                bginTime: this.date1,
                endTime: this.date2,
                pageSize:this.page.size,
                pageNo:this.page.index-1,
            }
        }
        api.getMessageListPagination({
                params:data
            }).then(res=>{
                if(res.content.length > 0){
                //  let arr = res.content
                //  let a = []
                //    for(let i = 0;i<arr.length;i++){
                //      this.getaddress(arr[i])
                //      this.adddizhi.then(res => {
                //      a.push(res)
                //      this.list = a.sort(function(a,b){
                //         return a.collectAt < b.collectAt ? 1 : -1
                //      })
                //      }).catch(err => {
                //      this.list.push(res)
                //      })
                //     }
                this.list = res.content
                    this.loading = false
                    this.page.total = res.total
                 }else{
                    this.$message.error(this.$t('table.temporarily'))
                    this.page.total = 0
                }
        }).catch(err=>{
          this.$message.error(err.message)
        })
    },
    getaddress (val) {
      var myGeo = new BMap.Geocoder();      
      // 根据坐标得到地址描述  
      return this.adddizhi = new Promise( function(resolve, reject){
        myGeo.getLocation(new BMap.Point(val.lng, val.lat), function(result){
          if (result){
            if(result.address ){
              val['address'] = result.address 
              resolve( val );
            }else{
              val['address'] = '--'
              resolve( val );
            }
          }else{
              val['address'] = '--'
             reject(val);
          }
        })
      })
    },
    dwonData() {
        this.getdatageshi()
        api.getMessageDown({
            params:{statisticsTyep: this.stattype,
            alarmType: this.alarmType,
            bginTime: this.date1,
            endTime: this.date2,
            imei: this.imei,
            },
            headers: { 'Content-Type': 'application/json,charset=utf-8'},    
            responseType: 'arraybuffer'}
        ).then(res => {
            let blob = new Blob([res], {type: "application/vnd.ms-excel"});  // res就是接口返回的文件流了
            let objectUrl = URL.createObjectURL(blob); 
            var a = document.createElement('a');
            a.href = objectUrl;
            let time = new Date()
            let y = time.getFullYear()
            let m = time.getMonth() + 1
            let d = time.getDate()
            let h = time.getHours() + 1; //获取当前小时数(0-23)
            let mm = time.getMinutes() + 1; //获取当前分钟数(0-59)
            let hh = time.getSeconds() + 1; //获取当前秒数(0-59)
            let name = this.$t('route.tongji') + y+''+m+''+d+''+h+''+mm+''+hh+'.xls'
            a.download = name;
            a.click()
            window.URL.revokeObjectURL(objectUrl);
        }).catch(err => {
            this.$message.error(err.message)
        })
    },
      handleCheckAllChange(val) {
        this.alarmType = val ? alarmTypelist : [];
        this.isIndeterminate = false;
      },
      getchart() {
        var that = this;
        let xaxis = []
        let yaxis = []
        let unit = ''
        for(let i = 0;i < this.list.length;i ++){
            xaxis.push(this.list[i]._id)
            yaxis.push(this.list[i].count)
        }
        if(this.timetype == 'year'){
            unit = '年'
        }else if(this.timetype == 'month'){
            unit = '月'
        }else if(this.timetype == 'date'){
            unit = '日'
        }
        var myChart = this.echarts.init(document.getElementById("chart"));
        // 绘制图表
        myChart.setOption({
             color: ['#4cabce'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : xaxis,
                    name : unit ,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    minInterval : 1,
                    type : 'value',
                    name : '次'
                }
            ],
            series : [
                {
                    name: this.namemess,
                    type:'bar',
                    barWidth: '60%',
                    data:yaxis
                }
            ]
        });
      },
      changealarmType(val) {
          this.alarmType = val
          this.getdata()
      },
      changestatTyep (val) {
          this.radio = val
          this.getdata()
      },
    showState(data) {
      this.showCl = true
      this.row = data
    },
    editstate(){
      api.getalastate(this.row.id,this.radio * 1).then(res => {
        this.$message.success(this.$t('message.changesuc'))
        this.showCl = false
        this.getList()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    editstate(val){  //处理报警信息
            console.log(val)
            this.$confirm(this.$t('message.alachuli'), this.$t('message.newtitle'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.cancel'),
                type: "warning"
            }).then(_ => {
                api.getMessageChuli(val.id).then(res => {
                    this.$message.success(this.$t('message.changesuc'))
                    this.getList(0)
                }).catch(err => {
                    this.$message.error(err.message)
                })
            }).catch(_ => {});
    },
    }
}
</script>
<style scoped>
.type{
    margin: 20px;
    text-align: left;
}
#chart{
    width: 800px;
    height: 800px;
    margin: 0 10%;
}
.list-title{
    border-bottom: 1px solid #797676;
    text-align: left;
    padding: 10px;
    margin: 10px;
}
/* .list-title h3{
    width: 125px;
    border-right: 3px solid #41802c;
} */
.el-radio{
    width: 15%;
}
</style>
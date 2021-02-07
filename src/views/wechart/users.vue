<template>
  <div id="users" :style="{minWidth:main_width*0.5 + 'px',overflow: 'hidden'}">
    <el-row :gutter="20" class="title">
        <!-- <el-col :span="6">
            <el-card shadow="hover" @click.native="sendto(0)">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span style="color:#9a5ce0" class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">{{$t('view.homeall')}}</p>
                        <count-to :start-val="0" :end-val="userNum" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover" @click.native="sendto(0)">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span style="color:#00d6e7" class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">{{$t('view.homeon')}}</p>
                        <count-to :start-val="0" :end-val="userNumt" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover" @click.native="sendto(0)">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span style="color:#ff8096" class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">{{$t('view.homeoff')}}</p>
                        <count-to :start-val="0" :end-val="userNumo" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card shadow="hover" @click.native="sendto(1)">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <span style="color:#ffb200" class="icon iconfont icon-mobancaidan"></span>
                    </el-col>
                    <el-col :span="18">
                        <p class="title_name">{{$t('view.homeala')}}</p>
                        <count-to :start-val="0" :end-val="userNumty" :duration="2600" class="title_num"/>
                    </el-col>
                </el-row>
            </el-card>
        </el-col> -->
        <el-col :span="11">
            <div style="background:#001832;padding:10px;height:402px">
                <div class="header">
                        {{$t('table.count')}}
                        <span @click="moreTongji()">
                            <el-link type="primary" style="float:right">{{$t('button.more')}}<i class="el-icon-d-arrow-right"></i></el-link>
                        </span>
                </div>
                <el-radio-group v-model="radio" @change="getalacount">
                    <el-radio style="color:#fff" value="3" :label="2">{{$t('table.Day')}}</el-radio>
                    <el-radio style="color:#fff" value="1" :label="1">{{$t('table.Mounth')}}</el-radio>
                    <el-radio style="color:#fff" value="0" :label="0">{{$t('table.Year')}}</el-radio>
                  </el-radio-group>
                <div id="chart" :style="{height:'300px',width: main_width*0.4+ 'px'}"></div>
            </div>
            <div style="background:#001832;margin-top:20px;padding:10px"  :style="{minWidth:main_width*0.3 + 'px'}">
                <div class="header">
                       {{$t('route.Alarm')}}
                        <span @click="moreAla()">
                            <el-link type="primary" style="float:right">{{$t('button.more')}}<i class="el-icon-d-arrow-right"></i></el-link>
                        </span>
                </div>
                <el-scrollbar style="height:285px;overflow-x: hidden;" ref="scroll">
                    <el-table :data="alalist2" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :style="{minWidth:main_width*0.4 + 'px',background:'#001832'}" style="overflow-y: auto;" :row-style="rowStyle" :header-cell-style="rowStyle">
                        <el-table-column  align='center' prop="deviceName" :label="$t('table.Device')" show-overflow-tooltip></el-table-column>
                        <el-table-column  align='center' prop="imei" :label="$t('table.imei')" show-overflow-tooltip></el-table-column>
                        <el-table-column  align='center' prop="lastWAt" :label="$t('table.alartime')" show-overflow-tooltip></el-table-column>
                        <el-table-column align='center' prop="alarmType" :label="$t('table.alarmrecord')">
                            <template slot-scope="scope">
                            {{scope.row.alarmType | alatype}}
                            </template>
                        </el-table-column>
                        <el-table-column  align='center' :label="$t('table.operation')" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-button size="mini" @click="openEditstate(scope.row)" style="background:none;border:none;color:#0066c3;font-size: 16px;">{{$t('table.chuli')}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>
            </div>
        </el-col>
        <el-col :span="13" v-loading="loading" >
            <div id="map" ></div>
        </el-col>
    </el-row>
      <el-dialog title="报警处理" :visible.sync="showCl" width="20%">
        <el-row :gutter="10">
          <el-col :span='6'>
            <span>处理状态:</span>
          </el-col>
          <el-col :span='16'>
            <el-radio v-model="radio1" label="1">{{$t('table.chuli')}}</el-radio>
           <el-radio v-model="radio1" label="2">误报</el-radio>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top:10px">
          <el-col :span='6'>
            <span>处理说明:</span>
          </el-col>
          <el-col :span='16'>
            <el-input type="textarea"  :rows="2"  :placeholder="$t('view.inputtext')"  v-model="textarea"></el-input>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showCl = false">{{$t('button.cancel')}}</el-button>
          <el-button type="primary" @click="editstate()">{{$t('button.determine')}}</el-button>
        </div>
      </el-dialog>       
  </div>
</template>

<script>
import api from '@/api/wechart'
import CountTo from 'vue-count-to'
import mixin from '@/mixins/index'
import { mapGetters} from "vuex"
import {alatype} from '@/plugins/filter.js'
export default {
    name: 'users',
    mixins:[mixin],
    components:{
        CountTo
    },
    data() {
        selected:0;
        return {
            rowStyle: {background:'#001832'},
            height:1000,
            userNum:200,
            userNumt:150,
            userNumo:30,
            userNumty:0,
            alalist: [],
            listLoading: true,
            alacount: null,
            radio: 2,
            main_width: 0,
            alalist2: [],
            loading: true,
            myChart: null,
             showCl: false,
             radio1:'1',
             textarea:'',
             row:null,
        }
    },
    watch: {
        lang (newVal) {
            if(this.myChart != null){
                this.getalacount()
            }
        }
    },
    computed: {
    ...mapGetters(['lang'])
    },
    mounted() {
        this.height=document.body.offsetHeight-150
        this.main_width = document.body.offsetWidth - 236 // 可视区域的宽度 - 左侧导航栏的宽度
        this.getList()
        this.getEquList()
        this.getala()
        this.getalacount()
        // this.getUserListt()
        // this.getUserListo()
        // this.getUserListty()
    },
    beforeDestroy() {
        window.removeEventListener('resize', function(){
            if(this.myChart != null){
                this.myChart.resize()
            }
        })
    },
    methods: {
        getEquList(){
            api.getUserEqu(this.$store.getters.usercode).then(res=>{
                this.userNum=res.total
                this.userNumo = res.offlineTotal
                this.userNumt = res.onlineTotal
            }).catch(err=>{

            })
        },
        getUserListt(){
            api.getUserCounts({day:3}).then(res=>{
                this.userNumt=res.active
            }).catch(err=>{

            })
        },
        getUserListo(){
            api.getUserCounts({day:30}).then(res=>{
                this.userNumo=res.active
            }).catch(err=>{

            })
        },
        getUserListty(){
            api.getUserCounts({day:90}).then(res=>{
                this.userNumty=res.active
            }).catch(err=>{

            })
        },
        setMap() {
            this.loading = false
    		this.map = new BMap.Map("map",{ enableMapClick: false });
	        this.map.centerAndZoom(new BMap.Point(110.404, 28.915), 5);
            this.map.enableScrollWheelZoom(true);
            this.map.enableAutoResize()
            // 3.0版本样式：但是这个发布的样式ID需要在申请AK秘钥的账号下发布
            this.map.setMapStyleV2({
                styleId: 'dd014efdbb6eadad2cceaa52401c1773'
            })
       	    var MAX = 10;
	        var markers = [];
            var pt = null;
            var arr = this.list
	        for (let i = 0; i < arr.length; i++) {
	           pt = new BMap.Point(arr[i].lon, arr[i].lat);
	           markers.push(new BMap.Marker(pt));
	        }
      	   //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
      	   var markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers:markers});
        //    this.map.addEventListener("click", function(e){
        //        console.log('地图点击事件',e)
        //    });
        },
        getList() {
          var that = this
          let userId = sessionStorage.getItem('userID')
          api.getall().then(res=>{
            this.list = res
            this.setMap(); // 加载地图和相关组件
          }).catch(err =>{
            this.$message.error(err.message)
          })
        },
        getEqunumber () {
            api.getUserEqu(this.$store.getters.usercode).then(res=>{
                this.allNum=res.total
                this.outlineNumt = res.offlineTotal
                this.onlineNumo = res.onlineTotal
                this.warrNum = res.alarmTotal
            }).catch(err=>{
                this.$message.error(err.message)
            })
        },
        sendto(val) {
            if(val == 0){
                this.$router.push('/wechart/jihuo')
            }else{
                this.$router.push('/Message/policeMessage')
            }
        },
        getala() {
            let data = {params:{
                    pageSize:50,
                    pageNo:0}}
            api.getMessageListPagination(data).then(res=>{
                    if(res.content.length==0){
                        this.$message.error(this.$t('table.alarno'));
                    }
                    // for (let i in res.content) {
                    //     if (res.content[i].status === 0) {
                    //         this.alalist.push(res.content[i])
                    //     }
                    // }
                    this.listLoading=false
                    this.alalist=res.content.filter((item)=>{return item.status==0})
                    this.alalist2 = this.alalist.slice(0,5)
                    this.page.total=res.total
                }).catch(err=>{
                    this.listLoading=false
                    this.$message({
                        type: 'error',
                        message: _.message
                    });
                })
        },
        getalacount() {
            let a = (new Date()).toLocaleDateString()
            let endtime = (new Date(a)).getTime()
            let starttime = endtime - 30*24*60*60*1000
            api.getMessageCount({params:{
                startTime:starttime,
                endTime: endtime,
                statisticsTyep: this.radio,}}).then(res => {
                    this.alacount = res
                    this.getcharts()
                }).catch(err => {})
        },
        getcharts() {
            let datax = []
            let datay = []
            let xname = this.$t('table.Day')
            for(let i = 0;i<this.alacount.length;i++){
                 datax.push(this.alacount[i]._id)
                 datay.push(this.alacount[i].count)
            }
            if(this.radio == 3){
                xname = this.$t('table.Day')
            }else if(this.radio == 1){
                xname = this.$t('table.Mounth')
            }else if(this.radio == 0){
                xname = this.$t('table.Year')
            }
            let yname = this.$t('table.ci')
            this.myChart = this.$echarts.init(document.getElementById("chart"));
            
            console.log('huatututu')
            // 绘制图表
            this.myChart.setOption({
                backgroundColor: '#001832',
                color: ['#0083c3'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    orient: 'vertical',
                    selectedMode: false, // 禁用legend图标点击
                    // mouseover: true,
                    clickable: true,

                    x: '0px',
                    y: '20px',
                    //   data: legendData,
                    // data: [this.$t('view.devTotal'), this.$t('view.off'), this.$t('view.online')],
                    // legend文字样式
                    textStyle: {
                        fontSize: 15,
                        color: '#fff'
                    }
                },
                grid: {
                    left: '3%',
                    right: '60px',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : datax,
                        name : xname,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1, //这里是为了突出显示加上的  
                          }
                        },
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name : yname,
                        axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1, //这里是为了突出显示加上的  
                          }
                        },
                    }
                ],
                series : [
                    {
                        // name: this.namemess,
                        type:'bar',
                        barWidth: '60%',
                        data:datay
                    }
                ]
            },true);
        },
        openEditstate(data){
            this.textarea = ''
            this.radio1 = '1'
            this.showCl = true
            this.row = data
        },
        editstate(){  //处理报警信息
            let a = null
            for(let i =0;i<6;i++) {
                if(this.alalist[i].id == this.row.id){
                a = i
                break
                }
            }
            let data = {}
             data.ids = [this.row.id]
            data.status = Number(this.radio1)
            data.handleExplain = this.textarea
        api
          .getMessageChuli(data)
          .then(res => {
            this.$message.success(this.$t('message.alaedit'))
            this.showCl = false
            this.alalist.splice(a,1)
            this.alalist2 = this.alalist.slice(0,5)
          })
          .catch(err => {
            this.$message.error(err.message)
          })
            // this.$confirm(this.$t('message.alachuli'), this.$t('message.newtitle'), {
            //     confirmButtonText: this.$t('button.determine'),
            //     cancelButtonText: this.$t('button.cancel'),
            //     type: "warning"
            // }).then(_ => {
            //     api.getMessageChuli(val.id).then(res => {
            //         this.$message.success(this.$t('message.alaedit'))
            //         this.alalist.splice(a,1)
            //         this.alalist2 = this.alalist.slice(0,5)
            //     }).catch(err => {
            //         this.$message.error(err.message)
            //     })
            // }).catch(_ => {});
        },
        moreAla(){
            this.$router.push({name:'route.showala',})
        },
        moreTongji(){
            this.$router.push({name:'route.tongji',})
        }
    },
  // 过滤器格式化时间戳
  filters: {
    //  时间格式自定义 只需把字符串里面的改成自己所需的格式
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    alatype(val){
      return alatype(val)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#users{
    background: #12191f;
    padding: 20px 20px 40px 20px;
    // height: 100%;
}
  #users {
    .title{
        cursor: pointer;
        margin-bottom: 20px;
        .icon-mobancaidan{
            color: #666;
        }
        .title_name{
            color: #666;
        }
        .title_num{
            font-weight: 600;
            color: #666;
        }
        #chart{
            width:100%;
            height:300px;
        }
    }
    #map {
       width: 100%;
       height: 84vh;
    }
    .header{
        height: 50px;
        line-height: 50px;
        border-radius: 5px;
        background: #1f304c;
        color: #fff;
        font-weight: bold;
        padding-left: 10px;
        margin-bottom: 20px;
    }
    .header text{
        color: #fff;
    }
  }
  /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }
  /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #0f223b;
        color: #fff;
    }
    // 更改el-table行高（实际上是上下padding值）
    /deep/.el-table tr td {
        padding: 8px 0px;
    }
    /deep/.el-table{
        color: #fff !important;
    }
    /deep/.el-table .cell {
        line-height: 25px;
    }

    /deep/.el-table .el-table__header-wrapper .el-table__header .has-gutter tr {
        height: 40px !important;
    }
    /deep/.el-table__empty-text {
        background:#001832;
    }
    
</style>
<style rel="stylesheet/scss" lang="scss">
    @media screen and (min-width: 1400px) {
        #users {
            .title{
                .icon-mobancaidan{
                    font-size:60px;
                }
                .title_name{
                    font-size: 16px;
                }
                .title_num{
                    font-size: 30px;
                }
            }
        }
    }
    @media (min-width: 1260px) and (max-width: 1400px) {
        #users {
            .title{
                .icon-mobancaidan{
                    font-size:50px;
                }
                .title_name{
                    font-size: 16px;
                }
                .title_num{
                    font-size: 30px;
                }
            }
        }
    }
    @media (min-width: 1048px) and (max-width: 1260px) {
        #users {
            .title{
                .icon-mobancaidan{
                    font-size:40px;
                }
                .title_name{
                    font-size: 15px;
                }
                .title_num{
                    font-size: 30px;
                }
                .el-card__body{
                    padding:20px 10px;
                }
            }
        }
    }
    @media screen and (max-width: 1048px) {
        #users {
            .title{
                .icon-mobancaidan{
                    font-size:30px;
                }
                .title_name{
                    font-size: 14px;
                }
                .title_num{
                    font-size: 30px;
                }
                .el-card__body{
                    padding:20px 5px;
                }
            }
        }
    }
</style>

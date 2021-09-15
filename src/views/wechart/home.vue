<template>
    <div id="users">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-scrollbar :native="false">
                <div class="info_container_1" style="min-width: 300px;min-height: 160px">
                    <div class="userInfo">
                        <div class="userInfo_left">
                            <img src="../../assets/img/deafult_user_head_portrait.png" alt="" />
                            <div @click="evt_pay">平台服务充值</div>
                        </div>
                        <div class="userInfo_right">
                            <div class="userInfo_right_text">账号：{{userInfo.username}}</div>
                            <div class="userInfo_right_text">客户类型：{{user_sort[user_type]}}</div>
                            <div class="userInfo_right_text">电话：{{userInfo.phoneNumber}}</div>
                            <div v-if="userType_parameter == 2" class="userInfo_right_text userInfo_right_check">
                                <el-checkbox v-model="checked" @change="evt_containsChildren"></el-checkbox>
                                <span>包含下级数据统计</span>
                            </div>
                        </div>
                    </div>
                </div>
                </el-scrollbar>
            </el-col>
            <el-col :span="12">
                <el-scrollbar :native="false">
                <div class="info_container_1" style="min-width: 660px;min-height: 160px">
                    <div class="inventoryInfo" v-loading="loading_one">
                        <div class="inventoryInfo_top">
                            <div>库存统计</div>
                            <img @click="evt_refresh" data-type="1" src="../../assets/img/refresh.png" alt="" />
                        </div>
                        <div class="inventoryInfo_bottom">
                            <div class="inventoryInfo_item">
                                <img src="../../assets/img/device_total.png" alt="">
                                <div class="inventoryInfo_item_right">
                                    <div>
                                        <span>{{total_device}}</span>
                                        <span>台</span>
                                    </div>
                                    <div>设备总数</div>
                                </div>
                            </div>
                            <div class="inventoryInfo_item">
                                <img src="../../assets/img/inventory_icon.png" alt="">
                                <div class="inventoryInfo_item_right">
                                    <div class="inventoryInfo_item_inventory">
                                        <span>{{Inventory_deviceCount}}</span>
                                        <span>台</span>
                                    </div>
                                    <div>库存</div>
                                </div>
                            </div>
                            <div class="inventoryInfo_item">
                                <img src="../../assets/img/sell_icon.png" alt="">
                                <div class="inventoryInfo_item_right">
                                    <div class="inventoryInfo_item_sell">
                                        <span>{{Sold_deviceCount}}</span>
                                        <span>台</span>
                                    </div>
                                    <div>已销售</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </el-scrollbar>
            </el-col>
            <el-col :span="6">
                <el-scrollbar :native="false">
                <div class="info_container_1" style="min-width: 300px;min-height: 160px">
                    <div class="trackInfo">
                        <div class="track_top">轨迹信息</div>
                        <div class="track_bottom">
                            <div class="track_bottom_top">
                                <el-input placeholder="请输入设备号" size="small" v-model="search_word"></el-input>
                                <div class="track_info_top_tab" v-if="search_result.length > 0">
                                    <el-table @row-click="evt_row_click" size="mini" :data="search_result" style="width:100%" :show-header="false">
                                        <el-table-column prop="deviceNumber"></el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <div class="track_bottom_bottom">
                                <el-button @click="evt_nav('track')" size="small" class="track_info_btn_bt">查看轨迹</el-button>
                                <el-button @click="evt_nav('trace')" size="small" class="track_info_btn_bt">追踪</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                </el-scrollbar>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="8">
                <div class="echarts_container" v-loading="loading_four">
                    <div class="echarts_top">
                        <div>设备期限</div>
                        <img @click="evt_refresh" data-type="4" src="../../assets/img/refresh.png" alt="" />
                    </div>
                    <el-scrollbar :native="false">
                        <div class="echarts_content" id="myChart4"></div>
                    </el-scrollbar>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="echarts_container" v-loading="loading_three">
                    <div class="echarts_top">
                        <div>激活统计</div>
                        <img @click="evt_refresh" data-type="3" src="../../assets/img/refresh.png" alt="" />
                    </div>
                    <el-scrollbar :native="false">
                        <div class="echarts_content" id="myChart3"></div>
                    </el-scrollbar>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="echarts_container" v-loading="loading_two">
                    <div class="echarts_top">
                        <div>设备状态统计</div>
                        <img @click="evt_refresh" data-type="2" src="../../assets/img/refresh.png" alt="" />
                    </div>
                    <el-scrollbar :native="false">
                        <div class="echarts_content" id="myChart2"></div>
                    </el-scrollbar>
                </div>
            </el-col>
        </el-row>
        <el-row style="margin-top: 20px;">
            <el-col :span="24">
                <div class="statistics" v-loading="loading_brokenLine">
                    <div class="statistics_top">
                        <div class="statistics_top_left">
                            <div>设备激活统计</div>
                            <div>
                                <el-radio-group v-model="tabPosition" size="mini" @change="evt_changeRadio">
                                    <el-radio-button label="year">年</el-radio-button>
                                    <el-radio-button label="month">月</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div>
                                <!-- 解决使用type切换类型的样式错乱问题 -->
                                <el-date-picker
                                    v-show="tabPosition == 'month'"
                                    size="mini"
                                    :clearable="false"
                                    v-model="start_time"
                                    type="month"
                                    value-format="timestamp"
                                    :editable="false"
                                    @change="evt_changeTime">
                                </el-date-picker>

                                <el-date-picker
                                    v-show="tabPosition == 'year'"
                                    size="mini"
                                    :clearable="false"
                                    v-model="start_time"
                                    type="year"
                                    value-format="timestamp"
                                    :editable="false"
                                    @change="evt_changeTime">
                                </el-date-picker>
                            </div>
                            
                        </div>
                        <div class="statistics_top_right">{{activate_value}}共有<span>{{total_activate}}</span>台设备激活</div>
                    </div>
                    <div class="statistics_bottom">
                        <el-scrollbar :native="false">
                            <div id="brokenLine"></div>
                        </el-scrollbar>
                    </div>
                </div>
            </el-col>
        </el-row>
        <dialog-recharge ref="dialogRecharge" :list="rechargeList"/>
    </div>
</template>
<script>
import api from "@/api/wechart";
import CountTo from "vue-count-to";
import mixin from "@/mixins/index";
import { mapGetters } from "vuex";
import { alatype } from "@/plugins/filter.js";
import * as echarts from "echarts";
import dialogRecharge from './dialogRecharge.vue'
export default {
    name: "users",
    mixins: [mixin],
    components: {
        CountTo,
        dialogRecharge
    },
    data() {
        return {
            checked: true,//选择是否包含下级统计数据
            option: {
                title: {
                    zlevel: 0,
                    textStyle: {
                        rich: {
                            value: {
                                color: '#333333',
                                fontSize: 18,
                                fontWeight: 'bold',
                                lineHeight: 24,
                            },
                            name: {
                                color: '#999999',
                                fontSize: 12,
                                lineHeight: 12
                            },
                        },
                    },
                    textAlign: "center",
                    top: 'center',
                    left: '39%'
                },
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    orient: 'vertical',
                    right:'5%',
                    top:'bottom',
                    itemWidth: 10,
                    itemHeight: 10
                },
                series: [
                {
                    type: "pie",
                    radius: ["50%", "80%"],
                    right:'20%',
                    label:{
                        show: false,
                        formatter:'{b}: {c}'
                    },
                    labelLine: {
                        show:false,
                    },
                },
                ],
            },
            echarts_1: null,
            echarts_2: null,
            echarts_3: null,
            echarts_4: null,
            OnlineDviceCount:0,//在线设备
            OfflineDeviceCount:0,//离线设备
            ActivatedCount:0,//激活设备
            Unactivated_deviceCount:0,//未激活设备
            Using_deviceCount:0,//正在使用中设备
            Unexpired_deviceCount:0,//未过期设备
            Expired_deviceCount:0,//已过期设备
            Inventory_deviceCount:0, //设备库存
            Sold_deviceCount:0,//已销售设备
            total_device: 0,//设备总数
            loading_one:false,
            loading_two:false,
            loading_three:false,
            loading_four:false,
            search_word:'',
            search_result:[],
            btn_type:'',
            userInfo:{},
            user_type: '',
            user_id:'',
            user_info_type: 'my',//
            user_falg: true,//是否显示服务商信息
            user_sort:{
                1: '管理员',
                2: '服务商',
                3: '用户'
            },
            userType_parameter: '',//请求接口拼接的用户类型
            rechargeList: [],
            
            tabPosition: 'month',
            brokenLineOption :{
                color: ['#0E9CFF'],
                xAxis: {
                    type: 'category',
                    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        show: true,
                        alignWithLabel: true
                    },
                    axisLine:{
                        lineStyle: {
                            type: "dotted"
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dotted"
                        }
                    },
                    boundaryGap: true,//坐标轴两边留白策略
                },
                yAxis: {
                    type: 'value',
                    minInterval: 1,//设置成1保证坐标轴分割刻度显示成整数
                    axisLine: {
                        show: false
                    },
                    splitLine :{ //网格线
                        lineStyle:{
                            type:'dotted'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [{
                    // data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    symbol: "emptyCircle",
                    smooth: true,
                    symbolSize: 8,
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#9AD6FF'
                            }, {
                                offset: 1, color: '#FDFEFF'
                            }],
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            borderWidth: 1,
                            borderColor: "#E0E7FF",
                            borderRadius: [8, 8, 8, 8],
                            padding: [6, 12, 6, 12],
                            backgroundColor: "#FFFFFF",
                            color: "#333333",
                            lineHeight: 22,
                            shadowColor: "rgba(224, 231, 255, 1)",
                            shadowBlur: 10,
                            align: "left",
                            // position: ['-400%', '-400%'],
                            offset: [-60, 0]
                        }
                    }
                }]
            },
            brokenLine: null,
            date_type: 'month',
            start_time: '',
            placeholder_text: '选择月',
            loading_brokenLine: false,
            total_activate:0,
            activate_value:''
        }
    },
    watch: {},
    computed: {
        ...mapGetters(["lang"]),
    },
    created:function(){
        var _this = this;
        _this.userType_parameter = JSON.parse(sessionStorage['user']).userType;
        _this.getEchartsData_one();
        _this.getEchartsData_two();
        _this.getEchartsData_three();
        _this.getEchartsData_four();
        _this.user_type = JSON.parse(sessionStorage['user']).userType;
        _this.user_id = JSON.parse(sessionStorage['user']).userId;
        _this.evt_queryBusinessUserInfo();

        var myDate = new Date();
        _this.start_time = new Date(myDate.toLocaleDateString()).getTime() - 3600 * 24 * 1000 * (myDate.getDate() - 1);
        var end_time = myDate.getTime()
        _this.activate_value = myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月';
        _this.loading_brokenLine = true;
        _this.evt_getDevicesByTime(end_time);
    },
    mounted() {
        this.height = document.body.offsetHeight - 150;
    },
    methods: {
        // 切换是否包含子级数据
        evt_containsChildren:function(e){
            var _this = this;
            _this.checked = e;
            _this.getEchartsData_one();
            _this.getEchartsData_two();
            _this.getEchartsData_three();
            _this.getEchartsData_four();

            var myDate = new Date();
            _this.start_time = new Date(myDate.toLocaleDateString()).getTime() - 3600 * 24 * 1000 * (myDate.getDate() - 1);
            var end_time = myDate.getTime()
            _this.activate_value = myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月';
            _this.loading_brokenLine = true;
            _this.evt_getDevicesByTime(end_time);
        },
        // 获取用户服务商信息
        evt_queryBusinessUserInfo:function(){
            var _this = this;
            var request_data = {};
            if(_this.userType_parameter == '1'){
                request_data['userId'] =  _this.user_id
            }
            api.queryBusinessUserInfo(request_data,_this.userType_parameter).then((res) => {
                if(res.success){
                    var userInfo = {};
                    userInfo['username'] = res.data.username;
                    userInfo['phoneNumber'] = res.data.phoneNumber || '----';
                    _this.userInfo = userInfo;
                }
            }).catch((err) => {
                console.log(err)
                _this.$message({type: 'error',message: err.msg || '获取用户信息请求错误',offset:'200',duration:'1500'});
            })
        },
        evt_pay:function(){ // 平台充值
            this.rechargeList = [];
            this.$refs.dialogRecharge.dialogVisible = true
            this.$nextTick(() => {
                this.$refs.dialogRecharge.searchImei = null
                this.$refs.dialogRecharge.tempNum = 0
                this.$refs.dialogRecharge.flag = 1
            })
        },
        // 库存和已销售
        getEchartsData_one:function(){
            var _this = this;
            api.getTotal_devices({},_this.userType_parameter).then((res_) => {
                // console.log(res_);
                if(res_.success){
                    _this.total_device = res_.data.devices;
                    if(_this.userType_parameter == 2){
                        api.getInventory_device({},_this.userType_parameter).then((res) => {
                            if(res.success){
                                _this.Inventory_deviceCount = res.data.devices;
                                api.getSold_device({},_this.userType_parameter).then((_res) => {
                                    if(_res.success){
                                        _this.Sold_deviceCount = _res.data.devices;
                                        _this.loading_one = false;
                                    }
                                }).catch((_err) => {
                                    _this.$message.error(_err.errMsg)
                                })
                            }
                        }).catch((err) => {
                            _this.$message.error(err.errMsg)
                        })
                    }
                }
            }).catch((err) => {
                _this.$message.error(err.errMsg)
            })
        },
        // 设备期限
        getEchartsData_four:function(){
            var _this = this;
            var request_data = {};
            if(_this.userType_parameter == 2){
                request_data['containsChildren'] = _this.checked;
            }
            api.getUnexpired_device(request_data,_this.userType_parameter).then((_res) => {
                if(_res.success){
                    _this.Unexpired_deviceCount = _res.data.devices;
                    api.getExpired_device(request_data,_this.userType_parameter).then((res_) => {
                        if(res_.success){
                            _this.Expired_deviceCount = res_.data.devices;
                            _this.$nextTick(function(){
                                var chartDom_4 = document.getElementById("myChart4");
                                _this.echarts_4 = echarts.init(chartDom_4);
                                let option_str = JSON.stringify(_this.option);
                                let option = JSON.parse(option_str);
                                let  data =   [
                                    { value: 0, name: "已过期" },
                                    { value: 0, name: "未过期" },
                                ];
                                data[0].value = _this.Expired_deviceCount;
                                data[1].value = _this.Unexpired_deviceCount;
                                option.series[0]['data'] = data;
                                option.color = ["#F27C90", "#C4C6D1"];
                                function formatter(name){
                                    for (var i = 0; i < option.series[0].data.length; i++) {
                                        if (option.series[0].data[i].name == name) {
                                            return name +": "+ option.series[0].data[i].value;
                                        }
                                    }
                                }
                                option.legend.formatter = formatter;
                                option.title['text'] = [
                                    '{name|总数}',
                                    '{value|' + (_this.Expired_deviceCount + _this.Unexpired_deviceCount) + '}',
                                ].join('\n')
                                _this.echarts_4.setOption(option);
                                _this.loading_four = false;
                            })
                        }
                    }).catch((err_) => {
                        _this.$message.error(err_.errMsg)
                    })
                }
            }).catch((_err) => {
                _this.$message.error(_err.errMsg)
            })
        },
        // 激活统计
        getEchartsData_three:function(){
            var _this = this;
            var request_data = {};
            if(_this.userType_parameter == 2){
                request_data['containsChildren'] = _this.checked;
            }
            api.getActivated(request_data,_this.userType_parameter).then((res) => {
                if(res.success){
                    _this.ActivatedCount = res.data.devices;
                    api.getUnactivated_device(request_data,_this.userType_parameter).then((_res) => {
                        if(_res.success){
                            _this.Unactivated_deviceCount = _res.data.devices;
                            _this.$nextTick(function(){
                                var chartDom_3 = document.getElementById("myChart3");
                                _this.echarts_3 = echarts.init(chartDom_3);
                                let option_str = JSON.stringify(_this.option);
                                let option = JSON.parse(option_str);
                                let  data =  [
                                    { value: 0, name: "激活" },
                                    { value: 0, name: "未激活" },
                                ];
                                data[0].value = _this.ActivatedCount;
                                data[1].value = _this.Unactivated_deviceCount;
                                option.series[0]['data'] = data;
                                option.color = ["#2EA9FE", "#C4C6D1"];
                                function formatter(name){
                                    for (var i = 0; i < option.series[0].data.length; i++) {
                                        if (option.series[0].data[i].name == name) {
                                            return name +": "+ option.series[0].data[i].value;
                                        }
                                    }
                                }
                                option.legend.formatter = formatter;
                                option.title['text'] = [
                                    '{name|总数}',
                                    '{value|' + (_this.ActivatedCount + _this.Unactivated_deviceCount) + '}',
                                ].join('\n')
                                _this.echarts_3.setOption(option);
                                _this.loading_three = false;
                            })
                        }
                    }).catch((_err) => {
                        _this.$message.error(_err.errMsg)
                    })
                }
            }).catch((err) => {
                _this.$message.error(err.errMsg)
            })
        },
        // 设备状态
        getEchartsData_two:function(){
            var _this = this;
            var request_data = {};
            if(_this.userType_parameter == 2){
                request_data['containsChildren'] = _this.checked;
            }
            api.getOnlineDvice(request_data,_this.userType_parameter).then((res) => {
                if(res.success){
                    _this.OnlineDviceCount = res.data.devices;
                    api.getOfflineDevice(request_data,_this.userType_parameter).then((_res) => {
                        if(_res.success){
                            _this.OfflineDeviceCount = _res.data.devices;
                            _this.$nextTick(function(){
                                var chartDom_2 = document.getElementById("myChart2");
                                _this.echarts_2 = echarts.init(chartDom_2);
                                let option_str = JSON.stringify(_this.option);
                                let option = JSON.parse(option_str);
                                let  data = [
                                    { value: 0, name: "在线" },
                                    { value: 0, name: "离线" },
                                ];
                                data[0].value = _this.OnlineDviceCount;
                                data[1].value = _this.OfflineDeviceCount;
                                option.series[0]['data'] = data;
                                option.color = ["#2FC25B", "#C4C6D1"];
                                function formatter(name){
                                for (var i = 0; i < option.series[0].data.length; i++) {
                                    if (option.series[0].data[i].name == name) {
                                        return name +": "+ option.series[0].data[i].value;
                                        }
                                    }
                                }
                                option.legend.formatter = formatter;
                                option.title['text'] = [
                                    '{name|总数}',
                                    '{value|' + (_this.OnlineDviceCount + _this.OfflineDeviceCount) + '}',
                                ].join('\n')
                                _this.echarts_2.setOption(option);
                                _this.loading_two = false;
                            })
                        }
                    }).catch((_err) => {
                        _this.$message.error(_err.errMsg)
                    })
                }
            }).catch((err) => {
                _this.$message.error(err.errMsg)
            })
        },
        // 刷新
        evt_refresh:function(e){
            // console.log(e.target.getAttribute('data-type'));
            if(e.target.getAttribute('data-type') == '1'){
                this.loading_one = true;
                this.getEchartsData_one();
            }else if(e.target.getAttribute('data-type') == '2'){
                this.loading_two = true;
                this.getEchartsData_two();
            }else if(e.target.getAttribute('data-type') == '3'){
                this.loading_three = true;
                this.getEchartsData_three();
            }else if(e.target.getAttribute('data-type') == '4'){
                this.loading_four = true;
                this.getEchartsData_four();
            }
        },
        // 查询设备
        evt_queryDevices:function(){
            var _this = this;
            var request_data = {};
            request_data['deviceNumberKeyword'] = _this.search_word;
            request_data['page'] = 0;
            request_data['pageSize'] = 20;
            request_data['containsChildren'] = true;
            api.getDevicesList(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                _this.search_result = [];
                if(res.success && res.data && res.data.content && res.data.content.length > 0){
                    _this.search_result = res.data.content;
                }else if(res.success && res.data && res.data.content && res.data.content.length == 0){
                    _this.$message({message:'暂未搜索到设备信息',type:'warning',offset:'200',duration:'2000'});
                }
            }).catch((err) => {
                _this.$message({message: err.msg || '请求错误，请稍后重试' ,type:'error',offset:'200',duration:'2000'});
            })
        },
        evt_nav:function(value){
            this.btn_type = value;
            if(this.search_word.trim() == '') return;
            this.evt_queryDevices();
        },
        evt_row_click:function(row){
            // console.log(row);
            this.search_result = [];
            this.search_word = '';
            if(this.btn_type == 'trace'){
                let routeUrl = this.$router.resolve({
                    path: "/trace",
                    query: {deviceId:row.id,panorama:'trace'}
                });
                window.open(routeUrl.href, '_blank');
            }else if(this.btn_type == 'track'){
                this.$router.push({path:'/control/control',query:{deviceId:row.id}});
            }
        },
        // 设备激活统计折线图
        evt_changeRadio:function(e){
            this.date_type = e;
            var end_time = new Date().getTime();
            var year = new Date().getFullYear();
            if(e == 'month'){
                var current_month = new Date().getMonth();
                this.start_time = new Date(year, current_month, 1).getTime()
                this.activate_value = year + '年' + (current_month + 1) + '月';
            }else{
                this.start_time = new Date(year, 0, 1).getTime()
                this.activate_value = year + '年';
            }
            this.loading_brokenLine = true;
            this.evt_getDevicesByTime(end_time);
        },
        evt_changeTime:function(e){//选择时间
            // console.log(e)
            var _this = this;
            var end_time = new Date().getTime();
            // console.log(end_time)
            if(end_time < _this.start_time){
                _this.$message({message: '选择时间不能大于当前时间', type: 'warning',offset: '200',duration:'2000'})
                return;
            }
            if(_this.tabPosition == 'month'){
                var year = new Date(_this.start_time).getFullYear();
                var month = new Date(_this.start_time).getMonth();
                var current_month = new Date().getMonth();
                // console.log(month,current_month);
                if(month != current_month){
                    end_time = new Date(year, month + 1, 1).getTime()
                }
                _this.activate_value = year + '年' + (month + 1) + '月';
            }else{
                var year = new Date(_this.start_time).getFullYear();
                var current_year = new Date().getFullYear();
                if(year != current_year){
                    end_time = new Date(year, 11, 31).getTime() + 24 * 3600 * 1000
                }
                _this.activate_value = year + '年';
            }
            _this.loading_brokenLine = true;
            _this.evt_getDevicesByTime(end_time);
        },
        evt_getDevicesByTime:function(end_time){
            var _this = this;
            var request_data = {};
            if(_this.userType_parameter == 2){
                request_data['containsChildren'] = _this.checked;
            }
            request_data['timeUnit'] = _this.tabPosition == 'month' ? 0 : 1;
            request_data['startTime'] = _this.start_time;
            request_data['endTime'] = end_time;
            api.getDevicesByTime(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success){
                    var newData = res.data;
                    var total_activate = 0
                    var xAxis_data = [];
                    var xAxis_suffix = _this.tabPosition == 'month' ? '号' : '月';
                    var data_arr = [];
                    var year = new Date(_this.start_time).getFullYear();
                    var month = new Date(_this.start_time).getMonth(); 
                    for(var i = 0, len = newData.length; i < len; i++){
                        total_activate = total_activate + newData[i].count;
                        xAxis_data.push((i + 1) + xAxis_suffix);
                        var item = {};
                        item['value'] = newData[i].count;
                        if(_this.tabPosition == 'month'){
                            item['name'] = '时间：' + year + '-' + ((month + 1) < 10 ? '0' + (month + 1) : month + 1) + '-' + ((i + 1) < 10 ? '0' + (i + 1) : i + 1);
                        }else{
                            item['name'] = '时间：' + year + '-' + ((i + 1) < 10 ? '0' + (i + 1) : i + 1);
                        }
                        data_arr.push(item);
                    }
                    _this.total_activate = total_activate;
                    _this.$nextTick(function(){
                        var brokenLine = document.getElementById("brokenLine");
                        _this.brokenLine = echarts.init(brokenLine);
                        let option_str = JSON.stringify(_this.brokenLineOption);
                        let option = JSON.parse(option_str);
                        option.xAxis['data'] = xAxis_data;
                        option.series[0]['data'] = data_arr;
                        // console.log(data_arr)
                        function formatter(name){
                            for (var i = 0; i < option.series[0].data.length; i++) {
                                if(name.name == option.series[0].data[i].name){
                                    return `${option.series[0].data[i].name}\n激活设备数：${option.series[0].data[i].value}台`;
                                }
                            }
                        }
                        option.series[0].emphasis.label['formatter'] = formatter;
                        _this.brokenLine.setOption(option);
                    })
                    _this.loading_brokenLine = false;
                }
            }).catch((err) => {
                // console.log(err);
                _this.$message({message: err.msg || '请求错误，请稍后重试' ,type:'error',offset:'200',duration:'2000'});
            })
        }

    },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    #users {
        height: 100%;
        padding: 20px;
        background: #F3F7FB;
        box-sizing: border-box;
        overflow: scroll;
    }
    .info_container_1{
        width: 100%;
        height: 13vw;
        background: #FFFFFF;
        box-shadow: 0px 0px 10px 0px rgba(68, 106, 234, 0.08);
        border-radius: 4px;
    }
    .userInfo{
        width: 100%;
        height: 100%;
        padding: 0px 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        .userInfo_left{
            flex-shrink: 0;
            margin-right: 8%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >img{
                width: 80px;
                height: 80px;
            }
            >div{
                height: 30px;
                background: #FF6565;
                border-radius: 15px;
                padding: 0px 16px;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 30px;
                margin-top: 8%;
                cursor: pointer;
            }
        }
        .userInfo_right{
            padding-top: 8%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            .userInfo_right_text{
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #666666;
                line-height: 26px;
                word-break:break-all;
                display:-webkit-box;
                -webkit-line-clamp:1;
                -webkit-box-orient:vertical;
                overflow:hidden;
            }
            .userInfo_right_check{
                display: flex;
                align-items: center;
                >span{
                    margin-left: 6px;
                }
            }
        }
    }
    .inventoryInfo{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .inventoryInfo_top{
            width: 100%;
            // padding: 30px 30px 0px 30px;
            padding: 1.56vw 1.56vw 0px 1.56vw;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div{
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #333333;
                line-height: 18px;
            }
            >img{
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
        }
        .inventoryInfo_bottom{
            flex-grow: 1;
            display: flex;
            justify-content: space-evenly;
            align-items: center;
            .inventoryInfo_item{
                display: flex;
                align-items: center;
                >img{
                    width: 80px;
                    height: 80px;
                    flex-shrink: 0;
                }
                .inventoryInfo_item_right{
                    margin-left: 18px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    .inventoryInfo_item_inventory{
                        color: #2FC25B !important;
                    }
                    .inventoryInfo_item_sell{
                        color: #FF6565 !important;
                    }
                    >div:nth-of-type(1){
                        display: flex;
                        align-items: flex-end;
                        font-family: Microsoft YaHei;
                        font-weight: bold;
                        color: #1FA3FF;
                        >span:nth-of-type(1){
                            font-size: 30px;
                            line-height: 30px;
                        }
                        >span:nth-of-type(2){
                            font-size: 16px;
                            line-height: 24px;
                        }
                    }
                    >div:nth-of-type(2){
                        font-size: 14px;
                        font-family: Microsoft YaHei;
                        font-weight: 400;
                        color: #666666;
                        line-height: 14px;
                        margin-top: 10px;
                    }
                }
            }

        }
    }
    .trackInfo{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .track_top{
            // padding: 30px 30px 0px 30px;
            padding: 1.56vw 1.56vw 0px 1.56vw;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #333333;
            line-height: 18px;
        }
        .track_bottom{
            flex-grow: 1;
            width: 100%;
            padding: 0px 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .track_bottom_top{
                width: 100%;
                position: relative;
                .track_info_top_tab{
                    width: 100%;
                    max-height: 5vw;
                    overflow-y: scroll;
                    background: #FFFFFF;
                    border: 1px solid #DDDDDD;
                    box-sizing: border-box;
                    position: absolute;
                    top: 32px;
                    left: 0px;
                    z-index: 999;
                    cursor: pointer;
                }

            }
            .track_bottom_bottom{
                display: flex;
                justify-content: space-evenly;
                .track_info_btn_bt{
                    width: 6vw;
                    min-width: 88px;
                    border-color: #3E9AFF;
                    color: #3E9AFF;
                }
            }
        }
    }
    .echarts_container{
        width: 100%;
        height: 16vw;
        background: #FFFFFF;
        box-shadow: 0px 0px 10px 0px rgba(68, 106, 234, 0.08);
        border-radius: 4px;
        padding: 1.56vw;
        box-sizing: border-box;
        .echarts_top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div{
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: bold;
                color: #333333;
                line-height: 18px;
            }
            >img{
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
        }
        .echarts_content{
            margin-top: 0.8vw;
            width: 100%;
            height: 11vw;
        }
    }
    .statistics{
        width: 100%;
        height: 22.4vw;
        background: #FFFFFF;
        box-shadow: 0px 0px 10px 0px rgba(68, 106, 234, 0.08);
        border-radius: 4px;
        padding: 1.56vw;
        box-sizing: border-box;
        padding-bottom: 0px;
        .statistics_top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .statistics_top_left{
                // flex-grow: 1;
                display: flex;
                align-items: center;
                >div:nth-of-type(1){
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: bold;
                    color: #333333;
                    line-height: 24px;
                }
                >div:nth-of-type(2){
                    width: 6.25vw;
                    min-width: 90px;
                    margin-left: 20px;
                    margin-right: 10px;
                }
                >div:nth-of-type(3){
                    width: 6.25vw;
                    min-width: 90px;
                    /dee/ .el-input--prefix .el-input__inner{
                        padding-left: 0px;
                    }
                    /deep/ .el-input--suffix .el-input__inner{
                        padding-right: 0px;
                    }
                }

            }
            .statistics_top_right{
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #999999;
                line-height: 24px;
                >span{
                    color: #0E9CFF;
                    font-size: 18px;
                    font-weight: 500;
                }
            }
        }
        .statistics_bottom{
            // height: 15vw;
            // padding-left: 4.6vw;
            // padding-right: 4.6vw;
            box-sizing: border-box;
            // margin-top: 0.8vw;
            #brokenLine{
                height: 18vw;
                width: 100%;
            }
        }
    }
</style>
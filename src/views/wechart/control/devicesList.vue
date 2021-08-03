<template>
    <div class="devicesContainer">
        <div class="row_item_middle">
            <div class="row_item_middle_top">
                <div>
                    <div @click="evt_change_type('all')" :class="change_type == 'all' ? 'select_item' :''">全部{{'('+ (OnlineDvice + OfflineDvice) + ')'}}</div>
                    <div @click="evt_change_type('on')" :class="change_type == 'on' ? 'select_item' :''">在线{{'('+ OnlineDvice + ')'}}</div>
                    <div @click="evt_change_type('off')" :class="change_type == 'off' ? 'select_item' :''">离线{{'('+ OfflineDvice + ')'}}</div>
                </div>
                <!-- <div><i class="el-icon-arrow-left"></i></div> -->
            </div>
            <div class="row_item_middle_middle">
                <el-input class="search_device_input" style="margin-bottom:10px" size="mini" placeholder="请输入设备名称设备号" v-model="searchDevice_word" @keyup.enter.native="evt_searchDevice">
                    <el-button @click="evt_searchDevice" size="mini" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            <div class="row_item_middle_bottom" :style="{'height': block_height - 90 + 'px'}" v-loading="loading_flag">
                <div class="item_content" v-infinite-scroll="evt_scroll_load" infinite-scroll-immediate="false" infinite-scroll-distance="20">
                    <template v-if="devices_list.length > 0">
                        <div class="devices_item" :class="[item.id == current_select_deviceId ? 'devices_item_t':'', ((item.activationTime != null && item.activationTime < current_time && current_time > item.serviceExpireTime) || item.lastReportDataTime == null) ? 'item_opacity': '',]" v-for="item in devices_list" :key="item.id">
                            <div class="devices_item_mask" v-if="(item.activationTime != null && item.activationTime < current_time && current_time > item.serviceExpireTime) || item.lastReportDataTime == null"></div>
                            <div class="devices_item_top" @click="evt_select_devices(item.id,'selected')">
                                <img @click.stop="evt_select_devices(item.id,'checked')" v-show="!item.checked" :src="require('../../../assets/img/no_select_icon.png')" style="width:20px;height:20px;flex-shrink: 0;">
                                <img @click.stop="evt_select_devices(item.id,'checked')" v-show="item.checked" :src="require('../../../assets/img/selected_icon.png')" style="width:20px;height:20px;flex-shrink: 0;">
                                <el-avatar class="devices_item_top_avatar" size="small" :src="(item.networkStatus == '1' && current_time - item.lastReportDataTime < 30 * 60 * 1000) ? item.stationarySeconds != null ? item.useRangeCode != null ? icon_list_t[item.useRangeCode].iconUrlForConsoleStationary : icon_list_t['JiaoChe'].iconUrlForConsoleStationary  : item.useRangeCode != null ? icon_list_t[item.useRangeCode].iconUrlForConsoleActive : icon_list_t['JiaoChe'].iconUrlForConsoleActive :item.useRangeCode != null ? icon_list_t[item.useRangeCode].iconUrlForConsoleInactive : icon_list_t['JiaoChe'].iconUrlForConsoleInactive"></el-avatar>
                                <div class="devices_item_top_right">
                                    <div class="devices_item_top_right_top">
                                        <div class="devices_item_top_right_top_left text_line" :class="(item.networkStatus == '2' || (item.networkStatus == '1' && current_time - item.lastReportDataTime > 30 * 60 * 1000)) ? '' : 'devices_item_top_right_top_left_t'">{{item.deviceName}}</div>
                                        <div class="devices_item_top_right_top_right" :class="(item.networkStatus != '1' || item.stationarySeconds != null || (item.networkStatus == '1' && current_time - item.lastReportDataTime > 30 * 60 * 1000)) ? 'devices_item_top_right_top_right_t' : ''">{{item.lastReportDataTime|formatStatus(item.networkStatus,item.activationTime,item.serviceExpireTime,item.stationarySeconds)}}</div>
                                    </div>
                                    <div class="devices_item_top_right_bottom" v-if="item.battery != null">
                                        <!-- 电池辅助元素 -->
                                        <div><div style="background:#02C602;" :style="{width: item.battery + '%'}"></div></div>
                                        <div>{{item.battery}}%</div>
                                    </div>
                                    <div v-if="item.battery == null && item.batteryVoltage != null" class="batteryVoltage_class">电压: {{item.batteryVoltage}}V</div>
                                </div>
                            </div>
                            <div v-if="item.activationTime == null || (item.activationTime != null && current_time < item.serviceExpireTime)" class="devices_item_bottom">
                                <div>
                                    <el-button @click="evt_trace(item.id,'trace')" :class="item.id == current_select_deviceId ? 'devices_item_bottom_btn' : ''" plain size="mini">跟踪</el-button>
                                </div>
                                <div>
                                    <el-button @click="evt_playback(item)" :class="item.id == current_select_deviceId ? 'devices_item_bottom_btn' : ''" plain size="mini">回放</el-button>
                                </div>
                                <div class="devices_item_bottom_more">
                                    <el-dropdown @command="evt_more_command" size="mini">
                                        <span class="el-dropdown-link">更多</span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item :command="{type:'detail',deviceId:item.id,deviceNumber:item.deviceNumber}">设备详情</el-dropdown-item>
                                            <el-dropdown-item :command="{type:'command',deviceId:item.id,deviceModelId:item.deviceModel.id,deviceInfo:item,deviceNumber:item.deviceNumber}">设备指令</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </div>
                            <div v-if="item.activationTime != null && current_time > item.serviceExpireTime" class="devices_item_bottom_two">
                                <div><span class="span_hover" @click="evt_pay(item.deviceNumber)">充值缴费</span></div>
                                <div><span class="span_hover" @click="evt_more_command({type:'detail',deviceId:item.id,deviceNumber:item.deviceNumber})">设备详情</span></div>
                            </div>
                        </div>
                    </template>
                    <div v-if="devices_list.length == 0" style="font-size:14px;text-align:center;">暂无设备数据</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/wechart/index'
import {gcj02tobd09, bd09togcj02, gcj02towgs84, wgs84togcj02} from '@/utils/baidumap.js'
export default {
    name: 'devicesList',
    props:['userId','iconList','selectDeviceId'],
    data(){
        return{
            user_id: this.userId,
            icon_list_t: {},
            change_type:'all',//切换全部、在线、离线设备统计
            OnlineDvice:0,//在线设备数量
            OfflineDvice:0,//离线设备数量
            userType_parameter: '',//请求接口拼接的用户类型
            searchDevice_word:'',//搜索设备的关键字
            searchDevice_flag: false,
            page: 0,
            pageSize: 20,
            totalPage: 1,
            devices_list:[],//当前用户的设备列表
            current_select_deviceId: this.selectDeviceId,//当前选择的设备id
            need_handle_deviceId:'',//更多下拉框需要进行操作的设备的id
            need_handle_deviceNumber: '',
            current_time:0,//当前时间戳
            block_height: 0,
            loading_flag: false,
        }
    },
    created(){
        this.userType_parameter = JSON.parse(sessionStorage['user']).userType;
        // 当前时间戳
        this.current_time = new Date().getTime();
    },
    watch:{
        userId:{
            handler(){
                this.user_id = this.userId;
                // 获取用户的在线离线设备数量
                this.evt_getOnlineDvice();
                this.evt_getOfflineDevice();
                this.change_type = 'all';
                this.page = 0;
                this.totalPage = 1;
                this.devices_list = [];
                this.searchDevice_word = '';
                // this.current_select_deviceId = '';//当前选择的设备id
                this.evt_queryDevices();
            },
            deep:true
        },
        iconList:{
            handler(){
                this.icon_list_t = this.iconList;
            },
            deep: true
        },
        selectDeviceId:{
            handler(){
                this.current_select_deviceId = this.selectDeviceId;//当前选择的设备id
            },
            deep: true
        }
    },
    mounted(){
        var _this = this;
        _this.$nextTick(function(){
            _this.block_height = document.getElementsByClassName('usersContainer')[0].offsetHeight;
        })
    },
    methods: {

        // 获取设备在线、离线数据
        evt_getOnlineDvice:function(){
            var _this = this;
            var request_data = {};
            // 判断是不是当前登录用户 当前登录用户请求查询设备时 不传递userid参数
            if(_this.user_id != JSON.parse(sessionStorage['user']).userId){
                request_data['ownerId'] = _this.user_id;
            }
            api.getOnlineDvice(request_data,_this.userType_parameter).then((res) => {
                if(res.success){
                    _this.OnlineDvice = res.data.devices;
                }
            })
        },
        evt_getOfflineDevice:function(){
            var _this = this;
            var request_data = {};
            // 判断是不是当前登录用户 当前登录用户请求查询设备时 不传递userid参数
            if(_this.user_id != JSON.parse(sessionStorage['user']).userId){
                request_data['ownerId'] = _this.user_id;
            }
            api.getOfflineDevice(request_data,_this.userType_parameter).then((res) => {
                if(res.success){
                    _this.OfflineDvice = res.data.devices;
                }
            })
        },
        // 切换在线、离线
        evt_change_type:function(value){
            if(this.change_type == value) return;
            this.change_type = value;
            this.page = 0;
            this.totalPage = 1;
            this.devices_list = [];
            this.current_select_deviceId = '',//当前选择的设备id
            this.evt_queryDevices();
            this.$emit("monitorNetworkStatus");
        },
        evt_searchDevice:function(){
            if(this.searchDevice_flag) return;
            this.searchDevice_flag = true;
            this.page = 0;
            this.totalPage = 1;
            this.devices_list = [];
            this.change_type = 'all';
            this.current_select_deviceId = '',//当前选择的设备id
            this.evt_queryDevices('search');
            this.$emit("monitorNetworkStatus");
        },
        // 分页获取设备
        evt_queryDevices:function(type){
            var _this = this;
            _this.loading_flag = true;
            var request_data = {};
            request_data['page'] = _this.page;
            request_data['pageSize'] = _this.pageSize;
            request_data['deviceNumberKeyword'] = _this.searchDevice_word;
            if(type == 'search'){
                request_data['containsChildren'] = true;
            }
            // 判断是不是当前登录用户 当前登录用户请求查询设备时 不传递userid参数
            if(_this.user_id != JSON.parse(sessionStorage['user']).userId){
                request_data['ownerId'] = _this.user_id;
            }
            if(_this.change_type != 'all' && _this.change_type == 'on'){
                request_data['networkStatus'] = '1';
            }else if(_this.change_type != 'all' && _this.change_type == 'off'){
                request_data['networkStatus'] = '2';
            }
            api.getDevicesList(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success && res.data && res.data.content && res.data.content.length > 0){
                    // 把设备返回的gdj02坐标转换成bd09
                    for(var key in res.data.content){
                        if(res.data.content[key].positionInfo && Object.keys(res.data.content[key].positionInfo).length > 0 &&  Object.keys(res.data.content[key].positionInfo.coordinate).length > 0){
                            var point_t = gcj02tobd09(res.data.content[key].positionInfo.coordinate.lng,res.data.content[key].positionInfo.coordinate.lat);
                            res.data.content[key].positionInfo.coordinate.lng = point_t[0];
                            res.data.content[key].positionInfo.coordinate.lat = point_t[1];
                        }
                    }
                    var newData = res.data.content;
                    for(let i = 0, len = newData.length; i < len; i++){
                        _this.$set(newData[i],'checked',false);
                    }
                    _this.devices_list = _this.devices_list.concat(newData);
                    _this.totalPage = res.data.pageTotal;
                }else{
                    // _this.$message({message: res.msg ,type:"info",offset:"200",duration:'1500'});
                }
                _this.loading_flag = false;
                _this.searchDevice_flag = false;
                // 触发设备列表更改事件
                _this.$emit('monitorDevicesList',this.devices_list);
            }).catch((err) => {
                console.log(err);
                _this.loading_flag = false;
                _this.searchDevice_flag = false;
                _this.$message({message:err.msg,type:'error',offset:'200',duration:'1500'});
            })
        },
        evt_scroll_load:function(){
            if(this.devices_list.length == 0){
                return;
            }
            if(this.page == this.totalPage - 1) {
                return;
            }
            this.page = this.page + 1;
            this.evt_queryDevices();
        },
        // 选中、取消选择设备
        evt_select_devices:function(deviceId,type){
            var _this = this;
            for(let i = 0, len = _this.devices_list.length; i < len; i++){
                if(deviceId == _this.devices_list[i].id){
                    if(_this.devices_list[i].checked && type == 'checked'){
                        _this.$set(_this.devices_list[i],'checked',false);
                        _this.current_select_deviceId = '';
                        if(_this.devices_list[i].positionInfo && _this.devices_list[i].positionInfo.coordinate && _this.devices_list[i].positionInfo.coordinate.lng){
                            // 触发选择设备事件
                            var monitorInfo = {};
                            monitorInfo['oldLng'] = this.devices_list[i].positionInfo.coordinate.lng;
                            monitorInfo['oldLat'] = this.devices_list[i].positionInfo.coordinate.lat;
                            monitorInfo['type'] = 'delete';
                            monitorInfo['current_select_deviceId'] = _this.current_select_deviceId;
                            _this.$emit('monitorSelectDevices',monitorInfo);
                        }
                    }else{
                        _this.$emit('monitorId',_this.devices_list[i].owner.userId);
                        _this.$set(_this.devices_list[i],'checked',true);
                        _this.need_handle_deviceId = _this.devices_list[i].id;
                        _this.need_handle_deviceNumber = _this.devices_list[i].deviceNumber;
                        _this.current_select_deviceId = _this.devices_list[i].id;
                        var oldLng = '',oldLat = '';
                        if(_this.devices_list[i].positionInfo != null){
                            oldLng = _this.devices_list[i].positionInfo.coordinate.lng;
                            oldLat = _this.devices_list[i].positionInfo.coordinate.lat;
                        }
                        var request_data = {};
                        request_data['deviceId'] = deviceId;
                        api.getDeviceDetail(request_data,_this.userType_parameter).then((res) => {
                            // console.log(res);
                            if(res.success && res.data && Object.keys(res.data).length > 0){
                                // 无定位信息
                                if(res.data.positionInfo == null){
                                    _this.$message({message:'暂无此设备定位信息',type:'warning',offset:'200',duration:'2000'});
                                    // return;
                                }
                                var point;
                                if(res.data.positionInfo != null){
                                    var point_t = gcj02tobd09(res.data.positionInfo.coordinate.lng,res.data.positionInfo.coordinate.lat);
                                    res.data.positionInfo.coordinate.lng = point_t[0];
                                    res.data.positionInfo.coordinate.lat = point_t[1];
                                    point = new BMap.Point(point_t[0],point_t[1]);
                                    _this.$set(_this.devices_list[i].positionInfo.coordinate,'lng',point_t[0]);
                                    _this.$set(_this.devices_list[i].positionInfo.coordinate,'lat',point_t[1]);
                                }
                                if(res.data.lastReportDataTime != null && res.data.networkStatus == '1' && new Date().getTime() - res.data.lastReportDataTime > 30 * 60 * 1000){
                                    _this.$set(_this.devices_list[i],'networkStatus',2);
                                    _this.$set(res.data,'networkStatus',2);
                                }
                                // 触发选择设备事件
                                var monitorInfo = {};
                                monitorInfo['oldLng'] = oldLng;
                                monitorInfo['oldLat'] = oldLat;
                                monitorInfo['addOverlayInfo'] = res.data;
                                monitorInfo['point'] = point;
                                monitorInfo['deviceName'] = res.data.deviceName;
                                monitorInfo['type'] = 'add';
                                monitorInfo['current_select_deviceId'] = _this.current_select_deviceId;
                                _this.$emit('monitorSelectDevices',monitorInfo);

                            }
                        }).catch((err) => {
                            console.log(err)
                            _this.$message({message:err.msg || '未知错误',type:'error',offset:'200',duration:'1000'});
                        })
                    }
                    break;
                }
            }
        },
        // 追踪
        evt_trace:function(deviceId,panorama){
            let routeUrl = this.$router.resolve({
                path: "/trace",
                query: {deviceId:deviceId,panorama:panorama == 'panorama' ? 'panorama':'trace'}
            });
            window.open(routeUrl.href, '_blank');
        },
        // 回放
        evt_playback:function(item){
            this.$emit('monitorPlayBack',item);
            this.current_select_deviceId = item.id;
            this.$emit('monitorId',item.owner.userId);
        },
         // 更多下拉框的操作
        evt_more_command:function(item){
            this.$emit('monitorMore',item)
        },
        // 充值缴费
        evt_pay:function(deviceNumber){
            this.$emit('monitorPay',deviceNumber)
        },


    },
    filters:{
        formatDate(val) {
            let date = new Date(val)
            // 判断这个时间格式是否为NaN-aN-aN aN:aN:aN，
            return isNaN(date) ? " " : formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        },
        formatTime(time){
            var hour = 0, minute = 0, second = 0; //时间默认
            var intDiff = time;
            if (intDiff > 0) {
                hour = Math.floor(intDiff / (60 * 60)).toString();
                minute = (Math.floor(intDiff / 60) - (hour * 60)).toString();
                second = (Math.floor(intDiff) - (hour * 60 * 60) - (minute * 60)).toString();
            }
            return (hour > 0 ? hour + '小时':'') + (minute > 0 ? minute + '分钟':'') + (second > 0 ? second + '秒':'');
        },
        formatStatus(lastReportDataTime,networkStatus,activationTime,serviceExpireTime,stationarySeconds){
            var currentTime = new Date().getTime();
            if(activationTime && activationTime < currentTime && (lastReportDataTime != null || lastReportDataTime)  && networkStatus == '1' && serviceExpireTime != null && serviceExpireTime > currentTime && currentTime - lastReportDataTime > 30 * 60 * 1000){
                networkStatus = '2';
            }
            if(!activationTime || activationTime == null || activationTime > currentTime){
                return '未激活';
            }else if(activationTime && lastReportDataTime == null && serviceExpireTime > currentTime){
                return '已激活未上线';
            }else if(activationTime && (lastReportDataTime != null || lastReportDataTime)  && networkStatus == '1' && serviceExpireTime != null && serviceExpireTime > currentTime){
                if(stationarySeconds == null){
                    return '在线';
                }else{
                    var d = Math.floor(stationarySeconds / (24 * 60 * 60));
                    var h = Math.floor(stationarySeconds / (60 * 60));
                    var m = Math.floor(stationarySeconds / (60));
                    return '静止>' + (d > 0 ? d + '天': h > 0 ? h + '小时' : m + '分钟');
                }
            }else if(activationTime && (lastReportDataTime != null || lastReportDataTime)  && networkStatus == '2' && serviceExpireTime != null && serviceExpireTime > currentTime){
                var diffTime = currentTime - lastReportDataTime;
                var d = Math.floor(diffTime / (24 * 60 * 60 * 1000));
                var h = Math.floor(diffTime / (60 * 60 * 1000));
                var m = Math.floor(diffTime / (60 * 1000));
                return '离线>' + (d > 0 ? d + '天': h > 0 ? h + '小时' : m + '分钟');
            }else if(activationTime && serviceExpireTime < currentTime){
                return '已过期';
            }
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .devicesContainer{
        width: 100%;
        height: 100%;
    }
    .row_item_middle{
        display: flex;
        flex-direction: column;
    }
    .row_item_middle_top{
        height: 40px;
        background: #EEF3FE;
        border-bottom: 1px solid #DDDDDD;
        padding-left: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        >div:nth-of-type(1){
            display: flex;
            justify-content: flex-start;
            align-items: center;
            >div{
                height: 34px;
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                line-height: 34px;
                padding: 0px 4px;
                box-sizing: border-box;
                cursor: pointer;
            }
            .select_item{
                background: #FFFFFF;
                border: 1px solid #DDDDDD;
                height: 35px;
                border-bottom: 0px;
                // position: relative;
                // left: 0px;
                // bottom: 0px;
            }
        }
        >div:nth-of-type(2){
            width: 20px;
            height: 38px;
            background: white;
            border-top-left-radius: 50%;
            border-bottom-left-radius: 50%;
            position: relative;
            >i{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
        }
    }
    .row_item_middle_middle{
        width: 100%;
        background: #FFFFFF;
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/ .row_item_bottom_left_userIcon{
            color: #F19B04 !important;
        }
        /deep/  .el-tree-node.is-current > .el-tree-node__content {
            background-color: #FFE6B0 !important;
            border: 1px solid #F19B04;
        }
    }
    .row_item_middle_bottom{
        // flex: 1;
        width: 100%;
        box-sizing: border-box;
        padding: 0px 5px 20px 5px;
        position: relative;
        .row_item_middle_bottom_add_tag{
            position: absolute;
            top: 0;
            right: 5px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #666666;
            cursor: pointer;
        }
        .row_item_middle_bottom_title{
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .item_content{
            background: #D5DCED;
            padding: 5px;
            max-height: 100%;
            overflow-y: scroll;
            .devices_item_t{
                background: #D8E3FF !important;
                border: 1px solid #4391FE; 
            }
            .bgcolor{
                background: #D8E3FF;
                /deep/ .el-menu{
                    background: #D8E3FF;
                }
            }
            .devices_item{
                width: 100%;
                box-sizing: border-box;
                // padding: 10px 5px 0px 5px;
                background: #FFFFFF;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 5px;
                position: relative;
                .devices_item_mask{
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    right: 0px;
                    bottom: 0px;
                    z-index: 99;
                }
                .devices_item_top{
                    border-bottom: 1px solid #EEEEEE;
                    padding: 10px 5px 10px 5px;
                    padding-bottom: 10px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .devices_item_top_avatar{
                        flex-shrink: 0;
                        margin: 0px 6px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    /deep/ .el-avatar>img {
                        display: inline-block;
                        height: auto;
                        vertical-align: initial;
                    }
                    .devices_item_top_right{
                        flex:1;
                        // margin-bottom: 10px;
                        .devices_item_top_right_top{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .devices_item_top_right_top_left{
                                font-size: 12px;
                                font-family: Microsoft YaHei;
                                font-weight: 400;
                                color: #333333;
                            }
                            .devices_item_top_right_top_left_t{
                                color: #018C0E;
                            }
                            .devices_item_top_right_top_right{
                                flex-shrink: 0;
                                font-size: 12px;
                                font-family: Microsoft YaHei;
                                font-weight: 400;
                                color: #018C0E;
                                margin-left: 5px;
                            }
                            .devices_item_top_right_top_right_t{
                                color: #FF6565;
                            }
                        }
                        .devices_item_top_right_bottom{
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            >div:nth-of-type(1){
                                width: 26px;
                                height: 12px;
                                border: 1px solid #A9A9A9;
                                border-radius: 3px;
                                position: relative;
                                margin-right: 10px;
                                padding: 1px 0px 1px 1px;
                                box-sizing: border-box;
                                >div{
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            >div:nth-of-type(1)::after{
                                content: '';
                                width: 2px;
                                height: 70%;
                                background: #A9A9A9;
                                position: absolute;
                                top: 50%;
                                right: -3px;
                                transform: translateY(-50%);
                            }
                            >div:nth-of-type(2){
                                font-size: 12px;
                                font-family: Microsoft YaHei;
                                font-weight: 400;
                                color: #666666;
                            }
                        }
                        .batteryVoltage_class{
                            font-size: 12px;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #666666;
                        }
                    }
                }
                .devices_item_bottom{
                    display: flex;
                    justify-items: center;
                    position: relative;
                    >div{
                        width: 33%;
                        height: 28px;
                        border-right: 1px solid #EEEEEE;
                    }
                    >div:nth-of-type(3){
                        border-right: 0px;
                    }
                    .devices_item_bottom_more{
                        opacity:1;
                        -webkit-filter: none;
                        position: absolute;
                        bottom: 0px;
                        right: 0px;
                        z-index: 999;
                    }
                    /deep/ .el-button--mini{
                        // padding: 7px 15px;
                        width: 100%;
                        border: 0px;
                    }
                    /deep/ .el-dropdown {
                        font-size: 12px;
                        width: 100%;
                        text-align: center;
                    }
                    .devices_item_bottom_btn{
                        background: #D8E3FF !important;
                    }
                    .el-dropdown-link{
                        font-weight: 500;
                    }
                    .el-dropdown-link:hover{
                        color: #4D97FE;
                    }
                }
                .devices_item_bottom_two{
                    position: relative;
                    z-index: 99;
                    height: 28px;
                    display: flex;
                    cursor: pointer;
                    >div{
                        width: 50%;
                        font-size: 12px;
                        text-align: center;
                        line-height: 28px;
                        
                    }
                    .span_hover:hover{
                        color: #4D97FE;
                    }
                }
            }
            .devices_item_T{
                -webkit-filter : grayscale(100%);
                -moz-filter: grayscale(100%);
                -o-filter: grayscale(100%);
                filter: grayscale(100%);
                filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
            }
        }
        /deep/ .el-collapse{
            border: 0px !important;
        }
        /deep/ .el-collapse-item__header{
            border:0px !important;
            height: auto;
            line-height: 1;
            padding: 5px 0px;
        }
        /deep/ .el-collapse-item__arrow{
            display: none !important;
        }
        /deep/ .el-collapse-item__content{
            padding: 0px !important;
        }
    }
    .item_opacity{
        opacity:0.7;
        -webkit-filter:grayscale(100%);
    }
    .text_line{
        word-break:break-all;
        display:-webkit-box;
        -webkit-line-clamp:1;
        -webkit-box-orient:vertical;
        overflow:hidden;
    }

</style>
<template>
    <div class="app" :style="{height:height +'px',overflow:'hidden' }">
        <el-row>
            <el-col v-show="userType_parameter != 3" class="row_item" :span="4" :style="{height:height +'px'}">
                <!-- 客户列表 -->
                <userCompent @monitorUserId="evt_monitorUserId" :monitorId="monitorId"></userCompent>
            </el-col>
            <el-col class="row_item" :span="4" :style="{height:height +'px'}">
                <!-- 设备列表 -->
                <devicesCompent :userId="monitorUserId" :iconList="icon_list_t" :selectDeviceId="current_select_deviceId" @monitorDevicesList="evt_monitorDevicesList" @monitorSelectDevices="evt_select_devices" @monitorNetworkStatus="evt_change_type" @monitorPlayBack="evt_playback" @monitorMore="evt_more_command" @monitorPay="evt_pay" @monitorId="evt_monitorId"></devicesCompent>
            </el-col>
            <el-col class="row_item" :span="userType_parameter != 3 ? 16 : 20" :style="{height:height +'px'}">
                <div class="row_item_right">
                    <!-- 首次展示头部 -->
                    <div class="row_item_right_top" v-show="!track_detail">
                        <div>{{current_device_name != '' ? current_device_name + '：' + current_device_address : ''}}</div>
                        <div class="row_item_right_top_right">
                            <el-checkbox @change="evt_show_deviceName" v-model="show_deviceName">显示设备名称</el-checkbox>
                            <el-select @change="evt_change_refreshInterval" style="width:100px;margin-left:10px;" v-model="refresh_interval" size="mini">
                                <el-option label="10秒" value="10"></el-option>
                                <el-option label="30秒" value="30"></el-option>
                                <el-option label="1分钟" value="60"></el-option>
                            </el-select>
                            <div style="width:80px;font-size:12px;margin-left:5px;">刷新</div>
                        </div>
                    </div>
                    <!-- 回放头部 -->
                    <div class="playback_top" v-show="track_detail">
                        <el-row type="flex" align="middle" class="playback_top_top">
                            <el-col :span="4">
                                <span class="playback_top_text">设备名称:</span>
                                <span class="playback_top_text playback_top_text_t">{{current_device_name}}</span>
                            </el-col>
                            <el-col :span="2" class="playback_top_select_1">
                                 <el-select v-model="select_date" size="small" @change="evt_select_date">
                                    <el-option value="今天"></el-option>
                                    <el-option value="昨天"></el-option>
                                    <el-option value="最近一周"></el-option>
                                    <el-option value="自定义"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8" class="playback_top_date_picker">
                                <el-date-picker
                                    @change="evt_sure_select_time"
                                    v-model="select_date_time"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right" size="small" value-format="timestamp" :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="8" class="playback_top_select_2">
                                <div class="playback_top_select_2_div">
                                    <span>定位方式:</span>
                                    <el-select v-model="position_type" multiple size="small" placeholder="请选择">
                                        <el-option label="GPS定位"  value="1"></el-option>
                                        <el-option label="WIFI定位"  value="2"></el-option>
                                        <el-option label="基站定位" value="3"></el-option>
                                    </el-select>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row type="flex" align="middle">
                            <el-col :span="4">
                                <el-row type="flex" align="middle"> 
                                    <el-col :span="5">
                                        <i @click="evt_play_pause" v-if="!play_flag" class="video_play_icon el-icon-video-play"></i>
                                        <i @click="evt_play_pause" v-if="play_flag" class="video_play_icon el-icon-video-pause"></i>
                                    </el-col>
                                    <el-col :span="15" class="slider_style_1">
                                        <el-slider @change="evt_play_handle" :min="0" :step="1" :max="device_tracks_max" v-model="device_tracks_step" :show-tooltip="false"></el-slider>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="10">
                                <div class="speed_content">
                                    <span class="speed_content_text">速度：慢</span>
                                    <el-slider @change="evt_change_speed" class="slider_style_2" :min="100" :step="20" :max="500" v-model="speed" :show-tooltip="false"></el-slider>
                                    <span class="speed_content_text">快</span>
                                    <span style="margin-left:20px;" class="speed_content_text speed_content_text_t">总里程：{{total_distance}}km</span>
                                    <span style="width:100px;margin-left:20px;" class="speed_content_text speed_content_text_t">速度：{{speed_value != null ? speed_value : 0}}km/h</span>
                                </div>
                            </el-col>
                            <el-col :span="7" :offset="2">
                                <el-button @click="evt_query_tracks" type="primary" size="mini">确定</el-button>
                                <el-button @click="evt_show_tracksDetail" type="primary" size="mini">轨迹明细</el-button>
                                <el-button @click="evt_export" type="primary" size="mini">导出轨迹</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="map_container">
                        <div id="container"></div>
                        <div class="refresh_text" v-if="!track_detail">{{interval_num|formatTime}}后刷新</div>
                        <div class="map_type">
                            <div @click="evt_change_mapType('moon')">
                                <el-image style="width: 20px; height: 20px" :src="require('../../assets/img/moon.png')" fit="contain"></el-image>
                                <span>卫星</span>
                            </div>
                            <div @click="evt_change_mapType('map')">
                                <el-image style="width: 18px; height: 18px" :src="require('../../assets/img/map_icon.png')" fit="contain"></el-image>
                                <span>地图</span>
                            </div>
                        </div>
                    </div>
                    <!-- 轨迹明细 -->
                    <div class="track_detail" v-if="tracksDetail_flag">
                        <div class="track_detail_top">
                            <span>轨迹明细</span>
                            <div>
                                <!-- <el-button @click="evt_getAllAdress" type="primary" size="mini">一键解析定位</el-button> -->
                                <i @click="evt_close_tracksDetail" class="el-icon-circle-close"></i>
                            </div>
                        </div>
                        <controlTable :dataList="all_tracks_list" :step="device_tracks_step" :playFlag="play_flag" @handleCurrentChange="evt_handleCurrentChange"></controlTable>
                    </div>
                </div>
            </el-col>
        </el-row>

        <!-- 设备信息 -->
        <el-dialog class="device_info" lock-scroll title="设备信息" :visible="device_info_visible" @close="evt_close_deviceInfo">
            <el-row :gutter="10">
                <el-col :span="12" class="device_info_left">
                    <el-form>
                        <el-form-item label="设备名称:">
                            <el-input class="device_info_left_input_1" maxlength="15" size="small" v-model="device_name"></el-input>
                        </el-form-item>
                        <el-form-item label="设备型号:">
                            <span v-if="device_detail_info.deviceModel">{{device_detail_info.deviceModel.name}}</span>
                        </el-form-item>
                        <el-form-item label="激活时间:">
                            <span v-if="device_detail_info.activationTime">{{device_detail_info.activationTime|formatDate}}</span>
                            <span v-else>--</span>
                        </el-form-item>
                        <el-form-item label="服务到期时间:">
                            <span v-if="device_detail_info.serviceExpireTime">{{device_detail_info.serviceExpireTime|formatDate}}</span>
                            <span v-else>--</span>
                        </el-form-item>
                        <div style="display:flex;align-items: flex-start;">
                            <span style="flex-shrink: 0;font-size: 14px;color: #606266;margin-right:5px;line-height:18px;">适用范围:</span>
                            <div style="display:flex;flex-wrap: wrap;">
                                <img @click="evt_change_icon(item.code)" v-for="(item,index) in icon_list" :key="index" :src="range_code == item.code ? item.iconUrlActive : item.iconUrlInactive" class="icon_img_class"  />
                            </div>
                        </div>
                    </el-form>
                </el-col>
                <el-col :span="12" class="device_info_right">
                    <el-form>
                        <el-form-item label="设备号:">
                            <span>{{device_detail_info.deviceNumber}}</span>
                        </el-form-item>
                        <el-form-item label="网络状态:">
                            <span>{{device_detail_info.networkStatus == '1' ? device_detail_info.stationarySeconds != null ? '静止' : '在线' : '离线'}}</span>
                        </el-form-item>
                        <el-form-item label="销售时间:">
                            <span v-if="device_detail_info.sellTime">{{device_detail_info.sellTime|formatDate}}</span>
                            <span v-else>--</span>
                        </el-form-item>
                        <el-form-item label="导入时间:">
                            <span v-if="device_detail_info.createTime">{{device_detail_info.createTime|formatDate}}</span>
                            <span v-else>--</span>
                        </el-form-item>
                        <el-form-item label="ICCID:">
                            <!-- <el-input class="device_info_right_input_1" size="small" value="887887788789"></el-input> -->
                            <span>{{device_detail_info.iccid ? device_detail_info.iccid : '--'}}</span>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row>
                <el-col style="text-align: right;" :span="2">备注：</el-col>
                <el-col :span="22">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="remark_text"></el-input>
                </el-col>
            </el-row>
            <div class="device_info_btn">
                <el-button type="info" size="small" @click="evt_close_deviceInfo">取消</el-button>
                <el-button type="primary" size="small" @click="evt_update_deviceInfo">确认</el-button>
            </div>
        </el-dialog>

        <!-- 设备指令 -->
        <commandCompent :commandVisible="device_command_visible" :selection="multipleSelection" :handleDeviceId="need_handle_deviceId" @closeCommand="evt_closeCommand"></commandCompent>

        <!-- 充值 -->
        <dialog-recharge ref="dialogRecharge" :list="rechargeList"/>
    </div>
</template>
<script>
// 定位类型
// -1 - 无定位
// 1 - GPS
// 2 - WIFI
// 3 - 基站
// 网络状态
// 1 - 在线
// 2 - 离线
import api from '@/api/wechart/index'
import mixin from '@/mixins/index'
import { formatDate } from '@/plugins/date.js'
import {gcj02tobd09, bd09togcj02, gcj02towgs84, wgs84togcj02} from '@/utils/baidumap.js'
import sendOrder from './sendOrder.vue'
import controlTable from './control/table.vue'
import dialogRecharge from './dialogRecharge.vue'
import userCompent from './control/users.vue'
import devicesCompent from './control/devicesList.vue'
import commandCompent from './control/command.vue'
export default {
    name: 'electric',
    mixins:[mixin],
    components:{sendOrder,controlTable,dialogRecharge,userCompent,devicesCompent,commandCompent},
    data(){
        return{
            height: 0, //可视高度
            map: null,//实例化地图
            change_type:'all',//切换全部、在线、离线设备统计
            devices_list:[],//当前用户的设备列表
            device_info_visible:false,//设备具体信息的展示框
            device_command_visible:false,//设备指令弹框展示
            need_handle_deviceId:'',//更多下拉框需要进行操作的设备的id
            need_handle_deviceNumber: '',
            device_detail_info:{},//设备的详细信息
            device_name:'',//设备名称
            remark_text:'',//设备备注信息
            icon_list:[],//适用范围图标
            icon_list_t:{},
            range_code:'',//设备使用范围的code
            current_select_deviceId:'',//当前选择的设备id
            show_deviceName: true,//是否显示设备名称
            track_detail:false,//展示轨迹
            current_device_name:'',//当前选中设备的名称
            current_device_address:'',//当前选中设备的位置
            select_date:'今天',//选择日期
            select_date_time:[],//选择的日期时间
            startTime:0,//开始时间戳
            endTime:0,//结束时间戳
            position_type:['1','2'],//多选定位类型
            device_tracks:[],//设备轨迹信息
            device_tracks_shift:[],//回放过的轨迹信息
            play_flag:true,//播放与暂停 默认播放
            device_tracks_step:0,//轨迹播放步数
            device_tracks_max:0,//轨迹回放最大数
            device_tracks_interval:null,//轨迹回放定时器
            speed:300,
            tracksDetail_flag:false,//显示轨迹明细
            all_tracks_list:[],//查询日期内的全部轨迹
            table_row_info:{},//单选中的轨迹明细信息
            positionType:{
                '-1': '无定位',
                '1':'GPS',
                '2':'WIFI',
                '3': '基站'
            },
            playback_address:'',
            refresh_interval:'60',
            interval_num:60,//倒计时
            refresh_time_interval:null,
            current_login_user_info:{},//当前登录用户的信息
            userType_parameter: '',//请求接口拼接的用户类型
            command_status:{
                0: '已受理',
                1: '待发送',
                2: '等待设备响应',
                3: '已送达',
                4: '失败',
                5: '过期'
            },//指令状态
            multipleSelection:[],//使用下发指令模板传递的设备信息
            current_time:0,//当前时间戳
            props:{
                isLeaf: 'isLeaf'
            },
            zIndex: 1,//marker,label层级
            total_distance: 0,//总里程
            playbackMarker: null,//轨迹回放时的marker
            playbackPolyline: null,//轨迹回放的线型覆盖物
            infoBox:null,
            speed_value: 0,
            rechargeList: [],
            monitorUserId:'',//用户列表选择的用户Id
            nav_flag: false,
            monitorId: '',//选择设备的所属用户的id
            flag_num: 0,
        }
    },
    created(){
        this.userType_parameter = JSON.parse(sessionStorage['user']).userType;
        // 判断是否从首页搜索查看轨迹进入
        if(this.$route.query.deviceId){
            // this.track_detail = true;
            this.select_date_time = [new Date(new Date().toLocaleDateString()).getTime(),new Date().getTime()];
            this.play_flag = false;
            this.current_select_deviceId = this.$route.query.deviceId;
            this.need_handle_deviceId = this.$route.query.deviceId;
            this.need_handle_deviceNumber = this.$route.query.deviceNumber;
            // 获取设备详情信息
            this.evt_getDeviceInfo();
        }
        
        this.evt_getRangeIconList();
        
        // 当前时间戳
        this.current_time = new Date().getTime();
    },
    mounted(){
        this.height = document.body.offsetHeight - 72;
        this.map = new BMap.Map("container",{enableMapClick:false});
        this.map.enableScrollWheelZoom(true); 
        this.map.centerAndZoom(new BMap.Point(121.3515259,31.1285691),15);
        this.map.addControl(new BMap.NavigationControl());    
        this.map.addControl(new BMap.ScaleControl());    
        this.map.addControl(new BMap.OverviewMapControl());  
        // 路况信息控件
        var trafficControl = new BMapLib.TrafficControl();
        this.map.addControl(trafficControl);
        trafficControl.setAnchor(BMAP_ANCHOR_TOP_RIGHT);
        trafficControl.setOffset(new BMap.Size(20,110));
        // this.evt_addMarker();
        // 在字符串模板中绑定的事件
        window.evt_track = this.evt_track;
        window.evt_trace = this.evt_trace;
        window.evt_playback_address = this.evt_playback_address;
        window.evt_nav_fence = this.evt_nav_fence;
        
        if(!this.$route.query.deviceId){
            this.evt_refresh_interval();
        }
    },
    destroyed:function(){
        clearInterval(this.device_tracks_interval);
        clearInterval(this.refresh_time_interval);
    },
    methods: {
        // 设备所属用户id
        evt_monitorId:function(user_id){
            // console.log(user_id);
            this.monitorId = user_id;
        },
        // 监听选择客户
        evt_monitorUserId:function(userId){
            // console.log(userId);
            this.monitorUserId = userId;
            if(userId != JSON.parse(sessionStorage['user']).userId){
                this.current_select_deviceId = '';
            }
            clearInterval(this.device_tracks_interval);
            this.evt_clearOverlays();
            this.track_detail = false;
            this.position_type = ['1','2'];
            this.device_tracks_step = 0;
            this.tracksDetail_flag = false;
            if(this.flag_num != 0){
                this.interval_num = parseInt(this.refresh_interval);
                this.evt_refresh_interval();
            }
            this.flag_num = this.flag_num + 1;
        },
        // 监听设备列表改变事件
        evt_monitorDevicesList:function(devicesList){
            // console.log(devicesList);
            this.devices_list = devicesList;
            if(this.nav_flag) return;
            if(this.$route.query.deviceId == undefined) return;
            for(let i = 0, len = this.devices_list.length; i < len; i++){
                if(this.$route.query.deviceId && this.$route.query.deviceId == this.devices_list[i].id){
                    this.$set(this.devices_list[i],'checked',true);
                    this.nav_flag = true;
                    this.evt_route(this.devices_list[i]);
                }
            }
        },
        // 切换地图类型
        evt_change_mapType:function(type){
            if(type == 'moon'){
                this.map.setMapType(BMAP_HYBRID_MAP);
            }else{
                this.map.setMapType(BMAP_NORMAL_MAP);
            }
        },
        // 跳转到当前页查看轨迹的情况
        evt_route:function(info){
            var _this = this;
            var point = new BMap.Point(info.positionInfo.coordinate.lng,info.positionInfo.coordinate.lat);
            _this.evt_addMarker(point,info);
            if(_this.show_deviceName){
                _this.evt_addLabel(point,info);
            }
            _this.evt_addInfoWindow(point,info);
            // _this.map.panTo(point);
            _this.map.setCenter(point);
        },
        // 切换在线、离线
        evt_change_type:function(value){
            this.evt_clearOverlays();
            clearInterval(this.device_tracks_interval);
            this.track_detail = false;
            this.position_type = ['1','2'];
            this.device_tracks_step = 0;
            this.map.closeInfoWindow();
            this.tracksDetail_flag = false;
            this.interval_num = parseInt(this.refresh_interval);
            this.evt_refresh_interval();
        },
        // 选中、取消选择设备
        evt_select_devices:function(info){
            // console.log(info);
            var allOverlays = this.map.getOverlays();
            // console.log(allOverlays);
            clearInterval(this.device_tracks_interval);
            this.track_detail = false;
            this.position_type = ['1','2'];
            this.device_tracks_step = 0;
            this.device_tracks = [];
            this.device_tracks_shift = [];
            if(this.infoBox != null){
                this.infoBox.close();
            }
            for(var key in allOverlays){
                if( typeof(allOverlays[key].name) == 'number' || allOverlays[key].name == 'playFlag'){
                    this.map.removeOverlay(allOverlays[key]); 
                }
            }
            this.map.closeInfoWindow();
            this.tracksDetail_flag = false;
            this.current_select_deviceId = info.current_select_deviceId;
            if(info.type == 'add' && info.addOverlayInfo.positionInfo != null){
                for(var key in allOverlays){
                    if(allOverlays[key].point && allOverlays[key].point.lng == info.oldLng && allOverlays[key].point.lat == info.oldLat){
                        this.map.removeOverlay(allOverlays[key]); 
                    }
                }
                this.evt_addOverlay(info.addOverlayInfo);
                this.evt_getLocation(info.point);
                this.current_device_name = info.deviceName;
            }else if(info.type == 'delete'){
                // console.log(info.addOverlayInfo);
                this.evt_deleteOverlay(info.oldLng,info.oldLat);
            }else if(info.addOverlayInfo.positionInfo == null){
                this.current_device_address = '----';
                this.current_device_name = info.deviceName;
            }
            this.interval_num = parseInt(this.refresh_interval);
            this.evt_refresh_interval();
        },
        // 更多下拉框的操作
        evt_more_command:function(item){
            // console.log(item);
            this.need_handle_deviceId = item.deviceId;
            this.need_handle_deviceNumber = item.deviceNumber;
            if(item.type == 'detail'){
                this.evt_getDeviceInfo();
                this.device_info_visible = true;
            }else if(item.type == 'command'){
                this.device_command_visible = true;
                item.deviceInfo['model'] = item.deviceInfo.deviceModel.name;
                item.deviceInfo['username'] = item.deviceInfo.owner.username;
                this.multipleSelection = [item.deviceInfo];
                clearInterval(this.refresh_time_interval);
            }
        },
        // 关闭指令弹框
        evt_closeCommand:function(){
            this.device_command_visible = false;
            this.evt_refresh_interval();
        },
        // 关闭设备详情
        evt_close_deviceInfo:function(){
            this.device_info_visible = false;
        },
        // 获取设备详情信息
        evt_getDeviceInfo:function(){
            var _this = this;
            var request_data = {};
            request_data['deviceId'] = _this.need_handle_deviceId;
            api.getDeviceDetail(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success && res.data && Object.keys(res.data).length > 0){
                    _this.device_detail_info = res.data;
                    if(_this.$route.query.deviceId){
                        _this.track_detail = true;
                        _this.current_device_name = res.data.deviceName;
                        _this.speed_value = 0;
                    }
                    _this.device_name = res.data.deviceName;
                    _this.remark_text = res.data.remark;
                    _this.range_code = res.data.useRangeCode != null ? res.data.useRangeCode :'JiaoChe';
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:'error',offset:'200',duration:'1000'});
            })
        },
        // 获取适用范围的icon信息
        evt_getRangeIconList:function(){
            var _this = this;
            api.getRangeIconList({},_this.userType_parameter).then((res) => {
                if(res.success && Object.keys(res.data).length > 0){
                    var icon_list = [];
                    for(var key in res.data){
                        var item = {};
                        item['code'] = key;
                        for(var key_item in res.data[key]){
                            item[key_item] = res.data[key][key_item];
                        }
                        icon_list.push(item);
                    }
                    _this.icon_list = icon_list;
                    _this.icon_list_t = res.data;
                }
            }).catch((err) => {
                _this.$message({message:err.msg || '设备适用icon数据请求错误',type:'error',offset:'260',duration:'1500'})
            })
        },
        evt_change_icon:function(code){
            // console.log(code);
            this.range_code = code;
        },
        // 更新设备信息
        evt_update_deviceInfo:function(){
            var _this = this;
            if(_this.device_name.trim() == '') return;
            var request_data = {};
            request_data['deviceId'] = _this.need_handle_deviceId;
            request_data['deviceName'] = _this.device_name;
            request_data['remark'] = _this.remark_text;
            request_data['useRangeCode'] = _this.range_code;
            api.editDevices(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success){
                    for(var i = 0, len = _this.devices_list.length; i < len; i++){
                        if(_this.devices_list[i].id == _this.need_handle_deviceId){
                            _this.$set(_this.devices_list[i],'useRangeCode',_this.range_code);
                            _this.$set(_this.devices_list[i],'deviceName',_this.device_name);
                            break;
                        }
                    }
                    _this.device_info_visible = false;
                    _this.$message({message:'更新成功',type:'success',offset:"200",duration:'1000'});
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:"error",offset:'200',duration:'1000'})
            })
        },
        
        
        // 切换刷新时间
        evt_change_refreshInterval:function(value){
            // console.log(value);
            clearInterval(this.refresh_time_interval);
            this.interval_num = value;
            this.evt_refresh_interval();
        },
        // 刷新倒计时
        evt_refresh_interval:function(){
            var _this = this;
            let intervalTime = _this.interval_num;
            clearInterval(_this.refresh_time_interval);
            _this.refresh_time_interval = setInterval(() => {
                _this.interval_num--;
                if(_this.interval_num == 0){
                    _this.evt_refresh();
                    _this.interval_num = intervalTime;
                }
            }, 1000);
        },
        // 定时刷新
        evt_refresh:function(){
            var _this = this;
            var request_data = {};
            var deviceNumberList = [];
            for(var i = 0, len = _this.devices_list.length; i < len; i++){
                if(_this.devices_list[i].checked){
                    deviceNumberList.push(_this.devices_list[i].deviceNumber);
                }
            }
            if(deviceNumberList.length == 0){
                return;
            }
            if(_this.userType_parameter != '3' && _this.monitorUserId != JSON.parse(sessionStorage['user']).userId){
                request_data['childUserId'] = _this.monitorUserId;
            }
            request_data['coordinateSystem'] = 'BD09';
            request_data['deviceNumberList'] = deviceNumberList;
            api.getDevicesCoordinate(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success && res.data.length > 0){
                    _this.evt_clearOverlays();
                    var infoWindow_info = {};
                    for(var i = 0, len = _this.devices_list.length; i < len; i++){
                        for(var j = 0, j_len = res.data.length; j < j_len; j++){
                            if(_this.devices_list[i].id == res.data[j].deviceId && res.data[j].coordinate != null){
                                var point_t = gcj02tobd09(res.data[j].coordinate.lng,res.data[j].coordinate.lat);
                                res.data[j].coordinate.lng = point_t[0];
                                res.data[j].coordinate.lat = point_t[1];
                                _this.$set(_this.devices_list[i].positionInfo,'positionTime',res.data[j].time);
                                _this.$set(_this.devices_list[i].positionInfo,'coordinate',res.data[j].coordinate);
                                var point = new BMap.Point(_this.devices_list[i].positionInfo.coordinate.lng,_this.devices_list[i].positionInfo.coordinate.lat);
                                _this.evt_addMarker(point,_this.devices_list[i]);
                                if(_this.show_deviceName){
                                    _this.evt_addLabel(point,_this.devices_list[i]);
                                }
                                break;
                            }
                        }
                        if(_this.devices_list[i].id == _this.current_select_deviceId){
                            infoWindow_info = _this.devices_list[i];
                            var point_t = new BMap.Point(infoWindow_info.positionInfo.coordinate.lng,infoWindow_info.positionInfo.coordinate.lat);
                            _this.evt_addInfoWindow(point_t,infoWindow_info);
                            _this.map.setCenter(point_t);
                        }
                    }
                }else if(!res.success){
                    _this.$message({message: res.msg || '未知错误',type:'error',offset:'200',duration:'1000'});
                }
            }).catch((err) => {
                _this.$message({message: err.msg || '未知错误',type:'error',offset:'200',duration:'1000'});
            })
        },
         // 添加覆盖物
        evt_addOverlay:function(info){
            this.map.setZoom(15);
            var point = new BMap.Point(info.positionInfo.coordinate.lng,info.positionInfo.coordinate.lat);
            this.evt_addMarker(point,info);
            if(this.show_deviceName){
                this.evt_addLabel(point,info);
            }
            this.evt_addInfoWindow(point,info);
            // this.map.panTo(point);
            this.map.setCenter(point);
        },
        // 添加标记
        evt_addMarker:function(point,info){
            var _this = this;
            var icon_url = info.networkStatus == '1' ? info.stationarySeconds != null ? info.useRangeCode != null ?  _this.icon_list_t[info.useRangeCode].iconUrlForMapStationary : _this.icon_list_t['JiaoChe'].iconUrlForMapStationary : info.useRangeCode != null ? _this.icon_list_t[info.useRangeCode].iconUrlForMapActive :  _this.icon_list_t['JiaoChe'].iconUrlForMapActive : info.useRangeCode != null ? _this.icon_list_t[info.useRangeCode].iconUrlForMapInactive :  _this.icon_list_t['JiaoChe'].iconUrlForMapInactive;
            var marker_icon = new BMap.Icon(icon_url,new BMap.Size(30,48),{
                imageSize: new BMap.Size(30,48),
            });
            var marker = new BMap.Marker(point, {icon: marker_icon});
            marker.addEventListener('click',function(e){
                // console.log(e);
                for(let i = 0, len = _this.devices_list.length; i < len; i++){
                    // console.log('-----');
                    if(_this.devices_list[i].positionInfo && e.currentTarget.point.lng ==  _this.devices_list[i].positionInfo.coordinate.lng  && e.currentTarget.point.lat == _this.devices_list[i].positionInfo.coordinate.lat){
                        _this.map.closeInfoWindow();
                        var current_point = new BMap.Point(_this.devices_list[i].positionInfo.coordinate.lng,_this.devices_list[i].positionInfo.coordinate.lat);
                        _this.evt_addInfoWindow(current_point,_this.devices_list[i]);
                        break;
                    }
                }
            })
            marker.name = 'marker_device';
            marker.setZIndex(_this.zIndex + 1);
            this.map.addOverlay(marker);
        },
        // 添加label
        evt_addLabel:function(point,info){
            var html_content = `<div class="map_label"><span>${info.deviceName}</span></div>`
            var label = new BMap.Label(html_content,{position:point,offset:new BMap.Size(-66,-58)});
            label.setStyle({
                border:'0px',
                padding:'0px',
                borderRadius: '4px'
            });
            label.name = 'show_deviceName';
            label.setZIndex(this.zIndex + 1);
            this.map.addOverlay(label);
        },
        // 添加展示信息窗口
        evt_addInfoWindow:function(point,info){
            var infoWindow_html = `<div class="info_window_content">
                <div class="info_window_content_title">
                    <span>${info.deviceName}</span>
                </div>
                <div class="info_window_content_item">
                    <span>设备号：&nbsp&nbsp&nbsp${info.deviceNumber}</span>
                </div>
                <div class="info_window_content_item">
                    <span>网络状态：${info.networkStatus == '1' ? info.stationarySeconds != null ? '静止' : '在线' : '离线'}</span>
                </div>
                <div class="info_window_content_item">
                    <span>定位方式：${this.positionType[info.positionInfo.positionType]}</span>
                </div>
                ${info.accStatus != null ? `<div class="info_window_content_item"><span>ACC：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${info.accStatus == 0 ? '关':'开'}</span></div>` : ''}
                ${(info.battery != null || info.batteryVoltage != null) ? `<div class="info_window_content_item">
                    <span>${info.battery != null ? '电量：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp' + info.battery + '%' : '电压：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'+ info.batteryVoltage + 'V'}</span>
                </div>` : ''}
                ${info.oilWay != null ? `<div class="info_window_content_item"><span>油电状态：${info.oilWay == 0 ? '正常':'断开'}</span></div>`:''}
                ${info.csq != null ? `<div class="info_window_content_item"><span>信号：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${info.csq}</span></div>`:''}
                ${info.alertStatus != null ? `<div class="info_window_content_item"><span>防盗状态：${info.alertStatus == 0 ? '撤防' : '设防'}</span></div>`:''}
                ${info.mileageKm && info.mileageKm != null ? `<div class="info_window_content_item"><span>总里程：${info.mileageKm}km</span></div>`:''}
                ${info.workStatus != null ? `<div class="info_window_content_item"><span>工作状态：${info.workStatus == 0 ? '正常':'休眠'}</span></div>`:''}
                <div class="info_window_content_item">
                    <span>定位时间：${this.evt_formatDate(info.positionInfo.positionTime)}</span>
                </div>
                <div class="info_window_content_item">
                    <span>经度：${this.evt_formatLatLng(info.positionInfo.coordinate.lng)}</span>
                    <span class="info_window_content_item_right">纬度：${this.evt_formatLatLng(info.positionInfo.coordinate.lat)}</span>
                </div>
                <div class="info_window_content_btn">
                    <div onClick="evt_trace('${info.id}','panorama')">街景</div>
                    <div onClick="evt_trace('${info.id}','trace')">跟踪</div>
                    <div onClick="evt_track('${info.id}','${info.deviceName}','${info.deviceNumber}')">轨迹</div>
                    <div onClick="evt_nav_fence('${info.deviceName}','${info.id}')">电子围栏</div>
                </div>
            </div>`
            var infoWindow = new BMap.InfoWindow(infoWindow_html,{enableCloseOnClick:false});
            this.map.openInfoWindow(infoWindow,point);
        },
        // 删除指定的覆盖物
        evt_deleteOverlay:function(lng,lat){
            var allOverlays = this.map.getOverlays();
            for(var key in allOverlays){
                if(allOverlays[key].point && allOverlays[key].point.lng == lng && allOverlays[key].point.lat == lat){
                    this.map.removeOverlay(allOverlays[key])
                }
            }
            this.map.closeInfoWindow();
        },
        // 删除所有覆盖物 切换用户时调用
        evt_clearOverlays:function(){
            this.map.clearOverlays();
            this.map.closeInfoWindow();
        },
        // 是否显示设备名称
        evt_show_deviceName:function(){
            // console.log(this.show_deviceName);
            var allOverlays = this.map.getOverlays();
            if(!this.show_deviceName){
                for(var key in allOverlays){
                    if(allOverlays[key].name == 'show_deviceName'){
                        this.map.removeOverlay(allOverlays[key]);
                    }
                }
            }else{
                for(var key in allOverlays){
                    if(allOverlays[key].name == 'marker_device'){
                        var lng = allOverlays[key].point.lng,
                            lat = allOverlays[key].point.lat;
                        for(var item in this.devices_list){
                            if(this.devices_list[item].positionInfo != null && this.devices_list[item].positionInfo.coordinate != null && this.devices_list[item].positionInfo.coordinate.lng == lng && this.devices_list[item].positionInfo.coordinate.lat == lat){
                                var current_point = new BMap.Point(lng,lat);
                                this.evt_addLabel(current_point,this.devices_list[item]);
                            }
                        }
                    }
                }
            }
        },
        // 获取位置信息
        evt_getLocation:function(point){
            var _this = this;
            var geocoder = new BMap.Geocoder();
            geocoder.getLocation(point,function(result){
                // console.log(result);
                if(result.address){
                    _this.current_device_address = result.address;
                }
            })
        },
        // 追踪
        evt_trace:function(deviceId,panorama){
            let routeUrl = this.$router.resolve({
                path: "/trace",
                query: {deviceId:deviceId,panorama:panorama == 'panorama' ? 'panorama':'trace'}
            });
            window.open(routeUrl.href, '_blank');
        },
        // 跳转电子围栏
        evt_nav_fence:function(deviceName,deviceId){
            this.$router.push({path:'/electric/electric',query:{deviceName:deviceName,deviceId:deviceId}});
        },
        // 信息窗口上的轨迹
        evt_track:function(deviceId,deviceName,deviceNumber){
            // console.log(deviceId,deviceName);
            // this.evt_clearOverlays();
            var _this = this;
            _this.need_handle_deviceId = deviceId;
            _this.need_handle_deviceNumber = deviceNumber;
            _this.select_date = '今天';
            // this.evt_queryDeviceTracks(this.select_date_time[0],this.select_date_time[1],this.need_handle_deviceId);
            var request_data = {};
            request_data['deviceId'] = _this.need_handle_deviceId;
            api.getDeviceDetail(request_data,_this.userType_parameter).then((res) => {
                console.log(res);
                if(res.success && res.data && Object.keys(res.data).length > 0){
                    clearInterval(_this.refresh_time_interval);
                    _this.device_detail_info = res.data;
                    _this.track_detail = true;
                    _this.play_flag = false;
                    _this.current_device_name = deviceName;
                    _this.select_date_time = [new Date(new Date().toLocaleDateString()).getTime(),new Date().getTime()];
                    _this.speed_value = 0;
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:'error',offset:'200',duration:'1000'});
            })
        },
        // 轨迹回放
        evt_playback:function(item){
            // console.log(item);
            this.device_detail_info = item;
            this.evt_clearOverlays();
            this.need_handle_deviceId = item.id;
            this.need_handle_deviceNumber = item.deviceNumber;
            this.track_detail = true;
            this.current_device_name = item.deviceName;
            this.select_date_time = [new Date(new Date().toLocaleDateString()).getTime(),new Date().getTime()];
            this.select_date = '今天';
            this.evt_queryDeviceTracks(this.select_date_time[0],this.select_date_time[1],this.need_handle_deviceId);
            clearInterval(this.refresh_time_interval);
            this.speed_value = 0;
        },
        // 获取设备轨迹
        evt_queryDeviceTracks:function(startTime,endTime,deviceId,type){
            var _this = this;
            var request_data = {};
            request_data['startTime'] = startTime;
            request_data['endTime'] = endTime;
            request_data['deviceId'] = deviceId;
            request_data['coordinateSystem'] = 'BD09'
            request_data['positionTypes'] = _this.position_type;
            api.queryDeviceTracks(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success){
                    if(type != 'tracksDetail'){
                        clearInterval(_this.device_tracks_interval);
                        _this.device_tracks_step = 0;
                        _this.device_tracks = [];
                        _this.device_tracks_shift = [];
                        _this.map.clearOverlays();
                    }
                    // 若无轨迹信息 提示 return
                    if(res.data && res.data.length == 0) {
                        _this.total_distance = 0;
                        _this.$message({message:'无轨迹信息',type:'warning',offset:'200',duration:'1500'});
                        _this.play_flag = false;
                        _this.all_tracks_list = [];
                        return;
                    }
                    _this.total_distance = (res.data[res.data.length - 1].mileageKm - res.data[0].mileageKm) > 0.001 ? (res.data[res.data.length - 1].mileageKm - res.data[0].mileageKm).toFixed(3) : 0;//总里程
                    var point_arr = [];
                    for(let i = 0, len = res.data.length; i < len; i++){
                        if(res.data[i].coordinate && Object.keys(res.data[i].coordinate).length > 0){
                            var item = JSON.parse(JSON.stringify(res.data[i]));
                            // item['time'] = res.data[i].time;
                            item['lat'] = res.data[i].coordinate.lat;
                            item['lng'] = res.data[i].coordinate.lng;
                            // item['address'] = 'address';
                            item['positionType'] = res.data[i].positionType;
                            point_arr.push(item);
                        }
                    }
                    // 获取轨迹明细时拿到数据
                    var all_tracks_list = [];
                    for(let i = 0, len = point_arr.length; i < len; i++){//防止浅拷贝
                        all_tracks_list.push(point_arr[i]);
                    }
                    _this.all_tracks_list = all_tracks_list;
                    if(type == 'tracksDetail'){
                        return;
                    }
                    _this.device_tracks = point_arr;
                    _this.device_tracks_max = _this.device_tracks.length;
                    _this.play_flag = true;
                    
                    _this.map.setCenter(new BMap.Point(_this.device_tracks[0].lng,_this.device_tracks[0].lat));
                    
                    // 轨迹回放添加marker
                    _this.evt_playback_addMarker(new BMap.Point(_this.device_tracks[0].lng,_this.device_tracks[0].lat));
                    // 添加轨迹线
                    var Polyline = new BMap.Polyline([new BMap.Point(_this.device_tracks[0].lng,_this.device_tracks[0].lat)], {strokeColor: '#0cf36b',strokeWeight:5,strokeOpacity:1});
                    Polyline.name = 'playFlag';
                    _this.map.addOverlay(Polyline);
                    _this.playbackPolyline = Polyline;
                    // marker上的信息窗口
                    _this.evt_playback_infoWindow(new BMap.Point(_this.device_tracks[0].lng,_this.device_tracks[0].lat),point_arr[0]);
                    _this.evt_LuShu();
                }else{
                    _this.$message({message:res.msg,type:"info",offset:"200",duration:"1500"});
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:"error",offset:"200",duration:"1500"});
            })
        },
        // 轨迹回放
        evt_LuShu:function(arr_point){
            // console.log(arr_point)
            var _this = this;
            var Polyline_points = arr_point || [];
            var speed =  600 - _this.speed;
            _this.device_tracks_interval = setInterval(() => {
                if(_this.device_tracks.length > 0){
                    var raw_point = _this.device_tracks.shift();
                    _this.device_tracks_shift.push(raw_point);
                    var point = new BMap.Point(raw_point.lng,raw_point.lat);
                    Polyline_points.push(point);

                    var Bounds = _this.map.getBounds();
                    if(!Bounds.containsPoint(point)){
                        _this.map.panTo(point);
                    }
                    // 添加线型覆盖物
                    _this.playbackPolyline.setPath(Polyline_points);
                    // marker
                    _this.playbackMarker.setPosition(point);
                    // 信息窗口
                    var infoWindow_html = `
                        <div class="tracks_label_html">
                            <div class="tracks_label_html_item">定位方式：${this.positionType[raw_point.positionType]}</div>
                            <div class="tracks_label_html_item">速度：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${raw_point.speed != null ? raw_point.speed : '0'}km/h</div>
                            <div class="tracks_label_html_item">定位时间：${this.evt_formatDate(raw_point.time)}</div>
                            <div class="tracks_label_html_item_flex">
                                <div>定位位置：</div>
                                <div class="tracks_label_html_item_click">${raw_point.address != null ? raw_point.address :'--'}</div>
                            </div>
                        </div>
                    `;
                    _this.speed_value = raw_point.speed;
                    _this.infoBox.setContent(infoWindow_html);
                    _this.infoBox.setPosition(point);

                    _this.device_tracks_step += 1;
                    if(!_this.play_flag){
                        clearInterval(_this.device_tracks_interval);
                    }
                }else{
                    clearInterval(_this.device_tracks_interval);
                    _this.play_flag = false;
                    _this.$confirm('轨迹回放完毕', '提示', {
                        confirmButtonText: '重播',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                       _this.evt_play_pause();
                    }).catch(() => {
                        
                    });
                }
            }, speed);
        },
        // 轨迹回放的marker
        evt_playback_addMarker:function(point){
            var _this = this;
            var device_info = _this.device_detail_info;
            var icon_url = device_info.networkStatus == '1' ? device_info.useRangeCode  != null ? _this.icon_list_t[device_info.useRangeCode].iconUrlForMapActive :  _this.icon_list_t['JiaoChe'].iconUrlForMapActive : device_info.useRangeCode != null ? _this.icon_list_t[device_info.useRangeCode].iconUrlForMapActive :  _this.icon_list_t['JiaoChe'].iconUrlForMapActive;
            var marker_icon = new BMap.Icon(icon_url,new BMap.Size(30,48),{
                imageSize: new BMap.Size(30,48),
            });
            var marker = new BMap.Marker(point, {icon: marker_icon});
            marker.addEventListener('click',function(e){
                var point = new BMap.Point(e.currentTarget.point.lng,e.currentTarget.point.lat);
                _this.infoBox.open(point);
            })
            marker.name = 'playFlag';
            _this.map.addOverlay(marker);
            _this.playbackMarker = marker;
        },
        // 轨迹回放的信息窗口
        evt_playback_infoWindow:function(point,info){
            var _this = this;
            var infoWindow_html = `
                <div class="tracks_label_html">
                    <div class="tracks_label_html_item">定位方式：${this.positionType[info.positionType]}</div>
                    <div class="tracks_label_html_item">速度：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${info.speed != null ? info.speed : '0'}km/h</div>
                    <div class="tracks_label_html_item">定位时间：${this.evt_formatDate(info.time)}</div>
                    <div class="tracks_label_html_item_flex">
                        <div>定位位置：</div>
                        <div class="tracks_label_html_item_click">${info.address != null ? info.address : '--'}</div>
                    </div>
                </div>
            `
            _this.speed_value = info.speed;
            var infoBox = new BMapLib.InfoBox(_this.map,infoWindow_html,{'closeIconMargin': "10px 10px 0 0",'closeIconUrl': require('../../assets/img/cancel_icon.png'),'offset':new BMap.Size(34,20)});
            infoBox.open(point);
            _this.infoBox = infoBox;
        },
        evt_playback_address:function(lng,lat,time,positionType){
            var _this = this;
            var geocoder = new BMap.Geocoder();
            var point = new BMap.Point(lng,lat);
            geocoder.getLocation(point,function(result){
                if(result.address){
                    _this.playback_address = result.address;
                    // var info = _this.device_tracks_shift[_this.device_tracks_shift.length - 1];
                    var info = {};
                    info['lng'] = lng;
                    info['lat'] = lat;
                    info['time'] = parseInt(time);
                    info['positionType'] = positionType;
                    console.log(info);
                    _this.evt_playback_infoWindow(point,info);
                }
            })
        },
        // 切换今天、昨天等
        evt_select_date:function(e){
            if(e == '今天'){
                this.select_date_time = [new Date(new Date().toLocaleDateString()).getTime(),new Date().getTime()];
            }else if(e == '昨天'){
                this.select_date_time = [new Date(new Date().toLocaleDateString()).getTime() - 3600 * 24 * 1000,new Date(new Date().toLocaleDateString()).getTime() - 1000];
            }else if(e == '最近一周'){
                this.select_date_time = [new Date().getTime() - 3600 * 24 * 1000 * 7,new Date().getTime()];
            }
        },
        evt_sure_select_time:function(e){
            if(e instanceof Array && (e[1] - e[0]) > (60 * 24 * 60 * 60 * 1000)){
                this.$message({message: '开始时间至结束时间不得超过60天', type:'warning',offset:'400',duration:'3000'})
            }
            this.select_date = '自定义';
        },
        // 播放与暂停
        evt_play_pause:function(){
            this.play_flag = !this.play_flag;
            if(!this.play_flag){
                clearInterval(this.device_tracks_interval);
            }else{
                if(this.device_tracks_step != 0 && this.device_tracks_step != this.device_tracks_max){
                    var arr_point = [];
                    for(var i = 0, len = this.device_tracks_shift.length; i < len; i++){
                        arr_point.push(new BMap.Point(this.device_tracks_shift[i].lng,this.device_tracks_shift[i].lat))
                    }
                    this.evt_LuShu(arr_point);
                }else{
                    this.evt_clearOverlays();
                    this.evt_queryDeviceTracks(this.select_date_time[0],this.select_date_time[1],this.need_handle_deviceId);
                }
            }
        },
        // 播放滑动
        evt_play_handle:function(){
            // console.log(this.device_tracks_step);
            if(this.device_tracks_step == this.device_tracks_shift.length) return;
            clearInterval(this.device_tracks_interval);
            if(this.device_tracks_shift.length >= 0 && this.device_tracks_step > this.device_tracks_shift.length){
                if(this.device_tracks_step == this.device_tracks_max){
                    this.device_tracks_step = this.device_tracks_max - 1;
                }
                var interval = this.device_tracks_step - this.device_tracks_shift.length;
                this.device_tracks_shift = this.device_tracks_shift.concat(this.device_tracks.splice(0,interval));
               
            }else if(this.device_tracks_step < this.device_tracks_shift.length){
                var interval =  this.device_tracks_shift.length - this.device_tracks_step;
                var delete_index = this.device_tracks_shift.length - interval;
                this.device_tracks = this.device_tracks_shift.splice(delete_index,interval).concat(this.device_tracks);
            }
            var arr_point = [];
            for(let i = 0, len = this.device_tracks_shift.length; i < len; i++){
                arr_point.push(new BMap.Point(this.device_tracks_shift[i].lng,this.device_tracks_shift[i].lat))
            }
            this.evt_LuShu(arr_point);
        },
        // 改变播放速度
        evt_change_speed:function(){
            clearInterval(this.device_tracks_interval);
            var arr_point = [];
            for(let i = 0, len = this.device_tracks_shift.length; i < len; i++){
                arr_point.push(new BMap.Point(this.device_tracks_shift[i].lng,this.device_tracks_shift[i].lat))
            }
            this.evt_LuShu(arr_point);
        },
        // 选择不同时间确定查询轨迹
        evt_query_tracks:function(){
            if(this.select_date_time == null){
                this.$message({message: '请选择轨迹查询时间', type:'warning',offset:'400',duration:'2000'})
                return;
            }
            if((this.select_date_time[1] - this.select_date_time[0]) > (60 * 24 * 60 * 60 * 1000) ){
                this.$message({message: '开始时间至结束时间不得超过60天', type:'warning',offset:'400',duration:'3000'})
                return;
            }
            this.evt_clearOverlays();
            this.evt_queryDeviceTracks(this.select_date_time[0],this.select_date_time[1],this.need_handle_deviceId);
        },
        // 点击table轨迹明细中的行
        evt_handleCurrentChange:function(row){
            // console.log(row);
            this.table_row_info = row;
            var point = new BMap.Point(row.lng,row.lat);
            this.map.panTo(point);
            this.playbackMarker.setPosition(point);
            var infoWindow_html = `
                <div class="tracks_label_html">
                    <div class="tracks_label_html_item">定位方式：${this.positionType[row.positionType]}</div>
                    <div class="tracks_label_html_item">速度：&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${row.speed != null ? row.speed : '0'}km/h</div>
                    <div class="tracks_label_html_item">定位时间：${this.evt_formatDate(row.time)}</div>
                    <div class="tracks_label_html_item_flex">
                        <div>定位位置：</div>
                        <div class="tracks_label_html_item_click">${row.address != null ? row.address :'--'}</div>
                    </div>
                </div>
            `;
            this.speed_value = row.speed;
            this.infoBox.setContent(infoWindow_html);
            this.infoBox.setPosition(point);

        },
        // 轨迹明细
        evt_show_tracksDetail:function(){
            if(this.select_date_time == null){
                this.$message({message: '请选择轨迹查询时间', type:'warning',offset:'400',duration:'2000'})
                return;
            }
            if((this.select_date_time[1] - this.select_date_time[0]) > (60 * 24 * 60 * 60 * 1000) ){
                this.$message({message: '开始时间至结束时间不得超过60天', type:'warning',offset:'400',duration:'3000'})
                return;
            }
            if(this.tracksDetail_flag) return;
            this.tracksDetail_flag = true;
            this.evt_queryDeviceTracks(this.select_date_time[0],this.select_date_time[1],this.need_handle_deviceId,'tracksDetail');
        },
        evt_close_tracksDetail:function(){
            this.tracksDetail_flag = false;
        },
        // infoWindow格式化时间格式
        evt_formatDate:function(time){
            let date_time = new Date(time);
            return isNaN(date_time) ? "--" : formatDate(date_time,'yyyy-MM-dd hh:mm:ss');
        },
        evt_formatLatLng:function(info){
            var info = info.toString();
            return info.slice(0,info.indexOf('.')+7);
        },
        // 导出轨迹明细
        evt_export:function(){
            var _this = this;
            if(_this.select_date_time == null){
                _this.$message({message: '请选择导出轨迹区间时间', type:'warning',offset:'400',duration:'2000'})
                return;
            }
            if((_this.select_date_time[1] - this.select_date_time[0]) > (60 * 24 * 60 * 60 * 1000) ){
                _this.$message({message: '开始时间至结束时间不得超过60天', type:'warning',offset:'400',duration:'3000'})
                return;
            }
            var request_data = {};
            request_data['startTime'] = _this.select_date_time[0];
            request_data['endTime'] = _this.select_date_time[1];
            request_data['coordinateSystem'] = 'BD09';
            request_data['deviceId'] = _this.need_handle_deviceId;
            request_data['positionTypes'] = _this.position_type;
            api.downloadDeviceTracks(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                var blob = new Blob([res],{type: "application/vnd.ms-excel"});
                var url  = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                var myDate = new Date();
                var Y = myDate.getFullYear();
                var M = (myDate.getMonth() + 1) > 9 ? myDate.getMonth() + 1 : '0' + (myDate.getMonth() + 1);
                var D = myDate.getDate() > 9 ? myDate.getDate() : '0' + myDate.getDate();
                var H = myDate.getHours() > 9 ? myDate.getHours() : '0' + myDate.getHours();
                var m = myDate.getMinutes() > 9 ? myDate.getMinutes() : '0' + myDate.getMinutes();
                var s = myDate.getSeconds() > 9 ? myDate.getSeconds() : '0' + myDate.getSeconds();         
                link.download = '轨迹明细_' + _this.need_handle_deviceNumber + '_' + Y + M + D + H + m + s + '.xlsx';
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url); 
                document.body.removeChild(link);
            })
        },
        evt_pay:function(deviceNumber){
            this.rechargeList = [];
            this.$refs.dialogRecharge.dialogVisible = true
            clearInterval(this.refresh_time_interval);
            this.$nextTick(() => {
                this.$refs.dialogRecharge.searchImei = deviceNumber
                this.$refs.dialogRecharge.tempNum = 1
                this.$refs.dialogRecharge.flag = 1
            })
        }
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
#map{
    width: 100%;
    height:600px;
}
.app{
    /* margin: 0;
    padding: 20px;
    background:#ccc; */
}
.row_item{
    border-right: 1px solid #DDDDDD;
}

.row_item_right{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.row_item_right_top{
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #DDDDDD;
    box-sizing: border-box;
    padding: 0px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div:nth-of-type(1){
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #666666;
        line-height: 40px;
    }
    .row_item_right_top_right{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
}
.map_container{
    flex: 1;
    width: 100%;
    position: relative;
    .refresh_text{
        height: 30px;
        padding: 0px 10px;
        background: #FFFFFF;
        box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.35);
        border-radius: 4px;
        cursor: pointer;
        position: absolute;
        top: 20px;
        left: 80px;
        z-index: 999;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 500;
        color: #FF4C4C;
        line-height: 30px;
        text-align: center;
    }
    .map_type{
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 99;
        >div{
            width: 70px;
            height: 32px;
            background: #FFFFFF;
            box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.35);
            border-radius: 4px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            >span{
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #666666;
                margin-left: 6px;
            }
        }
    }
}
#container{
    // flex: 1;
    width: 100%;
    height: 100%;
}
.add_tag_dialog{
    display: flex;
    justify-content: center;
    align-items: center;
    .add_tag_dialog_input{
        width: 60%;
        margin-left: 10px;
    }
}
.add_tag_dialog_btn{
    width: 100%;
    margin-top: 6vh;
    display: flex;
    justify-content: space-evenly;
}
.playback_top{
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    .playback_top_text{
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #666666;
        // line-height: 39px;
    }
    .playback_top_text_t{
        color: #547CEC;
    }
    .playback_top_select_1{
        margin-right: 5px;
        // /deep/ .el-input{
        //     font-size: 12px !important;
        //     height: 34px;
        // }
        // /deep/ .el-input__inner{
        //     height: 34px  !important;
        //     line-height: 1  !important;
        //     padding: 8px 5px !important;
        // }
        // /deep/ .el-input__icon{
        //     line-height: 1 !important;
        // }
    }
    .playback_top_date_picker{
        /deep/ .el-range-editor.el-input__inner{
            padding: 0px !important;
        }
        /deep/ .el-date-editor--datetimerange.el-input__inner{
            width: 100% !important;
        }
        /deep/ .el-date-editor.el-input__inner {
            width: 100% !important;
        }
        /deep/ .el-input__inner{
            // height: auto !important;
            line-height: 1 !important;
            // padding: 5px !important;
        }
        /deep/ .el-range-editor--small .el-range-separator{
            line-height: 30px;
        }
        /deep/ .el-range-editor--small .el-range__icon{
            line-height: 30px;
        }
        // /deep/ .el-date-editor .el-range-input{
        //     font-size: 12px !important;
        // }
        // /deep/  .el-date-editor .el-range-separator {
        //     font-size: 12px !important;
        // }
        /deep/ .el-range__close-icon{
            display: none;
        }
    }
    .playback_top_select_2{
        margin-left: 5px;
        margin-right: 5px;
        .playback_top_select_2_div{
            display: flex;
            justify-items: flex-start;
            align-items: center;
            >span:nth-of-type(1){
                flex-shrink: 0;
                font-size: 12px;
            }
        }
    }
    .video_play_icon{
        font-size: 24px;
        cursor: pointer;
    }
    .slider_style_1{
        /deep/ .el-slider__runway{
            margin: 0px;
        }
        /deep/ .el-slider__bar{
            background: #AAAAAA;
        }
        /deep/ .el-slider__button{
            width: 14px;
            height: 14px;
            background-color:#999999;
            border: 0px;
        }
    }
    .speed_content{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .speed_content_text{
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #666666;
        }
        .speed_content_text_t{
            margin-left: 5px;
        }
        .slider_style_2{
            flex: 1;
            margin: 0px 10px;
            /deep/ .el-slider__button{
                width: 6px;
                border-radius: 0px;
                border: 0px;
                background: #409EFF;
            }
        }
    }
    .playback_top_top{
        margin-bottom: 10px;
    }
    /deep/ .el-slider__button-wrapper{
        width: 22px;
        height: 22px;
        top: -10px;
    }
}
.track_detail{
    width: 100%;
    height: 300px;
    background: #FFFFFF;
    padding: 10px;
    box-sizing: border-box;
    .track_detail_top{
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        >span{
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #666666;
        }
        >div{
            >i{
                cursor: pointer;
                margin-right: 20px;
                margin-left: 10px;
            }
        }
    }
}
.device_info{
    /deep/  .el-dialog__header{
        padding: 12px 20px;
        margin-bottom: 10px;
        background: #648EF8;
    }
    /deep/ .el-dialog__body{
        padding-top: 0px;
    }
    /deep/ .el-form-item{
        margin-bottom: 5px;
    }
    /deep/ .el-form-item__content{
        line-height: 30px;
    }
    /deep/ .el-form-item__label{
        line-height: 30px;
    }
    /deep/ .el-dialog__title{
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #EFEFEF;
    }
    /deep/ .el-dialog__headerbtn .el-dialog__close{
        color: #EFEFEF;
    }
    /deep/ .el-dialog__headerbtn{
        top: 14px;
    }
}
.device_info_left{
    .device_info_left_input_1{
        width: 60%;
    }
    .device_info_left_select{
        width: 60%;
    }
    .icon_img_class{
        margin-right: 5px;
        margin-bottom: 5px;
        // width: 18px;
        cursor: pointer;
    }
}
.device_info_right{
    .device_info_right_input_1{
        width: 60%;
    }
}
.device_info_btn{
    display: flex;
    justify-content: center;
    margin-top: 4vh;
}

/deep/ .anchorBL {
    display: block; 
}
/deep/ .BMap_cpyCtrl {
    display: block; 
}
/deep/ .map_label{
    width: 120px;
    height: 26px;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.35);
    border-radius: 4px;
    padding: 0px 5px;
    position: relative;
}
/deep/ .map_label span{
    display: block;
    width: 100%;
    height: 100%;
    font-size: 12px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    text-align: center;
    line-height: 26px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/deep/ .map_label::before{
    content: '';
    width: 12px;
    height: 12px;
    border-top: 1px solid #CCCCCC;
    border-left: 1px solid #CCCCCC;
    background: #ffffff;
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%) rotate(-135deg);
}
/deep/ .info_window_content{
    // position: relative;
    // // top: 100px;
    // // left: 500px;
    // width: 260px;
    // // height: 200px;
    // border: 1px solid #999999;
    // box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.35);
    // background: #ffffff;
    // border-radius: 4px;
    // padding: 20px;
    .info_window_content_title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        >span:nth-of-type(1){
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #333333;
        }
        >span:nth-of-type(2){
            flex-shrink: 0;
            margin-left: 5px;
            cursor: pointer;
        }
    }
    .info_window_content_item{
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        >span{
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #333333;
        }
        .info_window_content_item_right{
            // margin-left: 10px;
        }
    }
    .info_window_content_btn{
        margin-top: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        >div{
            cursor: pointer;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #218FFF;
        }
    }
}
/deep/ .BMap_pop div:nth-child(1){
    border-radius:7px 0 0 0;
}
/deep/ .BMap_pop div:nth-child(3){
    border-radius:0 7px 0 0;
}
/deep/ .BMap_pop div:nth-child(3) div{
    border-radius:7px;
}
/deep/ .BMap_pop div:nth-child(5){
    border-radius:0 0 0 7px;
}
/deep/ .BMap_pop div:nth-child(5) div{
    border-radius:7px;
}
/deep/ .BMap_pop div:nth-child(7){
    border-radius:0 0 7px 0 ;
}
/deep/ .BMap_pop div:nth-child(7) div{
    border-radius:7px ;
}
/deep/ .BMap_shadow{
    display:none;
}
/deep/ .tracks_label_html{
    cursor: pointer;
    background: #ffffff;
    width: 260px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #666666;
    border-radius: 4px;
    .tracks_label_html_item{
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        margin-bottom: 6px;
    }
    .tracks_label_html_item_flex{
        display: flex;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        >div:nth-of-type(1){
            flex-shrink: 0;
        }
        .tracks_label_html_item_click{
            color: #4391FE;
        }
    }
}
/deep/ .infoBox::after{
    content: '';
    width: 10px;
    height: 10px;
    background: #ffffff;
    border-bottom: 1px solid #666666;
    border-right: 1px solid #666666;
    position: absolute;
    bottom: -9px;
    left: 50%;
    transform: rotate(45deg) translateX(-50%);
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
<style>
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
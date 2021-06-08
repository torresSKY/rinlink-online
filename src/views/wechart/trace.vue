<template>
    <div class="page">
        <div class="page_top">{{device_detail_info.deviceName}}：{{device_address}}</div>
        <div class="map_container">
            <div id="container"></div>
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
            <div class="interval_content">{{interval_num}}秒后刷新</div>
        </div>
        <div id="vista" v-show="Panorama_flag">
            <i @click="evt_close" class="vista_close el-icon-circle-close"></i>
        </div>
    </div>
</template>

<script>
var geocoder = new BMap.Geocoder();
import api from '@/api/wechart/index'
import { formatDate } from '@/plugins/date.js'
import {gcj02tobd09, bd09togcj02, gcj02towgs84, wgs84togcj02} from '@/utils/baidumap.js'
export default {
    name:'trace',
    data(){
        return{
            map:null,
            locationInfo:{},//设备最新位置信息
            deviceName:'',//设备名称
            locationArr:[],//设备位置集合
            Panorama:null,
            Panorama_flag:false,//是否显示街景
            device_address:'',//设备地址
            deviceId:'',
            interval:null,//刷新间隔
            interval_num:0,
            userType_parameter: '',//请求接口拼接的用户类型
            deviceNumber:'',
            device_detail_info:'',
            icon_list:{},
        }
    },
    created(){
        // console.log(this.$route.query.deviceId);
        // console.log(this.$route.query.panorama);
        this.userType_parameter = JSON.parse(sessionStorage['user']).userType;
        // this.deviceName = this.$route.query.deviceName ? this.$route.query.deviceName : '----';
        this.Panorama_flag = this.$route.query.panorama == 'panorama' ? true : false;//街景显示标识
        this.deviceId = this.$route.query.deviceId;
        // this.deviceNumber = this.$route.query.deviceNumber;
        // this.evt_getDeviceLastCoordinate();
        this.evt_getRangeIconList();
    },
    mounted(){
        var _this = this;
        _this.map = new BMap.Map("container");
        _this.map.enableScrollWheelZoom(true); 
        _this.map.disableDoubleClickZoom();
        _this.map.centerAndZoom(new BMap.Point(121.3715259,31.1285691),15);
        _this.map.addControl(new BMap.NavigationControl({offset: new BMap.Size(20, 70)})); 
        _this.map.addControl(new BMap.ScaleControl());    
        _this.map.addControl(new BMap.OverviewMapControl());      
        // 路况信息控件
        var trafficControl = new BMapLib.TrafficControl();
        _this.map.addControl(trafficControl);
        trafficControl.setAnchor(BMAP_ANCHOR_TOP_RIGHT);
        trafficControl.setOffset(new BMap.Size(20,160));
        // 定时刷新
        this.evt_interval();
    },
    destroyed(){
        clearInterval(this.interval);
    },
    methods:{
        // 切换地图类型
        evt_change_mapType:function(type){
            if(type == 'moon'){
                this.map.setMapType(BMAP_HYBRID_MAP);
            }else{
                this.map.setMapType(BMAP_NORMAL_MAP);
            }
        },
         // 获取适用范围的icon信息
        evt_getRangeIconList:function(){
            var _this = this;
            api.getRangeIconList({},_this.userType_parameter).then((res) => {
                if(res.success && Object.keys(res.data).length > 0){
                    _this.icon_list = res.data;
                    _this.evt_getDeviceInfo();
                }
            }).catch((err) => {
                _this.$message({message:err.msg || '设备适用icon数据请求错误',type:'error',offset:'260',duration:'1500'})
            })
        },
        // 获取设备详情信息
        evt_getDeviceInfo:function(){
            var _this = this;
            var request_data = {};
            request_data['deviceId'] = _this.deviceId;
            api.getDeviceDetail(request_data,_this.userType_parameter).then((res) => {
                if(res.success && res.data && Object.keys(res.data).length > 0){
                    _this.device_detail_info = res.data;
                    _this.evt_getDeviceLastCoordinate();
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:'error',offset:'200',duration:'1000'});
            })
        },
        // 获取设备最新位置
        evt_getDeviceLastCoordinate:function(){
            var _this = this;
            var request_data = {};
            request_data['deviceId'] = _this.deviceId;
            api.getDeviceLastCoordinate(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success && res.data){
                    // gcj02转bd09
                    if(res.data.coordinate && Object.keys(res.data.coordinate).length == 0) return;
                    var point_t = gcj02tobd09(res.data.coordinate.lng,res.data.coordinate.lat);
                    res.data.coordinate.lng = point_t[0];
                    res.data.coordinate.lat = point_t[1];
                    _this.locationInfo = res.data;
                    _this.locationArr = _this.locationArr.concat(res.data);
                    if(_this.Panorama_flag){
                        _this.Panorama = new BMap.Panorama("vista");
                        _this.Panorama.setPosition(new BMap.Point(_this.locationInfo.coordinate.lng,_this.locationInfo.coordinate.lat));
                    }
                    var point = new BMap.Point(_this.locationInfo.coordinate.lng,_this.locationInfo.coordinate.lat);
                    _this.map.closeInfoWindow();
                    _this.evt_addInfoWindow(point,_this.locationInfo);
                    _this.evt_addMarker(point);
                    _this.evt_addPolyline();

                    geocoder.getLocation(point,function(result){
                        // console.log(result)
                        if(result.address){
                            _this.device_address = result.address
                        }else{
                            _this.device_address = '--'
                        }
                    })
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:'error',duration:'1000',offset:'200'})
            })
        },
        // 关闭全景
        evt_close:function(){
            this.Panorama.hide();
            this.Panorama_flag = false;
        },
         // 添加展示信息窗口
        evt_addInfoWindow:function(point,info){
            var position_type;
            for(var key in info.coordinateFrom){
                if(info.coordinateFrom[key] != null){
                    if(key == 'baseStations'){
                        position_type = '基站';
                    }else if(key == 'gps'){
                        position_type = 'GPS';
                    }else if(key == 'wifiMacs'){
                        position_type = 'WIFI'
                    }
                }
            }
            var infoWindow_html = `<div class="info_window_content">
                <div class="info_window_content_title">
                    <span>设备名称:${this.device_detail_info.deviceName}</span>
                </div>
                <div class="info_window_content_item">
                    <span>网络状态：</span>
                    <span>${info.networkStatus == '1' ? '在线' : '离线'}</span>
                </div>
                <div class="info_window_content_item">
                    <span>定位方式：${position_type != undefined ? position_type : '----'}</span>
                </div>
                <div class="info_window_content_item">
                    <span>设备号：${this.device_detail_info.deviceNumber}</span>
                </div>
                <div class="info_window_content_item">
                    <span>更新时间：${this.evt_formatDate(info.time)}</span>
                </div>
                <div class="info_window_content_item">
                    <span>经度：${info.coordinate.lng}</span>
                    <span class="info_window_content_item_right">纬度：${info.coordinate.lat}</span>
                </div>
            </div>`
            var infoWindow = new BMap.InfoWindow(infoWindow_html,{enableCloseOnClick:false});
            this.map.openInfoWindow(infoWindow,point);
        },
        // 添加标记
        evt_addMarker:function(point){
            var _this = this;
            var icon_url = _this.locationInfo.networkStatus == '1' ? _this.device_detail_info.useRangeCode != null ? _this.icon_list[_this.device_detail_info.useRangeCode].iconUrlForMapActive : _this.icon_list['Other'].iconUrlForMapActive : _this.device_detail_info.useRangeCode != null ? _this.icon_list[_this.device_detail_info.useRangeCode].iconUrlForMapInactive : _this.icon_list['Other'].iconUrlForMapInactive;
            var marker_icon = new BMap.Icon(icon_url,new BMap.Size(40,40),{
                imageSize: new BMap.Size(40,40),
            });
            var marker = new BMap.Marker(point, {icon: marker_icon});
            marker.addEventListener('click',function(e){
            //    console.log(e);
                _this.map.closeInfoWindow();
                var point = new BMap.Point(e.currentTarget.point.lng,e.currentTarget.point.lat);
                var info = _this.locationInfo;
                _this.evt_addInfoWindow(point,info);
            })
            marker.name = _this.locationArr.length;
            _this.map.addOverlay(marker);
        },
        // 添加轨迹线并清除之前的覆盖层
        evt_addPolyline:function(){
            var _this = this;
            var Polyline_points = [];
            for(let i = 0, len = _this.locationArr.length; i < len; i++){
                Polyline_points.push(new BMap.Point(_this.locationArr[i].coordinate.lng,_this.locationArr[i].coordinate.lat));
            }
            var point = new BMap.Point(_this.locationArr[_this.locationArr.length - 1].coordinate.lng,_this.locationArr[_this.locationArr.length - 1].coordinate.lat);
            _this.map.panTo(point);
            var Polyline = new BMap.Polyline(Polyline_points, {strokeColor: '#0cf36b',strokeWeight:8,strokeOpacity:1});
            Polyline.name = _this.locationArr.length;
            _this.map.addOverlay(Polyline);

            var allOverlays = _this.map.getOverlays();
            // console.log(allOverlays);
            for(var key in allOverlays){
                if( typeof(allOverlays[key].name) == 'number' && allOverlays[key].name  != _this.locationArr.length){
                    _this.map.removeOverlay(allOverlays[key]); 
                }
            }
        },
        evt_interval:function(){
            var _this = this;
            clearInterval(_this.interval);
            _this.interval_num = 30;
            _this.interval = setInterval(() => {
                _this.interval_num--;
                if(_this.interval_num == 0){
                    _this.interval_num = 30;
                    _this.evt_getDeviceLastCoordinate();
                }
            }, 1000);
        },
        // 格式化时间格式
        evt_formatDate:function(time){
            let date_time = new Date(time);
            return isNaN(date_time) ? " " : formatDate(date_time,'yyyy-MM-dd hh:mm:ss');
        }
        
    }
}
</script>

<style lang="scss" scoped>
    .page{
        width: 100vw;
        height: 100vh;
        .page_top{
            width: 100vw;
            height: 50px;
            background: #5D85FF;
            opacity: 0.8;
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 50px;
            padding-left: 20px;
            box-sizing: border-box;
            position: fixed;
            top: 0px;
            left: 0px;
            z-index: 999;
        }
    }
    .map_container{
        position: relative;
        #container{
            width: 100vw;
            height: 100vh;
        }
        .map_type{
            position: absolute;
            top: 70px;
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
    #vista{
        width: 60vh;
        height: 50vh;
        background: #FFFFFF;
        position: absolute;
        bottom: 0px;
        right: 0px;
        z-index: 999;
        .vista_close{
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 9999;
            color: #FFFFFF;
            font-size: 28px;
            cursor: pointer;
        }
    }
    .interval_content{
        // width: 100px;
        height: 30px;
        padding: 0px 10px;
        background: #FFFFFF;
        box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.35);
        border-radius: 4px;
        cursor: pointer;
        position: absolute;
        top: 70px;
        left: 80px;
        z-index: 999;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 500;
        color: #FF4C4C;
        line-height: 30px;
        text-align: center;
    }

    /deep/ .anchorBL {
    display: block; 
    }
    /deep/ .BMap_cpyCtrl {
        display: block; 
    }

    /deep/ .info_window_content{
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
            >span{
                font-size: 12px;
                font-family: Source Han Sans CN;
                font-weight: 500;
                color: #333333;
            }
            .info_window_content_item_right{
                margin-left: 10px;
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
</style>

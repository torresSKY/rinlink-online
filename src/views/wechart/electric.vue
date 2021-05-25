<template>
    <div class="app" :style="{height:height +'px',overflow:'hidden' }">
        <el-row>
            <el-col :span='6'>
                <div class="left" :style="{height:height +'px'}">
                    <div class='search'>
                        <div class="search_top">电子围栏</div>
                        <el-row class="select_type_name" :gutter="4" type="flex" align="center">
                            <el-col :span="10">
                                <el-select v-model="select_type_name" placeholder="请选择查询类型" size="small">
                                    <el-option key="设备名称/IMEI"  label="设备名称/IMEI" value="deviceName"></el-option>
                                    <el-option  key="围栏名称" label="围栏名称" value="fenceName"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="10">
                                <div class="fenceSearch_content">
                                    <el-input size="small" v-model='fenceSearchContent' placeholder="请输入搜索内容"></el-input>
                                    <!-- <input id="fence_search" type="text" v-model='fenceSearchContent' placeholder="请输入搜索内容"> -->
                                    <div v-if="fenceSearch_content_flag" class="fenceSearch_content_tab">
                                        <el-table @row-click="evt_row_click"  size="mini" :data="search_result" style="width:100%" :show-header="false">
                                            <el-table-column v-if="select_type_name == 'fenceName'" prop="fenceName" label="围栏名称"></el-table-column>
                                            <el-table-column v-if="select_type_name == 'deviceName'" prop="deviceName" label="设备名称"></el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <el-button @click='evt_fence_query' size="small" type="primary">{{$t('button.search')}}</el-button>
                            </el-col>
                        </el-row>   
                    </div>
                    <div class="search_content">
                        <div class="search_content_title">
                            <div>围栏列表</div>
                            <div @click='evt_add_pen'>添加围栏</div>
                            <div v-if="add_pen_hint_flag" class="add_pen_hint">请在地图上单击鼠标左键框选区域</div>
                        </div>
                        <div class="search_content_list" v-infinite-scroll="evt_scroll_load" infinite-scroll-immediate="false" infinite-scroll-distance="50" :style="{height:height - 125 +'px'}">
                            <template v-if='queryPen_dataList.length > 0'>
                                <div class='list' v-for='(item,index) in queryPen_dataList' :key='index'  @click='evt_dowm(index,item)'>
                                    <div class='elecard' :class = "active == index ? 'addclass' : '' ">
                                        <div class='elecard_item_left'>{{item.fenceName}}</div>
                                        <div class="elecard_item_right" :class="item.fenceType != '0' ? 'elecard_item_right_t':''">
                                            <div v-if="item.fenceType == '0'">半径：{{item.circleFence.radius}}米</div>
                                            <div>
                                                <el-image style="width: 16px; height: 16px" :src="require('../../assets/img/list.png')" fit="contain" @click.stop="evt_show_relevance(item)"></el-image>
                                                <el-image style="width: 16px; height: 16px" :src="require('../../assets/img/edit.png')" fit="contain" @click.stop='evt_edit(item)'></el-image>
                                                <el-image style="width: 16px; height: 16px" :src="require('../../assets/img/delet.png')" fit="contain"  @click.stop='evt_delete(item)'></el-image>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="queryPen_page == queryPen_pageTotal - 1" style="font-size: 14px; color: #999999; text-align: center">没有更多了~</div>
                            </template>
                            <div class='list' v-else><span style='margin-left:30%;margin-top:200px;color:#909399;'>暂无数据</span></div>
                        </div>
                    </div>
                </div>
            </el-col> 
            <el-col :span='18'>
                <el-card>
                    <div class="map_container">
                        <!-- 地图容器 -->
                        <div id="container" :style="{height:height- 10+'px',overflow:'hidden' }"></div>
                        <!-- 围栏类型切换 -->
                        <div class="pen_type">
                            <el-button :disabled="pen_type_disabled" size="mini" :class="pen_type_value == '1' ? 'pen_type_item' : ''" @click="evt_change_pen_type(1)">圆形</el-button>
                            <el-button :disabled="pen_type_disabled" size="mini" :class="pen_type_value == '2' ? 'pen_type_item' : ''" @click="evt_change_pen_type(2)">多边形</el-button>
                            <el-button :disabled="pen_type_disabled" size="mini" :class="pen_type_value == '3' ? 'pen_type_item' : ''" @click="evt_change_pen_type(3)">行政区域</el-button>
                        </div>
                        <!-- 搜索地址 -->
                        <div class="search_address">
                            <div class="suggest_container">
                                <input id="suggestId" placeholder="百度搜索地址" type="text" v-model="search_address_key" />
                                <span @click="evt_search_address" class="el-icon-search"></span>
                            </div>
                            <div id="searchResultPanel"></div>
                        </div>
                        <!-- 地图类型路况 -->
                        <div class="map_type">
                            <div @click="evt_change_mapType('moon')">
                                <el-image style="width: 20px; height: 20px" :src="require('../../assets/img/moon.png')" fit="contain"></el-image>
                                <span>卫星</span>
                            </div>
                            <div @click="evt_change_mapType('map')">
                                <el-image style="width: 18px; height: 18px" :src="require('../../assets/img/map_icon.png')" fit="contain"></el-image>
                                <span>地图</span>
                            </div>
                            <!-- <div>
                                <el-image style="width: 17px; height: 18px" :src="require('../../assets/img/road_condition.png')" fit="contain"></el-image>
                                <span>路况</span>
                            </div> -->
                        </div>
                    </div>
                </el-card>
            </el-col>  
        </el-row>
        <!-- 关联设备 -->
        <el-dialog @close="evt_close" class="relevance_device" width="60%" title="关联设备" :visible="relevance_device_flag"  top="5vh">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="users">
                        <el-input placeholder="请输入客户名称" size="mini" v-model="searchBusiness_name">
                            <el-button @click="evt_searchBusiness" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <div class="users_bottom">
                            <el-tree ref="userTree" @node-click="evt_node_click" node-key="user_id"  :expand-on-click-node="false" :data="user_list" :load="evt_loadTree" lazy :render-content="renderContent"></el-tree>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="devices">
                        <el-input placeholder="设备名称" size="mini" v-model="searchDevice_name">
                            <el-button @click="evt_searchDevice" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <div class="devices_bottom">
                            <!-- <el-tree
                                :data="data_tree"
                                show-checkbox
                                node-key="id"
                                :default-expanded-keys="[2]"
                                :default-checked-keys="[5]"
                                :props="defaultProps">
                            </el-tree> -->
                            <!-- <el-checkbox-group @change="evt_select_devices" v-model="checked_devices" size="mini">
                                <el-checkbox size="mini" style="display:block;"  v-for="item in devices_list" :checked="item.checked" :label="item.deviceName" :key="item.deviceName">{{item.deviceName}}</el-checkbox>
                            </el-checkbox-group> -->
                            <template v-if="devices_list.length > 0">
                                <div v-for="item in devices_list" :key="item.id" style="display:flex;align-items: center; margin-bottom:5px;cursor: pointer;" @click="evt_select_devices(item.id)">
                                    <img v-show="!item.checked" :src="require('../../assets/img/no_select_icon.png')" style="width:20px;height:20px;">
                                    <img v-show="item.checked" :src="require('../../assets/img/selected_icon.png')" style="width:20px;height:20px;">
                                    <span style="font-size:16px;margin-left:5px;line-height:20px;">{{item.deviceName}}</span>
                                </div>
                            </template>
                            <div v-if="devices_list.length == 0" style="font-size:16px;text-align:center">暂无用户设备数据</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <!-- <el-row :gutter="20" class="search_device">
                <el-col :span="8">
                    <el-input size="small" placeholder="请输入设备名称/设备IMEI" prefix-icon="el-icon-search" v-model="search_device_key"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-button style="width:100%" size="small" type="primary">搜索</el-button>
                </el-col>
                <el-col :span="3">
                    <el-button size="small" type="danger" @click="evt_cancel_allSelect">取消关联</el-button>
                </el-col>
            </el-row> -->
            <!-- <el-table @selection-change="evt_select_table" v-show="current_page_devices.length > 0" class="relevance_table" size="mini" :data="current_page_devices" style="width: 100%" tooltip-effect="dark">
                <el-table-column align="center" fixed type="selection" min-width="20"></el-table-column>
                <el-table-column align="center" fixed :label="$t('table.Device')" prop="deviceName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.imei')" prop='deviceNumber' min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.model')" prop="deviceModel.name" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.Detailed')" prop="address" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.addtime')" prop="activationTime" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" fixed="right" :label="$t('table.operation')" min-width="100">
                    <template slot-scope="scope">
                       <el-button size="mini" @click="evt_cancel_item(scope.row)" type="danger">取消关联</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @current-change="evt_current_change" :hide-on-single-page="true" small background :page-size="selected_devices_pagesize" :current-page="selected_devices_page" layout="total, prev, pager, next ,jumper" :total="selected_devices.length" style="text-align:center;margin-top:10px"></el-pagination> -->
            <div class="select_collect">
                <div class="select_collect_top">
                    <span>已选列表({{selected_devices.length}})</span>
                    <span @click="evt_cancel_all_selected">清空</span>
                </div>
                <div v-if="selected_devices.length > 0" class="select_collect_content">
                    <div v-for="(item,index) in selected_devices" :key="index" class="select_collect_content_item" @click="evt_cancel_selected(item)">
                        <span>{{item.deviceName}} ({{item.deviceNumber}})</span>
                        <img :src="require('../../assets/img/x.png')">
                    </div>
                </div>
            </div>
            <div class="relevance_device_bottom_btn">
                <el-button type="info" size="small" @click="evt_close">取消</el-button>
                <el-button type="primary" size="small" @click="evt_submit_relevance">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="添加电子围栏" class="add_pen_round" :visible="add_pen_flag" width="40%" @close="evt_close_addPen">
            <el-form ref="form" :model="pen_form" :rules="pen_round_rules" size="small" label-width="100px">
                <el-form-item label="围栏名称:"  required>
                    <el-input v-model="pen_form.fenceName" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item v-if="pen_type_value == '1'" label="半径:"  required>
                    <el-input type="number"  v-model="pen_form.fenceArea.radius" style="width:80%"></el-input><span style="margin-left:10px">米</span>
                </el-form-item>
                <el-form-item v-if="pen_type_value == '3'" label="行政区域" required>
                    <el-select @change="evt_change_frist_region" v-model="selected_frist_region"  placeholder="请选择省份" size="small" style="width:32%">
                      <el-option  v-for="item in select_first_region" :key="item.name" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                    <el-select @change="evt_change_second_region" v-model="selected_second_region"  placeholder="请选择市" size="small" style="width:32%">
                      <el-option  v-for="item in select_second_region" :key="item.name" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                    <el-select v-if="select_third_region.length > 0" @change="evt_change_third_region" v-model="selected_third_region" placeholder="请选择区/镇" size="small" style="width:32%">
                      <el-option v-for="item in select_third_region" :key="item.name" :label="item.name" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述:" >
                    <el-input type="textarea" v-model="pen_form.fenceRemark" style="width:80%"></el-input>
                </el-form-item>
                <el-form-item label="进围栏报警:" >
                    <el-radio-group v-model="pen_form.inAlarm">
                        <el-radio :label="label_true">启用</el-radio>
                        <el-radio :label="label_false">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出围栏报警:" >
                    <el-radio-group v-model="pen_form.outAlarm">
                        <el-radio :label="label_true">启用</el-radio>
                        <el-radio :label="label_false">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button @click="evt_close_addPen">取消</el-button>
                    <el-button @click="evt_submit_addPen" type="primary">确定</el-button>
                </el-form-item>
                </el-form>
        </el-dialog>

    </div>
</template>
<script>
import api from '@/api/wechart/index'
import mixin from '@/mixins/index'
import { formatDate } from '@/plugins/date.js'
import {gcj02tobd09, bd09togcj02, gcj02towgs84, wgs84togcj02} from '@/utils/baidumap.js'
import axios from 'axios'
export default {
    name: 'electric',
    mixins:[mixin],
    data(){
        return{
            imei: this.$route.query.imei,
            lon: this.$route.query.lon,
            lat: this.$route.query.lat,
            x_PI: 3.14159265358979324 * 3000.0 / 180.0,
            PI: 3.1415926535897932384626,
            a: 6378245.0,
            ee: 0.00669342162296594323,
            height: 0,//可视高度
            fenceSearchContent: '',//搜索围栏的关键字
            select_type_name:'',//电子围栏查询选择类型
            fenceSearchId:'',//搜索围栏的id
            fenceSearchDeviceId:'',//使用设备id搜索围栏
            search_result:[],//模糊搜索的围栏数据
            fenceSearch_content_flag:false,//模糊搜索的围栏数据展示标识
            map: null,//地图实例
            pen_type_value: '1',//围栏的样式类型 1圆形2多边形3行政区域
            add_pen_hint_flag:false,//添加围栏的提示
            click_point: '',//添加圆形围栏时点击地图时的经纬度
            add_pen_flag:false,//添加围栏
            pen_form:{
                fenceName:'',
                fenceRemark:'',
                inAlarm:'',
                outAlarm:'',
                fenceArea:{
                    radius:'',
                }
            },//提交围栏的数据
            regress_pen_form:{
                fenceName:'',
                fenceRemark:'',
                inAlarm:'',
                outAlarm:'',
                fenceArea:{
                    radius:'',
                }
            },
            pen_round_rules: {
                name: [
                    { required: true, message: '请输入围栏名称', trigger: 'blur' }
                ],
                radius: [
                    { required: true, message: '请输入围栏半径', trigger: 'blur' },
                    { type: 'number', message: '半径必须为数字值'}
                ]
            },
            point_arr:[],//添加多边形围栏的经纬度数组
            opts:{
                strokeColor:'#FF5D5D',
                fillColor:'#FF5D5D',
                strokeWeight: 1,
                strokeOpacity: 1,
                fillOpacity: 0.3,
                strokeStyle: 'solid'
            },//绘制多边形的样式
            drawingManager:null,
            current_polygon:'',//当前绘制的多边形
            pen_type_disabled:false,//围栏类型是否可选
            search_address_key:'',//搜索地址的key值
            relevance_device_flag: false,//关联设备模块的展示
            current_circle:'',//当前绘制的圆形
            queryPen_pageSize: 10,//查询电子围栏的每页条数
            queryPen_page:0,//查询的页数 默认为0
            queryPen_pageTotal:1,//总页数
            queryPen_dataList:[],//查询获得的围栏数据
            active:-1,//选中的围栏
            Region_dataList:[],//行政区域
            select_first_region:[],//一级
            select_second_region:[],//二级
            select_third_region:[],//三级
            selected_frist_region:'',//选中的一级区域
            selected_second_region:'',//选中的二级
            selected_third_region:'',//选中的三级
            selected_adcode:'',//最终选择的行政区域码
            selected_areaName: '',//最终选择的行政区名称
            selected_level:'',//最终选择的行政区级别
            update_pen:false,//更新围栏辨识
            user_list:[],//用户列表
            renderContent:function (h,{node,data,store}) {
                let addElement = arguments[0];
                return addElement('span',[
                    addElement('i',{class:"el-icon-s-custom row_item_bottom_left_userIcon"}),
                    addElement('span',"    "),
                    addElement('span',arguments[1].node.label)
                ]);
            },//el-tree 自定义图标
            user_id:'',//用于查询设备的用户id
            devices_list:[],//查询的用户设备列表
            selected_devices:[],//选择要关联的设备
            current_page_devices:[],//分页当前页的关联设备数据
            selected_devices_page:1,
            selected_devices_pagesize:5,
            selected_cancel:[],//选择取消关联的设备
            relevance_fenceId: '',//选择关联的围栏id
            searchBusiness_name:'',//搜索用户
            searchDevice_name:'',//搜索设备
            label_true: true,
            label_false: false,
        }
    },
    watch: {
        fenceRadio(news){
            let that = this
            let timer = null
            clearTimeout(timer)
            timer = setTimeout(()=>{
                if(this.conlon != 0 && this.conlat != 0){
                    this.circle.setCenter( new BMap.Point(this.conlon, this.conlat))
                    that.circle.setRadius(news)
                }else{
                    this.$message.warning(this.$t('message.xuanze'))
                }
            }, 500);
        }
    },
    created(){
        if(this.$route.query.deviceName){
            this.select_type_name = 'deviceName';
            this.fenceSearchContent = this.$route.query.deviceName;
            this.evt_fence_query();
            return;
        }
        this.evt_queryPen();
    },
    mounted(){
        var _this = this;
        _this.height = document.body.offsetHeight - 60;
    
        _this.map = new BMap.Map("container");
        _this.map.enableScrollWheelZoom(true); 
        _this.map.disableDoubleClickZoom();
        _this.map.centerAndZoom(new BMap.Point(116.2529,39.5420),6);
        _this.map.addControl(new BMap.NavigationControl({offset: new BMap.Size(20, 70)})); 
        _this.map.addControl(new BMap.ScaleControl());    
        _this.map.addControl(new BMap.OverviewMapControl());      
        _this.drawingManager = new BMapLib.DrawingManager(_this.map,{
            polygonOptions: _this.opts,
            circleOptions: _this.opts
        });  
        // 路况信息控件
        var trafficControl = new BMapLib.TrafficControl();
        _this.map.addControl(trafficControl);
        trafficControl.setAnchor(BMAP_ANCHOR_TOP_RIGHT);
        trafficControl.setOffset(new BMap.Size(20,160));
        _this.map.addEventListener('click',function(e){
           if(_this.pen_type_value == '2' && _this.add_pen_hint_flag){
                // 监听多边形绘制结束
                _this.pen_type_disabled = true;
            }
        })
        _this.map.addEventListener('mouseout',function(e){
            
        })
        // 搜索提示
        _this.search_hint();
        _this.evt_eventListener();
        _this.evt_getRegion();
    },
    methods: {

        // 监听绘制结束事件
        evt_eventListener:function(){
            var _this = this;
            _this.drawingManager.addEventListener('overlaycomplete',function(e){
                // console.log(e.overlay);
                _this.pen_type_disabled = false;
                if(_this.pen_type_value == '1'){
                    // console.log(e.overlay.getCenter());
                    _this.click_point = e.overlay.getCenter();
                    _this.current_circle = e.overlay;
                }else if(_this.pen_type_value == '2'){
                    _this.current_polygon = e.overlay;
                    var point_arr = e.overlay.getPath();
                    for(let i = 0, len = point_arr.length; i < len; i++){
                        _this.point_arr.push(point_arr[i]);
                    } 
                }
                _this.add_pen_flag = true;
                _this.drawingManager.close();
                _this.drawingManager.removeEventListener('overlaycomplete');
            })
        },
        // 切换要创建的围栏类型
        evt_change_pen_type:function(value){
            var _this = this;
            if(_this.pen_type_value == value) return;
            _this.pen_type_value = value;
            if(_this.pen_type_value == '1' && _this.add_pen_hint_flag){
                // _this.drawingManager.open();
                _this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
            }else if(_this.pen_type_value == '2' && _this.add_pen_hint_flag){
                // _this.drawingManager.open();
                _this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON); 
            }else if(_this.pen_type_value == '3' && _this.add_pen_hint_flag){
                _this.drawingManager.close();
                _this.add_pen_flag = true;
            }
        },
        // 显示添加围栏的提示
        evt_add_pen:function(){
            this.add_pen_hint_flag = true;
            this.pen_type_value = '1';
            this.drawingManager.open();
            this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
        },
        // 关闭取消添加围栏弹框
        evt_close_addPen:function(){
            this.add_pen_hint_flag = false;
            this.add_pen_flag = false;
            if(this.pen_type_value == '2'){
                this.map.removeOverlay(this.current_polygon);
                this.current_polygon = '';
            }else if(this.pen_type_value == '1'){
                this.map.removeOverlay(this.current_circle);
                this.current_circle = '';
            }
            // if(this.update_pen){
            //     this.pen_form = this.regress_pen_form;
            //     this.update_pen = false;
            // }
            this.pen_form = {
                fenceName:'',
                fenceRemark:'',
                inAlarm:'',
                outAlarm:'',
                fenceArea:{
                    radius:'',
                }
            };
            this.update_pen = false;
        },
        // 添加围栏
        evt_submit_addPen:function(){
            var _this = this;
            // 圆形围栏
            if(_this.pen_type_value == '1'){
               _this.evt_CircleFence();
            }else if(_this.pen_type_value == '2'){
                // 多边形围栏
               _this.evt_PolygonFence();
            }else if(_this.pen_type_value == '3'){
                // 行政区域
               _this.evt_DistrictFence();
            }
        },
        submit_result:function() {
            var _this = this;
            _this.pen_form = {
                fenceName:'',
                fenceRemark:'',
                inAlarm:'',
                outAlarm:'',
                fenceArea:{
                    radius:'',
                }
            };
            _this.add_pen_hint_flag = false;
            _this.add_pen_flag = false;
            _this.$message({message: _this.update_pen? '更新成功':'添加成功',type:'success',offset:'200',duration:'1000'});
            _this.update_pen = false;
        },
        // 添加、更新圆形围栏
        evt_CircleFence:function(){
            var _this = this;
            var type = 'update';
            if(!_this.update_pen){
                type = 'create';
                _this.pen_form.fenceArea['lat'] = _this.click_point.lat;
                _this.pen_form.fenceArea['lng'] = _this.click_point.lng;
            }
            api.createUpdateCircleFence(type,_this.pen_form).then((res) => {
                if(res.success){
                    if(!_this.update_pen){
                        _this.map.removeOverlay(_this.current_circle);
                        _this.current_circle = '';
                    }
                    _this.submit_result();
                }else{
                    _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
                }
            }).catch((err) => {
                _this.$message({message: err.msg ? err.msg : _this.update_pen ? '更新失败,请重试' : '添加失败,请重试',type:'error',offset:'200',duration:'1000'});
            })
        },
        // 添加、更新多边形围栏
        evt_PolygonFence:function(){
            var _this = this;
            var type = 'update';
            if(!_this.update_pen){
                type = 'create';
                _this.pen_form.fenceArea['points'] = _this.point_arr;
            }
            delete _this.pen_form.fenceArea.radius;
            api.createUpdatePolygonFence(type, _this.pen_form).then((res) => {
                if(res.success){
                    if(!_this.update_pen){
                        _this.map.removeOverlay(_this.current_polygon);
                        _this.current_polygon = '';
                    }
                    _this.submit_result();
                }else{
                    _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
                }
            }).catch((err) => {
                _this.$message({message: err.msg ? err.msg : _this.update_pen ? '更新失败,请重试' : '添加失败,请重试',type:'error',offset:'200',duration:'1000'});
            })
        },
        // 添加、更新行政区域围栏
        evt_DistrictFence:function(){
            var _this = this;
            var type = 'update';
            delete _this.pen_form.fenceArea.radius;
            if(!_this.update_pen){
                type = 'create';
                _this.pen_form.fenceArea['areaCode'] = _this.selected_adcode;
                _this.pen_form.fenceArea['areaName'] = _this.selected_areaName;
                _this.pen_form.fenceArea['areaLevel'] = _this.selected_level;
                var boundary = new BMap.Boundary();
                boundary.get(_this.selected_areaName,function(res){
                    console.log(res);
                    if(res){
                        var points = [];
                        for(var i = 0, len = res.boundaries.length; i < len; i++){
                            var point_arr = res.boundaries[i].split(';')
                            var arr = [];
                            for(var j = 0, le = point_arr.length; j < le; j++){
                                var arr_item = [];
                                var point = point_arr[j].split(',');
                                var lng = point[0].slice(0,point[0].indexOf('.')+7);
                                arr_item.push(lng);
                                var lat = point[1].trim().slice(0,point[1].trim().indexOf('.')+7);
                                arr_item.push(lat);
                                arr.push(arr_item.join(','));
                            }
                            points = points.concat(arr);
                        }
                        var points_str = points.join(";");
                        // console.log(points_str);
                        _this.pen_form.fenceArea['points'] = points_str;

                        api.createUpdateDistrictFence(type,_this.pen_form).then((res) => {
                            console.log(res);
                            if(res.success){
                                    _this.submit_result();
                            }else{
                                _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
                            }
                        }).catch((err) => {
                            _this.$message({message: err.msg ? err.msg : _this.update_pen ? '更新失败,请重试' : '添加失败,请重试',type:'error',offset:'200',duration:'1000'});
                        })
                    }
                })
            }else{
                api.createUpdateDistrictFence(type,_this.pen_form).then((res) => {
                    console.log(res);
                    if(res.success){
                            _this.submit_result();
                    }else{
                        _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
                    }
                }).catch((err) => {
                    _this.$message({message: err.msg ? err.msg : _this.update_pen ? '更新失败,请重试' : '添加失败,请重试',type:'error',offset:'200',duration:'1000'});
                })
            }
           
        },
         // 选择更新围栏
        evt_edit:function(item){
            console.log(item);
            this.update_pen = true;
            this.pen_form['fenceId'] = item.fenceId;
            this.pen_form['fenceName'] = item.fenceName;
            this.pen_form['fenceRemark'] = item.fenceRemark;
            this.pen_form['inAlarm'] = item.inAlarm;
            this.pen_form['outAlarm'] = item.outAlarm;
            this.add_pen_flag =  true;
            if(item.fenceType == '0'){
                this.pen_type_value = '1';
                this.pen_form.fenceArea['lat'] = item.circleFence.coordinate.lat;
                this.pen_form.fenceArea['lng'] = item.circleFence.coordinate.lng;
                this.pen_form.fenceArea['radius'] = item.circleFence.radius;
            }else if(item.fenceType == '1'){
                this.pen_type_value = '2';
                this.pen_form.fenceArea['points'] = item.polygonFence.points;
            }else if(item.fenceType == '2'){
                this.pen_type_value = '3';
                this.pen_form.fenceArea['areaCode'] = item.districtFence.areaCode;
                this.pen_form.fenceArea['areaName'] = item.districtFence.areaName;
                this.pen_form.fenceArea['areaLevel'] = item.districtFence.areaLevel;
                // 遍历选中的 行政区域
                var adcode = item.districtFence.areaCode.toString();
                var level = item.districtFence.areaLevel;
                for(var i = 0, len = this.select_first_region.length; i < len; i++){
                    if(this.select_first_region[i].adcode.indexOf(adcode.substr(0,2)) > -1){
                        this.selected_frist_region = this.select_first_region[i].name;
                        if(level == 1){
                            this.selected_level = 1;
                            this.selected_adcode = this.select_first_region[i].adcode;
                            this.selected_areaName = this.select_first_region[i].name;
                        }else{
                            this.select_second_region = this.select_first_region[i].districts;
                            for(var j = 0, lth =  this.select_second_region.length; j < lth; j++){
                                if(this.select_second_region[j].adcode.indexOf(adcode.substr(0,4)) > -1){
                                    this.selected_second_region = this.select_second_region[j].name;
                                    if(level == 2){
                                        this.selected_level = 2;
                                        this.selected_adcode = this.select_second_region[j].adcode;
                                        this.selected_areaName = this.select_second_region[j].name;
                                    }else{
                                        this.select_third_region = this.select_second_region[j].districts;
                                        for(var z = 0, le = this.select_third_region.length; z < le; z++){
                                            if(this.select_third_region[z].adcode == adcode){
                                                this.selected_level = 3;
                                                this.selected_third_region = this.select_third_region[z].name;
                                                this.selected_adcode = this.select_third_region[z].adcode;
                                                this.selected_areaName = this.select_third_region[z].name
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                var point_arr = [];
                for(var i = 0, len = item.districtFence.points.length; i < len; i++){
                    var str = item.districtFence.points[i].lng + ',' + item.districtFence.points[i].lat;
                    point_arr.push(str);
                }
                this.pen_form.fenceArea['points'] = point_arr.join(';');
            }
        },
        // 删除围栏
        evt_delete:function(item){
            var _this = this;
            var request_data = {};
            request_data['fenceId'] = item.fenceId;
            _this.$confirm('此操作将删除该围栏, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                api.deleteFence(request_data).then((res) => {
                    console.log(res);
                    if(res.success){
                        _this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        // 重新查询围栏数据
                        _this.queryPen_page = 0;
                        _this.queryPen_dataList = [];
                        _this.queryPen_pageTotal = 1;
                        _this.evt_queryPen();
                    }else{
                        _this.$message({message: '删除失败',type:'error',offset:'200',duration:'1000'});
                    }
                }).catch((err) => {
                    _this.$message({message: err.msg || '删除失败',type:'error',offset:'200',duration:'1000'});
                })
            }).catch(() => {
                _this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 根据类型模糊搜索电子围栏
        evt_fence_query:function(){
            var _this = this;
            if(_this.select_type_name.trim() == '') {
                _this.$message({message:'请先选择查询类型',type:'warning',offset:'200'})
                return;
            }
            if(_this.fenceSearchContent.trim() == '') {
                _this.$message({message:'请输入搜索内容',type:'warning',offset:'200'})
                return;
            }
            _this.search_result = [];
            var request_data = {};
            request_data['searchType'] = _this.select_type_name;
            request_data['searchContent'] = _this.fenceSearchContent;
            api.searchFences(request_data).then((res) => {
                console.log(res);
                if(res.success){
                    // 判断是否页面跳转查看电子围栏
                    if(_this.$route.query.deviceName){
                        _this.fenceSearchId = '';
                        _this.fenceSearchDeviceId = res.data[0].deviceId;
                        _this.evt_queryPen();
                        return;
                    }

                    _this.search_result = res.data;
                    _this.fenceSearch_content_flag = true;
                }
            }).catch((err) => {
                _this.$message({message:err.msg || '请求错误，请稍后重试',type:'error',offset:'200',duration:'1000'});
            })
            // let fence_search =  document.getElementById("fence_search");
            // fence_search.focus();
            // fence_search.addEventListener('blur',function(){
            //     _this.fenceSearch_content_flag = false;
            //     fence_search.removeEventListener('blur',function(){});
            // },false)
            
            let dom_element = document.getElementsByTagName('body')[0];
            dom_element.addEventListener('click',function(){
                _this.fenceSearch_content_flag = false;
                dom_element.removeEventListener('click',function(){})
            })
        },
        evt_row_click:function(row){
            // console.log(row);
             // 分页参数初始化
            this.queryPen_page = 0;
            this.queryPen_dataList = [];
            this.queryPen_pageTotal = 1;
            if(this.select_type_name == 'fenceName'){
                this.fenceSearchId = row.fenceId;
                this.fenceSearchDeviceId = ''
            }else{
                this.fenceSearchId = '';
                this.fenceSearchDeviceId = row.deviceId;
            }
            this.fenceSearch_content_flag = false;
            this.evt_queryPen();
        },
        // 查询电子围栏
        evt_queryPen:function(){
            var _this = this;
            var query_data = {};
            query_data['pageSize'] = _this.queryPen_pageSize;
            query_data['page'] = _this.queryPen_page;
            if(_this.fenceSearchId != ''){
                query_data['fenceId'] = _this.fenceSearchId;
            }
            if(_this.fenceSearchDeviceId != ''){
                query_data['deviceId'] = _this.fenceSearchDeviceId;
            }
            api.queryPen(query_data).then((res) => {
                // console.log(res);
                if(res.success  && res.data.content.length > 0){
                    var new_data = res.data.content;
                    _this.queryPen_dataList = _this.queryPen_dataList.concat(new_data);
                    _this.queryPen_pageTotal = res.data.pageTotal;
                }
            }).catch((err) => {
                _this.$message({message:err.msg || '请求错误，请稍后重试',type:'error',offset:"200",duration:"1000"});
            })
        },
        // 触底加载更多
        evt_scroll_load:function(){
            if(this.queryPen_page == this.queryPen_pageTotal - 1){
                return;
            }
            this.queryPen_page = this.queryPen_page + 1;
            this.evt_queryPen();
        },
        // 切换围栏
        evt_dowm:function(index,item){
          //将点击的元素的索引赋值给变量
            this.active = index;
            // console.log(index);
            // console.log(item);
            this.evt_draw(item);
        },
        evt_draw:function(item){
            var _this = this;
            _this.map.clearOverlays();
            if(item.fenceType == 0){
                var point = new BMap.Point(item.circleFence.coordinate.lng,item.circleFence.coordinate.lat);
                var radius = item.circleFence.radius;
                var circle = new BMap.Circle(point,radius,_this.opts);
                _this.map.centerAndZoom(point,13);
                _this.map.addOverlay(circle);
            }else if(item.fenceType == 1){
                var point_arr = item.polygonFence.points;
                var points = [];
                for(let i = 0, len = point_arr.length; i < len; i++){
                    points.push(new BMap.Point(point_arr[i].lng,point_arr[i].lat))
                }
                var polygon = new BMap.Polygon(points,_this.opts);
                _this.map.centerAndZoom(points[points.length - 1],13);
                _this.map.addOverlay(polygon)
            }else if(item.fenceType == 2){
                var areaName = item.districtFence.areaName;
                var boundary = new BMap.Boundary();
                boundary.get(areaName,function(res){
                    // console.log(res);
                    if(res){
                        var point_arr = res.boundaries[0].split(';');
                        var points = [];
                        for(let i = 0,len = point_arr.length; i < len; i++){
                            points.push(new BMap.Point(point_arr[i].split(',')[0],point_arr[i].split(',')[1]));
                        }
                        // console.log(point_arr);
                        var polygon = new BMap.Polygon(points,_this.opts);
                        _this.map.addOverlay(polygon);
                        _this.map.setViewport(points);
                    }
                })
            }
        },
        // 获取行政区域
        evt_getRegion:function(){
            var _this = this;
            var ajax = new XMLHttpRequest();
            ajax.open('get','https://restapi.amap.com/v3/config/district?keywords=中国&subdistrict=3&key=7a81f34c17ac678bdd1c99905f92596a');
            ajax.send();
            ajax.onreadystatechange = function () {
                if (ajax.readyState==4 && ajax.status==200) {
                    // console.log(ajax.response);
                    // console.log(JSON.parse(ajax.response).districts[0]);
                    _this.Region_dataList = JSON.parse(ajax.response).districts[0];
                    _this.select_first_region = _this.Region_dataList.districts;
                }
            }
        },
        // 改变一级行政区域
        evt_change_frist_region:function(name){
            // console.log(name);
            this.selected_second_region = '';
            this.selected_third_region = '';
            for(let i = 0, len = this.select_first_region.length; i < len; i++){
                if(name == this.select_first_region[i].name){
                    this.select_second_region = this.select_first_region[i].districts;
                    
                    this.selected_adcode = this.select_first_region[i].adcode;//最终选择的行政区域码
                    this.selected_areaName = name;//最终选择的行政区名称
                    this.selected_level = 1;//最终选择的行政区级别
                    break;
                }
            }
        },
        // 改变二级行政区域
        evt_change_second_region:function(name){
            // console.log(name);
            this.selected_third_region = '';
            for(let i = 0, len = this.select_second_region.length; i < len; i++){
                if(name == this.select_second_region[i].name){
                    this.select_third_region = this.select_second_region[i].districts;
                    // if(this.select_second_region[i].districts.length == 0){
                    //     this.selected_adcode = this.select_second_region[i].adcode;
                    //     this.selected_areaName = this.select_second_region[i].name;
                    // }

                    this.selected_adcode = this.select_second_region[i].adcode;//最终选择的行政区域码
                    this.selected_areaName = name;//最终选择的行政区名称
                    this.selected_level = 2;//最终选择的行政区级别
                    break;
                }
            }
        },
        // 改变三级行政区域
        evt_change_third_region:function(name){
            // console.log(name);
            for(let i = 0 ,len = this.select_third_region.length; i < len; i++){
                if(name == this.select_third_region[i].name){
                    // this.selected_adcode = this.select_third_region[i].adcode;
                    // this.selected_areaName = this.select_third_region[i].name;

                    this.selected_adcode = this.select_third_region[i].adcode;//最终选择的行政区域码
                    this.selected_areaName = name;//最终选择的行政区名称
                    this.selected_level = 3;//最终选择的行政区级别
                    break;
                }
            }
        },
        // 搜索提示
        search_hint:function(){
            var _this = this;
            // 百度地图API功能
            function G(id) {
                return document.getElementById(id);
            }
            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : "suggestId"
                ,"location" : _this.map
            });

            ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }    
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
                
                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                }    
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                G("searchResultPanel").innerHTML = str;
            });

            var myValue;
            ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                _this.evt_setPlace(myValue);
                _this.search_address_key = myValue;
            });
        },
        evt_setPlace:function(value){
            var _this = this;
            _this.map.clearOverlays();    //清除地图上所有覆盖物
            function myFun(){
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                _this.map.centerAndZoom(pp, 16);
                _this.map.addOverlay(new BMap.Marker(pp));    //添加标注
            }
            var local = new BMap.LocalSearch(_this.map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(value);
        },
        // 点击搜索按钮
        evt_search_address:function(){
            if(this.search_address_key == '') return;
            this.evt_setPlace(this.search_address_key);
        },
        // 切换地图类型
        evt_change_mapType:function(type){
            if(type == 'moon'){
                this.map.setMapType(BMAP_HYBRID_MAP);
            }else{
                this.map.setMapType(BMAP_NORMAL_MAP);
            }
        },
        // 显示关联设备模块
        evt_show_relevance:function(item){
            this.relevance_fenceId = item.fenceId;
            this.relevance_device_flag = true;
            this.evt_getBusiness();
        },
        // 关闭关联设备弹框
        evt_close:function(){
            this.relevance_device_flag = false;
            this.user_list = [];
            this.user_id = '';
            this.devices_list = [];
            this.selected_devices = [];
            this.current_page_devices = [];
            this.selected_cancel = [];
            this.relevance_fenceId = '';
            this.searchBusiness_name = '';
            this.searchDevice_name = '';
        },
        //获取代理商
        evt_getBusiness:function(){
            var _this = this;
            api.getBusiness({}).then((res) => {
                // console.log(res);
                if(res.success){
                    if(res.data && res.data.length == 0){
                        _this.$message({message: '暂无用户列表数据',type:'info',offset:'200',duration:'1000'});
                        // return;
                    } 
                    for(let i = 0, len = res.data.length; i < len; i++){
                        var user_data = {};
                        user_data['label'] = res.data[i].username;
                        user_data['info'] = res.data[i]
                        user_data['user_id'] = res.data[i].userId;
                        _this.user_list.push(user_data);
                        _this.user_id = res.data[0].userId;
                    }
                    _this.$nextTick(function(){
                        _this.$refs.userTree.setCurrentKey(_this.user_id);
                        _this.evt_queryDevices();

                    })
                }else{
                    _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
                }
            }).catch((err) => {
                _this.$message({message: err.msg || '请求失败',type:'error',offset:'200',duration:'1000'});
            })
        },
        // el-tree 懒加载数组
        evt_loadTree:function(node, resolve){
            // console.log(node)
            var _this = this;
            if(node.level === 0){
                return resolve(_this.user_list);
            }
            if(node.level != 0){
                var request_data = {};
                request_data['parentId'] = node.data.info.userId;
                api.getBusiness(request_data).then((res) => {
                    if(res.success){
                        if(res.data.length == 0){
                            resolve([]);
                            return;
                        }
                        var children_data = [];
                        for(let i = 0, len = res.data.length; i < len; i++){
                            var user_data = {};
                            user_data['label'] = res.data[i].username;
                            user_data['info'] = res.data[i];
                            user_data['user_id'] = res.data[i].userId;
                            children_data.push(user_data);
                        }
                        node.data['children'] = children_data;
                        resolve(children_data);
                    }else{
                        _this.$message({message: res.msg,type:'warning',offset:'200',duration:'1000'});
                        resolve([]);
                    }
                }).catch((err) => {
                    _this.$message({message: err.msg,type:'error',offset:'200',duration:'1000'});
                    resolve([]);
                })
            }  
        },
        // 代理商的选择
        evt_node_click:function(e){
            // console.log(e.info);
            if (this.user_id == e.info.userId){
                return;
            }
            this.user_id = e.info.userId;
            // this.devices_list = [];
            this.evt_queryDevices();
        },
        // 查询设备
        evt_queryDevices:function(){
            var _this = this;
            var request_data = {};
            request_data['ownerId'] = _this.user_id;
            api.queryDevices(request_data).then((res) => {
                // console.log(res);
                if(res.success){
                    _this.devices_list = [];
                    if(res.data && res.data.length == 0) return;
                    _this.devices_list = res.data;
                    for(let i = 0, len = _this.devices_list.length; i < len; i++){
                        // 遍历增加一个区分是否选中的标识
                        _this.$set(_this.devices_list[i],'checked',false);
                        // 已选择的要关联的数据列表是否存在 如果存在对比设备列表中是否有选择中的设备
                        if(_this.selected_devices.length > 0){
                            for(let j = 0, len_j = _this.selected_devices.length; j < len_j; j++){
                                if(_this.devices_list[i].id == _this.selected_devices[j].id){
                                    _this.$set(_this.devices_list[i],'checked',true);
                                }
                            }
                        }
                    }
                }else{
                    _this.$message({message: res.msg,type:'warning',offset:'200',duration:'1000'});
                }
            }).catch((err) => {
                _this.$message({message: err.msg || '请求错误',type:'error',offset:'200',duration:'1000'});
            })
        },
        // 选择关联的设备
        evt_select_devices:function(Id){
            // console.log(Id);
            // 遍历修改操作的设备的是否选中标识  选中的情况下添加到要关联的设备数据中
            for(let i = 0,len = this.devices_list.length; i < len; i++){
                if(Id == this.devices_list[i].id){
                    if(this.devices_list[i].checked){
                        this.$set(this.devices_list[i],'checked',false);
                        for(let j = 0, le = this.selected_devices.length; j < le; j++){
                            if(Id == this.selected_devices[j].id){
                                this.selected_devices.splice(j,1);
                                break;
                            }
                        }
                    }else{
                        this.$set(this.devices_list[i],'checked',true);
                        this.selected_devices.push(this.devices_list[i]);
                    }
                    break;
                }
            }
            // this.evt_current_page_data();
        },
        // 取消要关联的设备
        evt_cancel_selected:function(item){
            for(let i = 0, len = this.selected_devices.length; i < len; i++){
                if(item.id == this.selected_devices[i].id){
                    this.selected_devices.splice(i,1);
                    break;
                }
            }
            for(let j = 0, len_j = this.devices_list.length; j < len_j; j++){
                if(item.id == this.devices_list[j].id){
                    this.$set(this.devices_list[j],'checked',false);
                    break;
                }
            }
        },
        // 清空所有选择
        evt_cancel_all_selected:function(){
            if(this.selected_devices.length == 0) return;
            this.selected_devices = [];
            for(let i = 0, len = this.devices_list.length; i < len; i++){
                if(this.devices_list[i].checked){
                    this.$set(this.devices_list[i],'checked',false);
                }
            }
        },


        
        // 处理关联设备的当前页数据
        evt_current_page_data:function(){
            // 整理当前页的数据
            if(this.selected_devices.length < 5){ //不满足分页
                this.current_page_devices = this.selected_devices;
                if(this.selected_devices_page != 1){
                    this.selected_devices_page = 1;
                }
            }else if(this.selected_devices.length >= 5){ //需要分页
                var total_page = Math.ceil(this.selected_devices.length / this.selected_devices_pagesize);
                if(total_page >= this.selected_devices_page){
                    this.current_page_devices = this.selected_devices.slice((this.selected_devices_page - 1) * this.selected_devices_pagesize,this.selected_devices_page * this.selected_devices_pagesize);
                }else{
                    this.selected_devices_page = this.selected_devices_page - 1;
                    this.current_page_devices = this.selected_devices.slice((this.selected_devices_page - 1) * this.selected_devices_pagesize,this.selected_devices_page * this.selected_devices_pagesize);
                }
            }
        },
        // 选择取消关联的设备
        evt_select_table:function(e){
            this.selected_cancel = e;
        },
        // 取消当前页所有已选择的关联设备
        evt_cancel_allSelect:function(){
            // 如果没有选中要取消关联的设备 直接return
            if(this.selected_cancel.length == 0){
                return;
            }
            for(let i = 0, len = this.selected_cancel.length; i < len; i++){
                for(let j = 0, le = this.selected_devices.length; j < le; j++){
                    if(this.selected_cancel[i].id == this.selected_devices[j].id){
                        this.selected_devices.splice(j,1);
                    }
                }
                for(let z = 0, l = this.devices_list.length; z < l; z++){
                    if(this.selected_cancel[i].deviceId == this.devices_list[z].id){
                        this.$set(this.devices_list[z],'checked',false);
                    }
                }
            }
            this.selected_cancel = [];
            this.evt_current_page_data();
        },
        // 表格里单个取消关联
        evt_cancel_item:function(content){
            // 如果没有选中要取消关联的设备 直接return
            if(this.selected_cancel.length == 0){
                return;
            }
            console.log(content);
            for(let i = 0, len = this.selected_cancel.length; i < len; i++){
                if(this.selected_cancel[i].id == content.id){
                    this.selected_cancel.splice(i,1);
                }
            }
            for(let z = 0, l = this.devices_list.length; z < l; z++){
                if(content.id == this.devices_list[z].id){
                    this.$set(this.devices_list[z],'checked',false);
                }
            }
            for(let i = 0, len = this.selected_devices.length; i < len; i++){
                if(this.selected_devices[i].id == content.id){
                    this.selected_devices.splice(i,1);
                    break;
                }
            }
            this.evt_current_page_data();
        },
        // 分页栏切换页面
        evt_current_change:function(num){
            this.current_page_devices = this.selected_devices.slice((num - 1) * this.selected_devices_pagesize, num * this.selected_devices_pagesize);
        },


        // 搜索用户searchBusiness
        evt_searchBusiness:function(){
            var _this = this;
            if(_this.searchBusiness_name.trim() == '') return;
            var request_data = {};
            request_data['searchContent'] = _this.searchBusiness_name;
            request_data['searchType'] = 'username';
            api.searchBusiness(request_data).then((res) => {
                // console.log(res);
                if(res.msg == "OK" && res.success){
                    _this.user_id = res.data[0].userId;
                    _this.evt_queryDevices();
                }
            }).catch((err) => {
                _this.$message({message:err.errMsg,type:'error',offset:'200',duration:'1000'});
            })
        },
        // 搜索当前用户下的设备
        evt_searchDevice:function(){
            var _this = this;
            if(_this.searchDevice_name.trim() == '') return;
            var request_data = {};
            // request_data['searchType'] = 'deviceName';
            // request_data['searchContent'] = _this.searchDevice_name;
            // request_data['ownerId'] = _this.user_id;
            // api.searchDevices(request_data).then((res) =>{
            //     console.log(res);
            //     if(res.msg == 'OK' && res.success){
            //         _this.devices_list = res.data;
            //     }
            // }).catch((err) => {
            //     _this.$message({message:err.msg,type:'error',offset:'200',duration:'1000'});
            // })
            request_data['page'] = 0;
            request_data['pageSize'] = 20;
            request_data['deviceNameKeyword'] = _this.searchDevice_name;
            api.getDevicesList(request_data).then((res) => {
                // console.log(res);
                if(res.success && res.data && res.data.content && res.data.content.length > 0){
                    _this.devices_list = res.data.content;
                }else{
                    _this.$message({message:'未查询到搜索设备',type:"info",offset:"200",duration:'1500'});
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:'error',offset:'200',duration:'1500'});
            })
        },
        // 提交关联设备
        evt_submit_relevance:function(){
            var _this = this;
            if(_this.selected_devices.length == 0){
                _this.$message({message:'请选择关联的设备',type:'warning',offset:'200',duration:'1000'});
                return;
            }
            var request_data = {};
            var deviceIdList = [];
            for(let i = 0, len = _this.selected_devices.length; i < len; i++){
                deviceIdList.push(_this.selected_devices[i].id);
            }
            request_data['deviceIdList'] = deviceIdList;
            request_data['fenceId'] = _this.relevance_fenceId;
            api.deviceBindFence(request_data).then((res) => {
                console.log(res);
                if(res.success){
                    _this.relevance_device_flag = false;
                    _this.user_list = [];
                    _this.user_id = '';
                    _this.devices_list = [];
                    _this.selected_devices = [];
                    _this.current_page_devices = [];
                    _this.selected_cancel = [];
                    _this.relevance_fenceId = '';
                    _this.searchBusiness_name = '';
                    _this.searchDevice_name = '';
                    _this.$message({message:'提交关联成功',type:'success',offset:'200',duration:'1000'})
                }else{
                    _this.$message({message: res.msg,type:'info',offset:'200',duration:'1000'})
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:'error',offset:'200',duration:'1000'})
            })
        },


       

        
        bd09togcj02(bd_lon, bd_lat) { 
    　      let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    　      let x = bd_lon - 0.0065;
    　      let y = bd_lat - 0.006;
    　      let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    　      let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    　      let gg_lng = z * Math.cos(theta);
    　      let gg_lat = z * Math.sin(theta);
    　      return [gg_lng, gg_lat]
　      },
        gcj02towgs84(lng, lat) { 
            var dlat = this.transformlat(lng - 105.0, lat - 35.0);
            var dlng = this.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * this.PI;
            var magic = Math.sin(radlat);
            magic = 1 - this.ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
            dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [lng * 2 - mglng, lat * 2 - mglat]
        },
        transformlat(lng, lat) { 
            var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin(lat / 3.0 * this.PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(lat / 12.0 * this.PI) + 320 * Math.sin(lat * this.PI / 30.0)) * 2.0 / 3.0;
            return ret
        },

        transformlng(lng, lat) { 
            var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin(lng / 3.0 * this.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(lng / 12.0 * this.PI) + 300.0 * Math.sin(lng / 30.0 * this.PI)) * 2.0 / 3.0;
            return ret
        },
    },
    filters:{
        formatDate(val) {
            let date = new Date(val)
            // 判断这个时间格式是否为NaN-aN-aN aN:aN:aN，
            return isNaN(date) ? " " : formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        }
    }
}
</script>
<style lang="scss" scoped>
#map{
    width: 100%;
    height:600px;
}
.app{
    margin: 0;
    /* padding: 20px; */
    background:#FFFFFF;
}
.left{
    display: flex;
    flex-direction: column;
}
.search{
    .search_top{
        width: 100%;
        height: 36px;
        background: #EEF3FE;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        line-height: 36px;
        padding-left: 10px;
        box-sizing: border-box;
    }
    .select_type_name{
        padding: 10px;
        box-sizing: border-box;
    }
}
.search_content{
    flex: 1;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .search_content_title{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        padding-bottom: 10px;
        color: #666666;
        position: relative;
        >div:nth-of-type(2){
            cursor: pointer;
        }
        .add_pen_hint{
            width: 80px;
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            padding: 10px 15px;
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #666666;
            line-height: 16px;
            box-sizing: border-box;
            position: absolute;
            top: 50%;
            right: -88px;
            transform: translateY(-50%);
            z-index: 99;
        }
        .add_pen_hint::before{
            content: '';
            width: 8px;
            height: 8px;
            border-top: 2px solid #CCCCCC;
            border-left: 2px solid #CCCCCC;
            background: #ffffff;
            position: absolute;
            top: 50%;
            left: -6px;
            transform: translateY(-50%) rotate(-45deg);
        }
    }
    .search_content_list{
        // flex: 1;
        // height: 600px;
        padding: 10px 0px;
        box-sizing: border-box;
        overflow: auto;
    }
}
.title{
    width: 100%;
    display: flex;
}
.title span{
    flex: 1;
    font-size: 20px;
}
.list{
    width: 100%;
    margin-bottom: 10px;
    .elecard{
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        .elecard_item_left{
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .elecard_item_right{
            width: 100%;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div:nth-of-type(1){
                width: 70%;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #333333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .elecard_item_right_t{
            justify-content: flex-end;
            >div:nth-of-type(1){
                width: auto !important;
            }
        }

    }
    .addclass{
        background-color: #E6ECFA;
        border: 1px solid #8EB0FF;
        box-sizing: border-box;
    }
}
.addele{
    width: 25%;
    position: absolute;
    top: 0px;
}
.addlist{
    display: flex;
    padding-top: 10px;
}
.addlist span{
    flex: 0.5;
}
.addlist .el-input{
    flex: 1;
}
.right-tab{
    position: absolute;
    top: 0px;
    background: #fff;
    padding: 20px;
    width: 60%;
}
.relevance_device{
    /deep/ .el-dialog__header{
        padding: 10px 20px;
        background-color: #648EF8;
    }
    /deep/ .el-dialog__title{
        height: 14px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #EFEFEF;
        line-height: 14px;
    }
    /deep/ .el-dialog__headerbtn .el-dialog__close{
        color: #FFFFFF;
    }
    /deep/ .el-dialog__headerbtn{
        top: 14px;
    }
    /deep/ .el-dialog__body{
        padding: 20px;
    }
}
.users{
    width: 100%;
    height: 24vh;
    border: 1px solid #CCCCCC;
    box-sizing: border-box;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .users_bottom{
        flex: 1;
        width: 70%;
        margin-top: 6px;
        overflow-y: scroll;
        /deep/ .row_item_bottom_left_userIcon{
            color: #F19B04 !important;
        }
        /deep/  .el-tree-node.is-current > .el-tree-node__content {
            background-color: #FFE6B0 !important;
            border: 1px solid #F19B04;
        }
    }
}
.devices{
    width: 100%;
    height: 24vh;
    border: 1px solid #CCCCCC;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    .devices_bottom{
        flex: 1;
        margin-top: 6px;
        overflow-y: scroll;
    }
}
.search_device{
    margin: 10px 0px;
    display: flex;
    justify-content: flex-end;
}
.relevance_table{
    // height: 30vh;
    border: 1px solid #EBEEF5;
    box-sizing: border-box;
    /deep/ .el-table th {
        background: #F2F2F2 !important;
    }
    
}
.relevance_device_bottom_btn{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.map_container{
    position: relative;
    .pen_type{
        display: flex;
        justify-items: center;
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 99;
        >div{
            padding: 5px 10px;
            background: #FFFFFF;
            border: 1px solid #CCCCCC;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 12px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #999999;
            margin-left: 5px;
            cursor: pointer;
        }
        .pen_type_item{
            background-color: #5E8BFF;
            color: #FFFFFF;
            border: 1px solid #5E8BFF;
            box-shadow: 0px 0px 4px 0px rgba(94, 139, 255, 0.2);
        }
    }
    .search_address{
        position: absolute;
        top: 20px;
        left: 30px;
        z-index: 99;
        #searchResultPanel{
            width: 280px;
            border:1px solid #C0C0C0;
            background: #ffffff;
            box-sizing: border-box;
            height: 400px;
            overflow-y: scroll;
            display: none;
        }
        .suggest_container{
            display: flex;
            justify-items: center;
            align-items: center;
            >input{
                width: 240px;
                height: 24px;
                background: #FFFFFF;
                border: 1px solid #CCCCCC;
                box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                outline:0px;
                font-size: 12px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: #999999;
                padding-left: 10px;
                line-height: 24px;
            }
            >span{
                width: 30px;
                height: 24px;
                background: #EEEEEE;
                border: 1px solid #CCCCCC;
                border-radius: 0px 4px 4px 0px;
                border-left: 0px;
                color: #999999;
                text-align: center;
                line-height: 24px;
                cursor: pointer;
            }
        }
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
.add_pen_round{

    /deep/ .el-dialog__header{
        padding: 12px;
        background: rgba(100, 142, 248, 1);
    }
    /deep/ .el-dialog__title{
        font-size: 14px;
        color: #ffffff;
    }
    /deep/ .el-dialog__headerbtn .el-dialog__close{
        color: #ffffff;
    }
    /deep/ .el-dialog__headerbtn{
        top: 14px;
    }
}
.fenceSearch_content{
    position: relative;
    .fenceSearch_content_tab{
        width: 100%;
        // height: 100px;
        max-height: 300px;
        overflow-y: scroll;
        background: #FFFFFF;
        border: 1px solid #DDDDDD;
        position: absolute;
        top: 34px;
        left: 0px;
        z-index: 999;
        cursor: pointer;
    }
}

/deep/ .el-table th.is-leaf{
        background: #f2f2f2 !important;
}
/deep/ .el-card{
    border: 0px;
}
/deep/ .el-card__body{
    padding: 5px;
}
/deep/ .anchorBL {
    display: block; 
}
/deep/ .BMap_cpyCtrl {
    display: block; 
}
#fence_search{
    height:32px;
    width:97%;
    box-sizing: border-box;
    padding:0px 5px;
    border:1px solid #DCDFE6;
    border-radius: 4px;
    outline: none;
}
#fence_search:focus{
    border: 1px solid #409EFF;
}
.select_collect{
    width: 100%;
    max-height: 300px;
    padding: 10px 0px;
    box-sizing: border-box;
    overflow-y: scroll;
    .select_collect_top{
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        >span:nth-of-type(1){
            color: #666666;
        }
        >span:nth-of-type(2){
            color: #4391FE;
            margin-left: 5px;
            cursor: pointer;
        }
    }
    .select_collect_content{
        display: flex;
        flex-wrap: wrap;
        .select_collect_content_item{
            margin-top: 10px;
            margin-right: 10px;
            padding: 4px;
            box-sizing: border-box;
            border: 1px solid #DDDDDD;
            display: flex;
            align-items: center;
            >span{
                font-size: 12px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #666666;
            }
            >img{
                margin-left: 5px;
                width: 20px;
                height: 20px;
                cursor: pointer;
            }
        }
    }
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
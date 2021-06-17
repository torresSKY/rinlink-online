<template>
    <div class="app" :style="{height:height +'px',overflow:'hidden' }">
        <el-row>
            <el-col class="row_item" :span="4" :style="{height:height +'px'}">
                <div class="row_item_left">
                    <div class="row_item_top_left">
                        <!-- <div>{{current_login_user_info.nickname}}{{current_login_user_info.devices ?  '(库存' + current_login_user_info.devices + '/总数' + (current_login_user_info.devices + current_login_user_info.sellDevices) + ')' : '' }}</div> -->
                        <div>客户列表</div>
                        <div><i class="el-icon-arrow-left"></i></div>
                    </div>
                    <div class="row_item_bottom_left">
                        <div class="row_item_bottom_left_search" v-show="search_user_list.length > 0">
                            <div v-for="(item,index) in search_user_list" :key="index" @click="evt_select_user(item)">{{item.nickname}}</div>
                        </div>
                        <el-input style="margin-bottom:10px;position: relative;" size="mini" placeholder="请输入客户名称" v-model="searchBusiness_name">
                            <el-button @click="evt_searchBusiness" size="mini" slot="append" icon="el-icon-search"></el-button>
                            
                        </el-input>
                        <el-scrollbar style="height:78vh;" ref="scrollbar">
                            <el-tree v-show="!default_expand_all_flag" ref="userTree" @node-click="evt_node_click" node-key="user_id" :default-expanded-keys="[user_id]"  :expand-on-click-node="false" :props="props" :data="user_list" :load="evt_loadTree" lazy :render-content="renderContent"></el-tree>
                            <el-tree v-show="default_expand_all_flag" ref="userTree" @node-click="evt_node_click" node-key="user_id" default-expand-all  :expand-on-click-node="false" :props="props" :data="user_list" :load="evt_loadTree" lazy :render-content="renderContent"></el-tree>
                        </el-scrollbar>
                    </div>
                </div>
            </el-col>
            <el-col class="row_item" :span="4" :style="{height:height +'px'}">
                <div class="row_item_middle">
                     <div class="row_item_middle_top">
                        <div>
                            <div @click="evt_change_type('all')" :class="change_type == 'all' ? 'select_item' :''">全部{{'('+ (OnlineDvice + OfflineDvice) + ')'}}</div>
                            <div @click="evt_change_type('on')" :class="change_type == 'on' ? 'select_item' :''">在线{{'('+ OnlineDvice + ')'}}</div>
                            <div @click="evt_change_type('off')" :class="change_type == 'off' ? 'select_item' :''">离线{{'('+ OfflineDvice + ')'}}</div>
                        </div>
                        <div><i class="el-icon-arrow-left"></i></div>
                    </div>
                    <div class="row_item_middle_middle">
                        <el-input style="margin-bottom:10px" size="mini" placeholder="请输入设备名称" v-model="searchDevice_name">
                            <el-button @click="evt_searchDevice" size="mini" slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </div>
                    <div class="row_item_middle_bottom">
                        <div class="item_content">
                            <template v-if="devices_list.length > 0">
                                <div class="devices_item" :class="[item.id == current_select_deviceId ? 'devices_item_t':'', item.lastReportDataTime == null ? 'item_opacity': '',]" v-for="item in devices_list" :key="item.id">
                                    <div class="devices_item_mask" v-if="item.lastReportDataTime == null"></div>
                                    <div class="devices_item_top" @click="evt_select_devices(item.id,'selected')">
                                        <img @click.stop="evt_select_devices(item.id,'checked')" v-show="!item.checked" :src="require('../../assets/img/no_select_icon.png')" style="width:20px;height:20px;flex-shrink: 0;">
                                        <img @click.stop="evt_select_devices(item.id,'checked')" v-show="item.checked" :src="require('../../assets/img/selected_icon.png')" style="width:20px;height:20px;flex-shrink: 0;">
                                        <el-avatar class="devices_item_top_avatar" size="small" :src="item.networkStatus == '1' ? item.useRangeCode != null ? icon_list_t[item.useRangeCode].iconUrlForConsoleActive : icon_list_t['Other'].iconUrlForConsoleActive :item.useRangeCode != null ? icon_list_t[item.useRangeCode].iconUrlForConsoleInactive : icon_list_t['Other'].iconUrlForConsoleInactive"></el-avatar>
                                        <div class="devices_item_top_right">
                                            <div class="devices_item_top_right_top">
                                                <div class="devices_item_top_right_top_left" :class="item.networkStatus == '1' ? 'devices_item_top_right_top_left_t' : ''">{{item.deviceName}}</div>
                                                <div class="devices_item_top_right_top_right" :class="item.networkStatus != '1' ? 'devices_item_top_right_top_right_t' : ''">{{item.lastReportDataTime|formatStatus(item.networkStatus,item.activationTime,item.serviceExpireTime)}}</div>
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
                                        <!-- :class="item.activationTime != null ? 'devices_item_bottom_more':''" -->
                                        <div class="devices_item_bottom_more">
                                            <el-dropdown @command="evt_more_command" size="mini">
                                                <span class="el-dropdown-link">更多</span>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item :command="{type:'detail',deviceId:item.id}">设备详情</el-dropdown-item>
                                                    <el-dropdown-item :command="{type:'command',deviceId:item.id,deviceModelId:item.deviceModel.id,deviceInfo:item}">设备指令</el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>
                                    </div>
                                    <div v-if="item.activationTime != null && current_time > item.serviceExpireTime" class="devices_item_bottom_two">
                                        <div><span class="span_hover">充值缴费</span></div>
                                        <div><span class="span_hover" @click="evt_more_command({type:'detail',deviceId:item.id})">设备详情</span></div>
                                    </div>
                                </div>
                            </template>
                            <div v-if="devices_list.length == 0" style="font-size:14px;text-align:center;">暂无设备数据</div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col class="row_item" :span="16" :style="{height:height +'px'}">
                <div class="row_item_right">
                    <!-- 首次展示头部 -->
                    <div class="row_item_right_top" v-if="!track_detail">
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
                    <div class="playback_top" v-if="track_detail">
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
                            <el-col :span="7">
                                <div class="speed_content">
                                    <span class="speed_content_text">速度：慢</span>
                                    <el-slider @change="evt_change_speed" class="slider_style_2" :min="100" :step="20" :max="500" v-model="speed" :show-tooltip="false"></el-slider>
                                    <span class="speed_content_text">快</span>
                                    <span class="speed_content_text speed_content_text_t">总里程：{{total_distance}}km</span>
                                </div>
                            </el-col>
                            <el-col :span="7" :offset="5">
                                <el-button @click="evt_query_tracks" type="primary" size="mini">确定</el-button>
                                <el-button @click="evt_show_tracksDetail" type="primary" size="mini">轨迹明细</el-button>
                                <el-button type="primary" size="mini">导出轨迹</el-button>
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
                        <el-table ref="singleTable" :data="tracksDetail_list" highlight-current-row @current-change="evt_handleCurrentChange" height="220" border style="width: 100%" size="small">
                            <el-table-column type="index" label="序号" min-width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column :formatter="evt_table_formatDate" prop="time" label="更新时间" min-width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column :formatter="evt_table_formatLng" prop="lng" label="经度" min-width="80" show-overflow-tooltip></el-table-column>
                            <el-table-column :formatter="evt_table_formatLat" prop="lat" label="纬度" min-width="80" show-overflow-tooltip></el-table-column>
                            <el-table-column :formatter="evt_table_formatMileage" prop="mileageKmRelative" label="行驶里程(km)" min-width="60" show-overflow-tooltip></el-table-column>
                            <el-table-column :formatter="evt_table_formatSpeed" prop="speed" label="速度(km/h)" min-width="60" show-overflow-tooltip></el-table-column>
                            <el-table-column :formatter="evt_table_formatPositionType" prop="positionType" label="定位类型" min-width="80" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="address" fixed="right"  label="位置" min-width="200" show-overflow-tooltip>
                                <!-- <template slot-scope="scope">
                                    <el-button v-if="scope.row.address == 'address'" @click="evt_getAdress(scope.row)" type="text" size="small">点击获取定位</el-button>
                                    <el-button v-if="scope.row.address != 'address'" type="text" size="small">{{scope.row.address}}</el-button>
                                </template> -->
                            </el-table-column>
                        </el-table>
                        <!-- <el-pagination small background layout="total,prev, pager, next,jumper" @current-change="evt_change_current" :hide-on-single-page="true" :current-page="current_tracksDetail_page" :page-size="5" :total="tracksDetail_list.length" style="text-align:center;margin-top:10px;"></el-pagination> -->
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
                        <el-form-item label="设备IMEI:">
                            <span>{{device_detail_info.deviceNumber}}</span>
                        </el-form-item>
                        <el-form-item label="网络状态:">
                            <span>{{device_detail_info.networkStatus == '1' ? '在线' : '离线'}}</span>
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
        <el-drawer class="device_order" modal direction="rtl" :show-close="false" :visible="device_command_visible" size="60%">
            <template slot="title">
                <i class="device_order_top_icon el-icon-back" @click="evt_close_command_content"></i>
                <span class="device_order_top_text" @click="evt_close_command_content">返回</span>
            </template>
            <el-tabs type="border-card" v-model="tab_value" @tab-click="evt_tab_click">
                <el-tab-pane label="指令参数" name="parameter">
                    <send-order ref="sendOrder" :list = "multipleSelection" @confrimSend='confrimSend'/>
                </el-tab-pane>
                <el-tab-pane label="历史指令" name="history">
                    <el-table class="" :data="command_data_list" border style="width: 100%" size="small">
                        <!-- <el-table-column fixed prop="commandId" label="指令ID" min-width="160" show-overflow-tooltip></el-table-column> -->
                        <el-table-column fixed label="序号" type="index" min-width="50" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="commandName" label="指令类型" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column :formatter="evt_table_formatCommandData" prop="commandData" label="指令数据" min-width="180" show-overflow-tooltip></el-table-column>
                        <el-table-column :formatter="evt_table_formatDate" prop="createTime" label="创建时间" min-width="100" show-overflow-tooltip></el-table-column>
                        <el-table-column :formatter="evt_table_formatCommandStatus" prop="commandStatus" label="指令结果" min-width="80" show-overflow-tooltip></el-table-column>
                    </el-table>
                    <el-pagination @current-change="evt_current_change" small background layout="total,prev, pager, next,jumper" :hide-on-single-page="true" :current-page="command_page" :page-size="command_pageSize" :total="command_total" style="text-align:center;margin-top:30px;"></el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-drawer>

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
export default {
    name: 'electric',
    mixins:[mixin],
    components:{sendOrder},
    data(){
        return{
            imei: this.$route.query.imei,
            lon: this.$route.query.lon,
            lat: this.$route.query.lat,
            x_PI: 3.14159265358979324 * 3000.0 / 180.0,
            PI: 3.1415926535897932384626,
            a: 6378245.0,
            ee: 0.00669342162296594323,
            device_info_model:'',
            order_form_value:'',
            order_form_parameter:'',
            height: 0, //可视高度
            map: null,//实例化地图
            change_type:'all',//切换全部、在线、离线设备统计
            renderContent:function (h,{node,data,store}) {
                let addElement = arguments[0];
                return addElement('span',[
                    addElement('i',{class:"el-icon-s-custom row_item_bottom_left_userIcon"}),
                    addElement('span',"    "),
                    addElement('span',arguments[1].node.label)
                ]);
            },
            user_list:[],//用户列表
            user_id:'',//用户查询用户设备列表的用户id
            devices_list:[],//当前用户的设备列表
            searchBusiness_name:'',//搜索用户关键字
            searchDevice_name:'',//搜索设备的关键字
            selected_devices:[],//选中的设备
            device_info_visible:false,//设备具体信息的展示框
            device_command_visible:false,//设备指令弹框展示
            need_handle_deviceId:'',//更多下拉框需要进行操作的设备的id
            device_detail_info:{},//设备的详细信息
            device_name:'',//设备名称
            remark_text:'',//设备备注信息
            icon_list:[],//适用范围图标
            icon_list_t:{},
            range_code:'',//设备使用范围的code
            tab_value:'history',
            command_page:1,//历史指令当前页
            command_pageSize:10,//历史指令页面数据条数
            command_total:0,//历史指令的总条数
            command_data_list:[],//历史指令的当前页数据
            need_deviceModelId: '',//需要获取指令模板列表的设备型号
            command_templates_list: [],//设备指令模板列表信息
            command_template_id:'',//选择下发的模板指令id
            template_content: {},//选择要下发指令的模板内容信息
            is_template_content: true,//模板内容信息是否为空 默认不为空
            current_select_deviceId:'',//当前选择的设备id
            show_deviceName: true,//是否显示设备名称
            track_detail:false,//展示轨迹
            current_device_name:'',//当前选中设备的名称
            current_device_address:'',//当前选中设备的位置
            select_date:'今天',//选择日期
            select_date_time:[],//选择的日期时间
            startTime:0,//开始时间戳
            endTime:0,//结束时间戳
            position_type:['1','2','3'],//多选定位类型
            device_tracks:[],//设备轨迹信息
            device_tracks_shift:[],//回放过的轨迹信息
            play_flag:true,//播放与暂停 默认播放
            device_tracks_step:0,//轨迹播放步数
            device_tracks_max:0,//轨迹回放最大数
            device_tracks_interval:null,//轨迹回放定时器
            speed:300,
            tracksDetail_flag:false,//显示轨迹明细
            tracksDetail_list:[],//轨迹明细信息
            table_row_info:{},//单选中的轨迹明细信息
            current_tracksDetail_list:[],//当前页轨迹明细信息
            current_tracksDetail_page:1,
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
                2: '已发送',
                3: '已送达',
                4: '失败',
                5: '过期'
            },//指令状态
            multipleSelection:[],//使用下发指令模板传递的设备信息
            OnlineDvice:0,//在线设备数量
            OfflineDvice:0,//离线设备数量
            current_time:0,//当前时间戳
            props:{
                isLeaf: 'isLeaf'
            },
            zIndex: 1,//marker,label层级
            default_expand_all_flag: false,
            search_user_list:[],//模糊搜索的用户信息集合
            total_distance: 0,//总里程
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
            // 获取设备详情信息
            this.evt_getDeviceInfo();
        }
        
        this.evt_getRangeIconList();
        
        if(JSON.parse(sessionStorage['user']).userType == '2'){
            this.evt_getBusinessUserinfo();
        }else if(JSON.parse(sessionStorage['user']).userType == '3'){
            // this.current_login_user_info = JSON.parse(sessionStorage['user']);
            this.evt_getCurrentUserInfo();
        }
        // 获取用户的在线离线设备数量
        this.evt_getOnlineDvice();
        this.evt_getOfflineDevice();
        // 当前时间戳
        this.current_time = new Date().getTime();
    },
    mounted(){
        this.height = document.body.offsetHeight - 60;
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
        // 切换地图类型
        evt_change_mapType:function(type){
            if(type == 'moon'){
                this.map.setMapType(BMAP_HYBRID_MAP);
            }else{
                this.map.setMapType(BMAP_NORMAL_MAP);
            }
        },
        // 获取当前登录用户的信息 b端用户
        evt_getBusinessUserinfo:function(){
            var _this = this;
            api.getBusinessUserinfo({},_this.userType_parameter).then((res) =>{
                // console.log(res);
                if(res.success && res.data && Object.keys(res.data).length > 0){
                    // _this.current_login_user_info = res.data;
                    _this.user_id = res.data.userId;
                    var user_data = {};
                    user_data['label'] = res.data.nickname + '(库存:' + res.data.devices + '/总数:' + (res.data.devices + res.data.sellDevices) + ')';
                    user_data['info'] = res.data
                    user_data['user_id'] = res.data.userId;
                    if(res.data.children != null && res.data.children > 0){
                        user_data['isLeaf'] = false;
                    }else{
                        user_data['isLeaf'] = true;
                    }
                    _this.user_list.push(user_data);
                    _this.$nextTick(function(){
                        _this.$refs.userTree.setCurrentKey(_this.user_id);
                        _this.evt_queryDevices('currentUser');
                    })
                }
            }).catch((err) => {
                _this.$message({message: err.msg, type:'error',offset:'200',duration:'1500'})
            })
        },
        // 获取当前用户的信息
        evt_getCurrentUserInfo:function(){
            var _this = this;
            api.getCurrentUserInfo({}).then((res) => {
                // console.log(res);
                if(res.success && res.data && Object.keys(res.data).length > 0){
                    var user_data = {};
                    user_data['label'] = res.data.nickname;
                    user_data['info'] = res.data
                    user_data['user_id'] = res.data.userId;
                    user_data['isLeaf'] = true;
                    _this.user_list.push(user_data);
                    _this.user_id = res.data.userId;
                    _this.$nextTick(function(){
                        _this.$refs.userTree.setCurrentKey(_this.user_id);
                        _this.evt_queryDevices('currentUser');
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
            if(JSON.parse(sessionStorage['user']).userType == '3'){
                resolve([]);
                return;
            }
            if(node.level === 0){
                return resolve(_this.user_list);
            }
            if(node.level != 0){
                var request_data = {};
                request_data['parentId'] = node.data.info.userId;
                api.getBusiness(request_data,_this.userType_parameter).then((res) => {
                    if(res.success){
                        if(res.data.length == 0){
                            resolve([]);
                            return;
                        }
                        var children_data = [];
                        for(let i = 0, len = res.data.length; i < len; i++){
                            var user_data = {};
                            user_data['label'] = res.data[i].nickname + '(' + res.data[i].devices +'/'+ (res.data[i].devices + res.data[i].sellDevices) +')';
                            user_data['info'] = res.data[i];
                            user_data['user_id'] = res.data[i].userId;
                            if(res.data[i].children == 0){
                                user_data['isLeaf'] = true;
                            }else{
                                user_data['isLeaf'] = false;
                            }
                            children_data.push(user_data);
                        }
                        node.data['children'] = children_data;
                        resolve(children_data);
                    }else{
                        _this.$message({message: res.msg,type:'error',offset:'200',duration:'1000'});
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
            this.need_handle_deviceId = '';
            this.current_select_deviceId = '';
            this.current_device_name = '';
            this.current_device_address = '';
            this.user_id = e.info.userId;
            // this.devices_list = [];
            this.evt_clearOverlays();
            // 判断是不是当前登录用户 当前登录用户请求查询设备时 不传递userid参数
            if(this.user_id == JSON.parse(sessionStorage['user']).userId){
                this.evt_queryDevices('currentUser');
            }else{
                this.evt_queryDevices();
            }
            // 获取用户的在线离线设备数量
            this.evt_getOnlineDvice();
            this.evt_getOfflineDevice();
            // 
            clearInterval(this.device_tracks_interval);
            this.track_detail = false;
            this.device_tracks_step = 0;
            this.map.closeInfoWindow();
            this.tracksDetail_flag = false;
            this.interval_num = parseInt(this.refresh_interval);
            this.evt_refresh_interval();
        },
        // 搜索查询用户
        evt_searchBusiness:function(){
            var _this = this;
            if(_this.searchBusiness_name.trim() == '') return;
            if(_this.userType_parameter != '3' && !_this.default_expand_all_flag){
                _this.default_expand_all_flag = true;
                _this.user_list = [];
                _this.evt_getBusinessUserinfo();
            }
            var request_data = {};
            request_data['searchContent'] = _this.searchBusiness_name;
            request_data['searchType'] = 'nickname';
            api.searchBusiness(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.data && res.data.length > 0 && res.success){
                    _this.search_user_list = res.data;
                }else{
                    _this.$message({message:'暂未搜索到指定用户',type:'warning',offset:'200'})
                }
            }).catch((err) => {
                _this.$message({message:err.msg || '请求错误，请稍后重试',type:'error',offset:'200',duration:'1000'});
            })
        },
        evt_select_user:function(item){
            console.log(item);
            this.search_user_list = [];
            this.user_id = item.userId;
            this.change_type = 'all';
            this.evt_queryDevices();
            this.$refs.userTree.setCurrentKey(this.user_id);
            // 获取用户的在线离线设备数量
            this.evt_getOnlineDvice();
            this.evt_getOfflineDevice();
        },
        // 查询设备
        evt_queryDevices:function(type){
            var _this = this;
            var request_data = {};
            if(type != 'currentUser'){
                request_data['ownerId'] = _this.user_id;
            }
            if(_this.change_type != 'all' && _this.change_type == 'on'){
                request_data['networkStatus'] = '1';
            }else if(_this.change_type != 'all' && _this.change_type == 'off'){
                request_data['networkStatus'] = '2';
            }
            api.queryDevices(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success && res.data){
                    _this.devices_list = [];
                    // 把设备返回的gdj02坐标转换成bd09
                    for(var key in res.data){
                        if(res.data[key].positionInfo && Object.keys(res.data[key].positionInfo).length > 0 &&  Object.keys(res.data[key].positionInfo.coordinate).length > 0){
                            var point_t = gcj02tobd09(res.data[key].positionInfo.coordinate.lng,res.data[key].positionInfo.coordinate.lat);
                            res.data[key].positionInfo.coordinate.lng = point_t[0];
                            res.data[key].positionInfo.coordinate.lat = point_t[1];
                        }
                    }
                    _this.devices_list = res.data;
                    for(let i = 0, len = _this.devices_list.length; i < len; i++){
                        // 遍历增加一个区分是否选中的标识
                        _this.$set(_this.devices_list[i],'checked',false);
                        if(this.$route.query.deviceId && this.$route.query.deviceId == _this.devices_list[i].id){
                            _this.$set(_this.devices_list[i],'checked',true);
                            _this.evt_route(_this.devices_list[i]);
                        }
                    }
                }
            }).catch((err) => {
                _this.$message({message: err.msg,type:'error',offset:'200',duration:'1000'});
            })
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
            if(this.change_type == value) return;
            this.change_type = value;
            // this.devices_list = [];
            if(value == 'on' || value == 'off'){
                this.evt_clearOverlays();
                this.current_select_deviceId = '';
                // 
                clearInterval(this.device_tracks_interval);
                this.track_detail = false;
                this.device_tracks_step = 0;
                this.map.closeInfoWindow();
                this.tracksDetail_flag = false;
                this.interval_num = parseInt(this.refresh_interval);
                this.evt_refresh_interval();
            }
            // 判断是不是当前登录用户 当前登录用户请求查询设备时 不传递userid参数
            if(this.user_id == JSON.parse(sessionStorage['user']).userId){
                this.evt_queryDevices('currentUser');
            }else{
                this.evt_queryDevices();
            }
            // this.evt_queryDevices();
        },
        // 搜索设备
        evt_searchDevice:function(){
            var _this = this;
            if(_this.searchDevice_name.trim() == '') return;
            _this.change_type = 'all';
            var request_data = {};
            request_data['page'] = 0;
            request_data['pageSize'] = 20;
            request_data['deviceNameKeyword'] = _this.searchDevice_name;
            // 判断是不是当前登录用户 当前登录用户请求查询设备时 不传递userid参数
            if(_this.user_id != JSON.parse(sessionStorage['user']).userId){
                request_data['ownerId'] = _this.user_id;
            }
            api.getDevicesList(request_data,_this.userType_parameter).then((res) => {
                console.log(res);
                if(res.success && res.data && res.data.content && res.data.content.length > 0){
                    // 把设备返回的gdj02坐标转换成bd09
                    for(var key in res.data.content){
                        if(res.data.content[key].positionInfo && Object.keys(res.data.content[key].positionInfo).length > 0 &&  Object.keys(res.data.content[key].positionInfo.coordinate).length > 0){
                            var point_t = gcj02tobd09(res.data.content[key].positionInfo.coordinate.lng,res.data.content[key].positionInfo.coordinate.lat);
                            res.data.content[key].positionInfo.coordinate.lng = point_t[0];
                            res.data.content[key].positionInfo.coordinate.lat = point_t[1];
                        }
                    }
                    _this.devices_list = res.data.content;
                    for(let i = 0, len = _this.devices_list.length; i < len; i++){
                        _this.$set(_this.devices_list[i],'checked',false);
                    }
                }else{
                    _this.$message({message:'未查询到搜索设备',type:"info",offset:"200",duration:'1500'});
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:'error',offset:'200',duration:'1500'});
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
            // 判断是不是当前登录用户 当前登录用户请求查询设备时 不传递userid参数
            if(this.user_id != JSON.parse(sessionStorage['user']).userId){
                request_data['ownerId'] = _this.user_id;
            }
            if(_this.change_type != 'all' && _this.change_type == 'on'){
                request_data['networkStatus'] = '1';
            }else if(_this.change_type != 'all' && _this.change_type == 'off'){
                request_data['networkStatus'] = '2';
            }
            api.queryDevices(request_data,_this.userType_parameter).then((res) => {
                if(res.success && res.data && res.data.length > 0){
                    _this.evt_clearOverlays();
                    // 把设备返回的gdj02坐标转换成bd09
                    for(var key in res.data){
                        if(res.data[key].positionInfo && Object.keys(res.data[key].positionInfo).length > 0 &&  Object.keys(res.data[key].positionInfo.coordinate).length > 0){
                            var point_t = gcj02tobd09(res.data[key].positionInfo.coordinate.lng,res.data[key].positionInfo.coordinate.lat);
                            res.data[key].positionInfo.coordinate.lng = point_t[0];
                            res.data[key].positionInfo.coordinate.lat = point_t[1];
                        }
                    }
                    var refresh_devices_list = res.data;
                    var infoWindow_info = {};
                    for(let i in refresh_devices_list){
                        if(refresh_devices_list[i].id == _this.current_select_deviceId){
                            infoWindow_info = refresh_devices_list[i];
                        }
                        for(let j in _this.devices_list){
                            if(refresh_devices_list[i].id == _this.devices_list[j].id && _this.devices_list[j].checked){
                                _this.$set(refresh_devices_list[i],'checked',true);
                                if(refresh_devices_list[i].positionInfo && refresh_devices_list[i].positionInfo.coordinate && refresh_devices_list[i].positionInfo.coordinate.lng){
                                    var point = new BMap.Point(refresh_devices_list[i].positionInfo.coordinate.lng,refresh_devices_list[i].positionInfo.coordinate.lat);
                                    _this.evt_addMarker(point,refresh_devices_list[i]);
                                    if(_this.show_deviceName){
                                        _this.evt_addLabel(point,refresh_devices_list[i]);
                                    }
                                }
                            }else if(refresh_devices_list[i].id == _this.devices_list[j].id && !_this.devices_list[j].checked){
                                _this.$set(refresh_devices_list[i],'checked',false)
                            }
                        }
                    }
                    if(_this.current_select_deviceId.trim() != '' && infoWindow_info.id && infoWindow_info.positionInfo && infoWindow_info.positionInfo.coordinate && infoWindow_info.positionInfo.coordinate.lng){
                        var point_t = new BMap.Point(infoWindow_info.positionInfo.coordinate.lng,infoWindow_info.positionInfo.coordinate.lat);
                        _this.evt_addInfoWindow(point_t,infoWindow_info);
                        // _this.map.panTo(point_t);
                        _this.map.setCenter(point_t);
                    }
                    _this.devices_list = refresh_devices_list;
                }
            }).catch((err) => {
                _this.$message({message: err.msg,type:'error',offset:'200',duration:'1000'});
            })
        },
        // 选中、取消选择设备
        evt_select_devices:function(deviceId,type){
            // console.log(deviceId);
            var allOverlays = this.map.getOverlays();
            // console.log(allOverlays);
            clearInterval(this.device_tracks_interval);
            this.track_detail = false;
            this.device_tracks_step = 0;
            for(var key in allOverlays){
                if( typeof(allOverlays[key].name) == 'number' || allOverlays[key].name == 'playFlag'){
                    this.map.removeOverlay(allOverlays[key]); 
                }
            }
            this.map.closeInfoWindow();
            this.tracksDetail_flag = false;
            for(let i = 0, len = this.devices_list.length; i < len; i++){
                if(deviceId == this.devices_list[i].id){
                    if(this.devices_list[i].checked && type == 'checked'){
                        this.$set(this.devices_list[i],'checked',false);
                        this.current_select_deviceId = '';
                        if(this.devices_list[i].positionInfo && this.devices_list[i].positionInfo.coordinate && this.devices_list[i].positionInfo.coordinate.lng){
                            this.evt_deleteOverlay(this.devices_list[i].positionInfo.coordinate.lng,this.devices_list[i].positionInfo.coordinate.lat);
                        }
                    }else{
                        this.$set(this.devices_list[i],'checked',true);
                        this.need_handle_deviceId = this.devices_list[i].id;
                        this.current_select_deviceId = this.devices_list[i].id;
                        if(this.devices_list[i].positionInfo && this.devices_list[i].positionInfo.coordinate && this.devices_list[i].positionInfo.coordinate.lng){
                            // 删除如果已存在的覆盖层 重新添加
                            for(var key in allOverlays){
                                if(allOverlays[key].point && allOverlays[key].point.lng == this.devices_list[i].positionInfo.coordinate.lng && allOverlays[key].point.lat == this.devices_list[i].positionInfo.coordinate.lat){
                                    this.map.removeOverlay(allOverlays[key]); 
                                }
                            }
                            this.evt_addOverlay(this.devices_list[i]);
                            var point = new BMap.Point(this.devices_list[i].positionInfo.coordinate.lng,this.devices_list[i].positionInfo.coordinate.lat);
                            this.evt_getLocation(point);
                        }
                        this.current_device_name = this.devices_list[i].deviceName;
                    }
                    break;
                }
            }
            this.interval_num = parseInt(this.refresh_interval);
            this.evt_refresh_interval();
        },
        // 更多下拉框的操作
        evt_more_command:function(item){
            // console.log(item);
            this.need_handle_deviceId = item.deviceId;
            if(item.type == 'detail'){
                this.evt_getDeviceInfo();
                this.device_info_visible = true;
            }else if(item.type == 'command'){
                this.need_deviceModelId = item.deviceModelId;
                this.evt_queryDeviceCmds();
                this.device_command_visible = true;
                this.multipleSelection = [item.deviceInfo];
            }
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
                console.log(res);
                if(res.success && res.data && Object.keys(res.data).length > 0){
                    _this.device_detail_info = res.data;
                    if(_this.$route.query.deviceId){
                        _this.track_detail = true;
                        _this.current_device_name = res.data.deviceName;
                    }
                    _this.device_name = res.data.deviceName;
                    _this.remark_text = res.data.remark;
                    _this.range_code = res.data.useRangeCode;
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
                console.log(res);
                if(res.success){
                    _this.device_info_visible = false;
                    _this.$message({message:'更新成功',type:'success',offset:"200",duration:'1000'});
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:"error",offset:'200',duration:'1000'})
            })
        },
        // 关闭指令弹框
        evt_close_command_content:function(){
            this.device_command_visible = false;
            this.command_page = 1;
            this.command_total = 0;
            this.command_data_list = [];
            this.command_templates_list = [];
            this.command_template_id = '';
            this.is_template_content = true;
            this.command_templates_list = {};
            this.tab_value = 'history';
        },
        // 设备指令的tab切换
        evt_tab_click:function(){
            // console.log(this.tab_value);
            this.command_page = 1;
            this.command_total = 0;
            this.command_data_list = [];
            this.command_templates_list = [];
            this.command_template_id = '';
            this.is_template_content = true;
            this.command_templates_list = {};
            if(this.tab_value == 'history'){
                this.evt_queryDeviceCmds();
            }else{
                this.$nextTick(() => {
                    this.$refs.sendOrder.formData = {}
                    this.$refs.sendOrder.schema = null
                    this.$refs.sendOrder.deviceCmdTemplateId = null
                    this.$refs.sendOrder.getlist()
                })
            }
        },
        confrimSend:function(data){ // 
            //console.log(data);
            if(!data){
                this.evt_close_command_content();
            }
        },
        // 获取设备历史指令
        evt_queryDeviceCmds:function(){
            var _this = this;
            var request_data = {};
            request_data['page'] = _this.command_page - 1;
            request_data['pageSize'] = _this.command_pageSize;
            request_data['deviceId'] = _this.need_handle_deviceId;
            api.queryDeviceCmds(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success && res.data && res.data.content && res.data.content.length > 0){
                    _this.command_data_list = res.data.content;
                    _this.command_total = res.data.pageTotal * _this.command_pageSize;
                }else if(!res.success){
                    _this.$message({message: res.msg, type:"info", offset: "200", duration:"1500"});
                }
            }).catch((err) => {
                _this.$message({message: err.msg, type:"error", offset: "200", duration:"1500"});
            })
        },
        // 分页页数改变
        evt_current_change:function(num){
            this.command_page = num;
            this.evt_queryDeviceCmds();
        },
         // 添加覆盖物
        evt_addOverlay:function(info){
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
            var icon_url = info.networkStatus == '1' ? info.useRangeCode != null ? _this.icon_list_t[info.useRangeCode].iconUrlForConsoleActive :  _this.icon_list_t['Other'].iconUrlForConsoleActive : info.useRangeCode != null ? _this.icon_list_t[info.useRangeCode].iconUrlForConsoleInactive :  _this.icon_list_t['Other'].iconUrlForConsoleInactive;
            var marker_icon = new BMap.Icon(icon_url,new BMap.Size(40,40),{
                imageSize: new BMap.Size(40,40),
            });
            var marker = new BMap.Marker(point, {icon: marker_icon});
            marker.addEventListener('click',function(e){
                // console.log(e);
                for(let i = 0, len = _this.devices_list.length; i < len; i++){
                    if(e.currentTarget.point.lng ==  _this.devices_list[i].positionInfo.coordinate.lng  && e.currentTarget.point.lat == _this.devices_list[i].positionInfo.coordinate.lat){
                        _this.map.closeInfoWindow();
                        var current_point = new BMap.Point(_this.devices_list[i].positionInfo.coordinate.lng,_this.devices_list[i].positionInfo.coordinate.lat);
                        _this.evt_addInfoWindow(current_point,_this.devices_list[i]);
                    }
                    break;
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
                    <span>设备号：${info.deviceNumber}</span>
                </div>
                <div class="info_window_content_item">
                    <span>网络状态：${info.networkStatus == '1' ? '在线' : '离线'}</span>
                </div>
                <div class="info_window_content_item">
                    <span>定位方式：${this.positionType[info.positionInfo.positionType]}</span>
                </div>
                ${info.accStatus != null ? `<div class="info_window_content_item"><span>ACC：${info.accStatus == 0 ? '关':'开'}</span></div>` : ''}
                <div class="info_window_content_item">
                    <span>${info.battery != null ? '电量：' + info.battery + '%' : '外接电压：'+ info.batteryVoltage + 'V'}</span>
                </div>
                ${info.oilWay != null ? `<div class="info_window_content_item"><span>油电状态：${info.oilWay == 0 ? '正常':'断开'}</span></div>`:''}
                ${info.csq != null ? `<div class="info_window_content_item"><span>信号：${info.csq}</span></div>`:''}
                ${info.alertStatus != null ? `<div class="info_window_content_item"><span>防盗状态：${info.alertStatus == 0 ? '撤防' : '设防'}</span></div>`:''}
                ${info.mileageKm && info.mileageKm != null ? `<div class="info_window_content_item"><span>总里程：${info.mileageKm}km</span></div>`:''}
                ${info.workStatus != null ? `<div class="info_window_content_item"><span>离线原因：${info.workStatus == 1 ? '休眠':''}</span></div>`:''}
                <div class="info_window_content_item">
                    <span>更新时间：${this.evt_formatDate(info.positionInfo.positionTime)}</span>
                </div>
                <div class="info_window_content_item">
                    <span>经度：${this.evt_formatLatLng(info.positionInfo.coordinate.lng)}</span>
                    <span class="info_window_content_item_right">纬度：${this.evt_formatLatLng(info.positionInfo.coordinate.lat)}</span>
                </div>
                <div class="info_window_content_btn">
                    <div onClick="evt_trace('${info.id}','panorama')">街景</div>
                    <div onClick="evt_trace('${info.id}','trace')">跟踪</div>
                    <div onClick="evt_track('${info.id}','${info.deviceName}')">轨迹</div>
                    <div onClick="evt_nav_fence('${info.deviceName}','${info.id}')">电子围栏</div>
                </div>
            </div>`
            var infoWindow = new BMap.InfoWindow(infoWindow_html,{enableCloseOnClick:false});
            this.map.openInfoWindow(infoWindow,point);
        },
        // 删除指定的覆盖物
        evt_deleteOverlay:function(lng,lat){
            var allOverlays = this.map.getOverlays();
            // console.log(allOverlays);
            for(var key in allOverlays){
                // console.log(allOverlays[key].point);
                // console.log(allOverlays[key].name);
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
                            if(this.devices_list[item].positionInfo.coordinate.lng == lng && this.devices_list[item].positionInfo.coordinate.lat == lat){
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
        evt_track:function(deviceId,deviceName){
            // console.log(deviceId,deviceName);
            // this.evt_clearOverlays();
            var _this = this;
            _this.need_handle_deviceId = deviceId;
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
            this.track_detail = true;
            this.current_device_name = item.deviceName;
            this.select_date_time = [new Date(new Date().toLocaleDateString()).getTime(),new Date().getTime()];
            this.evt_queryDeviceTracks(this.select_date_time[0],this.select_date_time[1],this.need_handle_deviceId);
            clearInterval(this.refresh_time_interval);
        },
        // 获取设备轨迹
        evt_queryDeviceTracks:function(startTime,endTime,deviceId){
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
                    clearInterval(_this.device_tracks_interval);
                    _this.device_tracks_step = 0;
                    _this.device_tracks = [];
                    _this.device_tracks_shift = [];
                    _this.map.clearOverlays();
                    // 若无轨迹信息 提示 return
                    if(res.data && res.data.length == 0) {
                        _this.total_distance = 0;
                        _this.$message({message:'无轨迹信息',type:'warning',offset:'200',duration:'1500'});
                        _this.play_flag = false;
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
                    if(_this.tracksDetail_flag){
                        _this.current_tracksDetail_page = 1;
                        var tracksDetail_list = [];
                        for(let i = 0, len = point_arr.length; i < len; i++){
                            tracksDetail_list.push(point_arr[i]);
                        }
                        _this.tracksDetail_list = tracksDetail_list;
                    }
                    _this.device_tracks = point_arr;
                    _this.device_tracks_max = _this.device_tracks.length;
                    _this.play_flag = true;
                    // _this.map.panTo(new BMap.Point(_this.device_tracks[0].lng,_this.device_tracks[0].lat));
                    _this.map.setCenter(new BMap.Point(_this.device_tracks[0].lng,_this.device_tracks[0].lat));
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
                    // console.log(raw_point);
                    var point = new BMap.Point(raw_point.lng,raw_point.lat);
                    Polyline_points.push(point);
                    // _this.map.panTo(point);
                    _this.map.setCenter(point);
                    // 添加线型覆盖物
                    var Polyline = new BMap.Polyline(Polyline_points, {strokeColor: '#0cf36b',strokeWeight:8,strokeOpacity:1});
                    Polyline.name = _this.device_tracks_step;
                    _this.map.addOverlay(Polyline);
                    // marker
                    _this.evt_playback_addMarker(point);
                    // 信息窗口
                    _this.evt_playback_infoWindow(point,raw_point);
                    // 清除上次绘制的覆盖物
                    var allOverlays = _this.map.getOverlays();
                    for(var key in allOverlays){
                        if( typeof(allOverlays[key].name) == 'number' && allOverlays[key].name  != _this.device_tracks_step){
                            _this.map.removeOverlay(allOverlays[key]); 
                        }
                    }
                    // 设置table高亮行
                    if(_this.tracksDetail_flag){
                        _this.evt_setCurrent(_this.tracksDetail_list[_this.device_tracks_step]);
                    }
                    _this.device_tracks_step += 1;
                    if(!_this.play_flag){
                        clearInterval(_this.device_tracks_interval);
                    }
                }else{
                    clearInterval(_this.device_tracks_interval);
                    _this.play_flag = false;
                }
            }, speed);
        },
        // 轨迹回放的marker
        evt_playback_addMarker:function(point){
            var _this = this;
            var device_info = _this.device_detail_info;
            var icon_url = device_info.networkStatus == '1' ? device_info.useRangeCode  != null ? _this.icon_list_t[device_info.useRangeCode].iconUrlForConsoleActive :  _this.icon_list_t['Other'].iconUrlForConsoleActive : device_info.useRangeCode != null ? _this.icon_list_t[device_info.useRangeCode].iconUrlForConsoleInactive :  _this.icon_list_t['Other'].iconUrlForConsoleInactive;
            var marker_icon = new BMap.Icon(icon_url,new BMap.Size(40,40),{
                imageSize: new BMap.Size(40,40),
            });
            var marker = new BMap.Marker(point, {icon: marker_icon});
            marker.addEventListener('click',function(e){
                // console.log(e);
                var point = new BMap.Point(e.currentTarget.point.lng,e.currentTarget.point.lat);
                // if(!_this.play_flag){
                //     var info = _this.device_tracks_shift[_this.device_tracks_shift.length - 1];
                // }else{
                //     var info = _this.table_row_info;
                // }
                if(e.target.name == 'playFlag'){
                    var info = _this.table_row_info;
                }else{
                    var info = _this.device_tracks_shift[_this.device_tracks_shift.length - 1];
                }
                _this.evt_playback_infoWindow(point,info);
            })
            if(_this.play_flag){
                marker.name = _this.device_tracks_step;
            }else{
                marker.name = 'playFlag';
            }
            _this.map.addOverlay(marker);
        },
        // 轨迹回放的信息窗口
        evt_playback_infoWindow:function(point,info){
            var _this = this;
            _this.map.closeInfoWindow();
            var infoWindow_html = `
                <div class="tracks_label_html">
                    <div class="tracks_label_html_item">定位方式: ${this.positionType[info.positionType]}</div>
                    <div class="tracks_label_html_item">定位时间: ${this.evt_formatDate(info.time)}</div>
                    <div class="tracks_label_html_item_flex">
                        <div>定位位置: </div>
                        <div onClick="evt_playback_address('${info.lng}','${info.lat}','${info.time}','${info.positionType}')" class="tracks_label_html_item_click">${this.playback_address == '' ? '点击查看地址' : this.playback_address}</div>
                    </div>
                </div>
            `
            var infoWindow = new BMap.InfoWindow(infoWindow_html,{enableCloseOnClick:false});
            // console.log(point);
            // console.log(info);
            _this.map.openInfoWindow(infoWindow,point);
            if(infoWindow.isOpen()){
                _this.playback_address = '';
            }
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
        },
        // 播放与暂停
        evt_play_pause:function(){
            this.play_flag = !this.play_flag;
            if(!this.play_flag){
                clearInterval(this.device_tracks_interval);
            }else{
                if(this.device_tracks_step != this.device_tracks_max){
                    var arr_point = [];
                    for(var i = 0, len = this.device_tracks_shift.length; i < len; i++){
                        arr_point.push(new BMap.Point(this.device_tracks_shift[i].lng,this.device_tracks_shift[i].lat))
                    }
                    this.evt_LuShu(arr_point);
                }else{
                    this.device_tracks = this.device_tracks_shift;
                    this.device_tracks_shift = [];
                    clearInterval(this.device_tracks_interval);
                    this.device_tracks_max = this.device_tracks.length;
                    this.device_tracks_step = 0;
                    this.map.clearOverlays();
                    this.evt_LuShu();
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
        // 设置table高亮行
        evt_setCurrent:function(row) {
            this.$refs.singleTable.setCurrentRow(row);
            if(this.device_tracks_step > 2){
                this.$refs.singleTable.bodyWrapper.scrollTop = 33 * (this.device_tracks_step - 1);
            }else{
                this.$refs.singleTable.bodyWrapper.scrollTop = 0;
            }
        },
        // 点击table轨迹明细中的行
        evt_handleCurrentChange:function(row){
            if(!this.play_flag){
                var allOverlays = this.map.getOverlays();
                console.log(allOverlays);
                for(var key in allOverlays){
                    if(allOverlays[key].name == 'playFlag'){
                        this.map.removeOverlay(allOverlays[key]); 
                    }
                }
                this.table_row_info = row;
                var point = new BMap.Point(row.lng,row.lat);
                // this.map.panTo(point);
                this.map.setCenter(point);
                this.evt_playback_addMarker(point);
                this.evt_playback_infoWindow(point,row);
            }
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
            this.evt_queryDeviceTracks(this.select_date_time[0],this.select_date_time[1],this.need_handle_deviceId);
        },
        evt_close_tracksDetail:function(){
            this.tracksDetail_flag = false;
        },
        // 轨迹明细改变当前页
        evt_change_current:function(num){
            console.log(num);
            this.current_tracksDetail_page = num;
            this.current_tracksDetail_list = this.tracksDetail_list.slice((this.current_tracksDetail_page - 1) * 5,this.current_tracksDetail_page * 5);
        },
        // 点个获取位置信息
        evt_getAdress:function(row){
            // console.log(row);
            var _this = this;
            var geocoder = new BMap.Geocoder();
            var point = new BMap.Point(row.lng,row.lat);
            for(let i = 0, len = _this.tracksDetail_list.length; i < len; i++){
                if(_this.tracksDetail_list[i].lng === row.lng && _this.tracksDetail_list[i].lat === row.lat){
                    geocoder.getLocation(point,function(result){
                        // console.log(result);
                        if(result.address){
                            _this.$set(_this.tracksDetail_list[i],'address',result.address)
                        }
                    })
                }
            }
        },
        evt_getAllAdress:function(){
            var _this = this;
            var geocoder = new BMap.Geocoder();
            for(let i = 0, len = _this.tracksDetail_list.length; i < len; i++){
                var point = new BMap.Point(_this.tracksDetail_list[i].lng,_this.tracksDetail_list[i].lat);
                geocoder.getLocation(point,function(result){
                    // console.log(result);
                    if(result.address){
                        _this.$set(_this.tracksDetail_list[i],'address',result.address)
                    }
                })
            }
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
        // table格式化时间格式
        evt_table_formatDate:function(row,column){
            let date = row.createTime ? row.createTime : row.time;
            let date_time = new Date(date);
            return isNaN(date_time) ? "--" : formatDate(date_time,'yyyy-MM-dd hh:mm:ss');
        },
        evt_table_formatLng:function(row,column){
            var str = row.lng.toString();
            return str.slice(0,str.indexOf('.')+7);
        },
        evt_table_formatLat:function(row,column){
            var str = row.lat.toString();
            return str.slice(0,str.indexOf('.')+7);
        },
        evt_table_formatMileage:function(row,column){
            if(row.mileageKmRelative < 0.001){
                return 0
            }else{
                return row.mileageKmRelative.toFixed(3);
            }
        },
        evt_table_formatSpeed:function(row,column){
            if(row.speed == null){
                return 0;
            }else{
                return row.speed
            }
        },
        evt_table_formatCommandData:function(row,column){
            // console.log(row);
            if(Object.keys(row.commandData).length > 0){
                return JSON.stringify(row.commandData);
            }else{
                return '----'
            }
        },
        evt_table_formatCommandStatus:function(row,column){
            return this.command_status[row.commandStatus];
        },
        evt_table_formatPositionType:function(row,column){
            return this.positionType[row.positionType]
        },
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
        formatStatus(lastReportDataTime,networkStatus,activationTime,serviceExpireTime){
            var currentTime = new Date().getTime();
            if(!activationTime || activationTime == null || activationTime > currentTime){
                return '未激活';
            }else if(activationTime && lastReportDataTime == null && serviceExpireTime > currentTime){
                return '已激活未上线';
            }else if(activationTime && (lastReportDataTime != null || lastReportDataTime)  && networkStatus == '1' && serviceExpireTime != null && serviceExpireTime > currentTime){
                return '在线';
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
.row_item_left{
    display: flex;
    flex-direction: column;
}
.row_item_top_left{
    height: 40px;
    background: #EEF3FE;
    border-bottom: 1px solid #DDDDDD;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div:nth-of-type(1){
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        line-height: 40px;
        margin-left: 10px;
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
.row_item_bottom_left{
    flex-flow: 1;
    width: 100%;
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
    /deep/ .row_item_bottom_left_userIcon{
        color: #F19B04 !important;
    }
    /deep/  .el-tree-node.is-current > .el-tree-node__content {
        background-color: #D8E3FF !important;
        border: 1px solid #4391FE;
    }
    // /deep/ .el-tree-node>.el-tree-node__children{
    //     overflow:scroll;
    // }
    // /deep/ .el-scrollbar{
    //     overflow: scroll; 
    //     position: relative;
    // }
    // /deep/ .el-tree {
    //     width: 100%;
    //     overflow: scroll;
    // }
    /deep/ .el-tree>.el-tree-node {
        display: inline-block;
        min-width: 100%;
    }
    /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .row_item_bottom_left_search{
        width: 80%;
        max-height: 200px;
        background: #ffffff;
        box-sizing: border-box;
        border: 1px solid #AAAAAA;
        padding: 6px;
        cursor: pointer;
        overflow-y: scroll;
        position: absolute;
        top: 38px;
        left: 10px;
        z-index: 9999;
    }
    .row_item_bottom_left_search>div:hover{
        color: #018C0E;
    }
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
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 5px;
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
        max-height: 76vh;
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
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
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
                z-index: 9999;
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
    /deep/ .el-table td,.el-table th {
        text-align: center !important;
    }
    /deep/ .el-table th>.cell{
        text-align: center !important;
    }
    /deep/ .el-table--small td, .el-table--small th{
        padding: 0px !important;
    }
    /deep/ .el-table td, .el-table th{
        padding: 0px !important;
    }
    /deep/ .el-table--small th{
        // padding: 5px !important;
    }
    /deep/ .el-table th {
        // padding: 5px !important;
        background: #F2F2F2 !important;
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
.device_order{
    .device_order_top_icon{
        font-size: 18px;
        color: #218FFF;
        cursor: pointer;
    }
    .device_order_top_text{
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #545D6A;
        cursor: pointer;
    }
    .order_form_item{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .order_time_text{
        font-size: 13px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #AAAAAA;
        position: relative;
        left: 75px;
        top: -16px;
    }
    .order_form_btn{
        margin-top: 50vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /deep/ .el-drawer__header {
        margin: 0px;
        padding: 20px;
    }
    /deep/ .el-drawer__header>:first-child{
        flex-grow: 0;
    }
    /deep/ .el-drawer__body{
        padding: 0px 20px;
    }
    /deep/ .el-tabs__content{
        height: 80vh;
    }
    /deep/ .el-form-item{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    /deep/ .el-table td,.el-table th {
        text-align: center !important;
    }
    /deep/ .el-table th>.cell{
        text-align: center !important;
    }
    /deep/ .el-table th {
        background: #F2F2F2 !important;
    }
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
.item_opacity{
  opacity:0.7;
  -webkit-filter:grayscale(100%);
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
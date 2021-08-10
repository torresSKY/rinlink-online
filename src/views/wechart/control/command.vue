<template>
    <div class="commandContainer">
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
import { formatDate } from '@/plugins/date.js'
import api from '@/api/wechart/index'
import sendOrder from '../sendOrder.vue'
export default {
    name:'command',
    components:{sendOrder},
    props:['commandVisible','selection','handleDeviceId'],
    data() {
        return {
            device_command_visible: this.commandVisible,//设备指令弹框展示
            tab_value:'parameter',
            multipleSelection:[],//使用下发指令模板传递的设备信息
            command_page:1,//历史指令当前页
            command_pageSize:10,//历史指令页面数据条数
            command_total:0,//历史指令的总条数
            command_data_list:[],//历史指令的当前页数据
            userType_parameter: '',//请求接口拼接的用户类型
            command_status:{
                0: '已受理',
                1: '待发送',
                2: '已发送',
                3: '已送达',
                4: '失败',
                5: '过期'
            },//指令状态
            need_handle_deviceId: this.handleDeviceId,
        }
    },
    created(){
        this.userType_parameter = JSON.parse(sessionStorage['user']).userType;
    },
    mounted(){

    },
    watch: {
        commandVisible:{
            handler(){
                this.device_command_visible = this.commandVisible;
            },
            deep:true
        },
        selection:{
            handler(){
                this.multipleSelection = this.selection;
                this.$nextTick(() => {
                    this.$refs.sendOrder.formData = {};
                    this.$refs.sendOrder.schema = null;
                    this.$refs.sendOrder.deviceCmdTemplateId = null;
                    this.$refs.sendOrder.searchImei = null;
                    this.$refs.sendOrder.tempNum = 0;
                    this.$refs.sendOrder.getlist();
                })
            },
            deep: true
        },
        handleDeviceId:{
            handler(){
                this.need_handle_deviceId = this.handleDeviceId
            },
            deep: true
        }
    },
    methods: {
        // 关闭指令弹框
        evt_close_command_content:function(){
            this.device_command_visible = false;
            this.command_page = 1;
            this.command_total = 0;
            this.command_data_list = [];
            this.tab_value = 'parameter';
            this.$emit('closeCommand');
        },
        // 设备指令的tab切换
        evt_tab_click:function(){
            // console.log(this.tab_value);
            this.command_page = 1;
            this.command_total = 0;
            this.command_data_list = [];
            if(this.tab_value == 'history'){
                this.evt_queryDeviceCmds();
            }else{
                this.$nextTick(() => {
                    this.$refs.sendOrder.formData = {};
                    this.$refs.sendOrder.schema = null;
                    this.$refs.sendOrder.deviceCmdTemplateId = null;
                    this.$refs.sendOrder.searchImei = null;
                    this.$refs.sendOrder.tempNum = 0;
                    this.$refs.sendOrder.getlist();
                })
            }
        },
        confrimSend:function(data){ // 
            //console.log(data);
            if(!data){
                // this.evt_close_command_content();
                this.$nextTick(() => {
                    this.$refs.sendOrder.formData = {};
                    this.$refs.sendOrder.schema = null;
                    this.$refs.sendOrder.deviceCmdTemplateId = null;
                    this.$refs.sendOrder.searchImei = null;
                    this.$refs.sendOrder.tempNum = 0;
                    this.$refs.sendOrder.getlist();
                })
            }
        },
        // 分页页数改变
        evt_current_change:function(num){
            this.command_page = num;
            this.evt_queryDeviceCmds();
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
        // table格式化时间格式
        evt_table_formatDate:function(row,column){
            let date = row.createTime ? row.createTime : row.time;
            let date_time = new Date(date);
            return isNaN(date_time) ? "--" : formatDate(date_time,'yyyy-MM-dd hh:mm:ss');
        },
    },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
</style>
<template>
    <!-- 关联设备 -->
    <el-dialog @close="evt_close" class="relevance_device" width="60%" title="关联设备" :visible="relevance_device_flag"  top="5vh">
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="users">
                    <el-input placeholder="请输入客户名称" size="mini" v-model="searchBusiness_name">
                        <el-button @click="evt_searchBusiness" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <div class="users_bottom">
                        <el-tree :props="props" ref="userTree" @node-click="evt_node_click" node-key="user_id" :default-expanded-keys="[user_id]"  :expand-on-click-node="false" :data="user_list" :load="evt_loadTree" :lazy="true" :render-content="renderContent"></el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="devices">
                    <el-input placeholder="设备名称" size="mini" v-model="searchDevice_name">
                        <el-button @click="evt_searchDevice" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <div class="devices_bottom">
                        <template v-if="devices_list.length > 0">
                            <div v-for="item in devices_list" :key="item.id" style="display:flex;align-items: center; margin-bottom:5px;cursor: pointer;" @click="evt_select_devices(item.id)">
                                <img v-show="!item.checked" :src="require('../../../assets/img/no_select_icon.png')" style="width:20px;height:20px;">
                                <img v-show="item.checked" :src="require('../../../assets/img/selected_icon.png')" style="width:20px;height:20px;">
                                <span style="font-size:16px;margin-left:5px;line-height:20px;">{{item.deviceName}}</span>
                            </div>
                        </template>
                        <div v-if="devices_list.length == 0" style="font-size:16px;text-align:center">暂无用户设备数据</div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="select_collect">
            <div class="select_collect_top">
                <span>已选设备({{selected_devices.length}})</span>
                <span @click="evt_cancel_all_selected">清空</span>
                <span v-if="selected_devices.length > 0">（该围栏中可能包含下级用户的设备）</span>
            </div>
            <div v-if="selected_devices.length > 0" class="select_collect_content">
                <div v-for="(item,index) in selected_devices" :key="index" class="select_collect_content_item" @click="evt_cancel_selected(item)">
                    <span>{{item.deviceName}} ({{item.deviceNumber}})</span>
                    <img :src="require('../../../assets/img/x.png')">
                </div>
            </div>
        </div>
        <div class="relevance_device_bottom_btn">
            <el-button type="info" size="small" @click="evt_close">取消</el-button>
            <el-button type="primary" size="small" @click="evt_submit_relevance">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import api from '@/api/wechart/index'
export default {
    name:'relevanceDevice',
    props:['fenceId','relevanceFlag'],
    data(){
        return {
            relevance_device_flag: this.relevanceFlag,//关联设备模块的展示
            relevance_fenceId: this.fenceId,//选择关联的围栏id
            user_list:[],//用户列表
            user_id:'',//用于查询设备的用户id
            devices_list:[],//查询的用户设备列表
            selected_devices:[],//选择要关联的设备
            current_page_devices : [],
            selected_cancel : [],
            searchBusiness_name:'',//搜索用户
            searchDevice_name:'',//搜索设备
            props:{
                isLeaf: 'isLeaf'
            },
            renderContent:function (h,{node,data,store}) {
                let addElement = arguments[0];
                return addElement('span',[
                    addElement('i',{class:"el-icon-s-custom row_item_bottom_left_userIcon"}),
                    addElement('span',"    "),
                    addElement('span',arguments[1].node.label)
                ]);
            },//el-tree 自定义图标
            userType_parameter: '',//请求接口拼接的用户类型
        }
    },
    created(){
        this.userType_parameter = JSON.parse(sessionStorage['user']).userType;
    },
    watch:{
        fenceId:{
            handler(){
                this.relevance_fenceId = this.fenceId;
                if(!this.relevanceFlag) return;
                this.evt_queryFenceDevices();
            }
        }
    },
    methods: {
         // 获取选择围栏已经关联的设备
        evt_queryFenceDevices:function(){
            var _this = this;
            var request_data = {};
            request_data['fenceId'] = _this.relevance_fenceId;
            api.queryFenceDevices(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success && res.data != null && res.data.length > 0){
                    for(var key in res.data){
                        res.data[key]['id'] = res.data[key].deviceId;
                    }
                    _this.selected_devices = res.data;
                }
                if(_this.userType_parameter == '3'){
                    _this.evt_getCurrentUserInfo();
                }else{
                    _this.evt_getBusiness();
                }
                
                // 关联设备的弹框
                _this.relevance_device_flag = true;
            }).catch((err) => {
                // console.log(err);
                _this.$message({type:'error',message:err.msg || err.data,offset:'200',duration:'1500'})
            })
        },
        // 获取当前用户的信息 C端
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
        //获取代理商 b端
        evt_getBusiness:function(){
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
         // el-tree 懒加载数组
        evt_loadTree:function(node, resolve){
            // console.log(node)
            if(JSON.parse(sessionStorage['user']).userType == '3'){
                resolve([]);
                return;
            }
            if(node.data.isLeaf){
                resolve([]);
                return;
            }
            var _this = this;
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
                            user_data['label'] = res.data[i].nickname + '(' + res.data[i].devices + '/' + (res.data[i].sellDevices + res.data[i].devices) +')';
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
            // 判断是不是当前登录用户 当前登录用户请求查询设备时 不传递userid参数
            if(this.user_id == JSON.parse(sessionStorage['user']).userId){
                this.evt_queryDevices('currentUser');
            }else{
                this.evt_queryDevices();
            }
        },
        // 查询设备
        evt_queryDevices:function(type){
            var _this = this;
            var request_data = {};
            if(type != 'currentUser'){
                request_data['ownerId'] = _this.user_id;
            }
            api.queryDevices(request_data,_this.userType_parameter).then((res) => {
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
        // 搜索用户searchBusiness
        evt_searchBusiness:function(){
            var _this = this;
            if(_this.searchBusiness_name.trim() == '') return;
            var request_data = {};
            request_data['searchContent'] = _this.searchBusiness_name;
            request_data['searchType'] = 'username';
            api.searchBusiness(request_data,_this.userType_parameter).then((res) => {
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
            request_data['page'] = 0;
            request_data['pageSize'] = 20;
            request_data['deviceNameKeyword'] = _this.searchDevice_name;
            api.getDevicesList(request_data,_this.userType_parameter).then((res) => {
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
            api.deviceBindFence(request_data,_this.userType_parameter).then((res) => {
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
                    _this.$emit('closeRelevance');
                }else{
                    _this.$message({message: res.msg,type:'info',offset:'200',duration:'1000'})
                }
            }).catch((err) => {
                _this.$message({message:err.msg,type:'error',offset:'200',duration:'1000'})
            })
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
            this.$emit('closeRelevance');
        },
    },
}
</script>
<style lang="scss" scoped>
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
        // width: 100%;
        margin-top: 6px;
        overflow-y: scroll;
        /deep/ .row_item_bottom_left_userIcon{
            color: #F19B04 !important;
        }
        /deep/  .el-tree-node.is-current > .el-tree-node__content {
            background-color: #D8E3FF !important;
            border: 1px solid #4391FE;
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
.relevance_device_bottom_btn{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<template>
    <div class="usersContainer">
        <div class="row_item_left">
            <div class="row_item_top_left">
                <div>客户列表</div>
                <!-- <div><i class="el-icon-arrow-left"></i></div> -->
            </div>
            <div class="row_item_bottom_left">
                <el-input style="margin-bottom:10px;position: relative;" size="mini" placeholder="请输入客户名称或账号" v-model="searchBusiness_name" @keyup.enter.native="evt_searchBusiness">
                    <el-button @click="evt_searchBusiness" size="mini" slot="append" icon="el-icon-search"></el-button>
                </el-input>
                <el-scrollbar :native="false" :style="{'height': block_height - 100 + 'px'}">
                    <div class="scrollbar_container" >
                        <el-tree style="font-size:12px" ref="userTree" @node-click="evt_node_click" node-key="user_id" :default-expanded-keys="[user_id]"  :expand-on-click-node="false" :props="props" :data="user_list" :load="evt_loadTree" lazy :render-content="renderContent"></el-tree>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/api/wechart/index'
export default {
    name: 'usersList',
    props: ['monitorId'],
    data(){
        return{
            block_height:'',
            user_list:[],//用户列表
            user_id:'',//用户查询用户设备列表的用户id
            userType_parameter: '',//请求接口拼接的用户类型
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
            },
            searchBusiness_name:'',
        }
    },
    watch:{
        monitorId:{
            handler(){
                this.user_id = this.monitorId;
                this.$refs.userTree.setCurrentKey(this.user_id);
            },
            deep: true
        }
    },
    created(){
        this.userType_parameter = JSON.parse(sessionStorage['user']).userType;
        if(JSON.parse(sessionStorage['user']).userType != '3'){
            this.evt_getBusinessUserinfo();
        }else if(JSON.parse(sessionStorage['user']).userType == '3'){
            this.evt_getCurrentUserInfo();
        }
    },
    mounted(){
        var _this = this;
        _this.$nextTick(function(){
            _this.block_height = document.getElementsByClassName('usersContainer')[0].offsetHeight;
        })
    },
    methods: {
        // 获取当前登录用户的信息 b端用户
        evt_getBusinessUserinfo:function(){
            var _this = this;
            _this.user_list = [];
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
                    if(!_this.default_expand_all_flag){
                        _this.$nextTick(function(){
                            _this.$refs.userTree.setCurrentKey(_this.user_id);
                            _this.$emit('monitorUserId',_this.user_id);
                        })
                    }
                }
            }).catch((err) => {
                _this.$message({message: err.msg, type:'error',offset:'200',duration:'1500'})
            })
        },
        // 获取当前用户的信息
        evt_getCurrentUserInfo:function(){
            var _this = this;
            _this.user_list = [];
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
                        _this.$emit('monitorUserId',_this.user_id);
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
            if(node.data.isLeaf){
                resolve([]);
                return;
            }
            if(node.level === 0){
                return resolve(_this.user_list);
            }
            if(node.level != 0){
                var request_data = {};
                // request_data['parentId'] = node.data.info.userId;
                if(node.data.info.userId != JSON.parse(sessionStorage['user']).userId){
                    request_data['parentId'] = node.data.info.userId;
                }
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
        evt_node_click:function(e){
            this.$emit('monitorUserId',e.user_id)
        },
        // 搜索用户searchBusiness
        evt_searchBusiness:function(){
            var _this = this;
            if(_this.searchBusiness_name.trim() == ''){
                if(_this.userType_parameter == '3'){
                    _this.evt_getCurrentUserInfo();
                }else{
                    _this.evt_getBusinessUserinfo();
                }
                return;
            }
            var request_data = {};
            request_data['searchContent'] = _this.searchBusiness_name;
            request_data['searchType'] = 'nickname';
            api.searchBusiness(request_data,_this.userType_parameter).then((res) => {
                // console.log(res);
                if(res.success && res.data && res.data.length > 0){
                    _this.user_id = res.data[0].userId;
                    _this.user_list = [];
                    for(var i = 0, len = res.data.length; i < len; i++){
                        var user_data = {};
                        user_data['label'] = res.data[i].nickname;
                        user_data['info'] = res.data[i]
                        user_data['user_id'] = res.data[i].userId;
                        if(res.data[i].children != null && res.data[i].children > 0){
                            user_data['isLeaf'] = false;
                        }else{
                            user_data['isLeaf'] = true;
                        }
                        _this.user_list.push(user_data);
                    }
                    _this.$nextTick(function(){
                        _this.$refs.userTree.setCurrentKey(_this.user_id);
                        _this.$emit('monitorUserId',_this.user_id);
                    })
                }else if(res.data == null){
                    _this.$message({message:'暂无相应的搜索数据',type:'info',offset:'200',duration:'1000'});
                }
            }).catch((err) => {
                _this.$message({message:err.errMsg,type:'error',offset:'200',duration:'1000'});
            })
        },
    },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .usersContainer{
        width: 100%;
        height: 100%;
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
            font-weight: bold;
            color: black;
        }
        /deep/ .el-tree > :nth-child(n+1) {
          display: inline-block;
          min-width: 100%
        }
        /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
        }
    }

</style>
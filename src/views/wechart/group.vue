<template>
    <div id="group" v-loading="listLoading" :style="{height:windowHeight +'px',overflow:'hidden'}">
        <el-card shadow="always" class="mb20" style="background:#ccc">
          <div slot="header" class="clearfix">
            <span>{{$t('route.Group')}}</span>
          </div>
        <el-card shadow="always">
            <el-row :gutter="10">
                <!-- <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入分组名称"></el-input>
                </el-col> -->
                <el-col :span="16">
                    <!-- <el-button @click="filterSearch">查找</el-button> 
                    <el-button class="butresh" @click="changeindex(1)">{{$t('button.refresh')}}</el-button>-->
                    <el-button class="butadd" @click="openDialogs(false)">{{$t('button.add')}}</el-button>
                </el-col>
            </el-row>
            <div>
                <el-scrollbar :style="{height:windowHeight-200+'px' }" ref="scroll">
                    <div style="margin-top:20px;">
                        <el-table :data="listxian" class="particular-table" :row-class-name="tableRowClassName" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}">
                            <el-table-column align='center' prop="name" :label="$t('table.groupname')"></el-table-column>
                            <el-table-column align='center' label="ID">
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="$t('table.creattime')">
                                <template slot-scope="scope">
                                    {{scope.row.createAt}}
                                </template>
                            </el-table-column>
                            <!-- <el-table-column 
                                label="管理员ID">
                                <template slot-scope="scope">
                                    {{scope.row.userId || '无管理员'}}
                                </template>
                            </el-table-column> -->
                            <el-table-column align='center' :label="$t('table.operation')" width="360"> 
                                <template slot-scope="scope">
                                    <!-- <el-button
                                    size="mini"
                                    @click="openDialog(scope.row.id)">查看归属设备</el-button> -->
                                    <el-button class="butedior" size="mini" @click="openDialogs(true,scope.row)">{{$t('button.editor')}}</el-button>
                                    <el-button class="butdele" size="mini" @click="deleteGroup(scope.row.id)">{{$t('button.dele')}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
               <el-pagination
                    @current-change="equChangeIndex"
                    :current-page.sync="equIndex"
                    :page-size="page.size"
                    layout="total, prev, pager, next ,jumper"
                    :total="page.total"
                    style="text-align:center;margin-top:10px">
                </el-pagination>
            </div>
        </el-card>
        </el-card>
        <!-- <el-card shadow="always" class="mt20">
            <el-pagination
                @current-change="changeindex"
                :current-page.sync="page.index"
                :page-size="page.size"
                layout="total, prev, pager, next ,jumper"
                :disabled="search?true:false"
                :total="page.total">
            </el-pagination>
        </el-card> -->
        <el-dialog
            :title="$t('button.bangding')"
            :visible.sync="dialogState"
            width="60%"
            :before-close="handleClose">
            <div :style="{height:'500px',overflow:'hidden' }" v-loading="bindListLoading">
                <el-scrollbar :style="{height:400+17+'px'}">
                    <div style="overflow:hidden;">
                        <el-table :data="bindList"
                            style="width: 100%">
                            <el-table-column align='center' prop="imei" label="imei">
                            </el-table-column>
                            <el-table-column align='center' label="ID" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="$t('table.userid')"  width="140">
                                <template slot-scope="scope">
                                    {{scope.row.admin_id}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' prop="create_date" :label="$t('table.creattime')">
                            </el-table-column>
                            <el-table-column align='center' :label="$t('table.operation')">
                                <template slot-scope="scope">
                                    <el-button
                                    size="mini"
                                    @click="deleteGroupEqu(scope.row.id)">{{$t('button.dele')}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
                <div class="hideScrollbarButtom"></div>
                <el-pagination
                    @current-change="equChangeIndex"
                    :current-page.sync="equIndex"
                    :page-size="50"
                    layout="total, prev, pager, next ,jumper"
                    :total="equTotal">
                </el-pagination>
            </div>
        </el-dialog>
        <el-dialog
            :title="isEdit ? $t('button.editor'):$t('button.add')"
            :visible.sync="dialogStates"
            width="30%"
            :before-close="handleCloses">
            <div>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <label class="el-form-item__label">{{$t('table.groupname')}}:</label>
                        <el-input v-model="name"></el-input>
                    </el-col>
                    <!-- <el-col :span="12" v-if="isEdit">
                        <label class="el-form-item__label">上级分组ID:</label>
                        <el-input v-model="parent_id"></el-input>
                    </el-col>
                    <el-col :span="12"  v-if="isEdit">
                        <label class="el-form-item__label">管理员ID:</label>
                        <el-input v-model="user_id"></el-input>
                    </el-col> -->
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCloses">{{$t('button.cancel')}}</el-button>
                <el-button type="primary" @click="confirmAdd">{{$t('button.determine')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import {mapState} from 'vuex'
    export default{
        name:'group',
        mixins:[mixin],
        computed:{
            ...mapState({user:'user',adminRoles:'roles'})
        },
        data(){
            return {
                windowHeight:0,
                list:[],
                listLoading:false,
                addOrEditLoading:false,
                listxian:[],
                search:'',
                name:'',
                parent_id:'',
                user_id:'',
                dialogState:false,
                dialogStates:false,
                isEdit:false,
                editId:-1,
                id:-1,
                bindList:[],    
                bindListLoading:false,
                equTotal:0,
                equIndex:1,
            }
        },
        mounted(){
            this.windowHeight=document.body.offsetHeight- 62
            this.getList()
        },
        methods:{
            getList(){
                this.search=''
                this.listLoading=true
                this.rollBack('scroll')
                api.getGroupListPagination(
                    {params:{
                        userId:this.$store.getters.usercode,
                        pageSize:this.page.size,
                        pageNo:this.page.index-1}
                    }).then(_=>{ 
                    if(_.content.length > 0){
                        this.list=_.content
                        this.listxian=_.content
                        this.page.total=_.content.length
                    }else{
                        this.$message.error(this.$t('table.faillist'));
                    }
                    this.listLoading=false
                }).catch(_=>{
                    this.$message.error(_.message);
                    this.listLoading=false
                })
            },
            getBindList(id){
                this.bindListLoading=true
                api.getEquListPagination({
                    pageSize:this.page.size,
                    offset:this.equIndex-1,
                    columns:[
                        {name:'group_id',value:this.id}
                    ]
                }).then(_=>{
                    if(Array.isArray(_.data)){
                        this.bindList=_.data
                        this.equTotal=_.page.count
                    }else{
                        this.$message.error(this.$t('table.faillist'));
                    }
                    this.bindListLoading=false
                }).catch(_=>{
                    this.$message.error(_.message);
                    this.bindListLoading=false
                })
            },
            equChangeIndex(val){
                this.equIndex=val
                try{
                    this.getBindList()
                }catch(res){
                    
                }
            },
            filterSearch(){
                this.listLoading=true
                if(this.search){
                    api.getGroupList({name:this.search}).then(_=>{
                        if(Array.isArray(_)){
                            this.listxian=_
                            this.page.total=_.length
                            // this.page.size=_.length
                        }else{
                            this.$message.error(this.$t('table.failsearch'));
                        }
                        this.listLoading=false
                    }).catch(_=>{
                        this.$message.error(_.message);
                        this.listLoading=false
                    })
                }else{
                    this.changeindex(1)
                }
            },
            openDialog(id){
                this.id=id
                this.dialogState=true
                this.getBindList()
            },
            openDialogs(state,obj){
                if(state){
                    this.name=obj.name
                    this.parent_id=obj.parent_id
                    this.user_id=obj.user_id
                    this.editId=obj.id
                }else{
                    this.name=''
                    this.parent_id=''
                    this.user_id=''
                    this.editId=-1
                }
                this.isEdit=state
                this.dialogStates=true
            },
            async confirmAdd(){
                let adddata={
                    // 'name':this.name,
                    // 'parent_id':this.parent_id || null,
                    // 'user_id':this.user_id || null,

                    name: this.name,
                    userId: this.$store.getters.usercode,
                }
                let editdata={
                    // 'name':this.name,
                    // 'parent_id':this.parent_id || null,
                    // 'user_id':this.user_id || null,
                       'name': this.name,
                       'deviceGroupId':this.editId
                }
                this.addOrEditLoading=true
                let res=null
                if(this.isEdit){
                    res=await api.groupEdit(editdata).catch(_=>{
                        this.$message({
                        type: 'error',
                        message: _.message
                    });
                    })
                }else{
                    res=await api.groupAdd(adddata).catch(_=>{
                        if(_.message == 'group name already exists'){
                            this.$message({
                                type: 'error',
                                message:  this.$t('message.chongfu')
                            });
                        }else{
                             this.$message({
                                type: 'error',
                                message:  _.message
                            });
                        }
                       
                    })
                }
                if(res&&(res.affectedRows||res.affectedRows===0||res.id)){
                    this.$message({
                        type: 'success',
                        message: `${this.isEdit ? this.$t("message.changesuc"):this.$t("message.addsuc")}`
                    });
                    this.dialogStates=false
                    this.getList()
                    this.addOrEditLoading=false
                }
            },
            deleteGroupEqu(id){
                this.$confirm(this.$t('message.delegroup'), this.$t('message.newtitle'), {
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.bindListLoading=true
                    api.deleteBindRecord(id).then(_=>{
                        if(_.affectedRows){
                            this.$message({
                                type: 'success',
                                message: this.$t('message.delesuc')
                            });
                            this.getBindList(this.id)
                        }
                    }).catch(_=>{
                        this.$message({
                            type: 'error',
                            message: _.message
                        });
                    })
                }).catch(() => {
                    this.bindListLoading=false
                    this.$message({
                        type: 'info',
                        message: this.$t('message.undele')
                    });          
                });
            },
            deleteGroup(id){
                this.$confirm(this.$t('message.delegroup'), this.$t('message.newtitle'), {
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.cancel'),
                    type: 'warning'
                }).then(() => {
                    api.groupDelete({params:{
                        'deviceGroupId':id
                    }
                    }).then(_=>{
                            this.$message({
                                type: 'success',
                                message: this.$t('message.delesuc')
                            });
                            this.getList()
                    }).catch(_=>{
                        this.$message({
                            type: 'error',
                            message: _.message
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('message.undele')
                    });          
                });
            },
            handleClose(){
                this.dialogState=false
            },
            handleCloses(){
                this.dialogStates=false
            },
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>
    .hideScrollbarButtom{
        height: 17px;
        width: 100%;
        position: relative;
        top: -17px;
        background-color: #fff;
    }
</style>
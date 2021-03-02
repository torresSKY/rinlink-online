<template>
    <div >
        <el-card>
            <el-button class="butadd" @click="addrole">{{$t('button.addrole')}}</el-button>
        </el-card>
        <el-row :gutter="22" style="margin-top:10px">
            <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh" ></BaseTable>
        </el-row>
        <!-- 添加/编辑角色 -->
        <el-dialog
            :title="isEdit? $t('button.editrole'): $t('button.addrole')"
            :visible.sync="dialogRole"
            width="30%">
            <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('table.roleName')" prop="roleName">
                   <el-input v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.permission')" prop="authoritites">
                    <el-tree :data="roleForm.authoritites" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </el-form-item>
                <el-form-item :label="$t('table.note')" prop="remark">
                    <el-input v-model="roleForm.remark" type="textarea" :rows="2"></el-input>
                </el-form-item>   
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogRole = false">{{$t('button.cancel')}}</el-button>
                <el-button type="primary" @click="dialogRole = false">{{$t('button.determine')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    export default{
        name:'roleManage',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                dataList:[],
                tableLabel: [
                  {label: this.$t('table.roleName'), prop: 'roleName'},
                  {label: this.$t('table.note'), prop: 'roleDescription'},
                  {label: this.$t('table.creattime'), prop: 'createTime', type: 'Timestamp'},
                  {label: this.$t('table.operation'),
                    type: 'clickSelect',
                    selectOperation: (index, row) => {
                      this.showDialog(index, row)
                    },
                    selectText: [{command: '1', text: this.$t('button.editor'), index: 1},
                    {command: '2', text: this.$t('button.dele'), index: 2} ]
                }],
                isEdit :false,
                dialogRole:false,
                rules:[],
                roleForm:{
                    roleName:'',
                    authoritites:[],
                    remark:''
                },
                defaultProps: {
                   children: 'children',
                   label: 'label'
                },

            }
        },
        mounted(){
           this.getlist()
        },
        methods:{
            getlist(){ // 获取角色列表
                this.loading = true
                api.getRolesList().then(res => {
                  this.loading = false
                  this.dataList = res.data.content
                  this.page.total = res.data.pageTotal
                }).catch(err => {
                  this.loading = false
                  this.dataList = []
                  this.$message.error(err.errMsg)
                })
            },
            getAuthority(){ // 查询权限
                api.getAuthority().then(res => {
                  this.roleForm.data = res.data
                }).catch(err => {
                  this.roleForm.data = []
                  this.$message.error(err.errMsg)
                })
            },
            addrole(){ // 添加角色
                this.getAuthority()
                this.roleForm = {
                    roleName:'',
                    authoritites:[],
                    remark:''
                }
                this.isEdit = false
                this.dialogRole = true 
            },
            handleNodeClick(data) { // 选择用户节点
                console.log(data)
            },
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
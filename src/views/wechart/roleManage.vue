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
                <el-form-item :label="$t('table.roleName')" prop="name">
                   <el-input v-model="roleForm.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.permission')" prop="name">
                    <el-tree :data="roleForm.data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </el-form-item>
                <el-form-item :label="$t('table.note')" prop="name">
                    <el-input v-model="roleForm.name" type="textarea" :rows="2"></el-input>
                </el-form-item>   
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogRole = false">取 消</el-button>
                <el-button type="primary" @click="dialogRole = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    export default{
        name:'roleManage',
        components:{ BaseTable },
        data(){
            return {
                loading:false,
                dataList:[],
                tableLabel: [
                  {label: this.$t('table.roleName'), prop: 'serial_number'},
                  {label: this.$t('table.roleType'), prop: 'category'},
                  {label: this.$t('table.note'), prop: 'partner_contacts'},
                  {label: this.$t('table.creattime'), prop: 'partner_contacts'},
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
                    name:'',
                    data:[]
                },
                defaultProps: {
                   children: 'children',
                   label: 'label'
                },

            }
        },
        mounted(){
           
        },
        methods:{
            addrole(){ // 添加角色
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
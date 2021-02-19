<template>
    <div >
        <el-card>
            <el-button class="butadd" @click="addadmin">{{$t('button.addAdmin')}}</el-button>
        </el-card>
        <el-row :gutter="22" style="margin-top:10px">
            <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh" ></BaseTable>
        </el-row>
        <!-- 添加/编辑管理员 -->
        <el-dialog
            :title="isEdit? $t('button.editAdmin'): $t('button.addAdmin')"
            :visible.sync="dialogAdmin"
            width="30%">
            <el-form :model="adminForm" :rules="rules" ref="adminForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('table.adminName')" prop="name">
                   <el-input v-model="adminForm.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('table.count')" prop="name">
                   <el-input v-model="adminForm.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.paw')" prop="password" >
                  <el-input  name="password"  v-model="adminForm.password"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.confirmPaw')" prop="confirmPaw" >
                  <el-input  name="password"  v-model="adminForm.confirmPaw"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.user')" prop="name">
                    <el-select v-model="value" :placeholder="$t('view.user')">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item :label="$t('table.note')" prop="name">
                    <el-input v-model="adminForm.name" type="textarea" :rows="2"></el-input>
                </el-form-item>   
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAdmin = false">取 消</el-button>
                <el-button type="primary" @click="dialogAdmin = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改密码 -->
        <el-dialog
          :title="$t('button.changepassword')"
          :visible.sync="dialogPwd"
          width="30%">
          <el-form :model="pwdForm" ref="pwdForm" :rules="pwdRules" label-width="100px">
                <el-form-item :label="$t('view.paw')" prop="password" >
                  <el-input  name="password"  v-model="pwdForm.password"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.confirmPaw')" prop="confirmPaw" >
                  <el-input  name="password"  v-model="pwdForm.confirmPaw"></el-input>
                </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogPwd = false">取 消</el-button>
            <el-button type="primary" @click="dialogPwd = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    export default{
        name:'adminManage',
        components:{ BaseTable },
        data(){
            return {
                loading:false,
                dataList:[],
                tableLabel: [
                  {label: this.$t('table.adminName'), prop: 'serial_number'},
                  {label: this.$t('table.count'), prop: 'category'},
                  {label: this.$t('table.phone'), prop: 'partner_contacts'},
                  {label: this.$t('table.roleName'), prop: 'partner_contacts'},
                  {label: this.$t('table.creattime'), prop: 'partner_contacts'},
                  {label: this.$t('table.note'), prop: 'partner_contacts'},
                  {label: this.$t('table.operation'),
                    type: 'clickSelect',
                    selectOperation: (index, row) => {
                      this.showDialog(index, row)
                    },
                    selectText: [{command: '1', text: this.$t('button.editor'), index: 1},
                    {command: '2', text: this.$t('button.dele'), index: 2},
                    {command: '3', text: this.$t('button.changepassword'), index: 3} ]
                }],
                isEdit :false,
                dialogAdmin:false,
                rules:[],
                adminForm:{
                    name:'',
                    password:'',
                    confirmPaw:''
                },
                value:'',
                options:[],
                dialogPwd:false,
                pwdForm:{
                  password:'',
                  confirmPaw:''
                },
                pwdRules: {
                  password: [{ required: true, min: 6,  message: this.$t('message.pawlong') }],
                  confirmPaw: [{ required: true, min: 6,  message: this.$t('message.pawlong') }],
                },
            }
        },
        mounted(){
           
        },
        methods:{
            addadmin(){ // 添加管理员
                this.dialogAdmin = true
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
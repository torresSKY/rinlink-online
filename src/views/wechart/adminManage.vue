<template>
    <div >
        <el-card>
            <el-button class="butadd" @click="addadmin">{{$t('button.addAdmin')}}</el-button>
        </el-card>
        <el-row :gutter="22" style="margin-top:10px">
            <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh" ></BaseTable>
        </el-row>
        <el-pagination
            @current-change='changeindex'
            layout="prev, pager, next"
            :current-page.sync="page.index"
            :page-size="page.size"
            :total="page.total"
            background
            style="text-align:center">
        </el-pagination>
        <!-- 添加/编辑管理员 -->
        <el-dialog
            :title="isEdit? $t('button.editAdmin'): $t('button.addAdmin')"
            :visible.sync="dialogAdmin"
            width="30%">
            <el-form :model="adminForm" :rules="rules" ref="adminForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('table.adminName')" prop="nickname">
                   <el-input v-model="adminForm.nickname" :placeholder="$t('table.adminName')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('table.count')" prop="username">
                   <el-input v-model="adminForm.username" :placeholder="$t('table.count')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.paw')" prop="password" v-if="!isEdit">
                  <el-input  name="password"  v-model="adminForm.password" :placeholder="$t('view.paw')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.confirmPaw')" prop="confirmPaw" v-if="!isEdit">
                  <el-input  name="password"  v-model="adminForm.confirmPaw" :placeholder="$t('view.confirmPaw')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.user')" prop="roleId">
                    <el-select v-model="adminForm.roleId" :placeholder="$t('view.user')">
                        <el-option
                            v-for="item in options"
                            :key="item.roleId"
                            :label="item.roleName"
                            :value="item.roleId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item :label="$t('table.note')" prop="remark">
                    <el-input v-model="adminForm.remark" type="textarea" :rows="2" :placeholder="$t('table.note')"></el-input>
                </el-form-item>   
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAdmin = false">{{$t('button.cancel')}}</el-button>
                <el-button type="primary" @click="confrimAdmin">{{$t('button.determine')}}</el-button>
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
            <el-button @click="dialogPwd = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="confrimPwd">{{$t('button.determine')}}</el-button>
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
        name:'adminManage',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                dataList:[],
                tableLabel: [
                  {label: this.$t('table.adminName'), prop: 'nickname'},
                  {label: this.$t('table.count'), prop: 'username'},
                  {label: this.$t('table.phone'), prop: 'phoneNumber'},
                  {label: this.$t('table.roleName'), prop: 'roleName'},
                  {label: this.$t('table.creattime'), prop: 'createTime', type: 'Timestamp'},
                  {label: this.$t('table.note'), prop: 'remark'},
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
                rules:{
                  nickname: [
                    { required: true, message: this.$t('message.nickname'), trigger: 'blur' },
                  ],
                  username: [
                    { required: true, message: this.$t('message.username'), trigger: 'blur' },
                  ],
                  password: [
                    { required: true, message: this.$t('message.pawuser'), min:6, trigger: 'blur' },
                  ],
                  confirmPaw: [
                    { required: true, message: this.$t('message.pawuser'), min:6, trigger: 'blur' },
                  ],
                },
                adminForm:{
                    nickname:'',
                    username:'',
                    password:'',
                    confirmPaw:'',
                    roleId:'',
                    remark:'',
                    userId:''
                },
                options:[],
                dialogPwd:false,
                pwdForm:{
                  userId:'',
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
           this.getlist()
        },
        methods:{
            getlist(){ // 获取系统管理员列表
              this.loading = true
              api.getManagerList({params: {
                pageSize: this.page.size,
                pageNo: this.page.index - 1,
              }}).then(res => {
                this.loading = false
                this.dataList = res.data.content
                this.page.total = res.data.pageTotal
              }).catch(err => {
                this.loading = false
                this.dataList = []
                this.$message.error(err.errMsg)
              })
            },
            getroles(){ // 获取角色列表
              api.getRolesList().then(res => {
                this.options = res.data.content
              }).catch(err => {
                this.options = []
                this.$message.error(err.errMsg)
              })
            },
            addadmin(){ // 添加管理员
                // debugger
                if(this.$refs['adminForm']){
                  this.$refs['adminForm'].resetFields()
                }
                this.adminForm = {
                    nickname:'',
                    username:'',
                    password:'',
                    confirmPaw:'',
                    roleId:'',
                    remark:'',
                    userId:''
                }
                this.isEdit = false
                this.getroles()
                this.dialogAdmin = true
                
            },
            confrimAdmin(){ // 确认添加/编辑系统管理员
              if (this.adminForm.password !== this.adminForm.confirmPaw) {
                this.$message({
                  message: this.$t('message.newpawempty'),
                  type: "warning"
                })
                return
              }
              this.$refs['adminForm'].validate((valid) => {
                if (valid) {
                  // debugger
                  var data = null
                  if(!this.isEdit){
                    data = {
                      nickname:this.adminForm.nickname,
                      username:this.adminForm.username,
                      password:this.adminForm.password,
                      roleId:this.adminForm.roleId,
                      remark:this.adminForm.remark
                    }
                    api.addManager(data).then(res => {
                      
                      if(res.msg=='OK'){
                        this.$message.success(this.$t('message.addsuc'))
                        this.$refs['adminForm'].resetFields()
                        this.dialogAdmin = false
                        this.getlist()
                      }else {
                        this.$message.error(res.msg)
                      }
                    }).catch(err => {
                      this.$message.error(err.errMsg)
                    })
                  } else {
                    data = {
                      nickname:this.adminForm.nickname,
                      username:this.adminForm.username,
                      userId:this.adminForm.userId,
                      roleId:this.adminForm.roleId,
                      remark:this.adminForm.remark
                    }
                    api.editManager(data).then(res => {
                      
                      if(res.msg=='OK'){
                        this.$message.success(this.$t('message.changesuc'))
                        this.$refs['adminForm'].resetFields()
                        this.dialogAdmin = false
                        this.getlist()
                      }else {
                        this.$message.error(res.msg)
                      }
                    }).catch(err => {
                      this.$message.error(err.errMsg)
                    })
                  }
                  
                  
                } else {
                  this.$message.warning(this.$t('message.checkmsg'))
                  return false
                }
              })
            },
            showDialog(index, data){ // 操作
              switch (index) {
                case '1': // 修改系统管理员
                  this.getroles()
                  this.adminForm = {
                    nickname:data.nickname,
                    username:data.username,
                    roleId:data.roleId,
                    remark:data.remark,
                    userId:data.userId
                  }
                  this.isEdit = true
                  this.dialogAdmin = true
                  break
                case '2' : //删除系统管理员
                  this.$confirm(this.$t('message.equdele'), this.$t('message.newtitle'), {
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.cancel'),
                    type: 'warning'
                  }).then(() => {
                    let id = {
                      userId:data.userId
                    }
                    api.deleManager(id).then(res => {
                      if(res.msg=='OK'){
                        this.$message.success(this.$t('message.delesuc'))
                        this.getlist()
                      }else{
                        this.$message.error(res.msg)
                      }
                      
                    }).catch(err => {
                      this.$message.error(err.errMsg)
                    })
                  }).catch(err => {
                    console.log(err)
                  })
                  break
                case '3' : // 修改密码
                  this.pwdForm = {
                    userId:data.userId,
                    password:'',
                    confirmPaw:''
                  }
                  this.dialogPwd = true
                  break
              }

            },
            confrimPwd(){ // 修改密码
              if (this.pwdForm.password !== this.pwdForm.confirmPaw) {
                this.$message({
                  message: this.$t('message.newpawempty'),
                  type: "warning"
                })
                return
              }
              this.$refs['pwdForm'].validate((valid) => {
                if (valid) {
                  let data = {
                    userId:this.pwdForm.userId,
                    password:this.pwdForm.password
                  }
                  api.upsetPwd(data).then(res => {
                    // debugger
                    if(res.msg=='OK'){
                      this.$message.success(this.$t('message.changesuc'))
                      this.$refs['pwdForm'].resetFields()
                      this.dialogPwd = false
                      this.getlist()
                    }else {
                      this.$message.error(res.msg)
                    }
                  }).catch(err => {
                    this.$message.error(err.errMsg)
                  })
                } else {
                  this.$message.warning(this.$t('message.checkmsg'))
                  return false
                }
              })              
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
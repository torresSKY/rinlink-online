<template>
    <div id="wechartUser" :style="{height:windowHeight+'px',overflow: 'hidden'}">
        <el-card shadow="always" class="mb20" style="background:#ccc">
          <div slot="header" class="clearfix">
            <span>{{$t('route.User')}}</span>
          </div>
        <el-card shadow="always">
            <el-row :gutter="10">
                <!-- <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入用户名"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="searchRoles" placeholder="请选择角色">
                        <el-option
                            v-for="item in [...rolesList]"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-col> -->
                <el-col :span="16">
                      <!-- <el-button @click="filterSearch">查找</el-button> 
                      <el-button @click="changeindex(1)">刷新</el-button>-->
                      <el-button class="butadd" @click="openDialogs(false)">{{$t('button.add')}}</el-button>
                </el-col>
            </el-row>
            <div :style="{height:windowHeight-267+'px',overflow:'hidden' }">
                <el-scrollbar :style="{height:windowHeight-280+'px' }" ref="scroll">
                    <div style="overflow:hidden;">
                        <el-table v-loading="listLoading" :data="listxian" class="particular-table" :row-class-name="tableRowClassName" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}">
                            <el-table-column prop="username" :label="$t('table.username')" align='center'></el-table-column>
                            <!-- <el-table-column  label="id" align='center'>
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column> -->
                            <!--<el-table-column 
                                label="分组">
                                <template slot-scope="scope">
                                    {{scope.row.remarks == '' ? '暂无分组':''}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="角色">
                                <template slot-scope="scope">
                                    {{'普通用户'}}
                                </template>
                            </el-table-column>
                             <el-table-column
                                prop="height"
                                label="身高">
                            </el-table-column> -->
                            <el-table-column prop="createAt" :label="$t('table.creattime')" align='center'> </el-table-column>
                            <el-table-column :label="$t('table.operation')" width="500" align='center'> 
                                <template slot-scope="scope">
                                    <!-- <el-button
                                    size="mini"
                                    @click="openDialog(scope.row.id)">查看绑定记录</el-button>
                                    <el-button
                                    size="mini"
                                    v-if="scope.row.id==user||(adminRoles==99&&scope.row.role!==99)||(adminRoles==88&&scope.row.role!==99&&scope.row.role!==88)"
                                    @click="openuselog(scope.row.id)">修改用户权限</el-button>
                                    <el-button
                                    size="mini"
                                    v-if="scope.row.id==user||(adminRoles==99&&scope.row.role!==99)||(adminRoles==88&&scope.row.role!==99&&scope.row.role!==88)"
                                    @click="pcOpenDialogs(true,scope.row)">修改登录</el-button> -->
                                    <el-button
                                    class="butedior"
                                    size="mini"
                                    @click="openDialogs(true,scope.row)">{{$t('button.changepassword')}}</el-button>
                                    <el-button
                                    size="mini"
                                    @click="deleteUser(scope.row.id)">{{$t('button.dele')}}</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
        <el-card shadow="always" class="mt20">
            <el-pagination
                @current-change="changeindex"
                :current-page.sync="page.index"
                :page-size="page.size"
                layout="total, prev, pager, next ,jumper"
                :disabled="search||searchRoles===0||searchRoles?true:false"
                :total="page.total"
                style="text-align:center">
            </el-pagination>
        </el-card>
        </el-card>
        <el-dialog
            :title="$t('view.bangding')"
            :visible.sync="dialogState"
            width="60%"
            :before-close="handleClose">
            <div :style="{height:'400px',overflow:'hidden' }" v-loading="bindListLoading">
                <el-scrollbar :style="{height:400+17+'px' }">
                    <div style="overflow:hidden;">
                        <el-table
                            :data="bindList"
                            style="width: 100%">
                            <el-table-column
                                prop="imei"
                                label="SN">
                            </el-table-column>
                            <el-table-column label="id" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.id}}
                                </template>
                            </el-table-column>
                            <el-table-column label="状态"  width="140">
                                <template slot-scope="scope">
                                    {{scope.row.status==9?'绑定成功':scope.row.status==1?'等待设备响应':scope.row.status==2?'绑定超时':scope.row.status==3?'等待管理员确认':scope.row.status==5?'管理员拒绝':''}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="create_date"
                                label="创建时间">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button
                                    class="butdele"
                                    size="mini"
                                    @click="deleteBindRecord(scope.row.id)">{{$t('button.dele')}}删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
        </el-dialog>
        <el-dialog
            :title="isEdit? $t('button.changepassword'): $t('button.add')"
            :visible.sync="dialogStates"
            width="30%"
            :before-close="handleCloses">
            <div>
              <el-form :model="loginForm" ref="newForm" :rules="loginRules">
                <el-form-item :label="$t('table.username')" prop="username" :rules="[{required: true, min: 3,  message: this.$t('message.namelong')}]">
                  <el-input name="username" v-model="loginForm.username" :placeholder="name" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.paw')" prop="password" :rules="[{required: true, min: 6,  message: this.$t('message.pawlong')}]">
                  <el-input  name="password"  v-model="loginForm.password"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCloses">{{$t('button.cancel')}}</el-button>
                <el-button type="primary" @click="confirmAdd">{{$t('button.determine')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import api from "@/api/wechart/index";
import mixin from "@/mixins/index";
import axios from 'axios'
import { mapState } from "vuex";
export default {
  name: "wechartUser",
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      loginRules: {
        username: [{ required: true, min: 3,  message: this.$t('message.namelong') }],
        password: [{ required: true, min: 6,  message: this.$t('message.pawlong') }],
      },
      loginForm: {
        username: '',
        password: ''
      },
      username: "",
      password: "",
      // adminRoles:this.$store.getters.roles,
      windowHeight: 0,
      list: [],
      listLoading: true,
      addOrEditLoading: false,
      pcAddOrEditLoading: false,
      listxian: [],
      search: "",
      searchRoles: "",
      name: "",
      nickname: "",
      phone: "",
      email: "",
      height: "",
      weight: "",
      roles: -1,
      remarks: '',
      text:'',
      sport_target: "",
      dialogState: false,
      dialogState2: false,
      dialogStates: false,
      pcDialogStates: false,
      isEdit: false,
      pcIsEdit: false,
      editId: -1,
      pcEditId: -1,
      id: -1,
      userid:'',
      bindList: [],
      bindListLoading: false,
      rolesList: [
        { id: 0, name: "小程序用户" },
        { id: 1, name: "普通用户" },
        { id: 88, name: "管理员" },
        { id: 99, name: "超级管理员" }
      ],
      tableData:[
        { id: 0, leimu: "查询设备定位" },
        { id: 1, leimu: "查询轨迹" },
        { id: 88, leimu: "添加设备" },
        { id: 99, leimu: "编辑设备" },
        { id: 99, leimu: "用户管理" },
        { id: 99, leimu: "修改密码" }
      ]
    };
  },
  mounted() {
    console.log(this.adminRoles);
    this.windowHeight = document.body.offsetHeight - 62;
    this.getList();
  },
  methods: {
    getList() {
      this.search = "";
      this.searchRoles = "";
      this.listLoading = true;
      // this.rollBack("scroll");
      api.getUsersListPagination({
          params:{
              parentId:this.$store.getters.usercode,
              pageSize:this.page.size,
              pageNo:this.page.index-1
          }
      }).then(_=>{
          if(Array.isArray(_.content)){
              this.list=_.content
              this.listxian = _.content;
              this.page.total = _.total;
              //this.filterSearch()
          }else{
              this.$message.error(this.$t('table.faillist'));
          }
          this.listLoading=false
      }).catch(err=>{
          this.$message.error(err.message);
          this.listLoading=false
      })
    },

    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    filterSearch() {
      this.listLoading = true;
      api
        .getUsersList({ nickname: this.search, role: this.searchRoles })
        .then(_ => {
          if (Array.isArray(_)) {
            this.listxian = _;
            this.page.total = _.length;
            // this.page.size=_.length
          } else {
            this.$message.error(this.$t('table.failsearch'));
          }
          this.listLoading = false;
        })
        .catch(_ => {
          this.$message.error(_.message);
          this.listLoading = false;
        });
    },
    openuselog(id) {
      this.id = id;
      this.dialogState2 = true;
    },
    pcConfirmchange(){
      this.$message({
          type: "success",
           message: this.$t('message.changesuc')
              });
    this.dialogState2 = false;
    },
    openDialogs(state, obj) {
      if (state) {   //编辑
        this.loginForm.username = obj.username;
        this.userid = obj.id
        this.nickname = obj.nickname;
        this.phone = obj.phone;
        this.email = obj.email;
        this.height = obj.height;
        this.weight = obj.weight;
        this.sport_target = obj.sport_target;
        this.editId = obj.id;
        this.roles = obj.role;
        this.password = obj.password;
        this.remarks = ''
      } else {
        this.loginForm.username = "";
        this.nickname = "";
        this.phone = "";
        this.email = "";
        this.height = "";
        this.weight = "";
        this.sport_target = "";
        this.roles = 1;
        this.editId = -1;
        this.remarks = ''
      }
      this.isEdit = state;
      this.dialogStates = true;
      this.loginForm.password = ''
    },
    async confirmAdd() {
      let reg = /^[\w]{6,15}$/
      if(!reg.test(this.loginForm.password)){
        this.$message.error(this.$t('message.geshi2'))
        return
      }
      let data = {
        parentId:this.$store.getters.usercode,
        password:this.loginForm.password,
        remarks:'',
        username:this.loginForm.username
      };
      let edituser = {
        parentId:this.$store.getters.usercode,
        password:this.loginForm.password,
        userId:this.userid
      }
      this.addOrEditLoading = true;
      let res = null;
      if (this.isEdit) {
         let reg = /^\w+$/g
        if(!reg.test(this.loginForm.username)){
           this.$message.error(this.$t('message.geshi'))
           return
        }
        if(this.loginForm.username.length < 3 ){
          this.$message.error(this.$t('message.namelong'))
          return
        }else{
          res = await api.userEdit(edituser).catch(_ => {
            this.$message.error(_.message)
          });
        }
      } else {
        if(this.loginForm.username.length < 3 ){
          this.$message.error(this.$t('message.namelong'))
          return
        }
         let reg = /^\w+$/g
        if(!reg.test(this.loginForm.username)){
           this.$message.error(this.$t('message.geshi'))
           return
        }
        res = await api.userAdd(data).catch(_ => {
          if(_.message == 'User name already exists'){
            this.$message.error(this.$t('message.usertwo'))
          }else{
            this.$message.error(_.message)
          }
        });
      }
      if (res) {
        this.$message({
          type: "success",
          message: `${this.isEdit ? this.$t('message.changesuc') : this.$t('message.addsuc')}`
        });
        this.dialogStates = false;
        this.getList();
        this.addOrEditLoading = false;
      } else {
        this.$message({
          type: "error",
          // message: `${this.isEdit ? "修改失败" : "添加失败"}`
          message: res.message
        });
        this.addOrEditLoading = false;
      }
    },
    deleteBindRecord(id) {
      this.$confirm(this.$t('message.equdele'), this.$t('message.newtitle'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.cancel'),
        type: "warning"
      })
        .then(() => {
          this.bindListLoading = true;
          api
            .deleteBindRecord(id)
            .then(_ => {
              // if (_.affectedRows) {
                this.$message({
                  type: "success",
                  message: this.$t('message.delesuc')
                });
                this.getList();
              // }
            })
            .catch(_ => {
              this.$message({
                type: "error",
                message: _.message
              });
            });
        })
        .catch(() => {
          this.bindListLoading = false;
          this.$message({
            type: "info",
            message: this.$t('message.undele')
          });
        });
    },
    deleteUser(id) {
      this.$confirm(this.$t('message.equdele'), this.$t('message.newtitle'), {
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.cancel'),
        type: "warning"
      }).then(() => {
          api.deleuser(id)
            .then(_ => {
                this.$message({
                  type: "success",
                  message: this.$t('message.delesuc')
                });
                this.getList();
            })
            .catch(_ => {
              this.$message({
                type: "error",
                message: _.message
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t('message.undele')
          });
        });
    },
    handleClose() {
      this.dialogState = false;
    },
    handleCloses() {
      var that = this
      this.loginForm.username = null
      this.loginForm.password = null
      this.$nextTick(() => {
        this.$refs.newForm.resetFields();
      })
      this.dialogStates = false;
    },
    pcOpenDialogs(state, obj) {
      if (state) {
        this.username = obj.username;
        this.password = "";
        this.pcEditId = obj.id;
        this.remarks = ''
        // this.nickname=obj.nickname
        // this.phone=obj.phone
        // this.email=obj.email
        // this.height=obj.height
        // this.weight=obj.weight
        // this.sport_target=obj.sport_target
        // this.editId=obj.id
      } else {
        this.username = "";
        this.password = "";
        this.pcEditId = -1;
        this.remarks = ''
      }
      this.pcIsEdit = state;
      this.pcDialogStates = true;
    },
    pcConfirmAdd() {
      if (this.pcIsEdit) {
        let data = {
          username: this.username,
          password: this.password
        };
        this.pcAddOrEditLoading = true;
        api
          .userEdit(this.pcEditId, data)
          .then(_ => {
            if (_.affectedRows) {
              this.$message({
                type: "success",
                message: this.$t('message.changesuc')
              });
              this.pcDialogStates = false;
              this.getList();
              this.pcAddOrEditLoading = false;
            } else {
              return Promise.reject();
            }
          })
          .catch(_ => {
            this.$message({
              type: "error",
              message: _.message
            });
            this.pcAddOrEditLoading = false;
          });
      } else {
        let data = {
          username: this.username,
          password: this.password
        };
        this.pcAddOrEditLoading = true;
        api
          .userRegister(data)
          .then(_ => {
            if (_.id) {
              this.$message({
                type: "success",
                message: this.$t('message.addsuc')
              });
              this.pcDialogStates = false;
              this.getList();
              this.pcAddOrEditLoading = false;
            } else {
              return Promise.reject();
            }
          })
          .catch(_ => {
            this.$message({
              type: "error",
              message: _.message
            });
            this.pcAddOrEditLoading = false;
          });
      }
    },
    pcHandleClose() {
      this.pcDialogState = false;
    },
    pcHandleCloses() {
      this.pcDialogStates = false;
    }
  }
};
</script>
<style type="stylesheet/scss" lang="scss" scoped>
.particular-table{
      margin-top: 10px;
}
</style>
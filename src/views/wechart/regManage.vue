<template>
    <div id="regManage" >
        <el-row >
                <el-row :gutter="22" style="margin:10px 0 10px 5px">
                    <el-col :span='3'>
                        <el-input v-model="username" placeholder="请输入登录账号" clearable></el-input>
                    </el-col>
                    <el-col :span='3'>
                        <el-input v-model="phone" placeholder="请输入电话" clearable></el-input>
                    </el-col>
                    <el-col :span='3' >
                        <el-select v-model="registerFrom" placeholder="请选择注册途径" clearable>
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='6'>
                      <el-button class="butresh" @click="getlist(1)">{{$t('button.search')}}</el-button>
                    </el-col>
                </el-row>
                <el-row >
                  <!-- :style="{height:height - 250 + 'px',overflow:'auto', }" -->
                  <!-- <el-scrollbar style="height:64vh;" ref="scrollbar"> -->
                    <BaseTable :height='height' v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"   ></BaseTable>
                  <!-- </el-scrollbar> -->
                </el-row>
                <el-pagination
                    @current-change='changeindex'
                    :page-sizes="[20, 100, 500, 1000]"
                    @size-change='changesize'
                    layout="total,sizes,prev, pager, next"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    :total="page.total"
                    background
                    style="text-align:center;margin-top:10px">
                </el-pagination>
            
        </el-row>
        <!-- 添加/编辑客户 -->
        <el-dialog
            :title="isEdit? $t('button.editCustomer'): $t('button.addCustomer')"
            :visible.sync="dialogCustomer"
            :close-on-click-modal='false'
            :close-on-press-escape='false' 
            width="40%">
            <el-row :gutter="22">
                <el-col :span='24'>
                    <el-form :model="customerForm" :rules="rules" ref="customerForm" label-width="100px" class="demo-ruleForm">
                          <el-form-item :label="$t('view.admin')" prop="username" >
                             <el-input v-model="customerForm.username" :disabled="isEdit"></el-input>
                          </el-form-item>
                          <el-form-item label="渠道" prop="channel" v-if="type==1">
                             <el-radio v-model="customerForm.channel" label="1">线上</el-radio>
                             <el-radio v-model="customerForm.channel" label="2">线下</el-radio>
                          </el-form-item>
                          <el-form-item :label="$t('table.phone')" prop="phoneNumber">
                             <el-input v-model="customerForm.phoneNumber"></el-input>
                          </el-form-item>
                          <el-form-item :label="$t('table.note')" prop="remark">
                             <el-input v-model="customerForm.remark"></el-input>
                          </el-form-item>
                    </el-form>    
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogCustomer = false">{{$t('button.cancel')}}</el-button>
              <el-button type="primary" @click="confrimCustomer">{{$t('button.determine')}}</el-button>
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
import api from "@/api/wechart/index"
import mixin from "@/mixins/index"
import { mapState } from "vuex"
import BaseTable from '@/components/table'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "regManage",
  components:{ BaseTable,Treeselect },
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      value:'',
      options:[{ value: '云途星晨专业版', label: '云途星晨专业版'},
      { value: '云途星晨汽车版', label: '云途星晨汽车版'},
      { value: '云途星晨工牌版', label: '云途星晨工牌版'},
      { value: '云途星晨牛羊版', label: '云途星晨牛羊版'}],
      username:null,
      registerFrom:null,
      checked:true,
      loading:false,
      dataList: [],
      tableLabel: [
        {label: this.$t('table.index'), type: 'index'},
        {label: '登录账号', prop: 'username'},
        {label: this.$t('table.phone'), prop: 'phoneNumber'},
        {label: this.$t('table.equNo'),prop: 'devices'},
        {label: '注册途径', prop: 'registerFrom'},
        {label: '备注', prop: 'remark'},
        {label:'注册时间', prop: 'registerTime', type: 'Timestamp'},
        {label: this.$t('table.operation'),
          type: 'clickSelect',
          selectOperation: (index, row) => {
            this.showDialog(index, row)
          },
          selectText: [{command: '1', text: this.$t('button.editor'), index: 1},
          {command: '2', text: this.$t('button.dele'), index: 2},
          {command: '3', text: this.$t('button.changepassword'), index: 3} ]
        }
      ],
      dialogCustomer: false,
      isEdit:false,
      customerForm:{
          nickname:'',
          username:'',
          password:'',
          confirmPaw:'',
          personToContact:'',
          phoneNumber:'',
          email:'',
          remark:'',
          userId:'',
          parentName:null,
          parentId:'',
          channel:'2'
      },
      tempParentId:null,
      tempParentName:null,
      rules:{
        nickname: [
          { required: true, message: this.$t('view.username'), trigger: 'blur' },
        ],
        username: [
          { required: true, message: this.$t('view.admin'), trigger: 'blur' },
        ],
        password: [
          { required: true, message: this.$t('message.pawuser'), min:6, trigger: 'blur' },
        ],
        confirmPaw: [
          { required: true, message: this.$t('message.pawuser'), min:6, trigger: 'blur' },
        ],
        channel: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
      },
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
      type:null,
      height:document.body.offsetHeight - 332,
      phone:null
    }
  },
  watch: {
    // height (val) {
    //     console.log(val)
    //     // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
    //     if (!this.timer) {
          
    //       this.height = document.body.offsetHeight - 102
    //       this.timer = true
    //       let that = this
    //       setTimeout(function () {
    //         // 打印screenWidth变化的值
    //         that.timer = false
    //       }, 400)
    //     }
    //   }
  },
  mounted() {
    var that =this
    window.onresize = () => {
      return (() => {
        that.height = document.body.offsetHeight - 332
      })()
    }
    this.type = JSON.parse(sessionStorage['user']).userType
  },
  methods: {
    getlist(type){ // 获取客户列表
        this.loading = true
        let data = null
        if(type==1){
          this.page.index = 1
        }
        data = {
          phone:this.phone,
          username :this.username,
          registerFrom :this.registerFrom,
          pageSize: this.page.size,
          page: this.page.index - 1
        }
        api.paging_query_consumer_users(data,this.type).then(res => {
          this.loading = false
          this.dataList = res.data.content
          this.page.total = res.data.totalElements
        }).catch(err => {
          this.loading = false
          this.dataList = []
          this.$message.error(err.msg)
        })
    },
    changeindexNew(){
      if(this.tempParentId){
        this.getlist(2,this.tempParentId)
      }else{
        this.getlist()
      }
    },
    confrimCustomer(){ // 确认添加/修改客户
      // if (this.customerForm.password !== this.customerForm.confirmPaw) {
      //   this.$message({
      //     message: '两次输入的密码不一致',
      //     type: "warning"
      //   })
      //   return
      // }
      this.$refs['customerForm'].validate((valid) => {
        if (valid) {
          // debugger
          var data = null
          if(!this.isEdit){
            data = {
              parentId:this.customerForm.parentId,
              nickname:this.customerForm.nickname,
              username:this.customerForm.username,
              password:this.customerForm.password,
              personToContact:this.customerForm.personToContact,
              phoneNumber:this.customerForm.phoneNumber,
              email:this.customerForm.email,
              remark:this.customerForm.remark
            }
            if(this.type==1){
              data['channel'] = this.customerForm.channel
            }
            api.addBusiness(data,this.type).then(res => {
              if(res.success){
                this.$message.success(this.$t('message.addsuc'))
                this.$refs['customerForm'].resetFields()
                this.dialogCustomer = false
                this.getlist()
                this.getBusiness()
              }else {
                this.$message.error(res.msg)
              }
            }).catch(err => {
              this.$message.error(err.msg)
            })
          } else {
            data = {
              userId:this.customerForm.userId,
            //   nickname:this.customerForm.nickname,
              phoneNumber:this.customerForm.phoneNumber,
              remark:this.customerForm.remark
            }
            if(this.type==1){
              data['channel'] = this.customerForm.channel
            }
            api.update_consumer_user(data,this.type).then(res => {
              if(res.success){
                this.$message.success(this.$t('message.changesuc'))
                this.$refs['customerForm'].resetFields()
                this.dialogCustomer = false
                this.getlist()
                this.getBusiness()
              }else {
                this.$message.error(res.msg)
              }
            }).catch(err => {
              this.$message.error(err.msg)
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
        case '1': // 修改客户
          this.customerForm = {
            userId:data.userId,
            parentId:null,
            parentName:null,
            nickname:data.nickname,
            username:data.username,

            phoneNumber:data.phoneNumber,

            remark:data.remark,
            channel:'2'
          }
          if(this.type==1&&data.channel){
            this.customerForm.channel = data.channel.toString()
          }
          console.log(this.customerForm)
          this.dialogCustomer = true 
          this.isEdit = true
          break
        case '2' : //删除客户 
          const confirmText = ['您正在删除自主注册用户，需注意：用户被删除后，对应数据将丢弃，且无法恢复。确认要继续删除该用户吗？','  ','提示：本处用户删除并不删除设备。删除某一用户后，其设备依旧可在上级代理商账号下查看。'] 
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            // debugger
            if(i==2){
              newDatas.push(h('div', { style: 'color: red;margin-top:10px' }, confirmText[i]))
            }else{
              newDatas.push(h('div', null, confirmText[i]))
            }
            
          }
          this.$confirm(h('div', null, newDatas), '警告', {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.cancel'),
            type: 'warning'
          }).then(() => {
            let id = {
              userId:data.userId
            }
            api.delete_consumer_user(id,this.type).then(res => {
              if(res.success){
                this.$message.success(this.$t('message.delesuc'))
                this.getlist(1)
              }else{
                this.$message.error(res.msg)
              }
              
            }).catch(err => {
              this.$message.error(err.msg)
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
          message: '两次输入的密码不一致',
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
          api.reset_consumer_user_password(data,this.type).then(res => {
            // debugger
            if(res.success){
              this.$message.success(this.$t('message.changesuc'))
              this.$refs['pwdForm'].resetFields()
              this.dialogPwd = false
              this.getlist()
            }else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            this.$message.error(err.msg)
          })
        } else {
          this.$message.warning(this.$t('message.checkmsg'))
          return false
        }
      }) 
    },
  
  }
}
</script>
<style type="stylesheet/scss" lang="scss" scoped>
/deep/ .el-input-group__prepend .el-select{
  margin: -10px 0px;
}
/deep/ .input-with-select .el-input-group__prepend {
  width: 80px;
  padding: 0 0 0 10px;
  background-color: #fff;
}
/deep/ .el-input-group__append{
  padding: 0 10px;
}  
/deep/ .el-scrollbar__wrap {
overflow-x: hidden;
}
/deep/ .el-table::before{
  border-bottom: 1px solid #CCCCCC;
}

</style>

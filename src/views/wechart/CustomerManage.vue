<template>
    <div id="customerManage" >
        <el-row :gutter="22">
            <el-col :span='4'>
                <el-card>
                    <el-row>
                        <span>{{$t('view.customerList')}}</span>
                    </el-row>
                    <el-row style="margin:10px 0">
                        <el-input :placeholder="$t('view.searchUser')" v-model="searchType" clearable class="input-with-select">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-row>
                    <el-row :style="{height:70 + 'vh'}">
                        <el-tree :data="businessData" :props="defaultProps" ref="tree" 
                        @node-click="handleNodeClick"></el-tree>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span='20'>
                <el-card>
                    <span>上海零零智能科技有限公司</span>&nbsp;
                    {{$t('table.count')}}：<span>admin</span>&nbsp;
                    {{$t('table.phone')}}：<span>151125151212</span>
                </el-card>
                <el-row :gutter="22" style="margin-top:10px">
                    <el-col :span='4'>
                        <el-input v-model="input3" :placeholder="$t('view.searchUser')"></el-input>
                    </el-col>

                    <el-col :span='2' style="line-height:40px">
                      <el-checkbox v-model="checked">{{$t('view.subordinate')}}</el-checkbox>
                    </el-col>
                    <el-col :span='4'>
                      <el-button class="butresh" >{{$t('button.search')}}</el-button>
                      <el-button class="butadd" @click="addCustomer">{{$t('button.addCustomer')}}</el-button>
                    </el-col>
                </el-row>
                <el-row style="margin-top:10px">
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
            </el-col>
        </el-row>
        <!-- 添加/编辑客户 -->
        <el-dialog
            :title="isEdit? $t('button.editCustomer'): $t('button.addCustomer')"
            :visible.sync="dialogCustomer"
            width="30%">
            <el-row :gutter="22">
                <el-col :span='24'>
                    <el-form :model="customerForm" :rules="rules" ref="customerForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item :label="$t('view.username')" prop="name">
                           <el-input v-model="customerForm.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.admin')" prop="name">
                           <el-input v-model="customerForm.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.paw')" prop="name">
                           <el-input v-model="customerForm.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.confirmPaw')" prop="name">
                           <el-input v-model="customerForm.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.contacts')" prop="name">
                           <el-input v-model="customerForm.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.phone')" prop="name">
                           <el-input v-model="customerForm.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.email')" prop="name">
                           <el-input v-model="customerForm.name"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.note')" prop="name">
                           <el-input v-model="customerForm.name"></el-input>
                        </el-form-item>
                    </el-form>    
                </el-col>
                <!-- <el-col :span='12'>
                  <el-row :gutter="22">
                    <el-input :placeholder="$t('view.searchUser')" v-model="input3" class="input-with-select">
                      <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                  </el-row>
                  <el-row :gutter="22" style="margin-top:10px">
                    <el-tree :data="businessData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                  </el-row>
                </el-col> -->
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogCustomer = false">{{$t('button.cancel')}}</el-button>
              <el-button type="primary" @click="dialogCustomer = false">{{$t('button.determine')}}</el-button>
            </span>
        </el-dialog>
        <!-- 修改密码 -->
        <el-dialog
          :title="$t('button.changepassword')"
          :visible.sync="dialogPwd"
          width="30%">
          <el-form :model="pwdForm" ref="pwdForm" :rules="pwdRules" label-width="100px">
                <el-form-item :label="$t('table.username')" prop="username" >
                  <el-input name="username" v-model="pwdForm.username" :placeholder="$t('table.username')" ></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.paw')" prop="password" >
                  <el-input  name="password"  v-model="pwdForm.password"></el-input>
                </el-form-item>
                <el-form-item :label="$t('view.confirmPaw')" prop="confirmPaw" >
                  <el-input  name="password"  v-model="pwdForm.confirmPaw"></el-input>
                </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogPwd = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="dialogPwd = false">{{$t('button.determine')}}</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import api from "@/api/wechart/index"
import mixin from "@/mixins/index"
import { mapState } from "vuex"
import BaseTable from '@/components/table'
export default {
  name: "CustomerManage",
  components:{ BaseTable },
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      searchType:'',
      input3:'',
      businessData: [],
        defaultProps: {
          children: 'children',
          label: 'username'
        },
        value:'',
        options:[],
        checked:true,
        loading:false,
        dataList: [],
        tableLabel: [
        {label: this.$t('table.index'), type: 'index'},
        {label: this.$t('table.customerName'), prop: 'nickname'},
        {label: this.$t('table.count'), prop: 'username'},
        {label: this.$t('table.phone'), prop: 'phoneNumber'},
        {label: this.$t('table.contacts'), prop: 'presonToConcat'},
        {label: this.$t('table.equNo'),
          type: 'clickEvent',
          tableClick: (val) => {
            this.showDialog('a', val)
          }
        },
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
          name:''
      },
      rules:{},
      dialogPwd:false,
      pwdForm:{
        username:'',
        password:'',
        confirmPaw:''
      },
      pwdRules: {
        username: [{ required: true, min: 3,  message: this.$t('message.namelong') }],
        password: [{ required: true, min: 6,  message: this.$t('message.pawlong') }],
        confirmPaw: [{ required: true, min: 6,  message: this.$t('message.pawlong') }],
      },
    }
  },
  mounted() {
    this.getlist()
    this.getBusiness()
  },
  methods: {
    getlist(){ // 获取客户列表
        this.loading = true
        api.getBusinessList().then(res => {
          this.loading = false
          this.dataList = res.data.content
          this.page.total = res.data.pageTotal
        }).catch(err => {
          this.loading = false
          this.dataList = []
          this.$message.error(err.errMsg)
        })
    },
    getBusiness(){ // 获取代理商
      api.getBusiness().then(res => {
          let data = res.data
          this.businessData = this.setTreeData(data)
          this.getBusinessUserinfo(res.data[0].userId)
          // console.log(this.businessData)
        }).catch(err => {
          this.businessData = []
          this.$message.error(err.errMsg)
        })
    },
    getBusinessUserinfo(userId){ // 获取客户信息
      api.getBusinessUserinfo({params: {
          userId: userId,
        }}).then(res => {
          let data = res.data

        }).catch(err => {

          this.$message.error(err.errMsg)
        })
    },
    setTreeData(arr){ // 遍历代理商
        // 删除所有的children,以防止多次调用
        arr.forEach(function(item) {
            delete item.children;
        });
        
        let map = {}; //构建map
        arr.forEach(i => {
            map[i.userId] = i; //构建以id为键 当前数据为值
        });
        let treeData = [];
        arr.forEach(child => {
            // debugger
            const mapItem = map[child.parentId]; //判断当前数据的parentId是否存在map中
            if (mapItem) {
                //存在则表示当前数据不是最顶层的数据
                //注意： 这里的map中的数据是引用了arr的它的指向还是arr,当mapItem改变时arr也会改变，踩坑点
                (mapItem.children || (mapItem.children = [])).push(child); //这里判断mapItem中是否存在child
            } else {
                //不存在则是顶层数据
                treeData.push(child);
            }
        });
        return treeData;
    },
    handleNodeClick(data) { // 选择用户节点
        console.log(data)
    },
    addCustomer(){ // 添加客户
        this.dialogCustomer = true 
        this.isEdit = false

    }
  }
}
</script>
<style type="stylesheet/scss" lang="scss" scoped>
</style>

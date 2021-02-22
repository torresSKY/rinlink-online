<template>
    <div id="customerManage" >
        <el-row :gutter="22">
            <el-col :span='4'>
                <el-card>
                    <el-row>
                        <span>{{$t('view.customerList')}}</span>
                    </el-row>
                    <el-row style="margin-top:10px">
                        <el-input :placeholder="$t('view.searchUser')" v-model="input3" class="input-with-select">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                    </el-row>
                    <el-row :style="{height:70 + 'vh'}">
                        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span='20'>
                <el-card>
                    <span>上海零零智能科技有限公司</span>&nbsp;
                    账号：<span>admin</span>&nbsp;
                    手机：<span>151125151212</span>
                </el-card>
                <el-row :gutter="22" style="margin-top:10px">
                    <el-col :span='4'>
                        <el-input v-model="input3" :placeholder="$t('view.searchUser')"></el-input>
                    </el-col>
                    <el-col :span='5' style="line-height:40px">
                        <el-col :span='8'>
                            <span>{{$t('view.customerType')}}：</span>
                        </el-col>
                        <el-col :span='15'>
                            <el-select v-model="value" :placeholder="$t('view.customerType')">
                              <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                        </el-col> 
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
            </el-col>
        </el-row>
        <!-- 添加/编辑客户 -->
        <el-dialog
            :title="isEdit? $t('button.editCustomer'): $t('button.addCustomer')"
            :visible.sync="dialogCustomer"
            width="60%">
            <el-row :gutter="22">
                <el-col :span='12'>
                    <el-form :model="customerForm" :rules="rules" ref="customerForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item :label="$t('view.superiorUser')" prop="name">
                           <el-input v-model="customerForm.name" class="input-with-select">
                               <el-button slot="append" icon="el-icon-caret-right"></el-button>
                           </el-input>
                        </el-form-item>
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
                <el-col :span='12'>
                  <el-row :gutter="22">
                    <el-input :placeholder="$t('view.searchUser')" v-model="input3" class="input-with-select">
                      <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                  </el-row>
                  <el-row :gutter="22" style="margin-top:10px">
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                  </el-row>
                </el-col>
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
      input3:'',
      data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        value:'',
        options:[],
        checked:true,
        loading:false,
        dataList: [],
        tableLabel: [
        {label: this.$t('table.index'), type: 'index'},
        {label: this.$t('table.customerName'), prop: 'serial_number'},
        {label: this.$t('table.count'), prop: 'category'},
        {label: this.$t('table.phone'), prop: 'partner_contacts'},
        {label: this.$t('view.customerType'), prop: 'partner_contacts'},
        {label: this.$t('table.contacts'), prop: 'partner_contacts'},
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
      rules:[],
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

  },
  methods: {
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

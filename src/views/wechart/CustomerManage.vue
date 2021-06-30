<template>
    <div id="customerManage" >
        <el-row >
            <el-col :span='4'>
                <el-card>
                    <el-row>
                        <span>{{$t('view.customerList')}}</span>
                    </el-row>
                    <el-row style="margin:10px 0">
                        <el-input :placeholder="$t('view.inputtext')" v-model="searchType" clearable class="input-with-select">
                            <el-select v-model="selectType" slot="prepend" >
                              <el-option label="账号" value="username"></el-option>
                              <el-option label="客户" value="nickname"></el-option>
                            </el-select>
                            <el-button slot="append" icon="el-icon-search" @click="searchCustomer"></el-button>
                        </el-input>
                    </el-row>
                    <el-row >
                      <el-scrollbar :style="{height:70 + 'vh'}" ref="scrollbar">
                        <el-tree :data="businessData" :props="defaultProps" ref="businessData"   node-key="userId" :default-expanded-keys="[outUserId]"
                        @node-click="handleNodeClick" lazy :load="evt_loadTree" :render-content="renderContent"></el-tree>
                      </el-scrollbar>  
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span='20'>
                <el-card>
                    <span>{{company}}</span>&nbsp;
                    {{$t('table.count')}}：<span>{{username}}</span>&nbsp;
                    {{$t('table.phone')}}：<span>{{phone}}</span>
                </el-card>
                <el-row :gutter="22" style="margin:10px 0 10px 5px">
                    <el-col :span='4'>
                        <el-input v-model="input3" :placeholder="$t('view.inputtext')" clearable class="input-with-select">
                          <el-select v-model="selectType1" slot="prepend" >
                              <el-option label="账号" value="username"></el-option>
                              <el-option label="客户" value="nickname"></el-option>
                            </el-select>
                        </el-input>
                    </el-col>
                    <el-col :span='2' style="line-height:40px">
                      <el-checkbox v-model="checked">{{$t('view.subordinate')}}</el-checkbox>
                    </el-col>
                    <el-col :span='6'>
                      <el-button class="butresh" @click="getlist(1)">{{$t('button.search')}}</el-button>
                      <el-button class="butadd" @click="addCustomer">{{$t('button.addCustomer')}}</el-button>
                    </el-col>
                </el-row>
                <el-row :style="{height:height - 250 + 'px',overflow:'auto', }">
                  <!-- <el-scrollbar style="height:64vh;" ref="scrollbar"> -->
                    <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"   ></BaseTable>
                  <!-- </el-scrollbar> -->
                </el-row>
                <el-pagination
                    @current-change='changeindexNew'
                    layout="total,prev, pager, next"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    :total="page.total"
                    background
                    style="text-align:center;margin-top:10px">
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 添加/编辑客户 -->
        <el-dialog
            :title="isEdit? $t('button.editCustomer'): $t('button.addCustomer')"
            :visible.sync="dialogCustomer"
            width="40%">
            <el-row :gutter="22">
                <el-col :span='(type==2&&!isEdit)?12:24'>
                    <el-form :model="customerForm" :rules="rules" ref="customerForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item v-if="type==2" label="上级用户" prop="parentName">
                           <el-input v-model="customerForm.parentName" disabled></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.username')" prop="nickname">
                           <el-input v-model="customerForm.nickname"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.admin')" prop="username" v-if="!isEdit">
                           <el-input v-model="customerForm.username"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.paw')" prop="password" v-if="!isEdit">
                           <el-input v-model="customerForm.password"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.confirmPaw')" prop="confirmPaw" v-if="!isEdit">
                           <el-input v-model="customerForm.confirmPaw"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.contacts')" prop="personToContact">
                           <el-input v-model="customerForm.personToContact"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.phone')" prop="phoneNumber">
                           <el-input v-model="customerForm.phoneNumber"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('view.email')" prop="email">
                           <el-input v-model="customerForm.email"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('table.note')" prop="remark">
                           <el-input v-model="customerForm.remark"></el-input>
                        </el-form-item>
                    </el-form>    
                </el-col>
                <el-col :span='12' v-if="type==2&&!isEdit">
                  <el-row :gutter="22">
                    <el-input :placeholder="$t('view.inputtext')" v-model="selParentId" class="input-with-select" clearable>
                      <el-select v-model="selectType2" slot="prepend" >
                        <el-option label="账号" value="username"></el-option>
                        <el-option label="客户" value="nickname"></el-option>
                      </el-select>
                      <el-button slot="append" icon="el-icon-search" @click="searchCustomer2"></el-button>
                    </el-input>
                  </el-row>
                  <el-row :gutter="22" style="margin-top:10px">
                    <el-scrollbar style="height:60vh;overflow-x:hidden" ref="scrollbar">
                      <el-tree :data="busData" ref="busData" :props="defaultProps" :highlight-current='true'
                  node-key="userId" :default-expanded-keys="[inUserId]" lazy :load="evt_loadTree2" :render-content="renderContent" @node-click="handleCust"></el-tree>
                    </el-scrollbar>
                  </el-row>
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
export default {
  name: "CustomerManage",
  components:{ BaseTable },
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      searchType:null,
      selParentId:null,
      input3:null,
      businessData: [],
      busData:[],
      defaultProps: {
        children: 'children',
        label: 'nickname',
        isLeaf: 'leaf'
      },
      selectType:'username',
      selectType1:'username',
      selectType2:'username',
      value:'',
      options:[],
      company:'',
      username:'',
      phone:'',
      checked:true,
      loading:false,
      dataList: [],
      tableLabel: [
        {label: this.$t('table.index'), type: 'index'},
        {label: this.$t('table.customerName'), prop: 'nickname'},
        {label: this.$t('table.count'), prop: 'username'},
        {label: this.$t('table.phone'), prop: 'phoneNumber'},
        {label: this.$t('table.contacts'), prop: 'personToContact'},
        {label: this.$t('table.equNo'),prop: 'devices',
          // type: 'clickEvent',
          // tableClick: (val) => {
          //   this.showDialog('a', val)
          // }
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
          nickname:'',
          username:'',
          password:'',
          confirmPaw:'',
          personToContact:'',
          phoneNumber:'',
          email:'',
          remark:'',
          userId:'',
          parentName:'',
          parentId:''
      },
      tempParentId:null,
      tempParentName:null,
      rules:{
        parentName: [
          { required: true, message: '请选择上级用户', trigger: 'blur' },
        ],
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
      outUserId:'',
      inUserId:'',
      height:document.body.offsetHeight - 102,
      renderContent:function (h,{node,data,store}) {
            let addElement = arguments[0];
            return addElement('span',[
                addElement('i',{class:"el-icon-s-custom row_item_bottom_left_userIcon"}),
                addElement('span',"    "),
                addElement('span',arguments[1].node.label)
            ]);
        },
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
        that.height = document.body.offsetHeight - 102
      })()
    }
    this.type = JSON.parse(sessionStorage['user']).userType
    this.getlist()
    this.getBusiness()
  },
  methods: {
    getlist(type,parentId){ // 获取客户列表
        this.loading = true
        let data = null
        if(type==1){
          this.page.index = 1
          data = {
            searchType :this.selectType1,
            searchContent:this.input3,
            containsChildren :this.checked,
            pageSize: this.page.size,
            page: 0,
          }
        }else if(type==2){
          // this.page.index = 1
          data = {
            parentId :parentId,
            containsChildren :this.checked,
            pageSize: this.page.size,
            page: this.page.index - 1,
          }
        }else{
          data = {
            searchType :this.selectType1,
            searchContent:this.input3,
            containsChildren :this.checked,
            pageSize: this.page.size,
            page: this.page.index - 1,
          }
        }
        api.getBusinessList(data,this.type).then(res => {
          this.loading = false
          this.dataList = res.data.content
          this.page.total = res.data.totalElements
        }).catch(err => {
          this.loading = false
          this.dataList = []
          this.$message.error(err.msg)
        })
    },
    getBusiness(){ // 获取代理商
      // let data = {
      //   parentId: null
      // }
      // api.getBusiness(data,this.type).then(res => {
      //     let data = res.data
      //     for(let i = 0;i<data.length;i++){
      //       if(data[i].children == 0){
      //         data[i]['leaf'] = true
      //       }
      //     }
      //     this.businessData = this.setTreeData(data)
      //     this.getBusinessUserinfo(JSON.parse(sessionStorage['user']).userId)
      //     // console.log(this.businessData)
      //   }).catch(err => {
      //     this.businessData = []
      //     this.$message.error(err.msg)
      //   })
      var _this = this;
        this.businessData = []
        let data = null
        if(_this.type==1){
          data = {
            userId : JSON.parse(sessionStorage['user']).userId
          }
        }else{
          data = {}
        }
        api.getBusinessUserinfo(data,_this.type).then((res) =>{
            // console.log(res);
            if(res.success && res.data && Object.keys(res.data).length > 0){
                _this.outUserId = res.data.userId
                if(res.data.children == 0){
                  res.data['leaf'] = true
                }
                if(_this.type==1){
                  res.data['nickname'] = res.data.nickname + '(库存:0/总数:' + (res.data.deviceTotal) + ')'
                }else{
                  res.data['nickname'] = res.data.nickname + '(库存:' + res.data.devices + '/总数:' + (res.data.devices + res.data.sellDevices) + ')'
                }
                
                _this.businessData.push(res.data)
            }
            _this.getBusinessUserinfo(JSON.parse(sessionStorage['user']).userId)
        }).catch((err) => {
            _this.$message({message: err.msg, type:'error',offset:'200',duration:'1500'})
        })
    },
    // 获取当前登录用户的信息 b端用户
    evt_getBusinessUserinfo(){
        var _this = this;
        this.busData = []
        let data = null
        if(_this.type==1){
          data = {
            userId : JSON.parse(sessionStorage['user']).userId
          }
        }else{
          data = {}
        }
        api.getBusinessUserinfo(data,_this.type).then((res) =>{
            // console.log(res);
            if(res.success && res.data && Object.keys(res.data).length > 0){
                _this.inUserId = res.data.userId
                _this.busData.push(res.data)
            }
        }).catch((err) => {
            _this.$message({message: err.msg, type:'error',offset:'200',duration:'1500'})
        })
    },
    evt_loadTree2(node, resolve){ //查询客户下级
          // console.log(node)
          var _this = this
            if(node.level === 0){
                return resolve(_this.busData);
            }
            if(node.level != 0){
                var request_data = {}
                request_data['parentId'] = node.data.userId
                api.getBusiness(request_data,_this.type).then((res) => {
                    if(res.success){
                        if(res.data.length == 0){
                            resolve([])
                            return
                        }
                        var children_data = res.data
                        for(let i = 0;i<children_data.length;i++){
                          if(children_data[i].children == 0){
                            children_data[i]['leaf'] = true
                          }
                        }
                        node.data['children'] = children_data
                        resolve(children_data)
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
    handleCust(data){
      console.log(data)
      this.customerForm.parentName = data.username
      this.customerForm.parentId = data.userId
    },
    searchCustomer(){ // 搜索客户或账号
      let data = {
        searchType : this.selectType,
        searchContent:this.searchType
      }
      if(this.searchType.trim() == '') {
        this.getBusiness()
        return
      }
     api.searchBusiness(data,this.type).then(res => {
        if(res.success){
          this.businessData = this.setTreeData(res.data)
          this.page.index = 1
          this.getlist(2,res.data[0].parentId)
          this.getBusinessUserinfo(res.data[0].userId)
        }else{
          this.businessData = []
          this.$message.error(res.msg)
        }
        
      }).catch(err => {
        this.businessData = []
        this.$message.error(err.msg)
      })
    },
    searchCustomer2(){
      let data = {
        searchType : this.selectType2,
        searchContent:this.selParentId
      }
      if(this.selParentId.trim() == '') {
        return
      }
     api.searchBusiness(data,this.type).then(res => {
        if(res.success){
          this.busData = this.setTreeData(res.data)
          // this.getlist(2,res.data[0].parentId)
          // this.getBusinessUserinfo(res.data[0].userId)
        }else{
          this.busData = []
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.busData = []
        this.$message.error(err.msg)
      })
    },
    searchInfo(userId){
      let data = {
        userId: userId
      }
 
      api.getBusinessUserinfo(data,this.type).then(res => {
          let data = res.data
          this.customerForm.parentName = data.parentInfo.username
          this.customerForm.parentId = data.parentInfo.userId
        }).catch(err => {

          this.$message.error(err.msg)
        })
    },
    getBusinessUserinfo(userId){ // 获取客户信息
      let data = {
        userId: userId
      }
 
      api.getBusinessUserinfo(data,this.type).then(res => {
          let data = res.data
          this.company = data.nickname
          this.username = data.username
          this.phone = data.phoneNumber
 
        }).catch(err => {

          this.$message.error(err.msg)
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
    evt_loadTree(node, resolve){ //查询客户下级
      console.log(node)
      var _this = this
        if(node.level === 0){
            return resolve(_this.businessData);
        }
        if(node.level != 0){
            var request_data = {}
            request_data['parentId'] = node.data.userId
            api.getBusiness(request_data,_this.type).then((res) => {
                if(res.success){
                    if(res.data.length == 0){
                        resolve([])
                        return
                    }
                    var children_data = res.data
                    for(let i = 0;i<children_data.length;i++){
                      children_data[i]['nickname'] = children_data[i].nickname + '(' + children_data[i].devices +'/'+ (children_data[i].devices + children_data[i].sellDevices) +')'
                          if(children_data[i].children == 0){
                            children_data[i]['leaf'] = true
                          }
                        }
                    node.data['children'] = children_data
                    resolve(children_data)
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
    handleNodeClick(data) { // 选择用户节点
        console.log(data)
        this.tempParentName = data.username
        this.tempParentId = data.userId
        this.page.index = 1
        this.getlist(2,data.userId)
        if(data.username == 'admin'){
          this.getBusinessUserinfo(JSON.parse(sessionStorage['user']).userId)
        }else{
          this.getBusinessUserinfo(data.userId)
        }
        
    },
    changeindexNew(){
      if(this.tempParentId){
        this.getlist(2,this.tempParentId)
      }else{
        this.getlist()
      }
    },
    addCustomer(){ // 添加客户
        if(this.$refs['customerForm']){
          this.$refs['customerForm'].resetFields()
        }
        this.customerForm = {
            parentId:'',
            parentName:'',
            userId:'',
            nickname:'',
            username:'',
            password:'',
            confirmPaw:'',
            personToContact:'',
            phoneNumber:'',
            email:'',
            remark:''
        }
        if(this.tempParentId && this.tempParentName){
          this.customerForm.parentId = this.tempParentId
          this.customerForm.parentName = this.tempParentName
        }
        this.evt_getBusinessUserinfo()
        this.dialogCustomer = true 
        this.isEdit = false

    },
    confrimCustomer(){ // 确认添加/修改客户
      if (this.customerForm.password !== this.customerForm.confirmPaw) {
        this.$message({
          message: '两次输入的密码不一致',
          type: "warning"
        })
        return
      }
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
              nickname:this.customerForm.nickname,
              personToContact:this.customerForm.personToContact,
              phoneNumber:this.customerForm.phoneNumber,
              email:this.customerForm.email,
              remark:this.customerForm.remark
            }
            api.editBusiness(data,this.type).then(res => {
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
            personToContact:data.personToContact,
            phoneNumber:data.phoneNumber,
            email:data.email,
            remark:data.remark
          }
          
          this.evt_getBusinessUserinfo()
          this.searchInfo(data.userId)
          console.log(this.customerForm)
          this.dialogCustomer = true 
          this.isEdit = true
          break
        case '2' : //删除客户 
          const confirmText = ['用户被删除后，对应的数据将丢弃，且无法恢复。确认要继续删除该用户吗？','提示：请先将该用户下的所有设备“销售“转移给别的用户，才允许删除用户。'] 
          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          this.$confirm(h('div', null, newDatas), '警告', {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.cancel'),
            type: 'warning'
          }).then(() => {
            let id = {
              userId:data.userId
            }
            api.deleBusiness(id,this.type).then(res => {
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
          api.resetBusiness(data,this.type).then(res => {
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
    }
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

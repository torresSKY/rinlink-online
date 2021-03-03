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
                    <el-tree :data="roleForm.authoritites" ref="tree"
                      node-key="authorityIdentifier" show-checkbox  :props="defaultProps" @check="checkChange"  ></el-tree>
                </el-form-item>
                <el-form-item :label="$t('table.note')" prop="remark">
                    <el-input v-model="roleForm.remark" type="textarea" :rows="2"></el-input>
                </el-form-item>   
            </el-form>    
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogRole = false">{{$t('button.cancel')}}</el-button>
                <el-button type="primary" @click="confrimRole">{{$t('button.determine')}}</el-button>
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
                rules:{
                    roleName: [
                      { required: true, message: this.$t('table.roleName'), trigger: 'blur' },
                    ],
                    authoritites: [
                      { type: 'array', required: true, message: this.$t('view.permission'), trigger: 'change' }
                    ]
                },
                roleForm:{
                    roleId:'',
                    roleName:'',
                    authoritites:[],
                    remark:''
                },
                defaultProps: {
                   children: 'children',
                   label: 'authorityName'
                },
                checkedAuthor:[]
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
                  let data = res.data
   
                // this.$set(this.roleForm, 'authoritites', this.setTreeData(data))
                  this.roleForm.authoritites = this.setTreeData(data)
                    // console.log(this.roleForm.authoritites)
                }).catch(err => {
                  this.roleForm.authoritites = []
                  this.$message.error(err.errMsg)
                })
            },
            setTreeData(arr){ // 遍历权限
                // 删除所有的children,以防止多次调用
                arr.forEach(function(item) {
                    delete item.children;
                });
                // debugger
                let map = {}; //构建map
                arr.forEach(i => {
                    map[i.authorityIdentifier] = i; //构建以id为键 当前数据为值
                });
                let treeData = [];
                arr.forEach(child => {
                    const mapItem = map[child.parentAuthorityIdentifier]; //判断当前数据的parentId是否存在map中
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
            getCheckedAuthority(){
                api.getCheckedAuthority().then(res => {
                  this.checkedAuthor = res.data
                  if(this.checkedAuthor.length>0){
                      let arr =[]
                      this.checkedAuthor.forEach(item => {
                          arr.push(item.authorityIdentifier)
                      }) 
                      if(arr.length>0){
                          this.$refs.tree.setCheckedKeys(arr)
                      }   
                  }
                }).catch(err => {
                  this.checkedAuthor = []
                  this.$message.error(err.errMsg)
                })
            },
            addrole(){ // 添加角色
                if(this.$refs['roleForm']){
                  this.$refs['roleForm'].resetFields()
                }
                this.getAuthority()
                this.roleForm = {
                    roleId:'',
                    roleName:'',
                    authoritites:[],
                    remark:''
                }
                this.isEdit = false
                this.dialogRole = true 
            },
            handleClick(data, checked, node) { // 选择用户节点
                console.log(data, checked, node)
            },
            checkChange(obj, state){ // 选中的节点
                console.log(obj, state)
                this.checkedAuthor = []
                if(state.checkedNodes.length>0){
                    state.checkedNodes.forEach(item => {
                        this.checkedAuthor.push(item)
                    })    
                }
                if(state.halfCheckedNodes.length>0){
                    state.halfCheckedNodes.forEach(item => {
                        this.checkedAuthor.push(item)
                    })    
                }
            },
            confrimRole(){ // 添加角色
              if(this.checkedAuthor.length<0){
                  this.$message.warning(this.$t('message.checkmsg'))
                  return false
              }
              this.$refs['roleForm'].validate((valid) => {
                if (valid) {
                  // debugger
                  console.log(this.roleForm)
                  var data = null
                  if(!this.isEdit){
                    data = {
                      roleName:this.roleForm.roleName,
                      authoritites:this.checkedAuthor,
                      remark:this.roleForm.remark
                    }
                    api.addRoles(data).then(res => {
                      if(res.msg=='OK'){
                        this.$message.success(this.$t('message.addsuc'))
                        this.$refs['roleForm'].resetFields()
                        this.dialogRole = false
                        this.getlist()
                      }else {
                        this.$message.error(res.msg)
                      }
                    }).catch(err => {
                      this.$message.error(err.errMsg)
                    })
                  } else {
                    data = {
                      roleName:this.roleForm.roleName,
                      authoritites:this.checkedAuthor,
                      remark:this.roleForm.remark,
                      roleId:this.roleForm.roleId,
                    }
                    api.editRoles(data).then(res => {
                      if(res.msg=='OK'){
                        this.$message.success(this.$t('message.changesuc'))
                        this.$refs['roleForm'].resetFields()
                        this.dialogRole = false
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
                    case '1': // 修改角色
                        // debugger
                      this.roleForm = {
                        roleName:data.roleName,
                        authoritites:[],
                        remark:data.roleDescription,
                        roleId:data.roleId
                      }
                      this.getAuthority()
                      this.getCheckedAuthority()
                      this.isEdit = true
                      this.dialogRole = true
                      break
                    case '2' : //删除角色
                      this.$confirm(this.$t('message.equdele'), this.$t('message.newtitle'), {
                        confirmButtonText: this.$t('button.determine'),
                        cancelButtonText: this.$t('button.cancel'),
                        type: 'warning'
                      }).then(() => {
                        let id = {
                          roleId:data.roleId
                        }
                        api.deleRoles(id).then(res => {
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
                }
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
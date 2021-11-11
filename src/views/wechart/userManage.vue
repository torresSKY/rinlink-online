<template>
    <div >
        <el-card >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
               <el-tab-pane :label="$t('view.customerManage')" name="first">
                   <customer-manage ref="customerManage"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
               <!-- <el-tab-pane :label="$t('view.usersManage')" name="second">
                   <role-manage ref="customerManage"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane> -->
               <!-- <el-tab-pane :label="$t('view.adminManage')" name="third">
                   <admin-manage ref="customerManage"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane> -->
               <el-tab-pane label="注册用户管理" name="second" v-if="type==1">
                   <reg-manage ref="regManage"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import axios from 'axios'
    import CustomerManage from './CustomerManage.vue'
    import roleManage from './roleManage.vue'
    import adminManage from './adminManage.vue'
    import regManage from './regManage.vue'
    export default{
        name:'userManage',
        components:{ CustomerManage,roleManage,adminManage,regManage },
        data(){
            return {
                activeName: 'first',
                height: 900,
                type:null
            }
        },
        mounted(){
           var that = this
           this.type = JSON.parse(sessionStorage['user']).userType
           window.onresize = function () {
              that.height = 80 + 'vh'
           }
        },
        methods:{
           handleClick(tab, event) {
              console.log(tab, event)
              if(tab.label=='注册用户管理'){
                  this.$refs.regManage.getlist(1)
              }
           }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>
.customer-content{
    height: 80vh;
}
</style>
<template>
    <div >
        <el-card >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
               <el-tab-pane :label="$t('view.customerManage')" name="first">
                   <customer-manage ref="customerManage"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
               <el-tab-pane :label="$t('view.usersManage')" name="second">
                   <role-manage ref="customerManage"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
               <el-tab-pane :label="$t('view.adminManage')" name="third">
                   <admin-manage ref="customerManage"  :style="{height:80 + 'vh'}"/>
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
    export default{
        name:'userManage',
        components:{ CustomerManage,roleManage,adminManage },
        data(){
            return {
                activeName: 'first',
                height: 1000,
            }
        },
        mounted(){
           var that = this
           window.onresize = function () {
              that.height = 80 + 'vh'
           }
        },
        methods:{
           handleClick(tab, event) {
              console.log(tab, event)
           }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>
.customer-content{
    height: 80vh;
}
</style>
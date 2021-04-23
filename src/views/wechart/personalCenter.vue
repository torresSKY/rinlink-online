<template>
    <div >
       <el-row >
           <el-col :span='5'>
               <el-menu
                 style="height:90vh"
                 default-active="basicInfo"
                 :default-openeds="['1','basicInfo','accountSecurity']"
                 @select='selPath'
                 class="el-menu-vertical-demo">
                 <el-submenu index="1">
                   <template slot="title">
                     <i class="el-icon-location"></i>
                     <span>{{$t('view.personalSettings')}}</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="basicInfo">{{$t('view.basicInfo')}}</el-menu-item>
                     <el-menu-item index="accountSecurity">{{$t('view.accountSecurity')}}</el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
               </el-menu>
           </el-col>
           <el-col :span='19'>
               <basic-info v-if="pathName=='basicInfo'" ref="basicInfo" />
               <account-security v-else ref="accountSecurity" />
           </el-col>
       </el-row>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    import basicInfo from './basicInfo.vue'
    import accountSecurity from './accountSecurity.vue'
    export default{
        name:'personalCenter',
        components:{ BaseTable , basicInfo , accountSecurity },
        mixins:[mixin],
        data(){
            return {
                pathName:'basicInfo',
            }
        },
        mounted(){
           
        },
        methods:{
            selPath(key, keyPath){ // 选择路径
            //   console.log(key, keyPath)
              this.pathName = key
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
<template>
    <div >
       <el-row >
           <el-col :span='5'>
               <el-menu
                 style="height:90vh"
                 default-active="1-1"
                 @select='selPath'
                 class="el-menu-vertical-demo">
                 <el-submenu index="1">
                   <template slot="title">
                     <i class="el-icon-location"></i>
                     <span>{{$t('view.alaNotice')}}</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="1-1">{{$t('route.Alarm')}}</el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
                 <el-submenu index="2">
                   <template slot="title">
                     <i class="el-icon-location"></i>
                     <span>{{$t('view.expNotice')}}</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="platform">{{$t('view.pse')}}</el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
                 <el-submenu index="3">
                   <template slot="title">
                     <i class="el-icon-location"></i>
                     <span>{{$t('view.msgNotice')}}</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="1-3">{{$t('view.sysNotice')}}</el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
               </el-menu>
           </el-col>
           <el-col :span='19'>
               <exp-notice ref="expNotice" />
           </el-col>
       </el-row>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    import expNotice from './expNotice.vue'
    export default{
        name:'notice',
        components:{ BaseTable , expNotice },
        mixins:[mixin],
        data(){
            return {
                pathName:'',
            }
        },
        mounted(){
           
        },
        methods:{
            selPath(key, keyPath){ // 选择路径
              console.log(key, keyPath)
              this.pathName = key
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
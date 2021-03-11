<template>
    <div >
       <el-row >
           <el-col :span='5'>
               <el-menu
                 style="height:90vh"
                 default-active="alarm"
                 :default-openeds="['1','alarm','2','platform','3','system']"
                 @select='selPath'
                 class="el-menu-vertical-demo">
                 <el-submenu index="1">
                   <template slot="title">
                     <i class="el-icon-location"></i>
                     <span>{{$t('view.alaNotice')}}</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="alarm">{{$t('route.Alarm')}}</el-menu-item>
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
                     <el-menu-item index="system">{{$t('view.sysNotice')}}</el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
               </el-menu>
           </el-col>
           <el-col :span='19'>
               <exp-notice v-if="pathName=='platform'" ref="expNotice" />
               <sys-notice v-else-if="pathName=='system'" ref="sysNotice" />
               <alarm-notice v-else ref="sysNotice" />
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
    import sysNotice from './sysNotice.vue'
    import alarmNotice from './alarmNotice.vue'
    export default{
        name:'notice',
        components:{ BaseTable , expNotice,sysNotice,alarmNotice },
        mixins:[mixin],
        data(){
            return {
                pathName:'alarm',
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
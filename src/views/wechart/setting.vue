<template>
    <div >
       <el-row >
           <el-col :span='5'>
               <el-menu
                 style="height:90vh"
                 default-active="basicInfo"
                 :default-openeds="['1','model','site','3']"
                 @select='selPath'
                 class="el-menu-vertical-demo">
                 <el-submenu index="1">
                   <template slot="title">
                     <i class="el-icon-location"></i>
                     <span>{{$t('route.setting')}}</span>
                   </template>
                   <el-menu-item-group>
                     <el-menu-item index="model">{{$t('table.model')}}</el-menu-item>
                   </el-menu-item-group>
                 </el-submenu>
                 <el-menu-item index="site">
                   <template slot="title">
                     <i class="el-icon-location"></i>
                     <span>{{$t('view.siteSettings')}}</span>
                   </template>
                 </el-menu-item>
                 <el-menu-item index="3">
                   <template slot="title">
                     <i class="el-icon-location"></i>
                     <span>{{$t('table.operLog')}}</span>
                   </template>
                 </el-menu-item>
               </el-menu>
           </el-col>
           <el-col :span='19'>
               <model-manage v-if="pathName=='model'" ref="model" />
               <site-settings v-else-if="pathName=='site'" ref="siteSettings" />
               <oper-log v-else ref="operLog" />
           </el-col>
       </el-row>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    import modelManage from './modelManage.vue'
    import operLog from './operLog.vue'
    import siteSettings from './siteSettings.vue'
    export default{
        name:'setting',
        components:{ BaseTable , modelManage , operLog , siteSettings},
        mixins:[mixin],
        data(){
            return {
                pathName:'model',
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
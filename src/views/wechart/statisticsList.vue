<template>
    <div >
        <el-card >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
               <el-tab-pane :label="$t('view.alaoverview')" name="first">
                   <alarm-overview ref="alarmOverview"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
               <el-tab-pane :label="$t('view.aladetail')" name="second">
                   <alarm-detail ref="alarmDetail"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
               <el-tab-pane :label="$t('view.punchReport')" name="third">
                   <punch-report ref="punchReport"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import axios from 'axios'
    import alarmOverview from './alarmOverview.vue'
    import alarmDetail from './alarmDetail.vue'
    import punchReport from './punchReport.vue'
    export default{
        name:'statisticsList',
        components:{ alarmOverview,alarmDetail,punchReport },
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
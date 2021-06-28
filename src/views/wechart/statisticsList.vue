<template>
    <div >
        <el-card >
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
               <el-tab-pane :label="$t('view.alaoverview')" name="first">
                   <alarm-overview ref="alarmOverview"  @itemclick="itemclick" :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
               <el-tab-pane :label="$t('view.aladetail')" name="second">
                   <alarm-detail ref="alarmDetail" :itemData="itemData"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane>
               <!-- <el-tab-pane :label="$t('view.punchReport')" name="third">
                   <punch-report ref="punchReport"  :style="{height:80 + 'vh'}"/>
               </el-tab-pane> -->
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
                itemData:null
            }
        },
        mounted(){
            // debugger
            console.log(this.activeName,1111)
           var that = this
           window.onresize = function () {
              that.height = 80 + 'vh'
           }
           if(this.$route.params.data){
               this.activeName = 'second'
           }else{
               this.activeName = 'first'
           }
        },
        methods:{
           handleClick(tab, event) {
              console.log(tab, event)
              if(tab.label == '报警详情'){
                  this.$refs.alarmDetail.dataList = []
                  this.$refs.alarmDetail.getlist()
                  
              }
           },
           itemclick(data){
               console.log(data)
               this.itemData = null
               if(data.statistic[0].count>0){
                   this.activeName = 'second'
                   this.itemData = Object.assign({},data)
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
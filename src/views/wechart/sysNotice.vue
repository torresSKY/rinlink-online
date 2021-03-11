<template>
    <div >
        <el-row class="cust-title">
            <span>{{$t('view.sysNotice')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-row :gutter="22" style="margin-top:10px" >
                <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh;padding:0 10px" ></BaseTable>
            </el-row>
            <el-pagination
                @current-change='changeindex'
                layout="prev, pager, next"
                :current-page.sync="page.index"
                :page-size="page.size"
                :total="page.total"
                background
                style="text-align:center">
            </el-pagination>
        </el-card> 
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import axios from 'axios'
    import BaseTable from '@/components/table'
    export default{
        name:'sysNotice',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                height:1000,
                dataList:[],
                tableLabel: [
                  {label: this.$t('view.sysMessage'), prop: 'title'},
                  {label: this.$t('table.noticeTime'), prop: 'createTime'}
                ],
                
            }
        },
        mounted(){
           this.height = document.body.offsetHeight-152
           this.getlist()
        },
        methods:{
            getlist(){ // 获取设备型号列表
                this.loading = true
                api.systemMessages({params: {
                    pageSize: this.page.size,
                    page: this.page.index - 1
                }}).then(res => {
                  this.loading = false
                  if(res.msg=='OK'){
                    this.dataList = res.data.content
                    this.page.total = res.data.pageTotal
                  }else{
                    this.dataList = []
                    this.$message.error(res.errMsg)
                  }
                  
                }).catch(err => {
                  this.loading = false
                  this.dataList = []
                  this.$message.error(err.errMsg)
                })
            },
            
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>
.cust-title{
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #333333;
  line-height: 40px;
  border: 1px solid #dbe6fa;
  background: #EDF3FF;
  padding-left: 20px;
}
</style>
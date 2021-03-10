<template>
    <div >
        <el-row class="cust-title">
            <span>{{$t('view.pse')}}</span>
        </el-row>
        <el-card  :style="{height:height + 'px'}" >
            <el-row>
                <el-col :span='5'>
                    <el-button class="butresh" >{{$t('button.allHandle')}}</el-button>
                </el-col>    
            </el-row>
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
        name:'expNotice',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                height:1000,
                dataList:[],
                tableLabel: [
                  {label: this.$t('table.noticeContent'), prop: 'name'},
                  {label: this.$t('table.count'), prop: 'iotServiceName'},
                  {label: this.$t('table.noticeTime'), prop: 'createTime'},
                  {label: this.$t('table.operation'),
                    type: 'clickSelect',
                    selectOperation: (index, row) => {
                      this.showDialog(index, row)
                    },
                    selectText: [
                      {command: '1', text: this.$t('table.chuli'), index: 1},
                    ]  
                  }
                ],
            }
        },
        mounted(){
           this.height = document.body.offsetHeight-152
        },
        methods:{
            
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
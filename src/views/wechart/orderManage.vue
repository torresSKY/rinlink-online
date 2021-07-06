<template>
    <div >
        <el-row class="cust-title">
            <span>订单管理</span>
        </el-row>
        <el-row  :style="{height:height + 'px',overflow:'auto'}" style="margin:20px 10px 0 10px">
            <BaseTable  ref="tableBase" v-loading="loading"  :dataList="dataList" :tableLabel="tableLabel"   ></BaseTable>
        </el-row> 
        <el-pagination
            @current-change='changeindex'
            layout="total,prev, pager, next"
            :current-page.sync="page.index"
            :page-size="page.size"
            :total="page.total"
            background
            style="text-align:center;margin-top:10px">
        </el-pagination>
        <el-dialog
          title="订单详情"
          :visible.sync="dialogDetail"
          width="40%">
          <el-row  :style="{height:'40vh',overflow:'auto'}" style="margin:10px 10px 0 10px">
            <BaseTable  ref="tableDetail"   :dataList="detailList" :tableLabel="detailLabel"   ></BaseTable>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogDetail = false">取 消</el-button>
            <el-button type="primary" @click="dialogDetail = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
    import BaseTable from '@/components/table'
    export default{
        name:'orderManage',
        components:{ BaseTable },
        mixins:[mixin],
        data(){
            return {
                loading:false,
                height:900,
                userId:null,
                type:null,
                dataList:[],
                dialogDetail:false,
                detailList:[],
                tableLabel: [
                    {label: this.$t('table.index'), type: 'index'},
                    {label: '订单号', prop: 'payOrderId'},
                    {label: '充值时间', prop: 'payTime', type: 'Timestamp'},
                    {label: '订单金额', prop: 'jine',type: 'render',
                    formatter: (params) => {
                      if(params.amount){
                          params['jine'] = params.amount / 100
                      }else{
                          params['jine'] = '--'
                      }
                      return params
                    }},
                    {label: '充值状态', prop: 'state',type: 'render',
                    formatter: (params) => {
                      params['state'] = params.orderState === 0 ? '订单生成'  : params.orderState == 1 ? '支付中'
                      : params.orderState == 2 ? '支付成功': params.orderState == 3 ? '支付失败'
                      : params.orderState == 4 ? '已撤销': params.orderState == 5 ? '已退款'
                      : params.orderState == 6 ? '订单关闭' : '--'
                      // console.log(params,123)
                      return params
                    }},
                    {label: this.$t('table.operation'),
                      type:'clickEvent',
                      name:'详情',
                      tableClick: (val) => {
                      this.showDialog('a', val)
                    }}
                ],
                detailLabel:[
                    {label: this.$t('table.index'), type: 'index'},
                    {label: '设备IMEI', prop: 'devices.deviceNumber'},
                ]
            }
        },
        mounted(){
           this.type = JSON.parse(sessionStorage['user']).userType
           this.height = document.body.offsetHeight-192
        //    if(this.type==1){
               this.userId = JSON.parse(sessionStorage['user']).userId
        //    }
           this.getlist()
        },
        methods:{
            getlist(){ // 获取订单信息
                let data = {
                    pageSize: this.page.size,
                    page: this.page.index - 1,
                }
                this.loading = true
                api.paging_query_device_order(data,this.type).then(res => {
                  this.loading = false
                  // debugger
                  if(res.success){
                    this.dataList = res.data.content
                    this.page.total = res.data.totalElements
                    // console.log(this.dataList)
                  }else{
                    this.dataList = []
                    this.$message.error(res.msg)
                  }
                  
                }).catch(err => {
                  this.loading = false
                  this.dataList = []
                  this.$message.error(err.msg)
                })
            },
            showDialog(index, data){ // 操作
                switch (index) {
                    case 'a': //详情
                    this.dialogDetail = true
                    break
                }
            }
            
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
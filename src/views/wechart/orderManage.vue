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
          width="50%">
          <el-row  :style="{height:'40vh',overflow:'auto'}" style="margin:10px 10px 0 10px">
            <BaseTable  ref="tableDetail"   :dataList="detailList" :tableLabel="detailLabel"   ></BaseTable>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogDetail = false">关 闭</el-button>
          </span>
        </el-dialog>
        <el-dialog
          :title="payment == 'ALI_QR'? '支付宝扫码支付': '微信扫码支付'"
          :visible.sync="dialogCode"
          :show-close='false'
          width="26%">
          <div class="qrcode" id='qrcode' ref="qrCodeUrl" style="width:200px;text-align:center;margin:0 auto"></div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cannel">关 闭</el-button>
            <!-- <el-button type="primary" @click="confirmPay" :loading="loading">已付款</el-button> -->
          </span>
        </el-dialog>
    </div>
</template>
<script>
    import QRCode from 'qrcodejs2'
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
                      type:'clickPay',
                      selectOperation: (index, row) => {
                      // console.log(index, row)
                      this.showDialog(index, row)
                    },}
                ],
                detailLabel:[
                    {label: this.$t('table.index'), type: 'index'},
                    {label: '设备IMEI', prop: 'deviceNumber'},
                    {label: '所属客户', prop: 'owner'},
                    {label: '设备充值前到期时间', prop: 'beforeTime', type: 'Timestamp'},
                    {label: '设备充值后到期时间', prop: 'afterTime', type: 'Timestamp'},
                    {label: '充值金额', prop: 'jine'},
                    {label: '充值状态', prop: 'state'},
                ],
                dialogCode:false,
                payment:null,
                qrCodeUrl:null
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
            getlist(msg){ // 获取订单信息
                if(msg==1){
                  this.page.index = 1
                }
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
                    case 1: //详情
                    this.detailList = data.devices
                    for(let i = 0;i<this.detailList.length;i++){
                        this.detailList[i]['jine'] = data.unitPrice / 100
                        this.detailList[i]['state'] = data.state
                    }
                    this.dialogDetail = true
                    break
                    case 2: //取消订单
                    this.$confirm('确定要取消订单吗?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      let data2 = {
                        payOrderId : data.payOrderId
                      }
                      api.abandon_device_order(data2,this.type).then(res => {
                        // debugger
                        if(res.success){
                         this.$message.success('取消订单成功')
                         this.getlist(1)
                        }
                      }).catch(err => {
                        this.$message.error(err.msg)
                      })

                    }).catch(() => {
                      this.$message({
                        type: 'info',
                        message: '取消操作'
                      });          
                    })
                    break
                    case 3: //去支付
                    if(data.wayCode=='ALI_APP'||data.wayCode=='WX_APP'){
                      return this.$message.warning('此订单为APP创建的订单，需在APP完成支付')
                    }else if(data.wayCode=='WX_LITE'){
                      return this.$message.warning('此订单为小程序创建的订单，需在小程序完成支付')
                    }
                    this.payment = data.wayCode
                    this.qrCodeUrl = data.payData
                    this.dialogCode = true
                    this.$nextTick(() => {
                      this.creatQrCode()
                    })
                    break
                }
            },
            creatQrCode() {
                let qrcode = new QRCode(this.$refs.qrCodeUrl, {
                    text: this.qrCodeUrl, // 需要转换为二维码的内容
                    width: 200,
                    height: 200,
                    colorDark: '#000000',
                    colorLight: '#ffffff'
                })
            },
            get_device_order(id){ // 获取详情
              let data = {
                payOrderId : id
              }
              api.get_device_order(data,this.type).then(res => {
                // debugger
                if(res.success){
                 this.detailList = res.data.content
                }else{
                  this.$message.error(err.msg)
                }
              }).catch(err => {
                this.detailList = []
                this.$message.error(err.msg)
              })
            },
            cannel(){
              document.getElementById("qrcode").innerHTML = ""
              this.dialogCode = false
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
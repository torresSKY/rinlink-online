<template>
    <div >
        <el-dialog
          title="平台服务费充值"
          :visible.sync="dialogVisible"
          width="50%"
          >
        <el-row >
            <el-col :span='4' style="text-align:center">
              <div style="color:#666666;font-weight:400;display:inline-block">选择充值年限：</div>
            </el-col>
            <el-col :span='20'>
              <div  :class="flag == 1 ? 'selColor':'noSelColor'" style="margin-right:20px" @click="chooseCol(1)">10元/年</div>
              <div :class="flag == 2 ? 'selColor':'noSelColor'" style="margin-right:20px" @click="chooseCol(2)">20元/2年</div>
              <div :class="flag == 3 ? 'selColor':'noSelColor'" @click="chooseCol(3)">30元/3年</div>
            </el-col>
        </el-row>
        <el-row style="margin-top:20px;">
            <el-col :span='4' style="text-align:center">
                <span>平台充值设备：</span>
            </el-col>
            <el-col :span='20' style="border:1px solid #CCCCCC">
                <el-row style="margin:10px 10px 0 10px">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4}"
                    placeholder="请输入设备设备号（多个回车换行）"
                    v-model="searchImei" @keyup.native="inputChange" @input="changeIMEI" >
                  </el-input>
                </el-row>
                <el-row style="line-height:40px">
                  <el-col :offset='1' :span='18'>
                    <span>设备号计数：{{tempNum}}</span>
                  </el-col>
                  <el-col :span='4'>
                    <el-button class="butadd" size="mini" @click="searchEqu">{{$t('button.add')}}</el-button>
                  </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row style="margin:20px 0;">
            <el-scrollbar style="height:30vh;" ref="scrollbar">
              <BaseTable  :dataList="list" :tableLabel="tableLabel"   ></BaseTable>
            </el-scrollbar>
        </el-row>
          <el-row  style="width:80%,height:100px;text-align:right">
              <div style="display:inline-block">
                <span style="color:#333333;">总费用：</span>
                <span style="color:#FF7F00">￥{{tempTotal}}</span>
              </div>
              <div style="display:inline-block;margin:0 20px">
                <el-popover
                  placement="bottom"
                  width="370"
                  trigger="click"
                  :content="content">
                  <el-button type='text' slot="reference">明细</el-button>
                </el-popover>
              </div>
              <div style="display:inline-block;width:180px;margin-right:20px">
                <el-select v-model="payment" placeholder="请选择" >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div style="display:inline-block">
                <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
                <el-button type="warning" @click="recharge" :loading="loadingRec">充 值</el-button>
              </div>
          </el-row >
        </el-dialog>
        <el-dialog
          :title="payment == 'ALI_QR'? '支付宝扫码支付': '微信扫码支付'"
          :visible.sync="dialogCode"
          :show-close='false'
          width="26%">
          <div class="qrcode" id='qrcode' ref="qrCodeUrl" style="width:200px;text-align:center;margin:0 auto"></div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cannel">返 回</el-button>
            <el-button type="primary" @click="confirmPay" :loading="loading">已付款</el-button>
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
        name:'dialogRecharge',
        props:{
            list:{
                type:Array,
                default() {
                  return []
                }
            }
        },
        components:{ BaseTable  },
        mixins:[mixin],
        data(){
            return {
               dialogVisible:false,
               searchImei:null,
               tempNum:0,
               tableLabel:[
                  {label: this.$t('table.imei'), prop: 'deviceNumber'},
                  {label: this.$t('table.customers'), prop: 'username'},
                  {label: '设备充值前到期时间', prop: 'serviceExpireTime', type: 'Timestamp'},
                  {label: '设备充值后到期时间', prop: 'newExpireTime', type: 'Timestamp'},
                  {label: this.$t('table.operation'),
                    type:'clickEvent',
                    name:'删除',
                    tableClick: (val) => {
                    this.showDialog('a', val)
                  }
                 }
                ],
                payment:'ALI_QR',
                options:[
                    { value: 'ALI_QR', label: '支付宝支付'},{ value: 'WX_NATIVE', label: '微信支付'}
                ],
                flag:1,
                dialogCode:false,
                type:JSON.parse(sessionStorage['user']).userType,
                qrCodeUrl:null,
                payOrderId:null,
                loading:false,
                loadingRec:false
            }
        },
        watch: {

        },
        computed:{
            tempTotal: function () {
                return Number(this.list.length) * 10 * this.flag
            },
            content: function () {
                // return '充值年限'+this.flag+'年：'+this.list.length+'台 '+' 每台价格：￥10'
                return this.flag+'年x10元（每台价格）x'+this.list.length+'台(设备数量)='+Number(this.list.length) * 10 * this.flag+'元（总费用）'
            }
        },
        mounted(){
          //  this.type = JSON.parse(sessionStorage['user']).userType
        },
        methods:{
            chooseCol(type){ // 选择年限
              this.flag = type
              for(let i = 0;i<this.list.length;i++){
                // debugger
                if(this.list[i]['serviceExpireTime']==-1||!this.list[i]['serviceExpireTime']){
                  this.list[i]['newExpireTime'] = '--'
                }else{
                  let date=new Date(this.list[i]['serviceExpireTime'])
                  date.setFullYear(date.getFullYear()+this.flag)
                  // this.list[i]['newExpireTime'] = date.getTime()
                  this.$set(this.list[i],"newExpireTime", date.getTime())
                }
                
              }
              console.log(this.list)
            },
            inputChange(){
                this.searchImei = this.searchImei.replace(/[^\d|^\n\r]/g,'')
            },
            changeIMEI(val){
                if(val.trim()){
                  let temp = null
                  temp= val.split("\n")
                  temp = temp.filter(str => !!str)
                  setTimeout(() => {
                    this.tempNum = temp.length
                  },100)
                }else{
                  this.tempNum = 0
                }
            },
            searchEqu(){ //充值-搜索设备
              if(!this.searchImei){
                return this.$message.warning(this.$t('table.searchimei'))
              }
              let temp = null
              temp= this.searchImei.split("\n")
              temp = temp.filter(str => !!str)
              let data = null
              if(temp.length == 0){
                return this.$message.warning(this.$t('table.searchimei'))
              }else if(temp.length == 1){
                data = {
                  containsChildren: true,
                  deviceNumberKeyword : this.searchImei.replace("\n", "")
                }
              }else{
                data = {
                  containsChildren: true,
                  deviceNumberList : temp,
                  pageSize : temp.length
                }
              }
              api.getDevicesList(data,this.type).then(res => {
                if(res.success){
                  if(res.data.content.length<=0){
                    return this.$message.warning('输入的设备号没有查到数据')
                  }
                  let item = res.data.content
                  for(let i = 0;i<item.length;i++){
                    if(item[i].deviceModel){
                      item[i]['model'] = item[i].deviceModel.name
                    }else{
                      item[i]['model'] = ''
                    }
                    if(item[i].owner){
                      item[i]['username'] = item[i].owner.username
                    }else{
                      item[i]['username'] = ''
                    }
                    if(item[i]['serviceExpireTime']==-1||!item[i]['serviceExpireTime']){
                      item[i]['newExpireTime'] = '--'
                    }else{
                      let date=new Date(item[i]['serviceExpireTime'])
                      date.setFullYear(date.getFullYear()+this.flag)
                      item[i]['newExpireTime'] = date.getTime()
                    }
                  }
                  for(let a=0;a<this.list.length;a++){
                    for(let b = 0;b<item.length;b++){
                      if(this.list[a].id == item[b].id){
                        item.splice(b, 1)
                        b--
                      }
                    }
                  }
                  if(item.length>0){
                    this.list = this.list.concat(item)
                  }
                  this.equNum = this.list.length
                }else{
                  this.$message.error(res.msg)
                }  
              }).catch(err => {
                this.$message.error(err.msg)
              })
            },
            showDialog(index, data){ // 操作
                switch (index) {
                    case 'a': //充值-删除设备
                    // debugger
                    for(let i = 0;i<this.list.length;i++){
                      if(this.list[i].id==data.id){
                        this.list.splice(i,1)
                        i--
                      }
                    }
                    break
                }
            },
            cannel(){
              document.getElementById("qrcode").innerHTML = ""
              // this.$emit('closeRecharge', false)
              this.dialogCode = false
            },
            recharge(){ // 充值生成二维码
              this.qrCodeUrl = null 
              this.payOrderId = null
              
              if(this.list.length<=0){
                return this.$message.warning('请输入需充值的设备')
              }
              this.loadingRec = true
              let arr = []
              for(let i = 0;i<this.list.length;i++){
                arr.push(this.list[i].id)
              }
              let data = {
                paymentContentId : this.flag,
                deviceIds : arr,
                wayCode : this.payment
              }
              api.create_device_order(data,this.type).then(res => {
                // debugger
                
                if(res.success){
                  this.qrCodeUrl = res.data.payData
                  this.payOrderId = res.data.payOrderId
                  this.dialogCode = true
                  this.$nextTick(() => {
                    this.loadingRec = false
                    this.creatQrCode()
                  })
                }else{
                  this.loadingRec = false
                  this.$message.error(err.msg)
                }
              }).catch(err => {
                this.loadingRec = false
                this.$message.error(err.msg)
              })
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
            confirmPay(){ // 确认付款
              this.loading = true  
              var that = this
              setTimeout(function(){ that.get_device_order() },3000)
            },
            get_device_order(){
              let data = {
                payOrderId : this.payOrderId
              }
              api.get_device_order(data,this.type).then(res => {
                // debugger
                this.loading = false
                if(res.success){
                  let msg = null
                  let state = res.data.orderState
                  if(state==0){
                    msg = '订单生成'
                  }else if(state==1){
                    msg = '支付中'
                  }else if(state==2){
                    msg = '支付成功'
                  }else if(state==3){
                    msg = '支付失败'
                  }else if(state==4){
                    msg = '已撤销'
                  }else if(state==5){
                    msg = '已退款'
                  }else if(state==6){
                    msg = '订单关闭'
                  }
                  this.$message(msg)
                  document.getElementById("qrcode").innerHTML = ""
                  this.$emit('closeRecharge', false)
                  this.dialogCode = false
                  this.dialogVisible = false
                }else{
                  this.$message.error(err.msg)
                }
              }).catch(err => {
                this.loading = false
                this.$message.error(err.msg)
              })
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>
.selColor{
  width: 90px;
  height: 30px;
  background: #648EF8;
  border-radius: 3px;
  display: inline-block;
  color: #FFFFFF;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.noSelColor{
  width: 90px;
  height: 30px;
  background: #E0E8FE;
  border-radius: 3px;
  display: inline-block;
  color: #648EF8;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
</style>
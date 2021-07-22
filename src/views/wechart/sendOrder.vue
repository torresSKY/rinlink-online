<template>
    <div >
        <el-row>
            <!-- <el-col :span='8'> -->
                <el-col :span='4' style="line-height:40px">
                    <span>{{$t('table.zhitype')}}</span>
                </el-col>
                <el-col :span='16'>
                    <el-select v-model="deviceCmdTemplateId" :placeholder="$t('table.zhitype')" clearable @change="selType">
                      <el-option
                        v-for="item in cmdOptions"
                        :key="item.deviceCmdTemplateId"
                        :label="item.templateName"
                        :value="item.deviceCmdTemplateId">
                      </el-option>
                    </el-select>
                </el-col>
            <!-- </el-col> -->
            
        </el-row>
        <el-row style="margin-top:10px" v-if="schema">
            <el-col :span='4' style="line-height:40px">
                <span>{{$t('view.parmas')}}</span>
            </el-col>
            <el-col :span='16'>
                <VueForm
                    v-model="formData"
                    :schema="schema"
                    :formFooter ='formFooter'
                    @on-submit="handlerSubmit"
                    @on-cancel="handlerCancel"/>
            </el-col>
        </el-row>
        <el-row v-else style="margin-left:72%;margin-top:10px">
            <el-button type="primary" @click="confrim">{{$t('button.send')}}</el-button>
        </el-row>
        <div style="border-top:1px solid grey;margin:20px 0"></div>
        <el-row>
            <span>{{$t('view.selList')}}</span>
            <span v-if="num" style="color:red">({{num}})</span>&nbsp;&nbsp;
            <el-button type='text' @click="qingkong">清空</el-button>
        </el-row>
        <el-row  style="margin:10px 0;border:1px solid #CCCCCC">
          <el-row style="margin:10px">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 4}"
              placeholder="请输入设备号（多个回车换行）"
              v-model="searchImei" @keyup.native="inputChange" @input="changeIMEI"  @focus="enterIMEI">
            </el-input>
          </el-row>
          <el-row style="line-height:40px" v-show="isShow">
            <el-col :offset='1' :span='18'>
              <span>设备号计数：{{tempNum}}</span>
            </el-col>
            <el-col :span='4'>
              <el-button class="butadd" size="mini" @click="searchEqu">{{$t('button.add')}}</el-button>
            </el-col>
          </el-row>
        </el-row>
        <el-row style="margin:20px 0;" >
            <!-- <el-col :span='7'  style="border:1px solid grey;text-align:center;line-height:40px;margin-right:10px" v-for="item in list" :key="item.id">
                <span>{{item.deviceName}}</span>
                <span>({{item.deviceNumber}})</span>
                <div style="cursor:pointer;display:inline;font-size:18px"><i class="el-icon-close"></i></div>
            </el-col> -->
            <el-scrollbar style="height:30vh;" ref="scrollbar">
              <BaseTable  :dataList="list" :tableLabel="tableLabel"   ></BaseTable>
            </el-scrollbar>
        </el-row>
        <!-- <div slot="footer" class="dialog-footer" style="text-align:center">
           <el-button type="primary" @click="confrim">{{$t('button.send')}}</el-button>
        </div> -->
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import VueForm from '@lljj/vue-json-schema-form'
    import BaseTable from '@/components/table'
    export default{
        name:'sendOrder',
        props:{
            list:{
                type:Array
            }
        },
        components:{ VueForm , BaseTable },
        data(){
            return {
                height: 1000,
                deviceCmdTemplateId:null,
                cmdOptions:[],
                formData: {},
                formFooter : {
                    show: true,
                    okBtn: this.$t('button.send'),
                    
                },
                schema: null,
                type:null,
                tableLabel:[
                  {label: this.$t('table.imei'), prop: 'deviceNumber'},
                  {label: this.$t('table.Device'), prop: 'deviceName'},
                  {label: this.$t('table.model'), prop: 'model'},
                  {label: this.$t('table.customers'), prop: 'username'},
                  {label: this.$t('table.operation'),
                    type:'clickEvent',
                    name:'删除',
                    tableClick: (val) => {
                    this.showDialog('a', val)
                  }
                 }
                ],
                searchImei:null,
                tempNum:0,
                isShow:false
            }
        },
        mounted(){
           this.type = JSON.parse(sessionStorage['user']).userType
           var that = this
           window.onresize = function () {
              that.height = 80 + 'vh'
           }
        //    console.log(JSON.stringify(this.schema))
        //    console.log(this.list,123)

        },
        computed: {
            num: function () {
                return this.list.length
            }
        },
        methods:{
            getlist(){ // 获取指令模板列表
            // debugger
                let data = {
                  deviceModelId:this.list[0].deviceModel.id
                }
                api.getCmdTemplates(data).then(res => {

                  this.cmdOptions = res.data
                    
                }).catch(err => {

                  this.cmdOptions = []
                  this.$message.error(err.errMsg)
                })
            },
            selType(val){ // 选择下发指令类型
                console.log(val)
                if(val){
                    this.getDeviceCmdTemplates(val)
                }
            },
            getDeviceCmdTemplates(id){ // 获取指令模板
              let data = {
                deviceCmdTemplateId:id
              }
              api.getDeviceCmdTemplates(data,this.type).then(res => {
                // console.log(res)
                if(res.data.templateContent!='{}'){
                    let item = JSON.parse(res.data.templateContent)
                    this.schema = item
                }else{
                    this.schema = null
                }
                
              }).catch(err => {
                console.log(err)
              })
            },
            showDialog(index, data){ // 操作
                switch (index) {
                    case 'a': //销售-删除设备
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
            inputChange(){
              this.searchImei=this.searchImei.replace(/[^\d|^\n\r]/g,'')
            },
            leftIMEI(){
              this.isShow = false
            },
            enterIMEI(){
              this.isShow = true
            },
            changeIMEI(val){
              // console.log(val,typeof val)
              if(val.trim()){
                let temp = null
                temp= val.split("\n")
                temp = temp.filter(str => !!str)
                setTimeout(() => {
                  this.tempNum = temp.length
                },100)
              }else{
                // this.$set(this.temp,'num',0)
                this.tempNum = 0
              }
            },
            searchEqu(){ //下发-搜索设备
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
                var reg = /^\d{11,}$/
                if(!reg.test(temp)){
                  return this.$message.warning('输入的设备号不存在')
                }
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
              // console.log(temp)
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
                  // console.log(this.saleList)
                }else{
                  this.$message.error(res.msg)
                }
              }).catch(err => {
                this.$message.error(err.msg)
              })
            },
            qingkong(){
              this.list = []
            },
            confrim(){ // 确认下发
                console.log(this.formData)
                this.handlerSubmit()
                // this.$emit('confrimSend', false)
            },
            handlerCancel(){
                this.$emit('confrimSend', false)
            },
            handlerSubmit() { // 确认下发
                let arr = []
                for(let i = 0;i <this.list.length;i++){
                  if(((this.list[i].serviceExpireTime -new Date().getTime())<0 && this.list[i].serviceExpireTime != -1)){
                    return this.$message.warning('已过期设备无法下发指令')
                  }
                  arr.push(this.list[i].id)
                }
                let data = {
                  cmdTemplateId:this.deviceCmdTemplateId,
                  cmdData:this.formData,
                  deviceIdList:arr
                }
                api.createDeviceCmd(data,this.type).then(res => {
                  if(res.success){
                    this.$message.success(this.$t('message.sendsuc'))
                    this.$emit('confrimSend', false)
                  }else{
                    this.$message.error(res.msg)
                  }
                  
                }).catch(err => {
                  this.$message.error(err.msg)
                })
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
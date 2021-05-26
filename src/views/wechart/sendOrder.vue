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
            <span v-if="num">({{num}})</span>
        </el-row>
        <el-row style="margin:20px 0;" >
            <el-col :span='7'  style="border:1px solid grey;text-align:center;line-height:40px;margin-right:10px" v-for="item in list" :key="item.id">
                <span>{{item.deviceName}}</span>
                <span>({{item.deviceNumber}})</span>
                <div style="cursor:pointer;display:inline;font-size:18px"><i class="el-icon-close"></i></div>
            </el-col>
        </el-row>
        <!-- <div slot="footer" class="dialog-footer" style="text-align:center">
           <el-button type="primary" @click="confrim">{{$t('button.send')}}</el-button>
        </div> -->
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import VueForm from '@lljj/vue-json-schema-form'
    import axios from 'axios'
    export default{
        name:'sendOrder',
        props:{
            list:{
                type:Array
            }
        },
        components:{ VueForm },
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
                type:null
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
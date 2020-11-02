<template>
    <div id="policeMessage" v-loading="listLoading" :style="{height:height+194 + 'px',overflow:'hidden'}">
        <el-card shadow="always" class="mb20" style="background:#ccc">
            <div slot="header" class="clearfix">
                <span>{{$t('route.aladata')}}</span>
            </div>
        <el-card shadow="always" :style="{height:+height+'px'}">
            <el-row :gutter="10">
                <el-col :span="3">
                    <el-input v-model="imei"  :placeholder="$t('table.searchimei')" clearable></el-input>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="alatype" :placeholder="$t('table.inputele')">
                        <el-option v-for='item in alatypelist' :value='item.value' :label="item.name" :key='item.value'>{{item.name}}</el-option>
                    </el-select>
                </el-col>
                <!-- <el-col :span="3">
                    <el-select v-model="alatype" :placeholder="$t('table.inputele')">
                        <el-option v-for='item in alatypelist' :value='item.value' :label="item.name" :key='item.value'>{{item.name}}</el-option>
                    </el-select>
                </el-col> -->
                <el-col :span="3">
                    <el-date-picker
                        v-model="startTime"
                        value-format="timestamp"
                        type="datetime"
                        :placeholder="$t('table.startdata')"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col>
                
                <el-col :span="3">
                    <el-date-picker
                        v-model="endTime"
                        value-format="timestamp"
                        type="datetime"
                        :placeholder="$t('table.enddata')"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col> 
                <el-col :span="6">
                      <el-button class="butsearch" @click="filterSearch()">{{$t('button.search')}}</el-button>
                      <el-button class="butresh" @click="filter()">{{$t('button.refresh')}}</el-button>
                      <el-button type="primary" @click="proPiLiang">批量处理</el-button>
                      <el-button class="butadd" @click="download()">{{$t('button.download')}}</el-button>
                </el-col>
                
            </el-row>
            <div style="margin-top:20px;">
                <el-scrollbar :style="{height:height-110+'px' }" ref="scroll">
                        <el-table class="particular-table" :data="listxian" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}">
                            <el-table-column type="selection" > </el-table-column>
                            <el-table-column align='center' prop="imei" :label="$t('table.imei')"> </el-table-column>
                            <el-table-column align='center' prop="deviceName" :label="$t('table.Device')"> </el-table-column>
                            <el-table-column align='center'  prop="lastWAt" :label="$t('table.Update')"> </el-table-column>
                            <el-table-column align='center' prop="alarmType" :label="$t('table.alarmrecord')">
                                <template slot-scope="scope">
                                {{scope.row.alarmType | alatype}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' prop="" :label="$t('table.operation')" style="width:50px;">
                                <template slot-scope="scope">
                                    <el-button style="width:100px;" type="primary" @click='openEditstate(scope.row)' :disabled='(scope.row.status == 0||scope.row.status == null)? false : true'>{{(scope.row.status == 0||scope.row.status == null)?$t('table.chuli') : scope.row.status == 1?$t('table.pastcl') : '误报'}}</el-button>
                                </template>
                        </el-table-column>
                        </el-table>
                </el-scrollbar>
            </div>
        </el-card>
        <el-card shadow="always" class="mt20">
            <el-pagination
                @current-change="changeindex2"
                :current-page.sync="page.index"
                :page-size="page.size"
                layout="total, prev, pager, next ,jumper"
                :total="page.total"
                style="text-align:center">
            </el-pagination>
        </el-card>
      </el-card>
      <el-dialog title="报警处理" :visible.sync="showCl" width="20%">
        <el-row :gutter="10">
          <el-col :span='6'>
            <span>处理状态:</span>
          </el-col>
          <el-col :span='16'>
            <el-radio v-model="radio" label="1">{{$t('table.chuli')}}</el-radio>
           <el-radio v-model="radio" label="2">误报</el-radio>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top:10px">
          <el-col :span='6'>
            <span>处理说明:</span>
          </el-col>
          <el-col :span='16'>
            <el-input type="textarea"  :rows="2"  :placeholder="$t('view.inputtext')"  v-model="textarea"></el-input>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showCl = false">{{$t('button.cancel')}}</el-button>
          <el-button type="primary" @click="editstate()">{{$t('button.determine')}}</el-button>
        </div>
      </el-dialog>      
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import mixin from '@/mixins/index'
import {alatype} from '@/plugins/filter.js'
    export default{
        name:'policeMessage',
        mixins:[mixin],
        data(){
            return {
                pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                  }
                },
                datatime:[],
                startTime: '',
                endTime:'',
                types:process.env.type,
                roles:this.$store.getters.roles,
                height:0,
                list:[],
                listLoading:false,
                listxian:[],
                imei:'',
                group_sel:'',
                alatype: null,
                showCl:false,
                radio:'1',
                textarea:'',
                row:null,
                multipleSelection:[],
                isPiliang: false
            }
        },
        mounted(){
            // console.log(this.alatypelist)
            // this.height=document.body.offsetHeight-235
            this.height=document.body.offsetHeight-255
            this.getList(0)
        },
        methods:{
            filterSearch(){
                // this.page.index=1
                // this.imei=''
                if(this.startTime > this.endTime){
                    this.$message.warning(this.$t('table.timeerror'))
                    return
                }else{
                    this.getList(1)
                }
            },
            filter(){
                this.list=[]
                this.listxian=[]
                this.imei=''
                this.alatype = ''
                this.startTime = ''
                this.endTime = ''
                this.multipleSelection = []
                this.isPiliang = false
                this.getList(0)
            },
            async getList(val){
                let data = {}
                let id = []
                if(val == 0){
                    id = [1]
                    data = {params:{
                    pageSize:this.page.size,
                    pageNo:this.page.index-1,}}
                }else{
                    // debugger
                    if(!this.imei && (this.alatype!=0 && !this.alatype) && !this.startTime && !this.endTime){
                    this.$message.warning(this.$t('table.searchimei'));
                    return
                    }
                    this.listLoading=true
                    this.listxian=[]
                    // if(this.imei){
                    //     id=await api.getEquList( {params:{
                    //         imei:this.imei,
                    //         userId :this.$store.getters.usercode
                    //     }}).catch(_=>{
                    //         this.listLoading=false
                    //         this.$message.error(_.message);
                    //         return []
                    //     })
                    // }
                    
                    data = {params:{
                    imei:this.imei,
                    type: this.alatype,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    pageSize:this.page.size,
                    pageNo:this.page.index-1,}}
                }
                 
                // if(id.length===0 && !this.alatype){
                //     this.listLoading=false
                //     return this.$message.error(this.$t('message.errorno'));
                // }
                api.getMessageListPagination(data).then(res=>{
                    if(res.content.length==0){
                        this.$message.error(this.$t('table.alarno'));
                        this.page.total=0
                        this.listLoading=false
                        return 
                    }else{
                        this.listLoading=false
                        this.listxian=res.content
                        this.page.total=res.total
                    }
                    
                }).catch(err=>{
                    this.listLoading=false
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                })
            },
        changeindex2(val){                                //改变当前页
            this.page.index=val
            if(this.imei || this.alatype || this.endTime || this.startTime){
                this.getList(1)
            }else{
                this.getList(0)
            }
        },
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        openEditstate(data){
            this.textarea = ''
            this.radio = '1'
            this.row = data
            this.isPiliang = false
            this.showCl = true

        },
        editstate(val){  //处理报警信息
            // console.log(val)
            // this.$confirm(this.$t('message.alachuli'), this.$t('message.newtitle'), {
            //     confirmButtonText: this.$t('button.determine'),
            //     cancelButtonText: this.$t('button.cancel'),
            //     type: "warning"
            // }).then(_ => {
            //     api.getMessageChuli(val.id).then(res => {
            //         this.$message.success(this.$t('message.alaedit'))
            //         this.getList(0)
            //     }).catch(err => {
            //         this.$message.error(err.message)
            //     })
            // }).catch(_ => {})
            let data = {}
        data.ids = []
        data.status = Number(this.radio)
        data.handleExplain = this.textarea
        if (this.isPiliang) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            data.ids.push(this.multipleSelection[i].id)
          }
        } else {
          data.ids = [this.row.id]
        }
        api
          .getMessageChuli(data)
          .then(res => {
            this.$message.success(this.$t('message.alaedit'))
            this.showCl = false
            this.getList(0)
          })
          .catch(err => {
            this.$message.error(err.message)
          })
    },
    proPiLiang(){
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请勾选需处理的数据！！')
        return
      }
       for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].status !== 0) {
          this.$message.warning('请勾选未处理的数据！！')
          return
        }
      }
        this.textarea = ''
        this.radio = '1'
        this.isPiliang = true
        this.showCl = true
    },
    download(){
        api.downalalist({
         params:{
             imei:this.imei,
          alarmType:this.alatype,
          endTime:this.endTime,
          startTime:this.startTime},
          headers: { 'Content-Type': 'application/json,charset=utf-8'},    
          responseType: 'arraybuffer', }).then(res => {
            let blob = new Blob([res], {type: "application/vnd.ms-excel"});  // res就是接口返回的文件流了
             let objectUrl = URL.createObjectURL(blob); 
             var a = document.createElement('a');
            　a.href = objectUrl;
            　let time = new Date()
              let y = time.getFullYear()
              let m = time.getMonth() + 1
              let d = time.getDate()
              let h = time.getHours() + 1; //获取当前小时数(0-23)
              let mm = time.getMinutes() + 1; //获取当前分钟数(0-59)
              let hh = time.getSeconds() + 1; //获取当前秒数(0-59)
              let name = this.$t('route.aladata') + y+''+m+''+d+''+h+''+mm+''+hh+'.xls'
              a.download = name;
            　a.click()
             window.URL.revokeObjectURL(objectUrl);
          }).catch(err => {
            this.$message(err.message)
          })
    }
      },
  // 过滤器格式化时间戳
  filters: {
    //  时间格式自定义 只需把字符串里面的改成自己所需的格式
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    alatype(val){
      return alatype(val)
    }
  }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
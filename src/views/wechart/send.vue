<template>
    <div>
        <el-card shadow="always" class="mb20" style="height:80px">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" :placeholder="$t('table.searchimei')" clearable></el-input>
                </el-col>
                <el-col :span="16">
                      <el-button class="butsearch" @click="filterSearch">{{$t('button.search')}}</el-button>
                      <el-button class="butresh" @click="getAllList">{{$t('button.refresh')}}</el-button>
                       <!--<el-button @click="openDialog(false)" >添加</el-button> -->
                </el-col>
            </el-row>
        </el-card>
       <el-card :style="{height:height-23+'px' }">
       <div :style="{height:height+'px',overflow:'hidden' }">
                <el-scrollbar :style="{height:height-23+'px' }"> 
                    <div style="overflow:hidden;">
                     <el-table :data="eque" >
                       <el-table-column align='center' prop="imei" :label="$t('table.imei')"></el-table-column>
                       <!-- <el-table-column prop="pinlv" label="上报频率"></el-table-column> -->
                       <el-table-column align='center' prop="deviceName" :label="$t('table.Device')"></el-table-column>
                       <el-table-column align='center' :label="$t('table.operation')">
                           <template slot-scope="scope">
                               <!-- <el-switch v-model="value" active-color="#c8c8c8" inactive-color="#13ce66" active-text="关" inactive-text="开"></el-switch> 
                               <el-button type="primary" size="small" @click="">重启</el-button>   -->
                               <el-button type="primary" size="small" @click="sendorder(scope.row)">{{$t('button.send')}}</el-button>
                               <el-button type="primary" size="small" @click="historyOrder(scope.row)">{{$t('button.historysend')}}</el-button>
                               <el-dialog :title="$t('table.addsend')" :visible.snyc="dialogTableVisible" :before-close="handleClose">
                                   <el-form>
                                       <el-form-item label="设备号" >
                                           <el-input v-model="imei"></el-input>
                                       </el-form-item>
                                       <el-form-item :label="$t('table.sendtime')">
                                           <el-row>
                                           <el-col :span="5">
                                               <el-select v-model="frequency" :placeholder="$t('table.pinlv')">
                                                <el-option value="2" :label="$t('table.two')">{{$t('table.two')}}</el-option>
                                                <el-option value="5" :label="$t('table.five')">{{$t('table.five')}}</el-option>
                                                <el-option value="10" :label="$t('table.ten')">{{$t('table.ten')}}</el-option>
                                                <el-option value="0" :label="$t('table.pinlv')">{{$t('table.pinlv')}}</el-option>
                                              </el-select>
                                              </el-col>
                                              <el-col :span="4" style="text-align:right">
                                                   <span style="margin:0 5px 0 35px;">{{$t('table.zitime')}}</span>
                                              </el-col>
                                           <el-col :span="5">
                                               <el-time-picker
                                                   :disabled = 'frequency == 0 ? false : true'
                                                   v-model="value1"
                                                    format='HH:mm'
                                                    value-format="HH:mm"
                                                   :placeholder="$t('table.randomtime')">
                                               </el-time-picker>
                                           </el-col>
                                
                                           <span style="margin-left:15px;">{{$t('table.timetext')}}{{frequency == '0' ? value1 : frequency + $t('table.minute')}}</span>
                                           </el-row>  
                                           </el-dropdown>
                                       </el-form-item>
                                       <el-form-item>
                                           <span>{{$t('table.warntime')}}</span>
                                       </el-form-item>
                                       <el-form-item :label="$t('table.note')" >
                                            <el-input></el-input>
                                       </el-form-item>
                                   </el-form>
                                   <div slot="footer" class="dialog-footer">
                                     <el-button @click="dialogTableVisible = false">{{$t('button.cancel')}}</el-button>
                                     <el-button type="primary" @click="sendTime()">{{$t('button.determine')}}</el-button>
                                   </div>
                               </el-dialog>

                    <el-dialog :title="$t('button.historysend')" :visible.snyc="dialogTableorder" :before-close="handleClose">
                        <el-table :data="orderlist">
                            <el-table-column align='center' prop="imei" :label="$t('table.imei')" width="180">
                          </el-table-column>
                            <el-table-column align='center' prop="data" :label="$t('table.sendtime')" width="180">
                            <template slot-scope="scope">
                            {{scope.row.data}}{{$t('table.minute')}}
                            </template>
                          </el-table-column>
                            <el-table-column align='center' prop="orderDt" :label="$t('table.creattime')" width="180">
                          </el-table-column>
                          <el-table-column align='center' prop="status" :label="$t('table.jie')">
                            <template slot-scope="scope">
                            {{scope.row.status == 0 ? $t('table.wait') :scope.row.status == 1 ? $t('message.success'):scope.row.status == 2?$t('message.fail'):''}}
                            </template>
                          </el-table-column>
                        </el-table>
                          <el-card shadow="always" class="mt20">
                          <el-pagination
                              @current-change="changeindex2"
                              :current-page.sync="pages.No"
                              :page-size="pages.size"
                              layout="total, prev, pager, next ,jumper"
                              :total="pages.total">
                          </el-pagination>
                         </el-card>
                    </el-dialog>
                </template>
            </el-table-column>
             </el-table>
                  </div>
                </el-scrollbar>
            </div>
         </el-card>
        <el-card shadow="always" class="mt20">
            <el-pagination
                @current-change="changeindex"
                :current-page.sync="page.index"
                :page-size="page.size"
                layout="total, prev, pager, next ,jumper"
                :disabled="search?true:false"
                :total="page.total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
import api from '@/api/wechart/index'
import mixin from '@/mixins/index'
export default {
    name : "send",
    mixins:[mixin],
    data () {
        return{
            value: true,
            dialogTableVisible: false,
            dialogTableorder: false,
            orderlist:[],
            search:'',
            value1:'',
            frequency:'0',
            imei:'',
            id:'',
            height:0,
            eque:[],
            pages:{
                No:1,
                size:10,
                total:0
            },
            hisimei:''
        }
    },
    mounted() {
        this.height=document.body.offsetHeight-310
        this.getAllList()
    },
    methods:{
        handleCommand(command) {
        this.$message('click on item ' + command);
      },
      getAllList(){
          this.search = ''
                this.listLoading=true
                api.getEqulistnew({params:{
                    pageSize:this.page.size,
                    pageNo:this.page.index-1,
                    deviceGroupId:'',
                    userId:this.$store.getters.usercode,
                }
                }).then(_=>{
                    if(Array.isArray(_.content)){
                        this.eque=_.content
                        this.page.total=_.total
                    }else{
                        this.$message.error('获取列表失败');
                    }
                    this.listLoading=false
                }).catch(_=>{
                    this.$message.error(_.message);
                    this.listLoading=false
                })
            },
            filterSearch () {
                if(!this.search){
                    this.$message.warning(this.$t('table.searchimei'));
                    return
                }else{
                     this.page.index=1
                        api.getEquListtwo({params:{imei:this.search,userId:this.$store.getters.usercode}}).then(res=>{
                            if(res.content.length == 0){
                                this.$message.error('该设备不存在');
                            }else{
                                this.eque = res.content
                            }
                            this.page.total=res.length
                       }).catch(err =>{
                           this.$message.error(err.message);
                       })
                }
            },
            sendTime() {
                if(this.value1 != '' && this.frequency == '0' ){
                    let time = this.value1.split(':')
                    let a = time[0] * 60
                    let b = time[1] * 1
                    this.frequency = a + b
                }

                api.sendorder({
                    data:this.frequency,
                    deviceId:this.id,
                    imei:this.imei,
                    type:1,
                }).then(res => {
                    this.$message.success('修改成功,等待设备响应')
                    this.dialogTableVisible = false
                }).catch( err =>{
                    this.$message.error(err.message)
                })
            },
            sendorder(data) {
                this.dialogTableVisible = true
                this.imei = data.imei
                this.id = data.deviceId
            },
            
            historyOrder(scop){
                if(scop){
                    this.hisimei = scop.imei
                }
                this.dialogTableorder = true
                api.historyOrder({params:{
                    pageNo:this.pages.No-1,
                    pageSize:this.pages.size,
                    imei:this.hisimei
                  }
                }).then(res =>{
                    this.orderlist = res.content
                    this.pages.total = res.total;
                }).catch(err =>{
                    this.$message.error(err.message)
                })
            },
            handleClose(){
                this.dialogTableVisible= false,
                this.dialogTableorder=false
            },
            changeindex2(val){                                //改变当前页
            this.pages.No=val
            this.historyOrder()
        },
    },
    
}
</script>
<style>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>



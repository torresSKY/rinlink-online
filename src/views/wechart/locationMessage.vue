<template>
    <div id="locationMessage" v-loading="listLoading">
        <el-card shadow="always" class="mb20" style="background:#ccc">
          <div slot="header" class="clearfix">
            <span>{{$t('route.Location')}}</span>
          </div>
        <el-card shadow="always" :style="'height:'+height+'px'">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-input v-model="imei" :placeholder="$t('table.searchimei')"></el-input>
                </el-col>

                <el-col :span="6">
                    <el-date-picker
                        v-model="startTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        
                        type="datetime"
                        :placeholder="$t('table.startdata')">
                    </el-date-picker>
                </el-col>
                <el-col :span="6">
                    <el-date-picker
                        v-model="endTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        :placeholder="$t('table.enddata')">
                    </el-date-picker>
                </el-col>

                <el-col :span="6">
                      <el-button @click="getHistory" :disabled="listLoading">{{$t('button.search')}}</el-button>
                </el-col>
            </el-row>
            <div :style="{height:height-40+'px',overflow:'hidden'}">
                <el-scrollbar :style="{height:height-23+'px' }">
                    <div style="overflow:hidden;">
                        <el-table :data="list" :height="height-40" style="width: 100%">
                            <el-table-column align='center' :label="$t('table.loctype')" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.wifiGpsFlag==1?'GPS':scope.row.wifiGpsFlag==2?'WIFI':''}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="$t('table.update')" width="200">
                                <template slot-scope="scope">
                                    {{scope.row.eventTime + ''}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="$t('table.wei')" width="200">
                                <template slot-scope="scope">
                                    {{scope.row.latitude+''}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="$t('table.jing')" width="200">
                                <template slot-scope="scope">
                                    {{scope.row.longitude+''}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="运动状态" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.run==1?'运动':'静止'}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="步数" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.stepNum}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="电压" width="100">
                                <template slot-scope="scope">
                                    {{scope.row.batteryVol}}
                                </template>
                            </el-table-column>
                            <el-table-column align='center' :label="macs地址" width="700">
                                <template slot-scope="scope">
                                    {{scope.row.macs}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
        </el-card>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import {mapState} from 'vuex'
    export default{
        name:'locationMessage',
        computed:{
            ...mapState({user:'user',adminRoles:'roles'})
        },
        data(){
            return {
                roles:this.$store.getters.roles,
                listLoading:false,
                imei:'',
                list:[],
                height:0,
                startTime:'',
                endTime:'',
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-235
            this.endTime=new Date()
        },
        methods:{
            async getHistory(){
                if(!this.imei||!this.startTime||!this.endTime || new Date(this.startTime)>new Date(this.endTime)){
                    this.$message.warning('输入有误');
                    return
                }
                this.listLoading=true
                this.list=[]
                let id=await api.getEquList(this.imei).catch(_=>{
                    this.listLoading=false
                    this.$message.error(_.message);
                    return []
                })
                if(id.length===0){
                    this.listLoading=false
                    return this.$message.error('该设备不存在');
                }
                api.getHistory(id[0].id,{startTime:this.startTime,endTime:this.endTime}).then(res=>{
                    let list=[]
                    this.listLoading=false
                    res.sort((a,b)=>new Date(a.eventTime).getTime()-new Date(b.eventTime).getTime())
                    this.list=res

                }).catch(err=>{
                    this.listLoading=false
                    this.$message({
                        type: 'error',
                        message: err.message
                    });
                })
            },
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
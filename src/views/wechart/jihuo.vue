<template>
    <div id="jihuo" v-loading="listLoading" :style="{height:height + 'px'}">
        <el-card shadow="always" :style="{background:'#ccc'}">
          <div slot="header" class="clearfix">
            <span>{{$t('route.List')}}</span>
          </div>
          <el-card  :style="{height:height - 20+'px',margin:'10px 0'}">
            <el-row :gutter="10">
                <el-col :span="4">
                    <el-input v-model="search" :placeholder="$t('table.searchimei')" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-select v-model="selegroup" :placeholder="$t('view.inputgroup')">
                        <el-option v-for="item in grouplist" :value="item.id" :key="item.name" :label="item.name"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="10">
                      <el-button class="butsearch" @click="getList()">{{$t('button.search')}}</el-button>
                      <el-button class="butresh" @click="refresh">{{$t('button.refresh')}}</el-button>
                      <el-button class="butadd" @click="openDialog(false)" >{{$t('button.add')}}</el-button>
                </el-col>
                <el-col :span="6" style="text-align: right;">
                    <el-button class="butadd" @click="openMore()" style="width:110px;">{{$t('button.addpiliang')}}</el-button>
                </el-col>
            </el-row>
            <div style="margin:10px 0;">
                <el-scrollbar :style="{height:height-150+'px'}" ref="scroll">
                <el-table class="particular-table" :data="listxian" :row-class-name="tableRowClassName" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}" @selection-change="handleSelectionChange">
                    <el-table-column align='center' prop="deviceName" :label="$t('table.Device')" show-overflow-tooltip></el-table-column>
                    <el-table-column align='center' prop="imei" :label="$t('table.imei')" show-overflow-tooltip></el-table-column>
                    <el-table-column align='center' prop="groupName" :label="$t('table.groupname')" show-overflow-tooltip></el-table-column>
                    <el-table-column align='center' prop="deviceType" :label="$t('table.type')" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column align='center' prop="" :label="$t('route.Data')" >
                        <template slot-scope="scope">
                        <el-button @click="selectOperation('7',scope.row)" type="text">{{$t('route.Data')}}</el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column align='center' prop="" width="160" :label="$t('route.Trajectory')" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button @click="toRouter(0,scope.row)" type="text">{{$t('route.Trajectory')}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align='center' width="160" :label="$t('route.Location')" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button @click="toRouter(1,scope.row)" type="text" >{{$t('route.Location')}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align='center' prop="address" :label="$t('table.Detailed')" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column align='center' prop="" :label="$t('button.shewei')">
                        <template slot-scope="scope">
                            <el-button @click="electTo(scope.row)" type="text" >{{$t('button.shewei')}}</el-button>
                        </template>
                    </el-table-column> -->
                    <el-table-column align='center' prop="createDt" :label="$t('table.addtime')"></el-table-column>
                    <el-table-column align='center' prop="" :label="$t('route.Alarm')">
                        <template slot-scope="scope">
                            <el-button @click="selectOperation('8',scope.row)" type="text" >{{$t('route.aladata')}}</el-button>
                        </template>
                    </el-table-column> 
                    <!-- <el-table-column prop="competingInformation.model" :label="$t('table.commodel')"></el-table-column> -->
                    <el-table-column align='center' prop="" :label="$t('table.operation')">
                        <template class="scope" slot-scope="scope">
                            <el-dropdown @command="selectOperation($event,scope.row)">
                            <el-button type="primary" size="small">
                                {{$t('table.operation')}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1">{{$t('button.editor')}}</el-dropdown-item>
                                <el-dropdown-item command="2">{{$t('table.equinfo')}}</el-dropdown-item>
                                <el-dropdown-item command="3">{{$t('button.send')}}</el-dropdown-item>
                                <el-dropdown-item command="4">{{$t('button.historysend')}}</el-dropdown-item>
                                <!-- <el-dropdown-item command="5">{{$t('table.Competinfo')}}</el-dropdown-item> -->
                                <el-dropdown-item command="6">{{$t('button.dele')}}</el-dropdown-item>
                            </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
             </el-scrollbar>
                <el-pagination
                    @current-change="changeindex"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    layout="total, prev, pager, next ,jumper"
                    :disabled="search?true:false"
                    :total="page.total"
                    style="text-align:center;margin-top:10px">
                </el-pagination>
            </div>
        </el-card>
     </el-card>
        <!-- 添加/编辑设备 -->
        <el-dialog :title="isEdit?$t('table.changeinfo'):$t('route.Add')" :visible.sync="dialogState" :before-close="handleClose">
            <div>
                <label class="el-form-item__label">{{$t('table.imei')}}:</label>
                <el-input v-model="imei" :disabled="isEdit" :rules="inputRules"></el-input>
                <label class="el-form-item__label">{{$t('table.Device')}}:</label>
                <el-input v-model="imsi"></el-input>
                <label class="el-form-item__label" >{{$t('table.equgroup')}}:</label>
                <!-- <el-input v-model="device_id" ></el-input> -->
                <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                    <el-select v-model="group_sel" :placeholder="morengroup" style="width:90%;">
                        <el-option v-for="item in grouplist" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <!-- <router-link to="/wechart/group">
                        <i class="el-icon-circle-plus-outline" style="color:red;font-size:20px;"></i>
                    </router-link> -->
                </div>
                 <!-- <label class="el-form-item__label">{{$t('table.type')}}:</label>
               <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                    <template>
                    <el-radio v-model="bind_mode" :label="$t('table.defaultdevice')">{{$t('table.defaultdevice')}}</el-radio>
                    <el-radio v-model="bind_mode" label="CoAP/NB-IoT">CoAP/NB-IoT</el-radio>
                    <el-radio v-model="bind_mode" label="UDP/2G">UDP/2G</el-radio>
                    <el-radio v-model="bind_mode" label="TCP/4G">TCP/4G</el-radio>
                    <el-radio v-model="bind_mode" :label="$t('table.lora')">{{$t('table.lora')}}</el-radio>
                    <el-radio v-model="bind_mode" :label="$t('table.ble')">{{$t('table.ble')}}</el-radio>
                    </template>
                </div>-->
                <label class="el-form-item__label">{{$t('table.model')}}:</label>
                <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                  <template>
                    <el-select v-model='model'>
                      <el-option v-for='item in equmodel' :key='item.index' :value='item.value' :name='item.name'></el-option>
                    </el-select>
                  </template>
                </div>
                <label class="el-form-item__label" >{{$t('table.touser')}}</label>
                <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                    <el-select v-model="user_sel" :placeholder="userName" style="width:90%;">
                        <el-option v-for="item in userlist" :key="item.id" :label="item.username" :value="item.id"></el-option>
                    </el-select>
                    <!-- <router-link to="/UserManagement/wechartUser">
                        <i class="el-icon-circle-plus-outline" style="color:red;font-size:20px;"></i>
                    </router-link> -->
                </div>
                <label class="el-form-item__label" >{{$t('view.region')}}:</label>
                <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                    <el-select v-model="region" :placeholder="userName" style="width:90%;">
                        <el-option :label="$t('view.region0')" value="true" key='0'></el-option>
                        <el-option :label="$t('view.region1')" value="false" key='1'></el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">{{$t('button.cancel')}}</el-button>
                <!-- <el-button type="primary" @click="confirmAdd" :disabled="[0,1].filter(res=>res==roles).length!==0 && isEdit" :loading="addOrEditLoading">{{[0,1].filter(res=>res==roles).length!==0 && isEdit?'无修改权限':'确认'}}</el-button> -->
                <el-button type="primary" @click="confirmAdd"  >{{$t('button.determine')}}</el-button>
            </span>
        </el-dialog>
       <!-- 下发指令 -->
       <el-dialog :title="$t('table.addsend')" :visible.sync="dialogTableVisible">
           <el-form>
                <el-form-item label="imei" >
                    <el-input v-model="imei" disabled></el-input>
                </el-form-item>
                <el-form-item :label="$t('button.send')">
                    <el-row>
                    <el-col :span="5">
                        <el-select v-model="frequency">
                            <!-- <el-option value="1" :label="$t('table.sendtime')">{{$t('table.sendtime')}}</el-option>
                            <el-option value="18" :label="$t('table.order1')">{{$t('table.order1')}}</el-option>
                            <el-option value="19" :label="$t('table.order2')">{{$t('table.order2')}}</el-option> -->
                            <el-option v-for='item in sendlist' :key='item.index' :value="item.value" :label="item.name"></el-option>
                        </el-select>
                    </el-col>
                    <!--<el-col :span="4" style="text-align:right" v-if='frequency == 1 || frequency == 18'>
                            <span style="margin:0 5px 0 35px;">{{$t('table.zitime')}}</span>
                    </el-col>
                     <el-col :span="5" v-if='frequency == 1 || frequency == 18'>
                        <el-input v-model="value1" type="number"></el-input>
                    </el-col>
                    <el-col :span="1" v-if='frequency == 1 || frequency == 18'>
                        <span style="margin-left:15px;">{{$t('button.miao')}}</span>
                    </el-col>
                    <el-col :span="4" v-if='frequency == 1 || frequency == 18'>
                        <span style="margin-left:15px;">({{$t('message.fanwei')}})</span>
                    </el-col> -->
                    <el-col :span="3" class="sendcode">
                        <!-- 开启防拆 -->
                        <span v-if="frequency == 1">{{$t('table.opentam')}}</span>
                        <!-- 设置温度下限值 -->
                        <span v-if="frequency == 37">{{$t('table.temlower')}}</span>
                        <!-- 设置湿度下限值 -->
                        <span v-if="frequency == 38">{{$t('table.humlower')}}</span>
                        <!-- 蜂鸣器响次数
                        <span v-if="frequency == 39">{{$t('table.buzzercount')}}</span> -->
                        <!-- 倾斜参数 -->
                        <span v-if="frequency == 39">维持时间(秒)</span>
                        <!-- 上报频率 -->
                        <span v-if="frequency == 10">{{$t('table.Reportfrequency')}}（{{$t('button.fen')}}）</span>
                        <!-- 低电量阈值 -->
                        <span v-if="frequency == 11">{{$t('table.didian')}}</span>
                        <!-- 报警时长 -->
                        <span v-if="frequency == 30 || frequency == 31">
                          {{$t('table.Alarmtime')}}（{{$t('button.fen')}}）
                        </span>
                        <!-- 报警重复推送次数 -->
                        <span v-if="frequency == 16">推送次数</span>
                        <!-- 震动监测周期 -->
                        <span v-if="frequency == 18">{{$t('table.zdzhouqi')}}（{{$t('button.fen')}}）</span>
                        <!-- 采集频率 -->
                        <span v-if="frequency == 35 || frequency == 44 || frequency == 45">{{$t('table.frequency')}}（{{$t('button.fen')}}）</span>
                        <!--异常采集频率 -->
                        <span v-if="frequency == 36">{{$t('table.frequency2')}}（{{$t('button.fen')}}）</span>
                        <!--亮屏开始时间 -->
                        <span v-if="frequency == 40">{{$t('table.inputstart')}}</span>
                    </el-col>
                    <div v-if="frequency != 43">
                    <el-col :span="5">
                        <!-- 选择时间输入框 -->
                        <!-- <el-time-picker v-if="frequency == 28|| frequency == 34" v-model="updata" format='HH:mm' value-format="HH:mm" :placeholder="$t('table.randomtime')"></el-time-picker>
                        单选框 -->
                        <template class="sendcode" v-if="frequency == 1 || frequency == 4 ||frequency == 5|| frequency == 12|| frequency == 13|| frequency == 14|| frequency == 19|| frequency == 20|| frequency == 32|| frequency == 41|| frequency == 42|| frequency == 46">
                            <el-radio v-model="updata" label="0" style="line-height:40px;">{{$t('button.open')}}</el-radio>
                        </template>
                        <!-- 上下限选项 -->
                        <el-input clearable v-if="frequency == 10 || frequency == 11|| frequency == 16|| frequency == 18|| frequency == 30|| frequency == 31|| frequency == 33|| frequency == 34|| frequency == 35|| frequency == 36|| frequency == 37|| frequency == 38|| frequency == 39|| frequency == 40|| frequency == 44|| frequency == 45" type="number" v-model="updata" :placeholder="$t('table.randomdata')"></el-input>
                    </el-col>

                    <el-col :span="3" class="sendcode">
                        <!-- 关闭防拆 -->
                        <span v-if="frequency == 1">{{$t('table.closetam')}}</span>
                        <!-- 设置温度上限值 -->
                        <span v-if="frequency == 37">{{$t('table.temupper')}}</span>
                        <!-- 设置湿度上限值 -->
                        <span v-if="frequency == 38">{{$t('table.humupper')}}</span>
                        <!-- 浸水报警上报次数：
                        <span v-if="frequency == 40">{{$t('table.weaternum')}}</span> -->
                        <!-- 倾斜参数 -->
                        <span v-if="frequency == 39">倾斜角度</span>
                        
                        <span v-if="frequency == 15">
                        <!-- {{$t('table.Alarmtime')}} -->
                        LED报警持续时长(分钟)
                        </span>
                        <!-- 上报频率 -->
                        <span v-if="frequency == 35">{{$t('table.Reportfrequency')}}（{{$t('button.fen')}}）</span>
                        <!-- 异常上报频率 -->
                        <span v-if="frequency == 36">{{$t('table.Reportfrequency2')}}（{{$t('button.fen')}}）</span>
                        <!--亮屏开始时间 -->
                        <span v-if="frequency == 40">{{$t('table.inputend')}}</span>
                    </el-col>

                    <el-col :span="5">
                        <!-- 选择时间输入框 -->
                        <!-- <el-time-picker v-if="frequency == 1|| frequency == 28|| frequency == 34||frequency == 39" v-model="updata2" format='HH:mm' value-format="HH:mm" :placeholder="$t('table.randomtime')"> </el-time-picker>
                        单选框 -->
                        <template v-if="frequency == 1 || frequency == 4 ||frequency == 5|| frequency == 12|| frequency == 13|| frequency == 14|| frequency == 19|| frequency == 20|| frequency == 32|| frequency == 41|| frequency == 42|| frequency == 46">
                            <el-radio v-model="updata" label="1" style="line-height:40px;">{{$t('button.close')}}</el-radio>
                        </template>
                        <!-- 上下限选项 -->
                        <el-input clearable v-if="frequency == 35|| frequency == 36|| frequency == 37|| frequency == 38|| frequency == 39|| frequency == 40" type="number" v-model="updata2" :placeholder="$t('table.randomdata')"></el-input>
                    </el-col>
                    </div>
                    <div v-else>
                    <el-col :span='12'>
                        <el-radio-group v-model="updata">
                            <el-radio :label="0">低灵敏度</el-radio>
                            <el-radio :label="1">中度灵敏度</el-radio>
                            <el-radio :label="2">高灵敏度</el-radio>
                            <el-radio :label="3">超高灵敏度</el-radio>
                        </el-radio-group>
                    </el-col>
                    </div>
                    </el-row>  
                    </el-dropdown>
                </el-form-item>
                <!-- <el-form-item>
                    <span>{{$t('table.warntime')}}</span>
                </el-form-item>
                <el-form-item :label="$t('table.note')" >
                    <el-input></el-input>
                </el-form-item> -->
            </el-form>
             <span slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">{{$t('button.cancel')}}</el-button>
                <el-button type="primary" @click="sendTime()"  >{{$t('button.determine')}}</el-button>
            </span>
       </el-dialog>
        <!-- 历史指令 -->
       <el-dialog :title="$t('button.historysend')" :visible.sync="dialogTableorder">
           <el-table :data="orderlist">
               <el-table-column align='center' prop="imei" :label="$t('table.imei')"></el-table-column>
                <el-table-column align='center' prop="data" :label="$t('table.orderdata')">
                    <template slot-scope="scope">
                        {{scope.row.orders}}
                    </template>
                </el-table-column>
                <el-table-column align='center' prop="orderDt" :label="$t('table.creattime')"></el-table-column>
                <el-table-column align='center' prop="status" :label="$t('table.jie')">
                    <template slot-scope="scope">
                        {{scope.row.status == 0 ? $t('table.wait') :scope.row.status == 1 ? $t('message.success'):scope.row.status == 2?$t('message.fail'):''}}
                    </template>
                </el-table-column>
           </el-table>
           <el-pagination
                @current-change="changeindex2"
                :current-page.sync="pages.No"
                :page-size="pages.size"
                layout="total, prev, pager, next ,jumper"
                :total="pages.total"
                style="text-align:center;margin-top:10px">
           </el-pagination>
       </el-dialog>
        <!-- 设备详情 -->
        <el-dialog :title="$t('table.equinfo')" :visible.sync="showInfo" center>
            <el-form :model="oneInfo">
                <el-form-item style="margin: 0;"><span>{{$t('table.Device')}} : {{oneInfo.deviceName}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.imei')}} : {{oneInfo.imei}}</span></el-form-item>
                <el-form-item style="margin: 0;"> <span>{{$t('table.equgro')}} : {{oneInfo.groupName}}</span></el-form-item>
                <el-form-item style="margin: 0;">
                    <span>{{$t('table.touser')}} : </span>
                    <span v-for="item in ueserlevel">
                        {{$t('view.dengji')}}：{{item.level}};{{$t('table.username')}}：{{item.username}};
                    </span>
                </el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.type')}} : {{oneInfo.deviceType}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.equadmin')}} : {{oneInfo.userName}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('view.region')}} : {{oneInfo.abroad==true?$t('view.region0'):$t('view.region1')}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.equlocation')}} : {{oneInfo.positionType==1?"GPS":oneInfo.positionType==2?"WIFI":$t('table.equloctype')}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.Detailed')}} : {{oneInfo.address}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.creattime')}} : {{oneInfo.createDt}}</span></el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="showInfo = false">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="showInfo = false">{{$t('button.determine')}}</el-button>
            </div>
        </el-dialog>
        <!-- 设备报警列表 -->
         <el-dialog :title="$t('route.Alarm')" :visible.sync="showaladata">
                <el-row :gutter="20">
                <el-col :span="6">
                    <el-select v-model="datatype">
                      <el-option :label="$t('table.powerala')" :value="1"></el-option>
                      <el-option :label="$t('table.moveala')" :value="2"></el-option>
                      <el-option :label="$t('table.sosala')" :value="3"></el-option>
                      <el-option :label="$t('table.dropala')" :value="4"></el-option>
                      <el-option :label="$t('table.lightala')" :value="5"></el-option>
                      <el-option :label="$t('table.vibala')" :value="6"></el-option>
                      <el-option :label="$t('table.disala')" :value="7"></el-option>
                      <el-option :label="$t('table.smokeala')" :value="8"></el-option>
                      <el-option :label="$t('table.gasala')" :value="9"></el-option>
                      <el-option :label="$t('table.temalarm')" :value="10"></el-option>
                      <el-option :label="$t('table.humalarm')" :value="11"></el-option>
                      <el-option :label="$t('table.out')" :value="12"></el-option>
                      <el-option :label="$t('table.in')" :value="13"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="2" class="sendcode">
                    <span style='line-height: 40px;'>{{$t('table.seletime')}}</span>
                </el-col>
                <el-col :span="5">
                    <el-date-picker v-model="datastarttime" type="date" :placeholder="$t('table.startdata')" format="yyyy-MM-dd" value-format="timestamp">
                    </el-date-picker>
                </el-col>
                <el-col :span="5">
                    <el-date-picker v-model="dataendtime" type="date" :placeholder="$t('table.enddata')" format="yyyy-MM-dd" value-format="timestamp">
                    </el-date-picker>
                </el-col>
                <el-col :span="1.5">
                    <el-button @click="getAla(alaimei)">{{$t('button.search')}}</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button @click="outFile2()">{{$t('button.download')}}</el-button>
                </el-col>
                </el-row>
                <el-table :data="aladata2" v-loading=''>
                        <el-table-column align='center' prop="alarmType" :label="$t('table.alatype')" width="200">
                            <template slot-scope="scope">
                            {{scope.row.alarmType | alatype}}
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="alarmData" :label="$t('table.alarmvalue')" width="180">
                        <template slot-scope="scop">
                            {{scop.row.alarmData == null ? '--':scop.row.alarmData}}
                        </template>
                        </el-table-column> -->
                        <el-table-column align='center' prop="lastWAt" :label="$t('table.alartime')" width="180">
                        <template slot-scope="scop">
                            {{scop.row.lastWAt == null ? '--':scop.row.lastWAt}}
                        </template>
                        </el-table-column>
                        <el-table-column align='center' prop="" :label="$t('table.operation')" style="width:50px;">
                        <template slot-scope="scope">
                            <el-button style="width:100px;" type="primary" @click='editstate(scope.row)' :disabled='scope.row.isProcess == 0? false : true'>{{scope.row.isProcess == 0?$t('table.chuli') : $t('table.pastcl')}}</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @current-change="changeindex3"
                        :current-page.sync="page3.index"
                        :page-size="page3.size"
                        layout="total, prev, pager, next ,jumper"
                        :total="page3.total"
                        background
                        style="text-align:center">
                    </el-pagination>
        </el-dialog>
        <!-- 批量添加设备 -->
         <el-dialog :title="$t('button.addpiliang')" :visible.sync="morewin">
            <el-form label-width="150px" label-position="left">
            <!-- <el-form-item :label="$t('view.region')">
                <el-select v-model="infoEqu.region" >
                    <el-option key="0" :label="$t('view.region0')" value="0"></el-option>
                    <el-option key="1" :label="$t('view.region1')" value="1"></el-option>
                </el-select>
            </el-form-item> 
            <el-row>
                <el-form-item :label="$t('table.type')">
                    <div style="text-align:left">
                    <el-radio v-model="infoEqu.radio" :label="$t('table.defaultdevice')">{{$t('table.defaultdevice')}}</el-radio>
                    <el-radio v-model="infoEqu.radio" label="CoAP/NB-IoT">CoAP/NB-IoT</el-radio>
                    <el-radio v-model="infoEqu.radio" label="UDP/2G">UDP/2G</el-radio>
                    <el-radio v-model="infoEqu.radio" label="TCP/4G">TCP/4G</el-radio>
                    <el-radio v-model="infoEqu.radio" label="LoRa模块">LoRa模块</el-radio>
                    <el-radio v-model="infoEqu.radio" label="BLE模块">BLE模块</el-radio>
                    </div>
                </el-form-item>
                </el-row>-->
                <el-row :gutter="20">
                <el-col>
                    <el-form-item :label="$t('table.equgroup')">
                    <el-select v-model="group_sel" >
                        <el-option v-for="item in grouplist" :value="item.id" :key="item.name" :label="item.name"></el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item :label="$t('table.touser')">
                    <el-select v-model="infoEqu.userone">
                        <el-option v-for="item in userlist" :value="item.id" :key="item.username" :label="item.username"></el-option>
                    </el-select>
                    </el-form-item>
                </el-col> -->
                </el-row>
                <!-- <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item :label="$t('view.region')">
                    <el-select v-model="infoEqu.region">
                        <el-option key="0" :label="$t('view.region0')" value="0"></el-option>
                        <el-option key="1" :label="$t('view.region1')" value="1"></el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
                </el-row> -->
            <el-form-item :label="$t('view.upfile')">
                <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/#"
                :before-upload="beforeUpload"
                :before-remove="beforeRemove"
                :on-remove="handleRemove"
                :limit="1"
                :file-list="fileList">
                <el-button size="small" type="primary">{{$t('button.clickip')}}</el-button>
                <div slot="tip" class="el-upload__tip">{{$t('table.clicktext')}}</div>
                </el-upload>
            </el-form-item>
            <el-form-item :label="$t(view.file)"
            <el-button @click="adddMore">{{$t('view.close')}}</el-button>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/api/wechart/index'
import mixin from '@/mixins/index'
import axios from 'axios'
import {mapState} from 'vuex'
import {alatype,order} from '@/plugins/filter.js'
export default{
    name:'jihuo',
    mixins:[mixin],
    computed:{
        ...mapState({user:'user',adminRoles:'roles'})
    },
    data(){
      const validateimei = (rule, value, callback) => {
        if (value<16) {
        callback(new Error('imei不能小于5位'))
        }else {
        callback()
        }
      }
     return {
        inputRules: {
            imei: [{ required: true, trigger: 'blur', validator: validateimei }]
        },
        roles:this.$store.getters.roles,
        height:0,
        list:[],
        listLoading:false,
        addOrEditLoading:false,
        listxian:[],
        search:'',
        imei:'',
        deviceRelationId:'',
        device_id: '',
        bind_mode: this.$t('table.defaultdevice'),
        model:'',
        name:'',
        dialogState:false,
        isEdit:false,
        editId:-1,
        grouplist:[],
        group_sel:this.$t('table.defaultdevice'),
        userlist:[],
        user_sel:'',
        imsi:'',
        morengroup: '',
        morenuser: '',
        userName: '',
        dialogTableVisible: false,
        frequency: null,
        value1: null,
        sendimei: null,
        orderlist: null,
        dialogTableorder: null,
        pages:{
                No:1,
                size:10,
                total:0
            },
        showInfo: false,
        oneInfo: [],
        aladata2: [],
        showaladata: false,
        alaimei: '',
        dataendtime: '',
        datastarttime: '',
        page3:{
            size: 10,
            total: 0,
            index: 1,
        },
        datatype: '',
        adddizhi: null,
        selegroup: null,
        region: null,
        morewin: false,
        ueserlevel: [],
        fileList: [],
        alaloading: true,
        updata: 0,
        updata2: 0,
      }
    },
    mounted(){
        this.height=document.body.offsetHeight-162
        this.getList()
        this.getGroupList()
    },
    methods:{
    getGroupList(){   // 获取所有设备分组
        this.listLoading=true
        api.getGroupListPagination({params:{userId:this.$store.getters.usercode,}}).then(res=>{
                this.grouplist=res
        }).catch(err=>{
            this.$message.error(err.message);
        })
    },
    getList(){  // 获取所有设备
        this.listxian=[]
        let data = {}
            data = {params:{
                    pageSize:this.page.size,
                    pageNo:this.page.index-1,
                    userId:this.$store.getters.usercode,
                    imei: this.search,
                    deviceGroupId: this.selegroup
                    }
                   }
        // }
        this.group_sel = ''
        this.listLoading=true
        api.getEqulistnew(data).then(res=>{
            if(res.content.length > 0){
                let arr = res.content
                let a = []
                for(let i = 0;i<arr.length;i++){
                    this.getaddress(arr[i])
                    this.adddizhi.then(res => {
                    a.push(res)
                    this.list = a.sort(function(a,b){
                        return a.createDt < b.createDt ? 1 : -1
                    })
                    this.listxian=this.list
                    }).catch(err => {
                      this.list.push(res)
                    })
                }
                this.listxian=this.list
                this.listLoading = false
                // that.list = res.content
                this.page.total = res.total
            }else{
                this.$message.error(this.$t('table.temporarily'))
                this.page.total = 0
                this.listLoading = false
            }
        }).catch(_=>{
            this.$message.error(_.message);
            this.listLoading=false
        })
    },
    refresh(){  // 刷新时间
        this.page.index=1
        this.search=''
        this.selegroup = null
        this.getList()
    },
    getRowKeys(row) {
        return row.id
    },
    openDialog(state,obj){
        if(state){
            this.imei=obj.imei
            this.deviceRelationId=obj.deviceRelationId
            this.device_id=obj.device_id
            this.imsi=obj.deviceName
            this.editId=obj.id
            this.morengroup = obj.groupName
            this.userName = obj.childUserName
            this.region = obj.abroad.toString()
            this.group_sel = obj.groupId
            this.user_sel = obj.childUserId
            if(obj.deviceType == 'Default device' || obj.deviceType == '默认类型'){
              this.bind_mode = this.$t('table.defaultdevice')
            }
            console.log(this.bind_mode)
        }else{
            this.imei=''
            this.imsi=''
            this.device_id=''
            this.bind_mode=this.$t('table.defaultdevice')
            this.model=''
            this.name=''
            this.group_sel=''
            this.editId=-1
            this.user_sel =''
        }
        this.isEdit=state
        this.dialogState=true
        api.getGroupListPagination({params:{
            userId:this.$store.getters.usercode,
            pageSize:100000,
            pageNo:this.page.index-1}}).then(_=>{ 
            if(_.content.length > 0){
                this.grouplist=_.content
            }else{
                this.$message.error(this.$t('table.faillist'));
            }
        }).catch(_=>{
            this.$message.error(_.message);
        })
        api.getUsersListPagination({      //获取用户
            params:{
                parentId:this.$store.getters.usercode,
                pageSize:this.page.size,
                pageNo:0,
                pageSize: 200,
            }
        }).then(_=>{
            if(Array.isArray(_.content)){
                this.userlist=_.content
                //this.filterSearch()
            }else{
                this.$message.error(this.$t('table.nouser'));
            }
        }).catch(err=>{
            this.$message.error(err.message);
        })
    },
    handleSelectionChange(val) {
        this.checklist = val
        this.multipleSelection = this.checklist;
    },
    confirmAdd(){
        if(this.imei.length==''){
            this.$message({
                type: 'warning',
                message: this.$t('table.inputno')
            });
            return
        }
        // console.log(this.bind_mode)
        // let equtype = this.bind_mode == '1' ? this.$t('table.defaultdevice'):this.bind_mode == '2' ? 'CoAP/NB-IoT' : this.bind_mode == '3' ? 'UDP/2G' :this.bind_mode == '4' ? 'TCP/4G' :
        // this.bind_mode == '5' ? this.$t('table.lora') :this.bind_mode == '6' ? this.$t('table.ble') : this.bind_mode
        if(this.isEdit){    //编辑
            let data={
                childId: this.user_sel,
                deviceGroupId: this.group_sel,
                deviceImei: this.imei,
                deviceName: this.imsi,
                deviceRelationId: this.deviceRelationId,
                deviceType: this.bind_mode,
                abroad: this.region == 'true' ? true : this.region == 'false' ? false : ''
            }
            this.addOrEditLoading=true
            api.equEdit(data).then(_=>{
                if(_){
                    this.$message({
                        type: 'success',
                        message: this.$t('message.changesuc')
                    });
                    this.user_sel = null
                    this.dialogState=false
                    this.getList()
                    this.addOrEditLoading=false
                }else{
                    return Promise.reject()
                }
            }).catch(_=>{
                this.$message({
                    type: 'error',
                    message: _.message
                });
                this.addOrEditLoading=false
            })
        }else{        //添加设备
            if(this.list.filter(obj=>obj.imei==this.imei).length){
                this.$message({
                    type: 'warning',
                    message: this.$t('message.existed')
                });
                return
            }
            let data={
                childId: this.user_sel,
                deviceGroupId: this.group_sel,
                deviceImei: this.imei,
                deviceName: this.imsi,
                deviceType: this.bind_mode,
                userId: this.$store.getters.usercode,
                abroad: this.region == 'true' ? true : this.region == 'false' ? false : ''
            }
            this.addOrEditLoading=true
            api.equAdd(data).then(_=>{
                if(_.id){
                    this.$message({
                        type: 'success',
                        message: this.$t('message.addsuc')
                    });
                    this.dialogState=false
                    this.getList()
                    this.addOrEditLoading=false
                }else{
                    return Promise.reject()
                }
            }).catch(_=>{
                this.$message({
                    type: 'error',
                    message: _.message
                });
                this.addOrEditLoading=false
            })
        }
    },
    deleteEqu(id){
        this.$confirm('删除后无法恢复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            api.equDelete(id).then(_=>{
                    this.$message({
                        type: 'success',
                        message: this.$t('message.delesuc')
                    });
                    this.getList()
            }).catch(_=>{
                this.$message({
                    type: 'danger',
                    message: _.message
                });
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: this.$t('message.undele')
            });          
        });
    },
    handleClose(){
        this.dialogState=false
    },
    electTo(val) {
        this.$router.push({path:'/electric/electric',query:{imei:val.imei,lon:val.lon,lat:val.lat}})
    },
    selectOperation(val,data) {
        switch(val) {
        case '1':
        // this.ShowAdd = true;
        // this.addoredit = false;
        this.region = null,
        this.openDialog(true,data)
        break;
        case '2':
        this.showInfo = true;
        this.oneInfo = data
        this.showequview(data)
        break;
        case '3':
        this.imei = data.imei
        this.id = data.deviceId
        this.frequency = null
        this.dialogTableVisible = true;
        // this.sendData(data)
        break;
        case '4':
        this.dialogTableorder = true;
        this.historyOrder(data)
        break;
        case '5':
        this.showcompet = true;
        this.Competinfo = data.competingInformation
        break;
        case '6':
        this.deleteEqu(data.deviceRelationId)
        break;
        case '8':
          this.showaladata = true
          this.alaloading = true
          this.alaimei = data
          this.aladata2 = []
          this.datatype = ''
          this.dataendtime = ''
          this.datastarttime = ''
          this.getAla(data)
          break;
        }
    },
    sendTime() {
       if(this.frequency == 19){
           this.value1 = ''
       }else{
           if(this.value1 < 30 && this.value1 > 86400){
               this.$message.error(this.$t('message.errordata'))
           }else{
               this.value1 = this.value1
           }
       }
       let data = {
            deviceId:this.id,
            imei:this.imei,
        }
       if(this.frequency ==15 || this.frequency ==35 || this.frequency ==36|| this.frequency ==37|| this.frequency ==38|| this.frequency ==39|| this.frequency ==40){
           let a = {}
           a[this.frequency] = this.updata.toString() + ',' +this.updata2.toString()
           data.orders = a
       }else{
           let a = {}
           a[this.frequency] = this.updata.toString()
           data.orders = a
       }
        api.sendorder(data).then(res => {
            this.$message.success(this.$t('message.sendsuc'))
            this.dialogTableVisible = false
        }).catch( err =>{
            this.$message.error(err.message)
        })
    },
    historyOrder(scop){
        if(scop){
            this.hisimei = scop.imei
        }
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
    changeindex2(val){                                //改变当前页
            this.pages.No=val
            this.historyOrder()
        },
    getAla(val) {   //获取报警信息
      let data = {
          endTime:this.dataendtime,
          imei:val.imei,
          pageNo:this.page3.index-1,
          pageSize:this.page3.size,
          Type:this.datatype,
          startTime:this.datastarttime,
        }
      api.getMessageListPagination({params:data}).then(res=>{
          this.aladata2 = res.content
          this.page3.total = res.total
          this.alaloading = false
        }).catch(err=>{
          this.$message.error(err.message)
          this.alaloading = false
        })
    },
    changeindex3(val) { // 改变当前页
      this.page3.index = val
      try {
        this.getAla(this.alaimei)
      } catch (res) {
        this.$message.error(err.message)
      }
    },
    toRouter(val,data) {
        let nameloc=this.$t('route.Location')
        let nametra=this.$t('route.Trajectory')
      if(val == 0){
        this.$router.push({name:'route.Trajectory',params: {imei:data.imei}})
      }else{
        this.$router.push({name:'route.Location',params: {imei:data}})
      }
    },
    getaddress (val) {
      var myGeo = new BMap.Geocoder();      
      // 根据坐标得到地址描述  
      return this.adddizhi = new Promise( function(resolve, reject){
        myGeo.getLocation(new BMap.Point(val.lon, val.lat), function(result){
          if (result){
            if(result.address ){
              val['address'] = result.address 
              resolve( val );
            }else{
              val['address'] = '--'
              resolve( val );
            }
          }else{
              val['address'] = '--'
             reject(val);
          }
        })
      })
    },
    editstate(val){  //处理报警信息
      api.getMessageChuli(val.id).then(res => {
        this.$message.success(this.$t('message.changesuc'))
        this.showaladata = false
        this.getAla(val)
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    openMore() {
      this.morewin = true
      this.group_sel = ''
      this.fileList = []
    },
    beforeUpload(file) {
      let fd = new FormData();
      fd.append('file',file);//传文件
        //   fd.append('type',this.infoEqu.region)//其他参数
        //   fd.append('deviceType',this.infoEqu.radio)//其他参数
        //   fd.append('childId',this.infoEqu.userone)//其他参数
        fd.append('deviceGroup',this.group_sel)//其他参数
      api.addmoreequ(fd).then(res => {
        this.$message.success('添加成功')
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    beforeRemove(file, fileList) {
        this.fileList = []
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    adddMore() {
      this.morewin = false
      this.getList()
      this.fileList = []
    },
    showequview(data) {   //查询该设备所有用户
       api.getowern(data.imei).then(res => {
         this.oneInfo.user = res
         this.ueserlevel = res
         console.log( this.oneInfo.user)
    }).catch(err => {})
     
    },
    outFile2(){      //导出告警数据
      // if(this.seltype==0){
      //     this.seltype = null
      //   }
      api.downalalist({params:{
          alarmType:this.datatype,
          endTime:this.dataendtime,
          imei:this.alaimei.imei,
          startTime:this.datastarttime},
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
    },
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
    },
    order(val){
        return order(val)
    }
  }
}
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
<style>
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
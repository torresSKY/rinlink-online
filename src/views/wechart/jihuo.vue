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
                <el-col :span="4">
                    <el-select v-model="selestate" :placeholder="$t('view.inputstate')">
                        <el-option value="1" :label="$t('view.homeon2')"></el-option>
                        <el-option value="-1" :label="$t('view.homeoff2')"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                      <el-button class="butsearch" @click="getList()">{{$t('button.search')}}</el-button>
                      <el-button class="butresh" @click="refresh">{{$t('button.refresh')}}</el-button>
                      <el-button class="butadd" @click="openDialog(false)" >{{$t('button.add')}}</el-button>
                </el-col>
                <el-col :span="6" style="text-align: right;">
                    <el-button class="butadd" @click="openMore()" style="width:110px;">{{$t('button.addpiliang')}}</el-button>
                    <el-button class="butadd" @click="download()" style="width:110px;">{{$t('button.download')}}</el-button>
                </el-col>
            </el-row>
            <div style="margin:10px 0;">
              <el-scrollbar :style="{height:height-150+'px'}" ref="scroll">
                <el-table class="particular-table" :data="listxian" :row-class-name="tableRowClassName" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}" @selection-change="handleSelectionChange">
                    <el-table-column align='center' prop="deviceName" :label="$t('table.Device')" show-overflow-tooltip></el-table-column>
                    <el-table-column align='center' prop="imei" :label="$t('table.imei')" show-overflow-tooltip></el-table-column>
                    <el-table-column align='center' prop="groupName" :label="$t('table.groupname')" show-overflow-tooltip></el-table-column>
                    <el-table-column align='center' prop="deviceModel" :label="$t('table.model')" show-overflow-tooltip></el-table-column>
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
                    <el-table-column align='center' :label="$t('view.inputstate2')" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.isOnline == 1 ? $t('view.homeon2') : $t('view.homeoff2')}}
                        </template>
                    </el-table-column>
                    <el-table-column align='center' prop="address" :label="$t('table.Detailed')" show-overflow-tooltip></el-table-column>
                    <el-table-column align='center' prop="" :label="$t('button.shewei')">
                        <template slot-scope="scope">
                            <el-button @click="electTo(scope.row)" type="text" >{{$t('button.shewei')}}</el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column align='center' prop="createDt" :label="$t('table.addtime')" show-overflow-tooltip></el-table-column> -->
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
                                <el-dropdown-item command="9" v-if="scope.row.deviceModel == 'D600N'">{{$t('route.Data')}}</el-dropdown-item>
                                <!-- <el-dropdown-item command="5">{{$t('table.Competinfo')}}</el-dropdown-item> -->
                                <!-- <el-dropdown-item command="10">{{$t('table.operLog')}}</el-dropdown-item> -->
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
                    :total="page.total"
                    style="text-align:center;margin-top:10px">
                </el-pagination>
                <!-- :disabled="search?true:false" -->
            </div>
        </el-card>
     </el-card>
        <!-- 添加/编辑设备 -->
        <el-dialog width="40%" :title="isEdit?$t('table.changeinfo'):$t('route.Add')" :visible.sync="dialogState" :before-close="handleClose">
            <el-form :rules="inputRules" :model="ruleForm" ref="ruleForm" label-width="100px">
                <el-form-item :label="$t('table.imei')+':'" prop="imei">
                   <el-input v-model="ruleForm.imei" :disabled="isEdit" maxlength='15'></el-input>
                </el-form-item>
                <el-form-item :label="$t('table.Device')+':'" prop="imsi">
                   <el-input v-model="ruleForm.imsi" maxlength='20'></el-input>
                </el-form-item>
                <el-form-item :label="$t('table.equgroup')+':'" prop="group_sel">
                    <el-select v-model="ruleForm.group_sel" :placeholder="morengroup" >
                        <el-option v-for="item in grouplist" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('table.model')+':'" prop="model">
                    <el-select v-model='ruleForm.model'>
                      <el-option v-for='item in equmodel' :key='item.index' :value='item.value' :name='item.name'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('table.touser')+':'" prop="user_sel">
                    <el-select v-model="ruleForm.user_sel" :placeholder="userName" >
                        <el-option v-for="item in userlist" :key="item.id" :label="item.username" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item :label="$t('view.region')+':'" prop="region">
                    <el-select v-model="ruleForm.region" :placeholder="$t('view.region')" >
                        <el-option :label="$t('view.region0')" value="true" key='0'></el-option>
                        <el-option :label="$t('view.region1')" value="false" key='1'></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item :label="$t('table.carNo')+':'" prop="carNo">
                   <el-input v-model="ruleForm.carNo"></el-input>
                </el-form-item>
                <!-- <label class="el-form-item__label">{{$t('table.imei')}}:</label>
                <el-input v-model="imei" :disabled="isEdit" :rules="inputRules"></el-input> -->
                <!-- <label class="el-form-item__label">{{$t('table.Device')}}:</label>
                <el-input v-model="imsi"></el-input> -->
                <!-- <label class="el-form-item__label" >{{$t('table.equgroup')}}:</label>
                <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                    <el-select v-model="group_sel" :placeholder="morengroup" >
                        <el-option v-for="item in grouplist" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div> -->
                <!-- <label class="el-form-item__label">{{$t('table.model')}}:</label>
                <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                  <template>
                    <el-select v-model='model'>
                      <el-option v-for='item in equmodel' :key='item.index' :value='item.value' :name='item.name'></el-option>
                    </el-select>
                  </template>
                </div> -->
                <!-- <label class="el-form-item__label" >{{$t('table.touser')}}</label>
                <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                    <el-select v-model="user_sel" :placeholder="userName" >
                        <el-option v-for="item in userlist" :key="item.id" :label="item.username" :value="item.id"></el-option>
                    </el-select>
                </div> -->
                <!-- <label class="el-form-item__label" >{{$t('view.region')}}:</label>
                <div style="width: 100%;display: inline-block;position: relative;margin-bottom:10px;">
                    <el-select v-model="region" :placeholder="userName" >
                        <el-option :label="$t('view.region0')" value="true" key='0'></el-option>
                        <el-option :label="$t('view.region1')" value="false" key='1'></el-option>
                    </el-select>
                </div> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">{{$t('button.cancel')}}</el-button>
                <!-- <el-button type="primary" @click="confirmAdd" :disabled="[0,1].filter(res=>res==roles).length!==0 && isEdit" :loading="addOrEditLoading">{{[0,1].filter(res=>res==roles).length!==0 && isEdit?'无修改权限':'确认'}}</el-button> -->
                <el-button type="primary" @click="confirmAdd"  >{{$t('button.determine')}}</el-button>
            </span>
        </el-dialog>
       <!-- 下发指令 -->
       <el-dialog :title="$t('table.addsend')" :visible.sync="dialogTableVisible" width="42%">
           <el-form :inline="true">
               <el-form-item label="设备名称" >
                    <el-input v-model="deviceName" disabled></el-input>
                </el-form-item>
                <el-form-item label="GUID" >
                    <el-input v-model="imei" disabled></el-input>
                </el-form-item>
                <el-row>
                    <el-form-item :label="$t('button.send')"></el-form-item>
                </el-row>
                
                <el-row>
                    <el-col :span="6">
                        <el-select v-model="useritem" :placeholder="$t('view.select2')" @change="chooseType">
                            <el-option v-for='item in modellist' :key="item.val" :label="item.name" :value="item.val">
                            </el-option>
                        </el-select>    
                    </el-col>
                    <el-col :span="8" :offset="1">
                        <el-input clearable v-if="useritem == 1||useritem == 39||useritem == 41||useritem == 44
                        ||useritem == 48||useritem == 85||useritem == 86||useritem==94||useritem==128
                        ||useritem==129||useritem==130" type="number"  
                        v-model="intervalTime" :placeholder="$t('table.randomdata')" ></el-input>

                        <el-input clearable v-if="useritem == 16
                        ||useritem == 131||useritem == 78"  
                        v-model="inputContent" :placeholder="$t('table.inputtext')" ></el-input>
                        
                    </el-col>
                    <el-col :span='12' :offset="1" v-if="useritem == 19||useritem == 23 ">
                        <el-col :span="24">
                            <el-form-item :label="$t('table.params22')" >
                              <el-input v-model="inputContent"  :placeholder="$t('table.inputtext')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" style="margin-top:10px">
                            <el-form-item :label="$t('table.params5')" >
                              <el-input v-model="inputPort"  :placeholder="$t('table.inputtext')"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12" :offset="1" v-if="useritem == 32 ">
                        <el-radio v-model="open" label="0" style="line-height:40px">{{$t('table.strategy1')}}</el-radio>
                        <el-radio v-model="open" label="1" style="line-height:40px">{{$t('table.strategy2')}}</el-radio>
                        <el-radio v-model="open" label="2" style="line-height:40px">{{$t('table.strategy3')}}</el-radio>
                    </el-col>
                    <el-col :span="12" :offset="1" v-if="useritem == 50 ">
                        <el-radio v-model="open1" label="0" style="line-height:40px">{{$t('table.model1')}}</el-radio>
                        <el-radio v-model="open1" label="1" style="line-height:40px">{{$t('table.model2')}}</el-radio>
                        <el-radio v-model="open1" label="2" style="line-height:40px">{{$t('table.model3')}}</el-radio>
                    </el-col>
                    <el-col :span='12' :offset="1" v-if="useritem == 93 ">
                        <el-col :span="22">
                            <el-form-item :label="$t('table.pengTime')"  >
                              <el-input v-model="touchTime" type="number" :placeholder="$t('table.randomdata')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="22">
                            <el-form-item :label="$t('table.pengSpeed')" >
                              <el-input v-model="touchSpeed" type="number" :placeholder="$t('table.randomdata')"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="12" :offset="1" v-if="useritem == 132 ">
                        <el-select v-model="cardtype" :placeholder="$t('view.select2')" >
                            <el-option v-for='item in cardlist' :key="item.val" :label="item.name" :value="item.val">
                            </el-option>
                        </el-select>   
                    </el-col>
                </el-row>
                    
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
                <el-table-column align='center' prop="cmdIdHexStr" :label="$t('table.orderCode')">
                    <template slot-scope="scope">
                        {{scope.row.cmdIdHexStr}}
                    </template>
                </el-table-column>
                <el-table-column align='center' prop="cmdType" :label="$t('table.zhitype')">
                    <template slot-scope="scope">
                        {{scope.row.cmdType}}
                    </template>
                </el-table-column>
                <el-table-column align='center' prop="data" :label="$t('table.zhidata')">
                    <template slot-scope="scope">
                        {{scope.row.data}}
                    </template>
                </el-table-column>
                <el-table-column align='center' prop="createAt" :label="$t('table.creattime')" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.createAt | formatDate}}
                    </template>
                </el-table-column>
                <el-table-column align='center' prop="status" :label="$t('table.jie')">
                    <template slot-scope="scope">
                        {{scope.row.cmdState == 0 ? $t('table.wait') :scope.row.cmdState == 1 ? $t('table.addsend'):scope.row.cmdState == 2 ?$t('message.success'):scope.row.cmdState == 3 ?$t('message.fail'):''}}
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
       <!-- 系统操作日志 -->
       <el-dialog :title="$t('table.operLog')" :visible.sync="dialogLogdata">
            <el-row>
                <el-col :span="3" class="sendcode" style="line-height:40px">
                    <span>{{$t('table.seachtime')}}</span>
                </el-col>
                <el-col :span="5">
                    <el-date-picker v-model="logStarttime" type="datetime" :placeholder="$t('table.selopentime')" default-time="00:00:00" value-format="timestamp" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col>
                <el-col :span="5" :offset="1">
                    <el-date-picker v-model="logEndtime" type="datetime" :placeholder="$t('table.selendtime')" default-time="23:59:59" value-format="timestamp" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col>
                <el-col :span="1.5" :offset="1">
                    <el-button @click="getLog()">{{$t('button.search')}}</el-button>
                </el-col>
            </el-row>
            <el-table :data="logList">
                    <el-table-column align='center' prop="imei" :label="$t('table.imei')"></el-table-column>
                    <el-table-column align='center' prop="heart" :label="$t('table.heart')"></el-table-column>
                    <el-table-column align='center' prop="step" :label="$t('table.step')"></el-table-column>
                    <el-table-column align='center' prop="collectDt" :label="$t('table.creattime')"></el-table-column>
            </el-table>
            <el-pagination
                    @current-change="changeindex6"
                    :current-page.sync="pages.No"
                    :page-size="pages.size"
                    layout="total, prev, pager, next ,jumper"
                    :total="pages.total"
                    style="text-align:center;margin-top:10px">
            </el-pagination>
       </el-dialog>
       <!-- 历史数据 -->
       <el-dialog :title="$t('route.Data')" :visible.sync="dialogTabledata">
           <el-tabs v-model="datacard" type="card" >
            <el-tab-pane :label="$t('table.list')" name="first">
                <el-row>
                <el-col :span="3" class="sendcode">
                        <span>{{$t('table.seachtime')}}</span>
                </el-col>
                <el-col :span="5">
                        <el-date-picker v-model="alastarttime" type="datetime" :placeholder="$t('table.selopentime')" default-time="00:00:00" value-format="timestamp" :picker-options="pickerOptions">
                        </el-date-picker>
                </el-col>
                <el-col :span="5">
                        <el-date-picker v-model="alaendtime" type="datetime" :placeholder="$t('table.selendtime')" default-time="23:59:59" value-format="timestamp" :picker-options="pickerOptions">
                        </el-date-picker>
                </el-col>
                <el-col :span="1.5">
                        <el-button @click="getData(dataVal)">{{$t('button.search')}}</el-button>
                </el-col>
                </el-row>
                <el-table :data="datalist">
                    <el-table-column align='center' prop="imei" :label="$t('table.imei')"></el-table-column>
                        <el-table-column align='center' prop="heart" :label="$t('table.heart')"></el-table-column>
                        <el-table-column align='center' prop="step" :label="$t('table.step')"></el-table-column>
                        <el-table-column align='center' prop="collectDt" :label="$t('table.creattime')"></el-table-column>
                </el-table>
                <el-pagination
                        @current-change="changeindex4"
                        :current-page.sync="pages.No"
                        :page-size="pages.size"
                        layout="total, prev, pager, next ,jumper"
                        :total="pages.total"
                        style="text-align:center;margin-top:10px">
                </el-pagination>
            </el-tab-pane>
            <el-tab-pane :label="$t('table.chart')" name="second">
            <div id="chart" class="qufen" :style="{width:width *0.5 + 'px',height:'500px'}"></div>
            </el-tab-pane>
        </el-tabs>
           
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
                <el-form-item style="margin: 0;"><span>{{$t('table.model')}} : {{oneInfo.deviceModel}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.equadmin')}} : {{oneInfo.userName}}</span></el-form-item>
                <!-- <el-form-item style="margin: 0;"><span>{{$t('view.region')}} : {{oneInfo.abroad==true?$t('view.region0'):$t('view.region1')}}</span></el-form-item> -->
                <el-form-item style="margin: 0;"><span>{{$t('table.equlocation')}} : {{oneInfo.positionType==1?"GPS":oneInfo.positionType==2?"WIFI":$t('table.equloctype')}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.Detailed')}} : {{oneInfo.address}}</span></el-form-item>
                <el-form-item style="margin: 0;"><span>{{$t('table.carNo')}} : {{oneInfo.plate}}</span></el-form-item>
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
                    <el-select v-model="datatype" :placeholder="$t('table.inputele')">
                      <el-option v-for='item in alatypelist' :value='item.value' :label="item.name" :key='item.value' ></el-option>
                      <!-- <el-option :label="$t('table.moveala')" :value="2"></el-option>
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
                      <el-option :label="$t('table.in')" :value="13"></el-option>   -->
                    </el-select>
                </el-col>
                <el-col :span="2" class="sendcode">
                    <span style='line-height: 40px;'>{{$t('table.seletime')}}</span>
                </el-col>
                <el-col :span="5">
                    <el-date-picker v-model="datastarttime" type="date" :placeholder="$t('table.startdata')" format="yyyy-MM-dd" value-format="timestamp" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col>
                <el-col :span="5">
                    <el-date-picker v-model="dataendtime" type="date" :placeholder="$t('table.enddata')" format="yyyy-MM-dd" value-format="timestamp" :picker-options="pickerOptions">
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
                     <el-table-column align='center' prop="imei" :label="$t('table.imei')" width="180">
                        </el-table-column>
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
                    <el-form-item :label="$t('table.model')">
                    <el-select v-model='model'>
                      <el-option v-for='item in equmodel' :key='item.index' :value='item.value' :name='item.name'></el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
                </el-row>
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
import { formatDate } from '@/plugins/date.js'
export default{
    name:'jihuo',
    mixins:[mixin],
    computed:{
        ...mapState({user:'user',adminRoles:'roles'})
    },
    data(){
      const validateimei = (rule, value, callback) => {
        //   debugger
         var reg = /^\d{15}$/
        if (!reg.test(value)) {
        callback(new Error(this.$t('message.guid15')))
        }else {
        callback()
        }
      }
     return {
         pickerOptions: {
            disabledDate(time) {
                return time.getTime() > Date.now();
                }
            },
        inputRules: {
            imei: [{ required: true, trigger: 'blur', validator: validateimei }],
            imsi: [{ required: true, message: this.$t('message.devicename'), trigger: 'blur' }],
            model: [{ required: true, message: this.$t('message.modelerror'), trigger: 'change' }],
            // region: [{ required: true, message: this.$t('message.area'), trigger: 'change' }]
        },
        ruleForm:{
            imei:'',
            imsi:'',
            group_sel:'',
            model:'',
            user_sel:'',
            region:'',
            carNo:''
        },
        roles:this.$store.getters.roles,
        height:0,
        list:[],
        listLoading:false,
        addOrEditLoading:false,
        listxian:[],
        search:'',
        imei:'',
        deviceName:'',
        useritem:'',
        intervalTime:'',
        inputContent:'',
        inputPort:'',
        open:'2',
        open1:'1',
        touchTime:'',
        touchSpeed:'',
        modellist: [
            {val: '1', name: this.$t('table.params1')},
            {val: '16', name: this.$t('table.params2')},
            {val: '19', name: this.$t('table.params3')},
            {val: '23', name: this.$t('table.params4')},
            // {val: '24', name: this.$t('table.params5')},
            {val: '32', name: this.$t('table.params6')},
            {val: '39', name: this.$t('table.params7')},
            {val: '41', name: this.$t('table.params8')},
            {val: '44', name: this.$t('table.params9')},
            {val: '48', name: this.$t('table.params10')},
            {val: '50', name: this.$t('table.params11')},
            {val: '85', name: this.$t('table.params12')},
            {val: '86', name: this.$t('table.params13')},
            {val: '93', name: this.$t('table.params14')},
            {val: '94', name: this.$t('table.params15')},
            {val: '128', name: this.$t('table.params16')},
            {val: '129', name: this.$t('table.params17')},
            {val: '130', name: this.$t('table.params18')},
            {val: '131', name: this.$t('table.params19')},
            {val: '132', name: this.$t('table.params20')},
            {val: '78', name: this.$t('table.params21')},
            {val: '4', name: this.$t('table.params23')},
            {val: '5', name: this.$t('table.params24')},
            {val: '100', name: this.$t('table.params25')},
            {val: '101', name: this.$t('table.params26')},
            {val: '102', name: this.$t('table.params27')},
            {val: '103', name: this.$t('table.params28')},
        ],
        cardlist:[
            {val: 1, name: this.$t('table.blue')},
            {val: 2, name: this.$t('table.yellow')},
            {val: 3, name: this.$t('table.black')},
            {val: 4, name: this.$t('table.white')},
            {val: 9, name: this.$t('table.other')},
        ],
        cardtype:'',
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
        selestate: null,
        region: null,
        morewin: false,
        ueserlevel: [],
        fileList: [],
        alaloading: true,
        updata: '0',
        updata2: 0,
        updata3: 0,
        dialogTabledata: false,
        alastarttime: '',
        alaendtime: '',
        datalist: [],
        datacard: 'first',
        width: 0,
        dataVal: null,
        dialogLogdata:false,
        logStarttime:null,
        logEndtime:null,
        logList:[]
      }
    },
    mounted(){
        this.height=document.body.offsetHeight-162
         this.width=document.body.offsetWidth
        this.getList()
        this.getGroupList()
    },
    methods:{
    getGroupList(){   // 获取所有设备分组
        this.listLoading=true
        api.getGroupListPagination({params:{userId:this.$store.getters.usercode,pageNo:0,pageSize:10000}}).then(res=>{
                this.grouplist=res.content
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
                    deviceGroupId: this.selegroup,
                    isOnline: this.selestate,
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
    getOrder(){
        api
          .getOrder(this.imei)
          .then(res => {
            // let arr = []
            // for (let i in res) {
            //   let item = {}
            //   item.val = i
            //   arr.push(item)
            // }
            // this.modellist = arr
            // console.log(this.modellist)
          })
          .catch(err => {
            this.$message.error(err.message)
          })
    },
    refresh(){  // 刷新时间
        this.page.index=1
        this.search=''
        this.selegroup = null
        this.selestate = null,
        this.getList()
    },
    getRowKeys(row) {
        return row.id
    },
    openDialog(state,obj){
        if(state){
            // debugger
            this.ruleForm={
                imei:obj.imei,
                imsi:obj.deviceName,
                group_sel:obj.groupId,
                model:obj.deviceModel,
                user_sel:obj.childUserId,
                region:obj.abroad,
                carNo:obj.plate
            }
            this.imei=obj.imei
            this.deviceRelationId=obj.deviceRelationId
            this.device_id=obj.device_id
            this.imsi=obj.deviceName
            this.editId=obj.id
            this.morengroup = obj.groupName
            this.userName = obj.childUserName
            this.region = obj.abroad
            this.group_sel = obj.groupId
            this.user_sel = obj.childUserId
            this.model = obj.deviceModel
            if(obj.deviceType == 'Default device' || obj.deviceType == '默认类型'){
              this.bind_mode = this.$t('table.defaultdevice')
            }
        }else{
            this.ruleForm={
                imei:'',
                imsi:'',
                group_sel:'5D2E758127C00000',
                model:'',
                user_sel:'',
                region:'',
                carNo:''
            }
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
        if(this.$refs['ruleForm']){
            this.$refs['ruleForm'].resetFields()
        }
        this.isEdit=state
        this.dialogState=true
        api.getGroupListPagination({params:{
            userId:this.$store.getters.usercode,
            pageSize:100000,
            pageNo:0}}).then(_=>{ 
            if(_.content.length > 0){
                this.grouplist=_.content
            }else{
                this.$message.error(this.$t('table.faillist'));
            }
        }).catch(_=>{
            this.$message.error(_.message);
        })
        var that =this
        api.getUsersListPagination({      //获取用户
            params:{
                parentId:this.$store.getters.usercode,
                pageSize:this.page.size,
                pageNo:0,
                pageSize: 2000,
            }
        }).then(res=>{
            if(res.content){
                that.userlist=res.content
                //this.filterSearch()
                if(state){
                    // debugger
                    let id = res.content.filter((item) => {
                      if(that.userName&&(that.userName==item.username)){
                            return item.id
                        }
                    })    
                    if(id[0]){
                        that.ruleForm.user_sel=id[0].id
                    }
                    
                }
                
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
        if(this.ruleForm.imei.length==''){
            this.$message({
                type: 'warning',
                message: this.$t('table.inputno')
            });
            return
        }
        this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
        // console.log(this.bind_mode)
        // let equtype = this.bind_mode == '1' ? this.$t('table.defaultdevice'):this.bind_mode == '2' ? 'CoAP/NB-IoT' : this.bind_mode == '3' ? 'UDP/2G' :this.bind_mode == '4' ? 'TCP/4G' :
        // this.bind_mode == '5' ? this.$t('table.lora') :this.bind_mode == '6' ? this.$t('table.ble') : this.bind_mode
        if(this.isEdit){    //编辑
            let data={
                childId: this.ruleForm.user_sel,
                deviceGroupId: this.ruleForm.group_sel,
                deviceImei: this.ruleForm.imei,
                deviceName: this.ruleForm.imsi,
                deviceRelationId: this.deviceRelationId,
                // deviceType: this.bind_mode,
                deviceModel: this.ruleForm.model,
                abroad: this.ruleForm.region == 'true' ? true : this.ruleForm.region == 'false' ? false : ''
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
            if(this.list.filter(obj=>obj.imei==this.ruleForm.imei).length){
                this.$message({
                    type: 'warning',
                    message: this.$t('message.existed')
                });
                return
            }
            let data={
                childId: this.ruleForm.user_sel,
                deviceGroupId: this.ruleForm.group_sel,
                deviceImei: this.ruleForm.imei,
                deviceName: this.ruleForm.imsi,
                // deviceType: this.bind_mode,
                deviceModel: this.ruleForm.model,
                userId: this.$store.getters.usercode,
                abroad: this.ruleForm.region == 'true' ? true : this.ruleForm.region == 'false' ? false : '',
                plate:this.ruleForm.carNo
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

        } else {
            this.$message({
                type: 'warning',
                message: this.$t('message.checkmsg')
            })
            return false;
          }
        })
    },
    deleteEqu(id){
        this.$confirm(this.$t('message.equdele'), this.$t('message.newtitle'), {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.cancel'),
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
        this.$refs['ruleForm'].resetFields()
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
        this.deviceName=data.deviceName
        this.id = data.deviceId
        this.updata = '0'
        this.updata2 = 0
        this.updata3 = 0
        console.log(data,'aaa')
        // this.getOrder()
        this.model = data.deviceModel
        this.frequency = null
        this.useritem=''
        this.intervalTime=''
        this.inputContent=''
        this.open='2'
        this.open1='1'
        this.touchTime=''
        this.touchSpeed=''
        this.inputPort=''
        this.cardtype=''
        this.dialogTableVisible = true;
        // this.sendData(data)
        break;
        case '4':
        this.pages.No=1
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
          this.page3.index = 1
          this.aladata2 = []
          this.datatype = ''
          this.dataendtime = ''
          this.datastarttime = ''
          this.getAla(data)
          break;
        case '9':
          this.dialogTabledata = true
          this.pages.No = 1
          this.alastarttime = ''
          this.alaendtime = ''
          this.dataVal = data
          this.getData(data)
          this.getchart(data)
          break;
        case '10':
            this.pages.No = 1 
            this.logStarttime=null
            this.logEndtime=null
            this.logList=[]
            this.dialogLogdata=true
        }
    },
    chooseType(val){
        if(val){
            this.intervalTime=''
            this.inputContent=''
            this.open='2'
            this.open1='1'
            this.touchTime=''
            this.touchSpeed=''
            this.inputPort =''
            this.cardtype=''
        }
    },
    sendTime() {
        // debugger
        let data=null
        if(this.useritem==1||this.useritem == 39||this.useritem == 41||this.useritem == 44
            ||this.useritem == 48||this.useritem == 85||this.useritem == 86||this.useritem==94
            ||this.useritem==128||this.useritem==129||this.useritem==130){
            if((this.useritem == 39||this.useritem == 41||this.useritem == 44)&&this.intervalTime<=0){
                this.$message.error(this.$t('message.fanwei4'))
                return
            }
            if(this.useritem == 48&&(this.intervalTime<=0||this.intervalTime>=180)){
                this.$message.error(this.$t('message.fanwei5'))
                return
            }
            if((this.useritem==129||this.useritem==130)&&(this.intervalTime<1||this.intervalTime>255)){
                this.$message.error(this.$t('message.fanwei7'))
                return
            }
            if(!this.intervalTime){
                this.$message.error(this.$t('message.canshu'))
                return
            }
            data={
                imei:this.imei,
                paramId:this.useritem,
                obj:this.intervalTime
            }
        }else if(this.useritem == 19||this.useritem == 23){
             if(!this.inputContent||!this.inputPort){
                this.$message.error(this.$t('message.canshu'))
                return
            }
            data={
                imei:this.imei,
                paramId:this.useritem,
                obj:[this.inputContent,this.inputPort].join()
            }
        }else if(this.useritem == 16||this.useritem == 131){
            if(!this.inputContent){
                this.$message.error(this.$t('message.canshu'))
                return
            }
                data={
                imei:this.imei,
                paramId:this.useritem,
                obj:this.inputContent
            }
        }else if(this.useritem == 132){
            if(!this.cardtype){
                this.$message.error(this.$t('message.canshu'))
                return
            }
                data={
                imei:this.imei,
                paramId:this.useritem,
                obj:this.cardtype
            }
        }else if(this.useritem == 32){
            data={
                imei:this.imei,
                paramId:this.useritem,
                obj:this.open
            }
        }else if(this.useritem == 50){
            data={
                imei:this.imei,
                paramId:this.useritem,
                obj:this.open1
            }
        }else if(this.useritem == 93){
            if(!this.touchTime||!this.touchSpeed){
                this.$message.error(this.$t('message.canshu'))
                return
            }
            if(this.touchTime<0||this.touchTime>255){
                this.$message.error(this.$t('message.fanwei6'))
                return
            }
            if(this.touchSpeed<0||this.touchSpeed>79){
                this.$message.error(this.$t('message.fanwei8'))
                return
            }
            data={
                imei:this.imei,
                paramId:this.useritem,
                obj:[this.touchTime,this.touchSpeed].join()
            }
        }else if(this.useritem == 4||this.useritem == 5||this.useritem == 100
        ||this.useritem == 101||this.useritem == 102||this.useritem == 103){
            //   data={
            //     imei:this.imei,
            //     paramId:this.useritem,
            //     obj:''
            // }
             api.sendControl(this.imei,this.useritem).then(res => {
                 this.$message.success(this.$t('message.sendsuc'))
                 this.dialogTableVisible = false
                 
              }).catch( err =>{
                  // console.log(err)
                   this.$message.error(err.message)
              })
              return
        }else if(this.useritem == 78){

              api.sendInform({params:{
                content:this.inputContent,
                type:78,
                imei:this.imei
            }}).then(res => {
                 this.$message.success(this.$t('message.sendsuc'))
                 this.dialogTableVisible = false
                 
              }).catch( err =>{
                  // console.log(err)
                   this.$message.error(err.message)
              })
              return
        }
        api.sendOrder(data).then(res => {
            this.$message.success(this.$t('message.sendsuc'))
            this.dialogTableVisible = false
        }).catch( err =>{
            // console.log(err)
            this.$message.error(err.message)
        })
    //    if(this.frequency == 19){
    //        this.updata = ''
    //    }
    //     if(this.frequency == 43){
    //        this.updata = this.updata3
    //    }
    //    if(this.frequency == 44 || this.frequency == 45 || this.frequency == 10){
    //        if(this.updata < 30 || this.updata > 86400){
    //            this.$message.error(this.$t('message.errordata'))
    //            return
    //        }else{
    //            this.updata = this.updata
    //        }
    //    }
    //    if(this.frequency == 46 && this.updata == 1){
    //        if(this.updata2 < 30 || this.updata2 > 86400){
    //            this.$message.error(this.$t('message.errordata'))
    //            return
    //        }else{
    //            this.updata = this.updata
    //        }
    //    }
    //    if(this.frequency == 11){
    //        if(this.updata < 0 || this.updata > 100){
    //            this.$message.error(this.$t('message.errordata2'))
    //            return
    //        }else{
    //            this.updata = this.updata
    //        }
    //    }
    //    let data = {
    //         deviceId:this.id,
    //         imei:this.imei,
    //     }
    //    if(this.frequency ==15 || this.frequency ==35 || this.frequency ==36|| this.frequency ==37|| this.frequency ==38|| this.frequency ==39|| this.frequency ==40){
    //        let a = {}
    //        a[this.frequency] = this.updata.toString() + ',' +this.updata2.toString()
    //        data.orders = a
    //    }else{
    //        let a = {}
    //        a[this.frequency] = this.updata.toString()
    //        data.orders = a
    //    }
    //     api.sendorder(data).then(res => {
    //         this.$message.success(this.$t('message.sendsuc'))
    //         this.dialogTableVisible = false
    //     }).catch( err =>{
    //         this.$message.error(err.message)
    //     })
    },
    getLog(){
        api.queryLog({params:{
            pageNo:this.pages.No-1,
            pageSize:this.pages.size,
            imei:this.imei
            }
        }).then(res =>{
            this.orderlist = res.content
            this.pages.total = res.total;
        }).catch(err =>{
            this.$message.error(err.message)
        })
    },
    historyOrder(scop){
        if(scop){
            this.hisimei = scop.imei
        }
        api.queryOrder({params:{
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
    changeindex4(val){                                //改变当前页
        this.pages.No=val
        // this.page3.index = val
        this.getData(this.dataVal)
    },
    changeindex6(val){                                //改变当前页
        this.pages.No=val
  
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
    getData(val) {
        console.log(val)
        api.getData({params:{
            imei: val.imei,
            pageNo: this.pages.No -1,
            pageSize: this.pages.size,
            startTime: this.alastarttime,
            endTime: this.alaendtime,
        }}).then(res => {
            this.datalist = res.content
            this.pages.total = res.total
        }).catch(err => {})
    },
    getchart(val) {
      let datalist = []
      let histime = []
      let hisdata = []
      let histemp = []
      let datatype='次'
      let datatype2=''
      let text = this.$t('table.charttab')
      api.getData({params:{
            imei: val.imei,
            pageNo: 0,
            pageSize: 10000,
            startTime: this.alastarttime,
            endTime: this.alaendtime,
        }})
        .then(res => {
          if (res.content.length > 0) {
            datalist = res.content
            for (let i = 0; i < datalist.length; i++) {
                histime.push(datalist[i].collectDt);
                hisdata.push(datalist[i].heart);
            }
            var that = this;
            var myChart = this.$echarts.init(document.getElementById("chart"));
            // 绘制图表
            myChart.setOption({
                title: { text: text },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                grid: {  
                    left: '10%',  
                    bottom:'30%', 
                    left:'10%',
                },
                // legend: {
                //     data:[this.$t('table.humidity'),this.$t('table.temperature')]
                // }, 
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 65,
                        end: 75
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 65,
                        end: 75
                    }
                ], 
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: histime,
                    inverse:true,
                    axisLabel: {  
                        interval:50,  
                        rotate:30  
                    }  
                },
                yAxis: {
                    type: "value",
                    name: datatype
                },
                series: [
                    {
                        type: "line",
                        name: 'xinlv',
                        data: hisdata
                    }
                ]
            });
          } else {
            this.$message.error(this.$t('table.temporarily'));
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
      
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
        // debugger
        let nameloc=this.$t('route.Location')
        let nametra=this.$t('route.Trajectory')
      if(val == 0){
        this.$router.push({name:'route.Trajectory',params: {imei:data.imei,deviceName:data.deviceName}})
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
      this.model = ''
      this.fileList = []
    },
    download(){     //到处设备列表
    this.butloading = true
      if(this.selestate == 'null'){
        this.selestate = ''
      }
       api.downlist({
          params:{
              imei: this.writimei,
              isOnline: this.selestate,
              userId: this.$store.getters.usercode,
              deviceGroupId: this.selegroup,
          },
            headers: { 'Content-Type': 'application/json,charset=utf-8'},    
            responseType: 'arraybuffer'}
        ).then(res => {
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
            let name = this.$t('route.List') + y+''+m+''+d+''+h+''+mm+''+hh+'.xls'
            a.download = name;
            a.click()
            window.URL.revokeObjectURL(objectUrl);
        }).catch(err => {
            this.$message.error(err.message)
        })
    },
    beforeUpload(file) {
        if(this.model.length < 1){
            this.$message.error(this.$t('message.modelerror'))
            return
        }
      let fd = new FormData();
      fd.append('file',file);//传文件
        //   fd.append('type',this.infoEqu.region)//其他参数
        //   fd.append('deviceType',this.infoEqu.radio)//其他参数
        //   fd.append('childId',this.infoEqu.userone)//其他参数
        fd.append('deviceGroup',this.group_sel)//其他参数
        fd.append('deviceModel',this.model)//其他参数
      api.addmoreequ(fd).then(res => {
        this.$message.success(this.$t('message.addsuc'))
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
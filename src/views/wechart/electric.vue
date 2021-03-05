<template>
    <div class="app" :style="{height:height +'px',overflow:'hidden' }">
        <el-row>
            <el-col :span='6'>
                <div class="left" :style="{height:height +'px'}">
                    <div class='search'>
                        <div class="search_top">电子围栏</div>
                        <el-row class="select_type_name" :gutter="4" type="flex" align="center">
                            <el-col :span="10">
                                <el-select v-model="select_type_name" placeholder="请选择查询类型" size="small">
                                <el-option key="设备名称/IMEI"  label="设备名称/IMEI" value="设备名称/IMEI"></el-option>
                                <el-option  key="围栏名称" label="围栏名称" value="围栏名称"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="10">
                                <el-input size="small" v-model='fencesearch'></el-input>
                            </el-col>
                            <el-col :span="4">
                                <el-button @click='getele()' size="small" type="primary">{{$t('button.search')}}</el-button>
                            </el-col>
                        </el-row>   
                    </div>
                    <div class="search_content">
                        <div class="search_content_title">
                            <div>{{$t('view.fence1')}}</div>
                            <div @click='showAdd'>添加围栏</div>
                        </div>
                        <div class="search_content_list" v-infinite-scroll>
                            <template v-if='list.length > 0'>
                                <div class='list' v-for='(item,index) in list' :key='item.name'  @click='dowm(index)'>
                                    <div class='elecard' :class = "active == index ? 'addclass' : '' ">
                                        <div class='elecard_item_left' @click='changecrie(item)'>{{item.name}}</div>
                                        <div class="elecard_item_right">
                                            <div>{{$t('view.radius')}}：{{item.radius}}{{$t('view.mi')}}</div>
                                            <div>
                                                <el-image style="width: 16px; height: 16px" :src="require('../../assets/img/list.png')" fit="contain" @click='addlist(item)' :hidden='!showedit'></el-image>
                                                <el-image style="width: 16px; height: 16px" :src="require('../../assets/img/edit.png')" fit="contain" @click='editele(item)' :hidden='!showedit'></el-image>
                                                <el-image style="width: 16px; height: 16px" :src="require('../../assets/img/delet.png')" fit="contain"  @click='deleold(item)'></el-image>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <div class='list' v-else><span style='margin-left:30%;margin-top:200px;color:#909399;'>{{$t('table.temporarily')}}</span></div>
                        </div>
                    </div>
                    
                    <el-card :hidden='addview' class='addele' :style="{height:height+'px'}">
                        <div class='title'>
                            <span v-if='editfen'>{{$t('view.fence6')}}</span>
                            <span v-else>{{$t('view.fence5')}}</span>
                        </div>
                        <div class='addlist'>
                            <span>{{$t('view.fence2')}}</span>
                            <el-input v-model='fenceName' maxlength="20"></el-input>
                        </div>
                        <div class='addlist'>
                            <span>{{$t('view.fence4')}}</span>
                            <el-input id='fenceradio' v-model='address' :placeholder='address2'></el-input>
                        </div>
                        <div class='addlist'>
                            <span>{{$t('view.fence3')}}</span>
                            <el-input v-model='fenceRadio' type="number"></el-input>
                        </div>
                        <div class='addlist'>
                            <span>{{$t('view.fence7')}}</span>
                            <el-checkbox-group v-model="inala">
                                <el-checkbox :label="0" value='0'>{{$t('view.fence8')}}</el-checkbox>
                                <el-checkbox :label="1" value='1'>{{$t('view.fence9')}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class='addlist'>
                            <el-button @click='closeele'>{{$t('view.close')}}</el-button>
                            <el-button class="butsearch" @click='editfen?addEle():editEle2()'>{{$t('button.save')}}</el-button>
                        </div>
                    </el-card>
                </div>
            </el-col> 
            <el-col :span='18'>
                <el-card>
                    <div id="map2" :style="{height:height- 10+'px',overflow:'hidden' }"></div>
                </el-card>
            </el-col>  
        </el-row>
        <!-- 关联设备 -->
        <!-- :visible="relevance_device_flag" -->
        <el-dialog @close="evt_close" class="relevance_device" width="60%" title="关联设备" :visible="!showlist"  top="5vh">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="users">
                        <el-input placeholder="请输入客户名称或账号" size="mini" v-model="input3">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <div class="users_bottom">
                            <el-tree :data="data" :render-content="renderContent"></el-tree>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="devices">
                        <el-input placeholder="IMEI/设备名称" size="mini" v-model="input4">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <div class="devices_bottom">
                            <el-tree
                                :data="data_tree"
                                show-checkbox
                                node-key="id"
                                :default-expanded-keys="[2]"
                                :default-checked-keys="[5]"
                                :props="defaultProps">
                            </el-tree>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="search_device">
                <el-col :span="8">
                    <el-input size="small" placeholder="请输入设备名称/设备IMEI" prefix-icon="el-icon-search" v-model="search_device_key"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-button style="width:100%" size="small" type="primary">搜索</el-button>
                </el-col>
                <el-col :span="3">
                    <el-button size="small" type="danger">取消关联</el-button>
                </el-col>
            </el-row>
            <el-table class="relevance_table" size="mini" :data="allequlist" style="width: 100%" tooltip-effect="dark"  @selection-change="handleSelectionChange">
                <el-table-column align="center" fixed type="selection" min-width="20"></el-table-column>
                <el-table-column align="center" fixed :label="$t('table.Device')" prop="deviceName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.imei')" prop='imei' min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.groupname')" prop="groupName" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.model')" prop="deviceModel" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.Detailed')" prop="address" min-width="180" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" :label="$t('table.addtime')" prop="createDt" min-width="160" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" fixed="right" :label="$t('table.operation')" min-width="100">
                    <template slot-scope="scope">
                       <el-button size="mini" @click="linkequ(scope.row)" type="danger">取消关联</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination hide-on-single-page="true" small background page-size="5" current-page="1" layout="total, prev, pager, next ,jumper" :total="100" style="text-align:center;margin-top:10px"></el-pagination>
            <div class="relevance_device_bottom_btn">
                <el-button type="info" size="small">取消</el-button>
                <el-button type="primary" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from '@/api/wechart/index'
import mixin from '@/mixins/index'
import { formatDate } from '@/plugins/date.js'
import {gcj02tobd09, bd09togcj02, gcj02towgs84, wgs84togcj02} from '@/utils/baidumap.js'
export default {
    name: 'electric',
    mixins:[mixin],
    data(){
        return{
            imei: this.$route.query.imei,
            lon: this.$route.query.lon,
            lat: this.$route.query.lat,
            showedit: true,
            conlat: 0,
            conlon: 0,
            address: '',
            address2: '',
            radius: 0,
            mPoint: null,
            circleArr: [],
            x_PI: 3.14159265358979324 * 3000.0 / 180.0,
            PI: 3.1415926535897932384626,
            a: 6378245.0,
            ee: 0.00669342162296594323,
            marker: null,
            marker2: null,
            display : false,
            showloca2: true,
            mapMarker: [],
            height: 0,
            list: [{
                name:'测试'
            },{
                name:'cehsih1'
            }],
            addview: true,
            editfen: false,
            fenceName: '',
            fenceRadio: 0,
            fenceAddree: '',
            inala: [0,1],
            ac: null,
            userlocation: null,
            searchimei: null,
            map: null,
            circle: null,
            showlist: true,
            equlist: [],
            allequlist: [{
                deviceName:'测试设备名称1',
                imei:'5645678978987656',
                groupName:'西子国际233455',
                deviceModel:'D709',
                address:'上海市西子国际中心778999',
                createDt:'2020-01-01 10:30:00'
            },{
                deviceName:'测试设备名称1',
                imei:'5645678978987656',
                groupName:'西子国际233455',
                deviceModel:'D709',
                address:'上海市西子国际中心778999',
                createDt:'2020-01-01 10:30:00'
            },{
                deviceName:'测试设备名称1',
                imei:'5645678978987656',
                groupName:'西子国际233455',
                deviceModel:'D709',
                address:'上海市西子国际中心778999',
                createDt:'2020-01-01 10:30:00'
            },{
                deviceName:'测试设备名称1',
                imei:'5645678978987656',
                groupName:'西子国际233455',
                deviceModel:'D709',
                address:'上海市西子国际中心778999',
                createDt:'2020-01-01 10:30:00'
            },{
                deviceName:'测试设备名称1',
                imei:'5645678978987656',
                groupName:'西子国际233455',
                deviceModel:'D709',
                address:'上海市西子国际中心778999',
                createDt:'2020-01-01 10:30:00'
            }],
            showequlist: false,
            linkequstr: true,
            nowfenceid: '',
            noeimei: '',
            moreunequ: [],
            moerequ: [],
            moreequ:[],
            allgroup: [],
            search: '',
            selegroup: '',
            fencesearch: '',
            page2:{
                index:1,                                //当前页   
                size:20,                                //一页的数量
                total:0                                 //总数量
            },
            addloading: true,
            fenceid: null,
            active:-1,
            backFlag:false,

            select_type_name:'',//查询选择类型
            relevance_device_flag: true,//关联设备
            data: [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                    label: '三级 1-1-1'
                    }]
                }]
                }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                    label: '三级 2-1-1'
                    }]
                }, {
                    label: '二级 2-2',
                    children: [{
                    label: '三级 2-2-1'
                    }]
                }]
                }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                    label: '三级 3-1-1'
                    }]
                }, {
                    label: '二级 3-2',
                    children: [{
                    label: '三级 3-2-1'
                    }]
                }]
            }],
            renderContent:function (h,{node,data,store}) {
                let addElement = arguments[0];
                return addElement('span',[
                    addElement('i',{class:"el-icon-s-custom row_item_bottom_left_userIcon"}),
                    addElement('span',"    "),
                    addElement('span',arguments[1].node.label)
                ]);
            },
            input3:'',
            input4:'',
            data_tree: [{
                id: 1,
                label: '一级 1',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                }]
            }, {
                id: 2,
                label: '一级 2',
                children: [{
                    id: 5,
                    label: '二级 2-1'
                }, {
                    id: 6,
                    label: '二级 2-2'
                }]
            }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            search_device_key:'',
        }
    },
    watch: {
        $route() {
            this.setMap()
        },
        // searchimei(news){
        //     clearTimeout(this.timer)
        //     this.timer = setTimeout(()=>{
        //         // if (news) {
        //         //     this.search()
        //         // }else{
        //             this.getList()
        //         // }
        //     }, 500);
        // },
        fenceRadio(news){
            let that = this
            let timer = null
            clearTimeout(timer)
            timer = setTimeout(()=>{
                if(this.conlon != 0 && this.conlat != 0){
                    this.circle.setCenter( new BMap.Point(this.conlon, this.conlat))
                    that.circle.setRadius(news)
                }else{
                    this.$message.warning(this.$t('message.xuanze'))
                }
            }, 500);
        }
    },
    mounted(){
        this.height = document.body.offsetHeight - 60
        // if(this.imei != null){
        //     this.showedit = false
        //     this.getoneele()
        // }else{
        //     this.showedit = true
        //     this.getele() 
        // }
        // this.setMap()
        // this.getgroup()
        
        this.map = new BMap.Map("map2");
        this.map.enableScrollWheelZoom(true); 
        this.map.centerAndZoom(new BMap.Point(121.3715259,31.1285691),18);
    },
    methods: {
        evt_close:function(){
            this.showlist = true;
        },
        goBack(){
            this.$router.push({name:'route.List'})
        },
        setMap() {
            console.log('加载地图')
            this.map = new BMap.Map("map2");
            this.map.enableScrollWheelZoom(true);
            //this.map.clearOverlays(); 
            this.circle = new BMap.Circle();
            //this.map.addOverlay(this.marker2);  
            this.map.centerAndZoom(new BMap.Point(121.3715259,31.1285691),18);
            this.circle.setRadius(0)
            this.circle.setCenter(new BMap.Point(121.3715259,31.1285691))
            //this.map.centerAndZoom(new BMap.Point(121.3715259,31.1285691),18);
            this.circle.setFillColor("blue")
            this.circle.setStrokeWeight(1)
            this.circle.setFillOpacity(0.3)
            this.circle.setStrokeOpacity(0.3)
            this.circle.enableEditing();
            this.map.addOverlay(this.circle)
            var that = this
            // if (this.mPoint != null) {
            //     this.circle.addEventListener("lineupdate", function (e) {
            //     that.radius = this.circle.getRadius(); //返回圆形覆盖物的半径
            //    });
            // }

            var local = new BMap.LocalSearch(that.map, {renderOptions: {map: that.map, autoViewport: false}});

            that.ac = new BMap.Autocomplete(    //建立一个自动完成的对象
              {
                  "input": "fenceradio", 
                  "location": that.map
              })
              // ac.hide()
            var myValue = null
             that.ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
              var _value = e.item.value;
              myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
              that.address = myValue
            //   console.log('222')
              // if(that.infoEqu.address != ''){
                that.ac.hide()
              // }
              // that.ac.dispose()
              // that.infoEqu.lat = data.location.lat
              // that.infoEqu.lon = data.location.lng
              setPlace();
          })
          function setPlace() {
              that.map.clearOverlays();    //清除地图上所有覆盖物
              function myFun() {
                  that.userlocation = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                  that.map.centerAndZoom(that.userlocation, 18);
                  that.map.addOverlay(new BMap.Marker(that.userlocation));    //添加标注
                  // console.log(that.userlocation.lat,that.userlocation.lng)
                  that.conlat = that.userlocation.lat
                  that.conlon = that.userlocation.lng
                  that.circle.setRadius(that.fenceRadio)
                  that.circle.setCenter(that.userlocation)
                //   var circle = new BMap.Circle(that.userlocation,that.fenceRadio); //创建圆
                  that.map.addOverlay(that.circle)
              }
              var local = new BMap.LocalSearch(that.map, { //智能搜索
                  onSearchComplete: myFun
              });
              if(that.map.getCenter() != that.userlocation){
                 local.search(myValue);
              }
          }
        },
        onchangema(){
            let that = this            
            this.map.addEventListener("click",function(e){
                that.conlat = e.point.lat
                that.conlon = e.point.lng
                that.marker2 = new BMap.Marker(new BMap.Point(that.lon, that.lat))
                that.map.addOverlay(that.marker2);  
                that.marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
                if(that.addview == false){
                    that.map.clearOverlays();
                    that.map.addOverlay(that.marker);
                    that.getaddress(e.point)
                }
                that.fenceRadio = 0
                
            //     this.circle.addEventListener("lineupdate", function (e) {
            //     that.radius = this.circle.getRadius(); //返回圆形覆盖物的半径
            //    });
            });
        },
         getaddress (e) {
             let that = this
            var myGeo = new BMap.Geocoder();      
            // 根据坐标得到地址描述  
            myGeo.getLocation(new BMap.Point(e.lng, e.lat), function(result){
            if (result){
                if(result.address != '' ){
                 that.address = result.address
                }
            }
            })
            },
        Resetgetele(){
            this.fencesearch = ''
            if(this.imei != null){
                this.showedit = false
                this.getoneele()
            }else{
                this.getele()
            }
        },
        getele() {
            api.searchdian({params:{
                pageNo:0,
                pageSize:10000,
                name: this.fencesearch,
            }}).then(res => {
                this.list = res.content
                if(res.total > 0){
                    this.circle.setRadius(this.list[0].radius)
                    this.circle.setCenter( new BMap.Point(this.list[0].circleLon, this.list[0].circleLat))
                    this.map.setCenter( new BMap.Point(this.list[0].circleLon, this.list[0].circleLat))
                }
            }).catch(err => {})
        },
        getoneele(){
            api.searone(this.imei).then(res => {
                this.list = res
                if(res.length > 0){
                    this.circle.setRadius(this.list[0].radius)
                    this.circle.setCenter( new BMap.Point(this.list[0].circleLon, this.list[0].circleLat))
                    this.map.setCenter( new BMap.Point(this.list[0].circleLon, this.list[0].circleLat))
                }
            }).catch(err => {})
        },
        deleold(val){
            this.showlist = true
            console.log(val)
          this.$confirm(this.$t('message.outele'), this.$t('message.newtitle'), {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.cancel'),
            type: "warning"
          }).then(_ => {
              if(this.imei != null){
                  let oneele = {}
                  oneele.imei = this.imei
                  oneele.fenceId = val.fenceId
                  this.Unlinkequ(oneele)
              }else{
              api.deledian(val.id).then(res => {
                this.$message.success(this.$t('message.delesuc'))
                    this.getele()
                }).catch(err => {
                    this.$message.error(err.message)
                })
              }
            }).catch(_ =>{})
        }, 
        closeele(){
            this.addview = true
            this.onchangema()
            this.fenceName = ''
            this.address = ''
            this.address2 = ''
            this.fenceRadio = 0
            this.inala = []
        },
        showAdd(){
            this.fenceName = ''
            this.address = ''
            this.address2 = ''
            this.fenceRadio = 0
            this.inala = []
            this.addview = false
            this.onchangema()
            this.editfen = true
        },
        addEle(){
            this.addview = false
            this.onchangema()
            this.editfen = true
            let inAndOut = null
            if(this.address.length == 0 || this.fenceName.length == 0){
                this.$message.error(this.$t('message.canshu'))
                return
            }
            if(this.fenceRadio<=0){
                this.$message.error(this.$t('message.weilanpath'))
                return
            }
            if(this.inala.length == 0){
                inAndOut = -1
            }else if(this.inala.length == 1){
                inAndOut = this.inala[0]
            }else if(this.inala.length == 2){
                inAndOut = 2
            }
            if(this.address == ''){
                this.address = this.address2
            }
            let data = {
                address: this.address,
                circleLat: this.conlat,
                circleLon: this.conlon,
                inAndOut: inAndOut,
                name: this.fenceName,
                radius: this.fenceRadio * 1,
            }
            if(this.imei != null){
                data = {
                address: this.address,
                circleLat: this.conlat,
                circleLon: this.conlon,
                inAndOut: inAndOut,
                name: this.fenceName,
                radius: this.fenceRadio * 1,
                imei: this.imei,
                }
            }else{
                data = {
                address: this.address,
                circleLat: this.conlat,
                circleLon: this.conlon,
                inAndOut: inAndOut,
                name: this.fenceName,
                radius: this.fenceRadio * 1,
              }
            }
            api.sendele(data).then(res => {
                this.$message.success(this.$t('message.addsuc'))
                this.addview = true
                 if(this.imei != null){
                    this.showedit = false
                    this.getoneele()
                 }else{this.getele()}
                
            }).catch(err => {
                this.$message.error(err.message)
            })
        },
         editEle2(){
            // if(this.address.length == 0 || this.fenceName.length == 0){
            //     this.$message.error(this.$t('message.canshu'))
            //     return
            // }
            if(this.fenceRadio<=0){
                this.$message.error(this.$t('message.weilanpath'))
                return
            }
             let inAndOut = null
            if(this.inala.length == 0){
                inAndOut = -1
            }else if(this.inala.length == 1){
                inAndOut = this.inala[0]
            }else if(this.inala.length == 2){
                inAndOut = 2
            }
            if(this.address == ''){
                this.address = this.address2
            }
            let data = {
                address: this.address,
                circleLat: this.conlat,
                circleLon: this.conlon,
                inAndOut: inAndOut,
                id: this.fenceid,
                name: this.fenceName,
                radius: this.fenceRadio * 1,
            }
            api.editele(data).then(res => {
                this.$message.success(this.$t('message.changesuc'))
                this.addview = true
                this.getele()
            }).catch(err => {
                this.$message.error(err.message)
            })
        },
        showitem(){
            this.showequlist = true
            this.getList()
        },
        moreunlink(){
            if(this.moreunequ.length<=0){
                this.$message.warning(this.$t('message.selectGuanLian'))
                return
            }
            let val = {}
            val.imei = ''
            this.moreunequ.forEach(item => {
                val.imei = item.imei + ',' + val.imei
            })
            this.Unlinkequ(val)
        },
        Unlinkequ(val){
            this.$confirm(this.$t('message.cancelGuanLian'), this.$t('message.newtitle'), {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.cancel'),
            type: 'warning'
        }).then(() => {
            let delfenceid = null
            if(this.imei != null){
                delfenceid = val.fenceId
              }else{
                  delfenceid = this.nowfenceid
              }
            api.unlikeequ({params:{
                fenceId: delfenceid,
                imeiStr: val.imei,
            }}).then(res => {
                if(this.imei != null){
                    this.getoneele()
                }else{
                    this.addlist(this.nowfenceid)
                }
            }).catch(err => {
                this.$message.error(err.message)
            })
            })
            
        },
        handleSelectionChange(val){
            this.moreunequ = val
        },
        handleSelectionChange2(val){
            this.moreequ = val
        },
        editele(val){
            // debugger
            this.addview = false
            this.editfen = false
            this.showlist = true
            this.fenceName = val.name
            this.address2 = val.address
            this.conlat = val.circleLat
            this.conlon = val.circleLon
            this.fenceRadio = val.radius
            this.fenceid = val.id
            if(val.inAndOut == 0){
                this.inala = [0]
            }else if(val.inAndOut == 1){
                this.inala = [1]
            }else if(val.inAndOut == 2){
                this.inala = [0,1]
            }else{
                this.inala = []
            }
            this.circle.setRadius(this.fenceRadio)
            this.circle.setCenter( new BMap.Point(this.conlon, this.conlat))
            this.map.setCenter( new BMap.Point(this.conlon, this.conlat))
            
        },
        changecrie(val){
            this.map.clearOverlays();
            this.circle.setRadius(val.radius)
            this.circle.setCenter( new BMap.Point(val.circleLon, val.circleLat))
            this.map.setCenter( new BMap.Point(val.circleLon, val.circleLat))
            this.map.addOverlay(this.circle);
        },
        addlist(val){
            this.showlist = false
            if(val.id){
                this.nowfenceid = val.id
                this.selegroup = ''
                this.search = ''
            }
            api.oldequlist({params:{
                fenceId: this.nowfenceid,
                groupId: this.selegroup,
                imei: this.search,
                pageNo: this.page2.index -1,
                pageSize: this.page2.size
            }}).then(res => {
                this.equlist = res.content
                this.page2.total = res.total
            }).catch(err => {
                this.$message.error(err.message)
            })
        },
        changeindex2(val){                                //改变当前页
            this.page2.index=val
            try{
                this.addlist(0)
            }catch(res){
                
            }
        },
        morelink(){
            if(this.moreequ.length<=0){
                this.$message.warning(this.$t('message.selGuanLian'))
                return
            }
            let val = {}
            val.imei = ''
            this.moreequ.forEach(item => {
                val.imei = item.imei + ',' + val.imei
            })
            this.linkequ(val)
        },
        linkequ(val){
            api.likeequ({params:{
                fenceId: this.nowfenceid,
                imeiStr: val.imei,
            }}).then(res => {
                this.addlist(this.nowfenceid)
                this.$message.success(this.$t('message.addsuc'))
                this.getList()
            }).catch(err => {
                this.$message.error(err.message)
            })
        },
        getList(){  // 获取所有设备
        this.addloading = true
            this.listxian=[]
            let data = {}
            data = {params:{
                    pageSize:this.page.size,
                    pageNo:this.page.index-1,
                    fenceId:this.nowfenceid,
                    // imei: this.search,
                    // deviceGroupId: this.selegroup
                    }
                }
            api.newequlist(data).then(res=>{
                this.addloading = false
                if(res.content.length > 0){
                    this.linkequstr = false
                    this.allequlist = res.content
                }
                this.page.total = res.total
            }).catch(_=>{
                this.$message.error(_.message);
                this.listLoading=false
            })
        },
        getgroup() {
            api.getGroupListPagination({params:{
            userId:this.$store.getters.usercode,
            pageSize: 100000,
            pageNo: 0 ,}}).then(_=>{ 
            if(_.content.length > 0){
                this.allgroup=_.content
            }else{
                this.$message.error(this.$t('table.faillist'));
            }
            }).catch(_=>{
                this.$message.error(_.message);
            })
        },
        bd09togcj02(bd_lon, bd_lat) { 
　      　let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
　      　let x = bd_lon - 0.0065;
　      　let y = bd_lat - 0.006;
　      　let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
　      　let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
　      　let gg_lng = z * Math.cos(theta);
　      　let gg_lat = z * Math.sin(theta);
　      　return [gg_lng, gg_lat]
　      },
        gcj02towgs84(lng, lat) { 
               var dlat = this.transformlat(lng - 105.0, lat - 35.0);
               var dlng = this.transformlng(lng - 105.0, lat - 35.0);
               var radlat = lat / 180.0 * this.PI;
               var magic = Math.sin(radlat);
               magic = 1 - this.ee * magic * magic;
               var sqrtmagic = Math.sqrt(magic);
               dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
               dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
               var mglat = lat + dlat;
               var mglng = lng + dlng;
               return [lng * 2 - mglng, lat * 2 - mglat]
               },
        transformlat(lng, lat) { 
               var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
               ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
               ret += (20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin(lat / 3.0 * this.PI)) * 2.0 / 3.0;
               ret += (160.0 * Math.sin(lat / 12.0 * this.PI) + 320 * Math.sin(lat * this.PI / 30.0)) * 2.0 / 3.0;
               return ret
            },

        transformlng(lng, lat) { 
               var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
               ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
               ret += (20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin(lng / 3.0 * this.PI)) * 2.0 / 3.0;
               ret += (150.0 * Math.sin(lng / 12.0 * this.PI) + 300.0 * Math.sin(lng / 30.0 * this.PI)) * 2.0 / 3.0;
               return ret
        },
        dowm(index){
          //将点击的元素的索引赋值给变量
            this.active = index
        }
       },
       filters:{
           formatDate(val) {
               let date = new Date(val)
                // 判断这个时间格式是否为NaN-aN-aN aN:aN:aN，
                return isNaN(date) ? " " : formatDate(date, 'yyyy-MM-dd hh:mm:ss')
           }
       }
}
</script>
<style lang="scss" scoped>
#map{
    width: 100%;
    height:600px;
}
.app{
    margin: 0;
    /* padding: 20px; */
    background:#FFFFFF;
}
.left{
    display: flex;
    flex-direction: column;
}
.search{
    .search_top{
        width: 100%;
        height: 36px;
        background: #EEF3FE;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        line-height: 36px;
        padding-left: 10px;
        box-sizing: border-box;
    }
    .select_type_name{
        padding: 10px;
        box-sizing: border-box;
    }
}
.search_content{
    flex: 1;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .search_content_title{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        >div:nth-of-type(2){
            cursor: pointer;
        }
    }
    .search_content_list{
        flex: 1;
        overflow: auto;
    }
}
.title{
    width: 100%;
    display: flex;
}
.title span{
    flex: 1;
    font-size: 20px;
}
.list{
    width: 100%;
    margin-top: 10px;
    .elecard{
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        .elecard_item_left{
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .elecard_item_right{
            width: 100%;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div:nth-of-type(1){
                width: 70%;
                font-size: 14px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #333333;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

    }
    .addclass{
        background-color: #E6ECFA;
        border: 1px solid #8EB0FF;
        box-sizing: border-box;
    }
}
.addele{
    width: 25%;
    position: absolute;
    top: 0px;
}
.addlist{
    display: flex;
    padding-top: 10px;
}
.addlist span{
    flex: 0.5;
}
.addlist .el-input{
    flex: 1;
}
.right-tab{
    position: absolute;
    top: 0px;
    background: #fff;
    padding: 20px;
    width: 60%;
}
.relevance_device{
    /deep/ .el-dialog__header{
        padding: 10px 20px;
        background-color: #648EF8;
    }
    /deep/ .el-dialog__title{
        height: 14px;
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #EFEFEF;
        line-height: 14px;
    }
    /deep/ .el-dialog__headerbtn .el-dialog__close{
        color: #FFFFFF;
    }
    /deep/ .el-dialog__headerbtn{
        top: 14px;
    }
    /deep/ .el-dialog__body{
        padding: 20px;
    }
}
.users{
    width: 100%;
    height: 24vh;
    border: 1px solid #CCCCCC;
    box-sizing: border-box;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .users_bottom{
        flex: 1;
        width: 70%;
        margin-top: 6px;
        overflow-y: scroll;
        /deep/ .row_item_bottom_left_userIcon{
            color: #F19B04 !important;
        }
        /deep/  .el-tree-node.is-current > .el-tree-node__content {
            background-color: #FFE6B0 !important;
            border: 1px solid #F19B04;
        }
    }
}
.devices{
    width: 100%;
    height: 24vh;
    border: 1px solid #CCCCCC;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    .devices_bottom{
        flex: 1;
        margin-top: 6px;
        overflow-y: scroll;
    }
}
.search_device{
    margin: 10px 0px;
}
.relevance_table{
    // height: 30vh;
    border: 1px solid #EBEEF5;
    box-sizing: border-box;
    /deep/ .el-table th {
        background: #F2F2F2 !important;
    }
    
}
.relevance_device_bottom_btn{
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
/deep/ .el-table th.is-leaf{
        background: #f2f2f2 !important;
}
/deep/ .el-card{
    border: 0px;
}
/deep/ .el-card__body{
    padding: 5px;
}

</style>
<style>
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
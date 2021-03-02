<template>
    <div class="app" :style="{height:height +'px',overflow:'hidden' }">
        <el-row>
            <el-col class="row_item" :span="4" :style="{height:height +'px'}">
                <div class="row_item_left">
                    <div class="row_item_top_left">
                        <div>本部测试(库存500/总数800)</div>
                        <div><i class="el-icon-arrow-left"></i></div>
                    </div>
                    <div class="row_item_bottom_left">
                        <div>
                            <el-input placeholder="请输入客户名称或账号" v-model='fencesearch' class="row_item_bottom_left_input"></el-input>
                            <div class="row_item_bottom_left_search_icon"><i class="el-icon-search"></i></div>
                        </div>
                        <el-tree :data="data" :render-content="renderContent"></el-tree>
                    </div>
                </div>
            </el-col>
            <el-col class="row_item" :span="4" :style="{height:height +'px'}">
                <div class="row_item_middle">
                     <div class="row_item_middle_top">
                        <div>
                            <div class="select_item">全部(800)</div>
                            <div>在线(700)</div>
                            <div>离线(100)</div>
                        </div>
                        <div><i class="el-icon-arrow-left"></i></div>
                    </div>
                    <div class="row_item_middle_middle">
                        <el-input placeholder="IMEI/设备名称" v-model='fencesearch' class="row_item_bottom_left_input"></el-input>
                        <div class="row_item_bottom_left_search_icon"><i class="el-icon-search"></i></div>
                    </div>
                    <div class="row_item_middle_bottom">
                        <div class="row_item_middle_bottom_add_tag">添加标签</div>
                        <el-collapse accordion v-model="collapse_value">
                            <el-collapse-item name="1">
                                <template slot="title">
                                    <div class="row_item_middle_bottom_title">
                                        <el-checkbox v-model="checked"></el-checkbox>
                                        <i class="el-icon-caret-right"></i>
                                        <span>莘庄中心(12)</span>
                                    </div>
                                </template>
                                <div class="item_content">
                                    
                                </div>
                            </el-collapse-item>
                            <el-collapse-item name="2">
                                <template slot="title">
                                    <div class="row_item_middle_bottom_title">
                                        <el-checkbox v-model="checked"></el-checkbox>
                                        <i class="el-icon-caret-bottom"></i>
                                        <span>诺德国际(788)</span>
                                    </div>
                                </template>
                                <div class="item_content">
                                    <!-- <el-checkbox-group> -->
                                        <div class="devices_item">
                                            <div class="devices_item_top">
                                                <el-checkbox></el-checkbox>
                                                <el-avatar class="devices_item_top_avatar" size="small"></el-avatar>
                                                <div class="devices_item_top_right">
                                                    <div class="devices_item_top_right_top">
                                                        <div class="devices_item_top_right_top_left">D600N测试2</div>
                                                        <div class="devices_item_top_right_top_right">在线</div>
                                                    </div>
                                                    <div class="devices_item_top_right_bottom">
                                                        <!-- 电池辅助元素 -->
                                                        <div><div style="background:#02C602;"></div></div>
                                                        <div>80%</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="devices_item_bottom">
                                                <el-menu mode="horizontal">
                                                    <el-menu-item index="1">跟踪</el-menu-item>
                                                    <el-menu-item index="2">回放</el-menu-item>
                                                    <el-submenu index="3">
                                                        <template slot="title">更多</template>
                                                        <el-menu-item index="3-1">设备详情</el-menu-item>
                                                        <el-menu-item index="3-2">设备指令</el-menu-item>
                                                        <el-menu-item index="3-2">报警设置</el-menu-item>
                                                    </el-submenu>
                                                </el-menu>
                                            </div>
                                        </div>
                                    <!-- </el-checkbox-group> -->
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </el-col>
            <el-col class="row_item" :span="16" :style="{height:height +'px'}"></el-col>
        </el-row>


        <!-- <el-row :gutter="20">
            <el-col :span='6'>
            <div class='search'>
                <el-page-header v-show="!showedit" @back="goBack" style="margin-bottom:10px">
                </el-page-header>
            <el-row>
                <el-col :span='12'><el-input class='eleinput' v-model='fencesearch' :placeholder="$t('view.fence2')" clearable></el-input></el-col>
                <el-col :span='4' :offset="1"><el-button class=' butsearch' @click='getele()'>{{$t('button.search')}}</el-button></el-col>
                <el-col :span='4' :offset="2"><el-button class=' butresh' @click='Resetgetele()'>{{$t('button.refresh')}}</el-button></el-col>
            </el-row>
            </div>
            <el-card :style="{height:height - 100 +'px',overflow:'hidden' }">
                <div class='title'>
                    <span>{{$t('view.fence1')}}</span>
                    <el-button class="butsearch" @click='showAdd'>{{$t('button.add')}}</el-button>
                </div>
                <el-scrollbar v-if='list.length > 0'  :style="{height:height - 180 +'px'}" ref="scroll" class='el-scro'>
                    <div class='list' v-for='(item,index) in list' :key='item.name' :class = "active == index ? 'addclass' : '' " @click='dowm(index)'>
                        <div class='elecard'>
                        <div class='elecard-item' @click='changecrie(item)'>
                            <div>{{item.name}}</div>
                            <div>{{$t('view.radius')}}：{{item.radius}}{{$t('view.mi')}}</div>
                        </div>
                        <div class='elecard-edit' @click='addlist(item)' :hidden='!showedit'>
                            <img  src='../../assets/img/list.png'>
                        </div>  
                        <div class='elecard-edit' @click='editele(item)' :hidden='!showedit'>
                            <img src='../../assets/img/edit.png'>
                        </div>
                        <div class='elecard-edit' @click='deleold(item)'>
                            <img src='../../assets/img/delet.png'>
                        </div>  
                        </div>
                    </div>
                </el-scrollbar>
                <div class='list' v-else><span style='margin-left:30%;margin-top:200px;color:#909399;'>{{$t('table.temporarily')}}</span></div>
            </el-card>
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
            </el-col> 
            <el-col :span='18'>
                <el-card>
                    <div id="map2" :style="{height:height-40+'px',overflow:'hidden' }"></div>
                </el-card>
                <div class='right-tab' :hidden="showlist" :style="{height:height-40+'px'}">
                    <el-row style='text-align: center;line-height: 50px;'>
                        <el-col :span='23'>{{$t('table.addequ')}}</el-col>
                        <el-col :span='1'>
                        <i class='el-icon-close'  @click='showlist = true'></i>
                        </el-col>
                    </el-row>
                    <el-row :span='20' style='margin-bottom: 20px;'>
                        <el-col :span='5'>
                            <el-input v-model="search" :placeholder="$t('table.searchimei')" clearable style='width:90%'></el-input>
                        </el-col>
                        <el-col :span='4'>
                            <el-select v-model="selegroup" :placeholder="$t('view.inputgroup')" style='width:90%'>
                                <el-option v-for="item in allgroup" :value="item.id" :key="item.name" :label="item.name"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span='2'>
                            <el-button @click='addlist(0)'>{{$t('button.search')}}</el-button>
                        </el-col>
                        <el-col :span='4'>
                            <el-button @click='moreunlink()'>{{$t('table.canaleadd')}}</el-button>
                        </el-col>
                        <el-col :span='4'>
                            <el-button @click='showitem()'>{{$t('route.Add')}}</el-button>
                        </el-col>
                    </el-row>
                    <el-table :data="equlist" :height='height-200' :row-class-name="tableRowClassName" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}"  @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop='deviceName' :label="$t('table.Device')" show-overflow-tooltip></el-table-column>
                        <el-table-column prop='imei' :label="$t('table.imei')" show-overflow-tooltip></el-table-column>
                        <el-table-column prop='groupName' :label="$t('table.groupname')" show-overflow-tooltip></el-table-column>
                        <el-table-column prop='deviceModel' :label="$t('table.model')" show-overflow-tooltip></el-table-column>
                        <el-table-column prop='createDt' :label="$t('table.addtime')" show-overflow-tooltip>
                            <template slot-scope="scop">
                                {{scop.row.createDt == null ? '--':scop.row.createDt | formatDate}}
                            </template>
                        </el-table-column>
                        <el-table-column prop='' :label="$t('table.operation')" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-button @click="Unlinkequ(scope.row)" type="text" >{{$t('table.canaleadd')}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @current-change="changeindex2"
                        :current-page.sync="page2.index"
                        :page-size="page2.size"
                        layout="total, prev, pager, next ,jumper"
                        :total="page2.total"
                        style="text-align:center;margin-top:10px">
                    </el-pagination>
                </div>
            </el-col>  
        </el-row>
        
        <el-dialog :title="$t('route.Add')" :visible.sync="showequlist" :center='true'>
            <el-row :span='20'>
                <el-col :span='2'>
                    <el-button @click="morelink()">{{$t('table.butgl')}}</el-button>
                </el-col>
            </el-row>
            <el-table v-loading='addloading' :data="allequlist" :height='height-250' :row-class-name="tableRowClassName" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}" @selection-change="handleSelectionChange2">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop='deviceName' :label="$t('table.Device')" show-overflow-tooltip></el-table-column>
                <el-table-column prop='imei' :label="$t('table.imei')" show-overflow-tooltip></el-table-column>
                <el-table-column prop='groupName' :label="$t('table.groupname')" show-overflow-tooltip></el-table-column>
                <el-table-column prop='deviceModel' :label="$t('table.model')" show-overflow-tooltip></el-table-column>
                <el-table-column prop='createDt' :label="$t('table.addtime')" show-overflow-tooltip></el-table-column>
                <el-table-column prop='' :label="$t('table.operation')" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button @click="linkequ(scope.row)" type="text" >{{$t('table.butgl')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @current-change="changeindex"
                :current-page.sync="page.index"
                :page-size="page.size"
                layout="total, prev, pager, next ,jumper"
                :total="page.total"
                style="text-align:center;margin-top:10px">
            </el-pagination>
        </el-dialog> -->
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
            list: [],
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
            allequlist: [],
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
            radio1:'',
            collapse_value:'2'
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
        if(this.imei != null){
            this.showedit = false
            this.getoneele()
        }else{
            this.showedit = true
            this.getele() 
        }
        this.setMap()
        this.getgroup()
        
    },
    methods: {
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
<style rel="stylesheet/scss" lang="scss" scoped>
#map{
    width: 100%;
    height:600px;
}
.app{
    /* margin: 0;
    padding: 20px;
    background:#ccc; */
}
.row_item{
    border-right: 1px solid #DDDDDD;
}
.row_item_left{
    display: flex;
    flex-direction: column;
}
.row_item_top_left{
    height: 4vh;
    background: #EEF3FE;
    border-bottom: 1px solid #DDDDDD;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div:nth-of-type(1){
        font-size: 1vh;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        line-height: 4vh;
        margin-left: 1vh;
    }
    >div:nth-of-type(2){
        width: 2vh;
        height: 4vh;
        background: white;
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
        position: relative;
        >i{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
}
.row_item_bottom_left{
    flex-flow: 1;
    width: 100%;
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 10px;
    >div:nth-of-type(1){
        margin-bottom: 2vh;
        display: flex;
        justify-content: center;
        align-items: center;
        .row_item_bottom_left_input{
            /deep/  .el-input__inner{
                height: 3vh;
                line-height: 3vh;
                font-size: 1vh;
                border-radius: 0px;
            }
        }
        .row_item_bottom_left_search_icon{
             height: 3vh;
             width: 3vh;
             box-sizing: border-box;
             border: 1px solid #DDDDDD;
             border-left: 0px;
             display: flex;
             justify-content: center;
             align-items: center;
             i{
                color: #BBBBBB;
             }
             cursor: pointer;
        }
    }
     /deep/ .row_item_bottom_left_userIcon{
        color: #F19B04 !important;
    }
    /deep/  .el-tree-node.is-current > .el-tree-node__content {
        background-color: #FFE6B0 !important;
        border: 1px solid #F19B04;
    }
}
.row_item_middle{
    display: flex;
    flex-direction: column;
}
.row_item_middle_top{
    height: 4vh;
    background: #EEF3FE;
    border-bottom: 1px solid #DDDDDD;
    padding-left: 1vh;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    >div:nth-of-type(1){
        display: flex;
        justify-content: flex-start;
        align-items: center;
        >div{
            height: 3vh;
            font-size: 1vh;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 3vh;
            padding: 0px 0.5vh;
            cursor: pointer;
        }
        .select_item{
            background: #FFFFFF;
            border: 1px solid #DDDDDD;
            border-bottom: 0px;
            position: relative;
            left: 0px;
            bottom: -1px;
        }
    }
    >div:nth-of-type(2){
        width: 2vh;
        height: 4vh;
        background: white;
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
        position: relative;
        >i{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
    }
}
.row_item_middle_middle{
    width: 100%;
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .row_item_bottom_left_input{
        /deep/  .el-input__inner{
            height: 3vh;
            line-height: 3vh;
            font-size: 1vh;
            border-radius: 0px;
        }
    }
    .row_item_bottom_left_search_icon{
        height: 3vh;
        width: 3vh;
        box-sizing: border-box;
        border: 1px solid #DDDDDD;
        border-left: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        i{
            color: #BBBBBB;
        }
        cursor: pointer;
    }
    /deep/ .row_item_bottom_left_userIcon{
        color: #F19B04 !important;
    }
    /deep/  .el-tree-node.is-current > .el-tree-node__content {
        background-color: #FFE6B0 !important;
        border: 1px solid #F19B04;
    }
}
.row_item_middle_bottom{
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    padding: 0px 5px;
    position: relative;
    .row_item_middle_bottom_add_tag{
        position: absolute;
        top: 0;
        right: 5px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666666;
        cursor: pointer;
    }
    .row_item_middle_bottom_title{
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .item_content{
        background: #D5DCED;
        padding: 5px;
        max-height: 70vh;
        overflow-y: scroll;
        .devices_item{
            width: 100%;
            // height: 90px;
            box-sizing: border-box;
            padding: 10px 5px 0px 5px;
            background: #FFFFFF;
            border-radius: 4px;
            .devices_item_top{
                border-bottom: 1px solid #EEEEEE;
                padding-bottom: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .devices_item_top_avatar{
                    margin: 0px 1vh;
                }
                .devices_item_top_right{
                    flex:1;
                    margin-bottom: 1vh;
                    .devices_item_top_right_top{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .devices_item_top_right_top_left{
                            font-size: 12px;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #333333;
                        }
                        .devices_item_top_right_top_right{
                            font-size: 12px;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #018C0E;
                        }
                        .devices_item_top_right_top_right_t{
                            color: #FF6565;
                        }
                    }
                    .devices_item_top_right_bottom{
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        >div:nth-of-type(1){
                            width: 3vh;
                            height: 1.5vh;
                            border: 1px solid #A9A9A9;
                            border-radius: 0.3vh;
                            position: relative;
                            margin-right: 1vh;
                            padding: 1px 0px 1px 1px;
                            box-sizing: border-box;
                            >div{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        >div:nth-of-type(1)::after{
                            content: '';
                            width: 2px;
                            height: 70%;
                            background: #A9A9A9;
                            position: absolute;
                            top: 50%;
                            right: -3px;
                            transform: translateY(-50%);
                        }
                        >div:nth-of-type(2){
                            font-size: 12px;
                            font-family: Microsoft YaHei;
                            font-weight: 400;
                            color: #666666;
                        }
                    }
                }

            }
            .devices_item_bottom{

                /deep/ .el-menu.el-menu--horizontal{
                    border-bottom: 0px !important;
                }
                /deep/ .el-submenu__icon-arrow{
                    display: none !important;
                }
                /deep/ .el-menu--horizontal>.el-menu-item{
                    height: auto;
                    line-height: 1;
                    border-bottom: 0px !important;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    border-right: 1px solid #EEEEEE;
                }
                 /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title{
                    height: auto;
                    line-height: 1;
                    border-bottom: 0px !important;
                    padding-top: 10px;
                    padding-bottom: 10px;
                 }
            }
        }
        .devices_item_T{
            -webkit-filter : grayscale(100%);
            -moz-filter: grayscale(100%);
            -o-filter: grayscale(100%);
            filter: grayscale(100%);
            filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
        }
    }

    /deep/ .el-collapse{
        border: 0px !important;
    }
    /deep/ .el-collapse-item__header{
        border:0px !important;
        height: auto;
        line-height: 1;
        padding: 5px 0px;
    }
    /deep/ .el-collapse-item__arrow{
        display: none !important;
    }
    /deep/ .el-collapse-item__content{
        padding: 0px !important;
    }
}









.search{
    margin-bottom: 20px;
    background: #fff;
    padding: 20px;
}
.elebut{
    margin-left: 20px;
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
}
.el-scro{
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.on-hover{
    background: rgb(158, 158, 158);
}
.elecard{
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
}
.elecard-item{
    flex: 1;
    line-height: 30px;
    width: 0;
    min-width: 100px;
}
.elecard-item div{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.elecard-edit{
    flex: 0.3;
}
.elecard-edit img{
    width: 26px;
    height:26px;
    padding: 6px;
}
.addele{
    width: 24%;
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
.addclass{
   background-color: #8dcef3;
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
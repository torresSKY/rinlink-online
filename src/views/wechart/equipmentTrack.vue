<template>
    <div id="history" :style="{height:height + 100+'px',overflow: 'hidden'}">
        <el-card shadow="always" class="mb20" style="background:#ccc">
            <div slot="header" class="clearfix">
                <span>{{$t('route.Location')}}</span>
            </div>
            <el-card shadow="always" :style="'height:'+height+'px'">
                <!-- <el-row :gutter="10">
                    <el-col :span="6">
                        <el-input v-model="id" :placeholder="$t('table.searchimei')"></el-input>
                    </el-col>
                </el-row> -->
                <el-row v-loading="loading">
                    <div id="map" :style="{height:height-200+'px',overflow:'hidden'}"></div>
                    <!-- <div id="map" :style="{height:height-680+'px',overflow:'hidden'}"></div> -->
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        <span>{{$t('table.Device')}}:</span>
                        <el-button type='text' @click="chooseDevice">{{deviceName}}</el-button>
                    </el-col>
                    <el-col :span="3" style="line-height:40px">
                        <span>{{$t('table.seachtime')}}:</span>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            v-model="startTime"
                            value-format="timestamp"
                            type="datetime"
                            :placeholder="$t('table.startdata')">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker
                            v-model="endTime"
                            value-format="timestamp"
                            type="datetime"
                            :placeholder="$t('table.enddata')"
                            :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col> 
                    <el-col :span="4">
                        <el-button class="butsearch" @click="getHistory" :disabled="listLoading">{{$t('button.search')}}</el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-scrollbar>
                    <el-table :style="{height:height-680 +'px',overflow:'auto' }"  :data="listTrack"   ref="listTrack"
                    highlight-current-row @current-change="handleCurrentTrack" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}">
                        <el-table-column type="index" width="50" label="序号"></el-table-column>
                        <el-table-column align='center'  prop="receiveAt" :label="$t('table.Update')"> </el-table-column>
                        <el-table-column align='center' prop="lon" :label="$t('table.jing')"> </el-table-column>
                        <el-table-column align='center' prop="lat" :label="$t('table.wei')"> </el-table-column>
                        <el-table-column align='center' prop="positionType" :label="$t('table.equlocation')">
                            <template slot-scope="scope">{{scope.row.positionType==1?"GPS":scope.row.positionType==2?"WIFI":scope.row.positionType==3?$t('table.equloctype'):'--'}}</template>
                        </el-table-column>
                        <el-table-column align='center' prop="address" :label="$t('table.deladress')" show-overflow-tooltip> 
                            <template slot-scope="scope">
                               {{scope.row.address}}
                            </template>
                        </el-table-column>
                    </el-table>
                    </el-scrollbar>
                </el-row>
            </el-card>
      </el-card>
      <el-dialog
             :title="$t('view.deviceinfo')"
             :visible.sync="dialogVisible"
             width="40%"
             >
             <el-row :gutter="20">
                <el-col :span="6" style="width:40%">
                   <el-input clearable v-model="writimei" :placeholder="$t('view.inputimei')"></el-input>
                </el-col>
                <el-col :span="3">
                  <el-button class="but1" @click="getequone()" >{{$t('button.search')}}</el-button>
                </el-col>
                <el-col :span="3">
                  <el-button class="but7" @click="refresh()" >{{$t('button.refresh')}}</el-button>
                </el-col>
             </el-row>
             <el-table class="particular-table" v-loading="tableLoading" :data="tableList"   highlight-current-row
             ref="multipleTable"  :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}"
             style="width:100%;margin:20px 20px 20px 0;" :height="height-400" @current-change="handleCurrentChange">
               <el-table-column align='center' prop="deviceName" :label="$t('table.Device')" show-overflow-tooltip></el-table-column>
               <el-table-column align='center' prop="imei" :label="$t('table.imei')" show-overflow-tooltip></el-table-column>
             </el-table>
             <el-pagination
                    @current-change="changeindex"
                    :current-page.sync="page.index"
                    :page-size="page.size"
                    layout="total, prev, pager, next ,jumper"
                    :total="page.total"
                    style="text-align:center;margin-top:10px">
                </el-pagination>
             <span slot="footer" class="dialog-footer">
              <el-button @click="cancelChoose">取 消</el-button>
              <el-button type="primary" @click="chooseOne">选 择</el-button>
             </span>
          </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import {mapState} from 'vuex'
    import mixin from '@/mixins/index'
    import {wgs84togcj02} from '@/map/map'
    import loc from '@/assets/img/loc3.png'
    import start from '@/assets/img/start.png'
    import end from '@/assets/img/end.png'
    export default{
        name:'equipmentTrack',
        mixins:[mixin],
        computed:{
            ...mapState({user:'user',adminRoles:'roles'})
        },
        data(){
            return {
                pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                  }
                },
                roles:this.$store.getters.roles,
                listLoading:false,
                equList:[],
                height:0,
                id:'',
                startTime:'',
                endTime:'',
                map:null,
                mapMarker:[],
                mapMarkerEvent:[],
                infoWindow:null,
                polyline:null,
                getimei: this.$route.params.imei,
                equModel: this.$route.params.deviceName,
                loading: false,
                deviceName:'选择设备',
                listTrack:[],
                dialogVisible:false,
                writimei:'',
                tableLoading:false,
                tableList:[],
                currentRow: null,
                cleanMark:null,
                list:[]
            }
        },
        // watch: {
        //   cleanMark(val, oldVal) {
        //       var that =this
        //     console.log(val, oldVal)
        //     if(oldVal){
        //         // var allOverlay = this.map.getOverlays()
        //         // console.log(allOverlay)
                
        //         let point = new BMap.Point(oldVal.lon,oldVal.lat)
        //         var myIcon = new BMap.Icon(loc, new BMap.Size(20,30),{anchor: new BMap.Size(10, 35)});
        //         let marker = new BMap.Marker(point,{icon:myIcon})
        //         that.map.removeOverlay(marker)
        //     }
        // }
        // },
        mounted(){
            this.height=document.body.offsetHeight-162
            this.setMap('map')
           // this.getList()
           this.endTime = Date.parse(new Date());
            this.startTime = this.endTime-24*60*60*1000
           if(this.getimei) {
                this.id = this.getimei
                this.deviceName=this.equModel
                // this.endTime = Date.parse(new Date());
                // this.startTime = this.endTime-24*60*60*1000
                this.getHistory()
           }
        },
        methods:{
            isMap(){
                if(this.active=='map'){
                    this.setMap('map') 
                }
            },
            setMap(id){
               this.map = new BMap.Map("map");    // 创建Map实例
  		        this.map.centerAndZoom(new BMap.Point(121.362426, 31.123795), 16);  // 初始化地图,设置中心点坐标和地图级别
  		        //添加地图类型控件
	  	        this.map.addControl(new BMap.MapTypeControl({
	  	        	mapTypes:[
       	               BMAP_NORMAL_MAP,
        	              BMAP_HYBRID_MAP
        	          ]}));	  
  		        this.map.setCurrentCity("上海");          // 设置地图显示的城市 此项是必须设置的
              this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放 
            },
            async getHistory(){
                this.map.clearOverlays()
                this.listLoading = true
                if(!this.id){
                    this.$message.warning(this.$t('message.imeiempty'));
                    this.listLoading = false
                    return
                }else if(!this.startTime||!this.endTime || new Date(this.startTime)>new Date(this.endTime)){
                    this.listLoading = false
                    this.$message.warning(this.$t('message.timeno'));
                    this.listLoading = false
                    return
                }
                this.listTrack=[]
                this.list=[]
                let a =[]
                    await api.getGroupList({imei:this.id,
                        pageNo:0,pageSize:6000,startTime:this.startTime,endTime:this.endTime}).then(res=>{
                            this.listLoading = false

                            if(!res.content.length){
                                this.loading = false
                                this.$message.warning(this.$t('message.hisempty'));
                                return 
                            }
                            this.list=res.content
                            for(let i=0;i<this.list.length;i++){
                                this.getaddress(this.list[i])
                                this.adddizhi
                .then(res => {
                  a.push(res)
                  this.listTrack = a
                })
                .catch(err => {
                  this.list.push(res)
                  console.log(err)
                })
                            }
                            // this.$nextTick(() => {
                            //     this.listTrack=list
                            //     console.log(this.listTrack)
                            //     this.$set(this.data,index,row) 
                            // })
                            
                                    this.addMarker(this.list)
                    }).catch(_=>{
                        this.listLoading = false
                        this.$message.error(_.message);
                    })


            },
            deleteInfoWindow(){
                if(this.infoWindow){
                    this.infoWindow.close()
                }
            },
            deleteMapMarker(){
                this.map.clearOverlays();
                this.mapMarker=[]
                this.mapMarkerEvent=[]
            },
            deletePolyline(){
                if(this.polyline){
                    this.map.remove(this.polyline);
                }
            },
            addMarker(list){
                 let _this=this
                //  var sy = new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_OPEN_ARROW, {
                //    scale: 0.8, // 图标缩放大小
                //    strokeColor: '#fff', // 设置矢量图标的线填充颜色
                //    strokeWeight: '2' // 设置线宽
                //  })
                //  var icons = new BMap.IconSequence(sy, '20%', '1%',false)// 设置为true，可以对轨迹进行编辑
                let point = new BMap.Point();
                
                let pois = []
                let poisNew =[]
                for(let i in list){
                    // console.log(list[i])
                    if(list[i].lon && list[i].lat && list[i].lon > 1 && list[i].lat > 1){
                   point = new BMap.Point(list[i].lon,list[i].lat);
                   pois.push({lon:list[i].lon,lat:list[i].lat})
                   poisNew.push(point)
                    // pois.idnum='index'+i
                   if(i==0){
                    //    console.log(i,1)
                    let myIcon1 = new BMap.Icon(end, new BMap.Size(30,40),{anchor: new BMap.Size(5, 30)});
                    let marker1 = new BMap.Marker(point,{icon:myIcon1})
                    this.map.addOverlay(marker1);               // 将标注添加到地图中
                   }
                   if(i==(list.length-1)){
                    //    console.log(i,2)
                    let myIcon2 = new BMap.Icon(start, new BMap.Size(30,40),{anchor: new BMap.Size(5, 10)});
                    let marker2 = new BMap.Marker(point,{icon:myIcon2})
                    this.map.addOverlay(marker2);               // 将标注添加到地图中
                   }

                    this.map.centerAndZoom(point, 16);
                //    let marker3 = new BMap.Marker(point)

                //     let content = list[i]
                    // this.map.addOverlay(marker3);               // 将标注添加到地图中
                    // this.map.centerAndZoom(point, 15);
		        //    this.addClickHandler(list[i],marker3);
                   }
                }
                // debugger
                 var trackPoint = [];  
                   var sy = new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_OPEN_ARROW, {
                   scale: 0.8, // 图标缩放大小
                   strokeColor: '#fff', // 设置矢量图标的线填充颜色
                   strokeWeight: '2' // 设置线宽
                 })
                 var icons = new BMap.IconSequence(sy, '20%', '1%',false)// 设置为true，可以对轨迹进行编辑
                 var PolylineOptions ={
                     icons: [icons],
                 enableEditing: false,//是否启用线编辑，默认为false
                 enableClicking: false,//是否响应点击事件，默认为true
                 strokeWeight:'12',//折线的宽度，以像素为单位
                 strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                 strokeColor:"rgb(36,125,58)" //折线颜色
                 }
                 for(let a = 0; a<pois.length-1; a++){
            if(a==0) {
                this.map.centerAndZoom(new BMap.Point(pois[a].lon, pois[a].lat), 16); //设置中心点
            }
 
            trackPoint.push(new BMap.Point(pois[a].lon,pois[a].lat));
            trackPoint.push(new BMap.Point(pois[a+1].lon,pois[a+1].lat));
 
            
            var polyline = new BMap.Polyline(trackPoint);  //生成线路
              pois[a].ca=polyline.ca
              pois[a].idnum=a
            // console.log(polyline)
            
            // pois[i].ba=polyline.ba; //将ba 赋值给原始数据
            polyline.addEventListener("click",attribute); //监听对象
 
            trackPoint=[];
            this.map.addOverlay(polyline);
 
        }   

         function attribute(e){
            //  console.log(e)
            //  console.log(pois)
             for(let i = 0;i<pois.length-1;i++){
                //  debugger
                // console.log(_this.list[i].lon,i)
                 if(e.target.ca==pois[i].ca){
                    //  console.log(pois[i])
                    //  console.log(_this.listTrack[i])
                     _this.$refs.listTrack.setCurrentRow(_this.list[i])
                     const node = document.getElementsByClassName('current-row')
                      // console.log(node, 2)
                    node[0].scrollIntoView({inline: 'nearest', behavior: 'smooth'})
                 }
             }
         }
         
                this.map.centerAndZoom(point, 15); 
                var polyline22 =new BMap.Polyline(poisNew, {
                 icons: [icons],
                 enableEditing: false,//是否启用线编辑，默认为false
                 enableClicking: true,//是否响应点击事件，默认为true
                 strokeWeight:'12',//折线的宽度，以像素为单位
                 strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                 strokeColor:"rgb(36,125,58)" //折线颜色
              });

            //    polyline.addEventListener("mousemove",function(e){
            //       console.log(e)
            //       console.log(polyline)
			//    }
		    //    )
              this.map.addOverlay(polyline22);          //增加折线
              this.loading = false
            },
            addClickHandler(content,marker){
                var that = this
                
		    //    marker.addEventListener("mousemove",function(e){
                 
			//    that.openInfo(content,e)}
		    //    );
            },
           openInfo(content,e){
            //    debugger
            var p = e.target;
            var opts = {
	                 width : 200,     // 信息窗口宽度
	                 height: 130,     // 信息窗口高度
	                 title : this.$t('table.nowdata') , // 信息窗口标题
	                 enableMessage:true,//设置允许信息窗发送短息
                   }

            var point = new BMap.Point(p.getPosition().lon, p.getPosition().lat);
            var infoWindow =null

            infoWindow = new BMap.InfoWindow('序号' + ":" + content.imei + "<br>" + this.$t('table.Update') + ":" + content.time + "<br>" + this.$t('table.loctype') + ":" + content.wifiGpsFlag+ "<br>" + this.$t('table.heart') + ":" + content.heartRate+ "<br>" + this.$t('table.step') + ":" + content.step) ;  // 创建信息窗口对象 

		    this.map.openInfoWindow(infoWindow,point); //开启信息窗口
            },
            handleCurrentTrack(val,oldval){
                // debugger
                this.cleanMark=val
                if(oldval){
                    var allOverlay = this.map.getOverlays();
                     for(var i = 0;i<allOverlay.length;i++) {
                      //删除指定经度的点
                    if (allOverlay[i].id == '12345') {
                        this.map.removeOverlay(allOverlay[i]);
                        break;
                     }
                  }
                }
                let point = new BMap.Point(val.lon,val.lat)
                var myIcon = new BMap.Icon(loc, new BMap.Size(20,30),{anchor: new BMap.Size(10, 35)});
                let marker = new BMap.Marker(point,{icon:myIcon})
                marker.id='12345'
                this.map.addOverlay(marker);               // 将标注添加到地图中
                this.map.centerAndZoom(point, 16);
		        // this.addClickHandler(val,marker)
            },
            chooseDevice(){
                this.currentRow = null
                this.dialogVisible=true
                this.writimei=""
                this.getequone()
            },
            getequone(){
                // debugger
                let data ={
                    params:{
                        pageSize:this.page.size,
                    pageNo:this.page.index-1,
                    userId:this.$store.getters.usercode,
                    imei: this.writimei
                    // deviceGroupId:"",
                    // isOnline:''
                    }
                    
                }
                this.tableList=[]
                this.tableLoading=true
                api.getEqulistnew(data).then(res=>{
                if(res.content.length > 0){
                this.tableList = res.content

                this.tableLoading = false
 
                this.page.total = res.total
                }else{
                this.$message.error(this.$t('table.temporarily'))
                this.page.total = 0
                this.tableLoading = false
                }
                }).catch(_=>{
                 this.$message.error(_.message);
                 this.tableLoading=false
                })
            },
            refresh(){
                this.currentRow = null
                this.writimei=""
                this.page.index = 1
                this.getequone()
            },
            cancelChoose(){
                this.currentRow = null
                this.writimei = ''
                this.page.index = 1
                this.tableList = []
                this.dialogVisible = false
            },
            chooseOne(){
                if (!this.currentRow) {
                  return this.$message.error(this.$t('view.sel'))
                }
                // debugger
                this.deviceName = this.currentRow.deviceName
                this.id = this.currentRow.imei
                this.dialogVisible = false
            },
            changeindex(val){
                this.page.index = val
                try {
                  this.getequone()
                } catch (res) {}

            },
            handleCurrentChange(val){
                this.currentRow = val

            },
            getaddress(val) {
                // console.log(val.lng, val.lat)
                var myGeo = new BMap.Geocoder()
                // 根据坐标得到地址描述
                return (this.adddizhi = new Promise(function (resolve, reject) {
        myGeo.getLocation(new BMap.Point(val.lon, val.lat), function (result) {
          if (result) {
            if (result.address) {
              val['address'] = result.address
              resolve(val)
            } else {
              // console.log(222)
              val['address'] = '--'
              resolve(val)
            }
          } else {
            // console.log(111)
            val['address'] = '--'
            reject(val)
          }
        })
      }))
           }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>
// #map{
//     margin-top: 20px;
// }

</style>
<style >

.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
.el-table__body tr.current-row > td {
  background-color: #a0cfff;
}
</style>
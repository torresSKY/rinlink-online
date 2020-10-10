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
                    <div id="map" :style="{height:height-180+'px',overflow:'hidden'}"></div>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="6">
                        <span>{{$t('table.Device')}}:</span>
                        <el-button type='text'>{{deviceName}}</el-button>
                    </el-col>
                    <el-col :span="3">
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
                    <el-table class="particular-table" :data="listTrack" :row-class-name="tableRowClassName" :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}">
                        <el-table-column type="index" width="50" label="序号"></el-table-column>
                        <el-table-column align='center'  prop="lastWAt" :label="$t('table.Update')"> </el-table-column>
                        <el-table-column align='center' prop="imei" :label="$t('table.jing')"> </el-table-column>
                        <el-table-column align='center' prop="deviceName" :label="$t('table.wei')"> </el-table-column>
                        <el-table-column align='center' prop="deviceName" :label="$t('table.equlocation')"> </el-table-column>
                        <el-table-column align='center' prop="deviceName" :label="$t('table.deladress')"> </el-table-column>
                    </el-table>
                </el-row>
            </el-card>
      </el-card>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import {mapState} from 'vuex'
    import {wgs84togcj02} from '@/map/map'
    export default{
        name:'equipmentTrack',
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
                equModel: this.$route.params.model,
                loading: false,
                deviceName:'选择设备',
                listTrack:[]
            }
        },
        mounted(){
            this.height=document.body.offsetHeight-162
            this.setMap('map')
           // this.getList()
           if(this.getimei) {
                this.id = this.getimei
                this.endTime = Date.parse(new Date());
                this.startTime = this.endTime-24*60*60*1000
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
  		        this.map.centerAndZoom(new BMap.Point(121.362426, 31.123795), 15);  // 初始化地图,设置中心点坐标和地图级别
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
                let objList=[]
                let id2 = this.id
                let id=await api.getEquList( {params:{
                    imei:this.id,
                    userId :this.$store.getters.usercode
                }}).catch(_=>{
                    this.listLoading=false
                    this.$message.error(_.message);
                    return []
                })
                if(id.length===0){
                    this.listLoading=false
                    return this.$message.error(this.$t('message.errorno'));
                }
                await api.getEquList({params:{
                    imei:this.id,
                    userId :this.$store.getters.usercode
                }}).then(async _=>{
                            await api.getGroupList({imei:id2,
                            pageNo:0,pageSize:6000,startTime:this.startTime,endTime:this.endTime}).then(res=>{
                                 this.listLoading = false
                                    let list=[]
                                    this.deleteMapMarker()
                                    this.deleteInfoWindow()
                                    this.deletePolyline()
                                    // console.log(this.mapMarker,t1his.mapMarkerEvent)
                                    // console.log("结果" + res)
                                    //res.sort((a,b)=>new Date(a.eventTime).getTime()-new Date(b.eventTime).getTime())
                                    for(let i in res.content){
                                        if(res.content[i].lon&&res.content[i].lat&&!list.filter(obj=>obj.time==res.content[i].collectDt).length){
                                            // console.log('转换之前',res.content[i].lon,res.content[i].lat,res.content[i].abroad)
                                            // let aa = wgs84togcj02(res.content[i].lon,res.content[i].lat,res.content[i].abroad)
                                            // console.log('获取经纬度',aa)
                                            list.push({lang:[res.content[i].lon,res.content[i].lat],time:res.content[i].collectDt,wifiGpsFlag:res.content[i].positionType === 2 ? "WIFI" : res.content[i].positionType === 1 ? "GPS" : res.content[i].positionType === 3 ? "基站" :"无定位",imei:res.content[i].imei,heartRate:res.content[i].heartRate,step:res.content[i].step})
                                        }
                                    }
                                    if(!list.length){
                                        this.loading = false
                                        this.$message.warning(this.$t('message.hisempty'));
                                        return 
                                    }
                                    this.addMarker(list)
                            }).catch(_=>{
                                this.loading = false
                                this.$message.error(_.message);
                            })
                    }).catch(err=>{
                        this.listLoading = false
                        this.$message.error(err.message);
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
                 var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                   scale: 0.8, // 图标缩放大小
                   strokeColor: '#fff', // 设置矢量图标的线填充颜色
                   strokeWeight: '2' // 设置线宽
                 })
                 var icons = new BMap.IconSequence(sy, '20%', '1%',false)// 设置为true，可以对轨迹进行编辑
                let point = new BMap.Point();
                
                let pois = []
                for(let i in list){
                    // console.log(list[i])
                    if(list[i].lang[0] && list[i].lang[1] && list[i].lang[0] > 1 && list[i].lang[1] > 1){
                   point = new BMap.Point(list[i].lang[0],list[i].lang[1]);
                   pois.push(point)
                   var marker = new BMap.Marker(point)
                    //polyline.push(list[i].lang)
                    let content = list[i]
                    this.map.addOverlay(marker);               // 将标注添加到地图中
                    this.map.centerAndZoom(point, 14);
		           this.addClickHandler(content,marker);
                   }
                }
                var polyline =new BMap.Polyline(pois, {
                 icons: [icons],
                 enableEditing: false,//是否启用线编辑，默认为false
                 enableClicking: true,//是否响应点击事件，默认为true
                 strokeWeight:'12',//折线的宽度，以像素为单位
                 strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                 strokeColor:"rgb(36,125,58)" //折线颜色
              });

              this.map.addOverlay(polyline);          //增加折线
              this.loading = false
            },
            addClickHandler(content,marker){
                var that = this
		       marker.addEventListener("click",function(e){
			   that.openInfo(content,e)}
		       );
            },
           openInfo(content,e){
            var p = e.target;
            var opts = {
	                 width : 200,     // 信息窗口宽度
	                 height: 130,     // 信息窗口高度
	                 title : this.$t('table.nowdata') , // 信息窗口标题
	                 enableMessage:true,//设置允许信息窗发送短息
                   }
            content.heartRate = content.heartRate == null ? '--': content.heartRate
            content.step = content.step == null ? '--':content.step
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
            var infoWindow
            if(this.equModel == 'D600N'){
                infoWindow = new BMap.InfoWindow(this.$t('table.imei') + ":" + content.imei + "<br>" + this.$t('table.Update') + ":" + content.time + "<br>" + this.$t('table.loctype') + ":" + content.wifiGpsFlag+ "<br>" + this.$t('table.heart') + ":" + content.heartRate+ "<br>" + this.$t('table.step') + ":" + content.step) ;  // 创建信息窗口对象 
            }else{
                infoWindow = new BMap.InfoWindow(this.$t('table.imei') + ":" + content.imei + "<br>" + this.$t('table.Update') + ":" + content.time + "<br>" + this.$t('table.loctype') + ":" + content.wifiGpsFlag) ;  // 创建信息窗口对象 
		    }
		    this.map.openInfoWindow(infoWindow,point); //开启信息窗口
	        }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>
// #map{
//     margin-top: 20px;
// }
</style>
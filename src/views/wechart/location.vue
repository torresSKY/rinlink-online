<template>
    <div id="location">
      <el-card style="background:#ccc">
        <div slot="header" class="clearfix">
          <span>{{$t('route.Location')}}</span> 
        </div>
        <el-row :gutter="10">
            <el-col :span="8" :lg="6" :hidden="!show">
                <el-card shadow="always" :style="'height:'+height+'px'" v-loading="listLoading">
                        <div style="display:flex;">
                            <el-input
                                :placeholder="$t('table.searchimei')"
                                type="text"
                                v-model="imei"
                                clearable>
                            </el-input>
                            <!-- <el-button @click="search" style="marginLeft:20px;">查询</el-button> -->
                            <el-button class="butclear" @click="refresh" style="marginLeft:20px;">{{$t('table.clear')}}</el-button>
                        </div>
                        <div id="" :style="{height:height-150+'px',overflow:'hidden'}" class="mt20">
                            <el-scrollbar :style="{height:height-130+'px'}" ref="scroll">
                                <div>
                                    <el-tree
                                        class="filter-tree"
                                        :data="equList"
                                        :props="{ children: 'children', label: 'deviceName'}"
                                        node-key="imei"
                                        default-expand-all
                                        show-checkbox
                                        @check="checkChange"
                                        :expand-on-click-node="false"
                                        ref="tree2">
                                    </el-tree>
                                </div>
                                 <!-- <el-table 
                                 :data="equList[0].children"
                                 tooltip-effect="dark"
                                 style="width: 100%"
                                 @selection-change="checkChange">
                                  <el-table-column
                                   type="selection"
                                   width="55"
                                   ref="tree2"
                                   @check="checkChange"></el-table-column>
                                   <el-table-column
                                   prop="imei"
                                   label="全选"
                                   width="180">
                                 </el-table-column>
                               </el-table> -->
                            </el-scrollbar>
                        </div>
                        <el-pagination
                            small
                            @current-change="changeindex"
                            :current-page.sync="page.index"
                            :page-size="page.size"
                            :pager-count="5"
                            layout="prev, pager, next"
                            class="mt20"
                            :disabled="imei?true:false"
                            :total="page.total">
                        </el-pagination>
                </el-card>
            </el-col>
            <el-col :span="show ? 16 :24" :lg="show ? 18 : 24">
                <el-card shadow="always" :style="'height:'+height+'px'">
                    <div id="map" :style="{height:height-40+'px',overflow:'hidden' }">

                    </div>
                </el-card>
            </el-col>
        </el-row>
      </el-card>
    </div>
</template>

<script>
import api from "@/api/wechart/index";
import mixin from "@/mixins/index";
import BMap from "BMap";
import { mapState,mapGetters } from "vuex";
import {wgs84togcj02} from '@/map/map'
import img from '@/assets/img/in.png'
// import img2 from '@/assets/img/out.png'
import img2 from '@/assets/img/carpos.png'
export default {
  name: "location",
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      roles: this.$store.getters.roles,
      listLoading: false,
      equList: [
        {
          id: 1,
          deviceName: this.$t('table.seleall'),
          value: 1,
          children: []
        }
      ],
      height: 0,
      imei: "",
      mapMarker: [],
      mapMarkerEvent: [],
      infoWindow: null,
      polyline: null,
      timer: null,
      equimei:[],
      equone:[],
      equlocation:[],
      getimei: this.$route.params.imei,
      show: true,
      lanage: this.$i18n.locale
    };
  },
  mounted() {
    this.height = document.body.offsetHeight - 162;
    this.setMap("map");
    if(this.getimei){
      this.show = false
      this.equList[0].children = [this.getimei]
      this.getLocation(this.getimei);
    }else{
      this.getList();
    }
    
  },
   computed: {
    ...mapGetters(['lang'])
    },
  watch: {
    imei(news) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // if (news) {
        //     this.search()
        // }else{
        this.search();
        // }
      }, 500);
    },
    lang (newVal) {
      this.equList[0].imei = this.$t('table.seleall')
    }
  },
  methods: {
    checkChange(obj, state) {
      console.log(obj, state)
        this.equimei = obj
      if (state.checkedKeys.filter(res => res == obj.imei).length) {    // 点击选择
        obj.disabled = true;
        this.$refs.tree2.setCheckedKeys(this.$refs.tree2.getCheckedKeys());
        if(obj.value == 1 && state){   //选择所有设备
          this.getmark(this.equList[0].children)
          obj.disabled = false;
          this.$refs.tree2.setCheckedKeys(this.$refs.tree2.getCheckedKeys());
        }else{   //选择单个设备
        console.log('选中的值',obj)
          this.getLocation(obj);
        }
      } else {     // 点击选择
        console.log('取消选择')
        if(obj.value == 1 && state){
          this.map.clearOverlays();
          this.mapMarker = []
        }else{
          const filter = this.mapMarker.filter(data => data.imei == obj.imei);
        if (filter.length) {
          // AMap.event.removeListener(filter[0].event);
          for(let i=0;i<filter.length;i++){
            this.map.removeOverlay(filter[i].marker);
            this.mapMarker.splice(this.mapMarker.indexOf(filter[i]),1)
          }
        }
        }
        
      }
    },
    getLocation(obj) {
      api.getLocation(obj.imei)
        .then(res => {
          this.getmark(res)
          obj.disabled = false;
          this.$refs.tree2.setCheckedKeys(this.$refs.tree2.getCheckedKeys());
        })
        .catch(err => {
          obj.disabled = false;
          this.$refs.tree2.setCheckedKeys(this.$refs.tree2.getCheckedKeys());
          const list = this.$refs.tree2.getCheckedKeys().filter(res => res !== obj.id);
          this.$refs.tree2.setCheckedKeys(list);
          this.$message.error(err.message);
        });
    },

    getmark(data){
      let ding = this.$t('table.Update')
      let loctype = this.$t('table.loctype')
      let dian = this.$t('view.ele')
      let _this = this;
      let res = []
      if( data[0] ){
        res = data
      }else{
        res.push(data)
      }
      let nolocaList = []
      let point = new BMap.Point();
      for (let i = 0;i<res.length;i++ ){
           if (res[i].lat && res[i].lon) {
            
            //  let aa = wgs84togcj02(res[i].lon,res[i].lat,res.content[i].abroad)
             point = new BMap.Point( res[i].lon,res[i].lat);
             var myIcon =null
            //  if(res[i].isOnline == 1){
            //    myIcon = new BMap.Icon(img, new BMap.Size(40,40),{anchor: new BMap.Size(10, 35)});
            //  }else{
            //    myIcon = new BMap.Icon(img2, new BMap.Size(30,66),{anchor: new BMap.Size(10, 35)});
            //    myIcon.setImageSize(new BMap.Size(15,33));//设置图标大小
            //  }
             myIcon = new BMap.Icon(img2, new BMap.Size(30,66),{anchor: new BMap.Size(10, 35)});
               myIcon.setImageSize(new BMap.Size(15,33));//设置图标大小
            var marker = new BMap.Marker(point,{icon:myIcon})
             this.mapMarker.push({
               imei:res[i].imei,
               marker:marker,
               lat: res[i].lat,
               lng:res[i].lon
             })
            this.map.addOverlay(marker);              // 将标注添加到地图中
            
            this.map.centerAndZoom(point, 13);
            if(!res[i].collectDt){
              res[i].collectDt =  res[i].lastAt
            }
            let typeop = res[i].positionType === 2 ? "WIFI" : res[i].positionType === 1 ? "GPS" : res[i].positionType === 0 ? "基站" :""
            var content = this.$t('table.imei') + ":" + res[i].imei + "<br>" + this.$t('table.Update') + ":" +  res[i].collectDt + "<br>" + 
            this.$t('table.loctype') + ":" + typeop + "<br>" + this.$t('table.wei') + ":" + res[i].lat + "<br>" + this.$t('table.jing') + ":" + res[i].lon;
             this.addClickHandler(content,marker);
            
          } else {
            if(res.length > 1){
              nolocaList.push(res[i])
            }else{
              this.$message.error(this.$t('message.locationno'));
            }
          }
      }
      if(nolocaList.length > 0 && res.length > 1){
              this.$message.error(this.$t('message.allterloca'));
            }

    },
    addClickHandler(content,marker){
          var that = this
		      marker.addEventListener("click",function(e){
			   that.openInfo(content,e)});
    },
    openInfo(content,e){
      console.log(e.target)
        var p = e.target;
        var opts = {
	           width : 200,     // 信息窗口宽度
	           height: 200,     // 信息窗口高度
	           title : this.$t('table.nowdata') , // 信息窗口标题
	           enableMessage:true,//设置允许信息窗发送短息
	        }
		    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
		    this.map.openInfoWindow(infoWindow,point); //开启信息窗口
	  },
    search(){
        this.$refs.tree2.setCheckedKeys([])
        this.rollBack('scroll')
        this.listLoading=true
        if(this.imei != ''){
          this.equList[0].children = []
        }else{
          this.getList()
          return
        } 
        api.getEquListtwo({params:{
                    imei:this.imei,
                    userId :this.$store.getters.usercode
                }}).then(_=>{
                   const list=[]
                   let src = []
                   if(_.content.length == 0){
                        this.$message.error('该设备不存在');
                     }else{
                      src=_.content
                        for (let i in src) {
                        src[i].imei = `${src[i].deviceName}`;
                          if (
                          this.mapMarker.filter(res => res.id == src[i].deviceId).length
                          ) {
                          list.push(src[i].deviceId);
                          }
                        }
                     }
            this.page.total =src.length;
            this.equList[0].children = src;
            this.$refs.tree2.setCheckedKeys(list);
            this.listLoading=false
        }).catch(_=>{
          if(_.message == 'token 无效或过期'){
            this.$message.error('用户登录过期，请重新登陆');
          }else{
            this.$message.error(_.message);
          }
            this.listLoading=false
        })
    },
    isMap() {
      if (this.active == "map") {
        this.setMap("map");
      }
    },
    setMap(id) {
      this.map = new BMap.Map("map"); // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(121.362426, 31.123795), 13); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      this.map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        })
      );
      this.map.setCurrentCity("上海"); // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
      // var marker = new BMap.Marker(new BMap.Point(121.362426, 31.123795));
      // this.map.addOverlay(marker);
    },
    refresh() {
      //this.equList = [];
      this.$refs.tree2.setCheckedKeys([]);
      this.deleteMapMarker();
      this.deleteInfoWindow();
      this.map.clearOverlays();
      if (this.imei) {
        this.imei = "";
        this.listLoading = true;
      } else {
        this.getList();
      }
      // this.changeindex(1)
    },
    getGroupList() {
      this.$refs.tree2.setCheckedKeys([]);
      this.rollBack("scroll");
      this.listLoading = true;
      api
        .getGroupList({ user_id: this.user })
        .then(res => {
          if (res.length) {
            api
              .getEquListPagination({
                pageSize: this.page.size,
                offset: this.page.index - 1,
                columns: this.imei
                  ? [
                      { name: "group_id", value: res[0].id },
                      { name: "imei", value: this.imei }
                    ]
                  : [{ name: "group_id", value: res[0].id }]
              })
              .then(_ => {
                if (Array.isArray(_.data)) {
                  const list = [];
                  for (let i in _.data) {
                    _.data[i].imei = `${_.data[i].imei}(${_.data[
                      i
                    ].model.substr(0, 4)})`;
                    if (
                      this.mapMarker.filter(res => res.id == _.data[i].id)
                        .length
                    ) {
                      list.push(_.data[i].id);
                    }
                  }
                  this.page.total = _.page.count;
                  this.equList = _.data;
                  this.$refs.tree2.setCheckedKeys(list);
                } else {
                  this.$message.error(this.$t('table.faillist'));
                }
                this.listLoading = false;
              })
              .catch(_ => {
                this.$message.error(_.message);
                this.listLoading = false;
              });
          } else {
            this.$message.error(this.$t('table.faillist'));
            this.listLoading = false;
          }
        })
        .catch(err => {
          this.$message.error(err.message);
          this.listLoading = false;
        });
    },
    getAllList() {
      this.$refs.tree2.setCheckedKeys([]);
      this.rollBack("scroll");
      this.listLoading = true;
      api
        .getEqulistnew({
          params: {
            pageSize: this.page.size,
            pageNo: this.page.index - 1,
            deviceGroupId: "",
            userId:this.$store.getters.usercode
          }
        }).then(_ => {
          if (Array.isArray(_.content)) {
            const list = [];
            for (let i in _.content) {
               _.content[i].deviceName = `${_.content[i].deviceName}`;
              _.content[i].imei = `${_.content[i].imei}`;
              if (
                this.mapMarker.filter(res => res.id == _.content[i].id).length
              ) {
                list.push(_.content[i].id);
              }
            }
            this.page.total = _.total;
            console.log(_.content)
            this.equList[0].children = _.content;
            this.$refs.tree2.setCheckedKeys(list);
          } else {
            this.$message.error(this.$t('table.faillist'));
          }
          this.listLoading = false;
        })
        .catch(_ => {
          this.$message.error(_.message);
          this.listLoading = false;
        });
    },
    getList() {
      this.getAllList();
    },
    deleteInfoWindow() {
      //删除信息窗口
      if (this.infoWindow) {
        this.infoWindow.close();
      }
    },
    deleteMapMarker() {
      //删除点
      for (let i = 0; i < this.mapMarker.length; i++) {
        // AMap.event.removeListener(this.mapMarker[i].event);
        this.map.removeOverlay(this.mapMarker[i].mapker);
      }
      this.mapMarker = [];
    },
    deletePolyline() {
      //删除线
      if (this.polyline) {
        this.map.removeOverlay(this.polyline);
      }
    }
  }
};
</script>
<style type="stylesheet/scss" lang="scss">
#location {
  .el-tree-node__content {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 0;
  }
  .el-tree-node__label {
    font-size: 15px;
  }
}
.el-icon-caret-right:before {
  display: none;
}
.text{
  line-height: 28px;
}
.text span{
  font-size: 16px;
  font-weight: bold;
  padding-right: 2px;
}
</style>
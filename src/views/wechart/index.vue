<template>
  <div id="users">
    <el-row :gutter="20" class="item_row_L">
      <el-col :span="8" class="top_left">
        <el-card>
          <!-- <el-row>
            <el-col class="top_left_title top_left_title_t" :span="12">{{
              $t("view.mine")
            }}</el-col>
            <el-col class="top_left_title" :span="12">{{
              $t("view.service")
            }}</el-col>
          </el-row> -->
          <div class="myChart_top ">
            <div @click="evt_change_userInfoType('my')" class="top_left_title" :class="user_info_type == 'my' ? 'top_left_title_t' : ''">{{$t("view.mine")}}</div>
            <div v-if="user_type == '2' && user_falg" @click="evt_change_userInfoType('service')" class="top_left_title" :class="user_info_type == 'service' ? 'top_left_title_t' : ''">{{$t("view.service")}}</div>
          </div>
          <el-row>
            <div class="top_left_bottom">
              <div>
                <img src="../../assets/img/deafult_user_head_portrait.png" alt="" />
              </div>
              <div>
                <div>{{ $t("table.count") }}：{{userInfo.username}}</div>
                <div>{{ $t("view.customerType") }}：{{user_info_type == 'service' ? '服务商' : user_sort[user_type]}}</div>
                <div>{{ $t("table.phone") }}：{{userInfo.phoneNumber}}</div>
              </div>
            </div>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading_two">
          <div class="myChart_top">
            <div>设备状态统计</div>
            <img @click="evt_refresh" data-type="2" src="../../assets/img/refresh.png" alt="" />
          </div>
          <el-row>
            <el-col :span="24">
              <div
                id="myChart2"
                :style="{ height: '26vh', margin: '10px auto' }"
              ></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading_three">
          <div class="myChart_top">
            <div>激活统计</div>
            <img @click="evt_refresh" data-type="3" src="../../assets/img/refresh.png" alt="" />
          </div>
          <el-row>
            <el-col :span="24">
              <div
                id="myChart3"
                :style="{ height: '26vh', margin: '10px auto' }"
              ></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!-- <el-col :span="18" class="top_right">
        <el-card class="top_right_top">
          <div class="top_right_top_title">
            <div>{{ $t("view.customerInfo") }}</div>
            <img src="../../assets/img/refresh.png" alt="" />
          </div>
          <el-row>
            <el-col :span="10">
              <el-input
                :placeholder="$t('view.searchUser')"
                v-model="search"
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <div class="top_div_tree">
                <el-tree
                  :data="data"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                ></el-tree>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="info_content">
                <div>本部测试</div>
                <div>
                  <div class="info_content_item">
                    <div>库存：100</div>
                    <div>总数：1000</div>
                  </div>
                  <div class="info_content_item">
                    <div>联系人：李墨</div>
                    <div>联系电话：13552181899</div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col> -->
    </el-row>
    <el-row :gutter="20" class="item_row_item">
      <el-col :span="8">
        <el-card v-loading="loading_one">
          <div class="myChart_top">
            <div>库存统计</div>
            <img @click="evt_refresh" data-type="1" src="../../assets/img/refresh.png" alt="" />
          </div>
          <el-row style="position: relative;">
            <!-- <el-col :span="24">
              <div
                id="myChart1"
                :style="{ height: '26vh', margin: '10px auto' }"
              ></div>
            </el-col> -->
              <el-col :span="24">
                <div id="myChart1" :style="{ height: '26vh', margin: '10px' }"></div>
              </el-col>
              <!-- <el-col :span="6"> -->
                <div class="myChart_text_content myChart1_text_content">
                  <div>总进货数：{{Inventory_deviceCount + Sold_deviceCount}}</div>
                  <div>库存：{{Inventory_deviceCount}}</div>
                  <div>已销售：{{Sold_deviceCount}}</div>
                </div>
              <!-- </el-col> -->
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card v-loading="loading_four">
          <div class="myChart_top">
            <div>设备期限</div>
            <img @click="evt_refresh" data-type="4" src="../../assets/img/refresh.png" alt="" />
          </div>
          <el-row>
            <el-col :span="24">
              <div
                id="myChart4"
                :style="{ height: '26vh', margin: '10px auto' }"
              ></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="myChart_top">
            <div>轨迹信息</div>
          </div>
          <el-row>
            <el-col :span="24">
              <div class="track_info">
                <div class="track_info_top">
                  <el-input placeholder="请输入设备IMEI" v-model="search_word"></el-input>
                  <div class="track_info_top_tab" v-if="search_result.length > 0">
                      <el-table @row-click="evt_row_click"  size="mini" :data="search_result" style="width:100%" :show-header="false">
                        <el-table-column prop="deviceNumber"></el-table-column>
                      </el-table>
                  </div>
                </div>
                <div class="track_info_btn">
                  <el-row>
                    <el-col :span="8" :offset="8">
                      <el-button @click="evt_nav('track')" size="small" class="track_info_btn_bt"
                        >查看轨迹</el-button
                      >
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" :offset="8">
                      <el-button @click="evt_nav('trace')" size="small" class="track_info_btn_bt"
                        >追踪</el-button
                      >
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/api/wechart";
import CountTo from "vue-count-to";
import mixin from "@/mixins/index";
import { mapGetters } from "vuex";
import { alatype } from "@/plugins/filter.js";
import * as echarts from "echarts";
export default {
  name: "users",
  mixins: [mixin],
  components: {
    CountTo,
  },
  data() {
    return {
      height: 1000,
      search: "",
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      option: {
        title: {},
        tooltip: {
          trigger: "item",
        },
        legend: {
            orient: 'vertical',
            right:'5%',
            top:'bottom',
        },
        series: [
          {
            type: "pie",
            radius: ["60%", "70%"],
            right:'20%',
            label:{
              formatter:'{b}: {c}'
            },
            labelLine: {
              show:true,
              length: 15,
              length2: 10,
              maxSurfaceAngle: 80
            },
          },
        ],
      },
      echarts_1: null,
      echarts_2: null,
      echarts_3: null,
      echarts_4: null,
      OnlineDviceCount:0,//在线设备
      OfflineDeviceCount:0,//离线设备
      ActivatedCount:0,//激活设备
      Unactivated_deviceCount:0,//未激活设备
      Using_deviceCount:0,//正在使用中设备
      Unexpired_deviceCount:0,//未过期设备
      Expired_deviceCount:0,//已过期设备
      Inventory_deviceCount:0, //设备库存
      Sold_deviceCount:0,//已销售设备
      loading_one:false,
      loading_two:false,
      loading_three:false,
      loading_four:false,
      search_word:'',
      search_result:[],
      btn_type:'',
      userInfo:{},
      user_type: '',
      user_id:'',
      user_info_type: 'my',//
      user_falg: true,//是否显示服务商信息
      user_sort:{
        1: '管理员',
        2: '服务商',
        3: '用户'
      },
      userType_parameter: '',//请求接口拼接的用户类型
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["lang"]),
  },
  created:function(){
    var _this = this;
    _this.userType_parameter = JSON.parse(sessionStorage['user']).userType;
    _this.getEchartsData_one();
    _this.getEchartsData_two();
    _this.getEchartsData_three();
    _this.getEchartsData_four();
    _this.user_type = JSON.parse(sessionStorage['user']).userType;
    _this.user_id = JSON.parse(sessionStorage['user']).userId;
    if(_this.user_type == '2'){
      _this.evt_queryBusinessUserInfo();
    }
  },
  mounted() {
    this.height = document.body.offsetHeight - 150;
    // this.main_width = document.body.offsetWidth - 236; // 可视区域的宽度 - 左侧导航栏的宽度
  },
  beforeDestroy() {},
  methods: {
    evt_change_userInfoType:function(type){
      // console.log(type);
      if(this.user_info_type == type) return;
      this.user_info_type = type;
      this.evt_queryBusinessUserInfo();
    },
    // 获取用户服务商信息
    evt_queryBusinessUserInfo:function(){
      var _this = this;
      var request_data = {};
      // request_data['userId'] = _this.user_id;
      api.queryBusinessUserInfo(request_data,_this.userType_parameter).then((res) => {
        // console.log(res);
        if(res.success){
          if(res.data.parentInfo == null || Object.keys(res.data.parentInfo).length == 0){
            _this.user_falg = false;
          }
          if(_this.user_info_type == 'my'){
            var userInfo = {};
            userInfo['username'] = res.data.username;
            userInfo['phoneNumber'] = res.data.phoneNumber || '----';
            _this.userInfo = userInfo;
          }else if(_this.user_info_type == 'service' && res.data.parentInfo){
            var userInfo = {};
            userInfo['username'] = res.data.parentInfo.username;
            userInfo['phoneNumber'] = res.data.parentInfo.phoneNumber || '----';
            _this.userInfo = userInfo;
          }
        }
      }).catch((err) => {
        _this.$message({type: 'error',message: '获取用户信息请求错误',offset:'200',duration:'1500'});
      })
    },
    handleNodeClick(data) {
      // 选择用户节点
      console.log(data);
    },
    formatter: function (name) {
      // console.log(name);
      for (var i = 0; i < this.option.series[0].data.length; i++) {
        if (this.option.series[0].data[i].name == name) {
          return name +": "+ this.option.series[0].data[i].value;
        }
      }
    },
    // 库存和已销售
    getEchartsData_one:function(){
      var _this = this;
      api.getInventory_device({},_this.userType_parameter).then((res) => {
        if(res.success){
          _this.Inventory_deviceCount = res.data.devices;
          api.getSold_device({},_this.userType_parameter).then((_res) => {
            if(_res.success){
              _this.Sold_deviceCount = _res.data.devices;
              _this.$nextTick(function(){
                var chartDom = document.getElementById("myChart1");
                _this.echarts_1 = echarts.init(chartDom);
                let option_str = JSON.stringify(_this.option);
                let option = JSON.parse(option_str);
                let data = [
                  { value: 0, name: "已销售" },
                  { value: 0, name: "库存" },
                ]
                data[0].value = _this.Sold_deviceCount;
                data[1].value = _this.Inventory_deviceCount;
                option.series[0]['data'] = data;
                option.color = ["#F14864", "#C4C6D1"];
                option.legend = {show:false};
                function formatter(name){
                  for (var i = 0; i < option.series[0].data.length; i++) {
                    if (option.series[0].data[i].name == name) {
                      return name +": "+ option.series[0].data[i].value;
                    }
                  }
                }
                option.legend.formatter = formatter;
                _this.echarts_1.setOption(option);
                _this.loading_one = false;
              })
            }
          }).catch((_err) => {
            _this.$message.error(_err.errMsg)
          })
        }
      }).catch((err) => {
        _this.$message.error(err.errMsg)
      })
    },
    // 设备状态
    getEchartsData_two:function(){
      var _this = this;
      api.getOnlineDvice({},_this.userType_parameter).then((res) => {
        if(res.success){
          _this.OnlineDviceCount = res.data.devices;
          api.getOfflineDevice({},_this.userType_parameter).then((_res) => {
            if(_res.success){
              _this.OfflineDeviceCount = _res.data.devices;
              _this.$nextTick(function(){
                var chartDom_2 = document.getElementById("myChart2");
                _this.echarts_2 = echarts.init(chartDom_2);
                let option_str = JSON.stringify(_this.option);
                let option = JSON.parse(option_str);
                let  data = [
                  { value: 0, name: "在线" },
                  { value: 0, name: "离线" },
                ];
                data[0].value = _this.OnlineDviceCount;
                data[1].value = _this.OfflineDeviceCount;
                option.series[0]['data'] = data;
                option.color = ["#2FC25B", "#C4C6D1"];
                function formatter(name){
                  for (var i = 0; i < option.series[0].data.length; i++) {
                    if (option.series[0].data[i].name == name) {
                      return name +": "+ option.series[0].data[i].value;
                    }
                  }
                }
                option.legend.formatter = formatter;
                _this.echarts_2.setOption(option);
                _this.loading_two = false;
              })
            }
          }).catch((_err) => {
            _this.$message.error(_err.errMsg)
          })
        }
      }).catch((err) => {
        _this.$message.error(err.errMsg)
      })
    },
    // 激活统计
    getEchartsData_three:function(){
      var _this = this;
      api.getActivated({},_this.userType_parameter).then((res) => {
        if(res.success){
          _this.ActivatedCount = res.data.devices;
          api.getUnactivated_device({},_this.userType_parameter).then((_res) => {
            if(_res.success){
              _this.Unactivated_deviceCount = _res.data.devices;
              _this.$nextTick(function(){
                var chartDom_3 = document.getElementById("myChart3");
                _this.echarts_3 = echarts.init(chartDom_3);
                let option_str = JSON.stringify(_this.option);
                let option = JSON.parse(option_str);
                let  data =  [
                  { value: 0, name: "激活" },
                  { value: 0, name: "未激活" },
                ];
                data[0].value = _this.ActivatedCount;
                data[1].value = _this.Unactivated_deviceCount;
                option.series[0]['data'] = data;
                option.color = ["#3E9AFF", "#C4C6D1"];
                function formatter(name){
                  for (var i = 0; i < option.series[0].data.length; i++) {
                    if (option.series[0].data[i].name == name) {
                      return name +": "+ option.series[0].data[i].value;
                    }
                  }
                }
                option.legend.formatter = formatter;
                _this.echarts_3.setOption(option);
                _this.loading_three = false;
              })
            }
          }).catch((_err) => {
            _this.$message.error(_err.errMsg)
          })
        }
      }).catch((err) => {
        _this.$message.error(err.errMsg)
      })
    },
    // 设备期限
    getEchartsData_four:function(){
      var _this = this;
      // getUsing_device()
      api.getOnlineDvice({},_this.userType_parameter).then((res) => {
        if(res.success){
          _this.Using_deviceCount = res.data.devices;
          api.getUnexpired_device({},_this.userType_parameter).then((_res) => {
            if(_res.success){
              _this.Unexpired_deviceCount = _res.data.devices;
              api.getExpired_device({},_this.userType_parameter).then((res_) => {
                if(res_.success){
                  _this.Expired_deviceCount = res_.data.devices;
                  _this.$nextTick(function(){
                    var chartDom_4 = document.getElementById("myChart4");
                    _this.echarts_4 = echarts.init(chartDom_4);
                    let option_str = JSON.stringify(_this.option);
                    let option = JSON.parse(option_str);
                    let  data =   [
                      { value: 0, name: "正在使用" },
                      { value: 0, name: "已过期" },
                      { value: 0, name: "未过期" },
                    ];
                    data[0].value = _this.Using_deviceCount;
                    data[1].value = _this.Expired_deviceCount;
                    data[2].value = _this.Unexpired_deviceCount;
                    option.series[0]['data'] = data;
                    option.color = ["#13C3C3", "#FACD13", "#C4C6D1"];
                    function formatter(name){
                      for (var i = 0; i < option.series[0].data.length; i++) {
                        if (option.series[0].data[i].name == name) {
                          return name +": "+ option.series[0].data[i].value;
                        }
                      }
                    }
                    option.legend.formatter = formatter;
                    _this.echarts_4.setOption(option);
                    _this.loading_four = false;
                  })
                }
              }).catch((err_) => {
                _this.$message.error(err_.errMsg)
              })
            }
          }).catch((_err) => {
            _this.$message.error(_err.errMsg)
          })
        }
      }).catch((err) => {
        _this.$message.error(err.errMsg)
      })
    },
    // 刷新
    evt_refresh:function(e){
      // console.log(e.target.getAttribute('data-type'));
      if(e.target.getAttribute('data-type') == '1'){
        this.loading_one = true;
        this.getEchartsData_one();
      }else if(e.target.getAttribute('data-type') == '2'){
        this.loading_two = true;
        this.getEchartsData_two();
      }else if(e.target.getAttribute('data-type') == '3'){
        this.loading_three = true;
        this.getEchartsData_three();
      }else if(e.target.getAttribute('data-type') == '4'){
        this.loading_four = true;
        this.getEchartsData_four();
      }
    },
    // 查询设备
    evt_queryDevices:function(){
      var _this = this;
      var request_data = {};
      request_data['deviceNumberKeyword'] = _this.search_word;
      request_data['page'] = 0;
      request_data['pageSize'] = 20;
      api.getDevicesList(request_data,_this.userType_parameter).then((res) => {
        // console.log(res);
        _this.search_result = [];
        if(res.success && res.data && res.data.content && res.data.content.length > 0){
          _this.search_result = res.data.content;
        }else if(res.success && res.data && res.data.content && res.data.content.length == 0){
          _this.$message({message:'暂未搜索到设备信息',type:'warning',offset:'200',duration:'2000'});
        }
      }).catch((err) => {
        _this.$message({message: err.msg || '请求错误，请稍后重试' ,type:'error',offset:'200',duration:'2000'});
      })
    },
    evt_nav:function(value){
      this.btn_type = value;
      if(this.search_word.trim() == '') return;
      this.evt_queryDevices();
    },
    evt_row_click:function(row){
      console.log(row);
      if(this.btn_type == 'trace'){
        let routeUrl = this.$router.resolve({
            path: "/trace",
            query: {deviceId:row.id,panorama:'trace'}
        });
        window.open(routeUrl.href, '_blank');
      }else if(this.btn_type == 'track'){
        this.$router.push({path:'/control/control',query:{deviceId:row.id}});
      }
    },
  },
  // 过滤器格式化时间戳
  filters: {
    //  时间格式自定义 只需把字符串里面的改成自己所需的格式
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title {
  border-bottom: 1px solid gray;
}
#users {
  padding: 20px;
//   background: #f2f2f2;
}
.item_row_L {
  margin-bottom: 20px;
  // margin-left: 0px !important;
}
.top_left {
  box-sizing: border-box;
  background: rgb(255, 255, 255);
  border-radius: 4px;
  .top_left_title {
    width: 50%;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #666666;
    text-align: center;
    cursor: pointer;
  }
  .top_left_title_t {
    color: #547fed;
  }
  .top_left_bottom {
    width: 100%;
    height: 26vh;
    margin-top: 10px;
    margin-bottom: 10px;
    border-top: 1px solid #eeeeee;
    display: flex;
    justify-content: center;
    align-items: center;
    > div:nth-of-type(1) {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      margin-right: 2vh;
      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    > div:nth-of-type(2) {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #666666;
      line-height: 24px;
    }
  }
}
.top_right {
  height: 32vh;
  .top_right_top {
    height: 100%;
    .top_right_top_title {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        line-height: 24px;
      }
      > img {
        width: 18px;
        height: 18px;
      }
    }
    // .top_div_tree{
    //     overflow-y: scroll;
    // }
    .info_content {
      width: 100%;
      > div:nth-of-type(1) {
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #333333;
        text-align: center;
        margin-bottom: 2vh;
      }
      > div:nth-of-type(2) {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .info_content_item {
          > div {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            line-height: 30px;
          }
        }
      }
    }
  }
}
.item_row_item {
  margin-bottom: 20px;
}
.myChart_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
  }
  > img {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}
.myChart_text_content {
  // height: 26vh;
  position: absolute;
  bottom: 5%;
  right: 2%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #666666;
  line-height: 24px;
  cursor: pointer;
}
.myChart1_text_content {
  > div {
    position: relative;
  }
  > div:nth-of-type(1) {
    top: 0px;
    left: -26px;
  }
  > div:nth-of-type(2)::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 14px;
    background: #c4c6d1;
    border-radius: 4px;
    position: absolute;
    top: 4px;
    left: -26px;
  }
  > div:nth-of-type(3)::before {
    content: "";
    display: inline-block;
    width: 24px;
    height: 14px;
    background: #f14864;
    border-radius: 4px;
    position: absolute;
    top: 4px;
    left: -26px;
  }
}
.track_info {
  height: 26vh;
  margin-top: 10px;
  margin-bottom: 10px;
}
.track_info_top{
  position: relative;
  .track_info_top_tab{
    width: 100%;
    max-height: 20vh;
    overflow-y: scroll;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    position: absolute;
    top: 40px;
    left: 0px;
    z-index: 999;
    cursor: pointer;
  }
}
.track_info_btn {
  margin-top: 6vh;
  .track_info_btn_bt {
    width: 100%;
    margin-bottom: 2vh;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
// @media screen and (min-width: 1400px) {
//     #users {
//         .title{
//             .icon-mobancaidan{
//                 font-size:60px;
//             }
//             .title_name{
//                 font-size: 16px;
//             }
//             .title_num{
//                 font-size: 30px;
//             }
//         }
//     }
// }
// @media (min-width: 1260px) and (max-width: 1400px) {
//     #users {
//         .title{
//             .icon-mobancaidan{
//                 font-size:50px;
//             }
//             .title_name{
//                 font-size: 16px;
//             }
//             .title_num{
//                 font-size: 30px;
//             }
//         }
//     }
// }
// @media (min-width: 1048px) and (max-width: 1260px) {
//     #users {
//         .title{
//             .icon-mobancaidan{
//                 font-size:40px;
//             }
//             .title_name{
//                 font-size: 15px;
//             }
//             .title_num{
//                 font-size: 30px;
//             }
//             .el-card__body{
//                 padding:20px 10px;
//             }
//         }
//     }
// }
// @media screen and (max-width: 1048px) {
//     #users {
//         .title{
//             .icon-mobancaidan{
//                 font-size:30px;
//             }
//             .title_name{
//                 font-size: 14px;
//             }
//             .title_num{
//                 font-size: 30px;
//             }
//             .el-card__body{
//                 padding:20px 5px;
//             }
//         }
//     }
// }
</style>
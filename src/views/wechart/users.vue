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
            <div class="top_left_title top_left_title_t">{{$t("view.mine")}}</div>
            <div class="top_left_title">{{$t("view.service")}}</div>
          </div>
          <el-row>
            <div class="top_left_bottom">
              <div>
                <img src="" alt="" />
              </div>
              <div>
                <div>{{ $t("table.count") }}：Admin</div>
                <div>{{ $t("view.customerType") }}：代理商</div>
                <div>{{ $t("table.phone") }}：18586861988</div>
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
            <el-col :span="17">
              <div
                id="myChart2"
                :style="{ height: '26vh', margin: '10px auto' }"
              ></div>
            </el-col>
            <el-col :span="7">
              <div class="myChart_text_content myChart2_text_content">
                <div>在线：{{OnlineDviceCount}}</div>
                <div>离线：{{OfflineDeviceCount}}</div>
              </div>
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
            <el-col :span="17">
              <div
                id="myChart3"
                :style="{ height: '26vh', margin: '10px auto' }"
              ></div>
            </el-col>
            <el-col :span="7">
              <div class="myChart_text_content myChart3_text_content">
                <div>激活：{{ActivatedCount}}</div>
                <div>未激活：{{Unactivated_deviceCount}}</div>
              </div>
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
          <el-row>
            <el-col :span="17">
              <div
                id="myChart1"
                :style="{ height: '26vh', margin: '10px auto' }"
              ></div>
            </el-col>
            <el-col :span="7">
              <div class="myChart_text_content myChart1_text_content">
                <div>总进货数：{{Inventory_deviceCount + Sold_deviceCount}}</div>
                <div>库存：{{Inventory_deviceCount}}</div>
                <div>已销售：{{Sold_deviceCount}}</div>
              </div>
            </el-col>
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
            <el-col :span="17">
              <div
                id="myChart4"
                :style="{ height: '26vh', margin: '10px auto' }"
              ></div>
            </el-col>
            <el-col :span="7">
              <div class="myChart_text_content myChart4_text_content">
                <div>正在使用：{{Using_deviceCount}}</div>
                <div>已过期：{{Expired_deviceCount}}</div>
                <div>未过期：{{Unexpired_deviceCount}}</div>
              </div>
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
                <el-input placeholder="请输入设备IMEI"></el-input>
                <div class="track_info_btn">
                  <el-row>
                    <el-col :span="8" :offset="8">
                      <el-button size="small" class="track_info_btn_bt"
                        >查看轨迹</el-button
                      >
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="8" :offset="8">
                      <el-button size="small" class="track_info_btn_bt"
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
    selected: 0;
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
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: ["60%", "70%"],
            data: [
              { value: 0, name: "已销售" },
              { value: 0, name: "库存" },
            ],
          },
        ],
        color: ["#F14864", "#C4C6D1"],
      },
      option_2: {
        title: {},
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: ["60%", "70%"],
            data: [
              { value: 0, name: "在线" },
              { value: 0, name: "离线" },
            ],
          },
        ],
        color: ["#2FC25B", "#C4C6D1"],
      },
      option_3: {
        title: {},
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: ["60%", "70%"],
            data: [
              { value: 0, name: "激活" },
              { value: 0, name: "未激活" },
            ],
          },
        ],
        color: ["#3E9AFF", "#C4C6D1"],
      },
      option_4: {
        title: {},
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: ["60%", "70%"],
            data: [
              { value: 0, name: "正在使用" },
              { value: 0, name: "已过期" },
              { value: 0, name: "未过期" },
            ],
            labelLine: {
              show: true,
              length2: 6,
            },
          },
        ],
        color: ["#13C3C3", "#FACD13", "#C4C6D1"],
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
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["lang"]),
  },
  created:function(){
    var _this = this;
    _this.getEchartsData_one();
    _this.getEchartsData_two();
    _this.getEchartsData_three();
    _this.getEchartsData_four();
  },
  mounted() {
    this.height = document.body.offsetHeight - 150;
    // this.main_width = document.body.offsetWidth - 236; // 可视区域的宽度 - 左侧导航栏的宽度
  },
  beforeDestroy() {},
  methods: {
    handleNodeClick(data) {
      // 选择用户节点
      console.log(data);
    },

    // 库存和已销售
    getEchartsData_one:function(){
      var _this = this;
      api.getInventory_device().then((res) => {
        if(res.success){
          _this.Inventory_deviceCount = res.data.devices;
          api.getSold_device().then((_res) => {
            if(_res.success){
              _this.Sold_deviceCount = _res.data.devices;
              _this.$nextTick(function(){
                var chartDom = document.getElementById("myChart1");
                _this.echarts_1 = echarts.init(chartDom);
                _this.option.series[0].data[0].value = _this.Sold_deviceCount;
                _this.option.series[0].data[1].value = _this.Inventory_deviceCount;
                _this.echarts_1.setOption(_this.option);
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
      api.getOnlineDvice().then((res) => {
        if(res.success){
          _this.OnlineDviceCount = res.data.devices;
          api.getOfflineDevice().then((_res) => {
            if(_res.success){
              _this.OfflineDeviceCount = _res.data.devices;
              _this.$nextTick(function(){
                var chartDom_2 = document.getElementById("myChart2");
                _this.echarts_2 = echarts.init(chartDom_2);
                _this.option_2.series[0].data[0].value = _this.OnlineDviceCount;
                _this.option_2.series[0].data[1].value = _this.OfflineDeviceCount;
                _this.echarts_2.setOption(_this.option_2);
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
      api.getActivated().then((res) => {
        if(res.success){
          _this.ActivatedCount = res.data.devices;
          api.getUnactivated_device().then((_res) => {
            if(_res.success){
              _this.Unactivated_deviceCount = _res.data.devices;
              _this.$nextTick(function(){
                var chartDom_3 = document.getElementById("myChart3");
                _this.echarts_3 = echarts.init(chartDom_3);
                _this.option_3.series[0].data[0].value = _this.ActivatedCount;
                _this.option_3.series[0].data[1].value = _this.Unactivated_deviceCount;
                _this.echarts_3.setOption(_this.option_3);
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
      api.getUsing_device().then((res) => {
        if(res.success){
          _this.Using_deviceCount = res.data.devices;
          api.getUnexpired_device().then((_res) => {
            if(_res.success){
              _this.Unexpired_deviceCount = _res.data.devices;
              api.getExpired_device().then((res_) => {
                if(res_.success){
                  _this.Expired_deviceCount = res_.data.devices;
                  _this.$nextTick(function(){
                    var chartDom_4 = document.getElementById("myChart4");
                    _this.echarts_4 = echarts.init(chartDom_4);
                    _this.option_4.series[0].data[0].value = _this.Using_deviceCount;
                    _this.option_4.series[0].data[1].value = _this.Expired_deviceCount;
                    _this.option_4.series[0].data[2].value = _this.Unexpired_deviceCount;
                    _this.echarts_4.setOption(_this.option_4);
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
      console.log(e.target.getAttribute('data-type'));
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
    }



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
  height: 26vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #666666;
  line-height: 24px;
}
.myChart1_text_content {
  > div {
    position: relative;
  }
  > div:nth-of-type(1) {
    top: 0px;
    left: -12px;
  }
  > div:nth-of-type(2)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #c4c6d1;
    position: absolute;
    top: 7px;
    left: -12px;
  }
  > div:nth-of-type(3)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #f14864;
    position: absolute;
    top: 7px;
    left: -12px;
  }
}
.myChart2_text_content {
  > div {
    position: relative;
  }
  > div:nth-of-type(1)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #2fc25b;
    position: absolute;
    top: 7px;
    left: -12px;
  }
  > div:nth-of-type(2)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #c4c6d1;
    position: absolute;
    top: 7px;
    left: -12px;
  }
}
.myChart3_text_content {
  > div {
    position: relative;
  }
  > div:nth-of-type(1)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #3e9aff;
    position: absolute;
    top: 7px;
    left: -12px;
  }
  > div:nth-of-type(2)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #c4c6d1;
    position: absolute;
    top: 7px;
    left: -12px;
  }
}
.myChart4_text_content {
  > div {
    position: relative;
  }
  > div:nth-of-type(1)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #13c3c3;
    position: absolute;
    top: 7px;
    left: -12px;
  }
  > div:nth-of-type(2)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #facd13;
    position: absolute;
    top: 7px;
    left: -12px;
  }
  > div:nth-of-type(3)::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #c4c6d1;
    position: absolute;
    top: 7px;
    left: -12px;
  }
}
.track_info {
  height: 26vh;
  margin-top: 10px;
  margin-bottom: 10px;
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

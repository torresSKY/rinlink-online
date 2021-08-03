
<template>
    <div class="container">
        <div class="table-header">
            <table id="gridViewTableContent">
                <thead>
                    <tr class="thead">
                        <th width="60">序号</th>
                        <th width="100">更新时间</th>
                        <th width="80">经度</th>
                        <th width="80">纬度</th>
                        <th width="60">速度(km/h)</th>
                        <th width="80">定位类型</th>
                        <th width="200">位置</th>
                    </tr>
                </thead>
            </table>
        </div>
        <el-scrollbar ref="tableScrollbar" class="table-scrollbar" :native="false" viewClass="scrollbarTable">
            <table class="table" v-infinite-scroll="evt_scroll_load" infinite-scroll-immediate="false" infinite-scroll-distance="0">
                <tbody id="trackDetailTable">
                    <tr class="tr" :class="track_step - 1 == index ? 'tr_t':''" v-for="(item,index) in tracksDetail_list" :key="index" @click="evt_click(index,item)">
                        <td width="60">{{index + 1}}</td>
                        <td width="100">{{item.time|formatDate}}</td>
                        <td width="80">{{item.lng|formatLngLat}}</td>
                        <td width="80">{{item.lat|formatLngLat}}</td>
                        <td width="60">{{item.speed|formatSpeed}}</td>
                        <td width="80">{{positionType[item.positionType]}}</td>
                        <td width="200">{{item.address}}</td>
                    </tr>
                </tbody>
            </table>
        </el-scrollbar>
    </div>
</template>
<script>
import { formatDate } from '@/plugins/date.js'
export default {
    name:'componentTab',
    props:['dataList','step','playFlag'],
    data(){
        return{
            tracksDetail_list:[],//轨迹明细信息
            all_tracks_list: this.dataList,//查询日期内的全部轨迹
            track_step: this.step,//轨迹步数下标
            positionType:{
                '-1': '无定位',
                '1':'GPS',
                '2':'WIFI',
                '3': '基站'
            },
            play_flag: this.playFlag,
        }
    },
    watch:{
        dataList:{
            handler(){
                this.all_tracks_list = this.dataList;
                this.tracksDetail_list = this.all_tracks_list.slice(0,100);
            },
            deep: true
        },
        step:{
            handler(){
                this.track_step = this.step;
                if(this.track_step > this.tracksDetail_list.length){
                    this.tracksDetail_list = this.tracksDetail_list.concat(this.all_tracks_list.slice(this.tracksDetail_list.length,this.tracksDetail_list.length + 100));
                }else{
                    this.evt_setCurrent();
                }
            },
            deep: true
        },
        playFlag:{
            handler(){
                this.play_flag = this.playFlag;
            },
            deep: true
        }
    },
    created:function(){

    },
    methods: {
        // 设置table高亮行
        evt_setCurrent:function() {
            if(this.track_step > 5){
                this.$refs['tableScrollbar'].wrap.scrollTop = 24 * (this.track_step - 2);
            }else{
                this.$refs['tableScrollbar'].wrap.scrollTop = 0;
            }
        },
        evt_scroll_load:function(){
            this.tracksDetail_list = this.tracksDetail_list.concat(this.all_tracks_list.slice(this.tracksDetail_list.length,this.tracksDetail_list.length + 100));
        },
        // 点击table中的某一行
        evt_click:function(index,item){
            if(this.play_flag) return;
            this.track_step = index + 1;
            this.$emit('handleCurrentChange',item);
        }
    },
    filters:{
        formatDate(val) {
            let date = new Date(val)
            // 判断这个时间格式是否为NaN-aN-aN aN:aN:aN，
            return isNaN(date) ? " " : formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        },
        formatLngLat:function(val){
            var str = val.toString();
            return str.slice(0,str.indexOf('.')+7);
        },
        formatSpeed:function(val){
            if(val == null){
                return 0;
            }else{
                return val
            }
        },
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .container{
        width: 100%;
        height: 220px;
    }
    .table-header{
        padding-right: 18px;
        box-sizing: border-box;
    }
    #gridViewTableContent{
        width: 100%;
        height: 26px;
        background: #E6E6E680;
        border-spacing:0px;
    }
    .thead th{
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #666666;
    }
    .table-scrollbar{
        width: 100%;
        height: 192px;
        padding-right: 18px;
        box-sizing: border-box;
        cursor: pointer;
        /deep/ .el-scrollbar__bar.is-vertical{
            width: 0px;
        }
    }
    .table{
        width: 100%;
        border: 1px solid #E6E6E680;
        border-spacing:0px;
    }
    #trackDetailTable tr{
        height: 24px;
    }
    .tr{
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #666666;
        text-align: center;
    }
    .tr_t{
        background: #409EFF70;
    }
    .tr>td{
        border-right: 1px solid #E6E6E680;
        border-top: 1px solid #E6E6E680;
    }
    .tr>td:last-of-type{
        border-right: 0px;
    }
</style>
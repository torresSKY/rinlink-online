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
                                    
                                </div>
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
import api from '@/api/wechart/index'
import {gcj02tobd09, bd09togcj02, gcj02towgs84, wgs84togcj02} from '@/utils/baidumap.js'
export default {
    name: 'electric',
    data(){
        return{
            fencelist: null,   //电子围栏列表
            searchfence: null,
            searchimei: null,
            fencename: null,
            fenceaddress: null,
            fencelat: null,
            fencelng: null,
            fenceradio: null,
            fenceala: 0,
            grouplist: null,
        }
    },
    watch: {
        $route() {
            this.setMap()
        },
    },
    mounted(){
      
        
    },
    watch: {
        
    },
    methods: {
        //获取围栏列表
        //添加围栏
        //删除围栏
        //围栏添加设备
        //围栏移除设备
        //获取其他设备
    }
}
</script>
<style scoped>
#map{
    width: 100%;
    height:600px;
}
</style>

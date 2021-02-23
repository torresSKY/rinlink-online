<template>
  <div id="users" :style="{minWidth:main_width*0.5 + 'px',overflow: 'hidden'}">
    <el-row :gutter="22" >
        <el-col :span="6" >
            <el-card>
                <div >
                    <span style="margin-left:10%">{{$t('view.mine')}}</span>
                    <span style="margin-left:40%">{{$t('view.service')}}</span>
                </div>
            </el-card>
            <el-card >
                <el-col :span='12'>
                     头像
                </el-col>
                <el-col :span='12'>
                    <div>
                        <span>{{$t('table.count')}}：</span>
                    </div>
                   <div>
                        <span>{{$t('view.customerType')}}：</span>
                    </div>
                    <div>
                        <span>{{$t('table.phone')}}：</span>
                    </div>
                </el-col>
            </el-card>
        </el-col>
        <el-col :span='18' >
            <el-card >
                <div>{{$t('view.customerInfo')}}</div>
                <el-col :span='12' >
                    <el-row style="padding:0 10px">
                        <el-input :placeholder="$t('view.searchUser')" v-model="search" class="input-with-select">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                        </el-input>
                        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </el-row>
                </el-col>
                <el-col :span='12'>
                    <div>{{$t('view.customerInfo')}}</div>
                    <el-col :span='12'>
                        <div>{{$t('view.customerInfo')}}</div>
                        <div>{{$t('view.customerInfo')}}</div>
                    </el-col>
                    <el-col :span='12'>
                        <div>{{$t('view.customerInfo')}}</div>
                        <div>{{$t('view.customerInfo')}}</div>
                    </el-col>
                </el-col>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="22">
        <el-col :span='8'>
            <el-card>
                <div>{{$t('view.customerInfo')}}</div>
                <el-row :gutter="22">
                    <div id="myChart1" :style="{ height: '26vh', margin:'10px auto'}"></div>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span='8'>
            <el-card>
                <div>{{$t('view.customerInfo')}}</div>
                <el-row :gutter="22">
                    <div id="myChart1" :style="{ height: '26vh', margin:'10px auto'}"></div>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span='8'>
            <el-card>
                <div>{{$t('view.customerInfo')}}</div>
                <el-row :gutter="22">
                    <div id="myChart1" :style="{ height: '26vh', margin:'10px auto'}"></div>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="22"> 
        <el-col :span='8'>
            <el-card>
                <div>{{$t('view.customerInfo')}}</div>
                <el-row :gutter="22">
                    <div id="myChart1" :style="{ height: '26vh', margin:'10px auto'}"></div>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span='8'>

        </el-col>
    </el-row>       
  </div>
</template>

<script>
import api from '@/api/wechart'
import CountTo from 'vue-count-to'
import mixin from '@/mixins/index'
import { mapGetters} from "vuex"
import {alatype} from '@/plugins/filter.js'
export default {
    name: 'users',
    mixins:[mixin],
    components:{
        CountTo
    },
    data() {
        selected:0;
        return {
            height:1000,
            search:'',
            data:[],
            defaultProps: {
              children: 'children',
              label: 'label'
            },
        }
    },
    watch: {
        
    },
    computed: {
    ...mapGetters(['lang'])
    },
    mounted() {
        this.height=document.body.offsetHeight-150
        this.main_width = document.body.offsetWidth - 236 // 可视区域的宽度 - 左侧导航栏的宽度
        
    },
    beforeDestroy() {
        
    },
    methods: {
        handleNodeClick(data) { // 选择用户节点
          console.log(data)
        },
    },
  // 过滤器格式化时间戳
  filters: {
    //  时间格式自定义 只需把字符串里面的改成自己所需的格式
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title{
    border-bottom: 1px solid gray;
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

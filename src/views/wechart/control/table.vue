
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
        <el-scrollbar :native="false">
            <div class="table-scrollbar">
                <table class="table">
                    <tbody id="trackDetailTable">
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                        <tr class="tr">
                            <td width="60">1</td>
                            <td width="100">2021-09-12 12:20:10</td>
                            <td width="80">131.999987</td>
                            <td width="80">32.989878</td>
                            <td width="60">7</td>
                            <td width="80">基站</td>
                            <td width="200">上海市闵行区新镇路288号闵行体育公园</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </el-scrollbar>
    </div>
</template>
<script>
export default {
    name:'componentTab',
    props:['contentList'],
    data(){
        return{
            // contentdata:this.contentList,
        }
    },
    watch:{
        // contentList:{
        //     handler(){
        //         this.contentdata = this.contentList;
        //     },
        //     deep:true
        // }
    },
    filters:{
       
    },
    created:function(){

    },
    methods: {
        
    },
}
</script>
<style scoped>
    .container{
        width: 100%;
        height: 220px;
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
        height: 192px;
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
    .tr>td{
        border-right: 1px solid #E6E6E680;
        border-top: 1px solid #E6E6E680;
    }
    .tr>td:last-of-type{
        border-right: 0px;
    }

</style>
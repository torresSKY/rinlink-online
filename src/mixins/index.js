module.exports={
    data(){
        return{
            page:{
                index:1,                                //当前页   
                size:20,                                //一页的数量
                total:0                                 //总数量
            },
            radioId:'',                                 //table单选中的id
            sort:'',                                    //升序降序
            sort_type:'',                                //升序降序的类型
            alatypelist: [
                {value: 1,name: this.$t('table.powerala')},
                {value: 3,name: this.$t('table.sosala')},
                {value: 4,name: this.$t('table.dropala')},
                {value: 5,name: this.$t('table.lightala')},
                {value: 2,name: this.$t('table.moveala')},
                {value: 6,name: this.$t('table.vibala')},
                {value: 7,name: this.$t('table.disala')},
                {value: 8,name: this.$t('table.smokeala')},
                {value: 9,name: this.$t('table.gasala')},
                {value: 10,name: this.$t('table.temalarm')},
                {value: 11,name: this.$t('table.humalarm')},
                {value: 13,name: this.$t('table.inele')},
                {value: 14,name: this.$t('table.outele')},
                {value: 18,name: this.$t('table.External')},],
            equmodel:[{value: 'D916',name:'D916'},
                {value: 'D636',name:'D636'},
                {value: 'D620',name:'D620'},
                {value: 'D625',name:'D625'},
                {value: 'D601',name:'D601'},
                {value: 'D603',name:'D603'},
                {value: 'D606',name:'D606'},
                {value: 'D608',name:'D608'},
                {value: 'D611G',name:'D611G'},
                {value: 'D615',name:'D615'},
                {value: 'D630',name:'D630'},
                {value: 'D631',name:'D631'},
                {value: 'D652',name:'D652'},],
            sendlist:[
                        {value: 1,name: '防拆功能启停'},
                        {value: 4,name: '倾斜功能启停'},
                        {value: 5,name: '门禁功能启停'},
                        {value: 6,name: '安装就绪'},
                        {value: 9,name: '升级固件'},
                        {value: 10,name: '心跳上报频率'},
                        {value: 11,name: '低电量阈值'},
                        {value: 12,name: 'SOS启停'},
                        {value: 13,name: '蜂鸣器功能启停'},
                        {value: 14,name: 'LED灯功能启停'},
                        {value: 16,name: '报警持续重复推送次数'},
                        {value: 18,name: '震动告警开关'},
                        {value: 30,name: '设置蜂鸣报警时长'},
                        {value: 31,name: '设置LED报警时长'},
                        {value: 32,name: '开启关闭报警'},
                        {value: 35,name: '上报间隔与采集间隔'},
                        {value: 36,name: '超限时设备上报间隔与采集间隔'},
                        {value: 37,name: '温度上下限阈值'},
                        {value: 38,name: '湿度上下限阈值'},
                        {value: 39,name: '倾斜参数'},
                        {value: 40,name: '每天亮屏时间'},
                        {value: 41,name: '光敏触发开关'},
                        {value: 42,name: '震动触发开关'},
                        {value: 43,name: '震动灵敏度'},
                        {value: 44,name: '运动上报间隔'},
                        {value: 45,name: '静止上报间隔'},
                        {value: 46,name: '追踪模式启停'},]

        }
    },
    methods:{
        changesize(val){                                 //改变分页数量
            this.page.size=val
            this.page.index=1
            try{
                this.getList()
            }catch(res){
                
            }
        },
        changeindex(val){                                //改变当前页
            this.page.index=val
            try{
                this.getList()
            }catch(res){
                
            }
        },
        tableSortEvent(val){                                   //table  排序事件
            if(val){
                this.sort=val.prop
                if(val.order==='ascending'){
                    this.sort_type='asc'
                }else{
                    this.sort_type='desc'
                }
            }else{
                this.sort=''
                this.sort_type=''
            }
            this.page.index=1
            try{
                this.getList()
            }catch(res){}
        },
        tableRadioEvent(val){                                   //table  单选事件
            if(val){
                this.radioId=val.pk_id
            }else this.radioId=''
        },
        rollBack(ref){                                          //滚动条归零
            setTimeout(_=>{
                this.$refs[ref].wrap.scrollTop=0
            },100)
        },
        verifica(ref){                                          //取消验证表单
            setTimeout(_=>{
                this.$refs[ref].clearValidate()
            },100)
        },
        tableRowClassName ({row, rowIndex}) {
            if (rowIndex % 2) {
              return 'table-stripe'
            } else {
              return ''
            }
          }
    }
}

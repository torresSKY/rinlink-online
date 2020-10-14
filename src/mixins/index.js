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
            
            equmodel:[{value: 'D916',name:'D916'},
                {value: 'D636',name:'D636'},
                {value: 'D635',name:'D635'},
                // {value: 'D620',name:'D620'},
                {value: 'D625',name:'D625'},
                {value: 'D601',name:'D601'},
                {value: 'D603',name:'D603'},
                {value: 'D606',name:'D606'},
                {value: 'D608',name:'D608'},
                // {value: 'D611G',name:'D611G'},
                {value: 'D615',name:'D615'},
                {value: 'D630',name:'D630'},
                {value: 'D600N',name:'D600N'},
                {value: 'D631',name:'D631'},
                {value: 'D650',name:'D650'},
                {value: 'D631L',name:'D631L'}],
                // {value: 'D652',name:'D652'},

        }
    },
    computed: {
        sendlist() {
            return [
                {value: 1,name: this.$t('table.sendfc'),model:[]},
                {value: 4,name: this.$t('table.sendqx'),model:[]},
                {value: 5,name: this.$t('table.sendmj'),model:[]},
                {value: 6,name: this.$t('table.sendnow'),model:[]},
                {value: 9,name: this.$t('table.sendsj'),model:['D601','D606','D603','D608','D611G','D615','D630','D631','D652']},
                {value: 10,name: this.$t('table.sendpv'),model:['D916','D636','D620','D625']},
                {value: 11,name: this.$t('table.didian'),model:['D601','D606','D603','D608','D611G','D615','D630','D631']},
                {value: 12,name: this.$t('table.sendsos'),model:[]},
                {value: 13,name: this.$t('table.sendfmq'),model:[]},
                {value: 14,name: this.$t('table.sendled'),model:[]},
                {value: 16,name: this.$t('table.sendbj'),model:[]},
                {value: 18,name: this.$t('table.sendzd'),model:[]},
                {value: 30,name: this.$t('table.sendfmq2'),model:[]},
                {value: 31,name: this.$t('table.sendled2'),model:[]},
                {value: 32,name: this.$t('table.sendopenala'),model:[]},
                {value: 35,name: this.$t('table.timealarm'),model:[]},
                {value: 36,name: this.$t('table.sendcs'),model:[]},
                {value: 37,name: this.$t('table.sendwd'),model:[]},
                {value: 38,name: this.$t('table.sendsd'),model:[]},
                {value: 39,name: this.$t('table.sendqx2'),model:[]},
                {value: 40,name: this.$t('table.sendstart2'),model:[]},
                {value: 41,name: this.$t('table.sendgm'),model:['D601','D606','D603','D608','D611G','D615','D630','D631']},
                {value: 42,name: this.$t('table.sendzd2'),model:['D601','D606','D603','D608','D611G','D615','D630','D631']},
                {value: 43,name: this.$t('table.sendzd3'),model:['D601','D606','D603','D608','D611G','D615','D630','D631']},
                {value: 44,name: this.$t('table.sendyd'),model:['D916','D636','D620','D625','D652','D601','D606','D603','D608','D611G','D615','D630','D631','D600N']},
                {value: 45,name: this.$t('table.sendjz'),model:['D916','D636','D620','D625','D652','D601','D606','D603','D608','D611G','D615','D630','D631','D600N']},
                {value: 46,name: this.$t('table.sendzz'),model:['D916','D636','D620','D625','D652','D601','D606','D603','D608','D611G','D615','D630','D631','D600N']},
                {value: 52,name: this.$t('table.sendxlval'),model:['D600N']},
                {value: 53,name: this.$t('table.sendxlmax'),model:['D600N']},
                {value: 54,name: this.$t('table.sendxlmin'),model:['D600N']},]
        },
        alatypelist() {
            return [
            // {value: 23,name: this.$t('table.powerala')},
            // {value: 5,name: this.$t('table.sosala')},
            // {value: 4,name: this.$t('table.dropala')},
            // {value: 47,name: this.$t('table.lightala')},
            // {value: 2,name: this.$t('table.moveala')},
            // {value: 6,name: this.$t('table.vibala')},
            // {value: 48,name: this.$t('table.disala')},
            // {value: 15,name: this.$t('table.lightala')},
            // {value: 8,name: this.$t('table.smokeala')},
            // {value: 9,name: this.$t('table.gasala')},
            // {value: 10,name: this.$t('table.temalarm')},
            // {value: 11,name: this.$t('table.humalarm')},
            {value: 0,name: this.$t('table.jinjiala')},
            {value: 1,name: this.$t('table.chaosuala')},
            {value: 7,name: this.$t('table.power1ala')},
            {value: 8,name: this.$t('table.power2ala')},
            {value: 28,name: this.$t('table.weiyiala')},
            {value: 29,name: this.$t('table.pengzhuangala')},
            {value: 30,name: this.$t('table.cefanala')},
            {value: 55,name: this.$t('table.alarm32')},
            {value: 56,name: this.$t('table.alarm33')},
            {value: 60,name: this.$t('table.vibala')},
            {value: 61,name: this.$t('table.chaichuala')},
            {value: 62,name: this.$t('table.jiasuala')},
            {value: 63,name: this.$t('table.jiansuala')},
            {value: 64,name: this.$t('table.zhuanwanala')},
            // {value: 18,name: this.$t('table.External')},
         ]
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

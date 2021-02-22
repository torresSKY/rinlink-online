<template>
    <div >
        <span slot="footer" class="dialog-footer">
           <el-button >{{$t('button.cancel')}}</el-button>
           <el-button type="primary" @click="confrim">{{$t('button.determine')}}</el-button>
        </span>
    </div>
</template>
<script>
    import api from '@/api/wechart/index'
    import axios from 'axios'
    import CustomerManage from './CustomerManage.vue'
    import roleManage from './roleManage.vue'
    import adminManage from './adminManage.vue'
    export default{
        name:'sendOrder',
        components:{  },
        data(){
            return {
         
                height: 1000,
            }
        },
        mounted(){
           var that = this
           window.onresize = function () {
              that.height = 80 + 'vh'
           }
        },
        methods:{
            confrim(){ // 确认下发
                this.$emit('confrimSend', false)
            }
        }
    }
</script>
<style type="stylesheet/scss" lang="scss" scoped>

</style>
<template>
  <div class="notify" :hidden='showframe'>
    <div class='frame'>
      <!-- 报警类型:报警数据 -->
      <p>
        <span style='font-weight: 600;'>{{devicename}}</span>发生
        <span style='color:red;font-weight: 600;'>{{alarmType}}</span>
        <!-- <span style='color:red;font-weight: 600;'>{{imei}}</span> -->
        <i class='el-icon-close' style='float:right' @click.stop='closeFrame($event)'></i>
      </p>
      {{$t('table.alartime')}}报警时间：{{time}}
      <!-- <el-link style='color:#22F8FF'>查看>></el-link> -->
      <el-button type="text" @click="toRouter()" style='color:#22F8FF'>查看>></el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'notify',
  props: {
    devicename: '',
    alarmType: '',
    time: null,
    show: true,
    imei: ''
    // btnshow:false
  },
  data() {
    return {
      showframe: true
    }
  },
  mounted() {
    this.showframe = this.show
  },
  watch: {
    time(newValue, oldValue) {
      this.showframe = false
    },
    show(newValue, oldValue) {
      console.log('新value：', newValue)
      console.log('旧value：', oldValue)
      if(newValue != oldValue){
          let that = this
          setTimeout(() => {
            that.showframe = true
            // console.log('进入定时器：', that.showframe)
          }, 50000)
      }
    }
  },
  methods: {
    closeFrame(e) {
    //   console.log('关闭报警')
    //   console.log('阻止事件默认跳转行为', e.target)
      this.showframe = true
      return
      // this.$router.push({ name: 'route.Trajectory', params: { imei: data.imei } })
    },

    toRouter() {
      // console.log(this.$props.imei);
      this.$router.push({ name: 'route.Location', params: { imei: this.$props.imei } })
    }
  }
}
</script>
<style lang="scss">
.notify {
  background: #2f96b4;
  color: #fff;
  width: 300px;
  padding: 10px;
  text-align: left;
  border: 1px solid rgba(87, 220, 254, 1);
  opacity: 0.9;
  border-radius: 8px;
}
</style>
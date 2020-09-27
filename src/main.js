// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {route} from './router'
import store from '@/store'
import plugin from '@/plugins'
import "babel-polyfill";
import echarts from 'echarts'


import i18n from './lang'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/icon/icon/iconfont.css'
import './assets/icon/icon1/iconfont.css'
import './assets/icon/icon1/iconfont.css'
import './assets/scss/base.scss'
import './router/interception'

Vue.config.productionTip = false

Vue.use(plugin, {})
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.prototype.$echarts = echarts


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router:route,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})

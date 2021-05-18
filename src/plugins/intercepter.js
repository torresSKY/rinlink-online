import axios from 'axios'
// import _ from 'lodash'
import store from '@/store'
// import config from '@/config'
import { Message } from 'element-ui'
const requests = []

export default (Vue) => {
  Object.defineProperties(Vue.prototype, {
    // $http: {
    //   value: axios
    // }
  })
  // axios配置
  // axios.defaults.baseURL = config[process.env.NODE_ENV].host
  // axios.defaults.baseURL = '/api'
  axios.defaults.baseURL = process.env.host
  // axios.defaults.baseURL = 'http://rap2.taobao.org/app/mock/277955/post'
  axios.defaults.timeout = 100000
  axios.defaults.withCredentials = true
  // axios.defaults.headers['jwt'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsIm9wZW5pZCI6Im9rcERXNVh6dmtENDFlc25ZdkVNR29ZYlI3V1EiLCJpYXQiOjE1MzM3ODUyMDMsImV4cCI6MTU0MTU2MTIwM30.UOYEz0JsLr4hXDCSxOyMJSUnA2LrxAIMCTNTXt9nbNY';

  //  添加拦截器
  // request拦截器
  // axios.interceptors.request.use(function (config) {
  //   store.dispatch('setLoading', true)
  //   requests.push(config)
  //   console.log('请求头部'+config)
  //   return config
  // }, function (error) {
  //   store.dispatch('setLoading', false)
  //   return Promise.reject(error)
  // })
  axios.interceptors.request.use(
    config => {
      if (sessionStorage['token']) {
        config.headers.Authorization = sessionStorage['token']
      }
  
      return config;
    },
    err => Promise.reject(err)
  )
//response 拦截器
  axios.interceptors.response.use(function (response) {
    // console.log(response,12312313123)
    // _.remove(requests, r => {
    //   return r === response.config
    // })
    // if(!requests.length){
    //     setTimeout(() => {
            store.dispatch('setLoading', false)
    //    }, 300)
    // }
    // return response.data
    // store.dispatch('setLoading', false)
    // if (Number(response.data.code) !== 0) {
    //   Message({
    //     message: response.data.message,
    //     type: 'error',
    //     duration: 2 * 1000
    //   })
    //   if(Number(response.data.code)===1000){
    //     store.dispatch('setIsLogin', 0).then(res=>{
    //       sessionStorage.clear()
    //       window.location.reload()
    //     })
    //   }
      // return Promise.reject(response.data)
    // } else {
      return Promise.resolve(response.data)
    // }
  }, function (error) {
    store.dispatch('setLoading', false) 
    if (error.response.data.message == 'token 无效或过期') {
      // Message.error('Token过期，请重新登录')
      sessionStorage.clear();
      store.commit('isLogin', null);   
      window.location.reload();
    } else if(Number(error.response.data.code)!==200){
      // return Promise.reject(error.response.data.message = '服务器请求失败')
      return Promise.reject(error.response.data)
    }
    // Message.error('呀呀呀，系统出错了')
    //console.log(error,JSON.parse(JSON.stringify(error)))
    return Promise.reject(error.response.data)
  })
}

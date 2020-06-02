import {route} from './'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
//路由拦截
// let registerRouteFresh = true
NProgress.configure({ showSpinner: false })// NProgress Configuration


const whiteList = ['/login','/404','/401']// 不重定向白名单
route.beforeEach((to, from, next) => {
    NProgress.start()
    if(Number(store.getters.isLogin)){
      if (to.path === '/login') {
        next({ path: '/index' })
      }else if(to.meta.menu){
        next({ path: '/404' })
      }else {
        next()
        NProgress.done()
      }
    }else{
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        // registerRouteFresh = false
        next()
        NProgress.done()
      } else {
        // registerRouteFresh = false
        next('/login') 
      }
    } 
}) 

//   router.onReady(function() {              // 刷新之后挂载路由会被清除  需要重新挂载
//     if (registerRouteFresh && Number(store.getters.isLogin)==1) {
//       const roles = store.getters.addRouters
//       store.dispatch('GenerateRoutes', roles).then((response) => {
//         store.dispatch('setRouterList',response).then((res)=>{
//           router.addRoutes(response)
//         }).catch(()=>{})
//       })
//     }
// })

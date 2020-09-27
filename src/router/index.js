import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

const list={
    routes: [
      { path: '/', redirect: '/wechart/location'},
      { path: '/404', component: _import('errorPage/404')},
      { path: '/401', component: _import('errorPage/401')},
      { path: '/login',name: 'login', component: _import('login/index')},
      {
        path: '/index',
        component: _import('index'),
        radius:true,
        roles:[0,1,88,99],
        redirect: '/index/index',
        icon: 'shouyex',
        children: [{path: 'index',name:'route.Home',radius:true,roles:[0,1,88,99],component: () =>import('@/views/wechart/users'),meta: { keep:'users',keepAlive: true }}]
      }, 
      {
        path: '/wechart',
        name: 'route.Equmanage',
        radius:true,
        roles:[0,1,88,99],
        component: _import('index'),
        icon: 'shebeiguanli1',
        redirect: '/wechart/zhuche',
        children: [
          {path: 'jihuo',name: 'route.List',component: () =>import('@/views/wechart/jihuo'),hidden: true,meta: { keep: 'jihuo'},radius:true,roles:[0,1,88,99],},
          {path: 'history',name: 'route.Trajectory',component: () =>import('@/views/wechart/history'),hidden: false,radius:false,roles:[0,1,88,99],},
          {path: 'location',name: 'route.Location',component: () =>import('@/views/wechart/location'),hidden: true,radius:true,roles:[0,1,88,99],},
          {path: 'group',name: 'route.Group',component: () =>import('@/views/wechart/group'),hidden: true,meta: { keep: 'group'},radius:true,roles:[0,1,88,99],},
          ]
      },      
      {
        path:'/electric',
        redirect:'/electric',
        name: 'route.fence',
        radius:true,
        component: _import('index'),
        icon: 'chuweilan',
        roles:[0,1,88,99],
        children: [{path: 'electric',name: 'button.shewei',component: () =>import('@/views/wechart/electric'),hidden: true,meta: { keep: 'equs'},radius:true,roles:[0,1,88,99],}]
      },
      {
        path: '/Message',
        name: 'route.showala',
        radius:true,
        roles:[0,1,88,99],
        component: _import('index'),
        icon: 'tongzhi',
        redirect: '/Message/locationMessage',
        children: [
          // {path: 'locationMessage',name: '定位消息展示',component: () =>import('@/views/wechart/locationMessage'),meta: { keep: 'locationMessage' },radius:true,roles:[88,99],},
          {path: 'policeMessage',name: 'route.showala',component: () =>import('@/views/wechart/policeMessage'),hidden: true,radius:true,roles:[0,1,88,99],},
          {path: 'statistics',name: 'route.tongji',component: () =>import('@/views/wechart/Alastatistics'),hidden: true,radius:true,roles:[0,1,88,99],},
        ]
      },
      {
        path: '/UserManagement',
        name: 'route.User',
        radius:true,
        roles:[0,1,88,99],
        component: _import('index'),
        icon: 'yonghuguanli1',
        redirect: '/UserManagement/wechartUser',
        children: [
          {path: 'wechartUser',name: 'route.User',component: () =>import('@/views/wechart/wechartUser'),hidden: true,meta: { keep: 'wechartUser'},radius:true,roles:[0,1,88,99],},
          // {path: 'user',name: '系统用户',component: () =>import('@/views/wechart/user'),meta: { keep: 'user' },radius:true,roles:[0,1,88,99],},
          // {path: 'Customerlist',name: '客户管理',component: () =>import('@/views/wechart/Customerlist'),meta: { keep: 'Customerlist' },radius:true,roles:[88,99],},
        ]
      },
      
      {path:'/home',redirect:'/'},
      {path:'*',redirect:'/404'}

    ]
  }
export const route=new Router(list)

export const routerlist=list

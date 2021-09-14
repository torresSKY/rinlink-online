import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

const list={
    routes: [
      { path: '/', redirect: '/login'},
      { path: '/404', component: _import('errorPage/404')},
      { path: '/401', component: _import('errorPage/401')},
      { path: '/login',name: 'login', component: _import('login/index')},
      {
        path: '/index',
        component: _import('index'),
        radius:true,
        roles:[1,2,3],
        redirect: '/index/index',
        icon: 'shouyex',
        children: [{path: 'index',name:'route.Home',radius:true,roles:[1,2,3],component: () =>import('@/views/wechart/home'),meta: { keep:'users',keepAlive: true }}]
      }, 
      {
        path: '/equManage',
        name: 'route.Equmanage',
        radius:true,
        roles:[2,3],
        component: _import('index'),
        icon: 'shebeiguanli1',
        redirect: '/equManage',
        children: [
          {path: 'equManage',name: 'route.Equmanage',component: () =>import('@/views/wechart/equManage'),hidden: true,meta: { keep: 'jihuo'},radius:true,roles:[2,3],},
          ]
      },   
      {
        path:'/electric',
        redirect:'/electric',
        name: 'route.fence',
        radius:true,
        component: _import('index'),
        icon: 'chuweilan',
        roles:[2,3],
        children: [{path: 'electric',name: 'button.shewei',component: () =>import('@/views/wechart/electric'),hidden: true,meta: { keep: 'equs'},radius:true,roles:[2,3],}]
      },   
      {
        path:'/control',
        redirect:'/control',
        name: 'route.control',
        radius:true,
        component: _import('index'),
        icon: 'jiankong',
        roles:[2,3],
        children: [{path: 'control',name: 'button.control',component: () =>import('@/views/wechart/monitorPlatform'),hidden: true,meta: { keep: 'equs'},radius:true,roles:[0,1,88,99],}]
      },
      {
        path: '/Statistics',
        name: 'route.statistics',
        radius:true,
        roles:[2,3],
        component: _import('index'),
        icon: 'liebiao',
        redirect: '/Statistics/list',
        children: [
          {path: 'list',name: 'route.statistics',component: () =>import('@/views/wechart/statisticsList'),hidden: true,radius:true,roles:[0,1,88,99],},
        ]
      },
      {
        path: '/UserManagement',
        name: 'route.User',
        radius:true,
        roles:[1,2],
        component: _import('index'),
        icon: 'yonghuguanli1',
        redirect: '/UserManagement/wechartUser',
        children: [
          {path: 'wechartUser',name: 'route.User',component: () =>import('@/views/wechart/userManage'),hidden: true,meta: { keep: 'wechartUser'},radius:true,roles:[1,2],},
        ]
      },
      {
        path: '/sellManage',
        name: 'route.sell',
        radius:true,
        roles:[1],
        component: _import('index'),
        icon: 'shebeiguanli',
        redirect: '/sellManage/sell',
        children: [
          {path: 'sell',name: 'route.sell',component: () =>import('@/views/wechart/sellManage'),hidden: true,meta: { keep: 'wechartUser'},radius:true,roles:[1],},
        ]
      },
      {
        path: '/setting',
        name: 'route.setting',
        radius:true,
        roles:[1],
        component: _import('index'),
        icon: 'xitongguanli',
        redirect: '/setting/modelManage',
        children: [
          {path: 'modelManage',name: 'route.setting',component: () =>import('@/views/wechart/setting'),hidden: true,radius:true,roles:[1],},
        ]
      },
      {
        path: '/notice',
        name: 'route.notice',
        radius:false,
        roles:[2,3],
        component: _import('index'),
        redirect: '/notice/alarm',
        children: [
          {path: 'alarm',name: 'route.notice',component: () =>import('@/views/wechart/notice'),hidden: true,radius:false,roles:[2,3],},
        ]
      },
      {
        path: '/personalCenter',
        name: 'button.personal',
        radius:false,
        roles:[2,3],
        component: _import('index'),
        redirect: '/personalCenter/setting',
        children: [
          {path: 'setting',name: 'button.personal',component: () =>import('@/views/wechart/personalCenter'),hidden: true,radius:false,roles:[2,3],},
        ]
      },
      {
        path: '/orderManage',
        name: '订单管理',
        radius:false,
        roles:[2,3],
        component: _import('index'),
        redirect: '/orderManage',
        children: [
          {path: 'order',name: '订单管理',component: () =>import('@/views/wechart/orderManage'),hidden: true,radius:false,roles:[2,3],},
        ]
      },
      {
        path: '/orderMsg',
        name: 'table.orderMsg',
        radius:false,
        roles:[1],
        component: _import('index'),
        redirect: '/orderMsg/setting',
        children: [
          {path: 'setting',name: 'table.orderMsg',component: () =>import('@/views/wechart/orderMsg'),hidden: true,radius:false,roles:[1],},
        ]
      },
      // {
      //   path: '/log',
      //   name: 'table.operLog',
      //   radius:true,
      //   roles:[0,1,88,99],
      //   component: _import('index'),
      //   icon: 'shebeiguanli1',
      //   redirect: '/log/operationLog',
      //   children: [
      //     {path: 'operationLog',name: 'table.operLog',component: () =>import('@/views/wechart/operationLog'),hidden: true,meta: { keep: 'operationLog'},radius:true,roles:[0,1,88,99],},
          
      //   ]
      // },
      
      {path:'/home',redirect:'/'},
      {path:'*',redirect:'/404'},
      {path: '/trace', component: _import('wechart/trace')},

    ]
  }
export const route=new Router(list)

export const routerlist=list

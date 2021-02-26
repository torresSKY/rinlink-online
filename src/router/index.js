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
        roles:[0,1,88,99],
        redirect: '/index/index',
        icon: 'shouyex',
        children: [{path: 'index',name:'route.Home',radius:true,roles:[0,1,88,99],component: () =>import('@/views/wechart/users'),meta: { keep:'users',keepAlive: true }}]
      }, 
      {
        path: '/equManage',
        name: 'route.Equmanage',
        radius:true,
        roles:[0,1,88,99],
        component: _import('index'),
        icon: 'shebeiguanli1',
        redirect: '/equManage',
        children: [
          {path: 'equManage',name: 'route.Equmanage',component: () =>import('@/views/wechart/equManage'),hidden: true,meta: { keep: 'jihuo'},radius:true,roles:[0,1,88,99],},
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
        path:'/control',
        redirect:'/control',
        name: 'route.control',
        radius:true,
        component: _import('index'),
        icon: 'chuweilan',
        roles:[0,1,88,99],
        children: [{path: 'control',name: 'button.control',component: () =>import('@/views/wechart/electric'),hidden: true,meta: { keep: 'equs'},radius:true,roles:[0,1,88,99],}]
      },
      {
        path: '/Statistics',
        name: 'route.statistics',
        radius:true,
        roles:[0,1,88,99],
        component: _import('index'),
        icon: 'tongzhi',
        redirect: '/Statistics/list',
        children: [
          {path: 'list',name: 'route.statistics',component: () =>import('@/views/wechart/statisticsList'),hidden: true,radius:true,roles:[0,1,88,99],},
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
          {path: 'wechartUser',name: 'route.User',component: () =>import('@/views/wechart/userManage'),hidden: true,meta: { keep: 'wechartUser'},radius:true,roles:[0,1,88,99],},
        ]
      },
      {
        path: '/sellManage',
        name: 'route.sell',
        radius:true,
        roles:[0,1,88,99],
        component: _import('index'),
        icon: 'yonghuguanli1',
        redirect: '/sellManage/sell',
        children: [
          {path: 'sell',name: 'route.sell',component: () =>import('@/views/wechart/sellManage'),hidden: true,meta: { keep: 'wechartUser'},radius:true,roles:[0,1,88,99],},
        ]
      },
      {
        path: '/setting',
        name: 'route.setting',
        radius:true,
        roles:[0,1,88,99],
        component: _import('index'),
        icon: 'tongzhi',
        redirect: '/setting/modelManage',
        children: [
          {path: 'modelManage',name: 'route.setting',component: () =>import('@/views/wechart/modelManage'),hidden: true,radius:true,roles:[0,1,88,99],},
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
      {path:'*',redirect:'/404'}

    ]
  }
export const route=new Router(list)

export const routerlist=list

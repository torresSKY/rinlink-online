import Vuex from 'vuex'
import Vue from 'vue'
import permission from './modules/permission'

Vue.use(Vuex)

let state = {
  loading: false,
  routerList: sessionStorage['routerList'] ? JSON.parse(sessionStorage['routerList']) : [],
  roles:sessionStorage['roles'] ? sessionStorage['roles'] : '',
  user:sessionStorage['user'] ? sessionStorage['user'] : '',
  userName:sessionStorage['userName'] ? sessionStorage['userName'] : '',
  token:sessionStorage['token'] ? sessionStorage['token'] : '',
  usercode:sessionStorage['usercode'] ? sessionStorage['usercode'] : '',
  viewTagList:sessionStorage['viewTagList'] ? JSON.parse(sessionStorage['viewTagList']) : [],     //tab标签
  isLogin:sessionStorage['isLogin'] ? sessionStorage['isLogin'] : 0,
  lang: sessionStorage['lang'] ? sessionStorage['lang'] : 'zh',
  isAlarm: sessionStorage['isAlarm'] ? sessionStorage['isAlarm'] : false,
}

let actions = {
  setLoading({ commit }, info) {
    commit('SET_LOADING', info)
  },
  setRouterList({ commit }, info) {
    commit('SET_ROUTER_LIST', info)
  },
  setViewTagList({ commit }, info) {
    commit('SET_VIEW_TAG_LIST', info)
  },
  setIsLogin({ commit }, info) {
    return new Promise(resolve => {
      commit('SET_IS_LOGIN', info)
      resolve()
    })
  },
  setRoles({ commit }, info) {
    commit('SET_ROLES', info)
  },
  setUser({ commit }, info) {
    commit('SET_USER', info)
  },
  setUserName({ commit }, info) {
    commit('SET_USERNAME', info)
  },
  setToken({ commit }, info) {
    commit('SET_TOKEN', info)
  },
  setUsercode({ commit }, info) {
    commit('SET_USERCODE', info)
  },
  setLang({ commit }, info) {
    commit('SET_LANG', info)
  },
  setIsAlarm({ commit }, info) {
    commit('SET_ISALARM', info)
  },
}

let mutations = {
  SET_LOADING(state, info) {
    state.loading = info
  },
  SET_VIEW_TAG_LIST(state, info) {
    sessionStorage['viewTagList'] = JSON.stringify(info)
    state.viewTagList = info
  },
  SET_ROUTER_LIST(state, info) {
    sessionStorage['routerList'] = JSON.stringify(info)
    state.routerList = info
  },
  SET_IS_LOGIN(state, info) {
    sessionStorage['isLogin'] = info
    state.isLogin = info
  },
  SET_ROLES(state,info){
    sessionStorage['roles'] = info
    state.roles = info
  },
  SET_USER(state,info){
    sessionStorage['user'] = info
    state.user = info
  },
  SET_USERNAME(state,info){
    sessionStorage['userName'] = info
    state.userName = info
  },
  SET_TOKEN(state,info){
    sessionStorage['token'] = info
    state.token = info
  },
  SET_USERCODE(state,info){
    sessionStorage['usercode'] = info
    state.usercode = info
  },
  SET_LANG(state,info){
    state.lang=info
    localStorage.setItem('lang',info)
  },
  SET_ISALARM(state,info){
    state.isAlarm=info
    sessionStorage.setItem('isAlarm',info)
  },
}
let getters = {
  loading: state => state.loading,
  routerList: state => state.routerList,
  viewTagList: state => state.viewTagList,
  isLogin:  state => state.isLogin,
  roles:  state => state.roles,
  user:  state => state.user,
  userName:  state => state.userName,
  token:  state => state.token,
  usercode:   state => state.usercode,
  lang:   state => state.lang,
  isAlarm:   state => state.isAlarm,
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    permission
  },
  getters})

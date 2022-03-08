import {getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex的时候，就先从缓存中获取
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken() // 同步给缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result
  },
  removeUseInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 拿到token说明登录成功
    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情
    const baseInfo = await getUserDetailById(result.userId)
    // console.log(baseInfo)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    return result // 给后期权限留下伏笔
    // const result = await getUserInfo()
    // // 获取用户的详情 用户的详情数据
    // const baseInfo = await getUserDetailById(result.userId)
    // context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations
    // return result // 这里为什么要return呢 这里是给我们后期做权限的时候 留下的伏笔
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUseInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}


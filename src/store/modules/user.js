import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken() // 设置token为共享状态 初始化vuex的时候，就先从缓存中获取
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
  }
}
const actions = {
  async login(context, data) {
    const result = await login(data) // 调用api接口
    context.commit('setToken', result)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}


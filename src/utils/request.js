import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  // 当执行 npm run dev =>.enc.development => /api => 会执行跨域处理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev =>/api  npm run build => /prod-api
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果为true表示过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    // 业务出错。
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息里面 response的对象
  if (error.response && error.response.data && error.response.data.code === 1002) {
    // 当=1002时 表示后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入catch
})
// 是否超时
// 超时逻辑 当前时间 - 缓存中的时间 是否大于时间差
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service

import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  // 当执行 npm run dev =>.enc.development => /api => 会执行跨域处理
  baseURL: process.env.VUE_APP_BASE_API, // npm run dev =>/api  npm run build => /prod-api
  timeout: 5000
})
service.interceptors.request.use()
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
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入catch
})
export default service

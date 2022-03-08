import Cookies from 'js-cookie'

const TokenKey = 'hrsass-ihrm-token' // 设置唯一token
const timekey = 'hrsaas-timestamp-key' // 设置一个独一无二的key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timekey)
}
export function setTimeStamp() {
  Cookies.set(timekey, Date.now())
}

// 权限拦截在路由跳转 导航守卫
import router from '@/router'
import store from '@/store'// 引入store实例 与this,$store是一回事
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 不需要导出 因为只需要让代码执行即可
// 前置守卫
// next()是前置守卫必须要执行的钩子，如果不执行，页面就死了
// next()放过 next(false)跳转终止 next(地址) 跳转到某个地址
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start() // 开启进度条
  if (store.getters.token) {
    // 只有有token的情况下 才能获取资料
    // 如果有token
    if (to.path === '/login') {
      // 如果访问的是登录页面
      next('/') // 跳到主页
    } else {
      // 如果当前vuex中有用户的资料的id 表示已经有资料了 不需要获取了 没有idcai需要获取
      if (!store.getters.userId) {
        // 如果没有id 才表示当前用户资料没有获取过
        await store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话，这里必须 同步
      }
      next()
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done() // 解决手动切换地址 进度条不关闭的问题进度条
})
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})

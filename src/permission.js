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
router.beforeEach((to, from, next) => {
  nprogress.start() // 开启进度条
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      next('/')
    } else {
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

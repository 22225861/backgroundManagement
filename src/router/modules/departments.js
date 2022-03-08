// 导出员工路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/departments', // 路由地址
  name: 'departments', // 给模块的一级路由加一个name 属性 这个属性 在做权限的时候会用到
  component: Layout,
  children: [{
    // 二级路由的path什么都不用写的时候，此时它表示二级路由的默认路由
    path: '', // 什么都不写 表示 /departments 不但有layout => 组织架构
    component: () => import('@/views/departments'),
    // 路由元信息 其实是一个存储数据的地方 可以放任何内容
    meta: {
      title: '组织架构' // 左侧导航读取了这里的title信息
    }
  }]
}

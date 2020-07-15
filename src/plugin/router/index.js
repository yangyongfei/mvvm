import MVVM from '../../index'
import VueRouter from './router'

import Home from '../../template/home.fly'
import List from '../../template/list.fly'

// 执行install方法
MVVM.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/list',
    name: 'List',
    component: List
  }
]

const router = new VueRouter({
  routes
})

export default router
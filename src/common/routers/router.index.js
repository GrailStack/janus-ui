import Vue from 'vue'
import VueRouter from 'vue-router'
import CommonRouter from './common.router.js'
import FrameRouter from '../../frame/routers/frame.router.js'
import LoginRouter from '../../login/routers/login.router.js'

Vue.use(VueRouter)

let routerArray = []

routerArray = routerArray.concat(FrameRouter.routers)
routerArray = routerArray.concat(LoginRouter.routers)
// routerArray = routerArray.concat(CommonRouter.routers)

const appRouter = new VueRouter({
  mode: 'hash',
  saveScrollPosition: true,
  routes: routerArray
})

// 路由跳转拦截
appRouter.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  
  next()
})

export default appRouter

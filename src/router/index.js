import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import { mainList } from '@/api/routers'
import routers from '@/router/routers'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config
let v = new Vue()
Vue.use(Router)
const router = new Router({
  // mode: "history",
  routes,
  // mode: 'history'
  mode: 'hash'
})
const LOGIN_PAGE_NAME = ['login', 'sign_in', 'forgetPassword']

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next()
  // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

// router.beforeEach((to, from, next) => {
//   iView.LoadingBar.start()
//   const token = getToken()
//   if (!token &&  LOGIN_PAGE_NAME.indexOf(to.name)!==-1) {
//     // 未登录且要跳转的页面不是登录页
//     next({
//       name:LOGIN_PAGE_NAME  // 跳转到登录页
//     })
//   } else if (!token && to.name === LOGIN_PAGE_NAME) {
//     // 未登陆且要跳转的页面是登录页

//     next() // 跳转
//   } else if (token && to.name === LOGIN_PAGE_NAME) {
//     // 已登录且要跳转的页面是登录页
//     next({
//       name: homeName // 跳转到homeName页
//     })
//   } else {
//     if (store.state.user.hasGetInfo) {
//       turnTo(to, store.state.user.access, next)
//       // console.log(store.state.user.access)
//     } else {
//       store.dispatch('getUserInfo').then(user => {
//         // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
//         turnTo(to, user.access, next)
//       }).catch(() => {
//         setToken('')
//         next({
//           name: 'login'
//         })
//       })
//     }
//   }
// })

router.beforeEach((to, from, next) => {
  // iView.LoadingBar.start()
  const token = getToken()
  if (LOGIN_PAGE_NAME.indexOf(to.name) === -1) {
    // 未登录且要跳转的页面不是登录页
    if (token) {
      next()
    } else if (to.name === 'home' && !token) {
      next({ name: 'login' })
    } else if (to.name !== 'home' && !token) {
      console.log(1)

      v.$Modal.confirm({
        title: '登录过期',
        content: '登录过期请重新登录',
        okText: '确定',
        onOk: () => {
          localStorage.setItem('urlName', from.name)
          next({ name: 'login' })
        }
      })
    }
  } else {
    next()
  }

  // 控制是否点击项目
  if (to.name === 'home' && token) {
    let arr = JSON.parse(localStorage.getItem('projectId'))
    store.dispatch('getMenuData')
    if (arr) {
      next()
    } else {
      next({ name: 'consoleHome' })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
// let List = [{ name: 'basicSetting', children: ["itemInformation", "Organizations"] }, { name: 'progressControl', children: ['planning', 'progressControl'] }, { name: 'doc', children: ["documents", 'directory'] }]
// store.dispatch('getMenuData') // 获取菜单

export default router

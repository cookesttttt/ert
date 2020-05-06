import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead
} from '@/libs/util'
import { saveErrorLogger } from '@/api/data'
import { mainList } from '@/api/routers'
import Main from '@/components/main'
import router from '@/router'
import parentView from '@/components/parent-view'
import routers from '@/router/routers'
import config from '@/config'
import clonedeep from 'clonedeep'
import { id } from 'postcss-selector-parser'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    projectId: {},
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    menuRspList: [], // 动态菜单数据
    menuList: [] // 动态菜单数据
  },
  getters: {
    // menuList: (state, getters, rootState) =>
    //   getMenuByRouter(routers, rootState.user.access),
    menuList: (state, getters, rootState) => getMenuByRouter(state.menuRspList), // 动态菜单
    errorCount: state => state.errorList.length
  },
  mutations: {
    // 动态菜单
    setMenuRspList (state, List) {
      var newarr = [] // 过滤数据未处理的单个数据
      let list = [] // 过滤后的一级菜单
      let twoList = [] // 二级菜单内容
      let threeList = [] // 三级菜单内容

      List.push({ num: 200, level: 1 }, { num: 201, level: 1 }) // 手动增加菜单
      // 过滤第一层
      List.forEach((now, index) => {
        newarr = routers.filter(item => {
          return item.meta.num === now.num && now.level === 1
        })
        if (newarr[0]) {
          list.push(newarr[0])
        }
      })
      list = Array.from(new Set(list))

      // 二级菜单过滤
      list.forEach((item, index) => {
        // item.children是 List的二级菜单
        List.forEach(item => {
          let updataArr = list[index].children.filter(now => {
            return now.meta.num === item.num && item.level === 2
          })
          if (updataArr[0]) {
            twoList.push(updataArr[0])
          }
        })
      })
      // 三级菜单过滤
      list.forEach((item, index) => {
        // item.children是 List的二级菜单
        list[index].children.forEach((res, i) => {
          List.forEach(item => {
            if (list[index].children[i].children) {
              let updataArr = list[index].children[i].children.filter(now => {
                return now.meta.num === item.num && item.level === 3
              })
              if (updataArr[0]) {
                threeList.push(updataArr[0])
              }
            }
          })
        })
      })
      // 设置二级菜单完整数组  深拷贝
      var newList = clonedeep(list)
      // 清空他的子级
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].children) {
          newList[i].children.forEach(res => {
            twoList.forEach(item => {
              if (res.meta.num === item.meta.num) {
                newList[i].children.splice(0, newList[i].children.length)
              }
            })
          })
        }
      }
      // 循环对比 讲后台传过来有的子级添加到二级菜单完整数组
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].children.length; j++) {
          for (let z = 0; z < twoList.length; z++) {
            if (list[i].children[j].meta.num === twoList[z].meta.num) {
              newList[i].children.push(twoList[z])
              break
            }
          }
        }
      }
      // 设置完整数组  深拷贝
      var newNewList = clonedeep(newList)

      // 清空他的子级
      for (let i = 0; i < newNewList.length; i++) {
        newNewList[i].children.forEach(item => {
          if (item.children) {
            item.children.forEach(res => {
              threeList.forEach(i => {
                if (res.meta.num === i.meta.num) {
                  let NLchildren = item.children
                  if (NLchildren) {
                    NLchildren.splice(0, NLchildren.length)
                  }
                }
              })
            })
          }
        })
      }
      // 循环对比 讲后台传过来有的子级添加到三级菜单完整数组
      for (let i = 0; i < newList.length; i++) {
        for (let j = 0; j < newList[i].children.length; j++) {
          if (newList[i].children[j].children) {
            for (let e = 0; e < newList[i].children[j].children.length; e++) {
              for (let z = 0; z < threeList.length; z++) {
                if (newList[i].children[j].children[e].meta.num === threeList[z].meta.num) {
                  newNewList[i].children[j].children.push(threeList[z])
                  break
                }
              }
            }
          }
        }
      }
      // 最终动态路由
      let len = newNewList.length
      newNewList.forEach((res, index) => {
        if (res.name === '财务管理') {
          newNewList.splice(index, 1)
          newNewList.splice(1, 0, res)
        }
      })
      state.menuRspList = []
      for (let i = 0; i < len; i++) {
        state.menuRspList.push(newNewList[i])
      }
      state.hasInfo = true
    },

    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) {
        commit('setHasReadErrorLoggerStatus', false)
      }
      const {
        user: { token, userId, userName }
      } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },
    // 动态路由
    getMenuData ({ commit, rootState }) {
      let arr = JSON.parse(localStorage.getItem('projectId'))
      if (arr == null) {
        var id = 157
      } else {
        var id = arr.id
      }
      mainList(id)
        .then(res => {
          if (this.menuList) {
            if (this.menuList === res.data.msgData) {
              this.menuList = res.data.msgData
            } else {
              this.menuList = res.data.msgData
              commit('setMenuRspList', res.data.msgData)
            }
          } else {
            this.menuList = res.data.msgData
            commit('setMenuRspList', res.data.msgData)
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}

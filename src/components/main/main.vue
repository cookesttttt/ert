<template>
  <Layout style="height: 100%" class="main">
    <Sider
      hide-trigger
      collapsible
      :width="230"
      :collapsed-width="64"
      v-model="collapsed"
      class="left-sider"
      style="background:#fff"
    >
      <side-menu
        accordion
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        :opened="opened"
        @on-select="turnToPage"
        :menu-list="menuList"
        :theme="theme2"
        style="margin-top:64px"
      >
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <!-- <img v-show="!collapsed" :src="maxLogo" key="max-logo" /> -->
          <img v-show="collapsed" :src="minLogo" key="min-logo" />
          <!-- <img v-show="!collapsed" :src="maxLogo" key="max-logo" /> -->
          <div v-show="!collapsed" class="topSelect">
            <div class="btnSelect">
              <Select
                v-model="itemName"
                transfer
                class="select"
                style="font-weight: 700;"
                @on-change="changeItem"
              >
                <Option v-for="item in allItem" :value="item.name" :key="item.id">{{ item.name }}</Option>
              </Select>
            </div>
          </div>
        </div>
      </side-menu>
    </Sider>

    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <!-- 退出登录 -->
          <user :message-unread-count="unreadCount" :user-avatar="userAvatar" />
          <!-- 我的 -->
          <!-- v-if="$config.useI18n"
          @on-lang-change="setLocal"-->
          <Language style="margin-right: 10px;" :lang="local"></Language>
          <!-- 日志 -->
          <span @click="clickStatu">
            <error-store
              style="margin-right: 10px;"
              v-if="$config.plugin['error-store'] && $config.plugin['error-store'].showInHeader"
              :has-read="hasReadErrorPage1"
              :count="errorCount"
            ></error-store>
          </span>

          <!-- 指南 -->
          <fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
          <!-- 通讯录 -->
          <items style="margin-right: 10px;"></items>
          <!-- 项目 -->
          <itemHome style="margin-right: 10px;"></itemHome>
        </header-bar>
      </Header>

      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <div class="tag-nav-wrapper">
            <tags-nav
              :value="$route"
              @input="handleClick"
              :list="tagNavList"
              @on-close="handleCloseTag"
            />
          </div>
          <Content class="content-wrapper">
            <!-- 原本的 -->
            <!-- <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>-->
            <!-- 自己写的 -->
            <keep-alive>
              <!-- 需要缓存的视图组件 -->
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <!-- 不需要缓存的视图组件 -->
            <router-view v-if="!$route.meta.keepAlive"></router-view>
            <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop>
          </Content>
        </Layout>
      </Content>
      <!-- <Footer style="background-color:transparent">
        <footer class="footerCopyright">
          <div class="copyrightBottom">
            <p>当前项目: {{itemName}}</p>
            <p>备案/许可证编号为:蜀ICP备19028743号</p>
          </div>
        </footer>
      </Footer>-->
      <Drawer
        title="系统消息"
        v-model="modal1"
        width="820"
        :styles="styles"
        draggable
        :mask-closable="false"
      >
        <p style="text-align:right;margin-bottom:4px">
          提示: 可在
          <span style="cursor:pointer;color:#2d8cf0" @click="goToMassageCenter">'消息中心'</span> 查看更多消息.
        </p>
        <Table
          :columns="columns"
          :data="data"
          border
          :max-height="tableHeight"
          ref="table"
          class="mainTable"
        ></Table>
        <div class="demo-drawer-footer">
          <ButtonGroup>
            <Button @click="allPutMessages">全部已读</Button>
            <Button type="primary" @click="modal1 = false">关闭</Button>
          </ButtonGroup>
        </div>
      </Drawer>
      <!-- <Modal v-model="modal1" title="系统消息" @on-ok="ok" @on-cancel="cancel">
        <p>Content of dialog</p>
        <p>Content of dialog</p>
        <p>Content of dialog</p>
      </Modal>-->
    </Layout>
  </Layout>
</template>
<script>
import { AllItem, gotoitem } from '@/api/console/highwayManagement'
import { mainList } from '@/api/routers'
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList, routeEqual, getRealname, isDataSuccess, getToken } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.jpg'
import maxLogo from '@/assets/images/logo-mian.png'
import './main.less'
import Items from './components/items/items'
import console from './components/console/console'
import itemHome from './components/itemHome/itmeHome'
import store from '@/store'
import { getMessages, putMessages, deleteMessages } from '@/api/console/consoleHome'
import { unreadStatus } from '@/api/messages/messages'
export default {
  name: 'Main',
  components: {
    itemHome,
    Items,
    SideMenu,
    HeaderBar,
    Language,
    TagsNav,
    Fullscreen,
    ErrorStore,
    User,
    ABackTop,
    console
  },
  data () {
    return {
      errorCount: 1,
      hasReadErrorPage1: false,
      massageCont: '',
      tableHeight: 450,
      modal1: false,
      collapsed: false,
      opened: [],
      maxLogo,
      minLogo,
      isFullscreen: false,
      theme2: 'light',
      itemName: '',
      allItem: [],
      iconStyle: {
        // 下
        dropdown: 'ios-arrow-down',
        // 上
        dropup: 'ios-arrow-up'
      },
      data: [],
      columns: [
        {
          type: 'expand',
          width: 1,
          render: (h, params) => {
            return h('div', [
              h('div', {
                class: 'oldDivTable',
                attrs: {
                  id: params.row.id
                }
              }, params.row.messageBody),
              h('div', {
                style: {
                  float: 'right'
                }
              }, [
                h('Button',
                  {
                    props: {
                      type: 'text'
                    },
                    on: {
                      'click': () => {
                        if (params.row.isIcon) {
                          $('#' + params.row.id).removeClass('newsDivTable')
                          $('#' + params.row.id).addClass('oldDivTable')
                          params.row.isIcon = false
                        } else {
                          $('#' + params.row.id).removeClass('oldDivTable')
                          $('#' + params.row.id).addClass('newsDivTable')
                          params.row.isIcon = true
                        }
                      }
                    }
                  }, [h('Icon', {
                    style: {
                      display: (params.row.isIcon) ? 'inline-block' : 'none'
                    },
                    props: {
                      type: this.iconStyle.dropup,
                      size: 18,
                      color: '#000000'
                    }
                  }
                  ),
                  h('Icon', {
                    style: {
                      display: (params.row.isIcon) ? 'none' : 'inline-block'
                    },
                    props: {
                      type: this.iconStyle.dropdown,
                      size: 18,
                      color: '#000000'
                    }
                  }
                  )])
              ])
            ], {
              style: {
                background: '#ed4014'
              }
            })
          }
        },
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '消息',
          key: 'subject',
          tooltip: true
        },
        {
          title: '消息类型',
          key: 'systemMessageType',
          width: 150
        },
        {
          title: '消息时间',
          key: 'gmtCreate',
          width: 140
        },
        {
          title: '操作',
          width: 130,
          key: 'handle',
          render: (h, params, vm) => {
            return [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    let data = {
                      ids: [params.row.id]
                    }
                    putMessages(data).then(res => {
                      let status = isDataSuccess(res)
                      switch (status) {
                        case 1:
                          this.$Message.error('服务器繁忙请稍后')
                          break
                        case 2:
                          this.$Message.error(res.data.msgContent)
                          break
                        default:
                          this.$Message.success(res.data.msgContent)
                          getMessages(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
                            let status = isDataSuccess(res)
                            switch (status) {
                              case 1:
                                this.$Message.error('服务器繁忙请稍后')
                                break
                              case 2:
                                this.$Message.error(res.data.msgContent)
                                break
                              default:
                                this.data = res.data.msgData
                                this.data.forEach(item => {
                                  if (item.messageBody.length > 0) {
                                    item._expanded = true
                                  }
                                  item._disableExpand = true
                                })
                                this.modal1 = true
                                break
                            }
                          })
                          break
                      }
                    })
                  }
                },
                style: {
                  marginRight: '5px'
                }
              }, '已读'),
              h('Poptip', {
                props: {
                  confirm: true,
                  transfer: true,
                  title: '你确定要删除吗?',
                  placement: 'left-end',
                  size: 'small'
                },
                on: {
                  'on-ok': () => {
                    deleteMessages(params.row.id).then(res => {
                      let status = isDataSuccess(res)
                      switch (status) {
                        case 1:
                          this.$Message.error('服务器繁忙请稍后')
                          break
                        case 2:
                          this.$Message.error(res.data.msgContent)
                          break
                        default:
                          this.$Message.success(res.data.msgContent)
                          getMessages(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
                            let status = isDataSuccess(res)
                            switch (status) {
                              case 1:
                                this.$Message.error('服务器繁忙请稍后')
                                break
                              case 2:
                                this.$Message.error(res.data.msgContent)
                                break
                              default:
                                this.data = res.data.msgData
                                this.data.forEach(item => {
                                  if (item.messageBody.length > 0) {
                                    item._expanded = true
                                  }
                                  item._disableExpand = true
                                })
                                this.modal1 = true
                                break
                            }
                          })
                          break
                      }
                    })
                  }
                }
              }, [
                h('Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '删除')])
            ]
          }
        }
      ],
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      }
    }
  },
  computed: {
    // ...mapGetters(['errorCount']),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvatar () {
      return getRealname()
    },
    cacheList () {
      const list = [
        'ParentView',
        ...(this.tagNavList.length
          ? this.tagNavList
            .filter(item => !(item.meta && item.meta.notCache))
            .map(item => item.name)
          : [])
      ]
      return list
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    hasReadErrorPage () {
      return this.hasReadErrorPage1
      // return this.$store.state.app.hasReadErrorPage
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal',
      'setHomeRoute',
      'closeTag'
    ]),
    ...mapActions(['handleLogin', 'getUnreadMessageCount']),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName)
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route)
          }
        }
      }
      this.setTagNavList(res)
    },
    handleClick (item) {
      this.turnToPage(item)
    },
    itemClick (id, type, name) {
      let token = getToken()
      if (token) {
        localStorage.setItem('itemName', name)
        this.$store.state.app.projectId = {
          id: id,
          type: type
        }
        localStorage.setItem(
          'projectId',
          JSON.stringify(this.$store.state.app.projectId)
        )
        this.$store.dispatch('getMenuData')
        window.sessionStorage.clear()
        gotoitem(id).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              mainList(id).then(res => {
                if (this.$router.name === 'home') {
                  localStorage.setItem('tagNaveList', '[{"name":"home","params":{},"query":{},"meta":{"hideInMenu":true,"title":"首页","notCache":true,"icon":"md-home"}}]')
                  this.$router.go(0)
                } else {
                  this.$router.push({ name: 'home' }).then(res => {
                    localStorage.setItem('tagNaveList', '[{"name":"home","params":{},"query":{},"meta":{"hideInMenu":true,"title":"首页","notCache":true,"icon":"md-home"}}]')
                  })
                  this.$router.go(0)
                }
              })
              break
          }
        })
      } else {
        this.$Modal.confirm({
          title: '登录过期',
          content: '登录过期请重新登录',
          okText: '确定',
          onOk: () => {
            this.$router.push({ name: 'login' })
          }
        })
      }
    },
    // 切换项目
    changeItem (value) {
      let item = this.allItem.filter(res => {
        return res.name === value
      })
      getMessages(item[0].id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            if (res.data.msgData.length === 0) {
              this.$Notice.destroy()
              localStorage.setItem('Notice', 'false')
            } else {
              localStorage.setItem('Notice', 'true')
            }
            break
        }
      })
      this.itemClick(item[0].id, item[0].projectCategoryId, item[0].name)
    },
    ok () {

    },
    cancel () {

    },
    statusInformation () {
      unreadStatus(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        const data = res.data
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(data.msgContent)
            break
          default:
            this.hasReadErrorPage1 = data.msgData

            break
        }
      })
    },
    clickStatu () {
      this.hasReadErrorPage1 = false
    },
    allPutMessages () {
      let ids = []
      this.data.forEach(res => {
        ids.push(res.id)
      })
      let data = {
        ids: ids
      }
      putMessages(data).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.$Message.success(res.data.msgContent)
            this.modal1 = false
            break
        }
      })
    },
    goToMassageCenter () {
      this.modal1 = false
      this.$router.push({
        name: 'error_logger_page'
      })
    }
  },
  watch: {
    $route (newRoute) {
      const { name, query, params, meta } = newRoute
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      })
      this.setBreadCrumb(newRoute)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList()
    this.setHomeRoute(routers)
    const { name, params, query, meta } = this.$route
    this.addTag({
      route: { name, params, query, meta }
    })
    this.setBreadCrumb(this.$route)
    // 设置初始语言
    this.setLocal(this.$i18n.locale)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
    this.itemName = localStorage.getItem('itemName')
    store.dispatch('getMenuData')

    this.opened = ['基础设置']
    $('.logo-con .ivu-select-selection').css({ 'border': 'none', 'box-shadow': 'none' })
    AllItem(1).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.allItem = res.data.msgData
          break
      }
    })
    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 170

    if (localStorage.getItem('Notice') === 'true') {
      getMessages(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.data = res.data.msgData
            this.data.forEach(item => {
              if (item.messageBody.length > 0) {
                item._expanded = true
              }
              item._disableExpand = true
            })
            this.massageCont = this.data[0].subject
            break
        }
      })
      this.$Notice.config({
        top: this.tableHeight + 60
      })
      this.$Notice.open({
        duration: 0,
        closable: false,
        onClose () {
          localStorage.setItem('Notice', 'false')
        },
        render: h => {
          return h('span', [
            h('Icon', {
              props: {
                type: 'ios-chatbubbles',
                size: '20'
              },
              style: {
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.$Notice.destroy()
                  localStorage.setItem('Notice', 'false')
                  this.modal1 = true
                }
              }
            }),
            h('span', {
              style: {
                'display': 'inline-block',
                'width': '150px',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
                'margin-left': '10px',
                cursor: 'pointer',
                position: 'absolute',
                bottom: '20px'
              },
              on: {
                click: () => {
                  this.$Notice.destroy()
                  localStorage.setItem('Notice', 'false')
                  this.modal1 = true
                }
              }
            }, this.massageCont),
            h('Icon', {
              props: {
                type: 'ios-browsers-outline',
                size: '20'
              },
              style: {
                position: 'absolute',
                right: '40px',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  this.$Notice.destroy()
                  localStorage.setItem('Notice', 'false')
                  this.modal1 = true
                }
              }
            }, 'render')
          ])
        }
      })
      setTimeout(() => {
        $('.mainTable .ivu-table-tbody .ivu-table-expanded-cell').css({ 'background': '#fff', 'padding': '10px 35px 6px 78px' })
        $('.ivu-notice .ivu-icon.ivu-icon-ios-close').css({ 'font-size': '34px', 'color': '#fff' })
        $('.ivu-notice-notice ').css({ 'background-color': '#ed4014', 'color': '#fff' })
      }, 100)
    }

    this.statusInformation()
  },
  created () {
  }
}
</script>
<style lang='less' scoped>
.topSelect {
  display: inline-block;
  border: 1px solid #cbd0db;
  height: 38px;
  border-left: none;
  border-right: none;
  position: relative;
  background: #fff;
  padding: 2px;
  width: 190px;
  text-align: center;
}
.topSelect::before {
  position: absolute;
  top: -1px;
  right: -8px;
  display: block;
  width: 0;
  height: 0;
  content: ' ';
  border-style: solid;
  border-width: 19px 0 19px 8px;
  border-color: transparent transparent transparent #cbd0db;
  background: #fff;
}
.topSelect::after {
  position: absolute;
  top: -1px;
  left: -1px;
  display: block;
  width: 0;
  height: 0;
  content: ' ';
  border-color: transparent transparent transparent #fff;
  border-style: solid;
  border-width: 19px 0 19px 8px;
}
.btnSelect {
  padding: 0px 6px;
  .select {
    div {
      border: none !important;
    }
  }
}
.btnSelect::after {
  position: absolute;
  top: -1px;
  right: -7px;
  display: block;
  width: 0;
  height: 0;
  content: ' ';
  border-color: transparent transparent transparent #fff;
  border-style: solid;
  border-width: 19px 0 19px 8px;
}
.btnSelect::before {
  position: absolute;
  top: -1px;
  left: 0;
  display: block;
  width: 0;
  height: 0;
  content: ' ';
  border-color: transparent transparent transparent #cbd0db;
  border-style: solid;
  border-width: 19px 0 19px 8px;
}
.demo-drawer-footer {
  z-index: 10;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
<style lang="less">
.oldDivTable {
  float: left;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 30px;
  letter-spacing: 2px;
}

.newsDivTable {
  float: left;
  width: 90%;
  line-height: 30px;
  letter-spacing: 2px;
}
// 全局设置loading图标变大
.el-icon-loading {
  font-size: 40px;
}
</style>

<template>
  <div class="box">
    <Header class="header-con">
      <header-bar-console>
        <user :message-unread-count="unreadCount" :user-avatar="userAvatar" />
        <information style="margin-right: 10px;"></information>
        <workOrder style="margin-right: 10px;"></workOrder>
        <authentication style="margin-right: 10px;"></authentication>
        <renew style="margin-right: 10px;"></renew>
        <purchase style="margin-right: 10px;"></purchase>
        <news style="margin-right: 10px;"></news>
      </header-bar-console>
    </Header>
    <div class="console-card">
      <card :padding="0" class="left-box" dis-hover :bordered="false">
        <div class="console-Type">
          <Button style="width: 70%;background:#39f;color:#fff;" size="small">施工项目管理系统</Button>
        </div>
        <!-- 左侧导航栏 -->
        <router-link
          v-for="item in navList"
          :to="item.url"
          :key="item.name"
          class="navList"
          :class="getactive(item.isSelected)"
          @click.native="checkActive(item.name)"
        >
          <p>
            <Icon :type="item.icon" />
            {{item.name}}
          </p>
        </router-link>
      </card>
      <card class="right-box" dis-hover :bordered="false">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <div
          class="itemMenu"
          @click="value2 = true"
          @mouseenter="openDrawer2"
          @mouseleave="closeDrawer"
        >
          <Icon type="ios-color-filter" size="20" />全部产品与服务
        </div>
      </card>
      <Drawer
        placement="left"
        :closable="false"
        v-model="value2"
        :styles="{padding:0}"
        width="280"
        @on-close="DrawerClose"
      >
        <div style="height:78px;background:#ddd"></div>
        <ul class="DrawerUl">
          <li v-for="item in DrawerList" :key="item.name">
            <Icon :type="item.icon" class="iconLeft" />
            <span
              @click="value1 = true"
              @mouseenter="openDrawer"
              @mouseleave="closeDrawer"
              v-if="item.haveSecond"
            >
              <Icon type="ios-arrow-forward" class="iconRight" />
              <label>{{item.name}}</label>
            </span>
            <span v-else>
              <label>{{item.name}}</label>
            </span>
          </li>
        </ul>
      </Drawer>
      <Drawer
        placement="left"
        v-model="value1"
        width="50"
        :mask="false"
        class="Drawer"
        :styles="{backgroundColor:'#eee'}"
      >
        <Card :bordered="false" dis-hover style="background:#eee;margin-top:20px">
          <p slot="title">施工项目部</p>
          <span class="item" @click="hightWayClick">施工项目管理系统</span>
        </Card>
        <Card :bordered="false" dis-hover style="background:#eee;margin-top:20px">
          <p slot="title">施工企业</p>
          <span class="item">工程项目管理企业版</span>
          <span class="item">造价管理</span>
        </Card>
        <Card :bordered="false" dis-hover style="background:#eee;margin-top:20px">
          <p slot="title">监理单位</p>
        </Card>
        <Card :bordered="false" dis-hover style="background:#eee;margin-top:20px">
          <p slot="title">建设单位</p>
        </Card>
      </Drawer>
    </div>
  </div>
</template>

<script>
import { getRealname } from '@/libs/util'
import SideMenu from '@/components/main/components/side-menu'
import HeaderBarConsole from '@/components/main/components/header-bar-console'
import TagsNav from '@/components/main/components/tags-nav'
import User from '@/components/main/components/user'
import workOrder from './workOrder/workOrder'
import renew from './renew/renew'
import information from './information/information'
import authentication from './authentication/authentication'
import purchase from './purchase/purchase'
import ABackTop from '@/components/main/components/a-back-top'
import Fullscreen from '@/components/main/components/fullscreen'
import Language from '@/components/main/components/language'
import '@/components/main/main.less'
import Items from '@/components/main/components/items/items'
import News from '@/components/main/components/news/news'
export default {
  components: {
    News,
    Items,
    SideMenu,
    HeaderBarConsole,
    Language,
    TagsNav,
    Fullscreen,
    User,
    ABackTop,
    purchase,
    renew,
    authentication,
    workOrder,
    information
  },
  data () {
    return {
      navList: [
        { name: '最近使用', url: '/console/Home', isSelected: false, icon: '' },
        {
          name: '公路工程',
          url: '/console/highwayManagement',
          isSelected: false,
          icon: ''
        },
        { name: '水利水电工程', url: '/console/waterManagement', isSelected: false, icon: '' },
        { name: '市政工程', url: '/console/servicesManagement', isSelected: false, icon: '' },
        { name: '房建工程', url: '/console/roomManagement', isSelected: false, icon: '' }
      ],
      value2: false,
      value1: false,
      DrawerList: [
        { icon: 'ios-build', haveSecond: true, name: '工程项目' },
        { icon: 'ios-build', haveSecond: false, name: '人才招聘' }
      ],
      timer: ''
    }
  },
  methods: {
    checkActive (name) {
      this.navList.forEach(item => {
        if (item.name === name) {
          item.isSelected = true
        } else {
          item.isSelected = false
        }
      })
    },
    getactive (isSelected) {
      if (isSelected) {
        return 'active'
      } else {
        return ''
      }
    },
    DrawerClose () {
      this.value1 = false
    },
    openDrawer () {
      let _this = this
      _this.timer = setTimeout(function () {
        _this.value1 = true
      }, 500)
    },
    openDrawer2 () {
      let _this = this
      _this.timer = setTimeout(function () {
        _this.value2 = true
      }, 500)
    },
    closeDrawer () {
      clearTimeout(this.timer)
    },
    // 左侧菜单施工管理点击
    hightWayClick () {
      this.value1 = false
      this.value2 = false
      let routeData = this.$router.resolve({
        name: 'consoleHome'
      })
      window.open(routeData.href, '_blank')
    }
  },
  mounted () {
    this.navList[0].isSelected = true
    $('.ivu-drawer-content-no-mask').css({ 'position': 'relative', 'right': '-280px', 'box-shadow': '0 0 0 #fff' })
  },
  computed: {
    userAvatar () {
      return getRealname()
    },
    unreadCount () {
      return this.$store.state.user.unreadCount
    }
  }
}
</script>

<style lang="less" scoped>
// 顶部导航栏
.header-con {
  // border-bottom: 1px solid #eee !important;
  height: 80px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  div {
    line-height: 80px;
  }

  h1 {
    line-height: 64px !important;
  }
}

// 顶部导航栏下方的大盒子
.box {
  height: 100%;
  background: #eee;
}

.ivu-layout-header {
  background-color: #fff;
}

.console-card {
  height: 100%;
  width: 90%;
  margin: 30px auto 20px;
  display: flex;
  justify-content: space-between;

  .left-box {
    border-radius: 6px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    width: 20%;
    padding-top: 20px;

    .navList {
      width: 100%;

      p {
        text-align: left;
        padding-left: 20px;
        height: 50px;
        line-height: 50px;
        color: #657180;
      }

      p:hover {
        background: #f3f3f3 !important;
      }
    }
  }

  .right-box {
    border-left: 1px solid #dcdee2 !important;
    border-radius: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0px;
    width: 100%;
    height: ~'calc(100% - 80px)';
    overflow: auto;
  }
}

// 标题
.item-title {
  display: flex;
  justify-content: space-between;
  height: 30px;
  font-size: 14px;
  font-weight: bold;
  color: #17233d;
}

// 激活类
.active {
  p {
    color: #2d8cf0 !important;
    border-right: 2px solid #2d8cf0;
    z-index: 2;
  }
}
.itemMenu {
  position: fixed;
  left: 0;
  top: 110px;
  width: 32px;
  text-align: center;
  padding: 5px 5px;
  cursor: pointer;
  background: #39f;
  color: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.DrawerUl {
  li {
    cursor: pointer;
    height: 40px;
    list-style: none;
    .iconLeft {
      float: left;
      width: 50px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
    }
    span {
      display: inline-block;
      line-height: 40px;
      height: 40px;
      width: 230px;
      font-size: 14px;
      text-align: left;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .iconRight {
        float: right;
        width: 50px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        text-align: center;
      }
    }
  }
  li:hover {
    background-color: #f3f3f3;
  }
}
.item {
  margin-left: 40px;
  height: 40px;
  width: 240px;
  line-height: 40px;
  display: inline-block;
  overflow: hidden;
  padding: 0 10px;
}

.item:hover {
  background-color: #ddd;
  cursor: pointer;
}
.console-Type {
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>

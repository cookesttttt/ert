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
          <Button type="primary" style="width: 70%;" size="small">账号管理</Button>
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
      </card>
    </div>
  </div>
</template>

<script>
import { getRealname } from '@/libs/util'
import SideMenu from '@/components/main/components/side-menu'
import HeaderBarConsole from '@/components/main/components/header-bar-console'
import TagsNav from '@/components/main/components/tags-nav'
import User from '@/components/main/components/user'
import workOrder from '@/view/console/workOrder/workOrder'
import renew from '@/view/console/renew/renew'
import information from '@/view/console/information/information'
import authentication from '@/view/console/authentication/authentication'
import purchase from '@/view/console/purchase/purchase'
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
        { name: '账户安全', url: '/accountSettings/securitySettings', isSelected: false, icon: '' },
        {
          name: '基本资料',
          url: '/console/highwayManagement',
          isSelected: false,
          icon: ''
        }
      ]
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
    }
  },
  mounted () {
    this.navList[0].isSelected = true
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
  border-bottom: 2px solid #eee !important;
  height: 80px;

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
  margin: 30px 40px;
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
        color: #515a6e;
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
  background: #2b85e4;
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

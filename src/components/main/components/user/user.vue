<template>
  <div class="user-avatar-dropdown">
    <!-- 单点登录 -->
    <!-- <iframe
      src="http://192.168.100.114:8080/"
      height="0"
      width="0"
      frameborder="0"
      ref="iframe"
      id="iframe"
    ></iframe>-->
    <Dropdown placement="bottom-end">
      <Badge :dot="!!messageUnreadCount">
        <Avatar style="background-color: #2d8cf0">
          {{
          userAvatar.substr(0, 1)
          }}
        </Avatar>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list" class="DropdownMenu">
        <div style="width:300px">
          <div class="top-button">
            <span @click="accountSettings" style="margin-right:10px">账号管理</span> |
            <span @click="logout" style="margin-left:10px">退出登录</span>
          </div>
          <div class="colleague1">
            <Avatar style="background-color: #bbb;margin-bottom:20px;font-size:20px" class="Avatat">
              {{
              userAvatar.substr(0, 1)
              }}
            </Avatar>
            <div>
              <p>13812341234</p>
              <p class="colleagueName">{{userAvatar}}</p>
            </div>
          </div>
          <div class="buttonList">
            <div>基本资料</div>
            <span>|</span>
            <div>实名认证</div>
            <span>|</span>
            <div @click="accountSettings">安全设置</div>
          </div>
          <ul class="userList">
            <li @click="accountSettings">
              <Icon type="md-key" size="16" style="margin-right:10px" />密码修改
            </li>
            <li @click="accountSettings">
              <Icon type="md-phone-portrait" size="16" style="margin-right:10px" />手机变更
            </li>
          </ul>
          <div @click="logout" class="outBtn">退出登录</div>
        </div>
        <!-- <DropdownItem name="message">
          消息中心
          <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>-->
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions(['handleLogOut']),
    logout () {
      // this.$refs.iframe.contentWindow.postMessage({ msg: '注销' }, '*') 单点登录
      this.$cookies.remove('user')
      this.$cookies.set('token', '')
      localStorage.removeItem('projectId')
      localStorage.removeItem('username')
      this.$router.push({
        name: 'login'
      })
    },
    accountSettings () {
      let routeData = this.$router.resolve({
        name: 'securitySettings'
      })
      window.open(routeData.href, '_blank')
    }
  },
  created () {
    // let _this = this
    // window.addEventListener('message', function (e) {
    //   if (e.data.msg2 === 'no') {
    //     _this.handleLogOut().then(() => {
    //       _this.$router.push({
    //         name: 'login'
    //       })
    //     })
    //   }
    // })
  }
}
</script>

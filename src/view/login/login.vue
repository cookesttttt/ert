<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="box">
    <div class="login">
      <!-- 单点登录 -->
      <!-- <iframe
        src="http://192.168.100.114:8080/#/"
        width="0"
        height="0"
        frameborder="0"
        id="iframe"
        ref="iframe"
        @load="postMsg"
      ></iframe>-->
      <div class="login-con">
        <Card icon="log-in"
              title="欢迎登录"
              :bordered="false">
          <div class="form-con">
            <login-form @on-success-valid="handleSubmit"
                        ref="login"></login-form>
            <p class="login-tip">
              <a href="javascript:void(0);"
                 @click="register">免费注册</a>
              <a href="javascript:void(0);"
                 @click="forgetPassword"
                 style="float: right">忘记密码?</a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import vuex, { mapActions } from 'vuex'
import store from '@/store'
import { login } from '@/api/user'
import { mainList } from '@/api/routers'

export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(['handleLogin']),
    handleSubmit ({ username, password }) {
      console.log('1')
      sessionStorage.clear()
      this.handleLogin({ username, password }).then(res => {
        if (res.msgCode === 0) {
          if (res.msgData.username === localStorage.getItem('username') && localStorage.getItem('projectId')) {
            mainList(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
              if (res.data.msgData === null || localStorage.getItem('urlName') === 'null' || localStorage.getItem('urlName') === null) {
                this.$router.push({
                  name: 'consoleHome'
                })
              } else {
                let UrlNmae = localStorage.getItem('urlName')
                localStorage.setItem('urlName', null)
                this.$router.push({
                  name: UrlNmae
                })
              }
            })
          } else {
            localStorage.removeItem('projectId')
            localStorage.setItem('username', res.msgData.username)
            this.$router.push({
              name: 'consoleHome'
            })
          }
          // this.$store.state.app.menuRspList = []
        }
      }).catch(error => {
        this.$refs.login.initFunction()
        this.$Notice.error({
          title: error.data.msgContent
        })
      })
    },
    register () {
      this.$router.push({ path: '/sign_in' })
    },
    forgetPassword () {
      this.$router.push({ path: '/forgetPassword' })
    },
    postMsg () {
      // 单点登录
      // this.$refs.iframe.contentWindow.postMessage({ log: '是否登录' }, '*')
    }
  },
  created () {
    // this.$Spin.show()
    // let _this = this
    // window.addEventListener('message', function (e) {
    //   console.log(e.data.msg2)
    //   if (e.data.msg2) {
    //     var data = e.data.msg2
    //     login({ username: data.username, password: data.password }).then((res) => {
    //       if (res.data.msgCode === 0) {
    //         const token = res.data.msgData.jwt.access_token
    //         _this.$store.commit('setToken', token)
    //         _this.$store.commit(
    //           'setAvatar',
    //           'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png'
    //         )
    //         _this.$store.commit('setUserName', res.data.msgData.realName)
    //         _this.$store.commit('setUserId', '1')
    //         _this.$store.commit('setAccess', res.data.msgData.roles)
    //         _this.$store.commit('setHasGetInfo', true)
    //         _this.$cookies.set('user', JSON.stringify(res.data))
    //         _this.$Spin.hide()
    //         _this.$router.push({
    //           name: 'consoleHome'
    //         })
    //       }
    //     })
    //   } else if (e.data.msg2 === null) {
    //     location.href = 'http://127.0.0.1:5500/login.html'
    //   }
    // })
    this.$Notice.destroy()
  },
  mounted () {
    // console.log(document.getElementById('iframe').contentWindow.postMessage({ log: '是否登录' }, '*'))
  }
}

</script>

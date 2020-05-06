<template>
  <Row id="bj">
    <div class="head" style="background-color: #153152">
      <div class="widthLimit" ui-view="banner">
        <a href></a>
        <span id="bannerQuickLink">
          <span>
            <span class="ng-binding">已有账号，立即</span>
            <a href="javascript:void(0)" style="color:#f66f6a" @click="goLogin">登录</a>
          </span>
          <a class="homepageLink" href style="visibility: hidden">首页</a>
        </span>
      </div>
    </div>
    <Col span="7" offset="9" class="sign">
      <Card class="center">
        <div v-show="show">
          <h3 class="account">账号确认</h3>
          <p class="information">请输入您的手机号码</p>
          <div class="fpwdErrorMsg ng-binding">{{errorTexte}}</div>
          <!--聚焦气泡-->
          <Poptip placement="right" v-model="visible">
            <!--手机号输入框-->
            <Input
              v-model="tel"
              placeholder="请输入你的手机号码"
              size="large"
              trigger="focus"
              @on-change="inputChange"
              @on-blur="inputBlur"
              @on-focus="inputFocus"
              :maxlength="11"
              id="tel"
            >
              <Icon
                type="ios-close-circle"
                v-show="Iconshow"
                color="red"
                slot="suffix"
                class="iconStyle"
              ></Icon>
            </Input>
            <!--手机验证提示-->
            <div slot="content" id="contentDiv" ref="pop">
              <Icon :type="telIcon" :color="telColor" class="right6"></Icon>
              <span>{{contentSpan}}</span>
            </div>
          </Poptip>
          <br />
          <br />
          <Form ref="loginForm" :model="form">
            <FormItem prop="verificationID">
              <div class="drag">
                <div class="drag_bg"></div>
                <div class="drag_text">{{confirmWords}}</div>
                <div @mousedown="mousedownFn($event)" class="handler handler_bg"></div>
              </div>
            </FormItem>
          </Form>
          <ButtonGroup size="large">
            <Button @click="cancel">取消</Button>
            <Button type="error" :disabled="disabled" @click="send">发送验证码</Button>
          </ButtonGroup>
        </div>
        <div v-show="!show">
          <h3 class="account">密码重置</h3>
          <p class="information">设置你的新密码</p>
          <div class="fpwdErrorMsg ng-binding"></div>
          <Poptip placement="right" v-model="visible2">
            <!--验证码输入框-->
            <Input
              v-model="verification"
              size="large"
              trigger="focus"
              :maxlength="4"
              @on-change="changeVerification"
              @on-blur="blurVerification"
              @on-focus="focusVerification"
              placeholder="请输入短信验证码"
              id="verification"
            >
              <Icon
                type="ios-close-circle"
                v-show="Iconshow2"
                color="red"
                slot="suffix"
                class="iconStyle"
              ></Icon>
            </Input>
            <!--验证码提示信息-->
            <div slot="content" ref="pop">
              <Icon :type="verificationIcon" :color="verificationColor" class="right6"></Icon>
              <span>{{cont}}</span>
            </div>
          </Poptip>
          <br />
          <br />
          <div>
            <!--聚焦气泡-->
            <Poptip placement="right" v-model="pasw">
              <!--密码输入框-->
              <Input
                v-model="password"
                type="password"
                trigger="focus"
                size="large"
                @on-change="changepws"
                @on-blur="blurpws"
                :maxlength="32"
                id="pasw"
                placeholder="请输入你的密码"
                style="width: 300px"
              >
                <Icon :type="mistake" v-show="paswShow" color="red" slot="suffix" class="iconStyle"></Icon>
              </Input>
              <!--验证密码提示信息-->
              <ul slot="content" class="ulName">
                <li>
                  <Icon :type="lengPws" size="15" :color="pwscolor" class="right6"></Icon>
                  <span>长度为8-32个字符</span>
                </li>
                <li>
                  <Icon :type="ziFupws" size="15" :color="ziFucolor" class="right6"></Icon>
                  <span>数字、大小写字母及特殊字符至少包含2种</span>
                </li>
              </ul>
            </Poptip>
            <br />
            <br />
          </div>
          <div>
            <!--聚焦气泡-->
            <Poptip placement="right" v-model="erpws">
              <!--二次输入密码的输入框-->
              <Input
                v-model="erPawass"
                placeholder="请再次输入密码"
                trigger="focus"
                type="password"
                size="large"
                id="erpws"
                @on-change="erChange"
                @on-blur="erBlur"
                @on-focus="erFocus"
                style="width: 300px"
              >
                <Icon
                  type="ios-close-circle"
                  v-show="erpawa"
                  color="red"
                  slot="suffix"
                  class="iconStyle"
                ></Icon>
              </Input>
              <!--二次密码验证提示信息-->
              <div slot="content" ref="pop">
                <Icon :type="erIcon" :color="erColor" class="right6"></Icon>
                <span>{{erpwas}}</span>
              </div>
            </Poptip>
            <br />
            <br />

            <ButtonGroup size="large">
              <Button type="error" @click="determinePassword">确定</Button>
            </ButtonGroup>
          </div>
        </div>
      </Card>
    </Col>
    <div class="clear"></div>
    <div class="footer"></div>
  </Row>
</template>
<script>
import { getTel, newPasswordData, getVerificationCode } from '@/api/forgetPssword/forgetPassword'
import { isDataSuccess, setToken } from '@/libs/util'

export default {
  name: 'forgetPassword',
  data () {
    return {
      show: true,
      result: false,
      numCount: '', // 倒计时
      errorTexte: '',
      timer: '',
      telIcon: 'ios-close-circle',
      telColor: 'red',
      disabled: true,
      // 正确icon
      correct: 'ios-checkmark-circle-outline',
      // 错误icon
      mistake: 'ios-close-circle',
      // 电话
      tel: '',
      visible: false,
      Iconshow: false,
      contentSpan: '该项不能为空',
      // 验证码
      verificationIcon: 'ios-close-circle',
      verificationColor: 'red',
      verification: '',
      cont: '该项不能为空',
      visible2: false,
      Iconshow2: false,
      // 密码验证
      pasw: false,
      // icon显示隐藏
      paswShow: false,
      password: '',
      // 密码长度icon
      lengPws: 'md-radio-button-off',
      // 字符判断icon
      ziFupws: 'md-radio-button-off',
      // 长度颜色
      pwscolor: '',
      // 字符颜色
      ziFucolor: '',
      // 字
      zi: '',
      // 二次验证
      erIcon: 'ios-close-circle',
      erColor: 'red',
      erpws: false,
      erPawass: '',
      erpawa: false,
      erpwas: '该项不能为空',
      // 滑块
      form: {
        verificationID: ''
      },
      beginClientX: 0,
      /* 距离屏幕左端距离 */
      mouseMoveStata: false,
      /* 触发拖动状态 判断 */
      maxwidth: 260,
      /* 拖动最大宽度，依据滑块宽度算出来的 */
      confirmWords: '拖动滑块验证',
      /* 滑块文字 */
      confirmSuccess: false
    }
  },
  methods: {
    goLogin () {
      this.$router.push({ path: '/login' })
    },
    isTel () {
      const value = this.tel
      getTel(this.tel).then(res => {
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
            if (res.data.msgData) {
              this.visible = false
              this.Iconshow = false
              this.result = true
              $('#tel input').css('borderColor', '#57a3f3')
            } else {
              this.visible = true
              this.contentSpan = '手机号不存在'
              this.telColor = 'red'
              this.telIcon = this.mistake
              if (value.length === 0) {
                this.contentSpan = '该项不能为空'
                this.Iconshow = true
              }
            }
            break
        }
      })
    },
    inputChange () {
      let result = false
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      const value = this.tel
      if (!myreg.test(value) || value.length != 11) {
        this.visible = true
        this.contentSpan = '请输入正确的手机号码'
        this.telColor = 'red'
        this.telIcon = this.mistake
        if (value.length === 0) {
          this.contentSpan = '该项不能为空'
          this.Iconshow = true
        }
      } else {
        this.isTel()
      }
    },
    inputBlur () {
      const value = this.tel
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(value) && value.length != 11) {
        $('#tel input').css('borderColor', '#ff0000')
        this.Iconshow = true
        if (value.length === 0) {
          $('#tel input').css('borderColor', '#57a3f3')
          this.Iconshow = false
        }
      } else {
        this.isTel()
      }
    },
    inputFocus () {
      if (this.result) {
        this.telColor = 'green'
        this.telIcon = this.correct
        this.contentSpan = '手机号有效'
        if (this.tel.length === 0) {
          this.contentSpan = '该项不能为空'
          this.telColor = 'red'
          this.telIcon = this.mistake
        }
      } else {
        this.telColor = 'red'
        this.telIcon = this.mistake
      }
    },
    changeVerification () {
      let result = false
      let num = /^[0-9]*$/
      const val = this.verification
      if (!num.test(val)) {
        this.visible2 = true
        this.cont = '仅支持数字'
        this.verificationColor = 'red'
        this.verificationIcon = this.mistake
      } else if (val.length < 4) {
        this.visible2 = true
        this.cont = '最段不能少于4个字符'
        this.verificationColor = 'red'
        this.verificationIcon = this.mistake
      } else {
        this.visible2 = false
        $('#verification input').css('borderColor', '#57a3f3')
        result = true
      }
      return result
    },
    blurVerification () {
      let result = false
      let num = /^[0-9]*$/
      const val = this.verification
      if (!num.test(val)) {
        this.Iconshow2 = true
        $('#verification input').css('borderColor', '#ff0000')
      } else if (val.length < 4) {
        this.Iconshow2 = true
        $('#verification input').css('borderColor', '#ff0000')
        if (val.length === 0) {
          this.cont = '该项不能为空'
          this.Iconshow2 = false
          $('#verification input').css('borderColor', '#57a3f3')
        }
      } else {
        this.Iconshow2 = false
        $('#verification input').css('borderColor', '#dcdee2')
        result = true
      }
      return result
    },
    focusVerification () {
      const code = this.blurVerification()
      if (code) {
        this.verificationColor = 'green'
        this.verificationIcon = this.correct
        this.cont = '验证码格式正确'
      } else {
        this.verificationColor = 'red'
        this.verificationIcon = this.mistake
      }
    },
    // 密码验证
    changepws () {
      let pwsyanz = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/
      const valpws = this.password
      if (valpws.length > 8 && valpws.length < 32) {
        if (!pwsyanz.test(valpws)) {
          this.ziFupws = this.mistake
          this.ziFucolor = 'red'
        } else {
          this.ziFupws = this.correct
          this.ziFucolor = 'green'
        }
      }
      if (valpws.length > 8 && valpws.length < 32) {
        this.lengPws = this.correct
        this.pwscolor = 'green'
        $('#pasw input').css('borderColor', '#dcdee2')
      } else {
        this.lengPws = this.mistake
        this.pwscolor = 'red'
      }
      if (valpws.length === 0) {
        this.ziFupws = this.original
        this.lengPws = this.original
        this.ziFucolor = ''
        this.pwscolor = ''
      }
    },
    blurpws () {
      let pwsyanz = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/
      const valpws = this.password
      let result = false
      if (valpws.length > 8 && valpws.length < 32) {
        this.paswShow = false
        if (!pwsyanz.test(valpws)) {
          this.paswShow = true
          $('#pasw input').css('borderColor', '#ff0000')
        } else {
          $('#pasw input').css('borderColor', '#57a3f3')
          this.paswShow = false
          result = true
        }
      } else if (valpws.length === 0) {
        $('#pasw input').css('borderColor', '#57a3f3')
        this.paswShow = false
      } else {
        this.paswShow = true
        $('#pasw input').css('borderColor', '#ff0000')
      }
      return result
    },
    //  密码一致
    erChange () {
      if (this.password !== this.erPawass) {
        this.erpws = true
        this.erpwas = '密码不一致'
        this.erColor = 'red'
        this.erIcon = this.mistake
      } else {
        $('#erpws input').css('borderColor', '#57a3f3')
        this.erpws = false
        this.erpawa = false
      }
      if (this.erPawass.length === 0) {
        this.erpwas = '该项不能为空'
        this.erpws = true
        this.erpawa = false
      }
    },
    erBlur () {
      if (this.password !== this.erPawass) {
        this.erpawa = true
        $('#erpws input').css('borderColor', '#ff0000')
      } else {
        $('#erpws input').css('borderColor', '#dcdee2')
        this.erpawa = false
        return true
      }
    },
    erFocus () {
      const er = this.erBlur()
      if (er) {
        this.erColor = 'green'
        this.erIcon = this.correct
        this.erpwas = '密码一致'
      } else {
        this.erColor = 'red'
        this.erIcon = this.mistake
      }
    },
    //  滑块
    mousedownFn: function (e) {
      // 手机验证成功后滑块能滑动
      this.mouseMoveStata = this.result
      this.beginClientX = e.clientX
    }, // 按下滑块函数
    successFunction () {
      $('.handler').removeClass('handler_bg').addClass('handler_ok_bg')
      this.confirmWords = '验证通过'
      $('.drag').css({
        'color': '#fff'
      })
      $('.drag').css({
        'background-color': '#13CE66'
      })
      $('.handler').css({
        'left': this.maxwidth
      })
      $('.drag_bg').css({
        'width': this.maxwidth
      })
      $('body').unbind('mousemove')
      $('body').unbind('mouseup')
      // 下一步按钮解除禁用
      this.confirmSuccess = true
      if (this.confirmSuccess && this.result) {
        this.disabled = false
      }
      // this.getVerificationID();
    },
    // 验证成功函数
    /*  getVerificationID: function() {
        let id = this;
        $.ajax({
          type: "get",
          url: "#",
          async: true,
          dataType: 'json',
          success: function(data) {
            id.form.verificationID = data.verificationID;
          },
          error: function(error) {
            id.form.verificationID = '12';
            // alert(1222);
          }
        });
      }, */
    cancel () {
      this.$router.push({ path: '/login' })
    },
    // 发送验证码
    send () {
      getVerificationCode(this.tel).then(res => {
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
            this.show = false
            break
        }
      })
    },
    // 确定密码修改
    determinePassword () {
      const code = this.blurVerification()
      const er = this.erBlur()
      const pws = this.blurpws()
      const data = {
        'username': this.tel,
        'password': this.erPawass,
        'validateCode': this.verification
      }
      if (code && er && pws) {
        newPasswordData(data).then(res => {
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
              this.$Message.success(data.msgContent)
              const timejump = 3
              if (!this.timer) {
                this.numCount = timejump
                this.show = false
                this.timer = setInterval(() => {
                  if (this.numCount > 0 && this.numCount <= timejump) {
                    this.numCount--
                  } else {
                    this.show = true
                    clearInterval(this.timer)
                    this.timer = null
                    // 跳转的页面写在此处
                    this.$router.push({ path: '/login' })
                  }
                }, 1000)
              }
              break
          }
        })
      }
    }
  },
  mounted () {
    setToken('')
    $('body').on('mousemove', (e) => {
      // 拖动，这里需要用箭头函数，不然this的指向不会是vue对象
      if (this.mouseMoveStata) {
        var width = e.clientX - this.beginClientX
        if (width > 0 && width <= this.maxwidth) {
          $('.handler').css({
            'left': width
          })
          $('.drag_bg').css({
            'width': width
          })
        } else if (width > this.maxwidth) {
          this.successFunction()
        }
      }
    })
    $('body').on('mouseup', (e) => {
      // 鼠标放开
      this.mouseMoveStata = false
      var width = e.clientX - this.beginClientX
      if (width < this.maxwidth) {
        $('.handler').css({
          'left': 0
        })
        $('.drag_bg').css({
          'width': 0
        })
      }
    })
  }
}

</script>
<style scoped src="./index.css"></style>

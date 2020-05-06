<template>
 <Row id="bj">
   <div class="head" style="background-color: #153152">
     <div class="widthLimit" ui-view="banner">
       <a href="">
       </a>
       <span id="bannerQuickLink">
         <span>
           <span class="ng-binding">已有账号，立即</span>
           <a href="javascript:void(0)"  style="color:#f66f6a" @click="goLogin">登录</a>
         </span>
         <a class="homepageLink " href="" style="visibility: hidden">首页</a>
       </span>
     </div>
   </div>
   <Col span="18" offset="4" class="sign">
     <Card class="center">
       <h3>欢迎注册ERT建筑工程云平台</h3>
       <div >
         <br><br>
         <Button  disabled  class="zone">+86(中国大陆)<Icon type="md-arrow-dropdown" size="20" /></Button>
         <span class="size">-</span>
         <!--聚焦气泡-->
         <Poptip  placement="right" v-model="visible">
            <!--手机号输入框-->
           <Input v-model="tel" placeholder="请输入你的手机号码"
                  trigger="focus"
                  @on-change="inputChange"
                  @on-blur="inputBlur"
                  @on-focus="inputFocus"
                  :maxlength="11"
                  id="tel">
             <Icon type="ios-close-circle"  v-show="Iconshow" color="red" slot="suffix" class="iconStyle"></Icon>
           </Input>
            <!--手机验证提示-->
           <div slot="content" id="contentDiv" ref="pop">
             <Icon :type="telIcon" :color="telColor" class="right6"></Icon>
             <span>{{contentSpan}}</span>
           </div>
         </Poptip>
         <br>
         <br>
       </div>

       <div>
         <!--发送验证码按钮-->
         <Button  @click="getCode" v-show="show" class="code">获取短信验证码</Button>
         <Button v-show="!show" disabled class="code">{{count}}秒后可重新获取</Button>
         <!--聚焦气泡-->
         <Poptip placement="right" v-model="visible2">
           <!--验证码输入框-->
           <Input v-model="verification"
                  trigger="focus"
                  :maxlength=4
                  @on-change="changeVerification"
                  @on-blur="blurVerification"
                  @on-focus="focusVerification"
                  placeholder="请输入短信验证码"
                  id="verification">
             <Icon type="ios-close-circle"  v-show="Iconshow2" color="red" slot="suffix" class="iconStyle"></Icon>
           </Input>
           <!--验证码提示信息-->
           <div slot="content"  ref="pop">
             <Icon :type="verificationIcon" :color="verificationColor" class="right6"></Icon>
             <span>{{cont}}</span>
           </div>
         </Poptip>
         <br><br>
     </div>
       <div>
         <!--聚焦气泡-->
         <Poptip placement="right" v-model="name">
           <!--姓名输入框-->
           <Input v-model="accountName"
                  trigger="focus"
                  @on-change="changeName"
                  @on-blur="blurName"
                  :maxlength=32
                  placeholder="请输入你的真实姓名"
                  id="accountName"
                  class="width350">
             <Icon :type="mistake"  v-show="nameShow" color="red" slot="suffix" class="iconStyle"></Icon>
           </Input>
           <!--验证姓名提示信息-->
           <ul slot="content" class="ulName">
             <li>
               <Icon :type="realname"  size="15" :color="colorName" class="right6"></Icon>
               <span>支持中文以及英文姓名</span>
             </li>
             <li>
               <Icon :type="unit" size="15" :color="colorUnit" class="right6"></Icon>
               <span>长度为2-32个字符</span>
             </li>
           </ul>
         </Poptip>
         <br><br>
       </div>
       <div>
         <!--聚焦气泡-->
         <Poptip placement="right" v-model="pasw">
           <!--密码输入框-->
           <Input v-model="password"
                  type="password"
                  trigger="focus"
                  @on-change="changepws"
                  @on-blur="blurpws"
                  :maxlength=32
                  id="pasw"
                  placeholder="请输入你的密码"
                  class="width350">
             <Icon :type="mistake"  v-show="paswShow" color="red"
                   slot="suffix"
                   class="iconStyle">
             </Icon>
           </Input>
           <!--验证密码提示信息-->
           <ul slot="content" class="ulName">
             <li>
               <Icon :type="lengPws" size="15" :color="pwscolor" class="right6"></Icon>
               <span>长度为8-32个字符</span></li>
             <li>
               <Icon :type="ziFupws"  size="15" :color="ziFucolor" class="right6"></Icon>
               <span>数字、大小写字母及特殊字符至少包含2种</span>
             </li>
           </ul>
         </Poptip>
         <br><br>
       </div>
       <div>
         <!--聚焦气泡-->
         <Poptip  placement="right" v-model="erpws">
           <!--二次输入密码的输入框-->
           <Input v-model="erPawass" placeholder="请再次输入密码"
                  trigger="focus"
                  type="password"
                  id="erpws"
                  @on-change="erChange"
                  @on-blur="erBlur"
                  @on-focus="erFocus"
                  class="width350">
             <Icon type="ios-close-circle"  v-show="erpawa" color="red" slot="suffix" class="iconStyle"></Icon>
           </Input>
           <!--二次密码验证提示信息-->
           <div slot="content"  ref="pop">
             <Icon :type="erIcon" :color="erColor" class="right6"></Icon>
             <span>{{erpwas}}</span>
           </div>
         </Poptip>
         <br><br>
       </div>
       <div>
         <Button  class="width350" type="primary" @click="comfirmInfo" :disabled="disabled">同意条款并注册</Button>
       </div>
       <br>
       <Checkbox label="twitter" @on-change="disabled = !disabled">
        </Checkbox> <a href="https://www.baidu.com/" style="font-size: 15px">《ERT建筑工程云平台服条款》</a>
     </Card>
   </Col>
   <div class="clear"></div>
   <div class="footer" ></div>
 </Row>
</template>

<script>
import axios from '@/libs/api.request'
import { setToken } from "@/libs/util"
export default {
  name: 'sign-in',
  data () {
    return {
      numCount:"",//倒计时
      timer2:'',
      telIcon: 'ios-close-circle',
      telColor: 'red',
      disabled: true,
      // 电话
      tel: '',
      visible: false,
      Iconshow: false,
      // 验证码
      verificationIcon: 'ios-close-circle',
      verificationColor: 'red',
      verification: '',
      cont: '该项不能为空',
      visible2: false,
      Iconshow2: false,
      // 倒计时
      show: true,
      count: '',
      timer: null,
      contentSpan: '该项不能为空',

      // 姓名
      realname: 'md-radio-button-off',
      unit: 'md-radio-button-off',
      // 原始icon
      original: 'md-radio-button-off',
      // 正确icon
      correct: 'ios-checkmark-circle-outline',
      // 错误icon
      mistake: 'ios-close-circle',
      // 输入框值
      accountName: '',
      // 验证名字icon颜色
      colorName: '',
      // 验证长度icon的颜色
      colorUnit: '',
      name: false,
      nameShow: false,

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
      erpwas: '该项不能为空'
    }
  },
  methods: {
    goLogin(){
      this.$router.push({path: '/login'})
    },
    /**
     * 显示正确的提示框
     * @param content 提示框内容
     */
    showRighitTip(content) {
      this.visible = false         //气泡隐藏
      this.Iconshow = false       // 输入框后的Icon隐藏

    },

    /**
     * 显示错误提示框
     * @param content 提示框内容
     */
    showErrorTip(content) {
      this.visible = true                          //气泡显示
      this.contentSpan = '请输入正确的手机号码'    //气泡文字显示
      this.telColor = 'red'                      //气泡中的Icon变红
      this.telIcon = this.mistake                //气泡中错误的Icon
      this.Iconshow = true                      //输入框后的Icon

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
        this.visible = false
        this.Iconshow = false
        document.getElementById('tel').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
        result = true
      }
      return result
    },

    inputBlur () {
      let result = false
      const value = this.tel
      let myreg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!myreg.test(value) && value.length != 11) {
        document.getElementById('tel').getElementsByTagName('input')[0].style.borderColor = 'red'
        this.Iconshow = true
        if (value.length === 0) {
          document.getElementById('tel').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
          this.Iconshow = false
        }
      } else {
        document.getElementById('tel').getElementsByTagName('input')[0].style.borderColor = '#dcdee2'
        this.Iconshow = false
        result = true
      }
      return result
    },
    inputFocus () {
      const input = this.inputBlur()
      if (input) {
        this.telColor = 'green'
        this.telIcon = this.correct
        this.contentSpan = '手机号有效'
      } else {
        this.telColor = 'red'
        this.telIcon = this.mistake
      }
    },
    // 验证码验证
    changeVerification () {
      let result = false
      let num = /^[0-9]*$/
      const val = this.verification
      // console.log(!num.test(this.verification))  false
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
        document.getElementById('verification').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
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
        document.getElementById('verification').getElementsByTagName('input')[0].style.borderColor = 'red'
      } else if (val.length < 4) {
        this.Iconshow2 = true
        document.getElementById('verification').getElementsByTagName('input')[0].style.borderColor = 'red'
        if (val.length === 0) {
          this.cont = '该项不能为空'
          this.Iconshow2 = false
          document.getElementById('verification').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
        }
      } else {
        this.Iconshow2 = false
        document.getElementById('verification').getElementsByTagName('input')[0].style.borderColor = '#dcdee2'
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
    // 按钮倒计时
    getCode () {
      const input = this.inputBlur()
      if (!input) {
        document.getElementById('tel').getElementsByTagName('input')[0].style.borderColor = 'red'
        this.Iconshow = true
      } else {
        axios.request({
          url: '/uac/user/code/' + this.tel,
          method: 'get'
        }).then(res => {
          console.log(res)
          const msg = res.data.msgContent
          if (res.data.msgCode === 0) {
            // TODO 发送成功绿色
            const TIME_COUNT = 60
            if (!this.timer) {
              this.count = TIME_COUNT
              this.show = false
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--
                } else {
                  this.show = true
                  clearInterval(this.timer)
                  this.timer = null
                }
              }, 1000)
            }
          } else {
            let cont = true
            this.inputFocus(cont)
            document.getElementById('tel').getElementsByTagName('input')[0].style.borderColor = 'red'
            this.Iconshow = true
            this.$Message.error(msg)
          }
        })
      }
    },
    // 姓名验证
    changeName () {
      let result = false
      let className = /^[\u4e00-\u9fa5_a-zA-Z]+$/
      const valName = this.accountName
      if (!className.test(valName)) {
        this.realname = this.mistake
        this.colorName = 'red'
      } else {
        this.realname = this.correct
        this.colorName = 'green'
      }
      if (valName.length > 1 && valName.length < 32) {
        this.unit = this.correct
        this.colorUnit = 'green'
      } else {
        this.unit = this.mistake
        this.colorUnit = 'red'
      }
      if (valName.length === 0) {
        this.realname = this.original
        this.unit = this.original
        this.colorName = ''
        this.colorUnit = ''
        document.getElementById('accountName').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
      }
      if (this.colorUnit === 'green') {
        document.getElementById('accountName').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
        if (this.colorName === 'green') {
          result = true
        }
      }
      return result
    },
    blurName () {
      let result = false
      let className = /^[\u4e00-\u9fa5_a-zA-Z]+$/
      const valName = this.accountName
      if (valName.length > 1 && valName.length < 32) {
        console.log(valName.length)
        this.nameShow = false
        if (!className.test(valName)) {
          this.nameShow = true
          document.getElementById('accountName').getElementsByTagName('input')[0].style.borderColor = 'red'
        } else {
          document.getElementById('accountName').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
          this.nameShow = false
          result = true
        }
      } else if (valName.length === 0) {
        document.getElementById('accountName').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
        this.nameShow = false
      } else {
        this.nameShow = true
        document.getElementById('accountName').getElementsByTagName('input')[0].style.borderColor = 'red'
      }

      return result
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
        document.getElementById('pasw').getElementsByTagName('input')[0].style.borderColor = '#dcdee2'
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
          document.getElementById('pasw').getElementsByTagName('input')[0].style.borderColor = 'red'
        } else {
          document.getElementById('pasw').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
          this.paswShow = false
          result = true
        }
      } else if (valpws.length === 0) {
        document.getElementById('pasw').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
        this.paswShow = false
      } else {
        this.paswShow = true
        document.getElementById('pasw').getElementsByTagName('input')[0].style.borderColor = 'red'
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
        document.getElementById('erpws').getElementsByTagName('input')[0].style.borderColor = '#57a3f3'
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
        document.getElementById('erpws').getElementsByTagName('input')[0].style.borderColor = 'red'
      } else {
        document.getElementById('erpws').getElementsByTagName('input')[0].style.borderColor = '#dcdee2'
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
    // 提交
    comfirmInfo () {
      const input = this.inputBlur()
      const code = this.blurVerification()
      const name = this.blurName()
      const pws = this.blurpws()
      const er = this.erBlur()
      console.log('input:' + input)
      console.log('code:' + code)
      console.log('pws:' + pws)
      console.log('name:' + name)
      console.log('er:' + er)
      const account = {}
      account.username = this.tel
      account.validateCode = this.verification
      account.realName = this.accountName
      account.password = this.password
      if (input && code && name && pws && er) {
        axios.request({
          url: '/uac/user/register',
          data: account,
          method: 'post'
        }).then(res => {
          console.log(res)
          // 验证
          if (res.data.msgCode === 0) {
            //跳转的页面写在此处
            this.$Modal.success({
              title: "注册成功",
              content: "恭喜你注册成功,即将进入登录页面",
            });
            //几秒后进入跳转页面
            const timejump = 3;
            if(!this.timer2){
              this.numCount = timejump ;
              this.show = false;
              this.timer2 = setInterval(()=>{
                if(this.numCount > 0 && this.numCount <= timejump ){
                  this.numCount--;
                }else{
                  this.show = true;
                  clearInterval(this.timer2);
                  this.timer2 = null;
                  this.$router.push({ path: '/login' })
                }
              },1000)
            }
          } else {
            this.$Message.error(res.data.msgContent)
          }
        })
      } else {
        if (input === false) {
          document.getElementById('tel').getElementsByTagName('input')[0].style.borderColor = 'red'
          this.Iconshow = true
        }
        if (code === false) {
          this.Iconshow2 = true
          document.getElementById('verification').getElementsByTagName('input')[0].style.borderColor = 'red'
        }
        if (pws === false) {
          this.paswShow = true
          document.getElementById('pasw').getElementsByTagName('input')[0].style.borderColor = 'red'
        }
        if (name === false) {
          this.nameShow = true
          document.getElementById('accountName').getElementsByTagName('input')[0].style.borderColor = 'red'
        }
        if (er === false) {
          this.erpawa = true
          document.getElementById('erpws').getElementsByTagName('input')[0].style.borderColor = 'red'
        }
      }
    }

  },
  created() {
    setToken('')
  }
}
</script>
<style>
  #banner {
    background-color: #252B3A;
    position: fixed;
    z-index: 99999;
    top: 0;
    width: 100%;
    min-width: 550px;
    height: 60px;
  }
  #banner .widthLimit {
    max-width: inherit;
    padding: 0 20px;
  }
  #bannerQuickLink {
    color: #fff;
    text-align: center;
    height: 60px;
    line-height: 60px;
    float: right;
    font-size: 14px;
  }
  #bannerQuickLink a {
    margin-right: 16px;
  }
  #languageSwitch {
    position: relative;
    height: 60px;
    color: #A0A2A8;
  }
  #languages {
    background-color: #212634;
    color: #A0A2A8;
    min-width: 205px;
    height: 170px;
    position: absolute;
    right: -20px;
    border-radius: 2px;
  }
</style>
<style scoped src="./index.css"></style>


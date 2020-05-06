<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入手机号码">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入登录密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="verificationID">
      <div class="drag">
        <div class="drag_bg"></div>
        <div class="drag_text">{{confirmWords}}</div>
        <div @mousedown="mousedownFn($event)" class="handler handler_bg"></div>
      </div>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>{{login}}</Button>
    </FormItem>
  </Form>
</template>
<script>

export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '账号不能为空', trigger: 'blur' }]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    },
    verificationID: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '请将滑块拖至最右侧', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: '15283828561',
        password: 'zhou941016',
        verificationID: ''
      },
      beginClientX: 0,
      mouseMoveStata: false,
      /* 触发拖动状态 判断 */
      maxwidth: 228,
      /* 拖动最大宽度，依据滑块宽度算出来的 */
      confirmWords: '请将滑块拖至最右侧',
      /* 滑块文字 */
      confirmSuccess: false,
      /* 验证成功判断 */
      login: '登录'
    }
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules,
        verificationID: this.verificationID
      }
    }
  },
  methods: {
    handleSubmit () {
      // console.log(store.dispatch('getMenuData'));

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$emit('on-success-valid', {
            username: this.form.username,
            password: this.form.password,
            verificationID: this.form.verificationID
          })
          this.login = '正在登录...'
        }
      })
    },
    mousedownFn: function (e) {
      this.mouseMoveStata = true
      this.beginClientX = e.clientX
    },
    // 按下滑块函数
    successFunction () {
      $('.handler')
        .removeClass('handler_bg')
        .addClass('handler_ok_bg')
      this.confirmWords = '验证通过'
      $('.drag').css({
        color: '#fff'
      })
      $('.drag').css({
        'background-color': '#13CE66'
      })
      $('.handler').css({
        left: this.maxwidth
      })
      $('.drag_bg').css({
        width: this.maxwidth
      })
      $('body').unbind('mousemove')
      $('body').unbind('mouseup')
      this.confirmSuccess = true
      this.getVerificationID()
    },
    // 验证成功函数
    getVerificationID: function () {
      let id = this
      $.ajax({
        type: 'get',
        url: '#',
        async: true,
        dataType: 'json',
        success: function (data) {
          id.form.verificationID = data.verificationID
        },
        error: function (error) {
          id.form.verificationID = '12'
        }
      })
    },
    mousemove () {
      $('body').on('mousemove', e => {
        // 拖动，这里需要用箭头函数，不然this的指向不会是vue对象
        if (this.mouseMoveStata) {
          var width = e.clientX - this.beginClientX
          if (width > 0 && width <= this.maxwidth) {
            $('.handler').css({
              left: width
            })
            $('.drag_bg').css({
              width: width
            })
          } else if (width > this.maxwidth) {
            this.successFunction()
          }
        }
      })
    },
    mouseup () {
      $('body').on('mouseup', e => {
        // 鼠标放开
        this.mouseMoveStata = false
        var width = e.clientX - this.beginClientX
        if (width < this.maxwidth) {
          $('.handler').css({
            left: 0
          })
          $('.drag_bg').css({
            width: 0
          })
        }
      })
    },
    initFunction () {
      this.form.verificationID = ''
      this.mouseMoveStata = false
      $('.handler')
        .removeClass('handler_ok_bg')
        .addClass('handler_bg')
      this.confirmWords = '请将滑块拖至最右侧'
      $('.drag').css({
        color: '#fff'
      })
      $('.drag').css({
        'background-color': '#75cdf9'
      })
      $('.handler').css({
        left: 0
      })
      $('.drag_bg').css({
        width: 0
      })
      $('body').on('mousedown', e => {
        this.mouseMoveStata = true
        this.beginClientX = e.clientX
      })
      this.mousemove()
      this.mouseup()
      this.confirmSuccess = false
      this.login = '登录'
    }
  },
  mounted () {
    this.mousemove()
    this.mouseup()
  }
}
</script>
<style scoped>
.drag {
  border-radius: 20px;
  position: relative;
  background-color: #75cdf9;
  width: 268px;
  height: 34px;
  line-height: 34px;
  text-align: center;
}

.handler {
  border-radius: 20px;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 40px;
  height: 34px;
  border: 1px solid #ccc;
  cursor: move;
}

.handler_bg {
  background: #fff
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==')
    no-repeat center;
}

.handler_ok_bg {
  background: #fff
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==')
    no-repeat center;
}

.drag_bg {
  border-radius: 20px;
  background-color: #13ce66;
  height: 34px;
  width: 0px;
}

.drag_text {
  position: absolute;
  top: 0px;
  width: 268px;
  color: white;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
}
</style>

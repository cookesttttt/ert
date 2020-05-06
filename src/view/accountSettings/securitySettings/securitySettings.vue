<template>
  <div>
    <Card>
      <p slot="title">安全设置</p>
      <div class="safetySetting">
        <Avatar style="background-color: #bbb" class="avatar">{{userInfo.realName}}</Avatar>
        <div class="userInfo">
          <p>
            登录账号: &nbsp;&nbsp;&nbsp;{{userInfo.username}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span
              style="color:#e96900"
            >(您已绑定微信登录)&nbsp;&nbsp;&nbsp;&nbsp;(您已完成实名制认证)</span>
          </p>
          <p>
            您的姓名: &nbsp;&nbsp;&nbsp;{{userInfo.realName}}&nbsp;&nbsp;&nbsp;
            <span
              style="color: #2D8cF0;cursor:pointer"
              @click="changeNameClick"
            >修改</span>
          </p>
          <p>注册时间: &nbsp;&nbsp;&nbsp;{{userInfo.createTime}}</p>
        </div>
      </div>
    </Card>
    <Card style="margin:20px auto">
      <p>
        您当前的账户安全程度
        <Progress
          :percent="50"
          hide-info
          :stroke-width="12"
          style="width:300px;display: inline-block;margin:0 18px"
        />安全级别:中
      </p>
    </Card>
    <Card>
      <List>
        <ListItem>
          <ListItemMeta title="登录密码">
            <p slot="description">安全性高的密码可以使帐号更安全。建议您定期更换密码，设置一个包含字母、符号、数字中至少两项且长度超过6位的密码。</p>
          </ListItemMeta>
          <template slot="action">
            <li>
              <label style="color:#19be6b">
                <Icon type="ios-checkmark-circle-outline" size="20" style="margin-right:6px" />已设置
              </label>
            </li>
            <li>
              <a @click="changePwdClick">修改</a>
            </li>
          </template>
        </ListItem>
        <ListItem>
          <ListItemMeta title="登录手机">
            <p slot="description">您已注册了手机{{userInfo.username}} [您的手机号可以直接用于登录、找回密码等]</p>
          </ListItemMeta>
          <template slot="action">
            <li>
              <label style="color:#19be6b">
                <Icon type="ios-checkmark-circle-outline" size="20" style="margin-right:6px" />已设置
              </label>
            </li>
            <li>
              <a @click="changePhoneClick">修改</a>
            </li>
          </template>
        </ListItem>
        <ListItem>
          <ListItemMeta title="密保问题" description="建议您设置三个容易记住，且最不容易被他人获取的问题及答案，更有效保障您的密码安全。" />
          <template slot="action">
            <li>
              <label style="color:#e96900">
                <Icon type="ios-information-circle-outline" size="20" style="margin-right:6px" />未设置
              </label>
            </li>
            <li>
              <a>修改</a>
            </li>
          </template>
        </ListItem>
        <ListItem>
          <ListItemMeta title="微信登录" description="绑定微信账号，使您登录更方便快捷，账户更安全。" />
          <template slot="action">
            <li>
              <label style="color:#e96900">
                <Icon type="ios-information-circle-outline" size="20" style="margin-right:6px" />未设置
              </label>
            </li>
            <li>
              <a>修改</a>
            </li>
          </template>
        </ListItem>
        <ListItem>
          <ListItemMeta
            title="注销账户"
            description="如果您不再使用此账号，可以将其注销。账号成功注销后，其下所有服务、数据及隐私信息将会被删除并将无法恢复。"
          />
          <template slot="action">
            <li>
              <a>注销账户</a>
            </li>
          </template>
        </ListItem>
      </List>
    </Card>
    <Modal
      v-model="changeName"
      @on-cancel="changeNameCancel"
      :closable="false"
      :mask-closable="false"
      title="修改姓名"
    >
      <Form ref="nameForm" :model="nameForm" :rules="nameRule" :label-width="80">
        <FormItem label="姓名" prop="newName" style="margin:0">
          <Input v-model="nameForm.newName" placeholder="请输入姓名"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="changeNameCancel">取消</Button>
        <Button type="primary" size="large" @click="changeNameOk">保存</Button>
      </div>
    </Modal>

    <Modal
      v-model="changePwd"
      @on-cancel="changePwdCancel"
      title="修改密码"
      :closable="false"
      :mask-closable="false"
    >
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100">
        <FormItem label="原密码" prop="oldPwd">
          <Input type="password" v-model="formCustom.oldPwd"></Input>
        </FormItem>
        <FormItem label="新密码" prop="passwd">
          <Input type="password" v-model="formCustom.passwd"></Input>
        </FormItem>
        <FormItem label="再次输入新密码" prop="passwdCheck">
          <Input type="password" v-model="formCustom.passwdCheck"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="changePwdCancel">取消</Button>
        <Button type="primary" size="large" @click="changePwdOk">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modal1" title="提示" @on-ok="ok" @on-cancel="ok">
      <p>密码修改成功请重新登录</p>
    </Modal>
    <Modal
      v-model="changePhone"
      :closable="false"
      :mask-closable="false"
      footer-hide
      class="changePhone"
    >
      <Tabs :value="changePhoneTabs">
        <TabPane label="验证身份" name="name1" disabled>
          <p class="changePhoneTtile">
            手机验证码验证 账户
            <span style="color:#e96900">{{userInfo.realName}}</span> 为确认是你本人操作,请完成以下验证
          </p>
          <p>
            <span style="width:100px;display:inline-block;text-align:right">手机号码：</span>
            {{userInfo.username}}
          </p>
          <Form
            ref="verificationCode"
            :model="verificationCode"
            :rules="verificationCodeRule"
            :label-width="100"
          >
            <FormItem></FormItem>
            <FormItem label="验证码" prop="code">
              <Input v-model="verificationCode.code" placeholder="请输入验证码" style="width:100px"></Input>
              <Button
                type="primary"
                style="margin-left:20px"
                :loading="codeLoading"
                @click="getCode"
              >{{getCodeTxt}}</Button>
            </FormItem>
            <FormItem>
              <Button @click="changePhoneCancel">取消</Button>&nbsp;
              <Button type="primary" @click="changePhoneOk">确定</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="修改手机" name="name2" disabled>
          <Form ref="newCode" :model="newCode" :rules="newCodeRule" :label-width="100">
            <FormItem label="新手机号码" prop="phone">
              <Input v-model="newCode.phone" placeholder="请输入新手机号码" style="width:250px"></Input>
            </FormItem>
            <FormItem label="验证码" prop="code">
              <Input v-model="newCode.code" placeholder="请输入验证码" style="width:100px"></Input>
              <Button
                type="primary"
                style="margin-left:20px"
                :loading="newCodeLoading"
                @click="getNewCode"
              >{{getNewCodeTxt}}</Button>
            </FormItem>
            <FormItem>
              <Button @click="changePhoneCancel">取消</Button>&nbsp;
              <Button type="primary" @click="changeNewPhoneOk">确定</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="完成" name="name3" disabled>标签三的内容</TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<script>
import { getInfo, putName, putPwd, putPhone, putCode, putNewPhone } from '@/api/accountSettings/securitySettings'
import { isDataSuccess } from '@/libs/util'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.formCustom.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请重新输入您的新密码'))
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('两个输入密码不匹配!'))
      } else {
        callback()
      }
    }
    return {
      changePhoneTabs: 'name1', // 修改手机号弹框中的 tabs
      userInfo: '', // 用户信息
      changeName: false, // 修改姓名弹框
      modal1: false, // 修改姓名弹框
      changePwd: false, // 修改密码弹框
      changePhone: false, // 修改手机号码验证
      codeLoading: false, // 手机短信验证码loading
      newCodeLoading: false, // 手机短信验证码loading
      count: 60, // 短信验证码发送时间
      getCodeTxt: '获取短信效验码', // 短信验证码按钮文字
      getNewCodeTxt: '获取短信效验码', // 短信验证码按钮文字
      nameForm: { // 新用户名表单
        newName: '' // 新用户名
      },
      nameRule: {
        newName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      formCustom: {
        passwd: '',
        passwdCheck: '',
        oldPwd: ''
      },
      ruleCustom: {
        passwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { validator: validatePassCheck, trigger: 'blur' }
        ],
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ]
      },
      // 验证码
      verificationCode: {
        code: ''
      },
      // 验证码
      newCode: {
        phone: '',
        code: ''
      },
      // 验证码表单验证
      verificationCodeRule: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      // 验证码表单验证
      newCodeRule: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 修改姓名弹框 --- 确定
    changeNameOk () {
      this.$refs.nameForm.validate((valid) => {
        if (valid) {
          putName(this.nameForm.newName).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.userInfo.realName = this.nameForm.newName
                this.$cookies.set('realName', this.userInfo.realName)
                this.$Message.success('修改成功')
                this.changeName = false
                break
            }
          })
        }
      })
    },
    // 修改姓名弹框 --- 取消
    changeNameCancel () {
      this.newName = ''
      this.changeName = false
    },
    // 点击修改姓名
    changeNameClick () {
      this.$refs.nameForm.resetFields()
      this.changeName = true
    },
    // 修改密码 提交
    changePwdOk () {
      this.$refs.formCustom.validate((valid) => {
        if (valid) {
          let data = {
            newPasword: this.formCustom.passwdCheck,
            oldPssword: this.formCustom.oldPwd
          }
          putPwd(data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.modal1 = true
                break
            }
          })
        }
      })
    },
    // 修改密码 取消
    changePwdCancel () {
      this.changePwd = false
    },
    // 点击修改密码
    changePwdClick () {
      this.$refs.formCustom.resetFields()
      this.changePwd = true
    },
    // 修改密码完成后的弹框确定
    ok () {
      this.$cookies.remove('user')
      this.$cookies.set('token', '')
      localStorage.removeItem('projectId')
      this.$router.push({
        name: 'login'
      })
    },
    // 修改登录手机弹框
    changePhoneClick () {
      this.$refs.verificationCode.resetFields()
      this.$refs.newCode.resetFields()
      this.changePhone = true
    },
    // 修改登录手机弹框---确定
    changePhoneOk () {
      this.$refs.verificationCode.validate((valid) => {
        if (valid) {
          putCode(this.userInfo.username, this.verificationCode.code).then(res => {
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
                this.changePhoneTabs = 'name2'
                break
            }
          })
        }
      })
    },
    changeNewPhoneOk () {
      this.$refs.newCode.validate((valid) => {
        if (valid) {
          let data = {
            'phone': this.newCode.phone,
            'smsCode': this.newCode.code
          }
          putNewPhone(data).then(res => {
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
                this.changePhoneTabs = 'name3'
                break
            }
          })
        }
      })
    },
    // 修改登录手机弹框---取消
    changePhoneCancel () {
      this.changePhone = false
    },
    // 获取短信验证码
    getCode () {
      if (this.$cookies.get('codeTime')) {
        this.$Message.error({
          content: '短信已经发送请勿在一分钟内重复点击',
          duration: 4,
          closable: true
        })
      } else {
        putPhone(this.userInfo.username).then(res => {
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
              this.codeLoading = true
              this.$cookies.set('codeTime', 'true', '1min')
              var countDown = setInterval(() => {
                if (this.count < 1) {
                  this.codeLoading = false
                  this.getCodeTxt = '获取短信效验码'
                  this.count = 60
                  clearInterval(countDown)
                } else {
                  this.codeLoading = true
                  this.getCodeTxt = this.count-- + 's后重发'
                }
              }, 1000)
              break
          }
        })
      }
    },
    // 获取短信验证码
    getNewCode () {
      if (this.$cookies.get('newCodeTime')) {
        this.$Message.error({
          content: '短信已经发送请勿在一分钟内重复点击',
          duration: 4,
          closable: true
        })
      } else {
        this.newCodeLoading = true
        putPhone(this.newCode.phone).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              this.newCodeLoading = false
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              this.newCodeLoading = false
              break
            default:
              this.$Message.success(res.data.msgContent)
              this.$cookies.set('newCodeTime', 'true', '1min')
              var countDown = setInterval(() => {
                if (this.count < 1) {
                  this.newCodeLoading = false
                  this.getNewCodeTxt = '获取短信效验码'
                  this.count = 60
                  clearInterval(countDown)
                } else {
                  this.newCodeLoading = true
                  this.getNewCodeTxt = this.count-- + 's后重发'
                }
              }, 1000)
              break
          }
        })
      }
    }
  },
  activated () {
    getInfo().then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.userInfo = res.data.msgData
          break
      }
    })
  }
}
</script>

<style lang="less" scoped>
.safetySetting {
  display: flex;
  align-items: center;
  .userInfo {
    height: 100px;
    color: #515a6e;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 40px;
  }
}
.avatar {
  height: 100px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}
.changePhone {
  p {
    font-size: 14px;
  }
}
.changePhoneTtile {
  border-bottom: 1px solid #dddddd;
  margin-bottom: 20px;
}
</style>

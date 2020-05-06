<template>
  <div>
    <card class="item-card" :bordered="false" v-if="recentItem.length != 0">
      <p class="item-title">
        最近使用
        <span>
          <router-link to="/console/NewProject" slot="extra">
            <Button type="primary" style="marginRight:10px">新建项目</Button>
          </router-link>
          <Button slot="extra" @click="modal1=true">受邀加入项目</Button>
        </span>
      </p>
      <p>
        <Tag
          class="item"
          v-for="item in recentItem"
          :key="item.id"
          :name="item.id"
          @click.native="itemClick(item.id,item.projectCategoryId,item.name)"
        >
          <Icon type="ios-apps" :size="16" class="icon" />
          {{item.name}}
        </Tag>
      </p>
      <p v-if="ifhave">
        <span>最近未使用过项目</span>
      </p>
    </card>
    <card :bordered="false" v-if="recentItem.length != 0">
      <p class="item-title" style="margin-bottom: 10px;">
        发现同事
        <span>（你有项目部同事正在本平台工作）</span>
      </p>
      <div class="colleague">
        <Icon type="ios-contact" :size="70" />
        <div>
          <p class="colleagueName">王家梁</p>
          <p>138****1234</p>
        </div>
      </div>
    </card>
    <card class="navpage" v-if="recentItemHave" :bordered="false" dis-hover>
      <div class="addnav">
        <img src="@/assets/images/nav.png" class="navimg" />
        <div class="navclass">
          <p>你还没有参与任何项目，可以：</p>
          <div>
            <router-link to="/console/NewProject">
              <Button type="primary">新建项目</Button>
            </router-link>
            <i-button @click="modal1=true">受邀加入项目</i-button>
          </div>
        </div>
      </div>
      <Alert show-icon class="alert">
        新建项目
        <template slot="desc">
          创建新的项目，准确填写项目信息后，系统根据项目信息自动联接
          项目部的同事组建项目团队，实现项目协作；
        </template>
      </Alert>
      <Alert show-icon class="alert">
        受邀加入项目
        <template slot="desc">填写项目邀请码，直接加入项目团队，实现项目协作；</template>
      </Alert>
    </card>
    <Modal v-model="modal1" title="受邀加入项目" @on-ok="ok" @on-cancel="cancel">
      <Form :model="formItem" ref="formItem" :label-width="80" @submit.native.prevent>
        <FormItem label="邀请凭证">
          <Input v-model="formItem.input" placeholder="请输入邀请凭证"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="isInformation" title="项目信息" @on-ok="addProject">
      <Form
        class="formItem"
        ref="information"
        @on-ok="addProject "
        @on-cancel="cancel"
        inline
        :model="information"
        :label-width="100"
      >
        <FormItem label="项目名称" class="bottom20">
          <Input v-model="information.name" :maxlength="50" placeholder="用于项目正式资料的标题显示" disabled></Input>
        </FormItem>
        <FormItem label="项目类型" class="bottom20">
          <Select v-model="information.projectCategoryId" disabled>
            <Option v-for="item in projectType" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="施工单位" class="bottom20">
          <Input
            v-model="information.constructCompany"
            :maxlength="40"
            placeholder="请填写合同施工单位"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="地域位置" class="location">
          <Select
            disabled
            v-model="information.province"
            placeholder="省份"
            @on-change="changeProvince"
            style="width:90px"
            placement="bottom"
          >
            <Option v-for="item in provinceArr" :key="item.id" :value="item.name">{{ item.name }}</Option>
          </Select>
          <Select
            disabled
            v-model="information.city"
            placeholder="城市"
            @on-change="changeCity"
            style="width:90px;margin-left: 40px;"
            placement="bottom"
          >
            <Option v-for="item in citiesArr" :key="item.id" :value="item.name">{{ item.name }}</Option>
          </Select>
          <Select
            disabled
            v-model="information.county"
            placeholder="区县"
            style="width:90px;margin-left: 40px;"
            placement="bottom"
          >
            <Option v-for="item in countyArr" :key="item.id" :value="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="标段号" class="bottom20">
          <Input
            v-model="information.contractTender"
            :maxlength="15"
            placeholder="请填写合同标段"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="部门" class="bottom20">
          <Input v-model="information.deptName" :maxlength="15" placeholder="请填写合同标段" disabled></Input>
        </FormItem>
        <FormItem label="岗位" class="bottom20">
          <Input v-model="information.jobName" :maxlength="15" placeholder="请填写合同标段" disabled></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { mainList } from '@/api/routers'
import { isDataSuccess, getToken } from '@/libs/util'
import { recentItem, joinItem, inviteItem, getMessages } from '@/api/console/consoleHome'
import {
  getCategoriesData
} from '@/api/basicSetting/itemInformation'
import {
  getprovinces,
  getcitys,
  getareas,
  newProject,
  gotoitem
} from '@/api/console/newProject'
export default {
  data () {
    return {
      project: '', // 项目id
      deptName: '', // 项目id
      jobName: '', // 项目id
      recentItem: '', // 最近项目
      ifhave: true,
      recentItemHave: false,
      modal1: false, // 弹出框
      isInformation: false,
      formItem: {
        input: ''
      },
      information: {
        name: '', // 项目名称
        projectCategoryId: '', // 项目类型
        constructCompany: '', // 施工单位
        contractTender: '', // 合同标段
        province: '', // 省份
        city: '', // 市
        deptName: '', // 市
        jobName: '',
        county: ''
      },
      provinceArr: [], // 省份
      provinceArrId: '', // 省份
      citiesArr: [], // 城市
      citiesArrId: '',
      countyArr: [], // 区县
      projectType: [], // 所有类型
      buttonSize: 'large', // 按钮大小
      code: '',
      invitor: ''
    }
  },
  created () {
    this.getRecent()
  },
  methods: {
    itemClick (id, type, name) {
      let token = getToken()
      if (token) {
        localStorage.setItem('itemName', name)
        localStorage.setItem('tagNaveList', '[{"name":"home","params":{},"query":{},"meta":{"hideInMenu":true,"title":"首页","notCache":true,"icon":"md-home"}}]')
        this.$store.state.app.projectId = {
          id: id,
          type: type
        }
        localStorage.setItem(
          'projectId',
          JSON.stringify(this.$store.state.app.projectId)
        )
        getMessages(id).then(res => {
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
                localStorage.setItem('Notice', 'false')
              } else {
                localStorage.setItem('Notice', 'true')
              }
              break
          }
        })
        this.$store.dispatch('getMenuData')
        const tempPage = window.open('', '_blank')
        mainList(id).then(res => {
          if (res.data.msgData === null) {
            let routeData = this.$router.resolve({
              name: 'home'
            })
            tempPage.location = routeData.href
          } else {
            let routeData = this.$router.resolve({
              name: 'home'
            })
            tempPage.location = routeData.href
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
    // 加入项目弹出框确定
    ok () {
      joinItem(this.formItem.input).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            this.formItem.input = ''
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            this.formItem.input = ''
            break
          default:
            this.isInformation = true
            this.project = res.data.msgData.project
            this.deptName = res.data.msgData.deptName
            this.jobName = res.data.msgData.jobName
            this.invitor = res.data.msgData.invitor
            this.code = this.formItem.input
            this.getprovincesData()
            this.formItem.input = ''
            break
        }
      })
    },
    // 点击确定按钮
    addProject () {
      let data = {
        name: this.information.name,
        constructCompany: this.information.constructCompany,
        projectCategoryId: this.information.projectCategoryId,
        contractTender: this.information.contractTender,
        addressProvince: this.information.province,
        addressCity: this.information.city,
        addressArea: this.information.county,
        deptName: [this.information.deptName],
        jobName: [this.information.jobName]
      }

      inviteItem(this.code, this.invitor, data).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            if (res.data.msgContent === '你已被此项目加入黑名单') {
              this.$Message.error('你已被此项目加入黑名单')
            } else {
              const tempPage = window.open('', '_blank')
              this.$Message.success('新建项目成功！')
              this.$store.state.app.menuRspList = []
              this.$store.state.app.projectId = {
                id: res.data.msgData,
                type: this.formItem.type
              }
              localStorage.setItem(
                'projectId',
                JSON.stringify(this.$store.state.app.projectId)
              )
              gotoitem(res.data.msgData).then(res => {
                this.getRecent()
              })
              localStorage.setItem('tagNaveList', '[{"name":"home","params":{},"query":{},"meta":{"hideInMenu":true,"title":"首页","notCache":true,"icon":"md-home"}}]')
              let routeData = this.$router.resolve({
                name: 'home'
              })
              tempPage.location = routeData.href
              this.formItem.input = ''
              this.invitor = ''
              this.code = ''
            }
            break
        }
      })
    },
    // 点击取消按钮
    cancel () {
      this.formItem.input = ''
      this.invitor = ''
      this.code = ''
    },
    // 获取类型
    getCategories () {
      getCategoriesData().then(res => {
        if (res.status === 200) {
          const data = res.data
          if (data.msgCode === 0) {
            this.projectType = data.msgData
          } else {
            this.$Message.error(data.msgContent)
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },
    // 数据回显
    getInformation () {
      this.$Spin.hide()
      this.information.name = this.project.name // 项目名称
      this.information.projectCategoryId = this.project.projectCategoryId // 项目类型
      this.information.constructCompany = this.project.constructCompany // 施工单位
      this.information.deptName = this.deptName // 合同标段
      this.information.jobName = this.jobName // 合同标段
      this.information.contractTender = this.project.contractTender // 合同标段
      // 获取省份回显
      this.provinceArr.forEach(v => {
        if (v.name === this.project.addressProvince) {
          this.information.province = this.project.addressProvince
          this.provinceArrId = v.id
        }
      })
      // 获取市回显
      getcitys(this.provinceArrId).then(res => {
        this.citiesArr = res.data.msgData
        this.information.city = this.project.addressCity
        this.citiesArr.forEach(i => {
          if (i.name === this.project.addressCity) {
            this.citiesArrId = i.id
            // 获取区回显
            getareas(this.citiesArrId).then(res => {
              this.countyArr = res.data.msgData
              this.information.county = this.project.addressArea
            })
          }
        })
      })
    },

    // 三级联动 - 省份--城市
    changeProvince () {
      this.citiesArr = []
      this.countyArr = []
      this.information.city = ''
      this.information.county = ''
      let provinceId = this.information.province
      let SpecialArea = [1, 2, 3, 4, 32, 33, 34] // 直辖市id
      // 判断是非为直辖市
      let newarr = this.provinceArr.filter(item => {
        return item.name == provinceId
      })
      provinceId = newarr[0].id

      if (SpecialArea.indexOf(provinceId) == -1) {
        getcitys(provinceId).then(res => {
          this.citiesArr = res.data.msgData
        })
      } else {
        this.citiesArr = this.provinceArr.filter(item => item.id == provinceId)
        getcitys(provinceId).then(res => {
          this.countyArr = res.data.msgData
        })
      }
    },
    // 三级联动 - 城市--区县
    changeCity () {
      let newarr = this.citiesArr.filter(item => {
        return item.name === this.information.city
      })
      let cityId = newarr[0].id
      getareas(cityId).then(res => {
        this.countyArr = res.data.msgData
      })
    },
    // 获取省份
    getprovincesData () {
      getprovinces()
        .then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.provinceArr = data.msgData
            } else {
              this.$Message.error(data.msgContent)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        })
        .then(() => {
          this.getInformation()
        })
    },
    // 获取最近项目
    getRecent () {
      recentItem().then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            let recent = []
            recent.push(res.data.msgData)
            this.recentItem = recent
            if (res.data.msgData != null) {
              this.recentItemHave = false
            } else {
              this.recentItemHave = true
              this.recentItem = []
            }
            this.ifhave = false
            break
        }
      })
    }
  },
  mounted () {
    this.getCategories()
    this.$Notice.destroy()
  },
  activated () {
    this.getRecent()
  }
}
</script>

<style lang='less' scoped>
.item-card {
  margin-bottom: 40px;

  .item-title {
    display: flex;
    height: 30px;
    font-size: 16px;
    font-weight: 400;
    color: #657180;
  }

  .item {
    margin-left: 40px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    overflow: hidden;
    padding: 0 10px;
    width: 440px;
    color: #657180;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 24px;
  }

  .item:hover {
    background-color: #f2f2f2;
    cursor: pointer;
  }
}

.icon {
  width: 20px;
  height: 20px;
}

.item-title {
  justify-content: space-between;
  height: 30px;
  font-weight: bold;
  font-size: 16px;
  font-weight: 400;
  color: #657180;
}

// 同事
.colleague {
  margin-left: 30px;
  width: 170px;
  padding: 0 6px;
  display: inline-block;
  background-color: #f2f2f2;
  height: 70px;
  color: #657180;
  i {
    margin-bottom: 22px;
  }

  div {
    height: 50px;
    display: inline-block;
  }

  .colleagueName {
    margin-bottom: 6px;
  }
}

// 项目信息弹框
.center {
  text-align: center;
}

h4 {
  padding: 10px 0 20px 0px;
}

.formItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.formItem .bottom20 {
  width: 450px;
}

.right10 {
  margin-right: 10px;
}

.button_sty {
  padding: 6px 30px 6px 30px !important;
}

.bottom20 {
  text-align: left;
  margin-bottom: 20px;
}

//导航页
.navpage {
  .addnav {
    width: 60%;
    margin: 0 auto;
  }

  .alert {
    width: 50%;
    margin: 15px auto;
    height: 100px;
  }

  .navimg {
    width: 200px;
    display: inline-block;
  }

  .navclass {
    position: relative;
    top: -30px;
    margin-left: 20px;
    display: inline-block;
    margin-top: 30px;

    p {
      font-size: 16px;
    }

    div {
      margin-left: 30px;
      margin-top: 20px;

      button {
        margin-right: 20px;
      }
    }
  }
}
</style>

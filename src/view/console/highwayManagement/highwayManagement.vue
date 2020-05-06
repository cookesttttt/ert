<template>
  <div>
    <card class="item-card"
          :bordered="false">
      <p class="item-title">
        在建项目
        <span>
          <router-link to="/console/NewProject">
            <Button type="primary">新建项目</Button>
          </router-link>
          <Button slot="extra"
                  @click="modal2=true"
                  style="marginRight:0">受邀加入项目</Button>
        </span>
      </p>
      <br />
      <p class="box">
        <Tag class="item"
             v-for="item in cities"
             :key="item.id"
             :name="item.id"
             closable
             @on-close="removeclass(item.id)"
             @click.native="itemClick(item.id,item.projectCategoryId,item.teamId,item.name)">
          <span>
            <Icon type="ios-apps"
                  :size="16"
                  class="icon" />
            {{item.name}}
          </span>
        </Tag>
      </p>
    </card>
    <card :bordered="false">
      <p class="item-title">已竣工项目</p>
    </card>
    <Modal v-model="modal1"
           title="退出项目"
           @on-ok="ok">
      <p>当项目部所有成员退出后，项目数据将自动删除无法恢复</p>
    </Modal>
    <Modal v-model="modal2"
           title="受邀加入项目"
           @on-ok="yes"
           @on-cancel="cancel">
      <Form :model="formItem"
            :label-width="80"
            @submit.native.prevent>
        <FormItem label="邀请凭证">
          <Input v-model="formItem.input"
                 placeholder="请输入邀请凭证"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="isInformation"
           title="项目信息"
           @on-ok="addProject">
      <Form class="formItem"
            ref="information"
            @on-ok="addProject "
            @on-cancel="cancel"
            inline
            :model="information"
            :label-width="100">
        <FormItem label="项目名称"
                  class="bottom20">
          <Input v-model="information.name"
                 :maxlength="50"
                 placeholder="用于项目正式资料的标题显示"
                 disabled></Input>
        </FormItem>
        <FormItem label="项目类型"
                  class="bottom20">
          <Select v-model="information.projectCategoryId"
                  disabled>
            <Option v-for="item in projectType"
                    :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="施工单位"
                  class="bottom20">
          <Input v-model="information.constructCompany"
                 :maxlength="40"
                 placeholder="请填写合同施工单位"
                 disabled></Input>
        </FormItem>
        <FormItem label="地域位置"
                  class="location">
          <Select disabled
                  v-model="information.province"
                  placeholder="省份"
                  @on-change="changeProvince"
                  style="width:90px"
                  placement="bottom">
            <Option v-for="item in provinceArr"
                    :key="item.id"
                    :value="item.name">{{ item.name }}</Option>
          </Select>
          <Select disabled
                  v-model="information.city"
                  placeholder="城市"
                  @on-change="changeCity"
                  style="width:90px;margin-left: 40px;"
                  placement="bottom">
            <Option v-for="item in citiesArr"
                    :key="item.id"
                    :value="item.name">{{ item.name }}</Option>
          </Select>
          <Select disabled
                  v-model="information.county"
                  placeholder="区县"
                  style="width:90px;margin-left: 40px;"
                  placement="bottom">
            <Option v-for="item in countyArr"
                    :key="item.id"
                    :value="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="标段号"
                  class="bottom20">
          <Input v-model="information.contractTender"
                 :maxlength="15"
                 placeholder="请填写合同标段"
                 disabled></Input>
        </FormItem>
        <FormItem label="部门"
                  class="bottom20">
          <Input v-model="information.deptName"
                 :maxlength="15"
                 placeholder="请填写合同标段"
                 disabled></Input>
        </FormItem>
        <FormItem label="岗位"
                  class="bottom20">
          <Input v-model="information.jobName"
                 :maxlength="15"
                 placeholder="请填写合同标段"
                 disabled></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { mainList } from '@/api/routers'
import { isDataSuccess, getToken } from '@/libs/util'
import {
  getprovinces,
  getcitys,
  getareas
} from '@/api/console/newProject'
import {
  AllItem,
  deleteItem,
  gotoitem
} from '@/api/console/highwayManagement'
import { joinItem, inviteItem, getMessages } from '@/api/console/consoleHome'

export default {
  data () {
    return {
      checkboxGroup1: [],
      cities: [],
      modal1: false,
      modal2: false,
      isInformation: false,
      id: '', // 要删除的id
      deptName: '', // 要删除的id
      project: '', // 要删除的id
      jobName: '', // 要删除的id
      formItem: {
        input: ''
      },
      information: {
        name: '', // 项目名称
        shortName: '', // 项目简称
        number: '', // 项目编号
        projectCategoryId: '', // 项目类型
        projectOwner: '', // 建设单位
        constructCompany: '', // 施工单位
        supervisionUnit: '', // 监理单位
        contractTender: '', // 合同标段
        province: '', // 省份
        city: '', // 市
        county: '' // 区
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
  methods: {
    // 进入项目
    itemClick (id, type, teamId, name) {
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
    // 弹出弹出框
    removeclass (id) {
      this.modal1 = true
      this.id = id
    },
    // 获取所有项目
    getallItem () {
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
            this.cities = res.data.msgData
            break
        }
      })
    },
    // 确定删除
    ok () {
      deleteItem(this.id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.getallItem()
            this.$Message.success('退出成功')
            break
        }
      })
    },
    yes () {
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
    // 点击取消按钮
    cancel () {
      this.formItem.input = ''
      this.invitor = ''
      this.code = ''
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
    }
  },
  created () {
    this.getallItem()
    this.$Notice.destroy()
  },
  watch: {
    $route (to, from) {
      if (to.name === '公路工程施工项目管理') {
        this.getallItem()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.item-title {
  display: flex;
  justify-content: space-between;
  height: 30px;
  font-size: 16px;
  font-weight: 400;
  color: #657180;
}

.item-card {
  margin-bottom: 40px;
}

.box {
  display: flex;
  flex-wrap: wrap;
}

// 项目
.item {
  margin-left: 40px;
  height: 40px;
  width: 360px;
  line-height: 40px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #657180;
  .icon {
    margin-bottom: 2px;
  }
  span {
    display: inline-block;
    width: 320px;
    height: 40px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 56px;
  }
}

.item:hover {
  background-color: #f2f2f2;
  cursor: pointer;
}

button {
  margin-right: 10px;
}

.ivu-card-head {
  border-bottom: 0 !important;
}

.ivu-tag-text {
  width: 100px !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>

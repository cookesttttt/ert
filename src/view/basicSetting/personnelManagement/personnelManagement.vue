<template>
  <Card class="left-box center">
    <Button type="primary" @click="isInformation = true">项目信息弹框</Button>
    <Modal v-model="isInformation" title="项目信息">
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
        <FormItem label="项目简称" class="bottom20">
          <Input v-model="information.shortName" :maxlength="50" placeholder="仅用于本系统中界面显示" disabled></Input>
        </FormItem>
        <FormItem label="项目编号" class="bottom20">
          <Input v-model="information.number" :maxlength="15" disabled></Input>
        </FormItem>
        <FormItem label="项目类型" class="bottom20">
          <Select v-model="information.projectCategoryId" disabled>
            <Option v-for="item in projectType" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="建设单位" class="bottom20">
          <Input
            v-model="information.projectOwner"
            :maxlength="40"
            placeholder="请填写合同施工单位"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="监理单位" class="bottom20">
          <Input
            v-model="information.supervisionUnit"
            :maxlength="40"
            placeholder="请填写合同监理单位"
            disabled
          ></Input>
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
        <FormItem label="合同标段" class="bottom20">
          <Input
            v-model="information.contractTender"
            :maxlength="15"
            placeholder="请填写合同标段"
            disabled
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>
<script>
import {
  getCategoriesData,
  getInformationData,
  submitInformation
} from '@/api/basicSetting/itemInformation'
import { getprovinces, getcitys, getareas } from '@/api/console/newProject'
import './index.less'
export default {
  name: 'personnelManagement',
  data () {
    return {
      isInformation: false,
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
      buttonSize: 'large' // 按钮大小

    }
  },

  methods: {
    // 点击确定按钮
    addProject () {

    },
    // 点击取消按钮
    cancel () {

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
      getInformationData(JSON.parse(localStorage.getItem('projectId')).id).then(
        res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.$Spin.hide()
              console.log(data.msgData)
              this.information.name = data.msgData.name // 项目名称
              this.information.shortName = data.msgData.shortName // 项目简称
              this.information.number = data.msgData.projectNumber // 项目编号
              this.information.projectCategoryId =
                data.msgData.projectCategoryId // 项目类型
              this.information.constructCompany = data.msgData.constructCompany // 施工单位
              this.information.supervisionUnit = data.msgData.supervisionUnit // 监理单位
              this.information.contractTender = data.msgData.contractTender // 合同标段
              this.information.projectOwner = data.msgData.projectOwner // 建设单位
              // 获取省份回显
              this.provinceArr.forEach(v => {
                if (v.name === data.msgData.addressProvince) {
                  this.information.province = data.msgData.addressProvince
                  this.provinceArrId = v.id
                }
              })
              // 获取市回显
              getcitys(this.provinceArrId).then(res => {
                this.citiesArr = res.data.msgData
                this.information.city = data.msgData.addressCity
                this.citiesArr.forEach(i => {
                  if (i.name === data.msgData.addressCity) {
                    this.citiesArrId = i.id
                    // 获取区回显
                    getareas(this.citiesArrId).then(res => {
                      this.countyArr = res.data.msgData
                      this.information.county = data.msgData.addressArea
                    })
                  }
                })
              })
            } else {
              this.$Message.error(data.msgContent)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        }
      )
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
      getprovinces().then(res => {
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
      }).then(() => {
        this.getInformation()
      })
    }
  },
  mounted () {
    this.$Spin.show()
    this.getCategories() // 获取类型
  },
  created () {
    this.getprovincesData() // 获取省份
  }
}
</script>

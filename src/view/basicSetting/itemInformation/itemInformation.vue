<template>
  <Card class="bigbox">
    <Tabs size="default">
      <TabPane label="项目信息"
               class="center">
        <h3>项目信息</h3>
        <Form class="formItem"
              ref="information"
              inline
              :model="information"
              :label-width="100"
              :rules="rules">
          <FormItem label="项目名称"
                    prop="name"
                    class="bottom20">
            <Input v-model="information.name"
                   :maxlength="50"
                   placeholder="用于项目正式资料的标题显示"
                   disabled></Input>
          </FormItem>
          <FormItem label="项目类型"
                    prop="projectCategoryId"
                    class="bottom20">
            <Select v-model="information.projectCategoryId"
                    disabled>
              <Option v-for="item in projectType"
                      :value="item.id"
                      :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="施工单位"
                    prop="constructCompany"
                    class="bottom20">
            <Input v-model="information.constructCompany"
                   :maxlength="40"
                   placeholder="请填写合同施工单位"
                   readonly
                   disabled></Input>
          </FormItem>
          <FormItem label="标段号"
                    prop="contractTender"
                    class="bottom20">
            <Input v-model="information.contractTender"
                   placeholder="请选择标段号"
                   style="width: 350px"
                   disabled />
          </FormItem>
          <FormItem prop="province"
                    label="项目部地域位置"
                    class="location">
            <Select v-model="information.province"
                    placeholder="省份"
                    @on-change="changeProvince"
                    style="width:90px"
                    placement="bottom"
                    disabled>
              <Option v-for="item in provinceArr"
                      :key="item.id"
                      :value="item.name">{{ item.name }}</Option>
            </Select>
            <Select v-model="information.city"
                    placeholder="城市"
                    @on-change="changeCity"
                    style="width:90px;margin-left: 40px;"
                    placement="bottom"
                    disabled>
              <Option v-for="item in citiesArr"
                      :key="item.id"
                      :value="item.name">{{ item.name }}</Option>
            </Select>
            <Select v-model="information.county"
                    placeholder="区县"
                    style="width:90px;margin-left: 40px;"
                    placement="bottom"
                    disabled>
              <Option v-for="item in countyArr"
                      :key="item.id"
                      :value="item.name">{{ item.name }}</Option>
            </Select>
          </FormItem>

          <br />
          <br />
        </Form>
      </TabPane>
      <TabPane label="参建单位"
               class="center">
        <h3>参建单位</h3>
        <Form :model="contractors"
              :label-width="100"
              style="width:80%;margin:0 auto"
              :rules="contractorsRules"
              ref="contractors">
          <Row>
            <Col span="11">
            <FormItem label="建设单位名称"
                      prop="constructCompany">
              <Input v-model="contractors.constructCompany"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            <FormItem label="联系方式"
                      prop="constructPhone">
              <Input v-model="contractors.constructPhone"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="代建单位名称"
                      prop="agentUnit">
              <Input v-model="contractors.agentUnit"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            <FormItem label="联系方式"
                      prop="agentPhone">
              <Input v-model="contractors.agentPhone"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="监理单位"
                      prop="supervisionUnit">
              <Input v-model="contractors.supervisionUnit"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            <FormItem label="联系方式"
                      prop="supervisionPhone">
              <Input v-model="contractors.supervisionPhone"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="施工单位名称"
                      prop="consUnit">
              <Input v-model="contractors.consUnit"
                     disabled
                     style="width:100%"></Input>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            <FormItem label="联系方式"
                      prop="consPhone">
              <Input v-model="contractors.consPhone"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
          </Row>
          <ButtonGroup>
            <Button type="primary"
                    @click="contractorsSubmit">保存</Button>
            <Button @click="handleReset">取消</Button>
          </ButtonGroup>
        </Form>
      </TabPane>
      <TabPane label="合同信息"
               class="center">
        <h3>合同信息</h3>
        <Form :model="contractInformation"
              :label-width="100"
              style="width:80%;margin:0 auto"
              :rules="contractRules"
              ref="contractInformation">
          <Row>
            <Col span="11">
            <FormItem label="合同开始日期"
                      prop="startDate">
              <DatePicker type="date"
                          placeholder="请选择"
                          v-model="contractInformation.startDate"
                          style="width:100%"
                          transfer></DatePicker>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            <FormItem label="合同结束日期"
                      prop="endDate">
              <DatePicker type="date"
                          placeholder="请选择"
                          v-model="contractInformation.endDate"
                          style="width:100%"
                          transfer></DatePicker>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="合同编号"
                      prop="projectNumber">
              <Input v-model="contractInformation.projectNumber"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            <FormItem label="合同工期"
                      prop="projectTime">
              <Input v-model="contractInformation.projectTime"
                     type="number"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="11">
            <FormItem label="工程造价(元)"
                      prop="projectCost">
              <Input v-model="contractInformation.projectCost"
                     type="number"
                     style="width:100%"></Input>
            </FormItem>
            </Col>
            <Col span="2"
                 style="text-align: center">&nbsp;</Col>
            <Col span="11">
            &nbsp;
            </Col>
          </Row>
          <ButtonGroup>
            <Button type="primary"
                    @click="contractSubmit">保存</Button>
            <Button @click="handleReset">取消</Button>
          </ButtonGroup>
        </Form>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import {
  getCategoriesData,
  getInformationData,
  submitInformation,
  submitContractInformation,
  getContractInformation,
  getContractorsInformation,
  saveContractorsInformation
} from '@/api/basicSetting/itemInformation'
import { getprovinces, getcitys, getareas } from '@/api/console/newProject'
import procedure from '@/components/procedure/procedure'
import './index.less'
import { isDataSuccess, formatTime } from '@/libs/util'
export default {
  name: 'itemInformation',
  components: {
    procedure
  },
  data () {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else if (!/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(value)) {
        callback('手机号格式不正确')
      } else {
        callback()
      }
    }
    return {
      information: {
        contract: '', // 合同信息
        spinShow: true, // loading是否开启
        name: '', // 项目名称
        constructCompany: '', // 施工单位
        projectCategoryId: '', // 项目类型
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
      contractors: { // 参见单位
        constructCompany: '',
        constructPhone: '',
        agentUnit: '',
        agentPhone: '',
        supervisionUnit: '',
        supervisionPhone: '',
        consUnit: '',
        consPhone: ''
      },
      projectType: [], // 所有类型
      buttonSize: 'large', // 按钮大小
      procedureData: ['续费管理的萨达', '设置', '待处理事件', '权益配额'],
      rules: {
        name: [
          // 项目名称非空验证
          {
            required: true,
            message: '请填写项目名称',
            trigger: 'blur'
          }
        ],
        constructCompany: [
          // 施工单位非空验证
          {
            required: true,
            message: '请填写施工单位',
            trigger: 'blur'
          }
        ],
        projectCategoryId: [
          // 项目类型非空验证
          {
            required: true,
            message: '选择项目类型',
            trigger: 'change',
            type: 'number'
          }
        ],
        contractTender: [
          // 合同标段非空验证
          {
            required: true,
            message: '请选择标段号',
            trigger: 'change',
            type: 'string'
          }
        ]
      },
      // 合同信息
      contractInformation: {
        startDate: '',
        endtDate: '',
        projectNumber: '',
        projectTime: '',
        projectCost: ''
      },
      // 合同信息 表单验证
      contractRules: {
        startDate: [
          { required: true, type: 'date', message: '请选择合同开始时间', trigger: 'change' }
        ],
        endDate: [
          { required: true, type: 'date', message: '请选择合同结束时间', trigger: 'change' }
        ],
        projectNumber: [
          { required: true, message: '请填写合同编号', trigger: 'blur' }
        ],
        projectTime: [
          { required: true, message: '请填写合同工期', trigger: 'blur' }
        ],
        projectCost: [
          { required: true, message: '请填写工程造价', trigger: 'blur' }
        ]
      },
      // 参建单位 表单验证
      contractorsRules: {
        agentPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        agentUnit: [
          { required: true, message: '请填写代建单位名称', trigger: 'blur' }
        ],
        consPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        constructCompany: [
          { required: true, message: '请填写建设单位名称', trigger: 'blur' }
        ],
        constructPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        supervisionPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        supervisionUnit: [
          { required: true, message: '请填写监理单位名称', trigger: 'blur' }
        ]
      },
      sectionItem1: [
        { value: '1', lable: '1' },
        { value: '2', lable: '2' },
        { value: '3', lable: '3' },
        { value: '4', lable: '4' },
        { value: '5', lable: '5' },
        { value: '6', lable: '6' },
        { value: '7', lable: '7' },
        { value: '8', lable: '8' },
        { value: '9', lable: '9' },
        { value: '10', lable: '10' },
        { value: '11', lable: '11' },
        { value: '12', lable: '12' },
        { value: '13', lable: '13' },
        { value: '14', lable: '14' },
        { value: '15', lable: '15' },
        { value: '16', lable: '16' },
        { value: '17', lable: '17' },
        { value: '18', lable: '18' },
        { value: '19', lable: '19' },
        { value: '20', lable: '20' },
        { value: '21', lable: '21' },
        { value: '22', lable: '22' },
        { value: '23', lable: '23' },
        { value: '24', lable: '24' },
        { value: '25', lable: '25' },
        { value: '26', lable: '26' }
      ],
      sectionItem2: [
        { value: 'A', lable: 'A' },
        { value: 'B', lable: 'B' },
        { value: 'C', lable: 'C' },
        { value: 'D', lable: 'D' },
        { value: 'E', lable: 'E' },
        { value: 'F', lable: 'F' },
        { value: 'G', lable: 'G' },
        { value: 'H', lable: 'H' },
        { value: 'I', lable: 'I' },
        { value: 'J', lable: 'J' },
        { value: 'K', lable: 'K' },
        { value: 'L', lable: 'L' },
        { value: 'M', lable: 'M' },
        { value: 'N', lable: 'N' },
        { value: 'O', lable: 'O' },
        { value: 'P', lable: 'P' },
        { value: 'Q', lable: 'Q' },
        { value: 'R', lable: 'R' },
        { value: 'S', lable: 'S' },
        { value: 'T', lable: 'T' },
        { value: 'U', lable: 'U' },
        { value: 'V', lable: 'V' },
        { value: 'W', lable: 'W' },
        { value: 'X', lable: 'X' },
        { value: 'Y', lable: 'Y' },
        { value: 'Z', lable: 'Z' }
      ],
      sectionItem3: [
        { value: 'I', lable: 'I' },
        { value: 'II', lable: 'II' },
        { value: 'III', lable: 'III' },
        { value: 'IV', lable: 'IV' },
        { value: 'V', lable: 'V' },
        { value: 'VI', lable: 'VI' },
        { value: 'VII', lable: 'VII' },
        { value: 'VIII', lable: 'VIII' },
        { value: 'IX', lable: 'IX' },
        { value: 'X', lable: 'X' },
        { value: 'XI', lable: 'XI' },
        { value: 'XII', lable: 'XII' },
        { value: 'XIII', lable: 'XIII' },
        { value: 'XIV', lable: 'XIV' },
        { value: 'XV', lable: 'XV' },
        { value: 'XVI', lable: 'XVI' },
        { value: 'XVII', lable: 'XVII' },
        { value: 'XVIII', lable: 'XVIII' },
        { value: 'XIX', lable: 'XIX' },
        { value: 'XX', lable: 'XX' },
        { value: 'XXI', lable: 'XXI' },
        { value: 'XXII', lable: 'XXII' },
        { value: 'XXIII', lable: 'XXIII' },
        { value: 'XXIV', lable: 'XXIV' },
        { value: 'XXV', lable: 'XXV' },
        { value: 'XXVI', lable: 'XXVI' }
      ]
    }
  },

  methods: {
    // 点击取消按钮
    handleReset () {
      // this.$refs.information.resetFields()
    },
    // 参建单位提交
    contractorsSubmit () {
      this.$refs.contractors.validate(valid => {
        console.log(valid)
        if (valid) {
          let data = {
            agentPhone: this.contractors.agentPhone,
            agentUnit: this.contractors.agentUnit,
            consPhone: this.contractors.consPhone,
            constructCompany: this.contractors.constructCompany,
            constructPhone: this.contractors.constructPhone,
            supervisionPhone: this.contractors.supervisionPhone,
            supervisionUnit: this.contractors.supervisionUnit,
            id: this.contractors.id
          }
          saveContractorsInformation(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
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
                break
            }
          })
        }
      })
    },
    // 获取类型
    getCategories () {
      getCategoriesData().then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.projectType = res.data.msgData
        }
      })
    },
    getInformation () {
      getInformationData(JSON.parse(localStorage.getItem('projectId')).id).then(
        res => {
          if (res.status === 200) {
            this.$Spin.show()
            const data = res.data
            if (data.msgCode === 0) {
              const res = data.msgData
              this.information.name = res.name // 项目名称
              this.information.projectCategoryId = res.projectCategoryId // 项目类型
              this.information.constructCompany = res.constructCompany // 施工单位
              this.information.contractTender = res.contractTender // 合同标段
              this.provinceArr.forEach(v => {
                if (v.name === res.addressProvince) {
                  this.information.province = res.addressProvince
                  this.provinceArrId = v.id
                }
              })
              getcitys(this.provinceArrId).then(res => {
                this.citiesArr = res.data.msgData
                this.information.city = data.msgData.addressCity
                this.citiesArr.forEach(i => {
                  if (i.name === data.msgData.addressCity) {
                    this.citiesArrId = i.id
                    getareas(this.citiesArrId).then(res => {
                      this.countyArr = res.data.msgData
                      this.information.county = data.msgData.addressArea
                    })
                  }
                })
              })
              this.$Spin.hide()
            } else {
              this.$Message.error(data.msgContent)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        }
      )
    },
    // 合同信息保存
    contractSubmit () {
      this.$refs.contractInformation.validate(valid => {
        if (valid) {
          let data = {
            endContract: new Date(formatTime(this.contractInformation.endDate)).getTime(),
            startContract: new Date(formatTime(this.contractInformation.startDate)).getTime(),
            projectNumber: this.contractInformation.projectNumber,
            projectTime: this.contractInformation.projectTime,
            projectCost: this.contractInformation.projectCost,
            id: this.contract.id
          }
          if (this.contract) {
            data.id = this.contract.id
          }
          submitContractInformation(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
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
                break
            }
          })
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
        this.getCategories() // 获取类型
        this.getInformation()
      }
      )
    },
    DropdownClick (name) {
      this.information.contractTender = name
    }
  },
  mounted () {
    this.getprovincesData() // 获取省份
  },
  created () {
    getContractInformation(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.contract = res.data.msgData
          console.log(res.data.msgData)
          if (this.contract) {
            this.contractInformation.startDate = this.contract.startContract
            this.contractInformation.endDate = this.contract.endContract
            this.contractInformation.projectNumber = this.contract.projectNumber
            this.contractInformation.projectTime = this.contract.projectTime + ''
            this.contractInformation.projectCost = this.contract.projectCost + ''
          } else {
            this.contractInformation.startDate = ''
            this.contractInformation.endDate = ''
          }
          break
      }
    })
    getContractorsInformation(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.contractors = res.data.msgData
          break
      }
    })
  }
}
</script>
<style lang='less' scoped>
.bigbox {
  height: 100%;
}
</style>

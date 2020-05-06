<template>
  <Card style="height: 100%">
    <div class="bottom15">
      <Button  class="search-btn" type="primary" @click="registrationClick" >&nbsp;新建保险记录</Button>
      <Modal
        class-name="vertical-center-modal"
        title="新建保险登记信息"
        v-model="isAddModal5"
        :mask-closable="false"
        @on-cancel="cancel5(1)">
        <Form
          ref="insuranceData"
          :model="insuranceData"
          :label-width="100" inline :rules="rules5">
          <FormItem label="车牌号码" prop="vehicleName">
            <AutoComplete
              v-model="insuranceData.vehicleName"
              :data="allNumber"
              :filter-method="filterMethod"
              placeholder="输入关键字查询车辆"
              class="width350" >
            </AutoComplete>
          </FormItem>
          <br>
          <FormItem label="保险日期" prop="dated">
            <DatePicker v-model="insuranceData.dated" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
          </FormItem>
          <br>
          <FormItem label="保险公司" prop="insurer">
            <Input v-model="insuranceData.insurer" class="width350" :maxlength="15"></Input>
          </FormItem>
          <FormItem label="经办人" prop="operator">
            <Input v-model="insuranceData.operator" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="保险项目" prop="coverage">
            <Input v-model="insuranceData.coverage" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          <br>
          <FormItem label="保险费用" prop="insuranceCharges">
            <Input v-model="insuranceData.insuranceCharges" class="width350" :maxlength="12"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"   size="large"  @click="cancel5(1)">取消</Button>
          <Button type="primary" size="large" @click="addInsurance">保存</Button>
        </div>
      </Modal>
      <!--收搜-->
      <div class="right" style="float: right">
        <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue5"></Input>
        <Button class="search-btn" type="primary" @click="searchInsurance">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>

    </div>
    <div class="clear"></div>
    <!--表格-->
    <Table
      border
      :columns="columns5"
      :data="tableData5">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <br>
        <Page :total="totalElements5"
              :current="pageNum5"
              show-total
              @on-change="changePage5">
        </Page>
      </div>
    </div>

    <Modal
      class-name="vertical-center-modal"
      title="编辑保险登记信息"
      v-model="isEditModal5"
      :mask-closable="false"
      @on-cancel="cancel5">
      <Form
        ref="editInsuranceData"
        :model="editInsuranceData"
        :label-width="100" inline :rules="rules5">
        <FormItem label="车牌号码" prop="vehicleName">
          <AutoComplete
            v-model="editInsuranceData.vehicleName"
            :data="allNumber"
            :filter-method="filterMethod"
            placeholder="输入关键字查询车辆"
            class="width350" >
          </AutoComplete>
        </FormItem>
        <br>
        <FormItem label="保险日期" prop="dated">
          <DatePicker v-model="editInsuranceData.dated" type="date" class="width350" format='yyyy-MM-dd' ></DatePicker>
        </FormItem>
        <br>
        <FormItem label="保险公司" prop="insurer">
          <Input v-model="editInsuranceData.insurer" class="width350" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="经办人" prop="operator">
          <Input v-model="editInsuranceData.operator" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="保险项目" prop="coverage">
          <Input v-model="editInsuranceData.coverage" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  class="width350"></Input>
        </FormItem>
        <br>
        <FormItem label="保险费用" prop="insuranceCharges">
          <Input v-model="editInsuranceData.insuranceCharges" class="width350" :maxlength="12"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"   size="large"  @click="cancel5">取消</Button>
        <Button type="primary" size="large" @click="editInsurance">保存</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
  /**
   *  paramsValidate 验证是否为空
   *  isDataSuccess 验证数据是否成功
   * */
import { paramsValidate , isDataSuccess , formatTime } from '@/libs/util'
import {
    newInsuranceRegistrationData,
    getAllInsuranceRegistrationData,
    deleteInsuranceRegistrationData,
    getEditInsuranceRegistrationData,
  } from '@/api/cars/insuranceRegistration'
import { getAllNumber } from '@/api/cars/allNumber'
import '../index.less'
export default {
  name: "insuranceRegistration",
  data() {
    return {
      isAddModal5: false,
      isEditModal5: false,
      allNumber: [],                    // 获取所有车牌
      searchValue5: '',                  // 收搜数据
      insuranceData: {                 // 保险登记信息数据
        vehicleName: '',               // 车牌号码
        dated: '',                     // 保险日期
        insurer: '',                  // 保险公司
        operator: '',                 // 经办人
        coverage: '',                // 保险项目
        insuranceCharges: '',        // 保险费用

      },
      editInsuranceData: {              // 编辑保险登记信息数据
        vehicleName: '',               // 车牌号码
        dated: '',                     // 保险日期
        insurer: '',                  // 保险公司
        operator: '',                 // 经办人
        coverage: '',                // 保险项目
        insuranceCharges: '',        // 保险费用
        id: ''
      },
      rules5: {                         // 必填项的验证
        dated: [
          {
            type: 'date',
            required: true,
            message: '请选择保险日期',
            trigger: 'change'
          }
        ],
        insurer: [
          {
            required: true,
            message: '请填写保险公司',
            trigger: 'blur'
          }
        ],
        operator: [
          {
            required: true,
            message: '请填写经办人',
            trigger: 'blur'
          }
        ],
        coverage: [{
          required: true,
          message: '请填写保险项目',
          trigger: 'blur'
        }],
        insuranceCharges: [
          {
            required: true,
            message: '请填写保险费用',
            trigger: 'blur'
          },
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
        ],
      },
        tableData5: [],                    // 表格数据
      pageNum5: 1,                     // 当前页码
      pageSize5: 10,                  // 每页显示多少条
      totalElements5: 0,             // 初始化信息总条数
      columns5: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left',
        },
        {
          type: 'index',
          fixed: 'left',
          width: 50,
          align: 'center'
        },
        {
          title: '车牌号码',
          fixed: 'left',
          width: 100,
          key: 'vehicleNumber',
        },
        {
          title: '保险日期',
          width: 120,
          key: 'insuranceDate',
        },
        {
          title: '保险公司',
            tooltip:true,
          width: 200,
          key: 'insuranceCompany',
        },
        {
          title: '经办人',
          width: 80,
          key: 'transactor'
        },
        {
          title: '保险项目',
            tooltip:true,
          width: 300,
          key: 'insuranceItem'
        },
        {
          title: '保险费用',
          width: 150,
          key: 'insuranceCost'
        },
        {
          title: '操作',
          fixed: 'right',
          width: 130,
          key: 'handle',
          render: (h, params, vm) => {
            return [
              [h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    this.echoData5(params.index)

                  }
                },
                style: {
                  marginRight: '5px'
                }
              }, '编辑')],
              h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '你确定要删除吗?',
                    placement: 'left-end',
                    size: 'small'
                  },
                  on: {
                    'on-ok': () => {
                      this.deleteInsurance(params.index)
                    }
                  }
                },
                [h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                }, '删除')])
            ]
          }
        }
      ],
    }
  },
  methods: {
    registrationClick() {
      this.isAddModal5 = true

    },
    // 获取车牌
    getNumber() {
      // 获取车牌
      getAllNumber(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        const data = res.data
        console.log(res)
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(data.msgContent)
            break
          default:
            this.allNumber = data.msgData
            break
        }
      })
    },
    // 过滤车牌
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1

    },
    /**
     * 分页
     * */
    changePage5(index) {
      this.pageNum5 = index
      this.getAllData5(this.pageNum5)
    },
    /**
     *关闭弹框
     * status等于1为新建框的关闭
     */
    cancel5(status) {
      if (status === 1) {
        this.$refs.insuranceData.resetFields()  // 清空
        this.isAddModal5 = false
      } else {
        this.$refs.editInsuranceData.resetFields()  // 清空
        this.isEditModal5 = false
      }
    },
    /**
     *1：valid 判断必填项
     * 2：isDataSuccess 判断数据
     */
    addInsurance() {
      this.$refs.insuranceData.validate((valid) => {
        if (valid) {
          let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
          if (this.insuranceData.vehicleName && reg.test(this.insuranceData.vehicleName)) {
            const data = {
              'vehicleNumber': this.insuranceData.vehicleName,
              'insuranceDate': formatTime(this.insuranceData.dated),
              'insuranceCompany': this.insuranceData.insurer,
              'transactor': this.insuranceData.operator,
              'insuranceItem': this.insuranceData.coverage,
              'insuranceCost': this.insuranceData.insuranceCharges,
              'projectId': JSON.parse(localStorage.getItem('projectId')).id
            }
            newInsuranceRegistrationData(data).then(res => {
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
                  this.getAllData5(this.pageNum5)                           // 拉一次数据
                  this.cancel5(1)
                  this.$Message.success(data.msgContent)
                  break
              }
            })
          } else {
            this.$Message.error('填写正确车牌号码')
          }

        }
      })
    },
    /**收搜
     * */
    searchInsurance() {
      this.pageNum5 = 1
      this.getAllData5(this.pageNum5)
    },
    /**
     * 获取全部数据
     * */
    getAllData5(pageNum5) {
      getAllInsuranceRegistrationData(JSON.parse(localStorage.getItem('projectId')).id, pageNum5, this.pageSize5, this.searchValue5).then(res => {
          console.log(res)
          console.log(res)
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
              this.tableData5 = data.msgData.content
              this.totalElements5 = data.msgData.totalElements
              break
          }
        }
      )
    },
    /**
     * 删除
     * */
    deleteInsurance(index) {
      deleteInsuranceRegistrationData(this.tableData5[index].id).then(res => {
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
            this.tableData5.splice(index, 1)
            this.getAllData5(this.pageNum5)
            this.$Message.success(data.msgContent)
            break
        }
      })
    },
    /**
     * 编辑数据
     * */
    editInsurance() {
      console.log(paramsValidate(this.editInsuranceData))
      if (paramsValidate(this.editInsuranceData)) {
        const data = {
          'vehicleNumber': this.editInsuranceData.vehicleName,
          'insuranceDate': formatTime(this.editInsuranceData.dated),
          'insuranceCompany': this.editInsuranceData.insurer,
          'transactor': this.editInsuranceData.operator,
          'insuranceItem': this.editInsuranceData.coverage,
          'insuranceCost': this.editInsuranceData.insuranceCharges
        }
        getEditInsuranceRegistrationData(data, this.editInsuranceData.id).then(res => {
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
              this.getAllData5(this.pageNum5)
              this.cancel5()
              this.$Message.success(data.msgContent)
              break
          }
        })
      }
    },
    /**
     * 编辑数据回显
     **/
    echoData5(index) {
      this.isEditModal5 = true
      this.editInsuranceData.vehicleName = this.tableData5[index].vehicleNumber
      this.editInsuranceData.dated = this.tableData5[index].insuranceDate
      this.editInsuranceData.insurer = this.tableData5[index].insuranceCompany
      this.editInsuranceData.operator = this.tableData5[index].transactor
      this.editInsuranceData.coverage = this.tableData5[index].insuranceItem
      this.editInsuranceData.insuranceCharges = this.tableData5[index].insuranceCost
      this.editInsuranceData.id = this.tableData5[index].id
    },
  },
  mounted() {
    this.getAllData5(this.pageNum5)
  }
}
</script>

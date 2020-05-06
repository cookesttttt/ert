<template>
  <Card style="height: 100%">
    <div class="bottom15">
      <Button  class="search-btn" type="primary" @click="clickMOT" >&nbsp;新建年检记录</Button>
      <Modal
        class-name="vertical-center-modal"
        title="新建年检登记信息"
        v-model="isAddModal6"
        :mask-closable="false"
        @on-cancel="cancel6(1)">
        <Form
          ref="annualData"
          :model="annualData"
          :label-width="100" inline :rules="rules6">
          <FormItem label="车牌号码" prop="vehicleName">
            <AutoComplete
              v-model="annualData.vehicleName"
              :data="allNumber"
              :filter-method="filterMethod"
              placeholder="输入关键字查询车辆"
              class="width350" >
            </AutoComplete>
          </FormItem>
          <br>
          <FormItem label="年检日期" prop="annualInspectionDate">
            <DatePicker v-model="annualData.annualInspectionDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
          </FormItem>
          <br>
          <FormItem label="检车地点" prop="vehicleInspectionPlace">
            <Input v-model="annualData.vehicleInspectionPlace" class="width350" :maxlength="15"></Input>
          </FormItem>
          <FormItem label="经办人" prop="operator">
            <Input v-model="annualData.operator" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="检车费用" prop="inspectionCost">
            <Input v-model="annualData.inspectionCost" class="width350" :maxlength="12"></Input>
          </FormItem>
          <br>
          <FormItem label="备注" prop="remarks">
            <Input v-model="annualData.remarks" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"   size="large"  @click="cancel6(1)">取消</Button>
          <Button type="primary" size="large" @click="addAnnual">保存</Button>
        </div>
      </Modal>
      <!--收搜-->
      <div class="right" style="float: right">
        <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue6"></Input>
        <Button class="search-btn" type="primary" @click="searchAnnual">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>

    </div>
    <div class="clear"></div>
    <!--表格-->
    <Table
      border
      :columns="columns6"
      :data="tableData6">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <br>
        <Page :total="totalElements6"
              :current="pageNum6"
              show-total
              @on-change="changePage6">
        </Page>
      </div>
    </div>

    <Modal
      class-name="vertical-center-modal"
      title="编辑年检登记信息"
      v-model="isEditModal6"
      :mask-closable="false"
      @on-cancel="cancel6">
      <Form
        ref="editAnnualData"
        :model="editAnnualData"
        :label-width="100" inline :rules="rules6">
        <FormItem label="车牌号码" prop="vehicleName">
          <AutoComplete
            v-model="editAnnualData.vehicleName"
            :data="allNumber"
            :filter-method="filterMethod"
            placeholder="输入关键字查询车辆"
            class="width350" >
          </AutoComplete>
        </FormItem>
        <br>
        <FormItem label="年检日期" prop="annualInspectionDate">
          <DatePicker v-model="editAnnualData.annualInspectionDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
        </FormItem>
        <br>
        <FormItem label="检车地点" prop="vehicleInspectionPlace">
          <Input v-model="editAnnualData.vehicleInspectionPlace" class="width350" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="经办人" prop="operator">
          <Input v-model="editAnnualData.operator" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="检车费用" prop="inspectionCost">
          <Input v-model="editAnnualData.inspectionCost" class="width350" :maxlength="12"></Input>
        </FormItem>
        <br>
        <FormItem label="备注" prop="remarks">
          <Input v-model="editAnnualData.remarks"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"   size="large"  @click="cancel6">取消</Button>
        <Button type="primary" size="large" @click="editAnnual">保存</Button>
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
  newAnnualInspectionRegistrationData,
  getAllAnnualInspectionRegistrationData,
  deleteAnnualInspectionRegistrationData,
  getEditAnnualInspectionRegistrationData,
} from '@/api/cars/annualInspectionRegistration'
import { getAllNumber } from '@/api/cars/allNumber'
import '../index.less'

export default {
  name: 'annualInspectionRegistration',
  data() {
    return {
        isAddModal6: false,
      isEditModal6: false,
      allNumber: [],                           // 获取所有车牌
        searchValue6: '',                         // 收搜数据
      annualData: {                      // 年检登记信息数据
        vehicleName: '',                // 车牌号码
        annualInspectionDate: '',      // 年检日期
        vehicleInspectionPlace: '',   // 检车地点
        operator: '',                // 经办人
        inspectionCost: '',         // 检车费用
        remarks: '',               // 备注

      },
      editAnnualData: {              // 编辑年检登记信息数据
        vehicleName: '',                // 车牌号码
        annualInspectionDate: '',      // 年检日期
        vehicleInspectionPlace: '',   // 检车地点
        operator: '',                // 经办人
        inspectionCost: '',         // 检车费用
        remarks: '',               // 备注
        id: ''
      },
        rules6: {                         // 必填项的验证
        annualInspectionDate: [
          {
            type: 'date',
            required: true,
            message: '请选择年检日期',
            trigger: 'change'
          }
        ],
        vehicleInspectionPlace: [
          {
            required: true,
            message: '请填写检车地点',
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
        inspectionCost: [
          {
            required: true,
            message: '请填写检车费用',
            trigger: 'blur'
          },
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
        ],
      },
        tableData6: [],                    // 表格数据
        pageNum6: 1,                     // 当前页码
      pageSize6: 10,                  // 每页显示多少条
        totalElements6: 0,             // 初始化信息总条数
      columns6: [
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
          width: 100,
          fixed: 'left',
          key: 'vehicleNumber',
        },
        {
          title: '年检日期',
          width: 120,
          key: 'inspectionDate',
        },
        {
          title: '检车地点',
            tooltip:true,
          width: 300,
          key: 'inspectionPlace',
        },
        {
          title: '经办人',
          width: 80,
          key: 'transactor'
        },
        {
          title: '检车费用',
          width: 150,
          key: 'inspectionCost'
        },
        {
          title: '备注',
          width: 300,
            tooltip:true,
          key: 'remark'
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
                    this.echoData6(params.index)
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
                      this.deleteAnnual(params.index)
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
    clickMOT () {
      this.isAddModal6 = true
    },
   /* // 获取车牌
    getNumber () {
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
    //过滤车牌
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },*/
    /**
     * 分页
     * */
    changePage6 (index) {
      this.pageNum6 = index
      this.getAllData6(this.pageNum6)
    },
    /**
     *关闭弹框
     * status等于1为新建框的关闭
     */
    cancel6(status) {
      if (status === 1) {
        this.$refs.annualData.resetFields()  // 清空
        this.isAddModal6 = false
      } else {
        this.$refs.editAnnualData.resetFields()  // 清空
        this.isEditModal6 = false
      }
    },
    /**
     *1：valid 判断必填项
     * 2：isDataSuccess 判断数据
     */
    addAnnual () {
      this.$refs.annualData.validate((valid) => {
        if (valid) {
          let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
          if (this.annualData.vehicleName && reg.test(this.annualData.vehicleName)) {
            const data = {
              'vehicleNumber': this.annualData.vehicleName,
              'inspectionDate': formatTime(this.annualData.annualInspectionDate),
              'inspectionPlace': this.annualData.vehicleInspectionPlace,
              'transactor': this.annualData.operator,
              'inspectionCost': this.annualData.inspectionCost,
              'remark': this.annualData.remarks,
              'projectId': JSON.parse(localStorage.getItem('projectId')).id
            }
            newAnnualInspectionRegistrationData(data).then(res => {
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
                  this.getAllData6(this.pageNum6)                           // 拉一次数据
                  this.cancel6(1)
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
    searchAnnual () {
      this.pageNum6 = 1
      this.getAllData6(this.pageNum6)
    },
    /**
     * 获取全部数据
     * */
    getAllData6 (pageNum6) {
      getAllAnnualInspectionRegistrationData(JSON.parse(localStorage.getItem('projectId')).id, pageNum6, this.pageSize6, this.searchValue6).then(res => {
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
              this.tableData6 = data.msgData.content
              this.totalElements6 = data.msgData.totalElements
              break
          }
        }
      )
    },
    /**
     * 删除
     * */
    deleteAnnual (index) {
      deleteAnnualInspectionRegistrationData(this.tableData6[index].id).then(res => {
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
            this.tableData6.splice(index, 1)
            this.getAllData6(this.pageNum6)
            this.$Message.success(data.msgContent)
            break
        }
      })
    },
    /**编辑数据
     * */
    editAnnual () {
      if (paramsValidate(this.editAnnualData)) {
        const data = {
          'vehicleNumber': this.editAnnualData.vehicleName,
          'inspectionDate': formatTime(this.editAnnualData.annualInspectionDate),
          'inspectionPlace': this.editAnnualData.vehicleInspectionPlace,
          'transactor': this.editAnnualData.operator,
          'inspectionCost': this.editAnnualData.inspectionCost,
          'remark': this.editAnnualData.remarks
        }
        getEditAnnualInspectionRegistrationData(data, this.editAnnualData.id).then(res => {
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
              this.getAllData6(this.pageNum6)
              this.cancel6()
              this.$Message.success(data.msgContent)
              break
          }
        })
      }
    },
    /**
     * 编辑数据回显
     **/
    echoData6(index) {
      console.log(this.tableData6[index])
      this.isEditModal6 = true
      this.editAnnualData.vehicleName = this.tableData6[index].vehicleNumber
      this.editAnnualData.annualInspectionDate = this.tableData6[index].inspectionDate
      this.editAnnualData.vehicleInspectionPlace = this.tableData6[index].inspectionPlace
      this.editAnnualData.operator = this.tableData6[index].transactor
      this.editAnnualData.inspectionCost = this.tableData6[index].inspectionCost
      this.editAnnualData.remarks = this.tableData6[index].remark
      this.editAnnualData.id = this.tableData6[index].id
    },
  },
  mounted() {
    this.getAllData6(this.pageNum6)
  }
}
</script>


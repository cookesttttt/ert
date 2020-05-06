<template>
  <Card style="height: 100%">
    <div class="bottom15">
      <Button  class="search-btn" type="primary" @click="newRefueling" >&nbsp;新建加油记录</Button>
      <Modal
        class-name="vertical-center-modal"
        title="新建加油信息"
        v-model="isAddModal2"
        :mask-closable="false"
        @on-cancel="cancel2(1)">
        <Form
          ref="vehicleRefuelingData"
          :model="vehicleRefuelingData"
          :label-width="100" inline :rules="rules2">
          <FormItem label="车牌号码" prop="vehicleName">
            <Input v-model="vehicleRefuelingData.vehicleName" class="width350" disabled></Input>
          </FormItem>
          <br>
          <FormItem label="加油日期" prop="refuelingDate">
            <DatePicker v-model="vehicleRefuelingData.refuelingDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
          </FormItem>
          <br>
          <FormItem label="油号" prop="oilNo">
            <Input v-model="vehicleRefuelingData.oilNo" class="width350" :maxlength="15"></Input>
          </FormItem>
          <FormItem label="费用" prop="cost">
            <Input v-model="vehicleRefuelingData.cost" class="width350" :maxlength="12"></Input>
          </FormItem>
          <br>
          <FormItem label="经办人" prop="operator">
            <Input v-model="vehicleRefuelingData.operator" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="登记日期" prop="recordDate">
            <DatePicker v-model="vehicleRefuelingData.recordDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"   size="large"  @click="cancel2(1)">取消</Button>
          <Button type="primary" size="large" @click="addRefueling">保存</Button>
        </div>
      </Modal>
      <!--收搜-->
      <div class="right">
        <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue2"></Input>
        <Button class="search-btn" type="primary" @click="searchRefueling">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>
      <div class="clear"></div>
    </div>
    <!--表格-->
    <Table
      border
      :columns="columns2"
      :data="tableData2">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <br>
        <Page :total="totalElements2"
              :current="pageNum2"
              show-total
              @on-change="changePage2">
        </Page>
      </div>
    </div>
    <!--编辑车辆弹框-->
    <Modal
      class-name="vertical-center-modal"
      title="编辑加油信息"
      v-model="isEditModal2"
      :mask-closable="false"
      @on-cancel="cancel2">
      <Form
        ref="editVehicleRefuelingData"
        :model="editVehicleRefuelingData"
        :label-width="100" inline :rules="rules2">
        <FormItem label="车牌号码" prop="vehicleName">
          <Input v-model="editVehicleRefuelingData.vehicleName" class="width350" disabled></Input>
        </FormItem>
        <br>
        <FormItem label="加油日期" prop="refuelingDate">
          <DatePicker v-model="editVehicleRefuelingData.refuelingDate" type="date" format='yyyy-MM-dd' class="width350"></DatePicker>
        </FormItem>
        <br>
        <FormItem label="油号" prop="oilNo">
          <Input v-model="editVehicleRefuelingData.oilNo" class="width350" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="费用" prop="cost">
          <Input v-model="editVehicleRefuelingData.cost" class="width350" :maxlength="12"></Input>
        </FormItem>
        <br>
        <FormItem label="经办人" prop="operator">
          <Input v-model="editVehicleRefuelingData.operator" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="登记日期" prop="recordDate">
          <DatePicker v-model="editVehicleRefuelingData.recordDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"   size="large"  @click="cancel2">取消</Button>
        <Button type="primary" size="large" @click="editRefueling">保存</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
  /**
   * paramsValidate 验证是否为空
   * isDataSuccess 验证数据是否成功
   * */
import {
  paramsValidate,
  isDataSuccess,
  formatTime
  } from '@/libs/util'
import {
  newVehicleRefuelingData,
  getAllVehicleRefuelingData,
  deleteVehicleRefuelingData,
  getEditVehicleRefuelingData
  } from '@/api/cars/vehicleRefueling'
import { getAllNumber } from '@/api/cars/allNumber'
import '../index.less'
export default {
  name: 'vehicleRefueling',
  data () {
    return {
      isAddModal2: false,
      isEditModal2: false,
      allNumber: [],                           // 车牌号码的选择
      searchValue2: '',                         // 收搜数据
      vehicleRefuelingData: {                     // 新增加油信息数据
        vehicleName: '',                     // 车辆名称
        refuelingDate: '',                   // 加油日期
        oilNo: '',                           // 油号
        cost: '',                           // 费用
        operator: '',                       // 经办人
        recordDate: ''                     // 登记日期
      },
      editVehicleRefuelingData: {            // 编辑加油信息数据
        vehicleName: '',                 // 车辆名称
        refuelingDate: '',                // 加油日期
        oilNo: '',                        // 油号
        cost: '',                         // 费用
        operator: '',                     // 经办人
        recordDate: ''                   // 登记日期
      },
      rules2: {                         // 必填项的验证
        refuelingDate: [
          {
            required: true,
            type: 'date',
            message: '请选择加油时间',
            trigger: 'change'
          }
        ],
        oilNo: [
          {
            required: true,
            message: '请填写油号',
            trigger: 'blur'
          }
        ],
        cost: [                // 车辆名称非空验证
          {
            required: true,
            message: '请填写费用',
            trigger: 'blur'
          },
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
        ],
        operator: [
          {
            required: true,
            message: '请填写经办人',
            trigger: 'blur'
          }
        ],
        recordDate: [
          {
            required: true,
            type: 'date',
            message: '请选择登记日期',
            trigger: 'change'
          }
        ]
      },
      tableData2: [],                    // 表格数据
      pageNum2: 1,                     // 当前页码
      pageSize2: 10,                  // 每页显示多少条
      totalElements2: 0,             // 初始化信息总条数
      columns2: [
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
          title: '加油日期',
          width: 100,
          key: 'gasDate',
        },
        {
          title: '油号',
          width: 80,
          key: 'gasType',
        },
        {
          title: '费用',
          width: 150,
          key: 'cost'
        },
        {
          title: '经办人',
          width: 80,
          key: 'transactor'
        },
        {
          title: '登记日期',
          width: 120,
          key: 'recordDate'
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
                    this.echoData2(params.index)
                    this.getNumber()
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
                      this.deleteRefueling(params.index)
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
      ]
    }
  },
  methods: {
    // 点击新建加油按钮
    newRefueling() {
      this.isAddModal2 = true
      this.getNumber()
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
    changePage2(index) {
      this.pageNum2 = index
      this.getAllData2(this.pageNum2)
    },
    /**
     *关闭弹框
     * status等于1为新建框的关闭
     */
    cancel2(status) {
      if (status === 1) {
        this.$refs.vehicleRefuelingData.resetFields()  // 清空
        this.isAddModal2 = false
      } else {
        this.$refs.editVehicleRefuelingData.resetFields()  // 清空
        this.isEditModal2 = false
      }
    },
    /**
     * 添加加油信息
     *1：valid 判断必填项
     * 2：isDataSuccess 判断数据
     */
    addRefueling() {
      this.$refs.vehicleRefuelingData.validate((valid) => {
        if (valid) {
          let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
          if (this.vehicleRefuelingData.vehicleName && reg.test(this.vehicleRefuelingData.vehicleName)) {
            const data = {
              'vehicleNumber': this.vehicleRefuelingData.vehicleName,
              'gasDate': formatTime(this.vehicleRefuelingData.refuelingDate),
              'gasType': this.vehicleRefuelingData.oilNo,
              'cost': this.vehicleRefuelingData.cost,
              'transactor': this.vehicleRefuelingData.operator,
              'recordDate': formatTime(this.vehicleRefuelingData.recordDate),
              'projectId': JSON.parse(localStorage.getItem('projectId')).id,
            }
            newVehicleRefuelingData(data).then(res => {
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
                  this.getAllData2(this.pageNum2)
                  this.cancel2(1)
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
    /**
     * 收搜加油信息
     * */
    searchRefueling() {
      this.pageNum2 = 1
      this.getAllData2(this.pageNum2)
    },
    /**
     * 获取全部数据
     * */
    getAllData2(pageNum2) {
      getAllVehicleRefuelingData(JSON.parse(localStorage.getItem('projectId')).id, pageNum2, this.pageSize2, this.searchValue2).then(res => {
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
              this.tableData2 = data.msgData.content
              this.totalElements2 = data.msgData.totalElements
              break
          }
        }
      )
    },
    /**
     * 删除加油
     * */
    deleteRefueling(index) {
      deleteVehicleRefuelingData(this.tableData2[index].id).then(res => {
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
            this.tableData2.splice(index, 1)
            this.getAllData2(this.pageNum2)
            this.$Message.success(data.msgContent)
            break
        }
      })
    },
    /**
     * 编辑加油数据
     * */
    editRefueling() {
      if (this.editVehicleRefuelingData.vehicleName) {
        if (paramsValidate(this.editVehicleRefuelingData)) {
          const data = {
            'vehicleNumber': this.editVehicleRefuelingData.vehicleName,
            'gasDate': formatTime(this.editVehicleRefuelingData.refuelingDate),
            'gasType': this.editVehicleRefuelingData.oilNo,
            'cost': this.editVehicleRefuelingData.cost,
            'transactor': this.editVehicleRefuelingData.operator,
            'recordDate': formatTime(this.editVehicleRefuelingData.recordDate)
          }
          getEditVehicleRefuelingData(data, this.editVehicleRefuelingData.id).then(res => {
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
                this.getAllData2(this.pageNum2)
                this.cancel2()
                this.$Message.success(data.msgContent)
                break
            }
          })
        }
      } else {
        this.$Message.error('请输入车牌号码')
      }

    },
    /**
     * 编辑数据回显
     **/
    echoData2(index) {
      this.isEditModal2 = true
      this.editVehicleRefuelingData.vehicleName = this.tableData2[index].vehicleNumber
      this.editVehicleRefuelingData.refuelingDate = this.tableData2[index].gasDate
      this.editVehicleRefuelingData.oilNo = this.tableData2[index].gasType
      this.editVehicleRefuelingData.cost = this.tableData2[index].cost
      this.editVehicleRefuelingData.operator = this.tableData2[index].transactor
      this.editVehicleRefuelingData.recordDate = this.tableData2[index].recordDate
      this.editVehicleRefuelingData.id = this.tableData2[index].id
    },
  },
  mounted() {
    this.getAllData2(this.pageNum2)
  }
}
</script>


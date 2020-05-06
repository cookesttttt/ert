<template>
  <Card style="height: 100%" >
    <div class="bottom15">
      <!--新建车辆-->
      <Button class="search-btn" type="primary" @click="isAddModal=true">&nbsp;新建车辆信息</Button>
      <Modal title="新建车辆信息" v-model="isAddModal" :mask-closable="false" @on-cancel="cancel(1)" class-name="vertical-center-modal">
        <Form
          ref="addVehicleData"
          :model="addVehicleData"
          :label-width="100"
          inline
          :rules="rules"
        >
          <FormItem label="车辆名称" prop="vehicleName">
            <Input v-model="addVehicleData.vehicleName" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br />
          <FormItem label="车牌号码" prop="licenseNumber">
            <Input v-model="addVehicleData.licenseNumber" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br />
          <FormItem label="联系电话" prop="contactNumber">
            <Input v-model="addVehicleData.contactNumber" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br />
          <FormItem label="型号" prop="carModel">
            <Input v-model="addVehicleData.carModel" class="width350" :maxlength="15"></Input>
          </FormItem>
          <FormItem label="默认驾驶员" prop="driver">
            <Input v-model="addVehicleData.driver" class="width350" :maxlength="15"></Input>
          </FormItem>

          <br />
          <FormItem label="保险到期日" prop="insuranceDate">
            <DatePicker v-model="addVehicleData.insuranceDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
          </FormItem>
          <FormItem label="年检到期日" prop="inspectionDate">
            <DatePicker v-model="addVehicleData.inspectionDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel(1)">取消</Button>
          <Button type="primary" size="large" @click="addVehicle">保存</Button>
        </div>
      </Modal>
      <!--收搜-->
      <div class="right">
        <Input class="search-input" placeholder="请输入关键字收搜" v-model="searchValue"></Input>
        <Button class="search-btn" type="primary" @click="searchVehicle">
          <Icon type="ios-search" />&nbsp;搜索
        </Button>
      </div>
    </div>
    <div class="clear"></div>
    <!--表格-->
    <Table border :columns="columns" :data="tableData"></Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <br>
        <Page :total="totalElements" :current="pageNum" show-total @on-change="changePage"></Page>
      </div>
    </div>
    <!--编辑车辆弹框-->
    <Modal title="编辑车辆信息" v-model="isEditModal" :mask-closable="false" @on-cancel="cancel" class-name="vertical-center-modal">
      <Form
        ref="editVehicleData"
        :model="editVehicleData"
        :label-width="100"
        inline
        :rules="editRules"
      >
        <FormItem label="车辆名称" prop="vehicleName">
          <Input
            v-model="editVehicleData.vehicleName"
            class="width350"
            :maxlength="15"
            placeholder="请输入车辆名称"
          ></Input>
        </FormItem>
        <br />
        <FormItem label="车牌号码" prop="licenseNumber">
          <Input
            v-model="editVehicleData.licenseNumber"
            class="width350"
            :maxlength="15"
            placeholder="请输入车牌号码"
          ></Input>
        </FormItem>
        <br />
        <FormItem label="联系电话" prop="contactNumber">
          <Input v-model="editVehicleData.contactNumber" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br />
        <FormItem label="型号" prop="carModel">
          <Input v-model="editVehicleData.carModel" class="width350" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="默认驾驶员" prop="driver">
          <Input v-model="editVehicleData.driver" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br />
        <FormItem label="保险到期日" prop="insuranceDate">
          <DatePicker
            v-model="editVehicleData.insuranceDate"
            type="date"
            format="yyyy-MM-dd"
            class="width350">
          </DatePicker>
        </FormItem>
        <FormItem label="年检到期日" prop="inspectionDate">
          <DatePicker v-model="editVehicleData.inspectionDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="editVehicle">保存</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
/**
 *  paramsValidate 验证是否为空
 *  isDataSuccess 验证数据是否成功
 * */
import {
  paramsValidate,
  isDataSuccess,
  formatTime
} from '@/libs/util'

/**
 * 获取数据
 */
import {
  newVehicleData,
  getAllVehicleData,
  deleteVehicleData,
  getEditVehicleData
} from '@/api/cars/vehicleFile'

import '../index.less'
export default {
  name: 'vehicleFile',
  data () {
    return {
      procedureData: ['设置', '待处理事件', '权益配额'],
      isAddModal: false,
      isEditModal: false,
      searchValue: '', // 收搜数据
      addVehicleData: {
        // 新增车辆信息数据
        vehicleName: '',     // 车辆名称
        licenseNumber: '',   // 车牌号码
        carModel: '',         // 型号
        driver: '',          // 默认驾驶员
        contactNumber: '',   // 联系电话
        insuranceDate: '',   // 保险到期日
        inspectionDate: ''  // 年检到期日
      },
      editVehicleData: {
        // 编辑车辆信息数据
        vehicleName: '',
        licenseNumber: '',
        carModel: '',
        driver: '',
        contactNumber: '',
        insuranceDate: '',
        inspectionDate: '',
        id: ''
      },
      rules: {
        // 必填项的验证
        vehicleName: [
          // 车辆名称非空验证
          {required: true, message: '请填写车辆名称', trigger: 'blur'}
        ],
        licenseNumber: [
          // 车牌号码非空验证
          {
            required: true,
            message: '请填写车牌号码',
            trigger: 'blur'
          },
          {
            type: 'string',
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            message: '请输入正确的车牌号码',
            trigger: 'blur'
          }
        ],
        contactNumber: [
          {
            required: true,
            type: 'number',
            message: '请填写正确的手机号码',
            trigger: 'blur',
            transform(value) {
              let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/
              if (!myreg.test(value)) {
                return false
              } else {
                return Number(value)
              }
            }
          }
        ]
      },
      editRules: {
        vehicleName: [
          //车辆名称非空验证
          {required: true, message: '车辆名称不能为空', trigger: 'blur'}
        ],
        licenseNumber: [
          //车牌号码非空验证
          {
            required: true,
            message: '车牌号码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/,
            message: '请输入正确的车牌号码',
            trigger: 'blur'
          }
        ],
        contactNumber: [
          {
            required: true,
            type: 'number',
            message: '请填写正确的手机号码',
            trigger: 'blur',
            transform(value) {
              let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/
              if (!myreg.test(value)) {
                return false
              } else {
                return Number(value)
              }
            }
          }
        ]
      },
      tableData: [], // 表格数据
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示多少条
      totalElements: 0, // 初始化信息总条数
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {

          type: 'index',
          fixed: 'left',
          width: 50,
          align: 'center'
        },
        {
          title: '车辆名称',
          fixed: 'left',
            width: 130,
            tooltip:true,
          key: 'name',
            render: (h, params) => {
                return h('div', [
                    h('span', {
                        style: {
                            color: '#082999',
                            cursor: 'pointer',
                        },
                        on: {
                            'click': () => {
                                this.$router.push({ path: '/administration/truckingOrder' })
                                sessionStorage.setItem('vehicleFile',this.tableData[params.index].number)
                            }
                        }
                    }, params.row.name)
                ])
            }
        },
        {
          title: '车牌号码',
          width: 100,
          key: 'number'
        },
        {
          title: '车辆型号',
            width: 130,
            tooltip:true,
          key: 'type'
        },
        {
          title: '默认驾驶员',
          width: 200,
          key: 'driver'
        },
        {
          title: '联系电话',
          width: 120,
          key: 'phone'
        },
        {
          title: '保险到期',
          width: 120,
          key: 'insuranceExpirationDate'
        },
        {
          title: '年检到期',
          key: 'motDate',
          width: 120,
        },
        {
          title: '操作',
          fixed: 'right',
          width: 170,
          key: 'handle',
          render: (h, params, vm) => {
            return [
              [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    // 修改岗位
                    on: {
                      click: () => {
                        this.echoData(params.index)
                      }
                    },
                    style: {
                      marginRight: '5px'
                    }
                  },
                  '编辑'
                )
              ],
              h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '你确定要删除吗?',
                    placement: 'left-end',
                    size: 'small'
                  },
                    style: {
                        marginRight: '5px'
                    },
                  on: {
                    // 删除岗位
                    'on-ok': () => {
                      this.deleteVehicle(params.index)
                    }
                  }
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      }
                    },
                    '删除'
                  )
                ]
              ),
                [
                    h(
                        'Button',
                        {
                            props: {
                                size: 'small'
                            },

                            on: {
                                click: () => {
                                    this.$router.push({ path: '/administration/truckingOrder' })
                                    sessionStorage.setItem('vehicleFile',this.tableData[params.index].number)
                                }
                            },
                        },
                        '记录'
                    )
                ],
            ]
          }
        }
      ]
    }
  },
  methods: {
    /**
     * 分页
     * */
    changePage(index) {
      this.pageNum = index
      this.getAllData(this.pageNum)
    },
    /**
     *关闭弹框
     * status等于1为新建框的关闭
     */
    cancel(status) {
      if (status === 1) {
        this.$refs.addVehicleData.resetFields() // 清空
        this.isAddModal = false
      } else {
        this.$refs.editVehicleData.resetFields() // 清空
        this.isEditModal = false
      }
    },
    /**
     * 添加车辆
     *1：valid 判断必填项
     * 2：isDataSuccess 判断数据
     */
    addVehicle() {
      this.$refs.addVehicleData.validate(valid => {
        if (valid) {
          const data = {
            name: this.addVehicleData.vehicleName,
            number: this.addVehicleData.licenseNumber,
            type: this.addVehicleData.carModel,
            driver: this.addVehicleData.driver,
            phone: this.addVehicleData.contactNumber,
            insuranceExpirationDate:this.addVehicleData.insuranceDate?formatTime(this.addVehicleData.insuranceDate):this.addVehicleData.insuranceDate,
            motDate:this.addVehicleData.inspectionDate?formatTime(this.addVehicleData.inspectionDate):this.addVehicleData.inspectionDate,
            projectId: JSON.parse(localStorage.getItem('projectId')).id
          }
          newVehicleData(data).then(res => {
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
                this.getAllData(this.pageNum) // 拉一次数据
                this.cancel(1)
                this.$Message.success(data.msgContent)
                break
            }
          })
        }
      })
    },
    /**
     * 收搜车辆
     * */
    searchVehicle() {
      this.pageNum = 1
      this.getAllData(this.pageNum)
    },
    /**
     * 获取全部数据
     * */
    getAllData(pageNum) {
      getAllVehicleData(
        JSON.parse(localStorage.getItem('projectId')).id,
        pageNum,
        this.pageSize,
        this.searchValue
      ).then(res => {
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
            this.tableData = data.msgData.content
            this.totalElements = data.msgData.totalElements
            break
        }
      })
    },
    /**
     * 删除车辆
     * */
    deleteVehicle(index) {
      deleteVehicleData(this.tableData[index].id).then(res => {
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
            this.tableData.splice(index, 1)
            this.getAllData(this.pageNum)
            this.$Message.success(data.msgContent)
            break
        }
      })
    },
    /**
     * 编辑车辆数据
     * */
    editVehicle() {
      this.$refs.editVehicleData.validate(valid => {
        const data = {
          name: this.editVehicleData.vehicleName,
          number: this.editVehicleData.licenseNumber,
          type: this.editVehicleData.carModel,
          driver: this.editVehicleData.driver,
          phone: this.editVehicleData.contactNumber,
          insuranceExpirationDate:this.editVehicleData.insuranceDate?formatTime(this.editVehicleData.insuranceDate):this.editVehicleData.insuranceDate,
          motDate:this.editVehicleData.inspectionDate?formatTime(this.editVehicleData.inspectionDate):this.editVehicleData.inspectionDate,
          id: this.editVehicleData.id
        }
        getEditVehicleData(data).then(res => {
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
              this.getAllData(this.pageNum)
              this.cancel()
              this.$Message.success(data.msgContent)
              break
          }
        })
      })
    },
    /**
     * 编辑数据回显
     **/
    echoData(index) {
      console.log(this.tableData[index])
      this.isEditModal = true
      this.editVehicleData.vehicleName = this.tableData[index].name
      this.editVehicleData.licenseNumber = this.tableData[index].number
      this.editVehicleData.carModel = this.tableData[index].type
      this.editVehicleData.driver = this.tableData[index].driver
      this.editVehicleData.contactNumber = this.tableData[index].phone
      this.editVehicleData.insuranceDate = this.tableData[index].insuranceExpirationDate
      this.editVehicleData.inspectionDate = this.tableData[index].motDate
      this.editVehicleData.id = this.tableData[index].id
    }
  },
  mounted() {
    this.getAllData(this.pageNum)
  }
}
</script>


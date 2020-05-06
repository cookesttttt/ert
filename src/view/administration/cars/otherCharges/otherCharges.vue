<template>
  <Card style="height: 100%">
    <div class="bottom15">
      <Button  class="search-btn" type="primary" @click="otherClick" >&nbsp;新建其他费用记录</Button>
      <Modal
        title="其他费用信息"
        class-name="vertical-center-modal"
        v-model="isAddModal7"
        :mask-closable="false"
        @on-cancel="cancel7(1)">
        <Form
          ref="otherChargesData"
          :model="otherChargesData"
          :label-width="100" inline :rules="rules7">
          <FormItem label="车牌号码" prop="vehicleName">
            <AutoComplete
              v-model="otherChargesData.vehicleName"
              :data="allNumber"
              :filter-method="filterMethod"
              placeholder="输入关键字查询车辆"
              class="width350" >
            </AutoComplete>
          </FormItem>
          <br>
          <FormItem label="费用日期" prop="costDate">
            <DatePicker v-model="otherChargesData.costDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
          </FormItem>
          <br>
          <FormItem label="金额" prop="money">
            <Input v-model="otherChargesData.money" class="width350" :maxlength="12"></Input>
          </FormItem>
          <FormItem label="经办人" prop="operator">
            <Input v-model="otherChargesData.operator" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="费用项目" prop="expenseItem">
            <Input v-model="otherChargesData.expenseItem" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
          </FormItem>
          <br>
          <FormItem label="备注" prop="remarks">
            <Input v-model="otherChargesData.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"   size="large"  @click="cancel7(1)">取消</Button>
          <Button type="primary" size="large" @click="addOtherCharges">保存</Button>
        </div>
      </Modal>
      <!--收搜-->
      <div class="right" style="float: right">
        <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue7"></Input>
        <Button class="search-btn" type="primary" @click="searchOtherCharges">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>
    </div>
    <div class="clear"></div>
    <!--表格-->
    <Table
      border
      :columns="columns7"
      :data="tableData7">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <br>
        <Page :total="totalElements7"
              :current="pageNum7"
              show-total
              @on-change="changePage7">
        </Page>
      </div>
    </div>

    <Modal
      class-name="vertical-center-modal"
      title="编辑年检登记信息"
      v-model="isEditModal7"
      :mask-closable="false"
      @on-cancel="cancel7">
      <Form
        ref="editOtherCharges"
        :model="editOtherCharges"
        :label-width="100" inline :rules="rules7">
        <FormItem label="车牌号码" prop="vehicleName">
          <AutoComplete
            v-model="editOtherCharges.vehicleName"
            :data="allNumber"
            :filter-method="filterMethod"
            placeholder="输入关键字查询车辆"
            class="width350" >
          </AutoComplete>
        </FormItem>
        <br>
        <FormItem label="费用日期" prop="costDate">
          <DatePicker v-model="editOtherCharges.costDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
        </FormItem>
        <br>
        <FormItem label="金额" prop="money">
          <Input v-model="editOtherCharges.money" class="width350" :maxlength="12"></Input>
        </FormItem>
        <FormItem label="经办人" prop="operator">
          <Input v-model="editOtherCharges.operator" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="费用项目" prop="expenseItem">
          <Input v-model="editOtherCharges.expenseItem" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <br>
        <FormItem label="备注" prop="remarks">
          <Input v-model="editOtherCharges.remarks" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"   size="large"  @click="cancel7">取消</Button>
        <Button type="primary" size="large" @click="editOtherCharge">保存</Button>
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
  newOtherChargesData,
  getAllOtherChargesData,
  deleteOtherChargesData,
  getEditOtherChargesData,
} from '@/api/cars/otherCharges'
import { getAllNumber } from '@/api/cars/allNumber'
import '../index.less'
export default {
  name: "otherCharges",
  data() {
    return {
        isAddModal7: false,
        isEditModal7: false,
      allNumber: [],                           //获取所有车牌
        searchValue7: '',                         //收搜数据
      otherChargesData: {
        vehicleName: '',
        vehicleName1:'',
        costDate: '',
        money: '',
        operator: '',
        expenseItem: '',
        remarks: '',
      },
      editOtherCharges: {
        vehicleName: '',
        costDate: '',
        money: '',
        operator: '',
        expenseItem: '',
        remarks: '',
        id: ''
      },
        rules7: {                         //必填项的验证
        costDate: [
          {
            type: 'date',
            required: true,
            message: '请选择费用日期',
            trigger: 'change'
          }
        ],
        money: [
          {
            required: true,
            message: '请填写金额',
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
        expenseItem: [{
          required: true,
          message: '请填写费用项目',
          trigger: 'blur'
        }],
      },
        tableData7: [],                    // 表格数据
        pageNum7: 1,                     // 当前页码
      pageSize7: 10,                  // 每页显示多少条
        totalElements7: 0,             // 初始化信息总条数
      columns7: [
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
          title: '费用日期',
          width: 120,
          key: 'costDate',
        },
        {
          title: '金额',
          width: 150,
          key: 'costAmount',
        },
        {
          title: '经办人',
          width: 80,
          key: 'transactor'
        },
        {
          title: '费用项目',
          width: 100,
            tooltip:true,
          key: 'costItem'
        },
        {
          title: '备注',
            tooltip:true,
          width: 300,
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
                    this.echoData7(params.index)

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
                      this.deleteOtherCharges(params.index)
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
    otherClick() {
      this.isAddModal7 = true

    },
  /*  getNumber() {
      //获取车牌
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
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },*/
    /**
     * 分页
     * */
    changePage7(index) {
      this.pageNum7 = index
      this.getAllData7(this.pageNum7)
    },
    /**
     *关闭弹框
     * status等于1为新建框的关闭
     */
    cancel7(status) {
      if (status === 1) {
        this.$refs.otherChargesData.resetFields()  //清空
        this.isAddModal7 = false
      } else {
        this.$refs.editOtherCharges.resetFields()  //清空
        this.isEditModal7 = false
      }
    },
    /**
     *1：valid 判断必填项
     * 2：isDataSuccess 判断数据
     */
    addOtherCharges() {
      this.$refs.otherChargesData.validate((valid) => {
        if (valid) {
          let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
          if (this.otherChargesData.vehicleName && reg.test(this.otherChargesData.vehicleName)) {
            const data = {
              'vehicleNumber': this.otherChargesData.vehicleName,
              'costDate': formatTime(this.otherChargesData.costDate),
              'costAmount': this.otherChargesData.money,
              'transactor': this.otherChargesData.operator,
              'costItem': this.otherChargesData.expenseItem,
              'remark': this.otherChargesData.remarks,
              'projectId': JSON.parse(localStorage.getItem('projectId')).id
            }
            newOtherChargesData(data).then(res => {
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
                  this.getAllData7(this.pageNum7)                           //拉一次数据
                  this.cancel7(1)
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
    searchOtherCharges () {
      this.pageNum7 = 1
      this.getAllData7(this.pageNum7)
    },
    /**
     * 获取全部数据
     * */
    getAllData7 (pageNum7) {
      getAllOtherChargesData(JSON.parse(localStorage.getItem('projectId')).id, pageNum7, this.pageSize7, this.searchValue7).then(res => {
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
              this.tableData7 = data.msgData.content
              this.totalElements7 = data.msgData.totalElements
              break
          }
        }
      )
    },
    /**
     * 删除
     * */
    deleteOtherCharges (index) {
      deleteOtherChargesData(this.tableData7[index].id).then(res => {
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
            this.tableData7.splice(index, 1)
            this.getAllData7(this.pageNum7)
            this.$Message.success(data.msgContent)
            break
        }
      })
    },
    /**
     * 编辑数据
     * */
    editOtherCharge () {
      if (paramsValidate(this.editOtherCharges)) {
        const data = {
          'vehicleNumber': this.editOtherCharges.vehicleName,
          'costDate': formatTime(this.editOtherCharges.costDate),
          'costAmount': this.editOtherCharges.money,
          'transactor': this.editOtherCharges.operator,
          'costItem': this.editOtherCharges.expenseItem,
          'remark': this.editOtherCharges.remarks
        }
        getEditOtherChargesData(data, this.editOtherCharges.id).then(res => {
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
              this.getAllData7(this.pageNum7)
              this.cancel7()
              this.$Message.success(data.msgContent)
              break
          }
        })
      }
    },
    /**
     * 编辑数据回显
     **/
    echoData7 (index) {
      this.isEditModal7 = true
      this.editOtherCharges.vehicleName = this.tableData7[index].vehicleNumber
      this.editOtherCharges.costDate = this.tableData7[index].costDate
      this.editOtherCharges.money = this.tableData7[index].costAmount
      this.editOtherCharges.operator = this.tableData7[index].transactor
      this.editOtherCharges.expenseItem = this.tableData7[index].costItem
      this.editOtherCharges.remarks = this.tableData7[index].remark
      this.editOtherCharges.id = this.tableData7[index].id
    }
  },
  mounted() {
    this.getAllData7(this.pageNum7)
  }
}
</script>

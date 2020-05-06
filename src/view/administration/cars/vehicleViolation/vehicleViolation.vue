<template>
  <Card style="height: 100%">
    <div class="bottom15">
      <!--新建违章信息-->
      <Button class="search-btn" type="primary" @click="NewRegulations">&nbsp;新建违章记录</Button>
      <Modal
        class-name="vertical-center-modal"
        title="新建违章信息"
        v-model="isAddModal3"
        :mask-closable="false"
        @on-cancel="cancel3(1)">
        <Form
          ref="vehicleViolationData"
          :model="vehicleViolationData"
          :label-width="100" inline :rules="rules3">
          <FormItem label="车牌号码" prop="vehicleName">
            <AutoComplete
              v-model="vehicleViolationData.vehicleName"
              :data="allNumber"
              :filter-method="filterMethod"
              placeholder="输入关键字查询车辆"
              class="width350">
            </AutoComplete>
          </FormItem>
          <br>
          <FormItem label="违章日期" prop="violationDate">
            <DatePicker v-model="vehicleViolationData.violationDate" type="date" class="width350"
                        format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          <br>
          <FormItem label="违章地点" prop="violationPlace">
            <Input v-model="vehicleViolationData.violationPlace" class="width350" :maxlength="15"></Input>
          </FormItem>
          <FormItem label="违章细则" prop="violationRules">
            <Input v-model="vehicleViolationData.violationRules" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
          </FormItem>
          <br>
          <FormItem label="罚款金额" prop="fineAmount">
            <Input v-model="vehicleViolationData.fineAmount" class="width350" :maxlength="12"></Input>
          </FormItem>
          <br>
          <FormItem label="违章记分" prop="demeritScore">
            <Input v-model="vehicleViolationData.demeritScore" class="width350" :maxlength="8"></Input>
          </FormItem>
          <br>
          <FormItem label="当事人" prop="party">
            <Input v-model="vehicleViolationData.party" class="width350" :maxlength="15"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel3(1)">取消</Button>
          <Button type="primary" size="large" @click="addViolation">保存</Button>
        </div>
      </Modal>
      <!--收搜-->
      <div class="right" style="float: right">
        <Input class="search-input" placeholder="请输入关键字收搜" v-model="searchValue3"></Input>
        <Button class="search-btn" type="primary" @click="searchViolation">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>
    </div>
    <div class="clear"></div>
    <!--表格-->
    <Table
      border
      :columns="columns3"
      :data="tableData3">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
         <br>
        <Page :total="totalElements3"
              :current="pageNum3"
              show-total
              @on-change="changePage3">
        </Page>
      </div>
    </div>
    <!--编辑车辆弹框-->
    <Modal
      class-name="vertical-center-modal"
      title="编辑违章信息"
      v-model="isEditModal3"
      :mask-closable="false"
      @on-cancel="cancel3">
      <Form
        ref="editVehicleViolationData"
        :model="editVehicleViolationData"
        :label-width="100" inline :rules="rules3">
        <FormItem label="车牌号码" prop="vehicleName">
          <AutoComplete
            v-model="editVehicleViolationData.vehicleName"
            :data="allNumber"
            :filter-method="filterMethod"
            placeholder="输入关键字查询车辆"
            class="width350">
          </AutoComplete>
        </FormItem>
        <br>
        <FormItem label="违章日期" prop="violationDate">
          <DatePicker v-model="editVehicleViolationData.violationDate" type="date" class="width350"
                      format="yyyy-MM-dd"></DatePicker>
        </FormItem>
        <br>
        <FormItem label="违章地点" prop="violationPlace">
          <Input v-model="editVehicleViolationData.violationPlace" class="width350" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="违章细则" prop="violationRules">
          <Input v-model="editVehicleViolationData.violationRules" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
        </FormItem>
        <br>
        <FormItem label="罚款金额" prop="fineAmount">
          <Input v-model="editVehicleViolationData.fineAmount" class="width350" :maxlength="12"></Input>
        </FormItem>
        <br>
        <FormItem label="违章记分" prop="demeritScore">
          <Input v-model="editVehicleViolationData.demeritScore" class="width350" :maxlength="8"></Input>
        </FormItem>
        <br>
        <FormItem label="当事人" prop="party">
          <Input v-model="editVehicleViolationData.party" class="width350" :maxlength="15"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel3">取消</Button>
        <Button type="primary" size="large" @click="editViolation">保存</Button>
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
import {
  newVehicleViolationData,
  getAllVehicleViolationData,
  deleteVehicleViolationData,
  getEditVehicleViolationData
} from '@/api/cars/vehicleViolation'
import {getAllNumber} from '@/api/cars/allNumber'
import '../index.less'

export default {
  name: 'vehicleViolation',
  data () {
    return {
      isAddModal3: false,
      isEditModal3: false,
      allNumber: [],                           // 获取所有车牌
      searchValue3: '',                         // 收搜数据
      vehicleViolationData: {                 // 新增违章信息数据
        vehicleName: '',                      // 车牌号码
        violationDate: '',                    // 违章日期
        violationPlace: '',                   // 违章地点
        violationRules: '',                   // 违章细则
        fineAmount: '',                       // 罚款金额
        demeritScore: '',                     // 违章记分
        party: '',                            // 当事人
      },
      editVehicleViolationData: {            // 编辑违章信息数据
        vehicleName: '',                      // 车牌号码
        violationDate: '',                    // 违章日期
        violationPlace: '',                   // 违章地点
        violationRules: '',                   // 违章细则
        fineAmount: '',                       // 罚款金额
        demeritScore: '',                     // 违章记分
        party: '',                            // 当事人
        id: '',
      },
      rules3: {                         // 必填项的验证
        violationDate: [
          {
            required: true,
            type: 'date',
            message: '请选择违章日期',
            trigger: 'change'
          }
        ],
        violationPlace: [
          {
            required: true,
            message: '请填写违章地点',
            trigger: 'blur'
          }
        ],
        violationRules: [
          {
            required: true,
            message: '请填写违章细则',
            trigger: 'blur'
          }
        ],
        fineAmount: [{
          required: true,
          message: '请填写罚款金额',
          trigger: 'blur'
        },
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
        ],
        demeritScore: [{
          required: true,
          message: '请填写违章记分',
          trigger: 'blur'
        },
          {
            type: 'string',
            pattern: /^\d+$/, message: '请输入数字',
            trigger: 'blur'
          }
        ],
        party: [{
          required: true,
          message: '请填写当事人',
          trigger: 'blur'
        }]
      },
      tableData3: [],                    // 表格数据
      pageNum3: 1,                     // 当前页码
      pageSize3: 10,                  // 每页显示多少条
      totalElements3: 0,             // 初始化信息总条数
      columns3: [
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
            tooltip:true,
          fixed: 'left',
          width: 100,
          key: 'vehicleNumber',
        },
        {
          title: '违章日期',
          width: 120,
          key: 'penaltyDate',
        },
        {
          title: '违章地点',
            tooltip:true,
          width: 200,
          key: 'penaltyPlace',
        },
        {
          title: '违章细则',
            tooltip:true,
          width: 300,
          key: 'penaltyDetail'
        },
        {
          title: '罚款金额',
          width: 100,
          key: 'penaltyAmount'
        },
        {
          title: '违章记分',
          width: 100,
          key: 'penaltyScore'
        },
        {
          title: '当事人',
          width: 80,
          key: 'penaltyPerson'
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
                    this.echoData3(params.index)
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
                      this.deleteViolation(params.index)
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
    NewRegulations() {
      this.isAddModal3 = true
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
    //过滤车牌
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },
    /**
     * 分页
     * */
    changePage3(index) {
      this.pageNum3 = index
      this.getAllData3(this.pageNum3)
    },
    /**
     *关闭弹框
     * status等于1为新建框的关闭
     */
    cancel3(status) {
      if (status === 1) {
        this.$refs.vehicleViolationData.resetFields()  //清空
        this.isAddModal3 = false
      } else {
        this.$refs.editVehicleViolationData.resetFields()  //清空
        this.isEditModal3 = false
      }
    },
    /**
     * 添加违章信息
     *1：valid 判断必填项
     * 2：isDataSuccess 判断数据
     */
    addViolation() {
      this.$refs.vehicleViolationData.validate((valid) => {
        if (valid) {
          let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
          if (this.vehicleViolationData.vehicleName && reg.test(this.vehicleViolationData.vehicleName)) {
            const data = {
              'vehicleNumber': this.vehicleViolationData.vehicleName,
              'penaltyDate': formatTime(this.vehicleViolationData.violationDate),
              'penaltyPlace': this.vehicleViolationData.violationPlace,
              'penaltyDetail': this.vehicleViolationData.violationRules,
              'penaltyAmount': this.vehicleViolationData.fineAmount,
              'penaltyScore': this.vehicleViolationData.demeritScore,
              'penaltyPerson': this.vehicleViolationData.party,
              'projectId': JSON.parse(localStorage.getItem('projectId')).id,
            }
            newVehicleViolationData(data).then(res => {
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
                  this.getAllData3(this.pageNum3)                           //拉一次数据
                  this.cancel3(1)
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
    /**收搜违章信息
     * */
    searchViolation() {
      this.pageNum3 = 1
      this.getAllData3(this.pageNum3)
    },
    /**
     * 获取全部数据
     * */
    getAllData3(pageNum3) {
      getAllVehicleViolationData(JSON.parse(localStorage.getItem('projectId')).id, pageNum3, this.pageSize3, this.searchValue3).then(res => {
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
              this.tableData3 = data.msgData.content
              this.totalElements3 = data.msgData.totalElements
              break
          }
        }
      )
    },
    /**
     * 删除违章
     * */
    deleteViolation(index) {
      deleteVehicleViolationData(this.tableData3[index].id).then(res => {
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
            this.tableData3.splice(index, 1)
            this.getAllData3(this.pageNum3)
            this.$Message.success(data.msgContent)
            break
        }
      })
    },
    /**编辑违章数据
     * */
    editViolation() {
      if (paramsValidate(this.editVehicleViolationData)) {
        const data = {
          'vehicleNumber': this.editVehicleViolationData.vehicleName,
          'penaltyDate': formatTime(this.editVehicleViolationData.violationDate),
          'penaltyPlace': this.editVehicleViolationData.violationPlace,
          'penaltyDetail': this.editVehicleViolationData.violationRules,
          'penaltyAmount': this.editVehicleViolationData.fineAmount,
          'penaltyScore': this.editVehicleViolationData.demeritScore,
          'penaltyPerson': this.editVehicleViolationData.party
        }
        getEditVehicleViolationData(data, this.editVehicleViolationData.id).then(res => {
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
              this.getAllData3(this.pageNum3)
              this.cancel3()
              this.$Message.success(data.msgContent)
              break
          }
        })
      }
    },
    /**
     * 编辑数据回显
     **/
    echoData3(index) {
      this.isEditModal3 = true
      this.editVehicleViolationData.vehicleName = this.tableData3[index].vehicleNumber
      this.editVehicleViolationData.violationDate = this.tableData3[index].penaltyDate
      this.editVehicleViolationData.violationPlace = this.tableData3[index].penaltyPlace
      this.editVehicleViolationData.violationRules = this.tableData3[index].penaltyDetail
      this.editVehicleViolationData.fineAmount = this.tableData3[index].penaltyAmount
      this.editVehicleViolationData.demeritScore = this.tableData3[index].penaltyScore
      this.editVehicleViolationData.party = this.tableData3[index].penaltyPerson
      this.editVehicleViolationData.id = this.tableData3[index].id
    },
  },
  mounted() {
    this.getAllData3(this.pageNum3)
  }
}
</script>

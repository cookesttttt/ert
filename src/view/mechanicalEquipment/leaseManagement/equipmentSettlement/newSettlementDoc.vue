<template>
  <Card style="height: 100%;overflow: auto">
    <div class="textBox">
      <p class="name">编制人：{{author}}</p>
      <P class="time">创建日期:{{time}}</P>
      <P class="left" style="width: 230px">结算清单编号：{{information.billNumber}}</P>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="saveOrder(0)">&nbsp临时保存</Button>
        <Button class="btn" type="primary"  @click="saveOrder(1)">&nbsp完成制单</Button>

      </div>
      <div class="clear"></div>
    </div>
    <Tabs value="name1" class="bottom20">
      <TabPane label="基本信息" name="name1">
        <Row type="flex" justify="center">
          <Col span="18">
            <br />
            <br />
            <Form ref="information" :model="information" :rules="ruleInline" :label-width="100">
              <Col span="12">
                <FormItem label="付款日期" prop="payDate">
                  <DatePicker
                    v-model="information.payDate"
                    type="date"
                    class="width"
                    format="yyyy-MM-dd"
                  ></DatePicker>
                </FormItem>
              </Col>

              <Col span="12">
                <FormItem label="合同编号" prop="contractNumber">
                  <Input v-model="information.contractNumber" class="width" :maxlength="30"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="合同名称" prop="contractName">
                  <Input v-model="information.contractName" class="width" :maxlength="30"></Input>
                </FormItem>
              </Col>

              <Col span="12">
                <FormItem label="开户行" prop="blank">
                  <Input v-model="information.blank" class="width" :maxlength="30"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="银行账号" prop="blankAccount">
                  <Input v-model="information.blankAccount" class="width" :maxlength="30"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="经办人" prop="operator">
                  <Input v-model="information.operator" class="width" :maxlength="30"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="收款单位" prop="payEe">
                  <Input v-model="information.payEe" class="width" :maxlength="30"></Input>
                </FormItem>
              </Col>

              <Col span="12">
                <FormItem label="补贴费用" prop="subsidy">
                  <Input v-model="information.subsidy" class="width" :maxlength="12"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="应付金额" prop="payableAmount">
                  <Input v-model="information.payableAmount" class="width" :maxlength="12"></Input>
                </FormItem>
              </Col>

              <Col span="12">
                <FormItem label="实付金额" prop="actualAmount">
                  <Input v-model="information.actualAmount" class="width" :maxlength="12"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="扣除费用" prop="deductExpense">
                  <Input v-model="information.deductExpense" class="width" :maxlength="12"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="备注">
                  <Input
                    v-model="information.remark"
                    class="width"
                    :maxlength="300"
                    type="textarea"
                    :autosize="{minRows: 3,maxRows:3}"
                  ></Input>
                </FormItem>
              </Col>
            </Form>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="结算清单" name="name2">
        <br />
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="insertEvent(-1)">&nbsp;新增结算清单项</Button>
          <Button class="search-btn" type="error" @click="confirm">&nbsp;批量删除</Button>
        </ButtonGroup>
        <br />
        <br />
        <vxe-table
          ref="xTable"
          border
          resizable
          class="vxe-table-iview"
          :edit-rules="validRules"
          height="530"
          show-overflow
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'row'}"
        >
          <vxe-table-column type="selection" width="60" min-width="60" fixed="left"></vxe-table-column>
          <vxe-table-column type="index" width="50" min-width="60" fixed="left">
            <template v-slot:header="{ column }">
              <span>#</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="equipmentName" title="清单项名称" :edit-render="{name: 'input'}" min-width="150" fixed="left"></vxe-table-column>
          <vxe-table-column field="price" title="单价" :edit-render="{name: 'input'}" min-width="100"></vxe-table-column>
          <vxe-table-column field="rentDay" title="使用天数" :edit-render="{name: 'input'}" min-width="130"></vxe-table-column>
          <vxe-table-column field="deductAmount" title="扣除金额" :edit-render="{name: 'input'}" min-width="130"></vxe-table-column>
          <vxe-table-column field="deductReason" title="扣除原因" :edit-render="{name: 'input'}" min-width="130"></vxe-table-column>
          <vxe-table-column field="subsidy" title="补贴金额" :edit-render="{name: 'input'}" min-width="130"></vxe-table-column>
          <vxe-table-column field="subsidyReason" title="补贴原因" :edit-render="{name: 'input'}" min-width="130"></vxe-table-column>
          <vxe-table-column field="payableAmount" title="应付金额" :edit-render="{name: 'input'}" min-width="130" fixed="right"></vxe-table-column>
          <vxe-table-column field="actualAmount" title="实付金额" :edit-render="{name: 'input'}" min-width="130" fixed="right"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="附件">
        <br />
        <Upload
          :headers="headers"
          :show-upload-list="false"
          :before-upload="handleUpload"
          :on-success="succeeded"
          name="files"
          :on-error="uploadFailure"
          :format="['jpg','jpeg','png']"
          :on-format-error="handleFormatError"
          multiple
          :action="`${baseUrl}/pcm/equipments/count/bill/attachments`"
        >
          <Form :label-width="100" inline class="top20">
            <Button icon="ios-cloud-upload-outline" type="primary">选择资质图片文件</Button>
          </Form>
        </Upload>
        <br />
        <Table ref="selection" border :columns="columns" :data="pictureData"></Table>
      </TabPane>
    </Tabs>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
import '@/view/financial/budgeting/offerBudget/state.less'
import { paramsValidate, isDataSuccess, formatTime, getToken, getRealname } from '@/libs/util'
import '../index.less'
import { getNumber, deleteImgData, newLeaseContract } from '@/api/leaseManagement/equipmentSettlement'
import { mapMutations } from 'vuex' // 关闭页面
import config from '@/config'
import bigImg from '@/components/big-img/Bigimg.vue'
export default {
  name: 'newSettlementDoc',
  components: {
    bigImg
  },
  data () {
    return {
      time:'',
      author: getRealname(),
      showImg: false,
      imgSrc: '',
      baseUrl: config.baseUrl.dev,
      headers: { Authorization: 'Bearer ' + getToken() },
      files: [],
      information: {
        billNumber: '',
        payDate: '',
        contractNumber: '',
        contractName: '',
        blank: '',
        blankAccount: '',
        payEe: '',
        payableAmount: '',
        actualAmount: '',
        deductExpense: '',
        subsidy: '',
        remark: '',
        operator: ''
      },
      ruleInline: {
        payDate: [

          { required: true, type: 'date', message: '请选择付款日期', trigger: 'change' }
        ],
        contractNumber: [
          { required: true, message: '请输入合同编号', trigger: 'blur' }
        ],
        contractName: [
          { required: true, message: '请输入合同名称', trigger: 'blur' }
        ],
        blank: [
          { required: true, message: '请输入开户银行', trigger: 'blur' }
        ],
        blankAccount: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
        ],
        payEe: [
          { required: true, message: '请输入收款单位', trigger: 'blur' }
        ],
        payableAmount: [
          { required: true, message: '请输入应付金额', trigger: 'blur' },
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}

        ],
        actualAmount: [
          { required: true, message: '请输入实付金额', trigger: 'blur' },
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
        ],
        deductExpense: [
          { required: true, message: '请输入扣除费用', trigger: 'blur' },
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
        ],
        subsidy: [
          { required: true, message: '请输入补贴费用', trigger: 'blur' },
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
        ],
        operator: [
          { required: true, message: '请输入经办人', trigger: 'blur' }
        ]
      },
      validRules: {
        equipmentName: [
          { required: true, type: 'string', message: '请填写清单项名称' }
        ],
        price: [
          { required: true, type: 'string', message: '请填写单价' },
            {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
            {type: 'number',max:999999999,message: '以超出系统最大数'},
        ],
        rentDay: [
          { required: true, type: 'string', message: '请填写使用天数' },
            {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
            {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
        ],
        deductAmount: [
          { required: true, type: 'string', message: '请填写扣除金额' },
            {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
            {type: 'number',max:999999999,message: '以超出系统最大数'},
        ],
        deductReason: [
          { required: true, type: 'string', message: '请写扣除原因' }
        ],
        subsidy: [
          { required: true, type: 'string', message: '请填写补贴金额' },
            {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
            {type: 'number',max:999999999,message: '以超出系统最大数'},
        ],
        subsidyReason: [
          { required: true, type: 'string', message: '请填写补贴原因' }
        ],
        payableAmount: [
          { required: true, type: 'string', message: '请填写应付金额' },
            {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
            {type: 'number',max:999999999,message: '以超出系统最大数'},
        ],
        actualAmount: [
          { required: true, type: 'string', message: '请填写实付金额' },
            {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
            {type: 'number',max:999999999,message: '以超出系统最大数'},
        ]
      },
      tableData: [],
      pictureData: [],
      columns: [
        {
          type: 'index',
          width: 50,
          align: 'center',
        },
        {
          title: '资质',
          key: 'imgUrl',
          render: (h, params) => {
            return h('img', {
              style: {// 设置样式
                width: '50px',
                height: '50px',
                'border-radius': '5%'
              },
              attrs: {// 设置属性
                src: params.row.imgUrl
              }
            })
          }
        },
        {
          title: '资质名称',
          key: 'name'

        },
        {
          title: '上传人',
          key: 'uploadUser',
          width: 100,
        },
        {
          title: '上传日期',
          key: 'uploadDate',
          width: 120,
        },
        {
          title: '操作',
          width: 130,
          key: 'handle',
          fixed: 'right',
          render: (h, params, vm) => {
            return [
              h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  'click': () => {
                    this.showImg = true
                    // 获取当前图片地址
                    console.log(params.row)
                    this.imgSrc = params.row.imgUrl
                  }
                },
                style: {
                  marginRight: '5px'
                }
              }, '查看'),
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
                    console.log(params.row)
                    this.deleteImg(params.row)
                  }
                }
              }, [
                h('Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '删除')])
            ]
          }
        }
      ]
    }
  },
  methods: {
    //  关闭页面方法
    ...mapMutations(['closeTag']),
    close () {
      this.closeTag({
        name: 'newSettlementDoc'
      })
    },
    // 添加表格一行
    insertEvent (row) {
      this.$refs.xTable.insertAt(row)
    },
    // 删除
    confirm () {
      if (this.$refs.xTable.getSelectRecords().length !== 0) {
        this.$Modal.confirm({
          title: '删除选中租赁机械设备',
          content: '<p>你确定要删除选中租赁机械用品吗?</p>',
          onOk: () => {
            this.$refs.xTable.removeSelecteds() //  删除表格中选中的数据
          }
        })
      } else {
        this.$Message.error('请选择删除的租赁机械')
      }
    },
    saveOrder (state) {
      console.log(this.files)
      // 获取表格数据
      const addTableData = this.$refs.xTable.getInsertRecords()
      const arryData = []
      if (addTableData.length !== 0) {
        addTableData.forEach(v => {
          let addTable = {}
          addTable.equipmentName = v.equipmentName
          addTable.price = v.price
          addTable.rentDay = v.rentDay
          addTable.deductAmount = v.deductAmount
          addTable.deductReason = v.deductReason
          addTable.subsidy = v.subsidy
          addTable.subsidyReason = v.subsidyReason
          addTable.payableAmount = v.payableAmount
          addTable.actualAmount = v.actualAmount
          arryData.push(addTable)
        })
      }
      const imgDataId = []
      if (this.pictureData.length !== 0) {
        this.pictureData.forEach(v => {
          imgDataId.push(v.id)
        })
      }
      this.$refs.information.validate((valid) => {
        if (valid) {
          this.$refs.xTable.validate(valids => {
            if (valids) {
              const data = {
                saveStatus: state,
                billNumber: this.information.billNumber,
                payDate: formatTime(this.information.payDate),
                contractNumber: this.information.contractNumber,
                contractName: this.information.contractName,
                blank: this.information.blank,
                blankAccount: this.information.blankAccount,
                payEe: this.information.payEe,
                payableAmount: this.information.payableAmount,
                actualAmount: this.information.actualAmount,
                deductExpense: this.information.deductExpense,
                subsidy: this.information.subsidy,
                operator: this.information.operator,
                remark: this.information.remark,
                equipmentVos: arryData,
                attachmentIds: imgDataId
              }
              console.log(data)
              newLeaseContract(data, JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
                    this.$Message.success(data.msgContent)
                    this.close()
                    this.$router.push({ name: 'equipmentSettlement' })
                    break
                }
              })
            }
          })
        }else {
          this.$Message.error('请填写基本信息')
        }
      })
    },
    deleteImg (row) {
      deleteImgData(row.id).then(res => {
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
            this.pictureData.splice(row._index, 1)
            this.$Message.success(data.msgContent)
            break
        }
      })
    },
    viewImg () {
      this.showImg = false
    },
    // 图片上传成功后的回调
    succeeded (res, files) {
      console.log(res.msgData[0])
      this.pictureData.push(res.msgData[0])
    },
    // 图片上传失败后的回调
    uploadFailure (error, files) {
      console.log(error)
      console.log(files)
    },
    // 上传图片验证
    handleFormatError (files) {
      this.$Message.warning({
        content: files.name + '文件类型不正确,请选择图片',
        duration: 3
      })
    },
    // 再次点击上传之前，清空之前已上传文件
    handleUpload (files) {
      this.files.push(files)
    },
    // 获取单据编号
    getNumberData () {
      getNumber(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
            this.information.billNumber = data.msgData
            break
        }
      })
    },
    getNowTime () {
      let date = new Date()
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      this.time = year + seperator1 + month + seperator1 + strDate
    },
  },
  mounted () {
    this.getNowTime()
    this.getNumberData()
  }
}
</script>

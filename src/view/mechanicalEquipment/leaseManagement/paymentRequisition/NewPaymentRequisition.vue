<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="name">编制人：{{author}}</p>
      <P class="time">创建日期:{{time}}</P>
      <P class="left" style="width: 185px">申请单编号：{{information.applyBillNumber}}</P>
      <div class="right">

        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="saveOrder(0)">&nbsp临时保存</Button>
        <Button class="btn" type="primary" @click="saveOrder(1)">&nbsp完成制单</Button>

      </div>
      <div class="clear"></div>
    </div>
    <Tabs value="name1" class="bottom20">
      <TabPane label="基本信息" name="name1">
        <Row type="flex" justify="center">
          <Col span="18">
            <br/>
            <br/>
            <Form ref="information" :model="information" :rules="ruleInline" :label-width="100">
              <Col span="12">
                <FormItem label="申请日期" prop="applyDate">
                  <DatePicker
                    v-model="information.applyDate"
                    type="date"
                    format="yyyy-MM-dd"
                    :transfer="true"
                    class="width"
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
                <FormItem label="收款单位" prop="payEe">
                  <Input v-model="information.payEe" class="width" :maxlength="30"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="应付金额" prop="payMount">
                  <Input v-model="information.payMount" class="width" :maxlength="12"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="备注">
                  <Input
                    v-model="information.remark"
                    class="width"
                    :maxlength="250"
                    type="textarea"
                    :autosize="{minRows: 3,maxRows: 5}"
                  ></Input>
                </FormItem>
              </Col>
            </Form>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="结算清单" name="name2">
        <br/>
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="insertEvent(-1)">&nbsp;新增结算清单项</Button>
          <Button class="search-btn" type="error" @click="confirm">&nbsp;批量删除</Button>
        </ButtonGroup>
        <br/>
        <br/>
        <vxe-table
          ref="xTable"
          border
          resizable
          class="vxe-table-iview"
          show-overflow
          height="530"
          :edit-rules="validRules"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'row'}"
        >
          <vxe-table-column type="selection" width="60"></vxe-table-column>
          <vxe-table-column type="index" width="50">
            <template v-slot:header="{ column }">
              <span>#</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="payBillName" title="清单项名称" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="price" title="单价" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="useDay" title="使用天数" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="payMount" title="应付金额" :edit-render="{name: 'input'}"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="附件">
        <br/>

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
          :action="`${baseUrl}/pcm/equipments/rent/pay_apply_bill/attachment`"
        >
          <Form :label-width="100" inline class="top20">
            <Button icon="ios-cloud-upload-outline" type="primary">选择资质图片文件</Button>
          </Form>
        </Upload>
        <br/>
        <Table ref="selection" border :columns="columns" :data="pictureData"></Table>
      </TabPane>
    </Tabs>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
    import '@/view/financial/budgeting/offerBudget/state.less'
    import {paramsValidate, isDataSuccess, formatTime, getToken, getRealname} from '@/libs/util'
    import {mapMutations} from 'vuex' // 关闭页面
    import {getNumber, deleteImgData, newLeaseContract} from '@/api/leaseManagement/paymentRequisition'
    import config from '@/config'
    import bigImg from '@/components/big-img/Bigimg.vue'

    export default {
        name: 'NewPaymentRequisition',
        components: {
            bigImg
        },
        data() {
            return {
                time: '',
                author: getRealname(),
                showImg: false,
                imgSrc: '',
                baseUrl: config.baseUrl.dev,
                headers: {Authorization: 'Bearer ' + getToken()},
                files: [],
                information: {
                    applyBillNumber: '',
                    applyDate: '',
                    payEe: '',
                    contractNumber: '',
                    contractName: '',
                    payMount: '',
                    remark: ''
                },
                ruleInline: {
                    applyDate: [
                        {required: true, type: 'date', message: '请选择申请日期', trigger: 'change'}
                    ],
                    contractNumber: [
                        {required: true, message: '请输入合同编号', trigger: 'blur'}
                    ],
                    payEe: [
                        {required: true, message: '请输入收款单位', trigger: 'blur'}
                    ],
                    contractName: [
                        {required: true, message: '请输入合同名称', trigger: 'blur'}
                    ],
                    payMount: [
                        {required: true, message: '请输入应付金额', trigger: 'blur'},
                        {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
                    ]
                },
                validRules: {
                    payBillName: [
                        {required: true, type: 'string', message: '请输入清单名称'}
                    ],
                    price: [
                        {required: true, type: 'string', message: '请输入设备单价'},
                        {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
                        {type: 'number',max:999999999,message: '以超出系统最大数'},
                    ],
                    useDay: [
                        {required: true, type: 'string', message: '请输入设备使用天数'},
                        {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
                        {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
                    ],
                    payMount: [
                        {required: true, type: 'string', message: '请输入应付金额'},
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
            close() {
                this.closeTag({
                    name: 'NewPaymentRequisition'
                })
            },
            // 添加表格一行
            insertEvent(row) {
                this.$refs.xTable.insertAt(row)
            },
            // 删除
            confirm() {
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
            saveOrder(state) {
                console.log(this.files)
                // 获取表格数据
                const addTableData = this.$refs.xTable.getInsertRecords()
                const arryData = []
                if (addTableData.length !== 0) {
                    addTableData.forEach(v => {
                        let addTable = {}
                        addTable.payBillName = v.payBillName
                        addTable.price = v.price
                        addTable.useDay = v.useDay
                        addTable.payMount = v.payMount
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
                                    projectId: JSON.parse(localStorage.getItem('projectId')).id,
                                    applyBillNumber: this.information.applyBillNumber,
                                    applyDate: formatTime(this.information.applyDate),
                                    payEe: this.information.payEe,
                                    contractNumber: this.information.contractNumber,
                                    contractName: this.information.contractName,
                                    payMount: this.information.payMount,
                                    remark: this.information.remark,
                                    rentPayBillVos: arryData,
                                    attachmentIds: imgDataId
                                }
                                console.log(data)
                                newLeaseContract(data).then(res => {
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
                                            this.$router.push({name: 'paymentRequisition'})
                                            break
                                    }
                                })
                            }
                        })
                    } else {
                        this.$Message.error('请填写基本信息')
                    }
                })
            },
            deleteImg(row) {
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
            viewImg() {
                this.showImg = false
            },
            // 图片上传成功后的回调
            succeeded(res, files) {
                console.log(res.msgData[0])
                this.pictureData.push(res.msgData[0])
            },
            // 图片上传失败后的回调
            uploadFailure(error, files) {
                console.log(error)
                console.log(files)
            },
            // 上传图片验证
            handleFormatError(files) {
                this.$Message.warning({
                    content: files.name + '文件类型不正确,请选择图片',
                    duration: 3
                })
            },
            // 再次点击上传之前，清空之前已上传文件
            handleUpload(files) {
                this.files.push(files)
            },
            // 获取单据编号
            getNumberData() {
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
                            this.information.applyBillNumber = data.msgData
                            break
                    }
                })
            },
            getNowTime() {
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
        mounted() {
            this.getNowTime()
            this.getNumberData()
        }
    }
</script>

<style scoped lang="less">
  .width {
    width: 80%;
  }

  .search-btn {
    margin-left: 10px;
  }

  .textBox {
    margin-left: 15px;
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    background-color: #e3e8ee;

    p {
      margin-right: 20px;
    }
  }

  .right {
    float: right;
  }

  .left {
    float: left;
  }

  .clear {
    clear: both;
  }
</style>

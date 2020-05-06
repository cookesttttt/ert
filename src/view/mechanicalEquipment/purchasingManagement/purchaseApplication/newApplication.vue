<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="name">编制人：{{author}}</p>
      <P class="time">创建日期:{{time}}</P>
      <P class="left" style="width: 185px">申请单编号：{{billNumber}}</P>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)">&nbsp临时保存</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)">&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div>
      <Tabs value="name1" class="bottom20">
        <TabPane label="基本信息" name="name1">
          <br/>
          <br/>
          <Row type="flex" justify="center">
            <Col span="10">
              <Form ref="basic" :model="information" :rules="ruleInline" :label-width="110">
                <Col span="24">
                  <FormItem label="购置时间" prop="acquisitionTime">
                    <DatePicker
                      v-model="information.acquisitionTime"
                      type="date"
                      class="width"
                      format="yyyy-MM-dd"
                      :transfer="true"
                    ></DatePicker>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="总金额(元)" prop="aggregateAmount">
                    <Input v-model="information.aggregateAmount " class="width"  :maxlength="12"></Input>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="购置原因">
                    <Input
                      v-model="information.reasonPurchase"
                      type="textarea"
                      :rows="3"
                      class="width"
                      :maxlength="128"
                    ></Input>
                  </FormItem>
                </Col>
              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="设备清单" name="name2">
          <br/>
          <ButtonGroup>
            <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;增加机械设备</Button>
            <Button class="search-btn" type="error" @click="confirm">&nbsp;批量删除</Button>
          </ButtonGroup>
          <br/>
          <br/>
          <vxe-table
            ref="xTable"
            border
            resizable
            height="530"
            class="vxe-table-iview"
            show-overflow
            :data="tableData"
            :edit-rules="validRules"
            :edit-config="{trigger: 'click', mode: 'cell'}"
          >
            <vxe-table-column type="selection" min-width="50" fixed="left" width="50"></vxe-table-column>
            <vxe-table-column type="index" min-width="60" fixed="left" width="50">
              <template v-slot:header="{ column }">
                <span>#</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="name"
                              title="机械名称"
                              :edit-render="{type: 'default'}"
                              min-width="130"
                              fixed="left">
              <template v-slot:edit="{row}">
                <AutoComplete
                  @on-change="changeName"
                  :filterMethod="filterMethod"
                  v-model="row.name"
                  :data="nameAll">
                </AutoComplete>
              </template>
            </vxe-table-column>
            <vxe-table-column field="model"
                              title="机械型号"
                              :edit-render="{type: 'default'}"
                              min-width="120">
              <template v-slot:edit="{row}">
                <AutoComplete
                  :filterMethod="filterMethod2"
                  v-model="row.model"
                  :data="modelAll">
                </AutoComplete>
              </template>
            </vxe-table-column>
            <vxe-table-column field="power" title="设备功率" :edit-render="{name: 'input'}"
                              min-width="120"></vxe-table-column>
            <vxe-table-column field="price" title="单价(元)" :edit-render="{name: 'input'}"
                              min-width="120"></vxe-table-column>
            <vxe-table-column field="count" title="数量" :edit-render="{name: 'input'}"
                              min-width="120"></vxe-table-column>
            <vxe-table-column field="tclArgs" title="技术参数" :edit-render="{name: 'input'}"
                              min-width="150"></vxe-table-column>
            <vxe-table-column field="id" title="供应商" :edit-render="{type: 'default'}" min-width="170" fixed="right">
              <template v-slot:edit="scope">
                <Select
                  v-model="scope.row.id"
                  @change="$refs.xTable.updateStatus(scope)"
                  :transfer="true"
                >
                  <Option
                    v-for="item in sexList"
                    :value="item.id"
                    :key="item.value"
                  >{{ item.value }}
                  </Option>
                </Select>
              </template>
              <template v-slot="{ row }">{{ getSelectLabel(row.id, sexList) }}</template>
            </vxe-table-column>
            <vxe-table-column field="totalPrice" title="总价(元)" :edit-render="{name: 'input'}" min-width="170"
                              fixed="right"></vxe-table-column>
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
            :action="`${baseUrl}/pcm/equipments/purchasing_bills/attachments`"
          >
            <Form :label-width="110" inline class="top20">
              <Button icon="ios-cloud-upload-outline" type="primary">选择附件</Button>
            </Form>
          </Upload>
          <br/>
          <Table border :columns="columns" :data="pictureData"></Table>
        </TabPane>
      </Tabs>
    </div>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate, isDataSuccess, formatTime, getToken, getRealname} from '@/libs/util'
  import '../index.less'
  import {mapMutations} from 'vuex' // 关闭页面
  import {
    newApplicationData,
    getSuppliers,
    getOrderNumber,
    deleteImgData,
    nameData,
    modelData,
    powerData,
  } from '@/api/purchasingManagement/purchaseApplication'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'

  export default {
    name: 'newApplication',
    components: {
      bigImg
    },
    data() {
      return {
        nameAll: [],
        modelAll: [],
        time:'',

        author: getRealname(),
        showImg: false,
        imgSrc: '',
        headers: {Authorization: 'Bearer ' + getToken()},
        baseUrl: axios.baseUrl,
        files: [],
        billNumber: '',
        information: {
          acquisitionTime: '',
          aggregateAmount: '',
          reasonPurchase: ''
        },
        ruleInline: {
          acquisitionTime: [
            {required: true, type: 'date', message: '请选择购置时间', trigger: 'change'}
          ],
          aggregateAmount: [
            {required: true, message: '请输入总金额', trigger: 'blur'},
            {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
          ]
        },
        sexList: [],
        // 设备清单数据
        pictureData: [],
        // 附件表格数据
        tableData: [],
        validRules: {
          name: [
            {required: true, type: 'string', message: '请输入产品名称'}
          ],
          model: [
            {required: true, type: 'string', message: '请输入产品型号'}
          ],
          power: [
            {required: true, type: 'string', message: '请输入额定功率'}
          ],
          count: [
            {required: true, type: 'number', message: '请输入产品数量'},
            {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
            {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
          ],
          price: [
            {required: true, type: 'number', message: '请输入产品单价'},
              {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
              {type: 'number',max:999999999,message: '以超出系统最大数'},
          ],
          tclArgs: [
            {required: true, type: 'string', message: '请输入技术参数'}
          ],
          id: [
            {required: true, type: 'string', message: '请选择供应商'}
          ],
          totalPrice: [
            {required: true, type: 'number', message: '请输入产品总价'},
              {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
              {type: 'number',max:999999999,message: '以超出系统最大数'},
          ]
        },
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
            width:100,
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
          name: 'newApplication'
        })
      },
      // 删除图片
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
      getSelectLabel(value, list) {
        let item = null
        list.forEach(v => {
          if (v.id === value) {
            item = v.value
          }
        })
        return item || null
      },
      clickFinish(state) {
        console.log(this.$refs.xTable.getInsertRecords())
        console.log(this.files)
        // 获取表格数据
        const addTableData = this.$refs.xTable.getInsertRecords()
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}
            addTable.name = v.name
            addTable.power = v.power
            addTable.model = v.model
            addTable.count = v.count
            addTable.price = v.price
            addTable.tclArgs = v.tclArgs
            addTable.supplierId = v.id
            addTable.totalPrice = v.totalPrice
            arryData.push(addTable)
          })
        }
        const imgDataId = []
        if (this.pictureData.length !== 0) {
          this.pictureData.forEach(v => {
            imgDataId.push(v.id)
          })
        }
        this.$refs.basic.validate((valid) => {
          if (valid) {
            this.$refs.xTable.validate(valid1 => {
              if (valid1) {
                const data = {
                  saveStatus: state,
                  projectId: JSON.parse(localStorage.getItem('projectId')).id,
                  // 编号
                  billNumber: this.billNumber,
                  applyDate: formatTime(this.information.acquisitionTime),
                  reason: this.information.reasonPurchase,
                  totalPrice: this.information.aggregateAmount,
                  equipments: arryData,
                  attachmentIds: imgDataId
                }
                console.log(data)
                newApplicationData(data).then(res => {
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
                      this.close()
                      this.$router.push({name: 'purchaseApplication'})
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
      // 添加表格一行
      insertEvent(row) {
        this.$refs.xTable.insertAt(row, -1)
      },
      // 图片上传成功后的回调
      succeeded(res, files) {
        console.log(res)
        this.pictureData.push(res.msgData[0])
      },
      // 图片上传失败后的回调
      uploadFailure(error, files) {
        console.log(error)
        console.log(files)
      },
      // 再次点击上传之前，清空之前已上传文件
      handleUpload(files) {
        this.files.push(files)
      },
      //上传图片验证
      handleFormatError(files) {
        this.$Message.warning({
          content: files.name + '文件类型不正确,请选择图片',
          duration: 3
        })
      },
      // 删除
      confirm() {
        if (this.$refs.xTable.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中机械设备',
            content: '<p>你确定要删除选中机械用品吗?</p>',
            onOk: () => {
              this.$refs.xTable.removeSelecteds() //  删除表格中选中的数据
            }
          })
        } else {
          this.$Message.error('请选择删除的产品')
        }
      },
      //  获取供应商
      getSuppliersData() {
        getSuppliers(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
          const data = res.data
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break;
            case 2:
              this.$Message.error(data.msgContent)
              break;
            default:
              console.log(data.msgData)
              if (data.msgData) {
                data.msgData.forEach(v => {
                  const suppliersData = {}
                  suppliersData.id = v.id
                  suppliersData.value = v.name
                  this.sexList.push(suppliersData)
                })

                console.log(this.sexList)
              }
              break
          }
        })
      },
      //  获取单号
      getNumber() {
        getOrderNumber(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
          const data = res.data
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break;
            case 2:
              this.$Message.error(data.msgContent)
              break;
            default:
              console.log(data.msgData)
              this.billNumber = data.msgData
              break
          }
        })
      },

      filterMethod(value, option) {
        if (value) {
          return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        }
      },
      changeName(value) {
        if (value) {
          this.getModel(value)
        }
      },
      getName() {
        nameData(JSON.parse(localStorage.getItem('projectId')).id, '').then(res => {
          const data = res.data
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break;
            case 2:
              this.$Message.error(data.msgContent)
              break;
            default:
              console.log(data)
              if (data.msgData) {
                let modelStrArray = []
                data.msgData.forEach(v => {
                  modelStrArray.push(v.name)
                  this.nameAll = modelStrArray
                })
              }
              break
          }
        })
      },
      filterMethod2(value, option) {
        console.log(this.modelAll)
        console.log(value)
        console.log(option)
        if (value) {
          return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        }
      },
      getModel(val) {
        modelData(JSON.parse(localStorage.getItem('projectId')).id, val, '').then(res => {
          const data = res.data
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break;
            case 2:
              this.$Message.error(data.msgContent)
              break;
            default:
              console.log(data)
              if (data.msgData) {
                let modelStrArray = []
                data.msgData.forEach(v => {
                  modelStrArray.push(v.model)
                  this.modelAll = modelStrArray
                })
              }

              break
          }
        })
      },
      // 获取当前时间
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
    mounted() {
      this.getNowTime()
      this.getSuppliersData()
      this.getNumber()
      this.getName()
    },
  }
</script>

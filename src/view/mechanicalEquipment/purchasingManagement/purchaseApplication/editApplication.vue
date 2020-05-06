<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="state" v-if="this.saveStatus===1">状态:完成</p>
      <p class="state" v-else>状态:<span style="color: red">未完成</span></p>
      <p class="time">创建日期:{{createDate}}</p>
      <p class="name">编制人:{{author}}</p>
      <P class="left" style="width: 185px">单据编号:{{billNumber}}</P>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)" v-bind:disabled="this.saveStatus===1">&nbsp临时保存</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-if="this.saveStatus===1">&nbsp提交</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-else>&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <Tabs value="name1" class="bottom20">
      <TabPane label="申请单基本信息" name="name1">
        <br><br>
        <Row type="flex" justify="center">
          <Col span="10">
            <Form ref="basic" :model="information" :rules="ruleInline" :label-width="110">
              <Col span="24">
                <FormItem label="购置时间" prop="acquisitionTime">
                  <DatePicker v-model="information.acquisitionTime" type="date" class="width"
                              format='yyyy-MM-dd' :transfer="true"></DatePicker>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="总金额(元)" prop="aggregateAmount">
                  <Input v-model="information.aggregateAmount  " class="width" :maxlength="12"></Input>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="购置原因">
                  <Input v-model="information.reasonPurchase" type="textarea" :rows="3" class="width"
                         :maxlength="500"></Input>
                </FormItem>
              </Col>
            </Form>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="设备清单" name="name2">
        <br>
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;增加机械设备</Button>
          <Button class="search-btn" type="error" @click="confirm">&nbsp;批量删除</Button>
        </ButtonGroup>
        <br><br>
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
          <vxe-table-column field="name" title="机械名称"
                            :edit-render="{name: 'input'}"
                            min-width="130"
                            fixed="left"></vxe-table-column>
          <vxe-table-column field="model"
                            title="机械型号"
                            :edit-render="{name: 'input'}"
                            min-width="120"
          ></vxe-table-column>
          <vxe-table-column field="power"
                            title="设备功率"
                            min-width="120"
                            :edit-render="{name: 'input'}">

          </vxe-table-column>
          <vxe-table-column field="price"
                            title="单价(元)"
                            min-width="120"
                            :edit-render="{name: 'input'}"
          ></vxe-table-column>
          <vxe-table-column field="count" title="数量"
                            min-width="120"
                            :edit-render="{name: 'input'}"
          ></vxe-table-column>
          <vxe-table-column field="tclArgs" title="技术参数" :edit-render="{name: 'input'}"
                            min-width="150"></vxe-table-column>
          <vxe-table-column field="ids" title="供应商" :edit-render="{type: 'default'}" min-width="170" fixed="right">
            <template v-slot:edit="scope">
              <Select v-model="scope.row.ids" @change="$refs.xTable.updateStatus(scope)" :transfer="true">
                <Option v-for="item in sexList" :value="item.ids" :key="item.value">{{ item.value }}</Option>
              </Select>
            </template>
            <template v-slot="{ row }">{{ getSelectLabel(row, sexList) }}</template>
          </vxe-table-column>
          <vxe-table-column field="totalPrice" title="总价(元)" :edit-render="{name: 'input'}"
                            min-width="170"
                            fixed="right"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="附件">
        <br>
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
          :action="`${baseUrl}/pcm/equipments/purchasing_bills/attachments`">
          <Form
            :label-width="110"
            class="top20">
            <Button icon="ios-cloud-upload-outline" type="primary">选择资质图片文件</Button>
          </Form>
        </Upload>
        <br>
        <Table
          border
          :columns="columns"
          :data="pictureData">
        </Table>
      </TabPane>
    </Tabs>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
    import '@/view/financial/budgeting/offerBudget/state.less'
    import '../index.less'
    import {paramsValidate, isDataSuccess, formatTime, getToken, getRealname} from '@/libs/util'
    import {mapMutations} from 'vuex' // 关闭页面
    import {
        editApplication,
        getSuppliers,
        getdetails,
        deleteImgData,
        deleteEquipment
    } from '@/api/purchasingManagement/purchaseApplication'
    import axios from '@/libs/api.request'
    import bigImg from '@/components/big-img/Bigimg.vue'

    export default {
        name: "editApplication",
        components: {
            bigImg
        },
        data() {
            return {
                createDate: '',
                author: getRealname(),
                showImg: false,
                imgSrc: '',
                headers: {Authorization: 'Bearer ' + getToken()},
                baseUrl: axios.baseUrl,
                files: [],
                itemId: '',
                saveStatus: '',
                billNumber: '',
                information: {
                    acquisitionTime: '',
                    aggregateAmount: '',
                    reasonPurchase: '',
                },
                ruleInline: {
                    acquisitionTime: [
                        {required: true, type: 'date', message: '请选择购置时间', trigger: 'change'}
                    ],
                    aggregateAmount: [
                        {required: true, message: '请输入总金额', trigger: 'blur'},
                        {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
                    ],
                },
                sexList: [],

                pictureData: [],
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
                    ],
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
                                style: {//设置样式
                                    width: '50px',
                                    height: '50px',
                                    'border-radius': '5%'
                                },
                                attrs: {//设置属性
                                    src: params.row.imgUrl
                                }
                            });
                        }
                    },
                    {
                        title: '资质名称',
                        key: 'name',

                    },
                    {
                        title: '上传人',
                        key: 'uploadUser',
                        width: 100
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
                                            this.showImg = true;
                                            // 获取当前图片地址
                                            console.log(params.row)
                                            this.imgSrc = params.row.imgUrl;
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
                                        }, '删除')]),
                            ]
                        }
                    }
                ],

            }
        },
        methods: {
            //  关闭页面方法
            ...mapMutations(['closeTag']),
            close() {
                this.closeTag({
                    name: 'editApplication'
                })
            },
            viewImg() {
                this.showImg = false;
            },
            getSelectLabel(value, list) {
                let item = null
                console.log(value.supplierId)
                console.log(list)
                list.forEach(v => {
                    if (v.ids === value.supplierId) {
                        item = v.value
                    }
                })
                console.log(item)
                return item ? item : null
            },
            //删除图片
            deleteImg(row) {
                console.log(row)
                deleteImgData(row.id).then(res => {
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
                            this.pictureData.splice(row._index, 1)
                            this.$Message.success(data.msgContent)
                            break
                    }
                })
            },
            clickFinish(state) {
                //获取表格数据
                const addTableData = this.$refs.xTable.getTableData().fullData
                const arryData = []
                if (addTableData.length !== 0) {
                    console.log(addTableData)
                    addTableData.forEach(v => {
                        let addTable = {}
                        addTable.name = v.name
                        addTable.id = v.id
                        addTable.power = v.power
                        addTable.model = v.model
                        addTable.count = v.count
                        addTable.price = v.price
                        addTable.tclArgs = v.tclArgs
                        addTable.supplierId = v.ids
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
                                console.log(arryData)
                                const data = {
                                    saveStatus: state,
                                    projectId: JSON.parse(localStorage.getItem("projectId")).id,
                                    //编号
                                    billNumber: this.billNumber,
                                    applyDate: formatTime(this.information.acquisitionTime),
                                    reason: this.information.reasonPurchase,
                                    totalPrice: this.information.aggregateAmount,
                                    equipments: arryData,
                                    attachmentIds: imgDataId
                                }
                                console.log(data)
                                editApplication(data, this.itemId).then(res => {
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
                                            this.close()
                                            this.$router.push({name: 'purchaseApplication'});
                                            break
                                    }
                                })
                            }
                        })
                    }
                })
            },
            //添加表格一行
            insertEvent(row) {
                this.$refs.xTable.insertAt(row, -1)
            },
            //图片上传成功后的回调
            succeeded(res, files) {
                this.pictureData.push(res.msgData[0])
                console.log(res)
                console.log(files)
            },
            //图片上传失败后的回调
            uploadFailure(error, files) {
                console.log(error)
                console.log(files)
            },
            //上传图片验证
            handleFormatError(files) {
                this.$Message.warning({
                    content: files.name + '文件类型不正确,请选择图片',
                    duration: 3
                })
            },
            //再次点击上传之前，清空之前已上传文件
            handleUpload(files) {
                this.files.push(files);
                // this.$refs.upload.clearFiles()
            },
            //删除设备
            deleteEquipmentdata() {
                console.log(this.$refs.xTable.getSelectRecords())
                const selectData = this.$refs.xTable.getSelectRecords()
                const dataId = {'ids': []}
                if (selectData.length !== 0) {
                    selectData.forEach(v => {
                        if (v.id) {
                            dataId.ids.push(v.id)
                        }
                    })
                    deleteEquipment(dataId).then(res => {
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
                                break
                        }
                    })
                }
                console.log(dataId)
            },
            //删除
            confirm() {
                const checkedData = this.$refs.xTable.getSelectRecords()
                if (checkedData.length !== 0) {
                    this.$Modal.confirm({
                        title: '删除选中机械设备',
                        content: '<p>你确定要删除选中机械用品吗?</p>',
                        onOk: () => {
                            this.deleteEquipmentdata()
                            this.$refs.xTable.removeSelecteds()
                        },
                    });
                } else {
                    this.$Message.error('请选择删除的产品')
                }
            },
            //  获取供应商
            getSuppliersData() {
                getSuppliers(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
                    const data = res.data;
                    let status = isDataSuccess(res);
                    switch (status) {
                        case 1:
                            this.$Message.error("服务器繁忙请稍后");
                            break;
                        case 2:
                            this.$Message.error(data.msgContent);
                            break;
                        default:
                            console.log(data.msgData)
                            if (data.msgData) {
                                let list = []
                                data.msgData.forEach(v => {
                                    const suppliersData = {}
                                    suppliersData.ids = v.id
                                    suppliersData.value = v.name
                                    list.push(suppliersData)
                                    this.sexList = list
                                })
                                console.log(this.sexList)
                            }

                            break;
                    }
                }).then(res => {
                    this.getEcho()
                })
            },
            //  获取回显数据 详情
            getEcho() {
                getdetails(this.itemId).then(res => {
                    const data = res.data;
                    let status = isDataSuccess(res);
                    switch (status) {
                        case 1:
                            this.$Message.error("服务器繁忙请稍后");
                            break;
                        case 2:
                            this.$Message.error(data.msgContent);
                            break;
                        default:
                            console.log(data.msgData)
                            this.saveStatus = data.msgData.saveStatus
                            this.createDate = data.msgData.createDate
                            this.billNumber = data.msgData.billNumber
                            this.information.acquisitionTime = new Date(data.msgData.applyDate)
                            this.information.reasonPurchase = data.msgData.reason
                            this.information.aggregateAmount = data.msgData.totalPrice.toString()
                            this.tableData = data.msgData.equipments
                            this.pictureData = data.msgData.attachmentVos
                            break;
                    }
                })
            },
        },
        activated() {
            this.itemId = sessionStorage.getItem('editApplicationId')
            this.getSuppliersData()

        },
    }
</script>

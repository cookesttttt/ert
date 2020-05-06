<template>
  <Card>
    <div class="bottom15">
      <Button class="search-btn" type="primary" @click="isAddModal=true">&nbsp;新建机械类型</Button>
      <Modal
        title="新建机械类型信息"
        v-model="isAddModal"
        :mask-closable="false"
        @on-cancel="cancel(1)">
        <Form
          ref="mechanicalType"
          :model="mechanicalType"
          :label-width="100" inline :rules="rules">
          <FormItem label="机械类型编码" prop="encoded">
            <Input v-model="mechanicalType.encoded" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="机械类型名称" prop="name">
            <Input v-model="mechanicalType.name" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="机械类型型号" prop="model">
            <Input v-model="mechanicalType.model" class="width350" :maxlength="15"></Input>
          </FormItem>
          <FormItem label="额定功率" prop="power">
            <Input v-model="mechanicalType.power" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="单位" prop="unit">
            <Input v-model="mechanicalType.unit" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="机械类型备注" prop="remark">
            <Input v-model="mechanicalType.remark" class="width350" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                   :maxlength="128"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel(1)">取消</Button>
          <Button type="primary" size="large" @click="addMechanicalType">保存</Button>
        </div>
      </Modal>
      <!--收搜-->
      <div class="right" style="float: right">
        <Input class="search-input" placeholder="请依据名称与功率收搜" v-model="searchValue"></Input>
        <Button class="search-btn" type="primary" @click="searchMechanicalType">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>
    </div>
    <div class="clear"></div>
    <!--表格-->
    <Table
      border
      :columns="columns"
      :data="tableData">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <Page :total="totalElements"
              :current="pageNum"
              show-total
              @on-change="changePage">
        </Page>
      </div>
    </div>
    <!--编辑弹框-->
    <Modal
      title="编辑机械类型信息"
      v-model="isEditModal"
      :mask-closable="false"
      @on-cancel="cancel(2)">
      <Form
        ref="editMechanicalType"
        :model="editMechanicalType"
        :label-width="100" inline :rules="rules">
        <FormItem label="机械类型编码" prop="encoded">
          <Input v-model="editMechanicalType.encoded" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="机械类型名称" prop="name">
          <Input v-model="editMechanicalType.name" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="机械类型型号" prop="model">
          <Input v-model="editMechanicalType.model" class="width350" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="额定功率" prop="power">
          <Input v-model="editMechanicalType.power" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="单位" prop="unit">
          <Input v-model="editMechanicalType.unit" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="机械类型备注" prop="remark">
          <Input v-model="editMechanicalType.remark" class="width350" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                 :maxlength="128"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel(2)">取消</Button>
        <Button type="primary" size="large" @click="editMechanicalTypeData">保存</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
    import './index.less'
    /**
     *  paramsValidate 验证是否为空
     *  isDataSuccess 验证数据是否成功
     * */
    import {paramsValidate, isDataSuccess} from '@/libs/util'
    import {
        newMechanicalTypeData,
        getAllMechanicalTypeData,
        deleteMechanicalTypeData,
        getEditMechanicalTypeData
    } from '@/api/mechanicalEquipment/mechanicalType'

    export default {
        name: "mechanicalType",
        data() {
            return {
                isAddModal: false,
                isEditModal: false,
                searchValue: '',
                tableData: [],                    // 表格数据
                mechanicalType: {
                    encoded: '',
                    name: '',
                    model: '',
                    power: '',
                    unit: '',
                    remark: ''
                },
                editMechanicalType: {
                    encoded: '',
                    name: '',
                    model: '',
                    power: '',
                    unit: '',
                    remark: '',
                    id: ''
                },
                pageNum: 1,                     // 当前页码
                pageSize: 10,                  // 每页显示多少条
                totalElements: 0,             // 初始化信息总条数
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'number',
                        tooltip:true
                    },
                    {
                        title: '名称',
                        key: 'name',
                        tooltip:true
                    },
                    {
                        title: '额定功率',
                        tooltip:true,
                        key: 'power',
                    },
                    {
                        title: '型号',
                        key: 'model',
                        tooltip: true
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        tooltip: true
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        tooltip: true
                    },
                    {
                        title: '操作',
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
                                            this.echoData(params.index)
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
                                                this.deleteMechanicalType(params.index)
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
                rules: {                         // 必填项的验证
                    encoded: [
                        {
                            required: true,
                            message: '请输入设备类别的编码',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: '请输入设备类别名称',
                            trigger: 'blur'
                        }
                    ],
                    model: [
                        {
                            required: true,
                            message: '请输入设备类别型号',
                            trigger: 'blur'
                        }
                    ],
                    power: [
                        {
                            required: true,
                            message: '请输入设备额定功率',
                            trigger: 'blur'
                        }
                    ],
                    unit: [
                        {
                            required: true,
                            message: '请输入设备类别的单位',
                            trigger: 'blur'
                        }
                    ],
                },
            }
        },
        methods: {
            // 添加设备类型
            addMechanicalType() {
                this.$refs.mechanicalType.validate((valid) => {
                    console.log(valid)
                    if (valid) {
                        const data = {
                            'number': this.mechanicalType.encoded,
                            'name': this.mechanicalType.name,
                            'model': this.mechanicalType.model,
                            'power': this.mechanicalType.power,
                            'unit': this.mechanicalType.unit,
                            'remark': this.mechanicalType.remark,
                            'projectId': JSON.parse(localStorage.getItem('projectId')).id
                        }
                        newMechanicalTypeData(data).then(res => {
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
                                    this.getAllData(this.pageNum)                           // 拉一次数据
                                    this.cancel(1)
                                    this.$Message.success(data.msgContent)
                                    break
                            }
                        })
                    }
                })
            },
            searchMechanicalType() {
                this.pageNum = 1
                this.getAllData(this.pageNum)
            },
            // 编辑设备类型
            editMechanicalTypeData() {
                this.$refs.editMechanicalType.validate(v => {
                    if (v) {
                        const data = {
                            'number': this.editMechanicalType.encoded,
                            'name': this.editMechanicalType.name,
                            'model': this.editMechanicalType.model,
                            'power': this.editMechanicalType.power,
                            'unit': this.editMechanicalType.unit,
                            'remark': this.editMechanicalType.remark,
                            'projectId': JSON.parse(localStorage.getItem('projectId')).id
                        }
                        getEditMechanicalTypeData(data, this.editMechanicalType.id).then(res => {
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
                    }
                })
            },
            /**
             * 编辑数据回显
             **/
            echoData(index) {
                console.log(this.tableData[index])
                this.isEditModal = true
                this.editMechanicalType.encoded = this.tableData[index].number
                this.editMechanicalType.name = this.tableData[index].name
                this.editMechanicalType.model = this.tableData[index].model
                this.editMechanicalType.power = this.tableData[index].power
                this.editMechanicalType.unit = this.tableData[index].unit
                this.editMechanicalType.remark = this.tableData[index].remark
                this.editMechanicalType.id = this.tableData[index].id
            },
            /**
             * 删除
             * */
            deleteMechanicalType(index) {
                deleteMechanicalTypeData(this.tableData[index].id).then(res => {
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
             *关闭弹框
             * status等于1为新建框的关闭
             */
            cancel(status) {
                if (status === 1) {
                    this.$refs.mechanicalType.resetFields()  // 清空
                    this.isAddModal = false
                } else {
                    this.$refs.editMechanicalType.resetFields()  // 清空
                    this.isEditModal = false
                }
            },
            /**
             * 分页
             * */
            changePage(index) {
                this.pageNum = index
                this.getAllData(this.pageNum)
            },
            /**
             * 获取全部数据
             * */
            getAllData(pageNum) {
                getAllMechanicalTypeData(pageNum, this.pageSize, JSON.parse(localStorage.getItem('projectId')).id, this.searchValue).then(res => {
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
                                this.tableData = data.msgData.content
                                this.totalElements = data.msgData.totalElements
                                break
                        }
                    }
                )
            },
        },
        mounted() {
            this.getAllData(this.pageNum)
        }

    }
</script>

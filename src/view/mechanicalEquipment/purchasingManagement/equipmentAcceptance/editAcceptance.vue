<template>
  <Card style="height: 100%;overflow: auto">
    <Row type="flex" justify="center">
      <Col span="18">
        <Form ref="checkAndAccept" :model="information" :rules="ruleInline" :label-width="100">
          <Col span="12">
            <FormItem label="设备名称" prop="name">
              <Input v-model="information.name" class="width" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="合同编号:" prop="contractNumber">
              <Select v-model="information.contractNumber" class="width">
                <Option v-for="item in category" :value="item">{{ item }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="设备型号" prop="model">
              <Input v-model="information.model" class="width" :maxlength="30"></Input>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="购买时间" prop="purchasingDate">
              <DatePicker v-model="information.purchasingDate" type="date" class="width"
                          format='yyyy-MM-dd'></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="验收时间" prop="acceptDate">
              <DatePicker v-model="information.acceptDate" type="date" class="width"
                          format='yyyy-MM-dd'></DatePicker>
            </FormItem>
          </Col>


          <Col span="12">
            <FormItem label="购买厂家" prop="supplier">
              <Input v-model="information.supplier" class="width" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="厂家电话" prop="supplierPhone">
              <Input v-model="information.supplierPhone" class="width" :maxlength="15"></Input>
            </FormItem>
          </Col>


          <Col span="12">
            <FormItem label="购买数量" prop="purchasingCount">
              <Input v-model="information.purchasingCount" class="width" :maxlength="6"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="购买单价(元)" prop="price">
              <Input v-model="information.price" class="width" :maxlength="12"></Input>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="设备重量(Kg)" prop="weight">
              <Input v-model="information.weight" class="width" :maxlength="15"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="设备功率" prop="power">
              <Input v-model="information.power" class="width" :maxlength="15"></Input>
            </FormItem>
          </Col>


          <Col span="12">
            <FormItem label="配套手册" prop="handBook">
              <Input v-model="information.handBook" class="width" :maxlength="15"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="验收结果" prop="result">
              <Input v-model="information.result" class="width" :maxlength="30"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="运行情况" prop="runStatus">
              <Input v-model="information.runStatus" class="width" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                     :maxlength="128"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="外观情况" prop="surfaceStatus">
              <Input v-model="information.surfaceStatus" class="width" type="textarea"
                     :autosize="{minRows: 3,maxRows:3}" :maxlength="128"></Input>
            </FormItem>
          </Col>

          <Col span="24" style="text-align: center">
            <ButtonGroup>
              <Button @click="cancelSaving">取消</Button>
              <Button type="primary" @click="clickFinish">保存</Button>
            </ButtonGroup>
          </Col>
        </Form>
      </Col>
    </Row>
  </Card>
</template>
<script>
    import '../index.less'
    import {paramsValidate, isDataSuccess, formatTime, getRealname} from '@/libs/util'
    import {mapMutations} from 'vuex' // 关闭页面
    import {getOrderNumber, editAccept, getAccept} from '@/api/purchasingManagement/equipmentAcceptance'

    export default {
        name: "editAcceptance",
        data() {
            return {
                author: getRealname(),
                buttonSize: 'large', // 按钮大小
                itemId: '',
                information: {
                    projectId: JSON.parse(localStorage.getItem("projectId")).id,
                    contractNumber: '',
                    name: '',
                    power: '',
                    model: '',
                    purchasingDate: '',
                    acceptDate: '',
                    result: '',
                    supplier: '',
                    supplierPhone: '',
                    purchasingCount: '',
                    price: '',
                    runStatus: '',
                    surfaceStatus: '',
                    weight: '',
                    handBook: '',
                },
                category: [],
                ruleInline: {
                    name: [
                        {required: true, message: '请输入设备名称', trigger: 'blur'},
                    ],
                    model: [
                        {required: true, message: '请输入设备型号', trigger: 'blur'},
                    ],
                    power: [
                        {required: true, message: '请输入设备功率', trigger: 'blur'},
                    ],
                    purchasingDate: [
                        {required: true, type: 'date', message: '请选择购买时间', trigger: 'change'}
                    ],
                    acceptDate: [
                        {required: true, type: 'date', message: '请选择验收时间', trigger: 'change'}
                    ],
                    result: [
                        {required: true, message: '请输入验收结果', trigger: 'blur'},
                    ],
                    supplier: [
                        {required: true, message: '请输入购买厂家', trigger: 'blur'},
                    ],
                    supplierPhone: [
                        {required: true, message: '请输入厂家电话', trigger: 'blur'},
                    ],
                    purchasingCount: [
                        {required: true, message: '请输入购买数量', trigger: 'blur'},
                        {type: 'string', pattern: /^\d+$/, message: '请输入正整数', trigger: 'blur'},
                    ],
                    price: [
                        {required: true, message: '请输入购买单价', trigger: 'blur'},
                        {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'},
                    ],
                    runStatus: [
                        {required: true, message: '请输入设备运行情况', trigger: 'blur'},
                    ],
                    surfaceStatus: [
                        {required: true, message: '请输入设备外观情况', trigger: 'blur'},
                    ],
                    weight: [
                        {required: true, message: '请输入设备重量', trigger: 'blur'},
                    ],
                    handBook: [
                        {required: true, message: '请输入设备配套手册', trigger: 'blur'},
                    ],
                    contractNumber: [{required: true, message: '请选择合同编号', trigger: 'change'}]
                },
            }
        },
        methods: {
            //  关闭页面方法
            ...mapMutations(['closeTag']),
            close() {
                this.closeTag({
                    name: 'editAcceptance'
                })
            },
            cancelSaving() {
                this.close()
                this.$router.push({name: 'equipmentAcceptance'});
            },
            clickFinish() {
                this.$refs.checkAndAccept.validate((valid) => {
                        if (valid) {
                            this.information.purchasingDate = formatTime(this.information.purchasingDate)
                            this.information.acceptDate = formatTime(this.information.acceptDate)
                            editAccept(this.information, this.information.id).then(res => {
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
                                        this.$Message.success(data.msgContent)
                                        this.close()
                                        this.$router.push({name: 'equipmentAcceptance'});
                                        break
                                }
                            })
                        }
                    }
                )
            },
            //  合同编号
            getNumber() {
                getOrderNumber(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
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
                            this.category = data.msgData
                            break;
                    }
                })
            },
            //获取回显数据
            getEachData() {
                getAccept(this.itemId).then(res => {
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
                            this.information.contractNumber = data.msgData.contractNumber
                            this.information.acceptDate = new Date(data.msgData.acceptDate)
                            this.information.handBook = data.msgData.handBook
                            this.information.id = data.msgData.id
                            this.information.model = data.msgData.model
                            this.information.name = data.msgData.name
                            this.information.power = data.msgData.power + ''
                            this.information.price = data.msgData.price + ''
                            this.information.purchasingCount = data.msgData.purchasingCount + ''
                            this.information.purchasingDate = new Date(data.msgData.purchasingDate)
                            this.information.result = data.msgData.result
                            this.information.runStatus = data.msgData.runStatus
                            this.information.supplier = data.msgData.supplier
                            this.information.supplierPhone = data.msgData.supplierPhone
                            this.information.surfaceStatus = data.msgData.surfaceStatus
                            this.information.weight = data.msgData.weight.toString()
                            console.log(data.msgData)
                            break;
                    }
                })
            }
        },
        activated() {
            this.itemId = sessionStorage.getItem('editAcceptanceId')
            this.getEachData()
            this.getNumber()
        }
    }
</script>



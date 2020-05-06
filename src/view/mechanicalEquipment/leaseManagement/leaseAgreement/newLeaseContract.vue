<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p  class="name">编制人:{{author}}</p>
      <p  class="time">创建日期:{{time}}</p>
      <div class="right">
        <Button  class="btn">&nbsp打印</Button>
        <Button  class="btn" @click="saveOrder(0)">&nbsp临时保存</Button>
        <Button  class="btn" type="primary"  @click="saveOrder(1)">&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div>
      <Tabs value="name1">
        <TabPane label="合同基本信息" name="name1">
          <br>  <br>
          <Row type="flex" justify="center">
            <Col span="18">
              <Form ref="contractInformation" :model="information" :rules="ruleInline" :label-width="110">

                  <Col span="12">
                    <FormItem label="合同名称" prop="contractName">
                      <Input v-model="information.contractName" class="width" :maxlength="30"></Input>
                    </FormItem>
                  </Col>
                <Col span="12">
                  <FormItem label="合同编号" prop="contractNumber">
                    <Input v-model="information.contractNumber" class="width" :maxlength="30"></Input>
                  </FormItem>
                </Col>
                  <Col span="12">
                    <FormItem label="合同甲方" prop="firstParty">
                      <Input v-model="information.firstParty" class="width" :maxlength="30"></Input>
                    </FormItem>
                  </Col>


                  <Col span="12">
                    <FormItem label="合同乙方" prop="secondParty">
                      <Input v-model="information.secondParty" class="width" :maxlength="30"></Input>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="签订时间" prop="signDate">
                      <DatePicker v-model="information.signDate" type="date"  class="width" format='yyyy-MM-dd' :transfer="true"></DatePicker>
                    </FormItem>
                  </Col>


                  <Col span="12">
                    <FormItem label="签订地点" prop="signPlace">
                      <Input v-model="information.signPlace" class="width" :maxlength="50"></Input>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="租赁方式" prop="equipmentRentWay">
                      <Select v-model="information.equipmentRentWay" class="width">
                        <Option value="年租">年租</Option>
                        <Option value="月租">月租</Option>
                        <Option value="日租">日租</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="12">
                    <FormItem label="结算方式" prop="equipmentCountWay">
                      <Select v-model="information.equipmentCountWay" class="width">
                        <Option value="年结">年结</Option>
                        <Option value="月结">月结</Option>
                        <Option value="日结">日结</Option>
                      </Select>
                    </FormItem>
                  </Col>

              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="合同清单" name="name3">
          <br>
          <ButtonGroup>
            <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;新增合同租赁设备</Button>
            <Button class="search-btn" type="error" @click="confirm">&nbsp;批量删除</Button>
          </ButtonGroup>
          <br><br>
          <vxe-table
            ref="facilityInformation"
            border
            resizable
            class="vxe-table-iview"
            show-overflow
            height="530"
            :data="tableData"
            :edit-rules="validRules"
            :edit-config="{trigger: 'click', mode: 'row'}"
          >
            <vxe-table-column type="selection" width="50"></vxe-table-column>
            <vxe-table-column type="index" width="50">
              <template v-slot:header="{ column }">
                <span>#</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="name" title="机械名称"  :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="model" title="机械型号" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="power" title="设备功率" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="price" title="单价" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="count" title="数量" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="totalPrice" title="总价" :edit-render="{name: 'input'}"></vxe-table-column>
          </vxe-table>

        </TabPane>
        <TabPane label="附件">
          <br>
          <Upload
            ref="uploadw"
            :headers = "headers"
            :show-upload-list="false"
            :before-upload="handleUpload"
            :on-success="succeeded"
            name="files"
            :on-error="uploadFailure"
            :format="['jpg','jpeg','png']"
            :on-format-error="handleFormatError"
            multiple
            :action="`${baseUrl}/pcm/equipments/rent/contract/attachments`">
            <Form
              :label-width="110"
              inline
              class="top20">
              <Button icon="ios-cloud-upload-outline" type="primary">选择资质图片文件</Button>
            </Form>
          </Upload>
          <br>
          <Table
            ref="selection"
            border
            :columns="columns"
            :data="pictureData">
          </Table>
        </TabPane>
      </Tabs>
    </div>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate, isDataSuccess, formatTime,getToken,getRealname} from '@/libs/util'
  import { mapMutations, } from 'vuex' // 关闭页面
  import { newLeaseContract,getNumber,deleteImgData } from '@/api/leaseManagement/leaseAgreement'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'
  export default {
    name: "newLeaseContract",
    components: {
      bigImg
    },
    data(){
      return {
        time:'',
        author: getRealname(),
        showImg:false,
        imgSrc: '',
        baseUrl: axios.baseUrl,
        headers: { Authorization:'Bearer ' + getToken()},
        files:[],
        information:{
          contractNumber:'',
          contractName:'',
          firstParty:'',
          secondParty:'',
          signPlace:'',
          signDate:'',
          equipmentRentWay:'',
          equipmentCountWay:'',
          remark:'',
        },
        tableData:[],
        ruleInline:{
          signDate: [
            {required: true, type: 'date', message: '请选择签订时间', trigger: 'change'}
          ],
          contractName: [
            {required: true, message: '请输入合同名称', trigger: 'blur'},
          ],
          contractNumber: [
            {required: true, message: '请输入合同编号', trigger: 'blur'},
          ],
          firstParty: [
            {required: true, message: '请输入甲方', trigger: 'blur'},
          ],
          secondParty: [
            {required: true, message: '请输入乙方', trigger: 'blur'},
          ],
          signPlace: [
            {required: true, message: '请输入签订地点', trigger: 'blur'},
          ],
          equipmentRentWay: [
            { required: true, message: '请输入租赁方式', trigger: 'change' },
          ],
          equipmentCountWay: [
            { required: true, message: '请输入结算方式', trigger: 'change' },
          ],
        },
        validRules:{
          name: [
            {required: true, type: 'string', message: '请输入产品名称'}
          ],
          model: [
            {required: true, type: 'string', message: '请输入产品型号'}
          ],
          power: [
            {required: true, type: 'string', message: '请输入额定功率'}
          ],
          price: [
            {required: true, type: 'string', message: '请输入设备单价'},
              {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
              {type: 'number',max:999999999,message: '以超出系统最大数'},
          ],
          count: [
            {required: true, type: 'string', message: '请输入设备数量'},
            {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
            {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
          ],
          totalPrice: [
            {required: true, type: 'string', message: '请输入设备总价'},
              {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
              {type: 'number',max:999999999,message: '以超出系统最大数'},
          ],
        },
        pictureData:[],
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
    methods:{
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'newLeaseContract'
        })
      },
      //添加表格一行
      insertEvent(row) {
        this.$refs.facilityInformation.insertAt(row, -1)
      },
      //删除
      confirm() {
        if (this.$refs.facilityInformation.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中租赁机械设备',
            content: '<p>你确定要删除选中租赁机械用品吗?</p>',
            onOk: () => {
              this.$refs.facilityInformation.removeSelecteds()   //  删除表格中选中的数据
            },
          });
        } else {
          this.$Message.error('请选择删除的租赁机械')
        }
      },
      saveOrder(state) {
        // console.log(this.$refs.facilityInformation.getInsertRecords())
        console.log(this.files)
        //获取表格数据
        const addTableData = this.$refs.facilityInformation.getInsertRecords()
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}
            addTable.name = v.name
            addTable.power = v.power
            addTable.model = v.model
            addTable.price = v.price
            addTable.count = v.count
            addTable.totalPrice = v.totalPrice
            arryData.push(addTable)
          })
        }
        const imgDataId=[]
        if(this.pictureData.length!==0){
          this.pictureData.forEach(v=>{
            imgDataId.push(v.id)
          })
        }
        this.$refs.contractInformation.validate((valid) => {
          if (valid) {
            this.$refs.facilityInformation.validate(valids => {
              if (valids) {
                const data = {
                  saveStatus:state,
                  projectId: JSON.parse(localStorage.getItem("projectId")).id,
                  signDate: formatTime(this.information.signDate),
                  contractNumber: this.information.contractNumber,
                  contractName: this.information.contractName,
                  firstParty: this.information.firstParty,
                  secondParty: this.information.secondParty,
                  signPlace: this.information.signPlace,
                  equipmentRentWay: this.information.equipmentRentWay,
                  equipmentCountWay: this.information.equipmentCountWay,
                  remark: this.information.remark,
                  equipments: arryData,
                  attachmentIds: imgDataId
                }
                newLeaseContract(data).then(res => {
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
                      this.$router.push({name:'leaseAgreement'});
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
      //图片上传成功后的回调
      succeeded(res, files) {
        console.log(res.msgData[0])
        this.pictureData.push(res.msgData[0])
      },
      //图片上传失败后的回调
      uploadFailure(error, files) {
        console.log(error)
        console.log(files)
      },
      //删除图片
      deleteImg(row){
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
      viewImg(){
        this.showImg = false;
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
    }
  }
</script>

<style scoped lang="less">
  .width{
    width: 80%;
  }
  .search-btn {
    margin-left: 10px;
  }
  .left {
    float: left;
  }
</style>

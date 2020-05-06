<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="name">编制人:{{author}}</p>
      <P class="time">创建日期:{{time}}</P>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)">&nbsp临时保存</Button>
        <Button class="btn" type="primary"  @click="clickFinish(1)">&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <Tabs value="name1" class="bottom20">
      <TabPane label="合同基本信息" name="name1">
        <br><br>
        <Row type="flex" justify="center">
          <Col span="18">
            <Form ref="agreement1" :model="agreement1" :rules="ruleInline" :label-width="100">
                <Col span="12">
                  <FormItem label="合同名称" prop="contractName">
                    <Input v-model="agreement1.contractName"  class="width" :maxlength="30"></Input>
                  </FormItem>
                </Col>
              <Col span="12">
                <FormItem label="合同编号" prop="contractNumber">
                  <Input v-model="agreement1.contractNumber"  class="width" :maxlength="30"></Input>
                </FormItem>
              </Col>
                <Col span="12">
                  <FormItem label="签订时间" prop="signDate">
                    <DatePicker v-model="agreement1.signDate" type="date"  class="width" format='yyyy-MM-dd' :transfer="true"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="合同甲方" prop="firstParty">
                    <Input v-model="agreement1.firstParty"  class="width" :maxlength="30"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="合同乙方" prop="secondParty">
                    <Input v-model="agreement1.secondParty" class="width" :maxlength="30"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="计费方式" prop="billingMethod1">
                    <Input v-model="agreement1.billingMethod1" class="width" :maxlength="30"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="签订地点" prop="signPlace">
                    <Input v-model="agreement1.signPlace" class="width" :maxlength="30"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="合同金额(元)" prop="contractPrice">
                    <Input v-model="agreement1.contractPrice" class="width" :maxlength="12"></Input>
                  </FormItem>
                </Col>
            </Form>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="设备清单" name="name3">
         <br>
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;增加机械设备</Button>
          <Button class="search-btn" type="error" @click="confirm">&nbsp;批量删除</Button>
        </ButtonGroup>
        <br><br>
        <vxe-table
          ref="STable"
          border
          resizable
          height="530"
          class="vxe-table-iview"
          show-overflow
          :data="tableData"
          :edit-rules="validRules"
          :edit-config="{trigger: 'click', mode: 'row'}"

        >
          <vxe-table-column type="selection" width="60"></vxe-table-column>
          <vxe-table-column type="index" width="50">
            <template v-slot:header="{ column }">
              <span>#</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="机械名称" :edit-render="{name: 'input'}" ></vxe-table-column>
          <vxe-table-column field="model" title="机械型号" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="power" title="设备功率" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="price" title="单价(元)" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="count" title="数量" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="totalPrice" title="总价(元)" :edit-render="{name: 'input'}"></vxe-table-column>
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
          :action="`${baseUrl}/pcm/equipments/contracts/contract/attachments/files`">
          <Form
            :label-width="110"
            inline
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
  import '@/view/financial/budgeting/offerBudget/state.less'
  import '../index.less'
  import {paramsValidate, isDataSuccess, formatTime,getToken,getRealname} from '@/libs/util'
  import { mapMutations } from 'vuex' // 关闭页面
  import { newContract,deleteImgData} from '@/api/purchasingManagement/contractPurchase'
  import bigImg from '@/components/big-img/Bigimg.vue'
  import axios from '@/libs/api.request'
    export default {
        name: "newMachineryContract",
      components: {
        bigImg
      },
       data(){
          return {
            time:'',
            author: getRealname(),
            agreement1:{
              contractNumber:'',    //合同编号
              signDate:'',
              contractName:'',
              firstParty:'',
              secondParty:'',
              billingMethod1:'',
              signPlace:'',
              contractPrice:'',
            },
            showImg:false,
            imgSrc: '',
            pictureData:[],
            tableData:[],
            headers: { Authorization:'Bearer ' + getToken()},
            baseUrl: axios.baseUrl,
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
                {required: true, message: '请输入合同甲方', trigger: 'blur'},
              ],
              secondParty: [
                {required: true, message: '请输入合同乙方', trigger: 'blur'},
              ],
              billingMethod1: [
                {required: true, message: '请输入计费方式', trigger: 'blur'},
              ],
              signPlace: [
                {required: true, message: '请输入合同签订地点', trigger: 'blur'},
              ],
              contractPrice: [
                {required: true, message: '请输入合同金额', trigger: 'blur'},
                {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
              ],
            },
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
              totalPrice: [
                {required: true, type: 'number', message: '请输入产品总价'},
                  {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
                  {type: 'number',max:999999999,message: '以超出系统最大数'},
              ],
            },
            file:[],
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
                width:100
              },
              {
                title: '上传日期',
                key: 'uploadDate',
                width:120,
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
            name: 'newMachineryContract'
          })
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
        //添加表格一行
        insertEvent(row) {
          this.$refs.STable.insertAt(row, -1)
        },
        //删除
        confirm() {
          if (this.$refs.STable.getSelectRecords().length !== 0) {
            this.$Modal.confirm({
              title: '删除选中机械设备',
              content: '<p>你确定要删除选中机械用品吗?</p>',
              onOk: () => {
                this.$refs.STable.removeSelecteds()   //  删除表格中选中的数据
              },
            });
          } else {
            this.$Message.error('请选择删除的产品')
          }
        },
        //图片上传成功后的回调
        succeeded(res, file) {
          console.log(res.msgData[0])
          this.pictureData.push(res.msgData[0])
        },
        //图片上传失败后的回调
        uploadFailure(error, file) {
          console.log(error)
          console.log(file)
        },
        //上传图片验证
        handleFormatError(file) {
          this.$Message.warning({
            content: file.name + '文件类型不正确,请选择图片',
            duration: 3
          })
        },
        //再次点击上传之前，清空之前已上传文件
        handleUpload(file) {
          this.file.push(file);
          // this.$refs.upload.clearFiles()
        },
        clickFinish(state) {
          console.log(this.$refs.STable.getInsertRecords())
          console.log(this.file)
          //获取表格数据
          const addTableData = this.$refs.STable.getInsertRecords()
          const arryData = []
          if (addTableData.length !== 0) {
            addTableData.forEach(v => {
              let addTable = {}
              addTable.name = v.name
              addTable.power = v.power
              addTable.model = v.model
              addTable.count = v.count
              addTable.price = v.price
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
          console.log(imgDataId)
          this.$refs.agreement1.validate((v) => {
            if (v) {
              this.$refs.STable.validate(valid1 => {
                if (valid1) {
                  console.log(JSON.parse(localStorage.getItem("projectId")).id)
                  const data = {
                    saveStatus:state,
                    projectId: JSON.parse(localStorage.getItem("projectId")).id,
                    //编号
                    contractNumber: this.agreement1.contractNumber,
                    contractName:this.agreement1.contractName,
                    firstParty:this.agreement1.firstParty,
                    secondParty:this.agreement1.secondParty,
                    signPlace:this.agreement1.signPlace,
                    billingMethod:this.agreement1.billingMethod1,
                    signDate: formatTime(this.agreement1.signDate),
                    contractPrice: this.agreement1.contractPrice,
                    equipments: arryData,
                    attachmentIds: imgDataId
                  }
                  console.log(data)
                  newContract(data).then(res => {
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
                        this.$router.push({name:'contractPurchase'});
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



<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="name">编制人：{{author}}</p>
      <P class="time">创建日期:{{time}}</P>
      <P class="left" style="width: 185px">申请单编号：{{billNumber}}</P>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)">&nbsp临时保存</Button>
        <Button class="btn" type="primary"  @click="clickFinish(1)">&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div>
      <Tabs value="name1" class="bottom20">
        <TabPane label="基本信息" name="name1">
          <br><br>
          <Row type="flex" justify="center">
            <Col span="10">
              <Form ref="leaseApplication" :model="information" :rules="ruleInline" :label-width="100">
                  <Col span="24">
                    <FormItem label="申请时间" prop="applyDate">
                      <DatePicker v-model="information.applyDate" type="date"  class="width" format='yyyy-MM-dd' :transfer="true"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="24">
                    <FormItem label="申请人" prop="applier">
                      <Input v-model="information.applier" class="width" :maxlength="15"></Input>
                    </FormItem>
                  </Col>
                  <Col span="24">
                    <FormItem label="总金额(元)" prop="totalPrice">
                      <Input v-model="information.totalPrice" class="width" :maxlength="12"></Input>
                    </FormItem>
                  </Col>
              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="申请清单" name="name2">
          <br>
          <ButtonGroup>
            <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;增加租赁设备</Button>
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
            :edit-config="{trigger: 'click', mode: 'row'}"
          >
            <vxe-table-column type="selection" min-width="50" fixed="left" width="50"></vxe-table-column>
            <vxe-table-column type="index" min-width="60" fixed="left" width="50">
              <template v-slot:header="{ column }">
                <span>#</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="name" title="机械名称" :edit-render="{name: 'input'}"
                              min-width="130" fixed="left"></vxe-table-column>
            <vxe-table-column field="model" title="机械型号" :edit-render="{name: 'input'}" min-width="120"></vxe-table-column>
            <vxe-table-column field="power" title="设备功率" :edit-render="{name: 'input'}" min-width="120"></vxe-table-column>
            <vxe-table-column field="planInDate" title="预计入场时间" :edit-render="{type: 'default'}" min-width="160">
              <template v-slot:edit="{ row }">
                <DatePicker v-model="row.planInDate" type="date" format="yyyy/MM/dd" :transfer="true"></DatePicker>
              </template>
              <template v-slot="{ row }">{{ formatDate(row.planInDate) }}</template>
            </vxe-table-column>
            <vxe-table-column field="planOutDate" title="预计出场时间" :edit-render="{type: 'default'}" min-width="160">
              <template v-slot:edit="{ row }">
                <DatePicker v-model="row.planOutDate" type="date" format="yyyy/MM/dd" :transfer="true"></DatePicker>
              </template>
              <template v-slot="{ row }">{{ formatDate(row.planOutDate) }}</template>
            </vxe-table-column>
            <vxe-table-column field="price" title="单价" :edit-render="{name: 'input'}" min-width="160" fixed="right"></vxe-table-column>
            <vxe-table-column field="rentCount" title="租赁数量" :edit-render="{name: 'input'}" min-width="160" fixed="right"></vxe-table-column>
          </vxe-table>
        </TabPane>
        <TabPane label="附件">
          <br>
            <Upload
              :headers = "headers"
              :show-upload-list="false"
              :before-upload="handleUpload"
              :on-success="succeeded"
              name="files"
              :on-error="uploadFailure"
              :format="['jpg','jpeg','png']"
              :on-format-error="handleFormatError"
              multiple
              :action="`${baseUrl}/pcm/equipments/rent_apply/bill/attachment`">
              <Button icon="ios-cloud-upload-outline" type="primary">选择资质图片文件</Button>
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
  import { mapMutations } from 'vuex' // 关闭页面
  import { newLease, deleteImgData,getOrderNumber} from '@/api/leaseManagement/leaseOrder'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'
  export default {
    name: "newLeaseOrder",
    components: {
      bigImg
    },
    data(){
      return {
        time:'',
        author: getRealname(),
        billNumber: '',
        showImg:false,
        imgSrc: '',
        baseUrl: axios.baseUrl,
        headers: { Authorization:'Bearer ' + getToken()},
        information:{
          applyDate:'',
          applier:'',
          totalPrice:'',
        },
        ruleInline:{
          applyDate: [
            {required: true, type: 'date', message: '请选择申请时间', trigger: 'change'}
          ],
          applier: [
            {required: true, message: '请输入申请人', trigger: 'blur'},
          ],
          totalPrice: [
            {required: true, message: '请输入总金额', trigger: 'blur'},
              {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
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
          planInDate: [
            {required: true, type: 'string', message: '请选择预计入场时间'}
          ],
          planOutDate: [
            {required: true, type: 'string', message: '请选择预计出场时间'}
          ],
          price: [
            {required: true, type: 'string', message: '请输入产品单价'},
              {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
              {type: 'number',max:999999999,message: '以超出系统最大数'},
          ],
          rentCount: [
            {required: true, type: 'string', message: '请输入租赁数量'},
            {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
            {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
          ],
        },
        pictureData:[],
        tableData:[],
        files:[],
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
            width: 130,
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
          name: 'newLeaseOrder'
        })
      },
      //时间格式化
      formatDate(value) {
        if (value) {
          return formatTime(value)
        } else {
          return ''
        }
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
      //  获取单号
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
              this.billNumber = data.msgData
              break;
          }
        })
      },
      viewImg(){
        this.showImg = false;
      },
      clickFinish(state) {
        console.log(this.$refs.xTable.getInsertRecords())
        console.log(this.files)
        //获取表格数据
        const addTableData = this.$refs.xTable.getInsertRecords()
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}

            addTable.projectId=JSON.parse(localStorage.getItem("projectId")).id
            addTable.name = v.name
            addTable.power = v.power
            addTable.model = v.model
            addTable.planInDate = formatTime(v.planInDate)
            addTable.planOutDate = formatTime(v.planOutDate)
            addTable.price = v.price
            addTable.tclArgs = v.tclArgs
            addTable.rentCount = v.rentCount
            arryData.push(addTable)
          })
        }
        const imgDataId=[]
        if(this.pictureData.length!==0){
          this.pictureData.forEach(v=>{
            imgDataId.push(v.id)
          })
        }
        this.$refs.leaseApplication.validate((valid) => {
          if (valid) {
            this.$refs.xTable.validate(valid1 => {
              if (valid1) {
                const data = {
                  saveStatus: state,
                  billNumber: this.billNumber,
                  projectId: JSON.parse(localStorage.getItem("projectId")).id,
                  applyDate: formatTime(this.information.applyDate),
                  applier: this.information.applier,
                  totalPrice: this.information.totalPrice,
                  equipments: arryData,
                  attachmentIds: imgDataId
                }
                newLease(data).then(res => {
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
                      this.$router.push({name:'leaseOrder'});
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
      //添加表格一行
      insertEvent(row) {
        this.$refs.xTable.insertAt(row, -1)
      },
      //删除
      confirm() {
        if (this.$refs.xTable.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中租赁机械设备',
            content: '<p>你确定要删除选中租赁机械用品吗?</p>',
            onOk: () => {
              this.$refs.xTable.removeSelecteds()   //  删除表格中选中的数据
            },
          });
        } else {
          this.$Message.error('请选择删除的租赁机械')
        }
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
    created() {
      this.getNowTime()
      this.getNumber()
    }
  }
</script>
<style scoped lang="less">
  .search-btn {
    margin-left: 10px;
  }
  .left {
    float: left;
    width: 166px;
  }
  .bottom20 {
    margin-top: 40px;
  }
  .width{
    width: 80%;
  }
</style>

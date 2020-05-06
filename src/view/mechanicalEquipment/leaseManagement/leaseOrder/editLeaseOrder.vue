<template>
  <Card style="height: 100%;overflow-y: scroll">
    <div class="textBox">
      <p class="state" v-if="this.saveStatus===1">状态:完成</p>
      <p class="state" v-else>状态:<span style="color: red">未完成</span></p>
      <p class="time">创建日期:{{createDate}}</p>
      <p class="name">编制人:{{author}}</p>
      <P class="left" style="width: 185px">单据编号:{{billNumber}}</P>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)"  v-bind:disabled="this.saveStatus===1">&nbsp临时保存</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-if="this.saveStatus===1">&nbsp提交</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-else>&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
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
                 <FormItem label="总金额" prop="money">
                   <Input v-model="information.money" class="width" :maxlength="12"></Input>
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
          class="vxe-table-iview"
          height="530"
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
          <vxe-table-column field="name" title="机械名称" :edit-render="{name: 'input'}" min-width="130" fixed="left"></vxe-table-column>
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
          ref="upload"
          :before-upload="handleUpload"
          :on-success="succeeded"
          :show-upload-list="false"
          :on-error="uploadFailure"
          :format="['jpg','jpeg','png']"
          :headers = "headers"
          name="files"
          :on-format-error="handleFormatError"
          multiple
          :action="`${baseUrl}/pcm/equipments/rent_apply/bill/attachment`">
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
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate, isDataSuccess, formatTime,getToken,getRealname} from '@/libs/util'
  import { mapMutations } from 'vuex' // 关闭页面
  import { getDataEcho,editData,deleteImgData,deleteEquipment} from '@/api/leaseManagement/leaseOrder'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'
  export default {
    name: "editLeaseOrder",
    components: {
      bigImg
    },
    data(){
      return {
        saveStatus:'',
        createDate:'',
        billNumber:'',
        author: getRealname(),
        showImg:false,
        imgSrc: '',
        baseUrl: axios.baseUrl,
        headers: { Authorization:'Bearer ' + getToken()},
        itemId:'',
        information:{
          applyDate:'',
          applier:'',
          money:'',
        },
        ruleInline:{
          applyDate: [
            {required: true, type: 'date', message: '请选择申请时间', trigger: 'change'}
          ],
          applier: [
            {required: true, message: '请输入申请人', trigger: 'blur'},
          ],
          money: [
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
            width:100,
            key: 'uploadUser',

          },
          {
            title: '上传日期',
            key: 'uploadDate',
            width:120
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
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'editLeaseOrder'
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
      clickFinish(state) {
        console.log(this.$refs.xTable.getTableData())
        console.log(this.file)
        //获取表格数据
        const addTableData = this.$refs.xTable.getTableData().fullData
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}
            addTable.projectId=JSON.parse(localStorage.getItem("projectId")).id
            addTable.name = v.name
            addTable.id = v.id
            addTable.power = v.power
            addTable.model = v.model
            addTable.planInDate = formatTime(v.planInDate)
            addTable.planOutDate = formatTime(v.planOutDate)
            addTable.price = v.price
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
                  id:this.itemId,
                  billNumber: this.billNumber,
                  projectId: JSON.parse(localStorage.getItem("projectId")).id,
                  applyDate: formatTime(this.information.applyDate),
                  applier: this.information.applier,
                  totalPrice: this.information.money,
                  equipments: arryData,
                  attachmentIds: imgDataId
                }
                editData(data).then(res => {
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
          }
        })
      },
      //添加表格一行
      insertEvent(row) {
        this.$refs.xTable.insertAt(row, -1)
      },
      //删除设备
      deleteEquipmentdata() {
        console.log(this.$refs.xTable.getSelectRecords())
        const selectData = this.$refs.xTable.getSelectRecords()
        const dataId = {'ids': []}
        if (selectData.length !== 0) {
          selectData.forEach(v => {
            if(v.id){
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
        const  checkedData=this.$refs.xTable.getSelectRecords()
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
      //  获取回显数据 详情
      getEcho () {
        getDataEcho(this.itemId).then(res => {
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
              console.log(data)
              this.saveStatus=data.msgData.saveStatus
              this.billNumber=data.msgData.billNumber
              this.createDate=data.msgData.createDate
              this.information.applyDate =new Date(data.msgData.applyDate)
              this.information.applier =data.msgData.applier
              this.information.money =data.msgData.totalPrice.toString()
              this.pictureData=data.msgData.attachmentVoList
              this.tableData =data.msgData.equipments
              break;
          }
        })
      },
    },
    activated() {
      this.itemId=sessionStorage.getItem('editLeaseOrderId')
      this.getEcho()
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
  .bottom20 {
    margin-top: 40px;
  }
</style>

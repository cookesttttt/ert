<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="state" v-if="this.saveStatus===1">状态:完成</p>
      <p class="state" v-else>状态:<span style="color: red">未完成</span></p>
      <p class="time">创建日期:{{time}}</p>
      <p class="name">编制人:{{author}}</p>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)"  v-bind:disabled="this.saveStatus===1">&nbsp临时保存</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-if="this.saveStatus===1">&nbsp提交</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-else>&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div class="clear"></div>
    <Tabs value="name1">
      <TabPane label="基本信息" name="name1">
        <br><br>
        <Row type="flex" justify="center">
          <Col span="10">
            <Form ref="outPlayList" :model="outPlayList" :rules="ruleInline" :label-width="100">

                <Col span="24">
                  <FormItem label="出场时间" prop="outDate">
                    <DatePicker v-model="outPlayList.outDate" type="date"  class="width" format='yyyy-MM-dd' :transfer="true"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="租赁合同编号" prop="rentContractNumber">
                    <Input v-model="outPlayList.rentContractNumber" class="width" :maxlength="30"></Input>
                  </FormItem>
                </Col>


                <Col span="24">
                  <FormItem label="设备租赁厂商" prop="equipmentSupplier">
                    <Input v-model="outPlayList.equipmentSupplier" class="width" :maxlength="30"></Input>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="查验结论" prop="checkResult">
                    <Input v-model="outPlayList.checkResult" type="textarea" :autosize="{minRows: 3,maxRows:3}" class="width" :maxlength="128"></Input>
                  </FormItem>
                </Col>
            </Form>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="设备清单" name="name3">
        <br>
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;新增入场设备</Button>
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
          <vxe-table-column type="selection" width="60"></vxe-table-column>
          <vxe-table-column type="index" width="50">
            <template v-slot:header="{ column }">
              <span>#</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="设备名称"  :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="model" title="设备型号" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="power" title="设备功率" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="count" title="租赁数量"  :edit-render="{name: 'input'}"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane  label="附件">
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
          :action="`${baseUrl}/pcm/equipments/rent_in/bill/attachments`">
          <Form
            :label-width="100"
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
  import {paramsValidate, isDataSuccess, formatTime,getToken,getRealname} from '@/libs/util'
  import '../index.less'
  import { mapMutations } from 'vuex' // 关闭页面
  import { getDataEcho,editData,deleteImgData,deleteEquipment } from '@/api/leaseManagement/equipmentComingOut'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'
  export default {
    name: "editAppearance",
    components: {
      bigImg
    },
    data(){
      return {
        saveStatus:'',
        time:'',
        author: getRealname(),
        itemId:'',
        showImg:false,
        imgSrc: '',
        baseUrl: axios.baseUrl,
        headers: { Authorization:'Bearer ' + getToken()},
        outPlayList:{
          outDate:'',
          rentContractNumber:'',
          equipmentSupplier:'',
          checkResult:'',
        },
        ruleInline:{
          outDate: [
            {required: true, type: 'date', message: '请选择出场时间', trigger: 'change'}
          ],
          rentContractNumber: [
            {required: true, message: '请输入租赁合同编号', trigger: 'blur'},
          ],
          equipmentSupplier: [
            {required: true, message: '请输入设备租赁厂商', trigger: 'blur'},
          ],
        },
        validRules:{
          name: [
            {required: true, type: 'string', message: '请输入设备名称'}
          ],
          model: [
            {required: true, type: 'string', message: '请输入设备型号'}
          ],
          power: [
            {required: true, type: 'string', message: '请输入设备功率'}
          ],
          count: [
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
          name: 'editAppearance'
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
      clickFinish(state) {
        //获取表格数据
        const addTableData =  this.$refs.xTable.getTableData().fullData
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}
            addTable.name = v.name
            addTable.id = v.id
            addTable.model = v.model
            addTable.power = v.power
            addTable.count = v.count
            arryData.push(addTable)
          })
        }
        const imgDataId=[]
        if(this.pictureData.length!==0){
          this.pictureData.forEach(v=>{
            imgDataId.push(v.id)
          })
        }
        this.$refs.outPlayList.validate((valid) => {
          if (valid) {
            this.$refs.xTable.validate(valid1 => {
              if (valid1) {
                const data = {
                  saveStatus:state,
                  id:this.itemId,
                  projectId: JSON.parse(localStorage.getItem("projectId")).id,
                  outDate: formatTime(this.outPlayList.outDate),
                  rentContractNumber: this.outPlayList.rentContractNumber,
                  equipmentSupplier: this.outPlayList.equipmentSupplier,
                  checkResult: this.outPlayList.checkResult,
                  equipmentVos: arryData,
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
                      this.$router.push({name:'equipmentComingOut'});
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
        this.$refs.xTable.insertAt(row,-1)
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
              this.time = data.msgData.createDate
              this.saveStatus=data.msgData.saveStatus
              this.outPlayList.outDate=new Date(data.msgData.outDate)
              this.outPlayList.rentContractNumber=data.msgData.rentContractNumber
              this.outPlayList.equipmentSupplier=data.msgData.equipmentSupplier
              this.outPlayList.checkResult=data.msgData.checkResult
              this.pictureData=data.msgData.attachmentVos
              this.tableData =data.msgData.equipmentVos
              break;
          }
        })
      },
    },
    activated() {
      this.itemId=sessionStorage.getItem('editAppearanceId')
      this.getEcho()
    }
  }
</script>


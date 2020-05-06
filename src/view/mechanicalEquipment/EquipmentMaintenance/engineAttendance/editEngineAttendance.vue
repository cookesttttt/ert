<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="state" v-if="this.saveStatus===1">状态:完成</p>
      <p class="state" v-else>状态:<span style="color: red">未完成</span></p>
      <p class="time">创建日期:{{createDate}}</p>
      <p class="name">编制人:{{author}}</p>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)"  v-bind:disabled="this.saveStatus===1">&nbsp临时保存</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-if="this.saveStatus===1">&nbsp提交</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-else>&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div>
      <Tabs value="name1" class="bottom20">
        <TabPane label="基本信息" name="name1">
          <br><br>
          <Row type="flex" justify="center">
            <Col span="18">
              <Form ref="editMaintenanceData" :model="editMaintenanceData" :rules="ruleInline" :label-width="100">
                <Col span="12">
                  <FormItem label="设备名称" prop="name">
                    <Input v-model="editMaintenanceData.name" class="width" :maxlength="15"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="设备型号" prop="model">
                    <Input v-model="editMaintenanceData.model" class="width" :maxlength="15"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="设备功率" prop="power">
                    <Input v-model="editMaintenanceData.power" class="width" :maxlength="15"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="保养部位" prop="part">
                    <Input v-model="editMaintenanceData.part" class="width" :maxlength="15"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="保养时间" prop="maintenanceDate">
                    <DatePicker
                      v-model="editMaintenanceData.maintenanceDate"
                      type="date"
                      class="width"
                      format="yyyy-MM-dd"
                      :transfer="true"
                    ></DatePicker>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="保养类型" prop="maintenanceType">
                    <Select v-model="editMaintenanceData.maintenanceType" class="width">
                      <Option value="日常保养">日常保养</Option>
                      <Option value="定期保养">定期保养</Option>
                      <Option value="定向保养">定向保养</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="保养单位" prop="maintenanceCompany">
                    <Input v-model="editMaintenanceData.maintenanceCompany" class="width" :maxlength="15"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="保养费用" prop="maintenanceCost">
                    <Input v-model="editMaintenanceData.maintenanceCost" class="width" :maxlength="12"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="经办人" prop="transactor">
                    <Input v-model="editMaintenanceData.transactor" class="width" :maxlength="15"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="保养情况" prop="maintenanceCondition">
                    <Input v-model="editMaintenanceData.maintenanceCondition" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                           class="width" :maxlength="255"></Input>
                  </FormItem>
                </Col>
              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="费用明细" name="name2">
          <br/>
          <ButtonGroup>
            <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;新增费用项目</Button>
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
            <vxe-table-column field="item" title="费用项目" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="itemPrice" title="项目单价" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="itemCount" title="项目数量" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="totalPrice" title="项目合计" :edit-render="{name: 'input'}"></vxe-table-column>
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

            :action="`${baseUrl}/pcm/equipments/maintenance/bill/attachments`"
          >
            <Form :label-width="110" inline class="top20">
              <Button icon="ios-cloud-upload-outline" type="primary">选择维修单附件</Button>
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
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate, isDataSuccess, formatTime, getToken, getRealname} from '@/libs/util'
  import {mapMutations} from 'vuex' // 关闭页面
  import {editData,deleteImgData,getEditData,deleteDevice} from '@/api/EquipmentMaintenance/engineAttendance'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'

  export default {
    name: "editEngineAttendance",
    components: {
      bigImg
    },
    data() {
      return {
        itemId:'',
        time: '',
        createDate:'',
        saveStatus:'',
        author: getRealname(),
        showImg: false,
        imgSrc: '',
        headers: {Authorization: 'Bearer ' + getToken()},
        baseUrl: axios.baseUrl,
        files: [],
        editMaintenanceData: {
          name: '',
          model: '',
          power: '',
          part: '',
          maintenanceDate: '',
          maintenanceType: '',
          maintenanceCompany: '',
          maintenanceCost: '',
          transactor: '',
          maintenanceCondition: '',
        },
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
          part: [
            {required: true, message: '请输入设备保养部位', trigger: 'blur'},
          ],
          maintenanceDate: [
            {required: true, type: 'date', message: '请选择保养时间', trigger: 'change'}
          ],
          maintenanceType: [
            {required: true, message: '请选择保养类型', trigger: 'change'}
          ],
          maintenanceCompany: [
            {required: true, message: '请输入保养单位', trigger: 'blur'},
          ],
          maintenanceCost: [
            {required: true, message: '请输入保养费用', trigger: 'blur'},
              {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
          ],
          transactor: [
            {required: true, message: '请输入经办人', trigger: 'blur'},
          ],
          maintenanceCondition: [
            {required: true, message: '请输入保养情况', trigger: 'blur'},
          ],
        },
        tableData: [],
        pictureData: [],
        validRules: {
          item: [
            {required: true, type: 'string', message: '请输入费用项目'}
          ],
          itemPrice: [
            {required: true, type: 'string', message: '请输入项目单价'},
              {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
              {type: 'number',max:999999999,message: '以超出系统最大数'},
          ],
          itemCount: [
            {required: true, type: 'number', message: '请输入项目数量'},
            {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
            {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
          ],
          totalPrice: [
            {required: true, type: 'string', message: '请输入项目合计'},
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
          name: 'editEngineAttendance'
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
      clickFinish(state) {
        const addTableData = this.$refs.xTable.getTableData().fullData
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}
            addTable.item = v.item
            addTable.itemPrice = v.itemPrice
            addTable.id = v.id
            addTable.itemCount = v.itemCount
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
        this.$refs.editMaintenanceData.validate((v) => {
          if (v) {
            this.$refs.xTable.validate((valid) => {
              if (valid) {
                const data = {
                  'saveStatus': state,
                  'name': this.editMaintenanceData.name,
                  'model': this.editMaintenanceData.model,
                  'power': this.editMaintenanceData.power,
                  'part': this.editMaintenanceData.part,
                  'maintenanceDate': this.editMaintenanceData.maintenanceDate,
                  'maintenanceType': this.editMaintenanceData.maintenanceType,
                  'maintenanceCompany': this.editMaintenanceData.maintenanceCompany,
                  'maintenanceCost': this.editMaintenanceData.maintenanceCost,
                  'transactor': this.editMaintenanceData.transactor,
                  'maintenanceCondition': this.editMaintenanceData.maintenanceCondition,
                  'equipmentMaintenanceDetailVos': arryData,
                  'attachmentIds': imgDataId
                }
                editData(JSON.parse(localStorage.getItem("projectId")).id,this.itemId, data).then(res => {
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
                      this.$router.push({name: 'engineAttendance'});
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
      insertEvent(row) {
        this.$refs.xTable.insertAt(row, -1)
      },
      deleteEquipmentdata() {
        const selectData = this.$refs.xTable.getSelectRecords()
        const dataId = {'ids': []}
        if (selectData.length !== 0) {
          selectData.forEach(v => {
            if(v.id){
              dataId.ids.push(v.id)
            }
          })
          deleteDevice(dataId).then(res => {
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
      },
      confirm() {
        if (this.$refs.xTable.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中费用项目',
            content: '<p>你确定要删除选中费用项目吗?</p>',
            onOk: () => {
              this.deleteEquipmentdata()
              this.$refs.xTable.removeSelecteds()   //  删除表格中选中的数据
            },
          });
        } else {
          this.$Message.error('请选择删除的费用项目')
        }
      },
      getEcho () {
        getEditData(this.itemId).then(res => {
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
              this.createDate=data.msgData.createDate
              console.log(data.msgData)
              this.saveStatus=data.msgData.saveStatus
              console.log(data)
              this.editMaintenanceData.name=data.msgData.name
              this.editMaintenanceData.model=data.msgData.model
              this.editMaintenanceData.power=data.msgData.power+''
              this.editMaintenanceData.part=data.msgData.part
              this.editMaintenanceData.maintenanceDate=new Date(data.msgData.maintenanceDate)
              this.editMaintenanceData.maintenanceType=data.msgData.maintenanceType
              this.editMaintenanceData.maintenanceCompany=data.msgData.maintenanceCompany
              this.editMaintenanceData.maintenanceCost=data.msgData.maintenanceCost+''
              this.editMaintenanceData.transactor=data.msgData.transactor
              this.editMaintenanceData.maintenanceCondition=data.msgData.maintenanceCondition
              this.tableData=data.msgData.equipmentMaintenanceDetailVos
              this.pictureData=data.msgData.attachmentVos
              break;
          }
        })
      },
      //图片上传成功后的回调
      succeeded(res, files,fileList) {
        console.log(res.msgData[0])
        console.log(files)
        console.log(fileList)
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
    },
    activated() {
      this.itemId=sessionStorage.getItem('editEngineAttendanceId')
      this.getEcho()
    }
  }
</script>

<style scoped>
  .width {
    width: 80%;
  }
  .bottom20 {
    margin-top: 40px;
  }
</style>

<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="name">编制人:{{author}}</p>
      <P class="time">创建日期:{{time}}</P>
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
              <Form ref="dispatchData1" :model="dispatchData" :rules="ruleInline" :label-width="110">
                <Col span="24">
                  <FormItem label="调度日期" prop="scheduledDate">
                    <DatePicker
                      v-model="dispatchData.scheduledDate"
                      type="date"
                      class="width"
                      format="yyyy-MM-dd"
                      :transfer="true"
                    ></DatePicker>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="经办人" prop="operator">
                    <Input v-model="dispatchData.operator" class="width" :maxlength="15"></Input>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="调出单位" prop="outgoingUnits">
                    <Input v-model="dispatchData.outgoingUnits" class="width" :maxlength="20"></Input>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="调入单位" prop="transferUnits">
                    <Input v-model="dispatchData.transferUnits" class="width" :maxlength="20"></Input>
                  </FormItem>
                </Col>
              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="调配清单" name="name2">
          <br/>
          <ButtonGroup>
            <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;新增调配设备</Button>
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
            <vxe-table-column field="name" title="机械名称" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="model" title="机械型号" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="power" title="设备功率" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="count" title="数量" :edit-render="{name: 'input'}"></vxe-table-column>
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
            :action="`${baseUrl}/pcm/equipments/dispatch/record/attachments`"
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
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate, isDataSuccess, formatTime, getToken, getRealname} from '@/libs/util'
  import {mapMutations} from 'vuex' // 关闭页面
  import {newData,deleteImgData} from '@/api/Equipment/dispatchList'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'

  export default {
    name: "newDispatchList",
    components: {
      bigImg
    },
    data() {
      return {
        time: '',
        author: getRealname(),
        showImg: false,
        imgSrc: '',
        headers: {Authorization: 'Bearer ' + getToken()},
        baseUrl: axios.baseUrl,
        files: [],
        dispatchData: {
          scheduledDate: '',
          operator: '',
          outgoingUnits: '',
          transferUnits: '',
        },
        ruleInline: {
          scheduledDate: [
            {required: true, type: 'date', message: '请选择调度日期', trigger: 'change'}
          ],
          operator: [
            {required: true, message: '请输入经办人', trigger: 'blur'},
          ],
          outgoingUnits: [
            {required: true, message: '请输入调出单位', trigger: 'blur'},
          ],
          transferUnits: [
            {required: true, message: '请输入调入单位', trigger: 'blur'},
          ]
        },
        tableData: [],
        pictureData: [],
        validRules: {
          name: [
            {required: true, type: 'string', message: '请输入机械名称'}
          ],
          model: [
            {required: true, type: 'string', message: '请输入机械型号'}
          ],
          power: [
            {required: true, type: 'string', message: '请输入额定功率'}
          ],
          count: [
            {required: true, type: 'number', message: '请输入数量'},
            {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
            {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
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
          name: 'newDispatchList'
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
        const addTableData = this.$refs.xTable.getInsertRecords()
        console.log(this.$refs.xTable.getInsertRecords())
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}
            addTable.name = v.name
            addTable.power = v.power
            addTable.model = v.model
            addTable.count = v.count
            arryData.push(addTable)
          })
        }
        const imgDataId = []
        if (this.pictureData.length !== 0) {
          this.pictureData.forEach(v => {
            imgDataId.push(v.id)
          })
        }

        this.$refs.dispatchData1.validate((v) => {
          if (v) {
            this.$refs.xTable.validate((valid) => {
              if (valid) {
                console.log('1')
                const data = {
                  saveStatus: state,
                  dispatchDate: this.dispatchData.scheduledDate,
                  operator: this.dispatchData.operator,
                  inCompany: this.dispatchData.transferUnits,
                  outCompany: this.dispatchData.outgoingUnits,
                  equipmentVos: arryData,
                  attachmentIds: imgDataId
                }
                console.log(data)
                newData(JSON.parse(localStorage.getItem("projectId")).id, data).then(res => {
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
                      this.$router.push({name: 'dispatchList'});
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
      //删除
      confirm() {
        if (this.$refs.xTable.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中机械设备',
            content: '<p>你确定要删除选中机械设备吗?</p>',
            onOk: () => {
              this.$refs.xTable.removeSelecteds()   //  删除表格中选中的数据
            },
          });
        } else {
          this.$Message.error('请选择删除的机械设备')
        }
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
    }
  }
</script>

<style scoped lang="less">
  .width {
    width: 80%;
  }
  .bottom20 {
    margin-top: 40px;
  }
</style>

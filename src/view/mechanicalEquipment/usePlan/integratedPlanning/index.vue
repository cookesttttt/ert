<template>
  <div class="bigbox" style="height: 100%;">
    <Card class="left-box">
      <div class="textBox">
        <p class="state" v-if="this.saveStatus===1">状态:完成</p>
        <p class="state" v-else>状态:<span style="color: red">未完成</span></p>
        <p class="name ">编制人:{{author}}</p>
        <P class="time">创建日期:{{planningTime}}</P>
        <p class="time">完成日期:{{modificationTime}}</p>
        <div class="right">
          <Button class="btn" @click="saveData(0)" v-bind:disabled="this.saveStatus===1">&nbsp临时保存</Button>
          <Button class="btn" type="primary" @click="saveData(1)" v-if="this.saveStatus===1">&nbsp提交</Button>
          <Button class="btn" type="primary" @click="saveData(1)" v-else>&nbsp完成计划</Button>
        </div>
        <div class="clear"></div>
      </div>

      <Steps style="margin-left: 15px"  >
        <Step title="分部分项" content="完成分部分项" status="process"></Step>
        <Step title="机械设备类型" content="完成机械设备类型" status="process"></Step>
        <Step title="机械整体计划" content="完成机械整体计划" status="process"></Step>
      </Steps>
      <div class="bottom20">
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;新增机械设备</Button>
          <Button class="search-btn" type="error" @click="confirm">&nbsp;批量删除</Button>
        </ButtonGroup>

          <Upload
            style="display: inline-block"
            :show-upload-list="false"
            :before-upload="handleUpload"
            :on-success="succeeded"
            :on-error="uploadFailure"
            :headers="headers"
            :format="['xlsx','xls']"
            :on-format-error="handleFormatError"
            :action="`${baseUrl}/pcm/equipments/entirety_plans/import_excel/${isId}`">
            <Button class="search-btn" style="margin-left: 10px">&nbsp;导入设备计划</Button>
          </Upload>
          <Button class="search-btn" @click="clickLeadingOut" v-bind:disabled="tableData.length===0" style="margin-left: 10px">&nbsp;导出设备计划</Button>
        <Button class="search-btn" type="error" @click="clickEmpty" v-bind:disabled="tableData.length===0" style="margin-left: 10px">
          &nbsp;清空计划列表
        </Button>
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
          @edit-actived="editActivedEvent"
        >
          <vxe-table-column type="selection" min-width="50" fixed="left" width="50"></vxe-table-column>
          <vxe-table-column type="index" min-width="60" fixed="left" width="50">
            <template v-slot:header="{ column }">
              <span>#</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="工程部位" :edit-render="{name: 'input'}" min-width="130"
                            fixed="left"></vxe-table-column>
          <vxe-table-column field="age" title="设备类型" :edit-render="{name: 'input'}" min-width="130"></vxe-table-column>
          <vxe-table-column field="address" title="设备型号" min-width="100"></vxe-table-column>
          <vxe-table-column field="date" title="功率" min-width="100"></vxe-table-column>
          <vxe-table-column field="date1" title="计划进场时间" :edit-render="{type: 'default'}" min-width="140">
            <template v-slot:edit="{ row }">
              <DatePicker v-model="row.date1"
                          type="date" format="yyyy/MM/dd"
                          :transfer="true"
              ></DatePicker>
            </template>
            <template v-slot="{ row }">{{ formatDate(row.date1) }}</template>
          </vxe-table-column>
          <vxe-table-column field="date2" title="计划出场时间" :edit-render="{type: 'default'}" min-width="140">
            <template v-slot:edit="{ row }">
              <DatePicker v-model="row.date2"
                          type="date"
                          format="yyyy/MM/dd"
                          :transfer="true"></DatePicker>
            </template>
            <template v-slot="{ row }">{{ formatDate(row.date2) }}</template>
          </vxe-table-column>
          <vxe-table-column field="date3" title="计划数量" :edit-render="{name: 'input'}" min-width="140"
                            fixed="right"></vxe-table-column>
          <vxe-table-column field="date4" title="备注" :edit-render="{name: 'input'}" min-width="100"
                            fixed="right"></vxe-table-column>
        </vxe-table>
        <!--选择用品弹框-->
        <Modal v-model="isAddModal" @on-cancel="cancel" title="选择工程部位" :mask-closable="false" :width="modelWidth"
               class-name="vertical-center-modal">
          <el-tabs type="border-card" style="height: 600px;overflow-y: scroll;" v-if="treeData.length!==0">
            <el-tab-pane :label="i.title" v-for="i in treeData">

              <div v-for="j in i.children">
                <div style="margin: 15px 0;"></div>
                <el-checkbox :indeterminate="isIndeterminate" @change="handleCheckAllChange($event,j.children)"
                             style="font-weight: bold">
                  {{j.title}}
                </el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedData" @change="handleCheckedCitiesChange($event,j.children)"
                                   style="font-size: 13px">
                  <el-checkbox v-for="k in j.children" :label="k" style="width:240px">{{k.title}}</el-checkbox>
                </el-checkbox-group>
                <Divider/>
              </div>
            </el-tab-pane>
          </el-tabs>
          <p v-else="treeData.length===0">请按照前置工作完成分部分项</p>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel">取消</Button>
            <Button type="primary" size="large" @click="Preservation">{{btnText}}</Button>
          </div>
        </Modal>
        <Modal v-model="isDevicedModal" @on-cancel="cancel(1)" title="选择设备" :mask-closable="false">
          <Table border ref="selection" :columns="columns4" :data="data1" height="400" v-if="data1.length!==0"></Table>
          <p v-else="data1.length===0">请按照前置工作机械设备类型</p>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel(1)">取消</Button>
            <Button type="primary" size="large" @click="Preservation(1)">{{btn2Text}}</Button>
          </div>
        </Modal>
      </div>
    </Card>
    <procedure :data="procedureData"></procedure>
  </div>
</template>
<script>
  import procedure from '@/components/procedure/procedure'
  import axios from '@/libs/api.request'
  import '@/view/financial/budgeting/offerBudget/state.less'
  import '../index.less'
  import {paramsValidate, isDataSuccess, formatTime, getRealname,getToken} from '@/libs/util'
  import {
    getDeviceData,
    getEngineeringSite,
    saveDeviceData,
    getAllData,
    deleteData,
    editData,
    clearAll
  } from '@/api/mechanicalEquipment/integratedPlanning'

  export default {
    name: 'integratedPlanning',
    components: {
      procedure
    },
    data() {
      return {
        headers: { Authorization:'Bearer ' + getToken()},
        files: [],           //上传文件
        baseUrl: axios.baseUrl,
        btn2Text: '',
        btnText: '',
        saveStatus:'',
        modelWidth: '',
        checkedData: [],
        checkList: [],
        isIndeterminate: false,
        checkAll: false,
        isAddModal: false,
        isDevicedModal: false,
        author: getRealname(),
        planningTime: '', // 计划时间
        modificationTime: '', // 编辑时间
        isId: '',
        validRules: {
          name: [
            {required: true, type: 'string', message: '请选择工程部位'}
          ],
          age: [
            {required: true, type: 'string', message: '请选择设备类型'}
          ],
          address: [
            {required: true, type: 'string', message: '请选择设备型号'}
          ],
          date: [
            {required: true, type: 'string', message: '请选择设备功率'}
          ],
          date1: [
            {required: true, type: 'string', message: '请选择进场时间'}
          ],
          date2: [
            {required: true, type: 'string', message: '请选择出场时间'}
          ],
          date3: [
            { required: true, type: 'number', message: '请输入计划数量'},
            { type: 'number',max:10000,message: '系统最大数不能超过10000'},
            { pattern:/^\+?[1-9]\d*$/,message: '请输入正整数'},
          ],
          date4: [{ type: 'string',max:300,message: '备注数超出系统范围'},]
        },
        tableData: [],
        treeData: [],
        rowData: [],
        selectList: [],
        columns4: [
          {
            title: '选择',
            width: 70,
            type: '_checked',
            align: 'center',
            render: (h, {row, index}) => {
              let _that = this
              return h('div', [
                h('Checkbox', {
                  props: {
                    value: row._checked
                  },
                  on: {
                    'on-change': e => {
                      this.data1.forEach(items => {
                        this.$set(items, '_checked', false)
                      })
                      if (e === false) {
                        this.selectList = '';
                      } else {
                        this.selectList = row
                      }
                      this.data1[index]._checked = e
                    }
                  }
                })
              ])
            }
          },
          {
            title: '设备类型',
            key: 'name'
          },
          {
            title: '设备型号',
            key: 'model'
          },
          {
            title: '功率',
            key: 'power'
          }
        ],
        data1: [],
        procedureData: [{name: '分部分项', url: '单位分部分项工程'}, {name: '机械设备类型', url: '机械设备类型管理'}]
      }
    },
    methods: {

      handleCheckAllChange(val, v) {
        console.log(val, v)
        this.checkedData = val ? v : []
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(val, v) {
        console.log(val)
        console.log(v)
        /*  let checkedCount = val.length;
          if(checkedCount === v.length){
            this.checkAll=true
            this.isIndeterminate=false
          }else {
            this.checkAll=false
            this.isIndeterminate=true
          }*/
        /*this.checkAll = checkedCount === v.length;
        console.log(checkedCount)
        console.log(checkedCount < v.length)
        this.isIndeterminate = checkedCount > 0 && checkedCount < v.length;*/
      },
      clickEmpty() {
        this.$Modal.confirm({
          title: '清空采购计划',
          content: '<p>你确定要清空采购计划吗?</p>',
          onOk: () => {
            clearAll(this.isId).then(res => {
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
                  this.getData()                       //  拉一次数据
                  this.$Message.success(data.msgContent)
                  break
              }
            })
          }
        })
      },
      //点击导出Excel
      clickLeadingOut() {
        window.open(axios.baseUrl + '/pcm/equipments/entirety_plans/export/' + JSON.parse(localStorage.getItem('projectId')).id)
      },
      // 时间格式化
      formatDate(value) {
        if (value) {
          return formatTime(value)
        } else {
          return ''
        }
      },
      // 删除
      confirm() {
        if (this.$refs.xTable.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中机械设备',
            content: '<p>你确定要删除选中机械用品吗?</p>',
            onOk: () => {
              this.$refs.xTable.removeSelecteds()
              console.log(this.$refs.xTable.getSelectRecords())
              console.log(this.$refs.xTable.getRemoveRecords())
              if (this.$refs.xTable.getRemoveRecords().length !== 0) {
                let deleteId = {'ids': []}
                this.$refs.xTable.getRemoveRecords().forEach(v => {
                  if(v.id!==null&&v.id!==''){
                    deleteId.ids.push(v.id)
                  }
                })
                console.log(deleteId)
                deleteData(deleteId).then(res => {
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
                      this.getData()
                      this.$Message.success(data.msgContent)
                      break
                  }
                })
              }
              console.log(this.$refs.xTable.getRemoveRecords())
            }
          })
        } else {
          this.$Message.error('请选择删除的机械设备')
        }
      },
      /*  getRecordset()获取表格数据集
    （获取新增、删除、更改的数据，对于增删改查表格非常方便）
     {insertRecords, removeRecords, updateRecords} */
      saveData(state) {
        const tables = this.$refs.xTable.getRecordset().insertRecords
        const ren = []

        tables.forEach(v=>{
          console.log(v)
          if(v.name===null||v.name===''&&v.age===null||v.age===''&&v.date1===null||v.date1===''&&v.date2===null||v.date2===''&&v.date3===null||v.date3===''){
            ren.push(v)
          }
        })
        this.$refs.xTable.remove(ren)
        this.$refs.xTable.validate(valid => {
          if (valid) {
            if (this.isId) {
              const editDataAll = {'vos': [], saveStatus: state, id: this.isId}
              console.log(editDataAll)
              console.log(this.$refs.xTable.getTableData().tableData)
              this.$refs.xTable.getTableData().tableData.forEach(j => {
                let editVal = {}
                editVal.id = j.id
                editVal.name = j.age
                editVal.model = j.address
                editVal.power = j.date
                editVal.positionNames=j.name
               if(j.positionIds){
                 editVal.positionIds = j.positionIds.join(',')
               }
                editVal.inDate = formatTime(j.date1)
                editVal.outDate = formatTime(j.date2)
                editVal.planCount = j.date3
                editVal.remark = j.date4
                editDataAll.vos.push(editVal)
              })
              console.log(editDataAll)
              editData(JSON.parse(localStorage.getItem('projectId')).id, editDataAll).then(res => {
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
                    this.getData()
                    this.$Message.success(data.msgContent)
                    break
                }
              })
            } else {
              const data = {'vos': [], saveStatus: state}
              let newData = this.$refs.xTable.getTableData().tableData
              console.log(newData)
              if (newData.length !== 0) {
                newData.forEach(v => {
                  let val = {}
                  val.name = v.age
                  val.model = v.address
                  val.power = v.date
                  val.positionNames=v.name
                   if(v.positionIds){
                     val.positionIds = v.positionIds.join(',')
                   }
                  val.inDate = formatTime(v.date1)
                  val.outDate = formatTime(v.date2)
                  val.planCount = v.date3
                  val.remark = v.date4
                  data.vos.push(val)
                })
                saveDeviceData(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
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
                      this.getData()
                      this.$Message.success(data.msgContent)
                      break
                  }
                })
              }
            }
          }
        })
      },
      Preservation(v) {
        if (v === 1) {
          console.log(this.selectList)
          this.rowData.age = this.selectList.name
          this.rowData.address = this.selectList.power
          this.rowData.date = this.selectList.model
          this.isDevicedModal = false
        } else {
          let treeNode = this.checkedData
          let checkedTitle = []
          let checkedId = []
          console.log(treeNode)
          if (treeNode) {
            treeNode.forEach(v => {
              checkedTitle.push(v.title)
              checkedId.push(v.id)
            })
          }
          console.log(checkedTitle)
          console.log(checkedId)
          this.rowData.name = checkedTitle.join(';')
          this.rowData.positionIds = checkedId
          this.isAddModal = false
        }
      },
      insertEvent(row) {
        this.$refs.xTable.insertAt(row, -1)
      },
      editActivedEvent({row, column}, event) {
        this.rowData = row
        console.log(row)
        const arrcheck = []
        if (`${column.title}` === '工程部位') {
          console.log(this.treeData)
          if (row.name) {
            if( row.positionIds){
              this.treeData.forEach(v => {
                v.children.forEach(j => {
                  j.children.forEach(k => {
                    row.positionIds.forEach(r => {
                      if (Number(r) === k.id) {
                        arrcheck.push(k)
                      }
                    })
                  })
                })
              })
            }
            this.checkedData = arrcheck
            console.log(arrcheck)
          } else {
            this.isIndeterminate = false
            this.checkedData = []
          }
          if (this.treeData.length !== 0) {
            this.btnText = '保存'
            this.modelWidth = 800
          } else {
            this.btnText = '确定'
            this.modelWidth = 520
          }
          this.isAddModal = true

        } else if (`${column.title}` === '设备类型' || `${column.title}` === '设备型号' || `${column.title}` === '功率') {
          if (row.age) {
            this.data1.forEach(v => {
              if (v.name=== row.age) {
                this.$set(v, '_checked', true)
                console.log(v)
              } else {
                this.$set(v, '_checked', false)
              }
            })
          } else {
            this.data1.forEach(v => {
              this.$set(v, '_checked', false)
            })
          }
          if (this.data1.length !== 0) {
            this.btn2Text = '保存'
          } else {
            this.btn2Text = '确定'
          }
          this.isDevicedModal = true
        }
      },
      cancel(v) {
        if (v === 1) {
          this.isDevicedModal = false
        } else {
          this.isAddModal = false
        }
      },
      //  获取设备
      deviceData() {
        getDeviceData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
              console.log(res.data)

              this.data1 = res.data.msgData
              break
          }
        })
      },
      // 获取工程部位
      engineeringSite() {
        getEngineeringSite(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
              console.log(this.checkedData)
              this.treeData = res.data.msgData
              console.log(this.treeData)
              break
          }
        })
      },
      //  获取表格全部数据
      getData() {
        getAllData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
              console.log(data)
              if(data.msgData){
                console.log('a')
                this.planningTime = data.msgData.createDate
                this.modificationTime = data.msgData.finishDate
                this.isId = data.msgData.id
                this.saveStatus = data.msgData.saveStatus
                if (data.msgData.planVos) {
                  let dataArr = []
                  data.msgData.planVos.forEach(v => {
                    let data = {}
                    data.id = v.id
                    data.name = v.positionNames
                    data.positionIds = v.positionIds?v.positionIds.split(","):v.positionIds
                    data.age = v.categoryName
                    data.address = v.model
                    data.date = v.power
                    data.date1 = v.inDate
                    data.date2 = v.outDate
                    data.date3 = v.planCount
                    data.date4 = v.remark
                    dataArr.push(data)
                  })
                  this.tableData = dataArr
                }
              }
              break
          }
        })
      },
      succeeded(res) {
        console.log(res)
        if(res.msgCode===0){
          this.$Message.success("文件导入成功！")
          this.files = []
          this.getData()
        }else {
          if(this.isId===''){
            this.$Message.error("请新建计划后倒入")
          }else {
            this.$Message.error("文件导入失败！")
          }
        }
      },
      //图片上传失败后的回调
      uploadFailure(error, files) {
        console.log(error)
        this.$Message.error("文件导入失败！")
        console.log(files)
      },
      //上传图片验证
      handleFormatError(files) {
        this.$Message.warning({
          content: files.name + '文件类型不正确',
          duration: 3
        })
      },
      //再次点击上传之前，清空之前已上传文件
      handleUpload(files) {
        this.files.push(files)
      },
    },
    activated() {
      this.deviceData()
      this.engineeringSite()
      this.getData()
    }

  }
</script>

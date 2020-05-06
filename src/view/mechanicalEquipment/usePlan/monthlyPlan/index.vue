<template>
  <div class='bigbox'>
    <Card class="left-box">
      <div class="textBox">
        <p class="state" v-if="this.saveStatus===1">状态:完成</p>
        <p class="state" v-else>状态:<span style="color: red">未完成</span></p>
        <p class="name ">编制人:{{author}}</p>
        <P class="time">创建日期:{{planningTime}}</P>
        <p class="time">完成日期:{{modificationTime}}</p>
        <p  style="width: 260px;float: left">计划名称:{{item.year}}年第{{item.quarter}}月机械计划</p>
        <div class="right">
          <Button class="search-btn" @click="saveData(0)" v-bind:disabled="this.saveStatus===1">&nbsp临时保存</Button>
          <Button class="btn" type="primary" @click="saveData(1)" v-if="this.saveStatus===1">&nbsp提交</Button>
          <Button class="btn" type="primary" @click="saveData(1)" v-else>&nbsp完成计划</Button>
        </div>
        <div class="clear"></div>
      </div>
      <el-steps :active="5" style='margin-left: 15px'>
        <el-step title="步骤 1" description="目标成本分析"></el-step>
        <el-step title="步骤 2" description="目标产值分析"></el-step>
        <el-step title="步骤 3" description="机械使用计划"></el-step>
        <el-step title="步骤 4" description="机械季度使用计划"></el-step>
        <el-step title="步骤 5" description="机械月使用计划"></el-step>
      </el-steps>
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
          :headers="headers"
          :on-error="uploadFailure"
          :format ="['xlsx','xls']"
          :on-format-error="handleFormatError"
          :action="`${baseUrl}/pcm/equipments/month_plans/import_excel/${isId}`">
          <Button class="search-btn" style="margin-left: 10px">&nbsp;导入设备计划</Button>
        </Upload>
        <Button class="search-btn" @click="clickLeadingOut" v-bind:disabled="tableData.length===0" style="margin-left: 10px">&nbsp;导出设备计划</Button>
        <Button class="search-btn" type="error"  v-bind:disabled="tableData.length===0" @click="clearancePlan" style="margin-left: 10px">&nbsp;清空计划列表</Button>
        <Button class="search-btn" @click="reconstruction" style="margin-left: 10px">&nbsp;重新自动生成</Button>
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
          :edit-config="{trigger: 'click', mode: 'cell'}"
          @edit-actived="editActivedEvent"
        >
          <vxe-table-column type="selection" width="50" min-width="50" fixed="left"></vxe-table-column>
          <vxe-table-column type="index" width="50" min-width="60" fixed="left">
            <template v-slot:header="{ column }">
              <span>#</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="工程部位" :edit-render="{name: 'input'}" min-width="130" fixed="left"></vxe-table-column>
          <vxe-table-column field="categoryName" title="设备类型" :edit-render="{name: 'input'}" min-width="130"></vxe-table-column>
          <vxe-table-column field="model" title="设备型号" min-width="100"></vxe-table-column>
          <vxe-table-column field="power" title="功率" min-width="100"></vxe-table-column>
          <vxe-table-column field="inDate" title="计划进场时间"
                            :edit-render="{type: 'default'}" min-width="140">
            <template v-slot:edit="{ row }">
              <DatePicker v-model="row.inDate"
                          type="date"
                          :start-date="new Date(item.year+'/'+item.month+'')"
                          :options="options"
                          format="yyyy/MM/dd"
                          :transfer="true"></DatePicker>
            </template>
            <template v-slot="{ row }">{{ formatDate(row.inDate) }}</template>
          </vxe-table-column>
          <vxe-table-column field="outDate" title="计划出场时间" :edit-render="{type: 'default'}" min-width="140">
            <template v-slot:edit="{ row }">
              <DatePicker v-model="row.outDate"
                          type="date"
                          :start-date="new Date(item.year+'/'+item.month+'')"
                          :options="options"
                          format="yyyy/MM/dd" :transfer="true"
              ></DatePicker>
            </template>
            <template v-slot="{ row }">{{ formatDate(row.outDate) }}</template>
          </vxe-table-column>
          <vxe-table-column field="planCount" title="计划数量" :edit-render="{name: 'input'}" min-width="140" fixed="right"></vxe-table-column>
          <vxe-table-column field="remark" title="备注" :edit-render="{name: 'input'}" min-width="100" fixed="right"></vxe-table-column>
        </vxe-table>
        <!--选择工程部位弹框-->
        <Modal v-model="isAddModal" @on-cancel="cancel" title="选择工程部位" :mask-closable="false" :width="modelWidth"
               class-name="vertical-center-modal">
          <el-tabs type="border-card" style="height: 600px;overflow-y: scroll;" v-if="treeData.length!==0">
            <el-tab-pane :label="i.title" v-for="i in treeData">
              <div v-for="j in i.children">
                <div style="margin: 15px 0;"></div>
                <el-checkbox :indeterminate="isIndeterminate" @change="handleCheckAllChange($event,j.children)">
                  {{j.title}}
                </el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedData" @change="handleCheckedCitiesChange($event,j.children)">
                  <el-checkbox v-for="k in j.children" :label="k" style="width:240px">{{k.title}}</el-checkbox>
                </el-checkbox-group>
                <Divider />
              </div>
            </el-tab-pane>
          </el-tabs>
          <p v-else="treeData.length===0">请按照前置工作完成分部分项</p>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel">取消</Button>
            <Button type="primary" size="large" @click="Preservation">{{btnText}}</Button>
          </div>
        </Modal>
        <!--选择设备弹框-->
        <Modal
          v-model="isDevicedModal"
          @on-cancel="cancel(1)"
          title="选择设备"
          :mask-closable="false"
        >
          <Table border ref="selection" :columns="columns4" :data="DevicedTableData" height="400" v-if="DevicedTableData.length!==0"></Table>
          <p v-else="DevicedTableData.length===0">请按照前置工作机械设备类型</p>
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
  import '@/view/financial/budgeting/offerBudget/state.less'
  import '../index.less'
  import axios from '@/libs/api.request'
  import {paramsValidate, isDataSuccess, formatTime,getRealname,getToken} from '@/libs/util'
  import {
    deleteData,
    SaveMonthlyPlan,
    editMonthlyPlan,
    getDeviceData,
    getEngineeringSite,
    getAllData,
    clearanceData,
    anewData
  } from '@/api/mechanicalEquipment/monthlyPlan'
  import procedure from '@/components/procedure/procedure'
  export default {
    name: "monthlyPlan",
    components: {
      procedure
    },
    data() {
      return {
        headers: { Authorization:'Bearer ' + getToken()},
        files: [],           //上传文件
        baseUrl:axios.baseUrl,
        btn2Text:'',
        btnText:'',
        modelWidth:'',
        options: {
          disabledDate (date) {
            const routerData=JSON.parse(sessionStorage.getItem('month'))
            return date.valueOf() < new Date(routerData.year+'/'+routerData.month+'/'+1+'') - 86400000
              || date.valueOf() > new Date(routerData.year+'/'+parseFloat(routerData.month+1).toString()+'/'+1+'') - 86400000
          }
        },
        checkedData: [],
        checkList: [],
        isIndeterminate: false,
        checkAll: false,
        item:{},
        procedureData: [{name:'分部分项',url:'单位分部分项工程'},{name:'机械设备类型',url:'机械设备类型管理'}],
        author:getRealname(),      //编制人
        planningTime:'',          //计划时间
        modificationTime:'',      //编辑时间
        saveStatus:'',
        isId:'',
        isAddModal: false,       // 选择工程部位弹框
        isDevicedModal: false,   // 选择设备弹框
        tableData: [],           // 表格数据
        treeData: [],            // 工程部位树数据
        rowData: [],             // 编辑当前行的数据
        DevicedTableData: [],    // 选择设备数据
        selectList: [],          // 选择的设备数据
        judge:false,               //判断自动生成计划是否有数据
        columns4: [              // 设备表格
          {
            title: "选择",
            width: 70,
            type: "_checked",
            align: "center",
            render: (h, {row, index}) => {
              let _that = this;
              return h("div", [
                h("Checkbox", {
                  props: {
                    value: row._checked
                  },
                  on: {
                    "on-change": e => {
                      this.DevicedTableData.forEach(items => {
                        this.$set(items, "_checked", false);
                      });
                      if (e === false) {
                        this.selectList = "";
                      } else {
                        this.selectList = row;
                      }
                      this.DevicedTableData[index]._checked = e;
                    }
                  }
                })
              ]);
            }
          },
          {
            title: '设备类型',
            key: 'name'
          },
          {
            title: '设备型号',
            key: 'power'
          },
          {
            title: '功率',
            key: 'model'
          }
        ],
        validRules: {              // 表格验证
          name: [
            {required: true, type: 'string', message: '请选择工程部位'}
          ],
          categoryName: [
            {required: true, type: 'string', message: '请选择设备类型'}
          ],
          power: [
            {required: true, type: 'string', message: '请选择设备型号'}
          ],
          model: [
            {required: true, type: 'string', message: '请选择设备功率'}
          ],
          inDate: [
            {required: true, type: 'string', message: '请选择进场时间'}
          ],
          outDate: [
            {required: true, type: 'string', message: '请选择出场时间'}
          ],
          planCount: [
            { required: true, type: 'number', message: '请输入计划数量'},
            { pattern:/^\+?[1-9]\d*$/,message: '请输入正整数'},
            { type: 'number',max:10000,message: '系统最大数不能超过10000'},
          ],
          remark:[
            {type: 'string',max:300,message: '备注数超出系统范围'},
          ],
        },
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
      },
      //时间格式化
      formatDate(value) {
        if (value) {
          return formatTime(value)
        } else {
          return ''
        }
      },
      clickLeadingOut(){
          window.open(axios.baseUrl + '/pcm/equipments/month_plans/excel_export/' +
           JSON.parse(localStorage.getItem('projectId')).id+'/'+parseInt(this.item.year)+'/'+parseInt(this.item.month))
      },
      //清空计划
      clearancePlan(){
        this.$Modal.confirm({
          title: '清空计划列表',
          content: '<p>你确定要清空计划列表吗?</p>',
          onOk: ()=>{
            clearanceData(JSON.parse(localStorage.getItem('projectId')).id,parseInt(this.item.year),parseInt(this.item.month)).then(res => {
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
                  this.tableData = []
                  this.getData()                        //  拉一次数据
                  this.$Message.success(data.msgContent)
                  break;
              }
            })
          }
        })
      },
      //重新自动生成
      reconstruction(){
        this.$Modal.confirm({
          title: '重新自动生成',
          content: '<p>你确定要重新自动生成吗?</p>',
          onOk: ()=>{
            clearanceData(JSON.parse(localStorage.getItem('projectId')).id,parseInt(this.item.year),parseInt(this.item.month)).then(res => {
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
                  this.tableData = []
                  this.getData()                        //  拉一次数据
                  break;
              }
            }).then(()=>{
              anewData(JSON.parse(localStorage.getItem('projectId')).id,parseInt(this.item.year),parseInt(this.item.month)).then(res => {
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
                    if(data.msgData){
                      this.saveStatus = data.msgData.saveStatus
                      this.planningTime = data.msgData.createDate
                      this.modificationTime = data.msgData.finishDate
                      this.isId = data.msgData.id
                      if (data.msgData.planVos.length !== 0) {
                        let dataArr = []
                        data.msgData.planVos.forEach(v => {
                          let data = {}
                          data.id = v.id
                          data.name = v.positionNames
                          data.positionIds = v.positionIds?v.positionIds.split(","):v.positionIds
                          data.categoryName = v.categoryName
                          data.power = v.power
                          data.model = v.model
                          data.inDate = v.inDate
                          data.outDate = v.outDate
                          data.planCount = v.planCount
                          data.remark = v.remark
                          dataArr.push(data)
                        })
                        this.$Message.success('自动生成计划操作成功');
                        this.tableData = dataArr
                      } else {
                        this.$Message.error('此年度中没有计划');
                        this.tableData = []
                      }
                    }
                    break;
                }
              })
            })
          }
        })
      },
      generatePlan(){
        anewData(JSON.parse(localStorage.getItem('projectId')).id,parseInt(this.item.year),parseInt(this.item.month)).then(res => {
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
              if(data.msgData){
                this.saveStatus = data.msgData.saveStatus
                this.planningTime = data.msgData.createDate
                this.modificationTime = data.msgData.finishDate
                this.isId = data.msgData.id
                if (data.msgData.planVos.length !== 0) {
                  let dataArr = []
                  data.msgData.planVos.forEach(v => {
                    let data = {}
                    data.id = v.id
                    data.name = v.positionNames
                    data.positionIds = v.positionIds?v.positionIds.split(","):v.positionIds
                    data.categoryName = v.categoryName
                    data.power = v.power
                    data.model = v.model
                    data.inDate = v.inDate
                    data.outDate = v.outDate
                    data.planCount = v.planCount
                    data.remark = v.remark
                    dataArr.push(data)
                  })
                  this.judge = true
                  this.tableData = dataArr
                } else {
                  this.judge = false
                  this.tableData = []
                }
              }
              break;
          }
        })
      },
      //删除
      confirm() {
        if (this.$refs.xTable.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中机械设备',
            content: '<p>你确定要删除选中机械用品吗?</p>',
            onOk: () => {

              this.$refs.xTable.removeSelecteds()   //  删除表格中选中的数据
              if (this.$refs.xTable.getRemoveRecords().length !== 0) {
                //判断删除的数据的长度删除数据的Id添加到deleteId中
                const deleteId = {'ids': []}
                this.$refs.xTable.getRemoveRecords().forEach(v => {
                  deleteId.ids.push(v.id)
                })
                deleteData(deleteId).then(res => {
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
                      this.getData()                        //  拉一次数据
                      this.$Message.success(data.msgContent)
                      break;
                  }
                })
              }
            },
          });
        } else {
          this.$Message.error('请选择删除的机械设备')
        }
      },
      //保存
      /*  getRecordset()获取表格数据集
      （获取新增、删除、更改的数据，对于增删改查表格非常方便）
       {insertRecords, removeRecords, updateRecords}*/
      saveData(state) {
        const tables=this.$refs.xTable.getRecordset().insertRecords
        console.log(tables)
        const ren=[]
        tables.forEach(v=>{
          console.log(v)
          if(v.name===null||v.name===''&&v.categoryName===null||v.categoryName===''&&v.inDate===null||v.inDate===''&&v.outDate===null||v.outDate===''&&v.planCount===null||v.planCount===''){
            ren.push(v)
          }
        })
        this.$refs.xTable.remove(ren)
        this.$refs.xTable.validate(valid => {
          if (valid) {
            // 获取新增数据的Api getInsertRecords()
            if (this.isId) {
              const editDataAll = {'vos': [], saveStatus: state, id: this.isId}
              const editAllData = this.$refs.xTable.getTableData().tableData
              // 循环添加的数据到editDataAll中
              if(editAllData.length!==0){
                editAllData.forEach(j => {
                  let editVal = {}
                  editVal.id = j.id
                  editVal.name = j.categoryName
                  editVal.model = j.model
                  editVal.power = j.power
                  editVal.positionNames=j.name
                   if(j.positionIds){
                     editVal.positionIds = j.positionIds.join(',')
                   }
                  editVal.inDate = formatTime(j.inDate)
                  editVal.outDate = formatTime(j.outDate)
                  editVal.planCount = j.planCount
                  editVal.remark = j.remark
                  editDataAll.vos.push(editVal)
                })
              }
              editMonthlyPlan(editDataAll,JSON.parse(localStorage.getItem('projectId')).id,parseInt(this.item.year),parseInt(this.item.month)).then(res => {
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
                    this.getData()               // 拉一次数据
                    this.$Message.success(data.msgContent)
                    break;
                }
              })
            } else{  // 判断修改的数据
              const data = {'vos': [],saveStatus:state}
              const newData = this.$refs.xTable.getTableData().tableData
            if (newData.length !== 0) {
              newData.forEach(v => {
                let val = {}

                val.name = v.categoryName
                val.model = v.model
                val.power = v.power
                val.positionNames=v.name
                if(v.positionIds){
                  val.positionIds = v.positionIds.join(',')
                }
                val.inDate = formatTime(v.inDate)
                val.outDate = formatTime(v.outDate)
                val.planCount = v.planCount
                val.remark = v.remark
                data.vos.push(val)
              })
              //新增接口
              SaveMonthlyPlan(data,JSON.parse(localStorage.getItem('projectId')).id,parseInt(this.item.year),parseInt(this.item.month)).then(res => {
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
                    this.getData()      // 拉一次数据
                    this.$Message.success(data.msgContent)
                    break;
                }
              })
            }
            }
          }
        })
      },
      // val等于1 点击保存设备类型 反之为工程部位保存
      Preservation(val) {
        if (val === 1) {
          if (this.selectList.length !== 0) {
            console.log(this.selectList)
            this.rowData.categoryName = this.selectList.name
            this.rowData.power = this.selectList.power
            this.rowData.model = this.selectList.model
            this.isDevicedModal = false
          } else {
            this.$Message.error("请选择设备");
          }
        } else{
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
          this.rowData.name = checkedTitle.join(';')
          this.rowData.positionIds = checkedId
          this.isAddModal = false
        }
      },
      // 添加表格一行
      insertEvent(row) {
        this.$refs.xTable.insertAt(row,-1)
      },
      // 编辑时弹框打开
      editActivedEvent({row, column}, event) {
        this.rowData = row
        const arrcheck=[]
        if (`${column.title}` === '工程部位') {
          console.log(this.treeData)
          if (row.name) {
            if(row.positionIds){
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
            this.checkedData = []
          }
          if(this.treeData.length!==0){
            this.btnText='保存'
            this.modelWidth=800
          }else {
            this.btnText='确定'
            this.modelWidth=520
          }
          this.isAddModal = true
        } else if (`${column.title}` === '设备类型' || `${column.title}` === '设备型号' || `${column.title}` === '功率') {
          if (row.categoryName) {
            this.DevicedTableData.forEach(v => {
              if (v.name === row.categoryName) {
                this.$set(v, '_checked', true)
                console.log(v)
              } else {
                this.$set(v, '_checked', false)
              }
            })
          } else {
            this.DevicedTableData.forEach(v => {
              this.$set(v, '_checked', false)
            })
          }
          if(this.DevicedTableData.length!==0){
            this.btn2Text='保存'
          }else {
            this.btn2Text='确定'
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
        getDeviceData(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
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
              this.DevicedTableData = res.data.msgData
              break;
          }
        })
      },
      // 获取工程部位
      engineeringSite() {
        getEngineeringSite(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
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
              this.treeData = res.data.msgData
              break;
          }
        })
      },
      //  获取表格全部数据
      getData() {
        getAllData(JSON.parse(localStorage.getItem("projectId")).id,parseInt(this.item.year),parseInt(this.item.month)).then(res => {
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
              if(data.msgData){
                if (data.msgData.planVos.length !== 0) {
                  this.saveStatus = data.msgData.saveStatus
                  this.planningTime = data.msgData.createDate
                  this.modificationTime = data.msgData.finishDate
                  this.isId = data.msgData.id
                  let dataArr = []
                  if (data.msgData.planVos.length !== 0) {
                    data.msgData.planVos.forEach(v => {
                      let data = {}
                      data.id = v.id
                      data.name = v.positionNames
                      data.positionIds = v.positionIds?v.positionIds.split(","):v.positionIds
                      data.categoryName = v.categoryName
                      data.power = v.power
                      data.model = v.model
                      data.inDate = v.inDate
                      data.outDate = v.outDate
                      data.planCount = v.planCount
                      data.remark = v.remark
                      dataArr.push(data)
                    })
                    this.tableData = dataArr
                  }

                }
              }
              break;
          }
        })
      },
      initialise() {
        getAllData(JSON.parse(localStorage.getItem("projectId")).id, parseInt(this.item.year), parseInt(this.item.month)).then(res => {
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
              if (data.msgData) {
                if (data.msgData.id) {
                  this.saveStatus = data.msgData.saveStatus
                  this.planningTime = data.msgData.createDate
                  this.modificationTime = data.msgData.finishDate
                  this.isId = data.msgData.id
                  if (data.msgData.planVos.length !== 0) {
                    let dataArr = []
                    if (data.msgData.planVos.length !== 0) {
                      data.msgData.planVos.forEach(v => {
                        let data = {}
                        data.id = v.id
                        data.name = v.positionNames
                        data.positionIds = v.positionIds?v.positionIds.split(","):v.positionIds
                        data.categoryName = v.categoryName
                        data.power = v.power
                        data.model = v.model
                        data.inDate = v.inDate
                        data.outDate = v.outDate
                        data.planCount = v.planCount
                        data.remark = v.remark
                        dataArr.push(data)
                      })
                    }
                    this.tableData = dataArr
                  }
                } else {
                  this.generatePlan()
                }
              } else {
                this.generatePlan()
              }
              break;
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
      this.item=JSON.parse(sessionStorage.getItem('month'))
      console.log(this.item)
      // 进入页面调用的表格数据
      this.initialise()
    }
  }
</script>

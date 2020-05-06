<template>
  <div class='bigbox'>
    <Card class="left-box">
      <div class="textBox">
        <p class="state" v-if="this.saveStatus===1">状态:完成</p>
        <p class="state" v-else>状态:<span style="color: red">未完成</span></p>
        <p class="name ">编制人:{{author}}</p>
        <P class="time">创建日期:{{planningTime}}</P>
        <p class="time">完成日期:{{modificationTime}}</p>
        <div class="right">
          <Button class="btn" @click="clickFinish(0)"  v-bind:disabled="this.saveStatus===1">&nbsp临时保存</Button>
          <Button class="btn" type="primary" @click="clickFinish(1)" v-if="this.saveStatus===1">&nbsp提交</Button>
          <Button class="btn" type="primary" @click="clickFinish(1)" v-else>&nbsp完成计划</Button>
        </div>
      </div>
      <div class="bottom20">
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;增加机械设备</Button>
          <Button class="search-btn" type="error" @click="clickDelete">&nbsp;批量删除</Button>
        </ButtonGroup>
        <!--<Button class="search-btn" @click="">&nbsp;转租</Button>-->
        <Upload
          style="display: inline-block"
          :show-upload-list="false"
          :before-upload="handleUpload"
          :on-success="succeeded"
          :on-error="uploadFailure"
          :headers="headers"
          :format="['xlsx','xls']"
          :on-format-error="handleFormatError"
          :action="`${baseUrl}/pcm/equipments/rent_plan/rent_plans/import_excel/${IsId}`">
          <Button class="search-btn">&nbsp;导入租赁计划</Button>
        </Upload>
        <Button class="search-btn" @click="clickLeadingOut" v-bind:disabled="tableData.length===0">&nbsp;导出租赁计划</Button>
        <Button class="search-btn" @click="clickEmpty" type="error" v-bind:disabled="tableData.length===0">&nbsp;清空租赁计划</Button>
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
          <vxe-table-column type="selection" min-width="50" fixed="left" width="50"></vxe-table-column>
          <vxe-table-column type="index" min-width="60" fixed="left" width="50">
            <template v-slot:header="{ column }">
              <span>#</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="机械名称" :edit-render="{name: 'input'}" min-width="130" fixed="left"></vxe-table-column>
          <vxe-table-column field="model" title="机械型号"  min-width="100"></vxe-table-column>
          <vxe-table-column field="power" title="设备功率"  min-width="100"></vxe-table-column>
          <vxe-table-column field='rentStartDate' title="最早使用时间" min-width="140"></vxe-table-column>
          <vxe-table-column field='entiretyPlanCount' title="总使用量" min-width="140"></vxe-table-column>
          <vxe-table-column field="earliestUseDate" title="计划使用时间" :edit-render="{type: 'default'}" min-width="140">
            <template v-slot:edit="{ row }">
              <DatePicker v-model="row.earliestUseDate" type="date" format="yyyy/MM/dd" :transfer="true"></DatePicker>
            </template>
            <template v-slot="{ row }">{{ formatDate(row.earliestUseDate) }}</template>
          </vxe-table-column>
          <vxe-table-column field="planOutDate" title="预计出场时间" :edit-render="{type: 'default'}" min-width="150">
            <template v-slot:edit="{ row }">
              <DatePicker v-model="row.planOutDate" type="date" format="yyyy/MM/dd" :transfer="true"></DatePicker>
            </template>
            <template v-slot="{ row }">{{ formatDate(row.planOutDate) }}</template>
          </vxe-table-column>
          <vxe-table-column field="rentCount" title="计划使用数量" :edit-render="{name: 'input'}" min-width="150"></vxe-table-column>
          <vxe-table-column field="rentPrice" title="预计单价(元)" :edit-render="{name: 'input'}" min-width="130"></vxe-table-column>
          <vxe-table-column field="rentTotalPrice" title="预计总价(元)" :edit-render="{name: 'input'}" min-width="130" fixed="right"></vxe-table-column>
        </vxe-table>
      </div>
      <Modal v-model="isDevicedModal" @on-cancel="cancel" title="选择机械设备" :mask-closable="false" width="600">
        <Table border ref="selection" :columns="columns4" :data="VerallPlan" height="500" v-if="VerallPlan.length!==0"></Table>
        <p v-else="VerallPlan.length===0">请按照前置工作完成整体使用计划</p>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel">取消</Button>
          <Button type="primary" size="large" @click="Preservation">{{btn2Text}}</Button>
        </div>
      </Modal>
    </Card>
    <procedure :data="procedureData"></procedure>
  </div>
</template>

<script>
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate, isDataSuccess, formatTime,getRealname,getToken} from '@/libs/util'
  import {planList, emptyData,deleteData,editAllData,getVerallPlanData, saveData} from '@/api/leaseManagement/leasePlan'
  import axios from '@/libs/api.request'
  import procedure from '@/components/procedure/procedure'
  export default {
    name: "leasePlan",
    components: {
      procedure
    },
    data(){
      return {
        headers: { Authorization:'Bearer ' + getToken()},
        files: [],           //上传文件
        baseUrl: axios.baseUrl,
        btn2Text:'',
        procedureData: [{name: '整体使用计划', url: 'integratedPlanning'}],
        rowData:[],
        selectList: [],
        saveStatus:'',
        IsId:'',
        isDevicedModal:false,
        VerallPlan:[],
        author: getRealname(),
        planningTime: '', // 计划时间
        modificationTime: '', // 编辑时间
        tableData:[],
        validRules: {
          earliestUseDate: [
            { required: true, type: 'string', message: '请填写计划使用时间' }
          ],
          rentPrice: [
            { required: true, type: 'number', message: '请输入预计单价'},
              {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
              {type: 'number',max:999999999,message: '以超出系统最大数'},
          ],
          rentTotalPrice: [
            { required: true, type: 'number', message: '请输入预计总价'},
              {pattern: /^(([1-9]\d{0,9})|0)(\.\d{0,2})?$/, message: '请输入正确的金额'},
              {type: 'number',max:999999999,message: '以超出系统最大数'},
          ],

          rentCount: [
            { required: true, type: 'string', message: '请填写计划使用数量' },
            { pattern:/^\+?[1-9]\d*$/,message: '请输入正整数'},
            {type: 'number',max:10000,message: '系统最大数不能超过10000'},
          ],
          planOutDate: [
            { required: true, type: 'string', message: '请填写预计出场时间' }
          ],
        },
        columns4: [
          {
            title: ' ',
            width: 50,
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
                      this.VerallPlan.forEach(items => {
                        this.$set(items, '_checked', false)
                      })
                      if (e === false) {
                        this.selectList = '';
                      } else {
                        this.selectList = row
                      }
                      this.VerallPlan[index]._checked = e
                    }
                  }
                })
              ])
            }
          },
          {
            title: '设备类型',
            key: 'categoryName'
          },
          {
            title: '设备型号',
            key: 'model'
          },
          {
            title: '功率',
            key: 'power'
          },
        ],
      }
    },
    methods:{
      //编辑后保存
      clickFinish(state){
        const tables = this.$refs.xTable.getRecordset().insertRecords
        const ren = []
        tables.forEach(v=>{
          console.log(v)
          if(v.name===null||v.name===''&&v.earliestUseDate===null||v.earliestUseDate===''&&v.rentCount===null||v.rentCount===''&&v.planOutDate===null||v.planOutDate===''){
            ren.push(v)
          }
        })
        this.$refs.xTable.remove(ren)

        this.$refs.xTable.validate(v=>{
          if(v){
            if (this.IsId){
              const editData={"saveStatus":state,"rentPlanVos":[]}
              if(this.$refs.xTable.getTableData().tableData.length!==0){
                  this.$refs.xTable.getTableData().tableData.forEach(i=>{
                  editData.rentPlanVos.push(i)
                })
              }
                console.log(this.$refs.xTable.getTableData().tableData)
              console.log(editData.rentPlanVos)
              if(editData.rentPlanVos.length!==0){
                editAllData(this.IsId,JSON.parse(localStorage.getItem("projectId")).id,editData).then(res=>{
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
                      this.getAllData()
                      this.$Message.success(data.msgContent)
                      break
                  }
                })
              }
            }else{
              const allData = {'rentPlanVos':[],"saveStatus":state}
              allData.rentPlanVos=this.$refs.xTable.getRecordset().insertRecords
              console.log(this.$refs.xTable.getRecordset().insertRecords)
              console.log(allData)
              if(allData.rentPlanVos.length!==0){
                saveData(JSON.parse(localStorage.getItem("projectId")).id,allData).then(res=>{
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
                      this.getAllData()
                      this.$Message.success(data.msgContent)
                      break
                  }
                })
              }
            }
          }
        })
      },
      //删除选中数据
      clickDelete(){
        if(this.$refs.xTable.getSelectRecords().length!==0){
          this.$Modal.confirm({
            title: '删除选中机械设备',
            content: '<p>你确定要删除选中机械用品吗?</p>',
            onOk: ()=>{
              const deleteId={"ids":[]}
              //选中的数据
              const checkData=this.$refs.xTable.getSelectRecords()
              if(checkData.length!==0){
                checkData.forEach(v=>{
                  if(v.id){
                    deleteId.ids.push(v.id)
                  }else {
                    this.$refs.xTable.removeSelecteds()   //  删除表格中选中的数据
                  }
                })
              }
              console.log(deleteId)
              if(deleteId.ids.length!==0){
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
                      this.getAllData()                        //  拉一次数据
                      this.$Message.success(data.msgContent)
                      break;
                  }
                })
              }
            }
          })
        }else {
          this.$Message.error("请选择要删除的机械设备")
        }
      },
      //点击导出Excel
      clickLeadingOut(){
        window.open(axios.baseUrl + '/pcm/equipments/rent_plan/rent_plans/excel/' + JSON.parse(localStorage.getItem('projectId')).id)
      },
      //点击清空
      clickEmpty(){
        this.$Modal.confirm({
          title: '清空采购计划',
          content: '<p>你确定要清空采购计划吗?</p>',
          onOk: ()=>{
            emptyData(JSON.parse(localStorage.getItem('projectId')).id).then(res=>{
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
                  this.getAllData()                        //  拉一次数据
                  this.$Message.success(data.msgContent)
                  break
              }
            })
          }
        })
      },
      cancel() {
        this.isDevicedModal = false
      },
      //时间格式化
      formatDate(value) {
        if (value) {
          return formatTime(value)
        } else {
          return ''
        }
      },
      //点击新增
      insertEvent(row) {
        this.$refs.xTable.insertAt(row, -1)
      },
      //获取表格全部数据
      getAllData() {
        planList(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
               if(data.msgData){
                 console.log(data)

                 this.planningTime=data.msgData.createDate
                 this.modificationTime=data.msgData.finishDate
                 this.IsId=data.msgData.id
                 this.saveStatus=data.msgData.saveStatus
                 this.tableData=data.msgData.rentPlanVos
               }
              break
          }
        })
      },
      editActivedEvent({row, column}, event){
        this.rowData = row
        if(`${column.title}` === '机械名称' || `${column.title}` === '机械型号' || `${column.title}` === '设备功率'){
          if(row.name){
            this.VerallPlan.forEach(v=>{
              console.log(v)
              if(v.id===row.entiretyPlanId){
                this.$set(v, '_checked', true)
              }else {
                this.$set(v, '_checked', false)
              }
            })
          }else {
            this.VerallPlan.forEach(v=>{
              this.$set(v, '_checked', false)
            })
          }
          if (this.VerallPlan.length !== 0) {
            this.btn2Text = '保存'
          } else {
            this.btn2Text = '确定'
          }
          this.isDevicedModal = true
          console.log(row)
        }
      },
      Preservation(){
        this.rowData.name = this.selectList.categoryName
        this.rowData.power = this.selectList.power
        this.rowData.model = this.selectList.model
        this.rowData.rentStartDate = this.selectList.inDate
        this.rowData.entiretyPlanId = this.selectList.id
        this.rowData.entiretyPlanCount = this.selectList.planCount
        this.isDevicedModal = false
      },
      getVerallPlan() {
        getVerallPlanData(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
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
              if(res.data.msgData){
                this.VerallPlan = res.data.msgData
              }
              console.log(this.VerallPlan)
              break;
          }
        })
      },
      succeeded(res) {
        console.log(res)
        if(res.msgCode===0){
          this.$Message.success("文件导入成功！")
          this.files = []
          this.getAllData()
        }else {
          if(this.IsId===''){
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
    activated(){
      this.getVerallPlan()
      this.getAllData()
    }
  }
</script>

<style scoped lang="less">
  .bigbox {
    display: flex;
    .left-box {
      width: 90%;
    }
  }
  .left {
    float: left;
  }
  .search-btn{
    margin-left: 10px;
  }
  .bottom20{
    margin-top: 40px;
  }
</style>

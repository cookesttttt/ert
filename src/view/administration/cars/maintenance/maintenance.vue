<template>
  <Card style="height: 100%">
    <div class="bottom15">
      <!--新建违章信息-->
      <Button  class="search-btn" type="primary" @click="newMaintenanceClick" >&nbsp;新建维修保养记录</Button>
      <Modal
        class-name="vertical-center-modal"
        title="新建维修保养信息"
        v-model="isAddModal4"
        :mask-closable="false"
        @on-cancel="cancel4(1)">
        <Form
          ref="maintenanceData"
          :model="maintenanceData"
          :label-width="100" inline :rules="rules4">
          <FormItem label="车牌号码" prop="vehicleName">
            <AutoComplete
              v-model="maintenanceData.vehicleName"
              :data="allNumber"
              :filter-method="filterMethod"
              placeholder="输入关键字查询车辆"
              class="width350" >
            </AutoComplete>
          </FormItem>
          <br>
          <FormItem label="维保日期" prop="maintenanceDate">
            <DatePicker v-model="maintenanceData.maintenanceDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
          </FormItem>
          <br>
          <FormItem label="维保地点" prop="maintenanceSite">
            <Input v-model="maintenanceData.maintenanceSite" class="width350" :maxlength="15"></Input>
          </FormItem>
          <FormItem label="经办人" prop="operator">
            <Input v-model="maintenanceData.operator" class="width350" :maxlength="15"></Input>
          </FormItem>
          <br>
          <FormItem label="维保项目" prop="maintenanceProject">
            <Input v-model="maintenanceData.maintenanceProject" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
          </FormItem>
          <br>
          <FormItem label="维保费用" prop="maintenanceCost">
            <Input v-model="maintenanceData.maintenanceCost" class="width350" :maxlength="12"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"   size="large"  @click="cancel4(1)">取消</Button>
          <Button type="primary" size="large" @click="addMaintenance">保存</Button>
        </div>
      </Modal>
      <!--收搜-->
      <div class="right" style="float: right">
        <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue4"></Input>
        <Button class="search-btn" type="primary" @click="searchMaintenance">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>
    </div>
    <div class="clear"></div>
    <!--表格-->
    <Table
      border
      :columns="columns4"
      :data="tableData4">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <br>
        <Page :total="totalElements4"
              :current="pageNum4"
              show-total
              @on-change="changePage4">
        </Page>
      </div>
    </div>
    <!--编辑维修保养信息弹框-->
    <Modal
      class-name="vertical-center-modal"
      title="编辑维修保养信息"
      v-model="isEditModal4"
      :mask-closable="false"
      @on-cancel="cancel4">
      <Form
        ref="editMaintenanceData"
        :model="editMaintenanceData"
        :label-width="100" inline :rules="rules4">
        <FormItem label="车牌号码" prop="vehicleName">
          <AutoComplete
            v-model="editMaintenanceData.vehicleName"
            :data="allNumber"
            :filter-method="filterMethod"
            placeholder="输入关键字查询车辆"
            class="width350" >
          </AutoComplete>
        </FormItem>
        <br>
        <FormItem label="维保日期" prop="maintenanceDate">
          <DatePicker v-model="editMaintenanceData.maintenanceDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
        </FormItem>
        <br>
        <FormItem label="维保地点" prop="maintenanceSite">
          <Input v-model="editMaintenanceData.maintenanceSite" class="width350" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="经办人" prop="operator">
          <Input v-model="editMaintenanceData.operator" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="维保项目" prop="maintenanceProject">
          <Input v-model="editMaintenanceData.maintenanceProject" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
        </FormItem>
        <br>
        <FormItem label="维保费用" prop="maintenanceCost">
          <Input v-model="editMaintenanceData.maintenanceCost" class="width350" :maxlength="12"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"   size="large"  @click="cancel4">取消</Button>
        <Button type="primary" size="large" @click="editMaintenance">保存</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
  /**
   *  paramsValidate 验证是否为空
   *  isDataSuccess 验证数据是否成功
   * */
import {
  paramsValidate,
  isDataSuccess,
  formatTime
} from '@/libs/util'
import {
  newMaintenanceData,
  getAllMaintenanceData,
  deleteMaintenanceData,
  getEditMaintenanceData
} from '@/api/cars/maintenance'
import { getAllNumber } from '@/api/cars/allNumber'
import '../index.less'
export default {
  name: "maintenance",
  data(){
      return {
        isAddModal4:false,
        isEditModal4:false,
        allNumber:[],                           //获取所有车牌
          searchValue4:'',                         //收搜数据
        maintenanceData:{                    //新增维护保养信息数据
          vehicleName:'',                      //车牌号码
          maintenanceDate:'',                  //维保日期
          maintenanceSite:'',                 //维保地点
          operator:'',                        //经办人
          maintenanceProject:'',              //维保项目
          maintenanceCost:'',                //维保费用

        },
        editMaintenanceData:{              //编辑维护保养信息数据
          vehicleName:'',                      //车牌号码
          maintenanceDate:'',                  //维保日期
          maintenanceSite:'',                 //维保地点
          operator:'',                        //经办人
          maintenanceProject:'',              //维保项目
          maintenanceCost:'',                //维保费用
          id:''
        },
        rules4:{                         //必填项的验证
          maintenanceDate:[
            {
              type:'date',
              required: true,
              message: '请选择维保日期',
              trigger: 'change'
            }
          ],
          maintenanceSite:[
            {
              required: true,
              message: '请填写维保地点',
              trigger: 'blur'
            }
          ],
          operator: [
            { required: true,
              message: '请填写经办人',
              trigger: 'blur'
            }
          ],
          maintenanceProject:[{
            required: true,
            message: '请填写维保项目',
            trigger: 'blur'
          }],
          maintenanceCost:[
            {
            required: true,
            message: '请填写维保费用',
            trigger: 'blur'
          },
              {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
          ],
        },
        tableData4:[],                    // 表格数据
        pageNum4: 1,                     // 当前页码
        pageSize4: 10,                  // 每页显示多少条
        totalElements4: 0,             // 初始化信息总条数
        columns4:[
          {
            type: 'selection',
            width: 60,
            align: 'center',
            fixed: 'left',
          },
          {
            type: 'index',
            fixed: 'left',
            width: 50,
            align: 'center'
          },
          {
            title:'车牌号码',
            fixed: 'left',
            width: 100,
            key:'vehicleNumber',
          },
          {
            title:'维保日期',
            width: 120,
            key:'maintenanceDate',
          },
          {
            title:'维保地点',
            width: 200,
              tooltip:true,
            key:'maintenancePlace',
          },
          {
            title:'经办人',
            width: 80,
            key:'transactor'
          },
          {
            title:'维保项目',
            width: 300,
              tooltip:true,
            key:'maintenanceItem'
          },
          {
            title:'维保费用',
            width: 150,
            key:'maintenanceCost'
          },
          {
            title: '操作',
            fixed: 'right',
            width: 130,
            key: 'handle',
            render: (h, params, vm) => {
              return [
                [h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    'click': () => {
                      this.getNumber()
                      this.echoData4(params.index)
                    }
                  },
                  style:{
                    marginRight:'5px'
                  }
                },"编辑")],
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
                        this.deleteMaintenance(params.index)
                      }
                    }
                  },
                  [h('Button', {
                    props:{
                      type: 'error',
                      size: 'small'
                    },
                  },"删除")])
              ]
            }
          }
        ],
      }
    },
    methods:{
      newMaintenanceClick(){
        this.isAddModal4=true
        this.getNumber()
      },
      //获取车牌
      getNumber(){
        //获取车牌
        getAllNumber(JSON.parse(localStorage.getItem("projectId")).id).then(res=>{
          const data = res.data
          console.log(res)
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error("服务器繁忙请稍后")
              break
            case 2:
              this.$Message.error(data.msgContent)
              break
            default:
              this.allNumber= data.msgData
              break
          }
        })
      },
      //过滤车牌
      filterMethod (value, option) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
      },
      /**
       * 分页
       * */
      changePage4(index){
        this.pageNum4 = index
        this.getAllData4(this.pageNum4)
      },
      /**
       *关闭弹框
       * status等于1为新建框的关闭
       */
      cancel4(status){
        if(status===1){
          this.$refs.maintenanceData.resetFields()  //清空
          this.isAddModal4 = false
        }else {
          this.$refs.editMaintenanceData.resetFields()  //清空
          this.isEditModal4 = false
        }
      },
      /**添加维修保养信息
       *1：valid 判断必填项
       * 2：isDataSuccess 判断数据
       */
      addMaintenance(){
        this.$refs.maintenanceData.validate((valid)=>{
          if(valid){
            let reg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
            if(this.maintenanceData.vehicleName&&reg.test(this.maintenanceData.vehicleName)){
              const data={
                "vehicleNumber":this.maintenanceData.vehicleName,
                "maintenanceDate":formatTime(this.maintenanceData.maintenanceDate),
                "maintenancePlace":this.maintenanceData.maintenanceSite,
                "transactor":this.maintenanceData.operator,
                "maintenanceItem":this.maintenanceData.maintenanceProject,
                "maintenanceCost":this.maintenanceData.maintenanceCost,
                "projectId":JSON.parse(localStorage.getItem("projectId")).id
              }
              newMaintenanceData(data).then(res=>{
                const data=res.data
                let status= isDataSuccess(res)
                switch (status) {
                  case 1:
                    this.$Message.error("服务器繁忙请稍后")
                    break
                  case 2:
                    this.$Message.error(data.msgContent)
                    break
                  default:
                    this.getAllData4(this.pageNum4)                           //拉一次数据
                    this.cancel4(1)
                    this.$Message.success(data.msgContent)
                    break
                }
              })
            }else {
              this.$Message.error("填写正确车牌号码")
            }

          }
        })
      },
      /**收搜维护保养信息
       * */
      searchMaintenance(){
        this.pageNum4=1
        this.getAllData4(this.pageNum4)
      },
      /**
       * 获取全部数据
       * */
      getAllData4(pageNum4){
        getAllMaintenanceData(JSON.parse(localStorage.getItem("projectId")).id,pageNum4,this.pageSize4,this.searchValue4).then(res=>{
          console.log(res)
          const data=res.data
          let  status= isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error("服务器繁忙请稍后")
              break
            case 2:
              this.$Message.error(data.msgContent)
              break
            default:
              this.tableData4 =data.msgData.content
              this.totalElements4 = data.msgData.totalElements
              break
          }
          }
        )
      },
      /**
       * 删除维护保养
       * */
      deleteMaintenance (index){
        deleteMaintenanceData(this.tableData4[index].id).then(res=>{
          const data=res.data
          let  status= isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error("服务器繁忙请稍后")
              break
            case 2:
              this.$Message.error(data.msgContent)
              break
            default:
              this.tableData4.splice(index, 1)
              this.getAllData4(this.pageNum4)
              this.$Message.success(data.msgContent)
              break
          }
        })
      },
      /**编辑维护保养数据
       * */
      editMaintenance (){
        if(paramsValidate(this.editMaintenanceData)){
          const data={
            "vehicleNumber":this.editMaintenanceData.vehicleName,
            "maintenanceDate":formatTime(this.editMaintenanceData.maintenanceDate),
            "maintenancePlace":this.editMaintenanceData.maintenanceSite,
            "transactor":this.editMaintenanceData.operator,
            "maintenanceItem":this.editMaintenanceData.maintenanceProject,
            "maintenanceCost":this.editMaintenanceData.maintenanceCost
          }
          getEditMaintenanceData(data,this.editMaintenanceData.id).then(res=>{
            const data=res.data
            let  status= isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error("服务器繁忙请稍后")
                break
              case 2:
                this.$Message.error(data.msgContent)
                break
              default:
                this.getAllData4(this.pageNum4)
                this.cancel4()
                this.$Message.success(data.msgContent)
                break
            }
          })
        }
      },
      /**
       * 编辑数据回显
       **/
      echoData4(index){
        this.isEditModal4=true
        this.editMaintenanceData.vehicleName = this.tableData4[index].vehicleNumber
        this.editMaintenanceData.maintenanceDate = this.tableData4[index].maintenanceDate
        this.editMaintenanceData.maintenanceSite = this.tableData4[index].maintenancePlace
        this.editMaintenanceData.operator = this.tableData4[index].transactor
        this.editMaintenanceData.maintenanceProject = this.tableData4[index].maintenanceItem
        this.editMaintenanceData.maintenanceCost = this.tableData4[index].maintenanceCost
        this.editMaintenanceData.id = this.tableData4[index].id
      },
    },
    mounted(){
      this.getAllData4(this.pageNum4)
    }
  }
</script>

<style scoped>

</style>

<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p  class="name">编制人：{{name}}</p>
      <p class="time"> 制单时间：{{time}}</p>
      <P class="left">单据编号：{{information.number}}</P>
      <div class="right">
        <Button  class="btn">&nbsp打印</Button>
        <Button  class="btn" @click="saveOrder(0)">&nbsp临时保存</Button>
        <Button  class="btn" type="primary"  @click="saveOrder(1)">&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div>
      <Tabs value="name1">
        <TabPane label="基本信息" name="name1">
          <Form
            :model="information"
            :label-width="100"
            class="formItem"
            :rules="informationRules"
            ref="information"
          >
            <FormItem label="单据编号" prop="number">
              <Input v-model="information.number"  style="width:400px" disabled></Input>
            </FormItem>
            <FormItem label="出库库房" prop="storeroomId">
              <Select v-model="information.storeroomId" style="width:400px">
                <Option v-for="item in storeroom" :value="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="出库日期" prop="arrivalDate">
              <DatePicker type="date" v-model="information.arrivalDate"  style="width:400px" format='yyyy-MM-dd'></DatePicker>
            </FormItem>
            <FormItem label="领用单位" prop="shelfNumber">
              <Input v-model="information.shelfNumber"  style="width:400px" :maxlength="15"></Input>
            </FormItem>
            <FormItem label="经办人" prop="operator">
              <Input v-model="information.operator"  style="width:400px" :maxlength="15"></Input>
            </FormItem>
            <FormItem label="摘要" prop="remarks">
              <Input v-model="information.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:400px" :maxlength="255"></Input>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="用品明细" name="name2">
          <ButtonGroup>
            <Button   type="primary"  @click="newSupplies">&nbsp新增出库用品</Button>
            <Button   type="error"  @click="confirm">&nbsp批量删除</Button>
          </ButtonGroup>
          <br><br>
          <vxe-table
            ref="xTable"
            border
            resizable
            show-overflow
            :edit-rules="validRules"
            :data="tableData"
            :edit-config="{trigger: 'click', mode: 'row'}">
            <vxe-table-column type="selection" width="60"></vxe-table-column>
            <vxe-table-column type="index" width="50">
              <template v-slot:header="{ column }">
                <span>#</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="name" title="名称"></vxe-table-column>
            <vxe-table-column field="standard" title="型号规格" ></vxe-table-column>
            <vxe-table-column field="unit" title="单位" ></vxe-table-column>
            <vxe-table-column field="voCount" title="出库数量" :edit-render="{name: 'input'}"></vxe-table-column>
          </vxe-table>

          <Modal
            v-model="isAddModal"
            @on-cancel="cancel"
            width="650"
            title="选择用品"
            :mask-closable="false">
              <el-tabs type="border-card" style="height: 400px;overflow-y: scroll;">
                <el-tab-pane :label="i.categoryName" v-for="i in treeData">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox :label="j.id" v-for="j in i.supplyDtoList" class="checkBoxstop" :disabled="checkdDisabled(j.id)">{{j.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-tab-pane>
              </el-tabs>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel">取消</Button>
              <Button type="primary" size="large" @click="saveData">保存</Button>
            </div>
          </Modal>
        </TabPane>
      </Tabs>
    </div>
  </Card>
</template>

<script>
import '@/view/financial/budgeting/offerBudget/state.less'
import { paramsValidate , isDataSuccess , getRealname , formatTime } from '@/libs/util'    // 验证对象是否为空
import { getEditData , getStoreroom , newSuppliesData , newOutStorageData , getNumber , getEditTableData } from '@/api/materialSupplies/outWarehousingRegistration/outWarehousingRegistrationCopy'// 获取数据
import { mapMutations } from 'vuex'
export default {
  name: 'outWarehousingRegistrationCopy',
  data(){
    return {
      checkList:[],
      isAddModal: false,
      tableData: [],        // 表格数据
      treeData: [],        // 树形数据
      supplies: [],
      time: '',
      name: getRealname(),
      information: {            // 基本信息数据
        number: '',
        arrivalDate: '',
        inDate: '',
        operator: '',
        storeroomId: '',
        shelfNumber: '',
        remarks: '',
        money: '',
      },
      storeroom: [],
      validRules: {
        voCount: [
          {required: true, message: '请填写入库数量'},
            {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
            {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
        ],
      },
      informationRules: {
        arrivalDate: [
          {
            required: true,
            message: '请选择到货日期',
            trigger: 'blur',
            type: 'date'
          }
        ],
        inDate: [
          {
            required: true,
            message: '请选择入库日期',
            trigger: 'blur',
            type: 'date'
          }
        ],
        operator: [
          {
            required: true,
            message: '请填写经办人',
            trigger: 'blur'
          }
        ],
        storeroomId: [{
          required: true,
          message: '请选择入库库房',
          trigger: 'change',
          type: 'number'
        }],
        money: [
          {
            required: true,
            message: '请填写金额',
            trigger: 'blur',
          },
          {
            type: 'number', message: '请输入正确的金额', trigger: 'blur', transform(value) {
              return Number(value)
            }
          }
        ]
      },
    }
  },
  methods: {
    ...mapMutations(['closeTag']),
    close () {
      this.closeTag({
        name: 'outWarehousingRegistrationCopy',
      })
    },
    // 获取入库库房数据
    getStoreroomData() {
      getStoreroom(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        const data = res.data
        console.log(res)
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(data.msgContent)
            break
          default:
            this.storeroom = data.msgData
            break
        }
      })
    },
    // 获取当前时间
    getNowTime() {
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
    // 获取单据编号
    getNumberData() {
      getNumber(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        const data = res.data
        console.log(res)
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(data.msgContent)
            break
          default:
            this.information.number = data.msgData
            break
        }
      })
    },
    // 删除用品弹框
    confirm() {
      this.$Modal.confirm({
        title: '删除选中用品',
        content: '<p>你确定要删除选中用品吗?</p>',
        onOk: () => {
          if (this.$refs.xTable.getSelectRecords().length !== 0) {
            this.$refs.xTable.getSelectRecords().forEach(v => {
              this.tableData.splice(this.tableData.indexOf(v), 1)
            })
          }
        },
      })
    },
    // 点击新增出库用品
    newSupplies() {
      this.isAddModal=true
    },
    // 临时保存或者完成制单
    saveOrder(state) {
      this.$refs.information.validate((valid) => {
        if (valid) {
          if (this.tableData.length !== 0) {
            this.$refs.xTable.validate(valid2 => {
              if (valid2) {
                let arry = []
                this.tableData.forEach(v => {
                  let tableIdCount = {}
                  tableIdCount.id = v.id
                  tableIdCount.voCount = v.voCount
                  arry.push(tableIdCount)
                })
                this.supplies = arry
                const data = {
                  'projectId': JSON.parse(localStorage.getItem('projectId')).id,
                  'repId': this.information.storeroomId,
                  'number': this.information.number,
                  'state': state,
                  'outDate': formatTime(this.information.arrivalDate),
                  'useOrg': this.information.shelfNumber,
                  'transactor': this.information.operator,
                  'remark': this.information.remarks,
                  'supplies': this.supplies
                }
                newOutStorageData(data, window.sessionStorage.getItem('outWarehousingRegistrationCopyId')).then(res => {
                  const data = res.data
                  console.log(res)
                  let status = isDataSuccess(res)
                  switch (status) {
                    case 1:
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      this.$Message.error(data.msgContent)
                      break
                    default:
                      this.$Message.success(data.msgContent)
                      this.close()
                      this.$router.push({path: '/administration/outWarehousingRegistration'})
                      break
                  }
                })
              } else {
                this.$Message.error('请填写出库数量')
              }
            })
          } else {
            this.$Message.error('请填写用品明细')
          }
        } else {
          this.$Message.error('请完成单据基本信息')
        }
      })
    },
    cancel() {
      this.isAddModal = false
    },
    saveData(){
      if(this.treeData.length!==0){
        this.treeData.forEach(v=>{
          v.supplyDtoList.forEach(j=>{
            this.checkList.forEach(k=>{
              if(k===j.id){
                this.tableData.push(j)
              }
            })
          })
        })
      }
      this.checkList=[]
      this.isAddModal=false
    },
    checkdDisabled(id){
      let ids=[]
      this.tableData.forEach(v=>{
        ids.push(v.id)
      });
      if(ids.indexOf(id)===-1){
        return false
      }else {
        return true
      }
    },
    // 切换tabs触发获取表格数据
    tabsChange() {
        getEditTableData(window.sessionStorage.getItem('outWarehousingRegistrationCopyId')).then(
          res => {
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
                this.tableData = data.msgData
                break
            }
          }
        ).then(()=>{
          newSuppliesData(JSON.parse(localStorage.getItem("projectId")).id).then(res=>{
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
                this.treeData=data.msgData
                break
            }
          })
        })
    },
  },
  mounted() {
    this.getNowTime()
    this.getStoreroomData()
    this.getNumberData()

  },
  activated() {
    this.tabsChange()
    this.getStoreroomData()
    getEditData(window.sessionStorage.getItem('outWarehousingRegistrationCopyId')).then(res => {
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
          console.log(res.data)
          this.information.storeroomId = data.msgData.repId
          this.information.shelfNumber = data.msgData.useOrg
          this.information.arrivalDate = data.msgData.outDate
          this.information.operator = data.msgData.transactor
          this.information.remarks = data.msgData.remark
          break
      }
    })
  }
}
</script>

<style lang="less" scoped>
  .search-btn {
    margin-left: 10px;
  }

  .textBox {
    margin-left: 15px;
    margin-bottom: 20px;
    height: 40px;
    line-height: 40px;
    background-color: #e3e8ee;

    p {
      margin-right: 20px;
    }
  }

  .right {
    float: right;
  }

  .left {
    float: left;
  }

  .clear {
    clear: both;
  }

  .formItem {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .checkBoxstop {
    margin-top: 20px;
    width: 80px;
  }
</style>

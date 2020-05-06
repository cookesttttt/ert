<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p  class="name">制单人：{{name}}</p>
      <p class="time"> 创建日期：{{time}}</p>
      <P class="left">单据编号：{{information.number}}</P>
      <div class="right">
        <Button  class="btn">&nbsp打印</Button>
        <Button  class="btn" @click="saveOrder(0)" v-bind:disabled="this.information.state===1">&nbsp临时保存</Button>
        <Button  class="btn" type="primary"  @click="saveOrder(1)" v-if="this.information.state===1">&nbsp提交</Button>
        <Button  class="btn" type="primary"  @click="saveOrder(1)" v-else>&nbsp完成制单</Button>
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
            <FormItem label="盘点库房" prop="storeroomId">
              <Select v-model="information.storeroomId" style="width:400px">
                <Option v-for="item in storeroom" :value="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="盘点日期" prop="arrivalDate">
              <DatePicker type="date" v-model="information.arrivalDate"  style="width:400px" format='yyyy-MM-dd'></DatePicker>
            </FormItem>
            <!--<FormItem label="创建日期" prop="currentDate">-->
              <!--<DatePicker type="date" v-model="information.currentDate"  style="width:400px"  format='yyyy-MM-dd'></DatePicker>-->
            <!--</FormItem>-->
            <FormItem label="盘点人" prop="operator">
              <Input v-model="information.operator"  style="width:400px" :maxlenght="15"></Input>
            </FormItem>
            <FormItem label="摘要" prop="remarks">
              <Input v-model="information.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:400px" :maxlength="15"></Input>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="用品明细" name="name2">
          <ButtonGroup>
            <Button   type="primary"  @click="newSupplies">&nbsp新增用品</Button>
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
            <vxe-table-column field="count" title="系统库存量"></vxe-table-column>
            <vxe-table-column field="voCount" title="盘点后库存量" :edit-render="{name: 'input'}"></vxe-table-column>
            <vxe-table-column field="reason" title="原因" :edit-render="{name: 'input'}"></vxe-table-column>
          </vxe-table>

          <Modal
            width="650"
            v-model="isAddModal"
            @on-cancel="cancel"
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
  import { mapMutations } from 'vuex'
import { paramsValidate , isDataSuccess , getRealname , formatTime } from '@/libs/util'   // 验证对象是否为空
import { newSuppliesData , getStoreroom , editStockingData , getEditData , getEditTableData } from '@/api/materialSupplies/stocking/editStocking'    // 获取数据
export default {
  name: 'editStocking',
  data(){
    return {
      checkList:[],
      isAddModal: false,
      tableData: [],        // 表格数据
      treeData: [],
      supplies: [],
      time: '',
      name: getRealname(),
      information: {            // 基本信息数据
        number: '',
        storeroomId: '',
        arrivalDate: '',
        // currentDate: '',
        operator: '',
        remarks: '',
        state: ''
      },
      storeroom: [],
      validRules: {
        voCount: [
          {required: true, type: 'number', message: '请填写盘点后库存数量'},
            {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
            {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
        ],
      },
      informationRules: {
        storeroomId: [{
          required: true,
          message: '请选择盘点库房',
          trigger: 'change',
          type: 'number'
        }],
        arrivalDate: [
          {
            required: true,
            message: '请选择盘点日期',
            trigger: 'blur',
            type: 'date'
          }
        ],
        // currentDate: [
        //   {
        //     required: true,
        //     message: '请选择创建日期',
        //     trigger: 'blur',
        //     type: 'date'
        //   }
        // ],
        operator: [
          {
            required: true,
            message: '请填写盘点人',
            trigger: 'blur'
          }
        ],
      },
    }
  },
  methods: {
    // 关闭页面
    ...mapMutations(['closeTag']),
    close () {
      this.closeTag({
        name: 'editStocking',
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
    // 删除用品弹框
    confirm() {
      if (this.$refs.xTable.getSelectRecords().length !== 0) {
        this.$Modal.confirm({
          title: '删除选中用品',
          content: '<p>你确定要删除选中用品吗?</p>',
          onOk: () => {
            this.$refs.xTable.getSelectRecords().forEach(v => {
              this.tableData.splice(this.tableData.indexOf(v), 1)
            })
          },
        })
      } else {
        this.$Message.error('请选择删除的用品')
      }
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
                  tableIdCount.reason = v.reason
                  arry.push(tableIdCount)
                })
                this.supplies = arry
                const data = {
                  'projectId': JSON.parse(localStorage.getItem('projectId')).id,
                  'number': this.information.number,
                  'state': state,
                  'repId': this.information.storeroomId,
                  'checkDate': formatTime(this.information.arrivalDate),
                  'checker': this.information.operator,
                  // 'makeDate': formatTime(this.information.currentDate),
                  'remark': this.information.remarks,
                  'supplies': this.supplies
                }
                editStockingData(data, window.sessionStorage.getItem('stockingId')).then(res => {
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
                      this.close()
                      this.$Message.success(data.msgContent)
                      this.$router.push({path: '/administration/stocking'})
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
    // 点击新增出库用品
    newSupplies() {
      this.isAddModal=true
    },
    cancel() {
      this.isAddModal = false
    },
    saveData() {
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
        getEditTableData(window.sessionStorage.getItem('stockingId')).then(
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
                console.log(data.msgData)
                this.tableData = data.msgData
                break
            }
          }
        ).then(()=> newSuppliesData(JSON.parse(localStorage.getItem("projectId")).id).then(res=>{
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
        }))

    },
  },
  mounted() {
    this.tabsChange()
    this.getNowTime()
    this.getStoreroomData()
    getEditData(window.sessionStorage.getItem('stockingId')).then(res => {
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
          this.information.number = data.msgData.number
          this.information.storeroomId = data.msgData.repId
          this.information.arrivalDate = new Date(data.msgData.checkDate)
          // this.information.currentDate = data.msgData.makeDate
          this.information.operator = data.msgData.checker
          this.information.remarks = data.msgData.remark
          this.information.state = data.msgData.state
          break
      }
    })
  }
}
</script>

<style lang='less' scoped>
  .search-btn {
    margin-left: 10px;
  }


  .left {
    float: left;
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

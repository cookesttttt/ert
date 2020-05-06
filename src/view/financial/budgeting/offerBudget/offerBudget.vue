<template>
  <Card class="card">
    <Tabs :value="tabsName" @on-click="tabsClick" :animated="false">
      <TabPane label="汇总表" name="name1">
        <div style="text-align:right;margin-bottom:20px"></div>
        <vxe-table
          border
          show-footer
          :footer-method="footerMethod"
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column type="seq" width="50" title="#" align="center"></vxe-table-column>
          <vxe-table-column field="subject" title="科目"></vxe-table-column>
          <vxe-table-column field="total" title="金额（元）"></vxe-table-column>
          <vxe-table-column field="status" title="状态">
            <template v-slot="{ row }">
              <span v-if="row.status === 0" style="color:red">未完成</span>
              <span v-else>完成</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="operation" title="操作" width="130">
            <template v-slot="{ row, seq }">
              <vxe-button type="text" @click="tableClick(row)" style="color:#0000FF">报价明细</vxe-button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="现场驻派人员报价" name="name2">
        <!-- <div class="textBox">
          <P class="state">
            状态：
            <span v-if="user.status === 0" style="color:red">未完成</span>
            <span v-else>完成</span>
          </P>
          <p class="name">制单人：{{user.writer}}</p>
          <p class="time">创建日期：{{user.createTime}}</p>
          <p class="time">完成日期：{{user.completeTime}}</p>
          <div class="right">
            <Button class="btn" @click="clickFinish(0)" :disabled="user.status === 1">临时保存</Button>
          </div>
          <div class="clear"></div>
        </div>-->
        <div
          style="margin-bottom:20px;padding: 0 20px;display:flex;justify-content: space-between;"
        >
          <ButtonGroup>
            <Button type="primary" @click="addTableRow()">增加行</Button>
            <Button type="error" @click="confirm">批量删除</Button>
          </ButtonGroup>
          <span style="margin-right:20px">
            现场人员派驻费用总价：
            <span
              style="font-weight: bold;display: inline-block;width:60px;text-align:right;"
            >{{AllPricesChange(this.allPricesData)}}</span> 元
          </span>
          <Button class="btn" type="primary" @click="clickFinish(1)">保存</Button>
        </div>
        <vxe-table
          ref="xTable"
          border
          :height="height"
          :loading="xTableLoading"
          show-overflow
          highlight-hover-row
          :data="allPricesData"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
          :tree-config="XtreeConfig"
          style="margin-top:20px"
        >
          <vxe-table-column type="checkbox" width="60" fixed="left"></vxe-table-column>
          <vxe-table-column
            field="quoteName"
            title="职务岗位 / 科目"
            :edit-render="{name: 'input',autoselect: true}"
            width="240"
            fixed="left"
            tree-node
          ></vxe-table-column>
          <vxe-table-column
            field="basicWage"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="100"
          >
            <template v-slot:header="{ column }">
              <span>
                基本工资
                <br />(元/月)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="fieldAllowance"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="100"
          >
            <template v-slot:header="{ column }">
              <span>
                野外津贴
                <br />(元/月)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="otherAllowance"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="100"
          >
            <template v-slot:header="{ column }">
              <span>
                其他补贴
                <br />(元/月)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="overtimePay"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="90"
          >
            <template v-slot:header="{ column }">
              <span>
                加班费
                <br />(元/月)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="accidentInsurance"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="100"
          >
            <template v-slot:header="{ column }">
              <span>
                意外保险
                <br />(元/月)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="trainingPay"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="90"
          >
            <template v-slot:header="{ column }">
              <span>
                培训费
                <br />(元/月)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="otherPay"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="90"
          >
            <template v-slot:header="{ column }">
              <span>
                其他费
                <br />(元/月)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="subtotal" width="80" fixed="right">
            <template v-slot:header="{ column }">
              <span>
                小计
                <br />(元/月)
              </span>
            </template>
            <template v-slot="{ row }">{{getBasePay(row)}}</template>
          </vxe-table-column>
          <vxe-table-column
            field="personCount"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="100"
            fixed="right"
          >
            <template v-slot:header="{ column }">
              <span>
                人员数量
                <br />(平均)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="serviceLength"
            :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
            width="100"
            fixed="right"
          >
            <template v-slot:header="{ column }">
              <span>
                服务时间
                <br />(月)
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="total" fixed="right" width="80">
            <template v-slot:header="{ column }">
              <span>
                合计
                <br />(元)
              </span>
            </template>
            <template v-slot="{ row }">{{getTotal(row)}}</template>
          </vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="项目现场办公费用报价" name="name3">
        <div class="textBox">
          <P class="state">
            状态：
            <span v-if="user.status === 0" style="color:red">未完成</span>
            <span v-else>完成</span>
          </P>
          <p class="name">制单人：{{user.writer}}</p>
          <p class="time">创建日期：{{user.createTime}}</p>
          <p class="time">完成日期：{{user.completeTime}}</p>
          <div class="right">
            <Button class="btn" @click="clickTitle(0)" :disabled="user.status === 1">临时保存</Button>
            <Button class="btn" type="primary" @click="clickTitle(1)">{{getButton(user.status)}}</Button>
          </div>
          <div class="clear"></div>
        </div>
        <div
          style="margin-bottom:20px;padding: 0 20px;display:flex;justify-content: space-between;"
        >
          <ButtonGroup>
            <Button type="primary" @click="getNewTreeRow(-1)">增加行</Button>
            <Button type="error" @click="confirmTree">批量删除</Button>
          </ButtonGroup>
          <span>
            现场办公费用总价:
            <span
              style="font-weight: bold;display: inline-block;width:60px;text-align:right;"
            >{{allTreePrices}}</span> 元
          </span>
        </div>
        <vxe-table
          ref="xTableTree"
          border
          :loading="xTableTreeLoading"
          :height="height"
          show-overflow
          highlight-hover-row
          class="mytable-style"
          :data="tableTreeData"
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
          style="margin-top:20px"
          :tree-config="treeConfig"
          @edit-actived="editActivedEvent"
          :row-style="rowStyle"
          align="center"
        >
          <vxe-table-column type="checkbox" width="80" tree-node></vxe-table-column>
          <vxe-table-column type="seq" title="科目编号"></vxe-table-column>
          <vxe-table-column
            field="quoteName"
            title="预算项目名称"
            :edit-render="{name: 'input',autoselect: true}"
          ></vxe-table-column>
          <vxe-table-column
            field="unit"
            title="单位"
            :edit-render="{name: 'input', attrs: {disabled: false},autoselect: true}"
          ></vxe-table-column>
          <vxe-table-column
            field="count"
            title="数量"
            :edit-render="{name: 'input', attrs: {disabled: false,type: 'number'},autoselect: true}"
          ></vxe-table-column>
          <vxe-table-column
            field="price"
            title="单价（元）"
            :edit-render="{name: 'input', attrs: {disabled: false,type: 'number'},autoselect: true}"
          ></vxe-table-column>
          <vxe-table-column field="subtotal" title="合计（元）">
            <template v-slot="{ row }">{{getTreeSubTotal(row)}}</template>
          </vxe-table-column>
        </vxe-table>
        <Modal v-model="rowModal" title="新增项">
          <Form ref="formRowdate" :model="formRowdate" :rules="ruleRowdate" :label-width="80">
            <FormItem label="所属科目" prop="from">
              <Select v-model="formRowdate.from" placeholder="请选择所属科目">
                <Option
                  v-for="item in tableTreeData"
                  :value="item.quoteName"
                  :key="item.quoteName"
                >{{item.quoteName}}</Option>
              </Select>
            </FormItem>
            <FormItem label="名称" prop="name">
              <Input v-model="formRowdate.name" placeholder="请填写名称"></Input>
            </FormItem>
            <FormItem label="单位" prop="unit">
              <Input v-model="formRowdate.unit" placeholder="请填写单位"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel()">取消</Button>
            <Button type="primary" size="large" @click="saveRow">保存</Button>
          </div>
        </Modal>
        <Modal v-model="addRowModal" title="新增行">
          <Form
            ref="formAddRowdate"
            :model="formAddRowdate"
            :rules="ruleAddRowdate"
            :label-width="80"
          >
            <FormItem label="所属职位" prop="from">
              <Select v-model="formAddRowdate.from" placeholder="请选择所属职位">
                <Option
                  v-for="item in treeAddRowData"
                  :value="item.quoteName"
                  :key="item.quoteName"
                  @on-change="addRowDataSelect(item)"
                >{{item.quoteName}}</Option>
              </Select>
            </FormItem>
            <FormItem label="名称" prop="name">
              <Input v-model="formAddRowdate.name" placeholder="请填写名称"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="addRowDataCancel()">取消</Button>
            <Button type="primary" size="large" @click="addRowData">保存</Button>
          </div>
        </Modal>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import './state.less'
import XEUtils from 'xe-utils'
import { getCollectData, getSalaryData, salaryDataSave, getOfficeData, officeDataSave, finishOfficeData, finishSalaryData } from '@/api/financial/offerBudget/offerBudget'
import { isDataSuccess } from '@/libs/util'
export default {
  data () {
    return {
      xTableLoading: false,
      xTableTreeLoading: false,
      height: 600,
      addSelectData: {},
      treeAddRowData: [],
      addRowModal: false,
      itemName: '',
      user: '',
      tagsId: '',
      tableData: [],
      allPricesData: [],
      tabsName: 'name1',
      allPrices: 0,
      tableTreeData: [],
      treeConfig: {
        children: 'items',
        expandAll: true
      },
      XtreeConfig: {
        children: 'children',
        expandAll: true
      },
      allTreePrices: 0,
      rowModal: false,
      formRowdate: {
        from: '',
        name: '',
        unit: ''
      },
      formAddRowdate: {
        from: '',
        name: ''
      },
      ruleAddRowdate: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        from: [
          { required: true, message: '请选择所属职位', trigger: 'change' }
        ]
      },
      ruleRowdate: {
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请填写单位', trigger: 'blur' }
        ],
        from: [
          { required: true, message: '请选择所属科目', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    addRowDataSelect (data) {
      this.addSelectData = data
    },
    addTableRow () {
      this.treeAddRowData = []
      this.getAddDataName(this.allPricesData)
      console.log(this.treeAddRowData)
      this.addRowModal = true
    },
    getAddDataName (data) {
      data.forEach(res => {
        if (res.children && res.children.length > 0) {
          this.treeAddRowData.push(res)
          this.getAddDataName(res.children)
        }
      })
    },
    addRowData () {
      this.$refs.formAddRowdate.validate(valid => {
        if (valid) {
          let xTableTree = this.$refs.xTable
          xTableTree.createRow({
            quoteName: this.formAddRowdate.name,
            id: this.addSelectData.id,
            deptId: this.addSelectData.deptId,
            isSubordinate: this.addSelectData.isSubordinate,
            basicWage: 0,
            fieldAllowance: 0,
            otherAllowance: 0,
            overtimePay: 0,
            accidentInsurance: 0,
            trainingPay: 0,
            otherPay: 0,
            personCount: 0,
            serviceLength: 0,
            subtotal: 0,
            total: 0
          }).then(newRow => {
            // 插入到 name为 formName 的节点位置中
            let rowNode = XEUtils.findTree(this.allPricesData, item => item.quoteName === this.formAddRowdate.from, this.XtreeConfig)
            if (rowNode) {
              rowNode.item.children.push(newRow)
              xTableTree.syncData().then(() => xTableTree.setActiveRow(newRow))
              this.$refs.formAddRowdate.resetFields()
            }
          }).then(this.addRowModal = false)
        }
      })
    },
    addRowDataCancel () {
      this.addRowModal = false
      this.$refs.formAddRowdate.resetFields()
    },
    footerMethod ({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '3'
          }
          if (columnIndex === 1) {
            return '合计'
          }
          if (['total'].includes(column.property)) {
            let sum = 0
            data.forEach(item => {
              let num = parseInt(item.total)
              sum += num
            })
            return sum
          }
          return '--'
        })
      ]
    },
    // 点击表格
    tableClick (row) {
      switch (row.subject) {
        case '现场驻派人员报价':
          this.tabsName = 'name2'
          this.tagsId = row.id
          getSalaryData(row.id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.allPricesData = res.data.msgData.details
                this.user = res.data.msgData.quoteBudget
                this.getZero(this.allPricesData)
              // this.allPricesData.forEach(item => {
              //   for (const key in item) {
              //     if (item[key] === null) {
              //       item[key] = 0
              //     }
              //   }
              // })
            }
          })
          break

        case '项目现场办公费用报价报价':
          this.tagsId = row.id
          this.tabsName = 'name3'
          getOfficeData(row.id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.tableTreeData = res.data.msgData.details
                this.user = res.data.msgData.quoteBudget
            }
          })
          break
      }
    },
    removeData (data) {
      data.forEach(item => {
        delete item.subtotal
        delete item.total
        delete item._XID
        if (item.children) {
          this.removeData(item.children)
        }
      })
    },
    // 临时保存 完成制单
    clickFinish (state) {
      let data = this.$refs.xTable.getTableData().tableData
      this.removeData(data)
      switch (state) {
        case 0:
          salaryDataSave(this.tagsId, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.$Message.success(res.data.msgContent)
                getSalaryData(this.tagsId).then(res => {
                  let status = isDataSuccess(res)
                  switch (status) {
                    case 1:
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      this.$Message.error(res.data.msgContent)
                      break
                    default:
                      this.allPricesData = res.data.msgData.details
                      this.user = res.data.msgData.quoteBudget
                      this.getZero(this.allPricesData)
                      setTimeout(() => {
                        this.$refs.xTable.setAllTreeExpansion(true)
                      }, 200)
                    // this.allPricesData.forEach(item => {
                    //   for (const key in item) {
                    //     if (item[key] === null) {
                    //       item[key] = 0
                    //     }
                    //   }
                    // })
                  }
                })
            }
          })
          break
        case 1:
          this.changeData(data)
          finishSalaryData(this.tagsId, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.$Message.success(res.data.msgContent)
                getSalaryData(this.tagsId).then(res => {
                  let status = isDataSuccess(res)
                  switch (status) {
                    case 1:
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      this.$Message.error(res.data.msgContent)
                      break
                    default:
                      this.allPricesData = res.data.msgData.details
                      this.user = res.data.msgData.quoteBudget
                      this.getZero(this.allPricesData)
                      setTimeout(() => {
                        this.$refs.xTable.setAllTreeExpansion(true)
                      }, 200)
                    // this.allPricesData.forEach(item => {
                    //   for (const key in item) {
                    //     if (item[key] === null) {
                    //       item[key] = 0
                    //     }
                    //   }
                    // })
                  }
                })
            }
          })
          break
      }
    },
    changeData (data) {
      data.forEach(res => {
        if (res.children) {
          res.childrens = res.children
          delete res.children
          this.changeData(res.childrens)
        }
      })
    },
    // 临时保存 完成制单
    clickTitle (state) {
      console.log(1)
      let data = this.$refs.xTableTree.getTableData().tableData
      data.forEach(item => {
        if (item.unit === null) {
          item.unit = ''
        }
        if (item.items) {
          item.items.forEach(res => {
            if (res.count === null) {
              res.count = 0
            }
          })
        }
      })
      switch (state) {
        case 0:
          officeDataSave(this.tagsId, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.$Message.success(res.data.msgContent)
                getOfficeData(this.tagsId).then(res => {
                  let status = isDataSuccess(res)
                  switch (status) {
                    case 1:
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      this.$Message.error(res.data.msgContent)
                      break
                    default:
                      this.tableTreeData = res.data.msgData.details
                      this.user = res.data.msgData.quoteBudget
                  }
                })
            }
          })
          break

        case 1:
          finishOfficeData(this.tagsId, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.$Message.success(res.data.msgContent)
                getOfficeData(this.tagsId).then(res => {
                  let status = isDataSuccess(res)
                  switch (status) {
                    case 1:
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      this.$Message.error(res.data.msgContent)
                      break
                    default:
                      this.tableTreeData = res.data.msgData.details
                      this.user = res.data.msgData.quoteBudget
                  }
                })
            }
          })
          break
      }
    },
    // 添加表格一行
    // async insertEvent (row) {
    //   // this.$refs.xTable.insertAt(row)
    //   let record = {
    //     quoteName: ''
    //   }
    //   let { row: newRow } = await this.$refs.xTable.insertAt(record, row)
    //   await this.$refs.xTable.setActiveCell(newRow, 'quoteName')
    // },
    cancel () {
      this.$refs.formRowdate.resetFields() // 清空新建弹框
      this.rowModal = false
    },
    saveRow () {
      this.$refs.formRowdate.validate(valid => {
        if (valid) {
          this.insertTreeEvent()
        }
      })
    },
    // 新增行 弹框
    getNewTreeRow () {
      this.rowModal = true
    },
    insertTreeEvent () {
      let xTableTree = this.$refs.xTableTree
      xTableTree.createRow({
        quoteName: this.formRowdate.name,
        unit: this.formRowdate.unit,
        isNew: true
      }).then(newRow => {
        // 插入到 name为 formName 的节点位置中
        let rowNode = XEUtils.findTree(this.tableTreeData, item => item.quoteName === this.formRowdate.from, this.treeConfig)
        if (rowNode) {
          rowNode.item.items.splice(0, 0, newRow)
          xTableTree.syncData().then(() => xTableTree.setActiveRow(newRow))
          this.$refs.formAddRowdate.resetFields()
        }
      }).then(this.rowModal = false)
    },
    // 删除
    confirm () {
      if (this.$refs.xTable.getCheckboxRecords().length !== 0) {
        let xTableTree = this.$refs.xTable
        let removeRecords = xTableTree.getCheckboxRecords()
        this.$Modal.confirm({
          title: '批量删除',
          content: '<p>你确定要删除吗?</p>',
          onOk: () => {
            // this.$refs.xTable.removeSelecteds() //  删除表格中选中的数据
            removeRecords.forEach(row => {
              let matchObj = XEUtils.findTree(this.allPricesData, item => item === row, this.XtreeConfig)
              if (matchObj) {
                let { items, index } = matchObj
                // 从树节点中移除
                let restRow = items.splice(index, 1)[0]
                // this.removeList.push(restRow)
              }
            })
            xTableTree.syncData() //  删除表格中选中的数据
          }
        })
      } else {
        this.$Message.error('请选择删除的行')
      }
    },
    // 删除
    confirmTree () {
      let xTableTree = this.$refs.xTableTree
      let removeRecords = xTableTree.getCheckboxRecords()
      if (removeRecords.length !== 0) {
        this.$Modal.confirm({
          title: '批量删除',
          content: '<p>你确定要删除吗?</p>',
          onOk: () => {
            removeRecords.forEach(row => {
              let matchObj = XEUtils.findTree(this.tableTreeData, item => item === row, this.treeConfig)
              if (matchObj) {
                let { items, index } = matchObj
                // 从树节点中移除
                let restRow = items.splice(index, 1)[0]
                // this.removeList.push(restRow)
              }
            })
            xTableTree.syncData() //  删除表格中选中的数据
          }
        })
      } else {
        this.$Message.error('请选择删除的行')
      }
    },
    getBasePay (row) {
      let sum = 0
      for (let item in row) {
        if (row[item] === null || row[item] === undefined || row[item] === '') {
          row[item] = 0
        }
        if (item === 'personCount' || item === 'serviceLength' || item === '_XID' || item === 'id' || item === 'quoteName' || item === 'total' || item === 'subtotal' || item === 'deptId' || item === 'children' || item === 'isSubordinate' || row[item] === null) {

        } else {
          let num = parseInt(row[item])
          sum += num
        }
      }
      row.subtotal = sum
      return sum
    },
    getTotal (row) {
      let sum = 0
      if (row.subtotal && row.personCount && row.serviceLength) {
        sum = row.subtotal * row.personCount * row.serviceLength
        row.total = sum
      }
      return sum
    },
    AllPricesChange (data) {
      let price = 0
      // console.log(XEUtils.sum(this.$refs.xTable.getTableData().tableData, 'total'))
      data.forEach(item => {
        price += item.total
        if (item.children) {
          item.children.forEach(res => {
            price += res.total
            if (res.children) {
              res.children.forEach(a => {
                price += a.total
                if (a.children) {
                  a.children.forEach(b => {
                    price += b.total
                  })
                }
              })
            }
          })
        }
      })
      return price
    },
    getTreeSubTotal (row) {
      let sum = 0
      if (row.count && row.price) {
        sum = row.count * row.price
        row.subtotal = sum
        let data = this.$refs.xTableTree.getTableData().tableData
        let PricesSum = 0
        data.forEach(item => {
          item.items.forEach(res => {
            PricesSum += res.subtotal
          })
        })
        this.allTreePrices = PricesSum
        return sum
      } else if (row.items) {
        let data = this.$refs.xTableTree.getTableData().tableData
        data.forEach(item => {
          let unit = 0
          item.items.forEach(res => {
            unit += res.subtotal
            item.subtotal = unit
          })
        })
        return row.subtotal
      } else {
        return sum
      }
    },
    // 禁止编辑
    editActivedEvent ({ row }) {
      let xTableTree = this.$refs.xTableTree
      let unitColumn = xTableTree.getColumnByField('unit')
      let countColumn = xTableTree.getColumnByField('count')
      let priceColumn = xTableTree.getColumnByField('price')
      let isDisabled = row.items !== undefined
      unitColumn.editRender.attrs.disabled = isDisabled
      countColumn.editRender.attrs.disabled = isDisabled
      priceColumn.editRender.attrs.disabled = isDisabled
    },
    // 按钮状态
    getButton (status) {
      if (status === 1) {
        return '提交'
      } else {
        return '完成制单'
      }
    },
    rowStyle ({ row, rowIndex }) {
      if (row.items) {
        return {
          fontWeight: 'bold'
        }
      }
    },
    getZero (table) {
      table.forEach(res => {
        for (let item in res) {
          if (res[item] === null || res[item] === undefined || res[item] === '') {
            res[item] = 0
          } else {
            if (res.children) {
              this.getZero(res.children)
            }
          }
        }
      })
    },
    // tabs点击事件
    tabsClick (name) {
      switch (name) {
        case 'name1':
          this.tabsName = 'name1'
          this.tagsId = ''
          getCollectData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                if (res.data.msgData) {
                  res.data.msgData.pop()
                  this.itemName = localStorage.getItem('itemName')
                  this.tableData = res.data.msgData
                }
            }
          })
          break
        case 'name2':
          this.tabsName = 'name2'
          this.xTableLoading = true
          if (this.tableData[0].id) {
            this.tagsId = this.tableData[0].id
            getSalaryData(this.tagsId).then(res => {
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  this.xTableLoading = false
                  break
                case 2:
                  this.$Message.error(res.data.msgContent)
                  this.xTableLoading = false
                  break
                default:
                  if (document.body.clientWidth < 1400) {
                    this.height = 330
                  }
                  this.allPricesData = res.data.msgData.details
                  this.user = res.data.msgData.quoteBudget
                  this.getZero(this.allPricesData)
                  setTimeout(() => {
                    this.$refs.xTable.setAllTreeExpansion(true)
                  }, 200)
                  this.xTableLoading = false
                // this.allPricesData.forEach(item => {
                //   for (const key in item) {
                //     if (item[key] === null) {
                //       item[key] = 0
                //     }
                //   }
                // })
              }
            })
          }
          break
        case 'name3':
          this.tabsName = 'name3'
          this.xTableTreeLoading = true
          if (this.tableData[1].id) {
            this.tagsId = this.tableData[1].id
            getOfficeData(this.tagsId).then(res => {
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  this.xTableTreeLoading = false
                  break
                case 2:
                  this.$Message.error(res.data.msgContent)
                  this.xTableTreeLoading = false
                  break
                default:
                  if (document.body.clientWidth < 1400) {
                    this.height = 330
                  }
                  this.tableTreeData = res.data.msgData.details
                  this.user = res.data.msgData.quoteBudget
                  setTimeout(() => {
                    this.$refs.xTableTree.setAllTreeExpansion(true)
                  }, 200)
                  this.xTableTreeLoading = false
              }
            })
          }
          break
      }
    }
  },
  created () {
    getCollectData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          if (res.data.msgData) {
            res.data.msgData.pop()
            this.itemName = localStorage.getItem('itemName')
            this.tableData = res.data.msgData
          }
      }
    })
  }
}
</script>

<style lang="less" scoped>
.card {
  height: 100%;
  overflow-y: auto;
}

.left {
  float: left;
}

.bottom20 {
  margin-top: 40px;
}
</style>

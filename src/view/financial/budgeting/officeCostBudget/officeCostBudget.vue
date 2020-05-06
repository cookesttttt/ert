<template>
  <Card class="card">
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
    <div style="margin-bottom:20px;padding: 0 20px;display:flex;justify-content: space-between;">
      <ButtonGroup>
        <Button type="primary" @click="getNewTreeRow(-1)">增加行</Button>
        <Button type="error" @click="confirmTree">批量删除</Button>
      </ButtonGroup>
      <span>
        <span>{{Parameter.year}} 年 {{Parameter.month}} 月</span>
        现场办公费用总价:
        <span
          style="font-weight: bold;display: inline-block;width:50px;text-align:right;"
        >{{allTreePrices}}</span> 元
      </span>
    </div>
    <vxe-table
      ref="xTableTree"
      border
      height="400"
      show-overflow
      highlight-hover-row
      :data="tableTreeData"
      :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
      style="margin-top:20px"
      :tree-config="treeConfig"
      @edit-actived="editActivedEvent"
      :row-style="rowStyle"
      align="center"
    >
      <vxe-table-column type="checkbox" width="80"></vxe-table-column>
      <vxe-table-column type="index" title="科目编号" tree-node></vxe-table-column>
      <vxe-table-column
        field="budgetName"
        title="预算项目名称"
        :edit-render="{name: 'input',autoselect: true}"
      ></vxe-table-column>
      <vxe-table-column field="unit" title="单位"></vxe-table-column>
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
              :value="item.budgetName"
              :key="item.budgetName"
            >{{item.budgetName}}</Option>
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
  </Card>
</template>

<script>
import { getTableData, officeDataSave, officeDataComplete } from '@/api/financial/budgeting/officeCostBudget'
import { isDataSuccess } from '@/libs/util'
import XEUtils from 'xe-utils'
import '@/view/financial/budgeting/offerBudget/state.less'
export default {
  data () {
    return {
      rowModal: false,
      formRowdate: {
        from: '',
        name: '',
        unit: ''
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
      },
      Parameter: {},
      allTreePrices: 0,
      user: {},
      tableTreeData: [],
      treeConfig: {
        children: 'items',
        expandAll: true
      }
    }
  },
  methods: {

    confirmTree () {
      let xTableTree = this.$refs.xTableTree
      let removeRecords = xTableTree.getSelectRecords()
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
            xTableTree.refreshData() //  删除表格中选中的数据
          }
        })
      } else {
        this.$Message.error('请选择删除的行')
      }
    },
    getNewTreeRow () {
      this.rowModal = true
    },
    clickTitle (status) {
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
      if (status === 0) {
        officeDataSave(this.user.id, data).then(res => {
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
              this.getParameter()
              this.getTable(this.Parameter.id, this.Parameter.year, this.Parameter.month)
          }
        })
      } else {
        officeDataComplete(this.user.id, data).then(res => {
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
              this.getParameter()
              this.getTable(this.Parameter.id, this.Parameter.year, this.Parameter.month)
          }
        })
      }
    },
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
    insertTreeEvent () {
      let xTableTree = this.$refs.xTableTree
      xTableTree.createRow({
        budgetName: this.formRowdate.name,
        unit: this.formRowdate.unit,
        isNew: true
      }).then(newRow => {
        // 插入到 name为 formName 的节点位置中
        let rowNode = XEUtils.findTree(this.tableTreeData, item => item.budgetName === this.formRowdate.from, this.treeConfig)
        if (rowNode) {
          rowNode.item.items.splice(0, 0, newRow)
          xTableTree.refreshData().then(() => xTableTree.setActiveRow(newRow))
        }
      }).then(this.rowModal = false)
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
    // 禁止编辑
    editActivedEvent ({ row }) {
      let xTableTree = this.$refs.xTableTree
      let countColumn = xTableTree.getColumnByField('count')
      let priceColumn = xTableTree.getColumnByField('price')
      let isDisabled = row.items !== undefined
      countColumn.editRender.attrs.disabled = isDisabled
      priceColumn.editRender.attrs.disabled = isDisabled
    },
    // 获取合计
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
    // 接受参数
    getParameter () {
      this.Parameter = this.$route.query
      console.log(this.Parameter)
    },
    getTable (id, year, month) {
      getTableData(id, year, month).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.user = res.data.msgData
            this.tableTreeData = this.user.officeCostDetails
        }
      })
    }
  },
  created () {
    this.getParameter()
    this.getTable(this.Parameter.id, this.Parameter.year, this.Parameter.month)
  },
  watch: {
    $route (to, from) {
      // 监听路由中的Id值的变化
      if (to.name === '现场办公费用成本预算') {
        this.getParameter()
        this.getTable(this.Parameter.id, this.Parameter.year, this.Parameter.month)
      }
    }
  }

}
</script>

<style lang="less" scoped>
.card {
  height: 100%;
  overflow-y: auto;
}
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
.bottom20 {
  margin-top: 40px;
}
</style>

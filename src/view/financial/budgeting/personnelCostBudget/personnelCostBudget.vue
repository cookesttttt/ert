<template>
  <Card class="card">
    <div class="textBox">
      <P class="state">
        状态：
        <span v-if="user.status === 0"
              style="color:red">未完成</span>
        <span v-else>完成</span>
      </P>
      <p class="name">制单人：{{user.writer}}</p>
      <p class="time">创建日期：{{user.createTime}}</p>
      <p class="time">完成日期：{{user.completeTime}}</p>
      <div class="right">
        <Button class="btn"
                @click="clickFinish(0)"
                :disabled="user.status === 1">临时保存</Button>
        <Button class="btn"
                type="primary"
                @click="clickFinish(1)">{{getButton(user.status)}}</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div style="margin-bottom:20px;padding: 0 20px;display:flex;justify-content: space-between;">
      <ButtonGroup>
        <Button type="primary"
                @click="insertEvent()">增加行</Button>
        <Button type="error"
                @click="confirm">批量删除</Button>
      </ButtonGroup>
      <span>
        <span>{{Parameter.year}} 年 {{Parameter.month}} 月</span>
        现场人员派驻费用总价：
        <span style="font-weight: bold;display: inline-block;width:50px;text-align:right;">{{allPrices}}</span> 元
      </span>
    </div>

    <vxe-table ref="xTable"
               border
               height="400"
               show-overflow
               highlight-hover-row
               :data="allPricesData"
               :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
               style="margin-top:20px"
               align="center">
      <vxe-table-column type="checkbox"
                        width="60"
                        fixed="left"></vxe-table-column>
      <vxe-table-column field="quoteName"
                        title="职务岗位 / 科目"
                        :edit-render="{name: 'input',autoselect: true}"
                        width="170"
                        fixed="left"></vxe-table-column>
      <vxe-table-column field="basicWage"
                        :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
                        width="100">
        <template v-slot:header="{ column }">
          <span>
            基本工资
            <br />(元/月)
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="fieldAllowance"
                        :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
                        width="100">
        <template v-slot:header="{ column }">
          <span>
            野外津贴
            <br />(元/月)
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="otherAllowance"
                        :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
                        width="100">
        <template v-slot:header="{ column }">
          <span>
            其他补贴
            <br />(元/月)
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="overtimePay"
                        :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
                        width="90">
        <template v-slot:header="{ column }">
          <span>
            加班费
            <br />(元/月)
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="accidentInsurance"
                        :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
                        width="100">
        <template v-slot:header="{ column }">
          <span>
            意外保险
            <br />(元/月)
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="trainingPay"
                        :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
                        width="90">
        <template v-slot:header="{ column }">
          <span>
            培训费
            <br />(元/月)
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="otherPay"
                        :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
                        width="90">
        <template v-slot:header="{ column }">
          <span>
            其他费
            <br />(元/月)
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="subtotal"
                        width="90"
                        fixed="right">
        <template v-slot:header="{ column }">
          <span>
            小计
            <br />(元/月)
          </span>
        </template>
        <template v-slot="{ row }">{{getBasePay(row)}}</template>
      </vxe-table-column>
      <vxe-table-column field="personCount"
                        :edit-render="{name: 'input', attrs: {type: 'number'},autoselect: true}"
                        width="100"
                        fixed="right">
        <template v-slot:header="{ column }">
          <span>
            人员数量
            <br />(平均)
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="total"
                        fixed="right"
                        width="90">
        <template v-slot:header="{ column }">
          <span>
            合计
            <br />(元)
          </span>
        </template>
        <template v-slot="{ row }">{{getTotal(row)}}</template>
      </vxe-table-column>
    </vxe-table>
  </Card>
</template>

<script>
import { getTableData, staffDataSave, staffDataComplete } from '@/api/financial/budgeting/personnelCostBudget'
import { isDataSuccess } from '@/libs/util'
import '@/view/financial/budgeting/offerBudget/state.less'

export default {
  data () {
    return {
      Parameter: {},
      allPricesData: [],
      allPrices: 0,
      user: {}
    }
  },
  methods: {
    // 添加表格一行
    async insertEvent (row) {
      let record = {
        quoteName: ''
      }
      let { row: newRow } = await this.$refs.xTable.insertAt(record, row)
      await this.$refs.xTable.setActiveCell(newRow, 'quoteName')
    },
    // 删除表格选中数据
    confirm () {
      if (this.$refs.xTable.getSelectRecords().length !== 0) {
        this.$Modal.confirm({
          title: '批量删除',
          content: '<p>你确定要删除吗?</p>',
          onOk: () => {
            this.$refs.xTable.removeSelecteds() //  删除表格中选中的数据
          }
        })
      } else {
        this.$Message.error('请选择删除的行')
      }
    },
    clickFinish (status) {
      let data = this.$refs.xTable.getTableData().tableData
      data.forEach(item => {
        delete item.subtotal
        delete item.total
        delete item._XID
      })
      if (status === 0) {
        staffDataSave(this.user.id, data).then(res => {
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
        staffDataComplete(this.user.id, data).then(res => {
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
    // 获取小计
    getBasePay (row) {
      let sum = 0
      for (let item in row) {
        if (item === 'personCount' || item === 'serviceLength' || item === '_XID' || item === 'quoteName' || item === 'total' || item === 'subtotal' || row[item] === null || item === 'id') {

        } else {
          let num = parseInt(row[item])
          sum += num
        }
      }
      row.subtotal = sum
      return sum
    },
    // 获取合计
    getTotal (row) {
      let sum = 0
      if (row.subtotal && row.personCount) {
        sum = row.subtotal * row.personCount
        row.total = sum
        let data = this.$refs.xTable.getTableData().tableData
        let PricesSum = 0
        data.forEach(item => {
          PricesSum += item.total
        })
        this.allPrices = PricesSum
      }
      return sum
    },
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
            this.allPricesData = this.user.staffCostDetails
        }
      })
    },
    // 按钮状态
    getButton (status) {
      if (status === 1) {
        return '提交'
      } else {
        return '完成制单'
      }
    }
  },
  created () {
    this.getParameter()
    this.getTable(this.Parameter.id, this.Parameter.year, this.Parameter.month)
  },
  watch: {
    $route (to, from) {
      // 监听路由中的Id值的变化
      if (to.name === '人员费用成本预算') {
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

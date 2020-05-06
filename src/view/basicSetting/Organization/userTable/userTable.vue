<template>
  <Card>
    <vxe-table border
               :span-method="rowspanMethod"
               :data="tableData">
      <vxe-table-column type="index"
                        width="50"
                        title="#"
                        align="center"></vxe-table-column>
      <vxe-table-column field="dept"
                        title="部门"></vxe-table-column>
      <vxe-table-column field="job"
                        title="岗位"></vxe-table-column>
      <vxe-table-column field="realname"
                        title="姓名"></vxe-table-column>
      <vxe-table-column field="phone"
                        title="电话"></vxe-table-column>
      <vxe-table-column field="joinDate"
                        title="加入时间"></vxe-table-column>
    </vxe-table>
  </Card>
</template>

<script>
import { getTeamers } from '@/api/basicSetting/memberTable'
import { isDataSuccess } from '@/libs/util'
import XEUtils from 'xe-utils'

export default {
  data () {
    return {
      tableData: [],
      auth: true
    }
  },
  created () {
    getTeamers(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.tableData = res.data.msgData.teamers
          this.tableData.forEach(res => {
            res.dept = res.dept[0]
            res.job = res.job[0]
          })
          this.auth = res.data.msgData.auth
      }
    })
  },
  methods: {
    // 通用行合并函数（将相同多列数据合并为一行）
    rowspanMethod ({ row, $rowIndex, column, data }) {
      let fields = ['dept', 'job']
      let cellValue = XEUtils.get(row, column.property)
      if (cellValue && fields.includes(column.property)) {
        let prevRow = data[$rowIndex - 1]
        let nextRow = data[$rowIndex + 1]
        if (prevRow && XEUtils.get(prevRow, column.property) === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && XEUtils.get(nextRow, column.property) === cellValue) {
            nextRow = data[++countRowspan + $rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.checkBoxstop20 {
  margin-top: 20px;
  text-align: left;
}
</style>

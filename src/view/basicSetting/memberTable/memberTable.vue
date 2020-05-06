<template>
  <Card>
    <vxe-table border :span-method="rowspanMethod" :data="tableData">
      <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
      <vxe-table-column field="dept" title="部门"></vxe-table-column>
      <vxe-table-column field="job" title="岗位"></vxe-table-column>
      <vxe-table-column field="realname" title="姓名"></vxe-table-column>
      <vxe-table-column field="phone" title="电话"></vxe-table-column>
      <vxe-table-column field="joinDate" title="加入时间"></vxe-table-column>
      <vxe-table-column title="操作" v-if="auth" width="130">
        <template v-slot="{ row }">
          <div v-if="row.id !== null && row.job !== '项目经理'">
            <Dropdown style="margin-left: 20px" @on-click="dropDown($event,row)">
              <Button type="primary">
                操作
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="1">调整部门/岗位</DropdownItem>
                <DropdownItem name="2">移除项目部</DropdownItem>
                <DropdownItem name="3">更多信息</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>
    <Modal v-model="removeJob" title="移除项目成员" @on-ok="removeOK">
      <p>确定该用户不是本项目部成员</p>
    </Modal>
    <Modal
      title="工作职责"
      v-model="isDutyWork"
      width="768"
      :styles="{top: '30px',postion:'absolute'}"
      @on-cancel="cancel"
      :mask-closable="false"
    >
      <el-tabs tab-position="left" type="border-card" v-model="deptName">
        <el-tab-pane
          v-for="item in jobWork"
          :label="item.department.name"
          :name="item.department.name"
          :key="item.department.name"
        >
          <el-radio-group v-model="jobName">
            <el-radio
              v-for="data in item.roles"
              :label="data.id"
              class="checkBoxstop20"
              :key="data.name"
            >{{data.name}}</el-radio>
          </el-radio-group>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="preserve">保存</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
import { getTeamers, getAllRole, putTeamer, deleteTeamer } from '@/api/basicSetting/memberTable'
import { isDataSuccess } from '@/libs/util'
import XEUtils from 'xe-utils'

export default {
  data () {
    return {
      tableData: [],
      auth: true,
      removeJob: false,
      isDutyWork: false,
      deptName: '',
      jobName: '',
      jobWork: '',
      userId: ''
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
    },
    // 点击菜单
    dropDown (name, row) {
      switch (name) {
        case '1':
          getAllRole(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(data.msgContent)
                break
              default:
                this.jobWork = res.data.msgData
                this.deptName = row.dept
                this.jobWork.forEach(item => {
                  if (item.department.name === this.deptName) {
                    item.roles.forEach(res => {
                      if (res.name === row.job) {
                        this.jobName = res.id
                      }
                    })
                  }
                })
                this.userId = row.id
                this.isDutyWork = true
                break
            }
          })
          break
        case '2':
          this.userId = row.id
          this.removeJob = true
          break
        case '3':

          break
      }
    },
    // 移除项目成员
    removeOK () {
      deleteTeamer(JSON.parse(localStorage.getItem('projectId')).id, this.userId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
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
                  this.auth = res.data.msgData.auth
              }
            })
            this.$store.dispatch('getMenuData')
            this.removeJob = false
        }
      })
    },
    // 修改项目成员岗位 弹框确定
    preserve () {
      var deptIds = ''
      this.jobWork.forEach(item => {
        if (item.department.name === this.deptName) {
          deptIds = item.department.id
        }
      })
      const data = {
        deptId: deptIds,
        jobId: this.jobName,
        id: this.userId
      }
      putTeamer(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
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
            this.$store.dispatch('getMenuData')
            this.isDutyWork = false
            break
        }
      })
    },
    // 修改项目成员岗位 弹框取消
    cancel () {
      this.isDutyWork = false
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

<template>
  <Card class="card">
    <Row>
      <Col :xxl="18" :xl="17">
        <Col :xxl="{ span: 24}" :xl="{ span: 24}">
          <el-timeline v-if="spinShow">
            <el-timeline-item timestamp="2014" placement="top" color="#2D8cF0" size="large">
              <el-card></el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2015" placement="top" color="#2D8cF0" size="large">
              <el-card></el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2016" placement="top" color="#2D8cF0" size="large">
              <el-card></el-card>
            </el-timeline-item>
          </el-timeline>
          <el-timeline>
            <el-timeline-item
              :timestamp="item.year +''"
              placement="top"
              color="#2D8cF0"
              size="large"
              v-for="item in allData"
              :key="item.year"
            >
              <el-card class="width">
                <el-table :data="getData(item)" style="width: 100%" border empty-text="暂无数据">
                  <el-table-column
                    prop="date"
                    :label="item.year + ''"
                    width="200"
                    fixed="left"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.data }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month1" label="1月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month1.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,1)"
                      >{{ getMonthData(scope.row.month1.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month1.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,1)"
                      >{{ getMonthData(scope.row.month1.data) }}</span>
                      <span
                        v-if="scope.row.month1.status === -1"
                      >{{ getMonthData(scope.row.month1.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month2" label="2月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month2.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,2)"
                      >{{ getMonthData(scope.row.month2.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month2.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,2)"
                      >{{ getMonthData(scope.row.month2.data) }}</span>
                      <span
                        v-if="scope.row.month2.status === -1"
                      >{{ getMonthData(scope.row.month2.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month3" label="3月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month3.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,3)"
                      >{{ getMonthData(scope.row.month3.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month3.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,3)"
                      >{{ getMonthData(scope.row.month3.data) }}</span>
                      <span
                        v-if="scope.row.month3.status === -1"
                      >{{ getMonthData(scope.row.month3.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month4" label="4月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month4.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,4)"
                      >{{ getMonthData(scope.row.month4.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month4.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,4)"
                      >{{ getMonthData(scope.row.month4.data) }}</span>
                      <span
                        v-if="scope.row.month4.status === -1"
                      >{{ getMonthData(scope.row.month4.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month5" label="5月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month5.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,5)"
                      >{{ getMonthData(scope.row.month5.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month5.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,5)"
                      >{{ getMonthData(scope.row.month5.data) }}</span>
                      <span
                        v-if="scope.row.month5.status === -1"
                      >{{ getMonthData(scope.row.month5.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month6" label="6月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month6.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,6)"
                      >{{ getMonthData(scope.row.month6.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month6.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,6)"
                      >{{ getMonthData(scope.row.month6.data) }}</span>
                      <span
                        v-if="scope.row.month6.status === -1"
                      >{{ getMonthData(scope.row.month6.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month7" label="7月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month7.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,7)"
                      >{{ getMonthData(scope.row.month7.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month7.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,7)"
                      >{{ getMonthData(scope.row.month7.data) }}</span>
                      <span
                        v-if="scope.row.month7.status === -1"
                      >{{ getMonthData(scope.row.month7.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month8" label="8月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month8.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,8)"
                      >{{ getMonthData(scope.row.month8.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month8.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,8)"
                      >{{ getMonthData(scope.row.month8.data) }}</span>
                      <span
                        v-if="scope.row.month8.status === -1"
                      >{{ getMonthData(scope.row.month8.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month9" label="9月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month9.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,9)"
                      >{{ getMonthData(scope.row.month9.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month9.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,9)"
                      >{{ getMonthData(scope.row.month9.data) }}</span>
                      <span
                        v-if="scope.row.month9.status === -1"
                      >{{ getMonthData(scope.row.month9.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month10" label="10月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month10.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,10)"
                      >{{ getMonthData(scope.row.month10.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month10.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,10)"
                      >{{ getMonthData(scope.row.month10.data) }}</span>
                      <span
                        v-if="scope.row.month10.status === -1"
                      >{{ getMonthData(scope.row.month10.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month11" label="11月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month11.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,11)"
                      >{{ getMonthData(scope.row.month11.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month11.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,11)"
                      >{{ getMonthData(scope.row.month11.data) }}</span>
                      <span
                        v-if="scope.row.month11.status === -1"
                      >{{ getMonthData(scope.row.month11.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="70" prop="month12" label="12月" align="center">
                    <template slot-scope="scope">
                      <span
                        style="color:#FFCC33"
                        class="tableItemClass"
                        v-if="scope.row.month12.status === 0"
                        @click="goToBudgetTable(scope.row.data,item.year,12)"
                      >{{ getMonthData(scope.row.month12.data) }}</span>
                      <span
                        style="color:#0099CC"
                        class="tableItemClass"
                        v-if="scope.row.month12.status === 1"
                        @click="goToBudgetTable(scope.row.data,item.year,12)"
                      >{{ getMonthData(scope.row.month12.data) }}</span>
                      <span
                        v-if="scope.row.month12.status === -1"
                      >{{ getMonthData(scope.row.month12.data) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="total"
                    label="年度合计"
                    fixed="right"
                    align="center"
                    width="90"
                  >
                    <template slot-scope="scope">
                      <span style>{{ getTotal(scope.row) }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </Col>
      </Col>
      <Col :xxl="{ span: 5 }" :xl="{ span: 6}" style="margin-left:20px">
        <Col span="24">
          <el-card>
            <div style="border-bottom: 1px solid #EBEEF5;padding-bottom:20px">
              <span>成本消耗预算</span>
              <br />
              <p>
                合同日期（
                <span>{{startTime}}</span> ~
                <span>{{endTime}}</span> ）
                <Icon type="md-create" style="color: rgb(0, 153, 204)" size="16" @click="putDate" />
              </p>
              <h2 style="text-align:center">{{costBudget.total}}元</h2>
              <p
                style="text-align:center"
              >人员 {{costBudget.staffTotal}} + 办公 {{costBudget.officeTotal}}</p>
            </div>
            <div slot="header" v-if="totalQuote !== -1">
              <span>目标报价预算 {{totalQuote}}元</span>
            </div>
            <div slot="header" v-else>
              <span>目标报价预算</span>
              <br />
              <h2 style="text-align:center">- 元</h2>
            </div>
            <div>
              <span>点击数据查看详情</span>
              <div class="flex">
                <div class="width50">-</div>
                <div class="width50">非工期时段</div>
              </div>
              <div class="flex" style="color:#FFCC33">
                <div class="width50">黄色数据</div>
                <div class="width50">预算编制未完成</div>
              </div>
              <div class="flex" style="color:#0099CC">
                <div class="width50">蓝色数据</div>
                <div class="width50">预算编制已完成</div>
              </div>
              <div class="flex">
                <div class="width50">黑色数据</div>
                <div class="width50">自动汇总数据</div>
              </div>
            </div>
          </el-card>
        </Col>
      </Col>
    </Row>
    <Modal v-model="modal2" title="请确认预算的起止日期">
      <Form :model="formItem1" ref="formItem1" :rules="ruleformItem1" :label-width="80">
        <FormItem>
          <Row>
            <Col span="9">
              <FormItem prop="modal2startDate">
                <DatePicker
                  type="month"
                  placeholder="请选择开始日期"
                  value="yyyy-MM-dd"
                  @on-change="addForm.startDate=$event"
                  v-model="formItem1.modal2startDate"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="4" style="text-align: center">~</Col>
            <Col span="9">
              <FormItem prop="modal2endDate">
                <DatePicker
                  type="month"
                  placeholder="请选择结束日期"
                  value="yyyy-MM-dd"
                  @on-change="addForm.endDate=$event"
                  v-model="formItem1.modal2endDate"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modal2Cancel">取消</Button>
        <Button type="primary" size="large" @click="modal2Ok">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modal1" title="请确认预算的起止日期" @on-ok="ok" @on-cancel="cancel">
      <Form :model="formItem" ref="formItem" :rules="ruleformItem" :label-width="80">
        <FormItem>
          <Row>
            <Col span="9">
              <FormItem prop="startDate">
                <DatePicker
                  type="month"
                  placeholder="请选择开始日期"
                  value="yyyy-MM-dd"
                  @on-change="addForm.startDate=$event"
                  v-model="formItem.startDate"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="4" style="text-align: center">~</Col>
            <Col span="9">
              <FormItem prop="endDate">
                <DatePicker
                  type="month"
                  placeholder="请选择结束日期"
                  value="yyyy-MM-dd"
                  @on-change="addForm.endDate=$event"
                  v-model="formItem.endDate"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>
<script>
import { getCostData, putCostDate, CostDate } from '@/api/financial/budgeting/costBudget'
import { isDataSuccess, formatTime } from '@/libs/util'
export default {
  methods: {
    putDate () {
      this.formItem1.modal2startDate = this.startTime
      this.addForm.startDate = this.startTime
      this.addForm.endDate = this.endTime
      this.formItem1.modal2endDate = this.endTime
      this.modal2 = true
    },
    // 通过状态返回数据
    getMonthData (data) {
      if (data === -1) {
        return '-'
      } else {
        return data
      }
    },
    // 获取 每一行数据
    getData (rowData) {
      let tableData = [
        { month1: { data: '', status: '' }, month2: { data: '', status: '' }, month3: { data: '', status: '' }, month4: { data: '', status: '' }, month5: { data: '', status: '' }, month6: { data: '', status: '' }, month7: { data: '', status: '' }, month8: { data: '', status: '' }, month9: { data: '', status: '' }, month10: { data: '', status: '' }, month11: { data: '', status: '' }, month12: { data: '', status: '' }, data: '现场办公费用成本消耗预算' },
        { month1: { data: '', status: '' }, month2: { data: '', status: '' }, month3: { data: '', status: '' }, month4: { data: '', status: '' }, month5: { data: '', status: '' }, month6: { data: '', status: '' }, month7: { data: '', status: '' }, month8: { data: '', status: '' }, month9: { data: '', status: '' }, month10: { data: '', status: '' }, month11: { data: '', status: '' }, month12: { data: '', status: '' }, data: '现场派驻人员成本消耗' }
      ]
      rowData.officeCost.forEach((item, index) => {
        tableData[0][Object.keys(tableData[0])[index]].data = item
      })
      rowData.officeStatus.forEach((item, index) => {
        tableData[0][Object.keys(tableData[0])[index]].status = item
      })
      rowData.staffCost.forEach((item, index) => {
        tableData[1][Object.keys(tableData[0])[index]].data = item
      })
      rowData.statffStatus.forEach((item, index) => {
        tableData[1][Object.keys(tableData[0])[index]].status = item
      })
      return tableData
    },
    // 获取合计
    getTotal (data) {
      let sum = 0
      for (const key in data) {
        if (data[key].data !== -1 && key !== 'data') {
          sum += data[key].data
        }
      }
      return sum
    },
    // 点击表格值跳转页面
    goToBudgetTable (to, year, month) {
      if (to === '现场办公费用成本消耗预算') {
        this.$router.push({
          name: '现场办公费用成本预算',
          query: {
            id: this.costBudget.id,
            year: year,
            month: month
          }
        })
      } else if (to === '现场派驻人员成本消耗') {
        this.$router.push({
          name: '人员费用成本预算',
          query: {
            id: this.costBudget.id,
            year: year,
            month: month
          }
        })
      }
    },
    ok () {
      this.$refs.formItem.validate((valid) => {
        if (valid) {
          let newendDate = this.addForm.endDate.replace('.', '-')
          let newstartDate = this.addForm.startDate.replace('.', '-')
          let data = {
            endDate: newendDate + '-01',
            startDate: newstartDate + '-01'
          }
          CostDate(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                const loading = this.$loading({
                  lock: true,
                  text: '',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                })
                this.$Message.success(res.data.msgContent)
                this.modal1 = false
                getCostData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
                  let status = isDataSuccess(res)
                  console.log(res)
                  switch (status) {
                    case 1:
                      loading.close()
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      loading.close()
                      if (res.data.msgCode === 40002) {
                        // this.$Modal.confirm({
                        //   title: '合同日期未填写',
                        //   content: res.data.msgContent,
                        //   okText: '确定',
                        //   onOk: () => {
                        //     this.$router.push({ name: '项目信息' })
                        //   },
                        //   onCancel: () => {
                        //     this.$router.push({ name: '项目信息' })
                        //     this.$store.state.app.tagNavList.forEach((res, index) => {
                        //       if (res.name === '目标报价预算') {
                        //         this.$store.state.app.tagNavList.splice(index, 1)
                        //       }
                        //     })
                        //   }
                        // })
                      } else if (res.data.msgCode === 40003) {
                        this.$Modal.confirm({
                          title: '未有完成预算编制',
                          content: '请通知项目经理完成预算编制',
                          okText: '确定',
                          onOk: () => {
                            this.$router.go(-1)
                            this.$store.state.app.tagNavList.forEach((res, index) => {
                              if (res.name === '成本消耗预算') {
                                this.$store.state.app.tagNavList.splice(index, 1)
                              }
                            })
                          },
                          onCancel: () => {
                            this.$router.go(-1)
                            this.$store.state.app.tagNavList.forEach((res, index) => {
                              if (res.name === '成本消耗预算') {
                                this.$store.state.app.tagNavList.splice(index, 1)
                              }
                            })
                          }
                        })
                      } else {
                        this.$Message.error(res.data.msgContent)
                      }
                      break
                    default:
                      console.log(res.data.msgData)
                      this.costBudget = res.data.msgData.costBudget
                      this.allData = res.data.msgData.items
                      this.spinShow = false
                      this.totalQuote = res.data.msgData.totalQuote
                      this.startTime = res.data.msgData.startTime
                      this.endTime = res.data.msgData.endTime
                      setTimeout(() => {
                        loading.close()
                      }, 1000)
                  }
                })
                break
            }
          })
        } else {
          this.$Message.error('请填写时间')
        }
      })
    },
    modal2Ok () {
      this.$refs.formItem1.validate((valid) => {
        if (valid) {
          let newendDate = this.addForm.endDate.replace('.', '-')
          let newstartDate = this.addForm.startDate.replace('.', '-')
          let data = {
            endDate: newendDate + '-01',
            startDate: newstartDate + '-01'
          }
          putCostDate(this.costBudget.id, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                const loading = this.$loading({
                  lock: true,
                  text: '',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                })
                this.$Message.success(res.data.msgContent)
                this.modal2 = false
                getCostData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
                  let status = isDataSuccess(res)
                  console.log(res)
                  switch (status) {
                    case 1:
                      loading.close()
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      loading.close()
                      if (res.data.msgCode === 40002) {
                        // this.$Modal.confirm({
                        //   title: '合同日期未填写',
                        //   content: res.data.msgContent,
                        //   okText: '确定',
                        //   onOk: () => {
                        //     this.$router.push({ name: '项目信息' })
                        //   },
                        //   onCancel: () => {
                        //     this.$router.push({ name: '项目信息' })
                        //     this.$store.state.app.tagNavList.forEach((res, index) => {
                        //       if (res.name === '目标报价预算') {
                        //         this.$store.state.app.tagNavList.splice(index, 1)
                        //       }
                        //     })
                        //   }
                        // })
                      } else if (res.data.msgCode === 40003) {
                        this.$Modal.confirm({
                          title: '未有完成预算编制',
                          content: '请通知项目经理完成预算编制',
                          okText: '确定',
                          onOk: () => {
                            this.$router.go(-1)
                            this.$store.state.app.tagNavList.forEach((res, index) => {
                              if (res.name === '成本消耗预算') {
                                this.$store.state.app.tagNavList.splice(index, 1)
                              }
                            })
                          },
                          onCancel: () => {
                            this.$router.go(-1)
                            this.$store.state.app.tagNavList.forEach((res, index) => {
                              if (res.name === '成本消耗预算') {
                                this.$store.state.app.tagNavList.splice(index, 1)
                              }
                            })
                          }
                        })
                      } else {
                        this.$Message.error(res.data.msgContent)
                      }
                      break
                    default:
                      console.log(res.data.msgData)
                      this.costBudget = res.data.msgData.costBudget
                      this.allData = res.data.msgData.items
                      this.spinShow = false
                      this.totalQuote = res.data.msgData.totalQuote
                      this.startTime = res.data.msgData.startTime
                      this.endTime = res.data.msgData.endTime
                      setTimeout(() => {
                        loading.close()
                      }, 1000)
                  }
                })
                break
            }
          })
        } else {
          console.log(this.modal2endDate, this.modal2startDate)
          this.$Message.error('请填写时间')
        }
      })
    },
    cancel () {
      this.$refs.formItem.resetFields()
      this.modal1 = false
      this.$router.go(-1)
      this.$store.state.app.tagNavList.forEach((res, index) => {
        if (res.name === '成本消耗预算') {
          this.$store.state.app.tagNavList.splice(index, 1)
        }
      })
    },
    modal2Cancel () {
      this.$refs.formItem1.resetFields()
      this.modal2 = false
    }
  },
  data () {
    return {
      addForm: {
        endDate: '',
        startDate: ''
      },
      totalQuote: 0,
      startTime: '',
      endTime: '',
      tableData: [],
      costBudget: {},
      allData: [],
      spinShow: true,
      modal1: false,
      modal2: false,
      formItem: {
        startDate: '',
        endDate: ''
      },
      ruleformItem: {
        startDate: [
          { required: true, type: 'date', message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, type: 'date', message: '请选择结束日期', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (this.formItem.startDate >= this.formItem.endDate) {
                callback(new Error('结束时间需晚于开始时间'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      formItem1: {
        modal2startDate: '',
        modal2endDate: ''
      },
      ruleformItem1: {
        modal2startDate: [
          { required: true, type: 'date', message: '请选择开始日期', trigger: 'change' }
        ],
        modal2endDate: [
          { required: true, type: 'date', message: '请选择结束日期', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (this.formItem1.modal2startDate >= this.formItem1.modal2endDate) {
                callback(new Error('结束时间需晚于开始时间'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  created () {
    const loading = this.$loading({
      lock: true,
      text: '',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    getCostData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      let status = isDataSuccess(res)
      console.log(res)
      switch (status) {
        case 1:
          loading.close()
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          loading.close()
          if (res.data.msgCode === 40002) {
            // this.$Modal.confirm({
            //   title: '合同日期未填写',
            //   content: res.data.msgContent,
            //   okText: '确定',
            //   onOk: () => {
            //     this.$router.push({ name: '项目信息' })
            //   },
            //   onCancel: () => {
            //     this.$router.push({ name: '项目信息' })
            //     this.$store.state.app.tagNavList.forEach((res, index) => {
            //       if (res.name === '目标报价预算') {
            //         this.$store.state.app.tagNavList.splice(index, 1)
            //       }
            //     })
            //   }
            // })
            this.modal1 = true
          } else if (res.data.msgCode === 40003) {
            this.$Modal.confirm({
              title: '未有完成预算编制',
              content: '请通知项目经理完成预算编制',
              okText: '确定',
              onOk: () => {
                this.$router.go(-1)
                this.$store.state.app.tagNavList.forEach((res, index) => {
                  if (res.name === '成本消耗预算') {
                    this.$store.state.app.tagNavList.splice(index, 1)
                  }
                })
              },
              onCancel: () => {
                this.$router.go(-1)
                this.$store.state.app.tagNavList.forEach((res, index) => {
                  if (res.name === '成本消耗预算') {
                    this.$store.state.app.tagNavList.splice(index, 1)
                  }
                })
              }
            })
          } else {
            this.$Message.error(res.data.msgContent)
          }
          break
        default:
          setTimeout(() => {
            loading.close()
          }, 1000)
          console.log(res.data.msgData)
          this.costBudget = res.data.msgData.costBudget
          this.allData = res.data.msgData.items
          this.spinShow = false
          this.totalQuote = res.data.msgData.totalQuote
          this.startTime = res.data.msgData.startTime
          this.endTime = res.data.msgData.endTime
      }
    })
  }
}
</script>

<style lang="less">
.card {
  height: 100%;
  overflow-y: auto;
}
.width {
  width: 100%;
}
.width50 {
  width: 50%;
  text-align: center;
}
.flex {
  display: flex;
}
.flushButton {
  width: 100%;
  height: 40px;
}
.tableItemClass {
  cursor: pointer;
}
</style>

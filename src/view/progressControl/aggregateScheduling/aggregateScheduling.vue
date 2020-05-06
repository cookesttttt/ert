<template>
  <card>
    <Steps :current="1">
      <Step title="估算单位工程工期" content="根据合同或经验值明确单位工程工期和开工顺序" status="process"></Step>
      <Step title="生成总体计划" content="系统根据时间均衡算法自动生成双代号时标网络图" status="process"></Step>
      <Step title="调整计划" content="微调工作项的时间、工期" status="process"></Step>
      <Step title="完成编制" content="保存调整" status="process"></Step>
    </Steps>
    <!-- <el-steps :active="0">
      <el-step title="估算单位工程工期" description="根据合同或经验值明确单位工程工期和开工顺序" status="process"></el-step>
      <el-step title="生成总体计划" description="系统根据时间均衡算法自动生成双代号时标网络图" status="process"></el-step>
      <el-step title="调整计划" description="微调工作项的时间、工期" status="process"></el-step>
      <el-step title="完成编制" description="保存调整" status="process"></el-step>
    </el-steps>-->
    <Tabs :value="tags" style="margin-top:20px" @on-click="tagsClick">
      <TabPane label="基本信息" name="1" style="height:600px">
        <Form
          ref="information"
          :model="information"
          :rules="ruleInformation"
          :label-width="120"
          class="informationForm"
        >
          <FormItem label="计划编号" prop="number">
            <Input v-model="information.number" disabled></Input>
          </FormItem>
          <FormItem label="计划类型" prop="type">
            <Input v-model="information.type" disabled></Input>
          </FormItem>
          <FormItem label="合同开始日期" prop="startData">
            <Input v-model="information.startData" disabled></Input>
          </FormItem>
          <FormItem label="合同结束日期" prop="endData">
            <Input v-model="information.endData" disabled></Input>
          </FormItem>
          <FormItem label="施工计划开始日期" prop="planStartData">
            <DatePicker
              type="date"
              placeholder="请选择施工计划开始日期"
              v-model="information.planStartData"
              style="width:100%"
            ></DatePicker>
          </FormItem>
          <FormItem label="施工计划结束日期" prop="planEndData">
            <DatePicker
              type="date"
              placeholder="请选择施工计划结束日期"
              v-model="information.planEndData"
              style="width:100%"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <ButtonGroup>
              <Button type="primary" @click="informationSave">保存</Button>
              <Button @click="next">下一步</Button>
            </ButtonGroup>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="单位工程工期" name="2">
        <div class="workScheduleButton" style="text-align:right">
          <Button type="primary" @click="saveDayWork">保存并生成计划</Button>
        </div>
        <vxe-table
          ref="xTable"
          border
          show-overflow
          :data="unitTable"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column field="name" title="单位工程"></vxe-table-column>
          <vxe-table-column field="dayOfnum" title="工期(天)" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column type="index" width="100" title="开工顺序"></vxe-table-column>
          <vxe-table-column title="调整顺序">
            <template v-slot="{ row }">
              <vxe-button @click="up(row)">
                <i class="vxe-icon--caret-top"></i>
              </vxe-button>
              <vxe-button @click="down(row)">
                <i class="vxe-icon--caret-bottom"></i>
              </vxe-button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="计划明细" name="3">
        <div class="workSchedule">工作计划表</div>
        <div class="workScheduleButton">
          <Button type="primary" size="large">保存并重新生成计划</Button>
        </div>
        <vxe-table
          border
          resizable
          :data="workData"
          :edit-config="{trigger: 'click', mode: 'cell'}"
          height="500"
        >
          <vxe-table-column type="index" width="110" title="工作编码"></vxe-table-column>
          <vxe-table-column field="name" title="工作名称"></vxe-table-column>
          <vxe-table-column field="dayOfnum" title="工期" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column
            field="startWordDay"
            title="开工日期"
            width="200"
            :edit-render="{type: 'default'}"
          >
            <template v-slot:edit="{ row }">
              <DatePicker v-model="row.startWordDay" type="date" format="yyyy/MM/dd"></DatePicker>
            </template>
            <template v-slot="{ row }">{{ formatDate(row.startWordDay, 'yyyy/MM/dd') }}</template>
          </vxe-table-column>
          <vxe-table-column
            field="endWorkDay"
            title="完成日期"
            width="200"
            :edit-render="{type: 'default'}"
          >
            <template v-slot:edit="{ row }">
              <DatePicker v-model="row.endWorkDay" type="date" format="yyyy/MM/dd"></DatePicker>
            </template>
            <template v-slot="{ row }">{{ formatDate(row.endWorkDay, 'yyyy/MM/dd') }}</template>
          </vxe-table-column>
          <vxe-table-column field="preWorks" title="紧前工作" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="keyWork" title="关键工作"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="时标网络图" name="4">时标网络图</TabPane>
    </Tabs>
  </card>
</template>

<script>
import { paramsValidate, isDataSuccess, formatTime } from '@/libs/util'
import { getSchedule, saveSchedule, getPartialDay, savePartialDay, getDetailedSchedule } from '@/api/progressControl/aggregateScheduling'
export default {
  data () {
    return {
      planId: '',
      // tags 标签页位置
      tags: '1',
      // 基本信息 -- 表单
      information: {
        number: '',
        type: '总体进度计划',
        startData: '',
        endData: '',
        planStartData: '',
        planEndData: ''
      },
      // 基本信息 -- 表单规则
      ruleInformation: {
        type: [{ required: true, message: 'The name cannot be empty', trigger: 'change' }],
        startData: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }],
        endData: [{ required: true, message: 'The name cannot be empty', trigger: 'blur' }],
        planStartData: [{ required: true, type: 'date', message: 'Please select the date', trigger: 'change' }],
        planEndData: [{ required: true, type: 'date', message: 'Please select the date', trigger: 'change' }]
      },
      // 单位工程工期 --- 表格
      unitTable: [{ name: '路基工程', dayOfnum: 0 }, { name: '路面工程', dayOfnum: 20 }],
      // 工作计划表 -- 表格
      workData: [{ name: 'LJ1-1', dayOfnum: '8', startWordDay: '', endWorkDay: '', preWorks: '', keyWork: '' }]
    }
  },
  methods: {
    // tags标签页被点击时
    tagsClick (name) {
      switch (name) {
        case '2':
          getPartialDay(this.planId).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.unitTable = res.data.msgData
            }
          })
          break
        case '3':
          getDetailedSchedule(this.planId).then(res => {
            console.log(res)
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.workData = res.data.msgData
            }
          })
          break
        default:
          this.tags = name
          break
      }
    },
    // 基本信息 -- 保存按钮
    informationSave () {
      this.$refs.information.validate((valid) => {
        if (valid) {
          let data = {
            closeWork: new Date(formatTime(this.information.planEndData)).getTime(),
            code: this.information.number,
            endContract: new Date(formatTime(this.information.endData)).getTime(),
            id: this.planId,
            startContract: new Date(formatTime(this.information.startData)).getTime(),
            startWork: new Date(formatTime(this.information.planStartData)).getTime(),
            type: 1
          }
          console.log(data)

          saveSchedule(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
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
                getPartialDay(this.planId).then(res => {
                  let status = isDataSuccess(res)
                  switch (status) {
                    case 1:
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      this.$Message.error(res.data.msgContent)
                      break
                    default:
                      this.unitTable = res.data.msgData
                  }
                })
            }
          })
        } else {
          this.$Message.error('失败!')
        }
      })
    },
    // 基本信息 -- 下一步按钮
    next () {
      this.tags = parseInt(this.tags) + 1 + ''
    },
    // 单位工程工期 -- 调整顺序向上
    up (row) {
      this.unitTable.forEach((data, index) => {
        if (data.name === row.name) {
          if (index === 0) {
            this.$Message.info('不能在向前调整顺序了')
          } else {
            this.unitTable[index] = this.unitTable.splice(index - 1, 1, this.unitTable[index])[0]
          }
        }
      })
    },
    // 单位工程工期 -- 调整顺序向下
    down (row) {
      let rowindex
      this.unitTable.forEach((data, index) => {
        if (data.name === row.name) {
          rowindex = index
        }
      })
      if (rowindex === this.unitTable.length - 1) {
        this.$Message.info('不能在向后调整顺序了')
      } else {
        this.unitTable[rowindex] = this.unitTable.splice(rowindex + 1, 1, this.unitTable[rowindex])[0]
      }
    },
    // vux 表格格式化时间
    formatDate (value, format) {
      if (value) {
        return formatTime(value)
      } else {
        return ''
      }
    },
    // 单位工程工期保存按钮
    saveDayWork () {
      this.unitTable.forEach((item, index) => {
        item.openWorkOrder = index + 1
      })
      savePartialDay(this.planId, this.unitTable).then(res => {
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
        }
      })
    }
  },
  created () {
    // 获取整体进度计划基本信息
    getSchedule(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      console.log(res)

      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          if (res.data.msgData.id) {
            this.planId = res.data.msgData.id
          }
          if (res.data.msgData.code) {
            this.information.number = res.data.msgData.code
          }
          if (res.data.msgData.endContract) {
            this.information.endData = res.data.msgData.endContract
          }
          if (res.data.msgData.startContract) {
            this.information.startData = res.data.msgData.startContract
          }
          this.information.planStartData = res.data.msgData.startWork
          this.information.planEndData = res.data.msgData.closeWork
      }
    })
  }
}
</script>

<style lang="less" scoped>
.informationForm {
  width: 40%;
  margin: 0 auto;
}
.workSchedule {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  font-style: normal;
}
.workScheduleButton {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: end;
}
</style>

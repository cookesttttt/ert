<template>
  <Card style="height: 100%">
    <div class="right">
      <Button class="search-btn">&nbsp打印</Button>
      <Button class="search-btn" @click="clickComplete(0)">&nbsp临时保存</Button>
      <Button class="search-btn" type="primary" @click="clickComplete(1)">&nbsp完成计划</Button>
    </div>
    <br><br>
    <Button class="search-btn" type="error" @click="clickDelete">&nbsp;删除选中机械设备</Button>
    <br>
    <br>
    <vxe-table
      ref="xTable"
      border
      resizable
      class="vxe-table-iview"
      show-overflow
      :data="tableData"
      :edit-config="{trigger: 'click', mode: 'cell'}"
    >
      <vxe-table-column title="">
        <vxe-table-column type="selection" width="60"></vxe-table-column>
        <vxe-table-column type="index" width="80">
          <template v-slot:header="{ column }">
            <span>序号</span>
          </template>
        </vxe-table-column>
      </vxe-table-column>

      <vxe-table-column title="整体使用汇总设备" header-align="center">
        <vxe-table-column field="categoryName" title="机械名称"></vxe-table-column>
        <vxe-table-column field="power" title="机械型号"></vxe-table-column>
        <vxe-table-column field="model" title="设备功率"></vxe-table-column>
        <vxe-table-column field="inDate" title="最早使用时间"></vxe-table-column>
        <vxe-table-column field="planCount" title="总使用量"></vxe-table-column>
      </vxe-table-column>

      <vxe-table-column title="计划采购设备" header-align="center">
        <vxe-table-column field="unitPrice" title="预计单价(元)" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="total" title="预计总价(元)" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="planningTime" title="计划采购时间" :edit-render="{type: 'default'}">
          <template v-slot:edit="{ row }">
            <DatePicker v-model="row.planningTime" type="date" format="yyyy/MM/dd" :transfer="true"></DatePicker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.planningTime) }}</template>
        </vxe-table-column>
        <vxe-table-column field="quantity" title="计划采购数量" :edit-render="{name: 'input'}"></vxe-table-column>
      </vxe-table-column>
    </vxe-table>
  </Card>
</template>

<script>
  import {paramsValidate, isDataSuccess, formatTime} from '@/libs/util'
  import { mapMutations } from 'vuex' // 关闭页面
  import { getVerallPlanData, saveData } from '@/api/purchasingManagement/procurement'

  export default {
    name: "newEquipment",
    data() {
      return {
        tableData: [],
      }
    },
    methods: {
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'newEquipment'
        })
      },
      //点击删除按钮
      clickDelete() {
        if (this.$refs.xTable.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中机械设备',
            content: '<p>你确定要删除选中机械用品吗?</p>',
            onOk: () => {
              this.$refs.xTable.removeSelecteds()   //  删除表格中选中的数据
            },
          });
        } else {
          this.$Message.error('请选择删除的机械设备')
        }
      },
      //点击临时保存或者完成计划
      clickComplete(state) {
        const allTableData = this.$refs.xTable.getTableData().fullData
        console.log(allTableData)
        const allData = {'buyPlans': []}
        if (allTableData.length !== 0) {
          allTableData.forEach(v => {
            if (v.quantity) {
              let data = {}
              data.name = v.categoryName
              data.power = v.power
              data.model = v.model
              data.entiretyPlanId = v.id
              data.earliestUseDate = v.inDate
              data.planPrice = v.unitPrice
              data.planTotalPrice = v.total
              data.buyDate = formatTime(v.planningTime)
              data.planBuyCount = v.quantity
              allData.buyPlans.push(data)
            }
          })
          if(allData.buyPlans.length!==0){
            saveData(JSON.parse(localStorage.getItem("projectId")).id,allData).then(res=>{
              const data = res.data
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  break;
                case 2:
                  this.$Message.error(data.msgContent)
                  break;
                default:
                  this.close()
                  this.$router.push({name:'procurement'});
                  break
              }
            })
          }else {
            this.$Message.error('请编辑需要采购的设备')
          }
        }

      },
      //时间格式化
      formatDate(value) {
        if (value) {
          return formatTime(value)
        } else {
          return ''
        }
      },
      // 获取整体计划数据
      getVerallPlan() {
        getVerallPlanData(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
          const data = res.data;
          let status = isDataSuccess(res);
          switch (status) {
            case 1:
              this.$Message.error("服务器繁忙请稍后");
              break;
            case 2:
              this.$Message.error(data.msgContent);
              break;
            default:
              console.log(res.data)
              this.tableData = res.data.msgData
              break;
          }
        })
      },
    },
    mounted() {
      this.getVerallPlan()
    }
  }
</script>

<style scoped>
  .search-btn {
    margin-left: 10px;
  }

  .right {
    float: right;
  }
</style>

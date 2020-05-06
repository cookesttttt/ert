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
      :edit-config="{trigger: 'click', mode: 'row'}"
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
        <vxe-table-column field="categoryName" title="机械名称" ></vxe-table-column>
        <vxe-table-column field="model" title="机械型号"></vxe-table-column>
        <vxe-table-column field="power" title="设备功率" ></vxe-table-column>
        <vxe-table-column field="inDate" title="最早使用时间"></vxe-table-column>
        <vxe-table-column field="planCount" title="总使用量"></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column title="计划租赁设备" header-align="center">
        <vxe-table-column field="planOutDate" title="预计出场时间" :edit-render="{type: 'default'}">
          <template v-slot:edit="{ row }">
            <DatePicker v-model="row.planOutDate" type="date" format="yyyy/MM/dd" :transfer="true"></DatePicker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.planOutDate) }}</template>
        </vxe-table-column>
        <vxe-table-column field="rentPrice" title="租赁单价(元)" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="rentTotalPrice" title="租赁总价(元)" :edit-render="{name: 'input'}"></vxe-table-column>
        <vxe-table-column field="rentStartDate" title="计划租赁开始时间" :edit-render="{type: 'default'}" width="155">
          <template v-slot:edit="{ row }">
            <DatePicker v-model="row.rentStartDate" type="date" format="yyyy/MM/dd" :transfer="true"></DatePicker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.rentStartDate) }}</template>
        </vxe-table-column>
        <vxe-table-column field="rentCount" title="计划租赁数量" :edit-render="{name: 'input'}"></vxe-table-column>
      </vxe-table-column>
    </vxe-table>
  </Card>
</template>

<script>
  import {paramsValidate, isDataSuccess, formatTime } from '@/libs/util'
  import { mapMutations } from 'vuex' // 关闭页面
  import {getVerallPlanData, saveData } from '@/api/leaseManagement/leasePlan'
  export default {
    name: "newDemandOrder",
    data(){
      return {
        tableData:[],
      }
    },
    methods:{
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'newDemandOrder'
        })
      },
      //点击临时保存或者完成计划
      clickComplete(state) {
        const allTableData = this.$refs.xTable.getTableData().fullData
        console.log(allTableData)
        const allData = {'rentPlanVos': []}
        if (allTableData.length !== 0) {
          allTableData.forEach(v => {
            if (v.rentCount) {
              let data = {}
              data.projectId = JSON.parse(localStorage.getItem("projectId")).id
              data.entiretyPlanId = v.id
              data.name=v.categoryName
              console.log(v.categoryName)
              data.power = v.power
              data.model = v.model
              data.earliestUseDate = v.inDate
              data.entiretyPlanCount=v.planCount
              data.planOutDate=formatTime(v.planOutDate)
              data.rentPrice=v.rentPrice
              data.rentTotalPrice=v.rentTotalPrice
              data.rentStartDate=formatTime(v.rentStartDate)
              data.rentCount=v.rentCount
              allData.rentPlanVos.push(data)
            }
          })
          if(allData.rentPlanVos.length!==0){
            saveData(allData).then(res=>{
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
                  this.$router.push({name:'leasePlan'});
                  break
              }
            })
          }else {
            this.$Message.error('请编辑需要租赁的设备')
          }
        }
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
              console.log(data)
              this.tableData = data.msgData
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

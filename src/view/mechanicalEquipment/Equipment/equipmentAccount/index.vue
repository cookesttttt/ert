<template>
  <Card style="height: 100%">
    <br><br>
    <Table
      border
      :columns="columns"
      :data="tableData">
    </Table>
    <!--分页-->
    <br>
    <div class="page">
      <div class="right">
        <br>
        <Page :total="totalElements"
              :current="pageNum"
              show-total
              @on-change="changePage">
        </Page>
      </div>
    </div>
  </Card>
</template>

<script>
  import { paramsValidate , isDataSuccess , formatTime } from '@/libs/util'
  import {getAllData } from '@/api/Equipment/equipmentAccount'
  export default {
    name: "index",
    data() {
      return {
        pageNum: 1,                     // 当前页码
        pageSize: 10,                  // 每页显示多少条
        totalElements: 0,             // 初始化信息总条数
        tableData: [],
        columns: [{
          type: 'selection',
          width: 60,
          align: 'center',
            fixed: 'left',
        },
          {
            type: 'index',
            width: 50,
              fixed: 'left',
            align: 'center'

          },
          {
            title: '设备名称',
              tooltip:true,
              width: 160,
              fixed: 'left',
            key: 'name',
          },
          {
            title: '设备型号',
              width: 160,
              fixed: 'left',
              tooltip:true,
            key: 'model',
          },
          {
            title: '设备功率',
              fixed: 'left',
              width: 160,
              tooltip:true,
            key: 'power',
          },
          {
            title: '入场时间',
            width: 120,
            key: 'inDate',
          },
          {
            title: '所属单位',
              tooltip:true,
              width: 160,
            key: 'owner',
          },
          {
            title: '驻场时长',
            key: 'inDays',
            width: 120,
          },
          {
            title: '当时前是否驻场',
            key: 'isIn',
            width: 140,
            render:(h,params)=>{
              const status=params.row.isIn===true?'是':'否'
              return h('div',status)
            }
          },
          {
            title: '设备负责人',
            key: 'responsiblePerson',
            width: 120,
          },
          {
            title: '保养记录',
            key: 'maintenanceDate',
            width: 120,
          },
          {
            title: '其他信息',
            key: 'otherInfo',
              width: 160,
              tooltip:true,
          },
        ]
      }
    },
    methods: {
      changePage(index) {
        this.pageNum = index
        this.getData(this.pageNum)
      },
      getData (pageNum) {
        getAllData(JSON.parse(localStorage.getItem('projectId')).id, pageNum, this.pageSize).then(res => {
            console.log(res)
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
                console.log(data)
                this.tableData = data.msgData.content
                this.totalElements = data.msgData.totalElements
                break
            }
          }
        )
      },
    },
    created() {
      this.getData(this.pageNum)
    }
  }
</script>

<style scoped>
  .page {
    margin: 10px;
    overflow: hidden
  }

  .right {
    float: right;
  }
</style>

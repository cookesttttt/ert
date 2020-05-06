<template>
  <dataTable
    :title="title"
    @onClickBtn="newClick"
    :columns="columns"
    :list="tableData"
    @clickBJ='clickBJ'
    @clickOK='clickOK'
    :border="true"
    :pager="pager"
    @setPager="getItemList"
  >
  </dataTable>
</template>

<script>
  import dataTable from '_c/data-table'
  import {paramsValidate, isDataSuccess, formatTime} from '@/libs/util'
  import {getAllData, deleteData} from '@/api/Equipment/usingRecord'
  export default {
    name: "index",
    components: {
      dataTable
    },
    data() {
      return {
        pager: {
          page: 1,
          rows: 10,
          count: 0,
        },
        title: '新建使用记录',
        tableData:[],
        columns:[
          {
              fixed: 'left',
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
              fixed: 'left',
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
              fixed: 'left',
            title: '设备名称',
              width: 160,
            key: 'name',
          },
          {
              fixed: 'left',
            title: '设备型号',
              width: 160,
            key: 'model'
          },
          {
              fixed: 'left',
            title: '设备功率',
              width: 160,
            key: 'power'
          },
          {
            title: '开始使用时间',
            key: 'startUsingDate',
            width: 120,
          },
          {
            title: '结束使用时间',
            key: 'endUsingDate',
            width: 120,
          },
          {
            title: '操作人员',
            key: 'operator',
            width: 100,
          },
          {
            title: '安全人员',
            width: 100,
            key: 'safetyOfficer'
          },
          {
            title: '记录人员',
            width: 100,
            key: 'recorder'
          },
          {
            title: '备注',
            key: 'remark'
          },
          {
              fixed: 'right',
            title: '操作',
            slot: 'operation',
            align: 'center',
            width: 130,
          },
        ],
      }
    },
    methods: {
      newClick() {
        this.$router.push({name: 'newUsageRecord'});
      },
      clickBJ(row){
        sessionStorage.setItem('editUsageRecordId', row.id)
        this.$router.push({name: 'editUsageRecord'});
      },
      clickOK(row){
        deleteData(row.id).then(res => {
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
              console.log(res)
              this.getData(this.pager.page)
              this.tableData.splice(row._index, 1)
              this.$Message.success(data.msgContent)
              break
          }
        })
      },
      //  获取列表数据
      getItemList(page){
        this.pager.page=page.page
        this.getData(this.pager.page)
      },
      getData(pageNum) {
        getAllData(JSON.parse(localStorage.getItem("projectId")).id,pageNum,this.pager.rows,).then(res => {
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
              this.tableData = data.msgData.content
              this.pager.count = data.msgData.totalElements
              break;
          }
        })
      },
    },
    created() {
      this.getData(this.pager.page)
    }

  }
</script>

<style scoped>

</style>

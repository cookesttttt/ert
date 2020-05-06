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
  import {getAllData, deleteData} from '@/api/EquipmentMaintenance/engineAttendance'
  export default {
    name: "index",
    components: {
      dataTable
    },
    data(){
      return {
        pager: {
          page: 1,
          rows: 10,
          count: 0,
        },
        title: '新建保养记录单',
        tableData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '设备名称',
            key: 'name',
          },
          {
            title: '设备型号',
            key: 'model'
          },
          {
            title: '设备功率',
            key: 'power'
          },
          {
            title: '保养时间',
            key: 'maintenanceDate',
            width: 120,
          },
          {
            title: '保养类型',
            key: 'maintenanceType',
            width: 100,
          },
          {
            title: '保养单位',
            key: 'maintenanceCompany',
            width: 100,
          },
          {
            title: '保养费用',
            key: 'maintenanceCost',
            width: 120,
          },
          {
            title: '经办人',
            key: 'transactor',
            width: 120,
          },
          {
            title: '操作',
            slot: 'operation',
            align: 'center',
            width: 130,
          },
        ],
      }
    },
    methods:{
      newClick() {
        this.$router.push({name: 'newEngineAttendance'});
      },
      clickBJ(row){
        sessionStorage.setItem('editEngineAttendanceId', row.id)
        this.$router.push({name: 'editEngineAttendance'});
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
        getAllData(pageNum,this.pager.rows,JSON.parse(localStorage.getItem("projectId")).id,).then(res => {
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

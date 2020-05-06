<template>
  <dataTable
    :title="title"
    @onClickBtn="newClick"
    :columns="columns"
    :list="tableData"
    @clickBJ='clickBJ'
    @clickOK='clickOK'
    :border="true"
    :pagingOption="pagingOption"
  >
  </dataTable>
</template>

<script>
  import dataTable from '_c/data-table'
  import {paramsValidate, isDataSuccess, formatTime} from '@/libs/util'
  import {getAllData, deleteData} from '@/api/leaseManagement/equipmentComingOut'
  export default {
    name: "equipmentAdmission",
    components: {
      dataTable
    },
    data() {
      return {
        pagingOption:{
          showPaging: false,
          showTotal: false
        },
        title: '新建出场单',
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            type: 'index',
            width: 50,
            align: 'center'
          },
          {
            title: '设备名称与型号',
            key: 'equipmentNameAndModel',
              tooltip:true
          },
          {
            title: '出场时间',
            key: 'outDate',
            width: 120,
          },
          {
            title: '查验结果',
              tooltip:true,
            key: 'checkResult'
          },
          {
            title: '操作',
            slot: 'operation',
            align: 'center',
            width: 130,
          },
        ],
        tableData: [],
      }
    },
    methods: {
      newClick() {
        this.$router.push({name: 'newAppearance'});
      },
      clickBJ(row) {
        sessionStorage.setItem('editAppearanceId', row.id)
        this.$router.push({name: 'editAppearance'});
      },
      clickOK(row) {
        console.log(row)
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
              this.getData()
              this.tableData.splice(row._index, 1)
              this.$Message.success(data.msgContent)
              break
          }
        })
      },
      //  获取列表数据
      getData() {
        getAllData(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
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
    created() {
      this.getData()
    }
  }
</script>


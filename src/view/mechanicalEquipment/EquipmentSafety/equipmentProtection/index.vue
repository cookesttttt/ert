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
  import {getAllData, deleteData} from '@/api/EquipmentSafety/equipmentProtection'
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
        title: '新建设备防护单',
        tableData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '防护内容',
              tooltip:true,
            key: 'protectType',
          },
          {
            title: '防护时间',
            key: 'protectDate',
            width:'120'
          },

          {
            title: '防护设备',
              tooltip:true,
            key: 'equipments'
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
        this.$router.push({name: 'newEquipmentProtection'});
      },
      clickBJ(row){
        sessionStorage.setItem('editEquipmentProtectionId', row.id)
        this.$router.push({name: 'editEquipmentProtection'});
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
        getAllData(JSON.parse(localStorage.getItem("projectId")).id,pageNum,this.pager.rows).then(res => {
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

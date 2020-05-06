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
  import {getAllData, deleteData} from '@/api/EquipmentMaintenance/mechanicalInspection'
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
        title: '新建检查单',
        tableData:[],
        columns:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '设备名称',
              tooltip:true,
            key: 'name',
          },
          {
            title: '设备型号',
              tooltip:true,
            key: 'model'
          },
          {
            title: '设备功率',
              tooltip:true,
            key: 'power'
          },
          {
            title: '检查类型',
              tooltip:true,
            key: 'checkType'
          },
          {
            title: '检查时间',
            key: 'createDate',
            width: 150,
          },
          {
            title: '检查人',
            key: 'checker',
            width: 100,
          },
          {
            title: '检查结果',
              tooltip:true,
            key: 'checkResult',
            width: 100,
          },
          {
            title: '是否需要保养',
            key: 'needMaintenance',
            width: 150,
            render:(h, params)=>{
             const status=params.row.needMaintenance===true?'是':'否'
              return h('div',status)
            }
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
        this.$router.push({name: 'newMechanicalInspection'});
      },
      clickBJ(row){
        sessionStorage.setItem('editMechanicalInspectionId', row.id)
        this.$router.push({name: 'editMechanicalInspection'});
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

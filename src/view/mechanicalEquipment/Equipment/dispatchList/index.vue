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
  import {getAllData, deleteData} from '@/api/Equipment/dispatchList'
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
          title: '新建调度单',
          tableData:[],
          columns:[
            {
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: '调动时间',
              key: 'dispatchDate',
              width: 120,
            },
            {
              title: '调出单位',
                tooltip:true,
              key: 'outCompany'
            },
            {
              title: '调入单位',
                tooltip:true,
              key: 'inCompany'
            },
            {
              title: '经办人',

              key: 'operator',
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
          this.$router.push({name: 'newDispatchList'});
        },
        clickBJ(row){
          sessionStorage.setItem('editDispatchListId', row.id)
          this.$router.push({name: 'editDispatchList'});
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
       /*  console.log('1') */
        this.getData(this.pager.page)
      }

    }
</script>

<style scoped>

</style>

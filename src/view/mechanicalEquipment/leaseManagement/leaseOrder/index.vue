<template>
  <Card style="height: 100%">
    <Button class="search-btn" type="primary" @click="clicKAdd">&nbsp;新建租赁申请单</Button>
    <br><br>
    <!--表格-->
    <Table
      border
      :columns="columns"
      :data="tableData">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
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
  import {paramsValidate, isDataSuccess, formatTime} from '@/libs/util'
  import {getAllData,deleteData } from '@/api/leaseManagement/leaseOrder'
  export default {
    name: "leaseOrder",
    data(){
      return {
        tableData: [],                    // 表格数据
        columns: [
          {
            type: 'selection',
            width: 60,
            fixed: 'left',
            align: 'center',
          },
          {
            type: 'index',
            fixed: 'left',
            width: 50,
            align: 'center'
          },
          {
            title: '申请单编号',
            fixed: 'left',
            width: 200,
            key: 'billNumber',
          },
          {
            title: '申请机械',
            fixed: 'left',
            key: 'equipmentNames',
              tooltip:true
          },
          {
            title: '申请时间',
            width: 120,
            key: 'applyDate',
          },
          {
            title: '申请人',
            width: 100,
            key: 'applier',
          },
          {
            title: '申请金额(元)',
            width: 130,
            key: 'totalPrice'
          },

          {
            title: '操作',
            fixed: 'right',
            width: 130,
            key: 'handle',
            render: (h, params, vm) => {
              return [
                [h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    'click': () => {
                      sessionStorage.setItem('editLeaseOrderId',this.tableData[params.index].id)
                      this.$router.push({name:'editLeaseOrder'});
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '编辑')],
                h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '你确定要删除吗?',
                      placement: 'left-end',
                      size: 'small'
                    },
                    on: {
                      'on-ok': () => {
                        this.clickDelete(params.index);
                      }
                    }
                  },
                  [h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                  }, '删除')])
              ]
            }
          }
        ],
        pageNum: 1,                     // 当前页码
        pageSize: 10,                  // 每页显示多少条
        totalElements: 0,             // 初始化信息总条数
      }
    },
    methods:{
      clicKAdd(){
        this.$router.push({path: '/mechanicalEquipment/leaseManagement/newLeaseOrder'});
      },
      /**
       * 分页
       * */
      changePage(index) {
        this.pageNum = index
        this.getData(this.pageNum)
      },
      //删除列表数据
      clickDelete(index) {
        deleteData(this.tableData[index].id).then(res => {
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
              this.tableData.splice(index, 1)
              this.getData(this.pageNum)
              this.$Message.success(data.msgContent)
              break
          }
        })
      },
      //  获取列表数据
      getData(pageNum) {
        getAllData(pageNum,this.pageSize,JSON.parse(localStorage.getItem("projectId")).id).then(res => {
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
              this.tableData = data.msgData.content
              this.totalElements = data.msgData.totalElements
              break;
          }
        })
      },
    },
    activated() {
       this.getData(this.pageNum)
    }
  }
</script>

<style scoped>
  .search-btn {
    margin-left: 10px;
  }
  .page{
    margin: 10px;
    overflow: hidden
  }
  .right{
    float: right;
  }
</style>

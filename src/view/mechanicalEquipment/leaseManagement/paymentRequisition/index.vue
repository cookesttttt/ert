<template>
  <Card style="height: 100%">
    <Button class="search-btn" type="primary" @click="clicKAdd">&nbsp;新建付款申请单</Button>
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
  import {getAllData,deleteData } from '@/api/leaseManagement/paymentRequisition'
  export default {
    name: "paymentRequisition",
    data(){
      return {
        tableData: [],                    // 表格数据
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
            title: '合同编号',
            width: 130,
            key: 'contractNumber'
          }, {
            title: '合同名称',
            key: 'contractName',
                tooltip:true,

          },
          {
            title: '申请时间',
            width: 120,
            key: 'applyDate',
          },
          {
            title: '收款单位',
              tooltip:true,
            key: 'payEe',
          },

          {
            title: '备注',
              tooltip:true,
            key: 'remark'
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
                      sessionStorage.setItem('editPaymentRequisitionId',this.tableData[params.index].id)
                      this.$router.push({name:'editPaymentRequisition'});
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
                        console.log(params.index)
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
        this.$router.push({path: '/mechanicalEquipment/leaseManagement/NewPaymentRequisition'});
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
        console.log(this.tableData[index].id)
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

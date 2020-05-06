<template>
  <Card style="height: 100%">
    <br>
    <Button class="search-btn" type="primary" @click="clicKAdd">&nbsp;新建结算单</Button>
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
  import {getAllData,deleteData } from '@/api/leaseManagement/equipmentSettlement'
  export default {
    name: "equipmentSettlement",
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
            title: '结算时间',
            key: 'payDate',
            width: 120,
          },
          {
            title: '合同编号',
              tooltip:true,
            key: 'contractNumber',
          }, {
            title: '合同名称',
                tooltip:true,
            key: 'contractName',
          }, {
            title: '收款单位',
                tooltip:true,
            key: 'payEe',
          }, {
            title: '开户行',
                tooltip:true,
            key: 'blank',
          }, {
            title: '银行账号',
                tooltip:true,
            key: 'blankAccount',
          }, {
            title: '经办人',
            key: 'operator',
            width: 100,
          },
          {
            title: '实付金额',
              tooltip:true,
            key: 'actualAmount'
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
                      sessionStorage.setItem('equipmentSettlementId',this.tableData[params.index].id)
                      this.$router.push({name:'editSettlementDoc'});
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
        this.$router.push({path: '/mechanicalEquipment/leaseManagement/newSettlementDoc'});
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
        console.log(index)
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
        getAllData(JSON.parse(localStorage.getItem("projectId")).id,pageNum,this.pageSize,).then(res => {
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

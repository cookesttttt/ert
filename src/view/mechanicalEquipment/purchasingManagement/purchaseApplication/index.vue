<template>
<Card style="height: 100%">
  <br>
  <Button class="search-btn" type="primary" @click="clicKAdd">&nbsp;新建采购申请单</Button>
  <br><br>
  <!--表格-->
  <Table
    border
    :columns="columns"
    :data="tableData">
  </Table>
</Card>
</template>

<script>
  import {paramsValidate, isDataSuccess, formatTime} from '@/libs/util'
  import {getAllData,deleteProcurement } from '@/api/purchasingManagement/purchaseApplication'
    export default {
        name: "purchaseApplication",
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
              title: '申请编号',
              width: 200,
              key: 'billNumber',
            },
            {
              title: '采购时间',
              width: 120,
              key: 'applyDate',
            },
            {
              title: '申请机械',
              key: 'equipmentNames',
                tooltip:true
            },
            {
              title: '申请总价(元)',
              width: 130,
              key: 'totalPrice'
            },
            {
              title: '申请原因',
              key: 'reason',
                tooltip:true
            },
            {
              title: '是否打印',
              width: 130,
              key: ''
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
                        console.log(this.tableData[params.index].id)
                        sessionStorage.setItem('editApplicationId',this.tableData[params.index].id)
                        this.$router.push({name:'editApplication'});
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
        }
      },
      methods:{
        clicKAdd(){
          this.$router.push({path: '/mechanicalEquipment/purchasingManagement/newApplication'});
        },
        //删除列表数据
        clickDelete(index) {
          deleteProcurement(this.tableData[index].id).then(res => {
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
                this.tableData.splice(index, 1)
                this.getData()
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
                console.log(res.data)
                this.tableData =data.msgData
                break;
            }
          })
        },
      },
      activated() {
         this.getData()
      }
    }
</script>

<style scoped>
  .search-btn {
    margin-left: 10px;
  }
</style>

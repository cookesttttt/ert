<template>
  <Card style="height: 100%">
    <br>
    <Button class="search-btn" type="primary" @click="clickAdd">&nbsp;新建租赁合同</Button>
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
  import {getAllData,deleteData } from '@/api/leaseManagement/leaseAgreement'
  export default {
    name: "leaseAgreement",
    data(){
      return {
        tableData:[],
        columns:[
          {
            type: 'index',

            width: 50,
            align: 'center'
          },
          {
            title: '合同编号',
            width: 150,
            key: 'contractNumber',
          },
          {
            title: '合同名称',
            key: 'contractName',
              tooltip:true
          },
          {
            title: '甲方',
            key: 'firstParty',
              tooltip:true
          }, {
            title: '乙方',
            key: 'secondParty',
                tooltip:true
          }, {
            title: '签订日期',
            width: 120,
            key: 'signDate',
          }, {
            title: '租赁方式',
            key: 'equipmentRentWay',
                width: 100,
          }, {
            title: '结算方式',
            key: 'equipmentCountWay',
                width: 100,
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
                    size: 'small',
                  },
                  on: {
                    'click': () => {
                      sessionStorage.setItem('editLeaseContractId',this.tableData[params.index].id)
                      this.$router.push({name:'editLeaseContract'});
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
        ]
      }
    },
    methods:{
      clickAdd(){
        this.$router.push({path: '/mechanicalEquipment/leaseManagement/newLeaseContract'});
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
              this.tableData = data.msgData
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

</style>

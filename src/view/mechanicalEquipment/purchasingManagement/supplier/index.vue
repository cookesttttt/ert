<template>
  <Card style="height: 100%">
    <br>
    <Button class="search-btn" type="primary" @click="jumpNew">新建供应商</Button>
    <br><br>
    <!--表格数据-->
    <Table
      ref="selection"
      border
      :columns="columns"
      :data="tableData">
    </Table>
  </Card>
</template>

<script>
  import {paramsValidate, isDataSuccess, formatTime} from '@/libs/util'
  import {getAllData, deleteSupplier} from '@/api/purchasingManagement/supplier'

  export default {
    name: "supplier",
    data() {
      return {
        tableData: [],
        columns: [
          {
            type: 'index',
            width: 50,
            align: 'center',
          },
          {
            title: '供应商名称',
            key: 'name',
              tooltip:true
          },
          {
            title: '供应商等级',
            width: 100,
            key: 'level',

          },
          {
            title: '供应机械',
            key: 'equipmentNames',
              tooltip:true
          },
          {
            title: '黑名单',
            width: 100,
            key: 'blackList',
            render: (h, params) => {
              let tmpStr = params.row.blackList===true ? '是' : '否'
              return h('div', [
                h('span',{
                  style:{
                    color: params.row.blackList===true?"#FD0904":"#03A71F",
                  }
                },tmpStr)
              ])
            }
          },
          {
            title: '添加日期',
            width: 120,
            key: 'gmtCreate',

          },
          {
            title: '操作',
            width: 130,
            key: 'handle',
            render: (h, params, vm) => {
              return [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    'click': () => {
                      console.log(this.tableData[params.index].id)
                      sessionStorage.setItem('editSupplierId',this.tableData[params.index].id)
                      this.$router.push({name:'editSupplier'});
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '编辑'),
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
                }, [
                  h('Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      }
                    }, '删除')]),
              ]
            }
          }
        ]
      }
    },
    methods: {
      jumpNew() {
        this.$router.push({path: '/mechanicalEquipment/purchasingManagement/newSupplier'});
      },
      //  删除
      clickDelete(index) {
        deleteSupplier(this.tableData[index].id).then(res => {
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
              this.tableData = res.data.msgData
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

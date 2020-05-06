<template>
  <Card style="height: 100%">
    <br>
    <div class="bottom15">
      <Button  class="search-btn" type="primary" @click="clickAdd" >&nbsp;新建验收单</Button>
    </div>
    <br>
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
  import {getAllData, deleteList} from '@/api/purchasingManagement/equipmentAcceptance'
    export default {
        name: "equipmentAcceptance",
        data(){
          return {
             tableData:[],
            columns:[
              {

                type: 'index',
                fixed: 'left',
                width: 50,
                align: 'center'
              },
              {
                title:'设备名称',
                fixed: 'left',
                width: 200,
                  tooltip:true,
                key:'name',
              },
              {
                title:'设备型号',
                width: 180,
                  tooltip:true,
                key:'model',
              },
              {
                title:'功率',
                width: 180,
                key:'power',
                  tooltip:true
              },
              {
                title:'购买日期',
                width: 120,
                key:'purchasingDate'
              },
              {
                title:'验收结果',
                width: 200,
                  tooltip:true,
                key:'result'
              },
              {
                title:'合同编号',
                width: 170,
                fixed: 'right',
                key:'contractNumber'
              },
              {
                title:'购置厂家',
                width: 240,
                fixed: 'right',
                  tooltip:true,
                key:'supplier'
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
                          sessionStorage.setItem('editAcceptanceId',this.tableData[params.index].id)
                          this.$router.push({name:'editAcceptance'});
                        }
                      },
                      style:{
                        marginRight:'5px'
                      }
                    },"编辑")],
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
                            this.clickDelete(params.index)
                          }
                        }
                      },
                      [h('Button', {
                        props:{
                          type: 'error',
                          size: 'small'
                        },
                      },"删除")])
                  ]
                }
              }
            ],
          }
        },
         methods:{
           clickAdd(){
             this.$router.push({path: '/mechanicalEquipment/purchasingManagement/newAcceptance'});
           },
           //删除列表数据
           clickDelete(index) {
             deleteList(this.tableData[index].id).then(res => {
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

<style scoped>

</style>

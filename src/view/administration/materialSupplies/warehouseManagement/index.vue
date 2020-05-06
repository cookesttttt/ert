<template>
  <Card>
    <Button  class="search-btn" type="primary"  @click="isAddModal=true">&nbsp新建库房</Button>
    <br><br>
    <!--新增库房弹框-->
    <Modal
      title="新建库房"
      v-model="isAddModal"
      :mask-closable="false"
      @on-cancel="cancel(1)">
      <Form
        ref="newWarehouse"
        :model="newWarehouse"
        :label-width="100" inline :rules="rules">
        <FormItem label="库房名称" prop="name">
          <Input v-model="newWarehouse.name" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="库房编号" prop="number">
          <Input v-model="newWarehouse.number" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="库房地点" prop="situs">
          <Input v-model="newWarehouse.situs" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="备注" prop="remarks">
          <Input v-model="newWarehouse.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350" :maxlength="15"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"   size="large"  @click="cancel(1)">取消</Button>
        <Button type="primary" size="large" @click="addWarehouse">保存</Button>
      </div>
    </Modal>
    <!--表格数据-->
    <Table
      border
      ref="tables"
      :data="tableData"
      :columns="columns">
    </Table>
    <!--编辑库房弹框-->
    <Modal
      title="编辑库房"
      v-model="isEditModal"
      @on-cancel="cancel"
      :mask-closable="false">
      <Form  ref="editWarehouse" :model="editWarehouse"  :label-width="100" inline :rules="rules" >
        <FormItem label="库房名称" prop="name">
          <Input v-model="editWarehouse.name" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="库房编号" prop="number">
          <Input v-model="editWarehouse.number" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="库房地点" prop="situs">
          <Input v-model="editWarehouse.situs" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br>
        <FormItem label="备注" prop="remarks">
          <Input v-model="editWarehouse.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350" :maxlength="15"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text"   size="large"  @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="editWarehouseData">保存</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
  import {paramsValidate,isDataSuccess} from '@/libs/util'   //验证对象是否为空
  import { newWarehouse, getWarehouse,deleteWarehouse,editWarehouse} from '@/api/materialSupplies/warehouseManagement'    //获取数据
    export default {
     name: "warehouseManagement",
     data(){
       return{
         isAddModal: false,     //新建库房弹框
         isEditModal: false,   //编辑弹框数据
         tableData: [],        //表格数据
         newWarehouse:{        //新建库房数据
           name:'',
           number:'',
           situs:'',
           remarks:'',
         },
         editWarehouse:{       //编辑库房数据
           name:'',
           number:'',
           situs:'',
           remarks:'',
           id:''
         },
         rules:{
           name:[
             { required: true,
               message: '请填写库房名称名称',
               trigger: 'blur'
             }
           ],
         },
         columns: [
           {
             type: 'selection',
             width: 60,
             align: 'center',
             fixed: 'left',
           },
           {
             type: 'index',
             width: 50,
             align: 'center',
             fixed: 'left',
           },
           {
             title: '库房名称',
             key: 'name',
               tooltip:true,
             fixed: 'left',
           },
           {
             title: '库房编号',
             key: 'number'
           },
           {
             title: '地点',
             key: 'place',
               tooltip:true,
           },
           {
             title: '备注',
               tooltip:true,
             key: 'remark'
           },

           {
             title: '操作',
             key: 'handle',
             width: 130,
             fixed: 'right',
             render: (h, params, vm) => {
               return [
                 // 编辑按钮
                 [h('Button', {
                   props: {
                     type: 'primary',
                     size: 'small'
                   },
                   on: {
                     'click': () => {
                       this.echoData(params.index)
                     }
                   },
                   style: {
                     marginRight: '5px'
                   }
                 },"编辑")],
                 //删除按钮
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
                         this.deleteWarehouseData(this.tableData[params.index].id,params.index)
                       }
                     }
                   },
                   [h('Button', {
                     props:{
                       type: 'error',
                       size: 'small'
                     },
                   },"删除")]),
               ]
             }
           }
         ]
        }
     },
      methods:{
        //删除库房
      deleteWarehouseData(id,index){
        deleteWarehouse(this.tableData[index].id).then(res=>{
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
              this.tableData.splice(index, 1);
              this.getAllData();
              this.$Message.success(data.msgContent);
              break;
          }
        })
        },
      //新增库房
      addWarehouse(){
         this.$refs.newWarehouse.validate((valid) => {
           if (valid) {
             const data={
               "projectId":JSON.parse(localStorage.getItem("projectId")).id,
               "name":this.newWarehouse.name,
               "number":this.newWarehouse.number,
               "place":this.newWarehouse.situs,
               "remark":this.newWarehouse.remarks
             }
             newWarehouse(data).then(res=>{
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
                   this.getAllData(); //拉一次数据
                   this.cancel(1);
                   this.$Message.success(data.msgContent);
                   break;
               }
             })
           }
         })
       },
      //关闭弹框
      cancel(status){
          if (status === 1){
            this.$refs.newWarehouse.resetFields()  //清空
            this.isAddModal = false
          }else {
            this.$refs.editWarehouse.resetFields()  //清空
            this.isEditModal = false
          }
        },
      // 数据回显
       echoData(index){
        this.isEditModal=true
         this.editWarehouse.name=this.tableData[index].name
         this.editWarehouse.number=this.tableData[index].number
         this.editWarehouse.situs=this.tableData[index].place
         this.editWarehouse.remarks=this.tableData[index].remark
         this.editWarehouse.id=this.tableData[index].id

        },
        //编辑库房
        editWarehouseData(){
         const data={
           "projectId":JSON.parse(localStorage.getItem("projectId")).id,
           "name":this.editWarehouse.name,
           "number":this.editWarehouse.number,
           "place":this.editWarehouse.situs,
           "remark":this.editWarehouse.remarks,
         }
          if(this.editWarehouse.name){
            editWarehouse(data,this.editWarehouse.id).then(res=>{
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
                  this.getAllData();
                  this.cancel();
                  this.$Message.success(data.msgContent);
                  break;
              }
            })
          }
        },
        //获取全部数据
        getAllData(){
          getWarehouse(JSON.parse(localStorage.getItem("projectId")).id).then(res=>{
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
                console.log(data);
               this.tableData = data.msgData;
                break;
            }
          })
        }
      },
      mounted() {
       this.getAllData()
      }
    }
</script>


<style  lang="less" scoped>
  .width350{
    width: 350px;
  }
  .page{
    margin: 10px;
    overflow: hidden
  }
  .right{
    float: right;
  }

</style>

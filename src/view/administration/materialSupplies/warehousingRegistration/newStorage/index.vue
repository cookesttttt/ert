<template>
<Card style="width: 100%">
    <div class="textBox">
      <p  class="name">编制人：{{name}}</p>
      <p class="time"> 创建日期：{{time}}</p>
      <P class="left">单据编号：{{information.number}}</P>
      <div class="right">
        <Button  class="btn">&nbsp打印</Button>
        <Button  class="btn" @click="saveOrder(0)">&nbsp临时保存</Button>
        <Button  class="btn" type="primary"  @click="saveOrder(1)">&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div>
      <Tabs value="name1" @on-click="getAppliance">
        <TabPane label="基本信息" name="name1">
          <Row>

          </Row>
           <Form
             :model="information"
             :label-width="100"
             class="formItem"
             :rules="informationRules"
             ref="information"
           >
             <FormItem label="单据编号">
               <Input v-model="information.number"  style="width:400px" disabled></Input>
             </FormItem>
             <FormItem label="入库库房" prop="storeroomId">
               <Select v-model="information.storeroomId" style="width:400px">
                 <Option v-for="item in storeroom" :value="item.id">{{ item.name }}</Option>
               </Select>
             </FormItem>
             <FormItem label="货架号" prop="shelfNumber">
               <Input v-model="information.shelfNumber"  style="width:400px" :maxlength="15"></Input>
             </FormItem>
             <FormItem label="到货日期" prop="arrivalDate">
               <DatePicker type="date" v-model="information.arrivalDate"  style="width:400px" format='yyyy-MM-dd'></DatePicker>
             </FormItem>
             <FormItem label="入库日期" prop="inDate">
               <DatePicker type="date" v-model="information.inDate"  style="width:400px" format='yyyy-MM-dd'></DatePicker>
             </FormItem>
             <FormItem label="经办人" prop="operator">
               <Input v-model="information.operator"  style="width:400px" :maxlength="15"></Input>
             </FormItem>
             <FormItem label="金额(元)" prop="money">
               <Input v-model="information.money"  style="width:400px" :maxlength="12"></Input>
             </FormItem>
             <FormItem label="摘要" prop="remarks">
               <Input v-model="information.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:400px" :maxlength="255"></Input>
             </FormItem>
           </Form>
        </TabPane>
        <TabPane label="用品明细" name="name2">
          <ButtonGroup>
            <Button   type="primary"  @click="newSupplies">&nbsp新增入库用品</Button>
            <Button type="error"   @click="confirm">&nbsp;批量删除</Button>
          </ButtonGroup>
          <br><br>
          <vxe-table
            ref="xTable"
            border
            resizable
            show-overflow
            :edit-rules="validRules"
            :data="tableData"
            :edit-config="{trigger: 'click', mode: 'row'}">
            <vxe-table-column type="selection" width="60"></vxe-table-column>
            <vxe-table-column type="index" width="50">
              <template v-slot:header="{ column }">
                <span>#</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="name" title="名称" ></vxe-table-column>
            <vxe-table-column field="standard"  title="型号规格" ></vxe-table-column>
            <vxe-table-column field="unit" title="单位" ></vxe-table-column>
            <vxe-table-column field="voCount" title="入库数量" :edit-render="{name: 'input'}"></vxe-table-column>
          </vxe-table>
          <!--选择用品弹框-->
          <Modal
            width="650"
            v-model="isAddModal"
            @on-cancel="cancel"
            title="选择用品"
            :mask-closable="false"
          >
            <el-tabs type="border-card" style="height: 400px;overflow-y: scroll;">
              <el-tab-pane :label="i.categoryName" v-for="i in treeData">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox :label="j" v-for="j in i.supplyDtoList" class="checkBoxstop" >{{j.name}}</el-checkbox>
                </el-checkbox-group>
              </el-tab-pane>
            </el-tabs>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel">取消</Button>
              <Button type="primary" size="large" @click="saveData">保存</Button>
            </div>
          </Modal>
        </TabPane>
      </Tabs>
    </div>
</Card>
</template>

<script>
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate,isDataSuccess,getRealname,formatTime} from '@/libs/util'   //验证对象是否为空
  import {getNumber, getStoreroom,newStorageData,newSuppliesData, } from '@/api/materialSupplies/warehousingRegistration/newStorage'//获取数据
  import { mapMutations } from 'vuex'
    export default {
        name: "newStorage",
        data(){
          return {
            checkList:[],
            isAddModal:false,
            treeData:[],
            tableData: [],           //表格数据
            name:getRealname(),
            time:'',
            information:{            //基本信息数据
              number:'',
              arrivalDate:'',
              inDate:'',
              operator:'',
              storeroomId:'',
              shelfNumber:'',
              remarks:'',
              money:'',
            },
            supplies:[],
            storeroom:[],
            validRules:{
              voCount:[
                { required: true,type:'number', message: '请填写入库数量' },
                  {type: 'number', max: 10000, message: '系统最大数不能超过10000'},
                  {pattern: /^\+?[1-9]\d*$/, message: '请输入正整数'},
              ],
            },
            informationRules:{
              arrivalDate: [
                {
                  required: true,
                  message: '请选择到货日期',
                  trigger: 'blur',
                  type: 'date'
                }
              ],
              inDate: [
                {
                  required: true,
                  message: '请选择入库日期',
                  trigger: 'blur',
                  type: 'date'
                }
              ],
              operator:[
                {
                  required: true,
                  message: '请填写经办人',
                  trigger: 'blur'
                }
              ],
              storeroomId:[{
                required: true,
                message: '请选择入库库房',
                trigger: 'change',
                type: 'number'
              }],
              money:[
                {
                  required: true,
                  message: '请填写金额',
                  trigger: 'blur'
                },
                  {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
              ]
            },
          }
        },
       methods:{
         // 关闭页面
         ...mapMutations(['closeTag']),
         close () {
           this.closeTag({
             name: 'newStorage',
           })
         },
         // 获取入库库房数据
         getStoreroomData(){
           getStoreroom(JSON.parse(localStorage.getItem("projectId")).id).then(res=>{
             const data = res.data
             console.log(res)
             let status = isDataSuccess(res)
             switch (status) {
               case 1:
                 this.$Message.error("服务器繁忙请稍后")
                 break
               case 2:
                 this.$Message.error(data.msgContent)
                 break
               default:
                  this.storeroom= data.msgData
                 break
             }
           })
         },
         //获取单据编号
         getNumberData(){
           getNumber(JSON.parse(localStorage.getItem("projectId")).id).then(res=>{
             const data = res.data
             console.log(res)
             let status = isDataSuccess(res)
             switch (status) {
               case 1:
                 this.$Message.error("服务器繁忙请稍后")
                 break
               case 2:
                 this.$Message.error(data.msgContent)
                 break
               default:
                 this.information.number= data.msgData
                 break
             }
           })
         },
         //获取当前时间
         getNowTime(){
           let date = new Date();
           let seperator1 = "-";
           let year = date.getFullYear();
           let month = date.getMonth() + 1;
           let strDate = date.getDate();
           if (month >= 1 && month <= 9) {
             month = "0" + month;
           }
           if (strDate >= 0 && strDate <= 9) {
             strDate = "0" + strDate;
           }
             this.time= year + seperator1 + month + seperator1 + strDate;
             this.information.inDate= year + seperator1 + month + seperator1 + strDate;
         },
         //删除用品弹框
         confirm () {
           if(this.$refs.xTable.getSelectRecords().length!==0){
             this.$Modal.confirm({
               title: '删除选中用品',
               content: '<p>你确定要删除选中用品吗?</p>',
               onOk: () => {
                 this.$refs.xTable.getSelectRecords().forEach(v=>{
                   this.tableData.splice(this.tableData.indexOf(v), 1)
                 })
               },
             });
           }else {
             this.$Message.error('请选择删除的用品')
           }
         },
         //临时保存或者完成制单
         saveOrder(state){
          this.$refs.information.validate((valid)=>{
            if(valid){
               if(this.tableData.length!==0){
                 this.$refs.xTable.validate(valid2=>{
                   if (valid2) {
                     let arry = []
                     this.tableData.forEach(v=>{
                       let tableIdCount = {}
                       tableIdCount.id = v.id
                       tableIdCount.voCount = v.voCount
                       arry.push(tableIdCount)
                     })
                     this.supplies = arry
                     const data={
                       "projectId":JSON.parse(localStorage.getItem("projectId")).id,
                       "repId":this.information.storeroomId,
                       "number":this.information.number,
                       "state":state,
                       "comeDate":formatTime(this.information.arrivalDate),
                       "transactor":this.information.operator,
                       "positionNumber" :this.information.shelfNumber,
                       "inDate":formatTime(this.information.inDate),
                       "sumMoney":this.information.money,
                       "remark" :this.information.remarks,
                       "supplies":this.supplies
                     }
                     newStorageData(data).then(res=>{
                       const data = res.data
                       console.log(res)
                       let status = isDataSuccess(res)
                       switch (status) {
                         case 1:
                           this.$Message.error("服务器繁忙请稍后")
                           break
                         case 2:
                           this.$Message.error(data.msgContent)
                           break
                         default:
                           this.$Message.success(data.msgContent)
                           this.close()
                           this.$router.push({path: '/administration/warehousingRegistration'});
                           break
                       }
                     })
                   } else {
                     this.$Message.error('请填写入库数量')
                   }
                 })
               }else {
                 this.$Message.error('请填写用品明细')
               }
            }else {
              this.$Message.error('请完成单据基本信息')
            }
          })
         },
         getAppliance(name){
           if(name==='name2'){
             newSuppliesData(JSON.parse(localStorage.getItem("projectId")).id).then(res=>{
               const data = res.data
               console.log(res)
               let status = isDataSuccess(res)
               switch (status) {
                 case 1:
                   this.$Message.error("服务器繁忙请稍后")
                   break
                 case 2:
                   this.$Message.error(data.msgContent)
                   break
                 default:
                   this.treeData=data.msgData
                   break
               }
             })
           }
         },
         //点击新增入库用品
         newSupplies(){
           this.isAddModal=true
         },

         cancel(){
           this.isAddModal=false
         },
         saveData(){
           console.log(this.checkList)
           this.tableData=this.checkList
           this.isAddModal=false
         },
       },
      mounted() {
          this.getNowTime()
          this.getNumberData()
          this.getStoreroomData()
      }
    }
</script>

<style lang="less" scoped>
.search-btn{
  margin-left: 10px;
}
.left{
  float: left;
}
.formItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.checkBoxstop {
  margin-top: 20px;
  width: 80px;
}
</style>

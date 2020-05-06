<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="state" v-if="this.saveStatus===1">状态:完成</p>
      <p class="state" v-else>状态:<span style="color: red">未完成</span></p>
      <p class="time">创建日期:{{createDate}}</p>
      <p class="name">编制人:{{author}}</p>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)" v-bind:disabled="this.saveStatus===1">&nbsp临时保存</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-if="this.saveStatus===1">&nbsp提交</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)" v-else>&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div>
      <br><br>
      <Row type="flex" justify="center">
        <Col span="18">
          <Form ref="editTestData" :model="editTestData" :rules="ruleInline" :label-width="100">
            <Col span="12">
              <FormItem label="设备名称" prop="name">
                <Input v-model="editTestData.name" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备型号" prop="model">
                <Input v-model="editTestData.model" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备功率" prop="power">
                <Input v-model="editTestData.power" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="检查时间" prop="checkDate">
                <DatePicker
                  v-model="editTestData.checkDate"
                  type="date"
                  class="width"
                  format="yyyy-MM-dd"
                  :transfer="true"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="检查人" prop="checker">
                <Input v-model="editTestData.checker" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="检查类型" prop="checkType">
                <Select v-model="editTestData.checkType" class="width">
                  <Option value="日常检查">日常检查</Option>
                  <Option value="定期检查">定期检查</Option>
                  <Option value="定向检查">定向检查</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="是否需要保养" prop="needMaintenance">
                <RadioGroup v-model="editTestData.needMaintenance">
                  <Radio label="true">是</Radio>
                  <Radio label="false">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="检查结果" prop="checkResult">
                <Input v-model="editTestData.checkResult" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                       class="width" :maxlength="255"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="使用建议" prop="usingSuggestion">
                <Input v-model="editTestData.usingSuggestion" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                       class="width" :maxlength="255"></Input>
              </FormItem>
            </Col>
          </Form>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate, isDataSuccess, formatTime, getToken, getRealname} from '@/libs/util'
  import {mapMutations} from 'vuex' // 关闭页面
  import {editData,getEditData} from '@/api/EquipmentMaintenance/mechanicalInspection'
  export default {
    name: "editMechanicalInspection",
    data() {
      return {
        itemId: '',
        time: '',
        createDate: '',
        saveStatus: '',
        author: getRealname(),
        editTestData:{
          name:'',
          model:'',
          power:'',
          checkDate:'',
          checker:'',
          checkType:'',
          needMaintenance:'',
          checkResult:'',
          usingSuggestion:'',
        },
        ruleInline: {
          name: [
            {required: true, message: '请输入设备名称', trigger: 'blur'},
          ],
          model: [
            {required: true, message: '请输入设备型号', trigger: 'blur'},
          ],
          power: [
            {required: true, message: '请输入设备功率', trigger: 'blur'},
          ],
          checkDate: [
            {required: true, type: 'date', message: '请选择检查时间', trigger: 'change'}
          ],
          checker: [
            {required: true, message: '请输入检查人', trigger: 'blur'},
          ],
          checkType: [
            {required: true, message: '请选择检查类型', trigger: 'change'}
          ],
          needMaintenance: [
            { required: true, message: '选择是否需要保养', trigger: 'change' }
          ],
          checkResult: [
            {required: true, message: '请输入检查结果', trigger: 'blur'},
          ],
          usingSuggestion: [
            {required: true, message: '请输入使用意见', trigger: 'blur'},
          ],
        }
      }
    },
    methods:{
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'editMechanicalInspection'
        })
      },
      clickFinish(state){
        this.$refs.editTestData.validate((valid)=>{
          if(valid){
            const  data={
              saveStatus:state,
              name:this.editTestData.name,
              model:this.editTestData.model,
              power:this.editTestData.power,
              checkDate:this.editTestData.checkDate,
              checker:this.editTestData.checker,
              checkType:this.editTestData.checkType,
              needMaintenance:this.editTestData.needMaintenance,
              checkResult:this.editTestData.checkResult,
              usingSuggestion:this.editTestData.usingSuggestion,
            }
            editData(JSON.parse(localStorage.getItem("projectId")).id, this.itemId,data).then(res=>{
              const data = res.data
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  break;
                case 2:
                  this.$Message.error(data.msgContent)
                  break;
                default:
                  this.$Message.success(data.msgContent)
                  this.close()
                  this.$router.push({name: 'mechanicalInspection'});
                  break
              }
            })
          }else {
            this.$Message.error('请填写基本信息')
          }
        })
      },
      getEcho(){
        getEditData(this.itemId).then(res => {
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
              this.createDate=data.msgData.createDate
              console.log(data.msgData)
              this.saveStatus=data.msgData.saveStatus
              console.log(data)
              this.editTestData.name=data.msgData.name
              this.editTestData.model=data.msgData.model
              this.editTestData.power=data.msgData.power
              this.editTestData.checkDate=data.msgData.checkDate
              this.editTestData.checker=data.msgData.checker
              this.editTestData.checkType=data.msgData.checkType
              this.editTestData.needMaintenance=data.msgData.needMaintenance+''
              this.editTestData.checkResult=data.msgData.checkResult
              this.editTestData.usingSuggestion=data.msgData.usingSuggestion
              break;
          }
        })
      },
    },
    activated() {
      this.itemId=sessionStorage.getItem('editMechanicalInspectionId')
      this.getEcho()
    }
  }
</script>

<style scoped>
  .width {
    width: 80%;
  }
</style>

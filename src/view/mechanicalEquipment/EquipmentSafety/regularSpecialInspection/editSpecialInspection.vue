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
        <Col span="10">
          <Form ref="editCheckData" :model="editCheckData" :rules="ruleInline" :label-width="100">
            <Col span="24">
              <FormItem label="检查项目" prop="checkItem">
                <Input v-model="editCheckData.checkItem" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="检查时间" prop="checkDate">
                <DatePicker
                  v-model="editCheckData.checkDate"
                  type="date"
                  class="width"
                  format="yyyy-MM-dd"
                  :transfer="true"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="检查人员" prop="checker">
                <Input v-model="editCheckData.checker" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="检查类型" prop="checkType">
                <Select v-model="editCheckData.checkType" class="width">
                  <Option value="定期检查">定期检查</Option>
                  <Option value="专项检查">专项检查</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="问题列表" prop="questionList">
                <Input v-model="editCheckData.questionList" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                       class="width" :maxlength="255"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="建议" prop="usingSuggestion">
                <Input v-model="editCheckData.usingSuggestion" type="textarea" :autosize="{minRows: 3,maxRows:3}"
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
  import {editData, getEditData} from '@/api/EquipmentSafety/regularSpecialInspection'

  export default {
    name: "editSpecialInspection",
    data() {
      return {
        itemId: '',
        time: '',
        createDate: '',
        saveStatus: '',
        author: getRealname(),
        editCheckData:{
          checkItem:'',
          checkDate:'',
          checker:'',
          checkType:'',
          questionList:'',
          usingSuggestion:'',
        },
        ruleInline: {
          checkItem: [
            {required: true, message: '请输入检查项目', trigger: 'blur'},
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
          questionList: [
            {required: true, message: '请输入问题列表', trigger: 'blur'},
          ],
          usingSuggestion: [
            {required: true, message: '请输入建议', trigger: 'blur'},
          ],
        }
      }
    },
    methods:{
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'editSpecialInspection'
        })
      },
      clickFinish(state){
        this.$refs.editCheckData.validate((valid)=>{
          if(valid){
            const  data={
              saveStatus:state,
              checkItem:this.editCheckData.checkItem,
              checkDate:this.editCheckData.checkDate,
              checker:this.editCheckData.checker,
              checkType:this.editCheckData.checkType,
              questionList:this.editCheckData.questionList,
              usingSuggestion:this.editCheckData.usingSuggestion,
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
                  this.$router.push({name: 'regularSpecialInspection'});
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
              this.editCheckData.checkItem=data.msgData.checkItem
              this.editCheckData.checkDate=data.msgData.checkDate
              this.editCheckData.checker=data.msgData.checker
              this.editCheckData.checkType=data.msgData.checkType
              this.editCheckData.questionList=data.msgData.questionList
              this.editCheckData.usingSuggestion=data.msgData.usingSuggestion
              break;
          }
        })
      },
    },
    activated() {
      this.itemId=sessionStorage.getItem('editSpecialInspectionId')
      this.getEcho()
    }
  }
</script>

<style scoped>
  .width {
    width: 80%;
  }
</style>

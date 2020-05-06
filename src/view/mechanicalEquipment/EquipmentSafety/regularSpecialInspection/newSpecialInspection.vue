<template>
  <Card style="height: 100%">
    <div class="textBox">
      <p class="name">编制人:{{author}}</p>
      <P class="time">创建日期:{{time}}</P>
      <div class="right">
        <Button class="btn">&nbsp打印</Button>
        <Button class="btn" @click="clickFinish(0)">&nbsp临时保存</Button>
        <Button class="btn" type="primary" @click="clickFinish(1)">&nbsp完成制单</Button>
      </div>
      <div class="clear"></div>
    </div>
    <div>
      <br><br>
      <Row type="flex" justify="center">
        <Col span="10">
          <Form ref="checkData" :model="checkData" :rules="ruleInline" :label-width="100">
            <Col span="24">
              <FormItem label="检查项目" prop="checkItem">
                <Input v-model="checkData.checkItem" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="检查时间" prop="checkDate">
                <DatePicker
                  v-model="checkData.checkDate"
                  type="date"
                  class="width"
                  format="yyyy-MM-dd"
                  :transfer="true"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="检查人员" prop="checker">
                <Input v-model="checkData.checker" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="检查类型" prop="checkType">
                <Select v-model="checkData.checkType" class="width">
                  <Option value="定期检查">定期检查</Option>
                  <Option value="专项检查">专项检查</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="问题列表" prop="questionList">
                <Input v-model="checkData.questionList" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                       class="width" :maxlength="255"></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="建议" prop="usingSuggestion">
                <Input v-model="checkData.usingSuggestion" type="textarea" :autosize="{minRows: 3,maxRows:3}"
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
  import {newData} from '@/api/EquipmentSafety/regularSpecialInspection'
    export default {
        name: "newSpecialInspection",
      data(){
        return {
          time: '',
          author: getRealname(),
          checkData:{
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
            name: 'newMechanicalInspection'
          })
        },
        clickFinish(state){
          this.$refs.checkData.validate((valid)=>{
            if(valid){
              const  data={
                saveStatus:state,
                checkItem:this.checkData.checkItem,
                checkDate:this.checkData.checkDate,
                checker:this.checkData.checker,
                checkType:this.checkData.checkType,
                questionList:this.checkData.questionList,
                usingSuggestion:this.checkData.usingSuggestion,
              }
              newData(JSON.parse(localStorage.getItem("projectId")).id, data).then(res=>{
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
        getNowTime () {
          let date = new Date()
          let seperator1 = '-'
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let strDate = date.getDate()
          if (month >= 1 && month <= 9) {
            month = '0' + month
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate
          }
          this.time = year + seperator1 + month + seperator1 + strDate
        },
      },
      created() {
        this.getNowTime()
      }
    }
</script>

<style scoped>
  .width {
    width: 80%;
  }
</style>

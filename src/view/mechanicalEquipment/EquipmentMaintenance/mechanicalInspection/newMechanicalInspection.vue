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
        <Col span="18">
          <Form ref="testData" :model="testData" :rules="ruleInline" :label-width="100">
            <Col span="12">
              <FormItem label="设备名称" prop="name">
                <Input v-model="testData.name" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备型号" prop="model">
                <Input v-model="testData.model" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="设备功率" prop="power">
                <Input v-model="testData.power" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="检查时间" prop="checkDate">
                <DatePicker
                  v-model="testData.checkDate"
                  type="date"
                  class="width"
                  format="yyyy-MM-dd"
                  :transfer="true"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="检查人" prop="checker">
                <Input v-model="testData.checker" class="width" :maxlength="15"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="检查类型" prop="checkType">
                <Select v-model="testData.checkType" class="width">
                  <Option value="日常检查">日常检查</Option>
                  <Option value="定期检查">定期检查</Option>
                  <Option value="定向检查">定向检查</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="是否需要保养" prop="needMaintenance">
                <RadioGroup v-model="testData.needMaintenance">
                  <Radio label="true">是</Radio>
                  <Radio label="false">否</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="检查结果" prop="checkResult">
                <Input v-model="testData.checkResult" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                       class="width" :maxlength="255"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="使用建议" prop="usingSuggestion">
                <Input v-model="testData.usingSuggestion" type="textarea" :autosize="{minRows: 3,maxRows:3}"
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
  import {newData} from '@/api/EquipmentMaintenance/mechanicalInspection'
    export default {
        name: "newMechanicalInspection",
      data(){
          return {
            time: '',
            author: getRealname(),
            testData:{
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
            name: 'newMechanicalInspection'
          })
        },
        clickFinish(state){
          this.$refs.testData.validate((valid)=>{
             if(valid){
               const  data={
                 saveStatus:state,
                 name:this.testData.name,
                 model:this.testData.model,
                 power:this.testData.power,
                 checkDate:this.testData.checkDate,
                 checker:this.testData.checker,
                 checkType:this.testData.checkType,
                 needMaintenance:this.testData.needMaintenance,
                 checkResult:this.testData.checkResult,
                 usingSuggestion:this.testData.usingSuggestion,
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
                     this.$router.push({name: 'mechanicalInspection'});
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

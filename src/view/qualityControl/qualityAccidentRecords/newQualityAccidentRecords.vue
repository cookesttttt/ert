<template>
  <Card style="height: 100%;overflow-y: scroll">
    <Row type="flex">
      <Col span="24" >
        <Form style="margin-top: 50px" ref="newQualityAccidentRecordsData" :model="newQualityAccidentRecordsData"
              :rules="newQualityAccidentRecordsRules" :label-width="110">
          <Col span="10" offset="5">
            <FormItem label="事故记录名称" prop="accidentRecordName">
              <Input v-model="newQualityAccidentRecordsData.accidentRecordName" class="width" :maxlength="15"></Input>
            </FormItem>
            <FormItem label="发生日期" prop="occurrenceDate">
              <DatePicker v-model="newQualityAccidentRecordsData.occurrenceDate" type="date" class="width"
                          format='yyyy-MM-dd' :transfer="true"></DatePicker>
            </FormItem>
            <FormItem label="作为归档资料">
              <CheckboxGroup v-model="newQualityAccidentRecordsData.checkbox" @on-change="bindCheckBox">
                <Checkbox  label="true">是</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <Upload
              ref="upload"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              :show-upload-list="true"
              multiple
              action="">
              <Button icon="ios-cloud-upload-outline" style="width:35%">上传附件</Button>
            </Upload>
            <ul class="ulCss">
              <li class="liCss" v-if="fileList.length" v-for="(v,index) in fileList">
                  <span>
                <i class="ivu-icon ivu-icon-ios-image" v-if="(v.type).split('/')[0]==='image'"></i>
                  <i class="ivu-icon  ivu-icon-md-document" v-else-if="(v.type).split('/')[0]==='text'"></i>
                  <i class="ivu-icon ivu-icon-ios-stats" v-else-if="(v.type).split('/')[0]==='application'"></i>
                  <i class="ivu-icon ivu-icon-ios-document-outline"  v-else></i>
                    {{v.name}}
                  </span>
                <i class="ivu-icon ivu-icon-ios-close remove" @click="removeFileList(index)"></i>
              </li>
            </ul>
          </Col>
          <Col span="24">
            <Col span="14" offset="5">
              <FormItem label="事故内容" prop="accidentContent">
                <Input
                  v-model="newQualityAccidentRecordsData.accidentContent"
                  type="textarea"
                  :rows="5"
                  style="width: 90%"
                  :maxlength="20000"
                ></Input>
              </FormItem>
              <FormItem label="备注" prop="remarks">
                <Input
                  v-model="newQualityAccidentRecordsData.remarks"
                  type="textarea"
                  :rows="5"
                  style="width: 90%"
                  :maxlength="20000"
                ></Input>
              </FormItem>
            </Col>
          </Col>
          <Col span="24" style="text-align: center">
            <ButtonGroup :size="buttonSize">
              <Button class="search-btn" @click="close">&nbsp取消</Button>
              <Button class="search-btn" type="primary" @click="clickSave">&nbsp保存</Button>
            </ButtonGroup>
          </Col>
        </Form>
      </Col>
    </Row>
  </Card>
</template>

<script>
  import {Loading} from 'element-ui';
  import { isDataSuccess, formatTimeSprit, getToken} from '@/libs/util'
  import {newData} from '@/api/qualityControl/qualityAccidentRecords'
  import {mapMutations} from 'vuex' // 关闭页面
  import '../newAndEditor.less'

  export default {
    name: "newQualityAccidentRecords",
    data() {
      return {
        newQualityAccidentRecordsData:{
          accidentRecordName:'',
          occurrenceDate:'',
          checkbox:['true'],
          accidentContent:'',
          remarks:'',
        },
        loading: '',
        headers: {Authorization: 'Bearer ' + getToken()},
        fileList: [],
        newQualityAccidentRecordsRules: {
          accidentRecordName: [
            {
              required: true,
              message: '请填写事故记录名称',
              trigger: 'blur'
            }
          ],
          occurrenceDate: [
            {required: true,
              type: 'date',
              message: '请选择发生日期',
              trigger: 'change'}
          ],
          accidentContent: [
            {
              required: true,
              message: '请填写事故内容',
              trigger: 'blur'
            }
          ],
        },
        buttonSize: 'large', // 按钮大小
      }
    },
    methods:{
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: '新建质量事故记录'
        })
      },
      bindCheckBox(value){
        this.newQualityAccidentRecordsData.checkbox=[];
         if(value.length!==0){
           this.newQualityAccidentRecordsData.checkbox.push(value[1]);
         }else {
           this.newQualityAccidentRecordsData.checkbox.push('false');
         }


      },
      clickSave() {
        this.$refs.newQualityAccidentRecordsData.validate((v) => {
          if(v){
            let fd1 = new FormData()
            fd1.append("name", this.newQualityAccidentRecordsData.accidentRecordName)
            fd1.append("projectId", JSON.parse(localStorage.getItem('projectId')).id)
            fd1.append("happenDate", formatTimeSprit(this.newQualityAccidentRecordsData.occurrenceDate))
            fd1.append("asFillingDoc", (this.newQualityAccidentRecordsData.checkbox).toString())
            fd1.append("content", this.newQualityAccidentRecordsData.accidentContent)
            fd1.append("remark", this.newQualityAccidentRecordsData.remarks)
            for (let i = 0; i < this.fileList.length; i++) {
              fd1.append("files", this.fileList[i])
            }
            console.log(fd1)
            let color = 'rgba(0,0,0,0.7)'
            let options = {
              lock: true,
              spinner: 'el-icon-loading',
              background: color
            }
            this.loading = Loading.service(options);
            newData(fd1).then(res => {
              const data = res.data
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.loading.close()
                  this.$Message.error('服务器繁忙请稍后')
                  break;
                case 2:
                  this.loading.close()
                  this.$Message.error(data.msgContent)
                  break;
                default:
                  setTimeout(() => {
                    this.loading.close()
                    this.$Message.success(data.msgContent)
                    this.close()
                    this.$router.push({path: '/qualityControl/qualityAccidentRecords'})
                  }, 1000);
                  break
              }
            })

          }
        })
      },
      removeFileList(i) {
        console.log(i)
        this.fileList.splice(i, 1)
      },
      handleBeforeUpload(file) {
        console.log(file)
        this.fileList.push(file)
        return false
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
        this.newQualityAccidentRecordsData.occurrenceDate = year + seperator1 + month + seperator1 + strDate
      },
    },
    created() {
      this.getNowTime()
    }
  }
</script>

<style scoped>

</style>

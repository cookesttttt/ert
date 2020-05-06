<template>
  <Card style="height: 100%;overflow-y: scroll">
    <Row type="flex">
      <Col span="24" style="margin-top: 50px">
        <Form ref="editQualityInspectionRecordsData" :model="editQualityInspectionRecordsData"
              :rules="editQualityInspectionRecordsRules" :label-width="110">
          <Col span="10" offset="5">
            <FormItem label="检查记录名称" prop="inspectionRecordName">
              <Input v-model="editQualityInspectionRecordsData.inspectionRecordName" class="width"
                     :maxlength="15"></Input>
            </FormItem>
            <FormItem label="发生日期" prop="occurrenceDate">
              <DatePicker v-model="editQualityInspectionRecordsData.occurrenceDate" type="date" class="width"
                          format='yyyy-MM-dd' :transfer="true"></DatePicker>
            </FormItem>
            <FormItem label="作为归档资料">
              <CheckboxGroup v-model="editQualityInspectionRecordsData.checkbox" @on-change="bindCheckBox">
                <Checkbox label="true">是</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Col>
          <Col span="8">
            <Upload
              ref="editUpload"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              :show-upload-list="true"
              multiple
              action="">
              <Button icon="ios-cloud-upload-outline" style="width:35%">上传附件</Button>
            </Upload>
            <ul class="ulCss">
              <li class="liCss" v-if="editFileList.length" v-for="(v,index) in editFileList">
                  <span>
               <i class="ivu-icon ivu-icon-ios-image" v-if="(v.type).split('/')[0]==='image'"></i>
                  <i class="ivu-icon  ivu-icon-md-document" v-else-if="(v.type).split('/')[0]==='text'"></i>
                  <i class="ivu-icon ivu-icon-ios-stats" v-else-if="(v.type).split('/')[0]==='application'"></i>
                  <i class="ivu-icon ivu-icon-ios-document-outline" v-else></i>
                    {{v.name}}
                  </span>
                <i class="ivu-icon ivu-icon-ios-close remove" @click="removeFileList(index,v)"></i>
              </li>
            </ul>
          </Col>
          <Col span="24">
            <Col span="14" offset="5">
              <FormItem label="检查记录内容" prop="inspectionRecords">
                <Input
                  v-model="editQualityInspectionRecordsData.inspectionRecords"
                  type="textarea"
                  :rows="5"
                  style="width: 90%"
                  :maxlength="20000"
                ></Input>
              </FormItem>
              <FormItem label="备注" prop="remarks">
                <Input
                  v-model="editQualityInspectionRecordsData.remarks"
                  type="textarea"
                  :rows="5"
                  style="width: 90%"
                  :maxlength="20000"
                ></Input>
              </FormItem>
            </Col>
          </Col>
        </Form>
      </Col>
    </Row>
    <Col span="24" style="text-align: center">
      <ButtonGroup :size="buttonSize">
        <Button class="search-btn" @click="editClose">&nbsp取消</Button>
        <Button class="search-btn" type="primary" @click="clickEditSave">&nbsp保存</Button>
      </ButtonGroup>
    </Col>
  </Card>
</template>

<script>
  import {Loading} from 'element-ui';
  import {isDataSuccess, formatTimeSprit, getToken} from '@/libs/util'
  import {deleteAttachments, getDetails, editData} from '@/api/qualityControl/qualityInspectionRecords'
  import {mapMutations} from 'vuex' // 关闭页面
  import '../newAndEditor.less'
  export default {
    name: "editQualityInspectionRecords",
    data() {
      return {
        loading: '',
        headers: {Authorization: 'Bearer ' + getToken()},
        editFileList: [],
        pictureData: [],
        buttonSize: 'large', // 按钮大小
        editQualityInspectionRecordsData: {
          projectId: '',
          id: '',
          inspectionRecordName: '',
          occurrenceDate: '',
          checkbox: [],
          inspectionRecords: '',
          remarks: '',
        },
        editQualityInspectionRecordsRules: {
          inspectionRecordName: [
            {
              required: true,
              message: '请填写检查记录名称',
              trigger: 'blur'
            }
          ],
          occurrenceDate: [
            {
              required: true,
              type: 'date',
              message: '请选择发生日期',
              trigger: 'change'
            }
          ],
          inspectionRecords: [
            {
              required: true,
              message: '请填写检查记录内容',
              trigger: 'blur'
            }
          ],
        },
      }
    },
    methods: {
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      editClose() {
        this.closeTag({
          name: '编辑质量检查记录',
          query: {
            id: this.$route.query.id
          }
        })
      },
      bindCheckBox(value){
        this.editQualityInspectionRecordsData.checkbox=[];
        if(value.length!==0){
          this.editQualityInspectionRecordsData.checkbox.push(value[1]);
        }else {
          this.editQualityInspectionRecordsData.checkbox.push('false');
        }
        console.log(value)
      },
      clickEditSave() {
        this.$refs.editQualityInspectionRecordsData.validate((v) => {
          if (v) {
            let fd = new FormData()
            fd.append("id", this.editQualityInspectionRecordsData.id)
            fd.append("projectId", this.editQualityInspectionRecordsData.projectId)
            fd.append("name", this.editQualityInspectionRecordsData.inspectionRecordName)
            fd.append("happenDate", formatTimeSprit(this.editQualityInspectionRecordsData.occurrenceDate))
            fd.append("asFillingDoc", (this.editQualityInspectionRecordsData.checkbox).toString())
            fd.append("content", this.editQualityInspectionRecordsData.inspectionRecords)
            fd.append("remark", this.editQualityInspectionRecordsData.remarks)
            for (let i = 0; i < this.editFileList.length; i++) {
              if(!this.editFileList[i].id){
                fd.append("files", this.editFileList[i])
              }
            }
            console.log(fd)
            let color = 'rgba(0,0,0,0.7)'
            let options = {
              lock: true,
              spinner: 'el-icon-loading',
              background: color
            }
            this.loading = Loading.service(options);
            editData(fd).then(res => {
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
                    this.editClose()
                    this.$router.push({path: '/qualityControl/qualityInspectionRecords'})
                  }, 1000)

                  break
              }
            })


          }
        })
      },
      removeFileList(i,v) {
        if(v.id){
          this.editFileList.splice(i, 1)
          this.deleteAttachment(v,false)
        }else {
          this.editFileList.splice(i, 1)
        }
      },
      //删除图片
      deleteAttachment(row,isCont) {
        deleteAttachments(row.id).then(res => {
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
              if (isCont){
                this.$Message.success(data.msgContent)
              }
              break
          }
        })
      },
      handleBeforeUpload(file) {
        console.log(file)
        this.editFileList.push(file)
        return false
      },
      // 数据回显
      editEcho(id) {
        this.editFileList=[]
        this.editQualityInspectionRecordsData.checkbox = []
        getDetails(id).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.editQualityInspectionRecordsData.id = data.msgData.id
              this.editQualityInspectionRecordsData.projectId = data.msgData.projectId
              this.editQualityInspectionRecordsData.inspectionRecordName = data.msgData.name
              this.editQualityInspectionRecordsData.occurrenceDate = new Date(data.msgData.happenDate)
              this.editQualityInspectionRecordsData.checkbox.push((data.msgData.asFillingDoc).toString())
              this.editQualityInspectionRecordsData.inspectionRecords = data.msgData.content
              this.editQualityInspectionRecordsData.remarks = data.msgData.remark
              this.pictureData = data.msgData.attachmentVoList
              this.pictureData.forEach(v=>{
                this.editFileList.push(v)
              })
              console.log(data)
              console.log(this.editQualityInspectionRecordsData)
            } else {
              this.$Message.error(data.msgContent)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        })
      }
    },
    created() {
      console.log(this.$route.query.id)
      this.editEcho(this.$route.query.id)
    },
    watch: {
      '$route': {
        handler: function (to, from) {
          console.log(this.$route.query.id)
          console.log(to)
          if (to.name === '编辑质量检查记录') {
            this.editEcho(this.$route.query.id)
          }
        },
      }
    },
  }
</script>

<style scoped>

</style>

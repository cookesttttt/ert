<template>
  <Card style="height: 100%;overflow-y: scroll">
    <Row type="flex">
      <Col span="24">
        <Form ref="editQualityServicesData" style="margin-top: 50px" :model="editQualityServicesData" :rules="editQualityServicesRules"
              :label-width="110">
          <Col span="10" offset="5">
            <FormItem label="事务名称" prop="transactionName">
              <Input v-model="editQualityServicesData.transactionName" class="width" :maxlength="15"></Input>
            </FormItem>
            <FormItem label="发生日期" prop="occurrenceDate">
              <DatePicker v-model="editQualityServicesData.occurrenceDate" type="date" class="width"
                          format='yyyy-MM-dd' :transfer="true"></DatePicker>
            </FormItem>
            <FormItem label="作为归档资料">
              <CheckboxGroup v-model="editQualityServicesData.checkbox" @on-change="bindCheckBox">
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
                  <i class="ivu-icon ivu-icon-ios-document-outline"  v-else></i>
                    {{v.name}}
                  </span>
                <i class="ivu-icon ivu-icon-ios-close remove" @click="removeFileList(index,v)"></i>
              </li>
            </ul>
          </Col>
          <Col span="24">
            <Col span="14" offset="5">
              <FormItem label="事务内容" prop="serviceContent">
                <Input
                  v-model="editQualityServicesData.serviceContent"
                  type="textarea"
                  :rows="5"
                  :maxlength="20000"
                  style="width: 90%"
                ></Input>
              </FormItem>
              <FormItem label="备注" prop="remarks">
                <Input
                  v-model="editQualityServicesData.remarks"
                  type="textarea"
                  :rows="5"
                  :maxlength="20000"
                  style="width: 90%"
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
  import { isDataSuccess, formatTimeSprit, getToken} from '@/libs/util'
  import {deleteAttachments,getDetails,editData} from '@/api/qualityControl/qualityServices'
  import {mapMutations} from 'vuex' // 关闭页面
  import '../newAndEditor.less'
  export default {
    name: "editQualityServices",
    data() {
      return {
        loading: '',
        headers: {Authorization: 'Bearer ' + getToken()},
        editFileList: [],
        pictureData:[],
        buttonSize: 'large', // 按钮大小
        editQualityServicesData:{
          transactionName:'',
          projectId:'',
          id:'',
          occurrenceDate:'',
          checkbox:[],
          serviceContent:'',
          remarks:'',
        },
        showImg: false,
        imgSrc: '',
        editQualityServicesRules: {
          transactionName: [
            {
              required: true,
              message: '请填写事务名称',
              trigger: 'blur'
            }
          ],
          occurrenceDate: [
            {required: true,
              type: 'date',
              message: '请选择发生日期',
              trigger: 'change'}
          ],
          serviceContent: [
            {
              required: true,
              message: '请填写事务内容',
              trigger: 'blur'
            }
          ],
        },
      }
    },
    methods:{
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      editClose() {
        this.closeTag({
          name: '编辑质量事务',
          query: {
            id:this.$route.query.id
          }
        })
      },
      bindCheckBox(value){
        this.editQualityServicesData.checkbox=[];
        if(value.length!==0){
          this.editQualityServicesData.checkbox.push(value[1]);
        }else {
          this.editQualityServicesData.checkbox.push('false');
        }
      },
      clickEditSave() {
        this.$refs.editQualityServicesData.validate((v) => {
          if(v){
            let fd = new FormData()
            fd.append("id", this.editQualityServicesData.id)
            fd.append("projectId", this.editQualityServicesData.projectId)
            fd.append("name", this.editQualityServicesData.transactionName)
            fd.append("happenDate",  formatTimeSprit(this.editQualityServicesData.occurrenceDate))
            fd.append("asFillingDoc", (this.editQualityServicesData.checkbox).toString())
            fd.append("content", this.editQualityServicesData.serviceContent)
            fd.append("remark", this.editQualityServicesData.remarks)
            for (let i = 0; i < this.editFileList.length; i++) {
              if(!this.editFileList[i].id){
                fd.append("files", this.editFileList[i])
              }

            }
            let color = 'rgba(0,0,0,0.7)'
            let options = {
              lock: true,
              spinner: 'el-icon-loading',
              background: color
            }
            this.loading = Loading.service(options);
            console.log(fd)
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
                  setTimeout(()=>{
                    this.loading.close()
                    this.$Message.success(data.msgContent)
                    this.editClose()
                    this.$router.push({path: '/qualityControl/qualityServices'})
                  },1000)
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
          this.pictureData.splice(i, 1)
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
        this.editQualityServicesData.checkbox=[]
        this.editFileList=[]
        getDetails(id).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.editQualityServicesData.id=data.msgData.id
              this.editQualityServicesData.projectId=data.msgData.projectId
              this.editQualityServicesData.transactionName=data.msgData.name
              this.editQualityServicesData.occurrenceDate=new Date(data.msgData.happenDate)
              this.editQualityServicesData.checkbox.push((data.msgData.asFillingDoc).toString())
              this.editQualityServicesData.serviceContent=data.msgData.content
              this.editQualityServicesData.remarks=data.msgData.remark
              this.pictureData=data.msgData.attachmentVoList
              this.pictureData.forEach(v=>{
                this.editFileList.push(v)
              })
              console.log(data)
              console.log(this.editQualityServicesData)
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
      '$route':{
        handler: function (to,from) {
          console.log(this.$route.query.id)
          console.log(to)
          if(to.name==='编辑质量事务'){
            this.editEcho(this.$route.query.id)
          }
        },
      }
    },
  }
</script>

<style scoped>

</style>

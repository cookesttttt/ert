<template>
  <Card style="height: 100%;overflow-y: scroll">
    <Row type="flex">
      <Col span="24">
        <Form  ref="newQualityCodeData1" :model="newQualityCodeData" :rules="newQualityCodeRules" :label-width="110"  style="margin-top: 50px">
          <Col span="10" offset="5">
            <FormItem label="规范类别">
              <Input v-model="newQualityCodeData.qualityCategoryName" class="width"  disabled></Input>
            </FormItem>
              <FormItem label="规范名称" prop="specificationName">
                <Input v-model="newQualityCodeData.specificationName" class="width" :maxlength="15"></Input>
              </FormItem>
              <FormItem label="发布单位" prop="publicationUnit">
                <Input v-model="newQualityCodeData.publicationUnit" class="width" :maxlength="15"></Input>
              </FormItem>
              <FormItem label="发布人" prop="issuer">
                <Input v-model="newQualityCodeData.issuer" class="width" :maxlength="15"></Input>
              </FormItem>
          </Col>
          <Col span="8">
            <Upload
              ref="upload"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              :show-upload-list="true"
              action=""
              multiple
            >
              <Button icon="ios-cloud-upload-outline" style="width:35%">上传附件</Button>
            </Upload>
            <ul class="ulCss">
              <li class="liCss" v-if="fileList.length" v-for="(v,index) in fileList" span="24">
                  <span>
                  <i class="ivu-icon ivu-icon-ios-image" v-if="(v.type).split('/')[0]==='image'"></i>
                  <i class="ivu-icon  ivu-icon-md-document" v-else-if="(v.type).split('/')[0]==='text'"></i>
                  <i class="ivu-icon ivu-icon-ios-stats" v-else-if="(v.type).split('/')[0]==='application'"></i>
                  <i class="ivu-icon ivu-icon-ios-document-outline" v-else></i>
                    {{v.name}}
                  </span>
                <i class="ivu-icon ivu-icon-ios-close remove" @click="removeFileList(index)"></i>
              </li>
            </ul>
          </Col>
          <Col span="24">
              <Col span="14" offset="5">
                <FormItem label="备注" prop="remarks">
                  <Input
                    v-model="newQualityCodeData.remarks"
                    type="textarea"
                    :rows="5"
                    :maxlength="20000"
                    style="width:90%"
                  ></Input>
                </FormItem>
              </Col>
          </Col>
        </Form>
      </Col>
      <Col span="24" style="text-align: center">
        <ButtonGroup :size="buttonSize">
          <Button class="search-btn" @click="close">&nbsp取消</Button>
          <Button class="search-btn" type="primary" @click="uploadFiles">&nbsp保存</Button>
        </ButtonGroup>
      </Col>
    </Row>
  </Card>
</template>

<script>
  import {Loading} from 'element-ui';
  import { isDataSuccess, getToken,getRealname} from '@/libs/util'
  import { newData } from '@/api/qualityControl/qualityspecification'
  import {mapMutations} from 'vuex' // 关闭页面
  import '../newAndEditor.less'
  export default {
    name: "newQualityCode",
    data() {
      return {
        loading: '',
        headers: {Authorization: 'Bearer ' + getToken()},
        fileList: [],
        newQualityCodeData: {
          qualityCategoryName:JSON.parse(sessionStorage.getItem('qualityCategoryName'))[0].title,
          specificationName: '',
          publicationUnit: '',
          issuer: getRealname(),
          remarks: '',
        },
        newSpecificationData:{},
        newQualityCodeRules: {
          specificationName: [
            {
              required: true,
              message: '请填写规范名称',
              trigger: 'blur'
            }
          ],
          publicationUnit: [
            {
              required: true,
              message: '请填写发布单位',
              trigger: 'blur'
            }
          ],
          issuer: [
            {
              required: true,
              message: '请填写发布人',
              trigger: 'blur'
            }
          ],
        },
        buttonSize: 'large', // 按钮大小
      }
    },
    methods: {
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: '新建质量规范'
        })
      },
      //上传方法
      uploadFiles() {
        this.$refs.newQualityCodeData1.validate((v) => {
          if(v){
            let fd = new FormData()
            fd.append("name", this.newQualityCodeData.specificationName)
            fd.append("categoryId", JSON.parse(sessionStorage.getItem('qualityCategoryId')))
            fd.append("projectId", JSON.parse(localStorage.getItem('projectId')).id)
            fd.append("publicationPerson", this.newQualityCodeData.issuer)
            fd.append("publicationUnit", this.newQualityCodeData.publicationUnit)
            fd.append("remark", this.newQualityCodeData.remarks)
            for (let i = 0; i < this.fileList.length; i++) {
              fd.append("files", this.fileList[i])
            }
            console.log(fd)
            let color = 'rgba(0,0,0,0.7)'
            let options = {
              lock: true,
              spinner: 'el-icon-loading',
              background: color
            }
            this.loading = Loading.service(options);
            newData(fd).then(res => {
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
                    this.close()
                    this.$router.push({path: '/qualityControl/qualityspecification'})
                  },1000)
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
    },
    created(){
      console.log(JSON.parse(sessionStorage.getItem('qualityCategoryId')))
      console.log(JSON.parse(sessionStorage.getItem('qualityCategoryName')))
    },
  }
</script>

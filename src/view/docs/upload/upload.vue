<template>
   <Card style="height: 100%">
     <br><br>
     <Row type="flex" justify="center" class="top50">
       <Col span="18">
         <Col span="24">
           <Form :label-width="100">

           </Form>
         </Col>
         <Col span="24">
            <Form ref="fileInfo" :model="fileInfo" :rules="rules" :label-width="100">
              <Col span="12">
                <FormItem label="文件名称：">
                  <Col span="16">
                    <Input v-model="fileName"  type="text" disabled id="inputCss"></Input>
                  </Col>
                  <Col span="4">
                    <Upload
                      ref="upload"
                      style="display: inline-block;"
                      :show-upload-list="false"
                      :before-upload="handleUpload"
                      :on-success="succeeded"
                      :on-error="uploadFailure"
                      :data="uploadData"
                      :headers="headers"
                      :action="`${baseUrl}/docs/file/info`">
                      <Button class="search-btn" style="border-radius:0 4px 4px 0;">&nbsp;&nbsp;浏览&nbsp;</Button>
                    </Upload>
                  </Col>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="文件编号：" prop="fileNumber">
                  <Input v-model="fileInfo.fileNumber" style="width: 80%" type="text" :maxlength="15"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="发文单位/部门：">
                  <Input v-model="fileInfo.reportDepartment" style="width: 80%" type="text" :maxlength="15"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="发文人姓名：">
                  <Input v-model="fileInfo.reporterName" style="width: 80%" type="text" :maxlength="15"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="发文人日期：">
                  <DatePicker type="date" style="width: 80%" v-model="fileInfo.reportDate" :editable="false"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="收文人姓名：">
                  <Input v-model="fileInfo.receiverName" style="width: 80%" type="text" :maxlength="15"></Input>
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="描述：">
                  <Input v-model="fileInfo.remark" type="textarea" :rows="3"  style="width: 91%" :maxlength="500"></Input>
                </FormItem>
              </Col>
            </Form>
           <Col span="24" class="center">
             <br><br>
             <ButtonGroup :size="buttonSize" >
               <Button type="primary" @click="clickSave" class="button_sty">保存</Button>
               <Button  @click="close" class="button_sty">取消</Button>
             </ButtonGroup>
           </Col>
         </Col>
       </Col>
     </Row>
   </Card>
</template>
<script>
import {getToken,formatTime} from '@/libs/util'
import axios from '@/libs/api.request'
import {uploadFileInfo} from '@/api/docs/file'  //上传参数
import {mapMutations} from 'vuex'   //保存成功后关闭
import { Loading } from 'element-ui';
export default {
  name: 'upload',
  data() {
    return {
        headers: {
          Authorization:'Bearer ' + getToken()
        },
        baseUrl: axios.baseUrl,
      rules: {
        fileNumber: [{required: true, message: '请填写文件编号', trigger: 'blur'}]
      },
      file: 'null',          //文件
      session: 'Bearer ' + getToken(),  //上传Token
      fileName:'',
      uploadData:{
        dirId:sessionStorage.getItem('dirId'),
        fileNumber:'',
        name: '',          //文件名
        receiverName: '',       // 收文人姓名
        reportDepartment: '',  //发文单位/部门
        reporterName: '',      //发文人姓名
        reportDate: '',       //发文人日期
        remark: '',           //描述
        projectId:JSON.parse(localStorage.getItem('projectId')).id
      },
      buttonSize: 'large',  //按钮大小
      fileInfo: {
        fileNumber:'',
        reportDepartment:'',
        reporterName:'',
        receiverName:'',
        reportDate:'',
        remark:'',
      },
      loading:''
    }
  },
  methods: {
    //  关闭页面的方法
    ...mapMutations([
      'closeTag'
    ]),
    close() {
      this.closeTag({
        name: '文件上传'
      })
    },
    clickSave() {
      if (this.fileName!=='') {
        //判断文件与文件编号是否为空
        if (this.fileInfo.fileNumber) {
          this.uploadData.fileNumber=this.fileInfo.fileNumber
          this.uploadData.name=this.fileName
          this.uploadData.receiverName=this.fileInfo.receiverName
          this.uploadData.reportDepartment=this.fileInfo.reportDepartment
          this.uploadData.reporterName=this.fileInfo.reporterName
          if( this.fileInfo.reportDate){
            this.uploadData.reportDate = formatTime(this.fileInfo.reportDate)
          }
          this.uploadData.remark=this.fileInfo.remark
          let color='rgba(0,0,0,0.7)'
         let options={
            lock: true,
            spinner: 'el-icon-loading',
            background: color
          }
           this.loading=Loading.service(options);
            this.$refs.upload.post(this.file);

        } else {
          this.$Message.error('上传失败请填写文件编号')
        }
      } else {
        this.$Message.error('上传失败请选择上传文件')
      }
    },
      succeeded(res) {
        this.loading.close();
       console.log(res)
        if(res.msgCode===0){
          this.close()
          this.$router.push({path: '/doc/Myshare'})
          // this.$router.push({
          //   // path: '/doc/Myshare',
          //   name: '文档中心',
          //   params:{
          //     name:'abc',
          //     tree_odeId:res.msgData
          //   }})
          this.$Message.success('文件上传成功')
        }else {
          this.$Message.error(res.msgContent)
        }
          this.file=null
          this.fileName = ''
      },
      //图片上传失败后的回调
      uploadFailure(error, files) {
        this.loading.close();
        this.$Message.error('文件上传失败')
          console.log(error)
          console.log(files)
      },
      //再次点击上传之前
      handleUpload(files) {
        console.log(files)
        console.log(files.name)
          this.file=files
        this.fileName=files.name
          return false;
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
      this.fileInfo.reportDate = year + seperator1 + month + seperator1 + strDate
      console.log(this.fileInfo.reportDate)
    },
  },
  mounted() {
    console.log($('.ivu-upload .ivu-upload-select').css('width','100%'))
    this.getNowTime()
  }
}
</script>
<style src="./index.css" scoped></style>


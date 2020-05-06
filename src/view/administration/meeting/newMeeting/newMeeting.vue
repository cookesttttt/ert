<template>
  <Card style="height: 100%;overflow-y: scroll">
    <Row type="flex">
      <Col span="18" offset="1">
        <Form
          ref="newMeetingData"
          :model="newMeetingData"
          :rules="rules"
          :label-width="100">
          <br/>
          <Col span="12">
            <FormItem label="会议类别:" prop="categoryId">
              <Select v-model="newMeetingData.categoryId" class="width350"  :transfer="true" @on-change="selectVal">
                <Option   value=新建会议类别 @click.native="isAddModal=true" style="background-color: #2d8cf0;color: white">新建会议类别 <span class="ivu-icon ivu-icon-ios-add" style="font-size: 15px;float: right; "></span>
                </Option>
                <Option v-for="item in category" :value="item.id.toString()" :key="item.id">
                  {{ item.name }}
                  <div  style="float: right;font-size: 15px;color: red" class="ivu-icon ivu-icon-ios-close"  @click.prevent="bb(item.id)"></div>
                  <div style="clear: both"></div>
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="会议日期:" prop="meetingDate">
              <DatePicker
                class="width350"
                v-model="newMeetingData.meetingDate"
                type="date"
                :transfer="true"
                format="yyyy-MM-dd"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="会议名称:" prop="name">
              <Input v-model="newMeetingData.name" type="text" class="width350"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="会议地点:">
              <Input v-model="newMeetingData.meetingPlace" class="width350" type="text"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="会议天气:">
              <Input v-model="newMeetingData.weather" class="width350" type="text"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="会议主持人:">
              <Input v-model="newMeetingData.emcee" class="width350" type="text"></Input>
            </FormItem>
          </Col>

        </Form>

        <Modal
          title="新建会议类别"
          v-model="isAddModal"
          :mask-closable="false">
          <Form ref="addMeetingData"
                :model="addMeetingData"
                :label-width="100"
                inline
                :rules="rules">
            <FormItem label="会议类别名称" prop="categoryName">
              <Input v-model="addMeetingData.categoryName" style="width:350px" :maxlength="15"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel(1)">取消</Button>
            <Button type="primary" size="large" @click="addMeetingCategory">保存</Button>
          </div>
        </Modal>
      </Col>
      <Col span="4">
        <br>
        <Col span="24">
          <Form :label-width="100">
            <Upload
              ref="upload"
              :headers="headers"
              :before-upload="handleBeforeUpload"
              :show-upload-list="true"
              :on-success="succeeded"
              name="files"
              :on-remove="removeImgs"
              :on-error="uploadFailure"
              multiple
              :action="`${baseUrl}/pcm/meeting/record/attachments`">
              <Button icon="ios-cloud-upload-outline" style="width:150px">上传会议签到表</Button>
            </Upload>
          </Form>
        </Col>
      </Col>
      <Col span="1"></Col>
      <Col span="23" offset="1">
        <Form :label-width="100">
          <Col span="24">
            <br>
            <FormItem label="会议内容:" style="height: 240px">
              <editor :catchData="content" :content="description"></editor>
            </FormItem>
          </Col>
        </Form>
      </Col>
    </Row>
    <Col span="24" style="text-align: center">
      <ButtonGroup :size="buttonSize">
        <Button class="search-btn" @click="close">&nbsp取消</Button>
        <Button class="search-btn" type="primary" @click="addMeeting">&nbsp保存</Button>
      </ButtonGroup>
    </Col>
  </Card>
</template>

<script>
  import {getToken, formatTime, isDataSuccess} from '@/libs/util' // 获取token
  import {mapMutations} from 'vuex' // 关闭页面
  import editor from './wangEditor' // 富文本实例
  import {getAllCategory,  addCategory, deletedCategory,} from '@/api/meeting/meetingCategory' // 会议类别
  import {uploadMeeting, deleteImgData} from '@/api/meeting/meetingRecord' // 上传
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'

  export default {
    name: 'newMeeting',
    components: {
      editor,
      bigImg
    },
    data() {
      return {
      isAddModal: false,    //新建弹框
          addMeetingData: {     //新建数据
              categoryName: "",
          },
        uploadList: [], // 存储会议签到表的地址
        baseUrl: axios.baseUrl,
        headers: {Authorization: 'Bearer ' + getToken()},
        newMeetingData: {
          attachmentIds: [],
          categoryId: '', // 会议类别
          name: '', // 会议名称
          meetingDate: '', // 会议日期
          meetingPlace: '', // 会议地址
          weather: '', // 天气
          emcee: '', // 会议主持人
          meetingContent: '', // 会议内容
          projectId: JSON.parse(localStorage.getItem('projectId')).id
        },
  /*      uploadData:{
          categoryId: '', // 会议类别
          name: '', // 会议名称
          meetingDate: '', // 会议日期
          meetingPlace: '', // 会议地址
          weather: '', // 天气
          emcee: '', // 会议主持人
          meetingContent: '', // 会议内容
          projectId: JSON.parse(localStorage.getItem('projectId')).id
        },*/
        description: '请编辑',
        category: [], // 会议类别
        buttonSize: 'large', // 按钮大小
        rules: {
          categoryId: [
            // 会议类别验证
            {
              required: true,
              message: '请选择会议类别',
              trigger: 'change',
            }
          ],
          name: [
            {
              required: true, // 会议名称验证
              message: '请填写会议名称',
              trigger: 'blur'
            }
          ],
          meetingDate: [
            {
              required: true,
              message: '请填写会议日期', // 会议日期验证
              trigger: 'blur',
              type: 'date'
            }
          ],
            categoryName: [{
                required: true,
                message: '请填写会议名称',
                trigger: 'blur'
            }],
        }
      }
    },
    methods: {
        bb(id){
          const itemId=id
          console.log(itemId)
          this.$Modal.confirm({
            title: '删除会议类别',
            content: '<p>你确定要删除吗?</p>',
            onOk: () => {
              this.deletedMeetingCategory(itemId)
            },
          });
        },
        selectVal(val){
         if(val==='新建会议类别'){
             console.log('1')
           // this.getCategory()
           // console.log(this.category)

           this.newMeetingData.categoryId=''
         }
        },
      /*  ssVal(val){
            if(val==='新建会议类别'){
                console.log('2')
                // this.newMeetingData.categoryId=''
            }
        },*/
        //关闭弹框并清空
        cancel(status) {
            if (status === 1) {
                this.isAddModal = false
                this.$refs.addMeetingData.resetFields();
            }else {

            }
        },
        //删除会议类别
        deletedMeetingCategory(id) {
            console.log(id)
            deletedCategory(id).then(res => {
                if(res.status===200){
                    const data = res.data
                    if (data.msgCode === 0) {
                        this.getCategory()
                        this.$Message.success(data.msgContent);
                    } else {
                        this.$Message.error(data.msgContent)
                    }
                }else {
                    this.$Message.error("服务器繁忙请稍后")
                }
            })
        },
        //新增会议类别
        addMeetingCategory() {
            this.$refs.addMeetingData.validate((valid) => {
                if (valid) {
                    addCategory(this.addMeetingData.categoryName,JSON.parse(localStorage.getItem("projectId")).id).then(res => {
                        if(res.status===200){
                            const data = res.data
                            if (data.msgCode === 0) {
                                this.$Message.success(data.msgContent);
                               this.cancel(1)
                               this.isAddModal = false
                               this.getCategory(1)
                            } else {
                                this.$Message.error(data.msgContent)
                            }
                        }else {
                            this.$Message.error("服务器繁忙请稍后")
                        }
                    })
                }
            })
        },
      //删除图片
      deleteImg(id) {
        deleteImgData(id).then(res => {
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
              break
          }
        })
      },
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: '新建会议记录'
        })
      },
      // 在这里接受子组件传过来的参数，赋值给会议内容
      content(value) {
        this.newMeetingData.meetingContent = value
      },
      //  上传文件之前的钩子
      handleBeforeUpload(file) {
          console.log(file)
        this.uploadList.push(file)
      },
      //图片上传成功后的回调
      succeeded(res, files) {
        console.log(res)
      },
      removeImgs(file){
        this.deleteImg(file.response.msgData[0].id)
      },
      //图片上传失败后的回调
      uploadFailure(error, files) {
        console.log(error)
        console.log(files)
      },
      // 点击保存
      addMeeting() {
        const imgDataId = []
        this.$refs.upload.fileList.forEach(v=>{
            console.log(v.response.msgData)
          v.response.msgData.forEach(j=>{
            imgDataId.push(j.id)
             console.log(j.id)
          })
        })
        console.log(imgDataId)
        this.$refs.newMeetingData.validate(valid => {
          if (valid) {
            if (imgDataId.length !== 0) {
              console.log(this.newMeetingData.meetingDate)
              this.newMeetingData.meetingDate = formatTime(this.newMeetingData.meetingDate)
              this.newMeetingData.attachmentIds = imgDataId
              const loading = this.$loading({
                lock: true,
                spinner: 'el-icon-loading',
                background: 'rgba(0,0,0,0.7)'
              })
              uploadMeeting(this.newMeetingData).then(res => {
                if (res.status === 200) {
                  const data = res.data
                  if (data.msgCode === 0) {
                    setTimeout(() => {
                      loading.close()
                      this.$Message.success(data.msgContent)
                      this.close()
                      this.$router.push({path: '/administration/recordManagement'})
                    }, 1000);
                  } else {
                    setTimeout(() => {
                      loading.close()
                      this.newMeetingData.meetingDate = new Date(this.newMeetingData.meetingDate)
                      this.$Message.error(data.msgContent)
                    }, 1000);
                  }
                } else {
                  setTimeout(() => {
                    loading.close()
                    this.$Message.error('服务器繁忙请稍后')
                  }, 1000);
                }
              })
            } else {
              this.$Message.error('请上传会议签到表')
            }
          } else {
            this.$Message.error('请填写会议信息')
          }
        })
      },
      //  获取类别
      getCategory(val) {
          if(val===1){
            getAllCategory(JSON.parse(localStorage.getItem('projectId')).id).then(
              res => {
                if (res.status === 200) {
                  const data = res.data
                  if (data.msgCode === 0) {
                    this.category = data.msgData
                    //todo 赋值
                  console.log(this.category[this.category.length-1])
                this.newMeetingData.categoryId=this.category[this.category.length-1].id.toString()
                  }
                } else {
                  this.$Message.error('服务器繁忙请稍后')
                }
              }
            )
          }else {
            getAllCategory(JSON.parse(localStorage.getItem('projectId')).id).then(
              res => {
                if (res.status === 200) {
                  const data = res.data
                  if (data.msgCode === 0) {
                    this.category = data.msgData
                    //todo 赋值
                  }
                } else {
                  this.$Message.error('服务器繁忙请稍后')
                }
              }
            )
          }
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
        this.newMeetingData.meetingDate = year + seperator1 + month + seperator1 + strDate
      },
    },
    mounted() {
      this.getNowTime()
      this.getCategory()
    }
  };
</script>
<style  lang="less" scoped>
  .ivu-dropdown-menu{
    height: 150px;
    overflow:auto;
  }
  .top50 {
    margin-top: 50px;
  }

  .width350 {
    width: 80%;
  }

  .center {
    text-align: center;
  }

  .button_sty {
    padding: 6px 30px 6px 30px !important;
  }

  .search-btn {
    margin-left: 10px;
  }

  .textBox {
    margin-left: 15px;

    height: 40px;
    line-height: 40px;

    p {
      margin-right: 20px;
    }
  }

  .right {
    float: right;
  }

  .left {
    float: left;
  }

  .clear {
    clear: both;
  }
</style>

<template>
  <Card style="height: 100%;overflow-y: scroll">
    <Tabs value="name1">
      <TabPane label="会议信息" name="name1">
        <Row type="flex" justify="center">
          <Col span="18">
            <Form
              ref="editMeetingData"
              :model="editMeetingData"
              :rules="rules"
              :label-width="100">
              <br/>
              <Col span="12">
                <FormItem label="会议类别:" prop="categoryId">
                  <Select v-model="editMeetingData.categoryId" class="width350">
                    <Option v-for="item in category" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="会议日期:" prop="meetingDate">
                  <DatePicker
                    v-model="editMeetingData.meetingDate"
                    type="date"
                    class="width350"
                    format="yyyy-MM-dd"
                    :transfer="true"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="会议名称:" prop="name">
                  <Input v-model="editMeetingData.name" class="width350" type="text"></Input>
                </FormItem>
              </Col>
              <br/>

              <Col span="12">
                <FormItem label="会议地点:">
                  <Input v-model="editMeetingData.meetingPlace" class="width350" type="text"></Input>
                </FormItem>
              </Col>
              <br/>
              <Col span="12">
                <FormItem label="会议天气:">
                  <Input v-model="editMeetingData.weather" class="width350" type="text"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="会议主持人:">
                  <Input v-model="editMeetingData.emcee" class="width350" type="text"></Input>
                </FormItem>
              </Col>
              <br/>
              <Col span="24">
                <FormItem label="会议内容:" style="height: 240px">
                  <editor :catchData="content" :content="editMeetingData.meetingContent"></editor>
                </FormItem>
              </Col>
              <br/>
              <br/>
            </Form>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="会议签到表" name="name2">
        <br>
        <Upload
          ref="upload"
          :headers="headers"
          :before-upload="handleBeforeUpload"
          :show-upload-list="false"
          :on-success="succeeded"
          name="files"
          :on-error="uploadFailure"
          multiple
          :action="`${baseUrl}/pcm/meeting/record/attachments`">
          <Form
            :label-width="100"
            inline
            class="top20">
            <Button icon="ios-cloud-upload-outline" style="width:150px" type="primary">上传会议签到表</Button>
          </Form>
        </Upload>
        <br>
        <Table
          ref="selection"
          border
          :columns="columns"
          :data="pictureData">
        </Table>
      </TabPane>
    </Tabs>
    <Col span="24" style="text-align: center">
      <ButtonGroup :size="buttonSize">
        <Button class="search-btn" @click="close($route.query.id)">&nbsp取消</Button>
        <Button class="search-btn" type="primary" @click="editMeeting">&nbsp保存</Button>
      </ButtonGroup>
    </Col>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>
<script>
  import editor from '../newMeeting/wangEditor' // 富文本
  import {getAllCategory} from '@/api/meeting/meetingCategory' // 会议类别
  import {formatTime, getToken, isDataSuccess} from '@/libs/util'
  import {editorialMeeting, dataEcho, deleteImgData} from '@/api/meeting/meetingRecord' // 编辑
  import {mapMutations} from 'vuex'
  import bigImg from '@/components/big-img/Bigimg.vue'
  import axios from '@/libs/api.request'

  export default {
    name: 'editMeeting',
    components: {
      editor,
      bigImg
    },
    data() {
      return {
        buttonSize: 'large', // 按钮大小
        editMeetingData: {}, // 编辑数据
        category: [], // 会议类别
        showImg: false,
        imgSrc: '',
        pictureData: [],
        uploadList: [], // 存储会议签到表的地址
        baseUrl: axios.baseUrl,
        headers: {Authorization: 'Bearer ' + getToken()},
        rules: {
          categoryId: [
            // 会议类别验证

            {
              required: true,
              message: '请选择会议类别',
              trigger: 'change',
              type: 'number'
            }
          ],
          name: [
            // 会议名称的验证
            {
              required: true,
              message: '请填写会议名称',
              trigger: 'blur'
            }
          ],
          meetingDate: [
            // 会议日期的验证
            {
              required: true,
              message: '请填写会议日期',
              trigger: 'blur',
              type: 'date'
            }
          ]
        },
        columns: [
          {
            type: 'index',
            width: 50,
            align: 'center',
          },
          {
            title: '签到表',
            key: 'imgUrl',
            render: (h, params) => {
               console.log(params.row.name)
              const  filePath=params.row.name
              const   index=filePath.lastIndexOf(".")
              const  ext = filePath.substr(index+1);
              console.log(ext)
               if(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1){
                 return h('img', {
                   style: {//设置样式
                     width: '50px',
                     height: '50px',
                     'border-radius': '5%'
                   },
                   attrs: {//设置属性
                     src: params.row.imgUrl
                   }
                 });
               }else {
                 return h('div', [
                   h('span', {
                     style: {
                       color: '#082999',
                       cursor: 'pointer',
                     },
                     on: {
                       'click': () => {
                         window.open('', '_blank').location =params.row.imgUrl
                       }
                     }
                   }, params.row.name)
                 ])
               }
            }
          },
          {
            title: '签到表名称',
            key: 'name',

          },
          {
            title: '上传人',
            key: 'uploadUser',
            width: 100,
          },
          {
            title: '上传日期',
            key: 'uploadDate',
            width: 120,
          },
          {
            title: '操作',
            width: 130,
            key: 'handle',
            fixed: 'right',
            render: (h, params, vm) => {
              return [
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  on: {
                    'click': () => {
                      console.log(params.row.name)
                      const  filePath=params.row.name
                      const   index=filePath.lastIndexOf(".")
                      const  ext = filePath.substr(index+1);
                      if(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1){
                        this.showImg = true;
                        // 获取当前图片地址
                        console.log(params.row)
                        this.imgSrc = params.row.imgUrl;
                      }else {
                        window.open('', '_blank').location =params.row.imgUrl
                      }
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '查看'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '你确定要删除吗?',
                    placement: 'left-end',
                    size: 'small'
                  },
                  on: {
                    'on-ok': () => {
                      console.log(params.row)
                      this.deleteImg(params.row)
                    }
                  }
                }, [
                  h('Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      }
                    }, '删除')]),
              ]
            }
          }
        ],
      }
    },
    methods: {
      // 关闭页面
      ...mapMutations(['closeTag']),
      close($id) {
        this.closeTag({
          name: '会议编辑',
          query: {
            id: $id
          }
        })
      },
      //删除图片
      deleteImg(row) {
        deleteImgData(row.id).then(res => {
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
              this.pictureData.splice(row._index, 1)
              this.$Message.success(data.msgContent)
              break
          }
        })
      },
      // 富文本内容回显 在这里接受子组件传过来的参数，赋值
      content(value) {
        this.editMeetingData.meetingContent = value
      },
      // 获取会议类别
      getCategory() {
        getAllCategory(JSON.parse(localStorage.getItem('projectId')).id).then(
          res => {
            if (res.status === 200) {
              const data = res.data
              if (data.msgCode === 0) {
                this.category = data.msgData
              } else {
                this.$Message.error(data.msgContent)
              }
            } else {
              this.$Message.error('服务器繁忙请稍后')
            }
          }
        )
      },
      viewImg() {
        this.showImg = false;
      },
      //  上传文件之前的钩子
      handleBeforeUpload(file) {
        this.uploadList.push(file)
      },
      //图片上传成功后的回调
      succeeded(res, files) {
        console.log(res)
        this.pictureData.push(res.msgData[0])
      },
      //图片上传失败后的回调
      uploadFailure(error, files) {
        console.log(error)
        console.log(files)
      },
      //上传图片验证
      handleFormatError(files) {
        this.$Message.warning({
          content: files.name + '文件类型不正确,请选择图片',
          duration: 3
        })
      },
      // 编辑会议
      editMeeting() {
        const imgDataId = []
        if (this.pictureData.length !== 0) {
          this.pictureData.forEach(v => {
            imgDataId.push(v.id)
          })
        }
        this.$refs.editMeetingData.validate(valid => {
          console.log(this.editMeetingData)
          if (valid) {
            if (imgDataId.length !== 0) {
              this.editMeetingData.meetingDate = formatTime(this.editMeetingData.meetingDate)
              this.editMeetingData.attachmentIds = imgDataId
              editorialMeeting(this.editMeetingData).then(res => {
                if (res.status === 200) {
                  const data = res.data
                  if (data.msgCode === 0) {
                    this.$Message.success(data.msgContent)
                    this.close(this.$route.query.id)
                    this.$router.push({
                      path: '/administration/recordManagement'
                    })
                  } else {
                    this.editMeetingData.meetingDate = new Date(this.editMeetingData.meetingDate)
                    this.$Message.error(data.msgContent)
                  }
                } else {
                  this.$Message.error('服务器繁忙请稍后')
                }
              })
            }else {
              this.$Message.error('请上传会议签到表')
            }
          } else {
            this.$Message.error('请填写会议信息')
          }
        })
      },
      // 数据回显
      editMeetingEcho(id) {
        dataEcho(id).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.editMeetingData = res.data.msgData
              this.pictureData = res.data.msgData.attachmentVos
              console.log(this.editMeetingData)
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
      this.getCategory()
      this.editMeetingEcho(this.$route.query.id)
    },
    watch: {
      $route(to, from) {
        // 监听路由中的Id值的变化
        if (to.name === 'editMeeting') {
          this.getCategory()
          this.editMeetingEcho(this.$route.query.id)
          return
        }
      }
    }
  }
</script>

<style scoped lang="less">
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
    margin-bottom: 20px;
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


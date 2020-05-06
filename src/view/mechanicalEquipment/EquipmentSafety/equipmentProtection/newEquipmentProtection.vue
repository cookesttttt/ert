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
      <Tabs value="name1" class="bottom20">
        <TabPane label="基本信息" name="name1">
          <br><br>
          <Row type="flex" justify="center">
            <Col span="10">
              <Form ref="defendData" :model="defendData" :rules="ruleInline" :label-width="100">
                <Col span="24">
                  <FormItem label="防护时间" prop="protectDate">
                    <DatePicker
                      v-model="defendData.protectDate"
                      type="date"
                      class="width"
                      format="yyyy-MM-dd"
                      :transfer="true"
                    ></DatePicker>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="防护内容" prop="protectType">
                    <Input v-model="defendData.protectType" class="width" :maxlength="15"></Input>
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="防护设备" prop="equipments">
                    <Input v-model="defendData.equipments" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                           class="width" :maxlength="255"></Input>
                  </FormItem>
                </Col>
              </Form>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="附件">
          <br/>
          <Upload
            :headers="headers"
            :show-upload-list="false"
            :before-upload="handleUpload"
            :on-success="succeeded"
            name="files"
            :on-error="uploadFailure"
            :format="['jpg','jpeg','png']"
            :on-format-error="handleFormatError"
            multiple
            :action="`${baseUrl}/pcm/equipments/protect_bill/attachments`"
          >
            <Form :label-width="110" inline class="top20">
              <Button icon="ios-cloud-upload-outline" type="primary">选择维修单附件</Button>
            </Form>
          </Upload>
          <br/>
          <Table border :columns="columns" :data="pictureData"></Table>
        </TabPane>
      </Tabs>
    </div>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
  import '@/view/financial/budgeting/offerBudget/state.less'
  import {paramsValidate, isDataSuccess, formatTime, getToken, getRealname} from '@/libs/util'
  import {mapMutations} from 'vuex' // 关闭页面
  import {newData,deleteImgData} from '@/api/EquipmentSafety/equipmentProtection'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'
    export default {
        name: "newEquipmentProtection",
      components: {
        bigImg
      },
      data(){
        return {
          time: '',
          author: getRealname(),
          showImg: false,
          imgSrc: '',
          headers: {Authorization: 'Bearer ' + getToken()},
          baseUrl: axios.baseUrl,
          files: [],
          defendData:{
            equipments:'',
            protectDate:'',
            protectType:'',
          },
          ruleInline: {
            protectDate: [
              {required: true, type: 'date', message: '请选择防护时间', trigger: 'change'}
            ],
            protectType: [
              {required: true, message: '请输入防护内容', trigger: 'blur'},
            ],
            equipments: [
              {required: true, message: '请输入防护设备', trigger: 'blur'},
            ],
          },
          pictureData: [],
          columns: [
            {
              type: 'index',
              width: 50,
              align: 'center',
            },
            {
              title: '资质',
              key: 'imgUrl',
              render: (h, params) => {
                return h('img', {
                  style: {// 设置样式
                    width: '50px',
                    height: '50px',
                    'border-radius': '5%'
                  },
                  attrs: {// 设置属性
                    src: params.row.imgUrl
                  }
                })
              }
            },
            {
              title: '资质名称',
              key: 'name'

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
                        this.showImg = true
                        // 获取当前图片地址
                        console.log(params.row)
                        this.imgSrc = params.row.imgUrl
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
                      }, '删除')])
                ]
              }
            }
          ]
        }
      },
      methods:{
        //  关闭页面方法
        ...mapMutations(['closeTag']),
        close() {
          this.closeTag({
            name: 'newEquipmentProtection'
          })
        },
        // 删除图片
        deleteImg(row) {
          deleteImgData(row.id).then(res => {
            const data = res.data
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(data.msgContent)
                break
              default:
                this.pictureData.splice(row._index, 1)
                this.$Message.success(data.msgContent)
                break
            }
          })
        },
        viewImg() {
          this.showImg = false
        },
        clickFinish(state) {
          const imgDataId = []
          if (this.pictureData.length !== 0) {
            this.pictureData.forEach(v => {
              imgDataId.push(v.id)
            })
          }
          this.$refs.defendData.validate((valid)=>{
             if(valid){
               const  data={
                 saveStatus: state,
                 equipments:this.defendData.equipments,
                 protectDate:this.defendData.protectDate,
                 protectType:this.defendData.protectType,
                 attachmentIds:imgDataId
               }
               newData(JSON.parse(localStorage.getItem("projectId")).id, data).then(res => {
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
                     this.$router.push({name: 'equipmentProtection'});
                     break
                 }
               })
             }else {
               this.$Message.error('请填写基本信息')
             }
          })
        },
        //图片上传成功后的回调
        succeeded(res, files,fileList) {
          console.log(res.msgData[0])
          console.log(files)
          console.log(fileList)
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
        handleUpload(files) {
          this.files.push(files);
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
 .width{
   width: 80%;
 }
</style>

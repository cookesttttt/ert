<template>
  <Card style="height: 100%">
    <Tabs :value="name" @on-click="clickUpload">
      <TabPane label="基本信息" name="name1">
        <br><br>
        <Row type="flex" justify="center">
          <Col span="18">
            <Form ref="editRecordedInformation" :model="editRecordedInformation" :rules="ruleInline" :label-width="100">
              <Col span="12">
                <FormItem label="设备名称" prop="name">
                  <AutoComplete
                    @on-search="nameEnquiry"
                    v-model="editRecordedInformation.name"
                    :data="nameAll"
                    class="width">
                  </AutoComplete>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="设备型号" prop="model">
                  <AutoComplete
                    @on-search="modelEnquiry"
                    v-model="editRecordedInformation.model"
                    :data="modelAll"
                    class="width">
                  </AutoComplete>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="设备功率" prop="power">
                  <AutoComplete
                    @on-search="powerEnquiry"
                    v-model="editRecordedInformation.power"
                    :data="powerAll"
                    class="width">
                  </AutoComplete>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="开始使用时间" prop="startUsingDate">
                  <DatePicker v-model="editRecordedInformation.startUsingDate" type="date"  class="width" format='yyyy-MM-dd' :transfer="true"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="结束使用时间" prop="endUsingDate">
                  <DatePicker v-model="editRecordedInformation.endUsingDate" type="date"  class="width" format='yyyy-MM-dd' :transfer="true"></DatePicker>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="操作人员" prop="operator">
                  <Input v-model="editRecordedInformation.operator" class="width" :maxlength="15"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="安全人员" prop="safetyOfficer">
                  <Input v-model="editRecordedInformation.safetyOfficer" class="width" :maxlength="15"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="记录人员" prop="recorder">
                  <Input v-model="editRecordedInformation.recorder" class="width" :maxlength="15"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="设备数量" prop="equipmentCount">
                  <Input v-model="editRecordedInformation.equipmentCount" class="width" :maxlength="8"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="台班数" prop="machineWorkCount">
                  <Input v-model="editRecordedInformation.machineWorkCount" class="width" :maxlength="8"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="工作内容" prop="workContent">
                  <Input v-model="editRecordedInformation.workContent" class="width" :maxlength="15"></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="备注" prop="remark">
                  <Input v-model="editRecordedInformation.remark" type="textarea" :autosize="{minRows: 3,maxRows:3}"
                         class="width" :maxlength="255"></Input>
                </FormItem>
              </Col>
            </Form>
            <br/><br/>
            <div style="text-align: center">
              <ButtonGroup>
                <Button  @click="close">&nbsp取消</Button>
                <Button  type="primary" @click="keepingRecords">&nbsp保存</Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="附件" name="name2">
        <br>
        <Upload
          :headers="headers"
          :show-upload-list="false"
          :before-upload="handleUpload"
          :on-success="succeeded"
          name="files"
          :on-error="uploadFailure"
          multiple
          :action="`${baseUrl}/pcm/equipments/using_manager/record_bill/attachment/${itemId}`">
          <Form
            :label-width="100"
            inline
            class="top20">
            <Button icon="ios-cloud-upload-outline" type="primary">选择文件</Button>
          </Form>
        </Upload>
        <br>
        <Table
          border
          :columns="columns"
          :data="pictureData">
        </Table>
        <br/><br/><br/><br/><br/><br/>
        <div style="text-align: center">
          <ButtonGroup>
            <Button  @click="close">&nbsp取消</Button>
            <Button  type="primary" @click="keepingRecords1">&nbsp保存</Button>
          </ButtonGroup>
        </div>
      </TabPane>
    </Tabs>
    <!--<br/><br/>
    <div style="text-align: center">
      <ButtonGroup>
        <Button  @click="close">&nbsp取消</Button>
        <Button  type="primary" @click="keepingRecords">&nbsp保存</Button>
      </ButtonGroup>
    </div>-->
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
  import {paramsValidate, isDataSuccess, formatTime, getToken, getRealname,} from '@/libs/util'
  import '../index.less'
  import {mapMutations} from 'vuex' // 关闭页面
  import {getAllName,getAllModel,getAllPower,editData,deleteImgData,getEditAllData} from '@/api/Equipment/usingRecord'
  import axios from '@/libs/api.request'
  import bigImg from '@/components/big-img/Bigimg.vue'

  export default {
    name: "editUsageRecord",
    components: {
      bigImg
    },
    data(){
      return {
        name:'name1',
        itemId:'',
        author: getRealname(),
        showImg: false,
        nameAll:[],
        modelAll:[],
        powerAll:[],
        imgSrc: '',
        baseUrl: axios.baseUrl,
        headers: {Authorization: 'Bearer ' + getToken()},
        editRecordedInformation:{
          name:'',
          model:'',
          power:'',
          startUsingDate:'',
          endUsingDate:'',
          operator:'',
          safetyOfficer:'',
          equipmentCount:'',
          machineWorkCount:'',
          recorder:'',
          remark:'',
          workContent:'',
          id:'',
          attachmentIds:[],
        },
        ruleInline: {
          name: [
            {required: true, message: '请输入设备名称', trigger: 'blur'},
          ],
          model: [
            {required: true, message: '请输入设备类型', trigger: 'blur'},
          ],
          power: [
            {required: true, message: '请输入设备功率', trigger: 'blur'},
            {
              type: 'string',
              pattern: /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/, message: '请输入数字',
              trigger: 'blur'
            }
          ],
          startUsingDate: [
            {required: true, type: 'date', message: '请选择开始时间', trigger: 'change'}
          ],
          endUsingDate: [
            {required: true, type: 'date', message: '请选择结束时间', trigger: 'change'}
          ],
          operator: [
            {required: true, message: '请输入操作人员', trigger: 'blur'},
          ],
          recorder: [
            {required: true, message: '请输入记录人员', trigger: 'blur'},
          ],
          safetyOfficer: [
            {required: true, message: '请输入安全人员', trigger: 'blur'},
          ],
          workContent: [
            {required: true, message: '请输入工作内容', trigger: 'blur'},

          ],
          equipmentCount: [
            {required: true, message: '请输入设备数量', trigger: 'blur'},
            {
              type: 'string',
              pattern: /^\+?[1-9]\d*$/, message: '请输入正整数字',
              trigger: 'blur'
            }
          ],
          machineWorkCount: [
            {required: true, message: '请输入台班数', trigger: 'blur'},
            {
              type: 'string',
              pattern: /^\+?[1-9]\d*$/, message: '请输入正整数字',
              trigger: 'blur'
            }
          ],
        },
        pictureData: [],
        files: [],
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center',
          },
          {
            title: '资质',
            key: 'imgUrl',
            render: (h, params) => {
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
            }
          },
          {
            title: '资质名称',
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
                      this.showImg = true;
                      // 获取当前图片地址
                      console.log(params.row)
                      this.imgSrc = params.row.imgUrl;
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
    methods:{
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'newUsageRecord'
        })
      },
      //不区分大小写的 AutoComplete，及过滤的用法。
      filterMethod (value, option) {
        // return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
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
      viewImg() {
        this.showImg = false;
      },
      keepingRecords(){
        const imgDataId = []
        if (this.pictureData.length !== 0) {
          this.pictureData.forEach(v => {
            imgDataId.push(v.id)
          })
        }
        this.$refs.editRecordedInformation.validate((v)=>{
          if(v){
            const data={
              attachmentIds:imgDataId,
              endUsingDate:formatTime(this.editRecordedInformation.endUsingDate),
              equipmentCount:this.editRecordedInformation.equipmentCount,
              machineWorkCount:this.editRecordedInformation.machineWorkCount,
              model:this.editRecordedInformation.model,
              name:this.editRecordedInformation.name,
              power:this.editRecordedInformation.power,
              operator:this.editRecordedInformation.operator,
              recorder:this.editRecordedInformation.recorder,
              workContent:this.editRecordedInformation.workContent,
              remark:this.editRecordedInformation.remark,
              safetyOfficer:this.editRecordedInformation.safetyOfficer,
              startUsingDate:formatTime(this.editRecordedInformation.startUsingDate),
            }
            editData(JSON.parse(localStorage.getItem("projectId")).id,this.itemId,data,).then(res => {
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

                  this.name='name2'
                  break
              }
            })
          }else {
            this.$Message.error('请完善基本信息')
          }
        })
      },
      keepingRecords1(){
        this.$Message.success('操作成功')
        this.close()
        this.$router.push({name:'usingRecord'});
      },
      clickUpload(name){
        if(name==='name2'&&this.itemId===''){
          this.$Message.error('请完善基本信息并保存')
        }
      },
      nameEnquiry(query){
        console.log(query)
        getAllName(JSON.parse(localStorage.getItem("projectId")).id,query).then(res=>{
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
              if(data.msgData.length!==0){
                this.nameAll=[]
                data.msgData.forEach(v=>{
                  this.nameAll.push(v.name)
                })
              }
              break
          }
        })
      },
      modelEnquiry(query){
        getAllModel(JSON.parse(localStorage.getItem("projectId")).id,this.editRecordedInformation.name,query).then(res=>{
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
              if(data.msgData.length!==0){
                this.modelAll=[]
                data.msgData.forEach(v=>{
                  this.modelAll.push(v.model)
                })
              }
              break
          }
        })
      },
      powerEnquiry(query){
        getAllPower(JSON.parse(localStorage.getItem("projectId")).id,this.editRecordedInformation.name,this.editRecordedInformation.model,query).then(res=>{
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
              if(data.msgData.length!==0){
                this.powerAll=[]
                data.msgData.forEach(v=>{
                  this.powerAll.push(v.power)
                })
              }
              break
          }
        })
      },
      //图片上传成功后的回调
      succeeded(res, files) {
        console.log(res.msgData[0])
        this.pictureData.push(res.msgData[0])
      },
      uploadFailure(error, files) {
        if(this.itemId===''){
          this.$Message.error('请完善基本信息并保存')
        }
        console.log(files)
      },
      //再次点击上传之前，清空之前已上传文件
      handleUpload(files) {
        this.files.push(files);
      },
      // 获取编辑数据
      getEditData() {
        getEditAllData(this.itemId).then(res => {
            const data = res.data;
            let status = isDataSuccess(res);
            switch (status) {
              case 1:
                this.$Message.error("服务器繁忙请稍后");
                break;
              case 2:
                this.$Message.error(data.msgContent);
                break;
              default:
                 console.log(data)
                this.editRecordedInformation.id=data.msgData.id
                this.editRecordedInformation.name=data.msgData.name
                this.editRecordedInformation.model=data.msgData.model
                this.editRecordedInformation.power=data.msgData.power+''
                this.editRecordedInformation.startUsingDate=new Date(data.msgData.startUsingDate)
                this.editRecordedInformation.endUsingDate=new Date(data.msgData.endUsingDate)
                this.editRecordedInformation.operator=data.msgData.operator
                this.editRecordedInformation.safetyOfficer=data.msgData.safetyOfficer
                this.editRecordedInformation.equipmentCount=data.msgData.equipmentCount+''
                this.editRecordedInformation.machineWorkCount=data.msgData.machineWorkCount+''
                this.editRecordedInformation.recorder=data.msgData.recorder
                this.editRecordedInformation.remark=data.msgData.remark
                this.editRecordedInformation.workContent=data.msgData.workContent
                this.pictureData=data.msgData.attachmentVos
                break;
            }
          }
        )
      },
    },

    activated() {
      this.itemId = sessionStorage.getItem('editUsageRecordId')
      this.getEditData()
    }
  }
</script>

<style scoped>

</style>

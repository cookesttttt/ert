<template>
  <Card>
    <Tabs value="name1">
      <TabPane label="供应商基本信息" name="name1">
        <br><br>
        <Row type="flex" justify="center">
          <Col span="18">
            <Form ref="supplierInformation" :model="supplierInformation" :rules="ruleInline" :label-width="110">
                <Col span="12">
                  <FormItem label="供应商名称" prop="supplierName">
                    <Input v-model="supplierInformation.supplierName" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="联系电话" prop="contactNumber">
                    <Input v-model="supplierInformation.contactNumber" class="width" ></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="地址" prop="address">
                    <Input v-model="supplierInformation.address" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="成立时间" prop="foundingTime">
                    <DatePicker v-model="supplierInformation.foundingTime" type="date" class="width"
                                format='yyyy-MM-dd' :transfer="true"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="企业法人" prop="businessEntity">
                    <Input v-model="supplierInformation.businessEntity" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="公司性质" prop="property">
                    <Input v-model="supplierInformation.property" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="工商编码" prop="code">
                    <Input v-model="supplierInformation.code" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="供应商等级" prop="supplierLevel">
                    <Select v-model="supplierInformation.supplierLevel" class="width">
                      <Option value="优良">优良</Option>
                      <Option value="合格">合格</Option>
                      <Option value="不合格">不合格</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="是否加入黑名单" prop="blacklist" >
                    <Select v-model="supplierInformation.blacklist" class="width" :transfer="true">
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>
                  </FormItem>
                </Col>
              <Col span="12">
                <FormItem label="备注" prop="remark">
                  <Input v-model="supplierInformation.remark" type="textarea" :rows="3"  class="width"
                         :maxlength="500"/>
                </FormItem>
              </Col>
            </Form>
          </Col>
        </Row>
       <Row>
         <Col span="24">

         </Col>
       </Row>
      </TabPane>
      <TabPane label="供应产品" name="name2">
        <br>
        <ButtonGroup>
          <Button class="search-btn" type="primary" @click="insertEvent(1)">&nbsp;新增供应商产品</Button>
          <Button class="search-btn" type="error" @click="confirm">&nbsp;批量删除</Button>
        </ButtonGroup>
        <br><br>
        <vxe-table
          ref="productsTable"
          border
          resizable
          height="530"
          class="vxe-table-iview"
          show-overflow
          :data="productData"
          :edit-rules="validRules"
          :edit-config="{trigger: 'click', mode: 'row'}"
        >
          <vxe-table-column type="selection" width="50"></vxe-table-column>
          <vxe-table-column type="index" width="50">
            <template v-slot:header="{ column }">
              <span>#</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="name" title="产品名称" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="power" title="额定功率" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="model" title="型号" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="unit" title="单位" :edit-render="{name: 'input'}"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="资质上传" name="name3">
        <br>
     <!--   <Button  type="primary" @click="handleUp">上传</Button>-->
        <Upload
          ref="handleUp1"
          :headers="headers"
          :show-upload-list="false"
          :before-upload="handleUpload"
          :on-success="succeeded"
          name="files"
          :on-error="uploadFailure"
          :format="['jpg','jpeg','png']"
          :on-format-error="handleFormatError"
          multiple
          :action="`${baseUrl}/pcm/equipments/suppliers/supplier/certificates`">
          <Form
            :label-width="110"
            inline
            class="top20">
            <Button icon="ios-cloud-upload-outline" type="primary">选择资质图片文件</Button>
          </Form>
        </Upload>
        <br>
        <Table
          border
          :columns="columns"
          :data="tableData">
        </Table>
      </TabPane>
    </Tabs>
    <div style="text-align: center">
      <ButtonGroup>
        <Button class="search-btn" @click="clickClose">&nbsp取消</Button>
        <Button class="search-btn" type="primary" @click="clickFinish(1)">&nbsp保存</Button>
      </ButtonGroup>
    </div>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
  import {paramsValidate, isDataSuccess, formatTime,getToken,getRealname} from '@/libs/util'
  import '../index.less'
  import { mapMutations } from 'vuex' // 关闭页面
  import {newSupplierData,deleteImgData} from '@/api/purchasingManagement/supplier'
  import bigImg from '@/components/big-img/Bigimg.vue'
  import axios from '@/libs/api.request'
  export default {
    name: "newSupplier",
    data() {
      return {
        name:getRealname(),
        time:'',
        showImg:false,
        imgSrc: '',
        headers: { Authorization:'Bearer ' + getToken()},
        baseUrl:axios.baseUrl,
        supplierInformation: {
          supplierName: '',         //供应商名称
          contactNumber: '',       //联系电话
          address: '',            //地址
          foundingTime: '',       //成立时间
          businessEntity: '',     //企业法人
          property: '',          //公司性质
          code: '',             //工商编码
          remark: '',           //备注
          supplierLevel: '',     //供应商等级
          blacklist: '',       //是否加入黑名单
        },
        files: [],           //上传图片
        tableData: [],        //图片表格数据
        productData: [],
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
            width:100
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

        ruleInline: {
          supplierName: [
            {
              required: true,
              message: '请填写供应商名称',
              trigger: 'blur'
            }
          ],
          contactNumber: [
            {
              required: true,
              type: 'number',
              message: '请填写正确的手机号码',
              trigger: 'blur',
              transform(value) {
                let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/
                if (!myreg.test(value)) {
                  return false
                } else {
                  return Number(value)
                }
              }
            },
          ],
          address: [
            {
              required: true,
              message: '请填写地址',
              trigger: 'blur'
            }
          ],
          foundingTime: [
            {
              type: 'date',
              required: true,
              message: '请选择年检日期',
              trigger: 'change'
            }
          ],
          businessEntity: [
            {
              required: true,
              message: '请填写企业法人',
              trigger: 'blur'
            }
          ],
          property: [
            {
              required: true,
              message: '请填写公司性质',
              trigger: 'blur'
            }
          ],
          code: [
            {

              required: true,
              message: '请填写工商编码',
              trigger: 'blur'
            }
          ],
          supplierLevel: [
            {
              required: true,
              message: '请选择供应商等级',
              trigger: 'change',

            }
          ],
          blacklist: [
            {
              required: true,
              message: '请选择是否为黑名单',
              trigger: 'change',
            }
          ]
        },
        validRules: {
          name: [
            {required: true, type: 'string', message: '请输入产品名称'},
            {min:2,max: 20,message: '名称长度在2-20个字符'},

          ],
          model: [
            {required: true, type: 'string', message: '请输入产品型号'},
            {max: 30,message: '产品型号长度在30个字符'},
          ],
          power: [
            {required: true, type: 'string', message: '请输入额定功率'},
            {max: 20,message: '额定功率长度在20个字符'},
          ],
          unit: [
            {required: true, type: 'string', message: '请输入产品单位'},
            {max: 10,message: '产品单位在10个字符'},
          ],
        },
      }
    },
    components: {
      bigImg
    },
    methods: {
      //获取当前时间
      getNowTime(){
        let date = new Date();
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        this.time= year + seperator1 + month + seperator1 + strDate;
      },
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'newSupplier'
        })
      },
      clickClose(){
       this.close()
      this.$router.push({name:'supplier'});
      },
      //删除图片
      deleteImg(row){
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
              this.tableData.splice(row._index, 1)
              this.$Message.success(data.msgContent)
              break
          }
        })
      },
      viewImg(){
        this.showImg = false;
      },

      //添加表格一行
      insertEvent(row) {
        this.$refs.productsTable.insertAt(row,-1)
      },
      //删除
      confirm() {
        if (this.$refs.productsTable.getSelectRecords().length !== 0) {
          this.$Modal.confirm({
            title: '删除选中机械设备',
            content: '<p>你确定要删除选中机械用品吗?</p>',
            onOk: () => {
              this.$refs.productsTable.removeSelecteds()   //  删除表格中选中的数据
            },
          });
        } else {
          this.$Message.error('请选择删除的产品')
        }
      },

      //点击完成或者点击临时保存
      clickFinish(state) {
        //获取表格数据
        const addTableData = this.$refs.productsTable.getInsertRecords()
        const ren=[]
        addTableData.forEach(v=>{
          if(v.name===null||v.name===''){
            ren.push(v)
          }
        })
        this.$refs.productsTable.remove(ren)
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}
            addTable.name = v.name
            addTable.power = v.power
            addTable.model = v.model
            addTable.unit = v.unit
            arryData.push(addTable)
          })
        }

        this.$refs.supplierInformation.validate((valid) => {
          if (valid) {
            const imgDataId=[]
            if(this.tableData.length!==0){
              this.tableData.forEach(v=>{
                imgDataId.push(v.id)
              })
            }
            this.$refs.productsTable.validate(valid => {
              if (valid) {
                const data = {
                  name: this.supplierInformation.supplierName,
                  phone: this.supplierInformation.contactNumber,
                  address: this.supplierInformation.address,
                  foundDate: formatTime(this.supplierInformation.foundingTime),
                  legalPerson: this.supplierInformation.businessEntity,
                  companyType: this.supplierInformation.property,
                  businessNumber: this.supplierInformation.code,
                  blackList: this.supplierInformation.blacklist,
                  supplierLevel: this.supplierInformation.supplierLevel,
                  //备注
                  remark: this.supplierInformation.remark,
                  //图片Url
                  attachmentIds:imgDataId,
                  //表格数据
                  equipmentVos: arryData
                }
                newSupplierData(data, JSON.parse(localStorage.getItem("projectId")).id).then(res => {
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
                      this.$router.push({name:'supplier'});
                      break
                  }
                })
              }else {
                this.$Message.error('请完善供应商产品')
              }
            })
          }else {
            this.$Message.error('请完善基本信息')
          }
        })
      },
      //图片上传成功后的回调
      succeeded(res, files) {
        console.log(res.msgData[0])
        this.tableData.push(res.msgData[0])
        this.files=[]
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
      //再次点击上传之前，清空之前已上传文件
      handleUpload(files) {
        this.files.push(files)
      /*  return false*/
      },
     /* handleUp(){
        this.files.forEach(v=>{
           console.log(v)
          this.$refs.handleUp1.post(v)
        })
      },*/
    }
  }
</script>

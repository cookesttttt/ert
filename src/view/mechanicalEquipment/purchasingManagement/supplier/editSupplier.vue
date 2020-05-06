<template>
  <Card>
    <Tabs value="name1">
      <TabPane label="供应商基本信息" name="name1">
        <br><br>
        <Row type="flex" justify="center">
          <Col span="18">
            <Form ref="editSupplierInformation" :model="editSupplierInformation" :rules="editRuleInline" :label-width="110">
                <Col span="12">
                  <FormItem label="供应商名称" prop="supplierName">
                    <Input v-model="editSupplierInformation.supplierName" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="联系电话" prop="contactNumber">
                    <Input v-model="editSupplierInformation.contactNumber" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="地址" prop="address">
                    <Input v-model="editSupplierInformation.address" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="成立时间" prop="foundingTime">
                    <DatePicker v-model="editSupplierInformation.foundingTime" type="date" class="width"
                                format='yyyy-MM-dd' :transfer="true"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="企业法人" prop="businessEntity">
                    <Input v-model="editSupplierInformation.businessEntity" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="公司性质" prop="property">
                    <Input v-model="editSupplierInformation.property" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="工商编码" prop="code">
                    <Input v-model="editSupplierInformation.code" class="width"></Input>
                  </FormItem>
                </Col>
                <Col span="12" >
                  <FormItem label="供应商等级" prop="supplierLevel">
                    <Select v-model="editSupplierInformation.supplierLevel" class="width">
                      <Option value="优良">优良</Option>
                      <Option value="合格">合格</Option>
                      <Option value="不合格">不合格</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="是否加入黑名单" prop="blacklist">
                    <Select v-model="editSupplierInformation.blacklist" class="width" :transfer="true">
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>
                  </FormItem>
                </Col>
              <Col span="12">
                <FormItem label="备注" prop="remark">
                  <Input v-model="editSupplierInformation.remark" type="textarea" :rows="3"  class="width"
                         :maxlength="500"/>
                </FormItem>
              </Col>
            </Form>
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
          ref="editProductsTable"
          border
          height="530"
          resizable
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
          <vxe-table-column field="model" title="型号" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="power" title="额定功率" :edit-render="{name: 'input'}"></vxe-table-column>
          <vxe-table-column field="unit" title="单位" :edit-render="{name: 'input'}"></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="资质上传" name="name3">
        <br>
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
  import {getEditSupplier, editSupplierData, deleteImgData, deleteEquipment} from '@/api/purchasingManagement/supplier'
  import {paramsValidate, isDataSuccess, formatTime, getToken} from '@/libs/util'
  import {mapMutations} from 'vuex' // 关闭页面
  import bigImg from '@/components/big-img/Bigimg.vue'
  import axios from '@/libs/api.request'
 import '../index.less'
  export default {
    name: "editSupplier",
    components: {
      bigImg
    },
    data() {
      return {
        showImg: false,
        imgSrc: '',
        headers: {Authorization: 'Bearer ' + getToken()},
        files: [],           //上传图片
        baseUrl:axios.baseUrl,
        editSupplierInformation: {
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
        itemId: '',
        tableData: [],
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
        editRuleInline: {
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
            },
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
    methods: {
      //  关闭页面方法
      ...mapMutations(['closeTag']),
      close() {
        this.closeTag({
          name: 'editSupplier'
        })
      },
      clickClose(){
        this.close()
        this.$router.push({name:'supplier'});
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
              this.tableData.splice(row._index, 1)
              this.$Message.success(data.msgContent)
              break
          }
        })
      },
      viewImg() {
        this.showImg = false;
      },
      //添加表格一行
      insertEvent(row) {
        this.$refs.editProductsTable.insertAt(row,-1)
      },
      //删除设备
      deleteEquipmentdata() {
        console.log(this.$refs.editProductsTable.getSelectRecords())
        const selectData = this.$refs.editProductsTable.getSelectRecords()
        const dataId = {'ids': []}
        if (selectData.length !== 0) {
          selectData.forEach(v => {
            if(v.id){
              dataId.ids.push(v.id)
            }
          })
          deleteEquipment(dataId).then(res => {
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
                break
            }
          })
        }
        console.log(dataId)
      },
      //删除
      confirm() {
        const  checkedData=this.$refs.editProductsTable.getSelectRecords()
        if (checkedData.length !== 0) {
          this.$Modal.confirm({
            title: '删除选中机械设备',
            content: '<p>你确定要删除选中机械用品吗?</p>',
            onOk: () => {
              this.deleteEquipmentdata()
              this.$refs.editProductsTable.removeSelecteds()
            },
          });
        } else {
          this.$Message.error('请选择删除的产品')
        }
      },
      //点击完成或者点击临时保存
      clickFinish(state) {
        //获取表格数据
        const addTableData = this.$refs.editProductsTable.getTableData().fullData
        const ren=[]
        addTableData.forEach(v=>{
          if(v.name===null||v.name===''){
            ren.push(v)
          }
        })
        this.$refs.editProductsTable.remove(ren)
        const arryData = []
        if (addTableData.length !== 0) {
          addTableData.forEach(v => {
            let addTable = {}
            addTable.id = v.id
            addTable.name = v.name
            addTable.power = v.power
            addTable.model = v.model
            addTable.unit = v.unit
            arryData.push(addTable)
          })
        }
        this.$refs.editSupplierInformation.validate((valid) => {
          if (valid) {
            const imgDataId = []
            if (this.tableData.length !== 0) {
              this.tableData.forEach(v => {
                imgDataId.push(v.id)
              })
            }
            this.$refs.editProductsTable.validate(valid => {
              if (valid) {
                const editData = {
                  name: this.editSupplierInformation.supplierName,
                  phone: this.editSupplierInformation.contactNumber,
                  address: this.editSupplierInformation.address,
                  foundDate: formatTime(this.editSupplierInformation.foundingTime),
                  legalPerson: this.editSupplierInformation.businessEntity,
                  companyType: this.editSupplierInformation.property,
                  businessNumber: this.editSupplierInformation.code,
                  blackList: this.editSupplierInformation.blacklist,
                  supplierLevel: this.editSupplierInformation.supplierLevel,
                  //备注
                  remark: this.editSupplierInformation.remark,
                  //图片Url
                  attachmentIds: imgDataId,
                  //表格数据
                  equipmentVos: arryData
                }
                editSupplierData(editData, JSON.parse(localStorage.getItem("projectId")).id, this.itemId).then(res => {
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
                      this.$router.push({name: 'supplier'});
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
      },
      // 获取编辑数据
      getEditData() {
        getEditSupplier(this.itemId).then(res => {
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
                this.editSupplierInformation.supplierName = data.msgData.name
                this.editSupplierInformation.contactNumber = data.msgData.phone
                this.editSupplierInformation.address = data.msgData.address
                this.editSupplierInformation.foundingTime = new Date(data.msgData.foundDate)
                this.editSupplierInformation.businessEntity = data.msgData.legalPerson
                this.editSupplierInformation.property = data.msgData.companyType
                this.editSupplierInformation.code = data.msgData.businessNumber
                this.editSupplierInformation.blacklist = data.msgData.blackList.toString()
                this.editSupplierInformation.supplierLevel = data.msgData.supplierLevel
                this.editSupplierInformation.remark = data.msgData.remark
                this.productData = data.msgData.equipmentVos
                //图片表格
                this.tableData = data.msgData.attachmentVos
                console.log(data.msgData)
                console.log(this.editSupplierInformation)
                break;
            }
          }
        )
      },
    },
    activated() {
      this.itemId = sessionStorage.getItem('editSupplierId')
      this.getEditData()
    },

  }
</script>


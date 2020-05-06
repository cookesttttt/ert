<template>
  <Card style="height: 700px">
    <Tabs value="name" style="height: 700px">
      <TabPane label="个人信息" name="name" class="center">
        <h3>个人信息</h3>
        <Form class="formItem" inline :model="information" :label-width="100">
          <FormItem label="姓名" class="bottom20" style="height:30px">
            <Input v-model="information.name" :maxlength="15" size="large" disabled></Input>
            <Tooltip content="Top Left text" placement="top-start" style="margin-left:30px"></Tooltip>
          </FormItem>
          <FormItem label="电话号码" class="bottom20" style="height:30px">
            <Input v-model="information.phoneNumber" :maxlength="15" disabled size="large"></Input>
            <Tooltip content="Top Left text" placement="top-start" style="margin-left:30px"></Tooltip>
          </FormItem>
          <FormItem label="工作职责" class="bottom20" style="height:30px; position: relative">
            <Tag color="default" class="item" v-for="res in jobName" :key="res">{{res}}</Tag>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="资质信息" name="name2">
        <Button type="primary" @click="isAddModal=true">&nbsp;添加资质</Button>
        <br />
        <br />
        <Modal
          title="个人资质信息"
          v-model="isAddModal"
          :mask-closable="false"
          width="600"
          @on-cancel="cancelFile"
        >
          <Form
            class="formItem"
            ref="aptitude"
            inline
            :model="aptitude"
            :label-width="100"
            :rules="aptitudeRules"
          >
            <FormItem label="资质名称" class="bottom20" prop="name">
              <Input v-model="aptitude.name" :maxlength="15" :size="buttonSize"></Input>
            </FormItem>
            <FormItem label="有效期" class="bottom20" prop="expiredDate">
              <DatePicker
                v-model="aptitude.expiredDate"
                type="date"
                :size="buttonSize"
                class="width350"
              ></DatePicker>
            </FormItem>
            <FormItem label="颁发单位" class="bottom20" prop="awardOgr">
              <Input v-model="aptitude.awardOgr" :maxlength="15" :size="buttonSize"></Input>
            </FormItem>
          </Form>

          <div style="text-align: center;margin-left: 100px">
            <el-upload
              ref="upload"
              :headers="headers"
              multiple
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :data="getfileData()"
              action="http://192.168.100.201:18082/uac/user/certificate"
              :file-list="fileList"
              :auto-upload="false"
              list-type="picture"
            >
              <el-button size="small" type="primary" slot="trigger" style="width:350px">点击上传证书扫描件</el-button>
            </el-upload>
          </div>
          <div slot="footer">
            <Button type="primary" class="button_sty" @click="submitUpload">保存</Button>
            <Button class="button_sty" @click="cancelFile">取消</Button>
          </div>
        </Modal>
        <Table border :columns="column" :data="informationData"></Table>
        <Modal title="编辑个人资质信息" v-model="isEditModal" :mask-closable="false">
          <Form
            class="formItem"
            ref="editAptitude"
            inline
            :model="editAptitude"
            :label-width="100"
            :rules="aptitudeRules"
          >
            <FormItem label="资质名称" class="bottom20" prop="name">
              <Input v-model="editAptitude.name" :maxlength="15" :size="buttonSize"></Input>
            </FormItem>
            <FormItem label="有效期" class="bottom20" prop="expiredDate">
              <DatePicker
                v-model="editAptitude.expiredDate"
                type="date"
                :size="buttonSize"
                class="width350"
              ></DatePicker>
            </FormItem>
            <FormItem label="颁发单位" class="bottom20" prop="awardOgr">
              <Input v-model="editAptitude.awardOgr" :maxlength="15" :size="buttonSize"></Input>
            </FormItem>
          </Form>

          <div style="margin-left: 100px">
            <img :src="urlSrc" style="width: 50px;height: 50px" />
            <el-upload
              ref="editUpload"
              :headers="headers"
              multiple
              :on-success="editUploadSuccess"
              :http-request="addAttachment"
              :on-error="editUploadError"
              :data="editGetfileData()"
              action="http://192.168.100.201:18082/uac/user/certificate/edit"
              :file-list="editFileList"
              :auto-upload="false"
              list-type="picture"
            >
              <el-button size="small" type="primary" slot="trigger" style="width:350px">点击上传证书扫描件</el-button>
            </el-upload>
          </div>
          <div slot="footer">
            <Button type="primary" size="large" @click="editSubmitUpload">保存</Button>
            <Button type="text" size="large" @click="editCancelFile">取消</Button>
          </div>
        </Modal>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
/**
 *  paramsValidate 验证是否为空
 *  isDataSuccess 验证数据是否成功
 * */
import { paramsValidate, isDataSuccess, getToken } from '@/libs/util'
import {
  getUserData,
  getAllRole,
  getInfos,
  getDepartmentData,
  getInformationData,
  deleteinformationData,
  editInformationData,
  getUserOrg
} from '@/api/basicSetting/personalInformation'
import './index.less'
import { type } from 'os'
import { putItemState } from '@/api/welcome/welcome.js'
export default {
  name: 'personalInformation',
  data () {
    return {
      jobWork: '',
      jobName: [],
      status: {}, // welcome传输的对象
      token: 'Bearer ' + getToken(), // 上传Token
      selectedDataId: [], // 选中的数据
      column: [
        {
          title: '序号',
          type: 'index',
          width: 70,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '资质名称',
          key: 'name',
          width: '120'
        },
        {
          title: '有效期',
          key: 'expiredDate'
        },
        {
          title: '颁发单位',
          key: 'awardOgr'
        },
        {
          title: '证件图片',
          key: 'url',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.url
                },
                style: {
                  width: '40px',
                  height: '40px'
                }
              })
            ])
          }
        },
        {
          title: '操作',
          key: 'handle',
          width: 130,
          fixed: 'right',
          render: (h, params, vm) => {
            return [
              // 编辑按钮
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.echoData(params.index)
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                },
                '编辑'
              ),
              // 删除按钮
              h(
                'Poptip',
                {
                  props: {
                    transfer: true,
                    confirm: true,
                    title: '你确定要删除吗?',
                    placement: 'left-end',
                    size: 'small'
                  },
                  on: {
                    'on-ok': () => {
                      this.deleteinformation(params.row.id, params.row.index)
                    }
                  }
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      }
                    },
                    '删除'
                  )
                ]
              )
            ]
          }
        }
      ],
      informationData: [],
      urlSrc: '',
      isAddModal: false,
      isEditModal: false,
      isDutyWork: false,
      activeName: 'first', // 默认选中Tabs第几个
      tabPosition: 'left',
      files: '',
      information: {
        name: '',
        phoneNumber: '',
        dutyWork: '',
        departmentId: ''
      },
      aptitude: {
        name: '',
        expiredDate: '',
        awardOgr: ''
      },
      fileList: [],
      editAptitude: {
        name: '',
        expiredDate: '',
        awardOgr: ''
      },
      editFileList: [],
      buttonSize: 'large', // 按钮大小
      rules: {
        dutyWork: [
          // 项目名称非空验证
          {
            required: true,
            message: '请填写工作职责',
            trigger: 'change'
          }
        ]
      },
      aptitudeRules: {
        name: [
          // 项目名称非空验证
          {
            required: true,
            message: '请填写资质名称',
            trigger: 'blur'
          }
        ],
        expiredDate: [
          {
            type: 'date',
            required: true,
            message: '请选择有效期',
            trigger: 'change'
          }
        ],
        awardOgr: [
          {
            required: true,
            message: '请填写颁发单位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取电话和名字
    getUser () {
      getUserData(JSON.parse(localStorage.getItem('projectId')).id)
        .then(res => {
          this.$Spin.show()
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
              this.information.name = data.msgData.realName
              this.information.phoneNumber = data.msgData.phone
              console.log(data.msgData)

              for (let i = 0; i < data.msgData.deptNames.length; i++) {
                this.jobName.push(data.msgData.deptNames[i] + '--' + data.msgData.roles[i])
              }
              console.log(this.jobName)

              this.$Spin.hide()
              break
          }
        })
        .then(() => {
          // 获取所属部门 表格所有数据
          this.getInformation()
        })
    },

    // handleSubmit () {
    //   this.$refs.information.validate(valid => {
    //     if (valid) {
    //       let deptIds = ''
    //       if (this.status === false) {
    //         this.jobWork.forEach(item => {
    //           if (item.department.name === this.deptName) {
    //             deptIds = item.department.id
    //           }
    //         })
    //         const data = {
    //           roleIds: [this.jobName],
    //           deptIds: [deptIds]
    //         }
    //         console.log(data)
    //         getInfos(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
    //           if (res.status === 200) {
    //             const data = res.data
    //             if (res.data.msgCode === 0) {
    //               this.getUser()
    //               this.$Message.success(data.msgContent)
    //               this.$store.dispatch('getMenuData')
    //             } else {
    //               this.$Message.error(data.msgContent)
    //             }
    //           } else {
    //             this.$Message.error('服务器繁忙请稍后')
    //           }
    //         })
    //       } else {
    //         const data = {
    //           roleIds: this.selectedDataId,
    //           deptIds: [this.information.departmentId]
    //         }
    //         getInfos(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
    //           if (res.status === 200) {
    //             const data = res.data
    //             if (res.data.msgCode === 0) {
    //               this.getUser()
    //               this.$Message.success(data.msgContent)
    //               this.status.postStatus = 1
    //               putItemState(JSON.parse(localStorage.getItem('projectId')).id, this.status).then(res => {
    //                 console.log(res)
    //               })
    //             } else {
    //               this.$Message.error(data.msgContent)
    //             }
    //           } else {
    //             this.$Message.error('服务器繁忙请稍后')
    //           }
    //         })
    //       }
    //     }
    //   })
    // },
    // 聚焦时间获取项目办数据打开弹框
    getFocusData () {
      this.getAllRoleData()
    },
    // 获取项目办角色
    getAllRoleData () {
      getAllRole(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(data.msgContent)
            break
          default:
            this.jobWork = res.data.msgData
            this.isDutyWork = true
            break
        }
      })
    },
    // 获取表格所有数据
    getInformation () {
      getInformationData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
            this.informationData = data.msgData
            break
        }
      })
    },
    getfileData () {
      return this.aptitude
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    // 取消上传
    cancelFile () {
      this.isAddModal = false
      this.fileList = []
      this.$refs.aptitude.resetFields() // 清空
    },

    // 上传成功
    uploadSuccess (res, file, fileList1) {
      if (res.msgCode === 0) {
        this.cancelFile()
        this.getInformation()
        this.$Message.success('上传成功')
      } else {
        this.$message.error('上传失败')
      }
    },
    // 上传失败
    uploadError (err, file) {
      this.fileList = []
      this.$refs.aptitude.resetFields() // 清空
      this.$message.error('上传失败')
    },
    // 编辑数据回显
    echoData (index) {
      this.isEditModal = true
      this.urlSrc = this.informationData[index].url
      this.editAptitude.name = this.informationData[index].name
      this.editAptitude.expiredDate = this.informationData[index].expiredDate
      this.editAptitude.awardOgr = this.informationData[index].awardOgr
      this.editAptitude.id = this.informationData[index].id
    },
    // 编辑数据
    editGetfileData () {
      return this.editAptitude
    },
    // 自定义上传方法
    addAttachment (file) {
      this.files = file.file
    },
    // 编辑提交
    editSubmitUpload () {
      var formData = new FormData()
      formData.append('file', this.files)
      formData.append('name', this.editAptitude.name)
      formData.append('expiredDate', this.editAptitude.expiredDate)
      formData.append('awardOgr', this.editAptitude.awardOgr)
      formData.append('id', this.editAptitude.id)
      editInformationData(formData).then(res => {
      })
    },
    // 取消编辑
    editCancelFile () {
      this.isEditModal = false
      this.editFileList = []
      this.$refs.editAptitude.resetFields() // 清空
    },

    // 编辑上传成功
    editUploadSuccess (res, file, fileList) {
      if (res.msgCode === 0) {
        this.editCancelFile()
        this.getInformation()
        this.$Message.success('上传成功')
      } else {
        this.$message.error('上传失败')
      }
    },
    // 编辑上传失败
    editUploadError (err, file) {
      this.editFileList = []
      this.$refs.editAptitude.resetFields() // 清空
      this.$message.error('上传失败')
    },
    // 删除
    deleteinformation (id, index) {
      deleteinformationData(id).then(res => {
        if (res.status === 200) {
          const data = res.data
          if (data.msgCode === 0) {
            this.getInformation()
            this.informationData.splice(index, 1)
            this.$Message.success(data.msgContent)
          } else {
            this.$Message.error(data.msgContent)
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },
    // 工作职责弹框关闭
    cancel () {
      this.isDutyWork = false
    }
    // 工作职责弹框确定
    // preserve () {
    //   console.log(this.deptName, this.jobName)
    //   let arr = JSON.parse(localStorage.getItem('projectId'))
    //   var job = ''
    //   this.jobWork.forEach(item => {
    //     if (item.department.name === this.deptName) {
    //       item.roles.forEach(res => {
    //         if (res.id === this.jobName) {
    //           job = res.name
    //         }
    //       })
    //     }
    //   })
    //   this.information.dutyWork = this.deptName + '---' + job
    //   this.cancel()
    //   this.$store.dispatch('getMenuData')
    // },
  },
  mounted () {
    this.getUser()
  },
  created () {
    if (this.$route.query.status) {
      this.status = JSON.parse(this.$route.query.status)
    } else {
      this.status = false
    }
  },
  computed: {
    headers () {
      return {
        Authorization: this.token // 直接从本地获取token就行
      }
    }
  }
}
</script>
<style lang="less" scoped>
.checkBox {
}
.toolTip {
  position: absolute;
  // top: -34px;
  right: -140px;
  color: #409eff;
}
.formItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.formItem .bottom20 {
  width: 450px;
}
.item {
  height: 40px;
  width: 350px;
  line-height: 40px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #657180;
}
</style>

<template>
  <Card style="height: 100%">
    <Button class="search-btn" type="primary" @click="isAddModal=true">新建会议类别</Button>
    <br><br>
    <!--新建会议类别弹框-->
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
    <!--表格-->
    <Table ref="tables" border
           :data="tableData"
           :columns="columns">
    </Table>
    <!--编辑会议类别弹框-->
    <Modal
      title="编辑会议类别"
      v-model="isEditModal"
      :mask-closable="false">
      <Form
        inline
        ref="editMeetingData"
        :model="editMeetingData"
        :rules="editRules"
        :label-width="100">
        <FormItem label="会议类别名称" prop="categoryName">
          <Input v-model="editMeetingData.categoryName" style="width:350px" :maxlength="15"></Input>
        </FormItem>
        <FormItem label="序号" prop="orderId">
          <Input v-model="editMeetingData.orderId" style="width:350px" :maxlength="15"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="editMeetingCategory">保存</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
  import {
    deletedCategory,
    getAllCategory,
    addCategory,
    editCategory
  } from '@/api/meeting/meetingCategory'
  import {paramsValidate} from '@/libs/util'

  export default {
    name: 'meetingCategory',
    data() {
      return {
        isAddModal: false,    //新建弹框
        isEditModal: false,   //编辑弹框
        addMeetingData: {     //新建数据
          categoryName: "",
        },
        editMeetingData: {     //编辑数据
          categoryName: "",
          orderId: "",
          id: ""
        },
        rules: {              //新建输入框验证
          categoryName: [{
            required: true,
            message: '请填写会议名称',
            trigger: 'blur'
          }],
        },
        editRules: {
          categoryName: [{
            required: true,
            message: '会议名称不能为空',

          }],
          orderId: [
            {
              required: true,
              message: '序号不能为空',
            },
            {
              pattern: /^(\+?[1-9]\d{0,2}|\+?1000)$/,
              message: '请输入正整数序号且系统最大数为1000'
            }
          ]

        },
        tableData: [],
        columns: [
          {
            type: 'index',
            width: 50,
            align: 'center',
          },
          {
            title: '类别名称',
            key: 'name'
          },
          {
            title: '创建日期',
            key: 'gmtCreate',
            width: 100
          },
          {
            title: '排序',
            key: 'orderId',
            width: 100
          },
          {
            title: '操作',
            key: 'handle',
            width: 130,
            render: (h, params, vm) => {
              return [
                //编辑按钮
                [h('Button', {
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
                },"编辑")],
                //删除按钮
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '你确定要删除吗?',
                    placement: 'left-end',
                    size: 'small',
                  },
                  on: {
                    'on-ok': () => {
                      this.deletedMeetingCategory(params.row.id, params.index)
                    }
                  }
                },
                [h('Button', {
                    props:{
                      type: 'error',
                      size: 'small'
                    },
                  },"删除")])
              ]
            },
          },
        ],
      }
    },
    methods: {
      //获取全部数据
      getCategory() {
        getAllCategory(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
          if(res.status===200){
            const data = res.data
            if (data.msgCode === 0) {
              if(data.msgData){
                this.tableData = data.msgData
              }
            } else {
              this.$Message.error(data.msgContent)
            }
          }else {
            this.$Message.error("服务器繁忙请稍后")
          }
        })
      },
      //删除会议类别
      deletedMeetingCategory(id, index) {
        deletedCategory(id).then(res => {
          if(res.status===200){
            const data = res.data
            if (data.msgCode === 0) {
              this.tableData.splice(index, 1)
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
                  this.getCategory()
                  this.isAddModal = false
                  this.cancel(1)
                  this.$Message.success(data.msgContent);
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
      //关闭弹框并清空
      cancel(status) {
        if (status === 1) {
          this.isAddModal = false
          this.$refs.addMeetingData.resetFields();
        } else {
          this.isEditModal = false
          this.$refs.addMeetingData.resetFields();
        }
      },
      //编辑数据回显
      echoData(index) {
        this.isEditModal = true
        this.editMeetingData.categoryName = this.tableData[index].name
        this.editMeetingData.orderId = this.tableData[index].orderId
        this.editMeetingData.id = this.tableData[index].id
      },
      //  编辑会议类别
      editMeetingCategory() {
        if (paramsValidate(this.editMeetingData) && /^\d+$/.test(this.editMeetingData.orderId)) {
          const editData = {
            "name": this.editMeetingData.categoryName,
            "orderId": this.editMeetingData.orderId,
            "id": this.editMeetingData.id
          }
          editCategory(editData).then(res => {
            if(res.status===200){
              const data = res.data
              if (data.msgCode === 0) {
                this.getCategory()
                this.isEditModal = false
                this.$Message.success(data.msgContent);
              } else {
                this.$Message.error(data.msgContent)
              }
            }else {
              his.$Message.error("服务器繁忙请稍后")
            }
          })
        }
      }
    },
    mounted() {
      this.getCategory()
    }
  }
</script>

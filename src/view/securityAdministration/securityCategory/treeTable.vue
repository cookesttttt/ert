<template>
  <div style="height: 100%">
    <Card style="height: 100%">
      <div v-if="treeNode.length" style="font-size: 13px;margin-bottom: 10px"><span style='font-weight: bold'>当前类别：</span>{{treeNode[0].title}}</div>
      <ButtonGroup>
        <Button class="search-btn" type="primary" @click="Modal">新建子类别</Button>
        <Button class="search-btn"  @click="clickEditor" :disabled ="treeNode[0].isRoot">编辑</Button>
      </ButtonGroup>
      <br><br>
      <!--新建子目录弹框-->
      <Modal title="新建子类别" v-model="isAddModal"
             @on-cancel="cancel(1)"
             :mask-closable="false">
        <Form ref="directory" inline
              :model="directory"
              :label-width="100"
              :rules="rules">
          <FormItem label="类别名称" prop="dirName">
            <Input
              placeholder="请输入类别名称"
              v-model="directory.dirName"
              style="width:350px"
              :maxlength="15">
            </Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel(1)">取消</Button>
          <Button type="primary" size="large" @click="addDirectory">保存</Button>
        </div>
      </Modal>

      <Modal title="修改选中类别名称" v-model="isdocName" :mask-closable="false"  @on-cancel="cancel(2)">
        <Form ref="editdoc" inline :model="docName" :label-width="100" :rules="editRules">
          <FormItem label="类别名称" prop="name">
            <Input
              placeholder="请输入类别名称"
              v-model="docName.name"
              style="width:350px"
              :maxlength="15"
            ></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="cancel(2)">取消</Button>
          <Button type="primary" size="large" @click="editdocName">保存</Button>
        </div>
      </Modal>
      <!--表格-->
      <Table border ref="tables"
             :data="dirs"
             :columns="columns">
      </Table>
      <!--编辑目录弹框-->
      <Modal
        title="编辑类别"
        v-model="isEditModal"
        :mask-closable="false">
        <Form ref="editData" inline
              @on-cancel="cancel(2)"
              :rules="editRules"
              :model="editData"
              :label-width="100">
          <FormItem label="类别名称" prop="name">
            <Input v-model="editData.name" style="width:350px" :maxlength="15" placeholder="输入框不能为空"></Input>
          </FormItem>
          <FormItem label="排序" prop="orderId">
            <Input v-model="editData.orderId" style="width:350px" :maxlength="15" placeholder="输入框不能为空"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"    size="large"  @click="cancel">取消</Button>
          <Button type="primary" size="large"  @click="editDirectory">保存</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  import { getTableData,newCategory,deleteTableData,editTableData } from '@/api/securityAdministration/securityCategory'
    export default {
     name: "treeTable",
     props: ['treeNode', 'dirs'], // dirs表格在组件中的数据  treeNode被选中树的节点
      data () {

        return {
          isdocName:false,
          docName:{
            id:'',
            name:'',
            orderId:'',
            parentId:'',
            projectId:JSON.parse(localStorage.getItem('projectId')).id
          },
          // 新建输入框的非空验证
          rules: {
            dirName:
              [{
                required: true,
                message: '请填写类别名称',
                trigger: 'blur'
              }]
          },
          // 修改输入框的验证
          editRules: {
            name: [{
              required: true,
              message: '类别名称不能为空'

            }],
            orderId: [
              {
                required: true,
                message: '序号不能为空'
              },
              {
                pattern: /^(\+?[1-9]\d{0,2}|\+?1000)$/,
                message: '请输入正整数序号且系统最大数为1000'
              }
            ]
          },
          tableData: [], // 表格数据
          isAddModal: false, // 新建弹框
          isEditModal: false, // 编辑弹框
          // 新建类别数据
          directory: {
            dirName: ''
          },
          // 编辑类别数据
          editData: {
            name: '',
            orderId: '',
            parentId: '',
            projectId:JSON.parse(localStorage.getItem("projectId")).id
          },
          columns: [
            { type: 'index', width: 50, align: 'center',},
            { title: '子类别名称', key: 'name',},
            { title: '创建日期', key: 'createTime', width: 120, },
            { title: '排序', key: 'orderId', width: 100 },
            {
              title: '操作',
              key: 'handle',
              width: 130,
              render: (h, params, vm) => {
                return [
                  // 编辑按钮
                  [h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.dataEcho(params.index)
                      }
                    },
                    style: {
                      marginRight: '5px'
                    }
                  }, '编辑')],
                  // 删除按钮
                  h('Poptip', {
                      props: {
                        confirm: true,
                        transfer: true,
                        title: '你确定要删除吗?',
                        placement: 'left-end',
                        size: 'small'
                      },
                      // 删除二次确定事件
                      on: {
                        'on-ok': () => {
                          if (this.treeNode) {
                            console.log(params.row)
                            this.rmdir(params.row.id, params.index)
                          } else {
                            this.$Message.error('请选择删除的主类别')
                          }
                        }
                      }
                    },
                    [h('Button', {
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
      methods: {
        clickEditor(){
          console.log(this.treeNode)
          this.isdocName=true
          this.docName.name=this.treeNode[0].title
          this.docName.id=this.treeNode[0].id
          //后台修改
          this.docName.orderId=this.treeNode[0].orderId
          this.docName.parentId=this.treeNode[0].parentId
          console.log(this.treeNode)
        },
        editdocName(){
          console.log(this.docName)
          this.$refs.editdoc.validate((valid) => {
            if(valid){
              editTableData(this.docName).then(msg => {
                if (msg.status === 200) {
                  const data = msg.data
                  if (data.msgCode === 0) {
                    this.$Message.success(data.msgContent)
                    this.isdocName = false
                    this.treeNode[0].title= this.docName.name
                    console.log(msg.data)
                  } else {
                    this.$Message.error(data.msgContent)
                  }
                } else {
                  this.$Message.error('服务器繁忙请稍后')
                }
              })
            }
          })

        },
        Modal () {
          if (this.treeNode) {
            this.isAddModal = true
          } else {
            this.$Message.error('请选择类别')
          }
        },
        // 删除类别
        rmdir (id, index) {
          console.log(id)
          deleteTableData(id).then(res => {
            if (res.status === 200) {
              const data = res.data
              console.log(data)
              if (data.msgCode === 0) {
                for (let i = 0; i < this.treeNode[0].children.length; i++) {
                  if (id === this.treeNode[0].children[i].id) {
                    this.dirs.splice(index, 1)
                    this.treeNode[0].children.splice(i, 1)
                    this.$Message.success(data.msgContent)
                  }
                }
              } else {
                this.$Message.error(data.msgContent)
              }
            } else {
              this.$Message.error('服务器繁忙请稍后')
            }
          })
        },
        // 编辑数据回显
        dataEcho (index) {
          if (this.treeNode) {
            this.isEditModal = true
            this.editData.name = this.dirs[index].name
            this.editData.orderId = this.dirs[index].orderId
            this.editData.id = this.dirs[index].id
            this.editData.parentId = this.dirs[index].parentId
          } else {
            this.$Message.error('请选择主类别')
          }
        },
        // 编辑
        editDirectory () {
          // 修改非空验证
            this.$refs.editData.validate((valid) => {
               if(valid){
                 editTableData(this.editData).then(msg => {
                   if (msg.status === 200) {
                     const data = msg.data
                     console.log(msg.data)
                     if (data.msgCode === 0) {
                       // 拉一次数据获取表格数据
                       getTableData(JSON.parse(localStorage.getItem("projectId")).id,this.treeNode[0].id).then(res => {
                         const data = res.data
                         console.log(data)
                         if (data) {
                           if (data.msgCode === 0) {
                             for (var i = 0; i < this.treeNode[0].children.length; i++) {
                               if (this.editData.id === this.treeNode[0].children[i].id) {
                                 // 修改树结构的数据，获取的数据传入table中
                                 this.treeNode[0].children[i].title = this.editData.name
                                 console.log(data.msgData)
                                 this.$emit('data', data.msgData)
                                 this.isEditModal = false
                                 this.$Message.success(data.msgContent)
                               }
                             }
                           } else {
                             this.$Message.error(data.msgContent)
                           }
                         }
                       })
                     } else {
                       this.$Message.error(data.msgContent)
                     }
                   } else {
                     this.$Message.error('服务器繁忙请稍后')
                   }
                 })
               }
            })

        },
        // 新建类别addDirectory
        addDirectory () {
          this.$refs.directory.validate((valid) => {
            if (valid) {
              let dir = {}
              dir.parentId = this.treeNode[0].id
              dir.name = this.directory.dirName
              dir.projectId=JSON.parse(localStorage.getItem("projectId")).id
              newCategory(dir).then(msg => {
                if (msg.status === 200) {
                  const data = msg.data
                  console.log(msg.data)
                  if (data.msgCode === 0) {
                    if (data.msgData) {
                      // 给树添加id，表格添加数据
                      console.log(this.treeNode[0])
                      console.log(data.msgData)
                      this.treeNode[0].expand=true
                      this.append(this.treeNode[0],data.msgData)
                      this.dirs.push(data.msgData)
                    }
                    this.isAddModal = false
                    this.$refs.directory.resetFields() // 清空输入框
                    this.$Message.success(data.msgContent)
                  } else {
                    this.$Message.error(data.msgContent)
                  }
                } else {
                  this.$Message.error('服务器繁忙请稍后')
                }
              })
            }
          })
        },
        // 关闭目录
        cancel (status) {
          if (status === 1) {
            this.isAddModal = false
            this.$refs.directory.resetFields()
          } else if(status === 2){
            this.isdocName = false
            this.$refs.editdoc.resetFields()
          }else {
            this.isEditModal = false
            this.$refs.directory.resetFields()
          }
        },
        // 添加方法
        append (data,msgData) {
          const children = data.children || []
          children.push({
            title: this.directory.dirName,
            expand: true,
            id: msgData.id,
            orderId: msgData.orderId,
            parentId: msgData.parentId,
          })
          this.$set(data, 'children', children)
        },

      },
    }
</script>

<style scoped>

</style>

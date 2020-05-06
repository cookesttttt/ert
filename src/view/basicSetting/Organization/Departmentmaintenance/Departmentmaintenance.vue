<template>
  <Row :gutter="10" style="height:100%">
    <!--树形控件-->
    <Col span="5" style="height:100%">
      <Card class="card">
        <Tree ref="tree" id="tree" :data="treeData" :render="renderContent"></Tree>
      </Card>
    </Col>
    <Col span="19" style="height:100%">
      <Card class="card">
        <Button type="primary" :disabled="isremove" @click="echoData(treeSelectData)">编辑</Button>
        <Poptip
          confirm
          title="你确定要删除吗??"
          @on-ok="deleteDepartmentSelet(treeSelectData.id)"
          placement="bottom"
        >
          <Button type="error" style="margin:0 10px" :disabled="isremove">删除</Button>
        </Poptip>

        <Button
          class="search-btn"
          type="primary"
          @click="clickAddButton"
          :disabled="isForbidden"
        >&nbsp;增建下级部门</Button>
        <br />
        <br />
        <!--新建部门弹框-->
        <Modal title="新建下级部门" v-model="isAddModal" @on-cancel="cancel(1)" :mask-closable="false">
          <Form
            inline
            ref="newDepartmentalData"
            :model="newDepartmentalData"
            :label-width="100"
            :rules="rules"
          >
            <FormItem label="部门名称" prop="name">
              <Input v-model="newDepartmentalData.name" style="width:350px" :maxlength="15"></Input>
            </FormItem>
            <br />
            <FormItem label="部门描述">
              <Input v-model="newDepartmentalData.des" style="width:350px" :maxlength="15"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel(1)">取消</Button>
            <Button type="primary" size="large" @click="addDepartment">保存</Button>
          </div>
        </Modal>
        <!--表格-->
        <Table border ref="tables" :data="tableData" :columns="columns"></Table>
        <!--编辑弹框-->
        <Modal title="编辑部门" v-model="isEditModal" :mask-closable="false">
          <Form
            inline
            ref="editDepartmentalData"
            :model="editDepartmentalData"
            :rules="rules"
            :label-width="100"
          >
            <FormItem label="部门名称" prop="name">
              <Input v-model="editDepartmentalData.name" style="width:350px" :maxlength="15"></Input>
            </FormItem>
            <br />
            <FormItem label="部门描述">
              <Input v-model="editDepartmentalData.des" style="width:350px" :maxlength="15"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel">取消</Button>
            <Button type="primary" size="large" @click="editorialDepartment">保存</Button>
          </div>
        </Modal>
      </Card>
    </Col>
  </Row>
</template>

<script>
import { isDataSuccess } from '@/libs/util' // 验证对象是否为空
import {
  getAlltreeData,
  deleteDepartmentData,
  addDepartmentData,
  editorialDepartmentData,
  getOwnDept
} from '@/api/basicSetting/Departmentmaintenance'

export default {
  name: 'Departmentmaintenance',
  data () {
    return {
      isAddModal: false, // 新建部门弹框
      isEditModal: false, // 编辑部门弹框
      tableData: [], // 表格数据
      treeData: [], // 树结构数据
      treeNode: '', // 选中树的节点
      treeNodeId: '',
      treeSelectData: '', // 选中的树节点数据
      treeSelectNode: '', // 选中的树节点数据
      treeSelectRoot: '', // 选中的树节点数据
      isForbidden: false,
      isremove: false,
      newDepartmentalData: {
        name: '', // 新建部门名称
        des: '' // 新建部门描述
      },
      editDepartmentalData: {
        id: '', // 编辑当前数据的Id
        name: '', // 编辑部门名称
        des: '' // 编辑部门描述
      },
      station: [], // 全部岗位
      rules: {
        name: [
          // 部门名称的非空验证
          {
            required: true,
            message: '请填写部门名称',
            trigger: 'blur'
          }
        ]
      },
      columns: [
        {
          title: '#',
          type: 'index',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '下级部门名称',
          key: 'name',
          fixed: 'left'
        },
        {
          title: '描述',
          key: 'des'
        },
        {
          title: '上级部门',
          key: 'parentDept',
          render: (h, params) => {
            return h('div', this.treeSelectData.name)
          }
        },
        {
          title: '操作',
          key: 'handle',
          width: 130,
          fixed: 'right',
          render: (h, params, vm) => {
            return [
              [
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
                        this.echoData(params.row)
                      }
                    },
                    style: {
                      marginRight: '5px'
                    }
                  },
                  '编辑'
                )
              ],
              // 删除按钮
              h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '你确定要删除吗?',
                    placement: 'left-end',
                    size: 'small'
                  },
                  on: {
                    'on-ok': () => {
                      this.deleteDepartment(
                        this.tableData[params.index].id
                      )
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
      ]
    }
  },
  methods: {
    renderContent (h, { root, node, data }) {
      if (data.name === '全部') {
        return h(
          'span',
          {
            style: {
              display: 'inline-block',
              width: '90%',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'normal',
              cursor: 'pointer',
              backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey)
                }
                if (data.nodeKey === 0) {
                  this.isForbidden = true
                } else {
                  this.isForbidden = false
                }
                if (data.name === '项目经理办公室') {
                  this.isremove = true
                } else if (data.nodeKey === 0) {
                  this.isremove = true
                } else {
                  this.isremove = false
                }
                this.treeNode = this.$refs.tree.getSelectedNodes()
                this.treeNodeId = this.treeNode[0].id
                if (data.children === null) {
                  this.tableData = []
                } else {
                  this.tableData = data.children
                }
                this.treeSelectData = data
                this.treeSelectNode = node
                this.treeSelectRoot = root
              }
            }
          },
          [
            h('span', [
              h('Icon', {
                props: {
                  type: 'md-person',
                  color: '#2d8cf0'
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h('span', data.name)
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            })
          ]
        )
      } else {
        return h(
          'span',
          {
            style: {
              display: 'inline-block',
              width: '90%',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'normal',
              cursor: 'pointer',
              backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey)
                }
                if (data.nodeKey === 0) {
                  this.isForbidden = true
                } else {
                  this.isForbidden = false
                }
                if (data.name === '项目经理办公室') {
                  this.isremove = true
                } else if (data.nodeKey === 0) {
                  this.isremove = true
                } else {
                  this.isremove = false
                }
                this.treeNode = this.$refs.tree.getSelectedNodes()
                this.treeNodeId = this.treeNode[0].id
                if (data.children === null) {
                  this.tableData = []
                } else {
                  this.tableData = data.children
                }
                this.treeSelectData = data
                this.treeSelectNode = node
                this.treeSelectRoot = root
              }
            }
          },
          [
            h('span', [
              h('span', data.name)
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            })
          ]
        )
      }
    },
    // 点击增加部门
    clickAddButton () {
      // 新增弹框打开
      this.isAddModal = true
    },
    // 新增部门
    addDepartment () {
      this.$refs.newDepartmentalData.validate(valid => {
        if (valid) {
          const data = {
            name: this.newDepartmentalData.name,
            des: this.newDepartmentalData.des
          }
          addDepartmentData(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id, data).then(res => {
            if (res.status === 200) {
              const data = res.data
              if (res.data.msgCode === 0) {
                this.append(this.treeNode[0], res.data.msgData)
                this.cancel(1) // 清空
                this.isAddModal = false
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
    //  添加方法
    append (data, resData) {
      const children = data.children || []
      children.push({
        name: this.newDepartmentalData.name,
        des: this.newDepartmentalData.des,
        expand: true,
        id: resData.id
      })
      this.$set(data, 'children', children)
    },
    // 关闭弹框
    cancel (status) {
      if (status === 1) {
        this.$refs.newDepartmentalData.resetFields() // 清空新建弹框
        this.isAddModal = false
      } else {
        this.$refs.editDepartmentalData.resetFields() // 清空
        this.isEditModal = false
      }
    },
    // 删除部门
    deleteDepartment (id) {
      if (!this.isForbidden) {
        deleteDepartmentData(JSON.parse(localStorage.getItem('projectId')).id, id).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              for (let i = 0; i < this.treeNode[0].children.length; i++) {
                if (id === this.treeNode[0].children[i].id) {
                  this.tableData.splice(i, 1)
                  this.$Message.success(data.msgContent)
                  break
                }
              }
            } else {
              if (data.msgContent === '请先删除部门下的子部门') {
                this.$Message.error('请先删除部门的下级部门')
              } else {
                this.$Message.error(data.msgContent)
              }
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        })
      } else {
        this.$Message.error('项目组织架构不允许删除')
      }
    },
    // 删除部门 选择自己
    deleteDepartmentSelet (id) {
      if (!this.isForbidden) {
        deleteDepartmentData(JSON.parse(localStorage.getItem('projectId')).id, id).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.removeTree(this.treeSelectRoot, this.treeSelectNode, this.treeSelectData)
            } else {
              if (data.msgContent === '请先删除部门下的子部门') {
                this.$Message.error('请先删除部门的下级部门')
              } else {
                this.$Message.error(data.msgContent)
              }
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        })
      } else {
        this.$Message.error('项目组织架构不允许删除')
      }
    },
    // 编辑数据回显
    echoData (data) {
      if (!this.isForbidden) {
        this.editDepartmentalData.name = data.name
        this.editDepartmentalData.des = data.des
        this.editDepartmentalData.id = data.id
        this.isEditModal = true
      } else {
        this.$Message.error('项目组织架构不允许编辑')
      }
    },
    // 编辑部门
    editorialDepartment () {
      this.$refs.editDepartmentalData.validate(valid => {
        if (valid) {
          const data = {
            name: this.editDepartmentalData.name,
            des: this.editDepartmentalData.des
          }
          editorialDepartmentData(JSON.parse(localStorage.getItem('projectId')).id, this.editDepartmentalData.id, data).then(
            res => {
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  break
                case 2:
                  this.$Message.error(res.data.msgContent)
                  break
                default:
                  const data = res.data
                  if (data.msgCode === 0) {
                    for (let i = 0; i < this.treeNode.length; i++) {
                      if (this.editDepartmentalData.id === this.treeNode[i].id) {
                        //  修改树结构的数据，获取的数据传入table中
                        this.treeNode[i].name = this.editDepartmentalData.name
                        this.treeNode[i].des = this.editDepartmentalData.des
                        this.isEditModal = false
                        this.$Message.success(data.msgContent)
                      }
                    }
                    this.isEditModal = false
                    this.$Message.success(data.msgContent)
                  } else {
                    this.$Message.error(data.msgContent)
                  }
              }
            }
          )
        }
      })
    },
    // 设置所有节点展开
    treeChangeExpand (treeData, flag) {
      let _this = this
      for (var i = 0; i < treeData.length; i++) {
        this.$set(treeData[i], 'expand', flag) // 重要！用set方法
        if (treeData[i].children) {
          treeData[i].children = _this.treeChangeExpand(
            treeData[i].children,
            flag
          )
        }
      }
      return treeData
    },
    selectedTree (treeData, name) {
      let _this = this
      for (var i = 0; i < treeData.length; i++) {
        // 重要！用set方法
        if (treeData[i].name === name) {
          this.$set(treeData[i], 'selected', true)
          this.treeNode = this.$refs.tree.getSelectedNodes()
          if (treeData[i].children) {
            this.tableData = treeData[i].children
          } else {
            this.tableData = []
          }
          this.treeNodeId = treeData[i].id
          this.treeSelectData = treeData[i]
        } else if (treeData[i].children) {
          _this.selectedTree(treeData[i].children, name)
        } else {
          this.$set(treeData[i], 'selected', '')
        }
      }
    },
    // 删除后树节点改变
    removeTree (root, node, data) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
    }
  },
  mounted () {
    this.treeData = []
    getAlltreeData(JSON.parse(localStorage.getItem('projectId')).id).then(
      res => {
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
            this.treeData.push(data.msgData)
            // this.treeData[0].selected = true
            // this.treeData[0].expand = true
            this.treeChangeExpand(this.treeData, true)

            // 获取自己所在的部门
            getOwnDept(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
              if (res.data.msgData[0].name === '项目经理办公室') {
                this.isremove = true
              } else {
                this.isremove = false
              }
              this.selectedTree(this.treeData, res.data.msgData[0].name)
            })
            break
        }
      }
    )
  }
}
</script>

<style  lang='less' scoped>
.card {
  height: 100%;
}
</style>

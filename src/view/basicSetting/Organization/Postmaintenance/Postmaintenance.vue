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
        <Button
          class="search-btn"
          type="primary"
          @click="addPost"
          :disabled="isForbidden"
        >&nbsp;新建岗位</Button>
        <br />
        <br />
        <!--新增岗位弹框-->
        <Modal title="新建岗位" v-model="isAddModal" :mask-closable="false" @on-cancel="cancel(1)">
          <Form ref="addJobsData" :model="addJobsData" :label-width="100" inline :rules="rules">
            <FormItem label="岗位名称" prop="name">
              <Input v-model="addJobsData.name" class="width350" :maxlength="15"></Input>
            </FormItem>
            <br />
            <FormItem label="岗位描述">
              <Input v-model="addJobsData.des" class="width350" :maxlength="15"></Input>
            </FormItem>
            <br />
            <FormItem label="工种" prop="deptType">
              <Select
                v-model="addJobsData.deptType"
                class="width350"
                @on-change="getJobsObligation"
              >
                <Option v-for="item in jobClassification" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
            <br />
            <FormItem label="工作职责" prop="obligation">
              <CheckboxGroup v-model="addJobsData.obligation">
                <Checkbox v-for="item in jobDuties" :label="item.id">{{item.name}}</Checkbox>
              </CheckboxGroup>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel(1)">取消</Button>
            <Button type="primary" size="large" @click="addJob">保存</Button>
          </div>
        </Modal>
        <!--表格数据-->
        <Table border ref="tables" :data="tableData" :columns="columns"></Table>
        <!--编辑岗位弹框-->
        <Modal title="编辑岗位" v-model="isEditModal" @on-cancel="cancel" :mask-closable="false">
          <Form ref="editJobsData" :model="editJobsData" :label-width="100" inline :rules="rules">
            <FormItem label="岗位名称" prop="name">
              <Input v-model="editJobsData.name" class="width350" :maxlength="15"></Input>
            </FormItem>
            <br />
            <FormItem label="岗位描述">
              <Input v-model="editJobsData.des" class="width350" :maxlength="15"></Input>
            </FormItem>
            <br />
            <FormItem label="工种" prop="deptType">
              <Select
                v-model="editJobsData.deptType"
                class="width350"
                @on-change="editJobsObligationer"
              >
                <Option v-for="item in jobClassification" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
            <br />
            <FormItem label="工作职责">
              <el-checkbox-group v-model="obligation">
                <el-checkbox v-for="item in editJobDuties" :label="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel">取消</Button>
            <Button type="primary" size="large" @click="editJobs">保存</Button>
          </div>
        </Modal>
      </Card>
    </Col>
  </Row>
</template>

<script>

import { isDataSuccess } from '@/libs/util' // 验证对象是否为空
import {
  deleteJobsData,
  getJobsObligationData,
  newJobsData,
  getEditJobsData,
  jobsType,
  getAlltreeData,
  getTableData
} from '@/api/basicSetting/Postmaintenance'
import { getOwnDept } from '@/api/basicSetting/Departmentmaintenance'
export default {
  name: 'Departmentmaintenance',
  data () {
    return {
      treeSelectData: '',
      isAddModal: false,
      isEditModal: false,
      tableData: [],
      treeData: [], // 树结构数据
      treeNode: '', // 选中树的节点
      treeNodeId: '',
      isForbidden: false,
      addJobsData: {
        name: '',
        des: '',
        deptType: '',
        obligation: []
      },
      editJobsData: {
        name: '',
        des: '',
        deptType: '',
        id: ''
      }, // 编辑数据
      obligation: [],

      jobClassification: [], // 岗位分类
      jobDuties: [], // 工作职责
      editJobClassification: [], // 编辑岗位分类
      editJobDuties: [], // 编辑的工作职责
      rules: {
        name: [ // 岗位名称非空验证
          {
            required: true,
            message: '请填写岗位名称',
            trigger: 'blur'
          }
        ],
        deptType: [ // 岗位分类非空验证
          {
            required: true,
            message: '请填写岗位分类',
            trigger: 'change',
            type: 'string'
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
          title: '岗位名称',
          width: 170,
          key: 'name',
          fixed: 'left'
        },

        {
          title: '所属部门',
          key: 'deptName',
          width: 135
        },
        {
          title: '工种',
          key: 'deptType'
        },
        {
          title: '工作职责',
          key: 'jobContents',
          tooltip: true
        },
        {
          title: '描述',
          key: 'des'
        },
        {
          title: '操作',
          key: 'handle',
          width: 130,
          fixed: 'right',
          render: (h, params, vm) => {
            return [
              // 编辑按钮
              [h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                // 修改岗位
                on: {
                  'click': () => {
                    if (params.row.name === '项目经理') {
                      this.$Message.error('项目经理不能被编辑')
                    } else {
                      this.echoData(params.row)
                    }
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
                on: {
                  // 删除岗位
                  'on-ok': () => {
                    if (params.row.name === '项目经理') {
                      this.$Message.error('项目经理不能被删除')
                    } else {
                      this.deleteJobs(params.row.id, params.index)
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
    renderContent (h, { root, node, data }) {
      if (data.name === '全部') {
        return h('span', {
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
              this.treeNode = this.$refs.tree.getSelectedNodes()
              this.treeNodeId = this.treeNode[0].id
              this.treeSelectData = data
              if (this.treeNodeId === -1) {
                this.tableData = []
              } else {
                this.getTable(data.id)
              }
            }
          }
        }, [
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
        ])
      } else {
        return h('span', {
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
              this.treeNode = this.$refs.tree.getSelectedNodes()
              this.treeNodeId = this.treeNode[0].id
              this.treeSelectData = data
              if (this.treeNodeId === -1) {
                this.tableData = []
              } else {
                this.getTable(data.id)
              }
            }
          }
        }, [
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
        ])
      }
    },
    // 删除部门
    deleteJobs (id, index) {
      if (!this.isForbidden) {
        deleteJobsData(JSON.parse(localStorage.getItem('projectId')).id, id).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.tableData.splice(index, 1)
              this.$Message.success(data.msgContent)
            } else {
              this.$Message.error(data.msgContent)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        })
      } else {
        this.$Message.error('项目组织架构不允许删除')
      }
    },
    // 新增按钮
    addPost () {
      this.isAddModal = true
    },
    // 获取工作职责
    getJobsObligation (val) {
      if (val) {
        getJobsObligationData(val).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.jobDuties = data.msgData
              this.addJobsData.obligation = []
            } else {
              this.$Message.error(data.msgContent)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        })
      } else {
        this.jobDuties = []
      }
    },
    // 添加岗位
    addJob () {
      this.$refs.addJobsData.validate((valid) => {
        if (valid) {
          const data = {
            'name': this.addJobsData.name,
            'des': this.addJobsData.des,
            'departmentId': this.treeNodeId,
            'deptType': this.addJobsData.deptType,
            'workContentIds': this.addJobsData.obligation
          }
          newJobsData(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
            if (res.status === 200) {
              const data = res.data
              if (data.msgCode === 0) {
                this.cancel(1)
                this.getTable(this.treeSelectData.id)
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
    cancel (status) {
      if (status === 1) {
        this.$refs.addJobsData.resetFields() // 清空
        this.isAddModal = false
      } else {
        this.$refs.editJobsData.resetFields() // 清空
        this.isEditModal = false
      }
    },
    // 数据回显
    echoData (data) {
      this.isEditModal = true
      this.editJobsData.name = data.name
      this.editJobsData.des = data.des
      this.editJobsData.deptType = data.deptType
      this.editJobsData.id = data.id
      // 回显获取工作职责
      if (this.editJobsData.deptType) {
        getJobsObligationData(this.editJobsData.deptType).then(res => {
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
                this.editJobDuties = data.msgData
              } else {
                this.$Message.error(data.msgContent)
              }
          }
        })
      } else {
        this.editJobDuties = []
      }
      this.obligation = []
      this.obligation = data.contents
      let obligationcontent = []
      this.obligation.forEach(res => {
        obligationcontent.push(res.id)
      })
      this.obligation = obligationcontent
    },
    // 编辑获取工作职责
    editJobsObligationer (val) {
      if (val) {
        getJobsObligationData(val).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.editJobDuties = data.msgData
              this.obligation = []
            } else {
              this.$Message.error(data.msgContent)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        })
      } else {
        this.editJobDuties = []
      }
    },
    // 获取表格数据
    getTable (roleId) {
      getTableData(JSON.parse(localStorage.getItem('projectId')).id, roleId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(data.msgContent)
            break
          default:
            res.data.msgData.forEach(data => {
              data.deptName = this.treeSelectData.name
              if (data.contents) {
                let str = ''
                data.contents.forEach(job => {
                  str += job.name + '、' + ' '
                })
                data.jobContents = str
              }
            })
            this.tableData = res.data.msgData
            break
        }
      })
    },
    // 编辑岗位
    editJobs () {
      const data = {
        'name': this.editJobsData.name,
        'des': this.editJobsData.des,
        'departmentId': this.treeNodeId,
        'deptType': this.editJobsData.deptType,
        'workContentIds': this.obligation
      }
      getEditJobsData(JSON.parse(localStorage.getItem('projectId')).id, this.editJobsData.id, data).then(res => {
        isDataSuccess(res, this.$Message)
        if (res.status === 200) {
          const data = res.data
          if (data.msgCode === 0) {
            this.getTable(this.treeSelectData.id)
            this.isEditModal = false
            this.$Message.success(data.msgContent)
          } else {
            this.$Message.error(data.msgContent)
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },
    // 树节点全部展开
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
    // 设置默认选中
    selectedTree (treeData, name) {
      let _this = this
      for (var i = 0; i < treeData.length; i++) {
        // 重要！用set方法
        if (treeData[i].name === name) {
          this.$set(treeData[i], 'selected', true)
          this.treeNode = treeData[i]
          this.treeNodeId = treeData[i].id
          this.treeSelectData = treeData[i]
          _this.getTable(treeData[i].id)
        } else if (treeData[i].children) {
          _this.selectedTree(treeData[i].children, name)
        } else {
          this.$set(treeData[i], 'selected', '')
        }
      }
    }
  },
  mounted () {
    this.treeData = []
    getAlltreeData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
          this.treeChangeExpand(this.treeData, true)
          jobsType().then(res => {
            this.jobClassification = res.data.msgData
          })
          // 获取自己所在的部门
          getOwnDept(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            this.selectedTree(this.treeData, res.data.msgData[0].name)
          })
          break
      }
    })
  }
}
</script>

<style lang="less" scoped>
.width350 {
  width: 350px;
}

.page {
  margin: 10px;
  overflow: hidden;
}

.right {
  float: right;
}

.card {
  height: 100%;
}
</style>

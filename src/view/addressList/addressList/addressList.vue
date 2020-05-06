<template>
  <Row
    class="big-box"
    :gutter="10"
  >
    <Col
      :lg="5"
      :xxl="4"
    >
    <card class="card">
      <Tree
        ref="tree"
        id="tree"
        :data="treeData"
        :render="renderContent"
      ></Tree>
    </card>
    </Col>
    <Col span="14">
    <card class="left-box card">
      <p slot="title">
        <span>项目部通讯录</span>
      </p>
      <Input
        icon="ios-search"
        placeholder="搜索"
        style="width: auto;marginRight:20px"
        slot="extra"
        v-model="search"
        @on-enter="searchColleague"
        @on-blur="searchColleague"
      />
      <Button
        type="primary"
        slot="extra"
        @click="addPerson()"
        style="marginRight:10px"
      >添加更多同事</Button>

      <Table
        border
        :columns="columns1"
        :data="data1"
        :loading="loading"
      ></Table>
      <div class="pageBox">
        <div class="page">
          <Page
            :total="totalElements"
            show-total
            :current="pageNum"
            :page-size="pageSize"
            @on-change="changePages"
          />
        </div>
      </div>
    </card>
    </Col>
    <Col span="5">
    <card
      class="right-box card"
      :bordered="false"
    >
      <p slot="title">最近加入</p>
      <Table
        :columns="columns2"
        :data="latest"
        width="230"
      ></Table>
    </card>
    </Col>

    <!-- 添加项目部同事 -->
    <Modal
      v-model="modal1"
      title="添加项目部同事"
      @on-ok="ok('formItem')"
      @on-cancel="cancel"
    >
      <Form
        ref="formItem"
        :model="formItem"
        :label-width="80"
        :rules="ruleForm"
      >
        <FormItem
          label="姓名"
          prop="name"
        >
          <Input v-model="formItem.name"></Input>
        </FormItem>
        <FormItem
          label="手机号码"
          prop="phone"
        >
          <Input v-model="formItem.phone"></Input>
        </FormItem>
        <FormItem
          label="部门"
          prop="department"
        >
          <Select
            v-model="formItem.department"
            placeholder="请选择部门"
            @on-change="changeDepartment"
          >
            <Option
              v-for="item in departmentList"
              :value="item.name"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="岗位"
          prop="station"
        >
          <Select
            v-model="formItem.station"
            placeholder="请选择岗位"
          >
            <Option
              v-for="item in stationList"
              :value="item.name"
              :key="item.id"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem
          label="短信邀请"
          prop="isphone"
        >
          <Select v-model="formItem.isphone">
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          size="large"
          @click="cancel"
        >取消</Button>
        <Button
          type="primary"
          size="large"
          @click="ok"
        >保存</Button>
      </div>
    </Modal>

    <!-- 邀请同事 -->
    <Modal
      v-model="modal2"
      title="邀请同事"
      @on-ok="callphone"
    >
      <p>我们会给Ta发送一条邀请短信，确定邀请?</p>
    </Modal>
  </Row>
</template>
<script>
import { isDataSuccess } from '@/libs/util'
import { getOwnDept } from '@/api/basicSetting/Departmentmaintenance'
import {
  latest,
  allteamers,
  getTree,
  getdepartment,
  getRoles,
  addColleague,
  sectionColleague,
  searchColleague,
  manualInvited,
  getOwnSection
} from '@/api/addressList/addressList'
export default {
  data () {
    return {
      columns1: [
        {
          title: '#',
          width: 50,
          fixed: 'left',
          align: 'center',
          type: 'index'
        },
        {
          title: '姓名',
          key: 'realname',
          align: 'center',
          width: 80,
          fixed: 'left'
        },
        {
          title: '手机号码',
          key: 'phone',
          align: 'center',
          width: 130,
          fixed: 'left'
        },
        {
          title: '部门',
          key: 'dept',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.dept.join('、'))
          },
          width: 150
        },
        {
          title: '岗位',
          key: 'job',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.job.join('、'))
          },
          width: 120
        },

        {
          title: '加入时间',
          key: 'joinDate',
          align: 'center',
          width: 120
        },
        {
          title: '邀请人',
          key: 'invitor',
          align: 'center',
          width: 100
        },
        {
          title: '加入状态',
          key: 'state',
          width: 120,
          fixed: 'right',
          render: (h, params) => {
            if (params.row.state === 1) {
              return h('span', {
                style: {
                  backgroundColor: '#00ff00',
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  borderRadius: '10px'
                }
              })
            } else {
              return h(
                'div',
                {
                  style: {
                    width: '100px'
                  }
                },
                [
                  h('span', {
                    style: {
                      backgroundColor: '#c9c9c9',
                      display: 'inline-block',
                      width: '20px',
                      height: '20px',
                      borderRadius: '10px'
                    }
                  }),
                  h(
                    'Button',
                    {
                      style: {
                        marginLeft: '5px'
                      },
                      props: {
                        type: 'default',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.teamerId = params.row.id
                          this.projectId = params.row.projectId
                          this.modal2 = true
                        }
                      }
                    },
                    '邀请ta'
                  )
                ]
              )
            }
          }
        }
      ], // 所有联系人
      teamerId: '',
      projectId: '',
      ruleForm: {
        // 规则
        name: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '手机号码不能为空',
            trigger: 'blur'
          }
        ],
        department: [
          {
            required: true,
            message: '部门必选哦',
            trigger: 'change',
            type: 'string'
          }
        ],
        station: [
          {
            required: true,
            message: '岗位必选哦',
            trigger: 'change',
            type: 'string'
          }
        ],
        isphone: [
          {
            required: true,
            message: '是否短信邀请必选哦',
            trigger: 'change',
            type: 'string'
          }
        ]
      },
      columns2: [
        {
          title: '姓名',
          width: 80,
          align: 'center',
          fixed: 'left',
          key: 'realname'
        },
        {
          title: '手机号码',
          align: 'center',
          width: 130,
          key: 'phone'
        }
      ], // 最近联接
      modal2: false,
      modal1: false, // 弹出框
      treeData: [{ name: '全部', children: [], expand: true }], // 树状图
      teamId: '',
      data1: [], // 表格
      latest: [], // 最近联接
      formItem: {
        // 表单
        name: '',
        phone: '',
        department: '',
        station: '',
        isphone: '1'
      },
      treeSelect: '全部', // 被选中的树形图
      departmentList: [], // 部门数组
      stationList: [], // 部门数组
      pageNum: 1, // 第几页
      totalElements: 0, // 总条数
      pageSize: 10, // 一页几条
      loading: false, // 等待效果
      search: '' // 搜索
    }
  },
  created () {
    // 获取最近连接的用户
    this.loading = true
    let arr = JSON.parse(localStorage.getItem('projectId'))
    let id = arr.id
    latest(id).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.latest = res.data.msgData
          break
      }
    })
    // 获取树结构
    getTree(id)
      .then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            if (res.data.msgData == null) {
              // this.$router.go(-1)
              // this.$Message.error('暂未加入通讯录，请加入后再使用')
            } else {
              this.treeData[0].children = res.data.msgData
              this.treeChangeExpand(this.treeData, true)
              this.teamId = res.data.msgData.teamId
              getOwnDept(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
                this.selectedTree(this.treeData, res.data.msgData[0].name)
              })
            }
            break
        }
      })
      .then(() => {
        getOwnSection(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
          console.log(res)
        })
        // 获取数据
        this.getAllitemData()
      })
    // 获取所有项目部成员
  },
  methods: {
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
          this.treeSelect = treeData[i].name
          if (treeData[i].name === '全部') {
            this.loading = true
            this.pageNum = 1
            this.getAllitemData()
          } else {
            this.loading = true
            this.pageNum = 1
            this.getsectionColleague()
          }
        } else if (treeData[i].children) {
          _this.selectedTree(treeData[i].children, name)
        } else {
          this.$set(treeData[i], 'selected', '')
        }
      }
    },
    // 添加同事保存
    ok () {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          let arr = JSON.parse(localStorage.getItem('projectId'))
          let id = arr.id
          let data = {
            teamId: this.teamId,
            realname: this.formItem.name,
            phone: this.formItem.phone,
            dept: this.formItem.department,
            job: this.formItem.station,
            projectId: id,
            isPhone: this.formItem.isphone
          }
          console.log(data)

          this.loading = true
          addColleague(data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                this.loading = true
                break
              case 2:
                console.log(res.data.msgContent)
                this.$Message.error(res.data.msgContent)
                this.loading = false
                break
              default:
                this.getAllitemData()
                this.$refs.formItem.resetFields()
                this.modal1 = false
                this.$Message.success('添加成功!')
                break
            }
          })
        } else {
          this.$Message.error('添加失败!')
        }
      })
    },
    // 邀请他
    callphone () {
      manualInvited(this.projectId, this.teamerId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.$Message.success(res.data.msgContent)
            break
        }
      })
    },
    cancel () {
      this.modal1 = false
      this.$refs.formItem.resetFields()
    },
    // 左侧树形数组
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
              whiteSpace: 'nowrap',
              backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey)
                }
                this.treeSelect = data.name
                if (data.name === '全部') {
                  this.loading = true
                  this.pageNum = 1
                  this.getAllitemData()
                } else {
                  this.loading = true
                  this.pageNum = 1
                  this.getsectionColleague()
                }
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
              whiteSpace: 'nowrap',
              backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey)
                }
                this.treeSelect = data.name
                if (data.name === '全部') {
                  this.loading = true
                  this.pageNum = 1
                  this.getAllitemData()
                } else {
                  this.loading = true
                  this.pageNum = 1
                  this.getsectionColleague()
                }
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
    // 添加同事 获取部门
    addPerson () {
      this.modal1 = true
      getdepartment(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.departmentList = res.data.msgData
            break
        }
      })
    },
    // 添加同事 改变部门 岗位改变
    changeDepartment () {
      this.stationList = []
      let departmentId
      this.departmentList.forEach(res => {
        if (res.name == this.formItem.department) {
          departmentId = res.id
        }
      })
      if (!departmentId) {
        console.log(departmentId)
      } else {
        getRoles(JSON.parse(localStorage.getItem('projectId')).id, departmentId).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              this.stationList = res.data.msgData
              break
          }
        })
      }
    },
    // 分页
    changePages (i) {
      this.loading = true
      this.pageNum = i
      if (this.treeSelect == '全部') {
        this.getAllitemData()
      } else {
        this.getsectionColleague()
      }
    },
    // 获取所有数据
    getAllitemData () {
      let arr = JSON.parse(localStorage.getItem('projectId'))
      let id = arr.id
      allteamers(this.pageNum, this.pageSize, id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)

            break
          default:
            let resData = res.data.msgData
            this.totalElements = resData.totalElements
            this.data1 = resData.content
            this.loading = false
            break
        }
      })
    },
    // 获取单个部门 的通讯录
    getsectionColleague () {
      let arr = JSON.parse(localStorage.getItem('projectId'))
      let id = arr.id
      sectionColleague(this.pageNum, this.pageSize, id, this.treeSelect).then(
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
              let resData = res.data.msgData
              this.totalElements = resData.totalElements
              this.data1 = resData.content
              this.loading = false
              break
          }
        }
      )
    },
    // 搜索同事
    searchColleague () {
      if (this.search != '') {
        let arr = JSON.parse(localStorage.getItem('projectId'))
        let id = arr.id
        this.loading = true
        this.pageNum = 1
        searchColleague(this.pageNum, this.pageSize, id, this.search).then(
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
                let resData = res.data.msgData
                this.totalElements = resData.totalElements
                this.data1 = resData.content
                this.loading = false
                break
            }
          }
        )
      }
    }
  }
}
</script>

<style lang='less' scoped>
.big-box {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .card {
    height: 100%;
  }
  .right-box {
    overflow: auto;
    .latestTitle {
      font-size: 16px;
      color: #17233d;
      font-weight: bold;
      display: flex;
      justify-content: space-around;
    }
    .latest {
      font-size: 14px;
      display: flex;
      justify-content: space-around;
    }
  }
  .name {
    width: 50px;
  }
  .tel {
    width: 120px;
  }
  .pageBox {
    margin: 10px;
    overflow: hidden;
    .page {
      float: right;
    }
  }
}
</style>

<template>
  <div class="bigbox">
    <Card class="bigbox">
      <Steps class="guidance">
        <Step status="process" title="新建单位工程" content="选择正确的单位工程类型，不可修改"></Step>
        <Step status="process" title="进入划分操作界面" content="点击单位工程名称，进入划分模板"></Step>
        <Step status="process" title="分部分项划分操作" content="通过“复制”、“新增”增加工程部位"></Step>
      </Steps>
      <div>
        &nbsp; &nbsp;&nbsp; &nbsp;
        <ButtonGroup>
          <Button type="primary" @click="newUnitProject">新建单位工程</Button>
          <Button @click="partialDivide">分部分项工程划分</Button>
        </ButtonGroup>&nbsp; &nbsp;
        <Button @click="derive">查看所有</Button>
      </div>
      <Table border :columns="columns4" :data="data1" style="marginTop:20px" ref="table"></Table>
    </Card>
    <Modal v-model="modal1" title="新建单位工程" @on-ok="ok('formItem')" @on-cancel="cancel" :width="600">
      <Form ref="formItem" :model="formItem" :label-width="100" :rules="ruleform">
        <FormItem label="单位工程类型" prop="partialType">
          <Select
            v-model="formItem.partialType"
            placeholder="--系统根据选择的类型生成模板--"
            @on-change="changeType(formItem.partialType)"
          >
            <Option v-for="item in partialType" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="单位工程名称" prop="partialName">
          <Input v-model="formItem.partialName" placeholder="用于生成各项目资料、表格的标题"></Input>
        </FormItem>
        <FormItem label="单位工程编号" prop="partialNum">
          <Input v-model="formItem.partialNum" placeholder="系统自动推算填充，可修改"></Input>
        </FormItem>
        <FormItem label="桩号或位置">
          <Row>
            <Col span="11">
              <FormItem prop="start">
                <Input v-model="formItem.start" placeholder="Enter something..."></Input>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">~</Col>
            <Col span="11">
              <FormItem prop="end">
                <Input v-model="formItem.end" placeholder="Enter something..."></Input>
              </FormItem>
            </Col>
          </Row>
          <br />
          <div>(示例：K0+000 ~ K100+020 )</div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="ok('formItem')">保存</Button>
      </div>
    </Modal>
    <Modal v-model="removeModal" title="删除选中单位工程" @on-ok="removeOk">
      <p>你确定要删除吗？</p>
    </Modal>
    <Modal v-model="amendModal" title="编辑单位工程" @on-cancel="amendcancel" :width="600">
      <Form ref="formItem1" :model="formItem1" :label-width="100" :rules="ruleform1">
        <FormItem label="单位工程类型" prop="partialType">
          <Select
            v-model="formItem1.partialType"
            placeholder="--系统根据选择的类型生产模板--"
            @on-change="changeType1(formItem1.partialType)"
            disabled
          >
            <Option v-for="item in partialType" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="单位工程名称" prop="partialName">
          <Input v-model="formItem1.partialName" placeholder="用于生成各项目资料、表格的标题"></Input>
        </FormItem>
        <FormItem label="单位工程编号" prop="partialNum">
          <Input v-model="formItem1.partialNum" placeholder="系统自动推算填充，可修改"></Input>
        </FormItem>
        <FormItem label="桩号或位置">
          <Row>
            <Col span="11">
              <FormItem prop="start">
                <Input v-model="formItem1.start" placeholder="Enter something..."></Input>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">~</Col>
            <Col span="11">
              <FormItem prop="end">
                <Input v-model="formItem1.end" placeholder="Enter something..."></Input>
              </FormItem>
            </Col>
          </Row>
          <br />
          <div>(示例：K0+000 ~ K100+020 )</div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="amendcancel">取消</Button>
        <Button type="primary" size="large" @click="amendok('formItem1')">保存</Button>
      </div>
    </Modal>
    <Modal v-model="noAdd" width="360">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <div style="text-align:center">
        <p>{{noAddMassage}}</p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="noAddClick" long>确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getAllUnitproject,
  getPartialType,
  newPartial,
  removePartial,
  getPartial,
  amendPartial,
  isADD
} from '@/api/partial/partial'
import { isDataSuccess } from '@/libs/util'
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      projectId: '',
      // 表格-表头
      columns4: [
        {
          title: ' ',
          width: 60,
          type: '_checked',
          align: 'center',
          fixed: 'left',
          render: (h, { row, index }) => {
            return h('div', [
              h('Checkbox', {
                props: {
                  value: row._checked
                },
                on: {
                  'on-change': e => {
                    this.data1.forEach(items => {
                      this.$set(items, '_checked', false)
                    })
                    if (e === false) {
                      this.selectList = ''
                    } else {
                      this.selectList = row
                    }
                    this.data1[index]._checked = e
                  }
                }
              })
            ])
          }
        },
        {
          type: 'index',
          width: 60,
          align: 'center',
          title: '#',
          fixed: 'left'
        },
        {
          title: '单位工程名称',
          align: 'center',
          width: 130,
          fixed: 'left',
          key: 'name',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  cursor: 'pointer',
                  color: '#082999'
                },
                on: {
                  click: () => {
                    if (this.jurisdiction) {
                      let partial = {
                        partialId: params.row.id,
                        partialName: params.row.name,
                        partialNum: params.row.number
                      }
                      sessionStorage.setItem(
                        'partial',
                        JSON.stringify(partial)
                      )
                      sessionStorage.setItem(
                        'selectList',
                        JSON.stringify(params.row)
                      )

                      this.$router.push({
                        name: '分部分项划分'
                      })
                    } else {
                      this.noAdd = true
                    }
                  }
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '是否完成划分',
          align: 'center',
          width: 110,
          fixed: 'left',
          key: 'status',
          render: (h, params) => {
            if (params.row.status === 1) {
              return h(
                'span',
                {
                  style: {
                    color: '#00ff00',
                    fontSize: '20px'
                  }
                },
                '√'
              )
            } else {
              return h(
                'span',
                {
                  style: {
                    color: '#ff0000',
                    fontSize: '20px'
                  }
                },
                '×'
              )
            }
          }
        },
        {
          title: '单位工程类型',
          align: 'center',
          width: 130,
          key: 'category'
        },
        {
          title: '编号',
          align: 'center',
          width: 80,
          key: 'number'
        },
        {
          title: '起止桩号',
          align: 'center',
          width: 160,
          key: 'startMileage',
          render: (h, params) => {
            return h(
              'span',
              params.row.startMileage + '--' + params.row.endMileage
            )
          }
        },
        {
          title: '创建日期',
          align: 'center',
          width: 120,
          key: 'createTime'
        },
        {
          title: '修改时间',
          align: 'center',
          width: 120,
          key: 'updateTime'
        },
        {
          title: '操作',
          key: 'action',
          width: 170,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: !this.jurisdiction
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.compile(params)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small',
                    disabled: !this.jurisdiction
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params)
                    }
                  }
                },
                '删除'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    disabled: !this.jurisdiction
                  },
                  style: {
                  },
                  on: {
                    click: () => {
                      this.check(params)
                    }
                  }
                },
                '划分'
              )
            ])
          }
        }
      ],
      // 表格-内容
      data1: [],
      formItem: {
        partialType: '',
        partialName: '',
        partialNum: '',
        start: 'K',
        end: 'K'
      },
      ruleform: {
        partialType: [
          {
            required: true,
            message: '请选择单位工程类型',
            trigger: 'change',
            type: 'number'
          }
        ],
        partialName: [
          {
            required: true,
            message: '请填写单位工程名称',
            trigger: 'blur'
          }
        ],
        partialNum: [
          {
            required: true,
            message: '请填写单位工程编号',
            trigger: 'blur'
          }
        ],
        start: [
          {
            required: true,
            message: '请填写开始时桩号或位置',
            trigger: 'blur'
          },
          {
            pattern: /^[Kk][0-9]+[.+-]\d{3}/,
            message: '请输入正确的桩号或位置',
            trigger: 'blur'
          }
        ],
        end: [
          {
            required: true,
            message: '请填写结束时桩号或位置',
            trigger: 'blur'
          },
          {
            pattern: /^[Kk][0-9]+[.+-]\d{3}/,
            message: '请输入正确的桩号或位置',
            trigger: 'blur'
          }
        ]
      },
      formItem1: {
        partialType: '',
        partialName: '',
        partialNum: '',
        start: 'K',
        end: 'K'
      },
      ruleform1: {
        partialType: [
          {
            required: true,
            message: '请选择单位工程类型',
            trigger: 'change',
            type: 'number'
          }
        ],
        partialName: [
          {
            required: true,
            message: '请填写单位工程名称',
            trigger: 'blur'
          }
        ],
        partialNum: [
          {
            required: true,
            message: '请填写单位工程编号',
            trigger: 'blur'
          }
        ],
        start: [
          {
            required: true,
            message: '请填写开始时桩号或位置',
            trigger: 'blur'
          },
          {
            pattern: /^[Kk][0-9]+[.+-]\d{3}/,
            message: '请输入正确的桩号或位置',
            trigger: 'blur'
          }
        ],
        end: [
          {
            required: true,
            message: '请填写结束时桩号或位置',
            trigger: 'blur'
          },
          {
            pattern: /^[Kk][0-9]+[.+-]\d{3}/,
            message: '请输入正确的桩号或位置',
            trigger: 'blur'
          }
        ]
      },
      selectList: '', // 被选中的数据
      modal1: false, // 新建单位工程弹框
      partialType: [], // 新建单位工程 -- 单位工程类型
      removeModal: false, // 删除弹框
      partialId: '', // 单位工程ID
      amendModal: false, // 编辑单位工程弹框
      noAddMassage: '', // 弹框提示文字
      noAdd: false, // 弹框提示
      jurisdiction: true // 是否有权限
    }
  },
  methods: {
    // 表格编辑按钮
    compile (params) {
      this.partialId = params.row.id
      // 获取单位工程类型
      getPartialType().then(res => {
        this.partialType = res.data.msgData
      })
      // 获取数据回显
      getPartial(this.partialId).then(res => {
        this.formItem1.partialType = res.data.msgData.categoryId
        this.formItem1.end = res.data.msgData.endMileage
        this.formItem1.partialName = res.data.msgData.name
        this.formItem1.partialNum = res.data.msgData.number
        this.formItem1.start = res.data.msgData.startMileage
      })
      this.amendModal = true
    },
    // 表格删除按钮
    remove (params) {
      this.partialId = params.row.id
      this.removeModal = true
    },
    // 删除保存按钮
    removeOk () {
      removePartial(this.partialId).then(res => {
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
            this.getTable()
            break
        }
      })
    },
    // 表格查看按钮
    check (params) {
      let partial = {
        partialId: params.row.id,
        partialName: params.row.name,
        partialNum: params.row.number
      }
      // 将选中的数据存到session storage
      sessionStorage.setItem('partial', JSON.stringify(partial))
      sessionStorage.setItem('selectList', JSON.stringify(params.row))
      this.$router.push({
        name: '分部分项划分'
      })
    },
    // 分部分项工程划分
    partialDivide () {
      if (this.jurisdiction) {
        if (this.selectList === '') {
          this.$Message.error('请选择单位工程')
        } else {
          let partial = {
            partialId: this.selectList.id,
            partialName: this.selectList.name,
            partialNum: this.selectList.number
          }
          // 将选中的数据存到session storage
          sessionStorage.setItem('partial', JSON.stringify(partial))
          sessionStorage.setItem('selectList', JSON.stringify(this.selectList))
          this.$router.push({
            name: '分部分项划分'
          })
        }
      } else {
        this.noAdd = true
      }
    },
    // 新建单位工程
    newUnitProject () {
      isADD(this.projectId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.noAddMassage = res.data.msgContent
            this.noAdd = true
            break
          default:
            // 获取单位工程类型
            getPartialType().then(res => {
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  break
                case 2:
                  this.$Message.error(res.data.msgContent)
                  break
                default:
                  this.partialType = res.data.msgData
                  break
              }
            })
            this.modal1 = true
            break
        }
      })
    },
    // 新建单位工程弹出框确定
    ok (name) {
      console.log(this.formItem.partialNum)
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            categoryId: this.formItem.partialType,
            endMileage: this.formItem.end,
            name: this.formItem.partialName,
            number: this.formItem.partialNum,
            projectId: this.projectId,
            startMileage: this.formItem.start
          }
          // 新建分部分项
          newPartial(data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.getTable()
                this.$refs.formItem.resetFields()
                this.$Message.success('创建成功')
                this.modal1 = false
                break
            }
          })
        }
      })
    },
    // 新建单位工程弹出框取消
    cancel () {
      this.$refs.formItem.resetFields()
      this.modal1 = false
    },
    // 新建单位工程 -- 改变单位工程类型
    changeType (value) {
      this.partialType.forEach(res => {
        if (res.id == value) {
          this.formItem.partialNum = res.code
          this.formItem.partialName = res.name
        }
      })
    },
    // 编辑单位工程 -- 改变单位工程类型
    changeType1 (value) {
      console.log(111)
      this.partialType.forEach(res => {
        if (res.id == value) {
          this.formItem1.partialNum = res.code
          this.formItem1.partialName = res.name
        }
      })
    },
    // 获取表格数据
    getTable () {
      // 获取所有项目信息
      getAllUnitproject(this.projectId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.data1 = res.data.msgData
            // 将单位工程类型 通过id取出名字
            this.data1.forEach(res => {
              this.partialType.forEach(data => {
                if (res.categoryId === data.id) {
                  res.category = data.name
                }
              })
            })
            break
        }
      })
    },
    // 打印表格数据
    derive () {
      if (this.jurisdiction) {
        window.open(
          axios.baseUrl + '/pcm/fbfx/unitproject/export/' + this.projectId
        )
      } else {
        this.noAdd = true
      }
    },
    // 弹出框确定
    amendok (name) {
      console.log(this.formItem1.partialNum)
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            categoryId: this.formItem1.partialType,
            endMileage: this.formItem1.end,
            name: this.formItem1.partialName,
            number: this.formItem1.partialNum,
            projectId: this.projectId,
            id: this.partialId,
            startMileage: this.formItem1.start
          }
          // 获取是否有权限
          amendPartial(data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.getTable()
                this.$Message.success('修改成功')
                this.amendModal = false
                break
            }
          })
        } else {
          this.$Message.error('修改失败!')
        }
      })
    },
    // 弹出框取消
    amendcancel () {
      this.$refs.formItem1.resetFields()
      this.amendModal = false
    },
    // 没用权限弹出框确定
    noAddClick () {
      this.noAdd = false
    }
  },

  created () {
    let arr = JSON.parse(localStorage.getItem('projectId'))
    this.projectId = arr.id
    // 获取单位工程类型
    getPartialType().then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.partialType = res.data.msgData
          this.getTable()
          break
      }
    })
    // 是否增加
    isADD(this.projectId).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.noAddMassage = res.data.msgContent
          this.jurisdiction = false
          break
        default:
          console.log(res.data.msgContent)
          break
      }
    })
  }
}
</script>

<style lang="less" scoped>
.bigbox {
  height: 100%;
}

.guidance {
  padding: 10px;
  margin-bottom: 10px;
}
</style>

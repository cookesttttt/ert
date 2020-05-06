<template>
  <Card>
    <Row>
      <div class="topNav">
        <RadioGroup
          v-model="openType"
          size="large"
          style="marginLeft:30px"
          @on-change="changeRadio"
        >
          <span>展开方式：</span>
          <Radio label="分部工程"></Radio>
          <Radio label="分项工程"></Radio>
        </RadioGroup>
        <span>
          <router-link to style="marginRight:30px">查看划分案例</router-link>
          <Button style="marginRight:10px" @click="derive">预览/打印</Button>
          <Button type="primary" @click="complete">完成划分</Button>
        </span>
      </div>
      <Col :lg="10" :xxl="8">
        <card :bordered="false" style="height:700px;overflow:auto">
          <Tree ref="tree" id="tree" :data="treeData" :render="renderContent"></Tree>
        </card>
      </Col>
      <Col :lg="13" :xxl="14" offset="1">
        <card :bordered="false">
          <p slot="title">当前工程部位信息（选中节点信息）</p>
          <div class="rightBox">
            <Form
              ref="formItem"
              :rules="ruleform"
              :model="formItem"
              :label-width="100"
              style="width:70%"
            >
              <FormItem label="类型:">
                <Input v-model="formItem.fbfxType" disabled></Input>
              </FormItem>
              <FormItem label="名称:" prop="name">
                <Input v-model="formItem.name"></Input>
              </FormItem>
              <FormItem label="质量评定标准:" prop="select">
                <Select v-model="formItem.evaluateStandard" disabled>
                  <Option :value="formItem.evaluateStandard">{{formItem.evaluateStandard}}</Option>
                </Select>
              </FormItem>
              <FormItem label="编号:" prop="number">
                <Input v-model="formItem.number"></Input>
              </FormItem>
              <FormItem label="桩号或位置:">
                <Row>
                  <Col span="11">
                    <FormItem prop="startMileage">
                      <Input v-model="formItem.startMileage"></Input>
                    </FormItem>
                  </Col>
                  <Col span="2" style="text-align: center">~</Col>
                  <Col span="11">
                    <FormItem prop="endMileage">
                      <Input v-model="formItem.endMileage"></Input>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="划分标准:">
                <span v-if="formItem.divideStandard">{{formItem.divideStandard}}</span>
              </FormItem>
              <FormItem label="质量评定权值:">
                <span v-if="formItem.weight">{{formItem.weight}}</span>
              </FormItem>
            </Form>
            <div>
              <Button
                :disabled="isDisable"
                @click="copy"
                style="width:140px;marginBottom:16px;marginTop:0px"
              >{{ button1 }}</Button>
              <br />
              <Button
                :disabled="isAddDisable"
                @click="add"
                style="width:140px;marginBottom:16px"
              >{{ button2 }}</Button>
              <br />
              <Button
                :disabled="isDisable"
                @click="remove"
                style="width:140px;marginBottom:16px"
              >{{ button3 }}</Button>
              <br />
              <Button
                :disabled="isDisable"
                type="primary"
                @click="save('formItem')"
                style="width:140px"
              >保存当前部位更改</Button>
            </div>
          </div>
        </card>
      </Col>
      <Modal v-model="copyModal" title="复制工程部位" @on-ok="copyOk" @on-cancel="copyCancel">
        <p style="marginLeft:30px">
          *复制个数：
          <InputNumber v-model="copyNum" size="large" :min="0"></InputNumber>
        </p>
        <p style="marginLeft:30px;marginTop:10px">
          <Icon type="ios-alert" :size="20" />复制工程部位，会连同其子工程部位一同复制。
        </p>
      </Modal>
      <Modal v-model="addModal" title="新增子工程部位" @on-cancel="addCancel">
        <Form ref="formItem1" :rules="ruleform1" :model="formItem1" :label-width="100">
          <FormItem label="子部位类型:">
            <Input v-model="formItem1.engineeringSiteType" disabled></Input>
          </FormItem>
          <FormItem label="质量标准:" prop="select">
            <Select v-model="formItem1.select" @on-change="changeType(formItem1.select)">
              <Option v-for="item in selectItem" :value="item.name" :key="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="划分标准:">
            <span>{{formItem1.standard}}</span>
          </FormItem>
          <FormItem label="名称:" prop="name">
            <Input v-model="formItem1.name"></Input>
          </FormItem>
          <FormItem label="编号:" prop="number">
            <Input v-model="formItem1.number"></Input>
          </FormItem>
          <FormItem label="桩号或位置:">
            <Row>
              <Col span="11">
                <FormItem prop="startMileage">
                  <Input v-model="formItem1.startMileage"></Input>
                </FormItem>
              </Col>
              <Col span="2" style="text-align: center">~</Col>
              <Col span="11">
                <FormItem prop="endMileage">
                  <Input v-model="formItem1.endMileage"></Input>
                </FormItem>
              </Col>
            </Row>
            <br />
            <div>(示例：K0+000 ~ K100+020 )</div>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" size="large" @click="addCancel">取消</Button>
          <Button type="primary" size="large" @click="addOK('formItem1')">保存</Button>
        </div>
      </Modal>
      <Modal v-model="removeModal" title="删除选中单位工程" @on-ok="removeOk">
        <p>你确定要删除选中的单位工程吗？</p>
      </Modal>
    </Row>
  </Card>
</template>

<script>
import { isDataSuccess } from '@/libs/util'
import {
  getTree,
  getChildrenTemplate,
  removePartial,
  addPartial,
  copyPartial,
  modificationPartial,
  completeDivision,
  getPartial
} from '@/api/partial/subDivision'
import axios from '@/libs/api.request'

export default {
  data () {
    return {
      openType: '分部工程', // 顶部单选框 -- 展开方式
      // 当前工程部位信息
      formItem: {
        fbfxType: '',
        name: '',
        evaluateStandard: '',
        number: '',
        startMileage: '',
        endMileage: '',
        divideStandard: '',
        weight: ''
      },
      copyNum: 0, // 复制的个数
      copyModal: false, // 复制工程部位弹框
      addModal: false, // 新增子工程部位
      removeModal: false, // 删除子工程部位
      // 新增子工程部位 表单
      formItem1: {
        engineeringSiteType: '',
        name: '',
        select: '',
        number: '',
        startMileage: '',
        endMileage: '',
        standard: ''
      },
      // 工程部位信息验证
      ruleform: {
        name: [
          {
            required: true,
            message: '请填写正确的名称',
            trigger: 'blur'
          }
        ],
        /* select: [
          {
            required: true,
            message: '请选择正确的质量评定标准',
            trigger: 'change',
            type: 'number'
          }
        ], */
        number: [
          {
            required: true,
            message: '请填写正确的编号',
            trigger: 'blur'
          }
        ],
        startMileage: [
          {
            required: true,
            message: '请填写正确的桩号或位置',
            trigger: 'blur'
          },
          {
            pattern: /^[Kk][0-9]+[.+-]\d{3}/,
            message: '请输入正确的桩号或位置',
            trigger: 'blur'
          }
        ],
        endMileage: [
          {
            required: true,
            message: '请填写正确的桩号或位置',
            trigger: 'blur'
          },
          {
            pattern: /^[Kk][0-9]+[.+-]\d{3}/,
            message: '请输入正确的桩号或位置',
            trigger: 'blur'
          }
        ]
      },
      // 新增下级工程部位验证
      ruleform1: {
        name: [
          {
            required: true,
            message: '请填写正确的名称',
            trigger: 'blur'
          }
        ],
        select: [
          {
            required: true,
            message: '请选择正确的质量标准',
            trigger: 'change'
          }
        ],
        number: [
          {
            required: true,
            message: '请填写正确的编号',
            trigger: 'blur'
          }
        ],
        startMileage: [
          {
            required: true,
            message: '请填写正确的桩号或位置',
            trigger: 'blur'
          },
          {
            pattern: /^[Kk][0-9]+[.+-]\d{3}/,
            message: '请输入正确的桩号或位置',
            trigger: 'blur'
          }
        ],
        endMileage: [
          {
            required: true,
            message: '请填写正确的桩号或位置',
            trigger: 'blur'
          },
          {
            pattern: /^[Kk][0-9]+[.+-]\d{3}/,
            message: '请输入正确的桩号或位置',
            trigger: 'blur'
          }
        ]
      },
      partialId: '', // 单位工程id
      partialName: '', // 单位工程名字
      partialNum: '', // 单位工程编号
      // 左侧树状图
      treeData: [
        {
          name: '',
          number: '',
          children: [],
          expand: true,
          selected: true,
          id: ''
        }
      ],
      nowPartialId: '', // 当前分部分项的id
      selectItem: '', // 新增单位工程下拉框
      type: '', // 选中的树结构类型
      isDisable: true, // 判断按钮禁用
      isAddDisable: false, // 判断按钮禁用
      selectData: '', // 当前被选中的数据
      selectRoot: '', // 当前被选中的数据
      selectNode: '' // 当前被选中的数据
    }
  },
  methods: {
    // 复制工程部位
    copy () {
      this.copyModal = true
    },
    // 删除当前单位工程
    remove () {
      this.removeModal = true
    },
    // 删除工程部位 --- 保存
    removeOk () {
      removePartial(this.nowPartialId).then(res => {
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
            this.removeTree(this.selectRoot, this.selectNode, this.selectData)
            break
        }
      })
    },
    // 复制工程部位 -- 保存
    copyOk () {
      if (this.copyNum === 0) {
        this.$Message.error('不能复制0个哦')
      } else {
        copyPartial(this.nowPartialId, this.copyNum).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              this.append(this.selectRoot, this.selectNode, res.data.msgData)
              break
          }
        })
      }
      this.copyNum = 0
    },
    // 复制工程部位 -- 取消
    copyCancel () {
      this.copyNum = 0
    },
    // 新增子工程部位
    add () {
      if (this.nowPartialId === '') {
        this.$Message.error('请选择后再添加')
      } else {
        this.addModal = true
        this.formItem1.engineeringSiteType = ''
        if (this.selectData.fbfx === 'FB') {
          this.formItem1.engineeringSiteType = '分项工程'
        } else if (this.selectData.fbfx === 'FX') {
          this.formItem1.engineeringSiteType = '子分项工程'
        } else if (this.selectData.fbfx === 'ZFX') {
          this.formItem1.engineeringSiteType = '子分项工程'
        } else if (this.selectData.fbfx === 'DW') {
          this.formItem1.engineeringSiteType = '分部工程'
        }
        getChildrenTemplate(this.type, this.nowPartialId).then(res => {
          this.selectItem = res.data.msgData
        })
      }
    },
    // 新增子工程部位 -- 保存
    addOK (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formItem1.engineeringSiteType === '分项工程') {
            this.formItem1.engineeringSiteType = 'FX'
          } else if (this.formItem1.engineeringSiteType === '分部工程') {
            this.formItem1.engineeringSiteType = 'FB'
          } else if (this.formItem1.engineeringSiteType === '子分项工程') {
            this.formItem1.engineeringSiteType = 'ZFX'
          }

          // 传入的参数
          let data = {
            name: this.formItem1.name,
            number: this.formItem1.number,
            startMileage: this.formItem1.startMileage,
            endMileage: this.formItem1.endMileage,
            divideStandard: this.formItem1.standard,
            fbfxType: this.formItem1.engineeringSiteType,
            weight: this.formItem1.weight,
            templateId: this.formItem1.templateId,
            unitProject: this.formItem1.unitProject,
            evaluateStandard: this.formItem1.select
          }
          addPartial(this.nowPartialId, this.type, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.$Message.success('添加成功!')
                this.addModal = false
                // 改变左侧树状图的值
                const children = this.selectData.children

                children.push({
                  name: this.formItem1.name,
                  number: this.formItem1.number,
                  startMileage: this.formItem1.startMileage,
                  endMileage: this.formItem1.endMileage,
                  divideStandard: this.formItem1.standard,
                  fbfxType: this.formItem1.engineeringSiteType,
                  fbfx: this.formItem1.engineeringSiteType,
                  weight: this.formItem1.weight,
                  templateId: this.formItem1.templateId,
                  unitProject: this.formItem1.unitProject,
                  evaluateStandard: this.formItem1.select,
                  name: this.formItem1.name,
                  number: this.formItem1.number,
                  expand: true,
                  id: res.data.msgData.id,
                  children: []
                })
                // this.selectData.expand = true

                this.$set(this.selectData, 'children', children)
                this.$refs.formItem1.resetFields()
                break
            }
          })
        }
      })
    },
    // 新增子工程部位 -- 取消
    addCancel () {
      this.$refs.formItem1.resetFields()
      this.addModal = false
    },
    // 保存当前部位更改
    save (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.formItem.fbfxType === '分项工程') {
            this.formItem.fbfxType = 'FX'
          } else if (this.formItem.fbfxType === '分部工程') {
            this.formItem.fbfxType = 'FB'
          } else if (this.formItem.fbfxType === '子分项工程') {
            this.formItem.fbfxType = 'ZFX'
          }
          // 传入的参数
          let data = {
            name: this.formItem.name,
            number: this.formItem.number,
            startMileage: this.formItem.startMileage,
            endMileage: this.formItem.endMileage,
            divideStandard: this.formItem.divideStandard,
            fbfxType: this.formItem.fbfxType,
            weight: this.formItem.weight,
            templateId: this.formItem.templateId,
            unitProjectId: this.partialId,
            evaluateStandard: this.formItem.evaluateStandard,
            id: this.nowPartialId
          }
          modificationPartial(data).then(res => {
            console.log(res)
          })
          this.$Message.success('添加成功!')
        }
      })
    },
    // 左侧树状图
    renderContent (h, { root, node, data }) {
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
            overflow: 'hidden',
            position: 'relative',
            top: '6px',
            backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
          },
          on: {
            click: () => {
              this.$refs.formItem.fields.forEach(function (e) {
                if (e.prop === 'startMileage') {
                  e.resetField()
                }
                if (e.prop === 'endMileage') {
                  e.resetField()
                }
              })
              this.selectData = data
              this.selectNode = node
              this.selectRoot = root
              if (!node.node.selected) {
                this.$refs.tree.handleSelect(node.nodeKey)
              }
              if (data.nodeKey === 0) {
                this.isDisable = true
                data = JSON.parse(sessionStorage.getItem('selectList'))
                data.fbfxType = '单位工程'
                data.evaluateStandard = data.name
                this.type = 0
                this.formItem = data
              } else {
                this.type = 1
                this.isDisable = false
                this.formItem = data
                getPartial(data.id).then(res => {
                  if (res.data.msgData.fbfxType === 'FB') {
                    res.data.msgData.fbfxType = '分部工程'
                    this.isAddDisable = false
                  } else if (res.data.msgData.fbfxType === 'FX') {
                    res.data.msgData.fbfxType = '分项工程'
                    this.isAddDisable = false
                  } else if (res.data.msgData.fbfxType === '') {
                    res.data.msgData.fbfxType = '分部工程'
                    this.isAddDisable = false
                  } else if (res.data.msgData.fbfxType === 'ZFX') {
                    res.data.msgData.fbfxType = '子分项工程'
                    this.isAddDisable = true
                  }

                  this.formItem = res.data.msgData
                })
              }
              this.nowPartialId = data.id
              if (this.formItem.fbfxType === '分部工程') {
                this.isAddDisable = false
              } else if (this.formItem.fbfxType === '分项工程') {
                this.isAddDisable = false
              } else if (this.formItem.fbfxType === '分部工程') {
                this.isAddDisable = false
              } else if (this.formItem.fbfxType === '子分项工程') {
                this.isAddDisable = true
              }
            }
          }
        },
        [
          h('span', [
            h(
              'span',
              {
                props: {
                  type: 'md-person',
                  color: '#2d8cf0'
                },
                style: {
                  display: 'inline-block',
                  marginRight: '8px',
                  width: '26px',
                  height: '18px',
                  backgroundColor: '#2d8cf0',
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: '10px',
                  fontStyle: 'italic'
                }
              },
              data.fbfx
            )
          ]),
          h('span', [
            h(
              'span',
              {
                style: {
                  marginRight: '8px'
                }
              },
              data.name
            )
          ]),
          h('span', [
            h(
              'span',
              {
                style: {
                  color: '#2d8cf0'
                }
              },
              data.number
            )
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
    },
    // 新增下级菜单下拉框改变
    changeType (type) {
      if (type !== '') {
        this.selectItem.forEach(res => {
          if (res.name === type) {
            this.formItem1.name = res.name
            this.formItem1.number = res.fullCode
            this.formItem1.divideStandard = res.standard
            this.formItem1.weight = res.qualityWeight
            this.formItem1.templateId = res.id
            this.formItem1.unitProject = this.partialId
            if (res.engineeringSiteType === 'FB') {
              this.formItem1.engineeringSiteType = '分部工程'
            } else if (res.engineeringSiteType === 'FX') {
              this.formItem1.engineeringSiteType = '分项工程'
            } else if (res.engineeringSiteType === 'ZFX') {
              this.formItem1.engineeringSiteType = '子分项工程'
            }
            if (this.selectData.fbfxType === '分项工程') {
              this.formItem1.engineeringSiteType = '子分项工程'
            } else if (this.selectData.fbfxType === '子分项工程') {
              this.formItem1.engineeringSiteType = '子分项工程'
            }
          }
        })
      }
    },

    // 获取左侧树状图结构
    getLeftTree () {
      getTree(this.partialId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            let changeTree = function (data) {
              data.forEach(res => {
                res.fbfx = res.fbfxType
                if (res.children.length > 0) {
                  changeTree(res.children)
                }
              })
            }
            changeTree(res.data.msgData)
            this.treeData[0].children = res.data.msgData
            break
        }
      })
    },
    // 增加后树节点改变
    append (root, node, data) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      let setTree = function (data) {
        data.forEach(res => {
          res.fbfx = res.fbfxType
          if (res.children.length > 0) {
            setTree(res.children)
          }
        })
      }
      setTree(data)
      let index = parent.children.indexOf(this.selectData)
      data.forEach(res => {
        index++
        parent.children.splice(index, 0, res)
      })

      // parent.children = parent.children.concat(data)
    },
    // 删除后树节点改变
    removeTree (root, node, data) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
    },
    // 顶部单选框改变
    changeRadio () {
      if (this.openType === '分部工程') {
        this.treeChangeExpand(this.treeData, false)
        this.treeData[0].expand = true
      } else if (this.openType === '分项工程') {
        this.treeChangeExpand(this.treeData, true)
      }
    },
    // 完成划分
    complete () {
      completeDivision(this.partialId).then(res => {
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
    // 树状图展开方式
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
    // 预览/打印
    derive () {
      window.open(
        axios.baseUrl + '/pcm/fbfx/info/export/' + this.partialId
      )
    }
  },
  computed: {
    // 右侧按钮文字
    button1 () {
      if (this.selectData.nodeKey === 0) {
        return '复制当前节点'
      } else if (
        this.selectData.fbfxType === '分部工程' ||
        this.selectData.fbfxType === 'FB'
      ) {
        return '复制当前分部工程'
      } else if (
        this.selectData.fbfxType === '分项工程' ||
        this.selectData.fbfxType === 'FX'
      ) {
        return '复制当前分项工程'
      } else if (
        this.selectData.fbfxType === '子分项工程' ||
        this.selectData.fbfxType === 'ZFX'
      ) {
        return '复制当前子分项工程'
      } else {
        return '复制当前节点'
      }
    },
    button2 () {
      if (this.selectData.nodeKey === 0) {
        return '新增分部工程'
      } else if (
        this.selectData.fbfxType === '分部工程' ||
        this.selectData.fbfxType === 'FB'
      ) {
        return '新增分项工程'
      } else if (
        this.selectData.fbfxType === '分项工程' ||
        this.selectData.fbfxType === 'FX'
      ) {
        return '新增子分项工程'
      } else if (
        this.selectData.fbfxType === '子分项工程' ||
        this.selectData.fbfxType === 'ZFX'
      ) {
        return '新增下级工程'
      } else {
        return '新增分部工程'
      }
    },
    button3 () {
      if (this.selectData.nodeKey === 0) {
        return '删除当前节点'
      } else if (
        this.selectData.fbfxType === '分部工程' ||
        this.selectData.fbfxType === 'FB'
      ) {
        return '删除当前分部工程'
      } else if (
        this.selectData.fbfxType === '分项工程' ||
        this.selectData.fbfxType === 'FX'
      ) {
        return '删除当前分项工程'
      } else if (
        this.selectData.fbfxType === '子分项工程' ||
        this.selectData.fbfxType === 'ZFX'
      ) {
        return '删除当前子分项工程'
      } else {
        return '删除当前节点'
      }
    }
  },
  created () {
    let partial = JSON.parse(sessionStorage.getItem('partial'))
    this.partialId = partial.partialId
    this.partialName = partial.partialName
    this.partialNum = partial.partialNum
    this.treeData[0].name = this.partialName
    this.treeData[0].number = this.partialNum
    this.treeData[0].id = this.partialId
    this.treeData[0].fbfxType = 'DW'
    this.treeData[0].fbfx = 'DW'

    // 当前工程单位部位信息（选中节点信息）
    let data = JSON.parse(sessionStorage.getItem('selectList'))
    data.fbfxType = '单位工程'
    data.evaluateStandard = ''
    this.type = 0
    this.nowPartialId = data.id
    this.formItem = data
    this.selectData = this.treeData[0]
    // 获取左侧树状图结构
    this.getLeftTree()
  }
}
</script>

<style lang="less" scoped>
.topNav {
  height: 50px;
  line-height: 50px;
  background-color: #eee;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.rightBox {
  display: flex;
  justify-content: space-around;
  button {
    margin-top: 10px;
  }
}
</style>

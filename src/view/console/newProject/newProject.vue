<template>
  <Card class="card" :bordered="false" dis-hover>
    <Tabs :value="tabsVal" :animated="false">
      <TabPane label="标签一" name="name1" style="height:600px">
        <p class="tabTitle">新建项目 1/3</p>
        <Form
          :model="formItem"
          :label-width="100"
          class="formItem"
          :rules="formItemRules"
          ref="formItem"
        >
          <FormItem label="项目名称" prop="name">
            <Input
              v-model="formItem.name"
              placeholder="用于项目正式资料标题显示"
              style="width:400px"
              @on-change="formChange"
            ></Input>
          </FormItem>
          <FormItem label="项目类型" prop="type">
            <Select
              v-model="formItem.type"
              placeholder="请选择"
              style="width:400px"
              @on-change="formChange"
            >
              <Option v-for="item in projectType" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="施工单位" prop="constructionOrganization">
            <Input
              v-model="formItem.constructionOrganization"
              placeholder="请填写合同施工单位"
              style="width:400px"
              @on-change="formChange"
            ></Input>
          </FormItem>
          <FormItem label="标段号" prop="section">
            <Dropdown @on-click="DropdownClick" placement="bottom-start">
              <Input v-model="formItem.section" placeholder="请选择标段号" style="width: 400px" readonly />
              <DropdownMenu slot="list" style="width: 400px">
                <Dropdown placement="bottom-start" style="width:100px">
                  <DropdownItem>
                    数字
                    <Icon type="ios-arrow-forward"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list" style="height: 200px;overflow-y: auto;">
                    <DropdownItem
                      v-for="item in sectionItem1"
                      :key="item.value"
                      :name="item.value"
                    >{{item.lable}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown placement="bottom-start" style="width:100px">
                  <DropdownItem>
                    字母
                    <Icon type="ios-arrow-forward"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list" style="height: 200px;overflow-y: auto;">
                    <DropdownItem
                      v-for="item in sectionItem2"
                      :key="item.value"
                      :name="item.value"
                    >{{item.lable}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Dropdown placement="bottom-start" style="width:100px">
                  <DropdownItem>
                    罗马数字
                    <Icon type="ios-arrow-forward"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list" style="height: 200px;overflow-y: auto;">
                    <DropdownItem
                      v-for="item in sectionItem3"
                      :key="item.value"
                      :name="item.value"
                    >{{item.lable}}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </DropdownMenu>
            </Dropdown>
          </FormItem>
          <FormItem label="项目部地域位置" class="location">
            <Row>
              <Col span="7">
                <FormItem prop="province">
                  <Select
                    v-model="formItem.province"
                    placeholder="省份"
                    @on-change="changeProvince"
                    style="width:100px"
                    placement="bottom"
                  >
                    <Option
                      v-for="(item) in provinceArr"
                      :key="item.id"
                      :value="item.name"
                    >{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem prop="city">
                  <Select
                    v-model="formItem.city"
                    placeholder="城市"
                    @on-change="changeCity"
                    style="width:100px;"
                    placement="bottom"
                  >
                    <Option
                      v-for="(item) in citiesArr"
                      :key="item.id"
                      :value="item.name"
                    >{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem prop="county">
                  <Select
                    v-model="formItem.county"
                    placeholder="区县"
                    style="width:100px;"
                    placement="bottom"
                    @on-change="formChange"
                  >
                    <Option
                      v-for="(item) in countyArr"
                      :key="item.id"
                      :value="item.name"
                    >{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <ButtonGroup>
              <Button @click="back">取消</Button>
              <Button
                type="primary"
                @click="openFullScreen('formItem')"
                v-loading.fullscreen.lock="fullscreenLoading"
              >下一步</Button>
            </ButtonGroup>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="标签二" name="name2">
        <div v-if="similarItem.length !== 0">
          <p class="tabTitle">检测到相同项目 2/3</p>
          <p style="text-align:right">
            <ButtonGroup>
              <Button @click="tab2Back">上一步</Button>
              <Button type="primary" @click="newMyItem">新建独立项目</Button>
            </ButtonGroup>
          </p>
          <div style="padding:10px 20px">
            <p class="pStyle">该项目已被创建，我们建议您核实项目信息后，加入准确项目。</p>
            <p class="pStyle">
              如果都不是您的项目，可以
              <span style="color: #2D8cF0;cursor: pointer;" @click="newMyItem">新建独立的项目</span>，之后进入项目通讯录邀请其他同事。
            </p>
          </div>
          <List style="padding:0 30px">
            <ListItem
              v-for="item in similarItem"
              :key="item.projectId"
              style="background:#eee;padding-left:10px;padding-right:10px"
            >
              <ListItemMeta>
                <p slot="title">
                  <span style="display:inline-block;margin-right:20px">{{item.projectName}}</span>
                  &nbsp;
                  <span
                    style="display:inline-block;width:70px"
                  >{{item.contractTender}}</span> &nbsp;&nbsp;&nbsp;
                  <span
                    style="display:inline-block;color: #2D8cF0;cursor: pointer;"
                    @click="lookInfo(item.projectId)"
                  >查看更多信息</span>
                </p>
                <p slot="description">
                  <span style="display:inline-block;width:100px">创建者：{{item.creator}}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    style="display:inline-block;width:100px"
                  >{{item.creatorPhone}}</span> &nbsp;&nbsp;&nbsp;
                  <span
                    style="display:inline-block;width:120px"
                  >{{item.creatorJob}}</span>&nbsp;&nbsp;&nbsp;
                  <span
                    style="display:inline-block;width:170px"
                  >创建时间：{{item.createDate}}</span>
                </p>
              </ListItemMeta>
              <template slot="action">
                <Button @click="joinItem(item.projectId)">加入项目</Button>
              </template>
            </ListItem>
          </List>
        </div>
        <div v-else>
          <p class="tabTitle">创建项目 2/3</p>
          <div class="formItem">
            <div>
              <div style="display:inline-block;margin:40px auto;">
                <p class="tabTitle">
                  项目创建者默认成为项目的
                  <span style="color: #2D8cF0;cursor: pointer;">系统管理员</span>，创建之后:
                </p>
                <p class="pStyle">1、你可以进入项目通讯录邀请更多同事加入本项目</p>
                <p class="pStyle">2、你有权限维护项目成员</p>
                <p class="pStyle">3、系统管理权限可以转移给其他项目成员</p>
              </div>
            </div>
            <div>
              <ButtonGroup>
                <Button @click="tab2Back">上一步</Button>
                <Button
                  type="primary"
                  @click="newMyItem"
                  v-loading.fullscreen.lock="fullscreenLoading"
                >下一步</Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane label="标签三" name="name3">
        <p class="tabTitle">创建新项目 3/3</p>
        <Form
          :model="jobDutiesForm"
          :label-width="150"
          class="formItem"
          ref="jobDutiesForm"
          style="margin-top:10px"
        >
          <FormItem label="你在本项目的工作职责" prop="jobDuties">
            <Input
              v-model="jobDutiesForm.jobDuties"
              clearable
              @on-focus="getFocusData"
              placeholder="请选择你在本项目的工作职责"
              readonly
              style="width:400px"
            ></Input>
            <Tag
              color="default"
              class="item"
              v-for="res in tableData"
              :key="res.deptName"
              closable
              @on-close="handleClose(res.deptName,res.jobName)"
            >{{res.deptName+ '--' + res.jobName}}</Tag>
          </FormItem>
          <FormItem>
            <ButtonGroup>
              <Button @click="tab3Back">上一步</Button>
              <Button
                type="primary"
                @click="notarizeFound"
                v-loading.fullscreen.lock="fullscreenLoading"
              >确认创建</Button>
            </ButtonGroup>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
    <Modal
      title="工作职责"
      v-model="isDutyWork"
      width="768"
      :styles="{top: '30px',postion:'absolute'}"
      @on-cancel="cancel"
      :mask-closable="false"
    >
      <Spin size="large" fix v-if="spinShow"></Spin>
      <el-table :data="tableData" style="width: 100%" empty-text="选中的职位" :show-header="false">
        <el-table-column prop="deptName" label="选中的部门"></el-table-column>
        <el-table-column prop="jobName" label="选中的职位"></el-table-column>
      </el-table>
      <el-tabs tab-position="left" type="border-card" v-model="deptName" stretch>
        <el-tab-pane
          v-for="item in jobWork"
          :label="item.deptName"
          :name="item.deptName"
          :key="item.deptName"
        >
          <el-checkbox-group v-model="jobName" @change="changeJobName">
            <el-checkbox
              v-for="data in item.jobName"
              :label="data"
              class="checkBoxstop20"
              :key="data"
            >{{data}}</el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="preserve">保存</Button>
      </div>
    </Modal>
    <Modal title="项目信息" v-model="itemInfoModel" :styles="{top: '30px',postion:'absolute'}">
      <div style="margin-bottom:20px">
        <span style="display:inline-block;width:70px;text-align:right;padding-right:5px">项目名称</span>
        <Input v-model="user.projectName" disabled style="width:350px;" />
      </div>
      <div style="margin-bottom:20px">
        <span style="display:inline-block;width:70px;text-align:right;padding-right:5px">标段号</span>
        <Input v-model="user.contractTender" disabled style="width:350px;" />
      </div>
      <div style="margin-bottom:20px">
        <span style="display:inline-block;width:70px;text-align:right;padding-right:5px">创建时间</span>
        <Input v-model="user.createDate" disabled style="width:350px;" />
      </div>
      <div style="margin-bottom:20px">
        <span style="display:inline-block;width:70px;text-align:right;padding-right:5px">创建人</span>
        <Input v-model="user.creator" disabled style="width:350px;" />
      </div>
      <div style="margin-bottom:20px">
        <span style="display:inline-block;width:70px;text-align:right;padding-right:5px">联系电话</span>
        <Input v-model="user.creatorPhone" disabled style="width:350px;" />
      </div>
      <div style="margin-bottom:20px">
        <span style="display:inline-block;width:70px;text-align:right;padding-right:5px">创建人职位</span>
        <Input v-model="user.creatorJob" disabled style="width:350px;" />
      </div>
    </Modal>
  </Card>
</template>

<script>
import { getCategoriesData } from '@/api/basicSetting/itemInformation'
import { isDataSuccess } from '@/libs/util'
import {
  getprovinces,
  getcitys,
  getareas,
  newProject,
  gotoitem,
  getSimilar,
  getItemJob,
  joinProject,
  getItemInfo
} from '@/api/console/newProject'

export default {
  data () {
    return {
      user: {},
      projectId: '',
      ifJoinItem: false,
      itemInfoModel: false,
      similarItem: [],
      tabsVal: 'name1',
      activeName: 'first', // 工作职责弹出框--部门
      isDutyWork: false, // 工作职责弹出框
      jobWork: '', // 部门与岗位数据
      deptName: '', // 部门数据
      jobName: [], // 岗位数据
      tableData: [],
      modal1: false, // 弹出框
      fullscreenLoading: false,
      provinceArr: [], // 省份
      citiesArr: [], // 城市
      countyArr: [], // 区县
      projectType: [],
      spinShow: true,
      formItem: {
        // 表单内容
        name: '',
        constructionOrganization: '',
        type: 4,
        section: '',
        province: '四川',
        city: '',
        county: '',
        jobDuties: ''
      },
      provinceId2: '23',
      formItemRules: {
        // 表单验证规则
        name: [
          { required: true, message: '请填写项目名称', trigger: 'blur' }
        ],
        section: [
          {
            required: true,
            message: '请选择标段号',
            trigger: 'change',
            type: 'string'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择项目类型',
            trigger: 'change',
            type: 'number'
          }
        ],
        province: [
          {
            required: true,
            message: '请选择省份',
            trigger: 'change',
            type: 'string'
          }
        ],
        city: [
          {
            required: true,
            message: '请选择城市',
            trigger: 'change',
            type: 'string'
          }
        ],
        county: [
          {
            required: true,
            message: '请选择区县',
            trigger: 'change',
            type: 'string'
          }
        ],
        constructionOrganization: [
          { required: true, message: '请填写施工单位', trigger: 'blur' }
        ]

      },
      jobDutiesForm: {
        jobDuties: ''
      },
      sectionItem1: [
        { value: '1', lable: '1' },
        { value: '2', lable: '2' },
        { value: '3', lable: '3' },
        { value: '4', lable: '4' },
        { value: '5', lable: '5' },
        { value: '6', lable: '6' },
        { value: '7', lable: '7' },
        { value: '8', lable: '8' },
        { value: '9', lable: '9' },
        { value: '10', lable: '10' },
        { value: '11', lable: '11' },
        { value: '12', lable: '12' },
        { value: '13', lable: '13' },
        { value: '14', lable: '14' },
        { value: '15', lable: '15' },
        { value: '16', lable: '16' },
        { value: '17', lable: '17' },
        { value: '18', lable: '18' },
        { value: '19', lable: '19' },
        { value: '20', lable: '20' },
        { value: '21', lable: '21' },
        { value: '22', lable: '22' },
        { value: '23', lable: '23' },
        { value: '24', lable: '24' },
        { value: '25', lable: '25' },
        { value: '26', lable: '26' }
      ],
      sectionItem2: [
        { value: 'A', lable: 'A' },
        { value: 'B', lable: 'B' },
        { value: 'C', lable: 'C' },
        { value: 'D', lable: 'D' },
        { value: 'E', lable: 'E' },
        { value: 'F', lable: 'F' },
        { value: 'G', lable: 'G' },
        { value: 'H', lable: 'H' },
        { value: 'I', lable: 'I' },
        { value: 'J', lable: 'J' },
        { value: 'K', lable: 'K' },
        { value: 'L', lable: 'L' },
        { value: 'M', lable: 'M' },
        { value: 'N', lable: 'N' },
        { value: 'O', lable: 'O' },
        { value: 'P', lable: 'P' },
        { value: 'Q', lable: 'Q' },
        { value: 'R', lable: 'R' },
        { value: 'S', lable: 'S' },
        { value: 'T', lable: 'T' },
        { value: 'U', lable: 'U' },
        { value: 'V', lable: 'V' },
        { value: 'W', lable: 'W' },
        { value: 'X', lable: 'X' },
        { value: 'Y', lable: 'Y' },
        { value: 'Z', lable: 'Z' }
      ],
      sectionItem3: [
        { value: 'I', lable: 'I' },
        { value: 'II', lable: 'II' },
        { value: 'III', lable: 'III' },
        { value: 'IV', lable: 'IV' },
        { value: 'V', lable: 'V' },
        { value: 'VI', lable: 'VI' },
        { value: 'VII', lable: 'VII' },
        { value: 'VIII', lable: 'VIII' },
        { value: 'IX', lable: 'IX' },
        { value: 'X', lable: 'X' },
        { value: 'XI', lable: 'XI' },
        { value: 'XII', lable: 'XII' },
        { value: 'XIII', lable: 'XIII' },
        { value: 'XIV', lable: 'XIV' },
        { value: 'XV', lable: 'XV' },
        { value: 'XVI', lable: 'XVI' },
        { value: 'XVII', lable: 'XVII' },
        { value: 'XVIII', lable: 'XVIII' },
        { value: 'XIX', lable: 'XIX' },
        { value: 'XX', lable: 'XX' },
        { value: 'XXI', lable: 'XXI' },
        { value: 'XXII', lable: 'XXII' },
        { value: 'XXIII', lable: 'XXIII' },
        { value: 'XXIV', lable: 'XXIV' },
        { value: 'XXV', lable: 'XXV' },
        { value: 'XXVI', lable: 'XXVI' }
      ]
    }
  },
  activated () {
    this.tabsVal = 'name1'
    this.tableData = []
    this.jobName = []
    this.$refs.formItem.resetFields()
    // 获取省份
    getprovinces().then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(data.msgContent)
          break
        default:
          this.provinceArr = res.data.msgData
          getcitys(this.provinceId2).then(res => {
            if (res.status === 200) {
              const data = res.data
              if (data.msgCode === 0) {
                this.citiesArr = res.data.msgData
                this.formItem.city = '成都'
                getareas(375).then(res => {
                  if (res.status === 200) {
                    const data = res.data
                    if (data.msgCode === 0) {
                      this.countyArr = res.data.msgData
                      this.formItem.county = '锦江'
                    } else {
                      this.$Message.error(data.msgContent)
                    }
                  } else {
                    this.$Message.error('服务器繁忙请稍后')
                  }
                })
              } else {
                this.$Message.error(data.msgContent)
              }
            } else {
              this.$Message.error('服务器繁忙请稍后')
            }
          })
          this.province = 1
          break
      }
    })
    // 获取项目类型
    getCategoriesData().then(res => {
      if (res.status === 200) {
        const data = res.data
        if (data.msgCode === 0) {
          this.projectType = data.msgData
        } else {
          this.$Message.error(data.msgContent)
        }
      } else {
        this.$Message.error('服务器繁忙请稍后')
      }
    })
  },
  mounted () {
    getcitys(this.provinceId2).then(res => {
      if (res.status === 200) {
        const data = res.data
        if (data.msgCode === 0) {
          this.citiesArr = res.data.msgData
          this.formItem.city = '成都'
          getareas(375).then(res => {
            if (res.status === 200) {
              const data = res.data
              if (data.msgCode === 0) {
                this.countyArr = res.data.msgData
                this.formItem.county = '锦江'
              } else {
                this.$Message.error(data.msgContent)
              }
            } else {
              this.$Message.error('服务器繁忙请稍后')
            }
          })
        } else {
          this.$Message.error(data.msgContent)
        }
      } else {
        this.$Message.error('服务器繁忙请稍后')
      }
    })
    this.province = 1
    // 隐藏tabs标签
    $('.ivu-tabs-bar').css('display', 'none')
  },
  methods: {
    // 加载页面
    openFullScreen (name) {
      // this.tabsVal = 'name2'
      this.$refs[name].validate(valid => {
        if (valid) {
          // 添加项目要传送的值
          let data = {
            name: this.formItem.name,
            constructCompany: this.formItem.constructionOrganization,
            projectCategoryId: this.formItem.type,
            contractTender: this.formItem.section,
            addressProvince: this.formItem.province,
            addressCity: this.formItem.city,
            addressArea: this.formItem.county
          }
          getSimilar(data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                this.spinShow = false
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                this.spinShow = false
                break
              default:
                console.log()
                if (res.data.msgData === null) {
                  this.similarItem = []
                } else {
                  this.similarItem = res.data.msgData
                }
                this.tabsVal = 'name2'
                break
            }
          })
        } else {
          this.$Message.error('请填写项目信息!')
        }
      })
    },
    // 三级联动 - 省份--城市
    changeProvince () {
      this.citiesArr = []
      this.countyArr = []
      this.formItem.city = ''
      this.formItem.county = ''
      this.jobDutiesForm.jobDuties = ''
      this.tableData = []
      this.jobName = []
      let provinceId = this.formItem.province

      let SpecialArea = [1, 2, 3, 4, 32, 33, 34] // 直辖市id
      // 判断是非为直辖市
      let newarr = this.provinceArr.filter(item => {
        return item.name == provinceId
      })
      provinceId = newarr[0].id

      if (SpecialArea.indexOf(provinceId) == -1) {
        getcitys(provinceId).then(res => {
          this.citiesArr = res.data.msgData
        })
      } else {
        this.citiesArr = this.provinceArr.filter(item => item.id == provinceId)
        getcitys(provinceId).then(res => {
          this.countyArr = res.data.msgData
        })
      }
    },
    // 三级联动 - 城市--区县
    changeCity () {
      let newarr = this.citiesArr.filter(item => {
        return item.name === this.formItem.city
      })
      let cityId = 0
      if (newarr.length === 0) {
        cityId = 0
      } else {
        cityId = newarr[0].id
      }
      getareas(cityId).then(res => {
        this.countyArr = res.data.msgData
        this.jobDutiesForm.jobDuties = ''
        this.tableData = []
        this.jobName = []
      })
    },
    back () {
      this.$refs.formItem.resetFields()
      this.$router.go(-1)
    },
    // 选择标段号
    DropdownClick (name) {
      this.formItem.section = name
      this.jobDutiesForm.jobDuties = ''
      this.tableData = []
      this.jobName = []
    },
    // 工作职责输入框focus
    getFocusData () {
      this.spinShow = true
      this.deptName = '项目经理办公室'
      this.isDutyWork = true
      setTimeout(() => {
        $('.el-tabs__header .el-tabs__nav-next').css('display', 'none')
        $('.el-tabs__header .el-tabs__nav-prev').css('display', 'none')
      }, 100)
      this.spinShow = false
    },
    // 工作职责模态框关闭
    cancel () {
      this.isDutyWork = false
    },
    // 工作职责模态框保存
    preserve () {
      this.jobDutiesForm.jobDuties = '点击修改'
      this.isDutyWork = false
    },
    // 值改变 清空工作职责
    formChange () {
      this.jobDutiesForm.jobDuties = ''
      this.tableData = []
      this.jobName = []
    },
    // 改变选择框时 改变表格数据
    changeJobName (job) {
      let data = []
      this.jobWork.forEach(res => {
        job.forEach(item => {
          if (res.jobName.indexOf(item) !== -1) {
            data.push({ deptName: res.deptName, jobName: item })
          }
        })
      })
      // 数组对象相同项合并处理
      var map = {}
      var dest = []
      for (var i = 0; i < data.length; i++) {
        var ai = data[i]
        if (!map[ai.deptName]) {
          dest.push({
            deptName: ai.deptName,
            jobName: ai.jobName
          })
          map[ai.deptName] = ai
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.deptName === ai.deptName) {
              dj.jobName = dj.jobName + '、' + ai.jobName
              break
            }
          }
        }
      };
      this.tableData = dest
    },
    handleClose (deptName, jobName) {
      this.tableData.forEach((res, index) => {
        if (res.deptName === deptName) {
          this.tableData.splice(index, 1)
        }
      })

      this.jobName.forEach((res, index) => {
        if (res === jobName) {
          this.jobName.splice(index, 1)
        }
      })
    },
    tab2Back () {
      this.tabsVal = 'name1'
    },
    tab3Back () {
      this.tabsVal = 'name2'
    },
    // 创建独立项目
    newMyItem () {
      getItemJob(-1).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            this.spinShow = false
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            this.spinShow = false
            break
          default:
            this.jobName = []
            this.deptName = ''
            this.jobDutiesForm.jobDuties = ''
            this.tableData = []
            this.jobWork = []
            this.ifJoinItem = false
            this.jobWork = res.data.msgData
            this.tabsVal = 'name3'
            break
        }
      })
    },
    // 加入项目
    joinItem (projectId) {
      this.projectId = projectId
      getItemJob(projectId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            this.spinShow = false
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            this.spinShow = false
            break
          default:
            this.jobName = []
            this.deptName = ''
            this.jobDutiesForm.jobDuties = ''
            this.tableData = []
            this.jobWork = []
            this.ifJoinItem = true
            this.jobWork = res.data.msgData
            this.tabsVal = 'name3'
            break
        }
      })
    },
    lookInfo (id) {
      getItemInfo(id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.user = res.data.msgData
            this.itemInfoModel = true
            break
        }
      })
    },
    notarizeFound () {
      if (this.tableData.length === 0) {
        this.$Message.error('请选择工作职责')
      } else {
        const loading = this.$loading({
          lock: true,
          text: '',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (this.ifJoinItem === true) {
          let deptName = []
          this.tableData.forEach(res => {
            deptName.push(res.deptName)
          })
          let data = {
            name: this.formItem.name,
            constructCompany: this.formItem.constructionOrganization,
            projectCategoryId: this.formItem.type,
            contractTender: this.formItem.section,
            addressProvince: this.formItem.province,
            addressCity: this.formItem.city,
            addressArea: this.formItem.county,
            deptName: deptName,
            jobName: this.jobName
          }
          joinProject(this.projectId, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                loading.close()
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                loading.close()
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.$Message.success('新建项目成功！')
                gotoitem(res.data.msgData).then(res => {
                  let status = isDataSuccess(res)
                  switch (status) {
                    case 1:
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      this.$Message.error(res.data.msgContent)
                      break
                    default:
                      loading.close()
                      this.$refs.formItem.resetFields()
                      this.$router.go(-1)
                  }
                })
                break
            }
          })
        } else {
          let deptName = []
          this.tableData.forEach(res => {
            deptName.push(res.deptName)
          })
          let data = {
            name: this.formItem.name,
            constructCompany: this.formItem.constructionOrganization,
            projectCategoryId: this.formItem.type,
            contractTender: this.formItem.section,
            addressProvince: this.formItem.province,
            addressCity: this.formItem.city,
            addressArea: this.formItem.county,
            deptName: deptName,
            jobName: this.jobName
          }
          newProject(data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                loading.close()
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                loading.close()
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.$Message.success('新建项目成功！')
                gotoitem(res.data.msgData).then(res => {
                  let status = isDataSuccess(res)
                  switch (status) {
                    case 1:
                      this.$Message.error('服务器繁忙请稍后')
                      break
                    case 2:
                      this.$Message.error(res.data.msgContent)
                      break
                    default:
                      loading.close()
                      this.$refs.formItem.resetFields()
                      this.$router.go(-1)
                  }
                })
                break
            }
          })
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.card {
  height: 100%;
}

.formItem {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 20px;
  .location {
    width: 500px;
  }
}
.button_sty {
  padding: 6px 30px 6px 30px !important;
}
.tabPane {
  height: 200px;
  overflow-y: auto;
}
.checkBoxstop20 {
  margin-top: 20px;
  width: 150px;
  text-align: left;
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
  margin-top: 10px;
  color: #657180;
}
.tabTitle {
  font-size: 20px;
  font-weight: 400;
  margin: 12px 0;
}
.pStyle {
  margin: 8px;
  font-size: 14px;
}
</style>

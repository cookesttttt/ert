<template>
  <Row :gutter="10"
       style="height:100%">
    <!--树形控件-->
    <Col span="5"
         style="height:100%">
    <Card class="card">
      <Spin size="large"
            fix
            v-if="spinShow"></Spin>
      <div style="text-align:left;">
        <Dropdown @on-click="ClickDropdown"
                  trigger="click">
          <Button type="primary"
                  icon="md-settings">
            维护选中部门
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="1"
                          :disabled="isremove">修改名称</DropdownItem>
            <DropdownItem name="2"
                          :disabled="isAdd">新建下级部门</DropdownItem>
            <DropdownItem name="3"
                          :disabled="isremove">加入已有部门</DropdownItem>
            <DropdownItem name="4"
                          :disabled="isremove">移动</DropdownItem>
            <DropdownItem name="5"
                          :disabled="isremove">删除</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Tree ref="tree"
            id="tree"
            :data="treeData"
            :render="renderContent"></Tree>
    </Card>
    </Col>
    <Col span="19"
         style="height:100%">
    <Card class="card">
      <div style="font-weight:bold;padding-left: 16px;height:30px;line-height:30px;">{{ treeSelectData.name }}&nbsp;</div>
      <Collapse simple
                v-model="vule1">
        <Panel name="1">
          管理内容
          <div slot="content">
            <Table :columns="manageColumns"
                   :data="manageData"
                   border>
              <template slot-scope="{ row }"
                        slot="manges">
                <span v-for="(item,index) in row.manges"
                      :key="item.id"
                      @click="manageClick(item,row.name)">
                  <span class="manageItem">{{item.name}}</span>
                  <span v-if="index !== row.manges.length - 1">、</span>
                </span>
              </template>
              <template slot-scope="{ row }"
                        slot="works">
                <span v-for="(item,index) in row.works"
                      :key="item.id"
                      @click="manageClick(item,row.name)">
                  <span class="manageItem">{{item.name}}</span>
                  <span v-if="index !== row.works.length - 1">、</span>
                </span>
              </template>
            </Table>
          </div>
        </Panel>
        <Panel name="2">
          岗位人员
          <div slot="content">
            <ButtonGroup>
              <Button style="margin-left: 10px"
                      @click="addPost"
                      type="primary">新建岗位</Button>
              <Button @click="jobJoin">加入已有岗位</Button>
            </ButtonGroup>
            <vxe-table border
                       resizable
                       show-overflow
                       ref="xTree"
                       :tree-config="{children: 'teamer'}"
                       :expand-config="{iconOpen: 'fa fa-minus-square-o', iconClose: 'fa fa-plus-square-o'}"
                       :data="tableData"
                       style="margin-top:20px">
              <vxe-table-column field="name"
                                title="岗位/人员"
                                tree-node
                                width="200"></vxe-table-column>
              <vxe-table-column field="deptType"
                                title="类型"
                                width="240"></vxe-table-column>
              <vxe-table-column field="contents"
                                title="工作职责">
                <template v-slot="{ row }">
                  <span>{{getContents(row.contents)}}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="date"
                                title="操作"
                                width="110">
                <template v-slot="{ row }">
                  <span v-if="row.contents">
                    <Dropdown @on-click="ClickDept($event,row)"
                              transfer
                              trigger="click">
                      <Button type="primary">
                        维护岗位
                        <Icon type="ios-arrow-down"></Icon>
                      </Button>
                      <DropdownMenu slot="list">
                        <DropdownItem name="1">修改名称/职责</DropdownItem>
                        <DropdownItem name="2">移动</DropdownItem>
                        <DropdownItem name="3">删除</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </span>
                  <span v-else>
                    <Dropdown @on-click="ClickPerson($event,row)"
                              transfer
                              trigger="click">
                      <Button>
                        维护人员
                        <Icon type="ios-arrow-down"></Icon>
                      </Button>
                      <DropdownMenu slot="list">
                        <DropdownItem name="1">修改所属部门</DropdownItem>
                        <DropdownItem name="2">移除项目部</DropdownItem>
                        <DropdownItem name="3">加入黑名单</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </span>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
        </Panel>
      </Collapse>
      <!-- <Modal title="新建下级部门" v-model="isAddModal" @on-cancel="cancel(1)" :mask-closable="false">
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
        </Modal>-->
      <Modal title="编辑部门"
             v-model="isEditModal"
             :mask-closable="false">
        <Form inline
              ref="editDepartmentalData"
              :model="editDepartmentalData"
              :rules="rules"
              :label-width="100">
          <FormItem label="部门名称"
                    prop="name">
            <Input v-model="editDepartmentalData.name"
                   style="width:350px"
                   :maxlength="15"></Input>
          </FormItem>
          <br />
          <FormItem label="部门描述">
            <Input v-model="editDepartmentalData.des"
                   style="width:350px"
                   :maxlength="15"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="cancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="editorialDepartment">保存</Button>
        </div>
      </Modal>
      <Modal v-model="removeModal"
             width="360"
             title="删除部门">
        <div style="text-align:center">
          <p>删除后将无法恢复</p>
        </div>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="deleteDepartmentCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="deleteDepartmentSelet(treeSelectData.id)">确认</Button>
        </div>
      </Modal>
      <!--新增岗位弹框-->
      <Modal title="新建岗位"
             v-model="isAddJobModal"
             :mask-closable="false"
             @on-cancel="jobCancel(1)"
             :styles="{top: '20px'}">
        <Form ref="addJobsData"
              :model="addJobsData"
              :label-width="100"
              inline
              :rules="jobRules"
              style="max-height:400px;overflow-y:auto;">
          <FormItem label="岗位名称"
                    prop="name">
            <Input v-model="addJobsData.name"
                   class="width350"
                   :maxlength="15"></Input>
          </FormItem>
          <br />
          <FormItem label="类型"
                    prop="deptType">
            <Select v-model="addJobsData.deptType"
                    class="width350"
                    transfer>
              <Option v-for="item in jobClassification"
                      :value="item"
                      :key="item.id">{{item}}</Option>
            </Select>
          </FormItem>
          <br />
          <FormItem label="工作职责"
                    prop="obligation">
            <CheckboxGroup v-model="addJobsData.obligation">
              <div class="checkDiv"
                   v-for="i in jobDuties"
                   :key="i.id">
                <p>{{i.name}}</p>
                <div style="padding-left:20px">
                  <Checkbox :label="j.id"
                            v-for="j in i.workContentDTOS"
                            :key="j.id">{{j.name}}</Checkbox>
                </div>
              </div>
            </CheckboxGroup>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="jobCancel(1)">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="addJob">保存</Button>
        </div>
      </Modal>
      <Modal title="编辑岗位"
             v-model="isChangeJobModal"
             :mask-closable="false"
             @on-cancel="jobCancel"
             :styles="{top: '20px'}">
        <Form ref="editJobsData"
              :model="editJobsData"
              :label-width="100"
              inline
              :rules="jobRules"
              style="max-height:400px;overflow-y:auto;">
          <FormItem label="岗位名称"
                    prop="name">
            <Input v-model="editJobsData.name"
                   class="width350"
                   :maxlength="15"></Input>
          </FormItem>
          <br />
          <FormItem label="类型"
                    prop="deptType">
            <Select v-model="editJobsData.deptType"
                    class="width350"
                    transfer>
              <Option v-for="item in jobClassification"
                      :value="item"
                      :key="item.id">{{item}}</Option>
            </Select>
          </FormItem>
          <br />
          <FormItem label="工作职责"
                    prop="obligation">
            <CheckboxGroup v-model="editJobsData.obligation">
              <div class="checkDiv"
                   v-for="i in jobDuties"
                   :key="i.id">
                <p>{{i.name}}</p>
                <div style="padding-left:20px">
                  <Checkbox :label="j.id"
                            v-for="j in i.workContentDTOS"
                            :key="j.id">{{j.name}}</Checkbox>
                </div>
              </div>
            </CheckboxGroup>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="jobCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="ChangeJobModal">保存</Button>
        </div>
      </Modal>
      <Modal v-model="removeJobModal"
             width="360"
             title="删除岗位">
        <div style="text-align:center">
          <p>删除后将无法恢复</p>
        </div>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="removeJobCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="removeJob(jobId)">删除</Button>
        </div>
      </Modal>
      <Modal v-model="jobJoinDept"
             title="加入已有岗位"
             @on-cancel="jobJoinDeptCancel"
             width="768">
        <el-tabs tab-position="left"
                 type="border-card"
                 v-model="jobJoindeptName"
                 stretch>
          <el-tab-pane v-for="item in checkBox"
                       :label="item.department.name"
                       :name="item.department.name"
                       :key="item.department.name">
            <el-checkbox-group v-model="jobJoinDeptVal">
              <el-checkbox v-for="data in item.roles"
                           :label="data.id"
                           class="checkBoxstop20"
                           :key="data.id">{{data.name}}</el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="jobJoinDeptCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="jobJoinDeptOk">保存</Button>
        </div>
      </Modal>
      <Modal v-model="deptJoinDept"
             title="加入已有部门"
             @on-ok="deptJoinDeptOk"
             @on-cancel="deptJoinDeptCancel"
             width="768">
        <CheckboxGroup v-model="deptJoinDeptVal">
          <Checkbox :label="item.id"
                    v-for="item in deptCanJoin"
                    :key="item.id"
                    style="width:160px;margin-bottom:5px"
                    size="large">{{ item.name }}</Checkbox>
        </CheckboxGroup>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="deptJoinDeptCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="deptJoinDeptOk">保存</Button>
        </div>
      </Modal>

      <Modal v-model="deptMove"
             title="移动部门"
             @on-ok="deptMoveOk"
             @on-cancel="deptMoveCancel"
             style="text-align:center;">
        请选择要移动到的部门
        <Select v-model="deptMoveVal"
                style="width:300px">
          <Option v-for="item in canMoveDeptData"
                  :value="item.id"
                  :key="item.id">{{ item.name }}</Option>
        </Select>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="deptMoveCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="deptMoveOk()">保存</Button>
        </div>
      </Modal>
      <Modal v-model="jobMoveDept"
             title="移动岗位"
             @on-ok="jobMoveDeptOk"
             @on-cancel="jobMoveDeptCancel"
             width="768"
             style="text-align:center;">
        请选择要移动到的部门
        <Select v-model="jobMoveDeptVal"
                style="width:200px">
          <Option v-for="item in allDeptData"
                  :value="item.id"
                  :key="item.id">{{ item.name }}</Option>
        </Select>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="jobMoveDeptCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="jobMoveDeptOk(jobId)">保存</Button>
        </div>
      </Modal>
      <Modal v-model="removePerson"
             width="360"
             title="移除项目成员">
        <div style="text-align:center">
          <p>确定该用户不是本项目部成员,删除后将无法恢复</p>
        </div>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="removePersonCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="removePersonOK">确认</Button>
        </div>
      </Modal>
      <Modal v-model="joinBlackList"
             width="360"
             title="加入黑名单">
        <div style="text-align:center">
          <p>确定将该用户加入黑名单</p>
          <p>加入后该用户无法再次加入项目</p>
        </div>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="joinBlackListCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="joinBlackListOk">确认</Button>
        </div>
      </Modal>
      <Modal title="工作职责"
             v-model="isDutyWork"
             width="768"
             :styles="{top: '30px',postion:'absolute'}"
             @on-cancel="isDutyWorkCancel"
             :mask-closable="false">
        <el-tabs tab-position="left"
                 type="border-card"
                 v-model="deptName">
          <el-tab-pane v-for="item in jobWork"
                       :label="item.department.name"
                       :name="item.department.name"
                       :key="item.department.name">
            <el-radio-group v-model="jobName">
              <el-radio v-for="data in item.roles"
                        :label="data.id"
                        class="checkBoxstop20"
                        :key="data.name">{{data.name}}</el-radio>
            </el-radio-group>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="isDutyWorkCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="isDutyWorkPreserve">保存</Button>
        </div>
      </Modal>
      <Modal v-model="isAddModal"
             width="1120"
             title="新建部门"
             :styles="{top: '20px'}">
        <div style="max-height:400px;overflow-y:auto;">
          <div>
            <span class="deptName">部门名称：</span>
            <Input style="width:300px"
                   v-model="newDepartmentalData.name" />
          </div>
          <Steps style="width:800px;margin:20px auto auto auto;">
            <Step title="确认管理范围"
                  content="在候选工作中勾选部门（包含下级部门）的管理范围"
                  status="process"></Step>
            <Step title="确认部门职责"
                  content="在确认的管理范围内勾选出本部门的具体工作"
                  status="process"></Step>
          </Steps>
          <Row style="margin-top:20px"
               type="flex"
               justify="space-around">
            <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">勾选管理范围</p>
              <Checkbox slot="extra"
                        :indeterminate="indeterminate"
                        :value="checkAll"
                        @click.prevent.native="handleCheckAll">全选</Checkbox>
              <CheckboxGroup v-model="checkAllGroup"
                             @on-change="checkAllGroupChange">
                <div class="checkDiv"
                     v-for="i in workContentItem"
                     :key="i.id">
                  <p>{{i.name}}</p>
                  <div style="padding-left:20px">
                    <Checkbox :label="j.id"
                              v-for="j in i.systemWorkDTOs"
                              :key="j.id">{{j.name}}</Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </Card>
            </Col>
            <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">管理范围</p>
              <div class="checkDiv"
                   v-for="i in workContentItem"
                   v-if="ifManageCheck(i)">
                <p>{{i.name}}</p>
                <div style="padding-left:20px;word-break: break-all;word-wrap: break-word;width:100%;">
                  <span style="color: #515a6e;margin-right: 10px;font-size: 12px; white-space: pre-wrap;word-wrap: break-word;display:inline-block;margin-left:16px;"
                        :label="j.id"
                        v-for="j in i.systemWorkDTOs"
                        :key="j.id"
                        v-if="checkAllGroup.indexOf(j.id) !== -1">{{j.name}}</span>
                </div>
              </div>
            </Card>
            </Col>
            <Divider type="vertical"
                     style="height:auto;" />
            <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">勾选部门职责</p>
              <Checkbox slot="extra"
                        :indeterminate="manageIndeterminate"
                        :value="manageCheckAll"
                        @click.prevent.native="managehandleCheckAll">全选</Checkbox>
              <CheckboxGroup v-model="manageCheckAllGroup"
                             @on-change="manageCheckAllGroupChange">
                <div class="checkDiv"
                     v-for="i in workContentItem"
                     v-if="ifManageCheck(i)">
                  <p>{{i.name}}</p>
                  <div style="padding-left:20px">
                    <Checkbox :label="j.id"
                              v-for="j in i.systemWorkDTOs"
                              :key="j.id"
                              v-if="checkAllGroup.indexOf(j.id) !== -1">{{j.name}}</Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </Card>
            </Col>
            <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">部门职责</p>
              <div class="checkDiv"
                   v-for="i in workContentItem"
                   v-if="ifDeptCheck(i)">
                <p>{{i.name}}</p>
                <div style="padding-left:20px;word-break: break-all;word-wrap: break-word;width:100%;">
                  <span style="color: #515a6e;margin-right: 10px;font-size: 12px; white-space: pre-wrap;word-wrap: break-word;display:inline-block;margin-left:16px;"
                        :label="j.id"
                        v-for="j in i.systemWorkDTOs"
                        :key="j.id"
                        v-if="manageCheckAllGroup.indexOf(j.id) !== -1">{{j.name}}</span>
                </div>
              </div>
            </Card>
            </Col>
          </Row>
        </div>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="cancel(1)">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="addDepartment">保存</Button>
        </div>
      </Modal>
      <Modal v-model="managePermission"
             :title="getManagePermissionTitle()">
        <Form :model="managePermissionForm"
              label-position="left"
              :label-width="100"
              :rules="managePermissionFormRule"
              ref="managePermissionForm">
          <FormItem label="模块名称">
            <Input v-model="managePermissionForm.name"
                   disabled></Input>
          </FormItem>
          <FormItem label="所属体系">
            <Input v-model="managePermissionForm.system"
                   disabled></Input>
          </FormItem>
          <FormItem label="管理部门"
                    prop="dept">
            <Select v-model="managePermissionForm.dept">
              <Option :value="item.id"
                      :key="item.id"
                      v-for="item in allDeptData">{{item.name}}</Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="管理岗位" prop="job">
              <Select v-model="managePermissionForm.job">
                <Option :value="item.id" :key="item.id" v-for="item in deptJobs">{{item.name}}</Option>
              </Select>
            </FormItem>-->
        </Form>
        <div slot="footer">
          <Button type="text"
                  size="large"
                  @click="managePermissionCancel">取消</Button>
          <Button type="primary"
                  size="large"
                  @click="managePermissionOk">保存</Button>
        </div>
      </Modal>
    </Card>
    </Col>
  </Row>
</template>

<script>
import { getAllData, getOwnDept, getAllJob, jobMoveDept, getMoveDept, deptMoveDept, getAllDept, moveJob, getCanMoveDept, MoveDept, joinBlacklist, getWork, getDeptWorkingRange, moveWorkContent } from '@/api/basicSetting/OrganizationMaintenance'
import { isDataSuccess } from '@/libs/util'
import {
  getAlltreeData,
  deleteDepartmentData,
  addDepartmentData,
  editorialDepartmentData
} from '@/api/basicSetting/Departmentmaintenance'
import {
  deleteJobsData,
  getJobsObligationData,
  newJobsData,
  getEditJobsData,
  jobsType
} from '@/api/basicSetting/Postmaintenance'
import { getAllRole, putTeamer, deleteTeamer } from '@/api/basicSetting/memberTable'

export default {
  data () {
    return {
      manageJurisdiction: {},
      deptJobs: [],
      managePermissionForm: {
        name: '进度跟踪',
        system: '进度管理',
        dept: '项目经理办公室'
        // job: '项目经理'
      }, // 管理权限表单
      managePermission: false, // 管理权限弹框
      indeterminate: false,
      checkAll: false,
      manageIndeterminate: false,
      manageCheckAll: false,
      workContentItem: [], // 候选工作选择框
      manageContentItem: [], // 管理工作选择框
      manageCheckAllGroup: [], // 管理工作选择框被选中值
      checkAllGroupIds: [], // 候选工作选择框值
      checkAllGroup: [], // 候选工作选择框 -- 测试

      isAdd: false, // 新增下级部门是否可用
      newDept: false, // 新 - 新建部门
      vule1: '2',
      jobJoindeptName: '',
      user: {}, // 选中用户teamerId
      userId: '', // 选中用户ID
      removePerson: false, // 删除用户
      joinBlackList: false, // 删除用户
      deptName: '',
      jobWork: [],
      jobName: '',
      isDutyWork: false, // 删除用户
      deptMoveVal: '', // 部门移动到数据
      deptMove: false, // 部门移动弹框
      jobMoveDeptVal: '', // 岗位移动 到部门的iD
      jobMoveDept: false, // 岗位移动到部门弹框
      allDeptData: [], // 所有部门
      canMoveDeptData: [], // 可以移动到的部门
      spinShow: false, // 左侧数结构加载
      isremove: false, // 禁用部门 删除 移动 编辑按钮
      removeModal: false, // 删除弹框
      removeJobModal: false, // 删除弹框
      jobJoinDept: false, // 加入已有岗位
      deptJoinDept: false, // 加入已有岗位
      jobJoinDeptVal: [], // 加入已有岗位 checkBox 值
      deptJoinDeptVal: [], // 加入已有部门 checkBox 值
      checkBox: [], // 加入已有岗位 -- 岗位名称
      deptCanJoin: [], // 加入已有部门 -- 部门名称
      treeData: [], // 树组件数据
      jobId: '', // 岗位id
      tableData: [], // 表格数据
      isAddModal: false, // 新建下级部门弹框
      isAddJobModal: false, // 新建岗位弹框
      isChangeJobModal: false, // 编辑岗位弹框
      isEditModal: false, // 编辑部门弹框
      newDepartmentalData: {
        name: '', // 新建部门名称
        des: '' // 新建部门描述
      }, // 新建下级form 表单
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
      editDepartmentalData: {
        id: '', // 编辑当前数据的Id
        name: '', // 编辑部门名称
        des: '' // 编辑部门描述
      },
      treeSelectData: '', // 选中的树节点数据
      treeSelectNode: '', // 选中的树节点数据
      treeSelectRoot: '', // 选中的树节点数据
      treeNode: '', // 选中树的节点
      addJobsData: { // 新建岗位form
        name: '',
        deptType: '',
        obligation: []
      },
      editJobsData: { // 修改岗位form
        name: '',
        deptType: '',
        id: '',
        obligation: []
      },
      jobClassification: [], // 岗位分类
      jobDuties: [], // 工作职责
      jobRules: { // 编辑岗位验证
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
      manageData: [], // 管理内容 -- 表格数据
      manageColumns: [ // 管理内容 -- 表格配置
        {
          title: ' ',
          key: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '部门职责（仅本部门）',
          key: 'works',
          slot: 'works',
          width: 240
        },
        {
          title: '管理范围（包含下级部门）',
          key: 'manges',
          slot: 'manges'
        }
      ],
      managePermissionFormRule: {
        dept: [
          { required: true, message: '请选择部门', trigger: 'change', type: 'number' }
        ]
        // job: [
        //   { required: true, message: '请选择岗位', trigger: 'change', type: 'number' }
        // ]
      }
    }
  },
  methods: {
    renderContent (h, { root, node, data }) {
      if (data.name === '部门') {
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
                // if (data.nodeKey === 0) {
                //   this.isForbidden = true
                // } else {
                //   this.isForbidden = false
                // }
                if (data.name === '部门') {
                  this.isAdd = true
                } else {
                  this.isAdd = false
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
                this.treeSelectData = data
                this.treeSelectNode = node
                this.treeSelectRoot = root
                if (this.treeNodeId === -1) {
                  this.tableData = []
                  this.manageData = []
                } else {
                  this.getTable(data.id)
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
              backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey)
                }
                if (data.name === '部门') {
                  this.isAdd = true
                } else {
                  this.isAdd = false
                }
                // if (data.nodeKey === 0) {
                //   this.isForbidden = true
                // } else {
                //   this.isForbidden = false
                // }
                if (data.name === '项目经理办公室') {
                  this.isremove = true
                } else if (data.nodeKey === 0) {
                  this.isremove = true
                } else {
                  this.isremove = false
                }
                this.treeNode = this.$refs.tree.getSelectedNodes()
                this.treeNodeId = this.treeNode[0].id
                this.treeSelectData = data
                this.treeSelectNode = node
                this.treeSelectRoot = root
                if (this.treeNodeId === -1) {
                  this.tableData = []
                  this.manageData = []
                } else {
                  this.getTable(data.id)
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
    // 部门维护
    ClickDropdown (name) {
      switch (name) {
        case '1':
          this.editDepartmentalData.name = this.treeSelectData.name
          this.editDepartmentalData.des = this.treeSelectData.des
          this.editDepartmentalData.id = this.treeSelectData.id
          this.isEditModal = true
          break

        case '2':
          getDeptWorkingRange(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.workContentItem = res.data.msgData
                this.checkAllGroupIds = []
                this.checkAllGroup = []
                res.data.msgData.forEach(res => {
                  res.systemWorkDTOs.forEach(item => {
                    this.checkAllGroupIds.push(item.id)
                  })
                })
                this.isAddModal = true
                break
            }
          })
          break
        case '3':
          getMoveDept(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                if (res.data.msgData.length === 0) {
                  this.$Message.info('暂无部门可以加入')
                } else {
                  this.deptJoinDeptVal = []
                  this.deptCanJoin = res.data.msgData
                  this.deptJoinDept = true
                }
                break
            }
          })
          break
        case '4':
          getCanMoveDept(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                if (res.data.msgData.length === 0) {
                  this.$Message.info('暂无部门可以加入')
                } else {
                  this.canMoveDeptData = res.data.msgData
                  this.deptMove = true
                }
                break
            }
          })
          break
        case '5':
          this.removeModal = true
          break
      }
    },
    // 岗位维护
    ClickDept (name, row) {
      this.jobId = row
      if (row.name === '项目经理') {
        this.$Message.error('项目经理不允许被操作')
      } else {
        switch (name) {
          case '1':
            console.log(row)

            this.$refs.editJobsData.resetFields() // 清空
            this.editJobsData.name = row.name
            this.editJobsData.deptType = row.deptType
            this.editJobsData.id = row.id
            getJobsObligationData(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id).then(res => {
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  break
                case 2:
                  this.$Message.error(res.data.msgContent)
                  break
                default:
                  this.jobDuties = res.data.msgData
                  this.editJobsData.obligation = []
                  row.contents.forEach(res => {
                    this.editJobsData.obligation.push(res.id)
                  })
                  this.isChangeJobModal = true
                  break
              }
            })
            break

          case '2':
            getAllJob(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  break
                case 2:
                  this.$Message.error(res.data.msgContent)
                  break
                default:
                  let job = []
                  res.data.msgData.forEach(res => {
                    res.roles.forEach(item => {
                      job.push(item.name)
                    })
                  })
                  if (job.indexOf(row.name) === -1) {
                    this.$Message.error(row.name + '不允许移动')
                  } else {
                    getAllDept(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
                      let status = isDataSuccess(res)
                      switch (status) {
                        case 1:
                          this.$Message.error('服务器繁忙请稍后')
                          break
                        case 2:
                          this.$Message.error(res.data.msgContent)
                          break
                        default:
                          this.allDeptData = res.data.msgData
                          this.jobMoveDept = true
                          break
                      }
                    })
                  }
                  break
              }
            })
            break
          case '3':
            this.removeJobModal = true
            break
        }
      }
    },
    // 人员维护
    ClickPerson (name, row) {
      // if (this.tableData[0].name === '项目经理') {
      //   this.tableData[0].teamer.forEach(item => {
      //     if (item.name === row.name) {
      //       this.$Message.error('项目经理不允许被操作')
      //     } else {
      //       switch (name) {
      //         case '1':
      //           getAllRole(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      //             let status = isDataSuccess(res)
      //             switch (status) {
      //               case 1:
      //                 this.$Message.error('服务器繁忙请稍后')
      //                 break
      //               case 2:
      //                 this.$Message.error(res.data.msgContent)
      //                 break
      //               default:
      //                 this.jobWork = res.data.msgData
      //                 this.deptName = row.dept
      //                 this.jobWork.forEach(item => {
      //                   if (item.department.name === this.deptName) {
      //                     item.roles.forEach(res => {
      //                       if (res.name === row.job) {
      //                         this.jobName = res.id
      //                       }
      //                     })
      //                   }
      //                 })
      //                 this.userId = row.id
      //                 this.jobName = ''
      //                 this.isDutyWork = true
      //                 break
      //             }
      //           })
      //           break
      //         case '2':
      //           this.userId = row.id
      //           this.removePerson = true
      //           break
      //         case '3':
      //           this.userId = row.id
      //           this.user = {
      //             name: row.name,
      //             phone: row.phone,
      //             projectId: JSON.parse(localStorage.getItem('projectId')).id,
      //             userId: row.userId
      //           }
      //           this.joinBlackList = true
      //           break
      //       }
      //     }
      //   })
      // } else {
      switch (name) {
        case '1':
          getAllRole(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.jobWork = res.data.msgData
                this.deptName = row.dept
                this.jobWork.forEach(item => {
                  if (item.department.name === this.deptName) {
                    item.roles.forEach(res => {
                      if (res.name === row.job) {
                        this.jobName = res.id
                      }
                    })
                  }
                })
                this.userId = row.id
                this.jobName = ''
                this.isDutyWork = true
                break
            }
          })
          break
        case '2':
          this.userId = row.id
          this.removePerson = true
          break
        case '3':
          this.userId = row.id
          this.user = {
            name: row.name,
            phone: row.phone,
            projectId: JSON.parse(localStorage.getItem('projectId')).id,
            userId: row.id
          }
          this.joinBlackList = true
          break
      }
      // }
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
    // 默认选中
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
    },
    // 删除后树节点改变
    removeTree (root, node, data) {
      const parentKey = root.find(el => el === node).parent
      const parent = root.find(el => el.nodeKey === parentKey).node
      const index = parent.children.indexOf(data)
      parent.children.splice(index, 1)
    },
    // 关闭弹框
    cancel (status) {
      if (status === 1) {
        this.newDepartmentalData.name = ''
        this.manageCheckAllGroup = []
        this.checkAllGroup = []
        this.isAddModal = false
      } else {
        this.$refs.editDepartmentalData.resetFields() // 清空
        this.isEditModal = false
      }
    },
    // 工作职责转换
    getContents (contents) {
      let str = ''
      if (contents) {
        contents.forEach(res => {
          str += res.name + '、'
        })
      }
      return str
    },
    // 新增下级部门
    addDepartment () {
      if (this.newDepartmentalData.name.length === 0) {
        this.$Message.error('部门名称不能为空')
      } else if (this.checkAllGroup.length === 0) {
        this.$Message.error('请选择管理范围')
      } else if (this.manageCheckAllGroup.length === 0) {
        this.$Message.error('请选择部门职责')
      } else {
        let result = []
        let c = this.manageCheckAllGroup
        for (var i = 0; i < this.checkAllGroup.length; i++) {
          if (c.indexOf(this.checkAllGroup[i]) === -1) {
            result.push(this.checkAllGroup[i])
          }
        }
        const data = {
          name: this.newDepartmentalData.name,
          des: '',
          mangeIds: result,
          workContentIds: this.manageCheckAllGroup
        }
        addDepartmentData(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id, data).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              this.spinShow = true
              getAlltreeData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
                    this.treeData = []
                    this.treeData.push(res.data.msgData)
                    this.treeChangeExpand(this.treeData, true)
                    this.selectedTree(this.treeData, this.treeSelectData.name)
                    this.spinShow = false
                    break
                }
              })
              this.cancel(1) // 清空
              this.isAddModal = false
              this.$Message.success(res.data.msgContent)
              break
          }
        })
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
                  for (let i = 0; i < this.treeNode.length; i++) {
                    if (this.editDepartmentalData.id === this.treeNode[i].id) {
                      //  修改树结构的数据，获取的数据传入table中
                      this.treeNode[i].name = this.editDepartmentalData.name
                      this.treeNode[i].des = this.editDepartmentalData.des
                      this.isEditModal = false
                      this.$Message.success(res.data.msgContent)
                    }
                  }
                  break
              }
            }
          )
        }
      })
    },
    // 删除部门
    deleteDepartmentSelet (id) {
      deleteDepartmentData(JSON.parse(localStorage.getItem('projectId')).id, id).then(res => {
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
            this.spinShow = true
            getAlltreeData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
                  this.treeData = []
                  this.treeData.push(res.data.msgData)
                  this.treeChangeExpand(this.treeData, true)
                  this.selectedTree(this.treeData, this.treeSelectData.name)
                  this.spinShow = false
                  this.removeModal = false
                  break
              }
            })
            break
        }
      })
    },
    // 新增岗位按钮
    addPost () {
      this.$refs.addJobsData.resetFields() // 清空
      this.isAddJobModal = true
      getJobsObligationData(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.jobDuties = res.data.msgData
            this.addJobsData.obligation = []
            this.editJobsData.obligation = []
            break
        }
      })
    },
    jobCancel (status) {
      if (status === 1) {
        this.$refs.addJobsData.resetFields() // 清空
        this.isAddJobModal = false
      } else {
        this.$refs.editJobsData.resetFields() // 清空
        this.isChangeJobModal = false
      }
    },
    // 怎加岗位
    addJob () {
      this.$refs.addJobsData.validate((valid) => {
        if (valid) {
          const data = {
            'name': this.addJobsData.name,
            'departmentId': this.treeNodeId,
            'deptType': this.addJobsData.deptType,
            'workContentIds': this.addJobsData.obligation,
            projectId: JSON.parse(localStorage.getItem('projectId')).id
          }
          newJobsData(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.getTable(this.treeSelectData.id)
                this.jobCancel(1)
                this.$Message.success(res.data.msgContent)
                break
            }
          })
        }
      })
    },
    // 编辑岗位 -- 弹框保存
    ChangeJobModal () {
      const data = {
        'name': this.editJobsData.name,
        'departmentId': this.treeNodeId,
        'deptType': this.editJobsData.deptType,
        'workContentIds': this.editJobsData.obligation,
        projectId: JSON.parse(localStorage.getItem('projectId')).id
      }
      getEditJobsData(JSON.parse(localStorage.getItem('projectId')).id, this.editJobsData.id, data).then(res => {
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
            this.getTable(this.treeSelectData.id)
            this.isChangeJobModal = false
            this.$refs.editJobsData.resetFields() // 清空
            break
        }
      })
    },
    // 删除岗位
    removeJob (row) {
      deleteJobsData(JSON.parse(localStorage.getItem('projectId')).id, row.id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.getTable(this.treeSelectData.id)
            this.$Message.success(res.data.msgContent)
            this.removeJobModal = false
            break
        }
      })
    },
    // 加入已有岗位
    jobJoin () {
      getAllJob(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.checkBox = res.data.msgData
            this.jobJoinDeptVal = []
            this.jobJoindeptName = ''
            this.jobJoinDept = true
            setTimeout(() => {
              $('.el-tabs__header .el-tabs__nav-next').css('display', 'none')
              $('.el-tabs__header .el-tabs__nav-prev').css('display', 'none')
            }, 100)
            break
        }
      })
    },
    removeJobCancel () {
      this.removeJobModal = false
    },
    joinBlackListCancel () {
      this.joinBlackList = false
    },
    // 加入已有岗位弹框 -- 确定
    jobJoinDeptOk () {
      if (this.jobJoinDeptVal.length === 0) {
        this.$Message.error('请选择需要加入的岗位')
      } else {
        let data = {
          deptId: this.treeSelectData.id,
          jobIds: this.jobJoinDeptVal
        }
        jobMoveDept(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
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
              this.getTable(this.treeSelectData.id)
              this.jobJoinDept = false
              break
          }
        })
      }
    },
    // 加入已有岗位弹框 -- 取消
    jobJoinDeptCancel () {
      this.jobJoinDeptVal = []
      this.jobJoindeptName = ''
      this.jobJoinDept = false
    },
    // 加入已有部门弹框 -- 确定
    deptJoinDeptOk () {
      let data = {
        curDepartmentId: this.treeSelectData.id,
        manageDepartmentId: this.deptJoinDeptVal
      }
      deptMoveDept(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.deptJoinDept = false
            this.spinShow = true
            getAlltreeData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
                  this.treeData = []
                  this.treeData.push(res.data.msgData)
                  this.treeChangeExpand(this.treeData, true)
                  this.selectedTree(this.treeData, this.treeSelectData.name)
                  this.spinShow = false
                  break
              }
            })
            break
        }
      })
    },
    // 加入已有部门弹框 -- 取消
    deptJoinDeptCancel () {
      this.deptJoinDeptVal = []
      this.deptJoinDept = false
    },
    // 移动岗位 弹框 -- 取消
    jobMoveDeptCancel () {
      this.jobMoveDeptVal = ''
      this.jobMoveDept = false
    },
    deleteDepartmentCancel () {
      this.removeModal = false
    },
    // 移动岗位 弹框 -- 确定
    jobMoveDeptOk (row) {
      moveJob(JSON.parse(localStorage.getItem('projectId')).id, row.id, this.jobMoveDeptVal).then(res => {
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
            this.getTable(this.treeSelectData.id)
            this.jobMoveDeptVal = ''
            this.jobMoveDept = false
            break
        }
      })
    },
    // 部门移动弹框 --- 确定
    deptMoveOk () {
      MoveDept(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id, this.deptMoveVal).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.deptMoveVal = ''
            this.deptMove = false
            this.spinShow = true
            getAlltreeData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
                  this.treeData = []
                  this.treeData.push(res.data.msgData)
                  this.treeChangeExpand(this.treeData, true)
                  this.selectedTree(this.treeData, this.treeSelectData.name)
                  this.spinShow = false
                  break
              }
            })
            break
        }
      })
    },
    // 部门移动弹框 --- 取消
    deptMoveCancel () {
      this.deptMove = false
      this.deptMoveVal = ''
    },
    removePersonCancel () {
      this.removePerson = false
    },
    // 人员维护删除
    removePersonOK () {
      deleteTeamer(JSON.parse(localStorage.getItem('projectId')).id, this.userId).then(res => {
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
            this.getTable(this.treeSelectData.id)
            this.$store.dispatch('getMenuData')
            this.removePerson = false
        }
      })
    },
    // 人员维护改变职位 --取消
    isDutyWorkCancel () {
      this.isDutyWork = false
    },
    isDutyWorkPreserve () {
      var deptIds = ''
      this.jobWork.forEach(item => {
        if (item.department.name === this.deptName) {
          deptIds = item.department.id
        }
      })
      const data = {
        deptId: deptIds,
        jobId: this.jobName,
        id: this.userId
      }
      putTeamer(JSON.parse(localStorage.getItem('projectId')).id, data).then(res => {
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
            this.getTable(this.treeSelectData.id)
            this.$store.dispatch('getMenuData')
            this.isDutyWork = false
            break
        }
      })
    },
    joinBlackListOk () {
      joinBlacklist(JSON.parse(localStorage.getItem('projectId')).id, this.userId, this.user).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.getTable(this.treeSelectData.id)
            this.$Message.success(res.data.msgContent)
            this.joinBlackList = false
            break
        }
      })
    },
    getTable (roleId) {
      getAllData(JSON.parse(localStorage.getItem('projectId')).id, roleId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.tableData = res.data.msgData.jobs
            this.manageData = res.data.msgData.works
            break
        }
      }).then(res => {
        this.$refs.xTree.setAllTreeExpansion(true)
      })
    },
    // 管理内容点击事件
    manageClick (item, rowName) {
      this.manageJurisdiction = item
      this.managePermissionForm.system = item.name
      this.managePermissionForm.name = rowName
      getAllDept(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.allDeptData = res.data.msgData
            this.managePermissionForm.dept = res.data.msgData[0].id
            this.managePermission = true
            break
        }
      })
    },
    managePermissionCancel () {
      this.managePermission = false
    },
    managePermissionOk () {
      this.$refs.managePermissionForm.validate((valid) => {
        if (valid) {
          moveWorkContent(JSON.parse(localStorage.getItem('projectId')).id, this.treeSelectData.id, this.manageJurisdiction.id, this.managePermissionForm.dept).then(res => {
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
                this.getTable(this.treeSelectData.id)
                this.managePermission = false
                break
            }
          })
        }
      })
    },
    getManagePermissionTitle () {
      return this.managePermissionForm.system + '管理权限'
    },
    // 点击候选工作全选框
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        this.checkAllGroup = this.checkAllGroupIds
      } else {
        this.checkAllGroup = []
      }
      this.manageIndeterminate = false
      this.manageCheckAll = false
      this.manageCheckAllGroup = []
    },
    // 点击管理工作全选框
    managehandleCheckAll () {
      if (this.manageIndeterminate) {
        this.manageCheckAll = false
      } else {
        this.manageCheckAll = !this.manageCheckAll
      }
      this.manageIndeterminate = false
      if (this.manageCheckAll) {
        this.manageCheckAllGroup = this.checkAllGroup
      } else {
        this.manageCheckAllGroup = []
      }
    },
    // 管理工作选择框选中
    manageCheckAllGroupChange (data) {
      if (data.length === this.checkAllGroup.length) {
        this.manageIndeterminate = false
        this.manageCheckAll = true
      } else if (data.length > 0) {
        this.manageIndeterminate = true
        this.manageCheckAll = false
      } else {
        this.manageIndeterminate = false
        this.manageCheckAll = false
      }
    },
    // 候选工作选择框选中
    checkAllGroupChange (data) {
      if (data.length === this.checkAllGroupIds.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
      this.manageIndeterminate = false
      this.manageCheckAll = false
      this.manageCheckAllGroup = []
    },
    // 管理工作分组是否显示
    ifManageCheck (data) {
      let ifCheck = false
      data.systemWorkDTOs.forEach(res => {
        if (this.checkAllGroup.indexOf(res.id) !== -1) {
          ifCheck = true
        }
      })
      return ifCheck
    },
    ifDeptCheck (data) {
      let ifCheck = false
      data.systemWorkDTOs.forEach(res => {
        if (this.manageCheckAllGroup.indexOf(res.id) !== -1) {
          ifCheck = true
        }
      })
      return ifCheck
    }
  },
  created () {
    getAlltreeData(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.treeData.push(res.data.msgData)
          this.treeChangeExpand(this.treeData, true)
          getOwnDept(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                if (res.data.msgData[0].name === '项目经理办公室') {
                  this.isremove = true
                } else {
                  this.isremove = false
                }
                this.selectedTree(this.treeData, res.data.msgData[0].name)
                jobsType().then(res => {
                  this.jobClassification = res.data.msgData
                })
                break
            }
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
.checkBoxstop20 {
  margin-top: 20px;
  width: 150px;
  text-align: left;
}
.card {
  height: 100%;
  overflow-y: auto;
}
.checkDiv {
  margin-bottom: 10px;
}
.manageItem {
  color: #2d8cf0;
  cursor: pointer;
}
.deptName::before {
  content: "*";
  display: inline-block;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 14px;
  color: #ed4014;
}
</style>
<style lang="less">
.ivu-collapse {
  border: none;
  .ivu-collapse-item {
    border: none;
  }
}
</style>

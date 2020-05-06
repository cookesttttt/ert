<template>
  <Card shadow style="height: 100%;width: 100%">
    <Tabs v-model="tabsName" @on-click="tabsClick">
      <TabPane icon="ios-people" label="组织架构图" name="name1">
        <div class="department-outer">
          <!-- <tree-menu :allLeavl="allLeavl" :textTreeData="textTreeData" :allData="data"></tree-menu> -->
          <!-- 组织架构图 缩放按钮 -->
          <div>
            <div class="zoom-box">
              <Button @click="downLoad" style="margin-right:10px">导出</Button>
              <zoom-controller v-model="zoom" :min="20" :max="200"></zoom-controller>
            </div>
            <div
              class="zoom-box2"
              style="text-align:center;font-size:16px;font-weight:bold;"
            >{{user.projectName}}施工项目部组织机构框图</div>
          </div>
          <!-- 组织架构图 拖动缩放盒子 -->
          <div class="view-box">
            <Spin size="large" fix v-if="spinShow"></Spin>
            <div
              ref="dragWrapper"
              class="org-tree-drag-wrapper"
              @mousedown="mousedownView"
              @contextmenu="handleDocumentContextmenu"
            >
              <div class="org-tree-wrapper" :style="orgTreeStyle">
                <div id="text" style="width:2500px;position:relative;">
                  <!-- <div
                    id="JsPlumbContainer"
                    style="position: absolute;top:0;left:0;width: 100%;height: 100%;"
                  ></div>-->
                  <div v-for="(item) in allLeavl" :key="item">
                    <div v-if="item === 1" style="display: flex;justify-content:center">
                      <div v-for="data in textTreeData" :key="data.deptId">
                        <div class="itemClass" :id="data.deptName" v-if="data.leavl === item">
                          <div style="text-align:center">{{data.deptName}}</div>
                          <table v-if="!data.jobList" class="jobTable" border="1" cellspacing="0">
                            <tr>
                              <td class="jobName">&nbsp;岗位名称</td>
                              <td class="teamerName">姓名</td>
                            </tr>
                            <tr>
                              <td class="jobName">&nbsp;暂无岗位</td>
                              <td class="teamerName">-</td>
                            </tr>
                          </table>
                          <table v-else class="jobTable" border="1" cellspacing="0">
                            <tr>
                              <td class="jobName" style>&nbsp;岗位名称</td>
                              <td class="teamerName">姓名</td>
                            </tr>
                            <tr v-for="item in data.jobList" :key="item.jobName">
                              <td class="jobName">&nbsp;{{item.jobName}}</td>
                              <td class="teamerName">{{getUserName(item.teamerName)}}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="item === 2" style="display: flex;justify-content:center">
                      <div style="width:320px;display: flex;justify-content:center">
                        <div
                          class="itemClass"
                          v-for="data in textTreeData"
                          v-if="data.leavl === item && data.deptName === '项目副经理办公室'"
                          :id="data.deptName"
                          :key="data.deptId"
                        >
                          <div style="text-align:center">{{data.deptName}}</div>
                          <table v-if="!data.jobList" class="jobTable" border="1" cellspacing="0">
                            <tr>
                              <td class="jobName">&nbsp;岗位名称</td>
                              <td class="teamerName">姓名</td>
                            </tr>
                            <tr>
                              <td class="jobName">&nbsp;暂无岗位</td>
                              <td class="teamerName">-</td>
                            </tr>
                          </table>
                          <table v-else class="jobTable" border="1" cellspacing="0">
                            <tr>
                              <td class="jobName" style>&nbsp;岗位名称</td>
                              <td class="teamerName">姓名</td>
                            </tr>
                            <tr v-for="item in data.jobList" :key="item.jobName">
                              <td class="jobName">&nbsp;{{item.jobName}}</td>
                              <td class="teamerName">{{getUserName(item.teamerName)}}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div
                        style="display: flex;justify-content:center; margin: 30px 0px;"
                        id="center"
                      >
                        <div
                          class="itemClass"
                          v-for="data in textTreeData"
                          v-if="data.leavl === item && data.deptName !== '项目副经理办公室' && data.deptName !== '总工办公室'"
                          :id="data.deptName"
                          :key="data.deptId"
                          style="margin:0"
                        >
                          <div style="text-align:center">{{data.deptName}}</div>
                          <table v-if="!data.jobList" class="jobTable" border="1" cellspacing="0">
                            <tr>
                              <td class="jobName">&nbsp;岗位名称</td>
                              <td class="teamerName">姓名</td>
                            </tr>
                            <tr>
                              <td class="jobName">&nbsp;暂无岗位</td>
                              <td class="teamerName">-</td>
                            </tr>
                          </table>
                          <table v-else class="jobTable" border="1" cellspacing="0">
                            <tr>
                              <td class="jobName" style>&nbsp;岗位名称</td>
                              <td class="teamerName">姓名</td>
                            </tr>
                            <tr v-for="item in data.jobList" :key="item.jobName">
                              <td class="jobName">&nbsp;{{item.jobName}}</td>
                              <td class="teamerName">{{getUserName(item.teamerName)}}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div style="width:320px;display: flex;justify-content:center">
                        <div
                          v-for="data in textTreeData"
                          v-if="data.leavl === item && data.deptName === '总工办公室'"
                          class="itemClass"
                          :id="data.deptName"
                          :key="data.deptId"
                        >
                          <div style="text-align:center">{{data.deptName}}</div>
                          <table v-if="!data.jobList" class="jobTable" border="1" cellspacing="0">
                            <tr>
                              <td class="jobName">&nbsp;岗位名称</td>
                              <td class="teamerName">姓名</td>
                            </tr>
                            <tr>
                              <td class="jobName">&nbsp;暂无岗位</td>
                              <td class="teamerName">-</td>
                            </tr>
                          </table>
                          <table v-else class="jobTable" border="1" cellspacing="0">
                            <tr>
                              <td class="jobName" style>&nbsp;岗位名称</td>
                              <td class="teamerName">姓名</td>
                            </tr>
                            <tr v-for="item in data.jobList" :key="item.jobName">
                              <td class="jobName">&nbsp;{{item.jobName}}</td>
                              <td class="teamerName">{{getUserName(item.teamerName)}}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div v-else style="display: flex;justify-content:center">
                      <div
                        class="itemClass"
                        v-for="data in textTreeData"
                        v-if="data.leavl === item"
                        :id="data.deptName"
                        :key="data.deptId"
                      >
                        <div style="text-align:center">{{data.deptName}}</div>
                        <table v-if="!data.jobList" class="jobTable" border="1" cellspacing="0">
                          <tr>
                            <td class="jobName">&nbsp;岗位名称</td>
                            <td class="teamerName">姓名</td>
                          </tr>
                          <tr>
                            <td class="jobName">&nbsp;暂无岗位</td>
                            <td class="teamerName">-</td>
                          </tr>
                        </table>
                        <table v-else class="jobTable" border="1" cellspacing="0">
                          <tr>
                            <td class="jobName" style>&nbsp;岗位名称</td>
                            <td class="teamerName">姓名</td>
                          </tr>
                          <tr v-for="item in data.jobList" :key="item.jobName">
                            <td class="jobName">&nbsp;{{item.jobName}}</td>
                            <td class="teamerName">{{getUserName(item.teamerName)}}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane label="组织架构维护" name="name2">
        <vxe-table
          resizable
          border
          show-overflow
          ref="xTree"
          highlight-hover-row
          highlight-current-row
          :height="height"
          :tree-config="{children: 'children',toggleMethod:toggleExpandMethod}"
          :checkbox-config="{checkStrictly: true,checkMethod}"
          :data="tableData"
          @checkbox-change="currentChangeEvent"
          @current-change="currentChangeEvent"
          :row-style="rowStyle"
        >
          <!-- @cell-click="currentChangeEvent" -->
          <vxe-table-column type="checkbox" title="操作" width="50"></vxe-table-column>
          <vxe-table-column field="deptName" title="部门" width="290" tree-node>
            <template v-slot="{ row }">
              <span style="display: flex;justify-content:space-between">
                <span>{{ row.deptName }}</span>
                <Dropdown
                  transfer
                  v-if="row.clickModal === true && row.deptName && row.deptName !== '项目经理办公室' || row.deptPermissions === []"
                  @on-click="clickDept"
                >
                  <Button type="primary" size="small">
                    部门维护
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                    <div style="width:160px">
                      <DropdownItem name="1" v-if="row.deptPermissions.indexOf('修改名称') !== -1">
                        <div>修改名称</div>
                      </DropdownItem>
                      <DropdownItem name="2" v-if="row.deptPermissions.indexOf('新建部门') !== -1">
                        <div>新建部门</div>
                      </DropdownItem>
                      <!-- <DropdownItem name="3">
                          <div>新建同级部门</div>
                      </DropdownItem>-->
                      <DropdownItem name="4" v-if="row.deptPermissions.indexOf('移动部门') !== -1">
                        <div>移入已有部门</div>
                      </DropdownItem>
                      <DropdownItem name="5" v-if="row.deptPermissions.indexOf('移动部门') !== -1">
                        <div>移动到...</div>
                      </DropdownItem>
                      <DropdownItem name="6" v-if="row.deptPermissions.indexOf('删除部门') !== -1">
                        <div>删除部门</div>
                      </DropdownItem>
                      <DropdownItem divided name="7" v-if="!row.isSelect">
                        <div>授予TA部门维护权限...</div>
                      </DropdownItem>
                      <DropdownItem name="8" v-if="row.isDeptCacel">
                        <div>撤回部门维护权限...</div>
                      </DropdownItem>
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="jobName" title="岗位" width="260">
            <template v-slot="{ row }">
              <span style="display: flex;justify-content:space-between">
                <span>{{ row.jobName }}</span>
                <Dropdown
                  transfer
                  v-if="row.clickModal === true && row.jobName !== '项目经理' || row.rolePermissions === []"
                  @on-click="clickJob"
                >
                  <Button type="primary" size="small">
                    {{getTitle(row)}}
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                    <div style="width:160px">
                      <DropdownItem
                        name="1"
                        v-if="row.jobName && row.rolePermissions.indexOf('修改岗位') !== -1"
                      >
                        <div>修改名称</div>
                      </DropdownItem>
                      <DropdownItem
                        name="2"
                        v-if="row.deptType !== '普通管理人员' && row.rolePermissions.indexOf('新建岗位') !== -1 || !row.jobName && row.rolePermissions.indexOf('新建岗位') !== -1"
                      >
                        <div>新建岗位</div>
                      </DropdownItem>
                      <DropdownItem
                        name="3"
                        v-if="row.deptType !== '普通管理人员' && row.rolePermissions.indexOf('移动岗位') !== -1 || !row.jobName && row.rolePermissions.indexOf('移动岗位') !== -1"
                      >
                        <div>移入已有岗位</div>
                      </DropdownItem>
                      <DropdownItem
                        name="4"
                        v-if="row.jobName && row.rolePermissions.indexOf('移动岗位') !== -1"
                      >
                        <div>移动到...</div>
                      </DropdownItem>
                      <DropdownItem
                        name="5"
                        v-if="row.jobName && row.rolePermissions.indexOf('删除岗位') !== -1"
                      >
                        <div>删除岗位</div>
                      </DropdownItem>
                      <DropdownItem divided name="7" v-if="!row.isSelect">
                        <div>授予TA岗位维护权限...</div>
                      </DropdownItem>
                      <DropdownItem name="8" v-if="row.isRoleCacel">
                        <div>撤回岗位维护权限...</div>
                      </DropdownItem>
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="staffName" title="姓名" width="140">
            <template v-slot="{ row }">
              <span style="display: flex;justify-content:space-between">
                <span>{{ row.staffName }}</span>
                <Dropdown
                  style="margin-left: 20px"
                  v-if="row.clickModal === true && row.staffName"
                  @on-click="clickPerson"
                >
                  <Button type="primary" size="small">
                    人员维护
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                    <div style="width:120px">
                      <DropdownItem name="1" v-if="userRow.jobName === '项目经理'">
                        <div>更换所属部门</div>
                      </DropdownItem>
                      <DropdownItem name="2">
                        <div>移出本项目部</div>
                      </DropdownItem>
                      <DropdownItem name="3">
                        <div>加入黑名单</div>
                      </DropdownItem>
                    </div>
                  </DropdownMenu>
                </Dropdown>
              </span>
            </template>
          </vxe-table-column>
          <!-- <vxe-table-column field="staffPhone" title="电话" width="110"></vxe-table-column> -->
          <vxe-table-column field="deptWorkContents" title="部门职责">
            <template v-slot="{ row }">
              <span>{{getContents(row.deptWorkContents)}}</span>
              <Button
                v-if="row.clickModal === true && row.deptName && row.deptName !== '项目经理办公室' && row.deptPermissions.indexOf('修改名称') !== -1"
                size="small"
                type="primary"
                style="position: absolute;right: 5px;"
                @click="deptTreeClickDept"
              >部门职责</Button>
            </template>
          </vxe-table-column>
          <vxe-table-column field="workContents" title="岗位职责">
            <template v-slot="{ row }">
              <span>{{getContents(row.workContents)}}</span>
              <Button
                v-if="row.clickModal === true && row.jobName && row.jobName !== '项目经理' &&  row.rolePermissions.indexOf('修改岗位') !== -1"
                @click="DeptTreeclickJob"
                size="small"
                type="primary"
                style="position: absolute;right: 5px;"
              >岗位职责</Button>
            </template>
          </vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane icon="md-cog" label="管理系框图" name="name4">标签三的内容</TabPane>
      <TabPane label="管理系统维护" name="name5">标签三的内容</TabPane>
    </Tabs>
    <Modal v-model="isAddModal" width="1120" :styles="{top: '20px'}" title="新建部门">
      <div style="height:400px;overflow-y:scroll;">
        <Row>
          <Col span="12">
            <RadioGroup v-model="checkNewDeptType" @on-change="checkNewDeptTypeChange">
              <span style="color:red; font-size: 20px">*</span>
              <span class="deptName" style="font-size:12px">部门类型：</span>
              <Radio label="1">下级部门</Radio>
              <Radio :disabled="!isRadioDisabled" label="2">同级部门</Radio>
            </RadioGroup>
          </Col>
          <Col span="12">
            <span style="color:red; font-size: 20px">*</span>
            <span class="deptName">部门名称：</span>
            <Input style="width:300px" v-model="newDepartmentalData.name" />
          </Col>
        </Row>

        <Steps style="width:800px;margin:20px auto auto auto;">
          <Step title="确认管理范围" content="在候选工作中勾选部门（包含下级部门）的管理范围" status="process"></Step>
          <Step title="确认部门职责" content="在确认的管理范围内勾选出本部门的具体工作" status="process"></Step>
        </Steps>
        <Row style="margin-top:20px" type="flex" justify="space-around">
          <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">勾选管理范围</p>
              <Checkbox
                slot="extra"
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll"
              >全选</Checkbox>
              <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <div class="checkDiv" v-for="i in workContentItem" :key="i.id">
                  <p>{{i.name}}</p>
                  <div style="padding-left:20px">
                    <Checkbox :label="j.id" v-for="j in i.systemWorkDTOs" :key="j.id">{{j.name}}</Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </Card>
          </Col>
          <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">管理范围</p>
              <div class="checkDiv" v-for="i in workContentItem" v-if="ifManageCheck(i)">
                <p>{{i.name}}</p>
                <div
                  style="padding-left:20px;word-break: break-all;word-wrap: break-word;width:100%;"
                >
                  <span
                    style="color: #515a6e;margin-right: 10px;font-size: 12px; white-space: pre-wrap;word-wrap: break-word;display:inline-block;margin-left:16px;"
                    :label="j.id"
                    v-for="j in i.systemWorkDTOs"
                    :key="j.id"
                    v-if="checkAllGroup.indexOf(j.id) !== -1"
                  >{{j.name}}</span>
                </div>
              </div>
            </Card>
          </Col>
          <Divider type="vertical" style="height:auto;" />
          <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">勾选部门职责</p>
              <Checkbox
                slot="extra"
                :indeterminate="manageIndeterminate"
                :value="manageCheckAll"
                @click.prevent.native="managehandleCheckAll"
              >全选</Checkbox>
              <CheckboxGroup v-model="manageCheckAllGroup" @on-change="manageCheckAllGroupChange">
                <div class="checkDiv" v-for="i in workContentItem" v-if="ifManageCheck(i)">
                  <p>{{i.name}}</p>
                  <div style="padding-left:20px">
                    <Checkbox
                      :label="j.id"
                      v-for="j in i.systemWorkDTOs"
                      :key="j.id"
                      v-if="checkAllGroup.indexOf(j.id) !== -1"
                    >{{j.name}}</Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </Card>
          </Col>
          <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">部门职责</p>
              <div class="checkDiv" v-for="i in workContentItem" v-if="ifDeptCheck(i)">
                <p>{{i.name}}</p>
                <div
                  style="padding-left:20px;word-break: break-all;word-wrap: break-word;width:100%;"
                >
                  <span
                    style="color: #515a6e;margin-right: 10px;font-size: 12px; white-space: pre-wrap;word-wrap: break-word;display:inline-block;margin-left:16px;"
                    :label="j.id"
                    v-for="j in i.systemWorkDTOs"
                    :key="j.id"
                    v-if="manageCheckAllGroup.indexOf(j.id) !== -1"
                  >{{j.name}}</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel(1)">取消</Button>
        <Button type="primary" size="large" @click="addDepartment">保存</Button>
      </div>
    </Modal>
    <Modal v-model="operationModal" title="操作" @on-cancel="operationModalCancel" width="600">
      <Row style="margin-bottom:10px">
        <Col span="7">
          &nbsp;
          <div v-if="selectRow.deptName">部门名称:{{selectRow.deptName}}</div>
        </Col>
        <Col span="1">&nbsp;</Col>
        <Col span="7">
          &nbsp;
          <div v-if="selectRow.jobName">岗位名称:{{selectRow.jobName}}</div>
        </Col>
        <Col span="1">&nbsp;</Col>
        <Col span="7">
          &nbsp;
          <div v-if="selectRow.staffName">人员名称:{{selectRow.staffName}}</div>
        </Col>
      </Row>
      <Row>
        <Col span="7">
          <ButtonGroup vertical>
            <div class="operationTitle">部门维护</div>
            <Button class="operationCenter" :disabled="deptButton" @click="putDeptName">修改部门名称</Button>
            <Button class="operationCenter" :disabled="deptButton" @click="addBottomDept">新建下级部门</Button>
            <Button class="operationCenter" :disabled="deptButton" @click="addBrotherDept">新建同级部门</Button>
            <Button class="operationCenter" :disabled="deptButton" @click="moveHaveDept">移入已有部门</Button>
            <Button class="operationCenter" :disabled="deptButton" @click="joinHaveDept">移动到</Button>
            <Button class="operationCenter" :disabled="deptButton" @click="removeModal = true">删除</Button>
          </ButtonGroup>
        </Col>
        <Col span="1">
          <Divider type="vertical" style="height:160px" />
        </Col>
        <Col span="7">
          <ButtonGroup vertical>
            <div class="operationTitle">岗位维护</div>
            <Button class="operationCenter" @click="putJobName">修改名称/职责</Button>
            <Button class="operationCenter" @click="addPost">新建岗位</Button>
            <Button class="operationCenter" @click="jobJoin">移入已有岗位</Button>
            <Button class="operationCenter" @click="putMoveJob">移动到</Button>
            <Button class="operationCenter" @click="removeJobModal = true">删除</Button>
          </ButtonGroup>
        </Col>
        <Col span="1">
          <Divider type="vertical" style="height:160px" />
        </Col>
        <Col span="7">
          <ButtonGroup vertical>
            <div class="operationTitle">人员维护</div>
            <Button class="operationCenter" :disabled="personButton" @click="putPersonDept">更换所属部门</Button>
            <Button
              class="operationCenter"
              :disabled="personButton"
              @click="removePersonClick"
            >移出本项目部</Button>
            <Button
              class="operationCenter"
              :disabled="personButton"
              @click="joinBlackListClick"
            >加入黑名单</Button>
          </ButtonGroup>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="text" size="large" @click="operationModalCancel">取消</Button>
      </div>
    </Modal>
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
    <Modal v-model="removeModal" width="360" title="删除部门">
      <div style="text-align:center">
        <p>删除后将无法恢复</p>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="deleteDepartmentCancel">取消</Button>
        <Button type="primary" size="large" @click="deleteDepartmentSelet(selectRow.deptId)">确认</Button>
      </div>
    </Modal>
    <!--新增岗位弹框-->
    <Modal
      title="新建岗位"
      v-model="isAddJobModal"
      :mask-closable="false"
      @on-cancel="jobCancel(1)"
      :styles="{top: '20px'}"
    >
      <Form
        ref="addJobsData"
        :model="addJobsData"
        :label-width="100"
        inline
        :rules="jobRules"
        style="max-height:400px;overflow-y:auto;"
      >
        <FormItem label="岗位名称" prop="name">
          <Input v-model="addJobsData.name" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br />
        <FormItem label="类型" prop="deptType">
          <Select v-model="addJobsData.deptType" class="width350" transfer>
            <Option v-for="item in jobClassification" :value="item" :key="item.id">{{item}}</Option>
          </Select>
        </FormItem>
        <br />
        <FormItem label="工作职责" prop="obligation">
          <CheckboxGroup v-model="addJobsData.obligation">
            <div class="checkDiv" v-for="i in jobDuties" :key="i.id">
              <p>{{i.name}}</p>
              <div style="padding-left:20px">
                <Checkbox :label="j.id" v-for="j in i.workContentDTOS" :key="j.id">{{j.name}}</Checkbox>
              </div>
            </div>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="jobCancel(1)">取消</Button>
        <Button type="primary" size="large" @click="addJob">保存</Button>
      </div>
    </Modal>
    <Modal
      :title="isOrganization ? '编辑岗位':'岗位职责维护'"
      v-model="isChangeJobModal"
      width="1120"
      :mask-closable="false"
      @on-cancel="jobCancel"
      :styles="{top: '20px'}"
    >
      <Form
        ref="editJobsData"
        :model="editJobsData"
        :label-width="100"
        inline
        :rules="jobRules"
        style="max-height:400px;overflow-y:auto;"
      >
        <FormItem label="岗位名称" prop="name" v-if="isOrganization">
          <Input v-model="editJobsData.name" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br />
        <FormItem label="岗位类型" prop="deptType" v-if="isOrganization">
          <Select v-model="editJobsData.deptType" class="width350" transfer>
            <Option v-for="item in jobClassification" :value="item" :key="item.id">{{item}}</Option>
          </Select>
        </FormItem>
        <br />
        <FormItem label="工作职责" prop="obligation" v-if="!isOrganization">
          <CheckboxGroup v-model="editJobsData.obligation">
            <div class="checkDiv" v-for="i in jobDuties" :key="i.id">
              <p>{{i.name}}</p>
              <div style="padding-left:20px">
                <Checkbox :label="j.id" v-for="j in i.workContentDTOS" :key="j.id">{{j.name}}</Checkbox>
              </div>
            </div>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="jobCancel">取消</Button>
        <Button type="primary" size="large" @click="ChangeJobModal">保存</Button>
      </div>
    </Modal>
    <Modal v-model="removeJobModal" width="360" title="删除岗位">
      <div style="text-align:center">
        <p>删除后将无法恢复</p>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="removeJobCancel">取消</Button>
        <Button type="primary" size="large" @click="removeJob()">删除</Button>
      </div>
    </Modal>
    <Modal v-model="jobJoinDept" title="加入已有岗位" @on-cancel="jobJoinDeptCancel" width="768">
      <el-tabs tab-position="left" type="border-card" v-model="jobJoindeptName" stretch>
        <el-tab-pane
          v-for="item in checkBox"
          :label="item.department.name"
          :name="item.department.name"
          :key="item.department.name"
        >
          <el-checkbox-group v-model="jobJoinDeptVal">
            <el-checkbox
              v-for="data in item.roles"
              :label="data.id"
              class="checkBoxstop20"
              :key="data.id"
            >{{data.name}}</el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <Button type="text" size="large" @click="jobJoinDeptCancel">取消</Button>
        <Button type="primary" size="large" @click="jobJoinDeptOk">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="deptJoinDept"
      title="加入已有部门"
      @on-ok="deptJoinDeptOk"
      @on-cancel="deptJoinDeptCancel"
      width="768"
    >
      <CheckboxGroup v-model="deptJoinDeptVal">
        <Checkbox
          :label="item.id"
          v-for="item in deptCanJoin"
          :key="item.id"
          style="width:160px;margin-bottom:5px"
          size="large"
        >{{ item.name }}</Checkbox>
      </CheckboxGroup>
      <div slot="footer">
        <Button type="text" size="large" @click="deptJoinDeptCancel">取消</Button>
        <Button type="primary" size="large" @click="deptJoinDeptOk">保存</Button>
      </div>
    </Modal>

    <Modal
      v-model="deptMove"
      title="移动部门"
      @on-ok="deptMoveOk"
      @on-cancel="deptMoveCancel"
      style="text-align:center;"
    >
      请选择要移动到的部门
      <Select v-model="deptMoveVal" style="width:300px">
        <Option v-for="item in canMoveDeptData" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <div slot="footer">
        <Button type="text" size="large" @click="deptMoveCancel">取消</Button>
        <Button type="primary" size="large" @click="deptMoveOk()">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="jobMoveDept"
      title="移动岗位"
      @on-ok="jobMoveDeptOk"
      @on-cancel="jobMoveDeptCancel"
      width="768"
      style="text-align:center;"
    >
      请选择要移动到的部门
      <Select v-model="jobMoveDeptVal" style="width:200px">
        <Option v-for="item in allDeptData" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <div slot="footer">
        <Button type="text" size="large" @click="jobMoveDeptCancel">取消</Button>
        <Button type="primary" size="large" @click="jobMoveDeptOk()">保存</Button>
      </div>
    </Modal>
    <Modal v-model="removePerson" width="360" title="移除项目成员">
      <div style="text-align:center">
        <p>确定该用户不是本项目部成员,删除后将无法恢复</p>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="removePersonCancel">取消</Button>
        <Button type="primary" size="large" @click="removePersonOK">确认</Button>
      </div>
    </Modal>
    <Modal v-model="isAddBrotherModal" width="1120" title="新建部门" :styles="{top: '20px'}">
      <div style="max-height:400px;overflow-y:auto;">
        <div>
          <span class="deptName">部门名称：</span>
          <Input style="width:300px" v-model="newDepartmentalData.name" />
        </div>
        <Steps style="width:800px;margin:20px auto auto auto;">
          <Step title="确认管理范围" content="在候选工作中勾选部门（包含下级部门）的管理范围" status="process"></Step>
          <Step title="确认部门职责" content="在确认的管理范围内勾选出本部门的具体工作" status="process"></Step>
        </Steps>
        <Row style="margin-top:20px" type="flex" justify="space-around">
          <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">勾选管理范围</p>
              <Checkbox
                slot="extra"
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll"
              >全选</Checkbox>
              <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                <div class="checkDiv" v-for="i in workContentItem" :key="i.id">
                  <p>{{i.name}}</p>
                  <div style="padding-left:20px">
                    <Checkbox :label="j.id" v-for="j in i.systemWorkDTOs" :key="j.id">{{j.name}}</Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </Card>
          </Col>
          <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">管理范围</p>
              <div class="checkDiv" v-for="i in workContentItem" v-if="ifManageCheck(i)">
                <p>{{i.name}}</p>
                <div
                  style="padding-left:20px;word-break: break-all;word-wrap: break-word;width:100%;"
                >
                  <span
                    style="color: #515a6e;margin-right: 10px;font-size: 12px; white-space: pre-wrap;word-wrap: break-word;display:inline-block;margin-left:16px;"
                    :label="j.id"
                    v-for="j in i.systemWorkDTOs"
                    :key="j.id"
                    v-if="checkAllGroup.indexOf(j.id) !== -1"
                  >{{j.name}}</span>
                </div>
              </div>
            </Card>
          </Col>
          <Divider type="vertical" style="height:auto;" />
          <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">勾选部门职责</p>
              <Checkbox
                slot="extra"
                :indeterminate="manageIndeterminate"
                :value="manageCheckAll"
                @click.prevent.native="managehandleCheckAll"
              >全选</Checkbox>
              <CheckboxGroup v-model="manageCheckAllGroup" @on-change="manageCheckAllGroupChange">
                <div class="checkDiv" v-for="i in workContentItem" v-if="ifManageCheck(i)">
                  <p>{{i.name}}</p>
                  <div style="padding-left:20px">
                    <Checkbox
                      :label="j.id"
                      v-for="j in i.systemWorkDTOs"
                      :key="j.id"
                      v-if="checkAllGroup.indexOf(j.id) !== -1"
                    >{{j.name}}</Checkbox>
                  </div>
                </div>
              </CheckboxGroup>
            </Card>
          </Col>
          <Col span="5">
            <Card style="min-height:260px">
              <p slot="title">部门职责</p>
              <div class="checkDiv" v-for="i in workContentItem" v-if="ifDeptCheck(i)">
                <p>{{i.name}}</p>
                <div
                  style="padding-left:20px;word-break: break-all;word-wrap: break-word;width:100%;"
                >
                  <span
                    style="color: #515a6e;margin-right: 10px;font-size: 12px; white-space: pre-wrap;word-wrap: break-word;display:inline-block;margin-left:16px;"
                    :label="j.id"
                    v-for="j in i.systemWorkDTOs"
                    :key="j.id"
                    v-if="manageCheckAllGroup.indexOf(j.id) !== -1"
                  >{{j.name}}</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="isAddBrotherCancel()">取消</Button>
        <Button type="primary" size="large" @click="isAddBrotherOk">保存</Button>
      </div>
    </Modal>
    <Modal v-model="joinBlackList" width="360" title="加入黑名单">
      <div style="text-align:center">
        <p>确定将该用户加入黑名单</p>
        <p>加入后该用户无法再次加入项目</p>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="joinBlackListCancel">取消</Button>
        <Button type="primary" size="large" @click="joinBlackListOk">确认</Button>
      </div>
    </Modal>
    <Modal
      title="工作职责"
      v-model="isDutyWork"
      width="768"
      :styles="{top: '30px',postion:'absolute'}"
      @on-cancel="isDutyWorkCancel"
      :mask-closable="false"
    >
      <el-tabs tab-position="left" type="border-card" v-model="deptName">
        <el-tab-pane
          v-for="item in jobWork"
          :label="item.department.name"
          :name="item.department.name"
          :key="item.department.name"
        >
          <el-radio-group v-model="jobName">
            <el-radio
              v-for="data in item.roles"
              :label="data.id"
              class="checkBoxstop20"
              :key="data.name"
            >{{data.name}}</el-radio>
          </el-radio-group>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <Button type="text" size="large" @click="isDutyWorkCancel">取消</Button>
        <Button type="primary" size="large" @click="isDutyWorkPreserve">保存</Button>
      </div>
    </Modal>
    <Modal v-model="managePermission" :title="getManagePermissionTitle()">
      <Form
        :model="managePermissionForm"
        label-position="left"
        :label-width="100"
        :rules="managePermissionFormRule"
        ref="managePermissionForm"
      >
        <FormItem label="模块名称">
          <Input v-model="managePermissionForm.name" disabled></Input>
        </FormItem>
        <FormItem label="所属体系">
          <Input v-model="managePermissionForm.system" disabled></Input>
        </FormItem>
        <FormItem label="管理部门" prop="dept">
          <Select v-model="managePermissionForm.dept">
            <Option :value="item.id" :key="item.id" v-for="item in allDeptData">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="managePermissionCancel">取消</Button>
        <Button type="primary" size="large" @click="managePermissionOk">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="transferDeptPower"
      title="授予ta部门维护权限"
      @on-cancel="transferDeptPowerCancel"
      width="768"
    >
      <Form ref="transferForm" :model="transferForm" :rules="transferRule">
        <FormItem :label="'把如下部门维护权限授予给' + selectRow.deptName + '：'" prop="power">
          <CheckboxGroup v-model="transferForm.power">
            <Checkbox
              v-for="item in transferData"
              :key="item.id"
              :label="item.id"
              v-if="item.name !== '移动部门'"
            >{{item.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="transferDeptPowerCancel">取消</Button>
        <Button type="primary" size="large" @click="transferDeptPowerOk">保存</Button>
      </div>
    </Modal>
    <Modal
      v-model="transferJobPower"
      title="授予ta岗位维护权限"
      @on-cancel="transferJobPowerCancel"
      width="768"
    >
      <Form ref="transferForm" :model="transferForm" :rules="transferRule">
        <FormItem :label="'把如下岗位维护权限授予给' + selectRow.jobName + '：'" prop="power">
          <CheckboxGroup v-model="transferForm.power">
            <Checkbox
              v-for="item in transferData"
              :key="item.id"
              :label="item.id"
              v-if="item.name !== '移动岗位'"
            >{{item.name}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="transferJobPowerCancel">取消</Button>
        <Button type="primary" size="large" @click="transferJobPowerOk">保存</Button>
      </div>
    </Modal>
    <Drawer title="岗位职责维护" :closable="false" width="1000" v-model="jobDrawer">
      <Form
        ref="editJobsData"
        :model="editJobsData"
        :label-width="100"
        inline
        :rules="jobRules"
        style=" overflow-y:auto;"
      >
        <FormItem label="岗位名称" prop="name" v-if="isOrganization">
          <Input v-model="editJobsData.name" class="width350" :maxlength="15"></Input>
        </FormItem>
        <br />
        <FormItem label="岗位类型" prop="deptType" v-if="isOrganization">
          <Select v-model="editJobsData.deptType" class="width350" transfer>
            <Option v-for="item in jobClassification" :value="item" :key="item.id">{{item}}</Option>
          </Select>
        </FormItem>
        <br />
        <FormItem label="工作职责" prop="obligation" v-if="!isOrganization">
          <CheckboxGroup v-model="editJobsData.obligation">
            <div class="checkDiv" v-for="i in jobDuties" :key="i.id">
              <p>{{i.name}}</p>
              <div style="padding-left:20px">
                <Checkbox :label="j.id" v-for="j in i.workContentDTOS" :key="j.id">{{j.name}}</Checkbox>
              </div>
            </div>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button type="text" size="large" @click="jobCancel">取消</Button>
        <Button type="primary" size="large" @click="ChangeJobModal">保存</Button>
      </div>
    </Drawer>
    <Drawer title="部门职责维护" :closable="false" width="1000" v-model="deptDrawer">
      <Form
        ref="editDeptData"
        :model="editDeptData"
        :label-width="100"
        inline
        :rules="jobRules"
        style=" overflow-y:auto;"
      >
        <br />
        <FormItem label="工作职责" prop="obligation">
          <CheckboxGroup v-model="editDeptData.obligation">
            <div class="checkDiv" v-for="i in deptDuties" :key="i.id">
              <p>{{i.name}}</p>
              <div style="padding-left:20px">
                <Checkbox :label="j.id" v-for="j in i.systemWorkDTOs" :key="j.id">{{j.name}}</Checkbox>
              </div>
            </div>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button type="text" size="large" @click="deptCancel">取消</Button>
        <Button type="primary" size="large" @click="ChangeDeptModal">保存</Button>
      </div>
    </Drawer>
    <Modal v-model="cleanDeptPower" width="360" title="撤回部门维护权限">
      <div style="text-align:center">
        <p>是否确定要撤回部门维护权限</p>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="cleanDeptPowerCancel">取消</Button>
        <Button type="primary" size="large" @click="cleanDeptPowerOk()">确定</Button>
      </div>
    </Modal>
    <Modal v-model="cleanJobPower" width="360" title="撤回岗位维护权限">
      <div style="text-align:center">
        <p>是否确定要撤回岗位维护权限</p>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="cleanJobPowerCancel">取消</Button>
        <Button type="primary" size="large" @click="cleanJobPowerJob()">确定</Button>
      </div>
    </Modal>
  </Card>
</template>
<script src="https://cdn.bootcss.com/jsPlumb/2.6.8/js/jsplumb.min.js"></script>
<script>
import html2canvas from 'html2canvas';
import Canvg, {
  presets
} from 'canvg';

import { on, off } from '@/libs/tools'
import { spawn } from 'child_process'
import TreeMenu from '@/components/TreeMenu/TreeMenu.vue'
import OrgView from '../structure/org-view.vue'
import ZoomController from '../structure/zoom-controller.vue'
import { isDataSuccess } from '@/libs/util'
import { getDepartmentAllData, getDepartmentAllUser, getJurisdiction } from '@/api/basicSetting/structure'
import '../structure/index.less'
import { getNewAllRole, getAllRole, putTeamer2, deleteTeamer, getDeptJobAllRole } from '@/api/basicSetting/memberTable'
import {
  getAlltreeData,
  deleteDepartmentData,
  addDepartmentData,
  editorialDepartmentData,
  addBrotherData
} from '@/api/basicSetting/Departmentmaintenance'
import { getAllData, getOwnDept, getAllDeptWorkingRange, removeDeptPower, removeJobPower, putAllDeptWorkingRange, getAllJob, jobMoveDept2, getMoveDept, deptMoveDept, getisBrotherAdd, getAllDept, moveJob, getTransferPower, getJobTransferPower, transferJob, transferDept, getCanMoveDept, MoveDept, joinBlacklist, getWork, getbrotherDeptWorkingRange, getDeptWorkingRange, moveWorkContent } from '@/api/basicSetting/OrganizationMaintenance'
import {
  deleteJobsData,
  getJobsObligationData,
  newJobsData,
  getEditJobsData,
  jobsType
} from '@/api/basicSetting/Postmaintenance'
import { getUserInfo } from '@/api/financial/budgeting/costBudget'
export default {
  name: 'structure',
  components: {
    OrgView,
    ZoomController,
    TreeMenu
  },
  data () {
    return {
      spinShow: false,
      user: {},
      // 组织架构 缩放拖动模板
      horizontal: false,
      orgTreeOffsetLeft: 0,
      // currentContextMenuId: '',
      orgTreeOffsetTop: 0,
      initPageX: 0,
      initPageY: 0,
      oldMarginLeft: 0,
      oldMarginTop: 0,
      canMove: false,

      allLeavl: [],
      textTreeData: {},
      cleanDeptPower: false,
      cleanJobPower: false,
      userRow: {},
      deptDrawer: false,
      deptDuties: [],
      editDeptData: { obligation: [] },
      transferJobPower: false,
      transferData: [],
      transferRule: {
        power: [{ required: true, type: 'array', min: 1, message: '请选择转移权限', trigger: 'change' }]
      },
      transferForm: {
        power: []
      },
      transferDeptPower: false,
      jobDrawer: false,
      isOrganization: true,
      isRadioDisabled: false,
      checkNewDeptType: '1',
      deptData: '',
      newDepartmentalData: {
        name: '', // 新建部门名称
        des: '' // 新建部门描述
      },
      isEditModal: false, // 编辑部门弹框
      operationModal: false, // 操作弹框
      editDepartmentalData: {
        id: '', // 编辑当前数据的Id
        name: '', // 编辑部门名称
        des: '' // 编辑部门描述
      },
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
      height: 720,
      data: '',
      zoom: 100,
      tabsName: 'name1',
      tableData: [],
      DeptTableData: [],
      selectRow: {
        deptName: '',
        jobName: '',
        staffName: ''
      },
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
      isAddBrotherModal: false,
      isAdd: false, // 新增下级部门是否可用
      newDept: false, // 新 - 新建部门
      vule1: '2',
      jobJoindeptName: '',
      user: {}, // 选中用户teamId
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
      isAddModal: false, // 新建下级部门弹框
      isAddJobModal: false, // 新建岗位弹框
      isChangeJobModal: false, // 编辑岗位弹框
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
      },
      isDownLoad: false

    }
  },
  methods: {
    downLoad () {
      let oldzoom = this.zoom
      this.spinShow = true
      this.zoom = 100
      setTimeout(() => {
        $('svg').each(function (index, node) {
          var parentNode = node.parentNode;
          var svg = node.outerHTML.trim();
          var canvas = document.createElement("canvas");
          Canvg(canvas, svg);
          canvas.style.zIndex = 9
          if (node.style.position) {
            canvas.style.position += node.style.position;
            canvas.style.left += node.style.left;
            canvas.style.top += node.style.top;
          }
          parentNode.removeChild(node);
          parentNode.appendChild(canvas);
        })
        html2canvas(document.getElementById('text')).then(canvas => {
          // 转成图片，生成图片地址
          var imgUrl = canvas.toDataURL("image/jpeg").replace("data:image/jpeg;base64,", ""); // 获取生成的图片的url
          const finalImageSrc = "data:image/jpeg;base64," + imgUrl;
          const aElem = document.createElement('a')
          document.body.appendChild(aElem)
          aElem.href = finalImageSrc
          // 设置下载标题
          aElem.download = "chart.jpg"
          aElem.click()
          document.body.removeChild(aElem)
          this.zoom = oldzoom
          this.spinShow = false
        });
      }, 500);
    },
    jobCancelChangefalse (table, jobId) {
      table.forEach((res, index) => {
        if (res.jobId === jobId) {
          res.isRoleCacel = false
        } else {
          if (res.children) {
            this.jobCancelChangefalse(res.children, jobId)
          }
        }
      })
    },
    cleanJobPowerJob () {
      removeJobPower(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.jobId).then(res => {
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
            this.jobCancelChangefalse(this.tableData, this.selectRow.jobId)
            this.cleanJobPower = false
            break
        }
      })
    },
    cleanJobPowerCancel () {
      this.cleanJobPower = false
    },
    cleanDeptPowerOk () {
      removeDeptPower(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
            this.deptCancelChangefalse(this.tableData, this.selectRow.deptId)
            this.cleanDeptPower = false
            break
        }
      })
    },
    deptCancelChangefalse (table, deptId) {
      table.forEach((res, index) => {
        if (res.deptId === deptId) {
          res.isDeptCacel = false
        } else {
          if (res.children) {
            this.deptCancelChangefalse(res.children, deptId)
          }
        }
      })
    },
    cleanDeptPowerCancel () {
      this.cleanDeptPower = false
    },
    deptCancel () {
      this.$refs.editDeptData.resetFields() // 清空
      this.deptDrawer = false
    },
    ChangeDeptModal () {
      this.$refs.editDeptData.validate((valid) => {
        if (valid) {
          // let allIds = []
          // this.deptDuties.forEach(res => {
          //   res.systemWorkDTOs.forEach(item => {
          //     allIds.push(item.id)
          //   })
          // })
          // var result = []
          // result = allIds.concat(this.editDeptData.obligation).filter(function (v, i, arr) {
          //   return arr.indexOf(v) === arr.lastIndexOf(v)
          // })
          let data = { ids: this.editDeptData.obligation }
          putAllDeptWorkingRange(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId, data).then(res => {
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
                this.deptDrawer = false
                break
            }
          })
        }
      })
    },
    deptTreeClickDept () {
      getAllDeptWorkingRange(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.deptDuties = res.data.msgData
            this.$refs.editDeptData.resetFields() // 清空
            this.selectRow.deptWorkContents.forEach(res => {
              this.editDeptData.obligation.push(res.id)
            })
            this.deptDrawer = true
            break
        }
      })
    },
    transferJobPowerCancel () {
      this.$refs.transferForm.resetFields() // 清空
      this.transferJobPower = false
    },
    jobCancelChange (table, jobId) {
      table.forEach((res, index) => {
        if (res.jobId === jobId) {
          res.isRoleCacel = true
        } else {
          if (res.children) {
            this.jobCancelChange(res.children, jobId)
          }
        }
      })
    },
    transferJobPowerOk () {
      this.$refs.transferForm.validate((valid) => {
        if (valid) {
          let data = {
            ids: this.transferForm.power
          }
          transferJob(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.jobId, data).then(res => {
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
                this.transferJobPower = false
                this.jobCancelChange(this.tableData, this.selectRow.jobId)
                this.$refs.transferForm.resetFields() // 清空
                break
            }
          })
        }
      })
    },
    transferDeptPowerCancel () {
      this.$refs.transferForm.resetFields() // 清空
      this.transferDeptPower = false
    },
    deptCancelChange (table, deptId) {
      table.forEach((res, index) => {
        if (res.deptId === deptId) {
          res.isDeptCacel = true
        } else {
          if (res.children) {
            this.deptCancelChange(res.children, deptId)
          }
        }
      })
    },
    transferDeptPowerOk () {
      this.$refs.transferForm.validate((valid) => {
        if (valid) {
          let data = {
            ids: this.transferForm.power
          }
          transferDept(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId, data).then(res => {
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
                this.transferDeptPower = false
                this.deptCancelChange(this.tableData, this.selectRow.deptId)
                this.$refs.transferForm.resetFields() // 清空
                break
            }
          })
        }
      })
    },
    getTitle (row) {
      if (row.deptType === '普通管理人员') {
        return '维护'
      } else {
        return '岗位维护'
      }
    },
    getPower (table) {
      table.children.forEach(res => {
        if (!res.deptName) {
          res.deptPermissions = table.deptPermissions
          res.rolePermissions = table.rolePermissions
        } else {
          if (res.children) {
            this.getPower(res)
          }
        }
      })
    },
    tabsClick (name) {
      switch (name) {
        case 'name1':
          getUserInfo(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
                break
            }
          })
          this.getDepartmentData()
          this.getTableImg()
          if (document.body.clientWidth < 1400) {
            this.zoom = 60
            this.height = 400
          } else {
            this.height = 720
          }
          break
        case 'name2':
          getNewAllRole(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.tableData = res.data.msgData
                this.isExpend(this.tableData)
                this.defultSelect(this.tableData)
                this.getPower(this.tableData[0])
            }
          })
          jobsType().then(res => {
            this.jobClassification = res.data.msgData
          })
          break
        case 'name3':
          getDeptJobAllRole(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.DeptTableData = res.data.msgData
                this.isDeptExpend(this.DeptTableData)
                this.DeptdefultSelect(this.DeptTableData)
            }
          })
          break
        case 'name4':

          break
      }
    },
    defultSelect (data) {
      data.forEach(res => {
        if (res.isSelect) {
          this.$refs.xTree.setCheckboxRow(res, true)
          this.selectRow = res
          this.userRow = res
          this.$refs.xTree.setCurrentRow(res)
          res.clickModal = true
        } else {
          if (res.children) {
            this.defultSelect(res.children)
          }
        }
      })
    },
    DeptdefultSelect (data) {
      data.forEach(res => {
        if (res.isSelected) {
          this.$refs.xDeptTree.setCheckboxRow(res, true)
          this.$refs.xDeptTree.setCurrentRow(res)
          this.selectRow = res
          res.clickModal = true
        } else {
          if (res.children) {
            this.defultSelect(res.children)
          }
        }
      })
    },
    DeptTreeclickJob () {
      this.isOrganization = false
      this.putJobName()
      this.jobDrawer = true
    },
    checkNewDeptTypeChange (e) {
      if (e === '1') {
        this.checkAllGroup = []
        this.manageCheckAllGroup = []
        this.checkAll = false
        this.manageCheckAll = false
        getDeptWorkingRange(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
              res.data.msgData.forEach(res => {
                res.systemWorkDTOs.forEach(item => {
                  this.checkAllGroupIds.push(item.id)
                })
              })
              break
          }
        })
      } else {
        this.checkAllGroup = []
        this.manageCheckAllGroup = []
        this.checkAll = false
        this.manageCheckAll = false
        getbrotherDeptWorkingRange(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
              res.data.msgData.forEach(res => {
                res.systemWorkDTOs.forEach(item => {
                  this.checkAllGroupIds.push(item.id)
                })
              })
              break
          }
        })
      }
    },
    toggleExpandMethod ({ row }) {
      if (row.deptName === '项目经理办公室') {
        if (this.$refs.xTree.isTreeExpandByRow(row)) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    deptToggleExpandMethod ({ row }) {
      if (row.deptName === '项目经理办公室') {
        if (this.$refs.xDeptTree.isTreeExpandByRow(row)) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    checkMethod ({ row }) {
      return row.isAuth !== false
    },
    deptCheckMethod ({ row }) {
      return row.isAuth !== false
    },
    clickDept (name) {
      switch (name) {
        case '1':
          this.putDeptName()
          break
        case '2':
          this.addBottomDept()
          break
        case '4':
          this.moveHaveDept()
          break
        case '5':
          this.joinHaveDept()
          break
        case '6':
          this.removeModal = true
          break
        case '7':
          this.transferDeptPower = true
          getTransferPower(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.transferData = res.data.msgData
                break
            }
          })
          break
        case '8':
          this.cleanDeptPower = true
          break
      }
    },
    clickJob (name) {
      switch (name) {
        case '1':
          this.isOrganization = true
          this.putJobName()
          this.isChangeJobModal = true
          break
        case '2':
          this.addPost()
          break
        case '3':
          this.jobJoin()
          break
        case '4':
          this.putMoveJob()
          break
        case '5':
          this.removeJobModal = true
          break
        case '7':
          this.transferJobPower = true
          getJobTransferPower(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                this.transferData = res.data.msgData
                break
            }
          })
          break
        case '8':
          this.cleanJobPower = true
          break
      }
    },
    clickPerson (name) {
      switch (name) {
        case '1':
          this.putPersonDept()
          break
        case '2':
          this.removePersonClick()
          break
        case '3':
          this.joinBlackListClick()
          break
      }
    },
    isExpend (tableData) {
      tableData.forEach(res => {
        if (res.isExpand === true) {
          this.$refs.xTree.setTreeExpansion(res, true)
          if (res.children) {
            this.isExpend(res.children)
          }
        } else {
          if (res.children) {
            this.isExpend(res.children)
          }
        }
      })
    },
    isDeptExpend (tableData) {
      tableData.forEach(res => {
        if (res.isExpand === true) {
          this.$refs.xDeptTree.setTreeExpansion(res, true)
          if (res.children) {
            this.isDeptExpend(res.children)
          }
        } else {
          if (res.children) {
            this.isDeptExpend(res.children)
          }
        }
      })
    },
    isAddBrotherCancel () {
      this.isAddBrotherModal = false
    },
    removePersonClick () {
      this.userId = this.selectRow.teamId
      this.removePerson = true
    },
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
            this.personMovePersonRemove(this.tableData, this.selectRow.jobId)
            this.removePerson = false
            this.operationModal = false
        }
      })
    },
    removePersonCancel () {
      this.removePerson = false
    },
    joinBlackListClick () {
      this.userId = this.selectRow.teamId
      this.user = {
        name: this.selectRow.staffName,
        phone: this.selectRow.staffPhone,
        projectId: JSON.parse(localStorage.getItem('projectId')).id,
        userId: this.selectRow.teamId
      }
      this.joinBlackList = true
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
            this.$Message.success(res.data.msgContent)
            this.personMovePersonRemove(this.tableData, this.selectRow.jobId)
            this.joinBlackList = false
            this.operationModal = false
            break
        }
      })
    },
    joinBlackListCancel () {
      this.joinBlackList = false
    },
    // 人员维护改变职位 --取消
    isDutyWorkCancel () {
      this.isDutyWork = false
    },
    personMovePersonRemove (table, jobId) {
      table.forEach((res, index) => {
        if (res.jobId === jobId) {
          res.staffName = ''
          res.teamId = ''
          res.staffPhone = ''
        } else {
          if (res.children) {
            this.personMovePersonRemove(res.children, jobId)
          }
        }
      })
    },
    personMovePerson (table, data) {
      table.forEach((res, index) => {
        if (res.deptId === data.deptId) {
          table[index] = data
        } else {
          if (res.children) {
            this.personMovePerson(res.children, data)
          }
        }
      })
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
      putTeamer2(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.level, data).then(res => {
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
            this.personMovePersonRemove(this.tableData, this.selectRow.jobId)
            this.personMovePerson(this.tableData, res.data.msgData)
            this.isDutyWork = false
            this.operationModal = false
            break
        }
      })
    },
    managePermissionOk () {

    },
    managePermissionCancel () {

    },
    putPersonDept () {
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
            this.deptName = this.selectRow.deptName
            this.jobWork.forEach(item => {
              if (item.department.name === this.deptName) {
                item.roles.forEach(res => {
                  if (res.name === this.selectRow.jobName) {
                    this.jobName = res.id
                  }
                })
              }
            })
            this.userId = this.selectRow.teamId
            this.jobName = ''
            this.isDutyWork = true
            break
        }
      })
    },
    putMoveJob () {
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
            if (job.indexOf(this.selectRow.jobName) === -1) {
              this.$Message.error(this.selectRow.jobName + '不允许移动')
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
    },
    deleteJobData (table, id) {
      table.forEach((res, index) => {
        if (res.jobId === id) {
          if (res.deptName) {
            res.jobId = ''
            res.jobName = ''
          } else {
            table.splice(index, 1)
          }
        } else {
          if (res.children) {
            this.deleteJobData(res.children, id)
          }
        }
      })
    },
    // 删除岗位
    removeJob () {
      deleteJobsData(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.jobId).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.deleteJobData(this.tableData, this.selectRow.jobId)
            this.$Message.success(res.data.msgContent)
            this.removeJobModal = false
            this.operationModal = false
            break
        }
      })
    },
    removeJobCancel () {
      this.removeJobModal = false
    },
    // 移动岗位 弹框 -- 取消
    jobMoveDeptCancel () {
      this.jobMoveDeptVal = ''
      this.jobMoveDept = false
    },
    // 移动岗位 弹框 -- 确定
    jobMoveDeptOk () {
      moveJob(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.jobId, this.jobMoveDeptVal).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.JobMoveJobRemove(this.tableData, this.jobMoveDeptVal, this.selectRow.jobId)
            this.JobMoveJob(this.tableData, this.jobMoveDeptVal, this.selectRow.jobId)
            this.$Message.success(res.data.msgContent)
            this.jobMoveDeptVal = ''
            this.jobMoveDept = false
            this.operationModal = false
            break
        }
      })
    },
    JobMoveJobRemove (table, jobId, movejobId) {
      table.forEach((res, index) => {
        if (res.jobId === movejobId) {
          table.splice(index, 1)
        } else {
          if (res.children) {
            this.JobMoveJobRemove(res.children, jobId, movejobId)
          }
        }
      })
    },
    JobMoveJob (table, jobId, movejobId) {
      table.forEach((res, index) => {
        if (res.deptId === jobId) {
          res.children.push(this.selectRow)
        } else {
          if (res.children) {
            this.JobMoveJob(res.children, jobId, movejobId)
          }
        }
      })
    },
    // 加入已有岗位弹框 -- 确定
    jobJoinDeptOk () {
      if (this.jobJoinDeptVal.length === 0) {
        this.$Message.error('请选择需要加入的岗位')
      } else {
        let data = {
          deptId: this.selectRow.deptId,
          jobIds: this.jobJoinDeptVal
        }
        jobMoveDept2(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.level, data).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              this.jobJoinDeptRemoveData(this.tableData, this.jobJoinDeptVal)
              this.jobJoinDeptData(this.tableData, res.data.msgData)
              this.$Message.success(res.data.msgContent)
              this.jobJoinDept = false
              this.operationModal = false
              break
          }
        })
      }
    },
    jobJoinDeptRemoveData (table, jobIds) {
      jobIds.forEach(res => {
        table.forEach((data, index) => {
          if (res === data.deptId) {
            tableData.splice(index, 1)
          } else {
            if (res.children) {
              this.jobJoinDeptRemoveData(res.children, jobIds)
            }
          }
        })
      })
    },
    jobJoinDeptData (table, data) {
      table.forEach((res, index) => {
        if (res.deptId === data.deptId) {
          table[index] = data
        } else {
          if (res.children) {
            this.jobJoinDeptData(res.children, data)
          }
        }
      })
    },
    // 加入已有岗位弹框 -- 取消
    jobJoinDeptCancel () {
      this.jobJoinDeptVal = []
      this.jobJoindeptName = ''
      this.jobJoinDept = false
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
    deleteDepartmentCancel () {
      this.removeModal = false
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
            this.deleteDepartData(this.tableData, id)
            this.removeModal = false
            this.operationModal = false
            break
        }
      })
    },
    deleteDepartData (table, id) {
      table.forEach((res, index) => {
        if (res.deptId === id) {
          table.splice(index, 1)
        } else {
          if (res.children) {
            this.deleteDepartData(res.children, id)
          }
        }
      })
    },
    // 部门移动弹框 --- 确定
    deptMoveOk () {
      MoveDept(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId, this.deptMoveVal).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            this.deptMove = false
            this.DataMoveDeptRemove(this.tableData, this.deptMoveVal, this.selectRow.deptId)
            this.DataMoveDept(this.tableData, this.deptMoveVal, this.selectRow.deptId)
            this.deptMoveVal = ''
            this.operationModal = false
            this.$Message.success(res.data.msgContent)
            break
        }
      })
    },
    // 增加岗位
    addJob () {
      this.$refs.addJobsData.validate((valid) => {
        if (valid) {
          const data = {
            'name': this.addJobsData.name,
            'departmentId': this.selectRow.deptId,
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
                let newJob = res.data.msgData
                if (newJob.deptType === '普通管理人员') {
                  newJob.deptName = null
                  newJob.jobName = newJob.name
                  newJob.jobId = newJob.id
                  newJob.isAuth = true
                  newJob.deptId = this.selectRow.deptId
                  newJob.workContents = newJob.contents
                } else {
                  newJob.deptName = null
                  newJob.isAuth = true
                  newJob.jobName = newJob.name
                  newJob.jobId = newJob.id
                  newJob.deptId = this.selectRow.deptId
                  newJob.workContents = newJob.contents
                }
                this.addTableData(this.tableData, this.selectRow.deptId, newJob)
                this.jobCancel(1)
                this.operationModal = false
                this.$Message.success(res.data.msgContent)
                break
            }
          })
        }
      })
    },
    DataMoveDeptRemove (table, deptId, moveDeptId) {
      table.forEach((res, index) => {
        if (res.deptId === moveDeptId) {
          this.deptData = res
          table.splice(index, 1)
        } else {
          if (res.children) {
            this.DataMoveDeptRemove(res.children, deptId, moveDeptId)
          }
        }
      })
    },
    DataMoveDept (table, deptId, moveDeptId) {
      table.forEach((res, index) => {
        if (res.deptId === deptId) {
          res.children.push(this.selectRow)
        } else {
          if (res.children) {
            this.DataMoveDept(res.children, deptId, moveDeptId)
          }
        }
      })
    },
    // 部门移动弹框 --- 取消
    deptMoveCancel () {
      this.deptMove = false
      this.deptMoveVal = ''
    },
    addTableJobData (table, id, data) {
      table.forEach(res => {
        if (res.deptId === id) {
          if (res.children) {
            res.children.push(data)
          } else {
            res.children = [data]
          }
        } else if (res.children) {
          this.addTableJobData(res.children, id, data)
        }
      })
    },
    // 新增岗位按钮
    addPost () {
      this.$refs.addJobsData.resetFields() // 清空
      this.isAddJobModal = true
      getJobsObligationData(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
    // 工作职责转换
    getContents (content) {
      let str = ''
      if (content) {
        content.forEach(res => {
          str += res.name + '、'
        })
      }
      return str
    },
    joinHaveDept () {
      getCanMoveDept(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
    },
    // 编辑岗位 -- 弹框保存
    ChangeJobModal () {
      const data = {
        'name': this.editJobsData.name,
        'departmentId': this.selectRow.deptId,
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
            if (this.isOrganization) {
              this.changJobData(this.tableData, this.selectRow.jobId, this.editJobsData.name, data.workContentIds)
            } else {
              this.changJobData(this.DeptTableData, this.selectRow.jobId, this.editJobsData.name, data.workContentIds)
            }
            this.isChangeJobModal = false
            this.jobDrawer = false
            this.operationModal = false
            this.$refs.editJobsData.resetFields() // 清空
            break
        }
      })
    },
    putJobName () {
      this.$refs.editJobsData.resetFields() // 清空
      this.editJobsData.name = this.selectRow.jobName
      this.editJobsData.deptType = this.selectRow.deptType
      this.editJobsData.id = this.selectRow.jobId
      getJobsObligationData(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
            this.selectRow.workContents.forEach(res => {
              this.editJobsData.obligation.push(res.id)
            })
            break
        }
      })
    },
    changJobData (table, id, name, workContentIds) {
      table.forEach(res => {
        if (res.jobId === id) {
          res.jobName = name
          let list = res.workContents.filter(item => {
            if (workContentIds.includes(item.id)) {
              return item
            }
          })
          res.workContents = list
        } else if (res.children) {
          this.changJobData(res.children, id, name, workContentIds)
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
        this.jobDrawer = false
      }
    },
    // 加入已有部门弹框 -- 取消
    deptJoinDeptCancel () {
      this.deptJoinDeptVal = []
      this.deptJoinDept = false
    },
    deptJoinDeptOk () {
      let data = {
        curDepartmentId: this.selectRow.deptId,
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
            this.DataMoveDeptRemove(this.tableData, this.selectRow.deptId, this.deptJoinDeptVal[0])
            this.tableDataDeptJoin(this.tableData, this.selectRow.deptId, this.deptData)
            // this.DataMoveDept(this.tableData, this.selectRow.deptId, this.deptJoinDeptVal[0])
            this.deptJoinDept = false
            this.operationModal = false
            this.$Message.success(res.data.msgContent)
            break
        }
      })
    },

    tableDataDeptJoin (table, deptId, data) {
      table.forEach((res, index) => {
        if (res.deptId === deptId) {
          res.children.push(data)
        } else {
          if (res.children) {
            this.tableDataDeptJoin(res.children, deptId, data)
          }
        }
      })
    },
    moveHaveDept () {
      getMoveDept(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
    },
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
        if (this.checkNewDeptType === '1') {
          addDepartmentData(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                let data = res.data.msgData
                data.deptName = this.newDepartmentalData.name
                data.deptId = data.id
                data.deptWorkContents = data.workDetailContents
                data.workDetailContents = ''
                data.deptPermissions = this.selectRow.deptPermissions
                data.rolePermissions = this.selectRow.rolePermissions
                data.isAuth = true
                this.addTableData(this.tableData, this.selectRow.deptId, data)
                this.cancel(1) // 清空
                this.isAddModal = false
                this.operationModal = false
                this.$Message.success(res.data.msgContent)
                break
            }
          })
        } else {
          addBrotherData(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId, data).then(res => {
            let status = isDataSuccess(res)
            switch (status) {
              case 1:
                this.$Message.error('服务器繁忙请稍后')
                break
              case 2:
                this.$Message.error(res.data.msgContent)
                break
              default:
                let data = res.data.msgData
                data.deptName = this.newDepartmentalData.name
                data.deptId = data.id
                data.deptWorkContents = data.workDetailContents
                data.workDetailContents = ''
                data.deptPermissions = this.selectRow.deptPermissions
                data.rolePermissions = this.selectRow.rolePermissions
                data.isAuth = true
                this.addBrotherTableData(this.tableData, this.selectRow.deptId, data)
                this.cancel(1)// 清空
                this.isAddModal = false
                this.operationModal = false
                this.$Message.success(res.data.msgContent)
                break
            }
          })
        }
      }
    },
    isAddBrotherOk () {
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
        addBrotherData(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId, data).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              let data = res.data.msgData
              data.deptName = this.newDepartmentalData.name
              data.deptId = data.id
              data.deptWorkContents = data.workDetailContents
              data.workDetailContents = ''
              data.isAuth = true
              this.addBrotherTableData(this.tableData, this.selectRow.deptId, data)
              this.isAddBrotherCancel() // 清空
              this.operationModal = false
              this.$Message.success(res.data.msgContent)
              break
          }
        })
      }
    },
    addBrotherTableData (table, id, data) {
      table.forEach(res => {
        if (res.deptId === id) {
          table.push(data)
        } else if (res.children) {
          this.addBrotherTableData(res.children, id, data)
        }
      })
    },

    addBottomDept () {
      getDeptWorkingRange(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
            getisBrotherAdd(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  break
                case 2:
                  this.$Message.error(res.data.msgContent)
                  break
                default:
                  this.isRadioDisabled = res.data.msgData
                  break
              }
            })
            this.cancel(1)// 清空
            this.checkAll = false
            this.manageCheckAll = false
            this.indeterminate = false
            this.manageIndeterminate = false
            this.isAddModal = true
            break
        }
      })
    },
    addTableData (table, id, data) {
      table.forEach(res => {
        if (res.deptId === id) {
          if (res.children) {
            res.children.push(data)
          } else {
            res.children = [data]
          }
        } else if (res.children) {
          this.addTableData(res.children, id, data)
        }
      })
    },

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
                  getNewAllRole(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
                    let status = isDataSuccess(res)
                    switch (status) {
                      case 1:
                        this.$Message.error('服务器繁忙请稍后')
                        break
                      case 2:
                        this.$Message.error(res.data.msgContent)
                        break
                      default:
                        // this.tableData = res.data.msgData
                        this.isEditModal = false
                        this.operationModal = false
                        this.changTableData(this.tableData, this.editDepartmentalData.id, this.editDepartmentalData.name)
                        this.$Message.success(res.data.msgContent)
                    }
                  })

                  break
              }
            }
          )
        }
      })
    },
    addBrotherDept () {
      getbrotherDeptWorkingRange(JSON.parse(localStorage.getItem('projectId')).id, this.selectRow.deptId).then(res => {
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
            this.isAddBrotherModal = true
            break
        }
      })
    },

    getManagePermissionTitle () {
      return this.managePermissionForm.system + '管理权限'
    },
    getDepartmentData () {
      jsPlumb.deleteEveryEndpoint()
      jsPlumb.deleteEveryConnection()
      getDepartmentAllUser(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
            this.allLeavl = []
            this.textTreeData = {}
            if (data.msgCode === 0) {
              this.data = [data.msgData.departmentAndJobAndTeamer]
              this.data.forEach(res => {
                res.children.forEach((item, index) => {
                  if (item.deptName === '项目副经理办公室') {
                    res.children.splice(index, 1)
                    res.children.unshift(item)
                  } else if (item.deptName === '总工办公室') {
                    res.children.splice(index, 1)
                    res.children.push(item)
                  }
                })
              })
              this.changetextTreeData(this.data, 1)
              let res = []
              const fn = (source) => {
                source.forEach(el => {
                  res.push(el)
                  el.children && el.children.length > 0 ? fn(el.children) : ""        // 子级递归
                })
              }
              fn(this.data)
              this.textTreeData = res
              this.allLeavl = new Set(this.allLeavl)

            }
        }
      })
    },
    changetextTreeData (data, leavl) {
      data.forEach(res => {
        res.leavl = leavl
        this.allLeavl.push(leavl)
        if (res.children) {
          this.changetextTreeData(res.children, leavl + 1)
        }
      })
    },
    // 编辑部门
    putDeptName () {
      if (this.selectRow.deptName) {
        this.editDepartmentalData.name = this.selectRow.deptName
        this.editDepartmentalData.id = this.selectRow.deptId
        this.editDepartmentalData.res = ''
        this.isEditModal = true
      } else {
        this.$Message.error('请选中部门')
      }
    },
    // 编辑部门
    changTableData (table, id, name) {
      table.forEach(res => {
        if (res.deptId === id) {
          res.deptName = name
        } else if (res.children) {
          this.changTableData(res.children, id, name)
        }
      })
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
    // 操作
    clickCurrent () {
      this.operationModal = true
    },
    // 隐藏所有按钮
    changeClick (table) {
      table.forEach(res => {
        res.clickModal = false
        if (res.children) {
          this.changeClick(res.children)
        }
      })
    },
    // checkbox 选择事件
    currentChangeEvent ({ row }) {
      if (row.isAuth) {
        if (this.selectRow === row) {
          this.selectRow = ''
          this.changeClick(this.tableData)
          this.$refs.xTree.clearCheckboxRow()
          this.$refs.xTree.clearCurrentRow()
        } else {
          // this.operationModal = true
          this.selectRow = row
          this.changeClick(this.tableData)
          row.clickModal = true
          this.$refs.xTree.clearCheckboxRow()
          this.$refs.xTree.setCheckboxRow(row, true)
          this.$refs.xTree.setCurrentRow(row)
        }
      }
    },
    // checkbox 选择事件
    DeptCurrentChangeEvent ({ row }) {
      if (row.isAuth) {
        if (this.selectRow === row) {
          this.selectRow = ''
          this.changeClick(this.DeptTableData)
          this.$refs.xDeptTree.clearCheckboxRow()
          this.$refs.xDeptTree.clearCurrentRow()
        } else {
          // this.operationModal = true
          this.selectRow = row
          this.changeClick(this.DeptTableData)
          row.clickModal = true
          this.$refs.xDeptTree.clearCheckboxRow()
          this.$refs.xDeptTree.setCheckboxRow(row, true)
          this.$refs.xDeptTree.setCurrentRow(row)
        }
      }
    },
    dataChange (data, i) {
      data.forEach(res => {
        i++
        res.id = i
        if (res.children !== null) {
          this.dataChange(res.children, i)
        }
      })
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
    },
    goto (path) {
      this.$router.push({
        path: path
      })
    },
    operationModalOk () {

    },
    operationModalCancel () {
      this.operationModal = false
      this.$refs.xTree.clearCheckboxRow()
      this.$refs.xTree.clearCurrentRow()
    },
    rowStyle ({ row, rowIndex }) {
      if (row.deptName === '项目经理办公室' || row.deptName === '项目副经理办公室' || row.deptName === '总工办公室') {
        return {
          fontWeight: 'bold'
        }
      }
    },
    getTableImg () {
      this.$nextTick(() => {
        setTimeout(() => {
          let _this = this
          // jsPlumb.importDefaults({
          //   Container: 'JsPlumbContainer'
          // });
          jsPlumb.ready(function () {
            var option = { radius: 1, curviness: 0.1 }
            var top_left_config = {
              endpoint: ['Dot', { radius: option.radius }],//Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
              connector: ['Flowchart', { curviness: option.curviness }], //Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
              anchor: ['Top', 'Left'] //Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
            }
            var top_right_config = {
              endpoint: ['Dot', { radius: option.radius }],//Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
              connector: ['Flowchart', { curviness: option.curviness }], //Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
              anchor: ['Top', 'Right'] //Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
            }
            var top_bottom_config = {
              endpoint: ['Dot', { radius: option.radius }],//Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
              connector: ['Flowchart', { curviness: option.curviness }], //Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
              anchor: ['Top', 'Bottom'] //Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
            }
            var bottom_top_config = {
              endpoint: ['Dot', { radius: option.radius }],//Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
              connector: ['Straight', { curviness: option.curviness }], //Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
              anchor: ['Bottom', 'Top'] //Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
            }
            var bottom_bottom_config = {
              endpoint: ['Dot', { radius: option.radius }],//Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
              connector: ['Flowchart', { curviness: option.curviness }], //Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
              anchor: ['Bottom', 'Bottom'] //Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
            }
            function connect (from, to, config) {
              jsPlumb.connect({
                source: from,
                target: to,
                paintStyle: { stroke: '#202020', strokeWidth: 2 },//连线的样式
                // overlays: [['Arrow', { width: 12, length: 10, location: 1 }]] //连线箭头。支持多个箭头，所以数组。location=1箭头在末尾，0.5在中间
              }, config)
            }
            //原则：先左右，后上下。重叠算在一条线上。
            // connect('项目副经理办公室', '总工办公室', bottom_bottom_config)

            if (_this.data[0]) {
              getNewData(_this.data[0])
            }
            function getNewData (data) {
              if (data.children) {
                data.children.forEach(res => {
                  if (res.leavl === 2) {
                    if (res.deptName === '项目副经理办公室') {
                      connect('项目经理办公室', '项目副经理办公室', top_left_config)
                      if (res.children) {
                        getNewData(res)
                      }
                    } else if (res.deptName === '总工办公室') {
                      connect('项目经理办公室', '总工办公室', top_right_config)
                      if (res.children) {
                        getNewData(res)
                      }
                    } else {
                      connect('项目经理办公室', 'center', bottom_top_config)
                      if (res.children) {
                        getNewData(res)
                      }
                    }
                  } else {
                    connect(data.deptName, res.deptName, top_bottom_config)
                    if (res.children) {
                      getNewData(res)
                    }
                  }
                })
              }
            }
            // _this.textTreeData[1].list.forEach(res => {
            //   if (res.type === 'right') {
            //     connect('项目经理', res.name, top_left_config);
            //   } else if (res.type === 'left') {
            //     connect('项目经理', res.name, top_right_config);
            //   }
            // })
            // _this.textTreeData.forEach((res, index) => {
            //   if (index > 1) {
            //     res.list.forEach(item => {
            //       connect('center', item.name, bottom_top_config);
            //     })
            //   }
            // })
          })
        }, 500)
      })
    },
    handleDocumentContextmenu () {
      this.canMove = false
    },
    contextmenu (data, $event) {
      let event = $event || window.event
      event.preventDefault
        ? event.preventDefault()
        : (event.returnValue = false)
      this.currentContextMenuId = data.id
    },
    setDepartmentData (data) {
      data.isRoot = true
      this.departmentData = data
    },
    mousedownView (event) {
      this.canMove = true
      this.initPageX = event.pageX
      this.initPageY = event.pageY
      this.oldMarginLeft = this.orgTreeOffsetLeft
      this.oldMarginTop = this.orgTreeOffsetTop
      on(document, 'mousemove', this.mousemoveView)
      on(document, 'mouseup', this.mouseupView)
    },
    mousemoveView (event) {
      if (!this.canMove) return
      const { pageX, pageY } = event
      this.orgTreeOffsetLeft = this.oldMarginLeft + pageX - this.initPageX
      this.orgTreeOffsetTop = this.oldMarginTop + pageY - this.initPageY
    },
    mouseupView () {
      this.canMove = false
      off(document, 'mousemove', this.mousemoveView)
      off(document, 'mouseup', this.mouseupView)
    },
    handleDropdownClick (event) {
      event.stopPropagation()
    },
    handleDocumentContextmenu () {
      this.canMove = false
    },
    handleContextMenuClick (data, key) {
      this.$emit('on-menu-click', { data, key })
    },
    getUserName (name) {
      if (name) {
        return name
      } else {
        return '-'
      }
    },
    putMaxHeight (level, data) {
      if (level <= Object.keys(this.data.levelHeight).length) {
        data.forEach(res => {
          res.maxHeight = this.data.levelHeight[level]
          if (res.children) {
            this.putMaxHeight(level + 1, res.children)
          }
        })
      }
    }
  },
  computed: {
    orgTreeStyle () {
      return {
        transform: `translate(-50%, -40%) scale(${this.zoomHandled}, ${
          this.zoomHandled
          })`,
        marginLeft: `${this.orgTreeOffsetLeft}px`,
        marginTop: `${this.orgTreeOffsetTop}px`
      }
    },
    zoomHandled () {
      return this.zoom / 100
    },
    deptButton () {
      if (this.selectRow) {
        if (this.selectRow.deptName) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    },
    personButton () {
      if (this.selectRow) {
        if (this.selectRow.teamId) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    }
  },
  created () {
    this.getDepartmentData()
    if (document.body.clientWidth < 1400) {
      this.zoom = 60
      this.height = 400
    }
  },
  mounted () {
    getUserInfo(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
          break
      }
    })
    this.getTableImg()
    if (screen.availWidth < 1400) {
      this.orgTreeOffsetTop = 100
    } else {
      this.orgTreeOffsetTop = 0
    }
    on(document, 'contextmenu', this.handleDocumentContextmenu)
  },
  beforeDestroy () {
    off(document, 'contextmenu', this.handleDocumentContextmenu)
  },
  activated () {
    this.getDepartmentData()
    this.getTableImg()
    getUserInfo(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
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
          break
      }
    })
  }
}
</script>

<style lang="less" scoped>
.operationTitle {
  font-weight: bold;
  margin-bottom: 10px;
}
.width350 {
  width: 350px;
}
.operationCenter {
  cursor: pointer;
}
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.itemClass {
  margin: 30px;
  width: 253px;
  padding: 14px 14px;
  background: #2d8cf0;
  user-select: none;
  word-wrap: none;
  white-space: nowrap;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  transition: background 0.1s ease-in;
  cursor: default;
  &:hover {
    background: lightgray;
    color: #000;
    transition: background 0.1s ease-in;
    .jobTable {
      border: 1px solid #000;
      border-width: 1px 0px 0px 1px;
      td {
        border: 1px solid #000;
        border-width: 0px 1px 1px 0px;
        height: 24px;
      }
    }
  }
  &.has-children-label {
    cursor: pointer;
  }
  .context-menu {
    position: absolute;
    right: -10px;
    bottom: 20px;
    z-index: 10;
  }
}
.jobName {
  width: 144px;
  text-align: left;
}
.teamerName {
  width: 80px;
  display: inline-block;
  text-align: center;
}
.jobTable {
  border: 1px solid #fff;
  border-width: 1px 0px 0px 1px;
  td {
    border: 1px solid #fff;
    border-width: 0px 1px 1px 0px;
    height: 24px;
  }
}
.itemClass2 {
  height: 60px;
  width: 100px;
  border: 1px solid #ccc;
  display: inline-block;
  vertical-align: top;
}
</style>
<style lang="less">
.col_5 {
  .c--tooltip {
    padding-right: 64px;
  }
}
.col_6 {
  .c--tooltip {
    padding-right: 64px;
  }
}
</style>

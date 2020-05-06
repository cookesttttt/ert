<template>
    <el-tabs v-model="activeName" @tab-click="handleClick(activeName)" tab-position="left" type="border-card" style="height: 100%">
      <el-tab-pane label="派车返车" name="PC">
        <div class="bottom15">
          <ButtonGroup>
            <!--新建派车-->
            <Button class="search-btn" type="primary" @click="clickNewButton">&nbsp;新建派车单</Button>
            <!--回车登记-->
            <Button  @click="returnRegistration">&nbsp;回车登记</Button>
          </ButtonGroup>
          <!--新建派车弹框-->
          <Modal title="新建派车单信息" v-model="isAddModal" :mask-closable="false" @on-cancel="cancel(1)" class-name="vertical-center-modal">
            <Form
              ref="addTruckingOrderData"
              :model="addTruckingOrderData"
              :label-width="100"
              inline
              :rules="rules"
            >
              <FormItem label="单号">
                <Input
                  v-model="addTruckingOrderData.orderNumber"
                  class="width350"
                  :maxlength="15"
                  disabled
                ></Input>
              </FormItem>
              <br />
              <FormItem label="用车日期" prop="vehicleTime">
                <DatePicker
                  v-model="addTruckingOrderData.vehicleTime"
                  format='yyyy-MM-dd'
                  type="date"
                  class="width350">
                </DatePicker>
              </FormItem>
              <br />
              <FormItem label="车牌号码" >
                <Input v-model="vehicleNumbers" class="width350" disabled></Input>
              </FormItem>
              <FormItem label="用车人" prop="carUser">
                <Input v-model="addTruckingOrderData.carUser" class="width350" :maxlength="15"></Input>
              </FormItem>
              <br />
              <FormItem label="驾驶员" prop="driver">
                <Input v-model="addTruckingOrderData.driver" class="width350" :maxlength="15"></Input>
              </FormItem>
              <br />
              <FormItem label="目的地" prop="destination">
                <Input v-model="addTruckingOrderData.destination" class="width350"></Input>
              </FormItem>
              <FormItem label="用车原因" prop="vehicleReason">
                <Input
                  v-model="addTruckingOrderData.vehicleReason"
                  class="width350"
                  type="textarea"
                  :autosize="{minRows: 2,maxRows: 5}"
                ></Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text" size="large" @click="cancel(1)">取消</Button>
              <Button type="primary" size="large" @click="addTruckingOrder">保存</Button>
            </div>
          </Modal>

          <!--回车登记弹框-->
          <Modal title="回车登记" v-model="isReturnMode" :mask-closable="false" @on-cancel="cancel(2)" class-name="vertical-center-modal">
            <Form
              ref="returnRegistrationData"
              :model="returnRegistrationData"
              :label-width="100"
              :rules="rules"
              inline
            >
              <FormItem label="派车单号" prop="orderNumber">
                <Input v-model="returnRegistrationData.orderNumber" class="width350" disabled></Input>
              </FormItem>
              <br />
              <FormItem label="车牌号码" prop="licensePlate">
                <Input v-model="returnRegistrationData.licensePlate" class="width350" disabled></Input>
              </FormItem>
              <br />
              <FormItem label="用车人" prop="carUser">
                <Input v-model="returnRegistrationData.carUser" class="width350" disabled></Input>
              </FormItem>
              <br />
              <FormItem label="用车日期" prop="vehicleTime">
                <DatePicker
                  format='yyyy-MM-dd'
                  v-model="returnRegistrationData.vehicleTime"
                  class="width350"
                  type="date"
                  disabled
                ></DatePicker>
              </FormItem>
              <br />
              <FormItem label="回车日期" prop="enterTime">
                <DatePicker v-model="returnRegistrationData.enterTime" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
              </FormItem>
              <br />
              <FormItem label="初始里程" prop="initialMileage">
                <Input v-model="returnRegistrationData.initialMileage" class="width350"></Input>
              </FormItem>
              <br />
              <FormItem label="回车里程" prop="returnMileage">
                <Input v-model="returnRegistrationData.returnMileage" class="width350"></Input>
              </FormItem>
              <br />
              <FormItem label="备注" prop="remarks">
                <Input v-model="returnRegistrationData.remarks" class="width350"
                       type="textarea"
                       :autosize="{minRows: 2,maxRows: 5}"></Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text" size="large" @click="cancel(2)">取消</Button>
              <Button type="primary" size="large" @click="addReturnRegistration">保存</Button>
            </div>
          </Modal>

          <!--收搜-->
          <div class="right">
            <Input class="search-input" placeholder="请输入关键字收搜" v-model="searchValue"></Input>
            <Button class="search-btn" @click="searchTruckingOrder" type="primary">
              <Icon type="ios-search" />&nbsp;搜索
            </Button>
          </div>
        </div>
        <Table ref="tables" border :columns="columns" :data="tableData"></Table>
        <div class="page">
          <div class="right">
            <br>
            <Page :total="totalElements" :current="pageNum" show-total @on-change="changePage"></Page>
          </div>
        </div>
        <!--编辑派车单弹框-->
        <Modal title="编辑派车单信息" class-name="vertical-center-modal" v-model="isEditModal" :mask-closable="false" @on-cancel="cancel">
          <Form
            ref="editTruckingOrderData"
            :model="editTruckingOrderData"
            :label-width="100"
            inline
            :rules="rules"
          >
            <FormItem label="单号">
              <Input
                v-model="editTruckingOrderData.orderNumber"
                class="width350"
                :maxlength="15"
                disabled
              ></Input>
            </FormItem>
            <br />
            <FormItem label="用车日期" prop="vehicleTime">
              <DatePicker v-model="editTruckingOrderData.vehicleTime" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
            </FormItem>
            <br />
            <FormItem label="车牌号码">
              <AutoComplete
                v-model="editTruckingOrderData.licensePlate"
                :data="allNumber"
                :filter-method="filterMethod"
                placeholder="输入关键字查询车辆"
                class="width350"
                disabled
              ></AutoComplete>
            </FormItem>
            <FormItem label="用车人" prop="carUser">
              <Input v-model="editTruckingOrderData.carUser" class="width350" :maxlength="15"></Input>
            </FormItem>
            <br />
            <FormItem label="驾驶员" prop="driver">
              <Input v-model="editTruckingOrderData.driver" class="width350" :maxlength="15"></Input>
            </FormItem>
            <br />
            <FormItem label="目的地" prop="destination">
              <Input v-model="editTruckingOrderData.destination" class="width350"></Input>
            </FormItem>
            <FormItem label="用车原因" prop="vehicleReason">
              <Input
                v-model="editTruckingOrderData.vehicleReason"
                class="width350"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
              ></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel">取消</Button>
            <Button type="primary" size="large" @click="editVTruckingOrder">保存</Button>
          </div>
        </Modal>
      </el-tab-pane>
      <el-tab-pane label="加油信息" name="JY">
        <div class="bottom15">
          <Button  class="search-btn" type="primary" @click="newRefueling" >&nbsp;新建加油记录</Button>
          <Modal
            class-name="vertical-center-modal"
            title="新建加油信息"
            v-model="isAddModal2"
            :mask-closable="false"
            @on-cancel="cancel2(1)">
            <Form
              ref="vehicleRefuelingData"
              :model="vehicleRefuelingData"
              :label-width="100" inline :rules="rules2">
              <FormItem label="车牌号码">
                <Input v-model="vehicleNumbers" class="width350" disabled></Input>
              </FormItem>
              <br>
              <FormItem label="加油日期" prop="refuelingDate">
                <DatePicker v-model="vehicleRefuelingData.refuelingDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
              </FormItem>
              <br>
              <FormItem label="油号" prop="oilNo">
                <Input v-model="vehicleRefuelingData.oilNo" class="width350" :maxlength="15"></Input>
              </FormItem>
              <FormItem label="费用" prop="cost">
                <Input v-model="vehicleRefuelingData.cost" class="width350" :maxlength="12"></Input>
              </FormItem>
              <br>
              <FormItem label="经办人" prop="operator">
                <Input v-model="vehicleRefuelingData.operator" class="width350" :maxlength="15"></Input>
              </FormItem>
              <br>
              <FormItem label="登记日期" prop="recordDate">
                <DatePicker v-model="vehicleRefuelingData.recordDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel2(1)">取消</Button>
              <Button type="primary" size="large" @click="addRefueling">保存</Button>
            </div>
          </Modal>
          <!--收搜-->
          <div class="right">
            <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue2"></Input>
            <Button class="search-btn" type="primary" @click="searchRefueling">
              <Icon type="ios-search"/>
              &nbsp;搜索
            </Button>
          </div>
          <div class="clear"></div>
        </div>
        <!--表格-->
        <Table
          border
          :columns="columns2"
          :data="tableData2">
        </Table>
        <!--分页-->
        <div class="page">
          <div class="right">
            <br>
            <Page :total="totalElements2"
                  :current="pageNum2"
                  show-total
                  @on-change="changePage2">
            </Page>
          </div>
        </div>
        <!--编辑车辆弹框-->
        <Modal
          class-name="vertical-center-modal"
          title="编辑加油信息"
          v-model="isEditModal2"
          :mask-closable="false"
          @on-cancel="cancel2">
          <Form
            ref="editVehicleRefuelingData"
            :model="editVehicleRefuelingData"
            :label-width="100" inline :rules="rules2">
            <FormItem label="车牌号码">
              <Input v-model="editVehicleRefuelingData.vehicleName" class="width350" disabled></Input>
            </FormItem>
            <br>
            <FormItem label="加油日期" prop="refuelingDate">
              <DatePicker v-model="editVehicleRefuelingData.refuelingDate" type="date" format='yyyy-MM-dd' class="width350"></DatePicker>
            </FormItem>
            <br>
            <FormItem label="油号" prop="oilNo">
              <Input v-model="editVehicleRefuelingData.oilNo" class="width350" :maxlength="15"></Input>
            </FormItem>
            <FormItem label="费用" prop="cost">
              <Input v-model="editVehicleRefuelingData.cost" class="width350" :maxlength="12"></Input>
            </FormItem>
            <br>
            <FormItem label="经办人" prop="operator">
              <Input v-model="editVehicleRefuelingData.operator" class="width350" :maxlength="15"></Input>
            </FormItem>
            <br>
            <FormItem label="登记日期" prop="recordDate">
              <DatePicker v-model="editVehicleRefuelingData.recordDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text"   size="large"  @click="cancel2">取消</Button>
            <Button type="primary" size="large" @click="editRefueling">保存</Button>
          </div>
        </Modal>
      </el-tab-pane>
      <el-tab-pane label="违章信息" name="WZ">
          <div class="bottom15">
            <!--新建违章信息-->
            <Button class="search-btn" type="primary" @click="NewRegulations">&nbsp;新建违章记录</Button>
            <Modal
              class-name="vertical-center-modal"
              title="新建违章信息"
              v-model="isAddModal3"
              :mask-closable="false"
              @on-cancel="cancel3(1)">
              <Form
                ref="vehicleViolationData"
                :model="vehicleViolationData"
                :label-width="100" inline :rules="rules3">
                <FormItem label="车牌号码">
                  <Input v-model="vehicleNumbers" class="width350" disabled></Input>
                </FormItem>
                <br>
                <FormItem label="违章日期" prop="violationDate">
                  <DatePicker v-model="vehicleViolationData.violationDate" type="date" class="width350"
                              format="yyyy-MM-dd"></DatePicker>
                </FormItem>
                <br>
                <FormItem label="违章地点" prop="violationPlace">
                  <Input v-model="vehicleViolationData.violationPlace" class="width350" :maxlength="15"></Input>
                </FormItem>
                <FormItem label="违章细则" prop="violationRules">
                  <Input v-model="vehicleViolationData.violationRules" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
                </FormItem>
                <br>
                <FormItem label="罚款金额" prop="fineAmount">
                  <Input v-model="vehicleViolationData.fineAmount" class="width350" :maxlength="12"></Input>
                </FormItem>
                <br>
                <FormItem label="违章记分" prop="demeritScore">
                  <Input v-model="vehicleViolationData.demeritScore" class="width350" :maxlength="8"></Input>
                </FormItem>
                <br>
                <FormItem label="当事人" prop="party">
                  <Input v-model="vehicleViolationData.party" class="width350" :maxlength="15"></Input>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="text" size="large" @click="cancel3(1)">取消</Button>
                <Button type="primary" size="large" @click="addViolation">保存</Button>
              </div>
            </Modal>
            <!--收搜-->
            <div class="right" style="float: right">
              <Input class="search-input" placeholder="请输入关键字收搜" v-model="searchValue3"></Input>
              <Button class="search-btn" type="primary" @click="searchViolation">
                <Icon type="ios-search"/>
                &nbsp;搜索
              </Button>
            </div>
          </div>
          <div class="clear"></div>
          <!--表格-->
          <Table
            border
            :columns="columns3"
            :data="tableData3">
          </Table>
          <!--分页-->
          <div class="page">
            <div class="right">
              <br>
              <Page :total="totalElements3"
                    :current="pageNum3"
                    show-total
                    @on-change="changePage3">
              </Page>
            </div>
          </div>
          <!--编辑车辆弹框-->
          <Modal
            class-name="vertical-center-modal"
            title="编辑违章信息"
            v-model="isEditModal3"
            :mask-closable="false"
            @on-cancel="cancel3">
            <Form
              ref="editVehicleViolationData"
              :model="editVehicleViolationData"
              :label-width="100" inline :rules="rules3">
              <FormItem label="车牌号码">
                <Input v-model="editVehicleViolationData.vehicleName" class="width350" disabled></Input>
              </FormItem>
              <br>
              <FormItem label="违章日期" prop="violationDate">
                <DatePicker v-model="editVehicleViolationData.violationDate" type="date" class="width350"
                            format="yyyy-MM-dd"></DatePicker>
              </FormItem>
              <br>
              <FormItem label="违章地点" prop="violationPlace">
                <Input v-model="editVehicleViolationData.violationPlace" class="width350" :maxlength="15"></Input>
              </FormItem>
              <FormItem label="违章细则" prop="violationRules">
                <Input v-model="editVehicleViolationData.violationRules" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
              </FormItem>
              <br>
              <FormItem label="罚款金额" prop="fineAmount">
                <Input v-model="editVehicleViolationData.fineAmount" class="width350" :maxlength="12"></Input>
              </FormItem>
              <br>
              <FormItem label="违章记分" prop="demeritScore">
                <Input v-model="editVehicleViolationData.demeritScore" class="width350" :maxlength="8"></Input>
              </FormItem>
              <br>
              <FormItem label="当事人" prop="party">
                <Input v-model="editVehicleViolationData.party" class="width350" :maxlength="15"></Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text" size="large" @click="cancel3">取消</Button>
              <Button type="primary" size="large" @click="editViolation">保存</Button>
            </div>
          </Modal>
      </el-tab-pane>
      <el-tab-pane label="维护保养" name="WH">
          <div class="bottom15">
            <!--新建违章信息-->
            <Button  class="search-btn" type="primary" @click="newMaintenanceClick" >&nbsp;新建维修保养记录</Button>
            <Modal
              class-name="vertical-center-modal"
              title="新建维修保养信息"
              v-model="isAddModal4"
              :mask-closable="false"
              @on-cancel="cancel4(1)">
              <Form
                ref="maintenanceData"
                :model="maintenanceData"
                :label-width="100" inline :rules="rules4">
                <FormItem label="车牌号码">
                  <Input v-model="vehicleNumbers" class="width350" disabled></Input>
                </FormItem>
                <br>
                <FormItem label="维保日期" prop="maintenanceDate">
                  <DatePicker v-model="maintenanceData.maintenanceDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
                </FormItem>
                <br>
                <FormItem label="维保地点" prop="maintenanceSite">
                  <Input v-model="maintenanceData.maintenanceSite" class="width350" :maxlength="15"></Input>
                </FormItem>
                <FormItem label="经办人" prop="operator">
                  <Input v-model="maintenanceData.operator" class="width350" :maxlength="15"></Input>
                </FormItem>
                <br>
                <FormItem label="维保项目" prop="maintenanceProject">
                  <Input v-model="maintenanceData.maintenanceProject" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
                </FormItem>
                <br>
                <FormItem label="维保费用" prop="maintenanceCost">
                  <Input v-model="maintenanceData.maintenanceCost" class="width350" :maxlength="12"></Input>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="text"   size="large"  @click="cancel4(1)">取消</Button>
                <Button type="primary" size="large" @click="addMaintenance">保存</Button>
              </div>
            </Modal>
            <!--收搜-->
            <div class="right" style="float: right">
              <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue4"></Input>
              <Button class="search-btn" type="primary" @click="searchMaintenance">
                <Icon type="ios-search"/>
                &nbsp;搜索
              </Button>
            </div>
          </div>
          <div class="clear"></div>
          <!--表格-->
          <Table
            border
            :columns="columns4"
            :data="tableData4">
          </Table>
          <!--分页-->
          <div class="page">
            <div class="right">
              <br>
              <Page :total="totalElements4"
                    :current="pageNum4"
                    show-total
                    @on-change="changePage4">
              </Page>
            </div>
          </div>
          <!--编辑维修保养信息弹框-->
          <Modal
            class-name="vertical-center-modal"
            title="编辑维修保养信息"
            v-model="isEditModal4"
            :mask-closable="false"
            @on-cancel="cancel4">
            <Form
              ref="editMaintenanceData"
              :model="editMaintenanceData"
              :label-width="100" inline :rules="rules4">
              <FormItem label="车牌号码">
                <Input v-model="editMaintenanceData.vehicleName" class="width350" disabled></Input>
              </FormItem>
              <br>
              <FormItem label="维保日期" prop="maintenanceDate">
                <DatePicker v-model="editMaintenanceData.maintenanceDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
              </FormItem>
              <br>
              <FormItem label="维保地点" prop="maintenanceSite">
                <Input v-model="editMaintenanceData.maintenanceSite" class="width350" :maxlength="15"></Input>
              </FormItem>
              <FormItem label="经办人" prop="operator">
                <Input v-model="editMaintenanceData.operator" class="width350" :maxlength="15"></Input>
              </FormItem>
              <br>
              <FormItem label="维保项目" prop="maintenanceProject">
                <Input v-model="editMaintenanceData.maintenanceProject" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
              </FormItem>
              <br>
              <FormItem label="维保费用" prop="maintenanceCost">
                <Input v-model="editMaintenanceData.maintenanceCost" class="width350" :maxlength="12"></Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel4">取消</Button>
              <Button type="primary" size="large" @click="editMaintenance">保存</Button>
            </div>
          </Modal>
      </el-tab-pane>
      <el-tab-pane label="保险登记" name="BX">
          <div class="bottom15">
            <Button  class="search-btn" type="primary" @click="registrationClick" >&nbsp;新建保险记录</Button>
            <Modal
              class-name="vertical-center-modal"
              title="新建保险登记信息"
              v-model="isAddModal5"
              :mask-closable="false"
              @on-cancel="cancel5(1)">
              <Form
                ref="insuranceData"
                :model="insuranceData"
                :label-width="100" inline :rules="rules5">
                <FormItem label="车牌号码">
                  <Input v-model="vehicleNumbers" class="width350" disabled></Input>
                </FormItem>
                <br>
                <FormItem label="保险日期" prop="dated">
                  <DatePicker v-model="insuranceData.dated" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
                </FormItem>
                <br>
                <FormItem label="保险公司" prop="insurer">
                  <Input v-model="insuranceData.insurer" class="width350" :maxlength="15"></Input>
                </FormItem>
                <FormItem label="经办人" prop="operator">
                  <Input v-model="insuranceData.operator" class="width350" :maxlength="15"></Input>
                </FormItem>
                <br>
                <FormItem label="保险项目" prop="coverage">
                  <Input v-model="insuranceData.coverage" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <br>
                <FormItem label="保险费用" prop="insuranceCharges">
                  <Input v-model="insuranceData.insuranceCharges" class="width350" :maxlength="12"></Input>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="text"   size="large"  @click="cancel5(1)">取消</Button>
                <Button type="primary" size="large" @click="addInsurance">保存</Button>
              </div>
            </Modal>
            <!--收搜-->
            <div class="right" style="float: right">
              <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue5"></Input>
              <Button class="search-btn" type="primary" @click="searchInsurance">
                <Icon type="ios-search"/>
                &nbsp;搜索
              </Button>
            </div>

          </div>
          <div class="clear"></div>
          <!--表格-->
          <Table
            border
            :columns="columns5"
            :data="tableData5">
          </Table>
          <!--分页-->
          <div class="page">
            <div class="right">
              <br>
              <Page :total="totalElements5"
                    :current="pageNum5"
                    show-total
                    @on-change="changePage5">
              </Page>
            </div>
          </div>

          <Modal
            class-name="vertical-center-modal"
            title="编辑保险登记信息"
            v-model="isEditModal5"
            :mask-closable="false"
            @on-cancel="cancel5">
            <Form
              ref="editInsuranceData"
              :model="editInsuranceData"
              :label-width="100" inline :rules="rules5">
              <FormItem label="车牌号码">
                <Input v-model="editInsuranceData.vehicleName" class="width350" disabled></Input>
              </FormItem>
              <br>
              <FormItem label="保险日期" prop="dated">
                <DatePicker v-model="editInsuranceData.dated" type="date" class="width350" format='yyyy-MM-dd' ></DatePicker>
              </FormItem>
              <br>
              <FormItem label="保险公司" prop="insurer">
                <Input v-model="editInsuranceData.insurer" class="width350" :maxlength="15"></Input>
              </FormItem>
              <FormItem label="经办人" prop="operator">
                <Input v-model="editInsuranceData.operator" class="width350" :maxlength="15"></Input>
              </FormItem>
              <br>
              <FormItem label="保险项目" prop="coverage">
                <Input v-model="editInsuranceData.coverage" type="textarea" :autosize="{minRows: 2,maxRows: 5}"  class="width350"></Input>
              </FormItem>
              <br>
              <FormItem label="保险费用" prop="insuranceCharges">
                <Input v-model="editInsuranceData.insuranceCharges" class="width350" :maxlength="12"></Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel5">取消</Button>
              <Button type="primary" size="large" @click="editInsurance">保存</Button>
            </div>
          </Modal>
      </el-tab-pane>
      <el-tab-pane label="年检登记" name="NJ">
          <div class="bottom15">
            <Button  class="search-btn" type="primary" @click="clickMOT" >&nbsp;新建年检记录</Button>
            <Modal
              class-name="vertical-center-modal"
              title="新建年检登记信息"
              v-model="isAddModal6"
              :mask-closable="false"
              @on-cancel="cancel6(1)">
              <Form
                ref="annualData"
                :model="annualData"
                :label-width="100" inline :rules="rules6">
                <FormItem label="车牌号码">
                  <Input v-model="vehicleNumbers" class="width350" disabled></Input>
                </FormItem>
                <br>
                <FormItem label="年检日期" prop="annualInspectionDate">
                  <DatePicker v-model="annualData.annualInspectionDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
                </FormItem>
                <br>
                <FormItem label="检车地点" prop="vehicleInspectionPlace">
                  <Input v-model="annualData.vehicleInspectionPlace" class="width350" :maxlength="15"></Input>
                </FormItem>
                <FormItem label="经办人" prop="operator">
                  <Input v-model="annualData.operator" class="width350" :maxlength="15"></Input>
                </FormItem>
                <br>
                <FormItem label="检车费用" prop="inspectionCost">
                  <Input v-model="annualData.inspectionCost" class="width350" :maxlength="12"></Input>
                </FormItem>
                <br>
                <FormItem label="备注" prop="remarks">
                  <Input v-model="annualData.remarks" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="text"   size="large"  @click="cancel6(1)">取消</Button>
                <Button type="primary" size="large" @click="addAnnual">保存</Button>
              </div>
            </Modal>
            <!--收搜-->
            <div class="right" style="float: right">
              <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue6"></Input>
              <Button class="search-btn" type="primary" @click="searchAnnual">
                <Icon type="ios-search"/>
                &nbsp;搜索
              </Button>
            </div>

          </div>
          <div class="clear"></div>
          <!--表格-->
          <Table
            border
            :columns="columns6"
            :data="tableData6">
          </Table>
          <!--分页-->
          <div class="page">
            <div class="right">
              <br>
              <Page :total="totalElements6"
                    :current="pageNum6"
                    show-total
                    @on-change="changePage6">
              </Page>
            </div>
          </div>

          <Modal
            class-name="vertical-center-modal"
            title="编辑年检登记信息"
            v-model="isEditModal6"
            :mask-closable="false"
            @on-cancel="cancel6">
            <Form
              ref="editAnnualData"
              :model="editAnnualData"
              :label-width="100" inline :rules="rules6">
              <FormItem label="车牌号码">
                <Input v-model="editAnnualData.vehicleName" class="width350" disabled></Input>
              </FormItem>
              <br>
              <FormItem label="年检日期" prop="annualInspectionDate">
                <DatePicker v-model="editAnnualData.annualInspectionDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
              </FormItem>
              <br>
              <FormItem label="检车地点" prop="vehicleInspectionPlace">
                <Input v-model="editAnnualData.vehicleInspectionPlace" class="width350" :maxlength="15"></Input>
              </FormItem>
              <FormItem label="经办人" prop="operator">
                <Input v-model="editAnnualData.operator" class="width350" :maxlength="15"></Input>
              </FormItem>
              <br>
              <FormItem label="检车费用" prop="inspectionCost">
                <Input v-model="editAnnualData.inspectionCost" class="width350" :maxlength="12"></Input>
              </FormItem>
              <br>
              <FormItem label="备注" prop="remarks">
                <Input v-model="editAnnualData.remarks"  type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel6">取消</Button>
              <Button type="primary" size="large" @click="editAnnual">保存</Button>
            </div>
          </Modal>
      </el-tab-pane>
      <el-tab-pane label="其他费用" name="QT">
          <div class="bottom15">
            <Button  class="search-btn" type="primary" @click="otherClick" >&nbsp;新建其他费用记录</Button>
            <Modal
              title="其他费用信息"
              class-name="vertical-center-modal"
              v-model="isAddModal7"
              :mask-closable="false"
              @on-cancel="cancel7(1)">
              <Form
                ref="otherChargesData"
                :model="otherChargesData"
                :label-width="100" inline :rules="rules7">
                <FormItem label="车牌号码">
                  <Input v-model="vehicleNumbers" class="width350" disabled></Input>
                </FormItem>
                <br>
                <FormItem label="费用日期" prop="costDate">
                  <DatePicker v-model="otherChargesData.costDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
                </FormItem>
                <br>
                <FormItem label="金额" prop="money">
                  <Input v-model="otherChargesData.money" class="width350" :maxlength="12"></Input>
                </FormItem>
                <FormItem label="经办人" prop="operator">
                  <Input v-model="otherChargesData.operator" class="width350" :maxlength="15"></Input>
                </FormItem>
                <br>
                <FormItem label="费用项目" prop="expenseItem">
                  <Input v-model="otherChargesData.expenseItem" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <br>
                <FormItem label="备注" prop="remarks">
                  <Input v-model="otherChargesData.remarks" type="textarea" :autosize="{minRows: 2,maxRows: 5}" class="width350"></Input>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="text"   size="large"  @click="cancel7(1)">取消</Button>
                <Button type="primary" size="large" @click="addOtherCharges">保存</Button>
              </div>
            </Modal>
            <!--收搜-->
            <div class="right" style="float: right">
              <Input class="search-input"  placeholder="请输入关键字收搜" v-model="searchValue7"></Input>
              <Button class="search-btn" type="primary" @click="searchOtherCharges">
                <Icon type="ios-search"/>
                &nbsp;搜索
              </Button>
            </div>
          </div>
          <div class="clear"></div>
          <!--表格-->
          <Table
            border
            :columns="columns7"
            :data="tableData7">
          </Table>
          <!--分页-->
          <div class="page">
            <div class="right">
              <br>
              <Page :total="totalElements7"
                    :current="pageNum7"
                    show-total
                    @on-change="changePage7">
              </Page>
            </div>
          </div>

          <Modal
            class-name="vertical-center-modal"
            title="编辑年检登记信息"
            v-model="isEditModal7"
            :mask-closable="false"
            @on-cancel="cancel7">
            <Form
              ref="editOtherCharges"
              :model="editOtherCharges"
              :label-width="100" inline :rules="rules7">
              <FormItem label="车牌号码">
                <Input v-model="editOtherCharges.vehicleName" class="width350" disabled></Input>
              </FormItem>
              <br>
              <FormItem label="费用日期" prop="costDate">
                <DatePicker v-model="editOtherCharges.costDate" type="date" class="width350" format='yyyy-MM-dd'></DatePicker>
              </FormItem>
              <br>
              <FormItem label="金额" prop="money">
                <Input v-model="editOtherCharges.money" class="width350" :maxlength="12"></Input>
              </FormItem>
              <FormItem label="经办人" prop="operator">
                <Input v-model="editOtherCharges.operator" class="width350" :maxlength="15"></Input>
              </FormItem>
              <br>
              <FormItem label="费用项目" prop="expenseItem">
                <Input v-model="editOtherCharges.expenseItem" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
              </FormItem>
              <br>
              <FormItem label="备注" prop="remarks">
                <Input v-model="editOtherCharges.remarks" class="width350" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel7">取消</Button>
              <Button type="primary" size="large" @click="editOtherCharge">保存</Button>
            </div>
          </Modal>
      </el-tab-pane>
    </el-tabs>
</template>

<script>
import {
  paramsValidate,
  isDataSuccess,
  formatTime
} from '@/libs/util'
import {
  getOrderNumber,
  newTruckingOrderData,
  getAllTruckingOrderData,
  deleteTruckingOrderData,
  getEditTruckingOrderData,
  getReturnRegistrationData
} from '@/api/cars/truckingOrder'
import {
    newVehicleRefuelingData,
    getAllVehicleRefuelingData,
    deleteVehicleRefuelingData,
    getEditVehicleRefuelingData
} from '@/api/cars/vehicleRefueling'
import {
    newVehicleViolationData,
    getAllVehicleViolationData,
    deleteVehicleViolationData,
    getEditVehicleViolationData
} from '@/api/cars/vehicleViolation'
import {
    newMaintenanceData,
    getAllMaintenanceData,
    deleteMaintenanceData,
    getEditMaintenanceData
} from '@/api/cars/maintenance'
import {
    newInsuranceRegistrationData,
    getAllInsuranceRegistrationData,
    deleteInsuranceRegistrationData,
    getEditInsuranceRegistrationData,
} from '@/api/cars/insuranceRegistration'
import {
    newAnnualInspectionRegistrationData,
    getAllAnnualInspectionRegistrationData,
    deleteAnnualInspectionRegistrationData,
    getEditAnnualInspectionRegistrationData,
} from '@/api/cars/annualInspectionRegistration'

import {
    newOtherChargesData,
    getAllOtherChargesData,
    deleteOtherChargesData,
    getEditOtherChargesData,
} from '@/api/cars/otherCharges'
import '../index.less'

export default {
  name: 'truckingOrder',
  data () {
    return {
        activeName:'PC',
        vehicleNumbers:'',
        //----------派车回车登记
        isAddModal: false,
      isEditModal: false,
      isReturnMode: false,
      allNumber: [],
      // 搜索
      searchValue: '',
      addTruckingOrderData: {
        // 新建派车单数据
        orderNumber: '',
        vehicleTime: '',
        licensePlate: '',
        carUser: '',
        driver: '',
        destination: '',
        vehicleReason: ''
      },
      editTruckingOrderData: {
        // 编辑派车单数据
        orderNumber: '',
        vehicleTime: '',
        licensePlate: '',
        carUser: '',
        driver: '',
        destination: '',
        vehicleReason: ''
      },
      returnRegistrationData: {
        // 回车数据登记
        orderNumber: '',
        licensePlate: '',
        carUser: '',
        vehicleTime: '',
        enterTime: '',
        initialMileage: '',
        returnMileage: '',
        remarks: '',
        id: ''
      },
      rules: {
        // 必填项的验证
        vehicleTime: [
          // 用车时间非空验证
          {
            required: true,
            type: 'date',
            message: '请选择用车日期',
            trigger: 'blur'
          }
        ],
        carUser: [
          // 用车人非空验证
          {
            required: true,
            message: '请填写用车人',
            trigger: 'blur'
          }
        ],
        driver: [
          // 驾驶员非空验证
          {
            required: true,
            message: '请填写驾驶员',
            trigger: 'blur'
          }
        ],
        destination: [
          //目的地非空验证
          {
            required: true,
            message: '请填写目的地',
            trigger: 'blur'
          }
        ],
        vehicleReason: [
          //用车原因非空验证
          {
            required: true,
            message: '请填写用车原因',
            trigger: 'blur'
          }
        ],
        enterTime: [
          {
            required: true,
            type: 'date',
            message: '请选择回车日期',
            trigger: 'change'
          }
        ]
      },
      searchKeyword: '', // 收搜关键值
      tableData: [],
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示多少条
      totalElements: 0, // 初始化信息总条数
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {

          type: "index",
          width: 50,
          align: "center",
          fixed: "left"
        },
        {
          title: '单号',
          key: 'billNumber',
          width: 150,
          fixed: 'left'
        },
        {
          title: '车牌号码',
          key: 'vehicleNumber',
          fixed: 'left',
          width: 100
        },
        {
          title: '登记日期',
          key: "gmtCreate",
          width: 120,
        },
        {
          title: '用车日期',
          width: 120,
          key: "useDate"
        },
        {
          title: '回车日期',
          key: 'backDate',
          width: 120,
        },
        {
          title: '用车人',
          width: 80,
          key: 'userName'
        },
        {
          title: '派车人',
          width: 80,
          key: 'sender'
        },
        {
          title: '驾驶员',
          width: 80,
          key: 'driver'
        },
        {
          title: '目的地',
          key: 'destination',
            tooltip:true,
          width: 150
        },
        {
          title: '用车原因',

            tooltip:true,
          key: 'purpose',
          width: 200
        },

        {
          title: '初始里程',
          key: 'startMileage',
          width: 150
        },
        {
          title: '回车里程',
          key: 'endMileage',
          width: 150
        },
        {
          title: '备注',
            tooltip:true,
          key: 'remark',
          width: 200
        },
        {
          title: '操作',
          width: 130,
          fixed: 'right',
          key: 'handle',
          render: (h, params, vm) => {
            return [
              [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.echoData(params.index);

                      }
                    },
                    style: {
                      marginRight: '5px'
                    }
                  },
                  '编辑'
                )
              ],
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
                      this.deleteTruckingOrder(params.index);
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
      ],


    //   -------加油登记
            isAddModal2: false,
            isEditModal2: false,
            searchValue2: '',                         // 收搜数据
            vehicleRefuelingData: {                     // 新增加油信息数据
                vehicleName: '',                     // 车辆名称
                refuelingDate: '',                   // 加油日期
                oilNo: '',                           // 油号
                cost: '',                           // 费用
                operator: '',                       // 经办人
                recordDate: ''                     // 登记日期
            },
            editVehicleRefuelingData: {            // 编辑加油信息数据
                vehicleName: '',                 // 车辆名称
                refuelingDate: '',                // 加油日期
                oilNo: '',                        // 油号
                cost: '',                         // 费用
                operator: '',                     // 经办人
                recordDate: ''                   // 登记日期
            },
            rules2: {                         // 必填项的验证
                refuelingDate: [
                    {
                        required: true,
                        type: 'date',
                        message: '请选择加油时间',
                        trigger: 'change'
                    }
                ],
                oilNo: [
                    {
                        required: true,
                        message: '请填写油号',
                        trigger: 'blur'
                    }
                ],
                cost: [                // 车辆名称非空验证
                    {
                        required: true,
                        message: '请填写费用',
                        trigger: 'blur'
                    },
                    {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
                ],
                operator: [
                    {
                        required: true,
                        message: '请填写经办人',
                        trigger: 'blur'
                    }
                ],
                recordDate: [
                    {
                        required: true,
                        type: 'date',
                        message: '请选择登记日期',
                        trigger: 'change'
                    }
                ]
            },
            tableData2: [],                    // 表格数据
            pageNum2: 1,                     // 当前页码
            pageSize2: 10,                  // 每页显示多少条
            totalElements2: 0,             // 初始化信息总条数
            columns2: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left',
                },
                {

                    type: 'index',
                    fixed: 'left',
                    width: 50,
                    align: 'center'
                },
                {
                    title: '车牌号码',
                    fixed: 'left',
                    width: 100,
                    key: 'vehicleNumber',
                },
                {
                    title: '加油日期',
                    width: 120,
                    key: 'gasDate',
                },
                {
                    title: '油号',
                    width: 80,
                    key: 'gasType',
                },
                {
                    title: '费用',
                    width: 150,
                    key: 'cost'
                },
                {
                    title: '经办人',
                    width: 80,
                    key: 'transactor'
                },
                {
                    title: '登记日期',
                    width: 120,
                    key: 'recordDate'
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 130,
                    key: 'handle',
                    render: (h, params, vm) => {
                        return [
                            [h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        this.echoData2(params.index)
                                    }
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, '编辑')],
                            h('Poptip', {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        title: '你确定要删除吗?',
                                        placement: 'left-end',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteRefueling(params.index)
                                        }
                                    }
                                },
                                [h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                }, '删除')])
                        ]
                    }
                }
            ],
        //----违章信息---
        isAddModal3: false,
        isEditModal3: false,
        searchValue3: '',                         // 收搜数据
        vehicleViolationData: {                 // 新增违章信息数据
            vehicleName: '',                      // 车牌号码
            violationDate: '',                    // 违章日期
            violationPlace: '',                   // 违章地点
            violationRules: '',                   // 违章细则
            fineAmount: '',                       // 罚款金额
            demeritScore: '',                     // 违章记分
            party: '',                            // 当事人
        },
        editVehicleViolationData: {            // 编辑违章信息数据
            vehicleName: '',                      // 车牌号码
            violationDate: '',                    // 违章日期
            violationPlace: '',                   // 违章地点
            violationRules: '',                   // 违章细则
            fineAmount: '',                       // 罚款金额
            demeritScore: '',                     // 违章记分
            party: '',                            // 当事人
            id: '',
        },
        rules3: {                         // 必填项的验证
            violationDate: [
                {
                    required: true,
                    type: 'date',
                    message: '请选择违章日期',
                    trigger: 'change'
                }
            ],
            violationPlace: [
                {
                    required: true,
                    message: '请填写违章地点',
                    trigger: 'blur'
                }
            ],
            violationRules: [
                {
                    required: true,
                    message: '请填写违章细则',
                    trigger: 'blur'
                }
            ],
            fineAmount: [{
                required: true,
                message: '请填写罚款金额',
                trigger: 'blur'
            },
                {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
            ],
            demeritScore: [{
                required: true,
                message: '请填写违章记分',
                trigger: 'blur'
            },
                {
                    type: 'string',
                    pattern: /^\d+$/, message: '请输入数字',
                    trigger: 'blur'
                }
            ],
            party: [{
                required: true,
                message: '请填写当事人',
                trigger: 'blur'
            }]
        },
        tableData3: [],                    // 表格数据
        pageNum3: 1,                     // 当前页码
        pageSize3: 10,                  // 每页显示多少条
        totalElements3: 0,             // 初始化信息总条数
        columns3: [
            {
                type: 'selection',
                width: 60,
                align: 'center',
                fixed: 'left',
            },
            {
                type: 'index',
                fixed: 'left',
                width: 50,
                align: 'center'
            },
            {
                title: '车牌号码',
                tooltip:true,
                fixed: 'left',
                width: 100,
                key: 'vehicleNumber',
            },
            {
                title: '违章日期',
                width: 120,
                key: 'penaltyDate',
            },
            {
                title: '违章地点',
                tooltip:true,
                width: 200,
                key: 'penaltyPlace',
            },
            {
                title: '违章细则',
                tooltip:true,
                width: 300,
                key: 'penaltyDetail'
            },
            {
                title: '罚款金额',
                width: 100,
                key: 'penaltyAmount'
            },
            {
                title: '违章记分',
                width: 100,
                key: 'penaltyScore'
            },
            {
                title: '当事人',
                width: 80,
                key: 'penaltyPerson'
            },
            {
                title: '操作',
                fixed: 'right',
                width: 130,
                key: 'handle',
                render: (h, params, vm) => {
                    return [
                        [h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                            on: {
                                'click': () => {
                                    this.echoData3(params.index)
                                }
                            },
                            style: {
                                marginRight: '5px'
                            }
                        }, '编辑')],
                        h('Poptip', {
                                props: {
                                    confirm: true,
                                    transfer: true,
                                    title: '你确定要删除吗?',
                                    placement: 'left-end',
                                    size: 'small'
                                },
                                on: {
                                    'on-ok': () => {
                                        this.deleteViolation(params.index)
                                    }
                                }
                            },
                            [h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                            }, '删除')])
                    ]
                }
            }
        ],
        //------维护保养

            isAddModal4:false,
            isEditModal4:false,
            searchValue4:'',                         //收搜数据
            maintenanceData:{                    //新增维护保养信息数据
                vehicleName:'',                      //车牌号码
                maintenanceDate:'',                  //维保日期
                maintenanceSite:'',                 //维保地点
                operator:'',                        //经办人
                maintenanceProject:'',              //维保项目
                maintenanceCost:'',                //维保费用

            },
            editMaintenanceData:{              //编辑维护保养信息数据
                vehicleName:'',                      //车牌号码
                maintenanceDate:'',                  //维保日期
                maintenanceSite:'',                 //维保地点
                operator:'',                        //经办人
                maintenanceProject:'',              //维保项目
                maintenanceCost:'',                //维保费用
                id:''
            },
            rules4:{                         //必填项的验证
                maintenanceDate:[
                    {
                        type:'date',
                        required: true,
                        message: '请选择维保日期',
                        trigger: 'change'
                    }
                ],
                maintenanceSite:[
                    {
                        required: true,
                        message: '请填写维保地点',
                        trigger: 'blur'
                    }
                ],
                operator: [
                    { required: true,
                        message: '请填写经办人',
                        trigger: 'blur'
                    }
                ],
                maintenanceProject:[{
                    required: true,
                    message: '请填写维保项目',
                    trigger: 'blur'
                }],
                maintenanceCost:[
                    {
                        required: true,
                        message: '请填写维保费用',
                        trigger: 'blur'
                    },
                    {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
                ],
            },
            tableData4:[],                    // 表格数据
            pageNum4: 1,                     // 当前页码
            pageSize4: 10,                  // 每页显示多少条
            totalElements4: 0,             // 初始化信息总条数
            columns4:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left',
                },
                {
                    type: 'index',
                    fixed: 'left',
                    width: 50,
                    align: 'center'
                },
                {
                    title:'车牌号码',
                    fixed: 'left',
                    width: 100,
                    key:'vehicleNumber',
                },
                {
                    title:'维保日期',
                    width: 120,
                    key:'maintenanceDate',
                },
                {
                    title:'维保地点',
                    width: 200,
                    tooltip:true,
                    key:'maintenancePlace',
                },
                {
                    title:'经办人',
                    width: 80,
                    key:'transactor'
                },
                {
                    title:'维保项目',
                    width: 300,
                    tooltip:true,
                    key:'maintenanceItem'
                },
                {
                    title:'维保费用',
                    width: 150,
                    key:'maintenanceCost'
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 130,
                    key: 'handle',
                    render: (h, params, vm) => {
                        return [
                            [h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        this.echoData4(params.index)
                                    }
                                },
                                style:{
                                    marginRight:'5px'
                                }
                            },"编辑")],
                            h('Poptip', {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        title: '你确定要删除吗?',
                                        placement: 'left-end',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteMaintenance(params.index)
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
                    }
                }
            ],

        //-----------保险登记-------

            isAddModal5: false,
            isEditModal5: false,
            searchValue5: '',                  // 收搜数据
            insuranceData: {                 // 保险登记信息数据
                vehicleName: '',               // 车牌号码
                dated: '',                     // 保险日期
                insurer: '',                  // 保险公司
                operator: '',                 // 经办人
                coverage: '',                // 保险项目
                insuranceCharges: '',        // 保险费用

            },
            editInsuranceData: {              // 编辑保险登记信息数据
                vehicleName: '',               // 车牌号码
                dated: '',                     // 保险日期
                insurer: '',                  // 保险公司
                operator: '',                 // 经办人
                coverage: '',                // 保险项目
                insuranceCharges: '',        // 保险费用
                id: ''
            },
            rules5: {                         // 必填项的验证
                dated: [
                    {
                        type: 'date',
                        required: true,
                        message: '请选择保险日期',
                        trigger: 'change'
                    }
                ],
                insurer: [
                    {
                        required: true,
                        message: '请填写保险公司',
                        trigger: 'blur'
                    }
                ],
                operator: [
                    {
                        required: true,
                        message: '请填写经办人',
                        trigger: 'blur'
                    }
                ],
                coverage: [{
                    required: true,
                    message: '请填写保险项目',
                    trigger: 'blur'
                }],
                insuranceCharges: [
                    {
                        required: true,
                        message: '请填写保险费用',
                        trigger: 'blur'
                    },
                    {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
                ],
            },
            tableData5: [],                    // 表格数据
            pageNum5: 1,                     // 当前页码
            pageSize5: 10,                  // 每页显示多少条
            totalElements5: 0,             // 初始化信息总条数
            columns5: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left',
                },
                {
                    type: 'index',
                    fixed: 'left',
                    width: 50,
                    align: 'center'
                },
                {
                    title: '车牌号码',
                    fixed: 'left',
                    width: 100,
                    key: 'vehicleNumber',
                },
                {
                    title: '保险日期',
                    width: 120,
                    key: 'insuranceDate',
                },
                {
                    title: '保险公司',
                    tooltip:true,
                    width: 200,
                    key: 'insuranceCompany',
                },
                {
                    title: '经办人',
                    width: 80,
                    key: 'transactor'
                },
                {
                    title: '保险项目',
                    tooltip:true,
                    width: 300,
                    key: 'insuranceItem'
                },
                {
                    title: '保险费用',
                    width: 150,
                    key: 'insuranceCost'
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 130,
                    key: 'handle',
                    render: (h, params, vm) => {
                        return [
                            [h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        this.echoData5(params.index)

                                    }
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, '编辑')],
                            h('Poptip', {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        title: '你确定要删除吗?',
                                        placement: 'left-end',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteInsurance(params.index)
                                        }
                                    }
                                },
                                [h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                }, '删除')])
                        ]
                    }
                }
            ],
        //---------年检记录

            isAddModal6: false,
            isEditModal6: false,

            searchValue6: '',                         // 收搜数据
            annualData: {                      // 年检登记信息数据
                vehicleName: '',                // 车牌号码
                annualInspectionDate: '',      // 年检日期
                vehicleInspectionPlace: '',   // 检车地点
                operator: '',                // 经办人
                inspectionCost: '',         // 检车费用
                remarks: '',               // 备注

            },
            editAnnualData: {              // 编辑年检登记信息数据
                vehicleName: '',                // 车牌号码
                annualInspectionDate: '',      // 年检日期
                vehicleInspectionPlace: '',   // 检车地点
                operator: '',                // 经办人
                inspectionCost: '',         // 检车费用
                remarks: '',               // 备注
                id: ''
            },
            rules6: {                         // 必填项的验证
                annualInspectionDate: [
                    {
                        type: 'date',
                        required: true,
                        message: '请选择年检日期',
                        trigger: 'change'
                    }
                ],
                vehicleInspectionPlace: [
                    {
                        required: true,
                        message: '请填写检车地点',
                        trigger: 'blur'
                    }
                ],
                operator: [
                    {
                        required: true,
                        message: '请填写经办人',
                        trigger: 'blur'
                    }
                ],
                inspectionCost: [
                    {
                        required: true,
                        message: '请填写检车费用',
                        trigger: 'blur'
                    },
                    {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
                ],
            },
            tableData6: [],                    // 表格数据
            pageNum6: 1,                     // 当前页码
            pageSize6: 10,                  // 每页显示多少条
            totalElements6: 0,             // 初始化信息总条数
            columns6: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left',
                },
                {
                    type: 'index',
                    fixed: 'left',
                    width: 50,
                    align: 'center'
                },
                {
                    title: '车牌号码',
                    width: 100,
                    fixed: 'left',
                    key: 'vehicleNumber',
                },
                {
                    title: '年检日期',
                    width: 120,
                    key: 'inspectionDate',
                },
                {
                    title: '检车地点',
                    tooltip:true,
                    width: 300,
                    key: 'inspectionPlace',
                },
                {
                    title: '经办人',
                    width: 80,
                    key: 'transactor'
                },
                {
                    title: '检车费用',
                    width: 150,
                    key: 'inspectionCost'
                },
                {
                    title: '备注',
                    width: 300,
                    tooltip:true,
                    key: 'remark'
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 130,
                    key: 'handle',
                    render: (h, params, vm) => {
                        return [
                            [h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        this.echoData6(params.index)
                                    }
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, '编辑')],
                            h('Poptip', {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        title: '你确定要删除吗?',
                                        placement: 'left-end',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteAnnual(params.index)
                                        }
                                    }
                                },
                                [h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                }, '删除')])
                        ]
                    }
                }
            ],
        //--------其他费用-----
            isAddModal7: false,
            isEditModal7: false,
            searchValue7: '',                         //收搜数据
            otherChargesData: {
                vehicleName: '',
                vehicleName1:'',
                costDate: '',
                money: '',
                operator: '',
                expenseItem: '',
                remarks: '',
            },
            editOtherCharges: {
                vehicleName: '',
                costDate: '',
                money: '',
                operator: '',
                expenseItem: '',
                remarks: '',
                id: ''
            },
            rules7: {                         //必填项的验证
                costDate: [
                    {
                        type: 'date',
                        required: true,
                        message: '请选择费用日期',
                        trigger: 'change'
                    }
                ],
                money: [
                    {
                        required: true,
                        message: '请填写金额',
                        trigger: 'blur'
                    },
                    {type: 'string', pattern: /^(([1-9]\d{0,12})|0)(\.\d{0,2})?$/, message: '请输入正确的金额', trigger: 'blur'}
                ],
                operator: [
                    {
                        required: true,
                        message: '请填写经办人',
                        trigger: 'blur'
                    }
                ],
                expenseItem: [{
                    required: true,
                    message: '请填写费用项目',
                    trigger: 'blur'
                }],
            },
            tableData7: [],                    // 表格数据
            pageNum7: 1,                     // 当前页码
            pageSize7: 10,                  // 每页显示多少条
            totalElements7: 0,             // 初始化信息总条数
            columns7: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left',
                },
                {

                    type: 'index',
                    fixed: 'left',
                    width: 50,
                    align: 'center'
                },
                {
                    title: '车牌号码',
                    fixed: 'left',
                    width: 100,
                    key: 'vehicleNumber',
                },
                {
                    title: '费用日期',
                    width: 120,
                    key: 'costDate',
                },
                {
                    title: '金额',
                    width: 150,
                    key: 'costAmount',
                },
                {
                    title: '经办人',
                    width: 80,
                    key: 'transactor'
                },
                {
                    title: '费用项目',
                    width: 100,
                    tooltip:true,
                    key: 'costItem'
                },
                {
                    title: '备注',
                    tooltip:true,
                    width: 300,
                    key: 'remark'
                },
                {
                    title: '操作',
                    fixed: 'right',
                    width: 130,
                    key: 'handle',
                    render: (h, params, vm) => {
                        return [
                            [h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        this.echoData7(params.index)

                                    }
                                },
                                style: {
                                    marginRight: '5px'
                                }
                            }, '编辑')],
                            h('Poptip', {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        title: '你确定要删除吗?',
                                        placement: 'left-end',
                                        size: 'small'
                                    },
                                    on: {
                                        'on-ok': () => {
                                            this.deleteOtherCharges(params.index)
                                        }
                                    }
                                },
                                [h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                }, '删除')])
                        ]
                    }
                }
            ],

        }

  },
  methods: {
      handleClick(name){

          console.log(name)
          if(name==='JY'){
              this.getAllData2(this.pageNum2)
          }else  if(name==='WZ'){
              this.getAllData3(this.pageNum3)
          }else  if(name==='WH'){
              this.getAllData4(this.pageNum4)
          }else if(name==='BX'){
              this.getAllData5(this.pageNum5)
          }else if(name==='NJ'){
              this.getAllData6(this.pageNum6)
          }else if(name==='QT'){
              this.getAllData7(this.pageNum7)
          }
      },

    //  --------派车回车

    /**
     * 点击新建按钮
     * 打开弹框，获取派车单号
     * */
    clickNewButton() {
      this.isAddModal = true
      getOrderNumber(JSON.parse(localStorage.getItem('projectId')).id).then(
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
              this.addTruckingOrderData.orderNumber = data.msgData
              break
          }
        }
      );

    },
    /**
     * 分页
     * */
    changePage(index) {
      this.pageNum = index
      this.getAllData(this.pageNum)
    },
    /**
     *  新建派车单
     * */
    addTruckingOrder() {
      this.$refs.addTruckingOrderData.validate(valid => {
        if (valid) {
          let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
          if (this.vehicleNumbers && reg.test(this.vehicleNumbers)) {
            const data = {
              billNumber: this.addTruckingOrderData.orderNumber,
              useDate: formatTime(this.addTruckingOrderData.vehicleTime),
              vehicleNumber: this.vehicleNumbers,
              userName: this.addTruckingOrderData.carUser,
              driver: this.addTruckingOrderData.driver,
              destination: this.addTruckingOrderData.destination,
              purpose: this.addTruckingOrderData.vehicleReason,
              projectId: JSON.parse(localStorage.getItem('projectId')).id
            }
            newTruckingOrderData(data).then(res => {
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
                  this.getAllData(this.pageNum)    // 拉一次数据
                  this.cancel(1)
                  this.$Message.success(data.msgContent)
                  break
              }
            })
          } else {
            this.$Message.error('填写正确车牌号码');
          }
        }
      });
    },
    /**
     *关闭弹框
     * status等于1为新建框的关闭
     */
    cancel(status) {
      if (status === 1) {
        this.$refs.addTruckingOrderData.resetFields() // 清空
        this.isAddModal = false
      } else if (status === 2) {
        this.$refs.returnRegistrationData.resetFields()
        this.isReturnMode = false
      } else {
        this.$refs.editTruckingOrderData.resetFields() // 清空
        this.isEditModal = false
      }
    },
    /**
     * 收搜派车单
     */
    searchTruckingOrder() {
      this.pageNum = 1
      this.getAllData(this.pageNum)
    },
    /**
     * 获取全部数据
     * */
    getAllData(pageNum) {
      getAllTruckingOrderData(
        JSON.parse(localStorage.getItem('projectId')).id,
        this.vehicleNumbers,
        pageNum,
        this.pageSize,
        this.searchValue
      ).then(res => {
        const data = res.data
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error("服务器繁忙请稍后")
            break
          case 2:
            this.$Message.error(data.msgContent)
            break
          default:
            console.log(data.msgData.content)
            this.tableData = data.msgData.content
            this.totalElements = data.msgData.totalElements
            break
        }
      })
    },
    /**
     * 删除派车单号
     * */
    deleteTruckingOrder(index) {
      deleteTruckingOrderData(this.tableData[index].id).then(res => {
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
            this.tableData.splice(index, 1)
            this.getAllData(this.pageNum)
            this.$Message.success(data.msgContent)
            break
        }
      })
    },
    /**
     * 编辑派车单号
     * */
    editVTruckingOrder() {
      if (paramsValidate(this.editTruckingOrderData)) {
        const data = {
          billNumber: this.editTruckingOrderData.orderNumber,
          useDate: formatTime(this.editTruckingOrderData.vehicleTime),
          vehicleNumber: this.editTruckingOrderData.licensePlate,
          userName: this.editTruckingOrderData.carUser,
          driver: this.editTruckingOrderData.driver,
          destination: this.editTruckingOrderData.destination,
          purpose: this.editTruckingOrderData.vehicleReason,
          id: this.editTruckingOrderData.id
        };
        getEditTruckingOrderData(data).then(res => {
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
              this.getAllData(this.pageNum)
              this.cancel()
              this.$Message.success(data.msgContent)
              break
          }
        })
      }
    },
    /**
     * 编辑数据回显
     * */
    echoData(index) {
      this.isEditModal = true
      this.editTruckingOrderData.orderNumber = this.tableData[index].billNumber
      this.editTruckingOrderData.vehicleTime = this.tableData[index].useDate
      this.editTruckingOrderData.licensePlate = this.tableData[index].vehicleNumber
      this.editTruckingOrderData.carUser = this.tableData[index].userName
      this.editTruckingOrderData.driver = this.tableData[index].driver
      this.editTruckingOrderData.destination = this.tableData[index].destination
      this.editTruckingOrderData.vehicleReason = this.tableData[index].purpose
      this.editTruckingOrderData.id = this.tableData[index].id
    },
    /**
     * 点击回车登记
     * */
    returnRegistration() {
      let selectedTableData = this.$refs.tables.getSelection()
      console.log(selectedTableData)
      if (selectedTableData.length === 1) {
        this.isReturnMode = true
        this.returnRegistrationData.orderNumber = selectedTableData[0].billNumber
        this.returnRegistrationData.licensePlate = selectedTableData[0].vehicleNumber
        this.returnRegistrationData.carUser = selectedTableData[0].userName
        this.returnRegistrationData.vehicleTime = selectedTableData[0].useDate
        this.returnRegistrationData.id = selectedTableData[0].id
      } else {
        this.$Message.error('请选择一个派车单进行登记')
      }
    },
    // 添加回车
    addReturnRegistration() {
      this.$refs.returnRegistrationData.validate(valid => {
        if (valid) {
          const data = {
            id: this.returnRegistrationData.id,
            backDate: formatTime(this.returnRegistrationData.enterTime),
            startMileage: this.returnRegistrationData.initialMileage,
            endMileage: this.returnRegistrationData.returnMileage,
            remark: this.returnRegistrationData.remarks,
            projectId: JSON.parse(localStorage.getItem('projectId')).id
          }
          getReturnRegistrationData(data).then(res => {
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
                this.getAllData(this.pageNum) // 拉一次数据
                this.cancel(2)
                this.$Message.success(data.msgContent)
                break
            }
          })
        }
      })
    },
    // 过滤车牌
    filterMethod(value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },

      //---加油登记---------
      // 点击新建加油按钮
      newRefueling() {
          this.isAddModal2 = true

      },
      /**
       * 分页
       * */
      changePage2(index) {
          this.pageNum2 = index
          this.getAllData2(this.pageNum2)
      },
      /**
       *关闭弹框
       * status等于1为新建框的关闭
       */
      cancel2(status) {
          if (status === 1) {
              this.$refs.vehicleRefuelingData.resetFields()  // 清空
              this.isAddModal2 = false
          } else {
              this.$refs.editVehicleRefuelingData.resetFields()  // 清空
              this.isEditModal2 = false
          }
      },
      /**
       * 添加加油信息
       *1：valid 判断必填项
       * 2：isDataSuccess 判断数据
       */
      addRefueling() {
          this.$refs.vehicleRefuelingData.validate((valid) => {
              if (valid) {
                  let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                  if (this.vehicleNumbers && reg.test(this.vehicleNumbers)) {
                      const data = {
                          'vehicleNumber': this.vehicleNumbers,
                          'gasDate': formatTime(this.vehicleRefuelingData.refuelingDate),
                          'gasType': this.vehicleRefuelingData.oilNo,
                          'cost': this.vehicleRefuelingData.cost,
                          'transactor': this.vehicleRefuelingData.operator,
                          'recordDate': formatTime(this.vehicleRefuelingData.recordDate),
                          'projectId': JSON.parse(localStorage.getItem('projectId')).id,
                      }
                      newVehicleRefuelingData(data).then(res => {
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
                                  this.getAllData2(this.pageNum2)
                                  this.cancel2(1)
                                  this.$Message.success(data.msgContent)
                                  break
                          }
                      })
                  } else {
                      this.$Message.error('填写正确车牌号码')
                  }

              }
          })
      },
      /**
       * 收搜加油信息
       * */
      searchRefueling() {
          this.pageNum2 = 1
          this.getAllData2(this.pageNum2)
      },
      /**
       * 获取全部数据
       * */
      getAllData2(pageNum2) {
          getAllVehicleRefuelingData(
            JSON.parse(localStorage.getItem('projectId')).id,
            this.vehicleNumbers, pageNum2, this.pageSize2, this.searchValue2).then(res => {
                  console.log(res)
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
                          this.tableData2 = data.msgData.content
                          this.totalElements2 = data.msgData.totalElements
                          break
                  }
              }
          )
      },
      /**
       * 删除加油
       * */
      deleteRefueling(index) {
          deleteVehicleRefuelingData(this.tableData2[index].id).then(res => {
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
                      this.tableData2.splice(index, 1)
                      this.getAllData2(this.pageNum2)
                      this.$Message.success(data.msgContent)
                      break
              }
          })
      },
      /**
       * 编辑加油数据
       * */
      editRefueling() {
          if (this.editVehicleRefuelingData.vehicleName) {
              if (paramsValidate(this.editVehicleRefuelingData)) {
                  const data = {
                      'vehicleNumber': this.editVehicleRefuelingData.vehicleName,
                      'gasDate': formatTime(this.editVehicleRefuelingData.refuelingDate),
                      'gasType': this.editVehicleRefuelingData.oilNo,
                      'cost': this.editVehicleRefuelingData.cost,
                      'transactor': this.editVehicleRefuelingData.operator,
                      'recordDate': formatTime(this.editVehicleRefuelingData.recordDate)
                  }
                  getEditVehicleRefuelingData(data, this.editVehicleRefuelingData.id).then(res => {
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
                              this.getAllData2(this.pageNum2)
                              this.cancel2()
                              this.$Message.success(data.msgContent)
                              break
                      }
                  })
              }
          } else {
              this.$Message.error('请输入车牌号码')
          }

      },
      /**
       * 编辑数据回显
       **/
      echoData2(index) {
          this.isEditModal2 = true
          this.editVehicleRefuelingData.vehicleName = this.tableData2[index].vehicleNumber
          this.editVehicleRefuelingData.refuelingDate = this.tableData2[index].gasDate
          this.editVehicleRefuelingData.oilNo = this.tableData2[index].gasType
          this.editVehicleRefuelingData.cost = this.tableData2[index].cost
          this.editVehicleRefuelingData.operator = this.tableData2[index].transactor
          this.editVehicleRefuelingData.recordDate = this.tableData2[index].recordDate
          this.editVehicleRefuelingData.id = this.tableData2[index].id
      },
  //    ---------------违章登记-----------
      NewRegulations() {
          this.isAddModal3 = true

      },

      /**
       * 分页
       * */
      changePage3(index) {
          this.pageNum3 = index
          this.getAllData3(this.pageNum3)
      },
      /**
       *关闭弹框
       * status等于1为新建框的关闭
       */
      cancel3(status) {
          if (status === 1) {
              this.$refs.vehicleViolationData.resetFields()  //清空
              this.isAddModal3 = false
          } else {
              this.$refs.editVehicleViolationData.resetFields()  //清空
              this.isEditModal3 = false
          }
      },
      /**
       * 添加违章信息
       *1：valid 判断必填项
       * 2：isDataSuccess 判断数据
       */
      addViolation() {
          this.$refs.vehicleViolationData.validate((valid) => {
              if (valid) {
                  let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                  if (this.vehicleNumbers && reg.test(this.vehicleNumbers)) {
                      const data = {
                          'vehicleNumber': this.vehicleNumbers,
                          'penaltyDate': formatTime(this.vehicleViolationData.violationDate),
                          'penaltyPlace': this.vehicleViolationData.violationPlace,
                          'penaltyDetail': this.vehicleViolationData.violationRules,
                          'penaltyAmount': this.vehicleViolationData.fineAmount,
                          'penaltyScore': this.vehicleViolationData.demeritScore,
                          'penaltyPerson': this.vehicleViolationData.party,
                          'projectId': JSON.parse(localStorage.getItem('projectId')).id,
                      }
                      newVehicleViolationData(data).then(res => {
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
                                  this.getAllData3(this.pageNum3)                           //拉一次数据
                                  this.cancel3(1)
                                  this.$Message.success(data.msgContent)
                                  break
                          }
                      })
                  } else {
                      this.$Message.error('填写正确车牌号码')
                  }

              }
          })
      },
      /**收搜违章信息
       * */
      searchViolation() {
          this.pageNum3 = 1
          this.getAllData3(this.pageNum3)
      },
      /**
       * 获取全部数据
       * */
      getAllData3(pageNum3) {
          getAllVehicleViolationData(
            JSON.parse(localStorage.getItem('projectId')).id,
            this.vehicleNumbers, pageNum3, this.pageSize3, this.searchValue3).then(res => {
                  console.log(res)
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
                          this.tableData3 = data.msgData.content
                          this.totalElements3 = data.msgData.totalElements
                          break
                  }
              }
          )
      },
      /**
       * 删除违章
       * */
      deleteViolation(index) {
          deleteVehicleViolationData(this.tableData3[index].id).then(res => {
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
                      this.tableData3.splice(index, 1)
                      this.getAllData3(this.pageNum3)
                      this.$Message.success(data.msgContent)
                      break
              }
          })
      },
      /**编辑违章数据
       * */
      editViolation() {
          if (paramsValidate(this.editVehicleViolationData)) {
              const data = {
                  'vehicleNumber': this.editVehicleViolationData.vehicleName,
                  'penaltyDate': formatTime(this.editVehicleViolationData.violationDate),
                  'penaltyPlace': this.editVehicleViolationData.violationPlace,
                  'penaltyDetail': this.editVehicleViolationData.violationRules,
                  'penaltyAmount': this.editVehicleViolationData.fineAmount,
                  'penaltyScore': this.editVehicleViolationData.demeritScore,
                  'penaltyPerson': this.editVehicleViolationData.party
              }
              getEditVehicleViolationData(data, this.editVehicleViolationData.id).then(res => {
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
                          this.getAllData3(this.pageNum3)
                          this.cancel3()
                          this.$Message.success(data.msgContent)
                          break
                  }
              })
          }
      },
      /**
       * 编辑数据回显
       **/
      echoData3(index) {
          this.isEditModal3 = true
          this.editVehicleViolationData.vehicleName = this.tableData3[index].vehicleNumber
          this.editVehicleViolationData.violationDate = this.tableData3[index].penaltyDate
          this.editVehicleViolationData.violationPlace = this.tableData3[index].penaltyPlace
          this.editVehicleViolationData.violationRules = this.tableData3[index].penaltyDetail
          this.editVehicleViolationData.fineAmount = this.tableData3[index].penaltyAmount
          this.editVehicleViolationData.demeritScore = this.tableData3[index].penaltyScore
          this.editVehicleViolationData.party = this.tableData3[index].penaltyPerson
          this.editVehicleViolationData.id = this.tableData3[index].id
      },

  //    -------维护保养

      newMaintenanceClick(){
          this.isAddModal4=true
      },

      /**
       * 分页
       * */
      changePage4(index){
          this.pageNum4 = index
          this.getAllData4(this.pageNum4)
      },
      /**
       *关闭弹框
       * status等于1为新建框的关闭
       */
      cancel4(status){
          if(status===1){
              this.$refs.maintenanceData.resetFields()  //清空
              this.isAddModal4 = false
          }else {
              this.$refs.editMaintenanceData.resetFields()  //清空
              this.isEditModal4 = false
          }
      },
      /**添加维修保养信息
       *1：valid 判断必填项
       * 2：isDataSuccess 判断数据
       */
      addMaintenance(){
          this.$refs.maintenanceData.validate((valid)=>{
              if(valid){
                  let reg=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                  if(this.vehicleNumbers&&reg.test(this.vehicleNumbers)){
                      const data={
                          "vehicleNumber":this.vehicleNumbers,
                          "maintenanceDate":formatTime(this.maintenanceData.maintenanceDate),
                          "maintenancePlace":this.maintenanceData.maintenanceSite,
                          "transactor":this.maintenanceData.operator,
                          "maintenanceItem":this.maintenanceData.maintenanceProject,
                          "maintenanceCost":this.maintenanceData.maintenanceCost,
                          "projectId":JSON.parse(localStorage.getItem("projectId")).id
                      }
                      newMaintenanceData(data).then(res=>{
                          const data=res.data
                          let status= isDataSuccess(res)
                          switch (status) {
                              case 1:
                                  this.$Message.error("服务器繁忙请稍后")
                                  break
                              case 2:
                                  this.$Message.error(data.msgContent)
                                  break
                              default:
                                  this.getAllData4(this.pageNum4)                           //拉一次数据
                                  this.cancel4(1)
                                  this.$Message.success(data.msgContent)
                                  break
                          }
                      })
                  }else {
                      this.$Message.error("填写正确车牌号码")
                  }

              }
          })
      },
      /**收搜维护保养信息
       * */
      searchMaintenance(){
          this.pageNum4=1
          this.getAllData4(this.pageNum4)
      },
      /**
       * 获取全部数据
       * */
      getAllData4(pageNum4){
          getAllMaintenanceData(
            JSON.parse(localStorage.getItem('projectId')).id,
            this.vehicleNumbers,pageNum4,this.pageSize4,this.searchValue4).then(res=>{
                  console.log(res)
                  const data=res.data
                  let  status= isDataSuccess(res)
                  switch (status) {
                      case 1:
                          this.$Message.error("服务器繁忙请稍后")
                          break
                      case 2:
                          this.$Message.error(data.msgContent)
                          break
                      default:
                          this.tableData4 =data.msgData.content
                          this.totalElements4 = data.msgData.totalElements
                          break
                  }
              }
          )
      },
      /**
       * 删除维护保养
       * */
      deleteMaintenance (index){
          deleteMaintenanceData(this.tableData4[index].id).then(res=>{
              const data=res.data
              let  status= isDataSuccess(res)
              switch (status) {
                  case 1:
                      this.$Message.error("服务器繁忙请稍后")
                      break
                  case 2:
                      this.$Message.error(data.msgContent)
                      break
                  default:
                      this.tableData4.splice(index, 1)
                      this.getAllData4(this.pageNum4)
                      this.$Message.success(data.msgContent)
                      break
              }
          })
      },
      /**编辑维护保养数据
       * */
      editMaintenance (){
          if(paramsValidate(this.editMaintenanceData)){
              const data={
                  "vehicleNumber":this.editMaintenanceData.vehicleName,
                  "maintenanceDate":formatTime(this.editMaintenanceData.maintenanceDate),
                  "maintenancePlace":this.editMaintenanceData.maintenanceSite,
                  "transactor":this.editMaintenanceData.operator,
                  "maintenanceItem":this.editMaintenanceData.maintenanceProject,
                  "maintenanceCost":this.editMaintenanceData.maintenanceCost
              }
              getEditMaintenanceData(data,this.editMaintenanceData.id).then(res=>{
                  const data=res.data
                  let  status= isDataSuccess(res)
                  switch (status) {
                      case 1:
                          this.$Message.error("服务器繁忙请稍后")
                          break
                      case 2:
                          this.$Message.error(data.msgContent)
                          break
                      default:
                          this.getAllData4(this.pageNum4)
                          this.cancel4()
                          this.$Message.success(data.msgContent)
                          break
                  }
              })
          }
      },
      /**
       * 编辑数据回显
       **/
      echoData4(index){
          this.isEditModal4=true
          this.editMaintenanceData.vehicleName = this.tableData4[index].vehicleNumber
          this.editMaintenanceData.maintenanceDate = this.tableData4[index].maintenanceDate
          this.editMaintenanceData.maintenanceSite = this.tableData4[index].maintenancePlace
          this.editMaintenanceData.operator = this.tableData4[index].transactor
          this.editMaintenanceData.maintenanceProject = this.tableData4[index].maintenanceItem
          this.editMaintenanceData.maintenanceCost = this.tableData4[index].maintenanceCost
          this.editMaintenanceData.id = this.tableData4[index].id
      },
      //-----保险登记-------
      registrationClick() {
          this.isAddModal5 = true
      },
      changePage5(index) {
          this.pageNum5 = index
          this.getAllData5(this.pageNum5)
      },
      /**
       *关闭弹框
       * status等于1为新建框的关闭
       */
      cancel5(status) {
          if (status === 1) {
              this.$refs.insuranceData.resetFields()  // 清空
              this.isAddModal5 = false
          } else {
              this.$refs.editInsuranceData.resetFields()  // 清空
              this.isEditModal5 = false
          }
      },
      /**
       *1：valid 判断必填项
       * 2：isDataSuccess 判断数据
       */
      addInsurance() {
          this.$refs.insuranceData.validate((valid) => {
              if (valid) {
                  let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                  if (this.vehicleNumbers && reg.test(this.vehicleNumbers)) {
                      const data = {
                          'vehicleNumber': this.vehicleNumbers,
                          'insuranceDate': formatTime(this.insuranceData.dated),
                          'insuranceCompany': this.insuranceData.insurer,
                          'transactor': this.insuranceData.operator,
                          'insuranceItem': this.insuranceData.coverage,
                          'insuranceCost': this.insuranceData.insuranceCharges,
                          'projectId': JSON.parse(localStorage.getItem('projectId')).id
                      }
                      newInsuranceRegistrationData(data).then(res => {
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
                                  this.getAllData5(this.pageNum5)                           // 拉一次数据
                                  this.cancel5(1)
                                  this.$Message.success(data.msgContent)
                                  break
                          }
                      })
                  } else {
                      this.$Message.error('填写正确车牌号码')
                  }

              }
          })
      },
      /**收搜
       * */
      searchInsurance() {
          this.pageNum5 = 1
          this.getAllData5(this.pageNum5)
      },
      /**
       * 获取全部数据
       * */
      getAllData5(pageNum5) {
          getAllInsuranceRegistrationData(
            JSON.parse(localStorage.getItem('projectId')).id,
            this.vehicleNumbers, pageNum5, this.pageSize5, this.searchValue5).then(res => {
                  console.log(res)
                  console.log(res)
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
                          this.tableData5 = data.msgData.content
                          this.totalElements5 = data.msgData.totalElements
                          break
                  }
              }
          )
      },
      /**
       * 删除
       * */
      deleteInsurance(index) {
          deleteInsuranceRegistrationData(this.tableData5[index].id).then(res => {
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
                      this.tableData5.splice(index, 1)
                      this.getAllData5(this.pageNum5)
                      this.$Message.success(data.msgContent)
                      break
              }
          })
      },
      /**
       * 编辑数据
       * */
      editInsurance() {
          console.log(paramsValidate(this.editInsuranceData))
          if (paramsValidate(this.editInsuranceData)) {
              const data = {
                  'vehicleNumber': this.editInsuranceData.vehicleName,
                  'insuranceDate': formatTime(this.editInsuranceData.dated),
                  'insuranceCompany': this.editInsuranceData.insurer,
                  'transactor': this.editInsuranceData.operator,
                  'insuranceItem': this.editInsuranceData.coverage,
                  'insuranceCost': this.editInsuranceData.insuranceCharges
              }
              getEditInsuranceRegistrationData(data, this.editInsuranceData.id).then(res => {
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
                          this.getAllData5(this.pageNum5)
                          this.cancel5()
                          this.$Message.success(data.msgContent)
                          break
                  }
              })
          }
      },
      /**
       * 编辑数据回显
       **/
      echoData5(index) {
          this.isEditModal5 = true
          this.editInsuranceData.vehicleName = this.tableData5[index].vehicleNumber
          this.editInsuranceData.dated = this.tableData5[index].insuranceDate
          this.editInsuranceData.insurer = this.tableData5[index].insuranceCompany
          this.editInsuranceData.operator = this.tableData5[index].transactor
          this.editInsuranceData.coverage = this.tableData5[index].insuranceItem
          this.editInsuranceData.insuranceCharges = this.tableData5[index].insuranceCost
          this.editInsuranceData.id = this.tableData5[index].id
      },


  //    ----年检记录
      clickMOT () {
          this.isAddModal6 = true
      },
      /**
       * 分页
       * */
      changePage6 (index) {
          this.pageNum6 = index
          this.getAllData6(this.pageNum6)
      },
      /**
       *关闭弹框
       * status等于1为新建框的关闭
       */
      cancel6(status) {
          if (status === 1) {
              this.$refs.annualData.resetFields()  // 清空
              this.isAddModal6 = false
          } else {
              this.$refs.editAnnualData.resetFields()  // 清空
              this.isEditModal6 = false
          }
      },
      /**
       *1：valid 判断必填项
       * 2：isDataSuccess 判断数据
       */
      addAnnual () {
          this.$refs.annualData.validate((valid) => {
              if (valid) {
                  let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                  if (this.vehicleNumbers && reg.test(this.vehicleNumbers)) {
                      const data = {
                          'vehicleNumber': this.vehicleNumbers,
                          'inspectionDate': formatTime(this.annualData.annualInspectionDate),
                          'inspectionPlace': this.annualData.vehicleInspectionPlace,
                          'transactor': this.annualData.operator,
                          'inspectionCost': this.annualData.inspectionCost,
                          'remark': this.annualData.remarks,
                          'projectId': JSON.parse(localStorage.getItem('projectId')).id
                      }
                      newAnnualInspectionRegistrationData(data).then(res => {
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
                                  this.getAllData6(this.pageNum6)                           // 拉一次数据
                                  this.cancel6(1)
                                  this.$Message.success(data.msgContent)
                                  break
                          }
                      })
                  } else {
                      this.$Message.error('填写正确车牌号码')
                  }

              }
          })
      },
      /**收搜
       * */
      searchAnnual () {
          this.pageNum6 = 1
          this.getAllData6(this.pageNum6)
      },
      /**
       * 获取全部数据
       * */
      getAllData6 (pageNum6) {
          getAllAnnualInspectionRegistrationData(
            JSON.parse(localStorage.getItem('projectId')).id,this.vehicleNumbers, pageNum6, this.pageSize6, this.searchValue6).then(res => {
                  console.log(res)
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
                          this.tableData6 = data.msgData.content
                          this.totalElements6 = data.msgData.totalElements
                          break
                  }
              }
          )
      },
      /**
       * 删除
       * */
      deleteAnnual (index) {
          deleteAnnualInspectionRegistrationData(this.tableData6[index].id).then(res => {
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
                      this.tableData6.splice(index, 1)
                      this.getAllData6(this.pageNum6)
                      this.$Message.success(data.msgContent)
                      break
              }
          })
      },
      /**编辑数据
       * */
      editAnnual () {
          if (paramsValidate(this.editAnnualData)) {
              const data = {
                  'vehicleNumber': this.editAnnualData.vehicleName,
                  'inspectionDate': formatTime(this.editAnnualData.annualInspectionDate),
                  'inspectionPlace': this.editAnnualData.vehicleInspectionPlace,
                  'transactor': this.editAnnualData.operator,
                  'inspectionCost': this.editAnnualData.inspectionCost,
                  'remark': this.editAnnualData.remarks
              }
              getEditAnnualInspectionRegistrationData(data, this.editAnnualData.id).then(res => {
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
                          this.getAllData6(this.pageNum6)
                          this.cancel6()
                          this.$Message.success(data.msgContent)
                          break
                  }
              })
          }
      },
      /**
       * 编辑数据回显
       **/
      echoData6(index) {
          console.log(this.tableData6[index])
          this.isEditModal6 = true
          this.editAnnualData.vehicleName = this.tableData6[index].vehicleNumber
          this.editAnnualData.annualInspectionDate = this.tableData6[index].inspectionDate
          this.editAnnualData.vehicleInspectionPlace = this.tableData6[index].inspectionPlace
          this.editAnnualData.operator = this.tableData6[index].transactor
          this.editAnnualData.inspectionCost = this.tableData6[index].inspectionCost
          this.editAnnualData.remarks = this.tableData6[index].remark
          this.editAnnualData.id = this.tableData6[index].id
      },
  //    -------其他费用-------
      otherClick() {
          this.isAddModal7 = true

      },
      /**
       * 分页
       * */
      changePage7(index) {
          this.pageNum7 = index
          this.getAllData7(this.pageNum7)
      },
      /**
       *关闭弹框
       * status等于1为新建框的关闭
       */
      cancel7(status) {
          if (status === 1) {
              this.$refs.otherChargesData.resetFields()  //清空
              this.isAddModal7 = false
          } else {
              this.$refs.editOtherCharges.resetFields()  //清空
              this.isEditModal7 = false
          }
      },
      /**
       *1：valid 判断必填项
       * 2：isDataSuccess 判断数据
       */
      addOtherCharges() {
          this.$refs.otherChargesData.validate((valid) => {
              if (valid) {
                  let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                  if (this.vehicleNumbers && reg.test(this.vehicleNumbers)) {
                      const data = {
                          'vehicleNumber': this.vehicleNumbers,
                          'costDate': formatTime(this.otherChargesData.costDate),
                          'costAmount': this.otherChargesData.money,
                          'transactor': this.otherChargesData.operator,
                          'costItem': this.otherChargesData.expenseItem,
                          'remark': this.otherChargesData.remarks,
                          'projectId': JSON.parse(localStorage.getItem('projectId')).id
                      }
                      newOtherChargesData(data).then(res => {
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
                                  this.getAllData7(this.pageNum7)                           //拉一次数据
                                  this.cancel7(1)
                                  this.$Message.success(data.msgContent)
                                  break
                          }
                      })
                  } else {
                      this.$Message.error('填写正确车牌号码')
                  }

              }
          })
      },
      /**收搜
       * */
      searchOtherCharges () {
          this.pageNum7 = 1
          this.getAllData7(this.pageNum7)
      },
      /**
       * 获取全部数据
       * */
      getAllData7 (pageNum7) {
          getAllOtherChargesData(
            JSON.parse(localStorage.getItem('projectId')).id,this.vehicleNumbers, pageNum7, this.pageSize7, this.searchValue7).then(res => {
                  console.log(res)
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
                          this.tableData7 = data.msgData.content
                          this.totalElements7 = data.msgData.totalElements
                          break
                  }
              }
          )
      },
      /**
       * 删除
       * */
      deleteOtherCharges (index) {
          deleteOtherChargesData(this.tableData7[index].id).then(res => {
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
                      this.tableData7.splice(index, 1)
                      this.getAllData7(this.pageNum7)
                      this.$Message.success(data.msgContent)
                      break
              }
          })
      },
      /**
       * 编辑数据
       * */
      editOtherCharge () {
          if (paramsValidate(this.editOtherCharges)) {
              const data = {
                  'vehicleNumber': this.editOtherCharges.vehicleName,
                  'costDate': formatTime(this.editOtherCharges.costDate),
                  'costAmount': this.editOtherCharges.money,
                  'transactor': this.editOtherCharges.operator,
                  'costItem': this.editOtherCharges.expenseItem,
                  'remark': this.editOtherCharges.remarks
              }
              getEditOtherChargesData(data, this.editOtherCharges.id).then(res => {
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
                          this.getAllData7(this.pageNum7)
                          this.cancel7()
                          this.$Message.success(data.msgContent)
                          break
                  }
              })
          }
      },
      /**
       * 编辑数据回显
       **/
      echoData7 (index) {
          this.isEditModal7 = true
          this.editOtherCharges.vehicleName = this.tableData7[index].vehicleNumber
          this.editOtherCharges.costDate = this.tableData7[index].costDate
          this.editOtherCharges.money = this.tableData7[index].costAmount
          this.editOtherCharges.operator = this.tableData7[index].transactor
          this.editOtherCharges.expenseItem = this.tableData7[index].costItem
          this.editOtherCharges.remarks = this.tableData7[index].remark
          this.editOtherCharges.id = this.tableData7[index].id
      },
    getNowTime () {
      let date = new Date()
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      this.addTruckingOrderData.vehicleTime = year + seperator1 + month + seperator1 + strDate
      this.returnRegistrationData.enterTime = year + seperator1 + month + seperator1 + strDate
      this.vehicleRefuelingData.refuelingDate = year + seperator1 + month + seperator1 + strDate
      this.vehicleRefuelingData.recordDate = year + seperator1 + month + seperator1 + strDate
      this.vehicleViolationData.violationDate = year + seperator1 + month + seperator1 + strDate
      this.maintenanceData.maintenanceDate = year + seperator1 + month + seperator1 + strDate
      this.annualData.annualInspectionDate = year + seperator1 + month + seperator1 + strDate
      this.otherChargesData.costDate = year + seperator1 + month + seperator1 + strDate
    },
  },
  created() {
    this.getNowTime()
    this.vehicleNumbers = sessionStorage.getItem('vehicleFile')
    console.log(this.vehicleNumbers)
    this.getAllData(this.pageNum)
  }
}
</script>

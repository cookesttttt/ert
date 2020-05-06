<template>
  <Card class="goodShow">
    <Row>
      <Col span="20">
        <Col offset="4" span="20">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in dateData"
                              :timestamp=item.year.toString()
                              placement="top"
                              :id="'year'+item.year"
                              :color="nodeColor"
                              :size="large">
              <el-card class="width">
                <h4 @click="clickYear(item.year)"
                    class="yearStyle" :class="item.status===1?'bgH':'bgG'">
                  <a>{{item.year}}年度机械设备使用计划</a>
                </h4>
                <div v-for='(v,i) in item.quarterPlanNodes'
                     class="flex-container"
                     @click="clickQuarter(v.year,v.quarter)">
                  <div class="flex-item flex-item-c"  :class="v.status===1?'bgH':'bgG'">{{v.quarterName}}使用计划</div>
                  <div v-for="(j,k) in v.monthPlanNodes" @click.stop="clickMonth(j.year,v.quarter,j.month)"
                       :class="j.status===1?'bgH':'bgG'"
                       class="flex-item flex-item-r"> {{j.month}}月
                  </div>
                </div>
              </el-card>
            </el-timeline-item>

          </el-timeline>
          <Modal v-model="modal1"
                 title="请确认计划的起止日期"
                 :mask-closable="false"
                 @on-cancel="cancel">
            <Form :model="formItem"
                  ref="formItem"
                  :rules="ruleformItem"
                  :label-width="80">
              <FormItem>
                <Row>
                  <Col span="9">
                    <FormItem prop="startDate">
                      <DatePicker type="date"
                                  placeholder="请选择开始日期"
                                  value="yyyy-MM-dd"
                                  v-model="formItem.startDate"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="4"
                       style="text-align: center">~</Col>
                  <Col span="9">
                    <FormItem prop="endDate">
                      <DatePicker type="date"
                                  placeholder="请选择结束日期"
                                  value="yyyy-MM-dd"
                                  v-model="formItem.endDate"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel">取消</Button>
              <Button type="primary" size="large" @click="ok">保存</Button>
            </div>
          </Modal>
          <Modal v-model="modal2"
                 title="请确认计划的起止日期"
                 :mask-closable="false"
                 @on-cancel="cancel2">
            <Form :model="formItem2"
                  ref="formItem2"
                  :rules="ruleformItem2"
                  :label-width="80">
              <FormItem>
                <Row>
                  <Col span="9">
                    <FormItem prop="startDate">
                      <DatePicker type="date"
                                  placeholder="请选择开始日期"
                                  value="yyyy-MM-dd"
                                  v-model="formItem2.startDate"></DatePicker>
                    </FormItem>
                  </Col>
                  <Col span="4"
                       style="text-align: center">~</Col>
                  <Col span="9">
                    <FormItem prop="endDate">
                      <DatePicker type="date"
                                  placeholder="请选择结束日期"
                                  value="yyyy-MM-dd"
                                  v-model="formItem2.endDate"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel2">取消</Button>
              <Button type="primary" size="large" @click="ok2">保存</Button>
            </div>
          </Modal>
        </Col>
      </Col>
      <Col span="4">
        <Col span="24">
          <div class="fixed_div">
            <Card>
              <p slot="title">
               快捷导航
              </p>
              <div v-for="(item,index) in dateData" style="width:240px;height: 30px;">
                <a href="javascript:void(0)" @click="goAnchor('#'+'year'+item.year)"> {{item.year}}年</a>
              </div>
               <div>合同日期 （{{timeData.startDate}}~ {{timeData.endDate}}）
                 <Icon type="md-create"
                       style="color: rgb(0, 153, 204)"
                       size="16"
                       @click="putDate" />
               </div>
              <div>
                <span class="show"></span><p>计划编制完成</p>
                <div class="clear"></div>
                <span class="show" style="background-color: tan"></span><p>计划未编制</p>
              </div>
            </Card>

          </div>
        </Col>
      </Col>
    </Row>
  </Card>
</template>

<script>
  import {paramsValidate, isDataSuccess, formatTime} from '@/libs/util'
  import {
      getTimeplanold,
      getTimeplanNew,
      Saveplan
  } from '@/api/mechanicalEquipment/periodProject'
  import CollapsedMenu from "../../../../components/main/components/side-menu/collapsed-menu";

  export default {
    name: "periodProject",
    components: {CollapsedMenu},
    data() {
      return {
          modal1: false,
          modal2: false,
        nodeColor: '#2D8cF0',
          timeData:{},
          formItem: {
              startDate: '',
              endDate: ''
          },
          formItem2: {
              startDate: '',
              endDate: ''
          },
          ruleformItem: {
              startDate: [
                  { required: true, type: 'date', message: '请选择开始日期', trigger: 'change' }
              ],
              endDate: [
                  { required: true, type: 'date', message: '请选择结束日期', trigger: 'change' },
                  {
                      validator: (rule, value, callback) => {
                          if (this.formItem.startDate >= this.formItem.endDate) {
                              callback(new Error('结束时间需晚于开始时间'))
                          } else {
                              callback()
                          }
                      },
                      trigger: 'change'
                  }
              ]
          },
          ruleformItem2: {
              startDate: [
                  { required: true, type: 'date', message: '请选择开始日期', trigger: 'change' }
              ],
              endDate: [
                  { required: true, type: 'date', message: '请选择结束日期', trigger: 'change' },
                  {
                      validator: (rule, value, callback) => {
                          if (this.formItem2.startDate >= this.formItem2.endDate) {
                              callback(new Error('结束时间需晚于开始时间'))
                          } else {
                              callback()
                          }
                      },
                      trigger: 'change'
                  }
              ]
          },
        large: 'large',
        dateData: []
      }
    },
    methods: {
        ok () {
            this.$refs.formItem.validate((valid) => {
                if (valid) {
                    let data = {
                        projectId:JSON.parse(localStorage.getItem('projectId')).id,
                        endDate: formatTime(this.formItem.endDate),
                        startDate: formatTime(this.formItem.startDate)
                    }
                    Saveplan(data).then(res => {
                        const data = res.data;
                        let status = isDataSuccess(res);
                        switch (status) {
                            case 1:
                                this.$Message.error("服务器繁忙请稍后");
                                break;
                            case 2:
                                this.$Message.error(data.msgContent);
                                break;
                            default:
                                this.cancel()
                                this.getData()
                                break;
                        }
                    })
                } else {
                    this.$Message.error('请填写时间')
                }
            })
        },
        ok2 () {
            this.$refs.formItem2.validate((valid) => {
                if (valid) {
                    let data = {
                        projectId:JSON.parse(localStorage.getItem('projectId')).id,
                        endDate: formatTime(this.formItem2.endDate),
                        startDate: formatTime(this.formItem2.startDate)
                    }
                    Saveplan(data).then(res => {
                        const data = res.data;
                        let status = isDataSuccess(res);
                        switch (status) {
                            case 1:
                                this.$Message.error("服务器繁忙请稍后");
                                break;
                            case 2:
                                this.$Message.error(data.msgContent);
                                break;
                            default:
                                this.cancel2()
                                this.getData()
                                break;
                        }
                    })
                } else {
                    this.$Message.error('请填写时间')
                }
            })
        },
        putDate(){
          console.log(this.timeData.startDate)
          console.log(this.timeData.endDate)
          this.modal2=true
          this.formItem2.startDate=this.timeData.startDate
          this.formItem2.endDate=this.timeData.endDate
        },
        cancel () {
            this.$refs.formItem.resetFields()  // 清空
            this.modal1 = false
        },
        cancel2 () {
            this.$refs.formItem2.resetFields()  // 清空
            this.modal2 = false
        },
      goAnchor(ss){
        console.log(ss)
        document.querySelector(ss).scrollIntoView(true);
      },
      clickYear(year) {
        sessionStorage.setItem('idYear', year)
        console.log(year)
        this.$router.push({name: 'annualPlan'});
      },
      clickQuarter(year, quarter) {
        const item = {
          year: year,
          quarter: quarter,
        }
        console.log(item)
        sessionStorage.setItem('quarter', JSON.stringify(item))
        this.$router.push({name: 'seasonalPlan'});
      },
      clickMonth(year, quarter, month) {
        const item = {
          year: year,
          quarter: quarter,
          month: month
        }
        console.log(item)
        sessionStorage.setItem('month', JSON.stringify(item))
        this.$router.push({name: 'monthlyPlan',});
      },
      getAllData() {
          getTimeplanold(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
          const data = res.data;
          let status = isDataSuccess(res);
          switch (status) {
            case 1:
              this.$Message.error("服务器繁忙请稍后");
              break;
            case 2:
              this.$Message.error(data.msgContent);
              break;
            default:
              this.dateData = res.data.msgData
              console.log(data)
              break;
          }
        })
      },
        getData() {
            getTimeplanNew(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
                const data = res.data;
                let status = isDataSuccess(res);
                switch (status) {
                    case 1:
                        this.$Message.error("服务器繁忙请稍后");
                        break;
                    case 2:
                        this.$Message.error(data.msgContent);
                        break;
                    default:
                        if(res.data.msgData){
                           this.timeData=res.data.msgData
                           console.log(this.timeData)
                            this.getAllData()
                        }else {
                            this.modal1=true
                        }
                        break;
                }
            })
        }
    },
    activated() {
    /*  this.getAllData()*/
       this.getData()
    }
  }
</script>

<style scoped lang="less">
  .show{
   width: 80px;
    height: 20px;
    background-color: #e3e8ee;
    display: block;
    float: left;
    margin-right: 10px
  }
  .clear{
 clear: both;height: 10px
  }
  .bgH{
    background-color: #e3e8ee;
  }
  .bgG{
    background-color: tan;
  }
  .yearStyle {
    width: 77%;
    /*background-color: #e3e8ee;*/
    height: 50px;
    text-align: center;
    line-height: 50px;
    margin: 0 auto
  }

  .flex-container {
    display: flex;
    width: 80%;
    height: 50px;
    text-align: center;
    line-height: 30px;
    margin: 0 auto
  }

  .flex-item {
    margin: 10px;
    /*background-color: #e3e8ee;*/
    cursor: pointer;
  }

  .flex-item:hover {
    color: #082999;

  }

  .flex-item-r {
    flex: 1;
  }

  .flex-item-c {
    flex: 2;
  }

  .width {
    width: 80%;

    div {
      h4, p {
        cursor: pointer;
        text-align: center;
      }
    }

    a:link,
    a:visited {
      color: #FF0000;
      text-decoration: underline;
    }

    a:hover,
    a:active {
      color: #082999;
    }

    a {
      color: #252B3A;
    }
  }

  .fixed_div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    right: 30px;
    height:200px;
    width:300px;
    position: fixed;
    top: 160px;
  }
</style>

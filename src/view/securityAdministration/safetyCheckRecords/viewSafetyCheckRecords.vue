<template>
  <Card style="height: 100%;overflow-y: scroll">
    <Tabs value="name1">
      <TabPane label="安全检查信息" name="name1">
        <Row type="flex">
          <Col span="24">
            <Form ref="viewSafetyCheckRecordsData" style="margin-top: 50px" :model="viewSafetyCheckRecordsData"
                  :label-width="110">
              <Col span="10" offset="5">
                <FormItem label="检查记录名称">
                  <Input v-model="viewSafetyCheckRecordsData.inspectionRecordName" class="width" :maxlength="15"
                         disabled></Input>
                </FormItem>
                <FormItem label="发生日期">
                  <DatePicker v-model="viewSafetyCheckRecordsData.occurrenceDate" type="date" class="width"
                              format='yyyy-MM-dd' :transfer="true" disabled></DatePicker>
                </FormItem>
                <FormItem label="作为归档资料">
                  <CheckboxGroup v-model="viewSafetyCheckRecordsData.checkbox">
                    <Checkbox label="true" disabled>是</Checkbox>
                  </CheckboxGroup>
                </FormItem>
              </Col>
              <Col span="24">
                <Col span="14" offset="5">
                  <FormItem label="检查记录内容">
                    <Input
                      v-model="viewSafetyCheckRecordsData.inspectionRecords"
                      type="textarea"
                      :rows="5"
                      style="width: 90%"
                      disabled
                    ></Input>
                  </FormItem>
                  <FormItem label="备注">
                    <Input
                      v-model="viewSafetyCheckRecordsData.remarks"
                      type="textarea"
                      :rows="5"
                      style="width: 90%"
                      disabled
                    ></Input>
                  </FormItem>
                </Col>
              </Col>
            </Form>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="附件" name="name2">
        <br>
        <br>
        <Table
          border
          :columns="columns"
          :data="viewFileList">
        </Table>
      </TabPane>
    </Tabs>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
  import bigImg from '@/components/big-img/Bigimg.vue'
  import {getDetails} from '@/api/securityAdministration/safetyCheckRecords'
    export default {
        name: "viewSafetyCheckRecords",
      components: {
        bigImg
      },
      data() {
        return {
          viewSafetyCheckRecordsData: {
            id: '',
            projectId: '',
            inspectionRecordName: '',
            occurrenceDate: '',
            checkbox: [],
            inspectionRecords: '',
            remarks: '',
          },
          viewFileList: [],
          showImg: false,
          imgSrc: '',
          columns: [
            {
              type: 'index',
              width: 50,
              align: 'center',
            },
            {
              title: '附件',
              key: 'imgUrl',
              render: (h, params) => {
                console.log(params.row.name)
                const filePath = params.row.name
                const index = filePath.lastIndexOf(".")
                const ext = filePath.substr(index + 1);
                console.log(ext)
                if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1) {
                  return h('img', {
                    style: {//设置样式
                      width: '50px',
                      height: '50px',
                      'border-radius': '5%'
                    },
                    attrs: {//设置属性
                      src: params.row.imgUrl
                    }
                  });
                } else {
                  return h('div', [
                    h('span', {
                      style: {
                        color: '#082999',
                        cursor: 'pointer',
                      },
                      on: {
                        'click': () => {
                          window.open('', '_blank').location = params.row.imgUrl
                        }
                      }
                    }, params.row.name)
                  ])
                }
              }
            },
            {
              title: '附件名称',
              key: 'name',

            },
            {
              title: '上传人',
              key: 'uploadUser',
              width: 100,
            },
            {
              title: '上传日期',
              key: 'uploadDate',
              width: 120,
            },
            {
              title: '操作',
              width: 100,
              key: 'handle',
              fixed: 'right',
              render: (h, params, vm) => {
                return [
                  h('Button', {
                    props: {
                      size: 'small'
                    },
                    on: {
                      'click': () => {
                        console.log(params.row.name)
                        const filePath = params.row.name
                        const index = filePath.lastIndexOf(".")
                        const ext = filePath.substr(index + 1);
                        if (['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) !== -1) {
                          this.showImg = true;
                          // 获取当前图片地址
                          console.log(params.row)
                          this.imgSrc = params.row.imgUrl;
                        } else {
                          window.open('', '_blank').location = params.row.imgUrl
                        }
                      }
                    },
                    style: {
                      marginRight: '5px'
                    }
                  }, '查看'),
                ]
              }
            }
          ],
        }
      },
      methods: {
        viewImg() {
          this.showImg = false;
        },
        // 数据回显
        editEcho(id) {
          this.viewSafetyCheckRecordsData.checkbox = []
          getDetails(id).then(res => {
            if (res.status === 200) {
              const data = res.data
              if (data.msgCode === 0) {
                this.viewSafetyCheckRecordsData.id = data.msgData.id
                this.viewSafetyCheckRecordsData.projectId = data.msgData.projectId
                this.viewSafetyCheckRecordsData.inspectionRecordName = data.msgData.name
                this.viewSafetyCheckRecordsData.occurrenceDate = new Date(data.msgData.happenDate)
                this.viewSafetyCheckRecordsData.checkbox.push((data.msgData.asFillingDoc).toString())
                this.viewSafetyCheckRecordsData.inspectionRecords = data.msgData.content
                this.viewSafetyCheckRecordsData.remarks = data.msgData.remark
                this.viewFileList = data.msgData.attachmentVoList
                console.log(data)
                console.log(data)
              } else {
                this.$Message.error(data.msgContent)
              }
            } else {
              this.$Message.error('服务器繁忙请稍后')
            }
          })
        }
      },
      created() {
        console.log(this.$route.query.id)
        this.editEcho(this.$route.query.id)
      },
    /*  watch: {
        '$route': {
          handler: function (to, from) {
            console.log(this.$route.query.id)
            console.log(to)
            if (to.name === '安全检查记录详情') {
              this.editEcho(this.$route.query.id)
            }
          },
        }
      },*/
      beforeRouteUpdate (to, from, next) {
        this.editEcho(to.query.id)
        next()
      }
    }
</script>

<style scoped>
  .width {
    width: 80%;
  }
</style>

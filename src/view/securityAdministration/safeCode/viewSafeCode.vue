<template>
  <Card style="height: 100%;overflow-y: scroll">
    <Tabs value="name1">
      <TabPane label="安全规范信息" name="name1">
        <Row type="flex">
          <Col span="24">
            <Form ref="viewSafeCodeData" :model="viewSafeCodeData"
                  style="margin-top: 50px"
                  :label-width="110">
              <Col span="10" offset="5">
                <Col span="24">
                  <FormItem label="规范类别">
                    <Input v-model="viewSafeCodeData.categoryName" class="width" :maxlength="15" disabled></Input>
                  </FormItem>
                  <FormItem label="规范名称">
                    <Input v-model="viewSafeCodeData.specificationName" class="width" :maxlength="15" disabled></Input>
                  </FormItem>
                  <FormItem label="发布单位">
                    <Input v-model="viewSafeCodeData.publicationUnit" class="width" :maxlength="15" disabled></Input>
                  </FormItem>
                  <FormItem label="发布人">
                    <Input v-model="viewSafeCodeData.issuer" class="width" :maxlength="15" disabled></Input>
                  </FormItem>
                </Col>
              </Col>
              <Col span="24">
                <Col span="14" offset="5">
                  <FormItem label="备注">
                    <Input
                      disabled
                      v-model="viewSafeCodeData.remarks"
                      type="textarea"
                      :rows="5"
                      style="width: 90%"
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
          :data="lookOverFileList">
        </Table>
      </TabPane>
    </Tabs>
    <bigImg v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></bigImg>
  </Card>
</template>

<script>
  import bigImg from '@/components/big-img/Bigimg.vue'
  import {getDetails} from '@/api/securityAdministration/safeCode'

  export default {
    name: "viewSafeCode",
    components: {
      bigImg
    },
    data() {
      return {
        lookOverFileList: [],
        viewSafeCodeData: {
          categoryName:'',
          specificationName: '',
          publicationUnit: '',
          issuer: '',
          remarks: '',
          id: '',
          categoryId: '',
          projectId: '',
        },
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
        getDetails(id).then(res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.viewSafeCodeData.id = data.msgData.id
              this.viewSafeCodeData.categoryId = data.msgData.categoryId
              this.viewSafeCodeData.categoryName = data.msgData.categoryName
              this.viewSafeCodeData.projectId = data.msgData.projectId
              this.viewSafeCodeData.specificationName = data.msgData.name
              this.viewSafeCodeData.publicationUnit = data.msgData.publicationUnit
              this.viewSafeCodeData.issuer = data.msgData.publicationPerson
              this.viewSafeCodeData.remarks = data.msgData.remark
              this.lookOverFileList = data.msgData.attachmentVos
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
    watch: {
      '$route': {
        handler: function (to, from) {
          console.log(this.$route.query.id)
          console.log(to)
          if (to.name === '安全规范详情') {
            this.editEcho(this.$route.query.id)
          }
        },
      },
    }
  }
</script>

<style scoped>

</style>

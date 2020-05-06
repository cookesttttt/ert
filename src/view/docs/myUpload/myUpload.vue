<template>
  <div>
    <Card>
      <div class="bottom15">
        <!--收搜-->
        <Input class="search-input" v-model="searchFile" placeholder="请输入文件名称"/>
        <Button class="search-btn" type="primary" @click="searchFiles">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>
      <!--表格数据-->
      <Table
        ref="selection"
        border
        :columns="columns"
        :data="tableData">

      </Table>
      <!--分页-->
      <div class="page">
        <div class="right">
          <Page :total="totalElements"
                :current="pageNum"
                show-total
                @on-change="changePage">

          </Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import {readFile, downloadFile, myUploadFiles, deletedFile} from '@/api/docs/file'
import {mkLink} from '@/libs/util'   // 下载
export default {
  name: 'myUpload',
  data() {
    return {
      tableData: [],
      searchFile: '',   // 搜索
      pageNum: 1,       // 当前页码
      pageSize: 10,     // 每页显示多少条
      totalElements: 0, // 初始化信息总条数
      columns: [
        {
          type: 'index',
          width: 50,
          align: 'center',

          fixed: 'left',
        },
        {
          title: '文件名称',
          key: 'name',
            tooltip:true,
          width: 400,
          fixed: 'left',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#082999',
                  cursor: 'pointer'
                },
                on: {
                  'click': () => {
                    this.readFile()
                  }
                }
              }, params.row.name)
            ])
          }
        },
        {
          title: '上传日期',
          key: 'uploadTime',
          width: 120
        },
        {
          title: '文件编号',
            tooltip:true,
          key: 'fileNumber',
          width: 240
        },
        {
          title: '发文单位',
            tooltip:true,
          key: 'reportDepartment',
          width: 230
        },
        {
          title: '发文人',
          key: 'reporterName',
          width: 100
        },
        {
          title: '文档路径',
            tooltip:true,
          key: 'path',
          width: 400
        },
        {
          title: '操作',
          width: 170,
          key: 'handle',
          fixed: 'right',
          render: (h, params, vm) => {
            return [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    this.downLoad(this.tableData[params.index])
                  }
                },
                style: {
                  marginRight: '5px'
                }
              }, '下载'),
              h('Button', {
                props: {
                  size: 'small'
                },
                on: {
                  'click': () => {
                    this.readFile()
                  }
                },
                style: {
                  marginRight: '5px'
                }
              }, '查看'),
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
                    this.deletedFileData(this.tableData[params.index].id, this.tableData[params.index].id)
                  }
                }
              }, [
                h('Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '删除')]),
            ]
          }
        }
      ]
    }
  },
  methods: {
    // 删除
    deletedFileData(id, index) {
      deletedFile(id).then(res => {
        if (res.status === 200) {
          const data = res.data
          if (data.msgCode === 0) {
            this.tableData.splice(index, 1)
            this.$Message.success(data.msgContent)
            this.myUploadFiles(this.pageNum)
          } else {
            this.$Message.error(data.msgContent)
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },
    // 查看
    readFile() {
      const tempPage = window.open('', '_blank')
      readFile().then(res => {
        const data = res.data
        if (data) {
          if (data.msgCode === 0) {
            console.log(data.msgContent)
            tempPage.location = data.msgContent
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }

      })
    },

    // 获取全部数据
    myUploadFiles(pageNum) {
      myUploadFiles(JSON.parse(localStorage.getItem('projectId')).id, pageNum, this.pageSize, this.searchFile).then(res => {
        const data = res.data
        if (data) {
          if (res.data.msgCode === 0) {
            this.totalElements = data.msgData.totalElements
            this.tableData = data.msgData.content
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },

    // 分页
    changePage(index) {
      this.pageNum = index
      this.myUploadFiles(this.pageNum)
    },
    // 收搜
    searchFiles() {
      this.pageNum = 1
      this.myUploadFiles(this.pageNum)
    },
    // 下载
    downLoad(row) {
      downloadFile(row.id).then(res => {
        if (res.status === 200) {
          mkLink(res.data, row)
          this.$Message.success('下载成功')
        }
      }).catch(error => {
        this.$Message.error('下载失败')
      })
    },
  },
  mounted() {
    this.myUploadFiles(this.pageNum)
  },
}
</script>
<style src='../style/index.css' scoped></style>

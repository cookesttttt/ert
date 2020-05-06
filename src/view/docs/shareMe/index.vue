<template>
  <Card>
    <div class="bottom15">
      <!--收搜-->
      <Input class="search-input" v-model="searchFile3" placeholder="请输入文件名称"/>
      <Button class="search-btn" type="primary" @click="searchFiles3">
        <Icon type="ios-search"/>
        &nbsp;搜索
      </Button>
    </div>
    <!--表格数据-->
    <Table ref="currentRowTable"
           border
           :columns="columns3"
           :data="tableData3">

    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <Page
          :total="totalElements3"
          :current="pageNum3"
          show-total
          @on-change="changePage3">
        </Page>
      </div>
    </div>
  </Card>
</template>
<script>

import { readFile , shareFilesToMe , downloadFile } from '@/api/docs/file'
import {mkLink} from '@/libs/util'   // 下载

export default {
  name: 'shareMe',
  data() {
    return {
      tableData3: [],
      searchFile3: '', // 搜索
      pageNum3: 1,     // 当前页码
      pageSize3: 10,   // 每页显示多少条
      totalElements3: 0, //初始化信息总条数
      columns3: [
        {
          type: 'index',
          width: 50,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '文件名称',
            tooltip:true,
          key: 'name',
          fixed: 'left',
          width: 400,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#082999',
                  cursor: 'pointer',
                },
                on: {
                  'click': () => {
                    this.readFile3()
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
          width: 200
        },
        {
          title: '上传人',
          key: 'uploadRealName',
          width: 100
        },
        {
          title: '发文单位',
            tooltip:true,
          key: 'reportDepartment',
          width: 200
        },
        {
          title: '分享日期',
          key: 'shareDate',
          width: 120
        },
        {
          title: '分享人',
          key: 'shareUser',
          width: 100
        },
        {
          title: '文档路径',
            tooltip:true,
          key: 'path',
          width: 300
        },
        {
          title: '操作',
          key: 'handle',
          width: 130,
          fixed: 'right',
          render: (h, params, vm) => {
            return [h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                'click': () => {
                  this.downLoad3(this.tableData3[params.index])
                }
              },
              style: {
                marginRight: '5px'
              }
            }, '下载'), h('Button', {
              props: {
                size: 'small'
              },
              on: {
                'click': () => {
                  this.readFile()
                }
              }
            }, '查看')

            ]
          },
        },

      ],
    }
  },
  methods: {
    // 查看
    readFile3() {
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
    shareFilesToMe(pageNum) {
      shareFilesToMe(pageNum, this.pageSize3, this.searchFile3, JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        const data = res.data
        if (data) {
          if (data.msgCode === 0) {
            console.log(data.msgData.content)
            this.totalElements3 = data.msgData.totalElements
            this.tableData3 = data.msgData.content
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },
    // 收搜
    searchFiles3() {
      this.pageNum3 = 1
      this.shareFilesToMe(this.pageNum3)
    },
    // 分页
    changePage3(index) {
      this.pageNum3 = index
      this.shareFilesToMe(this.pageNum3)
    },
    // 下载
    downLoad3(row) {
      downloadFile(row.id).then(res => {
        if (res.status === 200) {
          mkLink(res.data, row)
          this.$Message.success('下载成功')
        }
      }).catch(error => {
        this.$Message.error('下载失败')
      })
    }
  },
  mounted() {
    this.shareFilesToMe(this.pageNum3)
  }
}
</script>
<style src="../style/index.css" scoped></style>

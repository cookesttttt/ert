<template>
  <Card style="height: 100%">
    <div class='search-con search-con-top'>
      <div class='left'>
        <Button class='search-btn' type="primary" @click="addMeeting">&nbsp;新建会议记录</Button>
      </div>
      <!--搜索 所有类别-->
      <div class="right">
        <Select class="search-col" v-model="categoryId" style="width: 120px">
          <Option v-for="item in allCategory" :value="item.id" :key="item.id">{{ item.name }}</Option>
          <Option :value="allCategoryId" >所有类别</Option>
        </Select>
        <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue" />
        <Button
          class="search-btn"
          type="primary"
          @click="searchMeeting"
          style="padding: 5px 15px 4px"
        >
          <Icon type="ios-search" />&nbsp;搜索
        </Button>
      </div>
      <div class="clear"></div>
    </div>
    <!--表格-->
    <Table ref="tables" border :data="tableData" :columns="columns"></Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <Page :current="pageNum" show-total :total="totalElements" @on-change="changePage"></Page>
      </div>
    </div>
  </Card>
</template>
<script>
import {
  meetingDetails,
  deleteMeetingDetails,
  allMeeting
} from '@/api/meeting/meetingRecord'
import { getAllCategory } from '@/api/meeting/meetingCategory'
import './index.less'
export default {
  name: 'recordManagement',
  data () {
    return {
      allCategory: [], // 所有类别
      categoryId: '-1', // 会议类别ID
      allCategoryId: '-1', // 所有会议类别ID
      searchValue: '', // 搜索
      tableData: [], // 表格数据
      pageNum: 1, //  当前页码
      pageSize: 10, //  每页显示多少条
      totalElements: 0, // 条数
      columns: [
        {
          type: 'index',
          width: 55,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '名称',
          key: 'name',
          width: 500,
          fixed: 'left',
            tooltip:true,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#082999',
                  cursor: 'pointer'
                },
                on: {
                  'click': () => {
                    this.viewMeeting(params.row.id)
                  }
                }
              }, params.row.name)
            ])
          }
        },
        {
          title: '类别',
        tooltip:true,
          width: 220,
          key: 'meetingCategoryName'
        },
        {
          title: '日期',
          key: 'meetingDate',
          width: 120
        },
        {
          title: '地点',
          width: 260,
            tooltip:true,
          key: 'meetingPlace'
        },
        {
          title: '主持人',
          key: 'emcee',
          width: 100
        },
        {
          title: '天气',
          key: 'weather',
          width: 100
        },
        {
          title: '操作',
          key: 'handle',
          width: 170,
          fixed: 'right',
          render: (h, params, vm) => {
            return [
              // 编辑按钮
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.editMeeting(params.row.id)
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                },
                '编辑'
              ),
              // 查看按钮
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.viewMeeting(params.row.id)
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                },
                '查看'
              ),
              // 删除按钮
              h(
                'Poptip',
                {
                  props: {
                    transfer: true,
                    confirm: true,
                    title: '你确定要删除吗?',
                    placement: 'left-end',
                    size: 'small'
                  },
                  on: {
                    'on-ok': () => {
                      this.deleteMeeting(params.row.id, params.row._index)
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
      ]
    }
  },
  methods: {
      addtype1(){
        console.log('1')
      },
    // 查看会议
    viewMeeting (id) {
      if (id) {
        this.$router.push({
          path: '/administration/viewMeeting',
          query: { id: id }
        })
      }
    },
    // 删除会议
    deleteMeeting (id, index) {
      deleteMeetingDetails(id).then(res => {
        if (res.status === 200) {
          const data = res.data
          if (data.msgCode === 0) {
            this.tableData.splice(index, 1)
            this.getAllMeeting(this.pageNum)
            this.$Message.success(data.msgContent)
          } else {
            this.$Message.error(data.msgContent)
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },
    // 添加会议跳转
    addMeeting () {
      this.$router.push({ path: '/administration/new_meeting' })
    },
    // 编辑会议跳转
    editMeeting (id) {
      if (id) {
        this.$router.push({
          path: '/administration/editmeeting',
          query: { id: id }
        })
      }
    },
    //  获取会议类别
    getCategory () {
      getAllCategory(JSON.parse(localStorage.getItem('projectId')).id).then(
        res => {
          if (res.status === 200) {
            const data = res.data
            if (data.msgCode === 0) {
              this.allCategory = data.msgData
            } else {
              this.$Message.error(data.msgContent)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }
        }
      )
    },
    // 搜索会议
    searchMeeting () {
      this.pageNum = 1
      this.getAllMeeting(this.pageNum)
    },
    //  获取所有的会议
    getAllMeeting (pageNumber) {
      let data = {}
      data.name = this.searchValue
      data.categoryId = this.categoryId
      data.projectId = JSON.parse(localStorage.getItem('projectId')).id
      allMeeting(pageNumber, this.pageSize, data).then(res => {
        console.log(res)
        if (res.status === 200) {
          const data = res.data
          if (data.msgCode === 0) {
            this.totalElements = data.msgData.totalElements
            this.tableData = data.msgData.content
          } else {
            this.$Message.error(data.msgContent)
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },
    // 分页
    changePage (i) {
      this.pageNum = i
      this.getAllMeeting(i)
    }
  },
  mounted () {
    //  初始化会议类别获取
    this.getCategory()
    //  初始化会议列表
    this.getAllMeeting(this.pageNum)
  }
}
</script>

<style scoped>
</style>

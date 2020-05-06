<template>
  <Card style="height: 100%">
    <div class="search-con">
      <div class="left">
        <ButtonGroup>
          <Button  type="primary"  @click="goNewStocking">&nbsp新建盘点单</Button>
          <Button  @click="copyCreation">&nbsp复制创建</Button>
        </ButtonGroup>

        <Button  class="search-btn">&nbsp预览/ 打印</Button>
      </div>
      <div class="right">
        <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue"></Input>
        <Button class="search-btn" type="primary" @click="searchAdd" style="padding: 5px 15px 4px">
          <Icon type="ios-search"/>
          &nbsp搜索
        </Button>
      </div>
      <div class="clear"></div>
    </div>
    <!--表格数据-->
    <Table
      border
      ref="tables"
      :data="tableData"
      :columns="columns">
    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <Page
          :total="totalElements"
          show-total
          :current="pageNum"
          @on-change="getpage">
        </Page>
      </div>
    </div>
  </Card>
</template>

<script>
import './index.less'
import {paramsValidate,isDataSuccess} from '@/libs/util'    //验证对象是否为空
import { getData, deleteTable, } from '@/api/materialSupplies/stocking/stocking'
export default {
  name: 'stocking',
  data(){
    return {
      searchValue: '',                 //收搜的关键字
      // 当前页码
      pageNum: 1,
      // 每页显示多少条
      pageSize: 10,
      // 初始化信息总条数
      totalElements: 0,
      selectList: '',      // 被选中的数据
      tableData: [],        //表格数据
      columns: [
        {
          type: '_checked',
          title: ' ',
          width: 60,
          align: 'center',
          fixed: 'left',
          render: (h, {row, index}) => {
            return h('div', [
              h('Checkbox', {
                props: {
                  value: row._checked
                },
                on: {
                  'on-change': e => {
                    this.tableData.forEach(items => {
                      this.$set(items, '_checked', false)
                    })

                    if (e == false) {
                      this.selectList = ''
                    } else {
                      this.selectList = row
                    }

                    this.tableData[index]._checked = e
                  }
                }
              })
            ])
          }
        },
        {
          type: 'index',
          width: 50,
          align: 'center',
          fixed: 'left',
        },
        {
          title: '单据编号',
          key: 'number',
          fixed: 'left',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  color: '#082999',
                  cursor: 'pointer'
                },
                on: {
                  'click': () => {
                    this.$router.push({path: '/administration/editStocking'})
                    window.sessionStorage.setItem('stockingId', params.row.id)
                  }
                }
              }, params.row.number)
            ])
          }
        },
        {
          title: '制单状态',
          key: 'sinststate',
          width: 100,
          fixed: 'left',
          render: (h, params) => {
            let tmpStr = ''
            let status = params.row.state
            tmpStr = status === 0 ? '未完成' : '完成'
            return h('div', [
              h('span', {
                style: {
                  color: (status === 0) ? '#FD0904' : '#03A71F',
                }
              }, tmpStr)
            ])
          }
        },
        {
          title: '盘点库房',
          key: 'repName',
          width: 100,
        },
        {
          title: '盘点日期',
          key: 'checkDate',
          width: 120,
        },
        {
          title: '盘点人',
          key: 'checker',
          width: 80,
        },
        {
          title: '创建日期',
          key: 'makeDate',
          width: 120,
        },
        {
          title: '操作',
          key: 'handle',
          width: 130,
          fixed: 'right',
          render: (h, params, vm) => {
            return [
              // 编辑按钮
              [h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  'click': () => {
                    this.$router.push({path: '/administration/editStocking'})
                    window.sessionStorage.setItem('stockingId', params.row.id)
                  }
                },
                style: {
                  marginRight: '5px'
                }
              }, '编辑')],
              //删除按钮
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
                      this.deleteTableData(params.index)
                    }
                  }
                },
                [h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                }, '删除')]),
            ]
          }
        }
      ]
    }
  },
  methods: {
    goNewStocking() {
      this.$router.push({path: '/administration/newStocking'})
    },
    //复制创建
    copyCreation() {
      if (this.selectList) {
        window.sessionStorage.setItem('stockingCopyId', this.selectList.id)
        this.$router.push({path: '/administration/stockingCopy'})
        this.selectList=''
      } else {
        this.$Message.error('请选择一个单据进行复制')
      }
    },
    //删除数据
    deleteTableData(index) {
      deleteTable(this.tableData[index].id).then(res => {
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
    //收搜
    searchAdd() {
      this.pageNum = 1
      this.getAllData(this.pageNum)
    },
    // 分页
    getpage(index) {
      this.pageNum = index
      this.getAllData(this.pageNum)
    },
    //获取全部数据
    getAllData(pageNum) {
      getData(
        pageNum,
        this.pageSize,
        this.searchValue,
        JSON.parse(localStorage.getItem('projectId')).id
      ).then(res => {
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
            console.log(data.msgData.content)
            this.tableData = data.msgData.content
            this.totalElements = data.msgData.totalElements
            break
        }
      })
    },
  },
  activated() {
    this.getAllData(this.pageNum)
  },
  mounted() {
    this.getAllData(this.pageNum)
  }
}
</script>



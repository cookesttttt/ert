<template>
  <div>
    <Card style="height: 100%">
      <div class="news-bottom15">
        <!--收搜-->
        <Input class="news-search-input" v-model="searchFile" placeholder="请输入查询关键词"/>
        <Button class="news-search-btn" @click="searchAnnual" >
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
        <Button class="news-search-btn" type="primary" style="float: right" @click="allPutMessages">全部已读</Button>
      </div>
      <Table :columns="columns" :data="data" border :row-class-name="rowClassName" ></Table>
      <div class="news-page">
        <div class="news-right">
          <Page :total="totalElements"
                v-if="pageNum!==0"
                :current="pageNum"
                :page-size="pageSize"
                show-total
                @on-change="changePage">

          </Page>
        </div>
      </div>
    </Card>
    <!-- <Button @click="exportData" type="primary" style="margin: 0 10px 10px 0;">导出日志记录</Button>
     <b>注：这里只会显示成功保存到服务端的错误日志，而且页面错误日志不会在浏览器持久化存储，刷新页面即会丢失</b>
     <Table ref="table" :columns="columns" :data="errorList"></Table>-->
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import { paramsValidate , isDataSuccess , formatTime } from '@/libs/util'
  import {mapMutations} from 'vuex'
  import {getMessages,deleteMessages,putMessages} from '@/api/messages/messages'
  export default {
    name: 'error_logger_page',
    data() {
      return {
        searchFile: '',
        pageNum: 1,       // 当前页码
        pageSize: 10,     // 每页显示多少条
        totalElements: 0, // 初始化信息总条数
        iconStyle: {
          // 下
          dropdown: 'ios-arrow-down',
          // 上
          dropup: 'ios-arrow-up'
        },
        icon:'md-arrow-dropup',
        data:[],
        columns: [
          {
            type: 'expand',
            width: 1,
            render: (h, params) => {
              return h ('div',[
                h('div', {
                    class: 'oldDivTable',
                    attrs:{
                      id:params.row.id,
                    },
                  },
                  params.row.messageBody),
                h('div',{

                  style:{
                    float:'right',
                  }
              },[
                  h('Button',
                    {

                      props: {
                        type: 'text',
                      },
                      on: {
                        'click': () => {
                          console.log(params.row)
                          console.log($('#'+ params.row.id))
                          if(params.row.isIcon){
                            $('#'+ params.row.id).removeClass('newsDivTable')
                            $('#'+ params.row.id).addClass('oldDivTable')
                            params.row.isIcon=false
                          }else {
                            $('#'+ params.row.id).removeClass('oldDivTable')
                            $('#'+ params.row.id).addClass('newsDivTable')
                            params.row.isIcon=true
                          }
                        }
                      }
                    }, [
                      h('Icon', {
                        style:{
                          display:(params.row.isIcon)?'inline-block':'none'
                        },
                          props: {
                            type:this.iconStyle.dropup,
                            size: 18,
                            color: '#000000'
                          }
                        },
                      ),
                      h('Icon', {
                        style:{
                          display:(params.row.isIcon)?'none':'inline-block'
                        },
                          props: {
                            type:this.iconStyle.dropdown,
                            size: 18,
                            color: '#000000'
                          }
                        },
                      )
                    ]),
                ])

              ])

            }
          },
          {
            type: 'index',
            width: 60,
            align: 'center',
          },
          {
            title: '消息',
            key: 'subject',
          },
          {
            title: '消息类型',
            key: 'systemMessageType',
            width: 150,
          },
          {
            title: '消息时间',
            key: 'gmtCreate',
            width: 140,
          },
          {
            title: '操作',
            width: 130,
            key: 'handle',
            render: (h, params, vm) => {
              return [
                h('Button', {
                  props: {
                    disabled:params.row.isRead,
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    'click': () => {
                      console.log(params.row)
                      let data = {
                        ids: [params.row.id]
                      }
                      putMessages(data).then(res => {
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
                            this.getAllMessages(this.pageNum)
                            break
                        }
                      })
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '已读'),
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
                      console.log(params.index)
                      this.deleteAMessages(params.index)
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
        ],
        /* columns: [
           {
             type: 'index',
             title: '序号',
             width: 100
           },
           {
             key: 'type',
             title: '类型',
             width: 100,
             render: (h, { row }) => {
               return (
                 <div>
                   <icon size={16} type={row.type === 'ajax' ? 'md-link' : 'md-code-working'}></icon>
                 </div>
               )
             }
           },
           {
             key: 'code',
             title: '编码',
             render: (h, { row }) => {
               return (
                 <span>{ row.code === 0 ? '-' : row.code }</span>
               )
             }
           },
           {
             key: 'mes',
             title: '信息'
           },
           {
             key: 'url',
             title: 'URL'
           },
           {
             key: 'time',
             title: '时间',
             render: (h, { row }) => {
               return (
                 <span>{ dayjs(row.time).format('YYYY-MM-DD HH:mm:ss') }</span>
               )
             },
             sortable: true,
             sortType: 'desc'
           }
         ]*/
      }
    },
    computed: {
      errorList() {
        return this.$store.state.app.errorList
      }
    },
    methods: {
      rowClassName (row) {
        if (row.isRead) {
          return 'demo-table-info-row';
        }
        return '';
      },
      ...mapMutations([
        'setHasReadErrorLoggerStatus'
      ]),
      exportData() {
        this.$refs.table.exportCsv({
          filename: '错误日志.csv'
        })
      },
      changePage(page){
        this.pageNum = page;
        this.getAllMessages(this.pageNum)
      },
     // 删除
      deleteAMessages(index){
        deleteMessages(this.data[index].id).then(res=>{
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
              this.data.splice(index, 1)
              this.getAllMessages(this.pageNum)
              this.$Message.success(data.msgContent)
              break
          }
        })
      },
     // 获取全部数据
     getAllMessages(pageNum){
       getMessages(pageNum,this.pageSize,JSON.parse(localStorage.getItem('projectId')).id,this.searchFile).then(res=>{
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
             this.data = data.msgData.pageList.content
             this.data.forEach(item => {
               console.log(item.messageBody)
               if(item.messageBody.length>0){
                 item._expanded = true
               }
               item._disableExpand = true
             })
             this.totalElements = data.msgData.pageList.totalElements
              console.log(data)
             break
         }
       })
     },
      searchAnnual () {
        this.pageNum = 1
        this.getAllMessages(this.pageNum)
      },
      allPutMessages () {
        let ids = []
        this.data.forEach(res => {
          ids.push(res.id)
        })
        let data = {
          ids: ids
        }
        putMessages(data).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              console.log(res.data)
              this.$Message.success(res.data.msgContent)
              this.getAllMessages(this.pageNum)
              break
          }
        })
      }
    },
    activated() {
      this.getAllMessages(this.pageNum)
      this.setHasReadErrorLoggerStatus()
    },
    mounted() {
      this.getAllMessages(this.pageNum)
      this.setHasReadErrorLoggerStatus()
    }
  }
</script>

<style  lang="less">
  .ivu-table .demo-table-info-row td{
    background-color: #f8f8f9;
    color: #c5c8ce;
  }
  .news-bottom15 {
    margin-bottom: 15px
  }

  .news-search-input {
    display: inline-block;
    width: 200px;
    margin-left: 2px;
  }

  .news-search-btn {
    margin-left: 5px;
    padding: 5px 15px 4px
  }
  .oldDivTable{
    float:left;
    width:90%;
    letter-spacing:2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:nowrap;
    line-height: 30px;
  }
  .newsDivTable{
    float:left;
    letter-spacing:2px;
    width:90%;
    line-height: 30px;
  }
  .news-page{
    margin: 10px;overflow: hidden
  }
  .news-right{
    float: right;
  }
  td.ivu-table-expanded-cell{
    background-color: white;
    padding: 10px  35px 6px 78px;
  }
  .demo-table-info-row +tr td{
    color: #c5c8ce;
    background-color: #f8f8f9 !important;
  }
</style>

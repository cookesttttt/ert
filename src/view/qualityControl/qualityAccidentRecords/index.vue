<template>
  <Card style="height: 100%">
    <div class="bottom15">
      <Button class="search-btn" type="primary" @click="clickNewQualityAccidentRecords">&nbsp;新建质量事故记录</Button>
      <!--收搜-->
      <div class="right">
        <Input class="search-input" placeholder="请输入名称收搜" v-model="searchValue"></Input>
        <Button class="search-btn" type="primary" @click="searchCollection">
          <Icon type="ios-search"/>
          &nbsp;搜索
        </Button>
      </div>
    </div>
    <div class="clear"></div>
    <!--表格数据-->
    <Table border
           :columns="columns"
           :data="tableData">

    </Table>
    <!--分页-->
    <div class="page">
      <div class="right">
        <Page
          :total="totalElements"
          :current="pageNum"
          show-total
          @on-change="changePage">
        </Page>
      </div>
    </div>
  </Card>
</template>

<script>
  import  '../index.less'
  import {isDataSuccess} from '@/libs/util'   //验证对象是否为空
  import {allData,deleteTable} from '@/api/qualityControl/qualityAccidentRecords'
    export default {
        name: "index",
      data() {
        return {
          tableData: [],
          searchValue: '', // 搜索
          pageNum: 1,     // 当前页码
          pageSize: 10,   // 每页显示多少条
          totalElements: 0, //初始化信息总条数
          columns: [
            {
              type: 'index',
              width: 55,
              align: 'center',
              fixed: 'left'
            },
            {
              title: '事故记录名称',
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
                        this.$router.push({
                          name: '质量事故记录详情',
                          query: {
                            id:this.tableData[params.index].id,
                          }})
                      }
                    }
                  }, params.row.name)
                ])
              }
            },
            {
              title: '发生日期',
              key: 'happenDate',
              width: 120
            },
            {
              title: '事故内容',
              tooltip:true,
              key: 'content',
              width: 400
            },
            {
              title: '是否归档',
              key: 'asFillingDoc',
              width: 130,
              render:(h,params)=>{
                const status=params.row.asFillingDoc===true?'是':'否'
                return h('div',status)
              }
            },
            {
              title: '备注',
              tooltip:true,
              key: 'remark',
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
                      size: 'small',

                    },
                    on: {
                      'click': () => {
                        this.$router.push({
                          name: '编辑质量事故记录',
                          query: {
                            id:this.tableData[params.index].id,
                          }})
                      }
                    },
                    style:{
                      marginRight:'5px'
                    }
                  },"编辑"),
                  h('Button', {
                    props: {
                      size: 'small',

                    },
                    on: {
                      'click': () => {
                        this.$router.push({
                          name: '质量事故记录详情',
                          query: {
                            id:this.tableData[params.index].id,
                          }})
                      }
                    },
                    style:{
                      marginRight:'5px'
                    }
                  },"查看"),
                  h('Poptip', {
                    props: {
                      transfer: true,
                      confirm: true,
                      placement: 'left-end',
                      size: 'small',
                      title: '你确定要删除吗?'
                    },
                    on: {
                      'on-ok': () => {
                        this.deleteTableData(params.index)
                      }
                    }
                  }, [h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  },'删除')]),
                ]
              }
            }

          ],
        }
      },
      methods: {
        clickNewQualityAccidentRecords(){
          this.$router.push({path: '/qualityControl/newQualityAccidentRecords'})
        },
        //删除数据
        deleteTableData(index){
          deleteTable(this.tableData[index].id).then(res => {
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
                this.tableData.splice(index, 1);
                this.getData(this.pageNum);
                this.$Message.success(data.msgContent);
                break;
            }
          });
        },
        // 获取全部数据
        getData(pageNum) {
          allData(JSON.parse(localStorage.getItem('projectId')).id,pageNum, this.pageSize, this.searchValue,).then(res => {
            const data = res.data
            if (data) {
              if (data.msgCode === 0) {
                console.log(data.msgData.content)
                this.totalElements = data.msgData.totalElements
                this.tableData = data.msgData.content
              }
            } else {
              this.$Message.error('服务器繁忙请稍后')
            }
          })
        },
        // 收搜
        searchCollection() {
          this.pageNum = 1
          this.getData(this.pageNum)
        },
        // 分页
        changePage(index) {
          this.pageNum = index
          this.getData(this.pageNum)
        },
      },
      mounted() {
        this.getData(this.pageNum)
      }
    }
</script>

<style scoped>

</style>

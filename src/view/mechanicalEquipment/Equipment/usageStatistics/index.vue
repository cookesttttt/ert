<template>
  <Card style="height: 100%">
    <div>
      <br>
      <Button type="primary" class="btn-margin" @click="clickDay(1)">当日</Button>
      <Button class="btn-margin" @click="clickMoon(2)">本月</Button>
      <Button class="btn-margin" @click="clickQuarter(3)">本季度</Button>
      <!--<Button class="btn-margin" @click="clickFree">自定义时间</Button>-->
    </div>
    <br>
    <Table border :columns="columns1" :data="tableData"></Table>
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
</template>

<script>
  import {paramsValidate, isDataSuccess, formatTime} from '@/libs/util'
  import {getAllData} from '@/api/Equipment/usageStatistics'
  export default {
    name: "index",
    data(){
      return {
        status:1,
        columns1: [
          {
            type: 'index',
            width: 60,
            align: 'center',
          },
          {
            title: '设备名称',
              tooltip:true,
            key: 'name'
          },
          {
            title: '设备型号',
              tooltip:true,
            key: 'model'
          },
          {
            title: '设备功率',
              tooltip:true,
            key: 'power'
          },
          {
            title: '台班数',
              width:'130',
            key: 'machineWorkCount'
          },
          {
            title: '操作人员',
            key: 'operator',
            width:100
          },
          {
            title: '安全人员',
            key: 'safetyOfficer',
            width:100
          },
        ],
        pageNum: 1,                     // 当前页码
        pageSize: 10,                  // 每页显示多少条
        totalElements: 0,             // 初始化信息总条数
        tableData:[],
        time:'',
      }
    },
    methods:{
      clickDay(status){
        this.status=status
        this.getData(this.pageNum)
      },
      clickMoon(status){
        this.status=status
        this.getData(this.pageNum)
      },
      clickQuarter(status){
        this.status=status
        this.getData(this.pageNum)
      },
      clickFree(){
        // this.time=status
        this.getData(this.pageNum)
      },
      /**
       * 分页
       * */
      changePage(index) {
        this.pageNum = index
        this.getData(this.pageNum)
      },
      getData(pageNum){
        let parameter={
          "checkType":this.status,
          "currentPage": pageNum,
          "pageSize":this.pageSize,
          "usingDate": this.time
        }
        getAllData(JSON.parse(localStorage.getItem("projectId")).id,parameter).then(res=>{
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
              console.log(res.data)
              this.tableData = data.msgData.content
              this.totalElements = data.msgData.totalElements
              break;
          }
        })
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
        this.time = year + seperator1 + month + seperator1 + strDate
      },
    },
    mounted(){
      this.getNowTime()
      this.getData(this.pageNum)
    },
  }
</script>

<style scoped>
  .btn-margin {
    margin-left: 10px;
  }
  .page{
    margin: 10px;
    overflow: hidden
  }
  .right{
    float: right;
  }
</style>

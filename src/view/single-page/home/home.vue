<template>
  <div>
    <Row :gutter="20">
      <i-col
        :xs="12"
        :md="8"
        :lg="4"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px;padding-bottom: 10px;"
      >
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" style="font-size: 40px" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <!-- <chart-pie style="height: 300px;" :value="pieData" text="本年度费用统计"></chart-pie> -->
          <div class="userInfo">
            <p style="font-weight: 700;color:#516b91;font-size:16px;text-align:center;">
              <span style="cursor:pointer;" @click="gotoProjectInfo">{{user.projectName}}</span>
            </p>
            <p>
              <span style="display:inline-block;width:100px;text-align:right;">创建人：</span>
              <span style="display:inline-block;width:230px;text-align:left;">{{user.creator}}</span>
            </p>
            <p>
              <span style="display:inline-block;width:100px;text-align:right;">企业名称：</span>
              <span style="display:inline-block;width:230px;text-align:left;">{{user.companyName}}</span>
            </p>
            <p>
              <span style="display:inline-block;width:100px;text-align:right;">我的岗位：</span>
              <span
                style="display:inline-block;width:230px;text-align:left;"
              >{{getJob(user.jonInfo)}}</span>
            </p>
            <p
              style="color:rgb(255, 153, 0);font-weight: bold;"
              v-if="user.admin"
            >系统管理员( 有权限维护项目成员 )</p>
            <p v-if="user.admin">
              <span style="display:inline-block;width:230px;text-align:center;">{{user.creator}}</span>
            </p>
          </div>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="本年度产值统计" />
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;" />
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import { isDataSuccess } from '@/libs/util'
import { getUserInfo } from '@/api/financial/budgeting/costBudget'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      user: {},
      inforCardData: [
        { title: '项目成员', icon: 'md-person-add', count: 18, color: '#2d8cf0' },
        { title: '合同金额(万元)', icon: 'md-locate', count: 900, color: '#19be6b' },
        { title: '结算累计(万元)', icon: 'md-help-circle', count: 560, color: '#ff9900' },
        { title: '收款累计(万元)', icon: 'md-share', count: 500, color: '#ed3f14' },
        { title: '实际成本(万元)', icon: 'md-chatbubbles', count: 450, color: '#E46CBB' },
        { title: '剩余工期(月)', icon: 'md-map', count: 18, color: '#9A66E4' }
      ],
      pieData: [
        { value: 335, name: '机械设备' },
        { value: 310, name: '间接费用' },
        { value: 234, name: '人工费' },
        { value: 135, name: '利润' },
        { value: 1548, name: '材料费' }
      ],
      barData: {
        '一月': 23253,
        '二月': 24235,
        '三月': 26321,
        '四月': 22340,
        '五月': 24643,
        '六月': 28220,
        '七月': 21240,
        '八月': 23240,
        '九月': 24240,
        '十月': 25240,
        '十一月': 26240,
        '十二月': 27240
      }
    }
  },
  methods: {
    gotoProjectInfo () {
      this.$router.push({
        name: '项目信息'
      })
    },
    getJob (job) {
      if (job) {
        return job.join()
      }
    }
  },
  mounted () {
    getUserInfo(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      console.log(1)

      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.user = res.data.msgData
          this.user.creator = this.user.creator.replace('/', ' / ')
          console.log(this.user.creator.replace('/', ' / '))
          break
      }
    })
  }

}
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
.userInfo {
  width: 100%;
  height: 300px;
  p {
    font-family: '黑体';
    font-size: 14px;
    color: #9e9e9e;
    margin-bottom: 20px;
    text-align: center;
  }
}
</style>

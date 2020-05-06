<template>
  <card class="bigBox">
    <h2 class="title">开始</h2>
    <p style="margin:20px auto">现在，正式开启你的工程项目管理之旅！在开始工作之前你需要完善如下初始化设置：</p>
    <el-steps direction="vertical" :active="0" class="steps">
      <el-step title="个人入职" status="process" style="font-size:20px">
        <span slot="description" class="descriptionClass" style="padding-right:0">
          <span>
            明确你的部门、岗位、职责信息。以后可以通过菜单"
            <label style="color:#409eff">基础设置-个人信息</label> "进行修改。
          </span>
          <Button style="margin-left:20px;" @click="goToSet(1)">去设置</Button>
        </span>
      </el-step>
      <el-step title="部门维护" status="process">
        <span slot="description" class="descriptionClass">
          <span>
            项目经理需要对部门信息进行维护，以后可以通过"
            <label style="color:#409eff">基础设置 - 组织机构</label> "进行修改。项目经理入职之前只能使用系统给定的默认部门信息。
          </span>
          <Button style="margin-left:20px;" @click="goToSet(2)">去设置</Button>
        </span>
      </el-step>
      <el-step title="岗位维护" status="process">
        <span slot="description" class="descriptionClass">
          <span>项目经理可以维护所有岗位信息，部门负责人可以维护自己部门的岗位信息。</span>
          <Button style="margin-left:20px;" @click="goToSet(3)">去设置</Button>
        </span>
      </el-step>
      <el-step title="通讯录" status="process">
        <span slot="description" class="descriptionClass">
          <span>
            完善你所在部门的同事信息，系统对他们发起协同工作的邀请。设置完成后也可以在菜单"
            <label style="color:#409eff">基础设置-通讯录</label> "添加更多项目部其他同事。
          </span>
          <Button style="margin-left:20px;" @click="goToSet(4)">去设置</Button>
        </span>
      </el-step>
    </el-steps>
    <div>
      <p style="margin-top:30px">
        <Button
          type="primary"
          style="width:300px"
          @click="startWork"
          :disabled="savedState"
        >{{statusTxt}}</Button>
      </p>
    </div>
  </card>
</template>

<script>
import { isDataSuccess } from '@/libs/util'
import { getItemState, putItemState } from '@/api/welcome/welcome.js'
export default {
  data () {
    return {
      savedState: false,
      status: {
      },
      statusTxt: '我已完成，开启工作'
    }
  },
  methods: {
    goToSet (status) {
      switch (status) {
        case 1:
          this.$router.push({
            name: '个人信息',
            query: {
              status: JSON.stringify(this.status)
            }
          })
          break
        case 2:
          switch (this.status.deptStatus) {
            case -1:
              this.$Message.info('您没有权限操作部门维护')
              break
            default:
              this.status.deptStatus = 1
              putItemState(JSON.parse(localStorage.getItem('projectId')).id, this.status).then(res => {
                let status = isDataSuccess(res)
                switch (status) {
                  case 1:
                    this.$Message.error('服务器繁忙请稍后')
                    break
                  case 2:
                    this.$Message.error(data.msgContent)
                    break
                }
              })
              this.$router.push({
                name: 'Departmentmaintenance'
              })
              break
          }
          break
        case 3:
          switch (this.status.jobStatus) {
            case -1:
              this.$Message.info('您没有权限操作岗位维护')
              break
            default:
              this.status.jobStatus = 1
              putItemState(JSON.parse(localStorage.getItem('projectId')).id, this.status).then(res => {
                let status = isDataSuccess(res)
                switch (status) {
                  case 1:
                    this.$Message.error('服务器繁忙请稍后')
                    break
                  case 2:
                    this.$Message.error(data.msgContent)
                    break
                }
              })
              this.$router.push({
                name: 'Postmaintenance'
              })
              break
          }
          break
        case 4:
          if (this.status.postStatus === 1) {
            this.status.contactStatus = 1
            putItemState(JSON.parse(localStorage.getItem('projectId')).id, this.status).then(res => {
              let status = isDataSuccess(res)
              switch (status) {
                case 1:
                  this.$Message.error('服务器繁忙请稍后')
                  break
                case 2:
                  this.$Message.error(res.data.msgContent)
                  break
              }
            })
            this.$router.push({
              name: 'addressList'
            })
          } else {
            this.$Message.info('请先完成个人信息入职')
          }
          break
      }
    },
    startWork () {
      if (this.status.postStatus === 1) {
        this.$Message.success('成功')
        this.$store.dispatch('getMenuData')
        this.statusTxt = '已设置'
        this.savedState = true
      } else {
        this.$Message.error('请先完成个人入职')
      }
    }
  },
  mounted () {
    $('.el-step__description').css('padding-right', '0')
    window.addEventListener('beforeunload', e => {

    })
  },
  created () {
    getItemState(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
      let status = isDataSuccess(res)
      switch (status) {
        case 1:
          this.$Message.error('服务器繁忙请稍后')
          break
        case 2:
          this.$Message.error(res.data.msgContent)
          break
        default:
          this.status = res.data.msgData
      }
    })
  }
}
</script>

<style lang="less" scoped>
.bigBox {
  height: 760px;
  display: flex;
  justify-content: center;
  text-align: center;
  .steps {
    height: 300px;
    margin-top: 50px;
  }
}
.title {
  display: inline-block;
  margin: 0 auto;
}
// .descriptionClass {
//   display: inline-block;
//   width: 500px;
//   span {
//     display: inline-block;
//     width: 400px;
//   }
// }
</style>

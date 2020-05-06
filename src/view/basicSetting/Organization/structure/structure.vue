<template>
  <Card shadow
        style="height: 100%;width: 100%;overflow:hidden">
    <div class="department-outer">
      <div class="zoom-box">
        <zoom-controller v-model="zoom"
                         :min="20"
                         :max="200"></zoom-controller>
      </div>
      <div class="view-box">
        <div class="buttonTeam">
          <!-- <ButtonGroup size='large'> -->
          <Button @click="goto('userTable')">
            <Icon type="ios-cog-outline"
                  size='18'
                  style='margin-right:5px;margin-bottom:2px' />维护组织架构</Button>
          <!-- <Button @click="goto('userTable')">
              <Icon type="ios-card-outline"
                    size='18'
                    style='margin-right:5px;margin-bottom:2px' />列表视图查看</Button> -->
          <!-- </ButtonGroup> -->
        </div>
        <org-view v-if="data"
                  :data="data"
                  :zoom-handled="zoomHandled"></org-view>
      </div>
    </div>
  </Card>
</template>

<script>
import OrgView from './org-view.vue'
import ZoomController from './zoom-controller.vue'
import { isDataSuccess } from '@/libs/util'
import { getDepartmentAllData, getDepartmentAllUser, getJurisdiction } from '@/api/basicSetting/structure'
import './index.less'
export default {
  name: 'structure',
  components: {
    OrgView,
    ZoomController
  },
  data () {
    return {
      data: '',
      zoom: 100
    }
  },
  computed: {
    zoomHandled () {
      return this.zoom / 100
    }
  },
  methods: {
    getDepartmentData () {
      getDepartmentAllUser(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
        let status = isDataSuccess(res)
        switch (status) {
          case 1:
            this.$Message.error('服务器繁忙请稍后')
            break
          case 2:
            this.$Message.error(res.data.msgContent)
            break
          default:
            const data = res.data
            if (data.msgCode === 0) {
              this.data = data.msgData
            }
        }
      })
    },
    dataChange (data, i) {
      data.forEach(res => {
        i++
        res.id = i
        if (res.children !== null) {
          this.dataChange(res.children, i)
        }
      })
    },
    goto (path) {
      if (path === 'OrganizationMaintenance') {
        getJurisdiction(JSON.parse(localStorage.getItem('projectId')).id, 1).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              switch (res.data.msgData) {
                case -1:
                  this.$Message.error('服务器繁忙请稍后')
                  break
                case 0:
                  this.$Message.error('您暂时无权查看项目成员')
                  break
                case 1:
                  this.$router.push({
                    path: path
                  })
                  break
                case 2:
                  this.$router.push({
                    path: path
                  })
                  break
                case 3:
                  this.$router.push({
                    path: path
                  })
                  break
              }
              break
          }
        })
      } else {
        getJurisdiction(JSON.parse(localStorage.getItem('projectId')).id, 2).then(res => {
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error('服务器繁忙请稍后')
              break
            case 2:
              this.$Message.error(res.data.msgContent)
              break
            default:
              switch (res.data.msgData) {
                case -1:
                  this.$Message.error('服务器繁忙请稍后')
                  break
                case 0:
                  this.$Message.error('您暂时无权查看组织架构')
                  break
                case 1:
                  this.$router.push({
                    path: path
                  })
                  break
                case 2:
                  this.$router.push({
                    path: path
                  })
                  break
                case 3:
                  this.$router.push({
                    path: path
                  })
                  break
              }
              break
          }
        })
      }
    }
  },
  created () {
    this.getDepartmentData()
    if (document.body.clientWidth < 1400) {
      this.zoom = 60
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'structure') {
        this.getDepartmentData()
      }
    }
  }
}
</script>

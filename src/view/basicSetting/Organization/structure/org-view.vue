<template>
  <div
    ref="dragWrapper"
    class="org-tree-drag-wrapper"
    @mousedown="mousedownView"
    @contextmenu="handleDocumentContextmenu"
  >
    <div class="org-tree-wrapper" :style="orgTreeStyle">
      <v-org-tree
        v-if="data"
        :data="data.departmentAndJobAndTeamer"
        :horizontal="horizontal"
        :node-render="nodeRender"
        :expand-all="true"
      ></v-org-tree>
    </div>
  </div>
</template>

<script>
import { on, off } from '@/libs/tools'
import { spawn } from 'child_process'
export default {
  name: 'OrgView',
  props: {
    zoomHandled: {
      type: Number,
      default: 1
    },
    data: Object
  },
  data () {
    return {
      horizontal: false,
      orgTreeOffsetLeft: 0,
      // currentContextMenuId: '',
      orgTreeOffsetTop: 0,
      initPageX: 0,
      initPageY: 0,
      oldMarginLeft: 0,
      oldMarginTop: 0,
      canMove: false
    }
  },
  computed: {
    orgTreeStyle () {
      return {
        transform: `translate(-50%, -50%) scale(${this.zoomHandled}, ${
          this.zoomHandled
          })`,
        marginLeft: `${this.orgTreeOffsetLeft}px`,
        marginTop: `${this.orgTreeOffsetTop}px`
      }
    }
  },
  methods: {
    handleNodeClick (e, data, expand) {
      expand()
    },
    nodeRender (h, data) {
      if (data.maxHeight) {
        if (data.jobList) {
          let MaxHeight = data.maxHeight * 25 + 80 + 'px'
          return (
            <div class={'custom-org-node'} style={{ height: `${MaxHeight}` }}>
              < div
                on-mousedown={event => event.stopPropagation()}
                on-contextmenu={this.contextmenu.bind(this, data)}
                class={'mb10 fz14'}
              >
                {data.deptName}
              </div>
              <table class={'jobTable'} border="1" cellspacing="0"><tr><td class={'jobName'} style={''}> &nbsp;岗位名称</td> <td class={'teamerName'}>姓名</td></tr>
                {data.jobList.map(item => {
                  return (
                    <tr><td class={'jobName'}> &nbsp;{item.jobName}</td><td class={'teamerName'}> {this.getUserName(item.teamerName)}</td></tr>
                  )
                })}
              </table>
            </div >
          )
        } else {
          let MaxHeight = data.maxHeight * 25 + 80 + 'px'
          return (
            <div class={'custom-org-node'} style={{ height: `${MaxHeight}` }}>
              <div
                on-mousedown={event => event.stopPropagation()}
                on-contextmenu={this.contextmenu.bind(this, data)}
                class={'mb10 fz14'}
              >
                {data.deptName}
              </div>

              <table class={'jobTable'} border="1" cellspacing="0"><tr><td class={'jobName'} style={''}> &nbsp;岗位名称</td> <td class={'teamerName'}>姓名</td></tr>
                <tr><td class={'jobName'}> &nbsp;暂无岗位</td><td class={'teamerName'}> - </td></tr>
              </table>
            </div >
          )
        }
      } else {
        if (data.jobList) {
          return (
            <div class={'custom-org-node'} >
              < div
                on-mousedown={event => event.stopPropagation()}
                on-contextmenu={this.contextmenu.bind(this, data)}
                class={'mb10 fz14'}
              >
                {data.deptName}
              </div>

              <table class={'jobTable'} border="1" cellspacing="0"><tr><td class={'jobName'} style={''}> &nbsp;岗位名称</td> <td class={'teamerName'}>姓名</td></tr>
                {data.jobList.map(item => {
                  return (
                    <tr><td class={'jobName'}> &nbsp;{item.jobName}</td><td class={'teamerName'}> {this.getUserName(item.teamerName)}</td></tr>
                  )
                })}
              </table>
            </div>
          )
        } else {
          return (
            <div class={'custom-org-node'} >
              <div
                on-mousedown={event => event.stopPropagation()}
                on-contextmenu={this.contextmenu.bind(this, data)}
                class={'mb10 fz14'}
              >
                {data.deptName}
              </div>
              <table class={'jobTable'} border="1" cellspacing="0"><tr><td class={'jobName'} style={''}> &nbsp;岗位名称</td> <td class={'teamerName'}>姓名</td></tr>
                <tr><td class={'jobName'}> &nbsp;暂无岗位</td><td class={'teamerName'}> - </td></tr>
              </table>
            </div >
          )
        }
      }
    },
    contextmenu (data, $event) {
      let event = $event || window.event
      event.preventDefault
        ? event.preventDefault()
        : (event.returnValue = false)
      this.currentContextMenuId = data.id
    },
    setDepartmentData (data) {
      data.isRoot = true
      this.departmentData = data
    },
    mousedownView (event) {
      this.canMove = true
      this.initPageX = event.pageX
      this.initPageY = event.pageY
      this.oldMarginLeft = this.orgTreeOffsetLeft
      this.oldMarginTop = this.orgTreeOffsetTop
      on(document, 'mousemove', this.mousemoveView)
      on(document, 'mouseup', this.mouseupView)
    },
    mousemoveView (event) {
      if (!this.canMove) return
      const { pageX, pageY } = event
      this.orgTreeOffsetLeft = this.oldMarginLeft + pageX - this.initPageX
      this.orgTreeOffsetTop = this.oldMarginTop + pageY - this.initPageY
    },
    mouseupView () {
      this.canMove = false
      off(document, 'mousemove', this.mousemoveView)
      off(document, 'mouseup', this.mouseupView)
    },
    handleDropdownClick (event) {
      event.stopPropagation()
    },
    handleDocumentContextmenu () {
      this.canMove = false
    },
    handleContextMenuClick (data, key) {
      this.$emit('on-menu-click', { data, key })
    },
    getUserName (name) {
      if (name) {
        return name
      } else {
        return '-'
      }
    },
    putMaxHeight (level, data) {
      if (level <= Object.keys(this.data.levelHeight).length) {
        data.forEach(res => {
          res.maxHeight = this.data.levelHeight[level]
          if (res.children) {
            this.putMaxHeight(level + 1, res.children)
          }
        })
      }
    }
  },
  mounted () {
    if (screen.availWidth < 1400) {
      this.orgTreeOffsetTop = 100
    } else {
      this.orgTreeOffsetTop = 0
    }
    on(document, 'contextmenu', this.handleDocumentContextmenu)
  },
  created () {
    // this.fontParent(this.data.departmentAndJobAndTeamer)
    if (this.data.departmentAndJobAndTeamer) {
      // this.data.departmentAndJobAndTeamer.children.forEach(res => {
      //   res.maxHeight = this.data.levelHeight[1]
      //   if (res.children) {
      //     res.children.forEach(sonRes => {
      //       sonRes.maxHeight = this.data.levelHeight[2]
      //     })
      //   }
      // })
      this.putMaxHeight(1, this.data.departmentAndJobAndTeamer.children)
    }
  },
  watch: {
    data (val) {
      if (val.departmentAndJobAndTeamer) {
        // val.departmentAndJobAndTeamer.children.forEach(res => {
        //   res.maxHeight = val.levelHeight[1]
        //   if (res.children) {
        //     res.children.forEach(sonRes => {
        //       sonRes.maxHeight = val.levelHeight[2]
        //     })
        //   }
        // })
        this.putMaxHeight(1, val.departmentAndJobAndTeamer.children)
      }
    }
  },
  beforeDestroy () {
    off(document, 'contextmenu', this.handleDocumentContextmenu)
  }
}
</script>

<style>
</style>

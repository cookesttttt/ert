<template>
  <!-- <span class="tree-menu">
    <div v-if="depth === 0" style="display: flex;justify-content:center">
      <div class="itemClass" v-for="item in data" :id="item.deptName">
        <span>{{item.deptName}}</span>
      </div>
    </div>
    <div v-else-if="depth === 1" style="display: flex;justify-content:center">
      <div style="width:320px">
        <div
          class="itemClass"
          v-for="item in data"
          v-if="item.deptName === '项目副经理办公室'"
          :id="item.deptName"
        >
          <span>{{item.deptName}}</span>
        </div>
      </div>
      <div style="width:320px;display: flex;justify-content:center; margin: 30px 0px;" id="center">
        <div
          class="itemClass2"
          v-for="item in data"
          v-if="item.deptName === '财务办公室' || item.deptName === '总工办公室'"
        >
          <span>{{item.deptName}}</span>
        </div>
      </div>
      <div style="width:320px;display: flex;justify-content:center">
        <div
          v-for="item in data"
          v-if="item.deptName === '总工办公室'"
          class="itemClass"
          :id="item.deptName"
        >
          <span>{{item.deptName}}</span>
        </div>
      </div>
    </div>
    <span
      v-else
      :style="indent"
      class="itemClass"
      :id="item.deptName"
      v-for="item in data"
    >{{ item.deptName }}</span>

    <tree-menu
      v-for="item in data"
      :data="item.children"
      :id="item.deptName"
      :depth="depth + 1"
      :allData="allData"
    ></tree-menu>
  </span>-->
  <div>
    <div v-for="(item) in allLeavl">
      <div v-if="item === 1" style="display: flex;justify-content:center">
        <div v-for="data in textTreeData">
          <div class="itemClass" :id="data.deptName" v-if="data.leavl === item">{{data.deptName}}</div>
        </div>
      </div>
      <div v-else-if="item === 2" style="display: flex;justify-content:center">
        <div style="width:320px">
          <div
            class="itemClass"
            v-for="(data,index) in textTreeData"
            v-if="data.leavl === item && data.deptName === '项目副经理办公室'"
            :id="data.deptName"
          >
            <span>{{data.deptName}}</span>
          </div>
        </div>
        <div
          style="width:320px;display: flex;justify-content:center; margin: 30px 0px;"
          id="center"
        >
          <div
            class="itemClass2"
            v-for="(data,index) in textTreeData"
            v-if="data.leavl === item && data.deptName === '财务办公室' || data.deptName === '总工办公室'"
          >
            <span>{{data.deptName}}</span>
          </div>
        </div>
        <div style="width:320px;display: flex;justify-content:center">
          <div
            v-for="(data,index) in textTreeData"
            v-if="data.leavl === item && data.deptName === '总工办公室'"
            class="itemClass"
            :id="data.deptName"
          >
            <span>{{data.deptName}}</span>
          </div>
        </div>
      </div>
      <div v-else style="display: flex;justify-content:center">
        <div
          class="itemClass"
          v-for="data in textTreeData"
          v-if="data.leavl === item"
          :id="data.deptName"
        >
          <span>{{data.deptName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  props: ['allData', 'textTreeData', 'allLeavl'],

  name: 'tree-menu',

  computed: {
    indent () {
      //  transform: `translate(${this.depth * 50}px,${this.depth * 50}px)`,
      return { position: 'relative', top: `${(this.depth - 2) * 120}px`, display: 'inline-block' }
    }
  },
  mounted () {
    var _this = this
    this.$nextTick(() => {
      jsPlumb.ready(function () {
        var option = { radius: 1, curviness: 0.1 }
        var top_left_config = {
          endpoint: ['Dot', { radius: option.radius }], // Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
          connector: ['Flowchart', { curviness: option.curviness }], // Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
          anchor: ['Top', 'Left'] // Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
        }
        var top_right_config = {
          endpoint: ['Dot', { radius: option.radius }], // Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
          connector: ['Flowchart', { curviness: option.curviness }], // Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
          anchor: ['Top', 'Right'] // Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
        }
        var top_bottom_config = {
          endpoint: ['Dot', { radius: option.radius }], // Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
          connector: ['Flowchart', { curviness: option.curviness }], // Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
          anchor: ['Top', 'Bottom'] // Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
        }
        var bottom_top_config = {
          endpoint: ['Dot', { radius: option.radius }], // Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
          connector: ['Flowchart', { curviness: option.curviness }], // Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
          anchor: ['Bottom', 'Top'] // Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
        }
        var bottom_bottom_config = {
          endpoint: ['Dot', { radius: option.radius }], // Dot（点端点）默认半径radius=10像素,Rectangle（矩形端点）默认宽度默认20像素
          connector: ['Flowchart', { curviness: option.curviness }], // Bezier贝赛尔曲线，curviness描述弯曲度。Straight直线，Flowchart（流程图）
          anchor: ['Bottom', 'Bottom'] // Top TopRight Right BottomRight Bottom BottomLeft Left TopLeft Center,AutoDefault
        }
        // 原则：先左右，后上下。重叠算在一条线上。
        connect('项目经理办公室', 'center', top_bottom_config)
        connect('项目副经理办公室', '总工办公室', bottom_bottom_config)
        // _this.textTreeData[1].list.forEach(res => {
        //   if (res.type === 'right') {
        //
        //   } else if (res.type === 'left') {
        //     connect('项目经理', res.name, top_right_config);
        //   }
        // })
        // _this.textTreeData.forEach((res, index) => {
        //   if (index > 1) {
        //     res.list.forEach(item => {
        //       connect('center', item.name, bottom_top_config);
        //     })
        //   }
        // })
        console.log(_this.allData)
        if (_this.allData[0]) {
          getNewData(_this.allData[0])
        }
        function getNewData (data) {
          if (data.children) {
            data.children.forEach(res => {
              if (res.deptName === '项目副经理办公室') {
                connect('项目经理办公室', '项目副经理办公室', top_left_config)
                if (res.children) {
                  getNewData(res)
                }
              } else if (res.deptName === '总工办公室') {
                connect('项目经理办公室', '总工办公室', top_right_config)
                if (res.children) {
                  getNewData(res)
                }
              } else if (res.deptName === '财务办公室') {
                connect('项目经理办公室', 'center', top_bottom_config)
                if (res.children) {
                  getNewData(res)
                }
              } else {
                connect(data.deptName, res.deptName, top_bottom_config)
                if (res.children) {
                  getNewData(res)
                }
              }
            })
          }
        }
      })
      function connect (from, to, config) {
        jsPlumb.connect({
          source: from,
          target: to,
          paintStyle: { stroke: '#ccc', strokeWidth: 2 } // 连线的样式
          // overlays: [['Arrow', { width: 12, length: 10, location: 1 }]] //连线箭头。支持多个箭头，所以数组。location=1箭头在末尾，0.5在中间
        }, config)
      }
    })
  },
  methods: {

  }

}

</script>

<style lang="less" scoped>
.itemClass {
  height: 60px;
  width: 100px;
  border: 1px solid #ccc;
  display: inline-block;
  vertical-align: top;
  margin: 30px;
}
.itemClass2 {
  height: 60px;
  width: 100px;
  border: 1px solid #ccc;
  display: inline-block;
  vertical-align: top;
}
</style>

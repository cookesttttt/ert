<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left;height:156px"></div>
  </div>
</template>
<script>
  import E from 'wangeditor'
  export default {
    name: 'editorElem',
    data () {
      return {
        editor: null,
        editorContent: ''
      }
    },
    props: ['catchData', 'content'],    // 接收父组件的方法
    watch: {
      content () {

        this.editor.txt.html(this.content)
      }
    },
    mounted () {
      this.editor = new E(this.$refs.editorElem)
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.catchData(this.editorContent)  // 把这个html通过catchData的方法传入父组件
      }
      this.editor.customConfig.zIndex = 100
      this.editor.customConfig.menus = [          // 菜单配置
        'head',  // 标题
        'bold',  // 粗体
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'foreColor',  // 文字颜色
        'list',  // 列表
        'justify',  // 对齐方式
        'table',  // 表格
        'undo',  // 撤销
      ]
      this.editor.create()     // 创建富文本实例
      if (!this.content) {
        this.editor.txt.html('请编辑内容')
      }
    }
  }
</script>
<style rel="stylesheet/scss">
  #wangeditor {
    width: 90%;
    height: 180px;
  }
  .w-e-text-container{
    height: 200px !important;
  }
  .w-e-toolbar .w-e-menu {
    padding: 5px 9px !important;
  }
</style>

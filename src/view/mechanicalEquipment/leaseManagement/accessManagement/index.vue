<template>
  <Card style="height: 100%">
    <br>
    <Button
      :type="btntype"
      :size="size"
      :disabled="disabled"
      @click="clickBtn"
      :html-type="nativeType"
      :class="className"
      :icon="iconName"
    >&nbsp;
      {{title}}
    </Button>
    <br><br>
    <!--表格-->
    <Table
      :width='width'
      :height='height'
      :stripe='stripe'
      :border='border'
      :disabled-hover='disabledHover'
      :highlight-row='highlightRow'
      :columns="columns"
      :data="list"
      @on-selection-change="seclectChange"
      @on-row-click='rowClick'
      @on-row-dblclick='rowdblclick'
      @on-current-change='currentChange'
      @on-select-all='selectAll'
      @on-select-all-cancel='selectAllCancel'
      @on-sort-change='sortChange'
      @on-filter-change='filterChange'>
      <template slot-scope="{ row, index}" slot="operation">
        <Button size="small" type="primary" @click="clickBJ(row)" style="margin-right:5px;">编辑</Button>
        <Button size="small" @click="clickCK(row)" style="margin-right:5px;" v-if="showViewBtn">查看</Button>
        <Poptip
          :confirm="true"
          :transfer="true"
          title="你确定要删除吗?"
          placement="left-end"
          size="small"
          @on-ok="clickOK(row)">
          <Button size="small" type="error">删除</Button>
        </Poptip>
      </template>
    </Table>
    <br>
    <div class="page">
      <div class="right">
        <Page :total="pager[pageData.total]"
              :current="pager[pageData.page]"
              :page-size="pager[pageData.rows]"
              :show-total="pagingOption.showTotal"
              @on-page-size-change="onChangeSize"
              v-if="pagingOption.showPaging"
              @on-change="onChangePage">
        </Page>
      </div>
    </div>
  </Card>
</template>

<script>
  export default {
    name: "accessManagement",
    props: {
      //按钮
      btntype: {  //type	类型	string	primary / success / warning / danger / info / text
        type: String,
        default: 'primary'
      },
      size: {           //按钮大小，可选值为large、small、default或者不设置
        type: String,
        default: 'default'
      },
      disabled: {        //是否禁用状态	boolean
        type: Boolean,
        default: false
      },
      nativeType: {    //原生 type 属性	string	button / submit / reset
        type: String,
        default: 'button'
      },
      className: {       //class
        type: String,
        default: 'search-btn'
      },
      iconName: {  //icon	图标类名	string
        type: String,
        default: ''
      },

      title: {         //按钮Name
        type: String,
        default: ''
      },


      // 表格
      showViewBtn:{
        type: Boolean,
        default: false
      },
      columns: Array, // 表头数据
      list: Array, // 表格数据
      width: [Number, String],//表格宽度
      height: [Number, String],//表格高度，单位 px，设置后，如果表格内容大于此值，会固定表头-***注意传进来是number的有滚动条，px的没有
      stripe: { // 是否显示间隔斑马纹
        type: Boolean,
        default: false
      },
      border: { // 是否显示纵向边框
        type: Boolean,
        default: false
      },
      disabledHover: { // 禁用鼠标悬停时的高亮
        type: Boolean,
        default: false
      },
      highlightRow: { // 是否支持高亮选中的行，即单选
        type: Boolean,
        default: false
      },

    // 分页
      pager: {
        type: Object,
        required: false,
        default : function () {
          return {
            page: 1,   // 第几页
            rows: 10,   // 显示条数
            total: 1000, // 总记录条数
          }
        }
      },
      pagingOption: {           //是否显示分页与总条数
        type: Object,
        default: function () {
          return {
            showPaging: true,
            showTotal: true
          }
        }
      },
      pageData:{
        type:Object,
        required: false,
        default: () => ({
          page: 'page',   // 第几页
          rows: 'rows',   // 显示条数
          total: 'count', // 总记录条数
        })
      },
    },
    // 设置绑定参数
    model: {
      prop: 'pager',
      event: 'setPager',
    },
    computed: {
      total() {
        return this.pager[this.pageData.total] || 0;
      },
      // 检测获取到的数据是否为空
      isEmptyList() {
        return Math.ceil(this.pager[this.pageData.total] / this.pager[this.pageData.rows]) < this.pager[this.pageData.page];
      },
    },
    watch: {
      total() {
        // 存在记录但未获取到数据时, 重新请求
        if (this.pager[this.pageData.page] > 1 && this.isEmptyList) {
          this.$emit('setPager', Object.assign(this.pager, {
            [this.pageData.page]: this.pager[this.pageData.page] - 1,
          }));
        }
      },
    },
    methods: {
      //按钮点击事件
      clickBtn() {
        this.$emit('onClickBtn', {})
      },
      /**
       * 自带事件
       */
      rowClick(data, index) { //单击某一行时触发,data==当前行数据，index==当前行的下标
        let str = {
          'data': data,
          'index': index
        }
        this.$emit("rowClick", str)
      },
      rowdblclick(data, index) { //双击击某一行时触发,data==当前行数据，index==当前行的下标
        let str = {
          'data': data,
          'index': index
        }
        this.$emit("rowdblclick", str)
      },
      currentChange(currentRow, oldCurrentRow) { //开启 highlight-row 后有效，当表格的当前行发生变化的时候会触发,currentRow==当前高亮行数据，oldCurrentRow==上次高亮行数据
        let str = {
          'data': currentRow,
          'oldData': oldCurrentRow
        }
        this.$emit("currentChange", str)
      },
      seclectChange(selection) { //在多选模式下有效，只要选中项发生变化时就会触发,selection==已选项数据
        let str = {
          'data': selection
        }
        this.$emit("selectionData", str)
      },
      selectAll(selection) { //在多选模式下有效，点击全选时触发,selection：已选项数据
        let str = {
          'data': selection
        }
        this.$emit("selectAll", str)
      },
      selectAllCancel(selection) {//在多选模式下有效，取消点击全选时触发,selection：已选项数据
        let str = {
          'data': selection
        }
        this.$emit("selectAllCancel", str)
      },
      sortChange(column, key, order) {//排序时有效，当点击排序时触发,column==当前列数据,key==排序依据的指标,order==asc/desc
        let str = {
          'column': column,
          'order': order,
          'key': key
        }
        this.$emit("sortChange", str)
      },
      filterChange(column) {//筛选时有效，筛选条件发生变化时触发,column==当前列数据
        let str = {
          'column': column
        }
        this.$emit("filterChange", str)
      },
      /**
       * slot事件
       */
      clickBJ(data) { //编辑点击事件
        this.$emit("clickBJ", data)
      },
      clickCK(data) {//查看点击事件
        this.$emit("clickCK", data)
      },
      clickOK(data) {
        this.$emit("clickOK", data)
      },

      // 每页条数
      onChangeSize(rows) {
        const temp = {
          [this.pageData.rows]: rows,
          // 当显示条数小于或等于总条数时，重置页数
          [this.pageData.page]: rows <= this.total ? 1 : this.pager[this.pageData.page],
        };
        this.$emit('setPager', Object.assign(this.pager, temp));
      },
      // 翻页
      onChangePage(page) {
        this.$emit('setPager', Object.assign(this.pager, { [this.pageData.page]: page }));
      },

    },
  }
</script>

<style scoped lang="less">
  .search-btn {
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

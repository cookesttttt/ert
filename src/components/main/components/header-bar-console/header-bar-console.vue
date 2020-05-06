<template>
  <div class="header-bar">
      <h1>ERT建筑工程管理云平台</h1>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from "./sider-trigger";
import customBreadCrumb from "./custom-bread-crumb";
import "./header-bar.less";
export default {
  name: "HeaderBar",
  components: {
    siderTrigger,
    customBreadCrumb
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList;
    }
  },
  methods: {
    handleCollpasedChange(state) {
      this.$emit("on-coll-change", state);
    }
  }
};
</script>
<style>
.ivu-layout-header {
  line-height: 28px !important;
  /* border: 1px solid #ccc; */
}
h1{
  position: absolute;
  bottom: 14px;
}

</style>

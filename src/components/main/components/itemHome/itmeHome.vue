<template>
  <div class="full-screen-btn-con">
    <Badge>
      <Button type="text" @click="openErrorLoggerPage">
        <Icon :size="14" type="md-notifications" style="margin-bottom:2px;" />
        <span style="margin-left:5px;font-size: 14px;">首页</span>
      </Button>
    </Badge>
  </div>
</template>

<script>
export default {
  name: 'itemHome',
  methods: {
    openErrorLoggerPage () {
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>

<style lang="less">
.full-screen-btn-con .ivu-tooltip-rel {
  height: 64px;
  line-height: 56px;
  i {
    cursor: pointer;
  }
}
</style>

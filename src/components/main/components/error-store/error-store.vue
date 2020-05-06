<template>
  <div class="error-store">
    <Badge :dot="hasRead">
      <Button type="text" @click="openErrorLoggerPage">
        <Icon :size="16" type="ios-chatbubbles" style="margin-bottom:2px;" />
        <span style="margin-left:5px;font-size:14px">消息</span>
      </Button>
    </Badge>
  </div>
</template>

<script>
export default {
  name: 'ErrorStore',
  props: {
    count: {
      type: Number,
      default: 1
    },
    hasRead: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  methods: {
    openErrorLoggerPage () {
      this.$router.push({
        name: 'error_logger_page'
      })
    }
  }
}
</script>

<style lang="less">
.error-store {
  margin-right: 12px;
  .ivu-badge-dot {
    top: 20px;
  }
  .ivu-btn.ivu-btn-text {
    padding: 5px 1px 6px;
  }
}
</style>

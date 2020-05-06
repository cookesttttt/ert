<template>
  <div class="full-screen-btn-con">
    <Badge>
      <Button type="text" @click="openErrorLoggerPage">
        <Icon :size="16" type="ios-people" style="margin-bottom:2px;" />
        <span class="link" style="font-size: 14px;margin-left: 5px;">通讯录</span>
      </Button>
    </Badge>
  </div>
</template>

<script>
export default {
  name: 'items',
  methods: {
    openErrorLoggerPage () {
      this.$router.push({
        name: 'addressList'
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
.link {
  color: #515a6e;
}
</style>

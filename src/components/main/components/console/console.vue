<template>
  <div class="full-screen-btn-con">
    <Badge>
      <Button type="text" @click="addressList()">
        <Icon :size="20" type="md-apps" />
        <span style="margin-left:5px;font-size: 14px;">控制台</span>
      </Button>
    </Badge>
  </div>
</template>

<script>
export default {
  name: 'items',
  methods: {
    addressList () {
      this.$router.push('/console/consoleHome')
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

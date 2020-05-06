<template>
  <div class="full-screen-btn-con">
    <Badge>
      <Button type="text">
        <Icon :size="14" type="logo-bitcoin" style="margin-bottom:2px;" />
        <span style="margin-left:5px;font-size: 14px;">续费</span>
      </Button>
    </Badge>
  </div>
</template>

<script>
export default {
  name: 'purchase',
  methods: {}
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

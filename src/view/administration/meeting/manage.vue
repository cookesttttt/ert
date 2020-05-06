<template>
  <Row>
    <Col span="6" offset="2">
      <Card class="center">
        <Button size="large" type="default" class="btn" @click="onButtonClick(1)">会议类别管理</Button>

        <Icon type="ios-settings" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="1" class="center">
      <Icon type="md-arrow-round-forward" size="45" />
    </Col>
    <Col span="11" class="center">
      <Card>
        <Button size="large" type="default" class="btn" @click="onButtonClick(2)">会议记录</Button>
        <Icon type="ios-document" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="18" offset="2" class="top">
      <Card class="center">
        <Col span="8">
          <Button size="large" type="default" class="btn">年季月会统计</Button>
        </Col>
        <Col span="8">
          <Button size="large" type="default" class="btn">会议类型统计</Button>
        </Col>
        <Col span="8"></Col>
        <Icon type="ios-share-alt" size="30" class="hs" />
      </Card>
    </Col>
  </Row>
</template>
<script>
export default {
  name: 'manage',
  /**
   * 按钮点击事件
   * @param {number} status 状态：1 会议类别管理 2 会议记录
   */
  methods: {
    onButtonClick (status) {
      switch (status) {
        case 1:
          this.$router.push({ path: '/administration/meeting/meetingCategory' })
          break
        case 2:
          this.$router.push({ path: '/administration/meeting/recordManagement' })
          break
        default:
          break
      }
    }
  }
}
</script>

<style src="../../index.css" scoped></style>

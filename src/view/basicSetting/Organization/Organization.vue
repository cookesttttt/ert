<template>
  <Row>
    <Col span="6" offset="2">
      <Card class="center">
        <Icon type="ios-settings" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="1" class="center">
      <Icon type="md-arrow-round-forward" size="45" />
    </Col>
    <Col span="11" class="center">
      <Card>
        <Col span="12">
          <Button size="large" type="default" class="btn" @click="onButtonClick(2)">部门维护</Button>
        </Col>
        <Col span="12">
          <Button size="large" type="default" class="btn" @click="onButtonClick(3)">岗位维护</Button>
        </Col>
        <Icon type="ios-document" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="18" offset="2" class="top">
      <Card class="center">
        <Col span="12">
          <Button size="large" type="default" class="btn" @click="onButtonClick(4)">组织架构</Button>
        </Col>
        <Col span="12">
          <Button size="large" type="default" class="btn" @click="onButtonClick(5)">通讯录</Button>
        </Col>
        <Icon type="ios-share-alt" size="30" class="hs" />
      </Card>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'Organization',

  methods: {
    /**
     * 按钮点击事件
     * @param {number} status 状态：1 高层维护 2 部门维护 3 岗位维护 4 组织架构
     */
    onButtonClick (status) {
      switch (status) {
        case 1:
          break
        case 2:
          this.$router.push({ path: '/basicSetting/Organizations/Departmentmaintenance' })
          break
        case 3:
          this.$router.push({ path: '/basicSetting/Organizations/Postmaintenance' })
          break
        case 5:
          this.$router.push({ path: '/address/addressList' })
          break
        default:
          this.$router.push({ path: '/basicSetting/Organizations/structure' })
          break
      }
    }
  }
}
</script>
<style src="../../index.css" scoped></style>

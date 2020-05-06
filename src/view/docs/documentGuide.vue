<template>
  <Row>
    <Col span="6" offset="2">
      <Card class="center">
        <Button size="large" type="default" class="btn" @click="onButtonClick(1)">文档目录管理</Button>
        <Icon type="ios-settings" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="1" class="center">
      <Icon type="md-arrow-round-forward" size="45" />
    </Col>
    <Col span="11" class="center">
      <Card class="center">
        <Col span="10">
          <Button size="large" type="default" class="btn" @click="onButtonClick(2)">文档管理</Button>
        </Col>
        <Col span="4" class="center">
          <Icon type="md-arrow-round-forward" size="45" />
        </Col>
        <Col span="10">
          <Button size="large" type="default" class="btn" @click="onButtonClick(3)">分享传阅</Button>
        </Col>
      </Card>
    </Col>
    <Col span="18" offset="2" class="top">
      <Card class="center">
        <Col span="8">
          <Button size="large" type="default" class="btn" @click="onButtonClick(4)">我的分享</Button>
        </Col>
        <Col span="8">
          <Button size="large" type="default" class="btn" @click="onButtonClick(5)">分享给我的</Button>
        </Col>
        <Col span="8">
          <Button size="large" type="default" class="btn" @click="onButtonClick(6)">我上传的</Button>
        </Col>
        <Icon type="ios-share-alt" size="30" class="hs" />
      </Card>
    </Col>
  </Row>
</template>
<script>
import Icons from '_c/icons'

export default {
  name: 'documents',
  components: {
    Icons
  },
  /**
   * 按钮点击事件
   * @param {number} status 状态：1 文档目录管理 2 文档管理 3 分享传阅 4 我的分享 5 分享给我的 6 我上传的
   */
  methods: {
    onButtonClick (status) {
      switch (status) {
        case 1:
          this.$router.push({ path: '/doc/directory' })
          break
        case 2:
          this.$router.push({ path: '/doc/documentation' })
          break
        case 3:
          this.$router.push({ path: '/doc/documentation' })
          break
        case 4:
          this.$router.push({ path: '/doc/Myshare' })
          break
        case 5:
          this.$router.push({ path: '/doc/shareMe' })
          break
        default:
          this.$router.push({ path: '/doc/myUpload' })
          break
      }
    }
  }
}
</script>
<style src="../index.css" scoped></style>

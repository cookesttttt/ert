<template>
  <Row>
    <Col span="6" offset="2">
      <Card class="firstBox">
        <Button size="large" type="default" class="btn" @click="goToPlan(1)">总体进度计划</Button>
        <div>
          <Icon type="md-arrow-round-down" size="30" />
        </div>
        <Button size="large" type="default" class="btn">单位工程进度计划</Button>
        <div>
          <Icon type="md-arrow-round-down" size="30" />
        </div>
        <Button size="large" type="default" class="btn">分部工程进度计划</Button>
        <Icon type="ios-settings" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="1" class="center">
      <Icon type="md-arrow-round-forward" size="45" />
    </Col>
    <Col span="11">
      <Card class="secondBox">
        <Col span="12">
          <Button size="large" type="default" class="btn">年度计划</Button>
          <br />
          <Button size="large" type="default" class="btn">月计划</Button>
        </Col>
        <Col span="12">
          <Button size="large" type="default" class="btn">季度计划</Button>
          <br />
          <Button size="large" type="default" class="btn">周计划</Button>
        </Col>
        <Icon type="ios-document" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="18" offset="2" class="top">
      <Card class="lastBox">
        <Button size="large" type="default" class="btn">进度计划总览</Button>
        <Icon type="ios-share-alt" size="30" class="hs" />
      </Card>
    </Col>
  </Row>
</template>
<script>
export default {
  methods: {
    goToPlan (status) {
      switch (status) {
        case 1:
          this.$router.push({ name: '总进度计划' })
      }
    }
  }
}
</script>
<style src="../../index.css" scoped></style>
<style lang="less" scoped>
.firstBox {
  text-align: center;
  line-height: 60px;
  .btn {
    padding: 20px;
    font-size: 18px;
    font-weight: bold;
  }
}
.ivu-card-bordered {
  height: 400px;
}
.secondBox {
  text-align: center;
  line-height: 180px;
}
.lastBox {
  height: 260px;
  text-align: center;
  line-height: 260px;
}
</style>

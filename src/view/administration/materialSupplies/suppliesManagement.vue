<template>
  <Row>
    <Col span="6" offset="2">
      <Card class="firstBox">
        <Button size="large" type="default" class="btn" @click="onButtonClick(1)" style="width: 180px">用品类别管理</Button>
        <br />
        <Button size="large" type="default" class="btn" @click="onButtonClick(2)" style="width: 180px">用品名称管理</Button>
        <br />
        <Button size="large" type="default" class="btn" @click="onButtonClick(3)" style="width: 180px">库房管理</Button>
        <Icon type="ios-settings" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="1" class="center">
      <Icon type="md-arrow-round-forward" size="45" />
    </Col>
    <Col span="11">
      <Card class="secondBox">
        <Col span="12">
          <Button size="large" type="default" class="btn" @click="onButtonClick(6)">入库登记</Button>
          <br />
          <Button size="large" type="default" class="btn" @click="onButtonClick(7)">出库登记</Button>
        </Col>
        <Col span="12">
          <Button size="large" type="default" class="btn" @click="onButtonClick(4)">直入直出</Button>
          <br />
          <Button size="large" type="default" class="btn" @click="onButtonClick(5)">库存盘点</Button>
        </Col>
        <Icon type="ios-apps" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="18" offset="2" class="top">
      <Card class="lastBox">
        <Col span="8">
          <Button size="large" type="default" class="btn" @click="onButtonClick(8)">库存查询</Button>
        </Col>
        <Col span="8">
          <Button size="large" type="default" class="btn" @click="onButtonClick(9)">收发统计</Button>
        </Col>
        <Col span="8"></Col>

        <Icon type="md-pie" size="30" class="hs" />
      </Card>
    </Col>
  </Row>
</template>
<script>
export default {
  name: 'suppliesManagement',
  /**
   * 按钮点击事件
   * @param {number} status 状态：1 用品类别管理 2 用品名称管理 3 库房管理
   * 4 直入直出 5 库存盘点 6 入库登记 7 出库登记 8 库存查询 9 收发统计
   */
  methods: {
    onButtonClick (status) {
      switch (status) {
        case 1:
          this.$router.push({ path: '/administration/suppliesCategory' })
          break
        case 2:
          this.$router.push({ path: '/administration/suppliesName' })
          break
        case 3:
          this.$router.push({ path: '/administration/warehouseManagement' })
          break
        case 4:
          this.$router.push({ path: '/administration/straightInOut' })
          break
        case 5:
          this.$router.push({ path: '/administration/stocking' })
          break
        case 6:
          this.$router.push({ path: '/administration/warehousingRegistration' })
          break
        case 7:
          this.$router.push({ path: '/administration/outWarehousingRegistration' })
          break
        case 8:
          // this.$router.push({ path: '/administration/recordManagement' })
          break
        default:
          break
      }
    }
  }
}
</script>
<style src="../../index.css" scoped></style>
<style lang="less" scoped>
.firstBox {
  text-align: center;
  line-height: 90px;
  .btn {
    padding: 20px;
    font-size: 18px;
    font-weight: bold;
  }
}
.ivu-card-bordered {
  height: 300px;
}
.secondBox {
  text-align: center;
  line-height: 120px;
}
.lastBox {
  height: 170px;
  text-align: center;
  line-height: 150px;
}

</style>

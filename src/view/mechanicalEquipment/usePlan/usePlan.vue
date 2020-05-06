<template>
  <Row>
    <Col span="6" offset="2">
      <Card class="center">
        <Button size="large" type="default" class="btn" @click="onButtonClick(1)">整体使用计划</Button>
        <Icon type="ios-settings" size="30" class="hs"/>
      </Card>
    </Col>
    <Col span="1" class="center">
      <Icon type="md-arrow-round-forward" size="45"/>
    </Col>
    <Col span="11">
      <Card class="center">
        <Button size="large" type="default" class="btn" @click="onButtonClick(2)">期间使用计划</Button>
      </Card>
    </Col>
    <Col span="18" offset="2" class="top">
      <Card class="center">
        <Col span="8">

        </Col>
        <Col span="8">

        </Col>
        <Col span="8">

        </Col>
        <Icon type="ios-share-alt" size="30" class="hs"/>
      </Card>
    </Col>
  </Row>
</template>

<script>
import Icons from '_c/icons'
export default {
  name: "usePlan",
  components: {
    Icons
  },
  methods: {
    onButtonClick(status) {
      switch (status) {
        case 1:
          this.$router.push({path: '/mechanicalEquipment/usePlan/integratedPlanning'});
          break
        case 2:
          this.$router.push({path: '/mechanicalEquipment/usePlan/periodProject'});
          break
        default:
          break
      }
    }
  }
}
</script>
<style src="../../index.css" scoped></style>

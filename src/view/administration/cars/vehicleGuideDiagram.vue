<template>
  <Row>
    <Col span="6" offset="2">
      <Card class="center">
        <Button size="large" type="default" class="btn" @click="onButtonClick(1)">车辆档案</Button>
        <Icon type="ios-settings" size="30" class="hs" />
      </Card>
    </Col>
    <Col span="1" class="center">
      <Icon type="md-arrow-round-forward" size="45" />
    </Col>
    <Col span="11">
      <Card>
        <Col span="9" class="center btnLine135">
          <Button size="large" type="default" class="btn" @click="onButtonClick(2)">派车登记</Button>
          <br />
          <Button size="large" type="default" class="btn" @click="onButtonClick(2)">回车登记</Button>
        </Col>
        <Col span="15" class="center btnLine90">
          <Col span="12">
            <Button
              size="large"
              type="default"
              class="btn btnPadding20"
              @click="onButtonClick(3)"
            >加油登记</Button>
            <Button
              size="large"
              type="default"
              class="btn btnPadding20"
              @click="onButtonClick(4)"
            >违章登记</Button>
            <Button
              size="large"
              type="default"
              class="btn btnPadding20"
              @click="onButtonClick(5)"
            >维修保养</Button>
          </Col>
          <Col span="12">
            <Button
              size="large"
              type="default"
              class="btn btnPadding20"
              @click="onButtonClick(6)"
            >保险登记</Button>
            <Button
              size="large"
              type="default"
              class="btn btnPadding20"
              @click="onButtonClick(7)"
            >年检登记</Button>
            <Button
              size="large"
              type="default"
              class="btn btnPadding20"
              @click="onButtonClick(8)"
            >其他费用</Button>
          </Col>
        </Col>
      </Card>
    </Col>
    <Col span="18" offset="2" class="top">
      <Card class="center">
        <Icon type="ios-share-alt" size="30" class="hs" />
      </Card>
    </Col>
  </Row>
</template>

<script>
import Icons from '_c/icons'

export default {
  name: 'vehicleGuideDiagram',
  components: {
    Icons
  },
  /**
   * 按钮点击事件
   * @param {number} status 状态：1 车辆档案 2 派车登记  回车登记 3 加油登记 4 违章登记 5 维修保养 6保险登记
   * 7 年检登记 8其他费用
   */
  methods: {
    onButtonClick (status) {
      switch (status) {
        case 1:
          this.$router.push({ path: '/administration/vehicleManagement/vehicleFile' })
          break
        case 2:
          this.$router.push({ path: '/administration/vehicleManagement/truckingOrder' })
          break
        case 3:
          this.$router.push({ path: '/administration/vehicleManagement/vehicleRefueling' })
          break
        case 4:
          this.$router.push({ path: '/administration/vehicleManagement/vehicleViolation' })
          break
        case 5:
          this.$router.push({ path: '/administration/vehicleManagement/maintenance' })
          break
        case 6:
          this.$router.push({ path: '/administration/vehicleManagement/insuranceRegistration' })
          break
        case 7:
          this.$router.push({ path: '/administration/vehicleManagement/annualInspectionRegistration' })
          break
        default:
          this.$router.push({ path: '/administration/vehicleManagement/otherCharges' })
          break
      }
    }
  }
}
</script>
<style src="../../index.css" scoped></style>

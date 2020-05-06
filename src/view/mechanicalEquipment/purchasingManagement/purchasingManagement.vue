<template>
  <Row>
    <Col span="6" offset="2">
      <Card class="center">
        <Button size="large" type="default" class="btn" @click="onButtonClick(1)">供应商管理</Button>
        <Icon type="ios-settings" size="30" class="hs"/>
      </Card>
    </Col>
    <Col span="1" class="center">
      <Icon type="md-arrow-round-forward" size="45"/>
    </Col>
    <Col span="11">
      <Card style="text-align: center">
      <Col span="12">
        <Button size="large" type="default" class="btn" @click="onButtonClick(2)">采购计划</Button>
        <br><br><br><br> <br>
        <Button size="large" type="default" class="btn" @click="onButtonClick(3)">采购合同</Button>
      </Col>
        <Col span="12">
          <Button size="large" type="default" class="btn" @click="onButtonClick(4)">采购申请单</Button>
          <br> <br> <br> <br> <br>
          <Button size="large" type="default" class="btn" @click="onButtonClick(5)">设备验收</Button>
        </Col>
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
    name: "purchasingManagement",
    components: {
      Icons
    },
    methods: {
      onButtonClick(status) {
        switch (status) {
          case 1:
            this.$router.push({path: '/mechanicalEquipment/purchasingManagement/supplier'});
            break
          case 2:
            this.$router.push({path: '/mechanicalEquipment/purchasingManagement/procurement'});
            break
          case 3:
            this.$router.push({path: '/mechanicalEquipment/purchasingManagement/contractPurchase'});
            break
          case 4:
            this.$router.push({path: '/mechanicalEquipment/purchasingManagement/purchaseApplication'});
            break
          default:
            this.$router.push({path: '/mechanicalEquipment/purchasingManagement/equipmentAcceptance'});
            break
        }
      }
    }
  }
</script>
<style src="../../index.css" scoped></style>

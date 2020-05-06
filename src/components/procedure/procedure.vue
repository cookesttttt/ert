<template>
  <card class="right-box" :padding="0">
    <Card :bordered="false" :padding="0" dis-hover>
      <p class="title">前置工作</p>
      <Row style="margin-left: 20px">
        <i-col :lg="20" v-for="item in data" :key="item.name">
          <Button class="button" long @click="clickJump(item.url)">{{item.name}}</Button>
        </i-col>
      </Row>
    </Card>
    <Card :bordered="false" :padding="0" dis-hover>
      <p class="title">重要提醒</p>
    </Card>
  </card>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods:{
    clickJump(url){
      this.$router.push({name: url});
    }
  },
  props: ["data"]
};
</script>

<style lang="less" scoped>
.right-box {
  width: 15%;
  .title {
    font-size: 16px;
    margin-top: 15px;
    margin-left: 15px;
    margin-bottom: 20px;
  }
  .button {
    margin-left: 5%;
    margin-bottom: 10px;
  }
  .remind {
    width: 90%;
  }
}
</style>

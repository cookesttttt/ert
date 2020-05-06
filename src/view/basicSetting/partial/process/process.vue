<template>
  <card>
    <Row>
      <div class="topNav">
        <RadioGroup v-model="openType" size="large" style="marginLeft:30px">
          <span>展开方式：</span>
          <Radio label="分部工程"></Radio>
          <Radio label="分项工程"></Radio>
          <Radio label="工序"></Radio>
          <router-link to style="marginLeft:30px">
            <Icon type="md-archive" />Excel导入
          </router-link>
          <router-link to style="marginLeft:30px">
            <Icon type="ios-cloud-download" />下载Excel模板
          </router-link>
        </RadioGroup>
        <span style="marginRight:30px">
          <Button style="marginRight:30px">临时保存</Button>
          <Button type="primary">完成划分</Button>
        </span>
      </div>
      <Col :lg="7" :xxl="6">
        <card :bordered="false">
          <div style="fontSize:16px">
            <Icon type="ios-alert" :size="20" />在下方标准模板进行修改
          </div>
          <Tree ref="tree" id="tree" :data="treeData" :render="renderContent"></Tree>
        </card>
      </Col>
      <Col :lg="16" :xxl="16" offset="1">
        <card>
          <p slot="title">当前工序（选中节点）</p>
          <Form :model="formItem" :label-width="100">
            <FormItem label="类型：">
              <Input v-model="formItem.type" disabled></Input>
            </FormItem>
            <FormItem label="名称：">
              <Input v-model="formItem.name"></Input>
            </FormItem>
            <FormItem label="顺序：">
              <Input v-model="formItem.order"></Input>
            </FormItem>
            <FormItem>
              <Button style="margin-right: 8px">删除当前工序</Button>
              <Button type="primary">保存更改</Button>
            </FormItem>
          </Form>
        </card>
        <card style="marginTop:20px">
          <p slot="title">新增工序（为选中分项工程增加子节点）</p>
          <Form :model="formItem1" :label-width="100">
            <FormItem label="类型：">
              <Input v-model="formItem.type" disabled></Input>
            </FormItem>
            <FormItem label="名称：">
              <Input v-model="formItem.name"></Input>
            </FormItem>
            <FormItem label="顺序：">
              <Input v-model="formItem.order"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary">确定新增</Button>
            </FormItem>
          </Form>
        </card>
      </Col>
    </Row>
  </card>
</template>

<script>
export default {
  data () {
    return {
      openType: '工序', // 顶部单选框
      // 左侧树状图
      treeData: [{ title: '全部', children: [], expand: true, selected: true }],
      // 左侧树状图
      renderContent (h, { root, node, data }) {
        return h(
          'span',
          {
            style: {
              display: 'inline-block',
              width: '90%',
              fontSize: '14px',
              fontWeight: '500',
              whiteSpace: 'normal',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey)
                }
                this.treeSelect = data.title
                if (data.title == '全部') {
                  this.loading = true
                  this.pageNum = 1
                  this.getAllitemData()
                } else {
                  this.loading = true
                  this.pageNum = 1
                  this.getsectionColleague()
                }
              }
            }
          },
          [
            h('span', [
              h('Icon', {
                props: {
                  type: 'md-person',
                  color: '#2d8cf0'
                },
                style: {
                  marginRight: '8px'
                }
              }),
              h('span', data.title)
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            })
          ]
        )
      },
      // 当前工序表单
      formItem: {
        type: '工序',
        name: '',
        order: ''
      },
      formItem1: {
        type: '工序',
        name: '',
        order: ''
      }
    }
  }
}
</script>

<style lang='less' scoped>
.topNav {
  height: 50px;
  line-height: 50px;
  background-color: #eee;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
</style>

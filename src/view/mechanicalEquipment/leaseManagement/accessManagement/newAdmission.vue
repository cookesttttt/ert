<template>
  <Card style="height: 100%">
    <Tabs value="name1">
      <TabPane label="基本信息" name="name1">
        <Form ref="information " :model="information" :rules="ruleInline" :label-width="100">
          <Row>
            <Col span="8" offset="4">
              <FormItem label="入场时间" prop="inDate">
                <DatePicker v-model="information.inDate" type="date"  style="width:400px" format='yyyy-MM-dd' :transfer="true"></DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="租赁合同编号">
                <DatePicker v-model="information.annualInspectionDate" type="date"  style="width:400px" format='yyyy-MM-dd'></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="8" offset="4">
              <FormItem label="设备租赁厂商">
                <Input v-model="information.address" style="width:400px"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="查验结论">
                <Input v-model="information.foundingTime" style="width:400px"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Button class="search-btn" type="primary" @click="">&nbsp;新增入场设备</Button>
        <Button class="search-btn" type="error" @click="">&nbsp;删除选入场设备</Button>
        <br><br>
        <vxe-table
          ref="xTable"
          border
          resizable
          class="vxe-table-iview"
          show-overflow
          :data="tableData"
          :edit-config="{trigger: 'click', mode: 'cell'}"
        >
          <vxe-table-column type="selection" width="60"></vxe-table-column>
          <vxe-table-column type="index" width="80">
            <template v-slot:header="{ column }">
              <span>序号</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="" title="设备名称" ></vxe-table-column>
          <vxe-table-column field="" title="设备序号"></vxe-table-column>
          <vxe-table-column field="" title="租赁数量" ></vxe-table-column>
        </vxe-table>
      </TabPane>
      <TabPane label="附件" name="name3">
        <Button class="search-btn" type="primary" @click="">&nbsp;新增附件</Button>
        <br><br>
        <!--表格-->
        <Table
          border
          :columns="columns"
          :data="tableData1">
        </Table>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
  export default {
    name: "q",
    data(){
      return {
        information:{

        },
        tableData:[],
        ruleInline:{},
        tableData1:[],
        columns:[
          {
            title: '序号',
            type: 'index',
            width: 100,
            align: 'center'
          },
          {
            title: '附件名称',
            key: '',
          },
          {
            title: '上传日期',
            key: '',
          },
          {
            title: '上传人',
            key: '',
          },
          {
            title: '附件',
            key: '',
          },
          {
            title: '操作',
            fixed: 'right',
            width: 130,
            key: 'handle',
            render: (h, params, vm) => {
              return [
                [h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    'click': () => {

                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                }, '查看')],
                h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '你确定要删除吗?',
                      placement: 'left-end',
                      size: 'small'
                    },
                    on: {
                      'on-ok': () => {

                      }
                    }
                  },
                  [h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                  }, '删除')])
              ]
            }
          }
        ]
      }
    }
  }
</script>

<style scoped>
  .search-btn {
    margin-left: 10px;
  }
</style>

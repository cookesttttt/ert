<template>
  <Row :gutter="10" style="height: 100%">
    <!--树形控件-->
    <i-Col span="5" style="height: 100%">
      <Card style="height: 100%">
        <Tree :data="treeData"
              :render="renderContent"
              id="tree"
              ref="tree">
        </Tree>
      </Card>
    </i-Col>
    <!--表格数据-->
    <i-Col span="19" style="height: 100%">
      <treeTable
        v-if="selectedNode.length"
        :treeNode="selectedNode"
        :dirs="tableData"
        @data="update">
      </treeTable>
    </i-Col>
  </Row>
</template>

<script>
 import treeTable from './treeTable'
import { getCategoryTree ,getTableData} from '@/api/materialSupplies/suppliesCategory'
    export default {
    name: "suppliesCategory",
    components:{
        treeTable
      },
    data() {
        return {
          treeData: [],     //树状数据
          selectedNode: "", //选中的节点
          tableData: [],  //表格数据
        }
      },
      methods: {
        renderContent(h, {root, node, data}) {
          if(data.title==='用品类别'){
            return h('span', {
              style: {
                display: 'inline-block',
                width: '90%',
                fontWeight: "500",
                fontSize: '14px',
                whiteSpace: "normal",
                cursor: "pointer",
                backgroundColor: node.node.selected ? '#d5e8fc' : '#ffffff' //根据选中状态设置样式
              },
              on: {
                click: () => {
                  if (!node.node.selected) {
                    this.$refs.tree.handleSelect(node.nodeKey);  //根据选中状态设置样式颜色展示
                  }
                  this.selectedNode = this.$refs.tree.getSelectedNodes();   //选中的节点
                  console.log(this.selectedNode)
                  this.clickTree(this.selectedNode[0].id)
                },
              }
            }, [
              h('span', [
                h('Icon', {
                  props: {
                    type: 'ios-cube',
                    color: '#2d8cf0',
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', data.title)
              ])
            ])
          }else {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '90%',
                fontSize: '14px',
                fontWeight: "500",
                whiteSpace: "normal",
                cursor: "pointer",
                backgroundColor: node.node.selected ? '#d5e8fc' : '#ffffff' //根据选中状态设置样式
              },
              on: {
                click: () => {
                  if (!node.node.selected) {
                    this.$refs.tree.handleSelect(node.nodeKey);  //根据选中状态设置样式颜色展示
                  }
                  this.selectedNode = this.$refs.tree.getSelectedNodes();   //选中的节点
                  console.log(this.selectedNode)
                  this.clickTree(this.selectedNode[0].id)
                },
              }
            }, [
              h('span', [
                h('span', data.title)
              ]),
              h('span', {
                style: {
                  display: 'inline-block',
                  float: 'right',
                  marginRight: '32px'
                }
              })
            ])
          }

        },
        //点击树获取表格数据
        clickTree(id) {
          getTableData(JSON.parse(localStorage.getItem("projectId")).id,id).then(res => {
            if(res.status===200){
              const data = res.data;
              if (data.msgCode === 0) {
                if(data.msgData){
                  this.tableData = data.msgData
                }else {
                  this.tableData=[]
                }
              } else {
                this.$Message.error(data.msgContent)
              }
            }else {
              this.$Message.error('服务器繁忙请稍后')
            }
          })
        },
        //修改后的数据刷新
        update(data) {
          this.tableData = data
        },
      },
      mounted() {
        getCategoryTree(JSON.parse(localStorage.getItem("projectId")).id).then(res => {
          const data = res.data
          //服务器异常判断及获取数据成功与否的判断
          if (data) {
            if (data.msgCode === 0) {
              let dirs = data.msgData;
              //树初始化
              this.treeData.push(dirs);
              this.treeData[0].selected = true
              console.log(dirs)
              console.log(this.treeData)
              this.selectedNode =this.treeData
              //表格数据初始化
              this.tableData = this.treeData[0].children
              this.clickTree(this.selectedNode[0].id)
            }
          } else {
            this.$Message.error('服务器繁忙请稍后')
          }

        });
      },
    }
</script>

<style scoped>

</style>

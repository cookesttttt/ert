<template>
  <Row :gutter="10" style="height: 100%">
    <!--树形控件-->
    <Col span="5" style="height: 100%">
      <Card style="height: 100%">
        <Tree
          ref="tree"
          id="tree"
          :data="treeData"
          :render="renderContent">
        </Tree>
      </Card>
    </Col>
    <Col span="19" style="height: 100%">
      <Card style="height: 100%">
        <div class="search-con">
          <div v-if="treeNode.length" style="font-size: 13px;margin-bottom: 10px"><span style='font-weight: bold'>当前类别：</span>{{treeNode[0].title}}</div>
          <div class="left">
            <Button v-if="treeNode.length" class="search-btn" type="primary" @click="isAddModal=true" :disabled="treeNode[0].isRoot">新建用品</Button>
            <Modal title="新建用品信息" v-model="isAddModal"
                   @on-cancel="cancel(1)"
                   :mask-closable="false">
              <Form ref="newSubstance" inline
                    :model="newSubstance"
                    :label-width="100"
                    :rules="rules">
                <FormItem label="用品名称" prop="name">
                  <Input
                    placeholder="请输入用品名称"
                    v-model="newSubstance.name"
                    style="width:350px"
                    :maxlength="15">
                  </Input>
                </FormItem>
                <FormItem label="用品单位" prop="materialUnit">
                  <Input
                    placeholder="请输入用品单位"
                    v-model="newSubstance.materialUnit"
                    style="width:350px"
                    :maxlength="15">
                  </Input>
                </FormItem>
                <FormItem label="规格型号" prop="specifications">
                  <Input
                    placeholder="请输入规格型号"
                    v-model="newSubstance.specifications"
                    style="width:350px"
                    :maxlength="15">
                  </Input>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="text" size="large" @click="cancel(1)">取消</Button>
                <Button type="primary" size="large" @click="addSubstance">保存</Button>
              </div>
            </Modal>
          </div>
          <div class="right">
            <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue"></Input>
            <Button class="search-btn" type="primary" @click="searchAdd" style="padding: 5px 15px 4px">
              <Icon type="ios-search"/>
              &nbsp搜索
            </Button>
          </div>
          <div class="clear"></div>
        </div>
        <!--表格数据-->
        <Table ref="tables"
               border
               :data="tableData"
               :columns="columns">
        </Table>
        <!--分页-->
        <div class="page">
          <div class="right">
            <Page
              :total="totalElements"
              show-total
              :current="pageNum"
              @on-change="getpage">
            </Page>
          </div>
        </div>
        <Modal title="编辑用品信息"
               @on-cancel="cancel(2)"
               v-model="isEditModal"
               :mask-closable="false">
          <Form ref="editSubstance" inline
                :model="editSubstance"
                :label-width="100"
                :rules="rules">
            <FormItem label="用品名称" prop="name">
              <Input
                placeholder="请输入用品名称"
                v-model="editSubstance.name"
                style="width:350px"
                :maxlength="15">
              </Input>
            </FormItem>
            <FormItem label="用品单位" prop="materialUnit">
              <Input
                placeholder="请输入用品单位"
                v-model="editSubstance.materialUnit"
                style="width:350px"
                :maxlength="15">
              </Input>
            </FormItem>
            <FormItem label="规格型号" prop="specifications">
              <Input
                placeholder="请输入规格型号"
                v-model="editSubstance.specifications"
                style="width:350px"
                :maxlength="15">
              </Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="text" size="large" @click="cancel(2)">取消</Button>
            <Button type="primary" size="large" @click="editInformation">保存</Button>
          </div>
        </Modal>

      </Card>
    </Col>
  </Row>
</template>

<script>
  import './index.less'
  import {paramsValidate,isDataSuccess} from '@/libs/util'   //验证对象是否为空
  import { getCategoryTree,newMaterial,allData,deleteTable,editMaterial} from '@/api/materialSupplies/suppliesName'    //获取数据
  export default {
    name: "suppliesName",
    data() {
      return {
        // IsBtn:false,
        //新建物质弹框
        isAddModal:false,
        //编辑弹框
        isEditModal:false,
        //新建物质数据
        newSubstance:{
          name:'',
          materialUnit:'',
          specifications:'',
        },
        //编辑物质信息
        editSubstance:{
          name:'',
          materialUnit:'',
          specifications:'',
          id:''
        },
        rules: {
          name:
            [{
              required: true,
              message: '请填写用品名称',
              trigger: 'blur'
            }],
          materialUnit:
            [{
              required: true,
              message: '请填写用品单位',
              trigger: 'blur'
            }],
        },
        //树结构数据
        treeData: [],
        //选中树的节点
        treeNode:'',
        treeNodeId:'',
        //收搜
        searchValue: '',
        // 当前页码
        pageNum: 1,
        // 每页显示多少条
        pageSize: 10,
        // 初始化信息总条数
        totalElements: 0,
        //表格数据
        tableData:[],
        columns: [
          {
            type: 'index',
            width: 50,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '用品名称',
            key: 'name',
            fixed: 'left'
          },
          {
            title:'用品单位',
            key:'unit',
          },
          {
            title:'规格型号',
            key:'standard',
          },
          {
            title: '操作',
            width: 130,
            key: 'handle',
            fixed: 'right',
            render: (h, params, vm) => {
              return [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',

                  },
                  on: {
                    'click': () => {
                    this.echoData(params.index)
                    }
                  },
                  style:{
                    marginRight:'5px'
                  }
                },"编辑"),
                h('Poptip', {
                  props: {
                    transfer: true,
                    confirm: true,
                    placement: 'left-end',
                    size: 'small',
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                     this.deleteTableData(params.index)
                    }
                  }
                }, [h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  }
                },'删除')]),
              ]
            }
          }

        ],
      }
    },
    methods: {
      directoryClick() {
        this.$router.push({path: '/administration/suppliesCategory'})
      },
      renderContent(h, {root, node, data}) {
        if(data.title==='用品类别'){
          return h('span', {
            style: {
              display: 'inline-block',
              width: '90%',
              fontSize: "16px",
              fontWeight: '500',
              whiteSpace: 'normal',
              cursor: 'pointer',
              backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey)
                }
                this.treeNode = this.$refs.tree.getSelectedNodes();
                console.log(this.treeNode[0].id)
                this.treeNodeId = this.treeNode[0].id;
                this.pageNum = 1;
                this.getAllData(this.pageNum)

              }
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
            ]),
            h('span', [
              h('Button', {
                props: {
                  icon:"ios-settings",
                  shape:"circle",
                  type:"primary",
                  size: 'small'
                },
                style: {
                  float:'right',
                  textAlign:'center',
                },
                on:{
                  click:(e)=>{
                    e.stopPropagation();//非IE浏览器
                    // alert('a')
                    this.directoryClick()
                  }
                },
              },'配置'),
            ]),
          ])
        }else {
          return h('span', {
            style: {
              display: 'inline-block',
              width: '90%',
              fontSize: "16px",
              fontWeight: '500',
              whiteSpace: 'normal',
              cursor: 'pointer',
              backgroundColor: node.node.selected ? ' #d5e8fc' : '#ffffff'
            },
            on: {
              click: () => {
                if (!node.node.selected) {
                  this.$refs.tree.handleSelect(node.nodeKey)
                }
                this.treeNode = this.$refs.tree.getSelectedNodes();

                console.log(this.treeNode[0].id)
                this.treeNodeId = this.treeNode[0].id;
                this.pageNum = 1;
                this.getAllData(this.pageNum)

              }
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
      // 关闭弹框
      cancel (status) {
        if (status === 1) {
          this.isAddModal = false
          this.$refs.newSubstance.resetFields()
        } else {
          this.$refs.editSubstance.resetFields()  //清空
          this.isEditModal = false
        }
      },
      // 新建物质
      addSubstance () {
        this.$refs.newSubstance.validate((valid) => {
          if (valid) {
             const  data={
               "categoryId":this.treeNodeId,
               "projectId":JSON.parse(localStorage.getItem("projectId")).id,
               "name":this.newSubstance.name,
               "unit":this.newSubstance.materialUnit,
               "standard":this.newSubstance.specifications
             }
          newMaterial(data).then(res=>{
            const data = res.data;
            let status = isDataSuccess(res);
            switch (status) {
              case 1:
                this.$Message.error("服务器繁忙请稍后");
                break;
              case 2:
                this.$Message.error(data.msgContent);
                break;
              default:
                this.getAllData(this.pageNum); //拉一次数据
                this.cancel(1);
                this.$Message.success(data.msgContent);
                break;
            }
          })
          }
        })
      },
      //删除数据
      deleteTableData(index){
        deleteTable(this.tableData[index].id).then(res => {
          const data = res.data;
          let status = isDataSuccess(res);
          switch (status) {
            case 1:
              this.$Message.error("服务器繁忙请稍后");
              break;
            case 2:
              this.$Message.error(data.msgContent);
              break;
            default:
              this.tableData.splice(index, 1);
              this.getAllData(this.pageNum);
              this.$Message.success(data.msgContent);
              break;
          }
        });
      },
      //数据回显
      echoData(index){
        this.isEditModal=true
        console.log(this.tableData[index])
       this.editSubstance.name= this.tableData[index].name
       this.editSubstance.materialUnit= this.tableData[index].unit
       this.editSubstance.specifications= this.tableData[index].standard
       this.editSubstance.id= this.tableData[index].id
      },

      //编辑物质信息
      editInformation (){
        const data={
          "categoryId":this.treeNodeId,
          "projectId":JSON.parse(localStorage.getItem("projectId")).id,
          "name":this.editSubstance.name,
          "unit":this.editSubstance.materialUnit,
          "standard":this.editSubstance.specifications
        }
        if (paramsValidate(data)) {
          editMaterial(data,this.editSubstance.id).then(res=>{
            const data = res.data;
            let status = isDataSuccess(res);
            switch (status) {
              case 1:
                this.$Message.error("服务器繁忙请稍后");
                break;
              case 2:
                this.$Message.error(data.msgContent);
                break;
              default:
                this.getAllData(this.pageNum);
                this.cancel();
                this.$Message.success(data.msgContent);
                break;
            }
          })
        }
      },
      // 分页
      getpage(index) {
        this.pageNum = index;
        this.getAllData(this.pageNum);
      },
      //所有数据显示
      getAllData(pageNum) {
      allData(pageNum,
        this.pageSize,
        this.searchValue,
        this.treeNodeId
      ).then(res=>{
        console.log(res);
        const data = res.data;
        let status = isDataSuccess(res);
        switch (status) {
          case 1:
            this.$Message.error("服务器繁忙请稍后");
            break;
          case 2:
            this.$Message.error(data.msgContent);
            break;
          default:
            console.log(data.msgData.content);
            this.tableData = data.msgData.content;
            this.totalElements = data.msgData.totalElements;
            break;
        }
      })
      },
      // 搜索
      searchAdd() {
        this.pageNum = 1;
        this.getAllData(this.pageNum);
      },
      //获取左边的树数据
      getCategoryTreeData(){
        getCategoryTree(JSON.parse(localStorage.getItem("projectId")).id).then(res=>{
          const data = res.data
          console.log(res)
          let status = isDataSuccess(res)
          switch (status) {
            case 1:
              this.$Message.error("服务器繁忙请稍后")
              break
            case 2:
              this.$Message.error(data.msgContent)
              break
            default:
              this.treeData=[]
              this.treeData.push(data.msgData)

              if(this.treeData[0].children.length!==0){
                this.treeData[0].children[0].selected = true
                this.treeNodeId =this.treeData[0].children[0].id
                this.treeNode=this.treeData[0].children
                this.getAllData(this.pageNum)
              }else {
                this.treeData[0].selected = true
                this.treeNodeId =this.treeData[0].id
                this.treeNode =this.treeData
                this.getAllData(this.pageNum)
              }
              console.log(data.msgData)
              console.log(this.treeData[0])
              console.log(this.treeNode )
              break
          }
        })
      },
    },
    mounted() {

      this.getCategoryTreeData()

    },
    watch: {
      $route (to, from) {
        // 监听路由中的Id值的变化
        if (to.name === 'suppliesName') {
          this.getCategoryTreeData()
        }
      }
    }
    }
</script>

<style scoped>

</style>

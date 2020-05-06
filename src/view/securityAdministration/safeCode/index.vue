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
            <Button v-if="treeNode.length" class="search-btn" type="primary"  :disabled="treeNode[0].isRoot" @click="clickNewQualityCode">新建安全规范</Button>
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
      </Card>
    </Col>
  </Row>
</template>

<script>
  import './index.less'
  import {paramsValidate,isDataSuccess} from '@/libs/util'   //验证对象是否为空
  import { getCategoryTree,allData,deleteTable} from '@/api/securityAdministration/safeCode'    //获取数据
  export default {
    name: "suppliesName",
    data() {
      return {
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
            width: 55,
            align: 'center',
            fixed: 'left'
          },
          {
            title: '规范名称',
            key: 'name',
            fixed: 'left',
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    color: '#082999',
                    cursor: 'pointer'
                  },
                  on: {
                    'click': () => {
                      this.$router.push({
                        name: '安全规范详情',
                        query: {
                          id:this.tableData[params.index].id,
                        }})
                    }
                  }
                }, params.row.name)
              ])
            }
          },
          {
            title:'发布单位',
            key:'publicationUnit',
          },
          {
            title:'发布人',
            key:'publicationPerson',
          },
          {
            title:'备注',
            tooltip:true,
            key:'remark',
          },
          {
            title: '操作',
            width: 170,
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
                      this.$router.push({
                        name: '编辑安全规范',
                        query: {
                          id:this.tableData[params.index].id,
                        }})
                    }
                  },
                  style:{
                    marginRight:'5px'
                  }
                },"编辑"),
                h('Button', {
                  props: {
                    size: 'small',

                  },
                  on: {
                    'click': () => {
                      this.$router.push({
                        name: '安全规范详情',
                        query: {
                          id:this.tableData[params.index].id,
                        }})
                    }
                  },
                  style:{
                    marginRight:'5px'
                  }
                },"查看"),
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
      clickNewQualityCode(){
        sessionStorage.setItem('safeCodeName', JSON.stringify(this.treeNode))
        sessionStorage.setItem('safeCodeId', JSON.stringify(this.treeNodeId))
        this.$router.push({path: '/securityAdministration/newSafeCode'})
      },
      directoryClick() {
        this.$router.push({path: '/securityAdministration/securityCategory'})
      },
      renderContent(h, {root, node, data}) {
        if(data.title==='安全规范类别'){
          return h('span', {
            style: {
              display: 'inline-block',
              width: '90%',
              fontSize: "14px",
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
                  type: 'logo-angular',
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
              fontSize: "14px",
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
                sessionStorage.setItem('safeCodeName', JSON.stringify(this.treeNode))
                sessionStorage.setItem('safeCodeId', JSON.stringify(this.treeNode[0].id))
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
      // 分页
      getpage(index) {
        this.pageNum = index;
        this.getAllData(this.pageNum);
      },
      //所有数据显示
      getAllData(pageNum) {
        allData(this.treeNodeId,
          pageNum,
          this.pageSize,
          this.searchValue,
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
              console.log(data);
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
      fontData(data,id){
        data.forEach(res => {
          if (res.id === id){
            console.log(data)
            let arrData=[]
            arrData.push(res)
            arrData[0].selected = true
            // this.isDisable= arrData[0].isRoot
            this.treeNode = arrData
          }else{
            if (res.children){
              this.fontData(res.children,id)
            }
          }
        })

      },
      getParent(data2, nodeId2) {
        let arrRes = [];
        if (data2.length === 0) {
          if (!!nodeId2) {
            arrRes.unshift(data2)
          }
          return arrRes;
        }
        let rev = (data, nodeId) => {
          for (var i = 0, length = data.length; i < length; i++) {
            let node = data[i];
            if (node.id===nodeId) {
              arrRes.unshift(node)
              rev(data2, node.parentId);
              break;
            }
            else {
              if (!!node.children) {
                rev(node.children, nodeId);
              }
            }
          }
          return arrRes;
        };
        arrRes = rev(data2, nodeId2);
        return arrRes;
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
              // this.treeData=[]
              this.treeData.push(data.msgData)
              if(JSON.parse(sessionStorage.getItem('safeCodeId'))){
                this.fontData(this.treeData,JSON.parse(sessionStorage.getItem('safeCodeId')))
                this.getParent(this.treeData,JSON.parse(sessionStorage.getItem('safeCodeId')))
                let getParentData=this.getParent(this.treeData,JSON.parse(sessionStorage.getItem('safeCodeId')))
                getParentData.pop()
                getParentData.forEach(v=>{
                  v.expand=true
                })
                this.treeNodeId =JSON.parse(sessionStorage.getItem('safeCodeId'))
                sessionStorage.setItem('safeCodeName', JSON.stringify(this.treeNode))
                this.getAllData(this.pageNum)
                console.log(getParentData)
                if(getParentData.length===0){
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
                }
              }else {
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
              }
              console.log(data.msgData)
              console.log(this.treeData[0])
              console.log(this.treeNode)
              break
          }
        })
      },
    },
    mounted() {
      this.getCategoryTreeData()

    },
  }
</script>


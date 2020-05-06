<template>
  <Card class="bigbox" style="min-height: 700px">
    <Tabs size="default" @on-click="tabClick">
      <TabPane label="文档管理" name="wd">
        <Row :gutter="10" style="min-height: 700px">
          <!--树形控件-->
          <Col span="5" style="min-height: 700px">
            <Card style="min-height: 700px">
              <Tree ref="tree" id="tree" :data="treeData" :render="renderContent" ></Tree>
            </Card>
          </Col>
          <Col span="19" style="min-height: 700px">
            <Card style="min-height: 700px">
              <!--分享 上传 搜索-->
              <div v-if="tree_ode.length" style="font-size: 13px"><span style='font-weight: bold'>当前目录：</span>{{tree_ode[0].title}}</div>
              <div class="search-con" style="margin-top: 3px">
                <div class="left">
                  <ButtonGroup>
                    <Button class="search-btn" @click="upload" type="primary" :disabled=isDisable>上传文件</Button>
                    <Button class="search-btn"  @click="handleSelectRow" :disabled=isDisable>分享传阅</Button>
                  </ButtonGroup>
                </div>
                <div class="right">
                  <Select class="search-col" v-model="shuju" @on-change="changeData" style="width: 120px">
                    <Option :value="current">仅当前目录</Option>
                    <Option :value="allData">包含子目录</Option>
                  </Select>
                  <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue"></Input>
                  <Button
                    class="search-btn"
                    type="primary"
                    @click="searchAdd"
                    style="padding: 5px 15px 4px"
                  >
                    <Icon type="ios-search"/>&nbsp;搜索
                  </Button>
                </div>
                <div class="clear"></div>

              </div>
              <!--表格数据-->
              <Table ref="tables" border :data="tableData" :columns="columns"></Table>
              <!--分页-->
              <div class="page">
                <div class="right">
                  <Page :total="totalElements" show-total :current="pageNum" @on-change="getpage"></Page>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </TabPane>

      <TabPane label="我的上传" name="sc">
        <div class="bottom15">
          <!--收搜-->
          <Input class="search-input" v-model="searchFile1" placeholder="请输入文件名称"/>
          <Button class="search-btn" type="primary" @click="searchFiles1">
            <Icon type="ios-search"/>
            &nbsp;搜索
          </Button>
        </div>
        <!--表格数据-->
        <Table
          ref="selection"
          border
          :columns="columns1"
          :data="tableData1">

        </Table>
        <!--分页-->
        <div class="page">
          <div class="right">
            <Page :total="totalElements1"
                  :current="pageNum1"
                  show-total
                  @on-change="changePage1">
            </Page>
          </div>
        </div>
      </TabPane>
      <TabPane label="我的分享" name="xf">
        <div class="bottom15">
          <!--收搜-->
          <Input class="search-input" v-model="searchValue2" placeholder="请输入文件名称" />
          <Button class="search-btn" type="primary" @click="searchFiles2">
            <Icon type="ios-search" />&nbsp;搜索
          </Button>
        </div>
        <Table ref="currentRowTable" border :columns="columns2" :data="tableData2" class="table"></Table>
        <!--分页-->
        <div class="page">
          <div class="right">
            <Page :total="totalElements2" :current="pageNum2" show-total @on-change="changePage2"></Page>
          </div>
        </div>
      </TabPane>
      <TabPane label="分享给我的" name="fxw">
        <div class="bottom15">
          <!--收搜-->
          <Input class="search-input" v-model="searchFile3" placeholder="请输入文件名称"/>
          <Button class="search-btn" type="primary" @click="searchFiles3">
            <Icon type="ios-search"/>
            &nbsp;搜索
          </Button>
        </div>
        <!--表格数据-->
        <Table ref="currentRowTable"
               border
               :columns="columns3"
               :data="tableData3">

        </Table>
        <!--分页-->
        <div class="page">
          <div class="right">
            <Page
              :total="totalElements3"
              :current="pageNum3"
              show-total
              @on-change="changePage3">
            </Page>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </Card>
</template>
<script>
import { shareFiles, readFile, downloadFile ,myUploadFiles, deletedFile,shareFilesToMe} from '@/api/docs/file'
import './index.less'
import axios from '@/libs/api.request'
/*import {deletedFile, readFile} from '@/api/docs/file'*/
import { mkLink } from '@/libs/util' // 下载
export default {
  name: 'Myshare',
  data () {
    return {
        //我的文档
                shuju: '1', // 默认所有目录
                current: '1', // 当前目录
                allData: '-1', // 所有目录
                // 树结构数据
                treeData: [],
                // 选中的文件
                tree_ode: '',
                isDisable:'',
                // 收搜
                searchValue: '',
                // 当前页码
                pageNum: 1,
                // 每页显示多少条
                pageSize: 10,
                // 初始化信息总条数
                totalElements: 0,
                // 表格数据
                tableData: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '文件名称',
                        key: 'name',
                        width: 300,
                        tooltip: true,
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
                                this.readFile()
                              }
                            }
                          }, params.row.name)
                        ])
                      }

                    },
                  {
                    title: '文件编号',
                    tooltip: true,
                    key: 'fileNumber',
                    width: 200
                  },
                    {
                        title: '发文单位',
                        tooltip: true,
                        key: 'reportDepartment',
                        width: 140

                    },
                    {
                        title: '发文人姓名',
                        key: 'reporterName',
                        width: 100
                    },
                    {
                        title: '收文人姓名',
                        key: 'receiverName',
                        width: 100
                    },

                    {
                        title: '发文日期',
                        key: 'reportDate',
                        width: 120
                    },
                    {
                        title: '上传日期',
                        key: 'uploadTime',
                        width: 120
                    },
                    {
                        title: '上传人',
                        key: 'uploadRealName',
                        width: 80
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
                                        size: 'small'
                                    },
                                    on: {
                                        'click': () => {
                                            this.downLoad(this.tableData[params.index])
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, '下载'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        'click': () => {
                                            this.readFile()
                                        }
                                    },
                                    style: {
                                        marginRight: '5px'
                                    }
                                }, '查看'),
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
                                          // console.log( this.$refs.tree.getSelectedNodes())

                                            deletedFile(this.tableData[params.index].id).then(res => {
                                                const data = res.data
                                                if (data) {
                                                    if (data.msgCode === 0) {
                                                        this.tableData.splice(params.index, 1)
                                                        this.$Message.success('操作成功')
                                                        this.allshuju()
                                                      this.tree_ode[0].selected = true
                                                       this.isDisable=this.tree_ode[0].isRoot
                                                        console.log(this.tree_ode[0].id)
                                                    } else {
                                                        this.$Message.error(data.msgContent)
                                                    }
                                                } else {
                                                    this.$Message.error('服务器繁忙请稍后')
                                                }
                                            })
                                        }
                                    }
                                }, [h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    }
                                }, '删除')])
                            ]
                        }
                    }
                ],
        //我的上传
        tableData1: [],
        searchFile1: '',   // 搜索
        pageNum1: 1,       // 当前页码
        pageSize1: 10,     // 每页显示多少条
        totalElements1: 0, // 初始化信息总条数
        columns1: [
            {
                type: 'index',
                width: 55,
                align: 'center',

                fixed: 'left',
            },
            {
                title: '文件名称',
                key: 'name',
                tooltip:true,
                width: 400,
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
                                    this.readFile1()
                                }
                            }
                        }, params.row.name)
                    ])
                }
            },
            {
                title: '上传日期',
                key: 'uploadTime',
                width: 120
            },
            {
                title: '文件编号',
                tooltip:true,
                key: 'fileNumber',
                width: 240
            },
            {
                title: '发文单位',
                tooltip:true,
                key: 'reportDepartment',
                width: 230
            },
            {
                title: '发文人',
                key: 'reporterName',
                width: 100
            },
            {
                title: '文档路径',
                tooltip:true,
                key: 'path',
                width: 400
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
                                size: 'small'
                            },
                            on: {
                                'click': () => {
                                    this.downLoad1(this.tableData1[params.index])
                                }
                            },
                            style: {
                                marginRight: '5px'
                            }
                        }, '下载'),
                        h('Button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                'click': () => {
                                    this.readFile1()
                                }
                            },
                            style: {
                                marginRight: '5px'
                            }
                        }, '查看'),
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
                                    this.deletedFileData1(this.tableData1[params.index].id, this.tableData1[params.index].id)
                                }
                            }
                        }, [
                            h('Button',
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    }
                                }, '删除')]),
                    ]
                }
            }
        ],
      // 我的分享
      tableData2: [],
      searchValue2: '',
      pageNum2: 1, // 当前页码
      pageSize2: 10, // 每页显示多少条
      totalElements2: 0, // 初始化信息总条数
      columns2: [
        {
          type: 'index',
          width: 55,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '文件名称',
            tooltip:true,
          key: 'name',
          fixed: 'left',
          width: 400,
            render: (h, params) => {
                return h('div', [
                    h('span', {
                        style: {
                            color: '#082999',
                            cursor: 'pointer'
                        },
                        on: {
                            'click': () => {
                                this.readFile2()
                            }
                        }
                    }, params.row.name)
                ])
            }
        },
        {
          title: '上传时间',
          key: 'uploadTime',
          width: 120
        },
        {
          title: '文件编号',
            tooltip:true,
          key: 'fileNumber',
          width: 200
        },
        {
          title: '上传人',
          key: 'uploadRealName',
          width: 80
        },
        {
          title: '发文单位',
            tooltip:true,
          key: 'reportDepartment',
          width: 200
        },
        {
          title: '分享日期',
          key: 'shareDate',
          width: 120
        },
        {
          title: '我分享的人',
          key: 'users',
          width: 120
        },
        {
          title: '文档路径',
            tooltip:true,
          key: 'path',
          width: 300
        },
        {
          title: '操作',
          key: 'handle',
          width: 130,
          fixed: 'right',
          render: (h, params, vm) => {
            return [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.downLoad2(this.tableData2[params.index])
                    }
                  },
                  style: {
                    marginRight: '5px'
                  }
                },
                '下载'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.readFile2()
                    }
                  }
                },
                '查看'
              )
            ]
          }
        }
      ],
        //分享给我的
        tableData3: [],
        searchFile3: '', // 搜索
        pageNum3: 1,     // 当前页码
        pageSize3: 10,   // 每页显示多少条
        totalElements3: 0, //初始化信息总条数
        columns3: [
            {
                type: 'index',
                width: 55,
                align: 'center',
                fixed: 'left'
            },
            {
                title: '文件名称',
                tooltip:true,
                key: 'name',
                fixed: 'left',
                width: 400,
                render: (h, params) => {
                    return h('div', [
                        h('span', {
                            style: {
                                color: '#082999',
                                cursor: 'pointer',
                            },
                            on: {
                                'click': () => {
                                    this.readFile3()
                                }
                            }
                        }, params.row.name)
                    ])
                }
            },
          {
            title: '上传日期',
            key: 'uploadTime',
            width: 120
          },
          {
            title: '文件编号',
            tooltip:true,
            key: 'fileNumber',
            width: 200
          },

            {
                title: '上传人',
                key: 'uploadRealName',
                width: 100
            },
            {
                title: '发文单位',
                tooltip:true,
                key: 'reportDepartment',
                width: 200
            },
            {
                title: '分享日期',
                key: 'shareDate',
                width: 120
            },
            {
                title: '分享人',
                key: 'shareUser',
                width: 100
            },
            {
                title: '文档路径',
                tooltip:true,
                key: 'path',
                width: 300
            },
            {
                title: '操作',
                key: 'handle',
                width: 130,
                fixed: 'right',
                render: (h, params, vm) => {
                    return [h('Button', {
                        props: {
                            type: 'primary',
                            size: 'small'
                        },
                        on: {
                            'click': () => {
                                this.downLoad3(this.tableData3[params.index])
                            }
                        },
                        style: {
                            marginRight: '5px'
                        }
                    }, '下载'), h('Button', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            'click': () => {
                                this.readFile3()
                            }
                        }
                    }, '查看')

                    ]
                },
            },

        ],
    }
  },
  methods: {

      tabClick(name){
          console.log(name)
        if(name==='sc'){
          this.myUploadFiles(this.pageNum1)
        }else if(name==='xf'){
              this.getShareFiles(this.pageNum2)
          } else if(name==='fxw'){
              this.shareFilesToMe(this.pageNum3)
          }
        /*  //  我的分享
          this.getShareFiles(this.pageNum2)
          //分享给我的
          this.shareFilesToMe(this.pageNum3)*/
      },
      //我的文档
      directoryClick() {
          this.$router.push({path: '/doc/directory'})
      },
      readFile() {
          const tempPage = window.open('', '_blank')
          readFile(JSON.parse(localStorage.getItem('projectId')).id).then(res => {
              const data = res.data
              if (data) {
                  if (data.msgCode === 0) {
                      console.log(data.msgContent)
                      tempPage.location = data.msgContent
                  }
              } else {
                  this.$Message.error('服务器繁忙请稍后')
              }
          })
      },
      renderContent(h, {root, node, data}) {
          if (data.title === '目录') {
              return h('span', {
                  style: {
                      display: 'inline-block',
                      width: '90%',
                      fontSize: '14px',
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
                          this.tree_ode = this.$refs.tree.getSelectedNodes()
                        this.isDisable=this.tree_ode[0].isRoot
                          console.log(this.tree_ode)
                          this.pageNum = 1
                           this.shuju='1'
                          this.fileData(this.pageNum, this.pageSize,this.tree_ode[0].id).then(res => {
                              if (res.data.msgCode === 0) {
                                  this.totalElements = res.data.msgData.totalElements
                                  this.tableData = res.data.msgData.content
                              } else {
                                  this.$Message.error(res.data.msgContent)
                              }
                          })
                      }
                  }
              }, [
                  h('span', [
                      h('Icon', {
                          props: {
                              type: 'md-folder',
                              color: '#2d8cf0'
                          },
                          style: {
                              lineHeight:'24px',
                             float:'left',
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
          } else {
              return h('span', {
                  style: {
                      display: 'inline-block',
                      width: '90%',
                    fontSize: '14px',
                      fontWeight: '500',
                      whiteSpace: 'normal',
                      cursor: 'pointer',
                      backgroundColor: node.node.selected ? '#d5e8fc' : '#ffffff' // 根据选中状态设置样式
                  },
                  on: {
                      click: () => {
                          if (!node.node.selected) {
                              this.$refs.tree.handleSelect(node.nodeKey)
                          }
                          this.tree_ode = this.$refs.tree.getSelectedNodes()
                        this.isDisable=this.tree_ode[0].isRoot
                        sessionStorage.setItem('tree_odeId', JSON.stringify(this.tree_ode[0].id))
                         console.log(this.tree_ode)
                         /* // 当前目录和所有目录的切换
                          this.shuju = this.current*/
                          this.pageNum = 1
                           this.shuju='1'
                          this.fileData(this.pageNum, this.pageSize, this.tree_ode[0].id).then(res => {
                              if (res.data.msgCode === 0) {
                                  this.totalElements = res.data.msgData.totalElements
                                  this.tableData = res.data.msgData.content
                              } else {
                                  this.$Message.error(res.data.msgContent)
                              }
                          })
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
      fontData(data,id){
        data.forEach(res => {
          if (res.id === id){
            console.log(data)
            let arrData=[]
            arrData.push(res)
            arrData[0].selected = true
            this.isDisable= arrData[0].isRoot
            this.tree_ode = arrData
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

// 分页
      getpage(index) {
          this.pageNum = index
          if (this.shuju === '-1') {
             axios.request({
                url: '/docs/fileInfos/' + JSON.parse(localStorage.getItem('projectId')).id + '/' + this.pageNum + '/' + this.pageSize + '/' + this.tree_ode[0].id + '/' + -1,
                method: 'get'
              }).then(res=>{
               if (res.data.msgCode === 0) {
                 this.tableData = res.data.msgData.content
               } else {
                 this.$Message.error(res.data.msgContent)
               }
             })
          } else {
              this.fileData(this.pageNum, this.pageSize, this.tree_ode[0].id).then(res => {
                  if (res.data.msgCode === 0) {
                      this.tableData = res.data.msgData.content
                  } else {
                      this.$Message.error(res.data.msgContent)
                  }
              })
          }
      },
      // 分享
      handleSelectRow() {
          let select_c = this.$refs.tables.getSelection()
          if (select_c.length === 1) {
              sessionStorage.setItem('select_cId', select_c[0].id)
              this.$router.push({path: '/doc/share'})
          } else {
              this.$Message.error({content: '请选择一个文件分享'})
          }
      },
      // 上传
      upload() {
          if (this.tree_ode) {
              sessionStorage.setItem('dirId', this.tree_ode[0].id)
              this.$router.push({path: '/doc/upload'})
          } else {
              this.$Message.error({content: '请选择目录'})
          }
      },
      //  所有目录显示
      allshuju() {
        if(this.shuju==='1'){
          let searchFlag = 0
          console.log(this.tree_ode)
          axios.request({
            url: '/docs/fileInfos/' + JSON.parse(localStorage.getItem('projectId')).id + '/' + this.pageNum + '/' + this.pageSize + '/' + this.tree_ode[0].id + '/' + searchFlag,
            method: 'get'
          }).then(res => {
            if (res.data.msgCode === 0) {
              this.totalElements = res.data.msgData.totalElements
              this.tableData = res.data.msgData.content
            } else {
              this.$Message.error(res.data.msgContent)
            }
          })
        }else {
          let searchFlag = 1
          console.log(this.tree_ode)
          axios.request({
            url: '/docs/fileInfos/' + JSON.parse(localStorage.getItem('projectId')).id + '/' + this.pageNum + '/' + this.pageSize + '/' + this.tree_ode[0].id + '/' + searchFlag,
            method: 'get'
          }).then(res => {
            if (res.data.msgCode === 0) {
              this.totalElements = res.data.msgData.totalElements
              this.tableData = res.data.msgData.content
            } else {
              this.$Message.error(res.data.msgContent)
            }
          })
        }

      },
    changeData(val){
        console.log(val)
       if(val==='-1'){
         let searchFlag = 1
         axios.request({
           url: '/docs/fileInfos/' + JSON.parse(localStorage.getItem('projectId')).id + '/' + this.pageNum + '/' + this.pageSize + '/' + this.tree_ode[0].id + '/' + searchFlag,
           method: 'get'
         }).then(res => {
           if (res.data.msgCode === 0) {
             this.totalElements = res.data.msgData.totalElements
             this.tableData = res.data.msgData.content
           } else {
             this.$Message.error(res.data.msgContent)
           }
         })
       }else {
         this.allshuju()
       }
    },
      // 搜索
      searchAdd() {
          let bean = {}
          bean.keyWord = this.searchValue
         console.log(this.tree_ode)
         console.log(this.tree_ode[0].id)
          if (this.shuju ==='1') {
              bean.dirId = this.tree_ode[0].id
              bean.searchFlag = 2
          } else {
              bean.dirId = this.tree_ode[0].id
              bean.searchFlag = 1
          }
          axios.request({
              url: '/docs/fileInfos/' + JSON.parse(localStorage.getItem('projectId')).id + '/' + this.pageNum + '/' + this.pageSize,
              data: bean,
              method: 'post'
          }).then(res => {
              if (res.data.msgCode === 0) {
                  this.totalElements = res.data.msgData.totalElements
                  this.tableData = res.data.msgData.content
              } else {
                  this.$Message.error(res.data.msgContent)
              }
          })
      },
      // 下载
      downLoad(row) {
          console.log(row)
          axios.request({
              method: 'get',
              url: '/docs/file/' + row.id,
              responseType: 'blob'
          }).then(res => {
              this.mkLink(res.data, row)
              this.$Message.success('下载成功')
          }).catch(error => {
              this.$Message.error('下载失败')
          })
      },
      mkLink(data, row) {
          if (!data) {
              return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.href = url
          link.style.display = 'none'
          link.setAttribute('download', row.name)
          document.body.appendChild(link)
          link.click()
      },
      // 文件数据
      fileData(pageNum, pageSize, id) {
          return axios.request({
              url: '/docs/fileInfos/' + JSON.parse(localStorage.getItem('projectId')).id + '/' + pageNum + '/' + pageSize + '/' + id + '/' + 2,
              method: 'get'
          })
      },

      //--------我的上传----------------
      // 删除
      deletedFileData1(id, index) {
          deletedFile(id).then(res => {
              if (res.status === 200) {
                  const data = res.data
                  if (data.msgCode === 0) {
                      this.tableData1.splice(index, 1)
                      this.$Message.success(data.msgContent)
                      this.myUploadFiles(this.pageNum1)
                  } else {
                      this.$Message.error(data.msgContent)
                  }
              } else {
                  this.$Message.error('服务器繁忙请稍后')
              }
          })
      },
      // 查看
      readFile1() {
          const tempPage = window.open('', '_blank')
          readFile().then(res => {
              const data = res.data
              if (data) {
                  if (data.msgCode === 0) {
                      console.log(data.msgContent)
                      tempPage.location = data.msgContent
                  }
              } else {
                  this.$Message.error('服务器繁忙请稍后')
              }

          })
      },

      // 获取全部数据
      myUploadFiles(pageNum1) {
          myUploadFiles(JSON.parse(localStorage.getItem('projectId')).id, pageNum1, this.pageSize1, this.searchFile1).then(res => {
              const data = res.data
              if (data) {
                  if (res.data.msgCode === 0) {
                      this.totalElements1 = data.msgData.totalElements
                      this.tableData1 = data.msgData.content
                  }
              } else {
                  this.$Message.error('服务器繁忙请稍后')
              }
          })
      },

      // 分页
      changePage1(index) {
          this.pageNum1 = index
          this.myUploadFiles(this.pageNum1)
      },
      // 收搜
      searchFiles1() {
          this.pageNum1 = 1
          this.myUploadFiles(this.pageNum1)
      },
      // 下载
      downLoad1(row) {
          downloadFile(row.id).then(res => {
              if (res.status === 200) {
                  mkLink(res.data, row)
                  this.$Message.success('下载成功')
              }
          }).catch(error => {
              this.$Message.error('下载失败')
          })
      },
    //--------------------我的分享---------
    // 查看
    readFile2 () {
      const tempPage = window.open('', '_blank')
      readFile().then(res => {
        const data = res.data
        if (data) {
          if (data.msgCode === 0) {
            console.log(data.msgContent)
            tempPage.location = data.msgContent
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },

    // 获取全部数据
    getShareFiles (pageNumber) {
      shareFiles(
        JSON.parse(localStorage.getItem('projectId')).id,
        pageNumber,
        this.pageSize2,
        this.searchValue2
      ).then(res => {
        if (res.status === 200) {
          const data = res.data
          if (data.msgCode === 0) {
            this.tableData2 = data.msgData.content
            this.totalElements2 = data.msgData.totalElements
            console.log(data.msgData.content)
            // 处理多个名字中间加逗号
            res.data.msgData.content.forEach((content, index) => {
              // json转化为数组 数组转化为字符串
              if (content.users.length > 0) {
                let values = content.users
                let result = []
                for (let i = 0; i < values.length; i++) {
                  let name = values[i].realName
                  result.push(name)
                }
                this.tableData2[index].users = result.toString()
              } else {
                this.tableData2[index].users = ''
              }
            })
          } else {
            this.$Message.error(data.msgContent)
          }
        } else {
          this.$Message.error('服务器繁忙请稍后')
        }
      })
    },
    // 搜索
    searchFiles2 () {
      this.pageNum2 = 1
      this.getShareFiles(this.pageNum2)
    },
    // 分页
    changePage2 (index) {
      this.pageNum2 = index
      this.getShareFiles(index)
    },
    // 下载
    downLoad2 (row) {
      downloadFile(row.id)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            console.log(res)
            mkLink(res.data, row)
            this.$Message.success('下载成功')
          }
        })
        .catch(error => {
          this.$Message.error('下载失败')
        })
    },
  //------------分享给我的-------------
      // 查看
      readFile3() {
          const tempPage = window.open('', '_blank')
          readFile().then(res => {
              const data = res.data
              if (data) {
                  if (data.msgCode === 0) {
                      console.log(data.msgContent)
                      tempPage.location = data.msgContent
                  }
              } else {
                  this.$Message.error('服务器繁忙请稍后')
              }

          })
      },
      // 获取全部数据
      shareFilesToMe(pageNum) {
          shareFilesToMe(pageNum, this.pageSize3, this.searchFile3, JSON.parse(localStorage.getItem('projectId')).id).then(res => {
              const data = res.data
              if (data) {
                  if (data.msgCode === 0) {
                      console.log(data.msgData.content)
                      this.totalElements3 = data.msgData.totalElements
                      this.tableData3 = data.msgData.content
                  }
              } else {
                  this.$Message.error('服务器繁忙请稍后')
              }
          })
      },
      // 收搜
      searchFiles3() {
          this.pageNum3 = 1
          this.shareFilesToMe(this.pageNum3)
      },
      // 分页
      changePage3(index) {
          this.pageNum3 = index
          this.shareFilesToMe(this.pageNum3)
      },
      // 下载
      downLoad3(row) {
          downloadFile(row.id).then(res => {
              if (res.status === 200) {
                  mkLink(res.data, row)
                  this.$Message.success('下载成功')
              }
          }).catch(error => {
              this.$Message.error('下载失败')
          })
      }
  },
  mounted(){
    console.log('1')
    console.log(JSON.parse(sessionStorage.getItem('tree_odeId')))
      axios.request({
          url: '/docs/directories/tree/' + JSON.parse(localStorage.getItem('projectId')).id,
          method: 'get'
      }).then(res => {
          console.log(res)
          if (res.data.msgCode === 0) {
              let dirs = res.data.msgData
            this.treeData.push(dirs);
            console.log(dirs)
            console.log(this.treeData)
          if(JSON.parse(sessionStorage.getItem('tree_odeId'))){
            // console.log(JSON.parse(sessionStorage.getItem('tree_odeId')))
            this.fontData(this.treeData,JSON.parse(sessionStorage.getItem('tree_odeId')))
            this.getParent(this.treeData,JSON.parse(sessionStorage.getItem('tree_odeId')))
             let getParentData=this.getParent(this.treeData,JSON.parse(sessionStorage.getItem('tree_odeId')))
               getParentData.pop()
             getParentData.forEach(v=>{
                 v.expand=true
            })
            console.log(getParentData)
            console.log(getParentData.length)
            if(getParentData.length===0){

              console.log(this.tree_ode)
              if(this.treeData[0].children.length!==0){
                this.treeData[0].children[0].selected = true
                this.isDisable=this.treeData[0].children[0].isRoot
                this.tree_ode=this.treeData[0].children
                console.log(this.treeData[0].children)
              }else {
                this.treeData[0].selected = true
                this.isDisable=this.treeData[0].isRoot
                this.tree_ode =this.treeData
              }
            }
          }else {
            console.log(this.tree_ode)
            if(this.treeData[0].children.length!==0){
              this.treeData[0].children[0].selected = true
              this.isDisable=this.treeData[0].children[0].isRoot
              this.tree_ode=this.treeData[0].children
              console.log(this.treeData[0].children)
            }else {
              this.treeData[0].selected = true
              this.isDisable=this.treeData[0].isRoot
              this.tree_ode =this.treeData
            }
          }
          } else {
              this.$Message.error(res.data.msgContent)
          }
          // 默认获取表格数据
          this.allshuju()
      })
  },
}
</script>
<style src='../style/index.css' scoped></style>

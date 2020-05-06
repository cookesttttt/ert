<template>
  <Row :gutter="10" style="height: 100%">
    <!--树形控件-->
    <Col span="5" style="height: 100%">
      <Card style="height: 100%">
        <div style="text-align: left;margin-left: 5px">
          <Button type="primary" icon="md-settings" @click="directoryClick">
            文档目录管理
          </Button>
        </div>
        <Tree ref="tree" id="tree" :data="treeData" :render="renderContent"></Tree>
      </Card>
    </Col>
    <Col span="19" style="height: 100%">
      <Card style="height: 100%">
        <!--分享 上传 搜索-->
        <div class="search-con">
          <div class="left">
            <ButtonGroup>
              <Button class="search-btn"  @click="handleSelectRow">分享传阅</Button>
              <Button class="search-btn" @click="upload" type="primary">上传文件</Button>
            </ButtonGroup>
          </div>
          <div class="right">
            <Select class="search-col" v-model="shuju" @on-change="allshuju" style="width: 120px">
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
</template>
<script>
    import './index.less'
    import axios from '@/libs/api.request'
    import {deletedFile, readFile} from '@/api/docs/file'
    import {mkDirTree} from '@/libs/util'

    export default {
        name: 'documentation',
        data() {
            return {
                shuju: '-1', // 默认所有目录
                current: '1', // 当前目录
                allData: '-1', // 所有目录
                // 树结构数据
                treeData: [],
                // 选中的文件
                tree_ode: '',
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
                        fixed: 'left'
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
                        title: '文件编号',
                        tooltip: true,
                        key: 'fileNumber',
                        width: 200
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
                                            deletedFile(this.tableData[params.index].id).then(res => {
                                                const data = res.data
                                                if (data) {
                                                    if (data.msgCode === 0) {
                                                        this.tableData.splice(params.index, 1)
                                                        this.$Message.success('操作成功')
                                                        this.allshuju(this.shuju, false)
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

                ]
            }
        },
        methods: {
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
                            fontSize: '16px',
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
                                // 当前目录和所有目录的切换
                                this.shuju = this.current
                                this.pageNum = 1
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
                            h('Icon', {
                                props: {
                                    type: 'md-folder',
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
                    ])
                } else {
                    return h('span', {
                        style: {
                            display: 'inline-block',
                            width: '90%',
                            fontSize: '16px',
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
                                // 当前目录和所有目录的切换
                                this.shuju = this.current
                                this.pageNum = 1
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

            // 分页
            getpage(index) {
                this.pageNum = index
                if (this.shuju === '-1') {
                    this.fileData(this.pageNum, this.pageSize, -1).then(res => {
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
            allshuju(dirId, isToFirst) {
                let searchFlag = 0
                if (this.tree_ode[0]) {
                    this.tree_ode[0].selected = false
                }
                if (isToFirst) {
                    this.pageNum = 1
                }

                if (this.tree_ode[0]) {
                    // todo 值
                    dirId = this.tree_ode[0].id
                } else {
                    console.log('请选择目录')
                    // this.$Message.error({content: '请选中目录'})
                }
                if (dirId !== this.current) {
                    searchFlag = 1
                }
                axios.request({
                    url: '/docs/fileInfos/' + JSON.parse(localStorage.getItem('projectId')).id + '/' + this.pageNum + '/' + this.pageSize + '/' + dirId + '/' + searchFlag,
                    method: 'get'
                }).then(res => {
                    if (res.data.msgCode === 0) {
                        this.totalElements = res.data.msgData.totalElements
                        this.tableData = res.data.msgData.content
                    } else {
                        this.$Message.error(res.data.msgContent)
                    }
                })
            },
            // 搜索
            searchAdd() {
                let bean = {}
                bean.keyWord = this.searchValue
                if (this.current === '1') {
                    bean.dirId = this.tree_ode[0].id
                    bean.searchFlag = 2
                } else {
                    bean.dirId = this.treeData[0].id
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
            autoClick() {
                this.$nextTick(() => {
                    setTimeout(function () {
                        let e = document.createEvent('MouseEvents')
                        e.initEvent('click', true, true)
                        $('#tree ul:first-child li>span:nth-child(2)')[0].dispatchEvent(e)
                    }, 1000)
                })
            }
        },
        watch: {
            // 监听上传成功后数据刷新
            $route(to, from) {
                if (this.tree_ode[0]) {
                    if (to.name === '文档管理') {
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
            }
        },
        mounted() {
            this.autoClick()
            // 默认获取树结构数据
            axios.request({
                url: 'docs/directories/' + JSON.parse(localStorage.getItem('projectId')).id,
                method: 'get'
            }).then(res => {
                console.log(res)
                if (res.data.msgCode === 0) {
                    let dirs = res.data.msgData
                    dirs.forEach(dir => {
                        if (dir.parentId === 0) {
                            dir.expand = true
                            dir.selected = true
                        }
                    })
                    let result = mkDirTree(dirs)
                    this.treeData = result
                } else {
                    this.$Message.error(res.data.msgContent)
                }
                // 默认获取表格数据
                this.allshuju(this.treeData[0].id)
            })
        }
    }
</script>

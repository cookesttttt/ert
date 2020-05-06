<template>
  <Card>
    <div>
      <Button type="primary" @click="processDivision">工序划分</Button>
    </div>
    <Table border :columns="columns4" :data="data1" style="marginTop:20px"></Table>
  </Card>
</template>

<script>
export default {
  data () {
    return {
      columns4: [
        {
          title: '选择',
          width: 70,
          type: '_checked',
          align: 'center',
          fixed: 'left',
          render: (h, { row, index }) => {
            let _that = this
            return h('div', [
              h('Checkbox', {
                props: {
                  value: row._checked
                },
                on: {
                  'on-change': e => {
                    this.data1.forEach(items => {
                      this.$set(items, '_checked', false)
                    })
                    if (e == false) {
                      this.selectList = ''
                    } else {
                      this.selectList = row
                    }
                    this.data1[index]._checked = e
                  }
                }
              })
            ])
          }
        },
        {
          type: 'index',
          width: 70,
          align: 'center',
          title: '序号',
          fixed: 'left'
        },
        {
          title: '单位工程名称',
          align: 'center',
          width: 340,
          fixed: 'left',
          key: 'name',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    console.log(params.row.name)
                  }
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '分布分项划分完成',
          align: 'center',
          width: 200,
          key: 'relName'
        },
        {
          title: '工序划分完成状态',
          align: 'center',
          width: 200,
          key: 'number'
        },
        {
          title: '计量章节',
          align: 'center',
          width: 100,
          key: 'relName'
        },
        {
          title: '编号',
          align: 'center',
          width: 120,
          key: 'isTrue'
        },
        {
          title: '创建人',
          align: 'center',
          width: 130,
          key: 'relName'
        },
        {
          title: '创建时间',
          align: 'center',
          width: 130,
          key: 'relName'
        },
        {
          title: '操作',
          key: 'action',
          width: 258,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    width: '60px'
                  },
                  on: {
                    click: () => {
                      this.compile(params.index)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',
                    width: '60px'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                },
                '删除'
              ),
              h(
                'Button',
                {
                  props: {
                    size: 'small'
                  },
                  style: {
                    width: '60px'
                  },
                  on: {
                    click: () => {
                      this.check(params.index)
                    }
                  }
                },
                '划分'
              )
            ])
          }
        }
      ],
      data1: [],
      selectList: '' // 单选框选中
    }
  },
  methods: {
    processDivision () {
      this.$router.push({
        name: '工序'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

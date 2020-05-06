/*
//按钮的封装

const btns = {
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '你确定要删除吗?'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params);
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('Button',
      {
        props: {
          type: 'text',
          ghost: true
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-trash',
            size: 18,
            color: '#000000'
          }
        },
          )
      ])
    ])
  },
  down: (h, params, vm) => {
    return h('Button', {
        props: {
          type: 'text',
          ghost: true
        }
      }, [
        h('Icon', {
            props: {
              type: 'md-cloud-download',
              size: 18,
              color: '#000000'
            }
          },
        )
      ])
  },
  look:(h, params, vm) => {
    return h('Button', {
      props: {
        type: 'text',
        ghost: true
      }
    }, [
      h('Icon', {
          props: {
            type: 'md-eye',
            size: 18,
            color: '#000000'
          }
        },
      )
    ])
  },
}

export default btns

*/

import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  isShowFirst:true // 当只有此菜单时 覆盖一级菜单
 *  keepAlive:true // 需要缓存的视图组件
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  // 登录
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  // 忘记密码
  {
    path: '/forgetPassword',
    name: 'forgetPassword',
    meta: {
      title: 'forgetPassword - 忘记密码',
      hideInMenu: true
    },
    component: () => import('@/view/forgetPassword/forgetPassword.vue')
  },

  // 注册
  {
    path: '/sign_in',
    name: 'sign_in',
    meta: {
      title: 'sign_in - 注册',
      hideInMenu: true
    },
    component: () => import('@/view/signIn/sign-in.vue')
  },
  // 首页
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  // 通讯录
  {
    path: '/address',
    meta: {
      hideInMenu: true,
      title: '通讯录'
    },
    component: Main,
    children: [
      {
        path: 'addressList',
        name: 'addressList',
        meta: {
          icon: 'ios-build',
          hideInMenu: true,
          title: '通讯录'
        },
        component: () => import('@/view/addressList/addressList/addressList')
      }
    ]
  },
  // 基础设置
  {
    path: '/basicSetting',
    name: '基础设置',
    meta: {
      icon: 'ios-build',
      title: '基础设置',
      num: 0
    },
    component: Main,
    children: [
      // 组织机构
      // {
      //   path: 'Organizations',
      //   name: '组织架构',
      //   meta: {
      //     // icon: 'logo-buffer',
      //     title: '组织架构',
      //     num: 1
      //   },
      //   component: () =>
      //     import('@/view/basicSetting/Organization/structure/structure.vue')
      // },
      {
        path: 'structure',
        name: '组织架构图',
        meta: {
          // icon: 'logo-buffer',
          title: '组织架构图',
          num: 3,
          hideInBread: true,
          hideInMenu: true
        },
        component: () =>
          import('@/view/basicSetting/Organization/structure/structure.vue')
      },
      {
        path: 'userTable',
        name: '组织架构',
        meta: {
          // icon: 'ios-apps',
          title: '组织架构',
          // hideInBread: true,
          // hideInMenu: true,
          keepAlive: true,
          num: 1
        },
        component: () =>
          import(
            '@/view/basicSetting/Organization/userTable/newUserTable.vue'
          )
      },
      {
        path: 'OrganizationMaintenance',
        name: '组织架构维护',
        meta: {
          // icon: 'logo-buffer',
          title: '组织架构维护',
          hideInBread: true,
          hideInMenu: true,
          // num: 2
          num: 72
        },
        component: () =>
          import(
            '@/view/basicSetting/Organization/OrganizationMaintenance/OrganizationMaintenance.vue'
          )
      },
      // {
      //   path: 'Postmaintenance',
      //   name: '岗位维护',
      //   meta: {
      //     // icon: 'logo-buffer',
      //     title: '岗位维护',
      //     num: 4
      //   },
      //   component: () =>
      //     import(
      //       '@/view/basicSetting/Organization/Postmaintenance/Postmaintenance.vue'
      //     )
      // },
      // 个人信息
      {
        path: 'personalInformation',
        name: '我的信息',
        meta: {
          // icon: 'ios-apps',
          title: '我的信息',
          hideInBread: true,
          hideInMenu: true,
          num: 5
        },
        component: () =>
          import(
            '@/view/basicSetting/personalInformation/personalInformation.vue'
          )
      },
      // 项目信息
      {
        path: 'itemInformation',
        name: '项目信息',
        meta: {
          // icon: 'ios-apps',
          title: '项目信息',
          num: 7
        },
        component: () =>
          import('@/view/basicSetting/itemInformation/itemInformation.vue')
      },

      // 分部分项
      {
        path: '/partial',
        name: '分部分项',
        meta: {
          // icon: 'ios-apps',
          title: '分部分项',
          num: 8
        },
        component: parentView,
        children: [
          {
            path: 'partial',
            name: '单位分部分项工程',
            meta: {
              // icon: 'logo-buffer',
              title: '单位分部分项工程',
              num: 9
            },
            component: () =>
              import('@/view/basicSetting/partial/partial/partial.vue')
          },
          {
            path: 'processDivision',
            name: '工序划分',
            meta: {
              // icon: 'logo-buffer',
              title: '工序划分',
              num: 10
            },
            component: () =>
              import(
                '@/view/basicSetting/partial/processDivision/processDivision.vue'
              )
          },
          {
            path: 'subDivision',
            name: '分部分项划分',
            meta: {
              // icon: 'logo-buffer',
              hideInMenu: true,
              title: '分部分项划分'
            },
            component: () =>
              import('@/view/basicSetting/partial/subDivision/subDivision.vue')
          },
          {
            path: 'process',
            name: '工序',
            meta: {
              // icon: 'logo-buffer',
              hideInMenu: true,
              title: '工序'
            },
            component: () =>
              import('@/view/basicSetting/partial/process/process.vue')
          }
        ]
      }
      // 人事管理
      // {
      //   path: 'personnelManagement',
      //   name: '人事管理',
      //   meta: {
      //     icon: 'ios-apps',
      //     title: '人事管理'
      //   },
      //   component: () =>
      //     import(
      //       '@/view/basicSetting/personnelManagement/personnelManagement.vue'
      //     )
      // }
    ]
  },
  // 行政办公
  // {
  //   path: '/tab',
  //   name: '表格',
  //   meta: {
  //     icon: 'ios-build',
  //     title: '表格',
  //   },
  //   component: Main,
  //   children:[
  //     {
  //       path: 'tables',
  //       name: '表格',
  //       meta: {
  //         // icon: 'logo-buffer',
  //         title: '表格',
  //       },
  //       component: () =>
  //         import('@/view/dddddddd/ooooo.vue')
  //     },
  //   ]
  // },
  {
    path: '/administration',
    name: '行政办公',
    meta: {
      icon: 'ios-paper',
      title: '行政办公',
      num: 36
    },
    component: Main,
    children: [
      // 车辆管理
      /*    {
            path: 'vehicleGuideDiagram',
            name: 'vehicleGuideDiagram',
            meta: {
              // icon: 'ios-car',
              title: '车辆管理导向图',

            },
            component: () =>
              import('@/view/administration/cars/vehicleGuideDiagram.vue')
          }, */
      {
        path: 'vehicleFile',
        name: '车辆管理',
        meta: {
          // icon: 'ios-car',
          title: '车辆管理',
          num: 37
        },
        component: () =>
          import('@/view/administration/cars/vehicleFile/vehicleFile.vue')
      },
      {
        path: 'truckingOrder',
        name: '派车返车记录',
        meta: {
          // icon: 'ios-car',
          title: '车辆信息',
          num: 40
        },
        component: () =>
          import(
            '@/view/administration/cars/truckingOrder/truckingOrder.vue'
          )
      },
      {
        path: 'vehicleRefueling',
        name: '加油信息',
        meta: {
          // icon: 'ios-car',
          title: '加油信息',
          num: 41
        },
        component: () =>
          import(
            '@/view/administration/cars/vehicleRefueling/vehicleRefueling.vue'
          )
      },
      {
        path: 'vehicleViolation',
        name: '违章信息',
        meta: {
          // icon: 'ios-car',
          title: '违章信息',
          num: 42
        },
        component: () =>
          import(
            '@/view/administration/cars/vehicleViolation/vehicleViolation.vue'
          )
      },
      {
        path: 'maintenance',
        name: '维护保养',
        meta: {
          // icon: 'ios-car',
          title: '维护保养',
          num: 43
        },
        component: () =>
          import('@/view/administration/cars/maintenance/maintenance.vue')
      },
      {
        path: 'insuranceRegistration',
        name: '保险登记',
        meta: {
          // icon: 'ios-car',
          title: '保险登记',
          num: 44
        },
        component: () =>
          import(
            '@/view/administration/cars/insuranceRegistration/insuranceRegistration.vue'
          )
      },
      {
        path: 'annualInspectionRegistration',
        name: '年检登记',
        meta: {
          // icon: 'ios-car',
          title: '年检登记',
          num: 45
        },
        component: () =>
          import(
            '@/view/administration/cars/annualInspectionRegistration/annualInspectionRegistration.vue'
          )
      },
      {
        path: 'otherCharges',
        name: '其他费用',
        meta: {
          // icon: 'ios-car',
          title: '其他费用',
          num: 46
        },
        component: () =>
          import('@/view/administration/cars/otherCharges/otherCharges.vue')
      },

      // 会议管理
      {
        path: 'meetingCategory',
        name: '会议类别管理',
        meta: {
          // icon: 'ios-people',
          title: '会议类别管理',
          num: 48
        },
        component: () =>
          import('@/view/administration/meeting/meetingCategory/index.vue')
      },
      {
        path: 'recordManagement',
        name: '会议记录管理',
        meta: {
          // icon: 'ios-people',
          title: '会议记录管理',
          num: 47
        },
        component: () =>
          import(
            '@/view/administration/meeting/recordManagement/recordManagement.vue'
          )
      },
      {
        path: 'new_meeting',
        name: '新建会议记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建会议记录'
        },
        component: () =>
          import('@/view/administration/meeting/newMeeting/newMeeting.vue')
      },
      {
        path: 'editmeeting',
        name: '会议编辑',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '会议编辑'
        },
        component: () =>
          import(
            '@/view/administration/meeting/editmeeting/editmeeting.vue'
          )
      },
      {
        path: 'viewMeeting',
        name: '会议详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '会议详情'
        },
        component: () =>
          import('@/view/administration/meeting/viewMeeting/index.vue')
      },

      // 物资用品
      // component: parentView,
      {
        path: 'materialsSupplies',
        name: '办公用品管理',
        meta: {
          // icon: 'ios-cube',
          title: '办公用品管理',
          num: 51
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/suppliesManagement.vue'
          )
      },
      {
        path: 'suppliesCategory',
        name: 'suppliesCategory',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          // icon: 'ios-cube',
          title: '用品类别管理',
          num: 53
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/suppliesCategory/index.vue'
          )
      },
      {
        path: 'suppliesName',
        name: 'suppliesName',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          // icon: 'ios-cube',
          title: '用品名称管理',
          num: 54
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/suppliesName/index.vue'
          )
      },
      {
        path: 'warehouseManagement',
        name: 'warehouseManagement',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          // icon: 'ios-cube',
          title: '库房管理',
          num: 55
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/warehouseManagement/index.vue'
          )
      },
      {
        path: 'warehousingRegistration',
        name: 'warehousingRegistration',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          // icon: 'ios-cube',
          title: '入库登记',
          num: 56
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/warehousingRegistration/index.vue'
          )
      },
      {
        path: 'newStorage',
        name: 'newStorage',

        meta: {
          // icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '新建入库单'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/warehousingRegistration/newStorage/index.vue'
          )
      },
      {
        path: 'editStorage',
        name: 'editStorage',
        meta: {
          // icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '编辑入库单'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/warehousingRegistration/editStorage/index.vue'
          )
      },
      {
        path: 'warehousingRegistrationcopy',
        name: 'warehousingRegistrationcopy',
        meta: {
          // icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '复制创建入库'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/warehousingRegistration/warehousingRegistrationcopy/index.vue'
          )
      },
      {
        path: 'outWarehousingRegistration',
        name: 'outWarehousingRegistration',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          // icon: 'ios-cube',
          title: '出库登记',
          num: 57
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/outWarehousingRegistration/index.vue'
          )
      },
      {
        path: 'newIssueDoc',
        name: 'newIssueDoc',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '新建出库单'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/outWarehousingRegistration/newIssueDoc/index.vue'
          )
      },
      {
        path: 'editIssueDoc',
        name: 'editIssueDoc',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '编辑出库单'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/outWarehousingRegistration/editIssueDoc/index.vue'
          )
      },
      {
        path: 'outWarehousingRegistrationCopy',
        name: 'outWarehousingRegistrationCopy',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '复制创建出库'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/outWarehousingRegistration/outWarehousingRegistrationCopy/index.vue'
          )
      },
      {
        path: 'straightInOut',
        name: 'straightInOut',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          // icon: 'ios-cube',
          title: '直入直出',
          num: 58
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/straightInOut/index.vue'
          )
      },
      {
        path: 'newStraightInOut',
        name: 'newStraightInOut',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '新建直入直出'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/straightInOut/newStraightInOut/index.vue'
          )
      },
      {
        path: 'editStraightInOut',
        name: 'editStraightInOut',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '编辑直入直出'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/straightInOut/editStraightInOut/index.vue'
          )
      },
      {
        path: 'straightInOutCopy',
        name: 'straightInOutCopy',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '复制创建直入直出'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/straightInOut/straightInOutCopy/index'
          )
      },
      {
        path: 'stocking',
        name: 'stocking',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          // icon: 'ios-cube',
          title: '库存盘点',
          num: 59
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/stocking/index.vue'
          )
      },
      {
        path: 'newStocking',
        name: 'newStocking',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '新建盘点单'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/stocking/newStocking/index.vue'
          )
      },
      {
        path: 'editStocking',
        name: 'editStocking',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '编辑盘点单'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/stocking/editStocking/index.vue'
          )
      },
      {
        path: 'stockingCopy',
        name: 'stockingCopy',
        meta: {
          icon: 'ios-cube',
          hideInBread: true,
          hideInMenu: true,
          title: '复制创建盘点单'
        },
        component: () =>
          import(
            '@/view/administration/materialSupplies/stocking/stockingCopy/index.vue'
          )
      }

    ]
  },
  // 进度控制
  {
    path: '/progressControl',
    meta: {
      icon: 'ios-options',
      title: '进度管理',
      num: 11
    },
    component: Main,
    children: [
      // 计划编制
      {
        path: 'planning',
        name: '计划编制',
        meta: {
          // icon: 'ios-apps',
          title: '计划编制',
          num: 12
        },
        component: () => import('@/view/progressControl/planning/planning.vue')
      },
      // 期间计划
      {
        path: 'aggregateScheduling',
        name: '总进度计划',
        meta: {
          // icon: 'ios-apps',
          title: '总进度计划'
        },
        component: () =>
          import(
            '@/view/progressControl/aggregateScheduling/aggregateScheduling.vue'
          )
      },
      // 进度控制
      {
        path: 'progressControl',
        name: '进度管理',
        meta: {
          // icon: 'ios-apps',
          title: '进度管理',
          num: 14
        },
        component: () =>
          import('@/view/progressControl/progressControl/progressControl.vue')
      }
    ]
  },

  // 财务管理
  {
    path: '/financial',
    name: '财务管理',
    meta: {
      icon: 'logo-yen',
      title: '财务管理',
      num: 67
    },
    component: Main,
    children: [
      {
        path: 'offerBudget',
        name: '目标报价预算',
        meta: {
          // icon: 'logo-buffer',
          title: '目标报价预算',
          num: 68
        },
        component: () => import('@/view/financial/budgeting/offerBudget/offerBudget.vue')
      },
      {
        path: 'costBudget',
        name: '成本消耗预算',
        meta: {
          // icon: 'logo-buffer',
          title: '成本消耗预算',
          num: 69
        },
        component: () => import('@/view/financial/budgeting/costBudget/costBudget.vue')
      },
      {
        path: 'personnelCostBudget',
        name: '人员费用成本预算',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '人员费用成本预算'
        },
        component: () => import('@/view/financial/budgeting/personnelCostBudget/personnelCostBudget.vue')
      },
      {
        path: 'officeCostBudget',
        name: '现场办公费用成本预算',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '现场办公费用成本预算'
        },
        component: () => import('@/view/financial/budgeting/officeCostBudget/officeCostBudget.vue')
      },
      {
        path: 'financialAccounting',
        name: '财务做账',
        meta: {
          // icon: 'ios-apps',
          title: '财务做账'
        },
        component: () =>
          import(
            '@/view/financial/financialAccounting/financialAccounting.vue'
          )
      },
      {
        path: 'financialStatistics',
        name: '财务统计',
        meta: {
          // icon: 'ios-apps',
          title: '财务统计',
          num: 70
        },
        component: () =>
          import('@/view/financial/financialStatistics/financialStatistics.vue')
      }
    ]
  },

  // 机械设备管理
  {
    path: '/mechanicalEquipment',
    name: '机械设备',
    meta: {
      icon: 'logo-buffer',
      title: '机械设备',
      num: 15
    },
    component: Main,
    children: [
      {
        path: 'mechanicalType',
        name: '机械设备类型管理',
        meta: {
          // icon: 'ios-apps',
          title: '机械设备类型管理',
          num: 16
        },
        component: () =>
          import('@/view/mechanicalEquipment/mechanicalType/index.vue')
      },
      {
        path: 'usePlan',
        name: '机械设备使用计划',
        meta: {
          // icon: 'ios-apps',
          title: '机械设备使用计划',
          num: 17
        },
        component: parentView,
        children: [
          {
            path: 'usePlan',
            name: 'usePlan',
            meta: {
              // icon: 'ios-apps',
              title: '机械计划导向图',
              num: 18
            },
            component: () =>
              import('@/view/mechanicalEquipment/usePlan/usePlan.vue')
          },
          {
            path: 'integratedPlanning',
            name: 'integratedPlanning',
            meta: {
              // icon: 'ios-apps',
              title: '整体使用计划',
              num: 19
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/usePlan/integratedPlanning/index.vue'
              )
          },
          {
            path: 'periodProject',
            name: 'periodProject',
            meta: {
              // icon: 'ios-apps',
              title: '期间使用计划',
              num: 20
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/usePlan/periodProject/index.vue'
              )
          },
          {
            path: 'annualPlan',
            name: 'annualPlan',
            meta: {
              // icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '年度使用计划',
              num: 21
            },
            component: () =>
              import('@/view/mechanicalEquipment/usePlan/annualPlan/index.vue')
          },
          {
            path: 'seasonalPlan',
            name: 'seasonalPlan',
            meta: {
              // icon: 'ios-apps',
              title: '季度使用计划',
              hideInBread: true,
              hideInMenu: true,
              num: 22
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/usePlan/seasonalPlan/index.vue'
              )
          },
          {
            path: 'monthlyPlan',
            name: 'monthlyPlan',
            meta: {
              // icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '每月使用计划',
              num: 23
            },
            component: () =>
              import('@/view/mechanicalEquipment/usePlan/monthlyPlan/index.vue')
          }
        ]
      },
      {
        path: 'purchasingManagement',
        name: '采购管理',
        meta: {
          // icon: 'ios-apps',
          title: '采购管理',
          num: 24
        },
        component: parentView,
        children: [
          {
            path: 'purchasingManagement',
            name: 'purchasingManagement',
            meta: {
              // icon: 'ios-apps',
              title: '采购管理导向图'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/purchasingManagement.vue'
              )
          },
          {
            path: 'supplier',
            name: 'supplier',
            meta: {
              // icon: 'ios-apps',
              title: '供应商管理'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/supplier/index.vue'
              )
          },
          {
            path: 'newSupplier',
            name: 'newSupplier',
            meta: {
              // icon: 'ios-apps',
              title: '新增供应商',
              hideInBread: true,
              hideInMenu: true
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/supplier/newSupplier.vue'
              )
          },
          {
            path: 'editSupplier',
            name: 'editSupplier',
            meta: {
              // icon: 'ios-apps',
              title: '编辑供应商',
              hideInBread: true,
              hideInMenu: true
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/supplier/editSupplier.vue'
              )
          },
          {
            path: 'procurement',
            name: 'procurement',
            meta: {
              // icon: 'ios-apps',
              title: '采购计划'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/procurement/index.vue'
              )
          },
          {
            path: 'newEquipment',
            name: 'newEquipment',
            meta: {
              // icon: 'ios-apps',
              title: '增加机械设备',
              hideInBread: true,
              hideInMenu: true
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/procurement/newEquipment.vue'
              )
          },
          {
            path: 'purchaseApplication',
            name: 'purchaseApplication',
            meta: {
              // icon: 'ios-apps',
              title: '采购申请单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/purchaseApplication/index.vue'
              )
          },
          {
            path: 'newApplication',
            name: 'newApplication',
            meta: {
              icon: 'ios-apps',
              title: '新建申请单',
              hideInBread: true,
              hideInMenu: true
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/purchaseApplication/newApplication.vue'
              )
          },
          {
            path: 'editApplication',
            name: 'editApplication',
            meta: {
              icon: 'ios-apps',
              title: '编辑申请单',
              hideInBread: true,
              hideInMenu: true
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/purchaseApplication/editApplication.vue'
              )
          },
          {
            path: 'contractPurchase',
            name: 'contractPurchase',
            meta: {
              // icon: 'ios-apps',
              title: '采购合同'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/contractPurchase/index.vue'
              )
          },
          {
            path: 'newMachineryContract',
            name: 'newMachineryContract',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新增机械采购合同'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/contractPurchase/newMachineryContract.vue'
              )
          },
          {
            path: 'editMachineryContract',
            name: 'editMachineryContract',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑机械采购合同'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/contractPurchase/editMachineryContract.vue'
              )
          },
          {
            path: 'equipmentAcceptance',
            name: 'equipmentAcceptance',
            meta: {
              // icon: 'ios-apps',
              title: '设备验收'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/equipmentAcceptance/index.vue'
              )
          },
          {
            path: 'newAcceptance',
            name: 'newAcceptance',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建验收单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/equipmentAcceptance/newAcceptance.vue'
              )
          },
          {
            path: 'editAcceptance',
            name: 'editAcceptance',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑验收单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/purchasingManagement/equipmentAcceptance/editAcceptance.vue'
              )
          }
        ]
      },
      {
        path: 'leaseManagement',
        name: '租赁管理',
        meta: {
          // icon: 'ios-apps',
          title: '租赁管理',
          num: 25
        },
        component: parentView,
        children: [
          /* {
            path: 'leaseManagement',
            name: 'leaseManagement',
            meta: {
              // icon: 'ios-apps',
              title: '租赁管理导向图'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leaseManagement.vue'
              )
          }, */
          {
            path: 'leasePlan',
            name: 'leasePlan',
            meta: {
              // icon: 'ios-apps',
              title: '租赁需求计划'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leasePlan/index.vue'
              )
          },
          {
            path: 'newDemandOrder',
            name: 'newDemandOrder',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新增需求单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leasePlan/newDemandOrder.vue'
              )
          },
          {
            path: 'leaseOrder',
            name: 'leaseOrder',
            meta: {
              // icon: 'ios-apps',
              title: '租赁申请单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leaseOrder/index.vue'
              )
          },
          {
            path: 'newLeaseOrder',
            name: 'newLeaseOrder',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新增租赁申请单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leaseOrder/newLeaseOrder.vue'
              )
          },
          {
            path: 'editLeaseOrder',
            name: 'editLeaseOrder',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑租赁申请单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leaseOrder/editLeaseOrder.vue'
              )
          },
          {
            path: 'leaseAgreement',
            name: 'leaseAgreement',
            meta: {
              // icon: 'ios-apps',
              title: '租赁合同'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leaseAgreement/index.vue'
              )
          },
          {
            path: 'newLeaseContract',
            name: 'newLeaseContract',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建租赁合同'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leaseAgreement/newLeaseContract.vue'
              )
          },
          {
            path: 'editLeaseContract',
            name: 'editLeaseContract',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑租赁合同'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/leaseAgreement/editLeaseContract.vue'
              )
          },
          {
            path: 'equipmentAdmission',
            name: 'equipmentAdmission',
            meta: {
              // icon: 'ios-apps',
              title: '入场管理'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentAdmission/index.vue'
              )
          },
          {
            path: 'newAdmission',
            name: 'newAdmission',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建入场管理'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentAdmission/newAdmission.vue'
              )
          },
          {
            path: 'editAdmission',
            name: 'editAdmission',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑入场管理'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentAdmission/editAdmission.vue'
              )
          },
          {
            path: 'equipmentComingOut',
            name: 'equipmentComingOut',
            meta: {
              // icon: 'ios-apps',
              title: '出场管理'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentComingOut/index.vue'
              )
          },
          {
            path: 'newAppearance',
            name: 'newAppearance',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建出场管理'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentComingOut/newAppearance.vue'
              )
          },
          {
            path: 'editAppearance',
            name: 'editAppearance',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑出场管理'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentComingOut/editAppearance.vue'
              )
          },
          {
            path: 'offHire',
            name: 'offHire',
            meta: {
              // icon: 'ios-apps',
              title: '停租单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/offHire/index.vue'
              )
          },
          {
            path: 'newSuspensionOrder',
            name: 'newSuspensionOrder',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建停租单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/offHire/newSuspensionOrder.vue'
              )
          },
          {
            path: 'editSuspensionOrder',
            name: 'editSuspensionOrder',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑停租单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/offHire/editSuspensionOrder.vue'
              )
          },
          {
            path: 'paymentRequisition',
            name: 'paymentRequisition',
            meta: {
              // icon: 'ios-apps',
              title: '付款申请单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/paymentRequisition/index.vue'
              )
          },
          {
            path: 'NewPaymentRequisition',
            name: 'NewPaymentRequisition',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建付款申请单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/paymentRequisition/NewPaymentRequisition.vue'
              )
          },
          {
            path: 'editPaymentRequisition',
            name: 'editPaymentRequisition',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑付款申请单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/paymentRequisition/editPaymentRequisition.vue'
              )
          },
          {
            path: 'equipmentSettlement',
            name: 'equipmentSettlement',
            meta: {
              // icon: 'ios-apps',
              title: '设备结算'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentSettlement/index.vue'
              )
          },
          {
            path: 'newSettlementDoc',
            name: 'newSettlementDoc',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建结算单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentSettlement/newSettlementDoc.vue'
              )
          },
          {
            path: 'editSettlementDoc',
            name: 'editSettlementDoc',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑结算单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/leaseManagement/equipmentSettlement/editSettlementDoc.vue'
              )
          }
        ]
      },
      {
        path: 'Equipment',
        name: '现场管理',
        meta: {
          // icon: 'ios-apps',
          title: '现场管理',
          num: 26
        },
        component: parentView,
        children: [
          /*      {
            path: 'Equipment',
            name: 'Equipment',
            meta: {
              // icon: 'ios-apps',
              title: '现场管理导向图'
            },
            component: () =>
              import('@/view/mechanicalEquipment/Equipment/Equipment.vue')
          }, */
          {
            path: 'usingRecord',
            name: 'usingRecord',
            meta: {
              // icon: 'ios-apps',
              title: '设备使用记录'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/Equipment/usingRecord/index.vue'
              )
          },
          {
            path: 'newUsageRecord',
            name: 'newUsageRecord',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建使用记录'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/Equipment/usingRecord/newUsageRecord.vue'
              )
          },
          {
            path: 'editUsageRecord',
            name: 'editUsageRecord',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑使用记录'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/Equipment/usingRecord/editUsageRecord.vue'
              )
          },
          {
            path: 'dispatchList',
            name: 'dispatchList',
            meta: {
              // icon: 'ios-apps',
              title: '机械调度单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/Equipment/dispatchList/index.vue'
              )
          },
          {
            path: 'newDispatchList',
            name: 'newDispatchList',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '新建调度单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/Equipment/dispatchList/newDispatchList.vue'
              )
          },
          {
            path: 'editDispatchList',
            name: 'editDispatchList',
            meta: {
              icon: 'ios-apps',
              hideInBread: true,
              hideInMenu: true,
              title: '编辑调度单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/Equipment/dispatchList/editDispatchList.vue'
              )
          },
          {
            path: 'usageStatistics',
            name: 'usageStatistics',
            meta: {
              // icon: 'ios-apps',
              title: '使用统计'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/Equipment/usageStatistics/index.vue'
              )
          },
          {
            path: 'equipmentAccount',
            name: 'equipmentAccount',
            meta: {
              // icon: 'ios-apps',
              title: '设备台账'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/Equipment/equipmentAccount/index.vue'
              )
          }
        ]
      },
      {
        path: 'EquipmentMaintenance',
        name: '设备维保',
        meta: {
          // icon: 'ios-apps',
          title: '设备维保',
          num: 28
        },
        component: parentView,
        children: [
          {
            path: 'maintenanceRecords',
            name: 'maintenanceRecords',
            meta: {
              // icon: 'ios-apps',
              title: '维修记录单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/maintenanceRecords/index.vue')
          },
          {
            path: 'newMaintenanceRecords',
            name: 'newMaintenanceRecords',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              title: '新建维修记录单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/maintenanceRecords/newMaintenanceRecords.vue')
          },
          {
            path: 'editMaintenanceRecords',
            name: 'editMaintenanceRecords',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              title: '编辑维修记录单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/maintenanceRecords/editMaintenanceRecords.vue')
          },
          {
            path: 'engineAttendance',
            name: 'engineAttendance',
            meta: {
              // icon: 'ios-apps',
              title: '保养记录单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/engineAttendance/index.vue')
          },
          {
            path: 'newEngineAttendance',
            name: 'newEngineAttendance',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              title: '新建保养记录单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/engineAttendance/newEngineAttendance.vue')
          },
          {
            path: 'editEngineAttendance',
            name: 'editEngineAttendance',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              title: '编辑保养记录单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/engineAttendance/editEngineAttendance.vue')
          },
          {
            path: 'mechanicalInspection',
            name: 'mechanicalInspection',
            meta: {
              // icon: 'ios-apps',
              title: '机械检查单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/mechanicalInspection/index.vue')
          },
          {
            path: 'newMechanicalInspection',
            name: 'newMechanicalInspection',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              title: '新建机械检查单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/mechanicalInspection/newMechanicalInspection.vue')
          },
          {
            path: 'editMechanicalInspection',
            name: 'editMechanicalInspection',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              title: '编辑机械检查单'
            },
            component: () =>
              import('@/view/mechanicalEquipment/EquipmentMaintenance/mechanicalInspection/editMechanicalInspection.vue')
          }
        ]
      },
      {
        path: 'EquipmentSafety',
        name: '设备安全管理',
        meta: {
          // icon: 'ios-apps',
          title: '设备安全管理',
          num: 27
        },
        component: parentView,
        children: [
          {
            path: 'regularSpecialInspection',
            name: 'regularSpecialInspection',
            meta: {
              // icon: 'ios-apps',
              title: '定期专项检查单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/EquipmentSafety/regularSpecialInspection/index.vue'
              )
          },
          {
            path: 'newSpecialInspection ',
            name: 'newSpecialInspection',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              // icon: 'ios-apps',
              title: '新建定期专项检查单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/EquipmentSafety/regularSpecialInspection/newSpecialInspection.vue'
              )
          },
          {
            path: 'editSpecialInspection',
            name: 'editSpecialInspection',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              // icon: 'ios-apps',
              title: '编辑定期专项检查单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/EquipmentSafety/regularSpecialInspection/editSpecialInspection.vue'
              )
          },
          {
            path: 'equipmentProtection',
            name: 'equipmentProtection',
            meta: {
              // icon: 'ios-apps',
              title: '设备防护单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/EquipmentSafety/equipmentProtection/index.vue'
              )
          },
          {
            path: 'newEquipmentProtection',
            name: 'newEquipmentProtection',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              // icon: 'ios-apps',
              title: '新建设备防护单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/EquipmentSafety/equipmentProtection/newEquipmentProtection.vue'
              )
          },
          {
            path: 'editEquipmentProtection',
            name: 'editEquipmentProtection',
            meta: {
              hideInBread: true,
              hideInMenu: true,
              // icon: 'ios-apps',
              title: '编辑设备防护单'
            },
            component: () =>
              import(
                '@/view/mechanicalEquipment/EquipmentSafety/equipmentProtection/editEquipmentProtection.vue'
              )
          }
        ]
      }

    ]
  },

  // 材料物资管理
  {
    path: '/materials',
    name: '材料物资管理',
    meta: {
      icon: 'logo-buffer',
      title: '材料物资管理',
      num: 30
    },
    component: Main,
    children: [
      {
        path: 'usePlan1',
        name: '物资需用量',
        meta: {
          // icon: 'ios-apps',
          title: '物资需用量',
          num: 31
        },
        component: () =>
          import('@/view/mechanicalEquipment/usePlan/usePlan.vue')
      },
      {
        path: 'purchasingManagement1',
        name: '物资采购管理',
        meta: {
          // icon: 'ios-apps',
          title: '物资采购管理',
          num: 32
        },
        component: () =>
          import(
            '@/view/mechanicalEquipment/purchasingManagement/purchasingManagement.vue'
          )
      },
      {
        path: 'leaseManagement1',
        name: '物资库房管理',
        meta: {
          // icon: 'ios-apps',
          title: '物资库房管理',
          num: 33
        },
        component: () =>
          import(
            '@/view/mechanicalEquipment/leaseManagement/leaseManagement.vue'
          )
      },
      {
        path: 'leaseManagement2',
        name: '周转材料管理',
        meta: {
          // icon: 'ios-apps',
          title: '周转材料管理',
          num: 34
        },
        component: () =>
          import(
            '@/view/mechanicalEquipment/leaseManagement/leaseManagement.vue'
          )
      },
      {
        path: 'leaseManagement3',
        name: '物资成本管理',
        meta: {
          // icon: 'ios-apps',
          title: '物资成本管理',
          num: 35
        },
        component: () =>
          import(
            '@/view/mechanicalEquipment/leaseManagement/leaseManagement.vue'
          )
      }
    ]
  },

  /*  // 质量管理
  {
    path: '/qualityControl',
    name: '质量管理',
    meta: {
      icon: 'ios-construct',
      title: '质量管理'
    },
    component: Main,
    children: [

    ]
  },
  // 安全环保
  {
    path: '/envAndSafety',
    name: '安全环保',
    meta: {
      icon: 'md-nuclear',
      title: '安全环保'
    },
    component: Main,
    children: []
  }, */
  // 合同管理
  {
    path: '/contractManagement',
    name: '合同管理',
    meta: {
      icon: 'ios-create',
      title: '合同管理',
      num: 29
    },
    component: Main,
    children: []
  },
  {
    path: '/qualityControl',
    name: '质量管理',
    meta: {
      icon: 'logo-pinterest',
      title: '质量管理',
      num: 200
    },
    component: Main,
    children: [
      {
        path: 'qualityCategory',
        name: '质量规范类别',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '质量规范类别'
        },
        component: () =>
          import('@/view/qualityControl/qualityCategory/index.vue')
      },
      {
        path: 'qualityspecification',
        name: '质量规范',
        meta: {
          title: '质量规范'
        },
        component: () =>
          import('@/view/qualityControl/qualityspecification/index.vue')
      },
      {
        path: 'newQualityCode',
        name: '新建质量规范',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建质量规范'
        },
        component: () =>
          import('@/view/qualityControl/qualityspecification/newQualityCode.vue')
      },
      {
        path: 'editQualityCode',
        name: '编辑质量规范',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑质量规范'
        },
        component: () =>
          import('@/view/qualityControl/qualityspecification/editQualityCode.vue')
      },
      {
        path: 'detailsQualityCode',
        name: '质量规范详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '质量规范详情'
        },
        component: () =>
          import('@/view/qualityControl/qualityspecification/detailsQualityCode.vue')
      },
      {
        path: 'qualityServices',
        name: '质量事务',
        meta: {
          title: '质量事务'
        },
        component: () =>
          import('@/view/qualityControl/qualityServices/index.vue')
      },
      {
        path: 'newQualityServices',
        name: '新建质量事务',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建质量事务'
        },
        component: () =>
          import('@/view/qualityControl/qualityServices/newQualityServices.vue')
      },
      {
        path: 'editQualityServices',
        name: '编辑质量事务',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑质量事务'
        },
        component: () =>
          import('@/view/qualityControl/qualityServices/editQualityServices.vue')
      },
      {
        path: 'viewQualityServices',
        name: '质量事务详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '质量事务详情'
        },
        component: () =>
          import('@/view/qualityControl/qualityServices/viewQualityServices.vue')
      },
      {
        path: 'qualityObjectives',
        name: '质量目标',
        meta: {
          title: '质量目标'
        },
        component: () =>
          import('@/view/qualityControl/qualityObjectives/index.vue')
      },
      {
        path: 'newQualityObjectives',
        name: '新建质量目标',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建质量目标'
        },
        component: () =>
          import('@/view/qualityControl/qualityObjectives/newQualityObjectives.vue')
      },
      {
        path: 'editQualityObjectives',
        name: '编辑质量目标',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑质量目标'
        },
        component: () =>
          import('@/view/qualityControl/qualityObjectives/editQualityObjectives.vue')
      },
      {
        path: 'viewQualityObjectives',
        name: '质量目标详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '质量目标详情'
        },
        component: () =>
          import('@/view/qualityControl/qualityObjectives/viewQualityObjectives.vue')
      },
      {
        path: 'qualityAccidentRecords',
        name: '质量事故记录',
        meta: {
          title: '质量事故记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityAccidentRecords/index.vue')
      },
      {
        path: 'newQualityAccidentRecords',
        name: '新建质量事故记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建质量事故记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityAccidentRecords/newQualityAccidentRecords.vue')
      },
      {
        path: 'editQualityAccidentRecords',
        name: '编辑质量事故记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑质量事故记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityAccidentRecords/editQualityAccidentRecords.vue')
      },
      {
        path: 'viewQualityAccidentRecords',
        name: '质量事故记录详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '质量事故记录详情'
        },
        component: () =>
          import('@/view/qualityControl/qualityAccidentRecords/viewQualityAccidentRecords.vue')
      },
      {
        path: 'qualityInspectionRecords',
        name: '质量检查记录',
        meta: {
          title: '质量检查记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityInspectionRecords/index.vue')
      },
      {
        path: 'newQualityInspectionRecords',
        name: '新建质量检查记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建质量检查记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityInspectionRecords/newQualityInspectionRecords.vue')
      },
      {
        path: 'editQualityInspectionRecords',
        name: '编辑质量检查记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑质量检查记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityInspectionRecords/editQualityInspectionRecords.vue')
      },
      {
        path: 'viewQualityInspectionRecords',
        name: '质量检查记录详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '质量检查记录详情'
        },
        component: () =>
          import('@/view/qualityControl/qualityInspectionRecords/viewQualityInspectionRecords.vue')
      },
      {
        path: 'qualityActivityRecords',
        name: '质量活动记录',
        meta: {
          title: '质量活动记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityActivityRecords/index.vue')
      },
      {
        path: 'newQualityActivityRecords',
        name: '新建质量活动记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建质量活动记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityActivityRecords/newQualityActivityRecords.vue')
      },
      {
        path: 'editQualityActivityRecords',
        name: '编辑质量活动记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑质量活动记录'
        },
        component: () =>
          import('@/view/qualityControl/qualityActivityRecords/editQualityActivityRecords.vue')
      },
      {
        path: 'viewQualityActivityRecords',
        name: '质量活动记录详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '质量活动记录详情'
        },
        component: () =>
          import('@/view/qualityControl/qualityActivityRecords/viewQualityActivityRecords.vue')
      }
    ]
  },
  {
    path: '/securityAdministration',
    name: '安全管理',
    meta: {
      icon: 'logo-angular',
      title: '安全管理',
      num: 201
    },
    component: Main,
    children: [
      {
        path: 'securityCategory',
        name: '安全类别',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '安全类别'
        },
        component: () =>
          import('@/view/securityAdministration/securityCategory/index.vue')
      },
      {
        path: 'safeCode',
        name: '安全规范',
        meta: {
          title: '安全规范'
        },
        component: () =>
          import('@/view/securityAdministration/safeCode/index.vue')
      },
      {
        path: 'newSafeCode',
        name: '新建安全规范',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建安全规范'
        },
        component: () =>
          import('@/view/securityAdministration/safeCode/newSafeCode.vue')
      },
      {
        path: 'editSafeCode',
        name: '编辑安全规范',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑安全规范'
        },
        component: () =>
          import('@/view/securityAdministration/safeCode/editSafeCode.vue')
      },
      {
        path: 'viewSafeCode',
        name: '安全规范详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '安全规范详情'
        },
        component: () =>
          import('@/view/securityAdministration/safeCode/viewSafeCode.vue')
      },
      {
        path: 'securityServices',
        name: '安全事务',
        meta: {
          title: '安全事务'
        },
        component: () =>
          import('@/view/securityAdministration/securityServices/index.vue')
      },
      {
        path: 'newSecurityServices',
        name: '新建安全事务',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建安全事务'
        },
        component: () =>
          import('@/view/securityAdministration/securityServices/newSecurityServices.vue')
      },
      {
        path: 'editSecurityServices',
        name: '编辑安全事务',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑安全事务'
        },
        component: () =>
          import('@/view/securityAdministration/securityServices/editSecurityServices.vue')
      },
      {
        path: 'viewSecurityServices',
        name: '安全事务详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '安全事务详情'
        },
        component: () =>
          import('@/view/securityAdministration/securityServices/viewSecurityServices.vue')
      },
      {
        path: 'safetyPrecautions',
        name: '安全措施',
        meta: {
          title: '安全措施'
        },
        component: () =>
          import('@/view/securityAdministration/safetyPrecautions/index.vue')
      },
      {
        path: 'newSafetyPrecautions',
        name: '新建安全措施',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建安全措施'
        },
        component: () =>
          import('@/view/securityAdministration/safetyPrecautions/newSafetyPrecautions.vue')
      },
      {
        path: 'editSafetyPrecautions',
        name: '编辑安全措施',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑安全措施'
        },
        component: () =>
          import('@/view/securityAdministration/safetyPrecautions/editSafetyPrecautions.vue')
      },
      {
        path: 'viewSafetyPrecautions',
        name: '安全措施详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '安全措施详情'
        },
        component: () =>
          import('@/view/securityAdministration/safetyPrecautions/viewSafetyPrecautions.vue')
      },
      {
        path: 'safetyCheckRecords',
        name: '安全检查记录',
        meta: {
          title: '安全检查记录'
        },
        component: () =>
          import('@/view/securityAdministration/safetyCheckRecords/index.vue')
      },
      {
        path: 'newSafetyCheckRecords',
        name: '新建安全检查记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建安全检查记录'
        },
        component: () =>
          import('@/view/securityAdministration/safetyCheckRecords/newSafetyCheckRecords.vue')
      },
      {
        path: 'editSafetyCheckRecords',
        name: '编辑安全检查记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑安全检查记录'
        },
        component: () =>
          import('@/view/securityAdministration/safetyCheckRecords/editSafetyCheckRecords.vue')
      },
      {
        path: 'viewSafetyCheckRecords',
        name: '安全检查记录详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '安全检查记录详情'
        },
        component: () =>
          import('@/view/securityAdministration/safetyCheckRecords/viewSafetyCheckRecords.vue')
      },

      {
        path: 'safetyIncidentRecord',
        name: '安全事故记录',
        meta: {
          title: '安全事故记录'
        },
        component: () =>
          import('@/view/securityAdministration/safetyIncidentRecord/index.vue')
      },
      {
        path: 'newSafetyIncidentRecord',
        name: '新建安全事故记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '新建安全事故记录'
        },
        component: () =>
          import('@/view/securityAdministration/safetyIncidentRecord/newSafetyIncidentRecord.vue')
      },
      {
        path: 'editSafetyIncidentRecord',
        name: '编辑安全事故记录',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '编辑安全事故记录'
        },
        component: () =>
          import('@/view/securityAdministration/safetyIncidentRecord/editSafetyIncidentRecord.vue')
      },
      {
        path: 'viewSafetyIncidentRecord',
        name: '安全事故记录详情',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '安全事故记录详情'
        },
        component: () =>
          import('@/view/securityAdministration/safetyIncidentRecord/viewSafetyIncidentRecord.vue')
      }
    ]
  },
  // 费用管理
  {
    path: '/expenseManagement',
    name: '费用管理',
    meta: {
      icon: 'ios-hammer',
      title: '费用管理'
    },
    component: Main,
    children: []
  },
  // 竣工资料
  {
    path: '/completionData',
    name: '竣工资料',
    meta: {
      icon: 'md-planet',
      title: '竣工资料'
    },
    component: Main,
    children: []
  },
  // 文档中心
  {
    path: '/doc',
    name: '文档中心',
    meta: {
      icon: 'ios-book',
      title: '文档中心',
      num: 60
    },
    component: Main,
    children: [
      {
        path: 'directory',
        name: '文档目录管理',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          // icon: 'ios-book',
          title: '文档目录管理',
          num: 62
        },
        component: () => import('@/view/docs/directory/index.vue')
      },
      {
        path: 'share',
        name: '分享传阅',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '分享传阅',
          // icon: 'ios-book',
          beforeCloseName: 'fxcy'
        },
        component: () => import('@/view/docs/share')
      },
      {
        path: 'Myshare',
        name: '文档中心',
        meta: {
          icon: 'ios-book',
          isShowFirst: true,
          title: '文档中心',
          num: 64
        },
        component: () => import('@/view/docs/Myshare')
      },
      {
        path: 'upload',
        name: '文件上传',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '文件上传'
        },
        component: () => import('@/view/docs/upload/upload.vue')
      }
    ]
  },
  // home页错误收集
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },

  // 传参
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`
          // notCache: true
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`
          // notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/welcome',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'welcome',
        name: '开始',
        meta: {
          icon: 'md-flower',
          title: '开始'
          // notCache: true
        },
        component: () => import('@/view/welcome/welcome.vue')
      }
    ]
  },
  // 控制台
  {
    path: '/console',
    name: 'console',
    meta: {
      title: '控制台',
      hideInBread: true,
      hideInMenu: true
    },
    component: () => import('@/view/console/console.vue'),
    children: [
      {
        path: 'Home',
        name: 'consoleHome',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '控制台首页'
        },
        component: () => import('@/view/console/consoleHome/consoleHome')
      },
      {
        path: 'newProject',
        name: '新建项目',
        meta: {
          hideInBread: true,
          hideInMenu: true,

          title: '新建项目'
        },
        component: () => import('@/view/console/newProject/newProject')
      },
      {
        path: 'highwayManagement',
        name: '公路工程施工项目管理',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '公路工程施工项目管理'
        },
        component: () =>
          import('@/view/console/highwayManagement/highwayManagement')
      },
      {
        path: 'waterManagement',
        name: '水利水电工程',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '水利水电工程'
        },
        component: () =>
          import('@/view/console/waterManagement/waterManagement')
      },
      {
        path: 'servicesManagement',
        name: '市政工程',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '市政工程'
        },
        component: () =>
          import('@/view/console/servicesManagement/servicesManagement')
      },
      {
        path: 'roomManagement',
        name: '房建工程',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '房建工程'
        },
        component: () => import('@/view/console/roomManagement/roomManagement')
      }
    ]
  },

  // 账号管理
  {
    path: '/accountSettings',
    name: 'accountSettings',
    meta: {
      title: '账号管理',
      hideInBread: true,
      hideInMenu: true
    },
    component: () => import('@/view/accountSettings/accountSettings.vue'),
    children: [
      {
        path: 'securitySettings',
        name: 'securitySettings',
        meta: {
          hideInBread: true,
          hideInMenu: true,
          title: '安全设置'
        },
        component: () => import('@/view/accountSettings/securitySettings/securitySettings')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]

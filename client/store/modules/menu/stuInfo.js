/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '学生信息',
  meta: {
    icon: 'fa-info',
    expanded: false
  },
  children: [
    {
      name: '学生信息导入',
      path: '/stuInfo/import',
      meta: {
        label: '学生信息导入'
      },
      component: lazyLoading('stuInfo/Import')
    },
    {
      name: '当前分流周期',
      path: '/stuInfo/now',
      meta: {
        label: '当前分流周期'
      },
      component: lazyLoading('stuInfo/Now')
    },
    {
      name: '历史数据库',
      path: '/stuInfo/history',
      meta: {
        label: '历史数据库'
      },
      component: lazyLoading('stuInfo/History')
    }
  ]
}

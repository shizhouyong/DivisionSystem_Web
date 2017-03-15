/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '分流操作',
  meta: {
    icon: 'fa-file-excel-o',
    expanded: false,
    limit: 4
  },
  children: [
    {
      name: '分流操作',
      path: '/shunt/oper',
      meta: {
        label: '分流操作'
      },
      limit: 1,
      component: lazyLoading('shunt/Oper')
    },
    {
      name: '分流计划',
      path: '/shunt/plan',
      meta: {
        label: '分流计划'
      },
      limit: 1,
      component: lazyLoading('shunt/Plan')
    }
  ]
}

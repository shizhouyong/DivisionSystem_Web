/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '分流志愿',
  meta: {
    icon: 'fa fa-envelope-open-o',
    expanded: false,
    limit: 1
  },
  children: [
    {
      name: '志愿填报',
      path: '/volunteer/fill',
      meta: {
        label: '志愿填报'
      },
      limit: 2,
      component: lazyLoading('volunteer/Fill')
    },
    {
      name: '分流结果',
      path: '/volunteer/result',
      meta: {
        label: '分流结果'
      },
      limit: 2,
      component: lazyLoading('volunteer/Result')
    },
    {
      name: '志愿查询',
      path: '/volunteer/batchQuery',
      meta: {
        label: '志愿查询'
      },
      limit: 4,
      component: lazyLoading('volunteer/BatchQuery')
    }
  ]
}

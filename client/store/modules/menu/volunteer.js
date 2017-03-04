/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '分流志愿',
  meta: {
    icon: 'fa fa-file-excel-o',
    expanded: false
  },
  children: [
    {
      name: '志愿填报',
      path: '/volunteer/fill',
      meta: {
        label: '志愿填报'
      },
      component: lazyLoading('volunteer/Fill')
    },
    {
      name: '志愿查询',
      path: '/volunteer/search',
      meta: {
        label: '志愿查询'
      },
      component: lazyLoading('volunteer/Search')
    }
  ]
}

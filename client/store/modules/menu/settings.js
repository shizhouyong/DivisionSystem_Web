/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '基础设置',
  meta: {
    icon: 'fa-cog',
    expanded: false,
    limit: 4
  },
  children: [
    {
      name: '基础信息',
      path: '/settings/basicInfo',
      meta: {
        label: '基础信息'
      },
      limit: 1,
      component: lazyLoading('settings/BasicInfo')
    }
  ]
}

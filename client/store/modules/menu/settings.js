/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '基础设置',
  meta: {
    icon: 'fa-cog',
    expanded: false
  },
  children: [
    {
      name: '基础信息',
      path: '/settings/basicInfo',
      meta: {
        label: '基础信息'
      },
      component: lazyLoading('settings/BasicInfo')
    },
    {
      name: '教师信息',
      path: '/settings/teacherInfo',
      meta: {
        label: '教师信息'
      },
      component: lazyLoading('settings/TeacherInfo')
    }
  ]
}

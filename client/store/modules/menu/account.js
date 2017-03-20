/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '我的账号',
  meta: {
    icon: 'fa-user',
    expanded: false,
    limit: 1
  },
  children: [
    {
      name: '学生账号',
      path: '/account/stu',
      meta: {
        label: '学生账号'
      },
      limit: 2,
      component: lazyLoading('account/Stu')
    },
    {
      name: '管理员账号',
      path: '/account/teacher',
      meta: {
        label: '管理员账号'
      },
      limit: 4,
      component: lazyLoading('account/Teacher')
    }
  ]
}

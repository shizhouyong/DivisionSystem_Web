/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '账号管理',
  meta: {
    icon: 'fa-user',
    expanded: false,
    limit: 4
  },
  children: [
    {
      name: '管理员账号',
      path: '/accountManage/admin',
      meta: {
        label: '管理员账号'
      },
      limit: 4,
      component: lazyLoading('accountManage/Admin')
    },
    {
      name: '学生账号',
      path: '/accountManage/student',
      meta: {
        label: '学生账号'
      },
      limit: 4,
      component: lazyLoading('accountManage/Student')
    }
  ]
}

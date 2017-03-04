/**
 * Created by shizhouyong on 2017/1/15.
 */

import lazyLoading from './lazyLoading'

export default {
  name: '账号管理',
  meta: {
    icon: 'fa-user',
    expanded: false
  },
  children: [
    {
      name: '学生账号',
      path: '/account/stu',
      meta: {
        label: '我的账号'
      },
      component: lazyLoading('account/Stu')
    },
    {
      name: '教师账号',
      path: '/account/teacher',
      meta: {
        label: '我的账号'
      },
      component: lazyLoading('account/Teacher')
    },
    {
      name: '所有账号',
      path: '/account/all',
      meta: {
        label: '所有账号'
      },
      component: lazyLoading('account/All')
    }
  ]
}

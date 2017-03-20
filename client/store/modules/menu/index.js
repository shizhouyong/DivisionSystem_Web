import * as types from '../../mutation-types'
import settings from './settings'
import stuInfo from './stuInfo'
import volunteer from './volunteer'
import account from './account'
import shunt from './shunt'
import accountManage from './accountManage'

// show: meta.label -> name
// name: component name
// meta.label: display label

const state = {
  items: [
    settings,
    stuInfo,
    volunteer,
    shunt,
    accountManage,
    account
  ]
}

const mutations = {
  [types.EXPAND_MENU] (state, menuItem) {
    if (menuItem.index > -1) {
      if (state.items[menuItem.index] && state.items[menuItem.index].meta) {
        state.items[menuItem.index].meta.expanded = menuItem.expanded
      }
    } else if (menuItem.item && 'expanded' in menuItem.item.meta) {
      menuItem.item.meta.expanded = menuItem.expanded
    }
  }
}

export default {
  state,
  mutations
}

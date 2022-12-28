import { createStore } from 'vuex'

import { SET_IS_MENU_VISIBLE } from './constant'

// 创建一个新的 store 实例
const store = createStore({
  state: {
    isMenuVisible: false
  },
  mutations: {
    [SET_IS_MENU_VISIBLE] (state, payload):void {
      state.isMenuVisible = payload
      if (payload) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
})

export default store

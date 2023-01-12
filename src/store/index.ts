import { createStore } from 'vuex'

// api
import { ARTICLE_REQUEST } from '../service/article.api'

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
  },
  actions: {
    // 发布文章
    publishArticleAction ({ commit }, payload) {
      return ARTICLE_REQUEST.publishArticle(payload.params)
    },
    // 获取文章列表
    getArticlesAction ({ commit }, payload) {
      return ARTICLE_REQUEST.getArticleList(payload.query)
    }
  }
})

export default store

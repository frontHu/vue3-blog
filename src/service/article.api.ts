import { API_SERVICE } from './index'

class ArticleAPI extends API_SERVICE {
  publishArticle (params: any) {
    return this.post('publish', params)
  }

  getArticleList (query: any) {
    return this.get('list', query)
  }
}

export const ARTICLE_REQUEST = new ArticleAPI('article')

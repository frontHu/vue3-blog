<template>
  <base-main>
    <div class="article-detail zpw-my-3">
      <a-skeleton :loading="loading" active avatar :paragraph="{ rows: 20 }">
        <article>
          <header class="article__header zpw-flex zpw-items-center zpw-mb-2">
            <img class="avatar" src="@/assets/avatar.jpg" />
            <div class="article__infos">
              <span class="author">Woody Hu</span>
              <sup class="role-tag">博主</sup>
              <div>
                <time>发布于{{  }}</time>
                <span class="read_total">阅读&nbsp;&nbsp;----</span>
              </div>
            </div>
          </header>
          <main class="article__main">
              <a-image :src="articleDetail.poster" class="article__poster" fit="cover" />
              <h2> {{ articleDetail.title }} </h2>
              <section class="md-preview" v-html="purifiedContent"></section>
          </main>
          <div class="copyright">
            <p>
              本文链接：<a :href="postLink">{{ postLink }}</a>
              <br />
              版权声明：本文由<strong>Tusi</strong>原创，发表于{{ formattedTime }}，如需转载，请联系作者授权！
            </p>
          </div>
          <div class="reward__wrapper">
            <p class="reward__tips">您的支持将鼓励我继续创作！</p>
            <a-button type="primary" @click="isRewardVisible = true">赏</a-button>
          </div>
        </article>
      </a-skeleton>
    </div>
  </base-main>

</template>
<script>
import marked from 'marked'
// hljs 按需加载
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/atom-one-dark.css'
import javascript from 'highlight.js/lib/languages/javascript'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import shell from 'highlight.js/lib/languages/shell'
import json from 'highlight.js/lib/languages/json'
import plaintext from 'highlight.js/lib/languages/plaintext'
import DOMPurify from 'dompurify'
import BaseMain from '../../components/base-main.vue'
import { defineComponent, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', html)
hljs.registerLanguage('css', css)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('json', json)
hljs.registerLanguage('plaintext', plaintext)
export default defineComponent({
  name: 'ArticleDetail',
  components: {
    BaseMain
  },
  setup (props) {
    const store = useStore()
    const route = useRoute()

    const loading = ref(false)
    const articleDetail = ref({ })
    const purifiedContent = ref('')

    const setMarkedOptions = () => {
      const renderer = new marked.Renderer()
      renderer.link = function customLink (href, title, text) {
        return `<a class="link" href="${href}" target="_blank" title="${text}">${text}</a>`
      }
      renderer.image = function customImage (href, title, text) {
        return (
          `<a class="img-wrapper" href="${href}" target="_blank" title="${text}">` + `<img src="${href}" alt="${text}">` + '</a>'
        )
      }
      marked.setOptions({
        renderer,
        highlight: function (code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        },
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      })
    }

    const init = async () => {
      const res = await store.dispatch('getArticleDetails', {
        id: route.params.id
      })
      articleDetail.value = { ...res }
      setMarkedOptions()
      const markedContent = marked(articleDetail.value.text)
      purifiedContent.value = DOMPurify.sanitize(markedContent)
    }
    init()
    return {
      articleDetail,
      loading,
      purifiedContent
    }
  }
})
</script>
<style lang="scss" scoped>
.article-detail {
  .avatar {
    width: 48px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .article__infos {
    margin-left: 14px;
    display: inline-block;
    vertical-align: top;
    color: #999;
    font-size: 14px;
    .author {
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }
    .role-tag {
      margin-left: 6px;
      background: #1989fa;
      padding: 0 4px;
      border-radius: 4px;
      color: #fff;
      font-size: 12px;
      display: inline-block;
      line-height: 1.5;
    }
    .read_total {
      margin-left: 8px;
    }
  }
  .article__main {
    > h2 {
      margin: 0 0 0.6em 0;
      font-size: 1.8em;
    }
  }
}
</style>
<style lang="scss" scoped src="./md-render.scss"></style>

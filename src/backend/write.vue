<template>
  <section class="article-write">
    <a-spin :spinning="false">
      <a-form
        :model="form"
        class="form-write"
        ref="formRef"
        :label-col="{ span: 3 }">
        <a-form-item>
          <a-button type="primary" @click="publish">{{ "保存博客" }}</a-button>
        </a-form-item>
        <!-- 封面 -->
        <a-form-item name="poster" label="封面url">
          <a-input
            v-model:value="form.poster"
            class="input-simple zpw-w-full"
            placeholder="暂时使用在线图片URL，比如七牛云等云存储地址">
          </a-input>
        </a-form-item>
        <!-- 标题 -->
        <a-form-item name="articleTitle" label="文章标题">
          <a-input v-model:value="form.title" class="input-simple" placeholder="请输入标题"> </a-input>
        </a-form-item>
        <!-- 摘要 -->
        <a-form-item name="summary" label="文章摘要">
          <a-textarea
            v-model:value="form.abstract"
            class="input-simple"
            placeholder="请输入文章摘要"
            :auto-size="{ minRows: 2, maxRows: 4 }"/>
        </a-form-item>
        <!-- 文章 -->
        <a-form-item name="articleText" label="正文部分">
          <a-row :gutter="20">
            <a-col :span="12">
              <a-textarea
                v-model:value="form.text"
                class="md-textarea"
                @change="onMdContentChange"
                placeholder="请输入markdown格式的正文"/>
            </a-col>
            <a-col :span="12">
              <section class="md-preview" v-html="purifiedContent"></section>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-spin>
  </section>
</template>

<script lang="ts">
import marked from 'marked'
// hljs 按需加载
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import shell from 'highlight.js/lib/languages/shell'
import json from 'highlight.js/lib/languages/json'
import plaintext from 'highlight.js/lib/languages/plaintext'
// 皮肤
import 'highlight.js/styles/atom-one-dark.css'
import DOMPurify from 'dompurify'
import { throttle } from 'lodash-es'
import { Form, Input, message, Modal, Radio, Spin } from 'ant-design-vue'
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ARTICLE_REQUEST } from '../service/article.api'
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', html)
hljs.registerLanguage('css', css)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('json', json)
hljs.registerLanguage('plaintext', plaintext)

export default defineComponent({
  name: 'WritePage',
  setup () {
    const store = useStore()
    const visible = ref(false)
    const collapsed = ref(false)
    const form = reactive({
      poster: '',
      title: '',
      abstract: '',
      text: ''
    })
    const initMarked = () => {
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
        // 只解析符合markdown.pl定义的，不修正markdown的错误
        pedantic: false,
        // 启动Github样式的Markdown
        gfm: true,
        // 支持Github换行符，必须打开gfm选项
        breaks: false,
        // deprecated，应该自己使用sanitize库
        sanitize: false,
        // 优化列表输出
        smartLists: true,
        smartypants: false,
        xhtml: false
      })
    }

    initMarked()
    const purifiedContent = ref('')

    const handleRender = ({ target }: { target: HTMLTextAreaElement }) => {
      const content = target.value
      const markedContent = marked(content)
      purifiedContent.value = DOMPurify.sanitize(markedContent)
    }

    const onMdContentChange = throttle(handleRender, 300)
    // 发布文章
    const publish = async () => {
      const res = await store.dispatch('publishArticleAction', { params: form })
    }
    return {
      visible,
      collapsed,
      form,
      onMdContentChange,
      purifiedContent,
      publish
    }
  }
})
</script>

<style lang="scss" scoped>
.workspace__wrapper {
  background-color: #fff;
  padding: 20px;
}

:deep(.md-textarea),.md-preview {
  // height: 860px;
  min-height: 500px;
  padding: 16px 20px;
}

:deep(.md-textarea) {
  resize: none;
}

.md-preview {
  border: 1px solid #d9d9d9;
  overflow: auto;
}

:deep(.input-simple) {
  max-width: 640px;
}

:deep(.category-checkbox) {
  display: flex;
  align-items: center;
  .ant-checkbox + span {
    flex: 1;
  }
}

:deep(.articlePoster) {
  display: block;
  margin-top: 10px;
  width: 640px;
  height: 360px;
}
</style>

<style lang="scss" scoped src="../views/articleDetail/md-render.scss"></style>

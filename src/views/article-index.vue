<template>
  <div class="article-main zpw-my-2">
    <article-item />
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import ArticleItem from '../components/article/article-item.vue'
export default defineComponent({
  name: 'ArticleIndex',
  components: {
    ArticleItem
  }
})
</script>

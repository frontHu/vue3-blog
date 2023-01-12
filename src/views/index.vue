<template>
  <base-main>
    <a-skeleton :loading="false" active :paragraph="{ rows: 12 }">
      <template v-if="true">
        <section class="article-list">
          <article-card
            v-for="(item, index) in articles"
            :key="index"
            :article="item">
          </article-card>
        </section>
      </template>
      <template v-else>
        <a-empty />
      </template>
    </a-skeleton>
  </base-main>
</template>
<script>
import { defineComponent, ref } from 'vue'
import BaseMain from '../components/base-main.vue'
import ArticleCard from '../components/articles/article-card.vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'HomeIndex',
  components: {
    BaseMain,
    ArticleCard
  },
  setup () {
    const store = useStore()

    const articles = ref([])
    const init = async () => {
      const res = await store.dispatch('getArticlesAction', {
        query: {
          pageNo: 0
        }
      })
      articles.value = res
    }

    init()

    return {
      articles
    }
  }
})
</script>
<style lang="scss">
.home-app {
  width: 100%;
  height: 100%;
}
</style>

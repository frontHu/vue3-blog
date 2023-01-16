<template>
  <section class="article-item">
    <div class="article-item-info zpw-mb-1/2">
      <div class="time zpw-flex zpw-items-center">
        <field-time-outlined />
        <span class="zpw-ml-1">2022年11月24日</span>
      </div>
    </div>
    <div class="article-item-title zpw-text-gray-70 zpw-font-bold zpw-text-20  zpw-mb-1/2">
      {{ article.title }}
    </div>
    <div class="article-item-img">
      <img :src="article.poster" alt="" class="zpw-w-full">
    </div>
    <div class="article-item-desc zpw-mt-2 zpw-mb-1 zpw-text-16">
      {{ article.abstract }}
    </div>
    <div class="article-more">
      <a-button
        type="primary"
        ghost
        @click="$router.push({
          name: 'article',
          params: {
            id: article.id
          }
        })">阅读全文</a-button>
    </div>
  </section>
</template>
<script>
import { FieldTimeOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ArticleCard',
  components: {
    FieldTimeOutlined
  },
  props: {
    article: Object
  }
  // setup (props) { }
})
</script>
<style lang="scss">
.article-item {
  .article-item-img {
    overflow: hidden;
    box-shadow: 0 0 6px rgb(109 43 43 / 10%), 10px 10px 100px rgb(112 100 212 / 24%);
    &:hover {
      transform: scale(1.01);
      transition: transform .2s ease-in-out;
      cursor: pointer;
    }
  }
}
@media screen and (min-width: 1200px) {
  .article-item-img {
    img {
      height: 450px;
    }
  }
}
@media screen and (max-width: 1200px) {
  .article-item-img {
    img {
      height: 450px;
    }
  }
}
@media screen and (max-width: 900px) {
  .article-item-img {
    img {
      height: 300px;
    }
  }
}
@media screen and (max-width: 650px) {
  .article-item-img {
    img {
      height: 200px;
    }
  }
}
</style>

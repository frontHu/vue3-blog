<template>
  <section class="article-item">
    <div class="article-item-info zpw-mb-1/2">
      <div class="time zpw-flex zpw-items-center">
        <field-time-outlined />
        <span class="zpw-ml-1">2022年11月24日</span>
      </div>
    </div>
    <div class="article-item-title zpw-text-gray-70 zpw-font-bold zpw-text-20  zpw-mb-1/2">
      花1块钱让你的网站支持 ChatGPT
    </div>
    <div class="article-item-img">
      <img :src="require('../../assets/test.png')" alt="">
    </div>
    <div class="article-item-desc zpw-mt-2 zpw-mb-1 zpw-text-16">
      聊聊一个使用频率还挺高的组件——全屏组件，顺便了解下什么是 Headless 组件，并尝试动手将一个普通组件改造成 Headless 组件。
    </div>
    <div class="article-more">
      <a-button type="primary" ghost>阅读全文</a-button>
    </div>
  </section>
</template>
<script>
import { defineComponent } from 'vue'
import { FieldTimeOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  components: {
    FieldTimeOutlined
  }
})
</script>
<style lang="scss">
.article-item {
  .article-item-img {
    box-shadow: 0 0 6px rgb(109 43 43 / 10%), 10px 10px 100px rgb(112 100 212 / 24%);
    &:hover {
      transform: scale(1.01);
      transition: transform .2s ease-in-out;
      cursor: pointer;
    }
  }
}
</style>

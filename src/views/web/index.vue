<template>
  <div class="web">
    <div class="web-head zpw-flex zpw-items-center zpw-px-4 zpw-justify-between">
      <div class="icon zpw-flex zpw-items-center">
        <smile-outlined style="font-size:28px" />
        <span class="zpw-ml-2 zpw-text-16">企业网站建设-工作室</span>
      </div>
      <div class="tab zpw-flex zpw-items-center">
        <ul class="zpw-flex zpw-items-center zpw-mb-0">
          <li class="tab-item">首页</li>
          <li class="tab-item">产品与服务</li>
          <li class="tab-item">新闻中心</li>
          <li class="tab-item">解决方案</li>
          <li class="tab-item">关于我们</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { SmileOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  name: 'WebPage',
  components: {
    SmileOutlined
  }
})
</script>
<style lang="scss">
.web {
  width: 100%;
  height: 100%;
  .web-head {
    width: 100%;
    height: 64px;
    box-shadow: 0 0 5px #ccc;
    .icon {
      height: 40px;
    }
    .tab {
      .tab-item {
        margin-left: 24px;
        cursor: pointer;
      }
    }
  }
}
</style>

<template>
  <div class="base-head px-75 zpw-px-1 zpw-py-2 zpw-flex zpw-items-center zpw-justify-center">
    <div class="icon">
      <right-square-outlined
        v-if="!isMenuVisible"
        @click="handleMenuClick"
        style="color:#fff;fontSize:24px;"/>
      <left-square-outlined
        v-else
        @click="handleMenuClick"
        style="color:#fff;fontSize:24px;"/>
    </div>
    <p class="title zpw-text-white">一个有温度的网站</p>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { RightSquareOutlined, LeftSquareOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'BaseHead',
  components: { RightSquareOutlined, LeftSquareOutlined },
  emits: ['onToggleMenu'],
  setup (props, { emit }) {
    const store = useStore()
    const handleMenuClick = () => {
      emit('onToggleMenu')
    }

    const isMenuVisible = computed(() => store.state.isMenuVisible)
    return {
      handleMenuClick,
      isMenuVisible
    }
  }
})
</script>
<style lang="scss">
.base-head {
  position: relative;
  width: 100%;
  min-height: 160px;
  background: linear-gradient(to bottom right,#2177a7,#5fb7ac);
  .icon {
    position: absolute;
    left: 8px;
    top: 16px;
  }
  .title {
    font-size: 24px;
    text-shadow: 0 1px 0 #2e2e2e, 0 2px 0 #2c2c2c, 0 3px 0 #2a2a2a, 0 4px 0 #282828, 0 5px 0 #262626, 0 6px 0 #242424;
  }
}
</style>

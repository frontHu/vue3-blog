<template>
  <div class="base-head zpw-px-1 zpw-py-2">
    <div class="icon">
      <right-square-outlined style="color:#fff;fontSize:24px;"/>
    </div>
    <button @click="handleMenuClick">click</button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { RightSquareOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'BaseHead',
  components: { RightSquareOutlined },
  emits: ['onToggleMenu'],
  setup (props, { emit }) {
    const handleMenuClick = () => {
      emit('onToggleMenu')
    }
    return {
      handleMenuClick
    }
  }
})
</script>
<style lang="scss">
.base-head {
  width: 100%;
  background: linear-gradient(to bottom right,#2177a7,#5fb7ac);
}
</style>

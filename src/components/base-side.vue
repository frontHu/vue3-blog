<template>
  <div class="base-side" :class="{ 'is-visible': isVisible }">

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BaseSide',
  props: {
    isVisible: {
      type: Boolean,
      default: true
    }
  }
})
</script>
<style lang="scss">
.base-side {
  position: absolute;
  top: 0;
  width: 230px;
  height: 100%;
  background: #222;
  transform: translate3d(-100%, 0, 0);
  &.is-visible {
    box-shadow: 0 0 30px 0 rgba(27, 14, 14, 0.3);
  }
}
</style>

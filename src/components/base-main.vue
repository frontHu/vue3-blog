<template>
  <div class="base-main">
    <router-view></router-view>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'BaseMain'
})
</script>
<style lang="scss">
.base-main {
  width: 800px;
  margin: 0 auto;
}
</style>

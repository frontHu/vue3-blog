<template>
  <div
    class="base-main"
    :class="{ slideInLeft: isMenuVisible, slideOutLeft: !isMenuVisible, 'animated faster': isAnimationEnabled }"
    @animationend="onAnimationEnd">
    <base-head @onToggleMenu="onToggleMenu"></base-head>
    <base-side></base-side>
    <main class="base-layout zpw-py-3 base-layout__main">
      <slot />
    </main>
    <base-foot></base-foot>
  </div>
</template>
<script>
import BaseHead from './base-head.vue'
import BaseSide from './base-side.vue'
import BaseFoot from './base-foot.vue'
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'BaseMain',
  components: {
    BaseHead,
    BaseSide,
    BaseFoot
  },
  setup () {
    const store = useStore()
    const isMenuVisible = computed(() => store.state.isMenuVisible)
    const isAnimationEnabled = ref(false)
    const onAnimationEnd = () => {
      if (isMenuVisible.value === false) {
        isAnimationEnabled.value = false
      }
    }
    const onToggleMenu = () => {
      if (isAnimationEnabled.value === false) {
        isAnimationEnabled.value = true
      }
      store.commit('SET_IS_MENU_VISIBLE', !isMenuVisible.value)
      console.log('onToggleMenu')
    }
    return {
      isMenuVisible,
      isAnimationEnabled,
      onAnimationEnd,
      onToggleMenu
    }
  }
})
</script>
<style lang="scss">
.base-main {
  width: 100%;
  height: 100%;
  .base-layout {
    height: 100%;
    margin: 0 auto;
  }
}

@media screen and (min-width: 1200px) {
    .base-layout__main {
        width: 800px;
    }
}
@media screen and (max-width: 1200px) {
  .base-layout__main{
      width: 80%;
      margin: 0 auto;
  }
}

@media screen and (max-width: 750px) {
  .base-layout__main{
      width: 95%;
      margin: 0 auto;
  }
}
</style>

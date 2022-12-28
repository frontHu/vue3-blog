<template>
  <section
    class="home-app"
    :class="{ slideInLeft: isMenuVisible, slideOutLeft: !isMenuVisible, 'animated faster': isAnimationEnabled }"
    @animationend="onAnimationEnd">
    <base-head @onToggleMenu="onToggleMenu"></base-head>
    <base-side></base-side>
    <base-foot></base-foot>
  </section>
</template>
<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import BaseHead from '../../components/base-head.vue'
import BaseSide from '../../components/base-side.vue'
import BaseFoot from '../../components/base-foot.vue'
export default defineComponent({
  name: 'HomeIndex',
  components: {
    BaseHead,
    BaseSide,
    BaseFoot
  },
  setup () {
    const store = useStore()
    console.log(store, 'store')
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
.home-app {
  width: 100%;
  height: 100%;
}
</style>

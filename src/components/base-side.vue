<template>
  <section class="base-side" :class="{ 'is-visible': isVisible }">
    <!-- 信息 -->
    <div class="info zpw-flex zpw-flex-col zpw-items-center zpw-px-1 zpw-py-2">
      <h1 class="name zpw-text-white zpw-mb-2">Woody Hu</h1>
      <div class="avatar">
        <img :src="require('../assets/avatar.jpg')" alt="">
      </div>
      <div class="base zpw-flex zpw-items-center zpw-mt-2 zpw-text-white">
        <environment-outlined />
        <span class="zpw-ml-1">安徽 合肥</span>
      </div>
      <div class="link zpw-flex zpw-justify-center zpw-mt-2">
        <a>
          <WechatOutlined class="zpw-mx-1" style="color:#fff;font-size:20px;"/>
        </a>
        <a href="https://github.com/frontHu">
          <GithubFilled class="zpw-mx-1" style="color:#fff;font-size:20px;" />
        </a>
      </div>
    </div>
    <!-- 菜单 -->
    <div class="menu zpw-mt-2">
      <ul>
        <li
          v-for="(menu, index) in menus"
          :key="index">
          <router-link
            class="zpw-py-1 zpw-pl-2"
            :to="menu.link">
            <span>{{ menu.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import {
  EnvironmentOutlined,
  WechatOutlined,
  GithubFilled
} from '@ant-design/icons-vue'
export default defineComponent({
  name: 'BaseSide',
  components: {
    EnvironmentOutlined,
    WechatOutlined,
    GithubFilled
  },
  props: {
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      menus: [{
        label: '首页',
        link: '/',
        icon: ''
      }, {
        label: '留言',
        link: '/comment',
        icon: ''
      }, {
        label: '前端计划',
        link: '/fe-plan',
        icon: ''
      }, {
        label: '网站建设',
        link: '/web',
        icon: ''
      }]
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
  .info {
    background-color: #393c3e;

    .name {
      font-size: 24px;
      color: rgba(245,157,173,.76);
      font-weight: 700;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .link {
      width: 100%;
    }
  }
  .menu {
    ul {
      li a {
        display: block;
        border-left: 2px solid transparent;
        transition: all .3s ease-in-out;
        font-size: 14px;
        color: #b8c7ce;
        &:hover {
          border-left-color: #3c8dbc;
          background-color: #312e2e;
          color: #b6d5f0;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

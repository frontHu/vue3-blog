<template>
  <a-layout class="zpw-h-full zpw-w-full">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu theme="dark" mode="inline">
        <a-menu-item key="1" >
          <div class="zpw-flex zpw-items-center">
            <user-outlined />
            <span>
              <route-link :to="{to: '/backend/write'}">文章创作</route-link>
            </span>
          </div>
        </a-menu-item>
        <a-menu-item key="2">
          <div class="zpw-flex zpw-items-center">
            <video-camera-outlined />
            <span>文章列表</span>
          </div>
        </a-menu-item>
        <a-menu-item key="3">
          <div class="zpw-flex zpw-items-center">
            <upload-outlined />
            <span>留言管理</span>
          </div>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger zpw-mx-2"
          @click="() => (collapsed = !collapsed)"/>
        <menu-fold-outlined v-else class="trigger zpw-mx-2" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue'
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'BackEnd',
  components: {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined
  }
})
</script>
<style lang="scss">
</style>

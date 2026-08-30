<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
    </div>
    <!-- 顶部菜单 -->
    <div class="layout_tabbar">456</div>
    <!-- 内容展示区域 -->
    <div class="layout_main">
      <p style="height: 100000px; background-color: aqua">123</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/layout/logo/index.vue'
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background: green;
    top: 0;
    left: $base-menu-width;
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background: yellow;
    top: $base-tabbar-height;
    left: $base-menu-width;
    overflow: auto;
    padding: 20px;
  }
}
</style>

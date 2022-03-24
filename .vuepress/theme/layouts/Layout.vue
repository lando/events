<template>
  <ParentLayout />
</template>

<script setup>
import ParentLayout from '@lando/vuepress-theme-default-plus/layouts/Layout.vue';
</script>

<style lang="scss">
@import '../styles/main.scss';
.page-wrapper-outer {
  width: 100vw;
  padding: 0;
  margin: 0;
  display: block;
  height: calc(100vh - 58px);
}
.page-wrapper-inner {
  width: 100vw;
  padding: 0;
  margin: 0;
  display: block;
  .home {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: initial;
    overflow: initial;
  }
}
</style>

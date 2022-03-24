<template>
  <ParentLayout>
    <template #footer>
      <div class="thing"></div>
    </template>
  </ParentLayout>
</template>

<script setup>
import ParentLayout from '@lando/vuepress-theme-default-plus/layouts/Layout.vue';
</script>

<style lang="scss">
@import '../styles/main.scss';
.page-wrapper-outer {
  padding-top: 2em;
}
.navbar-links-wrapper {
  .social-links {
    display: none;
  }
}
</style>

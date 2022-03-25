<template>
  <ParentLayout>
    <template #sidebar-bottom>
      <FooterCta
        heading="What are you waiting for?"
        ctaText="Get Lando Now"
        ctaLink="https://lando.dev/download"
      />
    </template>
    <template #footer>
      <div class="thing"></div>
    </template>
  </ParentLayout>
</template>

<script setup>
import ParentLayout from '@lando/vuepress-theme-default-plus/layouts/Layout.vue';
import FooterCta from '../components/FooterCta.vue';
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
.theme-container {
  .theme-default-content {
    position: relative;
  }
  .sidebar-open .sidebar {
    transform: translateY(0);
    top: var(--navbar-height);
  }
  .sidebar {
    display: none;
    width: 100%;
    z-index: 100;
    background: #fff;;
  }
}

@media (max-width: $MQMobile) {
  .theme-container.sidebar-open {
    overflow: hidden;
    .sidebar {
      transform: none;
      display: block;
      height: 100%;
      position: fixed;
      transition: .5s;
      padding-top: calc(var(--navbar-height) + 2.5rem);
      .navbar-items {
        border: none;
        .navbar-item {
          border-bottom: 1px solid var(--c-border);
          padding: 1.3125rem 0 1.5rem 0rem;
          margin: 0 1.5rem;
          a {
            font-weight: normal;
            font-size: 1.125rem;
            width: 100%;
          }
        }
        .navbar-dropdown-wrapper {
          &:after {
            content: url('../../public/images/down-arrow.svg');
            position: absolute;
            right: 1.125rem;
            top: 1.5rem;

          }
          .title {
            font-weight: normal;
            font-size: 1.125rem;
          }
          .navbar-dropdown-title-mobile {
            width: 100%;
            text-align: left;
          }
          button {
            .arrow {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>

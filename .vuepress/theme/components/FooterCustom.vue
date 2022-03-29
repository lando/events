<template>
  <footer class="footer">
    <SocialLinks
      v-if="social"
      :icons="social"
    />
    <span class="copyright">copyright © 2022 Lando System </span>
    <span class="policies">
      <a href="privacy/">privacy policy</a> |
      <a href="terms/">terms of use</a>
    </span>
  </footer>
</template>

<script setup>
import {useThemeData} from '@vuepress/plugin-theme-data/lib/client';
import SocialLinks from '@lando/vuepress-theme-default-plus/components/SocialLinks.vue';

// Social
const themeData = useThemeData();
const {social} = themeData.value;
</script>

<style lang="scss">
@import '../styles/main.scss';
.footer {
  border-radius: 3px;
  position:absolute;
  bottom: 0;
  right: 25%;
  left: 50%;
  width: 600px;
  margin-left: -300px;
  background: rgb(255, 255, 255, .60);
  overflow: scroll;
  color: var(--c-text);
  text-align: center;
  font-size: 0.9em;
  padding: 1em;
  a {
    color: var(--c-text-quote);
    &:hover {
      color: var(--c-brand);
      text-decoration: underline;
    }
    &.active {
      color: var(--c-brand);
      text-decoration: underline;
    }
  }
  .secondary-nav {
    padding-bottom: 1em;
    a {
      font-weight: 700;
    }
  }
  .social-links {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .social-link {
    display: flex;
    margin: 1em 0.5em;
    background: none;
    opacity: 0.8;
    cursor: pointer;
    svg {
      width: 1.25em;
      height: 1.26em;
      stroke: var(--c-text);
      &:hover {
        stroke: var(--c-brand);
      }
    }
  }
  .copyright {
    padding-left: 3em;
    font-size: 0.7em;
    display: block;
    padding: 0;
    color: var(--c-text);
  }
  .policies {
    font-size: 0.7em;
  }
}
.read-mode {
  .footer {
    display: none;
  }
}
</style>

<template>
  <div :class="{ subscribe: true, 'subscribe-dark': theme === 'dark' }" :style="customStyles">
    <h3>{{ title }}</h3>
    <div id="mc_embed_signup">
      <form action="https://dev.us12.list-manage.com/subscribe/post?u=59874b4d6910fa65e724a4648&amp;id=613837077f" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate subscribe-form" target="_blank" novalidate>
        <input
          id="mce-EMAIL"
          type="email"
          v-model="email"
          placeholder="Email address"
          name="EMAIL"
          class="subscribe-input" />

        <ul style="display: none;" v-if="interests.length > 0">
          <li v-for="(interest, index) in interests" :key="index">
            <input
              type="checkbox"
              :checked="interest.checked"
              :value="interest.id"
              :name="`group[${interest.group}][${interest.id}]`"
              :id="`mce-group[${interest.group}]-${interest.group}-${index}`">
            <label :for="`mce-group[${interest.group}]-${interest.group}-${index}`">{{ interest.label }}</label>
          </li>
        </ul>

        <div id="mce-responses" class="clear">
          <div class="response" id="mce-error-response" style="display:none"></div>
          <div class="response" id="mce-success-response" style="display:none"></div>
        </div>
        <div style="position: absolute; left: -5000px;" aria-hidden="true">
          <input type="text" name="b_59874b4d6910fa65e724a4648_613837077f" tabindex="-1" value="">
        </div>

        <input
          id="mc-embedded-subscribe"
          :class="{ button: true, disabled: !email }"
          :disabled="!email"
          type="submit"
          :value="buttonLabel"
          name="subscribe" />
      </form>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    buttonLabel: {
      type: String,
      default: 'Subscribe',
    },
    customStyles: {
      type: Object,
      default: () => ({
        width: '90%',
      }),
    },
    interests: {
      type: Array,
      default: () => ([]),
    },
    hideInterests: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'Get the latest updates',
    },
    theme: {
      type: String,
      default: 'light',
    },
  },
  data() {
    return {
      email: '',
    };
  },
};
</script>

<style lang="scss">
@import '../styles/main.scss';
</style>

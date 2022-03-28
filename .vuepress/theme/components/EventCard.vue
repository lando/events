<template>
  <div v-if="props.event.show !== false" :class="{'event-card': true, 'active': props.event.active}">
    <div class="event-card-inner">
      <a :href="`#${anchor}`" @click="$emit('toggle-active', id)">
        <h2 :id="anchor">{{ title }}</h2>
      </a>
      <div class="event-details">
        {{ location }} on {{ resolvedDate }}
      </div>

      <div class="event-presenter">
        <div class="event-presenter-name-wrapper">
          <span v-for="(presenter, index) in presenters" class="event-presenter-name" :key="presenter.name">
            <a :href="presenter.link" target="_blank">{{ presenter.name }}</a>
            <span v-if="index !== presenters.length - 1">, </span>
          </span>
        </div>
        <div class="event-presenter-pic-wrapper">
          <div v-for="presenter in presenters" class="event-presenter-pic" :key="presenter.name">
            <a :href="presenter.link" target="_blank"><img :src="presenter.pic" :alt="presenter.name" loading="lazy" /></a>
          </div>
        </div>
      </div>

      <div class="event-summary">
        {{ summary }}
      </div>

      <div class="event-link">
        <a :href="url" target="_blank">Read More</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import dayjs from 'dayjs';

defineEmits(['toggle-active']);

const props = defineProps({
  event: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});

const {id, anchor, location, presenters, timestamp, title, summary, url} = props.event;
const resolvedDate = computed(() => dayjs(timestamp).format('ddd MMM DD YYYY'));
</script>

<style lang="scss" scoped>
@import '../styles/main.scss';
.event-card {
  box-shadow: 0 14px 40px #49424e24;
  border-radius: 6px;
  padding: 2.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.85em;
  background: rgb(255, 255, 255, .60);
  h2 {
    font-size: 2em;
    border: 0;
    margin-top: 0;
    margin-bottom: 0.3em;
    color: $landoGrey;
    &:hover {
      text-decoration: none;
    }
  }
  img {
    width: 24px;
    border-radius: 100%;
  }

  &.active {
    background: rgb(237, 63, 122, .9);
    color: #fff;
    font-weight: 500;
    &:hover {
      text-decoration: none;
    }
    h2 {
      color: #fff;
    }
    svg {
      color: #fff;
    }
    a {
      color: #fff;
      font-weight: 700;
    }
  }
  .event-details {
    color: var(--c-text-quote);
  }
  .event-presenter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    a {
      &:hover {
        text-decoration: underline;
      }
    }
    .event-presenter-pic-wrapper {
      display: flex;
    }
  }
  .event-summary {
    padding-top: 2.8125rem;
    padding-bottom: 2rem;
    line-height: 1.7;
    opacity: .86;
    font-size: 1.15rem;
    color: $landoGrey;
    font-weight: 400;
  }
  .event-link {
    color: var(--c-brand);
    text-transform: uppercase;
    font-weight: 700;
    font-size: 1rem;
    display: flex;
    align-items: center;
    a {
      &:after {
        content: url(/images/chevron-right.svg);
        position: relative;
        display: inline-flex;
        justify-content: center;
        background: 0 0;
        width: 40px;
        padding: 2px 0;
      }
    }
  }

  &.active {
    background: rgb(237, 63, 122, .9);
    color: #fff;
    font-weight: 500;
    h2 {
      color: #fff;
    }
    a {
      color: #fff;
      font-weight: 700;
    }
    &:hover {
      text-decoration: none;
    }
    .event-details {
      color: #fff;
    }
    .event-link {
      a {
        &:after {
          content: url(/images/chevron-right-white.svg);
        }
      }
    }
    .event-summary {
      color: #fff;
    }
  }
}
@media (max-width: $MQMapless) {
  .event-card {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

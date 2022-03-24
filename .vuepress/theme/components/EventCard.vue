<template>
  <div v-if="props.event.show !== false" :class="{'event-card': true, 'active': props.event.active}">
    <div class="event-card-inner">
      <a :href="`#${anchor}`" @click="$emit('toggle-active', id)">
        <h2 :id="anchor">{{ title }}</h2>
      </a>

      <div class="event-details">
        {{ location }} on {{ resolvedDate }}
      </div>

      <div class="event-summary">
        {{ summary }}
      </div>

      <div class="event-link">
        <a :href="url" target="_blank">Read More</a>
      </div>

      <div v-for="presenter in presenters" class="event-presenter" :key="presenter.name">
        <div class="event-presenter-name">
          <a :href="presenter.link" target="_blank">{{ presenter.name }}</a>
        </div>
        <div class="event-presenter-pic">
          <a :href="presenter.link" target="_blank"><img :src="presenter.pic" :alt="presenter.name" loading="lazy" /></a>
        </div>
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
  border-radius: 3px;
  font-size: 0.85em;
  padding: 1rem;
  border-bottom: 1px dotted #ddd;
  background: rgb(255, 255, 255, .60);
  margin-bottom: 0.5em;
  h2 {
    margin: 0;
    border: 0;
    color: var(--c-text-light);
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
      color: var(--c-text);
    }
  }
  .event-summary {
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 1.05em;
    line-height: 1.4em;
  }
  .event-link {
    padding-top: 1em;
    padding-bottom: 1em;
    margin-bottom: 1em;
  }

  &.active {
    background: rgb(237, 63, 122, .9);
    color: #fff;
    font-weight: 500;
    &:hover {
      text-decoration: none;
    }
    .event-details {
      color: #fff;
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
}
@media (max-width: $MQMapless) {
  .event-card {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

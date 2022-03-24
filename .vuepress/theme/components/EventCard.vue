<template>
  <div v-if="props.event.show !== false" :class="{'event-card': true, 'active': props.event.active}">
    <div class="event-card-inner">
      <a :href="`#${anchor}`" @click="$emit('toggle-active', id)">
        <h2 :id="anchor">{{ title }}</h2>
      </a>

      <div class="event-details">
        {{ location }} {{ resolvedDate }}
      </div>

      <div class="event-summary">
        {{ summary }}
      </div>

      <div v-for="presenter in presenters" class="event-presenter" :key="presenter.name">
        featuring <a :href="presenter.link" target="_blank">{{ presenter.name }}</a>
        <a :href="presenter.link" target="_blank"><img :src="presenter.pic" :alt="presenter.name" loading="lazy" /></a>
      </div>

      <div class="event-link">
        <a :href="url" target="_blank">Click for event details</a>
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
  h2 {
    margin: 0;
  }
  img {
    width: 24px;
    border-radius: 100%;
    float: right;
    position: relative;
    bottom: 6px;
  }
  svg {
    width: 14px;
    height: 14px;
    color: stugg;
    position: relative;
    top: 3px;
    margin-left: 3px;
    margin-right: 3px;
  }
  &.active {
    background: rgb(237, 63, 122);
    color: #fff;
    font-weight: 500;
    h2 {
      color: #fff;
    }
    svg {
      color: #fff;
    }
    a {
      color: #fff;
      font-weight: 700;
      &:hover {
    text-decoration: underline;
      }
    }
  }

  .event-summary {
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 1.1em;
  }
  .event-link {
    padding-top: 1em;
  }
}
@media (max-width: $MQMapless) {
  .event-card {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

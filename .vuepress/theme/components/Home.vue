<template>
  <main class="home" aria-labelledby="main-title">
    <Map class="map-fixed" :events="events" @toggle-active="setActive" />
    <div class="overlay">
      <div class="title">
        <h1>Lando events and meetups</h1>
      </div>

      <div class="secondary-nav">
        <a class="special-link" @click="toggleTime" href="#">{{ pastEventsText }}</a> |
        <a class="special-link" :class="{active: showNewsletter}" @click="toggleNewsletter" href="#">get event updates</a> |
        <a target="_blank" rel="noopener noreferrer" class="special-link" href="https://docs.google.com/forms/d/1VgNzd3Ay8TR97DInZzeAnmf2ANn_w4_nlkPZA3dcz10">add or suggest an event</a>
      </div>

      <div v-if="showNewsletter" class="newsletter-wrapper">
        <MailChimp
          class="newsletter-desktop"
          action="https://dev.us12.list-manage.com/subscribe/post?u=59874b4d6910fa65e724a4648&amp;id=613837077f"
          title="Get event updates?"
          byline="Enter your email and we will ping you when new events are available!"
        />
      </div>

      <div v-if="showEvents && noUpcoming" class="no-events">
        <MailChimp
          class="newsletter-desktop"
          action="https://dev.us12.list-manage.com/subscribe/post?u=59874b4d6910fa65e724a4648&amp;id=613837077f"
          title="No upcoming events!"
          byline="Check back soon or we can ping you on the emails when there are new events"
          button="Ping me!"
        />
        <div class="no-events-block">
          <div>Know of a good upcoming event?</div>
          <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/1VgNzd3Ay8TR97DInZzeAnmf2ANn_w4_nlkPZA3dcz10">Add or suggest one!</a>
        </div>
      </div>
      <div v-else-if="showEvents && !noUpcoming" class="listing" id="listing">
        <div v-for="event in events" :key="event.id" class="listing-event">
          <AsyncEventCard
            :event="event"
            @toggle-active="setActive"
          />
        </div>
      </div>

      <div class="footer">
        <div class="copyright">copyright © 2022 Lando System</div>
        <SocialLinks
          v-if="social"
          :icons="social"
        />
        <div class="policies">
          <a href="privacy/">privacy policy</a> |
          <a href="terms/">terms of use</a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import {computed, defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useSiteData} from '@vuepress/client';
import {useThemeData} from '@vuepress/plugin-theme-data/lib/client';

import SocialLinks from '@lando/vuepress-theme-default-plus/components/SocialLinks.vue';
import EventCard from '@theme/EventCard.vue';
import Map from '@theme/Map.vue';

const AsyncEventCard = defineAsyncComponent({
  loader: async () => EventCard,
});

// Constants
const activeMarkerColor = '#ed3f7a';
const markerColor = '#767676';

// Events
const data = useSiteData();
const events = reactive(data.value.events);
// Social
const themeData = useThemeData();
const {social} = themeData.value;

// UX
const showEvents = ref(true);
const showPrevious = ref(true);
const showNewsletter = ref(false);
const pastEventsText = computed(() => !showPrevious.value ? 'show past events' : 'hide past events');

const noUpcoming = computed(() => {
  return showPrevious.value === false && events.every(event => event.show === false);
});

// Router
const router = useRouter();

// Helper to get marker
const getMarker = (lat, lng, options = {}) => ({
  icon: {
    anchor: {x: 0, y: 0},
    path: 'M0,10a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    scale: 1,
    fillColor: options.active ? activeMarkerColor : markerColor,
    fillOpacity: 1,
    strokeColor: options.active ? activeMarkerColor : markerColor,
    strokeOpacity: 1,
  },
  position: {lat, lng},
  visible: options.show !== false,
  zIndex: options.weight || 0,
});

const setActive = id => {
  // Try to get teh event a few ways
  const event = events.find(event => event.id == id) || events.find(event => event.anchor == id);
  // Set active if we can
  if (event) {
    event.active = !!!event.active;
    // Update marker
    event.marker = getMarker(event.geo.latitude, event.geo.longitude, event);
    // Set nav
    router.push({path: '/', hash: `#${event.anchor}`});
    // Scroll
    const dom = document.getElementById(event.anchor);
    document.getElementById('listing').scrollTo(0, dom.offsetTop - 10);
  }
};

const showSince = (time = 0) => {
  for (const event of events) {
    event.show = event.timestamp > time;
    event.marker = getMarker(event.geo.latitude, event.geo.longitude, event);
  }
};

// When mounted lets try to set an active if there is a hash
// add a small timeout for async loading
onMounted(() => {
  setTimeout(() => setActive(decodeURIComponent(location.hash.substring(1))), 500);
});

const toggleNewsletter = () => {
  showNewsletter.value = !!!showNewsletter.value;
};

const toggleTime = () => {
  showPrevious.value = !!!showPrevious.value;
  if (showPrevious.value) {
    showSince();
  } else {
    showSince(Date.now());
  }
};

</script>

<style lang="scss">
@import '../styles/main.scss';
.events-home {
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
  .map-fixed {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
  }
  .home {
    padding: 0;
    margin: 0px auto;
    display: block;
    height: 100vh;
    overflow: hidden;
  }
  .overlay {
    margin: auto;
    padding: 2em;
    .listing,
    .no-events {
      border-radius: 3px;
      position: absolute;
      right: 1em;
      top: 4em;
      width: 350px;
      height: 80%;
      overflow: scroll;
      .newsletter__wrap {
        padding: 0 1em;
        background: initial;
        input[type=email] {
          background: var(--c-border);
        }
      }
    }
    .no-events {
      background: rgb(255, 255, 255, .60);
    }
    .newsletter-wrapper {
      position: absolute;
      bottom: 65px;
      right: 25%;
      left: 50%;
      width: 600px;
      margin-left: -300px;
      padding: 0em;
      .newsletter__wrap {
        padding: 1em;
      }
    }
    .title {
      position: absolute;
      bottom: 2em;
      left: 1em;
      width: 50px;
      h1 {
        font-size: 4.44em;
        line-height: 1em;
        font-size: 3em;
      }
    }
    .no-events {
      height: auto;
      text-align: center;
      .no-events-block {
        border-top: 1px solid var(--c-border);
        padding: 2em 2em;
        a {
          font-weight: 600;
        }
      }
    }
    .newsletter-wrapper {
      height: auto;
    }
    .listing-loading {
      height: 350px;
    }
    .secondary-nav {
      border-radius: 3px;
      position:absolute;
      bottom: 40px;
      right: 25%;
      left: 50%;
      width: 572px;
      margin-left: -300px;
      background: rgb(255, 255, 255, .90);
      overflow: scroll;
      color: var(--c-text);
      text-align: center;
      font-size: 0.9em;
      padding: 1em;
      a {
        font-weight: 700;
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
    }
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
      text-align: left;
      font-size: 0.9em;
      padding: 0em;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .social-links {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .social-link {
        display: flex;
        margin: 0.5em;
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
  }
}

@media (max-width: $MQMapless) {
  .events-home {
    .page-wrapper-outer {
      width: initial;
      padding: 0;
      margin: 0;
      display: block;
    }
    .page-wrapper-inner {
      width: initial;
      padding: 0;
      margin: 0;
      display: block;
    }
    .map-fixed {
      display: none;
    }
    .home {
      overflow: auto;
    }
    .overlay {
      .title,
      .secondary-nav,
      .newsletter-wrapper,
      .no-events,
      .listing,
      .footer {
        position: relative;
        width: 100%;
        margin: auto;
        right: initial;
        left: initial;
        top: initial;
        bottom: initial;
      }
      .footer {
        padding-top: 2em;
      }
    }
  }
}


@media (max-width: $MQMobileNarrow) {
  .events-home {
    .overlay {
      .footer {
        padding-top: 2em;
        flex-direction: column-reverse;
      }
    }
  }
}
</style>

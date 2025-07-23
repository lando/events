<template>
  <main class="home" aria-labelledby="main-title">
    <Map class="map-fixed" :events="events" @toggle-active="setActive" />
    <div class="overlay">
      <div class="title">
        <h1>Lando
          <div class="emphasis">events and meetups</div>
        </h1>
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
        <div class="no-events-inner">
          <MailChimp
            class="newsletter-desktop"
            action="https://dev.us12.list-manage.com/subscribe/post?u=59874b4d6910fa65e724a4648&amp;id=613837077f"
            title="No upcoming events!"
            byline="Check back soon or we can ping you on the emails when there are new events"
            button="Ping me!"
          />
          <div class="no-events-new">
              <div>Know of a good upcoming event?</div>
              <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/1VgNzd3Ay8TR97DInZzeAnmf2ANn_w4_nlkPZA3dcz10">Add or suggest one</a>
          </div>
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
        <div class="copyright">copyright ©2025 Lando Alliance</div>
        <SocialLinks
          v-if="social"
          :icons="social"
        />
        <div class="policies">
          <a href="https://lando.dev/privacy/">privacy policy</a> |
          <a href="https://lando.dev/terms/">terms of use</a> |
          <a href="https://lando.dev/coc/">code of conduct</a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import {computed, defineAsyncComponent, onMounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {useSiteData} from '@vuepress/client';
import {useThemeData} from '@vuepress/plugin-theme-data/client';

import SocialLinks from '@lando/vuepress-theme-default-plus/components/SocialLinks.vue';
import EventCard from '@theme/EventCard.vue';
import Map from '@theme/Map.vue';

const AsyncEventCard = defineAsyncComponent({
  loader: async () => EventCard,
});

// Constants
const activeMarkerColor = '#ed3f7a';
const markerColor = '#49424E';

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
    document.getElementById('listing').scrollTo(0, dom.offsetTop - 50);
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
    height: calc(100vh - 84px);
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
    overflow: hidden;
  }
  .overlay {
    margin: auto;
    padding: 2em;
    .listing {
      border-radius: 6px;
      position: absolute;
      right: 4em;
      top: 140px;
      bottom: 50px;
      width: 466px;
      overflow: scroll;
      padding: 2rem;
    }
    .no-events {
      border-radius: 6px;
      position: absolute;
      right: 96px;
      top: 188px;
      width: 466px;
      overflow: scroll;
      box-shadow: 0 14px 40px #49424e24;
      border-radius: 6px;
      background: rgb(255, 255, 255, .60);
      height: auto;
      text-align: center;
      padding: 0;
      font-size: 1.15rem;
      h3 {
        margin: 0;
        font-size: 1.65rem;
      }
      .no-events-inner {
        padding: 2.5rem;
        line-height: 1.7;
        color: $landoGrey;;
        opacity: .86;
        font-weight: 400;
        .newsletter {
          font-size: 1.15rem;
        }
        .newsletter__wrap {
          padding: 0;
          margin: 0;
          background: initial;
          input[type=email] {
            background: var(--c-border);
          }
        }
        .no-events-new {
          margin-top: 1em;
          font-size: .96rem;
          a {
            color: var(--c-brand);
            text-transform: uppercase;
            font-weight: 500;
            display: flex;
            justify-content: center;
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
      }
    }
    .newsletter-wrapper {
      position: absolute;
      top: 115px;
      right: 25%;
      left: 50%;
      width: 600px;
      margin-left: -300px;
      padding: 0em;
      z-index: 999999;
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
        color: $landoGrey;
        font-size: 4rem;
        font-weight: 800;
        line-height: 4rem;
        .emphasis {
          color: var(--c-brand);
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
      border-radius: 6px;
      text-transform: uppercase;
      position: absolute;
      top: 86px;
      right: 25%;
      left: 50%;
      width: 572px;
      margin-left: -300px;
      background: rgb(255, 255, 255, .90);
      overflow: scroll;
      color: var(--c-text);
      text-align: center;
      font-size: 0.8em;
      padding: 1em;
      a {
        font-weight: 500;
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
        padding: 0;
      }
      .title {
        h1 {
          margin-top: 0;
        }
      }
      .secondary-nav {
        border-bottom: 1px solid var(--c-border);
        border-top: 1px solid var(--c-border);
        padding: 1em 0;
      }
      .listing {
        .listing-event {
          border-bottom: 1px solid var(--c-border);
        }
        .event-card {
          padding: 1em 0;
          box-shadow: none;
        }
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

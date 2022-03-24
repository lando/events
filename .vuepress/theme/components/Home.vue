<template>
  <main class="home" aria-labelledby="main-title">
    <Map class="map-fixed" :events="events" v-on:update-marker="highlightEvent" />
    <div class="overlay">
      <div class="title">
        <h1>Lando events and meetups</h1>
      </div>
      <div class="listing-filters">
        <a href="#" @click="upcoming">upcoming</a> |
        <a href="#" @click="previous">previous</a> |
        <a href="#" @click="newsletterToggle">get event updates</a>
      </div>
      <div v-if="selector === 'loading'" class="listing-loading">
        <div class="throb">
        </div>
      </div>
      <div v-else-if="selector === 'events' && cards.length > 0" class="listing">
        <!-- <div v-for="event in cards" :key="event.id" class="listing-event">
          <EventCard
            v-on:update-marker="highlightEvent"
            :selected="event.selected"
            :id="event.id"
            :name="event.name"
            :border="getTypeColor(event.type)"
            :location="event.location"
            :date="event.date"
            :summary="event.summary"
            :link="event.url"
            :presenter="event.presenter"
            :presenter-link="event.presenterLink"
            :presenter-pic="event.presenterPic"
          />
        </div> -->
      </div>
      <div v-else-if="selector === 'events' && cards.length === 0" class="no-events">
        <div class="no-events-block">
          <h3>No upcoming events!</h3>
          <p>Check back soon or <a href="https://docs.lando.dev/contrib/evangelist-events.html">add your event</a> to the listing!</p>
        </div>
      </div>
      <div v-else-if="selector === 'newsletter'" class="newsletter-wrapper">
        <!-- <Newsletter /> -->
      </div>
      <div class="newsletter-wrapper-mobile">
        <!-- <Newsletter /> -->
      </div>
      <div class="footer">
        <a class="special-link" @click="newsletterToggle" href="#">get events updates</a> |
        <a target="_blank" class="special-link" href="https://docs.lando.dev/contrib/evangelist-events.html">add your event</a>
        <span class="copyright">copyright © 2022 Lando System </span>
        <span class="policies">
          <a href="/privacy/">privacy policy</a> |
          <a href="/terms/">terms of use</a>
        </span>
      </div>
    </div>
  </main>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {useSiteData} from '@vuepress/client';
import dayjs from 'dayjs';

import Map from '@theme/Map.vue';
import EventCard from '@theme/EventCard.vue';

const data = useSiteData();
const {events} = data.value;

// reactive
const markers = reactive([]);
const cards = reactive(['loading']);
const selector = ref('loading');

// methods
const getIcon = (color = 'grey') => ({
  // path: this.google.maps.SymbolPath.CIRCLE,
  scale: 5,
  fillColor: color,
  fillOpacity: 1,
  strokeColor: color,
});

const getTypeColor = type => {
  switch (type) {
    case 'conference':
      return '#2ecc71';
    case 'camp':
      return '#ed3f7a';
    case 'meetup':
      return '#ed3f7a';
    case 'other':
      return '#ed3f7a';
    default:
      return '#ed3f7a';
};

const newsletterToggle = () => {
  selector.value = 'newsletter';
};

const previous = () => {
  selector.value = 'events';
  cards.value = events.value.filter(event => dayjs(event.date).isBefore(dayjs()));
  markers.value = events.value.filter(event => dayjs(event.date).isBefore(dayjs()));
};

const upcoming = () => {
  selector.value = 'events';
  cards.value = events.value.filter(event => dayjs(event.date).isAfter(dayjs()));
  markers.value = events.value.filter(event => dayjs(event.date).isAfter(dayjs()));
};

const highlightEvent = id => {
  // this.markers = this.markers.map(marker => {
  //   if (marker.id === id) {
  //     marker.icon = this.getIcon(this.getTypeColor(marker.type));
  //   } else {
  //     marker.icon = this.getIcon();
  //   }
  //   return marker;
  // });
  // this.cards = this.cards.map(card => {
  //   card.selected = card.id === id;
  //   return card;
  // });
}

// computed: {
  // google: GoogleMap.api,
// mounted() {
  // Geocode our events
  // this.events = this.$events;
  // Promise.all(this.events.map(event => this.geocode(event))).then(() => {
  //   this.upcoming();
  // });

  // geocode(event) {
  //   return this.$gmaps.get('/geocode/json', {
  //     params: {
  //       key: process.env.LANDO_GOOGLE_API_KEY,
  //       address: event.location,
  //     },
  //   })
  //   .then(result => {
  //     if (result.status === 200 && !result.data.error_message) {
  //       event.geocode = result.data.results[0];
  //       event.lat = event.geocode.geometry.location.lat;
  //       event.lng = event.geocode.geometry.location.lng;
  //       event.icon = this.getIcon();
  //     }
  //     return result.status;
  //   });
  // },
};
</script>

<style lang="scss">
@import '../styles/main.scss';
.map-fixed {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
}
.overlay {
  margin: auto;
  padding: 2em;
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
  .listing-filters {
    position: absolute;
    right: 1em;
    top: 4em;
    background: var(--c-border);
    opacity: 0.75;
    padding: 0.3em 2em;
    overflow: scroll;
    color: #fff;
    text-align: center;
    a {
      color: #efefef;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .no-events {
    height: auto;
    text-align: center;
    .no-events-block {
      padding: 2em 4em;
    }
  }
  .newsletter-wrapper {
    height: auto;
  }
  .listing-loading {
    height: 350px;
  }
  .footer {
    position:absolute;
    bottom: 0;
    right: 25%;
    left: 50%;
    width: 600px;
    margin-left: -300px;
    background: var(--c-border);
    opacity: 0.75;
    padding: 0.3em 2em;
    overflow: scroll;
    color: #fff;
    text-align: center;
    font-size: 0.9em;
    padding-top: 2em;
    a {
      color: #b3b3b3;
      &:hover {
        text-decoration: underline;
      }
      &.special-link {
        color: #fff;
        font-weight: 600;
      }
    }
    .copyright {
      padding-left: 3em;
      font-size: 0.7em;
      display: block;
      padding: 0;
      color: var(--c-border);
    }
    .policies {
      font-size: 0.7em;
    }
  }
}
.overlay .newsletter-wrapper-mobile,
.overlay .listing-member-mobile {
  display: none;
}
.overlay .listing,
.overlay .no-events,
.overlay .newsletter-wrapper,
.overlay .listing-loading,
.overlay .listing-member {
  position: absolute;
  right: 1em;
  top: 4em;
  width: 350px;
  background: #fff;
  opacity: 0.75;
  height: 80%;
  overflow: scroll;
}
.throb::before,
.throb::after {
  animation: pulse 2s linear infinite;
  border: #fff solid 8px;
  border-radius: 9999px;
  box-sizing: border-box;
  content: ' ';
  height: 140%;
  left: -20%;
  opacity: 0.6;
  position: absolute;
  top: -20%;
  transform: scale(0.714);
  width: 140%;
  z-index: 1;
  animation: pulse 2s linear infinite, cycle-colors 9s linear infinite;
}
.throb {
  &::after {
    animation-delay: 1s;
  }
}
.avatar {
  &::after {
    animation-delay: 0.5s;
  }
}
.home {
  padding: 0;
  margin: 0px auto;
  display: block;
  height: 100vh;
  overflow: hidden;
}

@media (max-width: $MQMapless) {
  .home {
    overflow: auto;
  }
}

.overlay .newsletter-wrapper,
  .overlay .listing-loading,
  .overlay .listing-member {
  display: none;
}
.overlay .newsletter-wrapper-mobile,
  .overlay .listing-member-mobile {
  display: block;
  border-bottom: 1px dashed #ddd;
}
.overlay .listing-filters,
  .overlay .footer {
  background: #fff;
}
</style>

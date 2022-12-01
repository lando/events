// mods
import _ from 'lodash';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import dayjs from 'dayjs';
import Debug from 'debug';
import NodeGeocoder from 'node-geocoder';
import yaml from 'js-yaml';

// vuepress things
import {error, fs, getDirname, path, warn} from '@vuepress/utils';

// plugins/themes
import {defaultThemePlus} from '@lando/vuepress-theme-default-plus';
import {palettePlugin} from '@vuepress/plugin-palette';
import {registerComponentsPlugin} from '@vuepress/plugin-register-components';

const __dirname = getDirname(import.meta.url);
const debug = Debug('@lando/theme-events'); // eslint-disable-line

dayjs.extend(advancedFormat);

export const eventTheme = options => {
  const activeMarkerColor = '#ed3f7a';
  const markerColor = '#49424E';

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

  return {
    name: '@lando/events-theme',
    extends: defaultThemePlus(options),
    alias: {
      '@theme/EventCard.vue': path.resolve(__dirname, 'components', 'EventCard.vue'),
      '@theme/Home.vue': path.resolve(__dirname, 'components', 'Home.vue'),
      '@theme/Map.vue': path.resolve(__dirname, 'components', 'Map.vue'),
      '@theme/Navbar.vue': path.resolve(__dirname, 'components', 'NavbarCustom.vue'),
    },
    clientConfigFile: path.resolve(__dirname, 'client.js'),
    plugins: [
      palettePlugin({
        preset: 'sass',
        userStyleFile: path.resolve(__dirname, 'styles', 'index.scss'),
        userPaletteFile: path.resolve(__dirname, 'styles', 'palette.scss'),
      }),
      registerComponentsPlugin({
        componentsDir: path.resolve(__dirname, './components'),
        componentsPatterns: ['*.vue', '**/*.vue'],
      }),
    ],
    async onInitialized(app) {
      // Error if we dont have an API key set
      if (!process.env.VITE_GMAPS_API_KEY) {
        error('Environment variable VITE_GMAPS_API_KEY must be set to geocode!');
        process.exit(1);
      }
      // Load events from yaml
      app.siteData.events = yaml.load(fs.readFileSync(path.resolve(__dirname, '..', '..', 'events.yaml'), 'utf8'));

      // Mix in some other helpful things
      for (const event of app.siteData.events) {
        event.anchor = _.kebabCase(event.title);
        event.timestamp = _.toInteger(dayjs(event.time || event.date).format('x'));
        event.weight = event.timestamp / 100000;
        debug('computed timestamp=%s weight=%s for %s=anchor ', event.timestamp, event.weight, event.anchor);
      };

      // Sort events by timestamp
      app.siteData.events = _.orderBy(app.siteData.events, ['timestamp'], ['desc']);

      // Go through and geocode
      const geocoder = NodeGeocoder({provider: 'google', apiKey: process.env.VITE_GMAPS_API_KEY}); // eslint-disable-line new-cap
      for await (const event of app.siteData.events) {
        try {
          const response = await geocoder.geocode(event.location);
          event.geo = response[0];
          event.marker = getMarker(event.geo.latitude, event.geo.longitude, event);
          debug('geocoded %s to %s %s (%s)', event.location, event.geo.latitude, event.geo.longitude, event.geo.formattedAddress);
        } catch (error) {
          warn(`could not process ${event.location} with error ${error}!`);
        }
      }
    },
  };
};

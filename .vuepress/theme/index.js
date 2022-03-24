const _ = require('lodash');
const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
const debug = require('debug')('@lando/theme-events');
const {error, fs, path, warn} = require('@vuepress/utils');
const {getMarker} = require('./utils.js');
const yaml = require('js-yaml');

const NodeGeocoder = require('node-geocoder');
dayjs.extend(advancedFormat);

module.exports = (options, app) => {
  return {
    theme: path.resolve(__dirname, '.'),
    extends: '@lando/vuepress-theme-default-plus',
    alias: {
      '@theme/EventCard.vue': path.resolve(__dirname, 'components', 'EventCard.vue'),
      '@theme/Home.vue': path.resolve(__dirname, 'components', 'Home.vue'),
      '@theme/Map.vue': path.resolve(__dirname, 'components', 'Map.vue'),
      '@theme/Navbar.vue': path.resolve(__dirname, 'components', 'NavbarCustom.vue'),
    },
    layouts: path.resolve(__dirname, 'layouts'),
    plugins: [
      ['@vuepress/plugin-palette',
        {
          preset: 'sass',
          userStyleFile: path.resolve(__dirname, 'styles', 'index.scss'),
          userPaletteFile: path.resolve(__dirname, 'styles', 'palette.scss'),
        },
      ],
      ['@vuepress/register-components',
        {
          componentsDir: path.resolve(__dirname, 'components'),
          componentsPatterns: ['*.vue', '**/*.vue'],
        },
      ],
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

const debug = require('debug')('@lando/theme-events');
const {error, fs, path, warn} = require('@vuepress/utils');
const yaml = require('js-yaml');

const NodeGeocoder = require('node-geocoder');

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
      // Go through and geocode
      const geocoder = NodeGeocoder({provider: 'google', apiKey: process.env.VITE_GMAPS_API_KEY});
      for await (const event of app.siteData.events) {
        try {
          const response = await geocoder.geocode(event.location);
          event.geo = response[0];
          event.marker = {
            icon: {
              anchor: {x: 25, y: 25},
              path: 'M 25, 50 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0',
              scale: .33,
              fillColor: '#df4090',
              fillOpacity: 1,
              strokeColor: '#df4090',
              strokeOpacity: 1,
            },
            position: {
              lat: event.geo.latitude,
              lng: event.geo.longitude,
            }
          };
          debug('geocoded %s to %s %s (%s)', event.location, event.geo.latitude, event.geo.longitude, event.geo.formattedAddress);
        } catch (error) {
          warn(`could not process ${event.location} with error ${error}!`);
        }
      }
    },
  };
};

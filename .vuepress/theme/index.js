// const debug = require('debug')('@lando/theme-events');

module.exports = (options, app) => {
  return {
    theme: path.resolve(__dirname, '.'),
    extends: '@lando/vuepress-theme-default-plus',
    alias: {
      '@theme/EventCard.vue': path.resolve(__dirname, 'components', 'EventCard.vue'),
      '@theme/Home.vue': path.resolve(__dirname, 'components', 'Home.vue'),
      '@theme/Map.vue': path.resolve(__dirname, 'components', 'Map.vue'),
      // '@theme/Navbar.vue': path.resolve(__dirname, 'components', 'NavbarCustom.vue'),
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
  };
};

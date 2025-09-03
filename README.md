# Lando Events

This repo powers the [Lando events subsite](https://lando.dev/events).

## Issues, Questions and Support

If you have a question or would like some community support we recommend you [join us on Slack](https://launchpass.com/devwithlando). Note that this is the Slack community for [Lando](https://lando.dev) but we are more than happy to help with this module as well!

If you'd like to report a bug or submit a feature request then please [use the issue queue](https://github.com/lando/events/issues/new/choose) in this repo.

## Changelog

We try to log all changes big and small in both [THE CHANGELOG](https://github.com/lando/events/blob/main/CHANGELOG.md) and the [release notes](https://github.com/lando/events/releases).

## Development

* Requires [Node 20+](https://nodejs.org/dist/latest-v14.x/)
* Requires a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key)
* Note that the events data lives in `events.yaml` and you must relaunch the dev server or rebuild the app for changes to reflect.
* Alternatively you can also use Lando

```bash
git clone https://github.com/lando/blog.git && cd blog
```

### Using Node/Yarn

```bash
# Install deps
npm install

# Launch dev site
DEBUG="@lando/*" VITE_GMAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY npm run dev

# Lint
npm run lint

# Build site
DEBUG="@lando/*" VITE_GMAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY npm run build
```

### Using Lando

```bash
# Install deps
lando start

# Launch dev site
VITE_GMAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY lando dev

# Lint
lando npm run  lint

# Build site
VITE_GMAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY lando npm run build
```

## Contributors

<a href="https://github.com/lando/events/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=lando/events" />
</a>

Made with [contributors-img](https://contrib.rocks).

## Other Resources

* [LICENSE](/LICENSE)
* [TERMS OF USE](https://docs.lando.dev/terms)
* [PRIVACY POLICY](https://docs.lando.dev/privacy)
* [CODE OF CONDUCT](https://docs.lando.dev/coc)


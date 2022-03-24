'use strict';

const activeMarkerColor = '#ed3f7a';
const markerColor = '#767676';

exports.getMarker = (lat, lng, active = false) => ({
  icon: {
    anchor: {x: 0, y: 0},
    path: 'M0,10a10,10 0 1,0 20,0a10,10 0 1,0 -20,0',
    scale: 1,
    fillColor: active ? activeMarkerColor : markerColor,
    fillOpacity: 1,
    strokeColor: active ? activeMarkerColor : markerColor,
    strokeOpacity: 1,
  },
  position: {lat, lng},
});

'use strict';

const activeMarkerColor = '#ed3f7a';
const markerColor = '#49424E';

exports.getMarker = (lat, lng, options = {}) => ({
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

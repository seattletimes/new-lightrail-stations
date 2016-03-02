// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

var $ = require("./lib/qsa");

require("component-responsive-frame/child");
require("component-leaflet-map");

//global state
var mapElement = document.querySelector("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;
var caption = document.querySelector(".text-container .caption");
var level = 0;

console.log(mapElement.lookup);

// various layers
var stationOverlay = new L.ImageOverlay(
  "./assets/grump.jpg", 
  [[47.64890028833129, -122.3047399520874], [47.65007116508271, -122.30315208435057]]
);

var stops = [
  { coords: [47.65091352964277, -122.30414986610411], routes: "44, 45, 71, 73, 373" },
  { coords: [47.65193258827157, -122.30320572853088], routes: "65, 78" },
  { coords: [47.649757126971885, -122.30572700500487], routes: "43, 44, 45, 48, 71, 73, 167, 271, 277, 373, 540, 541, 542, 556"}
];

stops = stops.map(function(stop) {
  var marker = new L.Marker(stop.coords, {
    icon: new L.DivIcon({ className: "leaflet-div-icon bus-stop" })
  });
  marker.bindPopup(`<h2>Routes</h2><p>${stop.routes}</p>`);
  return marker;
});

var halfMileRadius = new L.Circle([47.649617272744166, -122.3038199543953], 804, {
  fillColor: "#00F",
  stroke: false
})

var levels = [
  {
    zoom: 18,
    center: [47.649617272744166, -122.3038199543953],
    layers: [stationOverlay],
    retainLayers: true,
    text: `
View of the station from overhead.
    `
  },
  {
    zoom: 17,
    center: [47.65018644440777, -122.30417668819427],
    layers: stops,
    text: "Bus routes that connect to the station"
  },
  {
    zoom: 15,
    center: [47.649617272744166, -122.3038199543953],
    layers: [halfMileRadius],
    text: "Employers that are close to the station"
  },
  {
    zoom: 13,
    center: [47.61605771027536, -122.32409477233885],
    layers: [],
    text: "The entire line and travel times"
  }
];

var removeFeatures = function(zoom) {
  var preset = levels[zoom];
  if (preset.retainLayers) return;
  preset.layers.forEach(l => map.removeLayer(l));
}

var setLevel = function(zoom) {
  var preset = levels[zoom];
  map.setView(preset.center, preset.zoom, { animate: true });
  preset.layers.forEach(l => l.addTo(map));
  caption.innerHTML = preset.text;
}

$(".zoom").forEach(el => el.addEventListener("click", function() {
  removeFeatures(level);
  level += this.classList.contains("out") ? 1 : -1;
  if (level < 0) level = 0;
  if (level == levels.length) level = levels.length - 1;
  setLevel(level);
}));

setLevel(0);

map.on("click", e => console.log([e.latlng.lat, e.latlng.lng]));
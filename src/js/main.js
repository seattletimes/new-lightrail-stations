var $ = require("./lib/qsa");

require("component-responsive-frame/child");
require("component-leaflet-map");

//global state
var mapElement = document.querySelector("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;
var caption = document.querySelector(".text-container .caption");
var nextButton = document.querySelector(".zoom.out");
var previousButton = document.querySelector(".zoom.in");
var level = 0;

mapElement.lookup.line.setStyle({
  color: "black",
  weight: 4,
  clickable: false,
  pointerEvents: "none",
  opacity: 1
});

map.removeLayer(mapElement.lookup.line);

//Pass Leaflet to the layer module for construction
var layers = require("./layers")(L);
layers.uwStation.addTo(map);
layers.capHillStation.addTo(map);

//Set up layers
var levels = [
  {
    name: "UW Station",
    zoom: 18,
    center: [47.64979290354127, -122.30393528938293],
    layers: [],
    retainLayers: true,
    text: window.stageText.uw_elevation
  },
  {
    name: "UW bus changes",
    zoom: 17,
    center: [47.6513247691264, -122.30541586875916],
    layers: layers.busStopsUW,
    text: window.stageText.uw_buses
  },
  {
    name: "Nearby employers",
    zoom: 14,
    center: [47.654617272744166, -122.2958199543953],
    layers: layers.employers.concat(layers.halfMileRadius),
    text: window.stageText.uw_employers
  },
  {
    name: "The full line",
    zoom: 11,
    center: [47.55605771027536, -122.32409477233885],
    layers: layers.linkStops.concat(mapElement.lookup.line),
    text: window.stageText.full_line
  },
  {
    name: "Capitol Hill",
    zoom: 17,
    center: [47.619040209021506, -122.32044696807861],
    layers: [],
    retainLayers: true,
    text: window.stageText.ch_elevation
  },
];

var removeFeatures = function(zoom) {
  var preset = levels[zoom];
  if (preset.retainLayers) return;
  preset.layers.forEach(l => map.removeLayer(l));
}

var setLevel = function(zoom) {
  var preset = levels[zoom];
  var before = levels[zoom - 1];
  var after = levels[zoom + 1];

  preset.layers.forEach(l => l.addTo(map));
  var _ = mapElement.offsetWidth; //reflow
  map.setView(preset.center, preset.zoom, { animate: true, duration: 1 });
  caption.innerHTML = preset.text;
  
  if (before) {
    previousButton.innerHTML = before.name;
    previousButton.classList.remove("disabled");
  } else {
    previousButton.innerHTML = "";
    previousButton.classList.add("disabled");
  }
  
  if (after) {
    nextButton.innerHTML = after.name;
    nextButton.classList.remove("disabled");
  } else {
    nextButton.innerHTML = "";
    nextButton.classList.add("disabled");
  }
}

$(".zoom").forEach(el => el.addEventListener("click", function() {
  removeFeatures(level);
  level += this.classList.contains("out") ? 1 : -1;
  if (level < 0) level = 0;
  if (level == levels.length) level = levels.length - 1;
  setLevel(level);
}));

setLevel(level);

// map.on("click", e => console.log([e.latlng.lat, e.latlng.lng]));
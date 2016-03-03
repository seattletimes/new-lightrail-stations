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

map.removeLayer(mapElement.lookup.line);

// various layers
var stationOverlay = new L.ImageOverlay(
  "./assets/grump.jpg", 
  [[47.64890028833129, -122.3047399520874], [47.65007116508271, -122.30315208435057]]
);

var busStopsUW = [
  { coords: [47.65091352964277, -122.30414986610411], routes: "44, 45, 71, 73, 373" },
  { coords: [47.65193258827157, -122.30320572853088], routes: "65, 78" },
  { coords: [47.649757126971885, -122.30572700500487], routes: "43, 44, 45, 48, 71, 73, 167, 271, 277, 373, 540, 541, 542, 556" },
  { coords: [47.649301786394226, -122.30541586875916], routes: "43, 48, 167, 197, 271, 277, 540, 541, 542, 556, 586" },
  { coords: [47.65222167929731, -122.3063063621521], routes: "31, 32, 67, 78, 277, 540, 810, 821, 855, 860, 871, 880" }
];

busStopsUW = busStopsUW.map(function(stop) {
  var marker = new L.Marker(stop.coords, {
    icon: new L.DivIcon({ className: "leaflet-div-icon bus-stop" })
  });
  marker.bindPopup(`<h2>Routes</h2><p>${stop.routes}</p>`);
  return marker;
});

var halfMileRadius = new L.Circle([47.649617272744166, -122.3038199543953], 804, {
  fillColor: "#444",
  // stroke: false,
  color: "white",
  weight: 2,
  fillOpacity: .1
});

var uwmc = new L.Marker([47.650098991309704, -122.30911731719972], {
  icon: new L.DivIcon({ className: "leaflet-div-icon employer" })
});
uwmc.bindPopup("UW Medical Center");

var seattleChildrens = new L.Marker([47.662618497165134, -122.28229522705078], {
  icon: new L.DivIcon({ className: "leaflet-div-icon employer" })
});
seattleChildrens.bindPopup("Seattle Children's Hospital");

var linkStops = window.linkStops.map(function(data) {
  var marker = new L.Marker([data.lat, data.lng], {
    icon: new L.DivIcon({ className: "leaflet-div-icon link-stop" })
  });
  marker.bindPopup(data.station);
  return marker;
});

var capHill = new L.Marker([47.619040209021506, -122.32044696807861], {
  icon: new L.DivIcon({ className: "leaflet-div-icon link-stop new-station" })
});
capHill.bindPopup("Capital Hill");

var UW = new L.Marker([47.649617272744166, -122.3038199543953], {
  icon: new L.DivIcon({ className: "leaflet-div-icon link-stop new-station" })
});
UW.bindPopup("University of Washington");

linkStops.push(capHill, UW);


//Set up layers
var levels = [
  {
    zoom: 18,
    center: [47.649617272744166, -122.3038199543953],
    layers: [stationOverlay],
    retainLayers: true,
    text: window.stageText.uw_elevation.content
  },
  {
    zoom: 17,
    center: [47.65118644440777, -122.30517668819427],
    layers: busStopsUW,
    text: window.stageText.uw_buses.content
  },
  {
    zoom: 14,
    center: [47.654617272744166, -122.2958199543953],
    layers: [halfMileRadius, uwmc, seattleChildrens],
    text: window.stageText.uw_employers.content
  },
  {
    zoom: 11,
    center: [47.55605771027536, -122.32409477233885],
    layers: linkStops.concat(mapElement.lookup.line),
    text: window.stageText.full_line.content
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
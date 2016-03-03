var $ = require("./lib/qsa");

require("component-responsive-frame/child");
require("component-leaflet-map");

//global state
var mapElement = document.querySelector("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;
var caption = document.querySelector(".text-container .caption");
var level = 0;

mapElement.lookup.line.setStyle({
  color: "red",
  weight: 2,
  clickable: false,
  pointerEvents: "none"
});

map.removeLayer(mapElement.lookup.line);

// various layers
var stationOverlay = new L.ImageOverlay(
  "./assets/grump.jpg", 
  [[47.64890028833129, -122.3047399520874], [47.65007116508271, -122.30315208435057]]
);

var busStopsUW = window.busStops.map(function(stop) {
  var routes = stop.routes.split(",").map(function(r) {
    var split = r.split("/");
    return {
      route: split[0],
      dest: split[1]
    }
  }).map(r => `<li><b>${r.route}</b> - ${r.dest}`);

  var marker = new L.Marker([stop.lat, stop.lng], {
    icon: new L.DivIcon({ className: "leaflet-div-icon bus-stop" })
  });
  marker.bindPopup(`<h2>Routes</h2><ul>${routes}</ul>`);
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
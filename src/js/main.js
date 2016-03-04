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

// various layers
var uwStation = new L.ImageOverlay(
  "./assets/UW-station.png", 
  [[47.65060600128468, -122.30502426624298], [47.6490701393643, -122.3029214143753]]
);

uwStation.addTo(map);

var capHillStation = new L.ImageOverlay(
  "./assets/CapHill-station.png",
  [[47.6180662329101, -122.32152521610261], [47.619876565227834, -122.31960475444794]]
);

capHillStation.addTo(map);

var busStopsUW = window.busStops.map(function(stop) {
  var marker = new L.Marker([stop.lat, stop.lng], {
    icon: new L.Icon({ iconUrl: "./assets/bus-icon.png", iconSize: [24, 24] })
  });
  marker.bindPopup(`<h2>Routes</h2><p class="bus-routes">${stop.routes}</p>`);
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
  icon: new L.Icon({ iconUrl: "./assets/employer-icon.png", iconSize: [20, 20] })
});
uwmc.bindPopup(`
  <h2>University of Washington Medical Center</h2>
  <p>Employs <b>5,000</b> workers</p>
`);

var seattleChildrens = new L.Marker([47.662618497165134, -122.28229522705078], {
  icon: new L.Icon({ iconUrl: "./assets/employer-icon.png", iconSize: [20, 20] })
});
seattleChildrens.bindPopup(`
  <h2>Seattle Children's Hospital</h2>
  <p>Employs <b>6,340 workers</b></p>
`);

var uVillage = new L.Marker([47.66348558796421, -122.29877471923828], {
  icon: new L.Icon({ iconUrl: "./assets/employer-icon.png", iconSize: [20, 20] })
});
uVillage.bindPopup(`
  <h2>University Village shopping center</h2>
`);

var uwItself = new L.Marker([47.65967028071764, -122.30512619018553], {
  icon: new L.Icon({ iconUrl: "./assets/employer-icon.png", iconSize: [20, 20] })
});
uwItself.bindPopup(`
  <h2>University of Washington</h2>
  <p>Enrolled: more than <b>40,000 students</b>
`);

var linkStops = window.linkStops.map(function(data) {
  var marker = new L.Marker([data.lat, data.lng], {
    icon: new L.Icon({ iconUrl: "./assets/transit-icon.png", iconSize: [20, 20] })
  });
  marker.bindPopup(data.station);
  return marker;
});

var capHill = new L.Marker([47.619040209021506, -122.32044696807861], {
  icon: new L.Icon({ iconUrl: "./assets/new-transit-icon.png", iconSize: [20, 20] })
});
capHill.bindPopup("Capital Hill");

var UW = new L.Marker([47.649617272744166, -122.3038199543953], {
  icon: new L.Icon({ iconUrl: "./assets/new-transit-icon.png", iconSize: [20, 20] })
});
UW.bindPopup("University of Washington");

linkStops.push(capHill, UW);


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
    layers: busStopsUW,
    text: window.stageText.uw_buses
  },
  {
    name: "Nearby employers",
    zoom: 14,
    center: [47.654617272744166, -122.2958199543953],
    layers: [halfMileRadius, uwmc, seattleChildrens, uVillage, uwItself],
    text: window.stageText.uw_employers
  },
  {
    name: "The full line",
    zoom: 11,
    center: [47.55605771027536, -122.32409477233885],
    layers: linkStops.concat(mapElement.lookup.line),
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
  map.setView(preset.center, preset.zoom, { animate: true, duration: 1 });
  preset.layers.forEach(l => l.addTo(map));
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

map.on("click", e => console.log([e.latlng.lat, e.latlng.lng]));
module.exports = function(L) {

  var uwStation = new L.ImageOverlay(
    "./assets/UW-station.png", 
    [[47.65060600128468, -122.30502426624298], [47.6490701393643, -122.3029214143753]]
  );

  var capHillStation = new L.ImageOverlay(
    "./assets/CapHill-station.png",
    [[47.6180662329101, -122.32152521610261], [47.619876565227834, -122.31960475444794]]
  );

  var busStopsUW = window.busStops.map(function(stop) {
    var marker = new L.Marker([stop.lat, stop.lng], {
      icon: new L.Icon({ iconUrl: "./assets/bus-icon.png", iconSize: [24, 24] })
    });
    var routes = stop.routes.split(",").map(r => `<li>${r}</li>`).join("\n");
    marker.bindPopup(`<h2>Routes</h2><ul class="bus-routes">${routes}</ul>`);
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
    var timeString = data.time ? `Time from UW Station: ${data.time} min` : "";
    marker.bindPopup(`
<h2>${data.station}</h2>
<p>${timeString}</p>
    `);
    return marker;
  });

  var capHill = new L.Marker([47.619040209021506, -122.32044696807861], {
    icon: new L.Icon({ iconUrl: "./assets/new-transit-icon.png", iconSize: [20, 20] })
  });
  capHill.bindPopup("<h2>Capital Hill</h2>");

  var UW = new L.Marker([47.649617272744166, -122.3038199543953], {
    icon: new L.Icon({ iconUrl: "./assets/new-transit-icon.png", iconSize: [20, 20] })
  });
  UW.bindPopup("<h2>University of Washington</h2>");

  linkStops.push(capHill, UW);

  return {
    uwStation,
    capHillStation,
    busStopsUW,
    halfMileRadius,
    uwmc,
    seattleChildrens,
    uVillage,
    uwItself,
    linkStops
  }

}
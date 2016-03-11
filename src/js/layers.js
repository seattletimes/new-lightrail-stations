module.exports = function(L) {

  var uwStation = new L.ImageOverlay(
    "./assets/UW-station.png", 
    [[47.65060600128468, -122.30502426624298], [47.6490701393643, -122.3029214143753]]
  );

  var capHillStation = new L.ImageOverlay(
    "./assets/CapHill-station.png",
    [[47.619876542606605, -122.31910049915312], [47.618177058238125, -122.32153594493866]]
  );

  var busStopsUW = window.busStops.filter(s => !s.filter).map(function(stop) {
    var marker = new L.Marker([stop.lat, stop.lng], {
      icon: new L.Icon({ iconUrl: "./assets/bus-icon.png", iconSize: [30, 30] })
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

  var employers = window.employers.map(function(row) {
    var marker = new L.Marker([row.lat, row.lng], {
      icon: new L.Icon({ iconUrl: "./assets/employer-icon.png", iconSize: [30, 30] })
    });
    var employs = row.employees ? `Employs ${row.employees} workers` : "";
    var students = row.students ? `More than ${row.students} students enrolled` : "";
    marker.bindPopup(`
      <h2>${row.name}</h2>
      <p>${employs}</p>
      <p>${students}</p>
    `);
    return marker;
  });

  var linkStops = window.linkStops.map(function(data) {
    var marker = new L.Marker([data.lat, data.lng], {
      icon: new L.Icon({ iconUrl: "./assets/transit-icon.png", iconSize: [20, 20] })
    });
    var timeString = data.time ? `Time from UW Station: ${data.time} minutes` : "";
    marker.bindPopup(`
<h2>${data.station}</h2>
<p>${timeString}</p>
    `);
    return marker;
  });

  var capHill = new L.Marker([47.619040209021506, -122.32044696807861], {
    icon: new L.Icon({ iconUrl: "./assets/new-transit-icon.png", iconSize: [20, 20] })
  });
  capHill.bindPopup(`<h2>Capitol Hill</h2>
  <p>Time from UW Station: 4 minutes`);

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
    employers,
    linkStops
  }

}
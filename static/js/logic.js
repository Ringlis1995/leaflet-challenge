
var earthquakes = new L.LayerGroup()


    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquake": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("mapid", {
      center: [40.73, -74.0059],
      zoom: 3,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  
function getcolor(mag) 
    {
        if (mag > 4){
            return "#ea2c2c"
        } else if (mag >3){
            return "#ea822c"
        } else if (mag >2){
            return "#eecc00"
        } else {return "#d4ee00"}
    }

function createMarkers(response) {

    L.geoJson(response, {
        pointToLayer: function(feature,latlong){
            return L.circleMarker(latlong);
        }, 

        style: function(feature){
            
           return { 
          
               radius: feature.properties.mag,
               opacity: 1,
               fillOpacity: 1,
               fillColor: getcolor(feature.properties.mag),
               stroke: true,
               weight: 0.5,
               color: "#00000",
           

            }
        }


    }).addTo(earthquakes)

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var grades = [1,2,3,4];
        var colors = [
            "#d4ee00",
            "#eecc00",
            "#ea822c",
            "#ea2c2c"

        ]
        for (var i = 0; i < grades.length; i++){
            div.innerHTML += "<i style = 'background: " + colors[i] + "'></i> "
            + grades[i] + (grades[i+1] ? " - " + grades[i+1] + "<br>" : "+");
        }
        return div; 
    };
    legend.addTo(map);
}





// Perform an API call to the Earthquake to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
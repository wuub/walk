var map = L.map('map');
map.locate({setView: true, maxZoom: 13});

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
    {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    }
).addTo(map);

var home = undefined;
var to = undefined;

function onMapClick(e) {
    if (to != undefined) {
        map.removeLayer(to);
        to = undefined;
    }
    if (home == undefined) {
        home = L.marker(e.latlng).addTo(map);
        home.on('click', function(){
            map.removeLayer(home);
            home  = undefined;
            if (to != undefined) {
                map.removeLayer(to);
                to = undefined;
            }
        })
        console.log(e)
        return
    }
    to = L.marker(e.latlng).addTo(map);
    var crowDistance =  home.getLatLng().distanceTo(e.latlng);
    console.log(crowDistance);
}

map.on('click', onMapClick);



// $.ajax("//router.project-osrm.org/nearest",
//     {
//         dataType: "json",
//         processData: false,
//         data: "loc=" + e.latlng.lat + ',' + e.latlng.lng,
//         success: function(e,f) {console.log(e, f);}
//     }
// )

// $.ajax("//router.project-osrm.org/viaroute",
//         {
//             dataType: "json",
//             processData: false,
//             data: "loc=" + home.getLatLng().lat + ',' + home.getLatLng().lng + "&loc="+e.latlng.lat + ',' + e.latlng.lng,
//             success: function(data) {

//                 to = L.marker(e.latlng).addTo(map);
//             }
//         }
// )

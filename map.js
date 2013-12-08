walk_speed = 0.720  // seconds per meter at 5 km/h
walk_penalty = 0 // seconds
walkable_limit = 2000;
walkable_crow_multiplier = 1.1;

cycle_speed = 0.240  // seconds per meter at 15 km/h
cycle_penalty = 120 // lock/unlock, clothes/ in seconds
cycleable_limit = 6000;
cycleable_crow_multiplier = 1.2;

drive_speed =  0.138 // seconds per meter at  at 26 km/h
drive_penalty = 300 // start/stop parking
drive_crow_multiplier = 1.5;

function updateDistances(from, to) {

    realDriveData(from, to);

    var asCrowFlies = from.distanceTo(to);

    var walk_distance = asCrowFlies * walkable_crow_multiplier;
    var walkable = walk_distance <= walkable_limit;
    var walk_time = walk_distance * walk_speed + walk_penalty;  // in s

    var cycle_distance = asCrowFlies * cycleable_crow_multiplier;
    var cyclable = cycle_distance <= cycleable_limit;
    var cycle_time = cycle_distance * cycle_speed + cycle_penalty;  // in s

    var drive_distance = asCrowFlies * drive_crow_multiplier;
    var drive_time = drive_distance * drive_speed + drive_penalty;  // in s

    console.log({
        "crow": asCrowFlies,
        "walk_distance": walk_distance,
        "walkable": walkable,
        "cycle_distance": cycle_distance,
        "cyclable": cyclable,
        "drive_distance": drive_distance,
        }
    );

    console.log({
        "walk_time": walk_time / 60,
        "cycle_time": cycle_time / 60,
        "drive_time": drive_time / 60,
    })
}


function realDriveData(from, to) {
    var res;
    $.ajax("//router.project-osrm.org/viaroute",
        {
            dataType: "json",
            processData: false,
            async: false,
            data: "loc=" + from.lat + ',' + from.lng + "&loc="+to.lat + ',' + to.lng,
            success: function(data) {
                res = data;
            }
        }
    )
    debug = res;
    console.log(res);
    return res;
}

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

    updateDistances(home.getLatLng(), e.latlng);
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

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
drive_liters_p100km = 10
drive_cost_per_km = drive_liters_p100km * 5.29 / 100.0


function yearlyCost(value) {
    days = 20 * 12
    yearlyValue = days * (value * 2)
    return yearlyValue
}

function updateDistances(from, to) {
    updateRealDriveData(from, to)
    var distance = from.distanceTo(to);

    var walk_distance = distance * walkable_crow_multiplier;
    var walkable = walk_distance <= walkable_limit;
    var walk_time = walk_distance * walk_speed + walk_penalty;  // in s

    var cycle_distance = distance * cycleable_crow_multiplier;
    var cyclable = cycle_distance <= cycleable_limit;
    var cycle_time = cycle_distance * cycle_speed + cycle_penalty;  // in s

    var drive_distance = distance * drive_crow_multiplier;
    var drive_time = drive_distance * drive_speed + drive_penalty;  // in s

    var el = document.getElementById('results');
    var scope = angular.element(el).scope()
    scope.$apply(function(){
        scope.from = from
        scope.to = to
        scope.walkable = walkable
        scope.cyclable = cyclable
        scope.distance = distance
        scope.walk_distance = walk_distance
        scope.cycle_distance = cycle_distance
        scope.drive_distance = drive_distance
        scope.walk_time = walk_time / 60
        scope.cycle_time = cycle_time / 60
        scope.drive_time = drive_time / 60
    })
}


function updateRealDriveData(from, to) {
    $.ajax("//router.project-osrm.org/viaroute",
        {
            dataType: "json",
            processData: false,
            // async: false,
            data: "loc=" + from.lat + ',' + from.lng + "&loc="+to.lat + ',' + to.lng,
            success: function(data) {
                var el = document.getElementById('results');
                var scope = angular.element(el).scope()
                scope.$apply(function(){
                    scope.real_drive_distance = data.route_summary.total_distance
                    distance = scope.real_drive_distance
                    scope.real_drive_time = ((distance * drive_speed) + drive_penalty) / 60
                    scope.yearly_distance = yearlyCost(distance) / 1000.0;
                    scope.yearly_cost = drive_cost_per_km * scope.yearly_distance
                })
            }
        }
    )
}

var map = L.map('map');
map.locate({setView: true, maxZoom: 13});

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
    {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
    }
).addTo(map);


new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.Google({
        region: 'PL'
    }),
    showMarker: false
}).addTo(map);



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
        return
    }
    to = L.marker(e.latlng).addTo(map);

    updateDistances(home.getLatLng(), e.latlng);
}


map.on("geosearch_foundlocations", function(data){
    var click = L.latLng(data.Locations[0].Y, data.Locations[0].X);
    var e = {'latlng': click}
    onMapClick(e)
})
map.on('click', onMapClick);


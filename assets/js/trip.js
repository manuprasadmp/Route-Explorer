

$(document).ready(function(){
	tripList = $.grep(trip, function(element,index) {
			return element;
		});
    $('.sub_menu ul').hide();
	$.getJSON("../assets/json/trip.json", function(response) {
		var tripJSON = response;
		var driverNames = [];
		$.each(response.trip, function(i, trips) {
			$.each(trips.drivers, function(id, driver) {
				var output;
				driverNames.push(driver.name);
				$.each(driver.break_events, function(){
					output='<tr><td>Break Event</td><td>'+this.lat+'</td><td>'+this.lng+'</td></tr>';
					$(".event_details tbody").append(output);
				});
				$.each(driver.stop_events, function(){
					output='<tr><td>Stop Event</td><td>'+this.lat+'</td><td>'+this.lng+'</td></tr>';
					$(".event_details tbody").append(output);
				});
				$.each(driver.sharp_turn, function(){
					output='<tr><td>Sharp Turn</td><td>'+this.lat+'</td><td>'+this.lng+'</td></tr>';
					$(".event_details tbody").append(output);
				});
				$.each(driver.acceleration, function(){
					output='<tr><td>Acceleration</td><td>'+this.lat+'</td><td>'+this.lng+'</td></tr>';
					$(".event_details tbody").append(output);
				});
			});
		});
		$('#events_table').dataTable();
		driverNames = unique(driverNames);
		var driverMenu = "";
		$.each(driverNames, function(i, name) {
			var content = $('<li class="sub_menu">'+
				'<span>'+name+'</span>'+
				'<ul class="trip"></ul></li>');
			var tripArray = "";
			$.each(tripJSON.trip, function(i, elm){
				$.each(elm.drivers, function(j, driver){
					if (driver.name === name) {
						tripArray = "<li class='trip_details' data-index="+i+" data-driver="+j+" >"+elm.name+"</li>";
						content.find(".trip").append(tripArray);
					}
				});
			});
			$('.drivers').append(content);
		});	
		
	    $('.sub_menu > span').on('click',function() {
	        $(this).parent('.sub_menu').find(' > ul').slideToggle();
	    });
	    $('.trip_details').on('click',function(){
	    	var tripIndex=$(this).data("index");
	    	var driverIndex=$(this).data("driver");
			$('.trip_info').show(1, function() {
				loadMap(tripIndex,driverIndex);
			});
			$('.home_wrap').hide();
	    });
	});
});

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

/* google api*/

var tripList;

function loadMap(tripIndex,driverIndex) {
	var i=tripIndex;
	var d=driverIndex;
    tripList = $.grep(trip, function(element,index) {
		return element;
	});
    var mapOptions = {
		center: {lat: tripList[i].route_details[0].lat, lng: tripList[i].route_details[0].lng},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions);
// function mapFunctions() {
	autoRefresh(map,tripList,tripIndex);
	var n = tripList[i].route_details.length - 1;
	var myLatlng1 = new google.maps.LatLng( tripList[i].route_details[0].lat ,tripList[i].route_details[0].lng);
	var myLatlng2 = new google.maps.LatLng( tripList[i].route_details[n].lat ,tripList[i].route_details[n].lng);
	var marker = new google.maps.Marker({
        position: myLatlng1,
		map: map,
		icon:"http://maps.google.com/mapfiles/kml/paddle/S.png",
		title: 'TripStart!'
    });
	var marker = new google.maps.Marker({
		position: myLatlng2,
		map: map,
		icon:"http://maps.google.com/mapfiles/kml/paddle/S.png",
		title: 'TripStop!'
    });

	$.each(tripList[i].drivers[d].break_events,function(){
		console.log(this.lat);
		var breakEvents=new google.maps.LatLng( this.lat ,this.lng);
		var marker = new google.maps.Marker({
	        position: breakEvents,
	        map: map,
	        icon:"http://maps.google.com/mapfiles/kml/pal4/icon53.png",
	        title: 'breakevent!'
        });
	});
	$.each(tripList[i].drivers[d].sharp_turn,function(){
		console.log(this.lat);
		var sharpTurn=new google.maps.LatLng( this.lat ,this.lng);
		var marker = new google.maps.Marker({
	        position: sharpTurn,
	        map: map,
	        icon:"http://maps.google.com/mapfiles/kml/pal3/icon51.png",
	        title: 'sharpturn!'
        });
	});
}	

function moveMarker(map, marker, latlng) {
	marker.setPosition(latlng);
	map.panTo(latlng);
}

function autoRefresh(map,tripList,tripIndex) {
	var i, route, marker;
	
	route = new google.maps.Polyline({
		path: [],
		geodesic : true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 5,
		editable: false,
		map:map
	});
			
	marker=new google.maps.Marker({map:map,icon:"http://maps.google.com/mapfiles/kml/pal4/icon7.png"});
	for (i = 0; i < tripList[tripIndex].route_details.length; i++) {
		setTimeout(function (coords) {
			var latlng = new google.maps.LatLng(coords.lat, coords.lng);
			route.getPath().push(latlng);
			moveMarker(map, marker, latlng);
		}, 200 * i, tripList[tripIndex].route_details[i]);
	}
}

$(document).ready(function(){
    
    $('.sub_menu ul').hide();
	$('.sub_menu > span').on('click',function() {
    	$(this).parent('.sub_menu').find(' > ul').slideToggle();
    });
	$('.trip_details').on('click',function(){
		$('.trip_info').show();
		$('.home_wrap').hide();
	});
	$.getJSON("../assets/json/map.json",function(map){
		
		$.each(map.keshavadasapuram_technopark,function(data){
			var output='<tr><td>Break Events</td><td>'+this.breakevents.lattitude+'</td><td>'+this.breakevents.longitude+'</td></tr><tr><td>Crash Events</td><td>'+this.crashevents.lattitude+'</td><td>'+this.crashevents.longitude+'</td></tr><tr><td>Sharp Turns</td><td>'+this.sharpturn.lattitude+'</td><td>'+this.sharpturn.longitude+'</td></tr><tr><td>Acceleration</td><td>'+this.acceleration.lattitude+'</td><td>'+this.acceleration.longitude+'</td></tr>';
			$(".event_details thead").append(output);
	    });
	});



});

/* google api*/
function initialize() {
	var tripList = $.grep(trip, function(element,index) {
			return element;
		})



	console.log(tripList[0].route_details.length);

		     // var myLatlng1 = new google.maps.LatLng( 8.82,76.75);
		     // var myLatlng2 = new google.maps.LatLng( 8.87918,76.63862);
		     
			 

			 var map = new google.maps.Map(document.getElementById("map"), {
			  center: {lat: tripList[0].route_details[0].lat, lng: tripList[0].route_details[0].lng},
			  zoom: 16,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			});
			
			autoRefresh(map,tripList);

				var n = tripList[0].route_details.length - 1;

			var myLatlng1 = new google.maps.LatLng( tripList[0].route_details[0].lat ,tripList[0].route_details[0].lng);
			var myLatlng2 = new google.maps.LatLng( tripList[0].route_details[n].lat ,tripList[0].route_details[n].lng);
			var marker = new google.maps.Marker({
		      position: myLatlng1,
		      map: map,
		      title: 'TripStart!'
            });

			 var marker = new google.maps.Marker({
		      position: myLatlng2,
		      map: map,
		      title: 'TripStop!'
            });

}	

function moveMarker(map, marker, latlng) {
	marker.setPosition(latlng);
	map.panTo(latlng);
}

function autoRefresh(map,tripList) {
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
			
	marker=new google.maps.Marker({map:map,icon:"http://maps.google.com/mapfiles/ms/micons/blue.png"});
	for (i = 0; i < tripList[0].route_details.length; i++) {
		setTimeout(function (coords) {
			var latlng = new google.maps.LatLng(coords.lat, coords.lng);
			console.log(latlng);
			route.getPath().push(latlng);
			moveMarker(map, marker, latlng);
		}, 800 * i, tripList[0].route_details[i]);
	}
}

google.maps.event.addDomListener(window, 'load', initialize);
		
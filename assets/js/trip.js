

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

$(document).ready(function(){
	tripList = $.grep(trip, function(element,index) {
			return element;
		});
    $('.sub_menu ul').hide();
    

	$.getJSON("../assets/json/map.json",function(map){
		
		$.each(map.keshavadasapuram_technopark,function(data){
			var output='<tr><td>Break Events</td><td>'+this.breakevents.lattitude+'</td><td>'+this.breakevents.longitude+'</td></tr><tr><td>Crash Events</td><td>'+this.crashevents.lattitude+'</td><td>'+this.crashevents.longitude+'</td></tr><tr><td>Sharp Turns</td><td>'+this.sharpturn.lattitude+'</td><td>'+this.sharpturn.longitude+'</td></tr><tr><td>Acceleration</td><td>'+this.acceleration.lattitude+'</td><td>'+this.acceleration.longitude+'</td></tr>';
			$(".event_details thead").append(output);
	    });
	});

	$.getJSON("../assets/json/trip.json", function(response) {
		var tripJSON = response;
		var driverNames = [];
		$.each(response.trip, function(i, elm) {
			$.each(elm.drivers, function(id, driver) {
				driverNames.push(driver.name);
			});
		});
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
						// tripArray.push(elm.name);
						tripArray = "<li class='trip_details' data-index="+i+" >"+elm.name+"</li>";
						content.find(".trip").append(tripArray);
					}
				});
			});
			
			$('.drivers').append(content);
		});	
		
	    $('.sub_menu > span').off("click").on('click',function() {
	        $(this).parent('.sub_menu').find(' > ul').slideToggle();
	    });
	    $('.trip_details').on('click',function(){
	    	var tripIndex=$(this).data("index");
			$('.trip_info').show(1, function() {
				loadMap(tripIndex);
			});
		$('.home_wrap').hide();
		
	});
	});

// for(var i=0;i<tripList.length;i++){
// 	for(var n=0;n<tripList[i].drivers.length;n++){
// 		var d=tripList[i].drivers.length;
// 		console.log(d);
// 		$('.drivers').append('<li class="sub_menu"><span>'+tripList[i].drivers[n].name+'</span><ul class="trip'+i'"></ul></li>');

// 		for(var x=0;x<tripList.length;x++){
// 			for(var j=0;j<tripList.drivers.length;j++){
// 				if(tripList[i].drivers[n].name==tripList[x].drivers[j].name){
// 					$(".trip'+i'").append('<li class="trip_details">'+tripList[x].name+'</li>');
// 				}
// 			}	
// 		}
// 	}
// }


});

/* google api*/

var tripList;

function loadMap(tripIndex) {
	        var i=tripIndex;
	        console.log(i);
			tripList = $.grep(trip, function(element,index) {
			return element;
		});
	
		     // var myLatlng1 = new google.maps.LatLng( 8.82,76.75);
		     // var myLatlng2 = new google.maps.LatLng( 8.87918,76.63862);
		     
			 
		     var mapOptions = {
			  center: {lat: tripList[i].route_details[0].lat, lng: tripList[i].route_details[0].lng},
			  zoom: 17,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			 map = new google.maps.Map(document.getElementById("map"), mapOptions);
// }

// function mapFunctions() {

			autoRefresh(map,tripList);

			var n = tripList[i].route_details.length - 1;

			var myLatlng1 = new google.maps.LatLng( tripList[i].route_details[0].lat ,tripList[i].route_details[0].lng);
			var myLatlng2 = new google.maps.LatLng( tripList[i].route_details[n].lat ,tripList[i].route_details[n].lng);
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



			 // var marker = new google.maps.Marker({
		  //     position: myLatlng2,
		  //     map: map,
		  //     title: 'Hello World!'
    //         });


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
		strokeColor: '#2E64FE',
		strokeOpacity: 1.0,
		strokeWeight: 5,
		editable: false,
		map:map
	});
			
	marker=new google.maps.Marker({map:map,icon:"http://maps.google.com/mapfiles/ms/micons/blue.png"});
	for (i = 0; i < tripList[0].route_details.length; i++) {
		setTimeout(function (coords) {
			var latlng = new google.maps.LatLng(coords.lat, coords.lng);
			// console.log(latlng);
			route.getPath().push(latlng);
			moveMarker(map, marker, latlng);
		}, 1500 * i, tripList[0].route_details[i]);
	}
}

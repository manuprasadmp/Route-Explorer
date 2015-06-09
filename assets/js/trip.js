$(document).ready(function(){
	$('#trip_details').on('click',function(){
		$('.trip_info').show();
		$('.home_wrap').hide();
	});
	$.getJSON("../assets/json/map.json",function(map){
		
		$.each(map.keshavadasapuram_technopark,function(data){
			var output='<tr><td>Break Events</td><td>'+this.breakevents.lattitude+'</td><td>'+this.breakevents.longitude+'</td></tr><tr><td>Crash Events</td><td>'+this.crashevents.lattitude+'</td><td>'+this.crashevents.longitude+'</td></tr><tr><td>Sharp Turns</td><td>'+this.sharpturn.lattitude+'</td><td>'+this.sharpturn.longitude+'</td></tr><tr><td>Acceleration</td><td>'+this.acceleration.lattitude+'</td><td>'+this.acceleration.longitude+'</td></tr>';
			$(".event_details thead").append(output);
	    });
	})
});
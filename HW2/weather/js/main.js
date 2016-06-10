$(document).ready(function() {
	//	populate cities dropdown 
	var sel = $("#citiesSelect");
	for(var i = 0; i < cities.length; i++) {
	    var opt = $("<option></option>")
	    	.html(cities[i])
	    	.attr("value", cities[i])
	    	.attr("index", i); 
	    sel.append(opt);
	}
	
	// search handler
	$("#search").click(function() {
		// get search field
		var city = $("#citiesSelect").val(); 
		var state = states[cities.indexOf(city)];
		var apiUrl = "http://api.wunderground.com/api/246c024e842655a0/conditions/q/" + state + "/" + city + ".json";

		// 	use weather API
		$.ajax({
		  	dataType: 'json',
			url: apiUrl
		}).then(function(data) {
			console.log(data);

			if (data.current_observation !== undefined) {
				//	basic weather info
				var response = data.current_observation;

				$("#weather-icon").attr("src", response.icon_url);
				$("#city span").html(response.display_location.city);
				$("#country span").html(response.display_location.country);
				$("#full_name span").html(response.display_location.full);
				$("#temperature span").html(response.temperature_string);
				$("#relative_humidity span").html(response.relative_humidity);

				//	get map
				var latitude = response.display_location.latitude;
				var longitude = response.display_location.longitude;
				var staticMapApiUrl = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude +  "," + longitude + "&zoom=14&size=400x400&key=AIzaSyDsdpafhpCGw2a1G3iRa59AYQ50qIcFGPQ";

				$("#mapImg").attr("src", staticMapApiUrl);

				//	get timezone
				var timezoneApiUrl = "https://maps.googleapis.com/maps/api/timezone/json?location="  + latitude +  "," + longitude +  "&timestamp=1331161200&key=AIzaSyBjgcICpFpOta8aU7NpY8PhPmktLptPSdg";

				$.ajax({
					url: timezoneApiUrl
				}).then(function(data) {
					$("#current_timezone span").html(data.timeZoneName);
				});	

				//	convert to selected city's time
				var cityTimeApiUrl = "https://worldtimeiodeveloper.p.mashape.com/geo?latitude=51.02314&longitude=-0.13343543";

				$.ajax({
					url: cityTimeApiUrl,
					type: 'GET',
					beforeSend: function(xhr) {
				    	xhr.setRequestHeader("X-Mashape-Authorization", "75DpeDVzr9mshQ0bnpmZDNfiTNhcp1Z1SmJjsnUYhb5Ngif2Ea"); 
				    	xhr.setRequestHeader("X-Mashape-Key", "75DpeDVzr9mshQ0bnpmZDNfiTNhcp1Z1SmJjsnUYhb5Ngif2Ea");
				    	xhr.setRequestHeader("Accept", "application/json");
				    }
				}).then(function(data) {
					console.log(data);
					//	set time offset
					$("#utc_offset span").html(data.current.utcOffset);
					$("#city_time span").html(data.summary.local);

					// var date_ms = new Date();
					var current_date = new Date();
					current_date.setHours(current_date.getHours() + 8);
					var month = current_date.getMonth() + 1;
					var date = current_date.getUTCDate();
					var hours = current_date.getUTCHours();
					var minutes = current_date.getUTCMinutes();
					var seconds = current_date.getUTCSeconds();

					var local_time = current_date.getFullYear() + "-" 
									+ ((month < 10) ? "0" + month : month) + "-" 
									+ ((date < 10) ? "0" + date : date)
									+ " " 
									+ ((hours < 10) ? "0" + hours : hours) + ":" 
									+ ((minutes < 10) ? "0" + minutes : minutes) + ":" 
									+ ((seconds < 10) ? "0" + seconds : seconds);
					$("#local_time span").html(local_time);
				});
			} else {
				$("#warning-message").show();
			}
		});
	});

	// hide message
	$("#searchInput").on("keypress", function() {
		$("#warning-message").hide();
	});

	$("#stateInput").on("keypress", function() {
		$("#warning-message").hide();
	});

});
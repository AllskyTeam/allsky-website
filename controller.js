var app = angular.module('allsky', ['ngLodash']);

$(window).resize(function () {
	buildOverlay();
});

function buildOverlay(){
	var planetarium;
	$.ajax({
		url: "virtualsky.json" + '?_ts=' + new Date().getTime(),
		cache: false
	}).done(
		function (data) {
			// This is to scale the overlay when the window is resized
			data.width = window.innerWidth < config.overlaySize ? window.innerWidth : config.overlaySize;
			data.height = data.width;
			data.latitude = config.latitude;
			data.longitude = config.longitude;
			data.az = config.az;
			planetarium = $.virtualsky(data);
			$("#starmap").css("margin-top", config.overlayOffsetTop + "px");
			$("#starmap").css("margin-left", config.overlayOffsetLeft + "px");
		}
	);
};

function compile($compile) {
	// directive factory creates a link function
	return function (scope, element, attrs) {
		scope.$watch(
			function (scope) {
				// watch the 'compile' expression for changes
				return scope.$eval(attrs.compile);
			},
			function (value) {
				// when the 'compile' expression changes
				// assign it into the current DOM
				element.html(value);

				// compile the new DOM and link it to the current
				// scope.
				// NOTE: we only compile .childNodes so that
				// we don't get into infinite loop compiling ourselves
				$compile(element.contents())(scope);
			}
		);
	};
}

function AppCtrl($scope, $timeout, $http, _) {

	buildOverlay();

	$scope.imageURL = "loading.jpg";
	$scope.showInfo = false;
	$scope.showOverlay = config.showOverlayAtStartup;
	$scope.notification = "";
	$scope.title = config.title;
	$scope.location = config.location;
	$scope.latitude = config.latitude;
	$scope.longitude = config.longitude;
	$scope.camera = config.camera;
	$scope.computer = config.computer;
	$scope.owner = config.owner;
	$scope.auroraForecast = config.auroraForecast;
	$scope.imageName = config.imageName;

	function getHiddenProp() {
		var prefixes = ['webkit', 'moz', 'ms', 'o'];

		// if 'hidden' is natively supported just return it
		if ('hidden' in document) return 'hidden';

		// otherwise loop over all the known prefixes until we find one
		for (var i = 0; i < prefixes.length; i++) {
			if ((prefixes[i] + 'Hidden') in document)
				return prefixes[i] + 'Hidden';
		}

		// otherwise it's not supported
		return null;
	}

	function isHidden() {
		var prop = getHiddenProp();
		if (!prop) return false;

		return document[prop];
	}

	// The default_interval should ideally be based on the time between day and night images - why
	// check every 5 seconds if new images only appear once a minute?
	var default_interval = (5 * 1000);		// Time to wait between normal images.  READ ONLY
	var interval_timer = default_interval;		// Amount of time we're currently waiting

	// If we're not taking pictures during the day, we don't need to check for updated images as often.
	// If we're displaying an aurora picture, it's only updated every 5 mintutes, so wait half that.
	// If we're not displaying an aurora picture the picture we ARE displaying doesn't change so
	// there's no need to check until nightfall.
	// However, in case the image DOES change, check every minute.  Seems like a good compromise.
	var aurora_interval_timer = ((5/2) * 60 * 1000);
	var non_aurora_interval_timer = (60 * 1000);

	var last_type = "";
	var logged_times = false;
	var num_images_read = 0;
	$scope.getImage = function () {
		var url= "";
		var imageClass= "";
		if (!isHidden() && $scope.sunset) {
			interval_timer = default_interval;
			num_images_read++;

			var now = moment(new Date());

			var is_nighttime;
			var before_sunrise = $scope.sunrise && moment($scope.sunrise).isAfter(now);
			var after_sunset = moment($scope.sunset).isBefore(now);

			// This check assumes sunrise and sunset are both in the same day,
			// which they should be since postData.sh runs at the end of nighttime and calculates
			// sunrise and sunset for the current day.

			// It's nighttime if we're either before sunrise (e.g., 3 am and sunrise is 6 am) OR
			// it's after sunset (e.g., 9 pm and sunset is 8 pm).
			// Both only work if we're in the same day.
			if (before_sunrise || after_sunset) {
				// sunrise is in the future so it's currently nighttime
				is_nighttime = true;
			} else {
				is_nighttime = false;
			}

			// The sunrise and sunset times change every day, and the user may have changed
			// streamDaytime, so re-read the data.json file when something changes.
			var reread_sunrise_sunset = false;
			if (is_nighttime) {
				// Only add to the console log once per message type
				if (last_type !== "nighttime") {
					console.log("=== Night Time streaming starting at " + now.format("h:mm a"));
					last_type = "nighttime";
					logged_times = false;
					reread_sunrise_sunset = true;
console.log("XXX starting nighttime, reread_sunrise_sunset=" + reread_sunrise_sunset);
				}
				url = config.imageName;
				imageClass = 'current';
				$scope.notification = "";

			} else if ($scope.streamDaytime) {
				if (last_type !== "daytime") {
					console.log("=== Day Time streaming starting at " + now.format("h:mm a"));
					last_type = "daytime";
					logged_times = false;
					reread_sunrise_sunset = true;
				}
				url = config.imageName;
				imageClass = 'current';
				$scope.notification = "";

			} else {	// daytime but we're not taking pictures
				if (last_type !== "daytimeoff") {
					console.log("=== Camera turned off during Day Time at " + now.format("h:mm a"));
					last_type = "daytimeoff";
					logged_times = false;
					reread_sunrise_sunset = true;
console.log("XXX starting no capture daytime, reread_sunrise_sunset=" + reread_sunrise_sunset);
				}

			 	// Countdown calculation
				// The sunset time only has hours and minutes so could be off by up to a minute,
				// so add some time.  Better to tell the user to come back in 2 minutes and
				// have the actual time be 1 minute, than to tell them 1 minute and a new
				// picture doesn't appear for 2 minutes after they return so they sit around waiting.
				var ms = moment($scope.sunset,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
				// Testing showed that 1 minute wasn't enough to add, and we need to account for
				// long nighttime exposures, so add 3 minutes.
				var add = 3 * 60 * 1000;
				ms += add;
				var t = moment($scope.sunset + add).format("h:mm a");

				var d = moment.duration(ms);
				var hours = Math.floor(d.asHours());
				var minutes = moment.utc(ms).format("m");
				var seconds = moment.utc(ms).format("s");
				var h = hours !== 0 ? hours + " hour" + (hours > 1 ? "s " : " ") : "";
				// Have to use != instead of !== because "minutes" is a string.
				var m = minutes != 0 ? minutes + " minute" + (minutes > 1 ? "s" : "") : "";
				var s
				if (hours == 0 && minutes == 0)
					s = seconds + " seconds";
				else
					s = h + m;
				$scope.notification = "<div style='background-color: #333; color: red; text-align: center; font-size: 145%; font-weight: bold; border: 3px dashed white; margin: 20px 0 20px; 0;'>It's not dark yet in " + config.location + ".&nbsp; &nbsp; Come back at " + t + " (" + s + ").</div>";

				if (! logged_times) {
					console.log("=== Resuming at nighttime in " + s);
				}
				if ($scope.auroraForecast) {
					url = "https://services.swpc.noaa.gov/images/animations/ovation/" + config.auroraMap + "/latest.jpg";
					imageClass = 'forecast-map';
					interval_timer = aurora_interval_timer;
				} else {
					url = config.imageName;
					imageClass = 'current';
					interval_timer = non_aurora_interval_timer;
				}

			}

			if (! logged_times) {		// for debugging
				logged_times = true;
				console.log("  " + now.format("YYYY-MM-DD HH:mm:ss") + " == now");
				console.log("  before sunrise = " + before_sunrise);
				console.log("  after sunset = " + after_sunset);
			}

			var img = $("<img />").attr('src', url + '?_ts=' + new Date().getTime()).addClass(imageClass)
				.on('load', function() {
					if (!this.complete || typeof this.naturalWidth === "undefined" || this.naturalWidth === 0) {
						alert('broken image!');
						$timeout(function(){
							$scope.getImage();
						}, 500);
					} else {
						$("#live_container").empty().append(img);
					}
				});

			// Don't re-read after the 1st image since we read the file right before the image.
			if (reread_sunrise_sunset && num_images_read > 1) {
				console.log("Re-reading data.json xxxxxxxxxx");
				$scope.getSunRiseSet();
			} else if (reread_sunrise_sunset) {
				console.log("XXXX Not rereading data.json, num_images_read=" + num_images_read);
			} else {
				console.log("reread_sunrise_sunset=" + reread_sunrise_sunset);
			}
		}
	};

	$scope.getSunRiseSet = function () {
		$http.get("data.json" + '?_ts=' + new Date().getTime(), {
			cache: false
		}).then(
			function (data) {
				$scope.sunrise = moment(data.data.sunrise);
				$scope.sunset = moment(data.data.sunset);
				$scope.streamDaytime = data.data.streamDaytime === "true";

				console.log("Read data.json at " + moment(new Date()).format("h:mm:ss a"));
				console.log("  * streamDaytime == " + $scope.streamDaytime);
				console.log("  * " + $scope.sunrise.format("YYYY-MM-DD HH:mm:ss") + " == sunrise");
				console.log("  * " + $scope.sunset.format("YYYY-MM-DD HH:mm:ss") + " == sunset");

				$scope.getImage()
			}, function() {
				alert("ERROR:\n'data.json' file not found, cannot continue.\nSet 'POST_END_OF_NIGHT_DATA=true' in config.sh");
			}
		);
	};
	$scope.getSunRiseSet();

	$scope.intervalFunction = function () {
		$timeout(function () {
			$scope.getImage();
			$scope.intervalFunction();
		}, interval_timer)
	};
	$scope.intervalFunction();

	$scope.toggleInfo = function () {
		$scope.showInfo = !$scope.showInfo;
	};
	
	$scope.toggleOverlay = function () {
		$scope.showOverlay = !$scope.showOverlay;
		$('.options').fadeToggle();
		$('#starmap_container').fadeToggle();
	};

	$scope.getScale = function (index) {
		var scale = {
			0: "Low",
			1: "Low",
			2: "Low",
			3: "Active",
			4: "High",
			5: "Extreme",
			6: "Extreme",
			7: "Extreme",
			8: "Extreme",
			9: "Extreme",
			100: "WARNING"
		};
		return scale[index];
	};

	$scope.getForecast = function () {

		function getSum(data, field) {
			var total = _.sumBy(data, function (row) {
				return parseInt(row[field]);
			});
			return Math.round(total / 7);
		}

		function getDay(number) {
			var day = moment().add(number, 'd');
			return moment(day).format("MMM") + " " + moment(day).format("DD");
		}

		$http.get("getForecast.php")
			.then(function (response) {
				$scope.forecast = {};
				// If the 1st 'time' value begins with "ERROR", there was an error getting data.
				msg = response.data[0]['time'];
				if ((msg.substring(0,9) == "WARNING: ") || response.data == "") {
					// 100 indicates warning
					$scope.forecast[''] = 100;	// displays "WARNING"
					$scope.forecast[msg.substring(9)] = -1; // displays msg
				} else {
					$scope.forecast[getDay(0)] = getSum(response.data, "day1");
					$scope.forecast[getDay(1)] = getSum(response.data, "day2");
					$scope.forecast[getDay(2)] = getSum(response.data, "day3");
				}
			});
	};

	$scope.getForecast();
}


angular
	.module('allsky')
	.directive('compile', ['$compile', compile])
	.controller("AppCtrl", ['$scope', '$timeout', '$http', 'lodash', AppCtrl])
;

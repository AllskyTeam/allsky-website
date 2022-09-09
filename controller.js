var app = angular.module('allsky', ['ngLodash']);

var overlayBuilt = false;				// has the overlay been built yet?

var virtualSkyData = null;
var sunData = "data.json";				// contains sunrise/sunset times and related data
var configData = "configuration.json"	// contains web configuration data

// This returns the height INCLUDING the border:      $("#imageContainer").css('height')
// This returns the height NOT including the border:  $("#imageContainer").height()

// These two are used by virtualsky.js to set the overlay width and height,
// if there was a difference.
var useWidth = 0, useHeight = 0;
var wasDiff = true;

var imageAspectRatio;

$(window).resize(function () {
	if (overlayBuilt) {					// only rebuild if already built once
		var newW = $("#imageContainer").width();
		var newH = $("#imageContainer").height()
//		console.log("#imageContainer newW=" + newW + ", newH=" + newH);

		var diffW = newW - useWidth;
		// Scale the height based on the aspect ratio of the image.
		var diffH = Math.round(((newH - useHeight) * imageAspectRatio), 0);

		if (diffW == 0 && diffH == 0) {
			wasDiff = false;
//			console.log(">>> No change in image size.");
			return;
		}

		wasDiff = true;

//		console.log("== diffW= " + diffW + ", diffH= " + diffH);
		useWidth  += diffW;
		useHeight += diffH;

		// This does not change the SIZE of the overlay; it changes how much is viewable.
// console.log("=== Resizing #starmap_container to w=" + useWidth + ", h=" + useHeight);
		$("#starmap_container").css("width", useWidth + "px").css("height", useHeight + "px");
		$("#starmap_inner").css("width", useWidth + "px").css("height", useHeight + "px");
	}
});

function buildOverlay(){
	if (overlayBuilt) {
		S.virtualsky(virtualSkyData);
	} else {
		// The index.php file already included the configuration file and set "config",
		// so I didn't thing we'd need to do it again here, but it doesn't work if we don't.
		// virtualSkyData = config;

		$.ajax({
			// No need for ?_ts=   since $.ajax adds one
			url: configData,
			cache: false
		}).done(
			function (data) {
				virtualSkyData = data.config;

				// These variables have different names in virtualsky.js and our config file.
				virtualSkyData.width = data.config.overlayWidth;
				virtualSkyData.height = data.config.overlayHeight;

				S.virtualsky(virtualSkyData);		// Creates overlay
				overlayBuilt = true;

				// Offset of overlay
				$("#starmap")
					.css("margin-top", data.config.overlayOffsetTop + "px")
					.css("margin-left", data.config.overlayOffsetLeft + "px");

				useWidth = $("#imageContainer").width();
				useHeight = $("#imageContainer").height();
				imageAspectRatio = useWidth / useHeight;

				// #starmap_container determines how much of the constellation overlay shows.
				// Think of it as a window into the overlay.
				// It should be at most the height of the image.
				if (useHeight > data.config.imageHeight)
					useHeight = data.config.imageHeight;

// console.log("=== Initial #starmap_container, w=" + useWidth + ", h=" + useHeight);
				$("#starmap_container")
					.css("width", useWidth + "px")
					.css("height", useHeight + "px");
				$("#starmap_inner")
					.css("width", useWidth + "px")
					.css("height", useHeight + "px");
			}
		);
	}
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

var configNotSet = false;	// Has the configuration file been updated by the user?
var needToUpdate = "XX_NEED_TO_UPDATE_XX";	// must match what's in configData

function AppCtrl($scope, $timeout, $http, _) {
	$scope.imageURL = config.loadingImage;
	$scope.showInfo = false;
	$scope.showOverlay = config.showOverlayAtStartup;
	if ($scope.showOverlay) {
		console.log("@@ Building overlay at startup for showOverlay...");
		buildOverlay();
	}
	$scope.notification = "";
	if (config.title == needToUpdate) {
		// Assume if the title isn't set, nothing else is either.
		configNotSet = true;
		$scope.notification = formatMessage("Please update the '" + configData + "' file.<br>Replace the '" + needToUpdate + "' entries and check all other entries.<br>Refresh your browser when done.", msgType="error");
		return;
	}
	$scope.location = config.location;

	// Allow latitude and longitude to have or not have N, S, E, W,
	// but in the popout, always use the letters for consistency.
	// virtualsky.js expects decimal numbers so we need both.
	var len, direction;
	var convertToString = false;
	if (typeof config.latitude === "string") {
		$scope.s_latitude = config.latitude;	// string version

		len = config.latitude.length;
		direction = config.latitude.substr(len-1, 1).toUpperCase();
		if (direction == "N")
			$scope.latitude = config.latitude.substr(0, len-2) * 1;
		else if (direction == "S")
			$scope.latitude = config.latitude.substr(0, len-2) * -1;
		else {
			// a number with quotes around it which is treated as a string
			$scope.latitude = config.latitude * 1;
			convertToString = true;
		}
	} else {
		$scope.latitude = config.latitude;
		convertToString = true;
	}

	if (convertToString) {
		if (config.latitude >= 0)
			$scope.s_latitude = config.latitude + "N";
		else
			$scope.s_latitude = -config.latitude + "S";
	}

	convertToString = false;
	if (typeof config.longitude === "string") {
		$scope.s_longitude = config.longitude;

		len = config.longitude.length;
		direction = config.longitude.substr(len-1, 1).toUpperCase();
		if (direction == "E")
			$scope.longitude = config.longitude.substr(0, len-2) * 1;
		else if (direction == "W")
			$scope.longitude = config.longitude.substr(0, len-2) * -1;
		else {
			// a number with quotes around it which is treated as a string
			$scope.longitude = config.longitude * 1;
			convertToString = true;
		}
	} else {
		$scope.longitude = config.longitude;
		convertToString = true;
	}

	if (convertToString) {
		if (config.longitude >= 0)
			$scope.s_longitude = config.longitude + "E";
		else
			$scope.s_longitude = -config.longitude + "W";
	}

	$scope.camera = config.camera;
	$scope.lens = config.lens;
	$scope.computer = config.computer;
	$scope.owner = config.owner;
	$scope.auroraForecast = config.auroraForecast;
	$scope.imageName = config.imageName;
	$scope.AllskyVersion = config.AllskyVersion;
	$scope.AllskyWebsiteVersion = config.AllskyWebsiteVersion;

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
	var hiddenProperty = getHiddenProp();

	function isHidden() {
		if (! hiddenProperty) return false;
		return document[hiddenProperty];
	}

	// If the "sunData" file wasn't found, or for some reason "sunset" isn't in it,
	// the routine that reads "sunData" will set "dataMissingMessage" so display it.
	var dataMissingMessage = "";

	function formatMessage(msg, msgType) {
		return("<div class='msg " + msgType + "-msg'>" + msg + "</div>");
	}

	// How old should the data file be, or the sunset time be, in order to warn the user?
	// In the morning before a new file is uploaded,
	// it'll be a day old so use a value at least greater than 1.
	const oldDataLimit = 2;

	// The defaultInterval should ideally be based on the time between day and night images - why
	// check every 5 seconds if new images only appear once a minute?
	var defaultInterval = (config.intervalSeconds * 1000);		// Time to wait between normal images.
	var intervalTimer = defaultInterval;		// Amount of time we're currently waiting

	// If we're not taking pictures during the day, we don't need to check for updated images as often.
	// If we're displaying an aurora picture, it's only updated every 5 mintutes.
	// If we're not displaying an aurora picture the picture we ARE displaying doesn't change so
	// there's no need to check until nightfall.
	// However, in case the image DOES change, check every minute.  Seems like a good compromise.
	// Also, in both cases, if we wait too long, when the user returns to the web page after
	// it's been hidden, they'll have to wait a long time for the page to update.
	var auroraIntervalTimer = (60 * 1000);			// seconds
	var auroraIntervalTimerShortened = (15 * 1000);	// seconds
	var nonAuroraIntervalTimer = (60 * 1000);		// seconds

	// When there is only this much time to nightime,
	// shorten the timeout value for quicker message updates.
	const startShortenedTimeout = (10 * 60 * 1000);	// minutes

	var lastType = "";
	var loggedTimes = false;
	var numImagesRead = 0;
	var numCalls = 0;
	$scope.getImage = function () {
		var url= "";
		var imageClass= "";
		// Go through the loop occassionally even when hidden so we re-read the sunData file
		// if needed.
		if (! isHidden() || ++numCalls % 5 == 0) {
			if (configNotSet) {
// xxxxxxxxx test deleting the "if" portion
				$scope.notification = formatMessage("Please update the '" + configData + "' file.<br>Replace the '" + needToUpdate + "' entries and check all other entries.<br>Refresh your browser when done.", msgType="error");
			} else if (dataMissingMessage !== "") {
				$scope.notification = formatMessage(dataMissingMessage, msgType = dataFileIsOld ? "warning": "error");
			} else {
				$scope.notification = "";
			}

			var rereadSunriseSunset = false;

			numImagesRead++;

			// the "m_" prefix means it's a moment() object.
			var m_now = moment(new Date());

			var m_nowTime = m_now.format("HH:mm");
			var m_sunriseTime = moment($scope.sunrise).format("HH:mm");
			var m_sunsetTime  = moment($scope.sunset).format("HH:mm");
			var beforeSunriseTime = m_nowTime < m_sunriseTime;
			var afterSunsetTime = m_nowTime > m_sunsetTime;

			// Check if the sunset time is too old.
			// If the data file is old, don't bother checking sunset time since it'll be old too.
			// However, we may need "daysOld" below so calculate it.
			var m_nowDate = moment(m_now.format("YYYY-MM-DD"));	// needs to be moment() object
			var m_sunsetDate = moment($scope.sunset.format("YYYY-MM-DD"));
			var daysOld = moment.duration(m_nowDate.diff(m_sunsetDate)).days();
			var oldMsg = ""
			if (! dataFileIsOld) {
//console.log("DEBUG: sunset daysOld=" + daysOld);
				if (daysOld > oldDataLimit) {
					var oldMsg = "WARNING: sunset data is " + daysOld + " days old.";
					$scope.notification = formatMessage(oldMsg + "<br>See the  'Troubleshooting &gt; Website'  Wiki page for how to resolve this.", msgType="warning");
				}
			}

			// This check assumes sunrise and sunset are both in the same day,
			// which they should be since postData.sh runs at the end of nighttime and calculates
			// sunrise and sunset for the current day.

			// It's nighttime if we're either before sunrise (e.g., 3 am and sunrise is 6 am) OR
			// it's after sunset (e.g., 9 pm and sunset is 8 pm).
			// Both only work if we're in the same day.
			var is_nighttime;
			if (beforeSunriseTime || afterSunsetTime) {
				// sunrise is in the future so it's currently nighttime
				is_nighttime = true;
			} else {
				is_nighttime = false;
			}

			// The sunrise and sunset times change every day, and the user may have changed
			// streamDaytime, so re-read the "sunData" file when something changes.
			if (is_nighttime) {
				// Only add to the console log once per message type
				if (lastType !== "nighttime") {
					console.log("=== Night Time streaming starting at " + m_now.format("h:mm a"));
					lastType = "nighttime";
					loggedTimes = false;
					rereadSunriseSunset = true;
				}
				url = config.imageName;
				imageClass = 'current';
				intervalTimer = defaultInterval;

			} else if ($scope.streamDaytime) {
				if (lastType !== "daytime") {
					console.log("=== Day Time streaming starting at " + m_now.format("h:mm a"));
					lastType = "daytime";
					loggedTimes = false;
					rereadSunriseSunset = true;
				}
				url = config.imageName;
				imageClass = 'current';
				intervalTimer = defaultInterval;

			} else {	// daytime but we're not taking pictures
				if (lastType !== "daytimeoff") {
					console.log("=== Camera turned off during Day Time at " + m_now.format("h:mm a"));
					lastType = "daytimeoff";
					loggedTimes = false;
					rereadSunriseSunset = true;
				}

			 	// Countdown calculation
				// The sunset time only has hours and minutes so could be off by up to a minute,
				// so add some time.  Better to tell the user to come back in 2 minutes and
				// have the actual time be 1 minute, than to tell them 1 minute and a new
				// picture doesn't appear for 2 minutes after they return so they sit around waiting.
				// Need to compare on the same date, but different times.
				var ms = moment($scope.sunset,"DD/MM/YYYY HH:mm:ss").add(daysOld,"days").diff(moment(m_now,"DD/MM/YYYY HH:mm:ss"));

				// Testing showed that 1 minute wasn't enough to add, and we need to account for
				// long nighttime exposures, so add 2.5 minutes.
				const add = 2.5 * 60 * 1000;
				ms += add;
				const time_to_come_back = moment($scope.sunset + add).format("h:mm a");

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
				$scope.notification += formatMessage("It's not dark yet in " + config.location + ".&nbsp; &nbsp; Come back at " + time_to_come_back + " (" + s + ").", msgType="notice");

				if (! loggedTimes) {
					console.log("=== Resuming at nighttime in " + s);
				}
				if ($scope.auroraForecast) {
					url = "https://services.swpc.noaa.gov/images/animations/ovation/" + config.auroraMap + "/latest.jpg";
					imageClass = 'forecast-map';
					// If less than startShortenedTimeout time left, shorten the timer.
					if (ms < startShortenedTimeout) {
						intervalTimer = auroraIntervalTimerShortened;
					} else {
						intervalTimer = auroraIntervalTimer;
					}
				} else {
					url = config.imageName;
					imageClass = 'current';
					intervalTimer = nonAuroraIntervalTimer;
				}

			}

			if (! loggedTimes) {		// for debugging
				loggedTimes = true;
				console.log("  m_now = " + m_now.format("YYYY-MM-DD HH:mm:ss"));
				if (oldMsg !== "") console.log("    > " + oldMsg);

				console.log("  m_now="+m_nowTime + ", m_sunrise="+m_sunriseTime + ", m_sunset="+m_sunsetTime);
				console.log("  beforeSunriseTime = " + beforeSunriseTime);
				console.log("  afterSunsetTime = " + afterSunsetTime);
			}

// TODO: Is there a way to specify not to cache this without using "?_ts" ?
			var img = $("<img title='allsky image' />")
				.attr('src', url + '?_ts=' + new Date().getTime())
				.addClass(imageClass)
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

			// Don't re-read after the 1st image of this period since we read it right before the image.
			if (rereadSunriseSunset && numImagesRead > 1) {
				$scope.getSunRiseSet();
			}
		} // if (! isHidden()))
	};

	// Set a default sunrise if we can't get it from "sunData".
	var usingDefaultSunrise = false;
	function getDefaultSunrise(today) {
		return(moment(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0, 0)));
	}
	// Set a default sunset if we can't get it from "sunData".
	var usingDefaultSunset = false;
	function getDefaultSunset(today) {
		return(moment(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0)));
	}

	function writeSunriseSunsetToConsole() {
		console.log("  * streamDaytime == " + $scope.streamDaytime);
		console.log("  * sunrise = " + $scope.sunrise.format("YYYY-MM-DD HH:mm:ss") + (usingDefaultSunrise ? " (default)" : ""));
		console.log("  * sunset = "  + $scope.sunset.format("YYYY-MM-DD HH:mm:ss") + (usingDefaultSunset ? " (default)" : ""));
		console.log("  * last modified = "  + lastModifiedSunriseSunsetFile.format("YYYY-MM-DD HH:mm:ss"));
	}

	var lastModifiedSunriseSunsetFile = null;
	var dataFileIsOld;

	$scope.getSunRiseSet = function () {
		dataFileIsOld = false;
		now = new Date();
		var url = sunData;
// TODO: is ?_ts needed if we are not cache'ing ?
		url += '?_ts=' + now.getTime();
		console.log("Read " + sunData + " at " + moment(now).format("MM-DD h:mm:ss a") + ":");
		$http.get(url, {
			cache: false
		}).then(
			function (data) {
				if (data.data.sunrise) {
					$scope.sunrise = moment(data.data.sunrise);
					usingDefaultSunrise = false;
				} else if (! usingDefaultSunrise) {
// TODO: Is this needed with the new Allsky Website, given that it only works with the new Allsky?
					// Older versions of allsky/scripts/postData.sh didn't include sunrise.
					$scope.sunrise = getDefaultSunrise(now);
					usingDefaultSunrise = true;
					console.log("  ********** WARNING: 'sunrise' not defined in " + sunData);
				}
				if (data.data.sunset) {
					$scope.sunset = moment(data.data.sunset);
					usingDefaultSunset = false;
					dataMissingMessage = "";
				} else if (! usingDefaultSunset) {
// TODO: Is this needed with the new Allsky Website, given that it only works with the new Allsky?
					$scope.sunset = getDefaultSunset(now);
					usingDefaultSunset = true;
					dataMissingMessage = "ERROR: 'sunset' not defined in '" + sunData + "', using " + $scope.sunset.format("h:mm a") + ".<br>Run 'allsky/scripts/postData.sh'.<br>Refresh your browser when done.";
					console.log("  ********** ERROR: 'sunset' not defined in " + sunData);
				}
				if (data.data.streamDaytime) {
					$scope.streamDaytime = data.data.streamDaytime === "true";
				} else {
// TODO: Is this needed with the new Allsky Website, given that it only works with the new Allsky?
					$scope.streamDaytime = true;
					console.log("  ********** WARNING: 'streamDaytime' not defined in " + sunData);
				}

				// Get when the file was last modified so we can warn if it's old
				function fetchHeader(url, wch) {
					try {
						var req=new XMLHttpRequest();
						req.open("HEAD", url, false);
						req.send(null);
						if(req.status == 200){
							return new Date(req.getResponseHeader(wch));
						}
						else return false;
					} catch(er) {
						return er.message;
					}
				}
				lastModifiedSunriseSunsetFile = null;
				var x = fetchHeader(url,'Last-Modified');
				if (typeof x === "object") {	// success - "x" is a Date object
					lastModifiedSunriseSunsetFile = moment(x);
					var duration = moment.duration(moment(now).diff(lastModifiedSunriseSunsetFile));
// console.log("DEBUG: " + sunData + " is " + duration.days() + " days old");
					if (duration.days() > oldDataLimit) {
						dataFileIsOld = true;
						var msg = "WARNING: " + sunData + " is " + duration.days() + " days old.";
						console.log(msg);
						dataMissingMessage = msg + "<br>Check Allsky log file if 'postData.sh' has been running successfully at the end of nighttime.";
					}

				} else {
					console.log("fetchHeader(" + sunData + ") returned " + x);
				}

				writeSunriseSunsetToConsole();

				$scope.getImage()
			}, function() {
				// Unable to read file.  Set to defaults.
				$scope.sunrise = getDefaultSunrise(now);
				usingDefaultSunrise = true;
				$scope.sunset = getDefaultSunset(now);
				usingDefaultSunset = true;
				$scope.streamDaytime = true;

				dataMissingMessage = "ERROR: '" + sunData + " file not found, using " + $scope.sunset.format("h:mm a") + " for sunset.<br>Set 'POST_END_OF_NIGHT_DATA=true' in config.sh then run 'allsky/scripts/postData.sh'.<br>Refresh your browser when done.";
				console.log("  *** Unable to read '" + sunData + "' file");
				writeSunriseSunsetToConsole();

				$scope.getImage()
			}
		);
	};
	$scope.getSunRiseSet();

	$scope.intervalFunction = function () {
		$timeout(function () {
			$scope.getImage();
			$scope.intervalFunction();
		}, intervalTimer)
	};
	$scope.intervalFunction();

	$scope.toggleInfo = function () {
		$scope.showInfo = !$scope.showInfo;
	};
	
	$scope.toggleOverlay = function () {
		$scope.showOverlay = !$scope.showOverlay;

		if (! overlayBuilt && $scope.showOverlay) {
			console.log("@@@@ Building overlay from toggle...");
			// Version 0.7.7 of VirtualSky doesn't show the overlay unless buildOverlay() is called.
			buildOverlay();
		}

		$('.options').fadeToggle();
		$('#starmap_container').fadeToggle();
	};

	$scope.getScale = function (index) {	// based mostly on https://auroraforecast.is/kp-index/
		var scale = {
			0: "Extremely_Quiet",
			1: "Very_Quiet",
			2: "Quiet",
			3: "Unsettled",
			4: "Active",
			5: "Minor_storm",
			6: "Moderate_storm",
			7: "Strong_storm",
			8: "Severe_storm",
			9: "Extreme_storm",
			100: "WARNING"
		};
		return scale[index];
	};

	if ($scope.auroraForecast) {
		$scope.getForecast = function () {

			function getSum(data, field) {
				var total = _.sumBy(data, function (row) {
					return parseInt(row[field]);
				});
				return Math.round(total / data.length);	// return average
			}

			function getDay(number) {
				var day = moment().add(number, 'd');
				return moment(day).format("MMM") + " " + moment(day).format("DD");
			}

			$http.get("getForecast.php")
				.then(function (response) {
					$scope.forecast = {};
					// If the 1st 'time' value begins with "WARNING", there was an error getting data.
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
}


angular
	.module('allsky')
	.directive('compile', ['$compile', compile])
	.controller("AppCtrl", ['$scope', '$timeout', '$http', 'lodash', AppCtrl])
;


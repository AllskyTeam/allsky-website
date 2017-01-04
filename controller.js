var app = angular.module('allsky', ['ngLodash']);

$(document).ready(function(){
	
	$(function(){
		$('.date-picker').on("input", function(e){
			
			if (e.target.value.length < 2){
				$("#" + e.target.id).val("0" + e.target.value);
			}
			var dateString = $('#year').val()  + "-" + $('#month').val() + "-" + $('#day').val() + " " + $('#hour').val() + ":" + $('#minute').val() + "-08:00";
			//console.log(dateString);
		  if (moment(dateString).isValid())
			buildOverlay({"clock":dateString});
		  else 
			buildOverlay();
		});  
	});
	
	// Init date picker
	var now = moment();
	$('#year').val(now.year());
	$('#month').val(padNumber(now.month() + 1));
	$('#day').val(padNumber(now.date()));
	$('#hour').val(padNumber(now.hour()));
	$('#minute').val(padNumber(now.minute()));
});

$(window).resize(function () {
	buildOverlay();
});

function padNumber(n){
	return n.toString().length < 2 ? "0" + n : n;
}

function buildOverlay(params){
	$.ajax({
		url: "virtualsky.json" + '?_ts=' + new Date().getTime(),
		cache: false
	}).done(
		function (data) {
			var clock = null;
			if (params && params.clock) {
				clock = moment(_clock);
			} else {
				clock = moment();
			}
			data.clock = clock.toDate();
			data.width = window.innerWidth < 960 ? window.innerWidth : 960;
			data.height = data.width;
			planetarium = $.virtualsky(data);
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
	
    var imageName = "image.jpg";
    $scope.imageURL = "loading.jpg";
    $scope.showInfo = false;
    $scope.showOverlay = false;
    $scope.notification = "";

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

    $scope.getImage = function () {
        /*var url= "";
        var imageClass= "";
        if (!isHidden() && $scope.sunset) {
            var now = moment.utc(new Date());
            /*if (moment($scope.sunset).isBefore(now)) {
                console.log("It's night time... Live stream is on");
                url = imageName;
                imageClass = 'current';
            } else {*/
               /* console.log("It's still pretty bright outside. We'll resume live stream at sunset");
                url = "http://services.swpc.noaa.gov/images/animations/ovation-north/latest.png";
                imageClass = 'forecast-map';
                //Countdown calculation
                var ms = moment($scope.sunset,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"));
                var d = moment.duration(ms);
                var hours = Math.floor(d.asHours());
                var minutes = moment.utc(ms).format("mm");
                var h = hours != 0 ? hours + "h" : "";
                var m = hours != 0 ? minutes : minutes + " minutes";
                var s = h + m;
                //$scope.notification = "It's not dark yet in Whitehorse. Come back in " + s;
				$scope.notification = "The camera is in maintenance mode... no live view available, but you can check the <a href='./videos'>archives</a>";
           // }
            var img = $("<img />").attr('src', url + '?_ts=' + new Date().getTime()).addClass(imageClass)
                .on('load', function() {
                    if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                        alert('broken image!');
                        $timeout(function(){
                            $scope.getImage();
                        }, 500);
                    } else {
                        $scope.notification = "";
                        $("#imageContainer").empty().append(img);
                    }
                });
        }*/
    };

    $scope.getSunset = function () {
        $http.get("data.json" + '?_ts=' + new Date().getTime(), {
            cache: false
        }).then(
            function (data) {
                $scope.sunset = moment(data.data.sunset.replace("-0800", "-0700"));
            }
        );
    };

    $scope.getSunset();

    $scope.intervalFunction = function () {
        $timeout(function () {
            $scope.getImage();
            $scope.intervalFunction();
        }, 5000)
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
            9: "Extreme"
        };
        return scale[index];
    };

    $scope.getForecast = function () {

        function getSum(data, field) {
            var total = _.sumBy(data, function (row) {
                return parseInt(row[field]);
            });
            var average = Math.round(total / 7);
            //console.log(average);
            return average;
        }

        function getDay(number) {
            var day = moment().add(number, 'd');
            return moment(day).format("MMM") + " " + moment(day).format("DD");
        }

        $http.get("getForecast.php")
            .then(function (response) {
                $scope.forecast = {};
                $scope.forecast[getDay(0)] = getSum(response.data, "day1");
                $scope.forecast[getDay(1)] = getSum(response.data, "day2");
                $scope.forecast[getDay(2)] = getSum(response.data, "day3");
            });
    };

    $scope.getForecast();
}


angular
    .module('allsky')
    .directive('compile', ['$compile', compile])
    .controller("AppCtrl", ['$scope', '$timeout', '$http', 'lodash', AppCtrl])
;

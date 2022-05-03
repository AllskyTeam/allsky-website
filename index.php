<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" ng-app="allsky" ng-controller="AppCtrl" lang="en">
<head>
	<title>Allsky - {{title}}</title>
	<meta property="og:title" content="All Sky Camera" />
	<meta property="og:type" content="image/jpeg" />
	<meta property="og:url" content="http://www.thomasjacquin/allsky/" />
	<meta property="og:image" content="http://www.thomasjacquin.com/allsky/image.jpg" />
	<link rel="shortcut icon" type="image/png" href="allsky-favicon.png">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
		integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
	<link href='https://fonts.googleapis.com/css?family=Ubuntu:400,300' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="animate.min.css">
	<link rel="stylesheet" type="text/css" href="allsky.css">
	<link rel="stylesheet" type="text/css" href="allsky-font.css">

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
		integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS"
		crossorigin="anonymous"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
	<script src="moment.js" type="text/javascript"></script>
	<script src="virtualsky/stuquery.js" type="text/javascript"></script>
	<script src="virtualsky/virtualsky.js" type="text/javascript"></script>
	<script src="ng-lodash.min.js"></script>
	<script src="config.js"></script>
	<script src="controller.js"></script>
</head>
<body>
	<div class="header">
		<div class=title>{{title}}</div>
		<div ng-show="auroraForecast === true && forecast" class="forecast pull-right">
			<span>Aurora activity: </span>
			<span class="forecast-day" ng-repeat="(key,val) in forecast">{{key}}:
				<span ng-class="getScale(val)" title="{{val}}/9">{{getScale(val)}}</span>
			</span>
		</div>
		<div style="clear:both;"></div>
	</div>
	<div class="info animated slideInRight" ng-show="showInfo==true">
		<ul>
			<li><i class="fa fa-fw fa-map-marker-alt"></i>&nbsp; Location: <span>{{location}}</span></li>
			<li><i class="fa fa-fw fa-map-marker"></i>Latitude: <span>{{latitude < 0 ? latitude * -1 + 'S' : latitude + 'N'}}</span></li>
			<li><i class="fa fa-fw fa-map-marker"></i>Longitude: <span>{{longitude < 0 ? longitude * -1 + 'W' : longitude + 'E'}}</span></li>
			<li><i class="fa fa-fw fa-camera-retro"></i>&nbsp; Camera: <span>{{camera}}</span></li>
			<li><i class="fa fa-fw fa-dot-circle"></i>&nbsp; Lens: <span>{{lens}}</span></li>
			<li><i class="fa fa-fw fa-microchip"></i>&nbsp; Computer: <span>{{computer}}</span></li>
			<li><i class="fa fa-fw fa-user"></i>&nbsp; Owner: <span>{{owner}}</span></li>
		</ul>
	</div>
	<span class="notification" compile="notification"></span>

	<ul id="sidebar" class="animated slideInLeft">
		<li><i class="fa fa-2x fa-fw allsky-constellation" id="overlayBtn" title="Show constellations overlay" ng-click="toggleOverlay()" ng-class="{'active': showOverlay}"></i></li>
		<li><a href="videos" title="Archived Timelapses"><i class="fa fa-2x fa-fw fa-play-circle"></i></a></li>
		<li><a href="keograms" title="Archived Keograms"><i class="fa fa-2x fa-fw fa-barcode"></i></a></li>
		<li><a href="startrails" title="Archived Startrails"><i class="fa fa-2x fa-fw fa-circle-notch"></i></a></li>
		<li><i class="fa fa-2x fa-fw fa-camera" title="Information about the camera" ng-click="toggleInfo()" ng-class="{'active': showInfo}" style="margin-top: 5px; font-size: 1.9em"></i></li>	
	</ul>

<!-- TODO: make border optional -->
	<div id="imageContainer">
		<div id="starmap_container" ng-show="showOverlay==true">
			<div id="starmap"></div>
		</div>
		<div id="live_container">
			<img title="allsky image" alt="allsky image" id="current" class="current" src="loading.jpg">
		</div>
	</div>
	
<!-- TODO: allow user to not show this. -->
	<div class="diy"><a href="http://thomasjacquin.com/make-your-own-allsky-camera"><i class="fa fa-gear"></i> Make Your Own</a></div>

<?php if (file_exists("analyticsTracking.js") && filesize("analyticsTracking.js") > 50) {
	// The initial analyticsTracking.js file has a comment line "//Include your Google Analytics code here" which is < 50 characters.
?>
	<script src="analyticsTracking.js"></script>
<?php } ?>
</body>
</html>

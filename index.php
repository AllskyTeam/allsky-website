<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" ng-app="allsky" ng-controller="AppCtrl" lang="en">
<head>
	<?php
		// This gets the settings.
		// Some settings impact this page, some impact the constellation overlay.
		include_once('functions.php');		// Sets $settings_array

		// Get home page options
		$homePage = v("homePage", null, $settings_array);
			$onPi = v("onPi", true, $homePage);
			// TODO: replace double quotes with &quot; in any variable that can be in an HTML attribute,
			// which is many of them.
			$backgroundImage = v("backgroundImage", "", $homePage);
			if ($backgroundImage != null) {
				$backgroundImage_url = v("url", "", $backgroundImage);
				if ($backgroundImage_url == "") $backgroundImage = null;
				else $backgroundImage_style = v("style", "", $backgroundImage);
			}
			$loadingImage = v("loadingImage", "loading.jpg", $homePage);
			$title = v("title", "Website", $homePage);
			$og_description = v("og_description", "", $homePage);
			$og_type = v("og_type", "website", $homePage);
			$og_url = v("og_url", "http://www.thomasjacquin/allsky/", $homePage);
			$og_image = v("og_image", "image.jpg", $homePage);
			$ext = pathinfo($og_image, PATHINFO_EXTENSION); if ($ext === "jpg") $ext = "jpeg";
			$og_image_type = "image/$ext";
			$favicon = v("favicon", "allsky-favicon.png", $homePage);
			$ext = pathinfo($favicon, PATHINFO_EXTENSION); if ($ext === "jpg") $ext = "jpeg";
			$faviconType = "image/$ext";
			$includeGoogleAnalytics = v("includeGoogleAnalytics", "", $homePage);
			$imageBorder = v("imageBorder", false, $homePage);
			$includeLinkToMakeOwn = v("includeLinkToMakeOwn", true, $homePage);
			$showOverlayIcon = v("showOverlayIcon", false, $homePage);
			$sidebar = v("sidebar", null, $homePage);
			$popoutIcons = v("popoutIcons", null, $homePage);
			$personalLink = v("personalLink", null, $homePage);
			if ($personalLink != null) {
				$personalLink_url = v("url", "", $personalLink);
				if ($personalLink_url == "") {
					$personalLink = null;
				} else {
					$personalLink_prelink = v("prelink", "", $personalLink);
					$personalLink_message = v("message", "", $personalLink);
					$personalLink_title = v("title", "", $personalLink);
					$personalLink_style = v("style", "", $personalLink);
					if ($personalLink_style !== "")
						$personalLink_style = "style='$personalLink_style'";
				}
			}

		// Get javascript config variable options.
		// To avoid changing too much code, the "config" javascript variable is created
		// here to replace the old config.js file that contained that variable.
		$config = v("config", null, $settings_array);
			echo "<script>config = {\n";
			foreach ($config as $var => $val) {	// ok to have comma after last entry
				echo "\t\t$var: ";
				if ($val === true || $val === false || $val === null || is_numeric($val))
					echo var_export($val, true) . ",\n";
				else
					echo '"' . $val . '",' . "\n";
			}
			// Add additional variable(s) from $homePage that are needed in controller.js.
			echo "\t\ttitle: " . '"' . $title . '",' . "\n";
			echo "\t\tloadingImage: " . '"' . $loadingImage . '"';

			echo "\t}";
			echo "\n\t</script>\n";
	?>

	<title><?php echo $title ?></title>
	<meta property="og:title" content="All Sky Camera" />
	<meta property="og:description" content="<?php echo $og_description ?>" />
	<meta property="og:type" content="<?php echo $og_type ?>" />
	<meta property="og:url" content="<?php echo $og_url ?>" />
	<meta property="og:image" content="<?php echo $og_image ?>" />
	<meta property="og:image:type" content="<?php echo $og_image_type ?>" />
	<link rel="shortcut icon" type="<?php echo $faviconType ?>" href="<?php echo $favicon ?>">
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
	<script src="controller.js"></script>
</head>
<body id="body" <?php if ($backgroundImage !== null) echo "style=" . '"background-image: url(' . "'$backgroundImage_url'); $backgroundImage_style" . '"'; ?>>
	<div class="header">
		<div class=title><?php echo $title; ?></div>
		<div ng-show="auroraForecast === true && forecast" class="forecast pull-right">
			<span>Aurora activity: </span>
			<span class="forecast-day" ng-repeat="(key,val) in forecast">{{key}}:
				<span ng-class="getScale(val)" title="{{val}}/9">{{getScale(val)}}</span>
			</span>
		</div>
		<div style="clear:both;"></div>
<?php	// display an optional link to the user's website
	if ($personalLink != null) {
		echo "\t\t<div class='personalLink'>";
		if ($personalLink_prelink !== "") echo "$personalLink_prelink";
		echo '<a href="' . $personalLink_url . '" title="' . $personalLink_title . '" target="_blank" ' . $personalLink_style . '>' . $personalLink_message . '</a>';
		echo "</div>";
	}
?>

	</div>
<?php
if (count($popoutIcons) > 0) {
	echo "\t<div class='info animated slideInRight' ng-show='showInfo==true'>\n";
		echo "\t\t<ul>\n";
				foreach ($popoutIcons as $popout) {
					$label = v("label", "", $popout);
					if ($label === "") continue;

					$icon = v("icon", "", $popout);
					$js_variable = v("variable", "", $popout);
					$value = v("value", "", $popout);
					echo "\t\t\t<li><i class='fa fa-fw $icon'></i>&nbsp; $label:&nbsp; <span>";
					if ($js_variable != "")
						echo "{{" . $js_variable . "}}";
					else
						echo "$value";
					echo "</span></li>\n";
				}
		echo "\t\t</ul>\n";
	echo "\t</div>\n";
}
?>
	<span class="notification" compile="notification"></span>

	<ul id="sidebar" class="animated slideInLeft">
<?php	// The link to the overlay is always first and the camera info is always last.
	if ($showOverlayIcon) {
		echo "\t\t<li><i class='fa fa-2x fa-fw allsky-constellation' id='overlayBtn' title='Show constellations overlay' ng-click='toggleOverlay()' ng-class=" . '"' ."{'active': showOverlay}" . '"' . "></i></li>\n";
	}
	if (count($sidebar) > 0) {
		foreach ($sidebar as $side) {
			$url = v("url", "", $side);
			if ($url === "") continue;

			$url = "$url?onPi=$onPi";
			$title = v("title", "", $side);
			$icon = v("icon", "", $side);
			echo "\t\t<li><a href=" . '"' . $url . '"' .  "title=" . '"' . "$title" . '"' . "><i class=" . '"' . "fa fa-2x fa-fw $icon" . '"' . "></i></a></li>\n";
		}
		if (count($popoutIcons) > 0) {
			echo "\t\t<li><i class='fa fa-2x fa-fw fa-camera' title='Information about the camera' ng-click='toggleInfo()' ng-class=" . '"' . "{'active': showInfo}" . '"' . " style='margin-top: 5px; font-size: 1.9em'></i></li>\n";
		}
	}
?>
	</ul>

	<div id="imageContainer" <?php if ($imageBorder) echo "class='imageContainer'"; ?>>
		<div id="starmap_container" ng-show="showOverlay==true">
			<div id="starmap"></div>
		</div>
		<div id="live_container">
			<img title="allsky image" alt="allsky image" id="current" class="current" src="<?php echo $loadingImage ?>">
		</div>
	</div>
	
<?php if ($includeLinkToMakeOwn) { ?>
	<div class="diy"><a href="http://thomasjacquin.com/make-your-own-allsky-camera"><i class="fa fa-gear"></i> Make Your Own</a></div>
<?php } ?>

<?php if ($includeGoogleAnalytics && file_exists("analyticsTracking.js")) { ?>
	<script src="analyticsTracking.js"></script>
<?php } ?>
</body>
</html>

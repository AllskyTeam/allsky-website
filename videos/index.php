<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
		<script src="../analyticsTracking.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
		<link href="../allsky.css" rel="stylesheet">
	</head>
	<body>
		<?php

		$files = array();
		if ($handle = opendir('.')) {

			while (false !== ($entry = readdir($handle))) {

				if (strpos($entry, 'mp4') !== false) {

					$files[] = $entry;
				}
			}

			closedir($handle);
		}

		asort($files);

		echo "<a class='back-button' href='..'><i class='fa fa-chevron-left'></i>Back to Live View</a>";
		echo "<div class=archived-videos>";

		$no_thumbnail_image = "../NoThumbnail.png";
		foreach ($files as $file) {
			$year = substr($file, 7, 4);
			$month = substr($file, 11, 2);
			$day = substr($file, 13, 2);
			$date = $year.$month.$day;
			// put in variable so we don't duplicate below.
			$thumbnail = "thumbnails/".$date.".gif";
			$x = "<a href='./$file'><div class='day-container'><div class='image-container'><img id='$date'";
			$y = "onmouseenter='onImgEnter(this)' onmouseleave='onImgLeave(this)'";	// LEGACY - NOT NEEDED
			$y = "";
			$z = "title='$year-$month-$day' /></div><div>$year-$month-$day</div></div></a>";
			if (file_exists($thumbnail)){
				//echo "<img style='display:none' src='".$thumbnail."'>";
				echo $x." src='$thumbnail' ".$y." ".$z;
			} else {
				// On large screens, the thumbnails are stretched width-wise, so set width to auto.
				echo $x." src='$no_thumbnail_image' style='width: auto' ".$z;
			}
		}
		echo "</div>";
		?>
		<script>
			function onImgEnter(img) {
				$(img).attr("src", "thumbnails/" + $(img).attr("id") + ".gif");
			}
			function onImgLeave(img) {
				$(img).attr("src", "<?php echo "$no_thumbnail_image"; ?>");
			}
		</script>
	</body>
</html>

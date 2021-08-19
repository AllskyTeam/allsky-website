<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
		<script src="../analyticsTracking.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
		<link href="../allsky.css" rel="stylesheet">
	</head>
	<body>
		<?php

		include '../functions.php';

		$files = array();
		if ($handle = opendir('.')) {

			while (false !== ($entry = readdir($handle))) {

				if (strpos($entry, 'jpg') !== false) {

					$files[] = $entry;
				}
			}

			closedir($handle);
		}

		asort($files);
	
		if (!is_dir('thumbnails')) {
			mkdir('thumbnails', 0755);
		}

		echo "<a class='back-button' href='..'><i class='fa fa-chevron-left'></i>Back to Live View</a>";
		echo "<div class=archived-videos>";

		foreach ($files as $file) {
			$thumbnail = "thumbnails/$file";
			if (! file_exists($thumbnail) &&
			    ! make_thumb($file, $thumbnail, 100)) {
				// xxx: fix: use THUMBNAIL_SIZE_X in config.sh
				$thumbnail = "./$file";
			}
			$year = substr($file, 11, 4);
			$month = substr($file, 15, 2);
			$day = substr($file, 17, 2);
			$date = $year.$month.$day;
			# On large screens, the thumbnails are stretched width-wise, so set width to auto.
			echo "<a href='./$file'><div class='day-container'><div class='image-container'><img id=".$date." src='$thumbnail' title='Startrails-$year-$month-$day'/></div><div>$year-$month-$day</div></div></a>";
		}
		echo "</div>";

		?>
	</body>
</html>

<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
		<link href="../allsky.css" rel="stylesheet">
	</head>
	<body>
		<?php

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

		echo "<a class='back-button' href='..'><i class='fa fa-chevron-left'></i>Back to Live View</a>";
		echo "<div class=archived-videos>";

		foreach ($files as $file) {
			$year = substr($file, 11, 4);
			$month = substr($file, 15, 2);
			$day = substr($file, 17, 2);
			$date = $year.$month.$day;
			echo "<a href='./$file'><div class='day-container'><div class='image-container'><img id=".$date." src='./$file' title='Startrails-$year-$month-$day'/></div><div>$year-$month-$day</div></div></a>";			
		}
		echo "</div>";

		include_once("../analyticstracking.php");
		?>
	</body>
</html>

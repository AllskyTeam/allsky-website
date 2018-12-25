<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
        <script src="../analyticstracking.js"></script>
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

		foreach ($files as $file) {
			$year = substr($file, 7, 4);
			$month = substr($file, 11, 2);
			$day = substr($file, 13, 2);
			$date = $year.$month.$day;
			if (file_exists("thumbnails/".$date.".gif")){
				//echo "<img style='display:none' src='thumbnails/".$date.".gif'>";
				echo "<a href='./$file'><div class='day-container'><div class='image-container'><img id=".$date." src='../aurora-snap.jpg' title='$year-$month-$day' onmouseenter='onImgEnter(this)' onmouseleave='onImgLeave(this)'/></div><div>$year-$month-$day</div></div></a>";
			} else {
				echo "<a href='./$file'><div class='day-container'><div class='image-container'><img id=".$date." src='../aurora-snap.jpg' title='$year-$month-$day'/></div><div>$year-$month-$day</div></div></a>";
			}
			
		}
		echo "</div>";
		?>
		<script>
			function onImgEnter(img) {
				$(img).attr("src", "thumbnails/" + $(img).attr("id") + ".gif");              
			}
			function onImgLeave(img) {
				$(img).attr("src", "../aurora-snap.jpg");              
			}
		</script>
	</body>
</html>

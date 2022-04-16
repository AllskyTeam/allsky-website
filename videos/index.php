<?php include '../functions.php'; disableBuffering(); // must be first line ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" type="image/png" href="../allsky-favicon.png">
		<title>Timelapse Videos</title>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<?php if (file_exists("../analyticsTracking.js") && filesize("../analyticsTracking.js") > 50) { ?>
		<script src="../analyticsTracking.js"></script>
<?php } ?>
		<script defer src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
		<link href="../allsky.css" rel="stylesheet">
	</head>
	<body>
		<?php display_thumbnails("Timelapse"); ?>
	</body>
</html>

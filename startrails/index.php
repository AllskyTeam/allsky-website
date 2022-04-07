<?php include '../functions.php'; disableBuffering(); // must be first line ?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" type="image/png" href="../allsky-favicon.png">
		<title>Startrails</title>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<?php if (file_exists("../analyticsTracking.js") && filesize("../analyticsTracking.js") > 50) { ?>
		<script src="../analyticsTracking.js"></script>
<?php } ?>
		<!-- Font Awesome -->
		<script defer src="../js/font-awesome.js"></script>
		<link href="../allsky.css" rel="stylesheet">
	</head>
	<body>
		<?php display_thumbnails("Startrails"); ?>
	</body>
</html>

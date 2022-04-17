<?php include 'functions.php'; disableBuffering(); // must be first line ?>
<?php
	$dir = "";				// directory the files are in
	$file_name = "";		// prefix on file name
	$title = "";			// web page <title> and heading on page
	if (isset($_GET['dir'])) $dir = $_GET['dir'];
	if (isset($_GET['prefix'])) $prefix = $_GET['prefix'];
	if (isset($_GET['title'])) $title = $_GET['title'];
	if ($dir == "" || $prefix == "" || $title == "") {
		echo "<p>INTERNAL ERROR: incomplete arguments given to view thumbnails.</p>";
		echo "dir=$dir, prefix=$prefix, title=$title";
		exit;
	}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" type="image/png" href="allsky-favicon.png">
		<title><?php echo $title; ?></title>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<?php if (file_exists("analyticsTracking.js") && filesize("analyticsTracking.js") > 50) { ?>
		<script src="analyticsTracking.js"></script>
<?php } ?>
		<script defer src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js"></script>
		<link href="allsky.css" rel="stylesheet">
	</head>
	<body>
		<?php display_thumbnails($dir, $prefix, $title); ?>
	</body>
</html>

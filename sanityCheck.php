<?php
	// Check sanity of Website and make necessary directories when possible.

	echo "<style>";
		// shade of green that's easier to see.
	echo ".success { color: #00c300; font-weight: bold; }";
	echo ".failure { color: red; font-weight: bold; }";
	echo "</style>";

	if (isset($_GET["debug"]))
		$debug = true;
	else
		$debug = false;

	$ok = true;
	// These directories should have an "index.php" file and a "thumbnails" directory.
	// If the directory doesn't exist or it does but "index.php" doesn't exist,
	// it's an error.
	$dirs = array("no", "videos", "keograms", "startrails");
	$numLinesOutput = 0;
	foreach ($dirs as $dir) {
		if ($debug) {
			if ($numLinesOutput++ > 0) echo "<br>";
			echo "Checking <strong>$dir</strong> directory: ";
		}
		if (! is_dir($dir)) {
			if ($numLinesOutput++ > 0 && ! $debug) echo "<br>";
			$ok = false;
			if ($debug)
				echo "<span class='failure'>";
			else
				echo "'$dir' directory";
			
			echo "does not exist.";
			echo "&nbsp; &nbsp; Please upload it and its contents from the Website package.";
			if ($debug)
				echo "</span>";
			continue;
		} else if ($debug) {
			echo "<span class='success'>exists</span>";
		}

		$file = "index.php";
		if ($debug) {
			echo "<br>&nbsp; &nbsp; > Checking <strong>$file</strong>: ";
		}
		if (! file_exists("$dir/$file")) {
			if ($numLinesOutput++ > 0) echo "<br>";
			$ok = false;
			if ($debug)
				echo "<span class='failure'>";
			echo "'$file' does not exist.";
			echo "&nbsp; &nbsp; Please upload it from the Website package.";
			if ($debug)
				echo "</span>";
			continue;
		} else if ($debug) {
			echo "<span class='success'>exists</span>";
		}

		$thumb_dir = "thumbnails";
		if ($debug) {
			echo "<br>&nbsp; &nbsp; > Checking <strong>$thumb_dir</strong>: ";
		}
		if (! is_dir("$dir/$thumb_dir")) {
			if ($debug) echo "Creating it.";
			if (! mkdir("$dir/$thumb_dir", 0775, true)) {	// true == recursive
				$last_error = error_get_last();
				if ($numLinesOutput++ > 0) echo "<br>";
				if ($debug)
					echo "<span class='failure'>";
				$ok = false;
				echo "Unable to create '$thumb_dir' directory: " . $last_error["message"];
				if ($debug)
					echo "</span>";
			}
		} else if ($debug) {
			echo "<span class='success'>exists</span>";
		}
	}

	// TODO: add other checks here

	if ($debug) echo "<br><br>\n";	// ends any lines already output
	if ($ok) {
		if ($debug) echo "<span class='success'>";
		echo "SUCCESS";
	} else {
		if ($debug) echo "<span class='failure'>";
		echo "FAILURE";
	}
	if ($debug) echo "</span>";
	echo "\n";
	exit;
?>

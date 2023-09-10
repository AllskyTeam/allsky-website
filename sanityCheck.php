<?php
	// Check sanity of Website and make necessary directories when possible.

	umask(0);		// so we get the mode we want
	function make_directory($dir, $fullDir) {
		global $debug, $numLinesOutput;

		$mode = 0775;
		if (! mkdir($fullDir, $mode, true)) {	// true == recursive
			$last_error = error_get_last();
			$ok = false;
			$error = $last_error["message"];
			if ($debug) {
				echo "<span class='failure'>unable to create: $error</span>";
			} else {
				if ($numLinesOutput++ > 0) echo "<br>";
				echo "Unable to create '$dir' directory: $error";
			}
		} else if ($debug) {
			echo "<span class='success'>created</span>";
		}
	}


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
	// The first 3 directories should have an "index.php" file and a "thumbnails" directory.
	// If the directory doesn't exist or it does but "index.php" doesn't exist it's an error.
	$dirs = array(
		"videos" => "container",
		"keograms" => "container",
		"startrails" => "container",

		"fonts" => "contents",
		"viewSettings" => "empty",
		"virtualsky" => "contents",
	);
	$numLinesOutput = 0;
	foreach ($dirs as $dir => $type) {
		if ($debug) {
			if ($numLinesOutput++ > 0) echo "<br>";
			echo "Checking <strong>$dir</strong> directory: ";
		}
		if (! is_dir($dir)) {
			if ($type === "empty") {		# It doesn't have any contents so create it.
				make_directory($dir, $dir);
				continue;
			}

			if ($numLinesOutput++ > 0 && ! $debug) echo "<br>";
			$ok = false;
			$msg="does not exist.";
			$msg .= "&nbsp; &nbsp; Please upload it and its contents from the Website package.";
			if ($debug) {
				echo "<span class='failure'>$msg</span>";
			} else {
				echo "'$dir' directory $msg";
			}
			continue;
		} else if ($debug) {
			echo "<span class='success'>exists</span>";
		}

		if ($type !== "container") continue;		# It doesn't have files or sub-directories.

		$file = "index.php";
		if ($debug) {
			echo "<br>&nbsp; &nbsp; > Checking <strong>$file</strong>: ";
		}
		if (! file_exists("$dir/$file")) {
			if ($numLinesOutput++ > 0 && ! $debug) echo "<br>";
			$ok = false;
			$msg="does not exist. &nbsp; &nbsp; Please upload it from the Website package.";
			if ($debug) {
				echo "<span class='failure'>$msg</span>";
			} else {
				echo "'$file' $msg";
			}
			continue;
		} else if ($debug) {
			echo "<span class='success'>exists</span>";
		}

		$thumb_dir = "thumbnails";
		if ($debug) {
			echo "<br>&nbsp; &nbsp; > Checking <strong>$thumb_dir</strong> directory: ";
		}
		if (! is_dir("$dir/$thumb_dir")) {
			make_directory($thumb_dir, "$dir/$thumb_dir");
		} else if ($debug) {
			echo "<span class='success'>exists</span>";
		}
	}

	// TODO: add other checks here

	if ($debug) echo "<br><br>";	// So the status is more obvious.

	if ($ok) {
		if ($debug) echo "<span class='success'>";
		echo "SUCCESS";
	} else {
		if ($debug)
			echo "<span class='failure'>";
		else
			echo "<br>\n";
		echo "FAILURE";
	}
	if ($debug) echo "</span>";
	echo "\n";
	exit;
?>

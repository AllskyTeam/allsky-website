<?php

echo '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">';
echo '<link href="../allsky.css" rel="stylesheet">';

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
    echo "<a href='./$file'><div><img src='../aurora-snap.jpg' title='$year-$month-$day'/><div>$year-$month-$day</div></div></a>";
}
echo "</div>";

?>

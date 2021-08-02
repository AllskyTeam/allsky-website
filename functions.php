<?php

$displayed_thumbnail_error_message = false;
function make_thumb($src, $dest, $desired_width)
{
    /* Make sure the imagecreatefromjpeg() function is in PHP. */
    global $displayed_thumbnail_error_message;
    if (function_exists('imagecreatefromjpeg') == false)
    {
        if ($displayed_thumbnail_error_message == false)
	{
            echo "<br><p style='color: red'>Unable to make thumbnail(s); imagecreatefromjpeg() does not exist.<br>If you do NOT have the file '/etc/php/7.3/mods-available/gd.ini' you need to download the latest PHP.</p>";
	    $displayed_thumbnail_error_message = true;
	}
        return(false);
    }

    /* read the source image */
    $source_image = imagecreatefromjpeg($src);
    $width = imagesx($source_image);
    $height = imagesy($source_image);

    /* find the "desired height" of this thumbnail, relative to the desired width  */
    $desired_height = floor($height * ($desired_width / $width));

    /* create a new, "virtual" image */
    $virtual_image = imagecreatetruecolor($desired_width, $desired_height);

    /* copy source image at a resized size */
    imagecopyresampled($virtual_image, $source_image, 0, 0, 0, 0, $desired_width, $desired_height, $width, $height);

    /* create the physical thumbnail image to its destination */
    imagejpeg($virtual_image, $dest);

    return(true);
}

?>

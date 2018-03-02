# allsky-website
Web interface displaying an image from an allsky camera. This is a work in progress. Will make the configuration easier in the future.

## Brief overview

**controller.js** contains the logic of the website. It has a timeout that refreshes the image after a certain amount of time. It also grabs the space weather from NOAA and displays it at the top. The constellation overlay is also generated here.

**videos/index.php** lists the timelapses in the videos/ directory.

**keograms/index.php** lists the keograms in the keograms/ directory

**startrails/index.php** lists the startrails in the startrails/ directory

**virtualsky.json** contains settings to generate the constellations overlay (lat, long, etc). The position of the overlay can be adjusted in allsky.css (#starmap_container #starmap).
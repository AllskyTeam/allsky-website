# allsky-website
Web interface displaying an image from an allsky camera.

## Brief overview

**controller.js** contains the logic of the website. It has a timeout that refreshes the image after a certain amount of time. It also grabs the space weather from NOAA and displays it at the top. The constellation overlay is also generated here.

**videos/index.php** lists the timelapses in the videos/ directory.

**keograms/index.php** lists the keograms in the keograms/ directory

**startrails/index.php** lists the startrails in the startrails/ directory

**virtualsky.json** contains settings to generate the constellations overlay (lat, long, etc). The position of the overlay can be adjusted in allsky.css (#starmap).

## Configuration

To configure the website for your own location, you will need to edit the `config` object in `controller.js`

Available options are:

| Option        | Default           | Description  |
| ------------- |:-------------    | :-----|
| title         | Whitehorse, YT    | Title displayed next to the logo |
| imageName     | image-resize.jpg  | The image uploaded from your allsky camera |
| location      | Whitehorse        | The location of your camera   |
| latitude      | 60.7              | Latitude of the camera |
| longitude     | -135.05           | Longitude of the camera |
| az            | 180               | Azimuth at the bottom of the image (0 is north, 90 is east, 180 is south, 270 is west) |
| camera        | ASI224MC          | Your camera model |
| computer      | Raspberry Pi 3    | Your Raspberry Pi model |
| owner         | Thomas Jacquin    | The camera owner |
| auroraMap     | north             | aurora oval map for the north or south hemisphere |
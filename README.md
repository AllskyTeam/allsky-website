# allsky-website
Web interface displaying an image from an allsky camera, optionally with an overlay of constellations and other objects, as well as optional space weather data from NOAA.  
  
  

## Configuration

To configure the website for your own location, edit the `config.js` and `virtualsky.json` files.

### `config.js` options

| Option        | Default           | Description  |
| ------------- |:-------------    | :-----|
| title         | Whitehorse, YT    | Title displayed next to the logo.  Can be anything you want, but keep it short. |
| imageName     | image.jpg  | The image uploaded from your allsky camera.  To use the image from /home/pi/allsky, enter "/current/zzz" where "zzz" is the name of the image file, e.g., "image.jpg". |
| location      | Whitehorse        | The location of your camera   |
| latitude      | 60.7              | Latitude of the camera as a decimal number |
| longitude     | -135.05           | Longitude of the camera, negative is west |
| az            | 180               | Azimuth at the bottom of the image (0 is north, 90 is east, 180 is south, 270 is west) |
| camera        | ASI224MC          | Your camera model |
| computer      | Raspberry Pi 3    | Your Raspberry Pi model |
| owner         | Thomas Jacquin    | The camera owner |
| auroraMap     | north             | aurora oval map for the north or south hemisphere |
| overlaySize	| 875               | Size of the overlay (width and height)
| overlayOffsetLeft     | 0             | Horizontal adjustment of the overlay in pixels (+/-) |
| overlayOffsetTop     | 0             | Vertical adjustment of the overlay in pixels (+/-) |
| auroraForecast     | false             | Displays the 3-day aurora forecast in the top right corner when set to `true` |
| showOverlayAtStartup     | false             | Determines whether or not the overlay should be displayed when the page is loaded |

### `virtualsky.json` options

| Option        | Default           | Description  |
| ------------- |:-------------    | :-----|
| id | starmap | This is used by the web page so do not change |
| projection | fisheye | Leave at the default if your Allsky camera has a fisheye lens
| width | 960 | width of the overlay | Width of the sky in the picture, in pixels
| height | 960 | height of the overlay | Height of the sky in the picture, in pixels
| constellations | true | Show constellation lines? |
| mouse | false | Allow the mouse to rotate the overlay? |
| gridlines_eq | true | Show the RA/Dec grid lines? |
| keyboard | true | Allow keyboard controls? | XXXXXXXXXXXX what are they?
| showdate | false | Show the date and time? |
| showposition | false | Show/hide the latitude/longitude |
| sky_gradient | false | Should the sky lighten toward the horizon? |
| gradient | false | Reduce the brightness of stars near the horizon? |
| showgalaxy | true | Show galaxies? |
| live | true | Update the display in real time? |
| lang | en | Language the object names shoud be in? Look in the `virtualsky/lang` directory for available languages. |
| objects | messier.json | Name of a file in the `virtualsky` directory that contains other objects to display |

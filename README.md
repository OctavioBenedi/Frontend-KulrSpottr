# GAMEBOARD
Implementation in a single page of the KulrSpottr challenge.

## Challenge
Your challenge will be do develop a single page JavaScript application that display the user a matrix of colored tiles. Task for the user is spot the tile which has a different color. If the user clicks the right tile the game continues and the user gets the next level of difficulty presented. If the click is wrong the game ends.

With every level the colors should be randomized and the amount of tiles should increase. The tile which is of different color does not differ it its hue but in the saturation and/or bias/luminance. Please see the HSB/HSL model for reference.

With every successful step there should also be a counter displayed – starting at zero and incrementing by one for every sucessful step. After the game ends the user should get the opportunity to enter herself with a name into a hall of fame ordered by the reached steps sorted descending and only showing the top 10. (attention: no backend integration needed, just keep it in the browsers mem).

## Requirements
Web browser with javascript enabled.

## Compatibility
Tested compatibility with latest version of several browser

* Android Chrome
* Android Firefox
* Chromium
* Firefox Desktop
* Iphone Safari
* IE11

Expected but not tested compatibility with IE (some CSS or JS may not be working on old IE versions)

Only plain javascript used, but some functions as .splice could require a modern javascript engine.

## How to test it
There are several ways to test the game.
- Clone the repo to a local folder and open file index.hml on a web browser.
- Clone the repo and serve it with a web server, for example Apache, nginx, etc.
- Test it on url: https://gameboard_kulrspottr.surge.sh/

## Libraries used
Used library [color.js][1] - Version 0.2.1.2 for color management and HLS to RGB transformations. Kudos to Eli Grey.

[1]:https://github.com/eligrey/color.js

## Help me!
When this button is clicked a script that wins the game is executed. This script do not use internal information, instead discovers the distint cell by itself as requested on the challenge.

# festplayer ![Release](https://img.shields.io/badge/release-v1.0-red.svg) ![early-dev](https://img.shields.io/badge/in%20early%20development-blue.svg) [![License](https://img.shields.io/badge/license-GPLv3-yellow.svg)](./LICENSE)
<img src="https://i.imgur.com/qkT4P1s.png" width="50%" height="50%">

# Warning
**The master branch of festplayer is not fit for production.**

Use the latest release instead.

## Trying the player before setting it up

Click [here](https://festplayer.***REMOVED***/) so you can test out the latest release of the player alongside its remote capabilities. Big thanks to [repl.co](https://repl.co).

## About
Festplayer is an open-source web server-localised music player, that can be controlled remotely, written with HTML, Node.js, CSS, JS and PHP. It's not intended for actual day-to-day use, it's a project I'm writing for a future event.

**Be aware this project (in its entirety) (Festplayer) is under the GPLv3 license.**

**Please be aware the project includes [getid3 v3](https://github.com/JamesHeinrich/getID3), which is under the GPLv3 license.**

**Please be aware the project also includes [noty](https://github.com/needim/noty), [tingle](https://github.com/robinparisi/tingle), [howler.js](https://github.com/goldfire/howler.js) and [SimpleBar](https://github.com/Grsmto/simplebar), and all these projects are under the [MIT License](https://opensource.org/licenses/MIT).**

**Please be aware the project includes [material design icons](https://material.io/icons), licensed under the [Apache License v2](https://www.apache.org/licenses/LICENSE-2.0.html).**

*Big thank you to [audio.js](http://kolber.github.io/audiojs/) for being part of the humble beginnings.*

## Use
Here are all the steps to get Festplayer running.

> You'll need to install node.js and npm to get the websocket server running in ``./webserver_node``. Then do npm install and node main.js (your domain name/ip)

> Make sure you have write and read rights inside ``./api/``.

> Make sure PHP is correctly configured. Don't forget to place your songs in ``./songs``.

> If cloning from master, you will need to create a file named "credentials.php" in ``./api/`` with your SQL credentials:

```php
<?php
$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "remote_codes"; 
?>
```

> And as you can guess, you need to create a MySQL database named "``remote_codes``" with the table "``to_be_connected``" inside of it, and within the table the columns ``CODE(TEXT), IPCOMP(TEXT) and DATE(DATE).``

```sql
CREATE DATABASE `remote_codes`;
CREATE TABLE `to_be_connected` (
	`CODE` TEXT,
	`IPCOMP` TEXT,
	`DATE` DATE
);
```

## Screenshots

*Be aware that the screenshots do not reflect the latest version, as the UI is being constantly changed.*

### *Mobile interface:*
![Screenshot 1](https://i.imgur.com/cOK1Jxi.png)
### *Computer interface:*
![Screenshot 2](https://i.imgur.com/7hK4nCw.png)

## Future development plans
![Flowchart](https://i.imgur.com/YU0o077.png)

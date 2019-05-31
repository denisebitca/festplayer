# festplayer ![Release](https://img.shields.io/badge/release-v~1.0-red.svg) ![early-dev](https://img.shields.io/badge/in%20early%20development-blue.svg) [![License](https://img.shields.io/badge/license-multiple-yellow.svg)](https://github.com/JamesHeinrich/getID3/blob/master/license.txt)
<img src="https://i.imgur.com/qkT4P1s.png" width="50%" height="50%">

# Warning
**The master branch of festplayer is not fit for production.**
Use some of the releases instead.

## About
Festplayer is an open-source web server-localised music player, that can be controlled remotely, written with HTML, Node.js, CSS, JS and PHP. It's not intended for actual day-to-day use, it's a project I'm writing for a future event.

**Please be aware the project includes [getid3 v3](https://github.com/JamesHeinrich/getID3), and as such is subject to [the following licenses](https://github.com/JamesHeinrich/getID3/blob/master/license.txt).**

**Please be aware the project also includes [tingle](https://github.com/robinparisi/tingle), [howler.js](https://github.com/goldfire/howler.js) and [SimpleBar](https://github.com/Grsmto/simplebar), both subject to the [MIT License](https://opensource.org/licenses/MIT).**

**Please be equally aware the project includes [material design icons](https://material.io/icons), which means that you may not package this project with any paid software or profit from it in anyway (even with the getid3 Commercial License).**

*Big thank you to [audio.js](http://kolber.github.io/audiojs/) for being part of the humble beginnings.*

## Use
Here are all the steps to get Festplayer running.

> You'll need to install node.js and npm to get the websocket server running in ``./webserver_node``. Contrary to what the program might say, it will always connect to http://localhost:3210.

> Make sure you have write and read rights inside ``./api/``.

> Festplayer is weird. You must place your songs in ``../songs``.
Make sure PHP is correctly configured.

> You will need to create a file named "credentials.php" in ``./api/`` with your SQL credentials:

```php
<?php
$servername = "localhost";
$username = "root";
$password = "password";
$dbname = "remote_codes"; 
?>
```

> And as you can guess, create a MySQL database named "``remote_codes``" with the table "``to_be_connected``" inside of it, and within the table the columns ``CODE(TEXT), IPCOMP(TEXT) and DATE(DATE).``

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
![Screenshot 1](https://i.imgur.com/H5AUl0v.png)
### *Computer interface:*
![Screenshot 2](https://i.imgur.com/4YH9CnD.png)

## Future development plans
![Flowchart](https://i.imgur.com/YU0o077.png)

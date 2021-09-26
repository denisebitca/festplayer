# festplayer [![Release](https://img.shields.io/badge/release-v0.1bis-red.svg)](https://github.com/rafaelbitca/festplayer/releases) ![early-dev](https://img.shields.io/badge/in%20early%20development-blue.svg) [![License](https://img.shields.io/badge/license-GPLv3-yellow.svg)](./LICENSE)
<img src="https://i.imgur.com/qkT4P1s.png" width="50%" height="50%">

# Warning
**The master branch of festplayer is not fit for production.**

## About
Festplayer is an open-source web music player, written with HTML, CSS, JS and PHP. It's not intended for actual day-to-day use, it's a project I wrote for an event that did not take place due to the pandemic.

**Be aware this project (in its entirety) (Festplayer) is under the GPLv3 license.**

**Please be aware the project includes [getid3 v3](https://github.com/JamesHeinrich/getID3) and festplayer-websocketserver, which are under the GPLv3 license.**

**Please be aware the project also includes [noty](https://github.com/needim/noty), [tingle](https://github.com/robinparisi/tingle), [howler.js](https://github.com/goldfire/howler.js) and [SimpleBar](https://github.com/Grsmto/simplebar), and all these projects are under the [MIT License](https://opensource.org/licenses/MIT).**

**Please be aware the project includes [material design icons](https://material.io/icons), licensed under the [Apache License v2](https://www.apache.org/licenses/LICENSE-2.0.html).**

*Big thank you to [audio.js](http://kolber.github.io/audiojs/) for being part of the humble beginnings.*

## Use
Here are all the steps to get Festplayer running.

> Make sure you have write and read rights inside ``./api/``.

> Make sure PHP is correctly configured. Don't forget to place your songs in ``./songs``.

## Screenshots

*Be aware that the screenshots do not reflect the latest version, as the UI is being constantly changed.*

### *Mobile interface:*
![Screenshot 1](https://i.imgur.com/cOK1Jxi.png)
### *Computer interface:*
![Screenshot 2](https://i.imgur.com/7hK4nCw.png)

## Note about removed features
Due to lack of time to debug the remote play feature, I have temporarily removed all references to remote play from production, therefore more or less reverting Festplayer to v0.1. I call this version v0.1bis. I apologise for not being able to show these functions.
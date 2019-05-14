$.get('./api/getsongs.php', function(result){
	//document.getElementById("loading").style.display = "block";
		if (result == "NIGHT_EMPTY") {
            alert("no songs lol");
        } else {
        var amountofarticles = result.length;
		var array = [];
		for(i=0;amountofarticles>i;i++){
		var music = result[i].file
		array.push(
			"../songs/" + music
		);
		}
		console.log(array);
        for(i=0;amountofarticles>i;i++){
		  if(i == 0){
			var audio = $('<audio></audio>').attr("src", "../songs" + "/" + result[i].file);
			$('#footer').append(audio);
			//document.getElementById("loading").style.display = "none";
		  };
          var article = $("<div></div>").addClass('song');
          $('#songcontainer').append(article);
		  //song position
          var articlepos = document.createElement("h1")
          articlepos.classList.add("songposition")
          var text1 = document.createTextNode(i+1)
		  articlepos.appendChild(text1)
		  $(".song")[i].append(articlepos)
		  //no
		  var article1 = $("<div></div>").addClass('songinfo');
          article.append(article1);
		  //song name
		  var articletitle = document.createElement("h1")
          articletitle.classList.add("songname")
          var text2 = document.createTextNode(result[i].file.substr(0,result[i].file.length - 4))
		  articletitle.appendChild(text2)
		  $(".songinfo")[i].append(articletitle)
		  //duration
		  var articleduration = document.createElement("h1")
          articleduration.classList.add("songduration")
          var text3 = document.createTextNode(result[i].duration);
		  articleduration.appendChild(text3);
		  $(".songinfo")[i].append(articleduration);
		  //other
		  $(".song")[i].setAttribute("onclick", "selectSong('"+i+"')")
        }	
		  $('.song')[0].setAttribute("style", "filter: invert(1)");
		  $('.song')[0].setAttribute("name", "selected");		
	audiojs.events.ready(function() {
		var as = audiojs.createAll();
	});
	new SimpleBar($('#songcontainer')[0]);
	var repeat = $('<i></i>').attr({"class":"material-icons","onclick":"repeat()","id":"repeat","name":"norepeat"});
	repeat.text("repeat_one");
	var slider = $('<input></input>').attr({"id":"vol-control","type":"range","min":"0","max":"100","step":"1","oninput":"setVolume(this.value)"})
	$('#footer').append(repeat);
	$('#footer').append(slider);
}
});

function selectSong(song){
	if($(".song")[song].getAttribute("name") == "selected"){
		if(audiojs.instances.audiojs0.playing){
			document.title = "Festplayer";
		}
		if($(".song")[song].getAttribute("name") == "selected" && !audiojs.instances.audiojs0.playing){
			document.title = $(".songname")[song].innerHTML + " | Festplayer";
		}
		audiojs.instances.audiojs0.playPause()
	} else {
	$('.song[name=selected]')[0].setAttribute("style", "");
	$('.song[name=selected]')[0].setAttribute("name","");
	document.title = "Festplayer";
	$.get('./api/getsongs.php', function(result){
        if (result == "NIGHT_EMPTY") {
            alert("no songs lol");
        } else {
        var amountofarticles = result.length;
		var array = [];
		for(i=0;amountofarticles>i;i++){
		var music = result[i].file
		array.push(
			"../songs/" + music
		);
		}}
		document.title = result[song].file.replace(".mp3","") + " | Festplayer"
	audiojs.instances.audiojs0.load(array[song]);
	if(audiojs.instances.audiojs0.playing = true){
		audiojs.instances.audiojs0.playPause()
	}
	audiojs.instances.audiojs0.playPause()
	$('.song')[song].setAttribute("style", "filter: invert(1)");
	$('.song')[song].setAttribute("name","selected");
	})};
}

function repeat(){
	if(document.getElementById("repeat").getAttribute("name") == "norepeat"){
		document.getElementById("repeat").setAttribute("name", "repeat-one");
		audiojs.instances.audiojs0.element.loop = true;
	} else if(document.getElementById("repeat").getAttribute("name") == "repeat-one"){
		document.getElementById("repeat").setAttribute("name", "norepeat");
		audiojs.instances.audiojs0.element.loop = false;
	}
}

function setVolume(svolume){
	$("audio")[0].volume = svolume/100
}

function remotecontrol(){
	console.log("WIP ;)");
}
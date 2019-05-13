function selectSong(song){
	if($(".song")[song].getAttribute("name") == "selected"){
		if(audiojs.instances.audiojs0.playing == true || audiojs.instances.audiojs0.playing == false){
			audiojs.instances.audiojs0.playPause()
		}
	} else {
	for(i=0;$('.songname').length>i;i++){
	$('.song')[i].setAttribute("style", "");
	$('.song')[i].setAttribute("name","");
	}
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
	$(".audiojs>audio")[0].src = array[song];
	$(".audiojs>audio")[0].load;
	if(audiojs.instances.audiojs0.playing = true){
		audiojs.instances.audiojs0.playPause()
	}
	audiojs.instances.audiojs0.playPause()
	$('.song')[song].setAttribute("style", "filter: invert(1)");
	$('.song')[song].setAttribute("name","selected");
	})};
}
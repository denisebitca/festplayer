function selectSong(song){
	for(i=0;$('.songname').length>i;i++){
		$('.song')[i].setAttribute("style", "");
	}
	$.get('./getsongs.php', function(result){
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
	$(".audiojs").remove()
	var audio = $('<audio></audio>').attr("src", array[song]).attr("autoplay", "autoplay");
	$('#footer').append(audio);
	audiojs.events.ready(function() {
		var as = audiojs.createAll();
	});
	$('.song')[song].setAttribute("style", "filter: invert(1)");
	});
}
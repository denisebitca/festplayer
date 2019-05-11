function selectSong(song){
	for(i=0;$('.songname').length>i;i++){
		$('.song')[i].setAttribute("style", "");
	}
	$.get('../api/getsongs.php', function(result){
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
	$(".audiojs>audio")[0].src(array[song]);
	$(".audiojs>audio")[0].load;
	$(".audiojs>audio")[0].play;
	$('.song')[song].setAttribute("style", "filter: invert(1)");
	});
}
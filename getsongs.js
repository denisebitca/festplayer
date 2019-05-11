$.get('./getsongs.php', function(result){
        if (result == "NIGHT_EMPTY") {
            alert("no songs lol");
        } else {
        var amountofarticles = result.length;
		var array = [];
		for(i=0;amountofarticles>i;i++){
		var music = result[i].file
		array.push(
			"./songs/" + music
		);
		}
		console.log(array);
        for(i=0;amountofarticles>i;i++){
		  if(i == 0){
			var audio = $('<audio></audio>').attr("src", "./songs" + "/" + result[i].file);
			$('#footer').append(audio)
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
		  $('.song')[0].setAttribute("style", "filter: invert(1)");
}
	audiojs.events.ready(function() {
		var as = audiojs.createAll();
	});
	new SimpleBar($('#songcontainer')[0]);
}
});
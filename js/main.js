/*
Festplayer v0.2.1 - main.js
by rdb-github
*/
var resultarray = [];
console.log("Festplayer v0.2.1");
$.get('./api/getsongs.php', function(result){
	//document.getElementById("loading").style.display = "block";
		if (result == "NIGHT_EMPTY") {
            alert("no songs lol");
        } else {
        var amountofarticles = result.length;
		for(i=0;amountofarticles>i;i++){
		var music = result[i].file
		resultarray.push(
			"../songs/" + music
		);
		}
		console.log(resultarray);
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
	var volume = $('<i></i>').attr({"class":"material-icons","onclick":"volume()","id":"volume","name":"sliderhide"});
	volume.text("volume_up");
	$('#footer').append(repeat);
	$('#footer').append(slider);
	$('#footer').append(volume);
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
	document.title = resultarray[song].replace("../songs/", "").replace(".mp3","") + " | Festplayer"
	audiojs.instances.audiojs0.load(window.resultarray[song]);
	if(audiojs.instances.audiojs0.playing = true){
		audiojs.instances.audiojs0.playPause()
	}
	audiojs.instances.audiojs0.playPause()
	$('.song')[song].setAttribute("style", "filter: invert(1)");
	$('.song')[song].setAttribute("name","selected");
}}

function repeat(){
	if(document.getElementById("repeat").getAttribute("name") == "norepeat"){
		document.getElementById("repeat").setAttribute("name", "repeat-one");
		audiojs.instances.audiojs0.element.loop = true;
	} else if(document.getElementById("repeat").getAttribute("name") == "repeat-one"){
		document.getElementById("repeat").setAttribute("name", "norepeat");
		audiojs.instances.audiojs0.element.loop = false;
	}
}

function volume(){
	if(document.getElementById("volume").getAttribute("name") == "slidershow"){
		document.getElementById("vol-control").setAttribute("style","display:none");
		document.getElementById("volume").setAttribute("name","sliderhide")
	} else if (document.getElementById("volume").getAttribute("name") == "sliderhide"){
		document.getElementById("vol-control").setAttribute("style","display:block");
		document.getElementById("volume").setAttribute("name","slidershow")
	}
}

function setVolume(svolume){
	$("audio")[0].volume = svolume/100
}

(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);

function remotecontrol(){
	if(audiojs.instances.audiojs0.playing){
		audiojs.instances.audiojs0.playPause()
	}
	if(jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "remote"){
		document.getElementById("remote").setAttribute("name","clicked")
		$("#mainpage").hide();
		$("#remotepagemobile").attr("style","display:flex;");
	} else if(!jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "remote"){
		// WIP
	} else if(jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "clicked"){
		document.getElementById("remote").setAttribute("name","remote")
		$("#remotepagemobile").hide();
		$("#mainpage").show();
	} else if(!jQuery.browser.mobile && document.getElementById("remote").getAttribute("name") == "clicked"){
		// WIP
	}
}
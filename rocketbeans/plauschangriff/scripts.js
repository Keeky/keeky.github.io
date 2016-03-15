
$(document).ready(function(){

	FastClick.attach(document.body);
	
	$.jPlayer.timeFormat.showHour = true;

	$(window).bind('beforeunload', function(){
		if($('body').hasClass('jp-state-playing'))
			return 'Der Podcast wird unterbrochen wenn du die Seite jetzt verlässt.';
	});

	var xmlUrl = 'http://www.rocketbeans.tv/plauschangriff.xml',
	player = $('#jquery_jplayer_1'),
	playerData,
	podcastArray,
	playlist,
	shuffled,
	options = {
		loadeddata: function(event) {
			$('.jp-remaining-time').text('-' + $.jPlayer.convertTime(event.jPlayer.status.duration));
		},
		timeupdate: function(event) {
			var status = event.jPlayer.status,
			remaining = status.duration - status.currentTime;
			controls.progress.slider("value", status.currentPercentAbsolute);
			$('.jp-remaining-time').text('-' + $.jPlayer.convertTime(remaining));
		},
		volumechange: function(event) {
			if(event.jPlayer.options.muted) {
				controls.volume.slider("value", 0);
			} else {
				controls.volume.slider("value", event.jPlayer.options.volume);
			}
		},
		supplied: "mp3",
		smoothPlayBar: true,
		useStateClassSkin: true,
		verticalVolume: true,
		timeFormat: {
			showHour: true
		},
		playlistOptions: {
			displayTime: 0,
			addTime: 0,
			removeTime: 0,
			shuffleTime: 0
		},
		cssSelectorAncestor: 'body'
	},
	controls = {
		progress: $('.jp-progress-slider'),
		volume: $('.jp-volume-slider')
	}

	$('.shuffle').on('click', function() {
		playlist.shuffle();
		(playlist.shuffled) ? $('body').addClass('jp-state-shuffled') : $('body').removeClass('jp-state-shuffled');
	})

	player.jPlayer(options);

	playerData = player.data('jPlayer');

	// Create the progress slider control
	controls.progress.slider({
		animate: "fast",
		max: 100,
		range: "min",
		step: 0.1,
		value : 0,
		slide: function(event, ui) {
			var sp = playerData.status.seekPercent;
			if(sp > 0) {
				// Move the play-head to the value and factor in the seek percent.
				player.jPlayer("playHead", ui.value * (100 / sp));
			} else {
				// Create a timeout to reset this slider to zero.
				setTimeout(function() {
					controls.progress.slider("value", 0);
				}, 0);
			}
		}
	});

	// Create the volume slider control
	controls.volume.slider({
		animate: "fast",
		max: 1,
		range: "min",
		orientation: "vertical",
		step: 0.01,
		value : $.jPlayer.prototype.options.volume,
		slide: function(event, ui) {
			player.jPlayer("option", "muted", false);
			player.jPlayer("option", "volume", ui.value);
		}
	});

	function filterData(data){
		data = data.replace(/<?\/body[^>]*>/g,'');
		data = data.replace(/[\r|\n]+/g,'');
		data = data.replace(/<--[\S\s]*?-->/g,'');
		data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g,'');
		data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g,'');
		data = data.replace(/<script.*\/>/,'');
		return data;
	}

	$.getJSON("http://query.yahooapis.com/v1/public/yql?" +
		"q=select%20*%20from%20html%20where%20url%3D%22" +
		encodeURIComponent(xmlUrl)+
		"%22&format=json'&callback=?",
		function(data){
			if(data.results[0]){
				//data = filterData(data.results[0]);
				var result = $.xml2json(data.results[0]);
				var podcasts = result.rss.channel.subtitle.image.item;
				//console.log(result, podcasts);

				playlist = new jPlayerPlaylist({
					jPlayer: "#jquery_jplayer_1",
					cssSelectorAncestor: 'body'
				}, false, options);

				for (var id = podcasts.length - 1; id >= 0; id--) {
					var podcast = podcasts[id];
					//console.log(id, podcast.enclosure, podcast.summary);

					if(podcast.enclosure)
						var data = podcast.enclosure;

					if(podcast.summary.enclosure)
						var data = podcast.summary.enclosure;

					playlist.add({
						title: podcast.toString() + ' - ' + podcast.subtitle,
						mp3: data.url
					});

					// $('#podcasts').append(
					// '<a id="podcast-'+id+'" data-podcast-url="'+podcast.data.url+'" data-media-type="'+podcast.data.type+'" data-podcast-id="'+id+'" class="podcast">' +
					// 	'<h1>'+podcast+'</h1>' +
					// 	'<h2>'+podcast['subtitle']+'</h2>' +
					// 	'<span class="metadata">' +
					// 		'<span class="date">' + podcast.data.pubdate + '</span>' +
					// '</a>'
					// )
				};
			} else {
				var errormsg = '<p>Fehler beim Laden der Daten.</p>';
				$('html').html(errormsg);
			}
		}
	);

	$(document).on('click', '.jp-playlist-item', function() {
		ga('send', 'event', 'plauschangriff', 'loadPodcast', $(this).text());
	})
	
});

$(document).ready(function(){

	FastClick.attach(document.body);
	
	$.jPlayer.timeFormat.showHour = true;

	$(window).bind('beforeunload', function(){
		if($('body').hasClass('jp-state-playing'))
			return 'Der Podcast wird unterbrochen wenn du die Seite jetzt verlässt.';
	});

	var urls = {
		"almost-daily": 'http://www.rocketbeans.tv/almost_daily.xml',
		"plauschangriff": 'http://www.rocketbeans.tv/plauschangriff.xml',
		"bohndesliga": 'http://www.rocketbeans.tv/bohndesliga.xml',
		"press-select": 'http://www.rocketbeans.tv/press_select.xml'
	},
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

	function loadPodcastsFromUrl(xmlUrl) {
		$('html').addClass('podcast-loading');

		$.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%22" + encodeURIComponent(xmlUrl) + "%22&format=json", function(data){
			$('html').removeClass('podcast-loading');

			if(data.query.results.item){

				var podcasts = data.query.results.item;

				playlist = new jPlayerPlaylist({
					jPlayer: "#jquery_jplayer_1",
					cssSelectorAncestor: 'body'
				}, false, options);

				for (var id = podcasts.length - 1; id >= 0; id--) {
					var podcast = podcasts[id];

					playlist.add({
						title: 'Episode #' + (id + 1) + ' - ' + podcast.title,
						mp3: podcast.enclosure.url
					});
				};
			} else {
				var errormsg = '<p>Fehler beim Laden der Daten.</p>';
				$('html').html(errormsg);
			}
		})
	}

	function hashUpdate() {
		var hash = document.location.hash.slice(1);
		console.log(hash, urls[hash]);
		var activeCast = 'plauschangriff';
		if(urls[hash])
			activeCast = urls[hash];

		$('.active-podcast').removeClass('active-podcast');
		console.log('a[href="#' + hash + '"]', $('a[href="#' + hash + '"]'))
		$('a[href="#' + hash + '"]').addClass('active-podcast');
		loadPodcastsFromUrl(activeCast);
	}

	hashUpdate();

	$(window).on('hashchange', function() {
		hashUpdate();
	})

	$(document).on('click', '.jp-playlist-item', function() {
		ga('send', 'event', 'plauschangriff', 'loadPodcast', $(this).text());
	})
	
});
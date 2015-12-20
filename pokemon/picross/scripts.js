

//Properties
var properties = {
	scale:20,
	canvasWidth:10,
	canvasHeight:10,
	world:false,
	level:false,
	grid:true,
	levelLoaded:false
};

function seedFromString (string) {
	var hash = 0, i, chr, len;
	if (string.length === 0)
		return false;
	for (i = 0, len = string.length; i < len; i++) {
		chr   = string.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

function randomPixel (seed) {
	if(!$('html').hasClass('anim'))
		return 'transparent';
	//var min = 80;
	//var max = 95;
	var min = 0;
	var max = 0.3;
	var offset = min + (((seed * 9301 + 49297) % 233280) / 233280) * (max - min);

	//console.log(offset);

	//return 'hsl(199, 90%, '+offset+'%)';

	return 'rgba(255, 255, 255, '+offset+')';
}

var navigation = '';
var quickSelect = '';

$.each(solutions, function(world, worldData) {
	navigation += '<a class="world" href="#" data-world="' + world + '">World '+ (world + 1) + '</a>';
	quickSelect += '<a class="world" href="#" data-world="' + world + '">'+ (world + 1) + '</a>';
	navigation += '<div id="stages-' + world +'" class="world-levels">';
	//console.log(world, worldData);

	$.each(worldData, function(level, levelData) {
		navigation += '<a href="#" class="level" data-world="' + world + '" data-level="' + level + '">' + (world + 1) + '-' + (level + 1) + '</a>';
	});

	navigation += '</div>';
});

$(document).ready(function(e) {
	//Check for JS
	$('body').removeClass('js-off').addClass('js-on');
	$('.js-only').show();
	$('.no-js').hide();

	$('#levels').html(navigation);

	$('#quick-select').html(quickSelect);
	
	//Update functions
	var update = {
		document: {
			info: function(world, level) {
				$('#name').text(solutions[properties.world][properties.level].name);
				$('#type').text(solutions[properties.world][properties.level].type);
				$('#stage').text((properties.world + 1) + '-' + (properties.level + 1));
				$('#size').text(properties.canvasWidth + 'x' + properties.canvasHeight);
				$('html').attr('data-style', solutions[properties.world][properties.level].type.toLowerCase());
				var title = '';
				if(properties.levelLoaded === true) {
					title += 'Level ' + (properties.world + 1) + '-' + (properties.level + 1)
					title +=  ' ' + solutions[properties.world][properties.level].name;
					title += ' | ';
				}
				title += 'Pokemon Picross Solutions';
				document.title = title;
			}
		},

		canvas: {
			initialize: function(pageLoad){
				if(properties.levelLoaded === false) {
					update.canvas.size();
					update.canvas.grid();
					$('#description').hide();
					$('#solution-wrapper').fadeIn(250);
					$('#controls-toggle').slideDown();
					properties.levelLoaded = true;
				}
			},

			unload: function() {
				$('#solution-wrapper').hide();
				$('#controls').slideUp();
				$('#controls-toggle').slideUp();
				$('#description').fadeIn(250);
				$('html').attr('data-style', '');
				properties.levelLoaded = false;
			},

			zoom: function(zoom) {
				properties.scale = 20 * (zoom / 20);
				if(properties.levelLoaded)
					update.canvas.drawLevel();
			},

			size: function(){
				$('#solution').width(properties.canvasWidth * properties.scale);
				$('#solution').height(properties.canvasHeight * properties.scale);
				canvas.width = properties.canvasWidth * properties.scale;
				canvas.height = properties.canvasHeight * properties.scale;
			},

			draw: function(x, y, rgba){
				if(rgba)
					context.fillStyle = rgba;
				else
					context.fillStyle = '#000';

				//console.log((Math.floor(x / properties.scale) * properties.scale));
				context.fillRect(x * properties.scale, y  * properties.scale, properties.scale, properties.scale);
			},

			grid: function(){
				if(properties.grid === true) {
					var gridWidth = properties.canvasWidth;
					var gridHeight = properties.canvasHeight;

					var gridMax = Math.max(gridHeight, gridWidth);

					//console.log(gridMax);

					var lineDirection = 'horizontal';
					var lineX = 0;
					var lineY = 0;
					var lineWidth = 1;
					var lineHeight = 1;

					for (var i = gridMax - 1; i >= 1; i--) {

						if(lineDirection == 'horizontal') {
							lineWidth = gridMax * properties.scale;
							lineHeight = 0.5;
							lineX = i * properties.scale;
							lineY = 0;
						}

						if(lineDirection == 'vertical') {
							lineWidth = 0.5;
							lineHeight = gridMax * properties.scale;
							lineX = 0;
							lineY = i * properties.scale;
						}

						if(i % 5 == 0) {
							context.fillStyle = '#FB9105';

							if(lineDirection == 'horizontal') {
								lineHeight = 1.5;
							}

							if(lineDirection == 'vertical') {
								lineWidth = 1.5;
							}
						} else
							context.fillStyle = '#888';

						context.fillRect(lineX, lineY, lineHeight, lineWidth);

						//console.log('(' + lineDirection + ' ' + i + ') - ' + '(' + lineX + ':' + lineY + ') - ' + lineWidth + 'x' + lineHeight);

						if(i == 1 && lineDirection == 'horizontal') {
							lineDirection = 'vertical';
							i = gridMax;
						}
					};
				}
			},

			drawLevel: function () {
				if(properties.levelLoaded) {
					var solution = solutions[properties.world][properties.level];
					//console.log(solution.matrix.length);

					properties.canvasWidth = solution.matrix[0].length;
					properties.canvasHeight = solution.matrix.length;

					var seed = seedFromString(solution.name);

					update.canvas.size();


					$.each(solution.matrix, function(key, value) {
						$.each(value, function (k, v) {
							//console.log(key + ':' + k + ' - ' + v);

							if(v)
								update.canvas.draw(k, key);
							else
								update.canvas.draw(k, key, randomPixel(k * key * seed));
						})
					})

					update.canvas.grid();
				}
			}
		}
	};
	
	//Initialize canvas
	var canvas = document.getElementById('solution');
	var context = canvas.getContext('2d');

	$(document).on('click', '.level', function(e){
		e.preventDefault();

		if(properties.levelLoaded === true)
			update.canvas.initialize();

		context.clearRect(0, 0, canvas.width, canvas.height);

		properties.world = $(this).data('world');
		properties.level = $(this).data('level');

		document.location.hash =  (properties.world + 1) + '/' + (properties.level + 1);

		update.canvas.drawLevel();
		update.document.info();
		
		$('#mobile-nav-toggle').text() == 'Select level' ? $('#mobile-nav-toggle').text('Close menu') : $('#mobile-nav-toggle').text('Select level');
	
		setTimeout(function() {
			$('html').removeClass('nav-active');
		}, 50);
	})

	$(document).on('click', '#levels .world', function(e) {
		e.preventDefault();

		$('html').toggleClass('qs');

	})

	$(document).on('click', '#quick-select .world', function(e) {
		e.preventDefault();

		$('html').toggleClass('qs');

		var targetWorld = $(this).data('world');
		ga('send', 'event', 'picrossSolutions', 'worldClick', targetWorld);
		var targetStages = $('#levels .world[data-world="' + targetWorld + '"]');
		var targetOffset = targetStages.offset().top + $('#world-select').scrollTop() - $('#world-select').offset().top;
		//console.log(targetStages, targetOffset);
		if($('html').hasClass('anim'))
			$('#world-select').animate({scrollTop: targetOffset}, 500);
		else
			$('#world-select').scrollTop(targetOffset);
	})

	$('#zoom').on('change', function() {
		update.canvas.zoom($(this).val());
	}).on('change mousemove touchmove', function() {
		$('#zoom-level').text('x' + (
			Math.round(($(this).val() / 2) * 100) / 100
		).toFixed(2))
	})

	$('#grid').click(function() {
		properties.grid = !properties.grid;
		update.canvas.drawLevel();
	})

	$('#bg').click(function() {
		$('html').toggleClass('bgs');
	})

	$('#anim').click(function() {
		$('html').toggleClass('anim');
		update.canvas.drawLevel();
	})

	$('#supp').click(function() {
		$('html').toggleClass('supp');
	})

	$('#controls-toggle').click(function() {
		$(this).text() == 'Show options' ? $(this).text('Hide options') : $(this).text('Show options');
		if($('html').hasClass('anim'))
			$('#controls').slideToggle();
		else
			$('#controls').toggle();
	})

	$('.toggle').click(function() {
		$(this).toggleClass('active');
		ga('send', 'event', 'picrossSolutions', 'optionsToggle', $(this).attr('id') + ' - ' + $(this).hasClass('active'));
	})

	$('#mobile-nav-toggle').click(function(e) {
		$(this).text() == 'Select level' ? $(this).text('Close menu') : $(this).text('Select level');
		e.preventDefault();
		$('html').toggleClass('nav-active');
	})

	$('#zoom').val('20');

	function hashChange () {
		var hash = document.location.hash.substr(1).split('/');

		if(hash[0] && hash[1]) {
			properties.world = hash[0] - 1;
			properties.level = hash[1] - 1;
			update.canvas.initialize();
			update.canvas.drawLevel();
			update.document.info();
		} else
			update.canvas.unload();

		ga('send', 'event', 'picrossSolutions', 'levelLoaded', (properties.world + 1) + '-' + (properties.level + 1));
	}

	if(document.location.hash) {
		hashChange()
	}

	if("onhashchange" in window) {
		$(window).bind('hashchange', function() {
			hashChange()
		})
	}

	$('#toggle-support').click(function(e) {
		e.preventDefault();
		$('#support-options').stop().slideToggle();
		ga('send', 'event', 'picrossSolutions', 'supportWrapperToggle', $('#support-options').is(':visible'));
	})

	$('.paypal-button').click(function(e) {
		ga('send', 'event', 'picrossSolutions', 'supportOptionClicked', 'paypalButton');
	})

	$('#amazon-links .link').click(function(e) {
		ga('send', 'event', 'picrossSolutions', 'supportOptionClicked', 'amazon "' + $('.name', this).text() + '"');
	})
});
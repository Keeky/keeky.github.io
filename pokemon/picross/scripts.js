var defaultOptions = {
	grid: {
		value: true,
		htmlClass: false
	},
	supp: {
		value: true,
		htmlClass: true
	},
	anim: {
		value: true,
		htmlClass: true
	},
	bgs: {
		value: true,
		htmlClass: true
	},
	names: {
		value: false,
		htmlClass: true
	}
};

var options = {
	data: $.extend(true, {}, defaultOptions),
	save: function() {
		try {
			localStorage.setItem('picrossSolutionsOptions', JSON.stringify(options.data));
		} catch(e) {
			return false;
		}
	},
	load: function() {
		try {
			if(localStorage.getItem('picrossSolutionsOptions')) {
				console.log(localStorage.getItem('picrossSolutionsOptions'));
				var localOptions = JSON.parse(localStorage.getItem('picrossSolutionsOptions'));
				options.data = $.extend(true, {}, localOptions);
				for (var option in localOptions) { options.data[option] = localOptions[option]; }
			} else
				options.save();
		} catch(e) {
			options.data = $.extend(true, {}, defaultOptions);
		}
		$.each(options.data, function(key, data) {
			//console.log('Loading ---', key, data);
			options.update(key);
		});
	},
	update: function(key) {
		if(options.data[key].htmlClass === true && options.data[key].value === true) {
			$('html').addClass(key);
		} else {
			$('html').removeClass(key);
		}

		if(options.data[key].value === true) {
			$('.toggle[data-opt='+key+']').addClass('active');
		} else {
			$('.toggle[data-opt='+key+']').removeClass('active');
		}
	},
	toggle: function(key) {
		var val = false;

		if(options.data[key].value)
			options.data[key].value = !options.data[key].value;
		else
			options.data[key].value = true;

		options.update(key);
		options.save();
	},
	reset: function() {
		options.data = $.extend(true, {}, defaultOptions);
		options.save();
		options.load();
	}
};

//Default properties
var properties = {
	scale:20,
	canvasWidth:10,
	canvasHeight:10,
	area:false,
	level:false,
	grid:true,
	levelLoaded:false
};

//Generates a random number with a string as seed
function seedFromString (string) {
	var hash = 0, i, chr, len;
	if (string.length === 0)
		return false;
	for (i = 0, len = string.length; i < len; i++) {
		chr   = string.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

//Generates a random opacity pixel using a seed from seedFromString. If effects are enabled this will make the background of the canvas less bland because every transparent pixel will look slightly different.
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

var navigation = '', quickSelect = '';

//Generates the navigation and the area quick select with the data from levels.js
$.each(solutions, function(area, areaData) {
	navigation += '<a class="area" href="#" data-area="' + area + '">Area '+ (area + 1) + '</a>';
	quickSelect += '<a class="area" href="#" data-area="' + area + '">'+ (area + 1) + '</a>';
	navigation += '<div id="stages-' + area +'" class="area-levels">';
	//console.log(area, areaData);

	$.each(areaData, function(level, levelData) {
		navigation += '<a href="#" class="level" data-area="' + area + '" data-level="' + level + '"><span class="level-number">' + (area + 1) + '-' + (level + 1) + '</span><span class="level-name"> - ' + levelData.name + '</span></a>';
	});

	navigation += '</div>';
});

$(document).ready(function(e) {
	//Check for JS
	$('body').removeClass('js-off').addClass('js-on');
	$('.js-only').show();
	$('.no-js').hide();

	options.load();

	properties.grid = options.data.grid.value;

	$('#levels').html(navigation);

	$('#quick-select').html(quickSelect);

	FastClick.attach(document.body);
	
	//Update functions
	var update = {
		document: {
			//Updates stuff like the box below the canvas and the document title
			info: function(area, level) {
				$('#name').text(solutions[properties.area][properties.level].name);
				$('#type').text(solutions[properties.area][properties.level].type);
				$('#stage').text((properties.area + 1) + '-' + (properties.level + 1));
				$('#size').text(properties.canvasWidth + 'x' + properties.canvasHeight);
				$('html').attr('data-style', solutions[properties.area][properties.level].type.toLowerCase());
				var title = '';
				if(properties.levelLoaded === true) {
					title += 'Level ' + (properties.area + 1) + '-' + (properties.level + 1);
					title +=  ' ' + solutions[properties.area][properties.level].name;
					title += ' | ';
				}
				title += 'Pokemon Picross Solutions';
				document.title = title;
			}
		},

		canvas: {
			//Displays canvas and hides the 'welcome' box
			initialize: function(pageLoad){
				if(properties.levelLoaded === false) {
					update.canvas.size();
					update.canvas.grid();
					$('#description').hide();
					if(options.data.anim.value === true) {
						$('#solution-wrapper').fadeIn(250);
						$('#controls-toggle').slideDown();
					} else {
						$('#solution-wrapper').show();
						$('#controls-toggle').show();
					}
					properties.levelLoaded = true;
				}
			},

			//Does the same as initialize, but reversed
			unload: function() {
				$('#solution-wrapper').hide();
				if(options.data.anim.value === true) {
					$('#controls').slideUp();
					$('#controls-toggle').slideUp();
					$('#description').fadeIn(250);
				} else {
					$('#controls').hide();
					$('#controls-toggle').hide();
					$('#description').show();
				}
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

						if(i % 5 === 0) {
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
					}
				}
			},

			drawLevel: function () {
				if(properties.levelLoaded) {
					var solution = solutions[properties.area][properties.level];
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
						});
					});

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

		properties.area = $(this).data('area');
		properties.level = $(this).data('level');

		document.location.hash =  (properties.area + 1) + '/' + (properties.level + 1);

		update.canvas.drawLevel();
		update.document.info();
		
		$('#mobile-nav-toggle').text() == 'Select level' ? $('#mobile-nav-toggle').text('Close menu') : $('#mobile-nav-toggle').text('Select level');
	
		setTimeout(function() {
			$('html').removeClass('nav-active');
		}, 50);
	});

	$(document).on('click', '#levels .area', function(e) {
		e.preventDefault();

		$('html').toggleClass('qs');

	});

	$(document).on('click', '#quick-select .area', function(e) {
		e.preventDefault();

		$('html').toggleClass('qs');

		var targetArea = $(this).data('area');
		ga('send', 'event', 'picrossSolutions', 'areaClick', targetArea);
		var targetStages = $('#levels .area[data-area="' + targetArea + '"]');
		var targetOffset = targetStages.offset().top + $('#area-select').scrollTop() - $('#area-select').offset().top;
		//console.log(targetStages, targetOffset);
		if($('html').hasClass('anim'))
			$('#area-select').animate({scrollTop: targetOffset}, 500);
		else
			$('#area-select').scrollTop(targetOffset);
	});

	$('#zoom').on('change', function() {
		update.canvas.zoom($(this).val());
	}).on('change mousemove touchmove', function() {
		$('#zoom-level').text('x' + (
			Math.round(($(this).val() / 2) * 100) / 100
		).toFixed(2));
	});

	$('#grid').click(function() {
		properties.grid = !properties.grid;
		update.canvas.drawLevel();
	});

	$('.toggle').click(function() {
		var opt = $(this).attr('data-opt');

		options.toggle(opt);

		ga('send', 'event', 'picrossSolutions', 'options', opt + ' - ' + options.data[opt].value);
	});

	$('#anim').click(function() {
		update.canvas.drawLevel();
	});

	$('#reset-options').click(function(e) {
		e.preventDefault();
		options.reset();
		properties.grid = options.data.grid.value;
		update.canvas.drawLevel();
	})

	function toggleControls () {
		var toggleButton = $('#controls-toggle');
		toggleButton.text() == 'Show options' ? toggleButton.text('Hide options') : toggleButton.text('Show options');
		if($('html').hasClass('anim'))
			$('#controls').slideToggle();
		else
			$('#controls').toggle();
	}

	$('#controls-toggle').click(function() {
		toggleControls();
	});

	$('#mobile-nav-toggle').click(function(e) {
		$(this).text() == 'Select level' ? $(this).text('Close menu') : $(this).text('Select level');
		e.preventDefault();
		$('html').toggleClass('nav-active');
	});		

	$('body').click(function(e) {
		if($(e.target).closest('#controls-wrapper').length === 0 && $('#controls').is(':visible'))
			toggleControls();
		if($(e.target).closest('#area-select, #mobile-nav-toggle').length === 0)
			$('html').removeClass('nav-active');
	})

	$('#zoom').val('20');

	function hashChange () {
		var hash = document.location.hash.substr(1).split('/');

		if(hash[0] && hash[1]) {
			properties.area = hash[0] - 1;
			properties.level = hash[1] - 1;
			update.canvas.initialize();
			update.canvas.drawLevel();
			update.document.info();
		} else
			update.canvas.unload();

		ga('send', 'event', 'picrossSolutions', 'levelLoaded', (properties.area + 1) + '-' + (properties.level + 1));
	}

	if(document.location.hash) {
		hashChange();
	}

	if("onhashchange" in window) {
		$(window).bind('hashchange', function() {
			hashChange();
		});
	}

	$('#toggle-support').click(function(e) {
		e.preventDefault();
		if(!$('#support-options').is(':visible'))
			var scrollToSupport = true;
		$('#support-options').stop().slideToggle();
		if(scrollToSupport)
			$('html, body').animate({scrollTop: $("#support-options").offset().top}, 500);
		ga('send', 'event', 'picrossSolutions', 'supportWrapperToggle', $('#support-options').is(':visible'));
	});

	$('.paypal-button').click(function(e) {
		ga('send', 'event', 'picrossSolutions', 'supportOptionClicked', 'paypalButton');
	});

	$('#amazon-links .link').click(function(e) {
		ga('send', 'event', 'picrossSolutions', 'supportOptionClicked', 'amazon "' + $('.name', this).text() + '"');
	});
});
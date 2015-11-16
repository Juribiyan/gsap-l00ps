var defaultPattern = "__JJJJJJJJ__|_JJJJJJJJJJ_|JJjjjjjjjJJJ|JJjjjjjjJJJJ|JJjjjjjJJjJJ|JJjjjjjJJjJJ|JJjjjjJJjjJJ|JJjjjjJJjjJJ|JJjjjJJjjjJJ|JJjjjJJjjjJJ|JJjjJJjjjjJJ|JJjjJJjjjjJJ|JJjJJjjjjjJJ|JJjJJjjjjjJJ|JJJJjjjjjjJJ|JJJjjjjjjjJJ|_JJJJJJJJJJ_|__JJJJJJJJ__";

var urlprefix = "loops/";
var fileFormat = (function() {
	var testAudio  = document.createElement("audio");
	return (typeof testAudio.canPlayType === "function" && testAudio.canPlayType("audio/ogg") !== "")
})() ? 'ogg' : 'mp3';


function readyset() {
	$canvas = $('#bars');
	drawContext = $canvas[0].getContext('2d');

	bufferCanvas = $('#bufferCanvas')[0];
	bufferContext = bufferCanvas.getContext('2d');
	
	
	/*if(document.location.hash) 
		pattern = decodeURIComponent(document.location.hash.split('#')[1]);*/
	
	Grid.init('#nullgrid');

	$('body *').mousedown(function() {
		isMouseDown = true;
	})
	.on('mouseup dragend', function() {
		isMouseDown = false;
	})

	// fill the swatches
	$('#fixed-palette .swatch').each(function() {
		var c = $(this).data('c');
		$(this).replaceWith(Grid.generateCell(c, 'under').addClass('swatch').data('act', 'swatch').attr('id', 'swatch-'+c));
	});

	// buttons
	$('body')
	.on('click', '.action-button', function(ev) {
		actions[$(this).data('act')](ev);
	})
	.on('click', '.tool', function() {
		$('.tool').removeClass('selected');
		$(this).addClass('selected');
		brush.mode = $(this).data('tool');
	})
	.on('click', '.swatch', function() {
		$('.swatch').removeClass('selected');
		if($(this).data('c')) {
			$(this).addClass('selected');
			brush.color = $(this).data('c');
			$('[data-tool="draw"]').click();
		}
	});
	$('#colorpicker').on('change', function() {
		brush.color = '#'+$(this).val();
		brush.mode = 'draw';
		$(this).addClass('selected');
		$('[data-tool="draw"]').click();
	});

	// nerdmode inputs
	updateRanges();
	$('.nm-block input[type=range]').on('input', function() {
		var prop = $(this).attr('name');
		if(prop === 'fft_size') {
			conf[prop] = Math.pow(2, $(this).val());
			try {
				visualizer.analyser.fftSize = conf.fft_size;
				$('label[for=fft_size] .indicator').removeClass('illegal')
			}
			catch(e) {
				$('label[for=fft_size] .indicator').addClass('illegal')
			}
		}
		else
			conf[prop] = +$(this).val();
		updateRanges(prop);
	});
	$('.nm-block input[name="domain"]').change(function() {
		conf.domain = $(this).val();
		if(conf.domain === 'time') {
			$('#smoothingBlock').addClass('disabled');
			var $range = $('input[name=treshold]');	
			if($range.val() < 0.5) {
				conf.treshold = 0.5;
				updateRanges('treshold')
			}
			$range.attr('min', 0.5);
		}
		else {
			$('#smoothingBlock').removeClass('disabled');
			$('input[name=treshold]').attr('min', 0);
		}
	})

	$('#enterNerdmode').click(function() {
		$('#nerdmode').slideToggle('fast');
	})

	document.querySelector('body').addEventListener('dragover', handleDragOver, false);
	document.querySelector('body').addEventListener('drop', handleFileDrop, false);

	document.querySelector('#bufferFileInput').addEventListener('change', handleFileInput, false);

	document.querySelector('#overlays').addEventListener('touchmove', function(ev) {
		_.each(ev.targetTouches, function(touch) {
			var el = document.elementFromPoint(touch.pageX, touch.pageY);
			if(el.hasOwnProperty('_tl'))
				el._tl.progress(0)
		})
	}, false)

	$.getJSON('upload.php?check')
	.done(function(data) {
		upconf = data;
	})
	.fail(function(err) {
		console.log(err)
	});

	/*Password reveal*/
	$('.password-reveal').on('mousedown', function() {
		$(this).parent().find('.delpass').attr('type', 'text')
	})
	.on('mouseleave mouseup', function() {
		$(this).parent().find('.delpass').attr('type', 'password')
	});

	/* Input validation */
	$('.validable').on('input', function() {
		if(validations[$(this).data('tovalid')]($(this).val())) 
			$(this).removeClass('invalid')
		else 
			$(this).addClass('invalid');
		validateForm($(this).parents('form'), true);
	});

	/* Captcha update */
	$('.captcha').click(function() {
		updateCaptcha($(this).parents('.captchablock'));
	})

	/* Error box close */
	$('.pop-message .i-x-large').click(errBox.closeWithBtn);

	/* Loop panel close */
	$('#loop-upload .panel-close').click(loopEditor.hide.bind(loopEditor));

	/* Loop upload form */
	$('#loop-upload form').on('submit', function(ev) {
		ev.preventDefault();
		setLineHeightAsParentHeight($('#loop-upload .hijab'));
		$('#loop-upload .panel').addClass('p-busy');
		var action = 'add';
		if($('#loop-upload form').hasClass('action-edit')) 
			action = 'edit';
		if($('#loop-upload form').hasClass('action-delete')) 
			action = 'delete';
		
		/* Make XHR2 */
		var fd = new FormData();
		fd.append('action', action);
		fd.append('datatype', 'loop');
		fd.append('delpass', $("#loop-upload .delpass").val());
		fd.append('captcha', $("#loop-upload .captchainput").val());

		if(is_admin)
			fd.append('is_admin', 1);

		if(action !== 'delete') {
			fd.append('name', $("#loop-upload .filename").val());
			fd.append('treshold_correction', $('#userTresholdCorrection input').val());

			if($('#assoc_pattern').is(':checked'))
				fd.append('associated_pattern', $('#pattern-toassoc').val());

			if(is_admin) {
				fd.append('is_admin', 1);
				var date = $('#loop-date').val();
				if(date) {
					var time = $('#loop-time').val() || '00:00:00';
					date = date + ' ' + time;
				}
				if(date)
					fd.append('date', date);
				if($("#loop-swf").val())
					fd.append('swf', $("#loop-swf").val());
				fd.append('section', $("#loop-section").val());
			}
		}
		
		if(action === 'add') {
			if(!currentCustomTrack.blob) {
				errBox.pop($('#loop-upload'), "Файл отсутствует");
				$('#loop-upload .panel').removeClass('p-busy');
				return 
			}
			if(currentCustomTrack.blob.size / 1024 > upconf.max_loop_fszkb) {
				$('#loop-upload .panel').removeClass('p-busy');
				errBox.pop($('#loop-upload'), 'Превышен максимальный размер файла ('+upconf.max_loop_fszkb/1024+' МБ).');
				return
			}
			fd.append('loop', currentCustomTrack.blob);
		}

		else {
			fd.append('original_hash', loopEditor.rawData.original_hash);
		}

		if(action === 'edit')
			fd.append('take_ownership', $('#loop_take_ownership').is(':checked'));
					
		var request = new XMLHttpRequest();
		request.open("POST", "upload.php");
		request.send(fd);

		request.onload = function(e) {
			$('#loop-upload .panel').removeClass('p-busy');
			if(this.status == 200) {
				try {
					var res = JSON.parse(this.response);
					if(res.error) {
						if(res.errtype === 'prompt_edit') {
							try {
								var data = JSON.parse(res.extra_data);
								loopEditor.prepareEdit(data);
								errBox.pop($('#loop-upload'), _.escape(res.msg)+' <a href="javascript:loopEditor.edit();">Отредактировать луп «'+_.escape(data.name)+'»</a>?', 'prompt', 'raw');
							}
							catch(e) {
								errBox.pop($('#loop-upload'), 'Неожиданный ответ сервера. Подробности в консоли.');
								console.log(e);
							}
						}
						else {
							errBox.pop($('#loop-upload'), res.msg);
						}
					}
					else {
						var _lib = (res.loop.section !== 'custom') ? 'default' : 'custom';
						// save password
						var dp = $("#loop-upload .delpass").val();
						localStorage["loop_pass"] = dp;
						if(!localStorage["pattern_pass"]) {
							$("#pattern-share .delpass").val(dp);
							localStorage["pattern_pass"] = dp;
						}
						/* LOOP XHR RESULTS */ 
						if(res.success === 'loop_add' && res.hasOwnProperty('loop')) {
							loopLibs[_lib].add(res.loop);
							loopEditor.hide();
						}
						if(res.success === 'loop_edit') {
							var lib_move = false;
							if(res.loop.hasOwnProperty('section_from'))  {
								var lib_from = (res.loop.section_from !== 'custom') ? 'default' : 'custom';
								if(lib_from !== _lib) 
									lib_move = true;
							}
							if(lib_move) {
								loopLibs[lib_from].del(res.loop.original_hash, res.loop.section_from);
								loopLibs[_lib].add(res.loop);
							}
							else
								loopLibs[_lib].edit(res.loop);

							_.each(res.changes, function(item, ix) {res.changes[ix] = _.escape(item)});
							errBox.pop($('#loop-upload'), res.changes.join(';<br>'), 'success', 'raw');
							loopEditor.unedit();
						}
						if(res.success === 'loop_delete') {
							loopLibs[_lib].del(res.loop.original_hash, res.loop.section);
							errBox.pop($('#loop-upload'), "Луп удален.", 'success');
							loopEditor.undel();
						}

						$('#loop-library').addClass('open-lib');
						$('#ltab-'+_lib).click();

						$("#loop-upload .filename").val('').trigger('input');
					}
				}
				catch(e) {
					if(e.name == 'SyntaxError') {
						errBox.pop($('#loop-upload'), 'Неожиданный ответ сервера. Подробности в консоли.');
						console.error(this.response);
					}
					else throw e;
				}
				updateCaptcha($("#loop-upload .captchablock"));
			}
			else {
				errBox.pop($('#loop-upload'), 'Ошибка XHR. Подробности в консоли.');
				console.error(e);
			}
		}
	});

	/* Loop library */
	$.getJSON('custom_loops.json?'+Math.random())
	.done(function(data) {
		loopLibs.custom = new TrackList(data, '#custom-loops', 'custom', true, $('#ltab-custom i.sorter'), 'date', 'desc', true, $('#ltab-custom i.play-enabler'));
	})
	.fail(console.error);
	$.getJSON('default_loops.json?'+Math.random())
	.done(function(data) {
		var defaultLib = [
			{ title: 'Период смерти', sectID: 'dead', contents: _.filter(data, {section: 'dead'}) },
			{ title: 'Период жизни', sectID: 'live', contents: _.filter(data, {section: 'live'}) }
		]
		loopLibs.default = new TrackList(defaultLib, '#default-loops', 'default', false, $('#ltab-default i.sorter'), 'date', 'desc', true, $('#ltab-default i.play-enabler'));
	})
	.fail(console.error);
	$.getJSON('default_patterns.json?'+Math.random())
	.done(function(data) {
		patternLibs.default = new PatternGallery(data, '#default-patterns', 'default', $('#ptab-default i.sorter'), 'date', 'desc');
	})
	.fail(console.error);
	$.getJSON('custom_patterns.json?'+Math.random())
	.done(function(data) {
		patternLibs.custom = new PatternGallery(data, '#custom-patterns', 'custom', $('#ptab-custom i.sorter'), 'date', 'desc');
	})
	.fail(console.error);

	$('.scrollable').mCustomScrollbar({theme:"minimal-dark", scrollInertia: 200});

	/* Track name autoscroll */
	$('.lt-contents').on('mouseenter', '.track', function() {
		var $trackName = $(this).find('.track-name');
		if($trackName[0].scrollWidth <= $trackName[0].offsetWidth) return;
		$trackName.stop().addClass('no-overflow');
		$trackName.animate({
			scrollLeft: $trackName.width()
		}, $trackName.width()*15, 'linear');
	})
	.on('mouseleave', '.track', function() {
		var $trackName = $(this).find('.track-name');
		if($trackName[0].scrollWidth <= $trackName[0].offsetWidth) return;
		$trackName.stop().animate({
			scrollLeft: 0
		}, 'slow', 'linear', function() {
			$trackName.removeClass('no-overflow');
		});
	})

	/* Lib header */
	$('.lib-search').click(function() {
		$(this).toggleClass('active').parents('.library').toggleClass('search-active').find('input').focus()
	});
	$('.ltab-close, .ptab-close').click(function() {
		$(this).parents('.library').removeClass('open-lib select-mode');
	});
	$('.tab-switch').click(function() {
		var tabgroup = $(this).data('tabgroup');
		$('.tab-switch.tabgroup-'+tabgroup).removeClass('active');
		if(!$(this).hasClass('active'))
			$(this).addClass('active');
		$('.tab-contents.tabgroup-'+tabgroup).hide();
		$('#'+$(this).data('tab')).show();
	});
	$('.tab-to-select-by-default').click();

	/* track play on click */
	$('#loop-library')
	.on('click', '.track .i-play', function() {
		var hash = $(this).parents('.track').data('hash')		// unique hashname of the track
		, libID = $(this).parents('.tracklist-section').data('id');		//library ID
		loopLibs[libID].playTrackByHash(hash);
	}) /* track download menu */
	.on('click', '.track-options .i-download-menu', function(ev) {
		ev.stopPropagation();
		$('.track').removeClass('dl-track ed-track')
		$(this).parents('.track').addClass('dl-track')
	})
	.on('click', '.track-options .i-burger', function(ev) {
		ev.stopPropagation();
		$('.track').removeClass('dl-track ed-track')
		$(this).parents('.track').addClass('ed-track')
	})
	.on('click', '.track-name', function(ev) {
		$('.track').removeClass('dl-track ed-track')
	})
	.on('click', '.track', function(ev) {
		if($(this).parents('.library').hasClass('select-mode')) {
			ev.stopPropagation();
			var hash = $(this).data('hash');
			if($(this).parents('.library').hasClass('select-mode'))
				$('#loop-toassoc').val(hash);
		}
	});

	/* track search (Jets.js method) */
	$('#loop-search').on('input', function() {
		var query = $(this).val().toLowerCase().replace(/\"/, '\\"');
		try {
			injector.remove('loop-search');
		} catch(e) {}
		if(query.length)
			injector.inject('loop-search', '.search-active#loop-library .track:not([data-name *= "'+query+'"]) { display:none; }');
		else
			injector.inject('loop-search', '.search-active#loop-library .track { display:none; }');
	}).trigger('input');

	/* pattern search (same) */
	$('#pattern-search').on('input', function() {
		var query = $(this).val().toLowerCase().replace(/\"/, '\\"');
		try {
			injector.remove('pattern-search');
		} catch(e) {}
		if(query.length)
			injector.inject('pattern-search', '.search-active#pattern-library .pattern:not([data-name *= "'+query+'"]) { display:none; }');
		else
			injector.inject('pattern-search', '.search-active#pattern-library .pattern { display:none; }');
	}).trigger('input');

	/**/
	$('#unedit-loop').click(loopEditor.unedit.bind(loopEditor));

	$('.oncheck-enable').change(function() {
		$($(this).data('element-toenable')).attr('disabled', !this.checked);
	})

	// track menu
	$('#loop-library')
	.on('click', '.dlb-edit', function() {
		var $track = $(this).parents('.track')
		, hash = $track.data('hash')+''
		, lib = $track.parents('.tabgroup-loops').data('lib')
		, trackData = _.find(loopLibs[lib].flatList, {original_hash: hash});
		if(trackData)
			loopEditor.prepareEdit(trackData, true);
	})
	.on('click', '.dlb-delete', function() {
		var $track = $(this).parents('.track')
		, hash = $track.data('hash')
		, lib = $track.parents('.tabgroup-loops').data('lib')
		, trackData = _.find(loopLibs[lib].flatList, {original_hash: hash});
		if(trackData)
			loopEditor.del(trackData, true);
		/*loopEditor.del(hash);*/
	});

	/* Pattern applying and menu */
	$('#pattern-library')
	.on('click', '.pattern-name', function() {
		var libID = $(this).parent().data('lib')
		, patternID = $(this).parent().data('id');

		if($(this).parents('.library').hasClass('select-mode')) 
			$('#pattern-toassoc').val(patternID);
		else
			patternLibs[libID].applyPatternByID(patternID);
	})
	.on('click', '.i-edit', function() {
		var $pattern = $(this).parents('.pattern')
		, id = $pattern.data('id')
		, lib = $pattern.data('lib')
		, patternData = _.find(patternLibs[lib].list, {id: id});
		if(patternData) 
			patternEditor.edit(patternData);
	})
	.on('click', '.pattern .i-x-small', function() {
		var $pattern = $(this).parents('.pattern')
		, id = $pattern.data('id')
		, lib = $pattern.data('lib')
		, patternData = _.find(patternLibs[lib].list, {id: id});
		if(patternData) 
			patternEditor.del(patternData);
	})

	/* Pattern share form */
	$('form#pattern-share').on('submit', function(ev) {
		ev.preventDefault();
		setLineHeightAsParentHeight($('#editmode .hijab'));
		$('#editmode .panel').addClass('p-busy');
		var action = 'add';
		if($('#pattern-share').hasClass('action-edit')) 
			action = 'edit';
		if($('#pattern-share').hasClass('action-delete')) 
			action = 'delete';

		var fd = new FormData();
		fd.append('action', action);
		fd.append('datatype', 'pattern');
		fd.append('delpass', $("#pattern-share .delpass").val());
		fd.append('captcha', $("#pattern-share .captchainput").val());

		if(is_admin)
			fd.append('is_admin', 1);

		if(action !== 'delete') {
			fd.append('name', $("#pattern-share .filename").val());
			fd.append('pattern_string', Grid.getPattern());

			fd.append('style', $('#cell-style').val());
			fd.append('osc', ($('#osc-sel').val() !== 'off') ? $('#osc-color').val() : 'off')

			if($('#assoc_loop').is(':checked'))
				fd.append('associated_loop', $('#loop-toassoc').val());

			if(is_admin) {
				fd.append('is_admin', 1);
				var date = $('#pattern-date').val();
				if(date) {
					var time = $('#pattern-time').val() || '00:00:00';
					date = date + ' ' + time
				}
				if(date)
					fd.append('date', date);
				fd.append('section', $("#pattern-section").val());
			}
		}

		if(action !== 'add') {
			fd.append('pattern_id', patternEditor.currentID);
		}

		var request = new XMLHttpRequest();
		request.open("POST", "upload.php");
		request.send(fd);

		request.onload = function(e) {
			$('#editmode .panel').removeClass('p-busy');
			if(this.status == 200) {
				try {
					var res = JSON.parse(this.response);
					if(res.error) {
						errBox.pop($('#editmode'), res.msg);
					}
					else {
						// save password
						var dp = $("#pattern-share .delpass").val();
						localStorage["pattern_pass"] = dp;
						if(!localStorage["loop_pass"]) {
							$("#loop-upload .delpass").val(dp);
							localStorage["loop_pass"] = dp;
						}

						if(res.success === 'pattern_add') {
							patternLibs[res.pattern.section].add(res.pattern);
							// patternEditor.hide();
						}
						if(res.success === 'pattern_edit') {
							var lib_from = res.pattern.section_from || false;
							if(lib_from) {
								patternLibs[lib_from].del(res.pattern.id);
								patternLibs[res.pattern.section].add(res.pattern);
							}
							else
								patternLibs[res.pattern.section].edit(res.pattern);
							_.each(res.changes, function(item, ix) {res.changes[ix] = _.escape(item)});
							errBox.pop($('#editmode'), res.changes.join(';<br>'), 'success', 'raw');
							patternEditor.unedit();
						}
						if(res.success === 'pattern_delete') {
							patternLibs[res.pattern.section].del(res.pattern.id);
							errBox.pop($('#editmode'), "Паттерн удален.", 'success');
							patternEditor.undel();
						}
						$('#pattern-library').addClass('open-lib');
						$('#ptab-'+res.pattern.section).click();
						$("#loop-upload .filename").val('').trigger('input');
					}
				}
				catch(e) {
					if(e.name == 'SyntaxError') {
						errBox.pop($('#editmode'), 'Неожиданный ответ сервера. Подробности в консоли.');
						console.error(this.response);
					}
					else throw e;
				}
				updateCaptcha($("#pattern-share .captchablock"));
			}
			else {
				errBox.pop($('#editmode'), 'Ошибка XHR. Подробности в консоли.');
				console.error(e);
			}
		}

	})

	/*toggle osc and assoc*/
	if(localStorage['loops_association'])
		try {
			conf.association = JSON.parse(localStorage['loops_association']);
			$('#assoc-toggle')[0].checked = conf.association;
		}
		catch(e) {
			throw e;
			localStorage['loops_association'] = false;
		}
	$('#assoc-toggle').change(function() {
		conf.association = localStorage['loops_association'] = $(this)[0].checked;
	});
	if(localStorage['osc_enabled'])
		try {
			conf.osc = JSON.parse(localStorage['osc_enabled']);
			if(!conf.osc) {
				$('#osc-toggle')[0].checked = false;
				$('body').addClass('osc-disabled');
			}
		}
		catch(e) {
			throw e;
			localStorage['osc_enabled'] = true;
		}
	$('#osc-toggle').change(function() {
		conf.osc = localStorage['osc_enabled'] = $(this)[0].checked;
		if(!conf.osc)
			$('body').addClass('osc-disabled')
		else 
			$('body').removeClass('osc-disabled')
	})

	/* Cell styles and stuff */
	_.each(styles, function(val, style) {
		var selected = (Grid.style === style) ? ' selected' : '';
		$('#cell-style').append('<option val="'+style+'"'+selected+'>'+style+'</option>');
	});

	$('#cell-style').change(function() {
		Grid.changeStyle($(this).val())
	});

	$('#osc-color').change(function() {
		Grid.setOsc($(this).val());
	})

	$('#osc-sel').change(function() {
		var val = $(this).val();
		if(val === 'off') 
			Grid.setOsc('off')
		else {
			$('body').removeClass('osc-disabled');
			conf.osc = true;
		}
		if(val === 'default') {
			Grid.recount();
			$('#osc-color').attr('disabled', true);
		}
		if(val === 'custom')
			$('#osc-color').attr('disabled', false);
	})

	// some local storage shit
	$("#loop-upload .delpass").val(localStorage["loop_pass"] || '').trigger('input');
	$("#pattern-share .delpass").val(localStorage["pattern_pass"] || '').trigger('input');
}

var injector = {
  inject: function(alias, css) {
    var head = document.head || document.getElementsByTagName('head')[0]
      , style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'injector:' + alias;
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  },
  remove: function(alias) {
  	var style = document.getElementById('injector:' + alias);
  	if(style) {
  		var head = document.head || document.getElementsByTagName('head')[0];
  		if(head)
  			head.removeChild(document.getElementById('injector:' + alias));
  	}
  }
}

var loopLibs = {}, patternLibs = {};

var errBox = {
	pop: function($parent, message, msgType, raw) {
		if(typeof msgType === "undefined") msgType = "error";
		if(typeof raw === "undefined" || raw !== 'raw') raw = false;
		$errorbox = $parent.find('.emsgwrap');
		if(raw)
			$errorbox.find('.emsgbody').html(message);
		else
			$errorbox.find('.emsgbody').text(message);
		$errorbox.find('.pop-message').removeClass('emsg-error emsg-prompt emsg-success').addClass('emsg-'+msgType);
		$errorbox.css({visibility: 'visible'});
		$errorbox.animate({
		  opacity: 1,
		  top: '-'+($errorbox.height()-20)+'px'
		}, 200);
		return $errorbox;
	},
	closeWithBtn: function(ev) {
		ev.preventDefault();
		errBox.off($(this).parents('.emsgwrap'))
	},
	off: function($parent) {
		$parent.animate({opacity: '0'}, 200, function() {
			$parent.css({
				visibility: 'hidden',
				top: '0px'
			})
		})
	}
}

function popError($parent, message) {
	$errorbox = $parent.find('.emsgwrap');
	$errorbox.find('.emsgbody').html(message);
	$errorbox.css({visibility: 'visible'});
	$errorbox.animate({
	  opacity: 1,
	  top: '-'+($errorbox.height()-20)+'px'
	}, 400);
}

function updateCaptcha($parent) {
	$parent.find('img.captcha').attr('src', 'captcha/captcha.php?color=200,200,200&'+Math.random());
	$parent.find('input.captchainput').val('').trigger('input');
}

function updateRanges(name) {
	var nameSel = (typeof name === "undefined") ? '' : '[name="'+name+'"]';
	if(nameSel !== 'domain')
		$('input[type=range]'+nameSel).each(function() {
			var prop = $(this).attr('name');
			if(prop === 'fft_size') 
				$(this).val(Math.log2(conf[prop]));
			else 
				$(this).val(conf[prop]);
			var val = ((prop === 'tresholdCorrection' && conf[prop] > 0) ? '+' : '')+conf[prop];
			$(this).parent().find('.indicator').text(val);
		});
	if(nameSel === 'domain' || nameSel === '') {
		$('#rb-'+conf.domain).attr('checked', 'checked');
		if(conf.domain === 'time') 
			$('#smoothingBlock').addClass('disabled')
		else 
			$('#smoothingBlock').removeClass('disabled')
	}
};

var loopEditor = {
	visible: false,
	state: 'add',
	prepareEdit: function(data, immed) {
		this.rawData = data;
		if(typeof immed !== 'undefined' && immed)
			this.edit();
	},
	add: function() {
		this.unedit();
		this.undel();
		this.show();
		errBox.off($('#loop-upload .emsgwrap'));
	},
	edit: function() {
		this.undel();
		this.state = 'edit'
		errBox.off($('#loop-upload .emsgwrap'));
		$('#loop-upload form').addClass('action-edit');
		$('#loopedit-id').text(_.trunc(this.rawData.name, 18));
		$('#loop-upload .filename').val(this.rawData.name);
		$('#loop-upload input[name=tresholdCorrection]')
		.val(this.rawData.treshold_correction).trigger('input');
		
		$datetime = this.rawData.date.split(' ');
		$('#loop-date').val($datetime[0]);
		$('#loop-time').val($datetime[1]);
		$('#loop-section').val(this.rawData.section);
		$('#loop-swf').val(this.rawData.swf);

		if(this.rawData.associated_loop) {
			$('#pattern-toassoc').val(this.rawData.associated_pattern);
			$('#assoc_pattern')[0].checked = true;
		}
		else 
			$('#assoc_pattern')[0].checked = false;
		$('#assoc_pattern').trigger('change');
		
		this.show();		
	},
	unedit: function() {
		if(this.state !== 'edit') return;
		this.state = 'add';
		$('#loop-upload form').removeClass('action-edit');
	},
	del: function(loop) {
		this.rawData = loop;
		this.unedit();
		this.state = 'delete';
		$('#loopdelete-id').text(_.trunc(loop.name, 40));
		$('#loop-upload form').addClass('action-delete');
		this.show();
	},
	undel: function() {
		if(this.state !== 'delete') return;
		this.state = 'add';
		$('#loop-upload form').removeClass('action-delete');
	},
	show: function() {
		if(this.visible) return;
		$('#loop-upload .captcha').attr('src', 'captcha/captcha.php?color=200,200,200&'+Math.random());
		$('#loop-upload').slideDown('fast');
		this.visible = true;
		$('#loop-upload .validable').trigger('input');
	},
	hide: function() {
		//return here
		if(!this.visible) return;
		errBox.off($('#loop-upload .emsgwrap'));
		$('#loop-upload').slideUp('fast', (function() {
			this.unedit();
			this.undel();
			this.visible = false;
		}).bind(this));
	}
}

var patternEditor = {
	visible: false,
	state: 'add',
	currentID: 0,
	edit: function(pattern) {
		this.undel();
		$('#pattern-share').addClass('action-edit');
		$('#patternedit-id').text(_.trunc(pattern.name, 40));
		$('#pattern-share .filename').val(pattern.name);
		if(pattern.associated_loop) {
			$('#loop-toassoc').val(pattern.associated_loop);
			$('#assoc_loop')[0].checked = true;
		}
		else
			$('#assoc_loop')[0].checked = false;
		$('#assoc_loop').trigger('change');
		if(pattern.style) 
			$('#cell-style').val(pattern.style).trigger('change');
		if(pattern.osc) 
			Grid.setOsc(pattern.osc);
		
		this.state = 'edit';
		this.show(pattern.string);
		this.currentID = +pattern.id;
	},
	unedit: function() {
		if(this.state !== 'edit') return;
		this.state = 'add';
		$('#pattern-share').removeClass('action-edit');
	},
	del: function(pattern) {
		this.currentID = +pattern.id;
		this.unedit();
		this.state = 'delete';
		$('#patterndelete-id').text(_.trunc(pattern.name, 40));
		$('#pattern-share').addClass('action-delete');
		this.show(pattern.string);
	},
	undel: function() {
		if(this.state !== 'delete') return;
		this.state = 'add';
		$('#pattern-share').removeClass('action-delete');

	},
	show: function(patternStr) {
		if(typeof patternStr === 'undefined') patternStr = false;
		Grid.enterPaintMode();
		if(patternStr) {
			Grid.build(patternStr);
			$('#pattern-library').removeClass('open-lib');
		}
		if(this.visible) return;
		$('#pattern-share .captcha').attr('src', 'captcha/captcha.php?color=200,200,200&'+Math.random());
		$('.onshare-show').slideDown('fast');
		this.visible = true;
		$('#pattern-share .validable').trigger('input');

		if($('#osc-sel').val() === 'default')
			Grid.recount();
	},
	hide: function() {
		if(!this.visible) return;
		$('.onshare-show').slideUp('fast', (function() {
			this.unedit();
			this.undel();
			this.visible = false;
		}).bind(this));
	},
	toggle: function() {
		if(this.visible) this.hide();
		else this.show();
	}
}

var upconf = {
	auth: false
}

var $canvas, drawContext;

var validations = {
	delpass: function(val) {
		return !!val && (val.length <= upconf.max_delpass_length)
	},
	captcha: function(val) {
		return !!val
	},
	filename: function(val) {
		return !!val && (val.length <= upconf.max_filename_length)
	}
}

function validateForm($form, fromInput) {
	$form.find('button[type=submit]').attr('disabled', !!($form.find('.invalid:visible').length))
}

var actions = {
	export: function() {
		$('#pattern-area').val(Grid.getPattern())
	},
	import: function() {
		Grid.build($('#pattern-area').val(), 'under')
	},
	random: function() {
		Grid.randomfill()
	},
	revert: function() {
		$('#osc-sel').val('default');
		Grid.changeStyle(defaultStyle, defaultPattern);
	},
	clear: function() {
		Grid.clear()
	},
	close: function() {
		Grid.exitPaintMode();
	},
	upload: function() {
		document.getElementById('bufferFileInput').click();
	},
	download: function() {
		Grid.downloadPattern()
	},
	upload_loop: function() {
		console.log('loop upload')
	},
	share_pattern: function() {
		patternEditor.toggle();
	},
	select_loop: function(ev) {
		ev.preventDefault();
		$('#loop-library').addClass('select-mode open-lib');
	},
	select_pattern: function(ev) {
		ev.preventDefault();
		$('#pattern-library').addClass('select-mode open-lib');
	},
	recount_base_color: function() {
		Grid.recount();
	}
}

var isMouseDown = false;

function setLineHeightAsParentHeight($el) {
	$el.each(function() {
		$(this).css({lineHeight: $(this).height()+'px'});
	})
}

var Colors = {
	g: '#35752e', G: '#59c44d',
	y: '#7b7d25', Y: '#cccf41',
	o: '#805c22', O: '#d2993e',
	b: '#2e6d90', B: '#4eb6f1',
	c: '#7b273d', C: '#cc4368',
	v: '#4e1e84', V: '#8238d8',
	m: '#686868', M: '#d2d2d2',
	j: '#468172', J: '#37C999',
	'.': '_VOID_', '_': '_VOID_'
}
var colorMatch = new RegExp('(['+_.escapeRegExp(_.keys(Colors).join(''))+'])|\\[(.+?)\\]', 'g');
var colorMatchSqBr = new RegExp('(['+_.escapeRegExp(_.keys(Colors).join(''))+'])|(\\[.+?\\])', 'g');

var styles = {
	legacy: function(color) {
		var baseColor = color.toHexString(), darkenColor = color.darken(25).toHexString();
		return {
			u: 'background: radial-gradient(ellipse at center, '+baseColor+' 34%, '+darkenColor+' 81%);',
			o: 'background: '+baseColor
		}
	},
	modern: function(color) {
		var baseColor = color.toHexString(), darkenColor = color.darken(10).toHexString(), darker = color.darken(30).toRgbString();
		return {
			u: 'background: radial-gradient(ellipse at center 7px, '+baseColor+' 0%, '+darkenColor+' 70%);',
			o: 'background: '+baseColor+'; box-shadow: '+baseColor+' 0px 0px 0px 0px, '+baseColor+' 0px 0px 0px 0px, '+darker+' 0px 0px 0px 0px'
		}
	},
	flat: function(color) {
		var baseColor = color.toHexString(), lighten = color.brighten(25).saturate(15).toHexString();
		return {
			u: 'background: '+baseColor+';',
			o: 'background: '+lighten+';'
		}
	}
}, defaultStyle = 'modern';
styles.transitional = styles.modern;

var globalCSS = {
	legacy: "html {\
    height: 100%; \
    background: #000; \
    background: -webkit-linear-gradient(top,#404040,#000 195px,#000 380px,#2B2B2B 418px) no-repeat,#2B2B2B; \
    background: -ms-linear-gradient(top,#404040,#000 195px,#000 380px,#2B2B2B 418px) no-repeat,#2B2B2B; \
    background: -o-linear-gradient(top,#404040,#000 195px,#000 380px,#2B2B2B 418px) no-repeat,#2B2B2B; \
    background: -moz-linear-gradient(top,#404040,#000 195px,#000 380px,#2B2B2B 418px) no-repeat,#2B2B2B; \
    background: linear-gradient(top,#404040,#000 195px,#000 380px,#2B2B2B 418px) no-repeat,#2B2B2B; \
  }\
  body {\
  	font-family: 'Trebuchet MS',\
  	Trebuchet, Arial,Helvetica, sans-serif;\
  }\
  #shadow {\
  	background: rgba(33, 33, 33, 0.44);\
    box-shadow: 0 0 53px #212121;\
  }",
  transitional: "html {\
  	background: #212121;\
  }\
  #shadow {\
  	background: rgba(33, 33, 33, 0.44);\
    box-shadow: 0 0 53px #212121;\
  }",
  flat: "#nullgrid .cell:not(.void) {border-radius: 0; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);}\
  #nullgrid .cell.under:not(.void) { box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2); }"
}

function xBrowserIsMouseDown() {
	return isMouseDown;
}
// stupid bug workaround
var isChrome = navigator.userAgent.match(/chrome\/([0-9]+)/i);
if(isChrome) {
	chromeVersion = isChrome[1];
	if(+chromeVersion >= 46)
	xBrowserIsMouseDown = function() {
		return $('body:active').length;
	}
}

var animations = {
  legacy: function() {
    var color = this.style.backgroundColor
    , darken = tinycolor(color).darken(30).toRgbString();
    this._tl.to(this, 0.1, {
      opacity: 1,
      boxShadow: color+' 0px 0px 2px 2px, '+color+' 0px 0px 10px 10px, '+darken+' 0px 0px 9px 9px',
    }).to(this, 0.4, {
      opacity: 0,
      boxShadow: color+' 0px 0px 0px 0px, '+color+' 0px 0px 0px 0px, '+darken+' 0px 0px 0px 0px',
    })
  },
  flat: function() {
    var color = this.style.backgroundColor;
    this._tl.to(this, 0.1, {
      opacity: 1,
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0),' + color + ' 0px 0px 4px 2px',
    }).to(this, 0.6, {
      opacity: 0,
      boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.2),' + color + ' 0px 0px 0px 0px',
    })
  }
}
animations.modern = animations.transitional = animations.legacy;

var Grid = {
	init: function(sel) {
		this.$el = $(sel);
		var self = this;
		this.$el.find('.triangle-group').css({display: 'inline-block'}).hide();
		this.$el.find('.tg-top .t-up').click(function() {self.resample('top', 1, 'under')});
		this.$el.find('.tg-top .t-down').click(function() {self.resample('top', -1, 'under')});
		this.$el.find('.tg-bottom .t-up').click(function() {self.resample('bottom', -1, 'under')});
		this.$el.find('.tg-bottom .t-down').click(function() {self.resample('bottom', 1, 'under')});
		this.$el.find('.tg-left .t-left').click(function() {self.resample('left', 1, 'under')});
		this.$el.find('.tg-left .t-right').click(function() {self.resample('left', -1, 'under')});
		this.$el.find('.tg-right .t-left').click(function() {self.resample('right', -1, 'under')});
		this.$el.find('.tg-right .t-right').click(function() {self.resample('right', 1, 'under')});
		this.shuffler = new Rarity(50);
		if(this.lastOsc !== 'default')
			this.setOsc(this.lastOsc);
		this.changeStyle(this.baseStyle, this.pattern);
	},
	pattern: localStorage['customPattern'] || defaultPattern,
	baseStyle: localStorage['lastStyle'] || defaultStyle,
	lastOsc: localStorage['lastOsc'] || 'default',
	revert: function() {
		$('#osc-sel').val('default');
		this.changeStyle(this.baseStyle, this.pattern);
	},
	style: this.baseStyle,
	changeStyle: function(style,thenBuild) {
		if(!_.has(styles, style))
			return console.error('Не существует такого стиля');
		$('#cell-style').val(style);
		if(typeof thenBuild === 'undefined') thenBuild = false;
		this.style = style;
		injector.remove('cellstyle');
		if(_.has(globalCSS, style)) 
			injector.inject('cellstyle', globalCSS[style]);
		this.build(thenBuild);
	},
	setOsc: function(color) {
		if(color === 'off') {
			$('#osc-sel').val('off');
			$('body').addClass('osc-disabled');
			conf.osc = false;
			return
		}
		conf.osc = true;
		if(color === 'default') {
			$('#osc-color').attr('disabled', true);
			color = Grid.primaryColor;
			$('#osc-sel').val('default');
		}
		else {
			$('#osc-sel').val('custom');
			$('#osc-color').attr('disabled', false);
		}
		if($('#osc-toggle')[0].checked)
			$('body').removeClass('osc-disabled');
		var $oscC = $('#osc-color');
		if($oscC[0].hasOwnProperty('color'))
			$oscC[0].color.fromString(color);
		else
			$oscC.val(color);
		if(color.indexOf('#') == (-1))
			color = '#'+color;
		drawContext.fillStyle = color;
	},
	generateCell: function(color, layer, style) {
		if(typeof style === 'undefined') style = this.style;
		var char = color.split(/[\[\]]/)[1] || color.split(/[\[\]]/)[0]
		, color = _.has(Colors, char) ? tinycolor(Colors[char]) : tinycolor(char)
		, cstring = _.has(Colors, char) ? char : ('#'+color.toHex().toLowerCase())
		, style = styles[style](color);
		if(color._format && color._a >= conf.colorAlphaTreshold) {
			if(layer == 'under')
				return $('<div data-c="'+cstring+'" class="cell under" style="'+style.u+'"></div>');
			else {
				var $cell = $('<div data-c="'+cstring+'" class="cell over" style="'+style.o+'"></div>');
				$cell[0]._tl = new TimelineLite()
				var blink = function() {
					this._tl.progress(0)
				}
				$cell[0].addEventListener('mouseenter', blink, false);
				$cell[0].addEventListener('touchstart', blink, false);
				return $cell;
			}
		}
		else {
			if(layer == 'under')
				return $('<div class="cell under void" data-c="_"></div>');
			if(layer == 'over')
				return $('<div class="cell void" data-c="_"></div>');
		}
	},
	lastBuild: {
		pattern: '',
		layer: '',
		style: ''
	},
	build: function(pattern, layer) {
		if(typeof pattern !== 'string') pattern = this.getPattern();
		if(typeof layer === 'undefined') layer = $('#grid-wrap').hasClass('edit-mode') ? 'under' : 'both';
		pattern = pattern
		.replace(/\s+/g, '')
		.replace(/\|{2,}/g, '|')
		.replace(/^\|/g, '')
		.replace(/\|$/g, '');
		// prevent same pattern rebuilding
		if(pattern === this.lastBuild.pattern && layer === this.lastBuild.layer && this.style === this.lastBuild.style) return;
		this.lastBuild.pattern = pattern; this.lastBuild.layer = layer; this.lastBuild.style = this.style;
		var $cells = this.$el.find('#cells'), $overlays = this.$el.find('#overlays');
		if(layer != 'over') $cells.find('.cell, br').remove();
		if(layer != 'under') $overlays.find('.cell, br').remove();
		var lines = pattern.split(/[|\/]/);
		_.each(lines, function(line, li) {
			var chars = _.compact(line.split(colorMatch));
			_.each(chars, function(char, ci) {
				if(layer != 'over')
					this.generateCell(char, 'under').attr('id', 'cu_'+li+'_'+ci).appendTo($cells)
				if(layer != 'under')
					this.generateCell(char, 'over').attr('id', 'co_'+li+'_'+ci).appendTo($overlays)
			}, this) // /each
			if(layer != 'over')
				$('<br>').appendTo($cells)
			if(layer != 'under')
				$('<br>').appendTo($overlays)
		}, this)
		//initial blink
		if(layer !== 'under')
			var style = this.style;
			$('.over').each(animations[style]);
		this.recount(layer);
	},
	enterPaintMode: function() {
		$('#overlays').empty();
		$('#controls').fadeOut();
		$('#editmode').slideDown();
		$('#nerdmode').slideUp();
		audio.stop(function() {
			$('#playSwitcher i').removeClass('i-pause-big').addClass('i-play-big')
		});
		$('#cells').on('mousedown mouseenter', '.cell', function(ev) {
			if(!brush.mode || (ev.type == 'mouseenter' && ! xBrowserIsMouseDown()/*isMouseDown*/ /*$('body:active').length*/ ) ) return;
			if(brush.mode === 'dropper') {
				var color = $(this).data('c');
				$('.swatch').removeClass('selected');
				if(_.has(Colors, color)) {
					$('#swatch-'+color).addClass('selected');
					brush.color = color;
				}
				else {
					brush.color = color;
					$('#colorpicker')[0].color.fromString(tinycolor(color).toHexString()) 
					$('#colorpicker').addClass('selected');
					if(!$('#dynamic-palette [data-c='+color.toLowerCase()+']').length) {
						$('#dynamic-palette').prepend(Grid.generateCell(color, 'under').addClass('swatch').data('act', 'swatch').attr('id', 'swatch-'+color));
					}
				}
			}
			else {
				var id = $(this).attr('id');
				var color = (brush.mode === 'eraser') ? '_' : brush.color;
				$(this).replaceWith(Grid.generateCell(color, 'under').attr('id', id));
				if(!_.has(Colors, color) && !$('#dynamic-palette [data-c='+color.toLowerCase()+']').length) 
					$('#dynamic-palette').prepend(Grid.generateCell(color, 'under').addClass('swatch').data('act', 'swatch').attr('id', 'swatch-'+color));
				Grid.lastBuild.pattern = '';
			}
		});
		this.$el.parent().addClass('edit-mode');
		$('.triangle-group').slideDown();
	},
	brush: false,
	saveState: function(pattern) {
		if(typeof pattern === 'undefined') pattern = this.getPattern();
		this.pattern = localStorage['customPattern'] = pattern;
		this.baseStyle = localStorage['lastStyle'] = this.style;
		var oscMode = $('#osc-sel').val();
		localStorage['lastOsc'] = (oscMode === 'custom') ? $('#osc-color').val() : oscMode;
	},
	exitPaintMode: function() {
		$('#cells').off();
		var newPattern = this.getPattern();
		this.lastBuild.pattern = '';
		this.build(newPattern, 'over');
		this.$el.parent().removeClass('edit-mode');
		$('.triangle-group').slideUp();
		this.saveState(newPattern);
		$('#controls').slideDown();
		$('#editmode').slideUp();
	},
	getPattern: function() {
		var row = 0, code, output = '';
		this.$el.find('.cell.under').each(function() {
			if($(this).attr('id').split('_')[1] > row) {
				output += '|'; 
				row++;
			}
			code = $(this).data('c');
			if(code.length > 1) code = '['+code+']';
			output += code; 
		})
		return output;
	},
	recount: function(layer) {
		if(typeof layer === 'undefined') layer = $('#grid-wrap').hasClass('edit-mode') ? 'under' : 'over';
		var lc = (layer === 'under') ? 'under' : 'over';
		var cells = document.querySelectorAll('.cell.'+lc+':not(.void)');
		if(layer !== 'under') {
			this.cells = cells; 
			this.reshuffle();
			this.cellCount = this.cells.length;
			this.trimmingConstant = Math.floor(Math.sqrt(this.cellCount));
		}
		
		var primaryColor = (function(cc) {return _.invert(cc)[_.max(cc)]})(_.countBy(_.pluck(_.pluck(cells, 'dataset'), 'c')));
		this.primaryColor = _.has(Colors, primaryColor) ? Colors[primaryColor] : tinycolor(primaryColor).toHexString();
		
		if($('#osc-sel').val() == 'default') 
			this.setOsc('default');
		
		// resample layers
		var selfHeight = this.$el.find('#cells').height(), selfWidth = this.$el.find('#cells').width();
		$('.wrapper-xh').css({'top': ((selfHeight +  70) - conf.barHeight)+'px'});
		$('#shadow').width(selfWidth + 20);
		this.height = selfHeight / 20;
		this.width = selfWidth / 20; // where cell is 20×20
		var _x = this.width, _y = this.height;
		$('#sizeIndicator').text(_x+' × '+_y)
	},
	reshuffle: function() {
		this.cellsShuffled = _.shuffle(this.cells); 
	},
	rareShuffle: function() {
		this.shuffler.do(this.reshuffle.bind(this))
	},
	flash: function(i) {
		if(i+1 <= this.cellCount)
			this.cells[i]._tl.progress(0);
	},
	fuzzyFlash: function(i) {
		if(i+1 <= this.cellCount)
			if(Math.random() > conf.flashFuzziness)
				this.cells[i]._tl.progress(0);
			else {
				this.cellsShuffled[i]._tl.progress(0);
			}
	},
	resample: function(direction, amount, layer) {
		var pattern = this.getPattern();
		var lines = pattern.split(/[|\/]/);
		var output = [];
		if(isNaN(amount) || amount === 0) return;
		if(amount < 0) {
			var _remove = _.includes(['left', 'top'], direction) ? _.drop : _.dropRight;
			if(_.includes(['left', 'right'], direction)) 
				output = _.map(lines, function(line) { 
					var chars = _.compact(line.split(colorMatchSqBr));
					return _remove(chars, (-amount)).join('') 
				});
			else 
				output = _remove(lines, (-amount));
		}
		if(amount > 0) {
			if(direction == 'left')
				output = _.map(lines, function(line) { return _.repeat('_', amount)+line });
			if(direction == 'right')
				output = _.map(lines, function(line) { return line+_.repeat('_', amount) });
			if(_.includes(['top', 'bottom'], direction)) {
				var  linelength = _.compact(_.max(lines, function(line) { 
					return _.compact(line.split(colorMatch)).length 
				}).split(colorMatch)).length;
				var add = _.times(amount, function() { return _.repeat('_', linelength) });
				output = (direction == 'top') ? add.concat(lines) : lines.concat(add);
			}
		}
		this.build(output.join('|'), layer)
	},
	randomfill: function() {
		this.$el.find('.cell.under').each(function() {
			var color = Math.random() >= 0.5 ? tinycolor.random().toHexString() : '_';
			var id = $(this).attr('id');
			$(this).replaceWith(Grid.generateCell(color, 'under').attr('id', id));
		});
	},
	clear: function() {
		this.$el.find('.cell.under').each(function() {
			var id = $(this).attr('id');
			$(this).replaceWith(Grid.generateCell('_', 'under').attr('id', id));
		});
	},
	fromCanvas: function() {
		var h = bufferCanvas.height, w = bufferCanvas.width;
		var x, y, px, output = "";
		for(y=0; y < h; y++) {
			for(x=0; x < w; x++) {
				px = bufferContext.getImageData(x, y, 1, 1).data;
				output += '[rgba(' + px[0] + ',' + px[1] + ',' + px[2] + ',' + px[3] + ')]';
			}
			if(y != (h-1)) output += '|';
		}
		this.build(output)
	},
	downloadPattern: function() {
		$('#bufferLink').attr('href', this.toCanvas())[0].click();
	},
	toCanvas: function(pattern, width, height) {
		if(typeof width === "undefined") width = this.width;
		if(typeof height === "undefined") height = this.height;
		bufferCanvas.width = width;
		bufferCanvas.height = height;
		if(typeof pattern === 'undefined')
			pattern = this.getPattern();
		var output = new Uint8ClampedArray(width * height * 4);
		var i=0, j;
		var lines = pattern.split(/[|\/]/);
		_.each(lines, function(line, li) {
			var chars = _.compact(line.split(colorMatch));
			if(chars.length < width) {
				var offset = width - chars.length,
				offsetLeft = Math.floor(offset/2);
				offsetRight = Math.ceil(offset/2);
				_.times(offsetLeft, function() {
					chars.unshift('_');
				});
				_.times(offsetRight, function() {
					chars.push('_');
				});
			}
			_.each(chars, function(char, ci) {
				var color = _.has(Colors, char) ? tinycolor((Colors[char] == "_VOID_") ? 'rgba(0,0,0,0)': Colors[char]) : tinycolor(char.replace(/[\[\]]/g, ''));
				j = i*4;
				output[j] = color._r;
				output[j+1] = color._g;
				output[j+2] = color._b;
				output[j+3] = color._a*255;
				i++;
			})
		});
		_debug_ = {
			output: output,
			width: width,
			height: height
		}
		bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
		imageData = bufferContext.createImageData(width, height);
		imageData.data.set(output);
		bufferContext.putImageData(imageData, 0, 0);
		return bufferCanvas.toDataURL('image/png');
	}
};

var _debug_;

var brush = {
	mode: false,
	color: 'J'
};

function _test(N) {
	for (var i = 0; i < N; i++) {
		setInterval(function() {Grid.flash(_.random(0, Grid.cellCount-1))}, _.random(400, 3000))
	};
}

/* A U D I O */ 
var audio = {
	buffer: {},
	compatibility: {},
	supported: true,
	source_loop: {},
	source_once: {},
	disabled: true
};

var currentLoop = {};

var expectedLoop;

audio.stop = function(callback) {
	if(audio.source_loop._playing) {
		TweenLite.to(gainNode.gain, 0.2, {value: 0, onComplete: function() {
			audio.source_loop[audio.compatibility.stop](0);
			audio.source_loop._playing = false;
			audio.source_loop._startTime = 0;
			if (audio.compatibility.start === 'noteOn') {
				audio.source_once[audio.compatibility.stop](0);
			}
			if(typeof callback === "function") callback();
		}});
		$('.wrapper-decor').fadeOut();
	}	
	else if(typeof callback === "function") callback();
}

audio.loadLoop = function(immed, loop) {
	audio.disabled = true;
	var newLoop = {};
	if(typeof loop === 'object') {
		newLoop = loop;
	}
	else return console.log('unsupported')

	var req = new XMLHttpRequest();
	
	var expectedToken = ''+loop.original_hash+(new Date().getTime());
	expectedLoop = expectedToken;
		
	req.onload = function() {
		if(expectedToken === expectedLoop)
		audio.context.decodeAudioData(
			req.response,
			function(buffer) {
				conf.tresholdCorrection = +newLoop.treshold_correction || 0;
				audio.buffer = buffer;
				audio.source_loop = {};
				currentLoop  = newLoop;
				audio.disabled = false;
				if(immed) audio.play();
			}
		);
	};

	audio.stop(function() {
		req.open('GET', urlprefix+loop.section+'/'+loop.original_hash+'.'+fileFormat, true);
		req.responseType = 'arraybuffer';
		req.send();
	})
	
}

try {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	audio.context = new window.AudioContext();
} catch(e) {
	audio.supported = false;
}

var visualizer = {}, gainNode;

if(audio.supported) {
	(function() {
		var start = 'start',
			stop = 'stop',
			buffer = audio.context.createBufferSource();
		if (typeof buffer.start !== 'function') {
			start = 'noteOn';
		}
		audio.compatibility.start = start;
		if (typeof buffer.stop !== 'function') {
			stop = 'noteOff';
		}
		audio.compatibility.stop = stop;
	})();
	gainNode = audio.context.createGain();
	gainNode.gain.value = 1;
	visualizer = new VisualizerSample();
	gainNode.connect(visualizer.analyser);
}



audio.play = function() {
	TweenLite.to(gainNode.gain, 0, {value: 1});
	if(audio.disabled) return AllTracks.random();

	if (audio.source_loop._playing) {
		audio.stop();
		$('#playSwitcher i').removeClass('i-pause-big').addClass('i-play-big')
	} 
	else {
		$('.wrapper-decor').fadeIn();

		audio.source_loop = audio.context.createBufferSource();
		audio.source_loop.buffer = audio.buffer;
		audio.source_loop.loop = true;
		audio.source_loop.connect(gainNode);
 
		if (audio.compatibility.start === 'noteOn') {
			audio.source_once = audio.context.createBufferSource();
			audio.source_once.buffer = audio.buffer;
			audio.source_once.connect(gainNode);
			audio.source_once.noteGrainOn(0, 0, audio.buffer.duration);

			audio.source_loop[audio.compatibility.start](audio.buffer.duration);
		} else {
			audio.source_loop[audio.compatibility.start](0, 0);
		}
		audio.source_loop._playing = true;

		if(!visualizer._drawing) {
			frame(visualizer.draw.bind(visualizer));
			visualizer._drawing = true;
		}
		$('#playSwitcher i').removeClass('i-play-big').addClass('i-pause-big')
	}

	return false;
};

var frame = (function() {
return  window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function( callback ) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var conf = {
	barWidth: 850,
	barHeight: 240,
	smoothing: 0.9,
	fft_size: 512,
	treshold: 0.78,
	tresholdCorrection: 0,
	domain: 'time',
	flashProbability: 0.3,
	flashFuzziness: 0.35,
	colorAlphaTreshold: 0.5,
	association: false,
	osc: true
};

function VisualizerSample() {
	this.analyser = audio.context.createAnalyser();

	this.analyser.connect(audio.context.destination);
	this.analyser.minDecibels = -100;
	this.analyser.maxDecibels = 0;
	try {
		this.analyser.fftSize = conf.fft_size;
		$('label[for=fft_size] .indicator').removeClass('illegal')
	}
	catch(e) {
		$('label[for=fft_size] .indicator').addClass('illegal')
	}
	this.times = new Uint8Array(this.analyser.frequencyBinCount);
}

VisualizerSample.prototype.draw = function() {
	this.analyser.smoothingTimeConstant = conf.smoothing;

	if(conf.domain === 'time')
		this.analyser.getByteTimeDomainData(this.times);
	else 
		this.analyser.getByteFrequencyData(this.times);

	if(conf.osc)
		drawContext.clearRect(0,0,conf.barWidth,conf.barHeight);
	
	for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
		var value = this.times[i];
		var percent = value / 256;

		if(percent > (conf.treshold + conf.tresholdCorrection) && Math.random() < conf.flashProbability)
			Grid.fuzzyFlash(i)

		if(conf.osc) {
			var height = conf.barHeight * percent;
			var y = Math.ceil(conf.barHeight - height);
			drawContext.fillRect(i*4, y, 2, height);
		}
	}

	Grid.rareShuffle();

	frame(this.draw.bind(this));
}

VisualizerSample.prototype.getFrequencyValue = function(freq) {
	var nyquist = audio.context.sampleRate/2;
	var index = Math.round(freq/nyquist * this.freqs.length);
	return this.freqs[index];
}

function Rarity(trim) {
	this.n = 0;
	this.trim = trim;
	this.do = function(fn) {
		if(this.n >= this.trim) {
			fn();
			this.n = 0;
		}
		else this.n++;
	}
}

function handleFileDrop(evt) {
	handleFile(evt, "drop");
}
function handleFileInput(evt) {
	handleFile(evt, "input");
}

var currentCustomTrack = {
	name: null,
	ftype: null,
	buffer: null,
	blob: null
}

function handleFile(evt, type) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = (type == "drop") ? evt.dataTransfer.files : evt.target.files;
	var f = files[0];

	if (f.type.match('image.*')) {
		var reader = new FileReader();
		
		reader.onload = (function(theFile) {
			return function(e) {
				var dataUrl = e.target.result;
				toCanvas(dataUrl);
				$('#pattern-share .filename').val(f.name.match(/(.+?)\.([a-z0-9_]+$)/i)[1])
			};
		})(f);

		reader.readAsDataURL(f);
	}

	else if(f.type.match('audio.*')) {
		var reader = new FileReader();
		
		reader.onload = (function(theFile) {
			return function(e) {
				currentCustomTrack.buffer = e.target.result;
				currentCustomTrack.ftype = f.type;
				//prevent Firefox bug (decoding audio buffer empties it)
				currentCustomTrack.blob = new Blob([currentCustomTrack.buffer], { type: currentCustomTrack.ftype });
				currentCustomTrack.name = f.name.match(/(.+?)\.([a-z0-9_]+$)/i)[1];
				$('#loop-upload .filename').val(currentCustomTrack.name);
				loopEditor.add();
				audio.context.decodeAudioData(
					currentCustomTrack.buffer,
					function(buffer) {
						audio.stop(function() {
							audio.buffer = buffer;
							currentLoop.fileName = currentCustomTrack.name;
							conf.tresholdCorrection = 0;
							updateRanges('tresholdCorrection');
							audio.disabled = false;
							audio.play();
						});
					},
					function(error) {
						console.error("Ошибка при декодировании аудио", error)
					}
				);
			};
		})(f);

		reader.readAsArrayBuffer(f);
	}

	else {
		alert('Дропнутый файл не является ни картинкой, ни аудиофайлом.')
	}
	
	return false
}
function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}
function toCanvas(dataURL) {
	var imageObj = new Image();
	imageObj.onload = function() {
		bufferCanvas.height = this.height;
		bufferCanvas.width = this.width;
		bufferContext.drawImage(this, 0, 0);
		Grid.fromCanvas();
	};
	imageObj.src = dataURL;
}

function dataURItoBlob(dataURI) {
  var arr = dataURI.split(','), mime = arr[0].match(/:(.*?);/)[1];
  return new Blob([atob(arr[1])], {type:mime});
}

function TrackList(tracklist, sel, id, flat, $sortButton, sortBy, order, playEnabled, $playEnabler) {
	this.$el = $(sel);
	this.id = id;
	this.isFlat = !!flat;

	this.playEnabled = playEnabled;
	this.$playEnabler = $playEnabler;
	this.$playEnabler.addClass(this.playEnabled ? 'i-play-enabled' : 'i-play-disabled');
	this.$playEnabler.on('click', (function(ev) {
		ev.stopPropagation();
		this.playEnabled = !this.playEnabled;
		this.$playEnabler.toggleClass('i-play-enabled i-play-disabled');
		AllTracks.populate(this.id, this.flatList, this.playEnabled);
	}).bind(this))

	// builds tracklist, sorted
	this.build = function() {
		var html = '';

		if(this.isFlat) {
			html += '<div class="tracklist-section" data-flat="1" data-section="'+this.id+'" data-id="'+this.id+'">';
			html += this.buildSection(this.list, this.id);
			html += '</div>';
		}
		else
			_.each(this.list, function(section, sectIndex) {
				html += '<div class="tracklist-section" data-flat="0" data-section="'+section.sectID+'" data-id="'+this.id+'">';
				html += '<h3 class="tls-title">'+section.title+'</h3>';
				html += this.buildSection(section.contents, section.sectID);
				html += '</div>';
			}, this);
		this.$el.html(html);
		AllTracks.populate(this.id, this.flatList, this.playEnabled);
	}

	this.scrollAdded = false;

	// builds flat tracklist or its section
	this.buildSection = function(list, sectID) {
		order = (typeof this.sortOrder === 'undefined') ? true : ((typeof this.sortOrder === 'string') ? ((this.sortOrder === 'asc') ? true : false) : this.sortOrder);
		var sortedList = _.sortByOrder(list, [this.sortBy, "id"], [order, order])
		, html = ''
		, foradmin = (this.id === 'default') ? ' foradmin-show' : '';

		_.each(sortedList, function(entry) {
			if(entry) {
				var swfName = (entry.hasOwnProperty('swf') && entry.swf) ? entry.swf.split('/').reverse()[0] : false
				, swfLink = swfName ? '<a target="_blank" href="loops/swf/'+entry.swf+'" download="'+swfName+'" class="dlo-dlbutton dlb-swf" title="Скачать оригинальный SWF"><i class="i-download-menu"></i> SWF</a> ' : ''
				, swfClass = swfName ? ' with-swf' : ''
				, fresh = (entry.hasOwnProperty('fresh') && entry.fresh) ? ' fresh' : ''
				, isPlaying = (currentLoop.hasOwnProperty('original_hash') && currentLoop.original_hash === entry.original_hash) ? ' playing' : ''
				, safeName = _.escape(entry.name)
				
				html += 
				'<div class="track'+swfClass+isPlaying+fresh+'" data-name="'+safeName.toLowerCase()+'" data-hash="'+entry.original_hash+'">\
					<i class="i-play"></i>\
					<div class="track-name">'+safeName+'</div>\
					<div class="download-options">'
						+swfLink+
						'<a target="_blank" href="loops/'+sectID+'/'+entry.original_hash+'.mp3" download="'+safeName+'.mp3" class="dlo-dlbutton dlb-mp3"><i class="i-download-menu"></i> MP3</a>\
						<a target="_blank" href="loops/'+sectID+'/'+entry.original_hash+'.ogg" download="'+safeName+'.ogg" class="dlo-dlbutton dlb-ogg"><i class="i-download-menu"></i> OGG</a>\
					</div>\
					<div class="edit-options">\
						<a href="#" class="dlo-dlbutton dlb-delete"><i class="i-x-small"></i> Удалить</a>\
						<a href="#" class="dlo-dlbutton dlb-edit"><i class="i-edit"></i> Править</a>\
					</div>\
					<div class="track-duration">'+entry.duration+'</div>\
					<div class="track-options">\
						<i class="i-download-menu"></i><i class="i-burger'+foradmin+'"></i>\
					</div>\
				</div>';
			}
			
		}, this);

		return html;
	}

	// add track
	this.add = function(track) {
		track = this.processList([track])[0];
		track.fresh = true;
		if(this.isFlat) {
			this.list.push(track);
			this.flatList = this.list;
		}
		else {
			_.find(this.list, {sectID: track.section}).contents.push(track);
			this.flatList = _.flatten(_.pluck(this.list, 'contents'))
		}
		this.build();
	}

	this.edit = function(track) {
		this.del(track.original_hash, track.section_from || track.section, true);
		this.add(track);
	}

	this.del = function(ohash, section, nobuild) {
		if(typeof nobuild === 'undefined') nobuild = false;
		if(this.isFlat) 
			_.remove(this.list, {original_hash: ohash});
		else 
			_.remove(_.find(this.list, {sectID: section}).contents, {original_hash: ohash})
		_.remove(this.flatList, {original_hash: ohash});
		if(!nobuild) this.build();
	}

	this.processList = function(list) {
		return _.each(list, function(entry) {
			if(entry.hasOwnProperty('date') && !entry.date instanceof Date)
				entry.date = new Date(entry.date);
			if(entry.hasOwnProperty('duration') && !isNaN(entry.duration)) {
				var totalSecs = +entry.duration;
				var minutes = Math.floor(totalSecs/60)+'';
				if(minutes.length == 1) minutes = '0'+minutes;
				var seconds = Math.round(totalSecs%60)+'';
				if(seconds.length == 1) seconds = '0'+seconds;
				entry.duration = minutes+':'+seconds;
			}
		})
	}

	this.sortOptions = [
		['date', 'desc', 'i-newfirst', "Сначала новые"],
		['date', 'asc', 'i-oldfirst', "Сначала старые"],
		['name', 'asc', 'i-a-z', "По алфавиту"],
		['name', 'desc', 'i-z-a', "По алфавиту"],
	];

	if(this.isFlat) {
		this.list = this.processList(tracklist);
		this.flatList = this.list;
	}
	else {
		this.list = _.map(tracklist, function(section) {
			var processedSection = section;
			processedSection.contents = this.processList(section.contents);
			return processedSection;
		}, this);
		this.flatList = _.flatten(_.pluck(this.list, 'contents'))
	}

	this.sortButton = $sortButton;
	this.sortButton.on('click', (function(ev) {
		ev.stopPropagation();
		this.sort()
	}).bind(this));
	this.sortState = _.findIndex(this.sortOptions, {0: sortBy, 1: order});

	this.sort = function(sortBy, order) {
		var sort;
		if(typeof sortBy === 'undefined') 
			this.sortState++;
		else {
			if(typeof order === 'undefined') order = 'asc';
			this.sortState = _.findIndex(this.sortOptions, {0: sortBy, 1: order});
		}
		if(this.sortState < 0 || this.sortState >= this.sortOptions.length)
			this.sortState = 0;
		sort = this.sortOptions[this.sortState];
		this.sortBy = sort[0];
		this.sortOrder = sort[1];
		this.build();
		this.sortButton.removeClass(_.pluck(this.sortOptions, 2).join(' ')).addClass(sort[2]);
		this.sortButton.attr('title', sort[3]);
	}

	this.sort(sortBy, order);

	this.playTrackByHash = function(hash, disableAssociation) {
		if(typeof disableAssociation === 'undefined') disableAssociation = false;
		var track = _.filter(this.flatList, {original_hash: ''+hash})[0];
		if(track) {
			audio.loadLoop(true, track);
			$('.track').removeClass('playing');
			$('.track[data-hash='+hash+']').addClass('playing');
			if(conf.association && !disableAssociation) {
				if(+track.associated_pattern) {
					_.each(patternLibs, function(lib) {
						lib.applyPatternByID(+track.associated_pattern, true);
					})
				}
				else Grid.revert();
			}
		}
		
	}

	this.getAllHashes = function() {
		return {
			playEnabled: this.playEnabled,
			tracks: _.pluck(this.flatList, 'original_hash')
		}
	}
}

var AllTracks = {
	nameList: [], playList: [],
	populate: function(id, list, enabled) {
		var pl = _.reject(this.playList, {lib: id})
		, nl = _.reject(this.nameList, {lib: id});
		_.each(list, function(track) {
			nl.push({lib: id, hash: track.original_hash, name: track.name})
			if(enabled) pl.push({lib: id, hash: track.original_hash})
		});
		$('#loop-toassoc option[data-lib='+id+']').remove();
		this.nameList = nl;
		this.playList = pl;
		_.each(nl, function(loop) {
			$('#loop-toassoc').append('<option data-lib="'+id+'" value="'+loop.hash+'">'+loop.name+'</option>');
		})
	},
	random: function() {
		if(!this.playList.length) this.init();
		if(!this.playList.length) return;
		if(this.playList.length > 1)
			var reduced = this.playList.filter(function(item) {
				return item.hash !== currentLoop.original_hash
			});
		var newLoop = (this.playList.length > 1) ? reduced[Math.floor(Math.random() * reduced.length)] : this.playList[0];
		loopLibs[newLoop.lib].playTrackByHash(newLoop.hash);
	},
	playTrackByHash: function(hash, disableAssociation) {
		loopLibs[_.find(this.nameList, {hash: ''+hash}).lib].playTrackByHash(''+hash, disableAssociation);
	}
}

function PatternGallery(patterns, sel, id, $sortButton, sortBy, order) {
	this.$el = $(sel);
	this.id = id;

	this.processList = function(list) {
		return _.each(list, function(entry) {
				if(entry.hasOwnProperty('date') && !entry.date instanceof Date)
					entry.date = new Date(entry.date);
					entry.height = +entry.height;
					entry.width = +entry.width;
					entry.id = +entry.id;
				}
			)
	}

	this.list = this.processList(patterns);

	this.patternProbe = function(width, height) {
		var s = (width > height) ? width : height;
		if(s < 60) {
			var n = 1;
			while(s*n <= 60) 
				n++;
			n--;

			var w = n*width
			, h = n*height
			, v_offset = 60 - h
			, h_offset = 60 - w;

			return {
				up: true,
				width: w,
				height: h,
				margins: [Math.floor(v_offset/2), Math.ceil(h_offset/2), Math.ceil(v_offset/2), Math.floor(h_offset/2)]
			}
		}
		else 
			return {
				up: false,
				width: width,
				height: height
			}
	}

	this.refreshAss = function() {
		$('#pattern-toassoc option[data-lib='+this.id+']').remove();
		_.each(this.list, function(pattern) {
			$('#pattern-toassoc').append('<option data-lib="'+this.id+'" value="'+pattern.id+'">'+pattern.name+'</option>');
		}, this)
	}

	this.build = function() {
		var order = (typeof this.sortOrder === 'undefined') ? true : ((typeof this.sortOrder === 'string') ? ((this.sortOrder === 'asc') ? true : false) : this.sortOrder)
		, sortedList = _.sortByOrder(this.list, [this.sortBy, "id"], [order, order])
		, html = '<div class="gallery-section" data-section="'+this.id+'" data-id="'+this.id+'">'
		, foradmin = (this.id === 'default') ? ' foradmin-show' : '';
		
		_.each(sortedList, function(pattern) {
			var probe = this.patternProbe(pattern.width, pattern.height)
			, crisp = probe.up ? ' image-crisp' : ''
			, upstyle = probe.up ? ' style="margin: '+probe.margins.map(function(i) {return i+"px"}).join(' ')+'; width:'+probe.width+'px; height:'+probe.height+'px;"' : ''
			, src = Grid.toCanvas(pattern.string, pattern.width, pattern.height)
			, fresh = (pattern.fresh || false) ? ' fresh' : ''
			, safeName = _.escape(pattern.name)
			, foradmin = (this.id == 'default') ? ' foradmin-show' : '';
			html +=
			'<div class="pattern'+fresh+'" title="'+safeName+'" data-id="'+pattern.id+'" data-lib="'+this.id+'" data-name="'+safeName+'">\
				<img src="'+src+'" class="pattern-pic'+crisp+'"'+upstyle+' alt="'+safeName+'">\
				<div class="pattern-name">'+safeName+'</div>\
				<div class="pattern-options">\
					<a title="Править" href="#" class="pattern-menu-item pmi-left'+foradmin+'"><i class="i-edit"></i></a>\
					<a title="Скачать PNG" target="_blank" href="'+src+'" download="'+safeName+'.png" class="pattern-menu-item pmi-mid"><i class="i-download-menu"></i></a>\
					<a title="Удалить" href="#" class="pattern-menu-item pmi-right'+foradmin+'"><i class="i-x-small"></i></a>\
				</div>\
			</div>'
		}, this)

		html += '</div>';
		this.$el.html(html);

		this.refreshAss();
	}

	this.add = function(pattern) {
		pattern = this.processList([pattern])[0];
		pattern.fresh = true;
		this.list.push(pattern);
		this.build();
	}

	this.edit = function(pattern) {
		this.del(+pattern.id, true);
		this.add(pattern);
	}

	this.del = function(id, nobuild) {
		if(typeof nobuild === 'undefined') nobuild = false;
		_.remove(this.list, {id: id});
		if(!nobuild) this.build();
	}

	this.sortOptions = [
		['date', 'desc', 'i-newfirst', "Сначала новые"],
		['date', 'asc', 'i-oldfirst', "Сначала старые"],
		['name', 'asc', 'i-a-z', "По алфавиту"],
		['name', 'desc', 'i-z-a', "По алфавиту"],
	];

	this.sortButton = $sortButton;
	this.sortButton.on('click', (function(ev) {
		ev.stopPropagation();
		this.sort()
	}).bind(this));
	this.sortState = _.findIndex(this.sortOptions, {0: sortBy, 1: order});

	this.sort = function(sortBy, order) {
		var sort;
		if(typeof sortBy === 'undefined') 
			this.sortState++;
		else {
			if(typeof order === 'undefined') order = 'asc';
			this.sortState = _.findIndex(this.sortOptions, {0: sortBy, 1: order});
		}
		if(this.sortState < 0 || this.sortState >= this.sortOptions.length)
			this.sortState = 0;
		sort = this.sortOptions[this.sortState];
		this.sortBy = sort[0];
		this.sortOrder = sort[1];
		this.build();
		this.sortButton.removeClass(_.pluck(this.sortOptions, 2).join(' ')).addClass(sort[2]);
		this.sortButton.attr('title', sort[3]);
	}

	this.sort(sortBy, order);
	
	this.applyPatternByID = function(id, disableAssociation) {
		if(typeof disableAssociation === 'undefined') disableAssociation = false;
		var pattern = _.find(this.list, {id: +id});
		if(pattern) {
			if(pattern.osc) 
				Grid.setOsc(pattern.osc);
			else {
				$('#osc-sel').val('default')
			}

			if(pattern.style)
				Grid.changeStyle(pattern.style, pattern.string);
			else
				Grid.changeStyle(defaultStyle, pattern.string);
			
			if(pattern.associated_loop && conf.association && !disableAssociation)
				AllTracks.playTrackByHash(pattern.associated_loop, true);
		}
	}
}

var is_admin = false;
cheet('↑ ↑ ↓ ↓ ← → ← → b a', function () {
  $('body').toggleClass('is-admin');
  is_admin = !!!is_admin;
});

Math.log2 = Math.log2 || function(x) {
  return Math.log(x) / Math.LN2;
};
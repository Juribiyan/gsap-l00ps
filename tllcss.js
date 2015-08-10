var customPatterns = {
	nightnull: "__[#00ffff][#00ffff][#00ffff][#00ffff][#00ffff][#00ffff][#00ffff][#00ffff]__|_[#09f4fd][#09f4fd][#09f4fd][#09f4fd][#09f4fd][#09f4fd][#09f4fd][#09f4fd][#09f4fd][#09f4fd]_|[#13eafd][#13eafd][#1E4166][#1E4166][#1E4166][#1E4166][#1E4166][#1E4166][#1E4166][#13eafd][#13eafd][#13eafd]|[#1de1fd][#1de1fd][#152D47][#152D47][#152D47][#152D47][#152D47][#152D47][#1de1fd][#1de1fd][#1de1fd][#1de1fd]|[#27d7fd][#27d7fd][#1E4166][#1E4166][#1E4166][#1E4166][#1E4166][#27d7fd][#27d7fd][#1E4166][#27d7fd][#27d7fd]|[#31cefd][#31cefd][#152D47][#152D47][#152D47][#152D47][#152D47][#31cefd][#31cefd][#152D47][#31cefd][#31cefd]|[#3bc4fd][#3bc4fd][#1E4166][#1E4166][#1E4166][#1E4166][#3bc4fd][#3bc4fd][#1E4166][#1E4166][#3bc4fd][#3bc4fd]|[#45bafd][#45bafd][#152D47][#152D47][#152D47][#152D47][#45bafd][#45bafd][#152D47][#152D47][#45bafd][#45bafd]|[#4fb1fd][#4fb1fd][#1E4166][#1E4166][#1E4166][#4fb1fd][#4fb1fd][#1E4166][#1E4166][#1E4166][#4fb1fd][#4fb1fd]|[#59a7fd][#59a7fd][#152D47][#152D47][#152D47][#59a7fd][#59a7fd][#152D47][#152D47][#152D47][#59a7fd][#59a7fd]|[#639efd][#639efd][#1E4166][#1E4166][#639efd][#639efd][#1E4166][#1E4166][#1E4166][#1E4166][#639efd][#639efd]|[#6d94fd][#6d94fd][#152D47][#152D47][#6d94fd][#6d94fd][#152D47][#152D47][#152D47][#152D47][#6d94fd][#6d94fd]|[#778afd][#778afd][#1E4166][#778afd][#778afd][#1E4166][#1E4166][#1E4166][#1E4166][#1E4166][#778afd][#778afd]|[#8181fd][#8181fd][#152D47][#8181fd][#8181fd][#152D47][#152D47][#152D47][#152D47][#152D47][#8181fd][#8181fd]|[#8b77fd][#8b77fd][#8b77fd][#8b77fd][#1E4166][#1E4166][#1E4166][#1E4166][#1E4166][#1E4166][#8b77fd][#8b77fd]|[#956efd][#956efd][#956efd][#152D47][#152D47][#152D47][#152D47][#152D47][#152D47][#152D47][#956efd][#956efd]|_[#9f64FD][#9f64FD][#9f64FD][#9f64FD][#9f64FD][#9f64FD][#9f64FD][#9f64FD][#9f64FD][#9f64FD]_|__[#ab5cff][#ab5cff][#ab5cff][#ab5cff][#ab5cff][#ab5cff][#ab5cff][#ab5cff]__",
	ivy: "_____________G______________|_____________G______________|____________GgG_____________|____________GgG_____________|____________GgG_____________|____________GgG_____________|___________GgggG____________|___________GgggG____________|___________GgggG____________|__________GgggggG___________|G_________GgggggG_________G_|GG________GgggggG________GG_|_GG______GgggggggG______GG__|_GgGG____GgggggggG____GGgG__|_GgggG___GgggggggG___GgggG__|_GggggG__GgggggggG__GggggG__|__GggggGGgggggggggGGggggG___|__GgggggGGgggggggGGgggggG___|__GgggggGgGgggggGgGgggggG___|___GgggGgggGgggGgggGgggG____|___GgggGggggGgGggggGgggG____|___GgggGggggGGGggggGgggG____|___GggGggggG___GggggGggG____|____GgGgggG_____GgggGgG_____|____GgGggG_______GggGgG_____|____GgGGG_________GGGgG_____|_____GG_____________GG______|_____G_______________G______",
	n0lch_x: "__MMMMMMMM__|_MMMMMMMMMM_|MMMmmmmmmMMM|MMMMmmmmMMMM|MMmMMmmMMmMM|MMmMMmmMMmMM|MMmmMMmMmmMM|MMmmMmMMmmMM|MMmmmMMmmmMM|MMmmmMMmmmMM|MMmmMMmMmmMM|MMmmMmMMmmMM|MMmMMmmMMmMM|MMmMMmmMMmMM|MMMMmmmmMMMM|MMMmmmmmmMMM|_MMMMMMMMMM_|__MMMMMMMM__",
	thetach: "C__________C|CC________CC|CC________CC|_CCCCCCCCCC_|_CCCCCCCCCC_|CCccccccccCC|CCccccccccCC|CCccccccccCC|CCccccccccCC|CCccccccccCC|CCccccCCCCCC|CCCCCCCCCCCC|CCCCCCccccCC|CCccccccccCC|CCccccccccCC|CCccccccccCC|CCccccccccCC|CCccccccccCC|_CCCCCCCCCC_|__CCCCCCCC__",
	kolchok: "_____[#FF8800][#FF8800][#FF8800][#FF8800][#FF8800]_____|___[#FF8800][#FF8800][#FF8800][#FF8800][#FF8800][#FF8800][#FF8800][#FF8800][#FF8800]___|__[#FF8800][#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#FF8800]__|_[#FF8800][#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#FF8800]_|_[#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800]_|[#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#FF8800][#F0F0F0][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800]|[#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#F0F0F0][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800]|[#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#F0F0F0][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800]|[#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#F0F0F0][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800]|[#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#F0F0F0][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800]|_[#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800]_|_[#FF8800][#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#FF8800]_|__[#FF8800][#FF8800][#FF8800][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#F0F0F0][#FF8800][#FF8800][#FF8800]__|___[#FF8800][#FF8800][#FF8800][#FF8800][#FF8800][#FF8800][#FF8800][#FF8800][#FF8800]___|_____[#FF8800][#FF8800][#FF8800][#FF8800][#FF8800]_____",
	n0lch: "__M[#BDBDBD]M[#BDBDBD]M[#BDBDBD]M[#BDBDBD]__|__[#BDBDBD]M[#BDBDBD]M[#BDBDBD]M[#BDBDBD]M__|M[#BDBDBD]________M[#BDBDBD]|[#BDBDBD]M_____M[#BDBDBD]_[#BDBDBD]M|M[#BDBDBD]____M[#BDBDBD]M_M[#BDBDBD]|[#BDBDBD]M___M[#BDBDBD]M__[#BDBDBD]M|M[#BDBDBD]__M[#BDBDBD]M___M[#BDBDBD]|[#BDBDBD]M_M[#BDBDBD]M____[#BDBDBD]M|___[#BDBDBD]M___M___|___M___M[#BDBDBD]___|M[#BDBDBD]____M[#BDBDBD]M_M[#BDBDBD]|[#BDBDBD]M___M[#BDBDBD]M__[#BDBDBD]M|M[#BDBDBD]__M[#BDBDBD]M___M[#BDBDBD]|[#BDBDBD]M_M[#BDBDBD]M____[#BDBDBD]M|M[#BDBDBD]_[#BDBDBD]M_____M[#BDBDBD]|[#BDBDBD]M________[#BDBDBD]M|__M[#BDBDBD]M[#BDBDBD]M[#BDBDBD]M[#BDBDBD]__|__[#BDBDBD]M[#BDBDBD]M[#BDBDBD]M[#BDBDBD]M__",
	standartNull: "..JJJJJJJJ../.JJJJJJJJJJ./JJjjjjjjjJJJ/JJjjjjjjJJJJ/JJjjjjjJJjJJ/JJjjjjjJJjJJ/JJjjjjJJjjJJ/JJjjjjJJjjJJ/JJjjjJJjjjJJ/JJjjjJJjjjJJ/JJjjJJjjjjJJ/JJjjJJjjjjJJ/JJjJJjjjjjJJ/JJjJJjjjjjJJ/JJJJjjjjjjJJ/JJJjjjjjjjJJ/.JJJJJJJJJJ./..JJJJJJJJ..",
}
, defaultPattern = customPatterns.standartNull;
customPatterns.imBlue = customPatterns.standartNull.replace(/J/g, 'B').replace(/j/g, 'b');

var loops = [ 
	{fileName: 'anonymous_0chan' },
	{fileName: 'aphex_twin_windowlicker' },
	{fileName: 'better_off_alone' },
	{fileName: 'binarpilot_goof' },
	{fileName: 'chrissu_rawfull_panorama', tresholdCorrection: -0.1 },
	{fileName: 'crystal_castles_crimeware' },
	{fileName: 'culine_die_for_you' },
	{fileName: 'daft_punk_around_the_world' },
	{fileName: 'eiffel_65_im_blue' , customPattern: customPatterns.imBlue, tresholdCorrection: -0.1 },
	{fileName: 'london_elektricity_had_a_little_fight' },
	{fileName: 'massive_attack_paradise_circus_zeds_dead_rmx' },
	{fileName: 'mata_beach_sand' },
	{fileName: 'metrick_your_world' },
	{fileName: 'modified_motion_1up' },
	{fileName: 'monsta_holdin_on' },
	{fileName: 'paradise_cracked', tresholdCorrection: -0.1 },
	{fileName: 'paramyth_cowbell_rock' },
	{fileName: 'parov_stelar_the_phantom' },
	{fileName: 'scatman_john_ima_scatman' },
	{fileName: 'sigur_ros_saeglopur', tresholdCorrection: 0.7 },
	{fileName: 'the_laziest_men_on_mars_all_your_base_are_belong_to_us' },
	{fileName: 'the_prodigy_omen' },
	{fileName: 'underworld_cowgirl', tresholdCorrection: -0.1 },
	{fileName: 'kirby_gourmet_race_rmx_by_ephixa' },
	{fileName: 'smb2_overworld_theme_rmx_by_thisnameisafail' },
	{fileName: 'fukkireta', tresholdCorrection: -0.05 },
	{fileName: 'admincrack_sm_chipt0wn' , tresholdCorrection: -0.11},
	{fileName: 'cid_minimal_injection', tresholdCorrection: 0.15 },
	{fileName: 'dnb_relax', tresholdCorrection: 0.1 },
	{fileName: 'megacore', tresholdCorrection: 0.08 },
	{fileName: 'source_2007' },
	{fileName: 'space' },
	{fileName: 'RAC_aib_mertvyi_govno.ebanoe.mix_by_electrode', tresholdCorrection: 0.05 },
	{fileName: 'valles_farewell' },
	{fileName: 'nina_simone_dont_let_me_be_misunderstood_zeds_dead_rmx', tresholdCorrection: -0.05 },
	{fileName: 'dope_stars_inc_make_a_star' },
	{fileName: 'lana_dey_west_coast_ZHU_rmx', tresholdCorrection: 0.1 },
	{fileName: 'noisia_vivaldi' },
	{fileName: 'max_coveri_running_in_the_90s', tresholdCorrection: -0.05 },
	{fileName: 'IOSYS_convictor_yamaxanadu' },
	{fileName: 'rymdkraft_kantarelle' },
	{fileName: 'i_want_to_believe_tinyurl.com-q3ee6sm' },
	{fileName: 'skrillex_fire_away' },
	{fileName: 'paradise_cracked_2' },
	{fileName: '8bit_nomad' },
	{fileName: 'the_flashdub_come_horn' },
	{fileName: 'summer_of_haze_anthem_of_haze' },
	{fileName: 'tv_on_the_radio_DLZ' },
	{fileName: 'bionic_commando_rusko_rmx' },
	/*{fileName: '' },*/
	/*{fileName: '' },*/
	/*{fileName: '' },*/
];

var urlprefix = "loops/";
var fileFormat = (function() {
	var testAudio  = document.createElement("audio");
	return (typeof testAudio.canPlayType === "function" && testAudio.canPlayType("audio/ogg") !== "")
})() ? 'ogg' : 'mp3';

var pattern = localStorage['customPattern'] || defaultPattern
, isPatternCustom = false;

function readyset() {
	$canvas = $('#bars');
	drawContext = $canvas[0].getContext('2d');

	bufferCanvas = $('#bufferCanvas')[0];
	bufferContext = bufferCanvas.getContext('2d');
	
	Grid.init('#nullgrid');
	
	if(document.location.hash) 
		pattern = decodeURIComponent(document.location.hash.split('#')[1]);
	
	styles.chosen = 'modern';
	Grid.build(pattern);

	$('body').mousedown(function() {
		isMouseDown = true;
	})
	.mouseup(function() {
		isMouseDown = false;
	});

	// fill the swatches
	$('#fixed-palette .swatch').each(function() {
		var c = $(this).data('c');
		$(this).replaceWith(Grid.generateCell(c, 'under').addClass('swatch').data('act', 'swatch').attr('id', 'swatch-'+c));
	});

	// buttons
	$('body')
	.on('click', '.action-button', function() {
		actions[$(this).data('act')]();
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
	function updateRanges(name) {
		var nameSel = (typeof name === "undefined") ? '' : '[name="'+name+'"]';
		if(nameSel !== 'domain')
			$('#nerdmode input[type=range]'+nameSel).each(function() {
				var prop = $(this).attr('name');
				if(prop === 'fft_size') {
					// console.log(prop+':', conf[prop], '(2^'+Math.log2(conf[prop])+')')
					$(this).val(Math.log2(conf[prop]));
				}
				else {
					// console.log(prop+':', conf[prop])
					$(this).val(conf[prop]);
				}
				$(this).parent().find('.indicator').text(conf[prop]);
			});
		if(nameSel === 'domain' || nameSel === '') {
			$('#rb-'+conf.domain).attr('checked', 'checked');
			if(conf.domain === 'time') 
				$('#smoothingBlock').addClass('disabled')
			else 
				$('#smoothingBlock').removeClass('disabled')
		}
	};
	updateRanges();
	$('#nerdmode input[type=range]').on('input', function() {
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
			conf[prop] = $(this).val();
		updateRanges(prop);
	});
	$('#nerdmode input[name="domain"]').change(function() {
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

	document.querySelector('#nullgrid').addEventListener('dragover', handleDragOver, false);
	document.querySelector('#nullgrid').addEventListener('drop', handleFileDrop, false);

	document.querySelector('#bufferFileInput').addEventListener('change', handleFileInput, false);

	document.querySelector('#overlays').addEventListener('touchmove', function(ev) {
		_.each(ev.targetTouches, function(touch) {
			var el = document.elementFromPoint(touch.pageX, touch.pageY);
			if(el.hasOwnProperty('_tl'))
				el._tl.progress(0)
		})
	}, false)
}

var $canvas, drawContext;

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
		Grid.build(defaultPattern, 'under');
	},
	clear: function() {
		Grid.clear()
	},
	close: function() {
		Grid.exitPaintMode()
	},
	upload: function() {
		document.getElementById('bufferFileInput').click();
	},
	download: function() {
		Grid.toCanvas()
	}
}

var isMouseDown = false;



var Colors = {
	g: '#35752e', G: '#59c44d',
	y: '#7b7d25', Y: '#cccf41',
	o: '#805c22', O: '#d2993e',
	b: '#2b6d77', B: '#49b6c7',
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
	chosen: 'legacy'
}

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
	},
	generateCell: function(color, layer) {
		var char = color.split(/[\[\]]/)[1] || color.split(/[\[\]]/)[0],
		color = _.has(Colors, char) ? tinycolor(Colors[char]) : tinycolor(char)
		var style = styles[styles.chosen](color);
		if(color._format && color._a >= conf.colorAlphaTreshold) {
			if(layer == 'under')
				return $('<div data-c="'+char+'" class="cell under" style="'+style.u+'"></div>');
			else {
				var $cell = $('<div data-c="'+char+'" class="cell over" style="'+style.o+'"></div>');
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
	build: function(pattern, layer) {
		if(typeof layer === 'undefined') layer = 'both';
		pattern = pattern.replace(/\s+/g, '');
		var $cells = this.$el.find('#cells'), $overlays = this.$el.find('#overlays');
		if(layer != 'over') $cells.find('.cell, br').remove();
		if(layer != 'under') $overlays.find('.cell, br').remove();
		var lines = pattern.split(/[|\/]/);
		_.each(lines, function(line, li) {
			var chars = _.compact(line.split(colorMatch));
			_.each(chars, function(char, ci) {
				if(layer != 'over')
					Grid.generateCell(char, 'under').attr('id', 'cu_'+li+'_'+ci).appendTo($cells)
				if(layer != 'under')
					Grid.generateCell(char, 'over').attr('id', 'co_'+li+'_'+ci).appendTo($overlays)
			}) // /each
			if(layer != 'over')
				$('<br>').appendTo($cells)
			if(layer != 'under')
				$('<br>').appendTo($overlays)
		})
		//initial blink
		if(layer != 'under')
			$('.over').each(function() {
				var color = this.style.backgroundColor,
				darken = tinycolor(color).darken(30)/*.setAlpha(0.1)*/.toRgbString();
				this._tl.to(this, 0.1, {
					opacity: 1,
					boxShadow: color+' 0px 0px 2px 2px, '+color+' 0px 0px 10px 10px, '+darken+' 0px 0px 9px 9px',
				}).to(this, 0.4, {
					opacity: 0,
					boxShadow: color+' 0px 0px 0px 0px, '+color+' 0px 0px 0px 0px, '+darken+' 0px 0px 0px 0px',
				})
			})
		this.recount();
	},
	enterPaintMode: function() {
		$('#overlays').empty();
		$('#controls').fadeOut();
		$('#editmode').slideDown();
		$('#nerdmode').slideUp();
		audio.stop();
		$('#cells').on('mouseenter mousedown', '.cell', function(ev) {
			if(!brush.mode || (ev.type == 'mouseenter' && !isMouseDown)) return;
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
					if(!$('#dynamic-palette [data-c='+color+']').length) {
						$('#dynamic-palette').prepend(Grid.generateCell(color, 'under').addClass('swatch').data('act', 'swatch').attr('id', 'swatch-'+color));
					}
				}
			}
			else {
				var id = $(this).attr('id');
				var color = (brush.mode === 'eraser') ? '_' : brush.color;
				$(this).replaceWith(Grid.generateCell(color, 'under').attr('id', id));
				if(!_.has(Colors, color) && !$('#dynamic-palette [data-c='+color+']').length) 
					$('#dynamic-palette').prepend(Grid.generateCell(color, 'under').addClass('swatch').data('act', 'swatch').attr('id', 'swatch-'+color));
			}
		});
		this.$el.parent().addClass('edit-mode');
		$('.triangle-group').slideDown();
	},
	brush: false,
	exitPaintMode: function() {
		$('#cells').off();
		var newPattern = this.getPattern();
		this.build(newPattern, 'over');
		this.$el.parent().removeClass('edit-mode');
		$('.triangle-group').slideUp();
		pattern = newPattern;
		localStorage.setItem('customPattern', newPattern);
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
	recount: function() {
		this.cells = document.querySelectorAll('.cell.over'); 
		this.reshuffle();
		this.cellCount = this.cells.length;
		this.trimmingConstant = Math.floor(Math.sqrt(this.cellCount));
		this.primaryColor = (function(cc) {return _.invert(cc)[_.max(cc)]})(_.countBy(_.pluck(_.pluck(this.cells, 'dataset'), 'c')));
		drawContext.fillStyle = _.has(Colors, this.primaryColor) ? Colors[this.primaryColor] : tinycolor(this.primaryColor).toHexString();
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
	toCanvas: function() {
		bufferCanvas.width = this.width;
		bufferCanvas.height = this.height;
		var pattern = this.getPattern();
		var output = new Uint8ClampedArray(this.width * this.height * 4);
		var i=0, j;
		var lines = pattern.split(/[|\/]/);
		_.each(lines, function(line, li) {
			var chars = _.compact(line.split(colorMatch));
			_.each(chars, function(char, ci) {
				var color = _.has(Colors, char) ? tinycolor((Colors[char] == "_VOID_") ? 'rgba(0,0,0,0)': Colors[char]) : tinycolor(char.replace(/[\[\]]/g, ''));
				j = i*4;
				output[j] = color._r;
				output[j+1] = color._g;
				output[j+2] = color._b;
				output[j+3] = color._a*255;
				i++;
			})
		})
		bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
		bufferContext.putImageData(new ImageData(output, this.width, this.height), 0, 0);
		$('#bufferLink').attr('href', bufferCanvas.toDataURL('image/png'))[0].click();
	}
};

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

audio.stop = function(callback) {
	// console.log('Audio stop, audio.disabled = ')
	// if(audio.disabled) return;
	if(audio.source_loop._playing)
		TweenLite.to(gainNode.gain, 0.2, {value: 0, onComplete: function() {
			// console.log('Audio stopped!')
			audio.source_loop[audio.compatibility.stop](0);
			audio.source_loop._playing = false;
			audio.source_loop._startTime = 0;
			if (audio.compatibility.start === 'noteOn') {
				audio.source_once[audio.compatibility.stop](0);
			}
			if(typeof callback === "function") callback();
		}})
	else if(typeof callback === "function") callback();
	$('.wrapper-decor').fadeOut();
}

audio.loadLoop = function(immed, n) {
	// console.log('Audio load loop, immed=', immed)
	audio.disabled = true;
	var newLoop = {};
	if(typeof n === 'number' && n < loops.length && n >= 0) {
		newLoop = loops[n];
	}
	else {
		var reduced = (loops.length == 1) ? loops : loops.filter(function(e){return e.fileName!==currentLoop.fileName});
		newLoop = reduced[Math.floor(Math.random() * reduced.length)];
		if(newLoop.hasOwnProperty('customPattern')) {
			Grid.build(newLoop.customPattern);
			isPatternCustom = true;
		}
		else if(isPatternCustom) {
			Grid.build(pattern);
			isPatternCustom = false;
		}
	}

	var req = new XMLHttpRequest();
	$('#playSwitcher').text('Loading...').off();
	// req.responseType = 'arraybuffer';
		
	req.onload = function() {
		$('#playSwitcher').text('Вкл/Выкл музыку').click(audio.play);
		audio.context.decodeAudioData(
			req.response,
			function(buffer) {
				conf.tresholdCorrection = newLoop.tresholdCorrection || 0;

				audio.buffer = buffer;
				audio.source_loop = {};
				currentLoop  = newLoop;
				audio.disabled = false;
				if(immed) audio.play();
			}
		);
	};

	audio.stop(function() {
		req.open('GET', urlprefix+newLoop.fileName+'.'+fileFormat, true);
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
	audio.loadLoop(false);
	gainNode = audio.context.createGain();
	gainNode.gain.value = 1;
	visualizer = new VisualizerSample();
	gainNode.connect(visualizer.analyser);
}



audio.play = function() {
	// console.log('Audio play')
	TweenLite.to(gainNode.gain, 0, {value: 1});
	if(audio.disabled) return;

	if (audio.source_loop._playing) {
		audio.stop();
		audio.loadLoop(false);
	} 
	else {
		$('.wrapper-decor').fadeIn();
		console.info('Current track: '+currentLoop.fileName);

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
	colorAlphaTreshold: 0.5
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
	// this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
}

var shuffler

VisualizerSample.prototype.draw = function() {
	this.analyser.smoothingTimeConstant = conf.smoothing;

	if(conf.domain === 'time')
		this.analyser.getByteTimeDomainData(this.times);
	else 
		this.analyser.getByteFrequencyData(this.times);

	drawContext.clearRect(0,0,conf.barWidth,conf.barHeight);
	
	for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
		var value = this.times[i];
		var percent = value / 256;

		/*var freq_value = this.freqs[i];
		var freq_percent = freq_value / 256;*/

		// Bind style
		/*var pn = (percent > conf.treshold ? (percent-conf.treshold)*(1/conf.treshold) : 0)*0.2;
		if(i < Grid.cellCount)
			Grid.cells[i]._tl.progress(pn)*/

		// Old style
		/*if(percent > conf.treshold && !(i % Grid.trimmingConstant)) {
			Grid.flash(i + Math.floor(Math.random()*Grid.trimmingConstant))
		}*/

		// Simple style (no trimming)
		/*if(percent > conf.treshold)
		Grid.flash(i)*/

		//TODO: apply probabilty by percent
		if(percent > (conf.treshold + conf.tresholdCorrection) && Math.random() < conf.flashProbability)
		// if(percent > conf.treshold && Math.random()*(percent-conf.treshold) > conf.flashProbability)
			Grid.fuzzyFlash(i)

		/*rare.do(function() {
			if(percent > conf.treshold)
				Grid.flash(i)
		})*/

		var height = conf.barHeight * percent;
		var y = Math.ceil(conf.barHeight - height);
		drawContext.fillRect(i*4, y, 2, height);
	}

	Grid.rareShuffle();

	// if(audio.source_loop._playing) {
	frame(this.draw.bind(this));
	// }
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

function handleFile(evt, type) {
	evt.stopPropagation();
	evt.preventDefault();

  var files = (type == "drop") ? evt.dataTransfer.files : evt.target.files;
  var f = files[0];

  if (!f.type.match('image.*')) return false

  var reader = new FileReader();
	
  reader.onload = (function(theFile) {
    return function(e) {
      var dataUrl = e.target.result;
      toCanvas(dataUrl)
    };
  })(f);

  reader.readAsDataURL(f);
  return false
}
function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
function toCanvas(dataURL) {

  // load image from data url
  var imageObj = new Image();
  imageObj.onload = function() {
  	bufferCanvas.height = this.height;
  	bufferCanvas.width = this.width;
    bufferContext.drawImage(this, 0, 0);
    Grid.fromCanvas();
  };

  imageObj.src = dataURL;
}

function downloadURI(uri, name) 
{
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();
}
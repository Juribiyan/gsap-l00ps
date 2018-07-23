<?php
session_start();

require 'common_config.php';

// pass configuration to client
if(isset($_GET['check'])) {
	exit(json_encode(array(
		"max_loop_fszkb" => MAX_LOOP_FSZKB,
		"max_filename_length" => NAME_TRUNC,
		"max_delpass_length" => DELPASS_TRUNC
	)));
}

if(empty($_POST['action']) || empty($_POST['datatype']) || !in_array($_POST['action'], array("add", "delete", "edit")) || !in_array($_POST['datatype'], array("loop", "pattern")))
	retreat('bad_input', "Ну а вообще, как дела?");

$warning = '';

$section = $_POST['section'];
$pass = $_POST['delpass'];
$date = $_POST['date'];
$swf = $_POST['swf'];

$associated_pattern = $_POST['associated_pattern'];
$associated_loop = $_POST['associated_loop'];

$pattern_string = $_POST['pattern_string'];

if(empty($_POST['delpass']))
	retreat('bad_input', "Пароль не может быть пустым.");

/* ============== Check analyzer settings ============== */
// Frequency range
$freq = explode(',', $_POST['freq']);
if (
	!((int)($freq[0]) || $freq[0]=='0')
	||
	!((int)($freq[1]) || $freq[1]=='0')
	||
	$freq[1] <= $freq[0]
	||
	$freq[0] < 0
	||
	$freq[1] > 24000
) retreat('bad_freq', 'Неверно задан частотный диапазон.');
// Dynamic range
$db = explode(',', $_POST['db']);
if (
	!((int)($db[0]) || $db[0]=='0')
	||
	!((int)($db[1]) || $db[1]=='0')
	||
	$db[1] <= $db[0]
	||
	$db[0] < -200
	||
	$db[1] > 0
) retreat('bad_db', 'Неверно задан динамический диапазон.');
// Smoothing
$smoothing = $_POST['smoothing'];
if (
	!((float)$smoothing || $smoothing=='0')
	||
	$smoothing > 1
	||
	$smoothing < 0
) retreat('bad_smoothing', 'Неверно задано сглаживание.');
// Treshold
$treshold = $_POST['treshold'];
if (
	!(float)$treshold
	||
	$treshold > 3
	||
	$treshold < 0.5
) retreat('bad_treshold', 'Неверно задан порог.');

/* Check captcha */
if(!isset($_POST['captcha']))
	retreat('enter_captcha', "Введите капчу");
if(!CheckCaptcha($_POST['captcha']))
	retreat('whrong_captcha', "Капча введена неверно");


$masterpass = hash('sha256', MASTER_PASS.SALT);
$pass = hash('sha256', $_POST['delpass'].SALT);

if($pass == $masterpass && $_POST['is_admin']) 
	$is_admin = true;
else {
	if(in_array($_POST['section'], array('dead', 'live', 'default')))
		retreat('bad_auth', "Неверный пароль администратора.");
	if(isset($date)) {
		$warning .= "У вас нет прав на изменение даты. ";
		unset($date);
	}
	if(isset($swf)) {
		$warning .= "У вас нет прав на изменение SWF. ";
		unset($swf);
	}
	$section = 'custom';
}

if(empty($section)) $section = 'custom';


if(CONFIG_ENVIRONMENT == 'instant')
	require __DIR__.'/../config.php';
else
	require 'standalone_config.php';
$tc_db->SetFetchMode(ADODB_FETCH_ASSOC);
putenv('PATH=' . getenv('PATH') . PATH_SEPARATOR . KU_FFMPEGPATH);
mb_internal_encoding("UTF-8");


/* Truncate long strings */
$name = mb_substr($_POST['name'], 0, NAME_TRUNC);
if($name != $_POST['name'])
	$warning .= 'Имя файла было укорочено. ';

/* ADD LOOP */
if($_POST['action'] == "add" && $_POST['datatype'] == 'loop') {
	/* Check input */
	if(empty($_FILES['loop']))
		retreat('bad_input', "Похоже, загружен пустой луп.");
	if(empty($name))
		retreat('bad_input', "Имя не может быть пустым.");

	/* Check if filename taken */
	/* Note: MySQL selects for varchar are case insensitive */
	$existing = $tc_db->GetAll('SELECT * FROM `'.LOOPS_DBNAME.'` WHERE `name`=?', array($name));
	if($existing && !empty($existing)) {
		$existing = $existing[0];
		if($pass != $existing['delpass'] && !$is_admin)
			retreat('name_taken', "Имя трека занято.");
	}

	if($associated_pattern) {
		$pattern_exists = $tc_db->GetOne('SELECT `name` FROM `'.PATTERNS_DBNAME.'` WHERE `id`=?', array($associated_pattern));
		if(!$pattern_exists) {
			$warning .= "Не удалось ассоциировать с паттерном «".$associated_pattern."», отсутствующим в базе данных.";
			unset($associated_pattern);
		}
	}

	$loop = $_FILES['loop']['tmp_name'];

	/* Check file's hash */
	$original_hash = hash_file('crc32b', $loop);
	$samehash = $tc_db->GetAll('SELECT * FROM `'.LOOPS_DBNAME.'` WHERE `original_hash`= ? OR `mp3_hash`= ? OR `ogg_hash`= ?', 
		array($original_hash, $original_hash, $original_hash));

	/* Check if file already exists */
	if($samehash && !empty($samehash)) {
		$samehash = $samehash[0];
		if(!$is_admin && $samehash['delpass'] != $pass)
			retreat('hash_error', 'Луп уже существует под названием «'.$samehash['name'].'».');
		else
			retreat('prompt_edit', 'Луп уже существует под названием «'.$samehash['name'].'».', json_encode($samehash));
	}

	/* Anal probe */
	$fileinfo = loop_probe();

	/* Prepare insert */
	$fields = array(
		'section',
		'name',
		'delpass',
		'duration',
		'original_hash',
		'mp3_hash',
		'ogg_hash',
		'freq',
		'db',
		'smoothing',
		'treshold'
	);
	$qms = array();
	$values = array(
		$section,
		$name,
		$pass,
		$fileinfo["duration"],
		$original_hash,
		$fileinfo["mp3_hash"],
		$fileinfo["ogg_hash"],
		implode('~', $freq),
		implode('~', $db),
		$smoothing,
		$treshold
	);
	if($associated_pattern) {
		$fields []= 'associated_pattern';
		$values []= $associated_pattern;
	}
	if($is_admin) {
		if(isset($date)) {
			$fields []= 'date';
			$values []= $date;
		}
		if(isset($swf)) {
			$fields []= 'swf';
			$values []= $swf;
		}
	}
	foreach ($fields as &$f) { 
		$f = "`$f`"; 
		$qms []= '?';
	} unset($f);

	/* Insert entry into DB */
	$insert_result = $tc_db->Execute('INSERT INTO `'.LOOPS_DBNAME.'` ('.implode(', ', $fields).') VALUES ('.implode(', ', $qms).')', $values);

	if(!$insert_result || $tc_db->Affected_Rows() < 1)
		retreat('mysql_error', 'Ошибка при записи в базу данных');
	$id = $tc_db->Insert_ID();
	if(!$date)
		$date = $tc_db->GetOne('SELECT `date` FROM `'.LOOPS_DBNAME.'` WHERE `id`=?', array($id));
	$ret = array(
		"error" => false,
		"success" => 'loop_add',
		"warning" => $warning ? $warning : null,
		"loop" => array(
			"name" => $name,
			"original_hash" => $original_hash,
			"section" => $section,
			"duration" => $fileinfo["duration"],
			"date" => $date,
			"freq" => $freq,
			"db" => $db,
			"smoothing" => $smoothing,
			"treshold" => $treshold,
			"associated_pattern" => $associated_pattern,
			"swf" => $swf ? $swf : null,
			"id" => $id
		)
	);

	update_loops_json_file($section);

	exit(json_encode($ret));
}

function loop_probe() {
	global $is_admin, $pass, $tc_db, $loop, $original_hash, $section;

	$loop4shell = escapeshellarg($loop);
	$x=1;  exec('ffprobe -v quiet -i '.$loop4shell.' -print_format json -show_format 2>&1', $probe, $x);
	if($x != 0)
		retreat('transcode_error', 'FFMprobe выдал ошибку при зондировании файла');
	var_dump($probe);
	$result = json_decode(implode('', $probe), true);
	if(!$result)
		retreat('transcode_error', 'FFProbe не может обработать файл.');
	if(!empty($result['error']))
		retreat('transcode_error', 'FFProbe выдал ошибку #'.$result['error']['code'].': '.$result['error']['string']);
	if(!empty($result['format'])) {
		$format = $result['format'];

		/* Check duration */
		$duration = (float)$format['duration'];
		if($duration == 0)
			retreat('bad_loop', 'Длительность трека определена равной 0 секунд');
		if(!$is_admin && $duration > MAX_LOOP_LENGTH)
			retreat('bad_loop', 'Превышена максимальная продолжительность лупа: ('.MAX_LOOP_LENGTH.' секунд)');

		/* Check file size */
		$fsize_kb = (int)$format['size'] / 1024;
		if(!$is_admin && $fsize_kb > MAX_LOOP_FSZKB)
			retreat('bad_loop', 'Превышен максимальный размер файла ('.(MAX_LOOP_FSZKB / 1024).' МБ)');

		/* Okay fine */
		if($format['format_name'] != "mp3") {
			$mp3_path = 'loops/'.$section.'/'.$original_hash.'.mp3';
			$x=1; exec('ffmpeg -y -i '.$loop4shell.' -loglevel error -q:a '.MP3_Q.' '.escapeshellarg($mp3_path).' 2>&1', $mp3_enc_res, $x);
			if($x != 0 || !empty($mp3_enc_res))
				retreat('transcode_error', 'FFMpeg выдал ошибку при кодировании в MP3: \n'.implode('\n', $mp3_enc_res));
			$mp3_hash = hash_file('crc32b', $mp3_path);
			$samehash = $tc_db->GetOne('SELECT `name` FROM `'.LOOPS_DBNAME.'` WHERE `original_hash`= ? OR `mp3_hash`= ?', array($mp3_hash, $mp3_hash));
			if($samehash)
				retreat('hash_error', 'Луп уже существует под названием «'.$samehash.'».');
		}
		if($format['format_name'] != "ogg") {
			$ogg_path = 'loops/'.$section.'/'.$original_hash.'.ogg';
			$x=1; exec('ffmpeg -y -i '.$loop4shell.' -loglevel error -q:a '.OGG_Q.' '.escapeshellarg($ogg_path).' 2>&1', $ogg_enc_res, $x);
			if($x != 0 || !empty($ogg_enc_res))
				retreat('transcode_error', 'FFMpeg выдал ошибку при кодировании в OGG: \n'.implode('\n', $ogg_enc_res));
			$ogg_hash = hash_file('crc32b', $ogg_path);
			$samehash = $tc_db->GetOne('SELECT `name` FROM `'.LOOPS_DBNAME.'` WHERE `original_hash`= ? OR `ogg_hash`= ?', array($ogg_hash, $ogg_hash));
			if($samehash)
				retreat('hash_error', 'Луп уже существует под названием «'.$samehash.'».');
		}
		if(in_array($format['format_name'], array("mp3", "ogg"))) {
			$upload_result = move_uploaded_file($loop, 'loops/'.$section.'/'.$original_hash.'.'.$format['format_name']);
			${$format['format_name'].'_hash'} = $original_hash;
			if(!$upload_result)
				retreat('transcode_error', 'Ошибка при сохранении файла '.$original_hash.'.'.$format['format_name']);
		}
		return array(
			"mp3_hash" => $mp3_hash,
			"ogg_hash" => $ogg_hash,
			"duration" => $duration
		);
	}
}

/* EDIT LOOP */
if($_POST['action'] == "edit" && $_POST['datatype'] == 'loop') {
	if(!isset($_POST['original_hash']))
		retreat('bad_input', 'Не указан идентификатор лупа.');
	$ohash = $_POST['original_hash'];

	$loop_toedit = $tc_db->GetAll('SELECT * FROM `'.LOOPS_DBNAME.'` WHERE `original_hash`=?', array($ohash));
	if($loop_toedit && !empty($loop_toedit)) {
		$loop_toedit = $loop_toedit[0];
		if($pass != $loop_toedit['delpass'] && !$is_admin)
			retreat('bad_auth', "Неверный пароль для редактирования трека.");
		// take ownership
		if($is_admin && $loop_toedit['delpass'] != $pass && $_POST['take_ownership']) {
			$keys []= 'delpass';
			$values [] = $masterpass;
			$changes []= 'Луп взят под контроль администратора';
		}
		if($loop_toedit['name'] != $name) {
			$existing_name = $tc_db->GetOne('SELECT COUNT(1) FROM `'.LOOPS_DBNAME.'` WHERE `name`=?', array($name));
			if($existing_name)
				retreat('name_taken', 'Имя трека занято');
			$keys []= 'name';
			$values [] = $name;
			$changes []= 'Имя трека «'.$loop_toedit['name'].'» изменено на «'.$name.'»';
		}

		$freq_i = implode('~', $freq);
		if($loop_toedit['freq'] != $freq_i) {
			$keys []= 'freq';
			$values []= $freq_i;
			$freq_old = explode('~', $loop_toedit['freq']);
			$changes []= 'Частотный диапазон изменен с ['.$freq_old[0].'...'.$freq_old[1].'] на ['.$freq[0].'...'.$freq[1].']';
		}
		$db_i = implode('~', $db);
		if($loop_toedit['db'] != $db_i) {
			$keys []= 'db';
			$values []= $db_i;
			$db_old = explode('~', $loop_toedit['db']);
			$changes []= 'Динамический диапазон изменен с ['.$db_old[0].'...'.$db_old[1].'] на ['.$db[0].'...'.$db[1].']';
		}
		if($loop_toedit['smoothing'] != $smoothing) {
			$keys []= 'smoothing';
			$values []= $smoothing;
			$changes []= 'Степень сглаживания изменена с '.$loop_toedit['smoothing'].' на '.$smoothing;
		}
		if($loop_toedit['treshold'] != $treshold) {
			$keys []= 'treshold';
			$values []= $treshold;
			$changes []= 'Уровень порога изменен с '.$loop_toedit['treshold'].' на '.$treshold;
		}

		if($associated_pattern && $loop_toedit['associated_pattern'] != $associated_pattern) {
			$pattern_exists = $tc_db->GetOne('SELECT `name` FROM `'.PATTERNS_DBNAME.'` WHERE `id`=?', array($associated_pattern));
			if(!$pattern_exists) {
				$warning .= "Не удалось ассоциировать с паттерном «".$associated_pattern."», отсутствующим в базе данных.";
				unset($associated_pattern);
			}
			$keys []= 'associated_pattern';
			$values []= $associated_pattern;
			$changes []= 'Установлена ассоциация с паттерном «'.$pattern_exists.'»'; //TODO: CHECK EXISTING PATTERN
		}
		if($is_admin && $section && $loop_toedit['section'] != $section) {
			$keys []= 'section';
			$values [] = $section;
			$changes []= 'Луп перемещен из секции «'.$loop_toedit['section'].'» в «'.$section.'»';
			$section_move = $loop_toedit['section'];
		}
		else $section = $loop_toedit['section'];
		if($date && $loop_toedit['date'] != $date) {
			$keys []= 'date';
			$values []= $date;
			$changes []= 'Установлена новая дата добавления лупа: '.$date;
		}
		if($swf && $loop_toedit['swf'] != $swf) {
			$keys []= 'swf';
			$values []= $swf;
			$changes []= 'Установлена ссылка на SWF: "'.$swf.'"';
		}

		if(count($keys)) {
			foreach($keys as &$key) {
				$key = '`'.$key.'`=?';
			}
			$values []= $ohash; 

			/* Move file if needed 'Луп перемещен из секции «'.$loop_toedit['section'].'» в «'.$section.'»' */
			if($section_move) {
				$move_mp3 = rename('loops/'.$section_move.'/'.$ohash.'.mp3', 'loops/'.$section.'/'.$ohash.'.mp3');
				$move_ogg = rename('loops/'.$section_move.'/'.$ohash.'.ogg', 'loops/'.$section.'/'.$ohash.'.ogg');
				if(!$move_mp3 || !$move_ogg)
					retreat('filemove_error', 'Не удалось переместить файл');
			}

			$insert_result = $tc_db->Execute('UPDATE `'.LOOPS_DBNAME.'` SET '.implode(', ', $keys).' WHERE `original_hash`=?', $values);
			if(!$insert_result || $tc_db->Affected_Rows() < 1)
				retreat('mysql_error', 'Ошибка при записи в базу данных');

			$loop_toreflect = $tc_db->GetAll("SELECT `section`, `name`, `date`, `duration`, `freq`, `db`, `treshold`, `smoothing`, `swf`, `id`,`associated_pattern` FROM `".LOOPS_DBNAME."` WHERE `original_hash`=?", array($ohash));
			if($loop_toreflect && !empty($loop_toreflect)) {
				$loop_toreflect = $loop_toreflect[0];
				$loop_toreflect['freq'] = explode('~', $loop_toreflect['freq']);
				$loop_toreflect['db'] = explode('~', $loop_toreflect['db']);
			}
			else
				retreat('mysql_error', 'Ошибка при записи в базу данных');

			$loop_toreflect['original_hash'] = $ohash;
			if($section_move)
				$loop_toreflect['section_from'] = $section_move;
			
			$ret = array(
				"error" => false,
				"success" => 'loop_edit',
				"name" => $name,
				"changes" => $changes,
				"warning" => $warning,
				"loop" => $loop_toreflect
			);

			/* update tracklist JSON */
			if($section == 'custom' || $lib_moveto) 
				update_loops_json_file('custom');
			
			if($section !== 'custom' || $lib_moveto) 
				update_loops_json_file('default');

			exit(json_encode($ret));

		}
		else retreat('no_changes', 'Изменений не обнаружено');
	}
	else retreat('bad_input', 'Неверный идентификатор лупа');
}

/* DELETE LOOP */
if($_POST['action'] == "delete" && $_POST['datatype'] == 'loop') {
	if(!isset($_POST['original_hash']))
		retreat('bad_input', 'Не указан идентификатор лупа.');
	$ohash = $_POST['original_hash'];
	$loop_todelete = $tc_db->GetAll('SELECT `section`,`delpass` FROM `'.LOOPS_DBNAME.'` WHERE `original_hash`=?', array($ohash));
	if(!$loop_todelete || empty($loop_todelete))
		retreat('bad_input', 'Неверный идентификатор лупа');
	$loop_todelete = $loop_todelete[0];
	if($pass !== $loop_todelete['delpass'] && !$is_admin)
		retreat('bad_auth', "Неверный пароль для удаления трека.");
	$tc_db->Execute('DELETE FROM `'.LOOPS_DBNAME.'` WHERE `original_hash`=?', array($ohash));

	$section = $loop_todelete['section'];

	if($tc_db->Affected_Rows() < 1)
		retreat('mysql_error', 'Ошибка при удалении записи из базы данных');
	$ret = array(
		"error" => false,
		"success" => 'loop_delete',
		"loop" => array(
			"section" => $section,
			"original_hash" => $ohash
		)
	);

	try {
		unlink('loops/'.$section.'/'.$ohash.'.mp3');
		unlink('loops/'.$section.'/'.$ohash.'.ogg');
	} catch (Exception $e) {
		$ret['warning'] = 'Ошибка при удалении файла';
	}

	/* update tracklist JSON */
	if($section == 'custom') 
		update_loops_json_file('custom');
	else update_loops_json_file('default');
	
	exit(json_encode($ret));
}


function update_loops_json_file($section) {
	global $tc_db;

	$sect_condition = ($section == 'custom') ? "`section`='custom'" : "`section`='dead' OR `section`='live'";
	$json_filename = ($section == 'custom') ? 'custom_loops.json' : 'default_loops.json';
	$alltracks = $tc_db->GetAll("SELECT `section`, `name`, `original_hash`, `date`, `duration`, `freq`, `db`, `treshold`, `smoothing`, `swf`, `id`,`associated_pattern` FROM `".LOOPS_DBNAME."` WHERE ".$sect_condition." ORDER BY `id` ASC");
	$tracklist = fopen($json_filename, 'w');
	fwrite($tracklist, json_encode($alltracks));
	fclose($tracklist);
}

function update_patterns_json_file($section) {
	global $tc_db;

	$sect_condition = "`section`='".$section."'";
	$json_filename = $section.'_patterns.json';
	$allpatterns = $tc_db->GetAll("SELECT `name`, `string`, `width`, `height`, `id`, `date`,`associated_loop`, `style`, `osc` FROM `".PATTERNS_DBNAME."` WHERE ".$sect_condition." ORDER BY `id` ASC");
	$gallery = fopen($json_filename, 'w');
	fwrite($gallery, json_encode($allpatterns));
	fclose($gallery);
}

$pattern = $_POST['pattern'];
$style = $_POST['style'];
$osc = $_POST['osc'];

/* ADD PATTERN */
if($_POST['action'] == "add" && $_POST['datatype'] == 'pattern') {
	/* Check input */
	if(empty($pattern_string))
		retreat('bad_input', "Похоже, загружен пустой паттерн.");
	if(empty($name))
		retreat('bad_input', "Имя не может быть пустым.");

	$pattern = pattern_probe($pattern_string);
	if(!$pattern)
		retreat('bad_pattern', 'Паттерн повреждён');

	if($pattern['height'] > MAX_SIZE || $pattern['width'] > MAX_SIZE)
		retreat('too_big', 'Размер паттерна превышает '.MAX_SIZE.' по одному из измерений');

	$existing = $tc_db->GetOne("SELECT `name` FROM `".PATTERNS_DBNAME."` WHERE `string`=?", array($pattern['pattern']));
	if($existing)
		retreat('pattern_exists', 'Паттерн уже существует под названием «'.$existing.'»');
	$name_taken = $tc_db->GetOne("SELECT COUNT(1) FROM `".PATTERNS_DBNAME."` WHERE `name`=?", array($name));
	if($name_taken)
		retreat('name_taken', 'Имя паттерна занято');

	$fields = array('`name`', '`string`', '`width`', '`height`', '`section`', '`delpass`');
	$qms = "?,?,?,?,?,?";
	$values = array($name, $pattern['pattern'], $pattern['width'], $pattern['height'], $section, $pass);

	if($associated_loop) {
		$loop_exists = $tc_db->GetOne('SELECT COUNT(1) FROM `'.LOOPS_DBNAME.'` WHERE `original_hash`=?', array($associated_loop));
		if($loop_exists) {
			$fields []= '`associated_loop`';
			$qms .= ',?';
			$values []= $associated_loop;
		}
		else 
			$warning .= "Не удалось ассоциировать с лупом #".$associated_loop.", отсутствующим в базе данных. ";
	}

	if($is_admin) {
		if(isset($date)) {
		  $fields []= '`date`';
		  $qms .= ',?';
		  $values []= $date;
		}
	}

	if($style) {
		if(in_array($style, $cell_styles)){
			$fields []= '`style`';
			$qms .= ',?';
			$values []= $style;
		}
		else $warning .= 'Неверный формат стиля ячеек. ';
	}

	if($osc) {
		if(($osc=='off' || (strlen($osc) === 6 && intval($osc, 16)) )) {
			$fields []= '`osc`';
			$qms .= ',?';
			$values []= $osc;
		}
		else $warning .= 'Неверный формат цвета осциоллоскопа. ';
	}

	$insert_result = $tc_db->Execute("INSERT INTO `".PATTERNS_DBNAME."` (".implode(', ', $fields).") VALUES (".$qms.")", $values);
	if(!$insert_result || $tc_db->Affected_Rows() < 1)
		retreat('mysql_error', 'Ошибка при записи в базу данных');
	
	$id = $tc_db->Insert_ID();
	if(!$date)
		$date = $tc_db->GetOne('SELECT `date` FROM `'.PATTERNS_DBNAME.'` WHERE `id`=?', array($id));

	$ret = array(
		"error" => false,
		"success" => 'pattern_add',
		"pattern" => array(
			"name" => $name,
			"string" => $pattern['pattern'],
			"width" => $pattern['width'],
			"height" => $pattern['height'],
			"section" => $section,
			"date" => $date,
			"id" => $id,
			"osc" => $osc,
			"style" => $style
		),		
		"warning" => $warning
	);

	/* update tracklist JSON */
	if($section == 'custom') 
		update_patterns_json_file('custom');
	
	if($section !== 'custom') 
		update_patterns_json_file('default');
	
	exit(json_encode($ret));
}

/* EDIT PATTERN */
if($_POST['action'] == "edit" && $_POST['datatype'] == 'pattern') {
	if(!isset($_POST['pattern_id']))
	  retreat('bad_input', 'Не указан идентификатор паттерна.');
	$id = $_POST['pattern_id'];

	$pattern_toedit = $tc_db->GetAll('SELECT * FROM `'.PATTERNS_DBNAME.'` WHERE `id`=?', array($id));
	if($pattern_toedit && !empty($pattern_toedit)) {
		$pattern_toedit = $pattern_toedit[0];
		if($pass != $pattern_toedit['delpass'] && !$is_admin)
		  retreat('bad_auth', "Неверный пароль для редактирования паттерна.");

		if($pattern_string) {
    	$pattern = pattern_probe($pattern_string);
    	if(!$pattern)
    	  retreat('bad_pattern', 'Паттерн повреждён');
    	if($pattern['pattern'] !== $pattern_toedit['string']) {
    		$keys = array('string', 'width', 'height');
    		$values = array($pattern['pattern'], $pattern['width'], $pattern['height']);
    		$changes []= 'Рисунок отредактирован';
    	}
    }
		if($pattern_toedit['name'] != $name) {
		  $existing_name = $tc_db->GetOne('SELECT COUNT(1) FROM `'.PATTERNS_DBNAME.'` WHERE `name`=?', array($name));
		  if($existing_name)
		    retreat('name_taken', 'Имя паттерна занято');
		  $keys []= 'name';
		  $values []= $name;
		  $changes []= 'Имя паттерна «'.$pattern_toedit['name'].'» изменено на «'.$name.'»';
		}
		if((!$associated_loop || empty($associated_loop)) && $pattern_toedit['associated_loop']) {
			$keys []= 'associated_loop';
			$values []= '';
			$changes []= 'Ассоциация с лупом снята';
		}
		elseif($pattern_toedit['associated_loop'] != $associated_loop) {
			$loop_exists = $tc_db->GetOne('SELECT `name` FROM `'.LOOPS_DBNAME.'` WHERE `original_hash`=?', array($associated_loop));
			if($loop_exists) {
				$keys []= 'associated_loop';
				$values []= $associated_loop;
				$changes []= 'Установлена ассоциация с лупом «'.$loop_exists.'»';
			}
			else 
				$warning .= "Не удалось ассоциировать с лупом #".$associated_loop.", отсутствующим в базе данных.";
    }
    if($pattern_toedit['style'] != $style) {
    	if(in_array($style, $cell_styles)) {
    		$keys []= 'style';
    		$values []= $style;
    		$changes []= 'Стиль ячеек изменен';
    	}
    	else $warning .= 'Неверный формат стиля ячеек. ';
    }
    if($pattern_toedit['osc'] != $osc) {
    	if(($osc=='off' || (strlen($osc) === 6 && intval($osc, 16)) )) {
    		$keys []= 'osc';
    		$values []= $osc;
    		if($osc=='off')
    			$changes []= 'Осциллоскоп отключен';
    		else
    			$changes []= 'Цвет осциллоскопа изменен';
    	}
    	else $warning .= 'Неверный формат цвета осциоллоскопа. ';
    }
    if($is_admin) {
    	if($section && $pattern_toedit['section'] != $section) {
    	  $keys []= 'section';
    	  $values [] = $section;
    	  $changes []= 'Паттерн перемещен из секции «'.$pattern_toedit['section'].'» в «'.$section.'»';
    	  $section_move = $pattern_toedit['section'];
    	}
    	if($pattern_toedit['delpass'] != $pass && $_POST['take_ownership']) {
    	  $keys []= 'delpass';
    	  $values []= $masterpass;
    	  $changes []= 'Паттерн взят под контроль администратора';
    	}
    	if($date && $pattern_toedit['date'] != $date) {
    	  $keys []= 'date';
    	  $values []= $date;
    	  $changes []= 'Установлена новая дата добавления лупа: '.$date;
    	}
    }
    else $section = $pattern_toedit['section'];


    if(count($keys)) {
			foreach($keys as &$key) {
				$key = '`'.$key.'`=?';
			}
			$values []= $id; 

			$insert_result = $tc_db->Execute('UPDATE `'.PATTERNS_DBNAME.'` SET '.implode(', ', $keys).' WHERE `id`=?', $values);
			if(!$insert_result || $tc_db->Affected_Rows() < 1)
				retreat('mysql_error', 'Ошибка при записи в базу данных');

			$pattern_toreflect = $tc_db->GetAll("SELECT `id`,`name`,`string`,`width`,`height`,`section`,`associated_loop`,`date`,`style`,`osc` FROM `".PATTERNS_DBNAME."` WHERE `id`=?", array($id));
			if($pattern_toreflect && !empty($pattern_toreflect))
				$pattern_toreflect = $pattern_toreflect[0];
			else
				retreat('mysql_error', 'Ошибка при записи в базу данных');
			
			if($section_move)
				$pattern_toreflect['section_from'] = $section_move;

			$ret = array(
				"error" => false,
				"success" => 'pattern_edit',
				"changes" => $changes,
				"warning" => $warning,
				"pattern" => $pattern_toreflect
			);

			/* update gallery JSON */
			if($section == 'custom' || $section_move) 
				update_patterns_json_file('custom');
			
			if($section !== 'custom' || $section_move) 
				update_patterns_json_file('default');
			
			exit(json_encode($ret));

		}
		else retreat('no_changes', 'Изменений не обнаружено');

	}
	else retreat('bad_input', 'Неверный идентификатор паттерна');
}

/* DELETE PATTERN */
if($_POST['action'] == "delete" && $_POST['datatype'] == 'pattern') {
	if(!isset($_POST['pattern_id']))
	  retreat('bad_input', 'Не указан идентификатор паттерна.');
	$id = $_POST['pattern_id'];
	$pattern_todelete = $tc_db->GetAll('SELECT * FROM `'.PATTERNS_DBNAME.'` WHERE `id`=?', array($id));
	if(!$pattern_todelete || empty($pattern_todelete))
		retreat('bad_input', 'Неверный идентификатор паттерна');
	$pattern_todelete = $pattern_todelete[0];
	if($pass !== $pattern_todelete['delpass'] && !$is_admin)
		retreat('bad_auth', "Неверный пароль для удаления паттерна.");
	$tc_db->Execute('DELETE FROM `'.PATTERNS_DBNAME.'` WHERE `id`=?', array($id));
	$section = $pattern_todelete['section'];
	if($tc_db->Affected_Rows() < 1)
		retreat('mysql_error', 'Ошибка при удалении записи из базы данных');
	$ret = array(
		"error" => false,
		"success" => 'pattern_delete',
		"pattern" => array(
			"section" => $section,
			"id" => $id
		)
	);

	update_patterns_json_file($section);
	
	exit(json_encode($ret));
}

function retreat($errtype, $msg, $extra_data="") {
	$ret = array("error"=>true, "msg"=>$msg, "errtype"=>$errtype);
	if($extra_data) $ret["extra_data"] = $extra_data;
	exit(json_encode($ret));
}

function CheckCaptcha($input) {
	mb_internal_encoding("UTF-8");
	$secret = $_SESSION['security_code'];
	unset($_SESSION['security_code']);
	return (mb_strtoupper($secret) == mb_strtoupper($input) && !empty($secret)); 
}

function pattern_probe($str) {
  $default_colors = array(
    "/\\[#49b6c7\\]/i",
    "/\\[#cc4368\\]/i",
    "/\\[#59c44d\\]/i",
    "/\\[#37c999\\]/i",
    "/\\[#d2d2d2\\]/i",
    "/\\[#d2993e\\]/i",
    "/\\[#8238d8\\]/i",
    "/\\[#cccf41\\]/i",
    "/\\[#2b6d77\\]/i",
    "/\\[#7b273d\\]/i",
    "/\\[#35752e\\]/i",
    "/\\[#468172\\]/i",
    "/\\[#686868\\]/i",
    "/\\[#805c22\\]/i",
    "/\\[#4e1e84\\]/i",
    "/\\[#7b7d25\\]/i",
    "/\\|{2,}/i",
    "/^\\|/i",
    "/\\|$/i"
  );
  $shortcuts = array(
    "B",
    "C",
    "G",
    "J",
    "M",
    "O",
    "V",
    "Y",
    "b",
    "c",
    "g",
    "j",
    "m",
    "o",
    "v",
    "y",
    "|",
    "",
    ""
  );
  $str = preg_replace($default_colors, $shortcuts, $str);

  $full_match_rx = "/^((?:[".implode('', $shortcuts)."_]|\\[#[a-f0-9]{6}\\]|\\|)+)$/"; 
  $splitter_rx = "/[".implode('', $shortcuts)."_]|\\[#[a-f0-9]{6}\\]/";

  if(!preg_match($full_match_rx, $str)) return false;
  $lines = explode('|', $str);
  $height = count($lines);
  $width = 0;
  foreach($lines as &$line) {
    $line_width = count(preg_split($splitter_rx, $line)) - 1;
    if($line_width > $width)
      $width = $line_width;
  }
  return array(
    "width" => $width,
    "height" => $height,
    "pattern" => $str
  );
}
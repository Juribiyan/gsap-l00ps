<?
require 'common_config.php';

if(!strlen(MASTER_PASS) || !strlen(SALT)) 
  retreat('Установите значения MASTER_PASS и SALT в common_config.php');
$masterpass = hash('sha256', MASTER_PASS.SALT);

if(CONFIG_ENVIRONMENT == 'instant')
  require __DIR__.'/../config.php';
else
  require 'standalone_config.php';
$tc_db->SetFetchMode(ADODB_FETCH_ASSOC);
putenv('PATH=' . getenv('PATH') . PATH_SEPARATOR . KU_FFMPEGPATH);
mb_internal_encoding("UTF-8");

if(!isset($_POST['proceed'])) {
  // test ffmpeg
  $mp3_i = escapeshellarg('install/media/test.mp3');
  $ogg_i = escapeshellarg('install/media/test.ogg');
  $mp3_o = escapeshellarg('install/media/test_o.mp3');
  $ogg_o = escapeshellarg('install/media/test_o.ogg');
  exec('ffmpeg -y -i '.$ogg_i.' -loglevel error -q:a '.MP3_Q.' '.$mp3_o.' 2>&1', $mp3_enc_err);
  if(!empty($mp3_enc_err))
    retreat('FFMpeg выдал ошибку при кодировании из OGG в MP3');
  exec('ffmpeg -y -i '.$mp3_i.' -loglevel error -q:a '.OGG_Q.' '.$ogg_o.' 2>&1', $ogg_enc_err);
  if(!empty($ogg_enc_err))
    retreat('FFMpeg выдал ошибку при кодировании из MP3 в OGG');
  unlink('install/media/test_o.mp3');
  unlink('install/media/test_o.ogg');

  include 'install/pages/install.html';
  die();
}

message('Создаем таблицы...');

install_sql('install/sql/drop.sql');
install_sql('install/sql/loops.sql');
install_sql('install/sql/patterns.sql');

message('Создаем директории...');

makeDir('loops/live');
makeDir('loops/dead');
makeDir('loops/custom');

if($_POST['install_type'] != 'bare') {
  message('Устанавливаем базовый контент...');

  install_sql('install/sql/default_loops.sql');
  install_sql('install/sql/default_patterns.sql');

  xcopy('install/media/dead', 'loops/dead');
  xcopy('install/media/live', 'loops/live');
}

if($_POST['install_type'] == 'extra') {
  message('Устанавливаем екстра контент...');

  install_sql('install/sql/extra_loops.sql');
  install_sql('install/sql/extra_patterns.sql');

  xcopy('install/media/custom', 'loops/custom');
}

$tc_db->Execute('ALTER TABLE `'.LOOPS_DBNAME.'` AUTO_INCREMENT=100');

function install_sql($f) {
  global $tc_db, $masterpass;

  $sql_file = fopen($f, 'r');
  $data = fread($sql_file, filesize($f));

  $data = str_replace('__LOOPDB__', LOOPS_DBNAME, $data);
  $data = str_replace('__PATTDB__', PATTERNS_DBNAME, $data);
  $data = str_replace('__MASTERPASS__', $masterpass, $data);

  $result = $tc_db->Execute($data);

  if(!$result)
    retreat('SQL error');
}

message('Обновляем JSON-файлы...');

update_loops_json_file('default');
update_loops_json_file('custom');
update_patterns_json_file('default');
update_patterns_json_file('custom');

message('Лупы успешно установлены! <b style="color:red">Не забудьте удалить install.php</b>');

function retreat($msg) {
  message($msg, 'error');
  die();
}

function warn($msg) {
   message($msg, 'warning');
}

function message($msg, $type="normal") {
  echo '<div class="msg '.$type.'">'.$msg.'</div>';
}

function update_loops_json_file($section) {
  global $tc_db;

  $sect_condition = ($section == 'custom') ? "`section`='custom'" : "`section`='dead' OR `section`='live'";
  $json_filename = ($section == 'custom') ? 'custom_loops.json' : 'default_loops.json';
  $alltracks = $tc_db->GetAll("SELECT `section`, `name`, `original_hash`, `date`, `duration`, `treshold_correction`, `swf`, `id`,`associated_pattern` FROM `".LOOPS_DBNAME."` WHERE ".$sect_condition." ORDER BY `id` ASC");
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

/**
 * Copy a file, or recursively copy a folder and its contents
 * @author      Aidan Lister <aidan@php.net>
 * @version     1.0.1
 * @link        http://aidanlister.com/2004/04/recursively-copying-directories-in-php/
 * @param       string   $source    Source path
 * @param       string   $dest      Destination path
 * @param       string   $permissions New folder creation permissions
 * @return      bool     Returns true on success, false on failure
 */
function xcopy($source, $dest, $permissions = 0755)
{
  // Check for symlinks
  if (is_link($source)) {
    return symlink(readlink($source), $dest);
  }

  // Simple copy for a file
  if (is_file($source)) {
    return copy($source, $dest);
  }

  // Make destination directory
  if (!is_dir($dest)) {
    mkdir($dest, $permissions);
  }

  // Loop through the folder
  $dir = dir($source);
  while (false !== $entry = $dir->read()) {
    // Skip pointers
    if ($entry == '.' || $entry == '..') {
      continue;
    }

    // Deep copy directories
    xcopy("$source/$entry", "$dest/$entry", $permissions);
  }

  // Clean up
  $dir->close();
  return true;
}

function makeDir($path, $mode=0755) {
  if(is_dir($path))
    chmod($path, $mode);
  else mkdir($path, $mode);
}
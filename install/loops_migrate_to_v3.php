<?php // Copy this to the root directory; delete after use

if(!isset($_POST['proceed'])) {
  include 'install/pages/loops_migrate_to_v3.html';
  die();
}

require 'common_config.php';
if(CONFIG_ENVIRONMENT == 'instant')
  require __DIR__.'/../config.php';
else
  require 'standalone_config.php';
$tc_db->SetFetchMode(ADODB_FETCH_ASSOC);
mb_internal_encoding("UTF-8");

install_sql('install/sql/loops_migrate_to_v3.sql');
message('База данных лупов успешно обновлена.');

function install_sql($f) {
  global $tc_db;

  $sql_file = fopen($f, 'r');
  $data = fread($sql_file, filesize($f));

  $data = str_replace(array('KU_DBCHARSET', 'KU_COLLATION', '__LOOPDB__'), array(KU_DBCHARSET, KU_COLLATION, KU_DBPREFIX.LOOPS_DBNAME), $data);

  $sqlarray = explode(';',$data);
  foreach ($sqlarray as $sql) {
    $sql = trim($sql);
    if (strlen($sql) !== 0) {
      if (! $tc_db->Execute($sql)) {
        retreat('SQL error:', $tc_db->error);
      }
    }
  }
  update_loops_json_file('default');
  update_loops_json_file('custom');
}

function message($msg, $type="normal") {
  echo '<div class="msg '.$type.'">'.$msg.'</div>';
}
function retreat($msg) {
  message($msg, 'error');
  die();
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

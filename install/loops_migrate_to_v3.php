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
}

function message($msg, $type="normal") {
  echo '<div class="msg '.$type.'">'.$msg.'</div>';
}
function retreat($msg) {
  message($msg, 'error');
  die();
}
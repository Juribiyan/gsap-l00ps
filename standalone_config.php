<?php
define('KU_FFMPEGPATH', 'C:\ffmpeg\bin'); //path to FFMPEG, for example 'C:\ffmpeg\bin'
define('KU_DBTYPE', 'mysqli');
define('KU_DBHOST', 'localhost');
define('KU_DBDATABASE', 'loops');
define('KU_DBUSERNAME', 'root');
define('KU_DBPASSWORD', '');
define('KU_DBPREFIX', '');
define('KU_DBUSEPERSISTENT', false);
define('KU_DBCHARSET', 'utf8mb4'); // Database charset. utfmb4 is recommended, use utf8 if your version of mysql does not support it yet
define('KU_COLLATION', 'utf8mb4_unicode_ci'); // Database collation. Use utf8mb4_unicode_ci, period.
define('KU_CAPTCHALANG', 'num'); // Default captcha language to be used if no captchalang cookie is present. Supported values: ru, en, num (numeric)

if (!@$_GLOBALS['skipdb']) {
  require realpath(dirname(__FILE__)) . '/lib/vendor/autoload.php';

  if (!isset($tc_db)) {
    $tc_db = &NewADOConnection(KU_DBTYPE);
    if (KU_DBUSEPERSISTENT) {
      $tc_db->PConnect(KU_DBHOST, KU_DBUSERNAME, KU_DBPASSWORD, KU_DBDATABASE) or die('SQL database connection error: ' . $tc_db->ErrorMsg());
    } else {
      $tc_db->Connect(KU_DBHOST, KU_DBUSERNAME, KU_DBPASSWORD, KU_DBDATABASE) or die('SQL database connection error: ' . $tc_db->ErrorMsg());
    }
  }
}

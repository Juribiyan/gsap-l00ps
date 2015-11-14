<?php
define('KU_FFMPEGPATH', 'C:\ffmpeg\bin'); //path to FFMPEG, for example 'C:\ffmpeg\bin'
define('KU_DBTYPE', 'mysqli');
define('KU_DBHOST', 'localhost');
define('KU_DBDATABASE', 'metach');
define('KU_DBUSERNAME', 'root');
define('KU_DBPASSWORD', '');
define('KU_DBPREFIX', '');
define('KU_DBUSEPERSISTENT', false);

require 'lib/adodb/adodb.inc.php';
if (!isset($tc_db) && !isset($preconfig_db_unnecessary)) {
	$tc_db = &NewADOConnection(KU_DBTYPE);
	if (KU_DBUSEPERSISTENT) {
		$tc_db->PConnect(KU_DBHOST, KU_DBUSERNAME, KU_DBPASSWORD, KU_DBDATABASE) or die('SQL database connection error: ' . $tc_db->ErrorMsg());
	} else {
		$tc_db->Connect(KU_DBHOST, KU_DBUSERNAME, KU_DBPASSWORD, KU_DBDATABASE) or die('SQL database connection error: ' . $tc_db->ErrorMsg());
	}
}
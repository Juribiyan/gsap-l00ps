<?php
mb_internal_encoding("UTF-8");
error_reporting(E_ALL ^ E_NOTICE);
if (!headers_sent()) {
	header('Content-Type: text/html; charset=utf-8');
}

define('CONFIG_ENVIRONMENT', 'standalone'); 	// "standalone" or "instant" (when using with instant-0chan)
define('INSTANT_CONFIG_PATH', '/../config.php'); // (when environment == instant)

define('MASTER_PASS', '');		// !! FILL THOSE FIELDS !!
define('SALT', '');						// !! FILL THOSE FIELDS !!

define('LOOPS_DBNAME', 'loops');       // database names
define('PATTERNS_DBNAME', 'patterns'); // database names

define('MAX_LOOP_LENGTH', 3 * 60); // [minutes] * 60
define('MAX_LOOP_FSZKB', 3 * 1024); // [megabytes] * 1024
define('MP3_Q', 6); // encoding quality
define('OGG_Q', 2); // encoding quality
define('MAX_TRESHC', 0.3);  // treshold constraints
define('MIN_TRESHC', -0.3); // treshold constraints

define('NAME_TRUNC', 100);   // length constraints
define('DELPASS_TRUNC', 30); // length constraints

define('MAX_SIZE', 50); // pattern size constraint

$cell_styles = array('legacy', 'modern', 'transitional', 'flat');
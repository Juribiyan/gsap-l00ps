<?php
mb_internal_encoding("UTF-8");
error_reporting(E_ALL ^ E_NOTICE);
if (!headers_sent()) {
	header('Content-Type: text/html; charset=utf-8');
}

define('CONFIG_ENVIRONMENT', 'standalone'); 	// "standalone" or "instant" (when using with instant-0chan)
define('INSTANT_CONFIG_PATH', '/../config.php'); // (when environment == instant)

define('SALT', '! fill me !'); // Enter some random characters
// To get hash go to /common_config.php?getpasswordhash=<your password> (after filling the SALT)
define('MASTER_HASH', '! fill me also !');

define('MASTER_HASH', '');
define('SALT', '');						// !! FILL THOSE FIELDS !!

define('LOOPS_DBNAME', 'loops');       // database names
define('PATTERNS_DBNAME', 'patterns'); // database names

define('MAX_LOOP_LENGTH', 3 * 60); // [minutes] * 60
define('MAX_LOOP_FSZKB', 3 * 1024); // [megabytes] * 1024
define('MP3_Q', 6); // encoding quality
define('OGG_Q', 4); // encoding quality
define('MAX_TRESHC', 0.3);  // treshold constraints
define('MIN_TRESHC', -0.3); // treshold constraints

define('NAME_TRUNC', 100);   // length constraints
define('DELPASS_TRUNC', 30); // length constraints

define('MAX_SIZE', 50); // pattern size constraint

$cell_styles = array('legacy', 'modern', 'transitional', 'flat');

error_reporting(E_ALL ^ E_NOTICE);
set_error_handler(function(int $errno, string $errstr) {
  if ((strpos($errstr, 'Undefined array key') === false) && (strpos($errstr, 'Undefined variable') === false)) {
    return false;
  } else {
    return true;
  }
}, E_WARNING);

if (isset($_GET['getpasswordhash'])) {
	echo hash('sha256', $_GET['getpasswordhash'].SALT);
}
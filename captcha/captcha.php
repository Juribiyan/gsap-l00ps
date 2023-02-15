<?php
$_GLOBALS['skipdb'] = true;
define("img_dir", dirname ( __FILE__ )."/");
require '../common_config.php';
if(CONFIG_ENVIRONMENT == 'instant')
  require '../../config.php';
else
  require '../standalone_config.php';
include 'nrand.php';

$canvas_height = 30;
$canvas_width = 150;

$lines = 5;

$fonts = array(
  array(
    "fname" => "OpenSans-Light.ttf", // TTF file in /captcha folder
    "size" => array(17,21), // pixels
    "letter_spacing" => array(-0.1, 0.4), // relative to font size
    "v_scatter" => .3, // 0...1
    "rotation" => array(-20,20) //degrees
  )
);

// Determine the character set
$langs = array("ru", "en", "num");

function img_code($code) {
	global $lines, $fonts, $canvas_height, $canvas_width;

	if(isset($_GET['color'])) {
		$scolor = explode(',', $_GET['color']);
	}
	else {
		$scolor=array(85,85,85);
	}	
	
	$im=imagecreatefrompng(dirname(__FILE__)."/back.png");
	$color = imagecolorallocate($im, 100, 100, 100);				
	mb_internal_encoding("UTF-8");

	$x = 0;

	for($i = 0; $i < mb_strlen($code); $i++) {
		$font = $fonts[rand(0,sizeof($fonts)-1)];
		$fname = img_dir.$font["fname"];

		$rot = from_range($font['rotation']);
		$rr = deg2rad($rot);
		$size = from_range($font['size']);
		
		$letter=mb_substr($code, $i, 1);

		$width = imagettfbbox($size, 0, $fname, $letter)[4];
		if ($width < $size/3) $width = ceil($size/3); // For too narrow letters
		// Radius of the bounding circle
		$rad = sqrt($width**2 + $size**2) / 2;
		$at = atan2($width, $size);

		$space = from_range($font["letter_spacing"], true)*$size;

		$offset_x = round($rad * (sin($at)-sin($at-$rr))); // X offset due to rotation
		$x += ($i==0)
			? round($rad - $width/2)
			: ($space + $prev_width); // Space between chars
		$vspace = (($canvas_height-2*$rad)/2) * $font['v_scatter'];
		$y = round($size/2 + $canvas_height/2)
			+ from_range([-$vspace, $vspace], true) // Random component
			+ round($rad * (cos($at-$rr)-cos($at))); // Y offset due to ratation
		$prev_width = $width;
		imagettftext ($im, $size, $rot, (int)($x + $offset_x), (int)$y, $color, $fname, $letter);
	}
	for ($i=0; $i<$lines; $i++) {
		imageline($im, rand(0, 20), rand(0, 70), rand(120, 150), rand(0, 70), $color);
	}

	$im=opsmaz($im,$scolor);

	$_SESSION['security_code'] = $code;

	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");                   
	header("Last-Modified: " . gmdate("D, d M Y H:i:s", 10000) . " GMT");
	header("Cache-Control: no-store, no-cache, must-revalidate");         
	header("Cache-Control: post-check=0, pre-check=0", false);           
	header("Pragma: no-cache");                                           
	header("Content-Type:image/png");		
	ImagePNG ($im);
	ImageDestroy ($im);
}

function from_range($range, $float=false) {
	list($min, $max) = $range;
	return is_array($range) 
		? ( $float
			?	$min + abs($max - $min) * mt_rand(0, mt_getrandmax())/mt_getrandmax()
			: rand($min, $max) 
		)
		: $range;
}

// Some weird shit idk
function opsmaz($img,$ncolor){
	 $foreground_color =array(254,254,254);
	 $background_color =array(254,254,254);
	 $width=imagesx($img);
	 $height=imagesy($img);
	 $center=$width/2;
	 $img2=imagecreatetruecolor($width, $height);
	 $foreground=imagecolorresolve($img2, $foreground_color[0], $foreground_color[1], $foreground_color[2]);
	 $background=imagecolorresolve($img2, $background_color[0], $background_color[1], $background_color[2]);
	 imagefilledrectangle($img2, 0, 0, $width-1, $height-1, $background);		
	 imagefilledrectangle($img2, 0, $height, $width-1, $height+12, $foreground);    
		$rand1=mt_rand(0, 750000)/10000000;
		$rand2=mt_rand(0, 750000)/10000000;
		$rand3=mt_rand(0, 750000)/10000000;
		$rand4=mt_rand(0, 750000)/10000000;
		$rand5=mt_rand(0, 31415926)/1000000;
		$rand6=mt_rand(0, 31415926)/1000000;
		$rand7=mt_rand(0, 31415926)/1000000;
		$rand8=mt_rand(0, 31415926)/1000000;
		$rand9=mt_rand(300, 330)/110;
		$rand10=mt_rand(300, 330)/110;
		for($x=0;$x<$width;$x++){
			for($y=0;$y<$height;$y++){
				$sx=$x+(sin($x*$rand1+$rand5)+sin($y*$rand3+$rand6))*$rand9-$width/2+$center+1;
				$sy=$y+(sin($x*$rand2+$rand7)+sin($y*$rand4+$rand8))*$rand10;

				if($sx<0 || $sy<0 || $sx>=$width-1 || $sy>=$height-1){
					continue;
				}else{
					$color=imagecolorat($img, (int)$sx, (int)$sy) & 0xFF;
					$color_x=imagecolorat($img, (int)($sx+1), (int)$sy) & 0xFF;
					$color_y=imagecolorat($img, (int)$sx, (int)($sy+1)) & 0xFF;
					$color_xy=imagecolorat($img, (int)($sx+1), (int)($sy+1)) & 0xFF;
				}
				if($color==255 && $color_x==255 && $color_y==255 && $color_xy==255){
					continue;
				}else if($color==0 && $color_x==0 && $color_y==0 && $color_xy==0){
					$newred=$foreground_color[0];
					$newgreen=$foreground_color[1];
					$newblue=$foreground_color[2];
				}else{
					$newred=$ncolor[0];
					$newgreen=$ncolor[1];
					$newblue=$ncolor[2];
				}
				imagesetpixel($img2, $x, $y, imagecolorallocate($img2, $newred, $newgreen, $newblue));
				imagecolortransparent($img2, imagecolorallocate($img2, 254,254,254));
			}
		}
	return $img2;
}

$langs = array("ru", "en", "num");
$captchalang = (isset($_COOKIE['captchalang']) && in_array($_COOKIE['captchalang'], $langs) ? $_COOKIE['captchalang'] : KU_CAPTCHALANG);
if (isset($_GET['switch'])) {
  $current_lang = array_search($captchalang, $langs) + 1;
  if ($current_lang >= count($langs))
    $current_lang = 0;
  $captchalang = $langs[$current_lang];
  setcookie('captchalang', $captchalang, time() + 31556926, '/'/*, KU_DOMAIN*/);
}

// Generate the word
$ltrs = rand(4, 7);
if($captchalang == 'en') 
  $captcha = english_word($ltrs);
elseif($captchalang == 'ru')
  $captcha = generate_code($ltrs);  
else {
  $ltrs = rand(4, 7);
  for ($i=0; $i < $ltrs; $i++) { 
    $captcha .= rand(0, 9);
  }
}

session_start();

$_SESSION['captchatime'] = time();
img_code($captcha);
?>
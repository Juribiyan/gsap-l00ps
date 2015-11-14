CREATE TABLE IF NOT EXISTS `__LOOPDB__` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `duration` float NOT NULL,
  `delpass` char(64) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `original_hash` char(8) NOT NULL,
  `mp3_hash` char(8) NOT NULL,
  `ogg_hash` char(8) NOT NULL,
  `treshold_correction` float NOT NULL DEFAULT '0',
  `section` varchar(10) NOT NULL,
  `swf` varchar(50) NOT NULL,
  `associated_pattern` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;
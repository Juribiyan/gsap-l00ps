CREATE TABLE IF NOT EXISTS `__LOOPDB__` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `duration` float NOT NULL,
  `delpass` char(64) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `original_hash` char(8) NOT NULL,
  `mp3_hash` char(8) NOT NULL,
  `ogg_hash` char(8) NOT NULL,
  `freq` varchar(20) NOT NULL DEFAULT '0~18000',
  `db` varchar(20) NOT NULL DEFAULT '-120~0',
  `treshold` float NOT NULL DEFAULT '1.5',
  `smoothing` float NOT NULL DEFAULT '0.1',
  `section` varchar(10) NOT NULL,
  `swf` varchar(50) NOT NULL,
  `associated_pattern` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=KU_DBCHARSET ;
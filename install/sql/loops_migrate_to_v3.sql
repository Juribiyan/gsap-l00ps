ALTER TABLE `__LOOPDB__`
  DROP COLUMN `treshold_correction`,
  ADD COLUMN `freq` VARCHAR(20) NOT NULL DEFAULT '0~18000' AFTER `ogg_hash`,
  ADD COLUMN `db` VARCHAR(20) NULL DEFAULT '-120~0' AFTER `freq`,
  ADD COLUMN `treshold` FLOAT NOT NULL DEFAULT '1.5' AFTER `db`,
  ADD COLUMN `smoothing` FLOAT NOT NULL DEFAULT '0.1' AFTER `treshold`;

CREATE TEMPORARY TABLE IF NOT EXISTS `tmp-__LOOPDB__-update` (
  `original_hash` char(8) NOT NULL,
  `freq` varchar(20) NOT NULL DEFAULT '0~18000',
  `db` varchar(20) NOT NULL DEFAULT '-120~0',
  `treshold` float NOT NULL DEFAULT '1.5',
  `smoothing` float NOT NULL DEFAULT '0.1'
) ENGINE=MyISAM CHARSET=KU_DBCHARSET COLLATE=KU_COLLATION;

REPLACE INTO `tmp-__LOOPDB__-update` (`original_hash`, `freq`, `db`, `treshold`, `smoothing`) VALUES
  ('d4209918', '0~16873', '-127~-7', 1.5, 0.28),
  ('0015a566', '1127~15464', '-103~-22', 1.36, 0.18),
  ('0c40ae85', '1221~14995', '-88~-26', 1.44, 0.42),
  ('b3485087', '0~18376', '-99~-28', 1.66, 0.45),
  ('468735a0', '0~19221', '-97~-24', 1.5, 0.2),
  ('a537ec5a', '0~18564', '-120~0', 1.29, 0.1),
  ('ab30a478', '0~14713', '-99~-34', 1.42, 0.38),
  ('d0d461af', '658~19503', '-87~-32', 1.21, 0.17),
  ('4ddd97d8', '0~15558', '-120~0', 2, 0.3),
  ('16f3ad15', '0~15934', '-104~-3', 0.94, 0.17),
  ('3db73bbf', '0~18516', '-101~-36', 1.03, 0.42),
  ('73a4296f', '0~18047', '-154~-28', 1.09, 0.1),
  ('0f4ed0fc', '0~18141', '-97~-20', 1.29, 0.2),
  ('efee5d70', '1315~18611', '-97~-21', 1.83, 0.31),
  ('301ce534', '0~20160', '-120~0', 2.51, 0.15),
  ('0a1112ac', '0~19879', '-121~-18', 2.45, 0.1),
  ('0cd01a86', '0~16121', '-86~-26', 1.65, 0.23),
  ('87520d69', '0~15746', '-151~0', 2.02, 0.22),
  ('dd2aa3ee', '0~16263', '-86~-36', 1.5, 0.1),
  ('fe6dbba9', '0~17625', '-92~-25', 1.52, 0.1),
  ('4676a778', '0~16497', '-85~-28', 1.35, 0.2),
  ('78f50e13', '0~16028', '-108~-13', 1.75, 0.1),
  ('f123db9d', '0~16074', '-83~-26', 1.5, 0.1),
  ('ba01fdb1', '0~19174', '-93~-35', 1.84, 0.05),
  ('33038c12', '0~19108', '-107~-27', 1.5, 0.22),
  ('3436b447', '0~18752', '-95~-42', 1.13, 0.33),
  ('c2fe7413', '0~19691', '-85~-34', 1.44, 0.25),
  ('7547f9c4', '0~15745', '-68~-37', 1.31, 0.38),
  ('e4d36a0a', '0~19503', '-93~-19', 1.88, 0.31),
  ('2586f39c', '235~14806', '-126~-22', 1.85, 0.36),
  ('ebfde290', '0~16027', '-85~-32', 1.83, 0.21),
  ('8ebc43d3', '0~18000', '-107~-24', 1.7, 0.23),
  ('cc85aaf4', '0~18000', '-120~0', 1.5, 0.1),
  ('5170115a', '0~18000', '-120~0', 1.5, 0.1),
  ('72a80a1c', '0~18000', '-120~0', 1.5, 0.1),
  ('d9f8a1a3', '0~16450', '-82~-45', 1.12, 0.29),
  ('cc2dfa80', '0~17906', '-90~-27', 1.28, 0.1),
  ('9ab335ee', '0~17765', '-101~-7', 1.61, 0.1),
  ('ac43dcdf', '1550~16732', '-89~-29', 1.38, 0.24),
  ('a5e42cfb', '0~15699', '-89~-34', 1.92, 0.39),
  ('a00eed65', '564~18282', '-107~-15', 1.32, 0.28),
  ('d5a6d5e4', '611~17624', '-94~-33', 1.3, 0.1),
  ('0771ce45', '564~16685', '-106~-30', 1.73, 0.28),
  ('2bcd50d7', '0~15980', '-106~-28', 2.16, 0.31),
  ('e77f4b83', '235~15886', '-106~-10', 1.38, 0.1),
  ('627a7c08', '0~16309', '-95~-14', 1.5, 0.1),
  ('fe4d3a15', '0~16027', '-90~-25', 1.03, 0.28),
  ('36914654', '986~16215', '-100~-35', 1.7, 0.37),
  ('322fc293', '0~19456', '-120~-41', 2.18, 0.1),
  ('ba7c4f22', '0~19080', '-117~-26', 2.29, 0.34),
  ('05288b7b', '0~15088', '-80~-24', 1.5, 0.1),
  ('7bb2db69', '0~16262', '-120~0', 1.44, 0.16),
  ('f9c9ce57', '0~16873', '-99~-13', 1.67, 0.19),
  ('be5defad', '0~17859', '-98~-6', 1.5, 0.1),
  ('b0e5417c', '0~18000', '-95~-15', 1.12, 0.1),
  ('40de4414', '0~16027', '-93~-25', 1.19, 0.26),
  ('16d55bc5', '2066~17483', '-120~-16', 1.83, 0.1),
  ('4102f044', '0~15886', '-89~-22', 1.5, 0.24),
  ('c0b3c8c1', '0~16309', '-89~-26', 1.45, 0.1),
  ('66839089', '986~20067', '-120~-11', 1.37, 0.1),
  ('7a0e40a0', '0~19361', '-97~-40', 1.59, 0.1),
  ('be426f60', '0~15840', '-95~-31', 1.5, 0.1),
  ('61907d0b', '0~18000', '-105~-27', 1.5, 0.1),
  ('63a7acc4', '0~19550', '-97~-38', 1.28, 0.24),
  ('e12fe114', '517~15840', '-120~-26', 1.83, 0.1),
  ('3546a9d4', '5918~20160', '-120~-37', 1.54, 0.31),
  ('23eeb055', '0~19268', '-110~-13', 1.37, 0.16),
  ('bcc5313d', '0~16967', '-85~-14', 1.5, 0.14),
  ('ca5bbace', '470~17530', '-99~-32', 1.66, 0.1),
  ('ded9ee28', '0~14947', '-98~-17', 1.43, 0.33),
  ('bf69b98d', '0~19127', '-120~-17', 1.8, 0.27),
  ('2ed84707', '611~19409', '-94~-33', 1.1, 0.1);

UPDATE `__LOOPDB__` oldloops
JOIN (
  SELECT 
    original_hash,
    db,
    freq,
    treshold,
    smoothing 
  FROM `tmp-__LOOPDB__-update`
) newloops ON (oldloops.original_hash = newloops.original_hash COLLATE KU_COLLATION)
SET 
  oldloops.db = newloops.db,
  oldloops.freq = newloops.freq, 
  oldloops.treshold = newloops.treshold, 
  oldloops.smoothing = newloops.smoothing
WHERE 1;
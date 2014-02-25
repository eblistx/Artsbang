DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `ACTIVITY_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) NOT NULL,
  `TYPE` smallint(6) NOT NULL,
  `CONTENT` varchar(256) COLLATE utf8_bin DEFAULT NULL,
  `MODIFY_DATE` datetime NOT NULL,
  PRIMARY KEY (`ACTIVITY_ID`),
  KEY `ACTIVITY_USER_ID_IDX` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
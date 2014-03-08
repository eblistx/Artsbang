DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `MESSAGE_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `USER_ID` bigint(20) NOT NULL,
  `TYPE` smallint(6) NOT NULL,
  `SOURCE` smallint(6) NOT NULL,
  `SOURCE_ID` bigint(20) DEFAULT 0,
  `CONTENT` varchar(1024) COLLATE utf8_bin DEFAULT NULL,
  `STATUS` smallint(6) NOT NULL DEFAULT 1, /* 0 for delete, 1 for active */
  `MODIFY_TIME` datetime NOT NULL,
  PRIMARY KEY (`MESSAGE_ID`),
  KEY `MESSAGE_USER_ID_IDX` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
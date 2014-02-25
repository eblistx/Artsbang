DROP TABLE IF EXISTS `user_profile`;
CREATE TABLE `user_profile` (
  `USER_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `ICON` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `BLOG` varchar(256) COLLATE utf8_bin DEFAULT NULL,
  `DESC` varchar(1024) COLLATE utf8_bin DEFAULT NULL,
  `GENDER` smallint(6) NOT NULL DEFAULT 0, /* male:1, female:2 */
  `BIRTH` date DEFAULT NULL,
  `LOCATION` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `JOB` varchar(64) COLLATE utf8_bin DEFAULT NULL,
  `COMPANY` varchar(128) COLLATE utf8_bin DEFAULT NULL,
  `VERIFY` smallint(6) NOT NULL DEFAULT 0, /* not:0, verified:1 */
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
DROP TABLE IF EXISTS `user_account`;
CREATE TABLE `user_account` (
  `USER_ID` bigint(20) NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(255) COLLATE utf8_bin NOT NULL,
  `PERSONA` varchar(32) COLLATE utf8_bin NOT NULL,
  `NICK` varchar(255) COLLATE utf8_bin NOT NULL,
  `STATUS` smallint(6) NOT NULL, /* active:1, deactive:2 */
  `ROLE` smallint(6) NOT NULL, /* artist:1, fans:2 */
  `REGISTRATION_SOURCE` varchar(64) COLLATE utf8_bin DEFAULT NULL, /* web, sina, qq, renren */
  `EMAIL_STATUS` smallint(6) DEFAULT NULL, /* active:1, deactive:2 */
  PRIMARY KEY (`USER_ID`),
  KEY `USER_ACCOUNT_EMAIL_IDX` (`EMAIL`(255)),
  KEY `USER_ACCOUNT_PERSONA_IDX` (`PERSONA`(32)),
  KEY `USER_ACCOUNT_NICK_IDX` (`NICK`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
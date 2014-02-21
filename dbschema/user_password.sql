DROP TABLE IF EXISTS `user_password`;
CREATE TABLE `user_password` (
  `USER_ID` bigint(20) NOT NULL,
  `PASSWORD` varchar(64) NOT NULL,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

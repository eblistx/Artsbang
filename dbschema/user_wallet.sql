DROP TABLE IF EXISTS `user_wallet`;
CREATE TABLE `user_wallet` (
  `USER_ID` bigint(20) NOT NULL,
  `POINT1` int NOT NULL DEFAULT 0,
  `POINT2` int NOT NULL DEFAULT 0,
  `POINT3` int NOT NULL DEFAULT 0,
  `POINT4` int NOT NULL DEFAULT 0,
  `POINT5` int NOT NULL DEFAULT 0,
  `MODIFY_TIME` datetime NOT NULL,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*
 Navicat Premium Data Transfer

 Source Server         : hero
 Source Server Type    : MySQL
 Source Server Version : 50505
 Source Host           : localhost
 Source Database       : fengxuanhai_node

 Target Server Type    : MySQL
 Target Server Version : 50505
 File Encoding         : utf-8

 Date: 06/16/2018 17:29:34 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `things`
-- ----------------------------
DROP TABLE IF EXISTS `things`;
CREATE TABLE `things` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `urgent` int(11) DEFAULT NULL,
  `time` varchar(10) DEFAULT NULL,
  `isdelete` int(11) DEFAULT NULL,
  `list_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `things`
-- ----------------------------
BEGIN;
INSERT INTO `things` VALUES ('1', '复习概率', '考试将近，要好好复习了', '1', '2018-06-16', '0', '4'), ('2', '准备六级', '要考六级了，有点紧张啊', '1', '2018-06-17', '0', '2'), ('28', '完善WEB大作业', '注意复习课本，学习愉快', '1', '2018-06-16', '1', '5'), ('29', '中考加油', '中考到了，祝各位学子考个好成绩', '1', '2018-06-16', '0', '1'), ('30', '马原作业', '马原又有新的作业了', '1', '2018-06-15', '0', '2'), ('31', 'node大作业', '这是一份node大作业', '1', '2018-06-16', '0', '2');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

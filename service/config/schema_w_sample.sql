
-- SCHEMA --

CREATE TABLE IF NOT EXISTS `location` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `rank` INT NULL,
    `enabled` BOOLEAN NOT NULL,
    `fk_parent` INT NULL,
    `description` LONGTEXT NULL,
    FOREIGN KEY (fk_parent) REFERENCES location (id),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `initiative` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL,
    `fk_root_location` INT NULL,
    `description` LONGTEXT NULL,
    FOREIGN KEY (fk_root_location) REFERENCES location (id),
    UNIQUE (title),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `activity_group` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `rank` INT NOT NULL,
    `description` LONGTEXT NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `allowMulti` BOOLEAN NOT NULL DEFAULT true,
    `sticky` BOOLEAN NOT NULL DEFAULT false,
    `fk_initiative` INT NOT NULL,
    FOREIGN KEY (fk_initiative) REFERENCES initiative (id),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `activity` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `enabled` BOOLEAN NOT NULL,
    `fk_activity_group` INT NOT NULL,
    `rank` INT NULL,
    `description` LONGTEXT NULL,
    FOREIGN KEY (fk_activity_group) REFERENCES activity_group (id),
    UNIQUE (title, fk_activity_group),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `transaction` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `start` TIMESTAMP NULL,
    `end` TIMESTAMP NULL,
    `device` VARCHAR(255) NULL,
    `version` VARCHAR(255) NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `session` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `start` TIMESTAMP NULL,
    `end` TIMESTAMP NULL,
    `fk_initiative` INT NOT NULL,
    `fk_transaction` BIGINT NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY (fk_initiative) REFERENCES initiative (id),
    FOREIGN KEY (fk_transaction) REFERENCES transaction (id),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `count` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `occurrence` TIMESTAMP NULL,
    `number` INT NOT NULL,
    `fk_location` INT NOT NULL,
    `fk_session` BIGINT NOT NULL,
    FOREIGN KEY (fk_location) REFERENCES location (id),
    FOREIGN KEY (fk_session) REFERENCES session (id),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `count_activity_join` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `fk_count` BIGINT NOT NULL,
    `fk_activity` INT NOT NULL,
    FOREIGN KEY (fk_count) REFERENCES count (id),
    FOREIGN KEY (fk_activity) REFERENCES activity (id),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


CREATE TABLE IF NOT EXISTS `note` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `occurrence` TIMESTAMP NULL,
    `fk_session` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `body` LONGTEXT NULL,
    FOREIGN KEY (fk_session) REFERENCES session (id),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB ;


DELIMITER //
DROP PROCEDURE IF EXISTS `insert_data` //
CREATE PROCEDURE insert_data()
BEGIN
    IF NOT (select count(*) from information_schema.statistics where table_name = 'transaction' and index_name = 'transStart' and table_schema = database()) THEN
        -- Add Indices
        CREATE INDEX transStart ON transaction(start);
        CREATE INDEX transEnd ON transaction(end);
        CREATE INDEX sessionStart ON session(start);
        CREATE INDEX sessionEnd ON session(end);
        CREATE INDEX countOccur ON `count`(occurrence);
        CREATE INDEX noteOccur ON note(occurrence);

        -- Sample Data --

        INSERT INTO `location` (`id`, `title`, `rank`, `enabled`, `fk_parent`, `description`) VALUES
        (1, 'Sample Library', 0, 1, NULL, 'Small but effective.'),
        (2, 'Ground Floor', 2, 1, 1, ''),
        (3, 'Lobby', 3, 1, 1, ''),
        (4, 'West Wing', 0, 1, 1, ''),
        (5, 'Quiet Reading Room', 0, 1, 4, ''),
        (6, 'IT Teaching Center', 1, 1, 4, ''),
        (7, 'East Wing', 1, 1, 1, ''),
        (8, 'Media Lab', 0, 1, 7, ''),
        (9, 'Learning Commons', 1, 1, 7, '');


        INSERT INTO `initiative` (`id`, `title`, `enabled`, `fk_root_location`, `description`) VALUES
        (1, 'Sample Reference Initiative', 1, 1, 'Description would go here.'),
        (2, 'Sample Headcount Initiative', 1, 1, 'Census based observational data.');


        INSERT INTO `transaction` (`id`, `start`, `end`, `device`, `version`) VALUES
        (1, DATE_SUB(NOW(), INTERVAL '5 05:14' DAY_MINUTE), DATE_SUB(NOW(), INTERVAL '5 05:13' DAY_MINUTE), 'iPad', '0.6.5'),
        (2, DATE_SUB(NOW(), INTERVAL '4 04:14' DAY_MINUTE), DATE_SUB(NOW(), INTERVAL '4 04:13' DAY_MINUTE), 'iPad', '0.6.5'),
        (3, DATE_SUB(NOW(), INTERVAL '3 03:14' DAY_MINUTE), DATE_SUB(NOW(), INTERVAL '3 03:13' DAY_MINUTE), 'iPad', '0.6.5'),
        (4, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:59:10'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:59:20'), 'iPad', '0.6.5'),
        (5, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:59:10'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:59:20'), 'iPad', '0.6.5'),
        (6, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:59:10'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:59:20'), 'iPad', '0.6.5'),
        (7, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:59:10'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:59:20'), 'iPad', '0.6.5'),
        (8, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:59:10'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:59:20'), 'iPad', '0.6.5'),
        (9, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:59:10'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:59:20'), 'iPad', '0.6.5');


        INSERT INTO `session` (`id`, `start`, `end`, `fk_initiative`, `fk_transaction`, `deleted`) VALUES
        (1, DATE_SUB(NOW(), INTERVAL '5 07:14' DAY_MINUTE), DATE_SUB(NOW(), INTERVAL '5 05:14' DAY_MINUTE), 1, 1, 0),
        (2, DATE_SUB(NOW(), INTERVAL '4 06:14' DAY_MINUTE), DATE_SUB(NOW(), INTERVAL '4 04:14' DAY_MINUTE), 1, 2, 0),
        (3, DATE_SUB(NOW(), INTERVAL '3 05:14' DAY_MINUTE), DATE_SUB(NOW(), INTERVAL '3 03:14' DAY_MINUTE), 1, 3, 0),
        (4, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:00'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:59:00'), 2, 4, 0),
        (5, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 23:59:00'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:59:00'), 2, 5, 0),
        (6, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:00'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:59:00'), 2, 6, 0),
        (7, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 23:59:00'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:59:00'), 2, 7, 0),
        (8, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:00'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:59:00'), 2, 8, 0),
        (9, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), ' 23:59:00'), CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:59:00'), 2, 9, 0);



        INSERT INTO `activity_group` (`id`, `title`, `rank`, `description`, `required`, `fk_initiative`) VALUES
        (1, 'Type', 1, '', 1, 1),
        (2, 'Medium', 2, '', 0, 1);


        INSERT INTO `activity` (`id`, `title`, `enabled`, `rank`, `description`, `fk_activity_group`) VALUES
        (1, 'Reading', 1, 0, '', 1),
        (2, 'Computing', 1, 1, '', 1),
        (3, 'Collaborating', 1, 2, '', 1),
        (4, 'Training/Class', 1, 3, '', 1),
        (5, 'In-Person', 1, 4, '', 2),
        (6, 'Online', 1, 5, '', 2);


        INSERT INTO `count` (`id`, `occurrence`, `number`, `fk_location`, `fk_session`) VALUES
        (1, DATE_SUB(NOW(), INTERVAL '5 07:14' DAY_MINUTE), 1, 2, 1),
        (2, DATE_SUB(NOW(), INTERVAL '5 07:13' DAY_MINUTE), 1, 2, 1),
        (3, DATE_SUB(NOW(), INTERVAL '5 07:12' DAY_MINUTE), 1, 2, 1),
        (4, DATE_SUB(NOW(), INTERVAL '5 07:11' DAY_MINUTE), 1, 2, 1),
        (5, DATE_SUB(NOW(), INTERVAL '5 07:10' DAY_MINUTE), 1, 2, 1),
        (6, DATE_SUB(NOW(), INTERVAL '5 07:09' DAY_MINUTE), 1, 2, 1),
        (7, DATE_SUB(NOW(), INTERVAL '5 07:08' DAY_MINUTE), 1, 2, 1),
        (8, DATE_SUB(NOW(), INTERVAL '5 07:07' DAY_MINUTE), 1, 2, 1),
        (9, DATE_SUB(NOW(), INTERVAL '5 07:06' DAY_MINUTE), 1, 2, 1),
        (10, DATE_SUB(NOW(), INTERVAL '5 07:05' DAY_MINUTE), 1, 2, 1),
        (11, DATE_SUB(NOW(), INTERVAL '5 07:04' DAY_MINUTE), 1, 2, 1),
        (12, DATE_SUB(NOW(), INTERVAL '5 07:03' DAY_MINUTE), 1, 2, 1),
        (13, DATE_SUB(NOW(), INTERVAL '5 07:02' DAY_MINUTE), 1, 2, 1),
        (14, DATE_SUB(NOW(), INTERVAL '5 07:01' DAY_MINUTE), 1, 2, 1),
        (15, DATE_SUB(NOW(), INTERVAL '5 07:00' DAY_MINUTE), 1, 2, 1),
        (16, DATE_SUB(NOW(), INTERVAL '5 06:59' DAY_MINUTE), 1, 2, 1),
        (17, DATE_SUB(NOW(), INTERVAL '5 06:58' DAY_MINUTE), 1, 2, 1),
        (18, DATE_SUB(NOW(), INTERVAL '5 06:57' DAY_MINUTE), 1, 2, 1),
        (19, DATE_SUB(NOW(), INTERVAL '5 06:56' DAY_MINUTE), 1, 2, 1),
        (20, DATE_SUB(NOW(), INTERVAL '5 06:55' DAY_MINUTE), 1, 2, 1),
        (21, DATE_SUB(NOW(), INTERVAL '5 06:54' DAY_MINUTE), 1, 2, 1),
        (22, DATE_SUB(NOW(), INTERVAL '5 06:53' DAY_MINUTE), 1, 2, 1),
        (23, DATE_SUB(NOW(), INTERVAL '5 06:52' DAY_MINUTE), 1, 2, 1),
        (24, DATE_SUB(NOW(), INTERVAL '5 06:51' DAY_MINUTE), 1, 2, 1),
        (25, DATE_SUB(NOW(), INTERVAL '5 06:50' DAY_MINUTE), 1, 2, 1),
        (26, DATE_SUB(NOW(), INTERVAL '5 06:49' DAY_MINUTE), 1, 2, 1),
        (27, DATE_SUB(NOW(), INTERVAL '5 06:49' DAY_MINUTE), 1, 2, 1),
        (28, DATE_SUB(NOW(), INTERVAL '5 06:49' DAY_MINUTE), 1, 2, 1),
        (29, DATE_SUB(NOW(), INTERVAL '5 06:48' DAY_MINUTE), 1, 2, 1),
        (30, DATE_SUB(NOW(), INTERVAL '5 06:48' DAY_MINUTE), 1, 2, 1),
        (31, DATE_SUB(NOW(), INTERVAL '5 06:48' DAY_MINUTE), 1, 2, 1),
        (32, DATE_SUB(NOW(), INTERVAL '5 06:48' DAY_MINUTE), 1, 2, 1),
        (33, DATE_SUB(NOW(), INTERVAL '5 06:47' DAY_MINUTE), 1, 8, 1),
        (34, DATE_SUB(NOW(), INTERVAL '5 06:47' DAY_MINUTE), 1, 8, 1),
        (35, DATE_SUB(NOW(), INTERVAL '5 06:47' DAY_MINUTE), 1, 8, 1),
        (36, DATE_SUB(NOW(), INTERVAL '5 06:47' DAY_MINUTE), 1, 8, 1),
        (37, DATE_SUB(NOW(), INTERVAL '5 06:47' DAY_MINUTE), 1, 8, 1),
        (38, DATE_SUB(NOW(), INTERVAL '5 06:47' DAY_MINUTE), 1, 8, 1),
        (39, DATE_SUB(NOW(), INTERVAL '5 06:47' DAY_MINUTE), 1, 8, 1),
        (40, DATE_SUB(NOW(), INTERVAL '5 06:46' DAY_MINUTE), 1, 8, 1),
        (41, DATE_SUB(NOW(), INTERVAL '5 06:46' DAY_MINUTE), 1, 8, 1),
        (42, DATE_SUB(NOW(), INTERVAL '5 06:46' DAY_MINUTE), 1, 8, 1),
        (43, DATE_SUB(NOW(), INTERVAL '5 06:46' DAY_MINUTE), 1, 8, 1),
        (44, DATE_SUB(NOW(), INTERVAL '5 06:46' DAY_MINUTE), 1, 8, 1),
        (45, DATE_SUB(NOW(), INTERVAL '5 06:46' DAY_MINUTE), 1, 8, 1),
        (46, DATE_SUB(NOW(), INTERVAL '5 06:46' DAY_MINUTE), 1, 8, 1),
        (47, DATE_SUB(NOW(), INTERVAL '5 06:46' DAY_MINUTE), 1, 8, 1),
        (48, DATE_SUB(NOW(), INTERVAL '5 06:35' DAY_MINUTE), 1, 8, 1),
        (49, DATE_SUB(NOW(), INTERVAL '5 06:35' DAY_MINUTE), 1, 8, 1),
        (50, DATE_SUB(NOW(), INTERVAL '5 06:35' DAY_MINUTE), 1, 8, 1),
        (51, DATE_SUB(NOW(), INTERVAL '5 06:35' DAY_MINUTE), 1, 8, 1),
        (52, DATE_SUB(NOW(), INTERVAL '5 06:35' DAY_MINUTE), 1, 8, 1),
        (53, DATE_SUB(NOW(), INTERVAL '5 06:35' DAY_MINUTE), 1, 9, 1),
        (54, DATE_SUB(NOW(), INTERVAL '5 06:35' DAY_MINUTE), 1, 9, 1),
        (55, DATE_SUB(NOW(), INTERVAL '5 06:32' DAY_MINUTE), 1, 9, 1),
        (56, DATE_SUB(NOW(), INTERVAL '5 06:32' DAY_MINUTE), 1, 9, 1),
        (57, DATE_SUB(NOW(), INTERVAL '5 06:32' DAY_MINUTE), 1, 9, 1),
        (58, DATE_SUB(NOW(), INTERVAL '5 06:32' DAY_MINUTE), 1, 9, 1),
        (59, DATE_SUB(NOW(), INTERVAL '5 06:32' DAY_MINUTE), 1, 9, 1),
        (60, DATE_SUB(NOW(), INTERVAL '5 06:32' DAY_MINUTE), 1, 9, 1),
        (61, DATE_SUB(NOW(), INTERVAL '5 06:32' DAY_MINUTE), 1, 9, 1),
        (62, DATE_SUB(NOW(), INTERVAL '5 06:32' DAY_MINUTE), 1, 9, 1),
        (63, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (64, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (65, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (66, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (67, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (68, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (69, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (70, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (71, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (72, DATE_SUB(NOW(), INTERVAL '5 06:31' DAY_MINUTE), 1, 9, 1),
        (73, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 9, 1),
        (74, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 9, 1),
        (75, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 9, 1),
        (76, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 9, 1),
        (77, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 3, 1),
        (78, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 3, 1),
        (79, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 3, 1),
        (80, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 3, 1),
        (81, DATE_SUB(NOW(), INTERVAL '5 06:30' DAY_MINUTE), 1, 3, 1),
        (82, DATE_SUB(NOW(), INTERVAL '5 06:20' DAY_MINUTE), 1, 3, 1),
        (83, DATE_SUB(NOW(), INTERVAL '5 06:20' DAY_MINUTE), 1, 3, 1),
        (84, DATE_SUB(NOW(), INTERVAL '5 06:20' DAY_MINUTE), 1, 3, 1),
        (85, DATE_SUB(NOW(), INTERVAL '5 05:59' DAY_MINUTE), 1, 3, 1),
        (86, DATE_SUB(NOW(), INTERVAL '5 05:45' DAY_MINUTE), 1, 3, 1),
        (87, DATE_SUB(NOW(), INTERVAL '5 05:33' DAY_MINUTE), 1, 5, 1),
        (88, DATE_SUB(NOW(), INTERVAL '5 05:27' DAY_MINUTE), 1, 5, 1),
        (89, DATE_SUB(NOW(), INTERVAL '5 05:27' DAY_MINUTE), 1, 5, 1),
        (90, DATE_SUB(NOW(), INTERVAL '5 05:27' DAY_MINUTE), 1, 5, 1),
        (91, DATE_SUB(NOW(), INTERVAL '5 05:27' DAY_MINUTE), 1, 5, 1),
        (92, DATE_SUB(NOW(), INTERVAL '5 05:27' DAY_MINUTE), 1, 5, 1),
        (93, DATE_SUB(NOW(), INTERVAL '5 05:20' DAY_MINUTE), 1, 5, 1),
        (94, DATE_SUB(NOW(), INTERVAL '5 05:20' DAY_MINUTE), 1, 5, 1),
        (95, DATE_SUB(NOW(), INTERVAL '5 05:20' DAY_MINUTE), 1, 5, 1),
        (96, DATE_SUB(NOW(), INTERVAL '5 05:20' DAY_MINUTE), 1, 5, 1),
        (97, DATE_SUB(NOW(), INTERVAL '5 05:20' DAY_MINUTE), 1, 5, 1),
        (98, DATE_SUB(NOW(), INTERVAL '5 05:17' DAY_MINUTE), 1, 5, 1),
        (99, DATE_SUB(NOW(), INTERVAL '5 05:17' DAY_MINUTE), 1, 5, 1),
        (100, DATE_SUB(NOW(), INTERVAL '5 05:17' DAY_MINUTE), 1, 5, 1),
        (101, DATE_SUB(NOW(), INTERVAL '5 05:17' DAY_MINUTE), 1, 5, 1),
        (102, DATE_SUB(NOW(), INTERVAL '4 06:14' DAY_MINUTE), 1, 6, 2),
        (103, DATE_SUB(NOW(), INTERVAL '4 06:14' DAY_MINUTE), 1, 6, 2),
        (104, DATE_SUB(NOW(), INTERVAL '4 06:06' DAY_MINUTE), 1, 6, 2),
        (105, DATE_SUB(NOW(), INTERVAL '4 06:06' DAY_MINUTE), 1, 6, 2),
        (106, DATE_SUB(NOW(), INTERVAL '4 06:06' DAY_MINUTE), 1, 6, 2),
        (107, DATE_SUB(NOW(), INTERVAL '4 06:06' DAY_MINUTE), 1, 6, 2),
        (108, DATE_SUB(NOW(), INTERVAL '4 06:01' DAY_MINUTE), 1, 6, 2),
        (109, DATE_SUB(NOW(), INTERVAL '4 06:01' DAY_MINUTE), 1, 6, 2),
        (110, DATE_SUB(NOW(), INTERVAL '4 06:01' DAY_MINUTE), 1, 6, 2),
        (111, DATE_SUB(NOW(), INTERVAL '4 06:01' DAY_MINUTE), 1, 6, 2),
        (112, DATE_SUB(NOW(), INTERVAL '4 06:01' DAY_MINUTE), 1, 6, 2),
        (113, DATE_SUB(NOW(), INTERVAL '4 05:50' DAY_MINUTE), 1, 6, 2),
        (114, DATE_SUB(NOW(), INTERVAL '4 05:50' DAY_MINUTE), 1, 6, 2),
        (115, DATE_SUB(NOW(), INTERVAL '4 05:50' DAY_MINUTE), 1, 6, 2),
        (116, DATE_SUB(NOW(), INTERVAL '4 05:37' DAY_MINUTE), 1, 6, 2),
        (117, DATE_SUB(NOW(), INTERVAL '4 05:37' DAY_MINUTE), 1, 6, 2),
        (118, DATE_SUB(NOW(), INTERVAL '4 05:23' DAY_MINUTE), 1, 6, 2),
        (119, DATE_SUB(NOW(), INTERVAL '4 05:23' DAY_MINUTE), 1, 6, 2),
        (120, DATE_SUB(NOW(), INTERVAL '4 05:23' DAY_MINUTE), 1, 6, 2),
        (121, DATE_SUB(NOW(), INTERVAL '4 05:23' DAY_MINUTE), 1, 6, 2),
        (122, DATE_SUB(NOW(), INTERVAL '4 05:17' DAY_MINUTE), 1, 6, 2),
        (123, DATE_SUB(NOW(), INTERVAL '4 05:17' DAY_MINUTE), 1, 6, 2),
        (124, DATE_SUB(NOW(), INTERVAL '4 05:17' DAY_MINUTE), 1, 6, 2),
        (125, DATE_SUB(NOW(), INTERVAL '4 04:45' DAY_MINUTE), 1, 6, 2),
        (126, DATE_SUB(NOW(), INTERVAL '4 04:36' DAY_MINUTE), 1, 6, 2),
        (127, DATE_SUB(NOW(), INTERVAL '4 04:35' DAY_MINUTE), 1, 6, 2),
        (128, DATE_SUB(NOW(), INTERVAL '4 04:27' DAY_MINUTE), 1, 6, 2),
        (129, DATE_SUB(NOW(), INTERVAL '4 04:25' DAY_MINUTE), 1, 6, 2),
        (130, DATE_SUB(NOW(), INTERVAL '4 04:21' DAY_MINUTE), 1, 6, 2),
        (131, DATE_SUB(NOW(), INTERVAL '4 04:20' DAY_MINUTE), 1, 6, 2),
        (132, DATE_SUB(NOW(), INTERVAL '3 05:14' DAY_MINUTE), 1, 2, 3),
        (133, DATE_SUB(NOW(), INTERVAL '3 05:14' DAY_MINUTE), 1, 2, 3),
        (134, DATE_SUB(NOW(), INTERVAL '3 05:12' DAY_MINUTE), 1, 2, 3),
        (135, DATE_SUB(NOW(), INTERVAL '3 05:12' DAY_MINUTE), 1, 2, 3),
        (136, DATE_SUB(NOW(), INTERVAL '3 05:12' DAY_MINUTE), 1, 2, 3),
        (137, DATE_SUB(NOW(), INTERVAL '3 05:12' DAY_MINUTE), 1, 2, 3),
        (138, DATE_SUB(NOW(), INTERVAL '3 05:12' DAY_MINUTE), 1, 2, 3),
        (139, DATE_SUB(NOW(), INTERVAL '3 05:11' DAY_MINUTE), 1, 2, 3),
        (140, DATE_SUB(NOW(), INTERVAL '3 05:10' DAY_MINUTE), 1, 2, 3),
        (141, DATE_SUB(NOW(), INTERVAL '3 05:05' DAY_MINUTE), 1, 2, 3),
        (142, DATE_SUB(NOW(), INTERVAL '3 05:04' DAY_MINUTE), 1, 2, 3),
        (143, DATE_SUB(NOW(), INTERVAL '3 05:02' DAY_MINUTE), 1, 2, 3),
        (144, DATE_SUB(NOW(), INTERVAL '3 05:02' DAY_MINUTE), 1, 2, 3),
        (145, DATE_SUB(NOW(), INTERVAL '3 05:02' DAY_MINUTE), 1, 2, 3),
        (146, DATE_SUB(NOW(), INTERVAL '3 05:02' DAY_MINUTE), 1, 2, 3),
        (147, DATE_SUB(NOW(), INTERVAL '3 05:02' DAY_MINUTE), 1, 2, 3),
        (148, DATE_SUB(NOW(), INTERVAL '3 05:02' DAY_MINUTE), 1, 2, 3),
        (149, DATE_SUB(NOW(), INTERVAL '3 05:02' DAY_MINUTE), 1, 2, 3),
        (150, DATE_SUB(NOW(), INTERVAL '3 05:01' DAY_MINUTE), 1, 2, 3),
        (151, DATE_SUB(NOW(), INTERVAL '3 05:01' DAY_MINUTE), 1, 2, 3),
        (152, DATE_SUB(NOW(), INTERVAL '3 05:01' DAY_MINUTE), 1, 2, 3),
        (153, DATE_SUB(NOW(), INTERVAL '3 04:45' DAY_MINUTE), 1, 2, 3),
        (154, DATE_SUB(NOW(), INTERVAL '3 04:45' DAY_MINUTE), 1, 2, 3),
        (155, DATE_SUB(NOW(), INTERVAL '3 04:45' DAY_MINUTE), 1, 2, 3),
        (156, DATE_SUB(NOW(), INTERVAL '3 04:45' DAY_MINUTE), 1, 2, 3),
        (157, DATE_SUB(NOW(), INTERVAL '3 04:45' DAY_MINUTE), 1, 2, 3),
        (158, DATE_SUB(NOW(), INTERVAL '3 04:45' DAY_MINUTE), 1, 2, 3),
        (159, DATE_SUB(NOW(), INTERVAL '3 04:30' DAY_MINUTE), 1, 2, 3),
        (160, DATE_SUB(NOW(), INTERVAL '3 04:30' DAY_MINUTE), 1, 2, 3),
        (161, DATE_SUB(NOW(), INTERVAL '3 04:30' DAY_MINUTE), 1, 2, 3),
        (162, DATE_SUB(NOW(), INTERVAL '3 04:30' DAY_MINUTE), 1, 2, 3),
        (163, DATE_SUB(NOW(), INTERVAL '3 04:30' DAY_MINUTE), 1, 2, 3),
        (164, DATE_SUB(NOW(), INTERVAL '3 04:30' DAY_MINUTE), 1, 3, 3),
        (165, DATE_SUB(NOW(), INTERVAL '3 04:30' DAY_MINUTE), 1, 3, 3),
        (166, DATE_SUB(NOW(), INTERVAL '3 04:20' DAY_MINUTE), 1, 3, 3),
        (167, DATE_SUB(NOW(), INTERVAL '3 04:20' DAY_MINUTE), 1, 3, 3),
        (168, DATE_SUB(NOW(), INTERVAL '3 04:20' DAY_MINUTE), 1, 3, 3),
        (169, DATE_SUB(NOW(), INTERVAL '3 04:20' DAY_MINUTE), 1, 3, 3),
        (170, DATE_SUB(NOW(), INTERVAL '3 04:20' DAY_MINUTE), 1, 9, 3),
        (171, DATE_SUB(NOW(), INTERVAL '3 04:20' DAY_MINUTE), 1, 9, 3),
        (172, DATE_SUB(NOW(), INTERVAL '3 04:20' DAY_MINUTE), 1, 9, 3),
        (173, DATE_SUB(NOW(), INTERVAL '3 04:20' DAY_MINUTE), 1, 9, 3),
        (174, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (175, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (176, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (177, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (178, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (179, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (180, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (181, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (182, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (183, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (184, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (185, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (186, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (187, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (188, DATE_SUB(NOW(), INTERVAL '3 03:55' DAY_MINUTE), 1, 9, 3),
        (189, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 9, 3),
        (190, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 9, 3),
        (191, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 9, 3),
        (192, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 9, 3),
        (193, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 9, 3),
        (194, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 9, 3),
        (195, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 8, 3),
        (196, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 8, 3),
        (197, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 8, 3),
        (198, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 8, 3),
        (199, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 8, 3),
        (200, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 8, 3),
        (201, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 8, 3),
        (202, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 8, 3),
        (203, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 0, 6, 3),
        (204, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 5, 3),
        (205, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 5, 3),
        (206, DATE_SUB(NOW(), INTERVAL '3 03:45' DAY_MINUTE), 1, 5, 3),
        (207, DATE_SUB(NOW(), INTERVAL '3 03:30' DAY_MINUTE), 1, 5, 3),
        (208, DATE_SUB(NOW(), INTERVAL '3 03:30' DAY_MINUTE), 1, 5, 3),
        (209, DATE_SUB(NOW(), INTERVAL '3 03:30' DAY_MINUTE), 1, 5, 3),
        (210, DATE_SUB(NOW(), INTERVAL '3 03:30' DAY_MINUTE), 1, 5, 3),
        (211, DATE_SUB(NOW(), INTERVAL '3 03:30' DAY_MINUTE), 1, 5, 3),
        (212, DATE_SUB(NOW(), INTERVAL '3 03:30' DAY_MINUTE), 1, 5, 3),
        (213, DATE_SUB(NOW(), INTERVAL '3 03:25' DAY_MINUTE), 1, 5, 3),
        (214, DATE_SUB(NOW(), INTERVAL '3 03:25' DAY_MINUTE), 1, 5, 3),
        (215, DATE_SUB(NOW(), INTERVAL '3 03:25' DAY_MINUTE), 1, 5, 3),
        (216, DATE_SUB(NOW(), INTERVAL '3 03:25' DAY_MINUTE), 1, 5, 3),
        (217, DATE_SUB(NOW(), INTERVAL '3 03:25' DAY_MINUTE), 1, 5, 3),
        (218, DATE_SUB(NOW(), INTERVAL '3 03:25' DAY_MINUTE), 1, 5, 3),
        (219, DATE_SUB(NOW(), INTERVAL '3 03:25' DAY_MINUTE), 1, 5, 3),
        (220, DATE_SUB(NOW(), INTERVAL '3 03:22' DAY_MINUTE), 1, 9, 3),
        (221, DATE_SUB(NOW(), INTERVAL '3 03:22' DAY_MINUTE), 1, 9, 3),
        (222, DATE_SUB(NOW(), INTERVAL '3 03:22' DAY_MINUTE), 1, 9, 3),
        (223, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 2, 4),
        (224, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 2, 4),
        (225, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 2, 4),
        (226, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 3, 4),
        (227, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 5, 4),
        (228, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 5, 4),
        (229, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 6, 4),
        (230, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 6, 4),
        (231, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 8, 4),
        (232, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 9, 4),
        (233, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 9, 4),
        (234, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 12:01:10'), 1, 9, 4),
        (235, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 23:59:10'), 1, 2, 5),
        (236, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 23:59:10'), 1, 2, 5),
        (237, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 2, 5),
        (238, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 3, 5),
        (239, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 5, 5),
        (240, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 5, 5),
        (241, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 6, 5),
        (242, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 6, 5),
        (243, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 8, 5),
        (244, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 9, 5),
        (245, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 9, 5),
        (246, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY), ' 00:10:00'), 1, 9, 5),
        (247, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 2, 6),
        (248, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 2, 6),
        (249, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 2, 6),
        (250, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 3, 6),
        (251, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 5, 6),
        (252, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 5, 6),
        (253, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 6, 6),
        (254, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 6, 6),
        (255, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 8, 6),
        (256, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 9, 6),
        (257, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 9, 6),
        (258, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 12:01:10'), 1, 9, 6),
        (259, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 23:59:10'), 1, 2, 7),
        (260, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 23:59:10'), 1, 2, 7),
        (261, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 2, 7),
        (262, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 3, 7),
        (263, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 5, 7),
        (264, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 5, 7),
        (265, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 6, 7),
        (266, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 6, 7),
        (267, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 8, 7),
        (268, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 9, 7),
        (269, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 9, 7),
        (270, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 4 DAY), ' 00:10:00'), 1, 9, 7),
        (271, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 2, 8),
        (272, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 2, 8),
        (273, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 2, 8),
        (274, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 3, 8),
        (275, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 5, 8),
        (276, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 5, 8),
        (277, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 6, 8),
        (278, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 6, 8),
        (279, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 8, 8),
        (280, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 9, 8),
        (281, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 9, 8),
        (282, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 12:01:10'), 1, 9, 8),
        (283, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), ' 23:59:10'), 1, 2, 9),
        (284, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), ' 23:59:10'), 1, 2, 9),
        (285, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 2, 9),
        (286, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 3, 9),
        (287, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 5, 9),
        (288, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 5, 9),
        (289, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 6, 9),
        (290, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 6, 9),
        (291, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 8, 9),
        (292, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 9, 9),
        (293, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 9, 9),
        (294, CONCAT(DATE_SUB(CURRENT_DATE(), INTERVAL 5 DAY), ' 00:10:00'), 1, 9, 9);


        INSERT INTO `count_activity_join` (`id`, `fk_count`, `fk_activity`) VALUES
        (1, 23, 3),
        (2, 24, 3),
        (3, 25, 3),
        (4, 26, 3),
        (5, 27, 3),
        (6, 28, 3),
        (7, 29, 3),
        (8, 30, 1),
        (9, 31, 1),
        (10, 32, 1),
        (11, 33, 2),
        (12, 34, 2),
        (13, 35, 2),
        (14, 36, 2),
        (15, 37, 2),
        (16, 38, 2),
        (17, 39, 2),
        (18, 39, 3),
        (19, 40, 2),
        (20, 40, 3),
        (21, 41, 2),
        (22, 41, 3),
        (23, 42, 2),
        (24, 42, 3),
        (25, 43, 2),
        (26, 43, 3),
        (27, 44, 2),
        (28, 44, 3),
        (29, 45, 2),
        (30, 45, 3),
        (31, 46, 2),
        (32, 47, 2),
        (33, 48, 2),
        (34, 49, 2),
        (35, 50, 2),
        (36, 51, 2),
        (37, 52, 2),
        (38, 53, 1),
        (39, 54, 1),
        (40, 55, 1),
        (41, 56, 1),
        (42, 57, 1),
        (43, 58, 1),
        (44, 60, 1),
        (45, 61, 1),
        (46, 62, 3),
        (47, 63, 3),
        (48, 64, 3),
        (49, 65, 3),
        (50, 66, 3),
        (51, 68, 3),
        (52, 78, 3),
        (53, 79, 3),
        (54, 80, 3),
        (55, 87, 1),
        (56, 88, 1),
        (57, 89, 1),
        (58, 90, 1),
        (59, 91, 1),
        (60, 92, 1),
        (61, 93, 1),
        (62, 94, 1),
        (63, 95, 1),
        (64, 96, 1),
        (65, 97, 1),
        (66, 98, 1),
        (67, 99, 1),
        (68, 100, 1),
        (69, 101, 1),
        (70, 102, 4),
        (71, 103, 4),
        (72, 104, 4),
        (73, 105, 2),
        (74, 105, 4),
        (75, 106, 2),
        (76, 106, 4),
        (77, 107, 2),
        (78, 107, 4),
        (79, 108, 2),
        (80, 108, 4),
        (81, 109, 2),
        (82, 109, 4),
        (83, 110, 2),
        (84, 110, 4),
        (85, 111, 2),
        (86, 111, 4),
        (87, 112, 2),
        (88, 112, 4),
        (89, 113, 2),
        (90, 113, 4),
        (91, 114, 2),
        (92, 114, 4),
        (93, 115, 2),
        (94, 115, 4),
        (95, 116, 2),
        (96, 116, 4),
        (97, 117, 2),
        (98, 117, 4),
        (99, 118, 2),
        (100, 118, 4),
        (101, 119, 2),
        (102, 119, 4),
        (103, 120, 2),
        (104, 120, 4),
        (105, 121, 2),
        (106, 121, 4),
        (107, 122, 2),
        (108, 122, 4),
        (109, 123, 2),
        (110, 123, 4),
        (111, 124, 2),
        (112, 124, 4),
        (113, 125, 2),
        (114, 125, 4),
        (115, 126, 2),
        (116, 126, 4),
        (117, 127, 2),
        (118, 127, 4),
        (119, 128, 2),
        (120, 128, 4),
        (121, 129, 2),
        (122, 129, 4),
        (123, 130, 2),
        (124, 130, 4),
        (125, 131, 2),
        (126, 131, 4),
        (127, 132, 3),
        (128, 133, 1),
        (129, 133, 3),
        (130, 134, 3),
        (131, 135, 3),
        (132, 170, 2),
        (133, 171, 2),
        (134, 173, 2),
        (135, 174, 2),
        (136, 175, 1),
        (137, 176, 1),
        (138, 191, 3),
        (139, 192, 3),
        (140, 193, 3),
        (141, 194, 3),
        (142, 197, 2),
        (143, 198, 2),
        (144, 199, 2),
        (145, 199, 3),
        (146, 200, 2),
        (147, 200, 3),
        (148, 201, 2),
        (149, 201, 3),
        (150, 202, 3),
        (151, 204, 1),
        (152, 205, 1),
        (153, 206, 1),
        (154, 207, 1),
        (155, 208, 1),
        (156, 209, 1),
        (157, 210, 1),
        (158, 211, 1),
        (159, 212, 1),
        (160, 213, 1),
        (161, 214, 1),
        (162, 215, 1),
        (163, 216, 1),
        (164, 217, 1),
        (165, 218, 1),
        (166, 219, 1),
        (167, 220, 3),
        (168, 220, 5),
        (169, 221, 2),
        (170, 221, 3),
        (171, 221, 6),
        (172, 222, 2),
        (173, 222, 3),
        (174, 222, 5);
    END IF;
END //
DELIMITER ;

CALL insert_data();
DROP PROCEDURE IF EXISTS `insert_data`

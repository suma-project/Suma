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

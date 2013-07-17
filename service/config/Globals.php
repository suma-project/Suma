<?php

Zend_Loader::loadClass('Zend_Db');
Zend_Loader::loadClass('Zend_Config_Ini');
Zend_Loader::loadClass('Zend_Config_Yaml');
Zend_Loader::loadClass('Zend_Log_Writer_Stream');
Zend_Loader::loadClass('Zend_Log');
Zend_Loader::loadClass('Zend_Registry');

class Globals
{
    private static $_config;
    private static $_log;
    private static $_db;
    private static $_qsDbLimit;

    static function getDBConn()
    {
        if (self::$_db != null)
        {
            return self::$_db;
        }
        else
        {
            self::$_db = Zend_DB::factory(self::getConfig()->sumaserver->db->platform, array(
                                       'host' => self::getConfig()->sumaserver->db->host,
                                       'username' => self::getConfig()->sumaserver->db->user,
                                       'password' => self::getConfig()->sumaserver->db->pword,
                                       'dbname' => self::getConfig()->sumaserver->db->dbname,
                                       'port' => self::getConfig()->sumaserver->db->port
            ));
            self::$_db->query('SET NAMES utf8');
            self::$_db->setFetchMode(Zend_Db::FETCH_ASSOC);

            return self::$_db;
        }
    }

    static public function getLog()
    {
        if (self::$_log != null)
        {
            return self::$_log;
        }
        else
        {
            $path = self::getConfig()->sumaserver->log->path;
            $name = self::getConfig()->sumaserver->log->name;

            if (is_writable($path . $name) || (!file_exists($path . $name) && is_writable($path)))
            {
                $writer = new Zend_Log_Writer_Stream($path . $name);
                self::$_log = new Zend_Log($writer);
                return self::$_log;
            }
            else
            {
                header("HTTP/1.1 500 Internal Server Error");
                echo "<h1>500 Internal Server Error</h1>";
                echo "<p>An error occurred on the server which prevented your request from being completed.</p>";
                echo "<strong>Log file does not exist or is not writable</strong>";
                die;
            }
        }
    }

    static function getQsDbLimit()
    {
        if (self::$_qsDbLimit == null)
        {
            self::$_qsDbLimit = self::getConfig()->queryserver->db->limit;
        }

        return self::$_qsDbLimit;
    }

    static function getConfig()
    {
        if (self::$_config != null)
        {
            return self::$_config;
        }

        $yamlFile = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'config.yaml';
        $iniFile = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'config.ini';

        if (is_readable($yamlFile))
        {
            self::$_config = new Zend_Config_Yaml($yamlFile, 'production');
            return self::$_config;
        }
        elseif (is_readable($iniFile))
        {
            self::$_config = new Zend_Config_Ini($iniFile, 'production');
            return self::$_config;
        }
        else
        {
            throw new Exception('Configuration file (service/config/config.yaml) does not exist or is not readable.');
        }
    }
}

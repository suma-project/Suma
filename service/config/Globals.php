<?php 

Zend_Loader::loadClass('Zend_Db');
Zend_Loader::loadClass('Zend_Config_Ini');
Zend_Loader::loadClass('Zend_Log_Writer_Stream');
Zend_Loader::loadClass('Zend_Log');
Zend_Loader::loadClass('Zend_Registry');

class Globals
{
    private static $_config;
    private static $_log;
    private static $_db;
    
    static function getDBConn()
    {    
        if (self::$_db != null)
        {
            return self::$_db;
        }
        else
        {
            //self::getLog()->debug("Creating DB Connection to Suma DB");
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
            $writer = new Zend_Log_Writer_Stream($path . $name);
            self::$_log = new Zend_Log($writer);            
            return self::$_log;
        }
    }
    
    static function getConfig()
    {
        if (self::$_config != null)
        {
            return self::$_config;
        }
        else 
        {
            $file = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'config.ini';
            //self::getLog()->debug("Reading Configuration file: " . $file);
            self::$_config = new Zend_Config_Ini($file, 'production');
            return self::$_config;
        }
    }
    
    
}

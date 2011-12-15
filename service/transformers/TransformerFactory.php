<?php 

class TransformerFactory
{
    public static function factory($class, $flag=null)
    {
        if (require_once $class.'.php')
        {
            return new $class($flag);
        }
        else
        {
            throw new Exception('Undefined class: '.$class);
        }
    }
}

?>
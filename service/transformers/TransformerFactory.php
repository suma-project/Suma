<?php 

class TransformerFactory
{
    public static function factory($class, $byCounts=null, $sum=null)
    {
        if (require_once $class.'.php')
        {
            return new $class($byCounts, $sum);
        }
        else
        {
            throw new Exception('Undefined class: '.$class);
        }
    }
}

?>
<?php 

Zend_Loader::loadClass('Zend_Json');

abstract class BaseTransformer
{
    protected $_nestedArrays = array('initiatives' => array());
    protected $_byCounts = false;
    protected $_sum = false;
    
    
    abstract public function addRow($row);
    
    
    public function __construct($byCounts=false, $sum=false)
    {   
        $this->_byCounts = $byCounts;
        $this->_sum = $sum;
    }    

    public function setInitMetadata($metadata)
    {
        foreach($metadata as $key => $val)
        {            
            if (is_numeric($val))
            {
                $val = (int)$val;
            }
            $this->_nestedArrays['initiatives'][$key] = $val;
        }
    }
    
    public function setInitLocs($locArray)
    {
        $this->_nestedArrays['initiatives']['dictionary']['locations'] = $locArray;
    }
    
    public function setInitActs($activityArray)
    {
        $this->_nestedArrays['initiatives']['dictionary']['activities'] = $activityArray;
    }
    
    public function getJSON()
    {
        return Zend_Json::encode($this->_nestedArrays);
    }

}

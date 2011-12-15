<?php 

abstract class BaseTransformer
{
    protected $_nestedArrays = array('initiatives' => array());
    protected $_byCounts = false;
    
    
    abstract public function addRow($row);
    
    
    public function __construct($byCounts = false)
    {   
        $this->_byCounts = $byCounts;
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
        return json_encode($this->_nestedArrays);
    }

}

?>
<?php 

Zend_Loader::loadClass('Zend_Json');

abstract class BaseTransformer
{
    protected $_nestedArrays = array('initiative' => array(), 'status' => array('has more' => 'false'));
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
            $this->_nestedArrays['initiative'][$key] = $val;
        }
    }
    
    public function setInitLocs($locArray)
    {
        $this->_nestedArrays['initiative']['dictionary']['locations'] = $locArray;
    }
    
    public function setInitActs($activityArray)
    {
        $this->_nestedArrays['initiative']['dictionary']['activities'] = $activityArray;
    }
    
    public function setInitActGroups($actGroupsArray)
    {
        $this->_nestedArrays['initiative']['dictionary']['activityGroups'] = $actGroupsArray;
    }
    
    public function setHasMore($status, $rowCount=0)
    {
        if ($status)
        {
            $this->_nestedArrays['status']['has more'] = 'true';
            $this->_nestedArrays['status']['offset'] = $rowCount;
        }
        else
        {
            $this->_nestedArrays['status']['has more'] = 'false';
        }
    }
    
    public function getJSON()
    {
        return Zend_Json::encode($this->_nestedArrays);
    }

}

<?php 

require_once 'BaseTransformer.php';

class LcTransformer extends BaseTransformer
{
    private $_countHash = array();
    private $_sessionHash = array();    
    
    
    public function addRow($row)
    {
        $tier = null;
        if ($this->_byCounts == false)
        {
            if (! isset($this->_nestedArrays['initiatives']['sessions']))
            {
                $this->_nestedArrays['initiatives']['sessions'] = array();
            }
            $tier =& $this->addSession($row);
        }
        else 
        {
            if (! isset($this->_nestedArrays['initiatives']['locations']))
            {
                $this->_nestedArrays['initiatives']['locations'] = array();
            }
            $tier =& $this->_nestedArrays['initiatives'];
        }
        
        $location =& $this->addLocation($row, $tier);
        $this->addCount($row, $location);
    }
    
    private function &addSession($row)
    {
        if (isset($this->_sessionHash[(int)$row['sid']]))
        {
            return $this->_sessionHash[(int)$row['sid']];
        }        
        
        $addition = array('id'         =>  (int)$row['sid'],
                          'start'      =>  $row['start'],
                          'end'        =>  $row['end'],
                          'locations' =>  array());
        
        $sessions =& $this->_nestedArrays['initiatives']['sessions'];
        $sessions[] =& $addition;
        $this->_sessionHash[(int)$row['sid']] =& $addition;
        return $addition; 
    }

    private function &addLocation($row, &$tier)
    {
        $locations =& $tier['locations'];
        
        foreach($locations as &$location)
        {
            if ($location['id'] == $row['loc'])
            {
                $selected =& $location;
                unset($location);
                break;
            }
        }            

        if (isset($selected))
        {
            return $selected;
        }        
        
        if ($this->_sum == true)
        {
            $addition = array('id'     => (int)$row['loc'],
                              'counts' => 0);                
        }
        else
        {
            $addition = array('id'     => (int)$row['loc'],
                              'counts' => array());                
        }
        
        $locations[] =& $addition;
        return $addition;
    }    
    
    private function addCount($row, &$location)
    {
        if (isset($this->_countHash[(int)$row['cid']]))
        {
            return;
        }
        
        $counts =& $location['counts'];
        
        if ($this->_sum == true)
        {
            $counts += (int)$row['cnum'];
        }
        else
        {
            $counts[] = array('id'    =>  (int)$row['cid'],
                             'time'   =>  $row['oc'],
                             'number' => (int)$row['cnum']);            
        }
        
        $this->_countHash[(int)$row['cid']] = true;
    }     
    
}

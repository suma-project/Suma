<?php 

require_once 'BaseTransformer.php';

class LcaTransformer extends BaseTransformer
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
        $count =& $this->addCount($row, $location);
        $this->addActivity($row, $count);
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
        $selected = null;
        
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
        
        $addition = array('id'     =>  (int)$row['loc'],
                         'counts'  =>  array());
        
        $locations[] =& $addition;
        return $addition;
    }    
    
    private function &addCount($row, &$location)
    {
        if (isset($this->_countHash[(int)$row['cid']]))
        {
            return $this->_countHash[(int)$row['cid']];
        }        
        
        $addition = array('id'        =>  (int)$row['cid'],
                         'time'       =>  $row['oc'],
                         'number'     =>  (int)$row['cnum'],
                         'activities' =>  array());
        
        $counts =& $location['counts'];
        $counts[] =& $addition;
        $this->_countHash[(int)$row['cid']] =& $addition;
        return $addition;        
    }     
    
    
    private function addActivity($row, &$count)
    {
        $activities =& $count['activities'];
        
        if (isset($row['act']))
        {
            foreach($activities as &$activity)
            {
                if ($activity['id'] == $row['act'])
                {
                    unset($activity);
                    return null;
                }
            }
            
            $activities[] = array('id' => (int)$row['act']);
        }
        else
        {
            foreach($activities as &$activity)
            {
                if ($activity['id'] == '_No Activity')
                {
                    unset($activity);
                    return null;
                }
            }
                
            
            $activities[] = array('id' => '_No Activity');
        } 
    }    
    
}

?>
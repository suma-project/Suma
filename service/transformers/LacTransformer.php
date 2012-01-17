<?php 

require_once 'BaseTransformer.php';

class LacTransformer extends BaseTransformer
{
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
        $activity =& $this->addActivity($row, $location);
        $this->addCount($row, $activity);
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
                         'activities'  =>  array());
        
        $locations[] =& $addition;
        return $addition;
    }    
    
    private function &addActivity($row, &$location)
    {
        $activities =& $location['activities'];
        
        if (isset($row['act']))
        {
            foreach($activities as &$activity)
            {
                if ($activity['id'] == $row['act'])
                {
                    $selected =& $activity;
                    unset($activity);
                    break;
                }
            }

            if (isset($selected))
            {
                return $selected;
            }
            
            if ($this->_sum == true)
            {
                $addition = array('id'     => (int)$row['act'],
                                  'counts' => 0);                
            }
            else
            {
                $addition = array('id'     => (int)$row['act'],
                                  'counts' => array());                
            }
            
            $activities[] =& $addition;
            return $addition;
        }
        else
        {
            foreach($activities as &$activity)
            {
                if ($activity['id'] == '_No Activity')
                {
                    $selected =& $activity;
                    unset($activity);
                    break;
                }
            }
            
            if (isset($selected))
            {
                return $selected;
            }        
            
            if ($this->_sum == true)
            {
                $addition = array('id'     => '_No Activity',
                                  'counts' => 0);                
            }
            else
            {
                $addition = array('id'     => '_No Activity',
                                  'counts' => array());                
            }
            
            $activities[] =& $addition;
            return $addition;
        }
        
    }    
    
    private function addCount($row, &$activity)
    {        
        $counts =& $activity['counts'];
        
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
    }    
    
}

?>
<?php 

require_once 'BaseTransformer.php';

class AlcTransformer extends BaseTransformer
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
            if (! isset($this->_nestedArrays['initiatives']['activities']))
            {
                $this->_nestedArrays['initiatives']['activities'] = array();
            }
            $tier =& $this->_nestedArrays['initiatives'];
        }
        
        $activity =& $this->addActivity($row, $tier);
        $location =& $this->addLocation($row, $activity);
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
                          'activities' =>  array());
        
        $sessions =& $this->_nestedArrays['initiatives']['sessions']; 
        $sessions[] =& $addition;
        $this->_sessionHash[(int)$row['sid']] =& $addition;
        return $addition; 
    } 
    
    private function &addActivity($row, &$tier)
    {
        $activities =& $tier['activities'];
        $selected = null;
        
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
            
            $addition = array('id'        => (int)$row['act'],
                              'locations' => array());
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
            
            $addition = array('id'        => '_No Activity',
                              'locations' => array());
            
            $activities[] =& $addition;
            return $addition;
        }
        
    }    
    
    private function &addLocation($row, &$activity)
    {
        $locations =& $activity['locations'];
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
    
    private function addCount($row, &$location)
    {
        if (isset($this->_countHash[(int)$row['cid']]))
        {
            return;
        }
        
        $addition = array('id'    =>  (int)$row['cid'],
                         'time'   =>  $row['oc'],
                         'number' =>  (int)$row['cnum']);
        
        $counts =& $location['counts'];
        $counts[] =& $addition;
        $this->_countHash[(int)$row['cid']] =& $addition;
    }    
    
}

?>
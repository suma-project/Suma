<?php 

require_once 'BaseTransformer.php';

class AcTransformer extends BaseTransformer
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
                              'counts' => array());
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
                              'counts' => array());
            
            $activities[] =& $addition;
            return $addition;
        }
        
    }
    
    private function addCount($row, &$activity)
    {
        if (isset($this->_countHash[(int)$row['cid']]))
        {
            return;
        }
        
        $addition = array('id'    =>  (int)$row['cid'],
                         'time'   =>  $row['oc'],
                         'number' => (int)$row['cnum']);
        
        $counts =& $activity['counts'];
        $counts[] =& $addition;
        $this->_countHash[(int)$row['cid']] =& $addition;
    }     
        
}

?>
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
            if (! isset($this->_nestedArrays['initiative']['sessions']))
            {
                $this->_nestedArrays['initiative']['sessions'] = array();
            }
            $tier =& $this->addSession($row);
        }
        else
        {
            if (! isset($this->_nestedArrays['initiative']['locations']))
            {
                $this->_nestedArrays['initiative']['locations'] = array();
            }
            $tier =& $this->_nestedArrays['initiative'];
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
                          'transId' => $row['transId'],
                          'transStart' => $row['transStart'],
                          'transEnd' => $row['transEnd'],
                          'locations' =>  array());

        $sessions =& $this->_nestedArrays['initiative']['sessions'];
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
                if ($activity['id'] == -1)
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
                $addition = array('id'     => -1,
                                  'counts' => 0);
            }
            else
            {
                $addition = array('id'     => -1,
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

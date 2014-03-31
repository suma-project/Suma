<?php

require_once 'BaseTransformer.php';

class CalTransformer extends BaseTransformer
{
    private $_countHash = array();
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
            if (! isset($this->_nestedArrays['initiative']['counts']))
            {
                $this->_nestedArrays['initiative']['counts'] = array();
            }
            $tier =& $this->_nestedArrays['initiative'];
        }

        $count =& $this->addCount($row, $tier);
        $this->addActivity($row, $count);
    }

    private function &addSession($row)
    {
        if (isset($this->_sessionHash[(int)$row['sid']]))
        {
            return $this->_sessionHash[(int)$row['sid']];
        }

        $addition = array('id'     =>  (int)$row['sid'],
                          'start'  =>  $row['start'],
                          'end'    =>  $row['end'],
                          'transId' => $row['transId'],
                          'transStart' => $row['transStart'],
                          'transEnd' => $row['transEnd'],
                          'counts' =>  array());


        $sessions =& $this->_nestedArrays['initiative']['sessions'];
        $sessions[] =& $addition;
        $this->_sessionHash[(int)$row['sid']] =& $addition;
        return $addition;
    }

    private function &addCount($row, &$tier)
    {
        if (isset($this->_countHash[(int)$row['cid']]))
        {
            return $this->_countHash[(int)$row['cid']];
        }

        $addition = array('id'        =>  (int)$row['cid'],
                         'time'       =>  $row['oc'],
                         'number'     =>  (int)$row['cnum'],
                         'location'   =>  (int)$row['loc'],
                         'activities' =>  array());

        $counts =& $tier['counts'];
        $counts[] =& $addition;
        $this->_countHash[(int)$row['cid']] =& $addition;
        return $addition;
    }

    private function addActivity($row, &$count)
    {
        $activities =& $count['activities'];

        foreach($activities as &$activity)
        {
            if ((isset($row['act']) && $activity['id'] == $row['act']) ||
                (! isset($row['act']) && $activity['id'] == $row['_No Activity']))
            {
                unset($activity);
                return;
            }
        }

        if (isset($row['act']))
        {
            $activities[] = (int)$row['act'];
        }
        else
        {
            $activities[] = '_No Activity';
        }
    }

}

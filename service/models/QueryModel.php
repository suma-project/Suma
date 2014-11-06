<?php

class QueryModel
{
    private $_db;
    private $_hasMore;
    private $_sessSql;
    private $_countsSql;
    private $_sessCount;
    private $_rowCount;
    private $_queryStmt;
    private $_initLocs = array();
    private $_initActs = array();
    private $_initActGroups = array();
    private $_initId;
    private $_initMetadata = array();
    private $_formats = array('alc' => ' caj.fk_activity ASC, c.fk_location ASC, c.occurrence ASC, c.id ASC ',
                              'lac' => ' c.fk_location ASC, caj.fk_activity ASC, c.occurrence ASC, c.id ASC ',
                              'lca' => ' c.fk_location ASC, c.occurrence ASC, c.id ASC, caj.fk_activity ASC ',
                              'cal' => ' c.occurrence ASC, c.id ASC, caj.fk_activity ASC, c.fk_location ASC ',
                              'cla' => ' c.occurrence ASC, c.id ASC, c.fk_location ASC, caj.fk_activity ASC ',
                              'ac'  => ' caj.fk_activity ASC, c.occurrence, c.id ASC ',
                              'lc'  => ' c.fk_location ASC, c.occurrence, c.id ASC ');

    public function __construct($initId)
    {
        $this->_db = Globals::getDBConn();
        $this->_initId = $initId;
        $select = $this->_db->select()
            ->from('initiative', array('id', 'title', 'fk_root_location as rootLocation', 'description'))
            ->where('id = '.$this->_initId);
        $metadata = $select->query()->fetch();

        if (! empty($metadata))
        {
            $this->_initMetadata = $metadata;
        }
        else
        {
            throw new Exception('Initiative does not exist');
            Globals::getLog()->err('NONEXISTENT INITIATIVE - id: '.$initId);
        }
    }

    public function hasMore()
    {
        return $this->_hasMore;
    }

    public function getSessSql()
    {
        return $this->_sessSql;
    }

    public function getCountsSql()
    {
        return $this->_countsSql;
    }

    public function getSessCount()
    {
        return $this->_sessCount;
    }

    public function getRowCount()
    {
        return $this->_rowCount;
    }

    public function getNextRow()
    {
        if ($this->_queryStmt)
        {
            return $this->_queryStmt->fetch();
        }
    }

    public function getInitMetadata()
    {
        return $this->_initMetadata;
    }

    public function getInitLocs()
    {
        if (empty($this->_initLocs))
        {
            $this->walkLocTree($this->_initMetadata['rootLocation']);
        }
        return $this->_initLocs;
    }

    public function getInitActs()
    {
        if (empty($this->_initActs))
        {
            $select = $this->_db->select()
                ->from(array('a' => 'activity'), array('id', 'title', 'rank', 'description', 'fk_activity_group as activityGroup'))
                ->join(array('ag' => 'activity_group'),
                             'a.fk_activity_group = ag.id', array())
                ->where('ag.fk_initiative = ' . $this->_initId)
                ->order('a.rank ASC');
            $acts = $select->query()->fetchAll();

            // Cast numerical string(s) into type int
            foreach($acts as $act)
            {
                foreach($act as $key => $val)
                {
                    if (is_numeric($val))
                    {
                        $act[$key] = (int)$val;
                    }
                }
                $this->_initActs[] = $act;
            }

            // Add dummy No Activity object
            $this->_initActs[] = array(
                'id'    => -1,
                'title' => 'No Activity',
                'rank'  => 0,
                'description' => '',
                'activityGroup' => -2
            );
        }

        return $this->_initActs;
    }

    public function getInitActGroups()
    {
        if (empty($this->_initActGroups))
        {
            $select = $this->_db->select()
                ->distinct()
                ->from(array('ag' => 'activity_group'),
                       array('id', 'title', 'rank', 'description', 'required', 'allowMulti'))
                ->join(array('a' => 'activity'),
                             'a.fk_activity_group = ag.id', array())
                ->where('ag.fk_initiative = ' . $this->_initId);
            $groups = $select->query()->fetchAll();

            // Cast numerical string(s) into type int
            foreach($groups as $grp)
            {
                foreach($grp as $key => $val)
                {
                    if (($key === 'required') || ($key === 'allowMulti'))
                    {
                        $grp[$key] = ($val == 1 || $val == TRUE) ? TRUE : FALSE;
                    } else if (is_numeric($val))
                    {
                        $grp[$key] = (int)$val;
                    }
                }
                $this->_initActGroups[] = $grp;
            }

            // Add dummy No Activity group object
            $this->_initActGroups[] = array(
                'id'    => -2,
                'title' => 'No Activity',
                'rank'  => 9999,
                'description' => '',
                'required' => 0,
                'allowedMulti' => 0
            );
        }

        return $this->_initActGroups;
    }

    public function bySessions($params)
    {
        // SQL to pull valid sessions
        $this->_sessSql = 'SELECT s.id FROM session s WHERE s.fk_initiative = ' . $this->_initId . ' AND s.deleted = 0 ';

        // Test if AND clause is needed
        if (isset($params['sDate']) || isset($params['eDate']))
        {
            $this->_sessSql .= ' AND ';
        }

        // Date filtration
        if (isset($params['sDate']))
        {
            if (isset($params['eDate']))
            {
                $this->_sessSql .= ' (DATE(s.start) BETWEEN DATE(\''.$params['sDate'].'\') AND DATE(\''.$params['eDate'].'\') '
                    . ' OR DATE(s.end) BETWEEN DATE(\''.$params['sDate'].'\') AND DATE(\''.$params['eDate'].'\')) ';
            }
            else
            {
                $now = new Zend_Date();
                $this->_sessSql .= ' (DATE(s.start) BETWEEN DATE(\''.$params['sDate'].'\') AND DATE(\''.$now->get(Zend_Date::ISO_8601).'\') '
                    . ' OR DATE(s.end) BETWEEN DATE(\''.$params['sDate'].'\') AND DATE(\''.$now->get(Zend_Date::ISO_8601).'\')) ';
            }
        }
        else if (isset($params['eDate']))
        {
            $this->_sessSql .= ' (DATE(s.start) <= DATE(\''.$params['eDate'].'\')) ';
        }

        // Test if AND clause is needed
        if (isset($params['sTimeH']) || isset($params['eTimeH']))
        {
            $this->_sessSql .= ' AND ';
        }

        // Time filtration
        if (isset($params['sTimeH']) || isset($params['eTimeH']))
        {

            if (isset($params['sTimeH']) && isset($params['eTimeH']))
            {
                $start = $params['sTimeH'].':'.$params['sTimeM'].':00';
                $end = $params['eTimeH'].':'.$params['eTimeM'].':59';

                $sTime = new Zend_Date();
                $sTime->set($start, Zend_Date::TIMES);
                $eTime = new Zend_Date();
                $eTime->set($end, Zend_Date::TIMES);

                // "Midnight" sessions
                if ($sTime->isLater($eTime))
                {
                    // Assume input of 22:00-02:00
                    // Match sessions with START time that is >= to start time input OR <= end time input
                    // Matches [22:30-23:30, 22:30-01:30, 22:30-03:00] OR [00:30-01:30, 00:30-3:00]
                    $this->_sessSql .= ' ((TIME(s.start) >= TIME(\''.$start.'\') OR TIME(s.start) <= TIME(\''.$end.'\')) ';
                    // Match sessions with END time >= start time input or <= end time input
                    // Matches [20:00-23:30] OR [20:00-01:30]
                    $this->_sessSql .= ' OR (TIME(s.end) >= TIME(\''.$start.'\') OR TIME(s.end) <= TIME(\''.$end.'\')) ';
                    // Match sessions with START time < start time input AND END time > end time input, ONLY when the session spans different days
                    // Matches 20:00-03:00
                    // NOTE: Sessions that are longer than 24 hours are accounted for later in this script
                    $this->_sessSql .= ' OR (DATE(s.start) != DATE(s.end) AND TIME(s.start) <= TIME(\''.$start.'\') AND TIME(s.end) >= TIME(\''.$end.'\')) ';
                }
                else
                {
                    $this->_sessSql .= ' ((TIME(s.start) BETWEEN TIME(\''.$start.'\') AND TIME(\''.$end.'\') ';
                    $this->_sessSql .= ' OR TIME(s.end) BETWEEN TIME(\''.$start.'\') AND TIME(\''.$end.'\')) ';
                    $this->_sessSql .= ' OR (TIME(s.start) <= TIME(\''.$start.'\') AND TIME(s.end) >= TIME(\''.$end.'\')) ';
                    $this->_sessSql .= ' OR (DATE(s.start) != DATE(s.end) AND (TIME(s.start) <= TIME(\''.$start.'\') OR TIME(s.end) >= TIME(\''.$end.'\'))) ';
                }

            }
            else if (isset($params['sTimeH']))
            {
                $start = $params['sTimeH'].':'.$params['sTimeM'].':00';
                $this->_sessSql .= ' (TIME(s.start) BETWEEN TIME(\''.$start.'\') AND TIME(\'23:59:59\') ';
                $this->_sessSql .= ' OR TIME(s.end) BETWEEN TIME(\''.$start.'\') AND TIME(\'23:59:59\') ';
                $this->_sessSql .= ' OR (DATE(s.start) != DATE(s.end) AND (TIME(s.start) <= TIME(\''.$start.'\'))) ';
            }
            else if (isset($params['eTimeH']))
            {
                $end = $params['eTimeH'].':'.$params['eTimeM'].':59';
                $this->_sessSql .= ' (TIME(s.start) <= TIME(\''.$end.'\') ';

                if (isset($params['eDate']))
                {
                    $this->_sessSql .= ' OR ((TIME(s.end) <= TIME(\''.$end.'\') OR (DATE(s.start) != DATE(s.end))) AND DATE(s.end) <= DATE(\''.$params['eDate'].'\')) ';
                }
                else
                {
                    $this->_sessSql .= ' OR TIME(s.end) <= TIME(\''.$end.'\') OR DATE(s.start) != DATE(s.end) ';
                }
            }

            // If a session spans >= 24hr period then it qualifies for any time constraint
            $this->_sessSql .= ' OR (TIMEDIFF(s.end, s.start) >= TIME(\'24:00:00\'))) ';
        }


        // If a session encompasses the requested range in its entirety
        if (isset($params['sDate']) && isset($params['eDate']))
        {
            $this->_sessSql .= ' OR (DATE(s.start) < DATE(\''.$params['sDate'].'\') AND DATE(s.end) > DATE(\''.$params['eDate'].'\')) ';
        }

        $this->_sessSql .= ' ORDER BY s.start ASC, s.id ASC ';

        $sessQueryStmt = $this->_db->query($this->_sessSql);

        if ($sessQueryStmt->rowCount() > 0)
        {
            $this->_sessCount = $sessQueryStmt->rowCount();

            // Get total number of counts
            $this->_countsSql = 'SELECT COUNT(c.id)
                    FROM session s,
                    count c LEFT JOIN count_activity_join caj ON c.id = caj.fk_count
                    WHERE s.deleted = 0 AND c.fk_session = s.id AND s.fk_initiative = '.$this->_initId.' AND '
                    .' s.id IN (';

            $sessIds = '';
            while($row = $sessQueryStmt->fetch())
            {
                $sessIds .= $row['id'].', ';
            }
            $this->_countsSql .= substr($sessIds, 0, -2) . ') ';

            // FIXME: This is expensive, can we use just one or two queries?
            $this->_rowCount = $this->_db->fetchOne($this->_countsSql);

            if ($this->_rowCount > ($params['offset'] + $params['limit']))
            {
                $this->_hasMore = true;
            }
            else
            {
                $this->_hasMore = false;
            }

            // SQL to pull counts of returned session IDs
            $this->_countsSql = 'SELECT s.id as sid, s.start, s.end, c.id as cid, c.number as cnum, caj.fk_activity as act, c.fk_location as loc, c.occurrence as oc, s.fk_transaction as transId, t.start as transStart, t.end as transEnd
                    FROM (session s LEFT JOIN transaction t ON s.fk_transaction = t.id), count c
                    LEFT JOIN count_activity_join caj ON c.id = caj.fk_count
                    WHERE s.deleted = 0 AND c.fk_session = s.id AND s.fk_initiative = '.$this->_initId.' AND '
                    .' s.id IN (';

            $this->_countsSql .= substr($sessIds, 0, -2) . ') ';
            $this->_countsSql .= ' ORDER BY '.$this->_formats[$params['format']];
            $this->_countsSql .= ' LIMIT '.$params['offset'].', '.$params['limit'].' ';

            $this->_queryStmt = $this->_db->query($this->_countsSql);
        }
        else
        {
            $this->_rowCount = 0;
        }
    }


    public function byCounts($params)
    {
        $countSelect = 'SELECT COUNT(c.id) ';
        $dataSelect = 'SELECT s.id as sid, s.start, s.end, c.id as cid, c.number as cnum, caj.fk_activity as act, c.fk_location as loc, c.occurrence as oc ';

        $this->_countsSql = ' FROM session s,
                count c LEFT JOIN count_activity_join caj ON c.id = caj.fk_count
                WHERE s.deleted = 0 AND c.fk_session = s.id AND s.fk_initiative = '.$this->_initId.' ';

        // Date filtration
        if (isset($params['sDate']))
        {
            if (isset($params['eDate']))
            {
                $this->_countsSql .= ' AND (DATE(c.occurrence) BETWEEN DATE(\''.$params['sDate'].'\') AND DATE(\''.$params['eDate'].'\')) ';
            }
            else
            {
                $now = new Zend_Date();
                $this->_countsSql .= ' AND (DATE(c.occurrence) BETWEEN DATE(\''.$params['sDate'].'\') AND DATE(\''.$now->get(Zend_Date::ISO_8601).'\')) ';
            }
        }
        else if (isset($params['eDate']))
        {
            $this->_countsSql .= ' AND (DATE(c.occurrence) <= DATE(\''.$params['eDate'].'\')) ';
        }

        // Time filtration
        if (isset($params['sTimeH']))
        {
            $start = $params['sTimeH'].':'.$params['sTimeM'].':00';
            if (isset($params['eTimeH']))
            {
                $end = $params['eTimeH'].':'.$params['eTimeM'].':59';

                $sTime = new Zend_Date();
                $sTime->set($start, Zend_Date::TIMES);
                $eTime = new Zend_Date();
                $eTime->set($end, Zend_Date::TIMES);

                if ($sTime->isLater($eTime))
                {
                    $this->_countsSql .= ' AND (TIME(c.occurrence) >= TIME(\''.$start.'\') OR TIME(c.occurrence) <= TIME(\''.$end.'\')) ';
                }
                else
                {
                    $this->_countsSql .= ' AND (TIME(c.occurrence) BETWEEN TIME(\''.$start.'\') AND TIME(\''.$end.'\')) ';
                }
            }
            else
            {
                $this->_countsSql .= ' AND (TIME(c.occurrence) BETWEEN TIME(\''.$start.'\') AND TIME(\'23:59:59\')) ';
            }
        }
        else if (isset($params['eTimeH']))
        {
            $end = $params['eTimeH'].':'.$params['eTimeM'].':59';
            $this->_countsSql .= ' AND (TIME(c.occurrence) <= TIME(\''.$end.'\')) ';
        }

        // FIXME: This query is expensive...can we do all of this with a single query?
        $this->_rowCount = $this->_db->fetchOne($countSelect.$this->_countsSql);

        if ($this->_rowCount > ($params['offset'] + $params['limit']))
        {
            $this->_hasMore = true;
        }
        else
        {
            $this->_hasMore = false;
        }

        $this->_countsSql = $dataSelect.$this->_countsSql;
        $this->_countsSql .= ' ORDER BY '.$this->_formats[$params['format']];
        $this->_countsSql .= ' LIMIT '.$params['offset'].', '.$params['limit'].' ';

        $this->_queryStmt = $this->_db->query($this->_countsSql);
    }


    // ------ PRIVATE FUNCTIONS ------

    private function walkLocTree($parentId)
    {
        $select = $this->_db->select()
            ->from('location', array('id', 'title', 'fk_parent as parent', 'description', 'rank'))
            ->where('fk_parent = ' . $parentId)
            ->order('rank ASC');
        $nodes = $select->query()->fetchAll();

        foreach($nodes as $node)
        {
            // Cast numerical string(s) into type int
            foreach($node as $key => $val)
            {
                if (is_numeric($val))
                {
                    $node[$key] = (int)$val;
                }
            }

            $this->_initLocs[] = $node;
            $this->walkLocTree($node['id']);
        }
    }



    // ------ STATIC FUNCTIONS ------

    static function getInitiatives()
    {
        $db = Globals::getDBConn();
        $select = $db->select()
            ->from(array('i' => 'initiative'),
                   array('title', 'id', 'description', 'enabled', 'rootLocation' => 'fk_root_location'))
            ->join(array('s' => 'session'),
                         'i.id = s.fk_initiative', array())
            ->where('s.deleted = 0')
            ->group('i.id')
            ->order(array('i.title ASC'));
        $initiatives = $select->query()->fetchAll();

        // This block is to cast string id into an int
        $parentArray = array();
        foreach ($initiatives as $init)
        {
            $array = array();
            foreach ($init as $key => $val)
            {
                $array[$key] = ($key == 'id' || $key == 'enabled') ? (int)$val : $val;
            }

            $qModel = new QueryModel($array['id']);
            $array['dictionary']['locations'] = $qModel->getInitLocs();
            $array['dictionary']['activities'] = $qModel->getInitActs();
            $array['dictionary']['activityGroups'] = $qModel->getInitActGroups();
            $parentArray[] = $array;
        }

        return $parentArray;
    }

}

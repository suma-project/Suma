<?php 

class QueryModel
{
    private $_db;
    private $_sessSql;
    private $_countsSql;
    private $_sessCount;
    private $_rowCount;
    private $_queryStmt;
    private $_initLocs = array();
    private $_initActs = array();
    private $_initId;
    private $_initMetadata = array();
    private $_formats = array('alc' => ' caj.fk_activity ASC, c.fk_location ASC, c.id ASC ', 
                              'lac' => ' c.fk_location ASC, caj.fk_activity ASC, c.id ASC ',
                              'lca' => ' c.fk_location ASC, c.id ASC, caj.fk_activity ASC ', 
                              'cal' => ' c.id ASC, caj.fk_activity ASC, c.fk_location ASC ', 
                              'cla' => ' c.id ASC, c.fk_location ASC, caj.fk_activity ASC ', 
                              'ac'  => ' caj.fk_activity ASC, c.id ASC ', 
                              'lc'  => ' c.fk_location ASC, c.id ASC ');
    
    public function __construct($initId)
    {   
        $this->_db = Globals::getDBConn();
        $this->_initId = $initId;
        $select = $this->_db->select()
            ->from('initiative')
            ->where('id = '.$this->_initId);
        $metadata = $select->query()->fetch();
        
        if (! empty($metadata))
        {
            $this->_initMetadata = $metadata;
        }
        else
        {
            throw new Exception('Initiative does not exist');
        }
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
        return $this->_queryStmt->fetch();
    }
    
    public function getInitMetadata()
    {
        return $this->_initMetadata;      
    }
    
    public function getInitLocs()
    {
        if (empty($this->_initLocs))
        {
            $this->walkLocTree($this->_initMetadata['fk_root_location']);
        }
        return $this->_initLocs;
    }
    
    public function getInitActs()
    {
        if (empty($this->_initActs))
        {
            $select = $this->_db->select()
                ->from('activity')
                ->where('enabled = true AND fk_initiative = ' . $this->_initId)
                ->order('rank ASC');
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
        }
        
        return $this->_initActs;
    }
    
    public function bySessions($params)
    {
        // SQL to pull valid sessions
        $this->_sessSql = 'SELECT s.id FROM session s WHERE s.fk_initiative = ' . $this->_initId . ' ';
        
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
                
                if ($sTime->isLater($eTime))
                {
                    $this->_sessSql .= ' ((TIME(s.start) >= TIME(\''.$start.'\') OR TIME(s.start) <= TIME(\''.$end.'\')) ';
                    $this->_sessSql .= ' OR (TIME(s.end) >= TIME(\''.$start.'\') OR TIME(s.end) <= TIME(\''.$end.'\')) ';
                }
                else
                {
                    $this->_sessSql .= ' ((TIME(s.start) BETWEEN TIME(\''.$start.'\') AND TIME(\''.$end.'\') ';
                    $this->_sessSql .= ' OR TIME(s.end) BETWEEN TIME(\''.$start.'\') AND TIME(\''.$end.'\')) ';
                }
                
            }
            else if (isset($params['sTimeH']))
            {
                $this->_sessSql .= ' (TIME(s.start) BETWEEN TIME(\''.$start.'\') AND TIME(\'23:59:59\') ';
                $this->_sessSql .= ' OR TIME(s.end) BETWEEN TIME(\''.$start.'\') AND TIME(\'23:59:59\') ';
            }
            else if (isset($params['eTimeH']))
            {
                $end = $params['eTimeH'].':'.$params['eTimeM'].':59';
                $this->_sessSql .= ' (TIME(s.start) <= TIME(\''.$end.'\') ';
                $this->_sessSql .= ' OR TIME(s.end) <= TIME(\''.$end.'\') ';
            }
            
            // If a session spans >= 24hr period then it qualifies for any time constraint
            $this->_sessSql .= ' OR (TIMEDIFF(s.end, s.start) >= TIME(\'24:00:00\'))) ';
        }


        // If a session encompasses the requested range in its entirety
        if (isset($params['sDate']) && isset($params['eDate']))
        {
            $this->_sessSql .= ' OR (DATE(s.start) < DATE(\''.$params['sDate'].'\') AND DATE(s.end) > DATE(\''.$params['eDate'].'\')) ';
        }

        $this->_sessSql .= ' ORDER BY s.id ASC ';

        $sessQueryStmt = $this->_db->query($this->_sessSql);
        $this->_queryStmt = $sessQueryStmt; // This line is a hack, but it fixes a non-object error.

        if ($sessQueryStmt->rowCount() > 0)
        {
            $this->_sessCount = $sessQueryStmt->rowCount();
            
            // SQL to pull query data
            $this->_countsSql = 'SELECT s.id as sid, s.start, s.end, c.id as cid, c.number as cnum, caj.fk_activity as act, c.fk_location as loc, c.occurrence as oc 
                    FROM session s, 
                    count c LEFT JOIN count_activity_join caj ON c.id = caj.fk_count 
                    WHERE s.deleted = false AND c.fk_session = s.id AND s.fk_initiative = '.$this->_initId.' AND '
                    .' s.id IN (';
    
            while($row = $sessQueryStmt->fetch())
            {
                $this->_countsSql .= $row['id'].', '; 
            }
            
            $this->_countsSql = substr($this->_countsSql, 0, -2) . ') ';
            $this->_countsSql .= ' ORDER BY '.$this->_formats[$params['format']];
            
            $this->_queryStmt = $this->_db->query($this->_countsSql);
        }
        
        $this->_rowCount = $this->_queryStmt->rowCount();
    }
    
    
    public function byCounts($params)
    {
        $this->_countsSql = 'SELECT s.id as sid, s.start, s.end, c.id as cid, c.number as cnum, caj.fk_activity as act, c.fk_location as loc, c.occurrence as oc 
                FROM session s, 
                count c LEFT JOIN count_activity_join caj ON c.id = caj.fk_count 
                WHERE s.deleted = false AND c.fk_session = s.id AND s.fk_initiative = '.$this->_initId.' ';
        
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
            $this->_countsSql .= ' AND (DATE(c.occurrence) < DATE(\''.$params['eDate'].'\')) ';
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
        
        $this->_countsSql .= ' ORDER BY '.$this->_formats[$params['format']];
        

        $this->_queryStmt = $this->_db->query($this->_countsSql);
        $this->_rowCount = $this->_queryStmt->rowCount();
    }
    
    
    // ------ PRIVATE FUNCTIONS ------
    
    private function walkLocTree($parentId)
    {
        $select = $this->_db->select()
            ->from('location')
            ->where('enabled = true AND fk_parent = ' . $parentId)
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
                   array('id', 'title', 'description'))
            ->join(array('s' => 'session'),
                         'i.id = s.fk_initiative',
                   array())
            ->where('s.deleted = false')
            ->group('i.id')
            ->order(array('i.title ASC'));
        $initiatives = $select->query()->fetchAll();
        
        return $initiatives;
    }
    
}

<?php 

require_once 'models/InitiativeModel.php';

class SessionModel
{
    private $_db;
    private $_metadata;
    private $_initiative;
    
    public function __construct($id)
    {  
        $this->_db = Globals::getDBConn();
        $select = $this->_db->select()
            ->from('session')
            ->where('id = '.$id);
        $row = $select->query()->fetch();
        
        if (empty($row))
        {
            throw new Exception('Object not found in database with id ' . $id);
        }
        
        foreach ($row as $key => $value)
        {
            $this->_metadata[$key] = $value;
        }
    }

    public function getInitiative()
    {
        if (isset($this->_initiative) && ! empty($this->_initiative))
        {
            return $this->_initiative;
        }
        else if (isset($this->_metadata['fk_initiative']))
        {
            $this->_initiative = new InitiativeModel($this->_metadata['fk_initiative']);
            return $this->_initiative;
        }        
    }
    
    public function getMetadata($key = null)
    {
        if ($key == null)
        {
            return $this->_metadata;
        }
        else 
        {
            if (isset($this->_metadata[$key]))
            {
                return $this->_metadata[$key];
            }
            else
            {
                return '';
            }
        }
    }    
    
    // ------ STATIC FUNCTIONS ------
    
    public static function getAll($unFiltered = true)
    {
        $db = Globals::getDBConn();
        $select = $db->select()
            ->from('session')
            ->order('id DESC');
            if ($unFiltered == false)
            {
                $select->where('deleted != true');
            }
            
        $rows = $select->query()->fetchAll();
        
        $sessions = array();
        foreach($rows as $row)
        {
            $sessions[] = new SessionModel($row['id']);
        }
        
        return $sessions;
    }
    
    // ------ MISC ------
    
    public function getCounts()
    {
        $select = $this->_db->select()
            ->from('count')
            ->where('fk_session = '.$this->_metadata['id']);
        return $select->query()->fetchAll();
    }
    
    public function getCountTotal()
    {
        $select = $this->_db->select()
            ->from('count', 'SUM(number)')
            ->where('fk_session = '.$this->_metadata['id']);
        $row = $select->query()->fetch(Zend_Db::FETCH_NUM);
        return $row[0];
    }    
    
    public function getCountsByLoc($locId)
    {
        if (is_numeric($locId))
        {
            $select = $this->_db->select()
                ->from('count')
                ->where('fk_session = '.$this->_metadata['id'].' AND fk_location = '.$locId);
            return $select->query()->fetchAll();
        }
    }

    public function getCountTotalByLoc($locId)
    {
        if (is_numeric($locId))
        {
            $select = $this->_db->select()
                ->from('count', 'SUM(number)')
                ->where('fk_session = '.$this->_metadata['id'].' AND fk_location = '.$locId);
            $row = $select->query()->fetch(Zend_Db::FETCH_NUM);
            return $row[0];
        }
    }    
    
    public function getJoinByCntId($cntId)
    {
        if (is_numeric($cntId))
        {
            $select = $this->_db->select()
                ->from('count_activity_join')
                ->where('fk_count = '.$cntId);
            return $select->query()->fetchAll();
        }
    }
    
    public function getTransById($transId)
    {
        if (is_numeric($transId))
        {
            $select = $this->_db->select()
                ->from('transaction')
                ->where('id = '.$transId);            
            return $select->query()->fetch();
        }
    }    
    
}

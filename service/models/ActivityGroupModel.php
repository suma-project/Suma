<?php 

class ActivityGroupModel
{
    private $_db;
    private $_metadata;
    private $_id;
    
    public function __construct($id)
    {
        $this->_db = Globals::getDBConn();
        $select = $this->_db->select()
            ->from('activity_group')
            ->where('id = '.$id);
        $row = $select->query()->fetch();

        if (empty($row))
        {
            Globals::getLog()->err('NONEXISTENT ACTIVITY GROUP - ActivityGroupModel id: '.$id);
            throw new Exception('Activity Group object not found in database with id ' . $id);
        }

        foreach ($row as $key => $value)
        {
            $this->_metadata[$key] = $value;
        }
        
        $this->_id = $id;
    }

    public function getMetadata($key = null)
    {
        if (empty($this->_metadata))
        {
            $select = $this->_db->select()
                ->from('activity_group')
                ->where('id = '.$this->_id);
            $row = $select->query()->fetch();
            
            foreach ($row as $index => $val)
            {
                $this->_metadata[$index] = $val;
            }
        }
        
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
    
    //TODO: UPDATE & CREATE functions
    
}

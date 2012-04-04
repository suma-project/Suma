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
    
    public function update($data)
    {
        $hash = array('title'        =>  $data['title'],
                      'rank'         =>  $data['rank'],
                      'description'  =>  $data['descr'],
                      'required'     =>  $data['required']);

        $this->_db->update('activity_group', $hash, 'id = '.$this->_id);
        Globals::getLog()->info('ACTIVITY GROUP UPDATED - id: '.$this->_id.', title: '.$data['title']);
        $this->jettisonMetadata();
    }

    
    // ------ PRIVATE FUNCTIONS ------        
    
    
    private function jettisonMetadata()
    {
        $this->_metadata = null;
    }
    
    
    // ------ STATIC FUNCTIONS ------
    
    
    public static function create($data)
    {
        $db = Globals::getDBConn();

        $hash = array('title'        =>  $data['title'],
                      'rank'         =>  isset($data['rank']) ? $data['rank'] : 1,
                      'description'  =>  isset($data['descr']) ? $data['descr'] : null,
                      'required'     =>  isset($data['required']) ? $data['required'] : false);

        $db->insert('activity_group', $hash);
        $actGrpId = $db->lastInsertId();
        Globals::getLog()->info('ACTIVITY GROUP CREATED - id: '.$actGrpId.', title: '.$data['title']);
        
        return $actGrpId;
    }
    
}
